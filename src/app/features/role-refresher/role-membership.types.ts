/**
 * Types mirroring the SailPoint ISC Role `membership` schema
 * (see POST /roles/v1 (createRole) -> requestBody.membership in the OpenAPI spec).
 */

/** Top-level discriminator for how a Role's membership is defined. */
export type MembershipType = 'STANDARD' | 'IDENTITY_LIST';

/** Leaf comparison operations. */
export type LeafOperation = 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'DOES_NOT_CONTAIN' | 'STARTS_WITH' | 'ENDS_WITH';

/** Branch (logical) operations. AND nodes may only contain OR children and vice-versa. */
export type BranchOperation = 'AND' | 'OR';

export type CriteriaOperation = LeafOperation | BranchOperation;

/** What kind of attribute a leaf criterion is testing. */
export type CriteriaKeyType = 'IDENTITY' | 'ACCOUNT' | 'ENTITLEMENT';

export interface CriteriaKey {
  type: CriteriaKeyType;
  /** Attribute/entitlement name, e.g. "attribute.email" or "department". */
  property: string;
  /** Required when type is ACCOUNT or ENTITLEMENT. */
  sourceId?: string | null;
}

/**
 * Raw criteria node as returned/accepted by the ISC API. Recursive;
 * max 3 levels deep including leaves.
 */
export interface RawCriteriaNode {
  operation: CriteriaOperation;
  key?: CriteriaKey | null;
  /** Documented field name for a leaf's comparison value. */
  stringValue?: string | null;
  /**
   * Field name actually observed in live tenant responses for a leaf's
   * comparison value (an array, first element used). Not documented in the
   * resolved OpenAPI spec as of this writing, but present in production data —
   * prefer this over `stringValue` when both are absent/present ambiguity arises.
   */
  values?: string[] | null;
  children?: RawCriteriaNode[] | null;
}

/** Reference to an Identity used in IDENTITY_LIST membership. */
export interface IdentityRef {
  type?: string | null;
  id: string;
  name?: string | null;
  aliasName?: string | null;
}

/** The `membership` object on a Role. */
export interface RoleMembership {
  type: MembershipType;
  criteria?: RawCriteriaNode | null;
  identities?: IdentityRef[] | null;
}

// ---------------------------------------------------------------------------
// Normalized tree types produced by the parser
// ---------------------------------------------------------------------------

/** A single leaf condition, flattened out of the criteria tree. */
export interface LeafCondition {
  /** Stable path to this node in the tree, e.g. "0.1" (first child, second grandchild). */
  path: string;
  keyType: CriteriaKeyType;
  property: string;
  sourceId?: string | null;
  operation: LeafOperation;
  value: string;
}

/** Normalized tree node — either a branch (AND/OR) or a leaf. */
export type CriteriaTreeNode =
  | { kind: 'branch'; operation: BranchOperation; path: string; children: CriteriaTreeNode[] }
  | { kind: 'leaf'; path: string; condition: LeafCondition };
