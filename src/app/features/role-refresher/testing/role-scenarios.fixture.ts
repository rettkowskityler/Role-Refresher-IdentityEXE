export interface RoleTestCase {
  id: string;
  name: string;
  description: string;
  roleJson: Record<string, any>;
  currentlyAssigned: string[];
  expected: {
    matchedUserIds: string[];
    gainUserIds: string[];
    loseUserIds: string[];
    retainedUserIds: string[];
  };
}

export const ROLE_TEST_SCENARIOS: RoleTestCase[] = [
  // 1. Simple Single Identity Attribute Equality
  {
    id: 'ROLE-TC-01',
    name: 'Finance Department Standard',
    description: 'Evaluates single identity attribute EQUALS condition (department == "Finance")',
    roleJson: {
      id: 'role-001',
      name: 'Finance Department Standard',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'EQUALS',
          key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
          stringValue: 'Finance',
          children: null,
        },
      },
    },
    currentlyAssigned: ['user-002'],
    expected: {
      matchedUserIds: ['user-002', 'user-003'],
      gainUserIds: ['user-003'],
      loseUserIds: [],
      retainedUserIds: ['user-002'],
    },
  },

  // 2. Boolean AND with Multiple Identity Attributes
  {
    id: 'ROLE-TC-02',
    name: 'Active Engineering Personnel',
    description: 'Evaluates boolean AND between department == "Engineering" and lifecycleState == "active"',
    roleJson: {
      id: 'role-002',
      name: 'Active Engineering Personnel',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'AND',
          children: [
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
              stringValue: 'Engineering',
            },
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.cloudLifecycleState', sourceId: null },
              stringValue: 'active',
            },
          ],
        },
      },
    },
    currentlyAssigned: ['user-001', 'user-005'],
    expected: {
      matchedUserIds: ['user-001'],
      gainUserIds: [],
      loseUserIds: ['user-005'], // user-005 is inactive -> flagged to lose role!
      retainedUserIds: ['user-001'],
    },
  },

  // 3. Boolean OR Across Different Departments
  {
    id: 'ROLE-TC-03',
    name: 'People & Brand Staff',
    description: 'Evaluates boolean OR across Human Resources or Marketing departments',
    roleJson: {
      id: 'role-003',
      name: 'People & Brand Staff',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'OR',
          children: [
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
              stringValue: 'Human Resources',
            },
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
              stringValue: 'Marketing',
            },
          ],
        },
      },
    },
    currentlyAssigned: [],
    expected: {
      matchedUserIds: ['user-004', 'user-010'],
      gainUserIds: ['user-004', 'user-010'],
      loseUserIds: [],
      retainedUserIds: [],
    },
  },

  // 4. Multi-Value Array Expansion in Single Leaf Condition
  {
    id: 'ROLE-TC-04',
    name: 'APAC and EMEA Regional Access',
    description: 'Expands multi-value array values: ["London", "Singapore"] on location',
    roleJson: {
      id: 'role-004',
      name: 'APAC and EMEA Regional Access',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'EQUALS',
          key: { type: 'IDENTITY', property: 'attribute.location', sourceId: null },
          values: ['London', 'Singapore'],
        },
      },
    },
    currentlyAssigned: ['user-002', 'user-008'],
    expected: {
      matchedUserIds: ['user-002', 'user-003', 'user-008'],
      gainUserIds: ['user-003'],
      loseUserIds: [],
      retainedUserIds: ['user-002', 'user-008'],
    },
  },

  // 5. String Operator: CONTAINS
  {
    id: 'ROLE-TC-05',
    name: 'Analytics Professionals',
    description: 'Evaluates substring matching: jobTitle CONTAINS "Analyst"',
    roleJson: {
      id: 'role-005',
      name: 'Analytics Professionals',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'CONTAINS',
          key: { type: 'IDENTITY', property: 'attribute.jobTitle', sourceId: null },
          stringValue: 'Analyst',
        },
      },
    },
    currentlyAssigned: ['user-002', 'user-003', 'user-007'],
    expected: {
      matchedUserIds: ['user-002', 'user-003', 'user-007'],
      gainUserIds: [],
      loseUserIds: [],
      retainedUserIds: ['user-002', 'user-003', 'user-007'],
    },
  },

  // 6. String Operator: STARTS_WITH
  {
    id: 'ROLE-TC-06',
    name: 'Privileged Admin Identity Profile',
    description: 'Evaluates prefix pattern: email STARTS_WITH "adm_"',
    roleJson: {
      id: 'role-006',
      name: 'Privileged Admin Identity Profile',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'STARTS_WITH',
          key: { type: 'IDENTITY', property: 'attribute.email', sourceId: null },
          stringValue: 'adm_',
        },
      },
    },
    currentlyAssigned: [],
    expected: {
      matchedUserIds: ['user-007'],
      gainUserIds: ['user-007'],
      loseUserIds: [],
      retainedUserIds: [],
    },
  },

  // 7. String Operator: ENDS_WITH
  {
    id: 'ROLE-TC-07',
    name: 'External Vendor Access',
    description: 'Evaluates suffix domain: email ENDS_WITH "@vendor.com"',
    roleJson: {
      id: 'role-007',
      name: 'External Vendor Access',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'ENDS_WITH',
          key: { type: 'IDENTITY', property: 'attribute.email', sourceId: null },
          stringValue: '@vendor.com',
        },
      },
    },
    currentlyAssigned: ['user-009'],
    expected: {
      matchedUserIds: ['user-009'],
      gainUserIds: [],
      loseUserIds: [],
      retainedUserIds: ['user-009'],
    },
  },

  // 8. String Operator: NOT_EQUALS
  {
    id: 'ROLE-TC-08',
    name: 'Active Non-Inactive Engineers',
    description: 'Evaluates negation: department == "Engineering" AND lifecycleState NOT_EQUALS "inactive"',
    roleJson: {
      id: 'role-008',
      name: 'Active Non-Inactive Engineers',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'AND',
          children: [
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
              stringValue: 'Engineering',
            },
            {
              operation: 'NOT_EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.cloudLifecycleState', sourceId: null },
              stringValue: 'inactive',
            },
          ],
        },
      },
    },
    currentlyAssigned: ['user-001'],
    expected: {
      matchedUserIds: ['user-001'],
      gainUserIds: [],
      loseUserIds: [],
      retainedUserIds: ['user-001'],
    },
  },

  // 9. Nested AND / OR Tree Combination
  {
    id: 'ROLE-TC-09',
    name: 'Active Revenue Generation Personnel',
    description: 'Evaluates nested grouping: active AND (Sales OR Finance)',
    roleJson: {
      id: 'role-009',
      name: 'Active Revenue Generation Personnel',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'AND',
          children: [
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.cloudLifecycleState', sourceId: null },
              stringValue: 'active',
            },
            {
              operation: 'OR',
              children: [
                {
                  operation: 'EQUALS',
                  key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
                  stringValue: 'Sales',
                },
                {
                  operation: 'EQUALS',
                  key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
                  stringValue: 'Finance',
                },
              ],
            },
          ],
        },
      },
    },
    currentlyAssigned: ['user-002', 'user-006'],
    expected: {
      matchedUserIds: ['user-002', 'user-003', 'user-006', 'user-008'],
      gainUserIds: ['user-003', 'user-008'],
      loseUserIds: [],
      retainedUserIds: ['user-002', 'user-006'],
    },
  },

  // 10. Deep 2-Level Nested Groups (ISC Maximum Nesting Depth)
  {
    id: 'ROLE-TC-10',
    name: 'London Commercial Hub',
    description: 'Evaluates (Sales AND London) OR (Finance AND London)',
    roleJson: {
      id: 'role-010',
      name: 'London Commercial Hub',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'OR',
          children: [
            {
              operation: 'AND',
              children: [
                {
                  operation: 'EQUALS',
                  key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
                  stringValue: 'Sales',
                },
                {
                  operation: 'EQUALS',
                  key: { type: 'IDENTITY', property: 'attribute.location', sourceId: null },
                  stringValue: 'London',
                },
              ],
            },
            {
              operation: 'AND',
              children: [
                {
                  operation: 'EQUALS',
                  key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
                  stringValue: 'Finance',
                },
                {
                  operation: 'EQUALS',
                  key: { type: 'IDENTITY', property: 'attribute.location', sourceId: null },
                  stringValue: 'London',
                },
              ],
            },
          ],
        },
      },
    },
    currentlyAssigned: [],
    expected: {
      matchedUserIds: ['user-002', 'user-008'],
      gainUserIds: ['user-002', 'user-008'],
      loseUserIds: [],
      retainedUserIds: [],
    },
  },

  // 11. Entitlement Condition (Nested @access query on AD source)
  {
    id: 'ROLE-TC-11',
    name: 'Corporate Developers Entitlement Role',
    description: 'Evaluates ENTITLEMENT leaf on Active Directory source (memberOf == CN=Developers...)',
    roleJson: {
      id: 'role-011',
      name: 'Corporate Developers Entitlement Role',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'EQUALS',
          key: {
            type: 'ENTITLEMENT',
            property: 'attribute.memberOf',
            sourceId: 'src-activedirectory',
          },
          stringValue: 'CN=Developers,OU=Groups,DC=example,DC=com',
        },
      },
    },
    currentlyAssigned: ['user-001'],
    expected: {
      matchedUserIds: ['user-001'],
      gainUserIds: [],
      loseUserIds: [],
      retainedUserIds: ['user-001'],
    },
  },

  // 12. Account Attribute Condition (Scoped to Workday HR source)
  {
    id: 'ROLE-TC-12',
    name: 'Workday FullTime Regular Employees',
    description: 'Evaluates ACCOUNT attribute empType == "FullTime" on Workday source',
    roleJson: {
      id: 'role-012',
      name: 'Workday FullTime Regular Employees',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'EQUALS',
          key: {
            type: 'ACCOUNT',
            property: 'attribute.empType',
            sourceId: 'src-workday',
          },
          stringValue: 'FullTime',
        },
      },
    },
    currentlyAssigned: ['user-004'],
    expected: {
      matchedUserIds: ['user-001', 'user-004'],
      gainUserIds: ['user-001'],
      loseUserIds: [],
      retainedUserIds: ['user-004'],
    },
  },

  // 13. Mixed Criteria: Identity Attribute AND Entitlement Condition
  {
    id: 'ROLE-TC-13',
    name: 'Finance Leadership with Sign-off Access',
    description: 'Evaluates department == "Finance" AND AD entitlement CN=Finance-Managers...',
    roleJson: {
      id: 'role-013',
      name: 'Finance Leadership with Sign-off Access',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'AND',
          children: [
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
              stringValue: 'Finance',
            },
            {
              operation: 'EQUALS',
              key: {
                type: 'ENTITLEMENT',
                property: 'attribute.memberOf',
                sourceId: 'src-activedirectory',
              },
              stringValue: 'CN=Finance-Managers,OU=Groups,DC=example,DC=com',
            },
          ],
        },
      },
    },
    currentlyAssigned: [],
    expected: {
      matchedUserIds: ['user-003'],
      gainUserIds: ['user-003'],
      loseUserIds: [],
      retainedUserIds: [],
    },
  },

  // 14. Static Role Membership (IDENTITY_LIST)
  {
    id: 'ROLE-TC-14',
    name: 'Executive Steering Committee',
    description: 'Evaluates static role assignment defined via IDENTITY_LIST',
    roleJson: {
      id: 'role-014',
      name: 'Executive Steering Committee',
      enabled: true,
      membership: {
        type: 'IDENTITY_LIST',
        criteria: null,
        identities: [
          { type: 'IDENTITY', id: 'user-004', name: 'Diana Prince' },
          { type: 'IDENTITY', id: 'user-010', name: 'Julia Roberts' },
        ],
      },
    },
    currentlyAssigned: ['user-004'],
    expected: {
      matchedUserIds: ['user-004', 'user-010'],
      gainUserIds: ['user-010'],
      loseUserIds: [],
      retainedUserIds: ['user-004'],
    },
  },

  // 15. Austin Tech Hub Simulation with Deprovisioning Risk
  {
    id: 'ROLE-TC-15',
    name: 'Austin Active Engineering Hub',
    description: 'Evaluates location == "Austin" AND active AND Engineering with deprovisioning detection',
    roleJson: {
      id: 'role-015',
      name: 'Austin Active Engineering Hub',
      enabled: true,
      membership: {
        type: 'STANDARD',
        criteria: {
          operation: 'AND',
          children: [
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.location', sourceId: null },
              stringValue: 'Austin',
            },
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.cloudLifecycleState', sourceId: null },
              stringValue: 'active',
            },
            {
              operation: 'EQUALS',
              key: { type: 'IDENTITY', property: 'attribute.department', sourceId: null },
              stringValue: 'Engineering',
            },
          ],
        },
      },
    },
    currentlyAssigned: ['user-001', 'user-005'],
    expected: {
      matchedUserIds: ['user-001'],
      gainUserIds: [],
      loseUserIds: ['user-005'], // Inactive Evan loses role
      retainedUserIds: ['user-001'],
    },
  },
];
