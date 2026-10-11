import {
  CriteriaTreeNode,
  LeafCondition,
  LeafOperation,
  RawCriteriaNode,
} from './role-membership.types';

const BRANCH_OPS = new Set(['AND', 'OR']);
const LEAF_OPS = new Set(['EQUALS', 'NOT_EQUALS', 'CONTAINS', 'DOES_NOT_CONTAIN', 'STARTS_WITH', 'ENDS_WITH']);

/**
 * Recursively parses a raw ISC criteria node into:
 *  - a normalized tree (`CriteriaTreeNode`) that mirrors AND/OR/leaf structure
 *  - a flat list of leaf conditions (post-order collection) for easy iteration
 *
 * Validates the two structural invariants the API documents:
 *  - leaf nodes require `key` + `stringValue`, no `children`
 *  - branch nodes require `children`, no `stringValue`
 * Violations are collected as warnings rather than thrown, so callers can
 * decide how strict to be against real-world (possibly legacy) role data.
 */
export function parseCriteriaTree(
  node: RawCriteriaNode,
  warnings: string[],
  path = '0',
): { tree: CriteriaTreeNode; leaves: LeafCondition[] } {
  const leaves: LeafCondition[] = [];

  function walk(n: RawCriteriaNode, p: string): CriteriaTreeNode {
    const op = (n.operation || '').toUpperCase();

    if (BRANCH_OPS.has(op)) {
      if (!n.children || n.children.length === 0) {
        warnings.push(`Branch node at path ${p} (${n.operation}) has no children.`);
      }
      if (n.stringValue != null || (n.values != null && n.values.length > 0)) {
        warnings.push(`Branch node at path ${p} (${n.operation}) unexpectedly has a value; ignoring it.`);
      }
      const children = (n.children ?? []).map((child, i) => walk(child, `${p}.${i}`));
      return {
        kind: 'branch',
        operation: op as 'AND' | 'OR',
        path: p,
        children,
      };
    }

    if (LEAF_OPS.has(op)) {
      if (n.children && n.children.length > 0) {
        warnings.push(`Leaf node at path ${p} (${n.operation}) unexpectedly has children; ignoring them.`);
      }
      if (!n.key) {
        warnings.push(`Leaf node at path ${p} (${n.operation}) is missing a key; skipping.`);
        return { kind: 'leaf', path: p, condition: emptyCondition(p, op as LeafOperation) };
      }

      // Collect all values if values: [...] has multiple items (e.g. "Singapore" OR "London")
      const valuesList: string[] = (n.values && n.values.length > 0)
        ? n.values
        : (n.stringValue != null ? [n.stringValue] : []);

      if (valuesList.length === 0) {
        warnings.push(`Leaf node at path ${p} (${op}) is missing both stringValue and values.`);
      }
      if ((n.key.type === 'ACCOUNT' || n.key.type === 'ENTITLEMENT') && !n.key.sourceId) {
        warnings.push(
          `Leaf node at path ${p} has key.type=${n.key.type} but no sourceId; the generated query will be incomplete.`,
        );
      }

      // If multiple values exist (e.g. "Singapore OR London"), expand into an OR/AND branch
      // so all values are evaluated and queried properly.
      if (valuesList.length > 1) {
        const branchOp = op === 'NOT_EQUALS' ? 'AND' : 'OR';
        const children: CriteriaTreeNode[] = valuesList.map((val, idx) => {
          const condition: LeafCondition = {
            path: `${p}.${idx}`,
            keyType: n.key!.type,
            property: n.key!.property,
            sourceId: n.key!.sourceId ?? null,
            operation: op as LeafOperation,
            value: val,
          };
          leaves.push(condition);
          return { kind: 'leaf', path: `${p}.${idx}`, condition };
        });
        return {
          kind: 'branch',
          operation: branchOp,
          path: p,
          children,
        };
      }

      const condition: LeafCondition = {
        path: p,
        keyType: n.key.type,
        property: n.key.property,
        sourceId: n.key.sourceId ?? null,
        operation: op as LeafOperation,
        value: valuesList[0] ?? '',
      };
      leaves.push(condition);
      return { kind: 'leaf', path: p, condition };
    }

    warnings.push(`Unknown operation "${n.operation}" at path ${p}; treating as a leaf with no-op condition.`);
    const condition = emptyCondition(p, 'EQUALS');
    leaves.push(condition);
    return { kind: 'leaf', path: p, condition };
  }

  const tree = walk(node, path);
  return { tree, leaves };
}

function emptyCondition(path: string, operation: LeafOperation): LeafCondition {
  return { path, keyType: 'IDENTITY', property: '', operation, value: '' };
}
