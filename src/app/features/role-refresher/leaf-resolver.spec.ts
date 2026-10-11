import { describe, expect, it } from 'vitest';
import {
  accountMatchesCondition,
  buildAccountFilters,
  buildEntitlementAccessClause,
  buildIdentityEsQuery,
  combineEsClauses,
  toEsClause,
} from './leaf-resolver';
import { LeafCondition } from './role-membership.types';

describe('leaf-resolver', () => {
  describe('toEsClause', () => {
    it('creates an exact EQUALS query with quotes', () => {
      expect(toEsClause('attributes.department', 'EQUALS', 'Engineering')).toBe(
        'attributes.department:"Engineering"'
      );
    });

    it('creates a NOT_EQUALS query', () => {
      expect(toEsClause('status', 'NOT_EQUALS', 'terminated')).toBe('NOT status:"terminated"');
    });

    it('creates wildcards for CONTAINS, STARTS_WITH, ENDS_WITH', () => {
      expect(toEsClause('title', 'CONTAINS', 'Director')).toBe('title:*Director*');
      expect(toEsClause('title', 'STARTS_WITH', 'Senior')).toBe('title:Senior*');
      expect(toEsClause('title', 'ENDS_WITH', 'Lead')).toBe('title:*Lead');
    });
  });

  describe('buildIdentityEsQuery', () => {
    it('prefixes custom identity attributes with attributes.', () => {
      const condition: LeafCondition = {
        path: '0',
        keyType: 'IDENTITY',
        property: 'costCenter',
        sourceId: null,
        operation: 'EQUALS',
        value: 'CC-100',
      };
      expect(buildIdentityEsQuery(condition)).toBe('attributes.costCenter:"CC-100"');
    });

    it('does not prefix top-level identity fields', () => {
      const condition: LeafCondition = {
        path: '0',
        keyType: 'IDENTITY',
        property: 'email',
        sourceId: null,
        operation: 'ENDS_WITH',
        value: '@example.com',
      };
      expect(buildIdentityEsQuery(condition)).toBe('email:*@example.com');
    });
  });

  describe('buildEntitlementAccessClause', () => {
    it('builds a single nested @access clause with source and attribute', () => {
      const condition: LeafCondition = {
        path: '0',
        keyType: 'ENTITLEMENT',
        property: 'attribute.memberOf',
        sourceId: 'src-12345',
        operation: 'EQUALS',
        value: 'CN=Admins,OU=Groups,DC=domain,DC=com',
      };
      const warnings: string[] = [];
      const clause = buildEntitlementAccessClause(condition, warnings);

      expect(warnings).toEqual([]);
      expect(clause).toBe(
        '@access(type:ENTITLEMENT AND source.id:"src-12345" AND attribute:"memberOf" AND value:"CN=Admins,OU=Groups,DC=domain,DC=com")'
      );
    });
  });

  describe('accountMatchesCondition', () => {
    const account = {
      attributes: {
        department: 'Security',
        roles: 'auditor',
      },
    };

    it('matches account attributes with EQUALS', () => {
      const condition: LeafCondition = {
        path: '0',
        keyType: 'ACCOUNT',
        property: 'attribute.department',
        sourceId: 'src-1',
        operation: 'EQUALS',
        value: 'Security',
      };
      expect(accountMatchesCondition(account, condition)).toBe(true);
    });

    it('matches account attributes with CONTAINS', () => {
      const condition: LeafCondition = {
        path: '0',
        keyType: 'ACCOUNT',
        property: 'attribute.roles',
        sourceId: 'src-1',
        operation: 'CONTAINS',
        value: 'audit',
      };
      expect(accountMatchesCondition(account, condition)).toBe(true);
    });

    it('fails when attribute value does not match', () => {
      const condition: LeafCondition = {
        path: '0',
        keyType: 'ACCOUNT',
        property: 'attribute.department',
        sourceId: 'src-1',
        operation: 'EQUALS',
        value: 'HR',
      };
      expect(accountMatchesCondition(account, condition)).toBe(false);
    });

    it('matches missing or null attributes when operation is NOT_EQUALS or DOES_NOT_CONTAIN', () => {
      const conditionNotEquals: LeafCondition = {
        path: '0',
        keyType: 'ACCOUNT',
        property: 'attribute.missingField',
        sourceId: 'src-1',
        operation: 'NOT_EQUALS',
        value: 'HR',
      };
      expect(accountMatchesCondition(account, conditionNotEquals)).toBe(true);

      const conditionDoesNotContain: LeafCondition = {
        path: '0',
        keyType: 'ACCOUNT',
        property: 'attribute.missingField',
        sourceId: 'src-1',
        operation: 'DOES_NOT_CONTAIN',
        value: 'HR',
      };
      expect(accountMatchesCondition(account, conditionDoesNotContain)).toBe(true);
    });
  });

  describe('combineEsClauses', () => {
    it('combines clauses with parentheses and boolean operators', () => {
      const clauses = ['attributes.status:"active"', 'email:*@example.com'];
      expect(combineEsClauses(clauses, 'AND')).toBe(
        '(attributes.status:"active") AND (email:*@example.com)'
      );
    });
  });
});
