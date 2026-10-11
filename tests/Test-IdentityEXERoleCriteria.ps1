<#
.SYNOPSIS
    Test-IdentityEXERoleCriteria.ps1
    Automated empirical validation framework for SailPoint Identity Security Cloud (ISC) Role Criteria.
    Provisions, tests, validates, and cleans up all 163 criteria test cases against live tenant assignments.

.DESCRIPTION
    This script implements and executes the complete test matrix defined in ROLE_CRITERIA_TEST_CASES.md.
    It provisions test roles directly to the configured SailPoint ISC tenant using modern /v1 REST APIs:
      - /sources/v1             : Dynamic tenant source discovery and mapping (AD, HR, PRISM)
      - /accounts/v1            : Source-scoped account attribute retrieval and client-side attribute evaluation
      - /roles/v1               : Role definition creation, listing, and lifecycle management
      - /identities/v1/process  : Tenant-wide asynchronous identity recalculation tasks ("Apply Changes")
      - /search/v1              : Identity querying, nested @access() lookups, and assignment polling

    The script supports:
      - Selective testing by -Category and -TestNumber
      - Automated validation (-Validate) comparing Criteria Parser predictions against live ISC assignments
      - In-memory criteria tree evaluation matching the UI plugin's criteria parser engine
      - Polling and assertion loop with set difference tracking (missing / extra identities)
      - Automatic rate-limiting (429) backoff and retry handling
      - Reusing existing role IDs (-Recreate to force recreation)
      - Automated or manual bulk cleanup (-AutoCleanup / -Cleanup)

.PARAMETER Category
    Filter roles by category: 'All' (default), 'IdentityAttribute', 'Entitlement', 'AccountAttribute', 'MultiType'.

.PARAMETER TestNumber
    Run a specific test case number within the selected category (e.g. -Category IdentityAttribute -TestNumber 1).

.PARAMETER Validate
    Runs the automated validation engine: evaluates expected identities via the criteria parser,
    dispatches tenant-wide identity processing, and polls live role assignments until equivalence is achieved.

.PARAMETER TimeoutMinutes
    Maximum time in minutes to poll for tenant assignment completion during validation (default: 10).

.PARAMETER AutoCleanup
    Automatically deletes all provisioned test roles from the tenant once validation completes.

.PARAMETER SkipApply
    Skips automatic identity processing dispatch (useful when assignments are already processed or triggered manually).

.PARAMETER Recreate
    Forces deletion and recreation of roles that already exist in the tenant (by default, existing roles are reused).

.PARAMETER DryRun
    Previews role payloads and counts without executing any API calls against the tenant.

.PARAMETER List
    Queries and lists all IdentityEXE test roles currently present in the tenant.

.PARAMETER Cleanup
    Deletes all IdentityEXE test roles from the tenant to restore a clean state.

.PARAMETER CredsFile
    Path to the credentials JSON file. Defaults to 'creds.json' in the script directory.

.EXAMPLE
    .\Test-IdentityEXERoleCriteria.ps1 -DryRun
    .\Test-IdentityEXERoleCriteria.ps1 -Category IdentityAttribute -TestNumber 1 -Validate
    .\Test-IdentityEXERoleCriteria.ps1 -Category Entitlement -Validate -AutoCleanup
    .\Test-IdentityEXERoleCriteria.ps1 -Category AccountAttribute -Validate -AutoCleanup
    .\Test-IdentityEXERoleCriteria.ps1 -Category MultiType -Validate -AutoCleanup
    .\Test-IdentityEXERoleCriteria.ps1 -List
    .\Test-IdentityEXERoleCriteria.ps1 -Cleanup
#>

[CmdletBinding(DefaultParameterSetName = 'Test')]
param(
    [Parameter(ParameterSetName = 'Test')]
    [ValidateSet('All', 'IdentityAttribute', 'Entitlement', 'AccountAttribute', 'MultiType')]
    [string]$Category = 'All',

    [Parameter(ParameterSetName = 'Test')]
    [int]$TestNumber = 0,

    [Parameter(ParameterSetName = 'Test')]
    [switch]$Validate,

    [Parameter(ParameterSetName = 'Test')]
    [int]$TimeoutMinutes = 10,

    [Parameter(ParameterSetName = 'Test')]
    [switch]$AutoCleanup,

    [Parameter(ParameterSetName = 'Test')]
    [switch]$SkipApply,

    [Parameter(ParameterSetName = 'Test')]
    [switch]$Recreate,

    [Parameter(ParameterSetName = 'Test')]
    [switch]$DryRun,

    [Parameter(ParameterSetName = 'Cleanup', Mandatory = $true)]
    [switch]$Cleanup,

    [Parameter(ParameterSetName = 'List', Mandatory = $true)]
    [switch]$List,

    [string]$CredsFile = ""
)

$ErrorActionPreference = 'Stop'

if ([string]::IsNullOrWhiteSpace($CredsFile)) {
    $scriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
    $CredsFile = Join-Path $scriptDir "creds.json"
}

# ==============================================================================
# Tenant Configuration & Defaults
# ==============================================================================
$OWNER_ID            = '1bd2386cae9546e29f75adb5145022e3' # samantha.holstine
$AD_SOURCE_ID        = '41e0e50d6ff74103a53652767b2407e6' # Active Directory
$HR_SOURCE_ID        = 'ce415f61064a43319150766c2ff14e07' # HR
$PRISM_SOURCE_ID     = '8ad9d806e6b64849a5a8e79892d98e8b' # PRISM (Secondary source with entitlements)
$ENT_AD_EMPLOYEES    = 'CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com'
$ENT_AD_DEV_ALL      = 'CN=DEV_All,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com'
$ENT_AD_TAX_ACCT     = 'CN=TaxAccounting,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com'
$ENT_AD_ALL_USERS    = 'CN=All_Users,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com'
$ENT_PRISM_INTERNAL  = 'Internal_Employee'
$ENT_PRISM_REPORTS   = 'View_Reports'

# ==============================================================================
# Helper Functions: Dynamic Tenant Source & Owner Resolution via /sources/v1 and /search/v1
# ==============================================================================
function Initialize-TenantSources {
    param($h, $baseUrl)
    Write-Host "[*] Resolving tenant sources via /sources/v1 API..." -ForegroundColor Gray
    try {
        $sourcesResp = Invoke-RestMethod -Uri "$baseUrl/sources/v1?limit=100" -Method Get -Headers $h
        foreach ($s in $sourcesResp) {
            if ($s.name -eq 'Active Directory') {
                $script:AD_SOURCE_ID = $s.id
                Write-Host "    [+] Source mapped: 'Active Directory' -> $($s.id)" -ForegroundColor DarkGray
            }
            elseif ($s.name -eq 'HR') {
                $script:HR_SOURCE_ID = $s.id
                Write-Host "    [+] Source mapped: 'HR' -> $($s.id)" -ForegroundColor DarkGray
            }
            elseif ($s.name -eq 'PRISM') {
                $script:PRISM_SOURCE_ID = $s.id
                Write-Host "    [+] Source mapped: 'PRISM' -> $($s.id)" -ForegroundColor DarkGray
            }
        }
    } catch {
        Write-Warning "Could not dynamically fetch sources from /sources/v1 ($($_.Exception.Message)). Using default constants."
    }
}

function Initialize-TenantOwner {
    param($h, $baseUrl)
    try {
        $ownerSearch = @{
            indices = @("identities")
            query = @{ query = "name:samantha.holstine" }
        } | ConvertTo-Json
        $ownerResp = Invoke-RestMethod -Uri "$baseUrl/search/v1?limit=1" -Method Post -Headers $h -Body $ownerSearch
        if ($ownerResp -and $ownerResp.Count -gt 0 -and $ownerResp[0].id) {
            $script:OWNER_ID = $ownerResp[0].id
        }
    } catch {
        # Fall back to default
    }
}

# ==============================================================================
# Helper Functions: Criteria Construction
# ==============================================================================
function New-LeafCriteria {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet('IDENTITY', 'ACCOUNT', 'ENTITLEMENT')]
        [string]$Type,

        [Parameter(Mandatory = $true)]
        [string]$Property,

        [string]$SourceId = $null,

        [Parameter(Mandatory = $true)]
        [ValidateSet('EQUALS', 'NOT_EQUALS', 'CONTAINS', 'DOES_NOT_CONTAIN', 'STARTS_WITH', 'ENDS_WITH')]
        [string]$Operation,

        [string]$StringValue = $null,
        [string[]]$Values = $null
    )

    $leaf = [ordered]@{
        operation   = $Operation
        key         = [ordered]@{
            type     = $Type
            property = $Property
            sourceId = $(if ([string]::IsNullOrEmpty($SourceId)) { $null } else { $SourceId })
        }
        stringValue = $StringValue
        values      = $Values
        children    = $null
    }

    if ($Values -and $Values.Count -gt 0) {
        $leaf.stringValue = $null
    } else {
        $leaf.values = $null
    }

    return $leaf
}

function New-BranchCriteria {
    param(
        [Parameter(Mandatory = $true)]
        [ValidateSet('AND', 'OR')]
        [string]$Operation,

        [Parameter(Mandatory = $true)]
        [array]$Children
    )

    return [ordered]@{
        operation   = $Operation
        key         = $null
        stringValue = $null
        values      = $null
        children    = $Children
    }
}

# Shorthand Helpers with ISC Semantic Expansion for Multi-Value
function IdLeaf($prop, $op, $val) {
    if ($val -is [array]) {
        if ($op -eq 'EQUALS') {
            return New-LeafCriteria -Type 'IDENTITY' -Property "attribute.$prop" -Operation $op -Values $val
        } elseif ($op -eq 'NOT_EQUALS' -or $op -eq 'DOES_NOT_CONTAIN') {
            $children = @($val | ForEach-Object {
                New-LeafCriteria -Type 'IDENTITY' -Property "attribute.$prop" -Operation $op -StringValue $_
            })
            return AndBranch $children
        } else {
            $children = @($val | ForEach-Object {
                New-LeafCriteria -Type 'IDENTITY' -Property "attribute.$prop" -Operation $op -StringValue $_
            })
            return OrBranch $children
        }
    } else {
        return New-LeafCriteria -Type 'IDENTITY' -Property "attribute.$prop" -Operation $op -StringValue $val
    }
}

