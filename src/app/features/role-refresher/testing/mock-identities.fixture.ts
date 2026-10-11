export interface MockAccount {
  sourceId: string;
  sourceName?: string;
  attributes: Record<string, any>;
  entitlements?: Array<{ attribute: string; value: string }>;
}

export interface MockIdentity {
  id: string;
  name: string;
  email: string;
  attributes: Record<string, any>;
  accounts?: MockAccount[];
}

export const TEST_POPULATION: MockIdentity[] = [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Engineering',
      jobTitle: 'Senior Software Engineer',
      location: 'Austin',
      costCenter: 'CC-101',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-activedirectory',
        sourceName: 'Corporate Active Directory',
        attributes: { sAMAccountName: 'ajohnson', status: 'enabled' },
        entitlements: [
          { attribute: 'memberOf', value: 'CN=Developers,OU=Groups,DC=example,DC=com' },
          { attribute: 'memberOf', value: 'CN=Git-Access,OU=Groups,DC=example,DC=com' },
        ],
      },
      {
        sourceId: 'src-workday',
        sourceName: 'Workday HR',
        attributes: { empType: 'FullTime', orgLevel: 'L5', jobFamily: 'Software' },
      },
    ],
  },
  {
    id: 'user-002',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Finance',
      jobTitle: 'Financial Analyst',
      location: 'London',
      costCenter: 'CC-201',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-activedirectory',
        sourceName: 'Corporate Active Directory',
        attributes: { sAMAccountName: 'bsmith', status: 'enabled' },
        entitlements: [
          { attribute: 'memberOf', value: 'CN=Finance-Team,OU=Groups,DC=example,DC=com' },
        ],
      },
      {
        sourceId: 'src-netsuite',
        sourceName: 'NetSuite ERP',
        attributes: { subsidiary: 'UK-Holdings', role: 'Staff Accountant' },
      },
    ],
  },
  {
    id: 'user-003',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Finance',
      jobTitle: 'Senior Financial Analyst',
      location: 'Singapore',
      costCenter: 'CC-201',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-activedirectory',
        sourceName: 'Corporate Active Directory',
        attributes: { sAMAccountName: 'cbrown', status: 'enabled' },
        entitlements: [
          { attribute: 'memberOf', value: 'CN=Finance-Managers,OU=Groups,DC=example,DC=com' },
        ],
      },
    ],
  },
  {
    id: 'user-004',
    name: 'Diana Prince',
    email: 'diana.prince@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Human Resources',
      jobTitle: 'HR Director',
      location: 'Austin',
      costCenter: 'CC-301',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-workday',
        sourceName: 'Workday HR',
        attributes: { empType: 'FullTime', orgLevel: 'L7', isManager: 'true' },
      },
    ],
  },
  {
    id: 'user-005',
    name: 'Evan Wright',
    email: 'evan.wright@example.com',
    attributes: {
      cloudLifecycleState: 'inactive',
      department: 'Engineering',
      jobTitle: 'DevOps Engineer',
      location: 'Austin',
      costCenter: 'CC-101',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-activedirectory',
        sourceName: 'Corporate Active Directory',
        attributes: { sAMAccountName: 'ewright', status: 'disabled' },
      },
    ],
  },
  {
    id: 'user-006',
    name: 'Fiona Gallagher',
    email: 'fiona.gallagher@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Sales',
      jobTitle: 'Account Executive',
      location: 'Chicago',
      costCenter: 'CC-401',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-salesforce',
        sourceName: 'Salesforce CRM',
        attributes: { profile: 'Standard AE', region: 'Midwest' },
      },
    ],
  },
  {
    id: 'user-007',
    name: 'George Clark',
    email: 'adm_george@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Security',
      jobTitle: 'Cyber Security Analyst',
      location: 'Denver',
      costCenter: 'CC-501',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-activedirectory',
        sourceName: 'Corporate Active Directory',
        attributes: { sAMAccountName: 'adm_gclark', isPrivileged: 'true' },
        entitlements: [
          { attribute: 'memberOf', value: 'CN=SecOps,OU=Groups,DC=example,DC=com' },
        ],
      },
    ],
  },
  {
    id: 'user-008',
    name: 'Hannah Abbott',
    email: 'hannah.abbott@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Sales',
      jobTitle: 'Sales Director',
      location: 'London',
      costCenter: 'CC-401',
      employeeType: 'regular',
    },
    accounts: [
      {
        sourceId: 'src-salesforce',
        sourceName: 'Salesforce CRM',
        attributes: { profile: 'Sales Director', region: 'EMEA' },
      },
    ],
  },
  {
    id: 'user-009',
    name: 'Ian Malcolm',
    email: 'ian.contractor@vendor.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Quality Assurance',
      jobTitle: 'QA Automation Tester',
      location: 'Remote',
      costCenter: 'CC-601',
      employeeType: 'contractor',
    },
    accounts: [
      {
        sourceId: 'src-workday',
        sourceName: 'Workday HR',
        attributes: { empType: 'Contractor', vendorName: 'Apex Testing' },
      },
    ],
  },
  {
    id: 'user-010',
    name: 'Julia Roberts',
    email: 'julia.roberts@example.com',
    attributes: {
      cloudLifecycleState: 'active',
      department: 'Marketing',
      jobTitle: 'Content Strategist',
      location: 'New York',
      costCenter: 'CC-701',
      employeeType: 'regular',
    },
  },
];
