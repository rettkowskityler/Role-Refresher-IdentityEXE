import { LeafCondition, LeafOperation } from './role-membership.types';

/** Escapes characters that are special in ISC's filter query language. */
function escapeFilterValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/** Escapes characters that are special in Elasticsearch query-string syntax. */
function escapeEsValue(value: string): string {
  return value.replace(/(["\\])/g, '\\$1');
}

/** Maps a leaf operation + field/value to an Elasticsearch query-string fragment. */
export function toEsClause(field: string, operation: LeafOperation, value: string): string {
  const v = escapeEsValue(value);
  switch (operation) {
    case 'EQUALS':
      return `${field}:"${v}"`;
    case 'NOT_EQUALS':
      return `NOT ${field}:"${v}"`;
    case 'CONTAINS':
      return `${field}:*${v}*`;
    case 'DOES_NOT_CONTAIN':
      return `NOT ${field}:*${v}*`;
    case 'STARTS_WITH':
      return `${field}:${v}*`;
    case 'ENDS_WITH':
      return `${field}:*${v}`;
    default:
      return `${field}:"${v}"`;
  }
}

/**
 * Normalizes an identity attribute property name to its Elasticsearch field path.
 * Standard top-level identity fields (name, email, etc.) have no prefix; custom
 * identity attributes live under `attributes.*`.
 */
export function identityEsField(property: string): string {
  const stripped = property.replace(/^attributes?\./i, '');
  const topLevelFields = new Set(['id', 'name', 'email', 'firstname', 'lastname', 'displayName']);
  if (topLevelFields.has(stripped.toLowerCase())) {
    return stripped.toLowerCase();
  }
  return stripped.toLowerCase().startsWith('attributes.') ? stripped : `attributes.${stripped}`;
}

/** Builds the Elasticsearch query-string clause for an IDENTITY leaf condition. */
export function buildIdentityEsQuery(condition: LeafCondition): string {
  const field = identityEsField(condition.property);
  return toEsClause(field, condition.operation, condition.value);
}

/**
 * Normalizes an account attribute property name for client-side matching
 * against an account object's `attributes` map (strips the `attribute.`
 * prefix used in ISC role criteria; `/accounts/v1`'s `attributes` field is a
 * plain object keyed by the unprefixed name).
 */
export function accountAttributeKey(property: string): string {
  return property.replace(/^attribute\./, '');
}

/**
 * Builds the /accounts/v1 `filters` query-param value for an ACCOUNT leaf
 * condition, scoped to the leaf's sourceId only.
 *
 * Confirmed against a live tenant: `/accounts/v1`'s `filters` only supports a
 * fixed whitelist of fields (id, identityId, name, nativeIdentity,
 * hasEntitlements, sourceId, uncorrelated, entitlements, origin,
 * manuallyCorrelated, identity.name, identity.correlated,
 * identity.identityState, source.displayableName) — arbitrary custom account
 * attributes (e.g. `attributes.team`) are rejected with a 400 "not queryable"
 * error. There is no server-side way to filter accounts by a custom attribute
 * value, so this only narrows to the source; the actual attribute/value test
 * must be applied client-side against each returned account's `attributes` map
 * (see `accountMatchesCondition`).
 */
export function buildAccountFilters(condition: LeafCondition, warnings: string[]): string {
  if (!condition.sourceId) {
    warnings.push(`ACCOUNT leaf at path ${condition.path} has no sourceId; the generated filter will not be scoped to a source.`);
    return '';
  }
  return `sourceId eq "${escapeFilterValue(condition.sourceId)}"`;
}

/**
 * Client-side test of an ACCOUNT leaf condition against a single account
 * object's `attributes` map, since /accounts/v1 cannot filter on arbitrary
 * custom account attributes server-side.
 */
export function accountMatchesCondition(
  account: { attributes?: Record<string, unknown> | null },
  condition: LeafCondition,
): boolean {
  const key = accountAttributeKey(condition.property);
  const raw = account.attributes?.[key];
  if (raw == null) {
    return condition.operation === 'NOT_EQUALS' || condition.operation === 'DOES_NOT_CONTAIN';
  }
  const actual = String(raw).toLowerCase();
  const expected = (condition.value ?? '').toLowerCase();
  switch (condition.operation) {
    case 'EQUALS':
      return actual === expected;
    case 'NOT_EQUALS':
      return actual !== expected;
    case 'CONTAINS':
      return actual.includes(expected);
    case 'DOES_NOT_CONTAIN':
      return !actual.includes(expected);
    case 'STARTS_WITH':
      return actual.startsWith(expected);
    case 'ENDS_WITH':
      return actual.endsWith(expected);
    default:
      return false;
  }
}

/**
 * Builds a single `@access(...)` nested-query clause that matches an ENTITLEMENT
 * leaf directly against the `identities` search index — no separate entitlement-ID
 * lookup required. All sub-fields describing *one* entitlement (type, source,
 * attribute, value) are combined inside one `@access(...)` block, which is required
 * for correct nested-query matching: multiple separate `@access(...)` clauses are
 * each matched independently against *any* access item on the identity, so they
 * would not guarantee all conditions apply to the *same* entitlement.
 */
export function buildEntitlementAccessClause(condition: LeafCondition, warnings: string[]): string {
  if (!condition.sourceId) {
    warnings.push(`ENTITLEMENT leaf at path ${condition.path} has no sourceId; the generated clause will not be scoped to a source.`);
  }
  if (condition.operation !== 'EQUALS') {
    warnings.push(
      `ENTITLEMENT leaf at path ${condition.path} uses operation ${condition.operation}; entitlement membership is normally tested with EQUALS. Proceeding with a best-effort clause.`,
    );
  }
  const innerClauses = ['type:ENTITLEMENT'];
  if (condition.sourceId) {
    innerClauses.push(`source.id:"${escapeEsValue(condition.sourceId)}"`);
  }
  // Entitlement attribute names in ISC role criteria are stored with an
  // `attribute.` prefix (e.g. `attribute.memberOf`), but the real entitlement
  // document's `attribute` field — and the `@access(attribute:...)` nested
  // field — use the unprefixed name (`memberOf`). Confirmed against a live
  // tenant: searching with the prefix intact never matches any entitlement.
  const attributeName = accountAttributeKey(condition.property);
  innerClauses.push(`attribute:"${escapeEsValue(attributeName)}"`);
  innerClauses.push(toEsClause('value', condition.operation, condition.value));
  return `@access(${innerClauses.join(' AND ')})`;
}

/**
 * Combines multiple already-built Elasticsearch query-string clauses (one per
 * IDENTITY or ENTITLEMENT leaf) into a single query string, parenthesizing each
 * clause so the branch operator applies to the clause as a whole.
 */
export function combineEsClauses(clauses: string[], operator: 'AND' | 'OR'): string {
  if (clauses.length === 1) {
    return clauses[0];
  }
  return clauses.map((clause) => `(${clause})`).join(` ${operator} `);
}
