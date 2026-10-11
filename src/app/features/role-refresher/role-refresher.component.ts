import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SailpointPluginService } from '@core';
import { IdentitiesService } from '@sailpoint/angular-sdk/identities';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { firstValueFrom } from 'rxjs';
import { AccountsService } from '@sailpoint/angular-sdk/accounts';
import { SearchService } from '@sailpoint/angular-sdk/search';
import { RoleMembershipResolverService } from './role-membership-resolver.service';
import { RoleMembership } from './role-membership.types';
import { EvaluatedIdentity, RoleOption } from './role-refresher.models';

@Component({
  selector: 'app-role-refresher',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    ButtonModule,
    MessageModule,
    ProgressBarModule,
    SelectModule,
    SkeletonModule,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  providers: [IdentitiesService, SearchService, AccountsService, RoleMembershipResolverService],
  templateUrl: './role-refresher.component.html',
  styleUrl: './role-refresher.component.scss',
})
export class RoleRefresherComponent {
  protected readonly plugin = inject(SailpointPluginService);
  private readonly identitiesSvc = inject(IdentitiesService);
  private readonly membershipResolver = inject(RoleMembershipResolverService);

  // Signals
  protected readonly roles = signal<RoleOption[]>([]);
  protected readonly selectedRoleId = signal<string>('');
  protected readonly loadingRoles = signal<boolean>(false);
  protected readonly loadingEvaluation = signal<boolean>(false);
  protected readonly isProcessing = signal<boolean>(false);
  protected readonly error = signal<string>('');
  protected readonly evaluatedIdentities = signal<EvaluatedIdentity[]>([]);
  protected readonly sourcesMap = signal<Map<string, string>>(new Map());
  protected readonly searchQuery = signal<string>('');
  protected readonly activeFilter = signal<'ALL_IMPACTED' | 'GAIN' | 'LOSE' | 'RETAINED' | 'ALL'>('ALL_IMPACTED');
  protected readonly lastProcessResult = signal<{ taskId: string; count: number; timestamp: string } | null>(null);

  // Selected Role details
  protected readonly selectedRole = computed<RoleOption | null>(() => {
    const id = this.selectedRoleId();
    return this.roles().find((r) => r.id === id) || null;
  });

  // Human readable criteria breakdown
  protected readonly criteriaSummary = computed<string>(() => {
    const role = this.selectedRole();
    if (!role) return '';
    if (role.membershipType === 'IDENTITY_LIST') {
      return 'Static membership assigned by identity list.';
    }
    return formatCriteriaSummary(role.criteria);
  });

  // KPI Metrics
  protected readonly gainCount = computed<number>(() => {
    return this.evaluatedIdentities().filter((i) => i.changeType === 'GAIN').length;
  });

  protected readonly loseCount = computed<number>(() => {
    return this.evaluatedIdentities().filter((i) => i.changeType === 'LOSE').length;
  });

  protected readonly retainedCount = computed<number>(() => {
    return this.evaluatedIdentities().filter((i) => i.changeType === 'RETAINED').length;
  });

  protected readonly impactedCount = computed<number>(() => {
    return this.gainCount() + this.loseCount();
  });

  protected readonly netChange = computed<number>(() => {
    return this.gainCount() - this.loseCount();
  });

  // Filtered table rows
  protected readonly filteredIdentities = computed<EvaluatedIdentity[]>(() => {
    const list = this.evaluatedIdentities();
    const filter = this.activeFilter();
    const query = this.searchQuery().trim().toLowerCase();

    return list.filter((item) => {
      // Category filter
      if (filter === 'ALL_IMPACTED' && item.changeType !== 'GAIN' && item.changeType !== 'LOSE') {
        return false;
      }
      if (filter === 'GAIN' && item.changeType !== 'GAIN') {
        return false;
      }
      if (filter === 'LOSE' && item.changeType !== 'LOSE') {
        return false;
      }
      if (filter === 'RETAINED' && item.changeType !== 'RETAINED') {
        return false;
      }

      // Search query filter
      if (query) {
        const nameMatch = item.name.toLowerCase().includes(query);
        const emailMatch = (item.email || '').toLowerCase().includes(query);
        const deptMatch = (item.department || '').toLowerCase().includes(query);
        const titleMatch = (item.title || '').toLowerCase().includes(query);
        const reasonMatch = item.reasons.some((r) => r.toLowerCase().includes(query));
        return nameMatch || emailMatch || deptMatch || titleMatch || reasonMatch;
      }

      return true;
    });
  });