function EntLeaf($sourceId, $prop, $op, $val) {
    if ($val -is [array]) {
        if ($op -eq 'EQUALS') {
            return New-LeafCriteria -Type 'ENTITLEMENT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -Values $val
        } elseif ($op -eq 'NOT_EQUALS' -or $op -eq 'DOES_NOT_CONTAIN') {
            $children = @($val | ForEach-Object {
                New-LeafCriteria -Type 'ENTITLEMENT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -StringValue $_
            })
            return AndBranch $children
        } else {
            $children = @($val | ForEach-Object {
                New-LeafCriteria -Type 'ENTITLEMENT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -StringValue $_
            })
            return OrBranch $children
        }
    } else {
        return New-LeafCriteria -Type 'ENTITLEMENT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -StringValue $val
    }
}

function AccLeaf($sourceId, $prop, $op, $val) {
    if ($val -is [array]) {
        if ($op -eq 'EQUALS') {
            return New-LeafCriteria -Type 'ACCOUNT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -Values $val
        } elseif ($op -eq 'NOT_EQUALS' -or $op -eq 'DOES_NOT_CONTAIN') {
            $children = @($val | ForEach-Object {
                New-LeafCriteria -Type 'ACCOUNT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -StringValue $_
            })
            return AndBranch $children
        } else {
            $children = @($val | ForEach-Object {
                New-LeafCriteria -Type 'ACCOUNT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -StringValue $_
            })
            return OrBranch $children
        }
    } else {
        return New-LeafCriteria -Type 'ACCOUNT' -Property "attribute.$prop" -SourceId $sourceId -Operation $op -StringValue $val
    }
}

function AndBranch($children) { return New-BranchCriteria -Operation 'AND' -Children $children }
function OrBranch($children)  { return New-BranchCriteria -Operation 'OR' -Children $children }

