import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { forkJoin, from, map, mergeMap, Observable, of, switchMap, toArray } from 'rxjs';
import { Index, SearchService } from '@sailpoint/angular-sdk/search';
import { Account, AccountsService } from '@sailpoint/angular-sdk/accounts';

import { parseCriteriaTree } from './criteria-tree-parser';
import {
  accountMatchesCondition,
  buildAccountFilters,
  buildEntitlementAccessClause,
  buildIdentityEsQuery,
  combineEsClauses,
} from './leaf-resolver';
import { CriteriaTreeNode, LeafCondition, RoleMembership } from './role-membership.types';

/**
 * Resolves a SailPoint ISC Role's `membership` block (STANDARD criteria tree or
 * IDENTITY_LIST) to the actual set of matching identity IDs, by walking the
 * criteria tree and issuing the necessary search/account lookups through
 * @sailpoint/angular-sdk.
 *
 * At each branch, sibling IDENTITY and ENTITLEMENT leaves are folded into a single
 * combined /search/v1 query string (joined by the branch's own AND/OR operator),
 * since both resolve against the `identities` index and Elasticsearch query strings
 * support arbitrary boolean combination of top-level and `@access(...)` nested
 * clauses in one call. ACCOUNT leaves can't be folded this way — they require a
 * separate /accounts/v1 call — so they (and any nested branch, which per the ISC
 * schema's two-level cap is guaranteed to be leaf-only) are resolved independently
 * and combined with the folded set via post-hoc intersection/union.
 */
@Injectable({ providedIn: 'root' })
export class RoleMembershipResolverService {
  constructor(
    private readonly search: SearchService,
    private readonly accounts: AccountsService,
  ) {}

  /**
   * Resolves a Role's `membership` object to the array of identity IDs that
   * satisfy it.
   *
   * @param membership The `membership` field from a Role returned by the ISC API.
   * @param warnings   Optional array that will be populated with non-fatal
   *                   parsing warnings (e.g. missing sourceId on a leaf).
   */
  resolveMembers(membership: RoleMembership, warnings: string[] = []): Observable<string[]> {
    if (membership.type === 'IDENTITY_LIST') {
      const ids = (membership.identities ?? []).map((identity) => identity.id);
      return of(ids);
    }

    if (membership.type === 'STANDARD') {
      if (!membership.criteria) {
        warnings.push('Membership type is STANDARD but criteria is missing; no identities can be resolved.');
        return of([]);
      }
      const { tree } = parseCriteriaTree(membership.criteria, warnings);
      return this.resolveNode(tree, warnings);
    }

    warnings.push(`Unknown membership type "${(membership as RoleMembership).type}".`);
    return of([]);
  }

  /** Resolves a single normalized tree node (leaf or branch) to a set of identity IDs. */
  private resolveNode(node: CriteriaTreeNode, warnings: string[]): Observable<string[]> {
    if (node.kind === 'leaf') {
      return this.resolveLeaf(node.condition, warnings);
    }

    const foldable: LeafCondition[] = [];
    const unfoldable: CriteriaTreeNode[] = [];
    for (const child of node.children) {
      if (child.kind === 'leaf' && (child.condition.keyType === 'IDENTITY' || child.condition.keyType === 'ENTITLEMENT')) {
        foldable.push(child.condition);
      } else {
        unfoldable.push(child);
      }
    }

    const observables: Observable<string[]>[] = [];
    if (foldable.length > 0) {
      observables.push(this.resolveFoldedLeaves(foldable, node.operation, warnings));
    }
    for (const child of unfoldable) {
      observables.push(this.resolveNode(child, warnings));
    }

    if (observables.length === 0) {
      return of([]);
    }

    return forkJoin(observables).pipe(
      map((idSets) => (node.operation === 'AND' ? intersectAll(idSets) : unionAll(idSets))),
    );
  }

