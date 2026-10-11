import { describe, expect, it } from 'vitest';
import { parseCriteriaTree } from './criteria-tree-parser';
import { RawCriteriaNode } from './role-membership.types';

describe('parseCriteriaTree', () => {
  it('parses a simple leaf node', () => {
    const raw: RawCriteriaNode = {
      operation: 'EQUALS',
      key: {
        type: 'IDENTITY',
        property: 'department',
      },
      stringValue: 'Finance',
    };

    const warnings: string[] = [];
    const { tree, leaves } = parseCriteriaTree(raw, warnings);

    expect(warnings).toEqual([]);
    expect(tree.kind).toBe('leaf');
    expect(leaves.length).toBe(1);
    expect(leaves[0]).toEqual({
      path: '0',
      keyType: 'IDENTITY',
      property: 'department',
      sourceId: null,
      operation: 'EQUALS',
      value: 'Finance',
    });
  });

  it('parses a branch with AND operation and nested leaves', () => {
    const raw: RawCriteriaNode = {
      operation: 'AND',
      children: [
        {
          operation: 'EQUALS',
          key: { type: 'IDENTITY', property: 'cloudLifecycleState' },
          stringValue: 'active',
        },
        {
          operation: 'CONTAINS',
          key: { type: 'IDENTITY', property: 'jobTitle' },
          stringValue: 'Analyst',
        },
      ],
    };

    const warnings: string[] = [];
    const { tree, leaves } = parseCriteriaTree(raw, warnings);

    expect(warnings).toEqual([]);
    expect(tree.kind).toBe('branch');
    if (tree.kind === 'branch') {
      expect(tree.operation).toBe('AND');
      expect(tree.children.length).toBe(2);
    }
    expect(leaves.length).toBe(2);
    expect(leaves[0].property).toBe('cloudLifecycleState');
    expect(leaves[1].property).toBe('jobTitle');
  });

  it('expands multi-value criteria into an OR branch', () => {
    const raw: RawCriteriaNode = {
      operation: 'EQUALS',
      key: { type: 'IDENTITY', property: 'location' },
      values: ['London', 'Singapore'],
    };

    const warnings: string[] = [];
    const { tree, leaves } = parseCriteriaTree(raw, warnings);

    expect(warnings).toEqual([]);
    expect(tree.kind).toBe('branch');
    if (tree.kind === 'branch') {
      expect(tree.operation).toBe('OR');
      expect(tree.children.length).toBe(2);
    }
    expect(leaves.length).toBe(2);
    expect(leaves[0].value).toBe('London');
    expect(leaves[1].value).toBe('Singapore');
  });

  it('collects warnings when an ACCOUNT leaf is missing sourceId', () => {
    const raw: RawCriteriaNode = {
      operation: 'EQUALS',
      key: { type: 'ACCOUNT', property: 'attribute.status' },
      stringValue: 'active',
    };

    const warnings: string[] = [];
    parseCriteriaTree(raw, warnings);

    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain('has key.type=ACCOUNT but no sourceId');
  });
});