# ==============================================================================
# Test Suite Definition Builder (All 163 Test Cases)
# ==============================================================================
function Get-AllTestRoleDefinitions {
    $roles = [System.Collections.Generic.List[PSCustomObject]]::new()

    # --------------------------------------------------------------------------
    # SECTION 1: IDENTITY ATTRIBUTE TEST CASES (1 to 40)
    # --------------------------------------------------------------------------
    # Single Value (1 to 6)
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 1;  Name = 'IdentityEXE - IdentityAttribute Test 1';  Description = 'IdentityAttribute Equals 1 Attribute'; Criteria = IdLeaf 'department' 'EQUALS' 'Human Resources' })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 2;  Name = 'IdentityEXE - IdentityAttribute Test 2';  Description = 'IdentityAttribute Does Not Equal 1 Attribute'; Criteria = IdLeaf 'department' 'NOT_EQUALS' 'Human Resources' })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 3;  Name = 'IdentityEXE - IdentityAttribute Test 3';  Description = 'IdentityAttribute Contains 1 Attribute'; Criteria = IdLeaf 'department' 'CONTAINS' 'Human' })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 4;  Name = 'IdentityEXE - IdentityAttribute Test 4';  Description = 'IdentityAttribute Does Not Contain 1 Attribute'; Criteria = IdLeaf 'department' 'DOES_NOT_CONTAIN' 'Resource' })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 5;  Name = 'IdentityEXE - IdentityAttribute Test 5';  Description = 'IdentityAttribute StartsWith 1 Attribute'; Criteria = IdLeaf 'department' 'STARTS_WITH' 'Hum' })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 6;  Name = 'IdentityEXE - IdentityAttribute Test 6';  Description = 'IdentityAttribute EndsWith 1 Attribute'; Criteria = IdLeaf 'department' 'ENDS_WITH' 'ces' })

    # Multi-Value (7 to 12)
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 7;  Name = 'IdentityEXE - IdentityAttribute Test 7';  Description = 'IdentityAttribute Equals Multi-Value'; Criteria = IdLeaf 'location' 'EQUALS' @('Munich', 'Tokyo') })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 8;  Name = 'IdentityEXE - IdentityAttribute Test 8';  Description = 'IdentityAttribute Does Not Equal Multi-Value'; Criteria = IdLeaf 'location' 'NOT_EQUALS' @('Munich', 'London') })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 9;  Name = 'IdentityEXE - IdentityAttribute Test 9';  Description = 'IdentityAttribute Contains Multi-Value'; Criteria = IdLeaf 'department' 'CONTAINS' @('Human', 'Finance') })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 10; Name = 'IdentityEXE - IdentityAttribute Test 10'; Description = 'IdentityAttribute Does Not Contain Multi-Value'; Criteria = IdLeaf 'department' 'DOES_NOT_CONTAIN' @('Resource', 'Finan') })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 11; Name = 'IdentityEXE - IdentityAttribute Test 11'; Description = 'IdentityAttribute StartsWith Multi-Value'; Criteria = IdLeaf 'location' 'STARTS_WITH' @('Mun', 'Lon') })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 12; Name = 'IdentityEXE - IdentityAttribute Test 12'; Description = 'IdentityAttribute EndsWith Multi-Value'; Criteria = IdLeaf 'location' 'ENDS_WITH' @('ich', 'don') })

    # Pairwise AND (13 to 24)
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 13; Name = 'IdentityEXE - IdentityAttribute Test 13'; Description = 'IdentityAttribute EndsWith AND Equals'; Criteria = AndBranch @((IdLeaf 'department' 'ENDS_WITH' 'ces'), (IdLeaf 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 14; Name = 'IdentityEXE - IdentityAttribute Test 14'; Description = 'IdentityAttribute StartsWith AND Equals'; Criteria = AndBranch @((IdLeaf 'department' 'STARTS_WITH' 'Hum'), (IdLeaf 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 15; Name = 'IdentityEXE - IdentityAttribute Test 15'; Description = 'IdentityAttribute Does Not Contain AND Equals'; Criteria = AndBranch @((IdLeaf 'jobTitle' 'DOES_NOT_CONTAIN' 'Manager'), (IdLeaf 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 16; Name = 'IdentityEXE - IdentityAttribute Test 16'; Description = 'IdentityAttribute Contains AND Equals'; Criteria = AndBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Analyst'), (IdLeaf 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 17; Name = 'IdentityEXE - IdentityAttribute Test 17'; Description = 'IdentityAttribute Does Not Equal AND Equals'; Criteria = AndBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (IdLeaf 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 18; Name = 'IdentityEXE - IdentityAttribute Test 18'; Description = 'IdentityAttribute Equals AND Equals'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (IdLeaf 'location' 'EQUALS' 'Munich')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 19; Name = 'IdentityEXE - IdentityAttribute Test 19'; Description = 'IdentityAttribute StartsWith AND EndsWith'; Criteria = AndBranch @((IdLeaf 'department' 'STARTS_WITH' 'Hum'), (IdLeaf 'location' 'ENDS_WITH' 'ich')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 20; Name = 'IdentityEXE - IdentityAttribute Test 20'; Description = 'IdentityAttribute Contains AND StartsWith'; Criteria = AndBranch @((IdLeaf 'department' 'CONTAINS' 'Res'), (IdLeaf 'location' 'STARTS_WITH' 'Mun')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 21; Name = 'IdentityEXE - IdentityAttribute Test 21'; Description = 'IdentityAttribute Not Equals AND Not Equals'; Criteria = AndBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (IdLeaf 'cloudLifecycleState' 'NOT_EQUALS' 'inactive')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 22; Name = 'IdentityEXE - IdentityAttribute Test 22'; Description = 'IdentityAttribute Equals Multi AND Equals Single'; Criteria = AndBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (IdLeaf 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 23; Name = 'IdentityEXE - IdentityAttribute Test 23'; Description = 'IdentityAttribute Contains Multi AND StartsWith Single'; Criteria = AndBranch @((IdLeaf 'department' 'CONTAINS' @('Human', 'Finance')), (IdLeaf 'location' 'STARTS_WITH' 'Mun')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 24; Name = 'IdentityEXE - IdentityAttribute Test 24'; Description = 'IdentityAttribute Equals Multi AND Equals Multi'; Criteria = AndBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'Tokyo')), (IdLeaf 'department' 'EQUALS' @('Human Resources', 'Sales'))) })

    # Pairwise OR (25 to 34)
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 25; Name = 'IdentityEXE - IdentityAttribute Test 25'; Description = 'IdentityAttribute EndsWith OR Equals'; Criteria = OrBranch @((IdLeaf 'location' 'ENDS_WITH' 'ich'), (IdLeaf 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 26; Name = 'IdentityEXE - IdentityAttribute Test 26'; Description = 'IdentityAttribute StartsWith OR Equals'; Criteria = OrBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (IdLeaf 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 27; Name = 'IdentityEXE - IdentityAttribute Test 27'; Description = 'IdentityAttribute Does Not Contain OR Equals'; Criteria = OrBranch @((IdLeaf 'jobTitle' 'DOES_NOT_CONTAIN' 'Manager'), (IdLeaf 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 28; Name = 'IdentityEXE - IdentityAttribute Test 28'; Description = 'IdentityAttribute Contains OR Equals'; Criteria = OrBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Analyst'), (IdLeaf 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 29; Name = 'IdentityEXE - IdentityAttribute Test 29'; Description = 'IdentityAttribute Does Not Equal OR Equals'; Criteria = OrBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (IdLeaf 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 30; Name = 'IdentityEXE - IdentityAttribute Test 30'; Description = 'IdentityAttribute Equals OR Equals'; Criteria = OrBranch @((IdLeaf 'location' 'EQUALS' 'Munich'), (IdLeaf 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 31; Name = 'IdentityEXE - IdentityAttribute Test 31'; Description = 'IdentityAttribute StartsWith OR EndsWith'; Criteria = OrBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (IdLeaf 'location' 'ENDS_WITH' 'don')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 32; Name = 'IdentityEXE - IdentityAttribute Test 32'; Description = 'IdentityAttribute Contains OR StartsWith'; Criteria = OrBranch @((IdLeaf 'department' 'CONTAINS' 'Res'), (IdLeaf 'location' 'STARTS_WITH' 'Lon')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 33; Name = 'IdentityEXE - IdentityAttribute Test 33'; Description = 'IdentityAttribute Equals Multi OR Equals Single'; Criteria = OrBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (IdLeaf 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 34; Name = 'IdentityEXE - IdentityAttribute Test 34'; Description = 'IdentityAttribute Equals Multi OR Equals Multi'; Criteria = OrBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (IdLeaf 'department' 'EQUALS' @('Finance', 'Sales'))) })

    # Nested Boolean Groups (35 to 40)
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 35; Name = 'IdentityEXE - IdentityAttribute Test 35'; Description = '(Equals AND Equals) OR Equals'; Criteria = OrBranch @((AndBranch @((IdLeaf 'location' 'EQUALS' 'Munich'), (IdLeaf 'department' 'EQUALS' 'Human Resources'))), (IdLeaf 'location' 'EQUALS' 'London')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 36; Name = 'IdentityEXE - IdentityAttribute Test 36'; Description = '(Equals OR Equals) AND Equals'; Criteria = AndBranch @((OrBranch @((IdLeaf 'location' 'EQUALS' 'Munich'), (IdLeaf 'location' 'EQUALS' 'London'))), (IdLeaf 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 37; Name = 'IdentityEXE - IdentityAttribute Test 37'; Description = '3-Child AND Group'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (IdLeaf 'location' 'EQUALS' 'Munich'), (IdLeaf 'country' 'EQUALS' 'DE')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 38; Name = 'IdentityEXE - IdentityAttribute Test 38'; Description = '3-Child OR Group'; Criteria = OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (IdLeaf 'location' 'EQUALS' 'Munich'), (IdLeaf 'country' 'EQUALS' 'DE')) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 39; Name = 'IdentityEXE - IdentityAttribute Test 39'; Description = '(Equals AND Equals) OR (Equals AND Equals)'; Criteria = OrBranch @((AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (IdLeaf 'location' 'EQUALS' 'Munich'))), (AndBranch @((IdLeaf 'department' 'EQUALS' 'Finance'), (IdLeaf 'location' 'EQUALS' 'London')))) })
    $roles.Add([PSCustomObject]@{ Category = 'IdentityAttribute'; Number = 40; Name = 'IdentityEXE - IdentityAttribute Test 40'; Description = '(Equals OR Equals) AND (Equals OR Equals)'; Criteria = AndBranch @((OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (IdLeaf 'department' 'EQUALS' 'Finance'))), (OrBranch @((IdLeaf 'location' 'EQUALS' 'Munich'), (IdLeaf 'location' 'EQUALS' 'London')))) })

    # --------------------------------------------------------------------------
    # SECTION 2: ENTITLEMENT TEST CASES (1 to 21)
    # --------------------------------------------------------------------------
    # Single Value (1 to 4)
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 1;  Name = 'IdentityEXE - Entitlement Test 1';  Description = 'Entitlement Equals Single Entitlement'; Criteria = EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 2;  Name = 'IdentityEXE - Entitlement Test 2';  Description = 'Entitlement Does Not Equal Single Entitlement'; Criteria = EntLeaf $AD_SOURCE_ID 'memberOf' 'NOT_EQUALS' $ENT_AD_EMPLOYEES })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 3;  Name = 'IdentityEXE - Entitlement Test 3';  Description = 'Entitlement Equals Single (Different Source)'; Criteria = EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_ALL_USERS })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 4;  Name = 'IdentityEXE - Entitlement Test 4';  Description = 'Entitlement Does Not Equal Single (Different Source)'; Criteria = EntLeaf $AD_SOURCE_ID 'memberOf' 'NOT_EQUALS' $ENT_AD_ALL_USERS })

    # Multi-Value (5 to 8)
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 5;  Name = 'IdentityEXE - Entitlement Test 5';  Description = 'Entitlement Equals Multi-Value (Both)'; Criteria = EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 6;  Name = 'IdentityEXE - Entitlement Test 6';  Description = 'Entitlement Equals Multi-Value (Tax + Dev)'; Criteria = EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_TAX_ACCT, $ENT_AD_DEV_ALL) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 7;  Name = 'IdentityEXE - Entitlement Test 7';  Description = 'Entitlement Does Not Equal Multi-Value'; Criteria = EntLeaf $AD_SOURCE_ID 'memberOf' 'NOT_EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 8;  Name = 'IdentityEXE - Entitlement Test 8';  Description = 'Cross-Source Entitlement Equals Multi-Value'; Criteria = OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })

    # Pairwise Combinations (9 to 16)
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 9;  Name = 'IdentityEXE - Entitlement Test 9';  Description = 'Entitlement Equals AND Equals'; Criteria = AndBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_TAX_ACCT)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 10; Name = 'IdentityEXE - Entitlement Test 10'; Description = 'Entitlement Equals OR Equals'; Criteria = OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_ALL_USERS)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 11; Name = 'IdentityEXE - Entitlement Test 11'; Description = 'Entitlement Equals AND Not Equals'; Criteria = AndBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $AD_SOURCE_ID 'memberOf' 'NOT_EQUALS' $ENT_AD_DEV_ALL)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 12; Name = 'IdentityEXE - Entitlement Test 12'; Description = 'Cross-Source Entitlement Equals AND Equals'; Criteria = AndBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 13; Name = 'IdentityEXE - Entitlement Test 13'; Description = 'Entitlement Does Not Equal OR Equals'; Criteria = OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'NOT_EQUALS' $ENT_AD_TAX_ACCT), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 14; Name = 'IdentityEXE - Entitlement Test 14'; Description = 'Entitlement Equals Multi OR Equals Single'; Criteria = OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_TAX_ACCT)), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_DEV_ALL)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 15; Name = 'IdentityEXE - Entitlement Test 15'; Description = 'Entitlement Equals Multi OR Equals Multi'; Criteria = OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL)), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_TAX_ACCT, $ENT_AD_ALL_USERS))) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 16; Name = 'IdentityEXE - Entitlement Test 16'; Description = 'Cross-Source Entitlement Equals OR Equals'; Criteria = OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })

    # Complex Nested Entitlement Trees (17 to 21)
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 17; Name = 'IdentityEXE - Entitlement Test 17'; Description = '(Entitlement Equals AND Equals) OR Entitlement Equals'; Criteria = OrBranch @((AndBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_DEV_ALL))), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 18; Name = 'IdentityEXE - Entitlement Test 18'; Description = '(Entitlement Equals OR Equals) AND Entitlement Equals'; Criteria = AndBranch @((OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_DEV_ALL))), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 19; Name = 'IdentityEXE - Entitlement Test 19'; Description = '3-Child Entitlement AND Group'; Criteria = AndBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_DEV_ALL), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 20; Name = 'IdentityEXE - Entitlement Test 20'; Description = '3-Child Entitlement OR Group'; Criteria = OrBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_DEV_ALL), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })
    $roles.Add([PSCustomObject]@{ Category = 'Entitlement'; Number = 21; Name = 'IdentityEXE - Entitlement Test 21'; Description = '(Equals AND Equals) OR (Equals AND Equals) Entitlements'; Criteria = OrBranch @((AndBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL))), (AndBranch @((EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_TAX_ACCT), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_ALL_USERS)))) })

    # --------------------------------------------------------------------------
    # SECTION 3: ACCOUNT ATTRIBUTE TEST CASES (1 to 32)
    # --------------------------------------------------------------------------
    # Single Value (1 to 6)
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 1;  Name = 'IdentityEXE - AccountAttribute Test 1';  Description = 'AccountAttribute Equals 1 Attribute'; Criteria = AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources' })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 2;  Name = 'IdentityEXE - AccountAttribute Test 2';  Description = 'AccountAttribute Does Not Equal 1 Attribute'; Criteria = AccLeaf $AD_SOURCE_ID 'department' 'NOT_EQUALS' 'Human Resources' })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 3;  Name = 'IdentityEXE - AccountAttribute Test 3';  Description = 'AccountAttribute Contains 1 Attribute'; Criteria = AccLeaf $AD_SOURCE_ID 'department' 'CONTAINS' 'Human' })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 4;  Name = 'IdentityEXE - AccountAttribute Test 4';  Description = 'AccountAttribute Does Not Contain 1 Attribute'; Criteria = AccLeaf $AD_SOURCE_ID 'department' 'DOES_NOT_CONTAIN' 'Resource' })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 5;  Name = 'IdentityEXE - AccountAttribute Test 5';  Description = 'AccountAttribute StartsWith 1 Attribute'; Criteria = AccLeaf $AD_SOURCE_ID 'department' 'STARTS_WITH' 'Hum' })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 6;  Name = 'IdentityEXE - AccountAttribute Test 6';  Description = 'AccountAttribute EndsWith 1 Attribute'; Criteria = AccLeaf $AD_SOURCE_ID 'department' 'ENDS_WITH' 'ces' })

    # Multi-Value (7 to 12)
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 7;  Name = 'IdentityEXE - AccountAttribute Test 7';  Description = 'AccountAttribute Equals Multi-Value'; Criteria = AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' @('Munich', 'Tokyo') })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 8;  Name = 'IdentityEXE - AccountAttribute Test 8';  Description = 'AccountAttribute Does Not Equal Multi-Value'; Criteria = AccLeaf $AD_SOURCE_ID 'location' 'NOT_EQUALS' @('Munich', 'London') })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 9;  Name = 'IdentityEXE - AccountAttribute Test 9';  Description = 'AccountAttribute Contains Multi-Value'; Criteria = AccLeaf $AD_SOURCE_ID 'department' 'CONTAINS' @('Human', 'Finance') })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 10; Name = 'IdentityEXE - AccountAttribute Test 10'; Description = 'AccountAttribute Does Not Contain Multi-Value'; Criteria = AccLeaf $AD_SOURCE_ID 'mail' 'DOES_NOT_CONTAIN' @('contractor', 'vendor') })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 11; Name = 'IdentityEXE - AccountAttribute Test 11'; Description = 'AccountAttribute StartsWith Multi-Value'; Criteria = AccLeaf $AD_SOURCE_ID 'location' 'STARTS_WITH' @('Mun', 'Lon') })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 12; Name = 'IdentityEXE - AccountAttribute Test 12'; Description = 'AccountAttribute EndsWith Multi-Value'; Criteria = AccLeaf $AD_SOURCE_ID 'location' 'ENDS_WITH' @('ich', 'don') })

    # AND Combinations (13 to 20)
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 13; Name = 'IdentityEXE - AccountAttribute Test 13'; Description = 'AccountAttribute EndsWith AND Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'location' 'ENDS_WITH' 'ich'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 14; Name = 'IdentityEXE - AccountAttribute Test 14'; Description = 'AccountAttribute StartsWith AND Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'location' 'STARTS_WITH' 'Mun'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 15; Name = 'IdentityEXE - AccountAttribute Test 15'; Description = 'AccountAttribute Does Not Contain AND Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'sAMAccountName' 'DOES_NOT_CONTAIN' 'temp'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 16; Name = 'IdentityEXE - AccountAttribute Test 16'; Description = 'AccountAttribute Contains AND Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'jobTitle' 'CONTAINS' 'Analyst'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 17; Name = 'IdentityEXE - AccountAttribute Test 17'; Description = 'AccountAttribute Does Not Equal AND Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'country' 'NOT_EQUALS' 'US'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 18; Name = 'IdentityEXE - AccountAttribute Test 18'; Description = 'AccountAttribute Equals AND Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 19; Name = 'IdentityEXE - AccountAttribute Test 19'; Description = 'Cross-Source Account Attribute Equals AND Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (AccLeaf $HR_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 20; Name = 'IdentityEXE - AccountAttribute Test 20'; Description = 'AccountAttribute Equals Multi AND Equals Single'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' @('Munich', 'London')), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })

    # OR Combinations (21 to 28)
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 21; Name = 'IdentityEXE - AccountAttribute Test 21'; Description = 'AccountAttribute EndsWith OR Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'location' 'ENDS_WITH' 'ich'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 22; Name = 'IdentityEXE - AccountAttribute Test 22'; Description = 'AccountAttribute StartsWith OR Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'location' 'STARTS_WITH' 'Mun'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 23; Name = 'IdentityEXE - AccountAttribute Test 23'; Description = 'AccountAttribute Does Not Contain OR Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'sAMAccountName' 'DOES_NOT_CONTAIN' 'contractor'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 24; Name = 'IdentityEXE - AccountAttribute Test 24'; Description = 'AccountAttribute Contains OR Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'jobTitle' 'CONTAINS' 'Compen'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 25; Name = 'IdentityEXE - AccountAttribute Test 25'; Description = 'AccountAttribute Does Not Equal OR Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'country' 'NOT_EQUALS' 'US'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 26; Name = 'IdentityEXE - AccountAttribute Test 26'; Description = 'AccountAttribute Equals OR Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 27; Name = 'IdentityEXE - AccountAttribute Test 27'; Description = 'Cross-Source Account Attribute Equals OR Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (AccLeaf $HR_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 28; Name = 'IdentityEXE - AccountAttribute Test 28'; Description = 'AccountAttribute Equals Multi OR Equals Single'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' @('Munich', 'London')), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })

    # Nested Boolean Groups (29 to 32)
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 29; Name = 'IdentityEXE - AccountAttribute Test 29'; Description = '(AccountAttribute Equals AND Equals) OR Equals'; Criteria = OrBranch @((AndBranch @((AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'))), (AccLeaf $AD_SOURCE_ID 'country' 'EQUALS' 'DE')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 30; Name = 'IdentityEXE - AccountAttribute Test 30'; Description = '(AccountAttribute Equals OR Equals) AND Equals'; Criteria = AndBranch @((OrBranch @((AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'London'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Tokyo'))), (AccLeaf $AD_SOURCE_ID 'status' 'EQUALS' 'active')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 31; Name = 'IdentityEXE - AccountAttribute Test 31'; Description = '3-Child AccountAttribute AND Group'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich'), (AccLeaf $AD_SOURCE_ID 'country' 'EQUALS' 'DE')) })
    $roles.Add([PSCustomObject]@{ Category = 'AccountAttribute'; Number = 32; Name = 'IdentityEXE - AccountAttribute Test 32'; Description = '(Equals AND Equals) OR (Equals AND Equals) Cross-Source'; Criteria = OrBranch @((AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich'))), (AndBranch @((AccLeaf $HR_SOURCE_ID 'department' 'EQUALS' 'Finance'), (AccLeaf $HR_SOURCE_ID 'city' 'EQUALS' 'London')))) })

    # --------------------------------------------------------------------------
    # SECTION 4: MULTI-TYPE CROSS-COMBINATIONS (1 to 70)
    # --------------------------------------------------------------------------
    # Part 4.1: Identity + Entitlement (AND) (1 to 10)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 1;  Name = 'IdentityEXE - MultiType Test 1';  Description = 'IdentityAttribute Equals AND Entitlement Equals'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 2;  Name = 'IdentityEXE - MultiType Test 2';  Description = 'IdentityAttribute Not Equals AND Entitlement Equals'; Criteria = AndBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 3;  Name = 'IdentityEXE - MultiType Test 3';  Description = 'IdentityAttribute Contains AND Entitlement Equals'; Criteria = AndBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Analyst'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 4;  Name = 'IdentityEXE - MultiType Test 4';  Description = 'IdentityAttribute Does Not Contain AND Entitlement Equals'; Criteria = AndBranch @((IdLeaf 'jobTitle' 'DOES_NOT_CONTAIN' 'Manager'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 5;  Name = 'IdentityEXE - MultiType Test 5';  Description = 'IdentityAttribute StartsWith AND Entitlement Equals'; Criteria = AndBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 6;  Name = 'IdentityEXE - MultiType Test 6';  Description = 'IdentityAttribute EndsWith AND Entitlement Equals'; Criteria = AndBranch @((IdLeaf 'location' 'ENDS_WITH' 'ich'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 7;  Name = 'IdentityEXE - MultiType Test 7';  Description = 'IdentityAttribute Equals AND Entitlement Does Not Equal'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'NOT_EQUALS' $ENT_AD_DEV_ALL)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 8;  Name = 'IdentityEXE - MultiType Test 8';  Description = 'IdentityAttribute Equals Multi AND Entitlement Equals Single'; Criteria = AndBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'Tokyo')), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 9;  Name = 'IdentityEXE - MultiType Test 9';  Description = 'IdentityAttribute Equals Single AND Entitlement Equals Multi'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL))) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 10; Name = 'IdentityEXE - MultiType Test 10'; Description = 'IdentityAttribute Equals Multi AND Entitlement Equals Multi'; Criteria = AndBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_TAX_ACCT))) })

    # Part 4.2: Identity + Entitlement (OR) (11 to 19)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 11; Name = 'IdentityEXE - MultiType Test 11'; Description = 'IdentityAttribute EndsWith OR Entitlement Equals'; Criteria = OrBranch @((IdLeaf 'location' 'ENDS_WITH' 'ich'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 12; Name = 'IdentityEXE - MultiType Test 12'; Description = 'IdentityAttribute StartsWith OR Entitlement Equals'; Criteria = OrBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 13; Name = 'IdentityEXE - MultiType Test 13'; Description = 'IdentityAttribute Does Not Contain OR Entitlement Equals'; Criteria = OrBranch @((IdLeaf 'location' 'DOES_NOT_CONTAIN' 'US'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 14; Name = 'IdentityEXE - MultiType Test 14'; Description = 'IdentityAttribute Contains OR Entitlement Equals'; Criteria = OrBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Manager'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 15; Name = 'IdentityEXE - MultiType Test 15'; Description = 'IdentityAttribute Does Not Equal OR Entitlement Equals'; Criteria = OrBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 16; Name = 'IdentityEXE - MultiType Test 16'; Description = 'IdentityAttribute Equals OR Entitlement Equals'; Criteria = OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 17; Name = 'IdentityEXE - MultiType Test 17'; Description = 'IdentityAttribute Equals Multi OR Entitlement Equals Single'; Criteria = OrBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 18; Name = 'IdentityEXE - MultiType Test 18'; Description = 'IdentityAttribute Equals Single OR Entitlement Equals Multi'; Criteria = OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL))) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 19; Name = 'IdentityEXE - MultiType Test 19'; Description = 'IdentityAttribute Equals Multi OR Entitlement Equals Multi'; Criteria = OrBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL))) })

    # Part 4.3: Identity + Account (AND) (20 to 29)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 20; Name = 'IdentityEXE - MultiType Test 20'; Description = 'IdentityAttribute Equals AND AccountAttribute Equals'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 21; Name = 'IdentityEXE - MultiType Test 21'; Description = 'IdentityAttribute Not Equals AND AccountAttribute Equals'; Criteria = AndBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 22; Name = 'IdentityEXE - MultiType Test 22'; Description = 'IdentityAttribute Contains AND AccountAttribute Equals'; Criteria = AndBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Analyst'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 23; Name = 'IdentityEXE - MultiType Test 23'; Description = 'IdentityAttribute Does Not Contain AND AccountAttribute Equals'; Criteria = AndBranch @((IdLeaf 'department' 'DOES_NOT_CONTAIN' 'Contract'), (AccLeaf $AD_SOURCE_ID 'domain' 'EQUALS' 'sailpointdemo.com')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 24; Name = 'IdentityEXE - MultiType Test 24'; Description = 'IdentityAttribute StartsWith AND AccountAttribute Equals'; Criteria = AndBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 25; Name = 'IdentityEXE - MultiType Test 25'; Description = 'IdentityAttribute EndsWith AND AccountAttribute Equals'; Criteria = AndBranch @((IdLeaf 'location' 'ENDS_WITH' 'ich'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 26; Name = 'IdentityEXE - MultiType Test 26'; Description = 'IdentityAttribute Equals AND AccountAttribute Does Not Equal'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'location' 'NOT_EQUALS' 'Austin')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 27; Name = 'IdentityEXE - MultiType Test 27'; Description = 'IdentityAttribute Equals Multi AND AccountAttribute Equals Single'; Criteria = AndBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 28; Name = 'IdentityEXE - MultiType Test 28'; Description = 'IdentityAttribute Equals Single AND AccountAttribute Equals Multi'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' @('Munich', 'Tokyo'))) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 29; Name = 'IdentityEXE - MultiType Test 29'; Description = 'IdentityAttribute Equals Multi AND AccountAttribute Equals Multi'; Criteria = AndBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' @('Munich', 'Tokyo'))) })

    # Part 4.4: Identity + Account (OR) (30 to 38)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 30; Name = 'IdentityEXE - MultiType Test 30'; Description = 'IdentityAttribute EndsWith OR AccountAttribute Equals'; Criteria = OrBranch @((IdLeaf 'location' 'ENDS_WITH' 'ich'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 31; Name = 'IdentityEXE - MultiType Test 31'; Description = 'IdentityAttribute StartsWith OR AccountAttribute Equals'; Criteria = OrBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 32; Name = 'IdentityEXE - MultiType Test 32'; Description = 'IdentityAttribute Does Not Contain OR AccountAttribute Equals'; Criteria = OrBranch @((IdLeaf 'jobTitle' 'DOES_NOT_CONTAIN' 'Junior'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Engineering')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 33; Name = 'IdentityEXE - MultiType Test 33'; Description = 'IdentityAttribute Contains OR AccountAttribute Equals'; Criteria = OrBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Manager'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 34; Name = 'IdentityEXE - MultiType Test 34'; Description = 'IdentityAttribute Does Not Equal OR AccountAttribute Equals'; Criteria = OrBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 35; Name = 'IdentityEXE - MultiType Test 35'; Description = 'IdentityAttribute Equals OR AccountAttribute Equals'; Criteria = OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 36; Name = 'IdentityEXE - MultiType Test 36'; Description = 'IdentityAttribute Equals Multi OR AccountAttribute Equals Single'; Criteria = OrBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 37; Name = 'IdentityEXE - MultiType Test 37'; Description = 'IdentityAttribute Equals Single OR AccountAttribute Equals Multi'; Criteria = OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' @('Munich', 'Tokyo'))) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 38; Name = 'IdentityEXE - MultiType Test 38'; Description = 'IdentityAttribute Equals Multi OR AccountAttribute Equals Multi'; Criteria = OrBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' @('Munich', 'Tokyo'))) })

    # Part 4.5: Account + Entitlement (AND) (39 to 45)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 39; Name = 'IdentityEXE - MultiType Test 39'; Description = 'AccountAttribute Equals AND Entitlement Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 40; Name = 'IdentityEXE - MultiType Test 40'; Description = 'AccountAttribute Does Not Equal AND Entitlement Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'NOT_EQUALS' 'Finance'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 41; Name = 'IdentityEXE - MultiType Test 41'; Description = 'AccountAttribute Contains AND Entitlement Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'jobTitle' 'CONTAINS' 'Analyst'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 42; Name = 'IdentityEXE - MultiType Test 42'; Description = 'AccountAttribute StartsWith AND Entitlement Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'mail' 'STARTS_WITH' 't'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 43; Name = 'IdentityEXE - MultiType Test 43'; Description = 'AccountAttribute Equals Multi AND Entitlement Equals Single'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' @('Human Resources', 'Finance')), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 44; Name = 'IdentityEXE - MultiType Test 44'; Description = 'AccountAttribute Equals Single AND Entitlement Equals Multi'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL))) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 45; Name = 'IdentityEXE - MultiType Test 45'; Description = 'Cross-Source AccountAttribute AND Entitlement Equals'; Criteria = AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })

    # Part 4.6: Account + Entitlement (OR) (46 to 52)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 46; Name = 'IdentityEXE - MultiType Test 46'; Description = 'AccountAttribute Equals OR Entitlement Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 47; Name = 'IdentityEXE - MultiType Test 47'; Description = 'AccountAttribute Does Not Equal OR Entitlement Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'department' 'NOT_EQUALS' 'Finance'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 48; Name = 'IdentityEXE - MultiType Test 48'; Description = 'AccountAttribute Contains OR Entitlement Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'jobTitle' 'CONTAINS' 'Manager'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 49; Name = 'IdentityEXE - MultiType Test 49'; Description = 'AccountAttribute StartsWith OR Entitlement Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'mail' 'STARTS_WITH' 'd'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 50; Name = 'IdentityEXE - MultiType Test 50'; Description = 'AccountAttribute Equals Multi OR Entitlement Equals Single'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' @('Human Resources', 'Finance')), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES)) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 51; Name = 'IdentityEXE - MultiType Test 51'; Description = 'AccountAttribute Equals Single OR Entitlement Equals Multi'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' @($ENT_AD_EMPLOYEES, $ENT_AD_DEV_ALL))) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 52; Name = 'IdentityEXE - MultiType Test 52'; Description = 'Cross-Source AccountAttribute OR Entitlement Equals'; Criteria = OrBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $PRISM_SOURCE_ID 'groups' 'EQUALS' $ENT_PRISM_INTERNAL)) })

    # Part 4.7: Tri-Type Combinations (All AND / All OR) (53 to 60)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 53; Name = 'IdentityEXE - MultiType Test 53'; Description = 'Tri-Type All AND (Identity + Entitlement + Account)'; Criteria = AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 54; Name = 'IdentityEXE - MultiType Test 54'; Description = 'Tri-Type All AND with Negation'; Criteria = AndBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 55; Name = 'IdentityEXE - MultiType Test 55'; Description = 'Tri-Type All AND with Contains'; Criteria = AndBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Analyst'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 56; Name = 'IdentityEXE - MultiType Test 56'; Description = 'Tri-Type All AND with StartsWith'; Criteria = AndBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (AccLeaf $AD_SOURCE_ID 'mail' 'STARTS_WITH' 't')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 57; Name = 'IdentityEXE - MultiType Test 57'; Description = 'Tri-Type All OR (Identity + Entitlement + Account)'; Criteria = OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Munich')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 58; Name = 'IdentityEXE - MultiType Test 58'; Description = 'Tri-Type All OR with Negation'; Criteria = OrBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 59; Name = 'IdentityEXE - MultiType Test 59'; Description = 'Tri-Type All OR with Contains'; Criteria = OrBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Manager'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Tokyo')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 60; Name = 'IdentityEXE - MultiType Test 60'; Description = 'Tri-Type All OR with StartsWith'; Criteria = OrBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_DEV_ALL), (AccLeaf $AD_SOURCE_ID 'mail' 'STARTS_WITH' 'd')) })

    # Part 4.8: Tri-Type Nested Mixed Boolean Trees (61 to 70)
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 61; Name = 'IdentityEXE - MultiType Test 61'; Description = '(Identity Equals AND Entitlement Equals) OR Account Equals'; Criteria = OrBranch @((AndBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 62; Name = 'IdentityEXE - MultiType Test 62'; Description = '(Identity Equals OR Entitlement Equals) AND Account Equals'; Criteria = AndBranch @((OrBranch @((IdLeaf 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 63; Name = 'IdentityEXE - MultiType Test 63'; Description = '(Account Equals AND Entitlement Equals) OR Identity Equals'; Criteria = OrBranch @((AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (IdLeaf 'country' 'EQUALS' 'DE')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 64; Name = 'IdentityEXE - MultiType Test 64'; Description = '(Account Equals OR Entitlement Equals) AND Identity Equals'; Criteria = AndBranch @((OrBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (IdLeaf 'cloudLifecycleState' 'EQUALS' 'active')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 65; Name = 'IdentityEXE - MultiType Test 65'; Description = '(Identity Not Equals AND Entitlement Equals) OR Account Equals'; Criteria = OrBranch @((AndBranch @((IdLeaf 'country' 'NOT_EQUALS' 'US'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'Tokyo')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 66; Name = 'IdentityEXE - MultiType Test 66'; Description = '(Identity Contains AND Entitlement Equals) OR Account Equals'; Criteria = OrBranch @((AndBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Analyst'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (AccLeaf $AD_SOURCE_ID 'location' 'EQUALS' 'London')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 67; Name = 'IdentityEXE - MultiType Test 67'; Description = '(Identity StartsWith AND Entitlement Equals) OR Identity Equals'; Criteria = OrBranch @((AndBranch @((IdLeaf 'location' 'STARTS_WITH' 'Mun'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (IdLeaf 'country' 'EQUALS' 'DE')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 68; Name = 'IdentityEXE - MultiType Test 68'; Description = '(Identity EndsWith AND Entitlement Equals) OR Account Equals'; Criteria = OrBranch @((AndBranch @((IdLeaf 'location' 'ENDS_WITH' 'ich'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Human Resources')) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 69; Name = 'IdentityEXE - MultiType Test 69'; Description = '(Identity Multi AND Entitlement) OR (Account AND Identity)'; Criteria = OrBranch @((AndBranch @((IdLeaf 'location' 'EQUALS' @('Munich', 'London')), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_EMPLOYEES))), (AndBranch @((AccLeaf $AD_SOURCE_ID 'department' 'EQUALS' 'Finance'), (IdLeaf 'cloudLifecycleState' 'EQUALS' 'active')))) })
    $roles.Add([PSCustomObject]@{ Category = 'MultiType'; Number = 70; Name = 'IdentityEXE - MultiType Test 70'; Description = '(Identity Contains OR Entitlement) AND (Account StartsWith OR Identity)'; Criteria = AndBranch @((OrBranch @((IdLeaf 'jobTitle' 'CONTAINS' 'Manager'), (EntLeaf $AD_SOURCE_ID 'memberOf' 'EQUALS' $ENT_AD_DEV_ALL))), (OrBranch @((AccLeaf $AD_SOURCE_ID 'mail' 'STARTS_WITH' 'd'), (IdLeaf 'country' 'EQUALS' 'DE')))) })

    return $roles
}

# ==============================================================================
# Main Execution Logic
# ==============================================================================

if (-not (Test-Path $CredsFile)) {
    throw "Credentials file not found at: $CredsFile"
}

$credsRaw = Get-Content -Raw -Path $CredsFile | ConvertFrom-Json
$tenantBaseUrl = $credsRaw.tenantbaseurl.TrimEnd('/')

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host " IdentityEXE - SailPoint ISC Role Criteria Test Provisioner & Validator" -ForegroundColor Cyan
Write-Host " Target Tenant: $tenantBaseUrl" -ForegroundColor Cyan
Write-Host "=================================================================" -ForegroundColor Cyan

# 1. Obtain OAuth Token
$headers = $null
function Get-AuthHeaders {
    Write-Host "[*] Authenticating to SailPoint ISC OAuth endpoint..." -ForegroundColor Gray
    $tokenBody = @{
        grant_type    = 'client_credentials'
        client_id     = $credsRaw.clientid
        client_secret = $credsRaw.clientsecret
    }
    $tokenResp = Invoke-RestMethod -Uri "$tenantBaseUrl/oauth/token" -Method Post -Body $tokenBody
    return @{
        Authorization  = "Bearer $($tokenResp.access_token)"
        'Content-Type' = 'application/json'
    }
}

# Account Cache & Criteria Resolver Engine
$script:AccountCache = @{}

function Get-TenantAccountsForSource {
    param($SourceId, $h, $baseUrl)
    if ($script:AccountCache.ContainsKey($SourceId)) {
        return $script:AccountCache[$SourceId]
    }
    $accounts = [System.Collections.Generic.List[PSCustomObject]]::new()
    $offset = 0
    $limit = 250
    $more = $true
    while ($more) {
        $url = "$baseUrl/accounts/v1?filters=sourceId+eq+%22$SourceId%22&limit=$limit&offset=$offset"
        $resp = Invoke-RestMethod -Uri $url -Method Get -Headers $h
        if ($resp -and $resp.Count -gt 0) {
            foreach ($a in $resp) { $accounts.Add($a) }
            if ($resp.Count -lt $limit) { $more = $false } else { $offset += $limit }
        } else {
            $more = $false
        }
    }
    $script:AccountCache[$SourceId] = $accounts
    return $accounts
}

function Resolve-CriteriaNode {
    param($node, $h, $baseUrl)
    if (-not $node) { return [string[]]@() }

    $rawOp = if ($node.operation) { [string]$node.operation } else { '' }
    $op = $rawOp.ToUpper()

    # Branch Operations (AND / OR)
    if ($op -eq 'AND' -or $op -eq 'OR') {
        $children = @($node.children)
        if ($children.Count -eq 0) { return [string[]]@() }

        $childSets = [System.Collections.Generic.List[object]]::new()
        foreach ($child in $children) {
            $cRes = Resolve-CriteriaNode -node $child -h $h -baseUrl $baseUrl
            $cArr = if ($cRes) { [string[]]$cRes } else { [string[]]@() }
            $childSets.Add($cArr)
        }

        if ($op -eq 'AND') {
            if ($childSets.Count -eq 0) { return [string[]]@() }
            $current = [System.Collections.Generic.HashSet[string]]::new()
            if ($childSets[0]) {
                foreach ($item in $childSets[0]) {
                    if ($item) { [void]$current.Add([string]$item) }
                }
            }
            for ($i = 1; $i -lt $childSets.Count; $i++) {
                $nextSet = [System.Collections.Generic.HashSet[string]]::new()
                if ($childSets[$i]) {
                    foreach ($item in $childSets[$i]) {
                        if ($item) { [void]$nextSet.Add([string]$item) }
                    }
                }
                $current.IntersectWith($nextSet)
            }
            return [string[]]@($current)
        } else {
            $current = [System.Collections.Generic.HashSet[string]]::new()
            foreach ($cs in $childSets) {
                if ($cs) {
                    foreach ($item in $cs) {
                        if ($item) { [void]$current.Add([string]$item) }
                    }
                }
            }
            return [string[]]@($current)
        }
    }

    # Leaf Operations
    if (-not $node.key) { return [string[]]@() }
    $type = [string]$node.key.type
    $prop = ($node.key.property -replace '^attributes?\.', '')
    $sourceId = $node.key.sourceId

    $vals = if ($node.values -and $node.values.Count -gt 0) {
        @($node.values)
    } elseif ($node.stringValue) {
        @($node.stringValue)
    } else {
        @()
    }

    if ($type -eq 'IDENTITY') {
        $field = "attributes.$prop"
        if (@('id', 'name', 'email', 'firstname', 'lastname', 'displayname') -contains $prop.ToLower()) {
            $field = $prop.ToLower()
        }

        $clauses = @()
        foreach ($val in $vals) {
            $escaped = $val -replace '(["\\])', '\$1'
            $c = switch ($op) {
                'EQUALS'           { "$($field).exact:`"$escaped`"" }
                'NOT_EQUALS'       { "(NOT $($field).exact:`"$escaped`")" }
                'CONTAINS'         { "$($field):*$escaped*" }
                'DOES_NOT_CONTAIN' { "(NOT $($field):*$escaped*)" }
                'STARTS_WITH'      { "$($field):$escaped*" }
                'ENDS_WITH'        { "$($field):*$escaped" }
                Default            { "$($field).exact:`"$escaped`"" }
            }
            $clauses += $c
        }

        if ($clauses.Count -eq 0) { return [string[]]@() }
        $joinOp = if ($op -eq 'NOT_EQUALS' -or $op -eq 'DOES_NOT_CONTAIN') { ' AND ' } else { ' OR ' }
        $fullQuery = if ($clauses.Count -gt 1) { "($($clauses -join $joinOp))" } else { $clauses[0] }
        if ($fullQuery -match '\bNOT\b') {
            $fullQuery = "($fullQuery) AND (NOT status:ERROR)"
        }

        if (-not $script:SearchCache) { $script:SearchCache = @{} }
        if ($script:SearchCache.ContainsKey($fullQuery)) {
            return $script:SearchCache[$fullQuery]
        }

        $searchBody = @{ indices = @("identities"); query = @{ query = $fullQuery } } | ConvertTo-Json -Depth 5
        $searchResp = Invoke-RestMethod -Uri "$baseUrl/search/v1?limit=350" -Method Post -Headers $h -Body $searchBody
        $resIds = if ($searchResp -and $searchResp.Count -gt 0) { [string[]]@($searchResp | ForEach-Object { $_.id }) } else { [string[]]@() }
        $script:SearchCache[$fullQuery] = $resIds
        return $resIds
    }
    elseif ($type -eq 'ENTITLEMENT') {
        $clauses = @()
        foreach ($val in $vals) {
            $escaped = $val -replace '(["\\])', '\$1'
            $c = switch ($op) {
                'EQUALS'     { "@access(type:ENTITLEMENT AND source.id:$sourceId AND value.exact:`"$escaped`")" }
                'NOT_EQUALS' { "(NOT @access(type:ENTITLEMENT AND source.id:$sourceId AND value.exact:`"$escaped`"))" }
                Default      { "@access(type:ENTITLEMENT AND source.id:$sourceId AND value.exact:`"$escaped`")" }
            }
            $clauses += $c
        }

        if ($clauses.Count -eq 0) { return [string[]]@() }
        $joinOp = if ($op -eq 'NOT_EQUALS') { ' AND ' } else { ' OR ' }
        $fullQuery = if ($clauses.Count -gt 1) { "($($clauses -join $joinOp))" } else { $clauses[0] }
        if ($fullQuery -match '\bNOT\b') {
            $fullQuery = "($fullQuery) AND (NOT status:ERROR)"
        }

        if (-not $script:SearchCache) { $script:SearchCache = @{} }
        if ($script:SearchCache.ContainsKey($fullQuery)) {
            return $script:SearchCache[$fullQuery]
        }

        $searchBody = @{ indices = @("identities"); query = @{ query = $fullQuery } } | ConvertTo-Json -Depth 5
        $searchResp = Invoke-RestMethod -Uri "$baseUrl/search/v1?limit=350" -Method Post -Headers $h -Body $searchBody
        $resIds = if ($searchResp -and $searchResp.Count -gt 0) { [string[]]@($searchResp | ForEach-Object { $_.id }) } else { [string[]]@() }
        $script:SearchCache[$fullQuery] = $resIds
        return $resIds
    }
    elseif ($type -eq 'ACCOUNT') {
        if (-not $script:ValidIdentityIds) {
            $allResp = Invoke-RestMethod -Uri "$baseUrl/search/v1?limit=500" -Method Post -Headers $h -Body (@{ indices = @("identities"); query = @{ query = "(NOT status:ERROR)" } } | ConvertTo-Json)
            $script:ValidIdentityIds = [System.Collections.Generic.HashSet[string]]::new()
            foreach ($item in $allResp) {
                if ($item.id) { [void]$script:ValidIdentityIds.Add([string]$item.id) }
            }
        }

        $accounts = Get-TenantAccountsForSource -SourceId $sourceId -h $h -baseUrl $baseUrl

        if ($op -eq 'NOT_EQUALS' -or $op -eq 'DOES_NOT_CONTAIN') {
            $disqualifyingIdentities = [System.Collections.Generic.HashSet[string]]::new()
            foreach ($acc in $accounts) {
                if (-not $acc.identityId) { continue }
                $rawVal = $acc.attributes.$prop
                if ($rawVal -eq $null) { continue }
                $actList = if ($rawVal -is [System.Collections.IEnumerable] -and $rawVal -isnot [string]) {
                    @($rawVal | ForEach-Object { [string]$_ })
                } else {
                    @([string]$rawVal)
                }
                foreach ($expected in $vals) {
                    foreach ($actual in $actList) {
                        if ($op -eq 'NOT_EQUALS' -and $actual -eq $expected) { [void]$disqualifyingIdentities.Add([string]$acc.identityId); break }
                        if ($op -eq 'DOES_NOT_CONTAIN' -and $actual -like "*$expected*") { [void]$disqualifyingIdentities.Add([string]$acc.identityId); break }
                    }
                }
            }
            $matchedIdentities = [System.Collections.Generic.HashSet[string]]::new($script:ValidIdentityIds)
            $matchedIdentities.ExceptWith($disqualifyingIdentities)
            return [string[]]@($matchedIdentities)
        } else {
            $matchedIdentities = [System.Collections.Generic.HashSet[string]]::new()
            foreach ($acc in $accounts) {
                if (-not $acc.identityId) { continue }
                if ($script:ValidIdentityIds -and -not $script:ValidIdentityIds.Contains([string]$acc.identityId)) { continue }
                $rawVal = $acc.attributes.$prop
                if ($rawVal -eq $null) { continue }
                $actList = if ($rawVal -is [System.Collections.IEnumerable] -and $rawVal -isnot [string]) {
                    @($rawVal | ForEach-Object { [string]$_ })
                } else {
                    @([string]$rawVal)
                }
                $isMatch = $false
                foreach ($expected in $vals) {
                    foreach ($actual in $actList) {
                        if ($op -eq 'EQUALS' -and $actual -eq $expected) { $isMatch = $true; break }
                        if ($op -eq 'CONTAINS' -and $actual -like "*$expected*") { $isMatch = $true; break }
                        if ($op -eq 'STARTS_WITH' -and $actual -like "$expected*") { $isMatch = $true; break }
                        if ($op -eq 'ENDS_WITH' -and $actual -like "*$expected") { $isMatch = $true; break }
                    }
                    if ($isMatch) { break }
                }
                if ($isMatch) {
                    [void]$matchedIdentities.Add([string]$acc.identityId)
                }
            }
            return [string[]]@($matchedIdentities)
        }
    }

    return [string[]]@()
}

function Invoke-TenantIdentityProcessing {
    param($h, $baseUrl)
    Write-Host "`n[*] Triggering 'Apply Changes' by dispatching identity processing across tenant (/identities/v1/process)..." -ForegroundColor Cyan
    $body = @{ indices = @("identities"); query = @{ query = "*" } } | ConvertTo-Json
    $allResp = Invoke-RestMethod -Uri "$baseUrl/search/v1?limit=500" -Method Post -Headers $h -Body $body
    $allIds = @($allResp | ForEach-Object { $_.id })
    Write-Host "    Found $($allIds.Count) identities to recalculate." -ForegroundColor Gray

    $taskIds = @()
    $batchSize = 250
    $expHeaders = @{}
    foreach ($k in $h.Keys) { $expHeaders[$k] = $h[$k] }
    $expHeaders['X-SailPoint-Experimental'] = 'true'

    for ($i = 0; $i -lt $allIds.Count; $i += $batchSize) {
        $batch = $allIds[$i..[Math]::Min($i + $batchSize - 1, $allIds.Count - 1)]
        $procBody = @{ identityIds = $batch } | ConvertTo-Json
        try {
            $task = Invoke-RestMethod -Uri "$baseUrl/identities/v1/process" -Method Post -Headers $expHeaders -Body $procBody
            $taskIds += $task.id
            Write-Host "    [+] Dispatched batch ($($batch.Count) identities) -> Task ID: $($task.id)" -ForegroundColor Green
        } catch {
            Write-Warning "Could not dispatch batch: $($_.Exception.Message)"
        }
    }
    return $taskIds
}

# Helper to fetch existing IdentityEXE roles with pagination using /roles/v1
function Get-ExistingIdentityEXERoles($headers) {
    $existing = [System.Collections.Generic.List[PSCustomObject]]::new()
    $offset = 0
    $limit = 250
    $more = $true

    while ($more) {
        $url = "$tenantBaseUrl/roles/v1?filters=name+sw+%22IdentityEXE%22&limit=$limit&offset=$offset"
        $resp = Invoke-RestMethod -Uri $url -Method Get -Headers $headers
        if ($resp -and $resp.Count -gt 0) {
            foreach ($r in $resp) { $existing.Add($r) }
            if ($resp.Count -lt $limit) { $more = $false } else { $offset += $limit }
        } else {
            $more = $false
        }
    }
    return $existing
}

# ------------------------------------------------------------------------------
# Action: CLEANUP
# ------------------------------------------------------------------------------
if ($Cleanup) {
    $headers = Get-AuthHeaders
    Write-Host "`n[*] Querying existing IdentityEXE test roles for cleanup via /roles/v1..." -ForegroundColor Yellow
    $existingRoles = @(Get-ExistingIdentityEXERoles $headers)
    Write-Host "    Found $($existingRoles.Count) existing test roles in tenant." -ForegroundColor Gray

    if ($existingRoles.Count -eq 0) {
        Write-Host "[+] Tenant is already clean! No IdentityEXE roles found." -ForegroundColor Green
        return
    }

    $deletedCount = 0
    foreach ($role in $existingRoles) {
        $retries = 3
        while ($retries -gt 0) {
            try {
                Write-Host "    [-] Deleting role: $($role.name) (ID: $($role.id))..." -ForegroundColor DarkYellow
                $null = Invoke-RestMethod -Uri "$tenantBaseUrl/roles/v1/$($role.id)" -Method Delete -Headers $headers
                $deletedCount++
                Start-Sleep -Milliseconds 250
                break
            } catch {
                if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 429) {
                    Write-Warning "Rate limited (429) while deleting $($role.name). Waiting 3 seconds..."
                    Start-Sleep -Seconds 3
                    $retries--
                } else {
                    Write-Host "    [!] Failed to delete role '$($role.name)': $($_.Exception.Message)" -ForegroundColor Red
                    break
                }
            }
        }
    }
    Write-Host "`n[+] Cleanup complete! Deleted $deletedCount role(s)." -ForegroundColor Green
    return
}

# ------------------------------------------------------------------------------
# Action: LIST
# ------------------------------------------------------------------------------
if ($List) {
    $headers = Get-AuthHeaders
    Write-Host "`n[*] Querying active IdentityEXE test roles in tenant via /roles/v1..." -ForegroundColor Cyan
    $existingRoles = @(Get-ExistingIdentityEXERoles $headers)

    if ($existingRoles.Count -eq 0) {
        Write-Host "    No IdentityEXE test roles found in tenant." -ForegroundColor Yellow
        return
    }

    $existingRoles | Select-Object -Property id, name, enabled, @{N='Created';E={$_.created}} | Format-Table -AutoSize
    Write-Host "`nTotal Active IdentityEXE Roles: $($existingRoles.Count)" -ForegroundColor Green
    return
}

# ------------------------------------------------------------------------------
# Action: TEST / VALIDATE / DRY RUN
# ------------------------------------------------------------------------------

# Authenticate and resolve dynamic tenant configuration
$headers = $null
if (-not $DryRun) {
    $headers = Get-AuthHeaders
    Initialize-TenantSources -h $headers -baseUrl $tenantBaseUrl
    Initialize-TenantOwner -h $headers -baseUrl $tenantBaseUrl
}

$allDefs = Get-AllTestRoleDefinitions

# Filter definitions based on Category and TestNumber
$targets = @($allDefs)
if ($Category -ne 'All') {
    $targets = @($targets | Where-Object { $_.Category -eq $Category })
}
if ($TestNumber -gt 0) {
    $targets = @($targets | Where-Object { $_.Number -eq $TestNumber })
}

Write-Host "`n[*] Selected Test Cases: $($targets.Count) role(s) to process." -ForegroundColor Cyan
if ($targets.Count -eq 0) {
    Write-Warning "No test cases matched the selected criteria (Category: $Category, TestNumber: $TestNumber)."
    return
}

if ($DryRun) {
    Write-Host "`n[DRY RUN MODE] The following $($targets.Count) role(s) would be provisioned:" -ForegroundColor Yellow
    foreach ($t in $targets) {
        Write-Host "`n-----------------------------------------------------------------" -ForegroundColor Gray
        Write-Host "Role: $($t.Name)" -ForegroundColor Green
        Write-Host "Category: $($t.Category) | Test #: $($t.Number)" -ForegroundColor Gray
        Write-Host "Description: $($t.Description)" -ForegroundColor Gray
        Write-Host "Payload Preview:" -ForegroundColor Cyan
        $previewObj = [ordered]@{
            name        = $t.Name
            description = $t.Description
            owner       = @{ type = 'IDENTITY'; id = $OWNER_ID }
            enabled     = $true
            membership  = @{
                type     = 'STANDARD'
                criteria = $t.Criteria
            }
        }
        $previewObj | ConvertTo-Json -Depth 10 | Write-Host
    }
    Write-Host "`n[DRY RUN COMPLETE] Total evaluated definitions: $($targets.Count). No changes were made." -ForegroundColor Green
    return
}

# Live Execution: Query existing roles to avoid duplicates
Write-Host "`n[*] Checking tenant for existing IdentityEXE roles via /roles/v1..." -ForegroundColor Gray
$existingRoles = @(Get-ExistingIdentityEXERoles $headers)
$existingMap = @{}
foreach ($r in $existingRoles) {
    $existingMap[$r.name] = $r.id
}

Write-Host "    Found $($existingRoles.Count) existing test role(s) in tenant." -ForegroundColor Gray
Write-Host "`n[*] Beginning upload of $($targets.Count) test role(s)..." -ForegroundColor Cyan

$successCount = 0
$skippedCount = 0
$failedCount  = 0
$results = [System.Collections.Generic.List[PSCustomObject]]::new()

$idx = 0
foreach ($t in $targets) {
    $idx++
    $progressPercent = [math]::Round(($idx / $targets.Count) * 100)
    Write-Progress -Activity "Uploading IdentityEXE Test Roles" -Status "Role $idx of $($targets.Count): $($t.Name)" -PercentComplete $progressPercent

    # If role already exists, reuse it unless -Recreate is specified
    if ($existingMap.ContainsKey($t.Name)) {
        $existingId = $existingMap[$t.Name]
        if (-not $Recreate) {
            Write-Host "    [=] [$idx/$($targets.Count)] Role already exists: $($t.Name) -> ID: $existingId (reusing)" -ForegroundColor Cyan
            $successCount++
            $results.Add([PSCustomObject]@{
                TestNumber = $t.Number
                Category   = $t.Category
                Name       = $t.Name
                Status     = 'Created'
                RoleId     = $existingId
            })
            continue
        } else {
            try {
                Write-Host "    [*] Recreating existing role '$($t.Name)' (Old ID: $existingId)..." -ForegroundColor Gray
                $null = Invoke-RestMethod -Uri "$tenantBaseUrl/roles/v1/$existingId" -Method Delete -Headers $headers
                Start-Sleep -Milliseconds 200
            } catch {
                Write-Warning "Could not delete old role $($existingId): $($_.Exception.Message)"
            }
        }
    }

    $payload = [ordered]@{
        name        = $t.Name
        description = $t.Description
        owner       = [ordered]@{
            type = 'IDENTITY'
            id   = $OWNER_ID
        }
        enabled     = $true
        membership  = [ordered]@{
            type     = 'STANDARD'
            criteria = $t.Criteria
        }
    } | ConvertTo-Json -Depth 10

    $created = $null
    $createRetries = 3
    while ($createRetries -gt 0) {
        try {
            $created = Invoke-RestMethod -Uri "$tenantBaseUrl/roles/v1" -Method Post -Headers $headers -Body $payload
            Write-Host "    [+] [$idx/$($targets.Count)] Created: $($t.Name) -> ID: $($created.id)" -ForegroundColor Green
            $successCount++
            $results.Add([PSCustomObject]@{
                TestNumber = $t.Number
                Category   = $t.Category
                Name       = $t.Name
                Status     = 'Created'
                RoleId     = $created.id
            })
            Start-Sleep -Milliseconds 250
            break
        } catch {
            if ($_.Exception.Response -and $_.Exception.Response.StatusCode.value__ -eq 429) {
                Write-Warning "Rate limited (429) while creating $($t.Name). Waiting 3 seconds..."
                Start-Sleep -Seconds 3
                $createRetries--
            } else {
                $errMsg = if ($_.ErrorDetails -and $_.ErrorDetails.Message) { $_.ErrorDetails.Message } else { $_.Exception.Message }
                Write-Host "    [!] [$idx/$($targets.Count)] FAILED: $($t.Name) -> $errMsg" -ForegroundColor Red
                $failedCount++
                $results.Add([PSCustomObject]@{
                    TestNumber = $t.Number
                    Category   = $t.Category
                    Name       = $t.Name
                    Status     = 'Failed'
                    RoleId     = $null
                })
                break
            }
        }
    }
}

Write-Progress -Activity "Uploading IdentityEXE Test Roles" -Completed

Write-Host "`n=================================================================" -ForegroundColor Cyan
Write-Host " Upload Summary" -ForegroundColor Cyan
Write-Host " Total Attempted : $($targets.Count)" -ForegroundColor Gray
Write-Host " Success         : $successCount" -ForegroundColor Green
Write-Host " Failed          : $failedCount" -ForegroundColor $(if ($failedCount -gt 0) { 'Red' } else { 'Gray' })
Write-Host "=================================================================" -ForegroundColor Cyan

if ($results.Count -le 25) {
    $results | Format-Table -AutoSize
} else {
    Write-Host "`nSample of created roles (first 10):" -ForegroundColor Gray
    $results | Select-Object -First 10 | Format-Table -AutoSize
}

Write-Host "`nNext Steps for Validation:" -ForegroundColor Yellow
Write-Host "1. To run full automated validation with Criteria Parser & Apply Changes:" -ForegroundColor Cyan
Write-Host "   .\Test-IdentityEXERoleCriteria.ps1 -Category IdentityAttribute -TestNumber 1 -Validate" -ForegroundColor Cyan
Write-Host "2. Open the deployed UI Plugin simulator in your browser:" -ForegroundColor Gray
Write-Host "   https://devrel-ga-25045.identitynow-demo.com/ui/plugin/56fbe377-aea9-4fe2-ab84-450ae289ba50" -ForegroundColor Cyan
Write-Host "3. Once finished testing, run: .\Test-IdentityEXERoleCriteria.ps1 -Cleanup" -ForegroundColor Yellow

# ------------------------------------------------------------------------------
# Action: VALIDATION (Criteria Parser Evaluation + Apply Changes + Polling)
# ------------------------------------------------------------------------------
if ($Validate) {
    Write-Host "`n=================================================================" -ForegroundColor Magenta
    Write-Host " Automated Validation Engine" -ForegroundColor Magenta
    Write-Host " 1. Running Criteria Parser to calculate expected identity matches" -ForegroundColor Magenta
    Write-Host " 2. Applying changes across tenant identities via /identities/v1/process" -ForegroundColor Magenta
    Write-Host " 3. Polling live role assignments for up to $TimeoutMinutes minutes via /search/v1" -ForegroundColor Magenta
    Write-Host "=================================================================" -ForegroundColor Magenta

    # Filter to successfully created roles
    $rolesToValidate = @($results | Where-Object { $_.Status -eq 'Created' -and $_.RoleId })
    if ($rolesToValidate.Count -eq 0) {
        Write-Warning "No roles were successfully created to validate."
        return
    }

    # Map created role ID to test definition
    $roleDefMap = @{}
    foreach ($t in $targets) {
        $matchingRes = $rolesToValidate | Where-Object { $_.Name -eq $t.Name }
        if ($matchingRes) {
            $roleDefMap[$matchingRes.RoleId] = $t
        }
    }

    # Step 1: Run Criteria Parser for each role
    Write-Host "`n[*] Phase 1: Evaluating role criteria trees with criteria parser..." -ForegroundColor Cyan
    $predictions = @{}
    $predIdx = 0
    foreach ($r in $rolesToValidate) {
        $predIdx++
        $t = $roleDefMap[$r.RoleId]
        $pct = [int]([math]::Round(($predIdx / $rolesToValidate.Count) * 100))
        Write-Progress -Activity "Evaluating Criteria Parser" -Status "Role $predIdx of $($rolesToValidate.Count): $($t.Name)" -PercentComplete $pct

        $predIds = Resolve-CriteriaNode -node $t.Criteria -h $headers -baseUrl $tenantBaseUrl
        $predSet = [System.Collections.Generic.HashSet[string]]::new()
        if ($predIds) {
            foreach ($predId in $predIds) {
                if ($predId) { [void]$predSet.Add([string]$predId) }
            }
        }
        $predictions[$r.RoleId] = @{
            TestNumber   = $t.Number
            Category     = $t.Category
            Name         = $t.Name
            PredictedIds = $predSet
        }
        Write-Host "    [Parser] $($t.Name): $($predSet.Count) predicted matching identity/identities." -ForegroundColor Gray
    }
    Write-Progress -Activity "Evaluating Criteria Parser" -Completed

    # Step 2: Trigger "Apply Changes"
    if (-not $SkipApply) {
        $taskIds = Invoke-TenantIdentityProcessing -h $headers -baseUrl $tenantBaseUrl
        Write-Host "    Dispatched $($taskIds.Count) identity processing task(s)." -ForegroundColor Gray
        Write-Host "    (Optional: You can also click 'Apply Changes' in the ISC Admin Portal under Access -> Roles)." -ForegroundColor DarkGray
    } else {
        Write-Host "`n[*] Skipping automatic identity processing dispatch (-SkipApply was specified)." -ForegroundColor Yellow
        Write-Host "    Please ensure you click 'Apply Changes' in the ISC Admin Portal (Access -> Roles) to trigger identity assignment." -ForegroundColor Yellow
    }

    # Step 3: Polling and comparison loop (up to TimeoutMinutes)
    Write-Host "`n[*] Phase 3: Polling live tenant assignments (Timeout: $TimeoutMinutes minutes)..." -ForegroundColor Cyan
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $timeoutSec = $TimeoutMinutes * 60
    $pollIntervalSec = 15
    $allMatched = $false

    $finalEvaluation = @()

    while ($stopwatch.Elapsed.TotalSeconds -lt $timeoutSec -and -not $allMatched) {
        Start-Sleep -Seconds $pollIntervalSec
        $elapsedSec = [int]$stopwatch.Elapsed.TotalSeconds

        $currentRound = @()
        $pendingCount = 0

        # Query all identities with ANY IdentityEXE role in a single fast call
        $batchSearchQuery = @{
            indices = @("identities")
            query = @{ query = "@access(type:ROLE AND name:IdentityEXE*)" }
        } | ConvertTo-Json -Depth 5
        $batchSearchResp = Invoke-RestMethod -Uri "$tenantBaseUrl/search/v1?limit=500" -Method Post -Headers $headers -Body $batchSearchQuery

        $actualRoleAssignments = @{}
        foreach ($r in $rolesToValidate) {
            $actualRoleAssignments[$r.RoleId] = [System.Collections.Generic.HashSet[string]]::new()
        }
        foreach ($identity in $batchSearchResp) {
            if ($identity.access) {
                foreach ($acc in $identity.access) {
                    if ($acc.type -eq 'ROLE' -and $actualRoleAssignments.ContainsKey($acc.id)) {
                        [void]$actualRoleAssignments[$acc.id].Add([string]$identity.id)
                    }
                }
            }
        }

        foreach ($r in $rolesToValidate) {
            $predInfo = $predictions[$r.RoleId]
            $predSet = $predInfo.PredictedIds
            $actualSet = $actualRoleAssignments[$r.RoleId]

            # Compute set differences
            $missing = [System.Collections.Generic.HashSet[string]]::new($predSet)
            $missing.ExceptWith($actualSet) # in predicted, not in actual

            $extra = [System.Collections.Generic.HashSet[string]]::new($actualSet)
            $extra.ExceptWith($predSet) # in actual, not in predicted

            $isMatch = ($missing.Count -eq 0 -and $extra.Count -eq 0)
            if (-not $isMatch) { $pendingCount++ }

            $currentRound += [PSCustomObject]@{
                TestNumber     = $predInfo.TestNumber
                Category       = $predInfo.Category
                Name           = $predInfo.Name
                PredictedCount = $predSet.Count
                ActualCount    = $actualSet.Count
                MissingCount   = $missing.Count
                ExtraCount     = $extra.Count
                Status         = if ($isMatch) { 'PASS' } else { 'PENDING' }
                MissingIds     = [string[]]@($missing)
                ExtraIds       = [string[]]@($extra)
            }
        }

        $finalEvaluation = $currentRound
        $passCount = $rolesToValidate.Count - $pendingCount
        Write-Host "    [${elapsedSec}s elapsed] Status: $passCount of $($rolesToValidate.Count) roles matched 100% ($pendingCount pending)..." -ForegroundColor $(if ($pendingCount -eq 0) { 'Green' } else { 'Yellow' })

        if ($pendingCount -eq 0) {
            $allMatched = $true
            Write-Host "`n[+] SUCCESS: All $($rolesToValidate.Count) roles matched criteria parser predictions exactly!" -ForegroundColor Green
            break
        }
    }

    if (-not $allMatched) {
        Write-Warning "Timed out after $TimeoutMinutes minutes. Some roles did not reach zero difference."
    }

    # Step 4: Final Report
    Write-Host "`n=================================================================" -ForegroundColor Cyan
    Write-Host " Validation Test Report Summary" -ForegroundColor Cyan
    Write-Host " Elapsed Time: $([int]$stopwatch.Elapsed.TotalSeconds)s / Max: ${timeoutSec}s" -ForegroundColor Gray
    Write-Host "=================================================================" -ForegroundColor Cyan

    $finalEvaluation | Select-Object -Property TestNumber, Category, PredictedCount, ActualCount, MissingCount, ExtraCount, Status, Name | Format-Table -AutoSize

    # Report discrepancies if any
    $failedRoles = @($finalEvaluation | Where-Object { $_.Status -ne 'PASS' })
    if ($failedRoles.Count -gt 0) {
        Write-Host "`n[!] Discrepancies Details:" -ForegroundColor Red
        foreach ($f in $failedRoles) {
            Write-Host "  - Role: $($f.Name)" -ForegroundColor Yellow
            if ($f.MissingCount -gt 0) {
                Write-Host "    Missing (Predicted by parser but not assigned by tenant): $($f.MissingCount) identities" -ForegroundColor Red
            }
            if ($f.ExtraCount -gt 0) {
                Write-Host "    Extra (Assigned by tenant but not predicted by parser): $($f.ExtraCount) identities" -ForegroundColor Red
            }
        }
    }

    # Step 5: AutoCleanup if requested
    if ($AutoCleanup) {
        Write-Host "`n[*] -AutoCleanup specified. Cleaning up test roles from tenant..." -ForegroundColor Yellow
        foreach ($r in $rolesToValidate) {
            try {
                $null = Invoke-RestMethod -Uri "$tenantBaseUrl/roles/v1/$($r.RoleId)" -Method Delete -Headers $headers
                Write-Host "    [-] Deleted role: $($r.Name) ($($r.RoleId))" -ForegroundColor DarkYellow
            } catch {
                Write-Warning "Could not delete role $($r.RoleId): $($_.Exception.Message)"
            }
        }
        Write-Host "[+] Auto-cleanup finished!" -ForegroundColor Green
    }
}
