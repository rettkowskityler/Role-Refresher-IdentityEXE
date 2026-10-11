# Role-Refresher-IdentityEXE

**SailPoint Identity Security Cloud (ISC) UI Plugin & Role Membership Simulator**

---

## Overview

**Role-Refresher-IdentityEXE** is an enterprise-grade UI Plugin for SailPoint Identity Security Cloud (ISC). It empowers identity administrators and role engineers to preview, inspect, and simulate role membership criteria changes **before** triggering tenant-wide identity processing ("Apply Changes").

Built with **Angular 21**, **PrimeNG**, and custom **IdentityEXE** branding, the plugin evaluates complex boolean membership trees (AND/OR, nested branches, multi-value attributes, entitlement memberships, and account attributes) directly in the browser and highlights precise identity impacts:
- **+ Will Gain**: Identities that qualify under new criteria and will be granted the role.
- **- Will Lose**: Identities that no longer qualify and will lose access upon recalculation.
- **= Retained**: Existing members whose qualification is unchanged.

---

## Architecture & Features

### 1. In-Tenant Sandboxed Execution
- Seamlessly integrates into SailPoint ISC via the `@sailpoint/ui-plugin-sdk` postMessage bridge.
- Uses modern SailPoint `/v1` REST APIs exclusively:
  - `/sources/v1`: Dynamic source discovery and attribute resolution.
  - `/accounts/v1`: Source-scoped account attribute matching and negation semantics.
  - `/roles/v1`: Role lifecycle, criteria retrieval, and metadata management.
  - `/identities/v1/process`: Dispatches asynchronous tenant identity recalculation tasks.
  - `/search/v1`: Querying identities, nested `@access()` lookups, and assignment polling.

### 2. High-Fidelity Criteria Tree Parser
- Evaluates `IDENTITY`, `ACCOUNT`, and `ENTITLEMENT` criteria nodes.
- Replicates SailPoint ISC native semantics:
  - Case-insensitive string comparisons (`EQUALS`, `CONTAINS`, `STARTS_WITH`, `ENDS_WITH`).
  - Negation semantics (`NOT_EQUALS`, `DOES_NOT_CONTAIN`) with proper handling of missing/null account attributes and identities lacking source accounts.
  - Multi-value arrays and complex nested boolean branches.

### 3. Automated Validation Framework (`tests/`)
- Accompanied by [`Test-IdentityEXERoleCriteria.ps1`](./tests/Test-IdentityEXERoleCriteria.ps1), an automated PowerShell test suite covering **163 comprehensive test cases** documented in [`ROLE_CRITERIA_TEST_CASES.md`](./tests/ROLE_CRITERIA_TEST_CASES.md).
- Validates in-memory parser predictions directly against live tenant assignment results with zero discrepancies.

---

## Getting Started

### Prerequisites
- Node.js `v20+` or `v22+` (npm `10+`)
- SailPoint CLI (`sail`) with experimental UI plugins enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/rettkowskityler/Role-Refresher-IdentityEXE.git
cd Role-Refresher-IdentityEXE

# Install dependencies
npm install
```

### Local Development

Run the Angular development server with SSL (required for ISC iframe embedding):

```bash
npm start
# App serves at https://localhost:4200
```

To link with your live SailPoint tenant:
```bash
# Enable experimental UI plugin features in PowerShell
$env:SAIL_EXPERIMENTAL_UI_PLUGINS = "1"

# Bind local dev server to your tenant session
sail ui-plugins link
```

### Running Tests

Execute the unit test suite (Vitest):

```bash
npm test
```

### Building for Production

Compile static assets into `dist/role-refresher-identityexe/browser`:

```bash
npm run build
```

### Deploying to SailPoint ISC Tenant

Upload compiled assets to your registered plugin instance:

```bash
$env:SAIL_EXPERIMENTAL_UI_PLUGINS = "1"
sail ui-plugins upload
```

---

## Empirical Test Suite

The `tests/` directory contains complete test automation and empirical validation assets:

```powershell
cd tests

# 1. Preview test role payloads without tenant mutations
.\Test-IdentityEXERoleCriteria.ps1 -DryRun

# 2. Run automated validation on a specific category
.\Test-IdentityEXERoleCriteria.ps1 -Category IdentityAttribute -Validate -AutoCleanup
.\Test-IdentityEXERoleCriteria.ps1 -Category Entitlement -Validate -AutoCleanup
.\Test-IdentityEXERoleCriteria.ps1 -Category AccountAttribute -Validate -AutoCleanup
.\Test-IdentityEXERoleCriteria.ps1 -Category MultiType -Validate -AutoCleanup

# 3. List active test roles in tenant
.\Test-IdentityEXERoleCriteria.ps1 -List

# 4. Clean up all test roles
.\Test-IdentityEXERoleCriteria.ps1 -Cleanup
```

Refer to [`tests/ROLE_CRITERIA_TEST_CASES.md`](./tests/ROLE_CRITERIA_TEST_CASES.md) for the full matrix of tested scenarios.

---

## Security

- Sensitive credentials (`creds.json`) and environment secrets are strictly excluded via `.gitignore`.
- Authentication uses short-lived OAuth 2.0 Bearer tokens adhering to least privilege.

---

## License

Developed for Identity Security Cloud environments by Tyler Rettkowski / IdentityEXE.