  /** Resolves a single leaf condition to the set of matching identity IDs. */
  private resolveLeaf(condition: LeafCondition, warnings: string[]): Observable<string[]> {
    switch (condition.keyType) {
      case 'IDENTITY':
      case 'ENTITLEMENT':
        return this.resolveFoldedLeaves([condition], 'AND', warnings);
      case 'ACCOUNT':
        return this.resolveAccountLeaf(condition, warnings);
      default:
        warnings.push(`Leaf at path ${condition.path} has unknown keyType; resolving to an empty set.`);
        return of([]);
    }
  }

  /**
   * Resolves one or more sibling IDENTITY/ENTITLEMENT leaves as a single combined
   * /search/v1 query against the `identities` index.
   */
  private resolveFoldedLeaves(
    conditions: LeafCondition[],
    operator: 'AND' | 'OR',
    warnings: string[],
  ): Observable<string[]> {
    const clauses = conditions.map((condition) =>
      condition.keyType === 'ENTITLEMENT'
        ? buildEntitlementAccessClause(condition, warnings)
        : buildIdentityEsQuery(condition),
    );
    const query = combineEsClauses(clauses, operator);
    return this.search
      .searchPostV1({
        search: { indices: [Index.Identities], query: { query } },
        limit: 10000,
      })
      .pipe(map((hits) => dedupe((hits ?? []).map((hit: { id?: string }) => hit.id).filter(isDefined))));
  }

  /**
   * Resolves an ACCOUNT leaf by listing accounts on the leaf's source (the only
   * server-side filter /accounts/v1 supports for this use case) and applying the
   * attribute/value test client-side, since arbitrary custom account attributes
   * aren't filterable through the API (confirmed against a live tenant: filtering
   * on e.g. `attributes.team` returns a 400 "not queryable" error).
   *
   * /accounts/v1 caps each page at 250 results (confirmed against a live tenant).
   * Rather than page serially, this reads the total count from the first request
   * (`count: true`) and fans out the remaining pages concurrently via `mergeMap`,
   * capped at 6 in-flight page requests at a time.
   */
  private resolveAccountLeaf(condition: LeafCondition, warnings: string[]): Observable<string[]> {
    const filters = buildAccountFilters(condition, warnings);
    const pageSize = 250;
    const maxConcurrentPages = 6;

    return this.accounts
      .listAccountsV1({ filters, limit: pageSize, offset: 0, count: true }, 'response')
      .pipe(
        switchMap((response: HttpResponse<Account[]>) => {
          const firstPage = response.body ?? [];
          const totalCount = Number(response.headers.get('X-Total-Count') ?? firstPage.length);

          const remainingOffsets: number[] = [];
          for (let offset = pageSize; offset < totalCount; offset += pageSize) {
            remainingOffsets.push(offset);
          }

          if (remainingOffsets.length === 0) {
            return of([firstPage]);
          }

          return from(remainingOffsets).pipe(
            mergeMap(
              (offset) => this.accounts.listAccountsV1({ filters, limit: pageSize, offset }).pipe(map((page) => page ?? [])),
              maxConcurrentPages,
            ),
            toArray(),
            map((remainingPages) => [firstPage, ...remainingPages]),
          );
        }),
        map((pages: Account[][]) => {
          const allAccounts = pages.flat();
          const matchingIds = allAccounts
            .filter((account) => accountMatchesCondition(account, condition))
            .map((account) => account.identityId)
            .filter(isDefined);
          return dedupe(matchingIds);
        }),
      );
  }
}

function isDefined<T>(value: T | undefined | null): value is T {
  return value != null;
}

function dedupe(ids: string[]): string[] {
  return Array.from(new Set(ids));
}

function intersectAll(idSets: string[][]): string[] {
  if (idSets.length === 0) return [];
  return idSets.reduce((acc, ids) => {
    const idSet = new Set(ids);
    return acc.filter((id) => idSet.has(id));
  });
}

function unionAll(idSets: string[][]): string[] {
  return dedupe(idSets.flat());
}
