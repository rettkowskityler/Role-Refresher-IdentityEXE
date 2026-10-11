export interface RoleOption {
  id: string;
  name: string;
  description?: string | null;
  enabled?: boolean;
  membershipType?: string;
  criteria?: any;
  owner?: { id?: string; name?: string };
  accessProfilesCount?: number;
  entitlementsCount?: number;
}

export interface EvaluatedIdentity {
  id: string;
  name: string;
  alias?: string;
  email?: string;
  department?: string;
  title?: string;
  lifecycleState?: string;
  sources: string[];
  matchesCriteria: boolean;
  isCurrentlyAssigned: boolean;
  changeType: 'GAIN' | 'LOSE' | 'RETAINED' | 'UNAFFECTED';
  reasons: string[];
  selected?: boolean;
}

export interface ProcessIdentitiesResponse {
  type: string;
  id: string;
  name?: string | null;
}