  // Selected row count
  protected readonly selectedCount = computed<number>(() => {
    return this.evaluatedIdentities().filter((i) => i.selected).length;
  });

  protected readonly allSelected = computed<boolean>(() => {
    const list = this.filteredIdentities();
    return list.length > 0 && list.every((i) => i.selected);
  });

  private rolesLoaded = false;

  constructor() {
    // When plugin handshake is ready, fetch initial metadata
    effect(() => {
      if (this.plugin.apiReady() && !this.rolesLoaded) {
        this.rolesLoaded = true;
        void this.loadInitialData();
      }
    });
  }

  protected async loadInitialData(): Promise<void> {
    this.loadingRoles.set(true);
    this.error.set('');

    try {
      // 1. Fetch sources from sources/v1 API to resolve sourceId -> sourceName
      const sources = await this.plugin.get<any[]>('/sources/v1?limit=250');
      const sMap = new Map<string, string>();
      for (const s of sources) {
        if (s.id && s.name) {
          sMap.set(s.id, s.name);
        }
      }
      this.sourcesMap.set(sMap);

      // 2. Fetch roles from roles/v1 API
      const rolesData = await this.plugin.get<any[]>('/roles/v1?limit=250&sorters=name');
      const options: RoleOption[] = rolesData.map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        enabled: r.enabled ?? true,
        membershipType: r.membership?.type || 'STANDARD',
        criteria: r.membership?.criteria || null,
        owner: r.owner ? { id: r.owner.id, name: r.owner.name } : undefined,
        accessProfilesCount: (r.accessProfiles || []).length,
        entitlementsCount: (r.entitlements || []).length,
      }));

      this.roles.set(options);

      // Auto-select first role if available
      if (options.length > 0 && !this.selectedRoleId()) {
        const activeRole = options.find((r) => r.enabled && r.criteria) || options[0];
        this.onRoleChange(activeRole.id);
      }
    } catch (err) {
      this.error.set(this.formatError(err));
    } finally {
      this.loadingRoles.set(false);
    }
  }

  protected async onRoleChange(roleId: string | null): Promise<void> {
    if (!roleId) {
      this.selectedRoleId.set('');
      this.evaluatedIdentities.set([]);
      return;
    }

    this.selectedRoleId.set(roleId);
    await this.runRoleDiffEvaluation(roleId);
  }

  /**
   * Calculates the difference:
   * - Evaluates criteria against accounts/v1 and sources/v1 data
   * - Compares with currently assigned identities from /roles/v1/:id/assigned-identities
   */
  protected async runRoleDiffEvaluation(roleId: string): Promise<void> {
    this.loadingEvaluation.set(true);
    this.error.set('');

    try {
      // Fetch the latest fresh role details directly from /roles/v1/:id
      // to avoid using stale cached criteria if the role was modified in the tenant.
      let role = this.roles().find((r) => r.id === roleId);
      try {
        const freshRole = await this.plugin.get<any>(`/roles/v1/${roleId}`);
        if (freshRole) {
          const updatedRoleOption: RoleOption = {
            id: freshRole.id,
            name: freshRole.name,
            description: freshRole.description,
            enabled: freshRole.enabled ?? true,
            membershipType: freshRole.membership?.type || 'STANDARD',
            criteria: freshRole.membership?.criteria || null,
            owner: freshRole.owner ? { id: freshRole.owner.id, name: freshRole.owner.name } : undefined,
            accessProfilesCount: (freshRole.accessProfiles || []).length,
            entitlementsCount: (freshRole.entitlements || []).length,
          };
          this.roles.update((list) => list.map((r) => (r.id === roleId ? updatedRoleOption : r)));
          role = updatedRoleOption;
        }
      } catch (e) {
        console.warn('Could not refetch latest role details, using cached option', e);
      }

      if (!role) return;

      // Fetch currently assigned identities
      const assigned = await this.plugin.get<any[]>(`/roles/v1/${roleId}/assigned-identities?limit=250`);
      const assignedIds = new Set<string>(assigned.map((a) => a.id));

      // Fetch accounts from accounts/v1 API endpoint
      const accounts = await this.plugin.get<any[]>('/accounts/v1?limit=250');

      // Fetch public identities for demographic context (jobTitle, department, lifecycleState)
      let publicIdentities: any[] = [];
      try {
        publicIdentities = await this.plugin.get<any[]>('/public-identities/v1?limit=250');
      } catch (e) {
        try {
          publicIdentities = await this.plugin.get<any[]>('/public-identities?limit=250');
        } catch (inner) {
          console.warn('public-identities fetch skipped or unavailable', e, inner);
        }
      }

      const identitiesMap = new Map<string, any>();
      for (const pi of publicIdentities) {
        if (pi.id) {
          const attrMap: Record<string, any> = {};
          if (Array.isArray(pi.attributes)) {
            for (const a of pi.attributes) {
              if (a.key) attrMap[a.key] = a.value;
            }
          }
          identitiesMap.set(pi.id, {
            id: pi.id,
            name: pi.name || pi.alias || 'Unknown',
            alias: pi.alias,
            email: pi.email,
            status: pi.status || pi.identityState || 'active',
            attributes: attrMap,
          });
        }
      }

      // Group accounts by identityId
      const identityAccountsMap = new Map<string, Array<{ sourceId: string; sourceName: string; attributes: Record<string, any> }>>();

      for (const acc of accounts) {
        if (!acc.identityId) continue;
        const list = identityAccountsMap.get(acc.identityId) || [];
        list.push({
          sourceId: acc.sourceId,
          sourceName: acc.sourceName || this.sourcesMap().get(acc.sourceId) || 'Source',
          attributes: acc.attributes || {},
        });
        identityAccountsMap.set(acc.identityId, list);

        // Populate identity fallback if not in publicIdentities
        if (!identitiesMap.has(acc.identityId)) {
          identitiesMap.set(acc.identityId, {
            id: acc.identityId,
            name: acc.identity?.name || acc.name || 'User',
            alias: acc.identity?.name,
            email: acc.attributes?.['mail'] || acc.attributes?.['email'],
            status: acc.cloudLifecycleState || 'active',
            attributes: {
              cloudLifecycleState: acc.cloudLifecycleState,
              department: acc.attributes?.['department'],
              title: acc.attributes?.['title'] || acc.attributes?.['jobTitle'],
              ...acc.attributes,
            },
          });
        }
      }

      // Add any assigned identities that might not have accounts
      for (const a of assigned) {
        if (a.id && !identitiesMap.has(a.id)) {
          identitiesMap.set(a.id, {
            id: a.id,
            name: a.name || a.aliasName || 'Assigned User',
            alias: a.aliasName,
            email: a.email,
            status: 'active',
            attributes: {},
          });
        }
      }

      const results: EvaluatedIdentity[] = [];

      // Resolve the actual set of identity IDs that satisfy the role's
      // membership definition (STANDARD criteria tree or IDENTITY_LIST),
      // via RoleMembershipResolverService — replaces the old per-identity
      // client-side evaluateCriteria() loop. This correctly handles
      // ENTITLEMENT leaves, paginates past 250 accounts/identities, and
      // resolves IDENTITY_LIST membership directly instead of circularly
      // treating "currently assigned" as the match condition.
      const membership: RoleMembership = {
        type: (role.membershipType as RoleMembership['type']) || 'STANDARD',
        criteria: role.criteria || null,
        // IDENTITY_LIST roles' identities aren't carried on RoleOption today;
        // falling back to the assigned-identities list is exact for that
        // membership type (its members ARE whatever is in the static list,
        // which is exactly what "currently assigned" reflects).
        identities: assigned.map((a) => ({ id: a.id, name: a.name, aliasName: a.aliasName })),
      };

      const resolverWarnings: string[] = [];
      const targetIds = new Set<string>(
        await firstValueFrom(this.membershipResolver.resolveMembers(membership, resolverWarnings)),
      );
      if (resolverWarnings.length > 0) {
        console.warn('[role-membership-resolver] warnings while resolving role', roleId, resolverWarnings);
      }

      // Evaluate each identity candidate
      for (const [id, idData] of identitiesMap.entries()) {
        const idAccounts = identityAccountsMap.get(id) || [];
        const isCurrentlyAssigned = assignedIds.has(id);
        const matchesCriteria = targetIds.has(id);

        const reasons: string[] = [
          matchesCriteria ? 'MATCH: Matches role membership criteria' : 'MISMATCH: Does not match role membership criteria',
        ];

        let changeType: 'GAIN' | 'LOSE' | 'RETAINED' | 'UNAFFECTED';
        if (matchesCriteria && !isCurrentlyAssigned) {
          changeType = 'GAIN';
        } else if (!matchesCriteria && isCurrentlyAssigned) {
          changeType = 'LOSE';
        } else if (matchesCriteria && isCurrentlyAssigned) {
          changeType = 'RETAINED';
        } else {
          changeType = 'UNAFFECTED';
        }

        const sourceNames = [...new Set(idAccounts.map((a) => a.sourceName))];

        results.push({
          id,
          name: idData.name,
          alias: idData.alias,
          email: idData.email,
          department: idData.attributes?.['department'] || idAccounts[0]?.attributes?.['department'] || '-',
          title: idData.attributes?.['jobTitle'] || idData.attributes?.['title'] || idAccounts[0]?.attributes?.['title'] || '-',
          lifecycleState: idData.attributes?.['cloudLifecycleState'] || idData.status || 'active',
          sources: sourceNames,
          matchesCriteria,
          isCurrentlyAssigned,
          changeType,
          reasons,
          selected: changeType === 'GAIN' || changeType === 'LOSE', // Auto-select impacted users
        });
      }

      // Any identity the resolver matched that wasn't already covered by
      // publicIdentities/accounts/assigned (e.g. a GAIN candidate with no
      // account yet surfaced through pagination elsewhere) still needs a row.
      for (const id of targetIds) {
        if (identitiesMap.has(id)) continue;
        results.push({
          id,
          name: 'Unknown User',
          alias: undefined,
          email: undefined,
          department: '-',
          title: '-',
          lifecycleState: 'active',
          sources: [],
          matchesCriteria: true,
          isCurrentlyAssigned: assignedIds.has(id),
          changeType: assignedIds.has(id) ? 'RETAINED' : 'GAIN',
          reasons: ['MATCH: Matches role membership criteria'],
          selected: !assignedIds.has(id),
        });
      }

      // Sort: LOSE (risk) first, GAIN next, RETAINED, UNAFFECTED last
      const order = { LOSE: 0, GAIN: 1, RETAINED: 2, UNAFFECTED: 3 };
      results.sort((a, b) => order[a.changeType] - order[b.changeType] || a.name.localeCompare(b.name));

      this.evaluatedIdentities.set(results);
    } catch (err) {
      this.error.set(this.formatError(err));
    } finally {
      this.loadingEvaluation.set(false);
    }
  }

  // Row selection toggle
  protected toggleSelectAll(checked: boolean): void {
    const list = this.filteredIdentities();
    const selectedIds = new Set(list.map((i) => i.id));
    this.evaluatedIdentities.update((items) =>
      items.map((item) => (selectedIds.has(item.id) ? { ...item, selected: checked } : item))
    );
  }

  protected toggleRowSelection(identity: EvaluatedIdentity): void {
    this.evaluatedIdentities.update((items) =>
      items.map((i) => (i.id === identity.id ? { ...i, selected: !i.selected } : i))
    );
  }

  /**
   * Applies changes safely:
   * Dispatches targeted identity refresh via POST /identities/v1/process
   * using IdentitiesService.startIdentityProcessingV1()
   */
  protected async processSelectedIdentities(target: 'SELECTED' | 'ALL_IMPACTED'): Promise<void> {
    let idsToProcess: string[] = [];

    if (target === 'SELECTED') {
      idsToProcess = this.evaluatedIdentities()
        .filter((i) => i.selected)
        .map((i) => i.id);
    } else {
      idsToProcess = this.evaluatedIdentities()
        .filter((i) => i.changeType === 'GAIN' || i.changeType === 'LOSE')
        .map((i) => i.id);
    }

    if (idsToProcess.length === 0) {
      return;
    }

    // Limit to 250 per SailPoint API requirement
    const batch = idsToProcess.slice(0, 250);

    this.isProcessing.set(true);
    this.error.set('');

    try {
      // Call identity processing endpoint with experimental header
      const res = await firstValueFrom(
        this.identitiesSvc.startIdentityProcessingV1({
          processIdentitiesRequest: { identityIds: batch },
          xSailPointExperimental: 'true',
        })
      );

      this.lastProcessResult.set({
        taskId: res.id || 'Task Dispatched',
        count: batch.length,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      this.error.set(this.formatError(err));
    } finally {
      this.isProcessing.set(false);
    }
  }

  /**
   * Single identity refresh action
   */
  protected async processSingleIdentity(identityId: string): Promise<void> {
    this.isProcessing.set(true);
    this.error.set('');

    try {
      const res = await firstValueFrom(
        this.identitiesSvc.startIdentityProcessingV1({
          processIdentitiesRequest: { identityIds: [identityId] },
          xSailPointExperimental: 'true',
        })
      );

      this.lastProcessResult.set({
        taskId: res.id || 'Task Dispatched',
        count: 1,
        timestamp: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      this.error.set(this.formatError(err));
    } finally {
      this.isProcessing.set(false);
    }
  }

  // Helpers
  protected initials(name: string): string {
    return (name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }

  protected isReasonFail(reason: string): boolean {
    return reason.startsWith('MISMATCH') || reason.startsWith('FAIL');
  }

  protected formatReasonText(reason: string): string {
    return reason.replace(/^(MATCH|MISMATCH|PASS|FAIL):\s*/, '');
  }

  private formatError(err: unknown): string {
    return err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  }
}

/** Renders a raw criteria node tree as a human-readable boolean expression for display. */
function formatCriteriaSummary(node: any): string {
  if (!node) return 'No criteria specified (Empty)';
  const op = (node.operation || '').toUpperCase();

  if (op === 'AND' || op === 'OR') {
    const children = node.children || [];
    if (children.length === 0) return `Empty ${op}`;
    const parts = children.map((c: any) => `(${formatCriteriaSummary(c)})`);
    return parts.join(` ${op} `);
  }

  const prop = (node.key?.property || '').replace(/^attributes?\./i, '');
  const type = node.key?.type || 'IDENTITY';
  const vals: string[] = (node.values && node.values.length > 0)
    ? node.values
    : (node.stringValue != null ? [node.stringValue] : []);

  const valStr = vals.length > 1
    ? `(${vals.map((v: string) => `"${v}"`).join(' OR ')})`
    : `"${vals[0] ?? ''}"`;

  return `${type === 'ACCOUNT' ? 'Account.' : ''}${prop} ${op} ${valStr}`;
}
