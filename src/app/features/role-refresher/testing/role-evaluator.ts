import { parseCriteriaTree } from '../criteria-tree-parser';
import { accountAttributeKey, accountMatchesCondition } from '../leaf-resolver';
import { CriteriaTreeNode, LeafCondition, RoleMembership } from '../role-membership.types';
import { MockIdentity } from './mock-identities.fixture';

export interface RoleEvaluationResult {
  roleId: string;
  roleName: string;
  matchedUserIds: string[];
  gainUserIds: string[];
  loseUserIds: string[];
  retainedUserIds: string[];
  warnings: string[];
}

/**
 * Evaluates an entire SailPoint ISC Role JSON against an in-memory identity population.
 * Tests criteria trees purely and computes the resulting delta against assigned users.
 */
export function evaluateRoleDefinition(
  roleJson: any,
  identities: MockIdentity[],
  currentlyAssignedUserIds: string[] = []
): RoleEvaluationResult {
  const roleId = roleJson.id || 'test-role';
  const roleName = roleJson.name || 'Unnamed Role';
  const membership: RoleMembership = roleJson.membership || { type: 'STANDARD' };
  const warnings: string[] = [];

  let matchedUserIds: string[] = [];

  if (membership.type === 'IDENTITY_LIST') {
    // Static membership
    const staticIds = new Set((membership.identities ?? []).map((i) => i.id));
    matchedUserIds = identities
      .filter((identity) => staticIds.has(identity.id))
      .map((i) => i.id);
  } else if (membership.type === 'STANDARD') {
    if (membership.criteria) {
      const { tree } = parseCriteriaTree(membership.criteria, warnings);
      matchedUserIds = identities
        .filter((identity) => evaluateCriteriaNode(tree, identity))
        .map((i) => i.id);
    } else {
      warnings.push('STANDARD membership has null or empty criteria');
    }
  }

  const assignedSet = new Set(currentlyAssignedUserIds);
  const matchedSet = new Set(matchedUserIds);

  const gainUserIds = matchedUserIds.filter((id) => !assignedSet.has(id));
  const loseUserIds = currentlyAssignedUserIds.filter((id) => !matchedSet.has(id));
  const retainedUserIds = matchedUserIds.filter((id) => assignedSet.has(id));

  return {
    roleId,
    roleName,
    matchedUserIds,
    gainUserIds,
    loseUserIds,
    retainedUserIds,
    warnings,
  };
}

/**
 * Evaluates a normalized AST node (branch or leaf) against a specific identity.
 */
function evaluateCriteriaNode(node: CriteriaTreeNode, identity: MockIdentity): boolean {
  if (node.kind === 'leaf') {
    return evaluateLeaf(node.condition, identity);
  }

  if (node.operation === 'AND') {
    return node.children.every((child) => evaluateCriteriaNode(child, identity));
  }

  if (node.operation === 'OR') {
    return node.children.some((child) => evaluateCriteriaNode(child, identity));
  }

  return false;
}

/**
 * Evaluates an individual leaf condition (IDENTITY, ACCOUNT, or ENTITLEMENT)
 */
function evaluateLeaf(condition: LeafCondition, identity: MockIdentity): boolean {
  switch (condition.keyType) {
    case 'IDENTITY': {
      const prop = condition.property
        .replace(/^attributes?\./i, '')
        .replace(/^attribute\./i, '');

      // Check standard fields first, then attributes dictionary
      let rawVal = (identity as any)[prop];
      if (rawVal == null && identity.attributes) {
        rawVal = identity.attributes[prop];
      }
      if (rawVal == null) return false;

      const actual = String(rawVal).toLowerCase();
      const expected = String(condition.value).toLowerCase();

      switch (condition.operation) {
        case 'EQUALS':
          return actual === expected;
        case 'NOT_EQUALS':
          return actual !== expected;
        case 'CONTAINS':
          return actual.includes(expected);
        case 'STARTS_WITH':
          return actual.startsWith(expected);
        case 'ENDS_WITH':
          return actual.endsWith(expected);
        default:
          return false;
      }
    }

    case 'ACCOUNT': {
      if (!identity.accounts || identity.accounts.length === 0) return false;
      const relevantAccounts = identity.accounts.filter(
        (a) => !condition.sourceId || a.sourceId === condition.sourceId
      );
      return relevantAccounts.some((account) => accountMatchesCondition(account, condition));
    }

    case 'ENTITLEMENT': {
      if (!identity.accounts || identity.accounts.length === 0) return false;
      const attrName = accountAttributeKey(condition.property).toLowerCase();
      const targetVal = condition.value.toLowerCase();

      return identity.accounts.some((account) => {
        if (condition.sourceId && account.sourceId !== condition.sourceId) {
          return false;
        }
        if (!account.entitlements) return false;
        return account.entitlements.some(
          (ent) => ent.attribute.toLowerCase() === attrName && ent.value.toLowerCase() === targetVal
        );
      });
    }

    default:
      return false;
  }
}
