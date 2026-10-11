# IdentityEXE — Comprehensive Role Criteria Test Suite

**Document Version:** 1.0.0  
**Target Platform:** SailPoint Identity Security Cloud (ISC) & IdentityEXE Role Refresher Simulator  
**Tenant Environment:** `devrel-ga-25045` (`https://devrel-ga-25045.identitynow-demo.com`)  
**Active Test Owner:** `samantha.holstine` (`1bd2386cae9546e29f75adb5145022e3`)  
**Target Connected Sources:**
- **Active Directory**: `41e0e50d6ff74103a53652767b2407e6`
- **HR**: `ce415f61064a43319150766c2ff14e07`
- **IdentityNow (Internal)**: `c5eb4b7f032c49599750bf42b48de250`

---

## 📋 Table of Contents
1. [Overview & Testing Methodology](#overview--testing-methodology)
2. [Section 1: Identity Attribute Test Cases (40 Cases)](#section-1-identity-attribute-test-cases)
   - [Part 1.1: Single Attribute — Single Value Operations (Tests 1–6)](#part-11-single-attribute--single-value-operations)
   - [Part 1.2: Single Attribute — Multi-Value Operations (Tests 7–12)](#part-12-single-attribute--multi-value-operations)
   - [Part 1.3: Pairwise AND Combinations (Tests 13–24)](#part-13-pairwise-and-combinations)
   - [Part 1.4: Pairwise OR Combinations (Tests 25–34)](#part-14-pairwise-or-combinations)
   - [Part 1.5: Nested Boolean Trees & Multi-Child Groups (Tests 35–40)](#part-15-nested-boolean-trees--multi-child-groups)
3. [Section 2: Entitlement Test Cases (21 Cases)](#section-2-entitlement-test-cases)
   - [Part 2.1: Single Entitlement — Single Value Operations (Tests 1–2)](#part-21-single-entitlement--single-value-operations)
   - [Part 2.2: Single Entitlement — Multi-Value Operations (Tests 3–4)](#part-22-single-entitlement--multi-value-operations)
   - [Part 2.3: AND Combinations (Tests 5–11)](#part-23-and-combinations)
   - [Part 2.4: OR Combinations (Tests 12–16)](#part-24-or-combinations)
   - [Part 2.5: Complex Nested Entitlement Trees (Tests 17–21)](#part-25-complex-nested-entitlement-trees)
4. [Section 3: Account Attribute Test Cases (32 Cases)](#section-3-account-attribute-test-cases)
   - [Part 3.1: Single Account Attribute — Single Value Operations (Tests 1–6)](#part-31-single-account-attribute--single-value-operations)
   - [Part 3.2: Single Account Attribute — Multi-Value Operations (Tests 7–12)](#part-32-single-account-attribute--multi-value-operations)
   - [Part 3.3: AND Combinations (Tests 13–20)](#part-33-and-combinations)
   - [Part 3.4: OR Combinations (Tests 21–28)](#part-34-or-combinations)
   - [Part 3.5: Nested Boolean Groups (Tests 29–32)](#part-35-nested-boolean-groups)
5. [Section 4: Multi-Type Cross-Combinations (70 Cases)](#section-4-multi-type-cross-combinations)
   - [Part 4.1: Identity Attribute + Entitlement (AND) (Tests 1–10)](#part-41-identity-attribute--entitlement-and)
   - [Part 4.2: Identity Attribute + Entitlement (OR) (Tests 11–19)](#part-42-identity-attribute--entitlement-or)
   - [Part 4.3: Identity Attribute + Account Attribute (AND) (Tests 20–29)](#part-43-identity-attribute--account-attribute-and)
   - [Part 4.4: Identity Attribute + Account Attribute (OR) (Tests 30–38)](#part-44-identity-attribute--account-attribute-or)
   - [Part 4.5: Account Attribute + Entitlement (AND) (Tests 39–45)](#part-45-account-attribute--entitlement-and)
   - [Part 4.6: Account Attribute + Entitlement (OR) (Tests 46–52)](#part-46-account-attribute--entitlement-or)
   - [Part 4.7: Tri-Type Combinations (All AND / All OR) (Tests 53–60)](#part-47-tri-type-combinations-all-and--all-or)
   - [Part 4.8: Tri-Type Nested Mixed Boolean Trees (Tests 61–70)](#part-48-tri-type-nested-mixed-boolean-trees)
6. [PowerShell Upload & Teardown Execution Guide](#powershell-upload--teardown-execution-guide)

---

## Overview & Testing Methodology

### Objectives
1. **Empirical Tenant Validation**: Validate every criteria type and boolean combination by creating real roles in the ISC tenant and observing simulator evaluation against live identities.
2. **Criteria Parser & Execution Verification**: Confirm that:
   - **Identity Attributes** and **Entitlements** are correctly compiled to Elasticsearch `/search/v1` queries.
   - **Account Attributes** are correctly isolated per `sourceId` and resolved via `/accounts/v1` with client-side attribute evaluation.
   - **Complex Boolean Trees** (`AND`/`OR` nesting) correctly apply set intersections and unions across disparate API sources.
3. **100% Combinatorial Coverage**: Every combination of:
   - **Target Types**: `IDENTITY`, `ENTITLEMENT`, `ACCOUNT`
   - **Operators**: `EQUALS`, `NOT_EQUALS`, `CONTAINS`, `DOES_NOT_CONTAIN`, `STARTS_WITH`, `ENDS_WITH`
   - **Multiplicity**: Single-value vs Multi-value (`values` array)
   - **Connectives**: `AND`, `OR`, mixed nesting up to the ISC schema limit.

---

## Section 1: Identity Attribute Test Cases

### Part 1.1: Single Attribute — Single Value Operations

#### IdentityEXE - IdentityAttribute Test 1
**Role Name**: `IdentityEXE - IdentityAttribute Test 1`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
(department EQUALS "Human Resources")
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "EQUALS",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": "Human Resources",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `attributes.department.exact:"Human Resources"`
- **Expected Matches**: All identities whose `department` attribute exactly equals "Human Resources" (e.g., `Terry.Fisher`, `Diana.Lawrence`).
- **Simulator Delta**: Users matching criteria not currently assigned will show **+ Gain Role**; non-matching assigned users show **- Lose Role**.

---

#### IdentityEXE - IdentityAttribute Test 2
**Role Name**: `IdentityEXE - IdentityAttribute Test 2`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
(department NOT_EQUALS "Human Resources")
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "NOT_EQUALS",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": "Human Resources",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `(NOT attributes.department.exact:"Human Resources") AND _exists_:attributes.department`
- **Expected Matches**: All identities with a defined department other than "Human Resources".

---

#### IdentityEXE - IdentityAttribute Test 3
**Role Name**: `IdentityEXE - IdentityAttribute Test 3`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
(department CONTAINS "Resource")
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "CONTAINS",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": "Resource",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `attributes.department:*Resource*`
- **Expected Matches**: All identities with "Resource" anywhere in their `department` string (matches "Human Resources", "Resource Management", etc.).

---

#### IdentityEXE - IdentityAttribute Test 4
**Role Name**: `IdentityEXE - IdentityAttribute Test 4`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain 1 Attribute
(department DOES_NOT_CONTAIN "Resource")
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "DOES_NOT_CONTAIN",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": "Resource",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `NOT attributes.department:*Resource*`
- **Expected Matches**: Identities whose department does not include the substring "Resource".

---

#### IdentityEXE - IdentityAttribute Test 5
**Role Name**: `IdentityEXE - IdentityAttribute Test 5`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
(location STARTS_WITH "Mun")
```
**Target Object**: Identity Attribute `location`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "STARTS_WITH",
  "key": { "type": "IDENTITY", "property": "attribute.location", "sourceId": null },
  "stringValue": "Mun",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `attributes.location:Mun*`
- **Expected Matches**: Identities located in "Munich", "Muncie", etc.

---

#### IdentityEXE - IdentityAttribute Test 6
**Role Name**: `IdentityEXE - IdentityAttribute Test 6`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
(location ENDS_WITH "ich")
```
**Target Object**: Identity Attribute `location`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "ENDS_WITH",
  "key": { "type": "IDENTITY", "property": "attribute.location", "sourceId": null },
  "stringValue": "ich",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `attributes.location:*ich`
- **Expected Matches**: Identities located in "Munich", "Zurich", etc.

---

### Part 1.2: Single Attribute — Multi-Value Operations

#### IdentityEXE - IdentityAttribute Test 7
**Role Name**: `IdentityEXE - IdentityAttribute Test 7`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
(department EQUALS ["Human Resources", "Finance"])
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "EQUALS",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": null,
  "values": ["Human Resources", "Finance"],
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `(attributes.department.exact:"Human Resources" OR attributes.department.exact:"Finance")`
- **Expected Matches**: Identities whose department is either "Human Resources" or "Finance".

---

#### IdentityEXE - IdentityAttribute Test 8
**Role Name**: `IdentityEXE - IdentityAttribute Test 8`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal Multi-Value
(department NOT_EQUALS ["Human Resources", "Finance"])
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "NOT_EQUALS",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": null,
  "values": ["Human Resources", "Finance"],
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `NOT (attributes.department.exact:"Human Resources" OR attributes.department.exact:"Finance")`
- **Expected Matches**: Identities belonging to neither "Human Resources" nor "Finance".

---

#### IdentityEXE - IdentityAttribute Test 9
**Role Name**: `IdentityEXE - IdentityAttribute Test 9`  
**Criteria For Role**:
```text
IdentityAttribute Contains Multi-Value
(department CONTAINS ["Resource", "Finan"])
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "CONTAINS",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": null,
  "values": ["Resource", "Finan"],
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `(attributes.department:*Resource* OR attributes.department:*Finan*)`
- **Expected Matches**: Identities matching either substring pattern.

---

#### IdentityEXE - IdentityAttribute Test 10
**Role Name**: `IdentityEXE - IdentityAttribute Test 10`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain Multi-Value
(department DOES_NOT_CONTAIN ["Resource", "Finan"])
```
**Target Object**: Identity Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "DOES_NOT_CONTAIN",
  "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
  "stringValue": null,
  "values": ["Resource", "Finan"],
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `NOT (attributes.department:*Resource* OR attributes.department:*Finan*)`
- **Expected Matches**: Identities whose department contains neither substring.

---

#### IdentityEXE - IdentityAttribute Test 11
**Role Name**: `IdentityEXE - IdentityAttribute Test 11`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith Multi-Value
(location STARTS_WITH ["Mun", "Lon", "Tok"])
```
**Target Object**: Identity Attribute `location`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "STARTS_WITH",
  "key": { "type": "IDENTITY", "property": "attribute.location", "sourceId": null },
  "stringValue": null,
  "values": ["Mun", "Lon", "Tok"],
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `(attributes.location:Mun* OR attributes.location:Lon* OR attributes.location:Tok*)`
- **Expected Matches**: Identities in Munich, London, Tokyo, etc.

---

#### IdentityEXE - IdentityAttribute Test 12
**Role Name**: `IdentityEXE - IdentityAttribute Test 12`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith Multi-Value
(location ENDS_WITH ["ich", "don", "yo"])
```
**Target Object**: Identity Attribute `location`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "ENDS_WITH",
  "key": { "type": "IDENTITY", "property": "attribute.location", "sourceId": null },
  "stringValue": null,
  "values": ["ich", "don", "yo"],
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `(attributes.location:*ich OR attributes.location:*don OR attributes.location:*yo)`
- **Expected Matches**: Identities matching any of the specified suffixes.

---

### Part 1.3: Pairwise AND Combinations

#### IdentityEXE - IdentityAttribute Test 13
**Role Name**: `IdentityEXE - IdentityAttribute Test 13`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
(location ENDS_WITH "ich" AND department EQUALS "Human Resources")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "AND",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "ENDS_WITH",
      "key": { "type": "IDENTITY", "property": "attribute.location", "sourceId": null },
      "stringValue": "ich",
      "values": null,
      "children": null
    },
    {
      "operation": "EQUALS",
      "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
      "stringValue": "Human Resources",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `(attributes.location:*ich AND attributes.department.exact:"Human Resources")`
- **Expected Matches**: Identities located in Munich/Zurich AND in HR department.

---

#### IdentityEXE - IdentityAttribute Test 14
**Role Name**: `IdentityEXE - IdentityAttribute Test 14`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
(location STARTS_WITH "Mun" AND department EQUALS "Human Resources")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "AND",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "STARTS_WITH",
      "key": { "type": "IDENTITY", "property": "attribute.location", "sourceId": null },
      "stringValue": "Mun",
      "values": null,
      "children": null
    },
    {
      "operation": "EQUALS",
      "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
      "stringValue": "Human Resources",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output**: `(attributes.location:Mun* AND attributes.department.exact:"Human Resources")`

---

#### IdentityEXE - IdentityAttribute Test 15
**Role Name**: `IdentityEXE - IdentityAttribute Test 15`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
(jobTitle DOES_NOT_CONTAIN "Manager" AND department EQUALS "Human Resources")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "AND",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "DOES_NOT_CONTAIN",
      "key": { "type": "IDENTITY", "property": "attribute.jobTitle", "sourceId": null },
      "stringValue": "Manager",
      "values": null,
      "children": null
    },
    {
      "operation": "EQUALS",
      "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
      "stringValue": "Human Resources",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output**: `((NOT attributes.jobTitle:*Manager*) AND attributes.department.exact:"Human Resources")`

---

#### IdentityEXE - IdentityAttribute Test 16
**Role Name**: `IdentityEXE - IdentityAttribute Test 16`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
(jobTitle CONTAINS "Compen" AND department EQUALS "Human Resources")
```
**Expected Output**: `(attributes.jobTitle:*Compen* AND attributes.department.exact:"Human Resources")`

---

#### IdentityEXE - IdentityAttribute Test 17
**Role Name**: `IdentityEXE - IdentityAttribute Test 17`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
(country NOT_EQUALS "US" AND department EQUALS "Human Resources")
```
**Expected Output**: `((NOT attributes.country.exact:"US") AND attributes.department.exact:"Human Resources")`

---

#### IdentityEXE - IdentityAttribute Test 18
**Role Name**: `IdentityEXE - IdentityAttribute Test 18`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
(country EQUALS "DE" AND department EQUALS "Human Resources")
```
**Expected Output**: `(attributes.country.exact:"DE" AND attributes.department.exact:"Human Resources")`

---

#### IdentityEXE - IdentityAttribute Test 19
**Role Name**: `IdentityEXE - IdentityAttribute Test 19`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
AND
IdentityAttribute EndsWith 1 Attribute
(location STARTS_WITH "M" AND location ENDS_WITH "h")
```
**Expected Output**: `(attributes.location:M* AND attributes.location:*h)`

---

#### IdentityEXE - IdentityAttribute Test 20
**Role Name**: `IdentityEXE - IdentityAttribute Test 20`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
AND
IdentityAttribute Contains 1 Attribute
(jobTitle CONTAINS "Analyst" AND department CONTAINS "Finance")
```
**Expected Output**: `(attributes.jobTitle:*Analyst* AND attributes.department:*Finance*)`

---

#### IdentityEXE - IdentityAttribute Test 21
**Role Name**: `IdentityEXE - IdentityAttribute Test 21`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
AND
IdentityAttribute Does Not Equal 1 Attribute
(country NOT_EQUALS "US" AND cloudLifecycleState NOT_EQUALS "inactive")
```
**Expected Output**: `((NOT attributes.country.exact:"US") AND (NOT attributes.cloudLifecycleState.exact:"inactive"))`

---

#### IdentityEXE - IdentityAttribute Test 22
**Role Name**: `IdentityEXE - IdentityAttribute Test 22`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
AND
IdentityAttribute Equals 1 Attribute
(location EQUALS ["Munich", "London"] AND department EQUALS "Human Resources")
```
**Expected Output**: `((attributes.location.exact:"Munich" OR attributes.location.exact:"London") AND attributes.department.exact:"Human Resources")`

---

#### IdentityEXE - IdentityAttribute Test 23
**Role Name**: `IdentityEXE - IdentityAttribute Test 23`  
**Criteria For Role**:
```text
IdentityAttribute Contains Multi-Value
AND
IdentityAttribute StartsWith 1 Attribute
(department CONTAINS ["Human", "Finance"] AND location STARTS_WITH "Mun")
```
**Expected Output**: `((attributes.department:*Human* OR attributes.department:*Finance*) AND attributes.location:Mun*)`

---

#### IdentityEXE - IdentityAttribute Test 24
**Role Name**: `IdentityEXE - IdentityAttribute Test 24`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
AND
IdentityAttribute Equals Multi-Value
(location EQUALS ["Munich", "Tokyo"] AND department EQUALS ["Human Resources", "Sales"])
```
**Expected Output**: `((attributes.location.exact:"Munich" OR attributes.location.exact:"Tokyo") AND (attributes.department.exact:"Human Resources" OR attributes.department.exact:"Sales"))`

---

### Part 1.4: Pairwise OR Combinations

#### IdentityEXE - IdentityAttribute Test 25
**Role Name**: `IdentityEXE - IdentityAttribute Test 25`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
(location ENDS_WITH "ich" OR department EQUALS "Finance")
```
**Expected Output**: `(attributes.location:*ich OR attributes.department.exact:"Finance")`

---

#### IdentityEXE - IdentityAttribute Test 26
**Role Name**: `IdentityEXE - IdentityAttribute Test 26`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
(location STARTS_WITH "Mun" OR department EQUALS "Finance")
```
**Expected Output**: `(attributes.location:Mun* OR attributes.department.exact:"Finance")`

---

#### IdentityEXE - IdentityAttribute Test 27
**Role Name**: `IdentityEXE - IdentityAttribute Test 27`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
(jobTitle DOES_NOT_CONTAIN "Manager" OR department EQUALS "Finance")
```
**Expected Output**: `((NOT attributes.jobTitle:*Manager*) OR attributes.department.exact:"Finance")`

---

#### IdentityEXE - IdentityAttribute Test 28
**Role Name**: `IdentityEXE - IdentityAttribute Test 28`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
(jobTitle CONTAINS "Compen" OR department EQUALS "Finance")
```
**Expected Output**: `(attributes.jobTitle:*Compen* OR attributes.department.exact:"Finance")`

---

#### IdentityEXE - IdentityAttribute Test 29
**Role Name**: `IdentityEXE - IdentityAttribute Test 29`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
(country NOT_EQUALS "US" OR department EQUALS "Finance")
```
**Expected Output**: `((NOT attributes.country.exact:"US") OR attributes.department.exact:"Finance")`

---

#### IdentityEXE - IdentityAttribute Test 30
**Role Name**: `IdentityEXE - IdentityAttribute Test 30`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
(department EQUALS "Human Resources" OR department EQUALS "Finance")
```
**Expected Output**: `(attributes.department.exact:"Human Resources" OR attributes.department.exact:"Finance")`

---

#### IdentityEXE - IdentityAttribute Test 31
**Role Name**: `IdentityEXE - IdentityAttribute Test 31`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
OR
IdentityAttribute EndsWith 1 Attribute
(location STARTS_WITH "Lon" OR location ENDS_WITH "ich")
```
**Expected Output**: `(attributes.location:Lon* OR attributes.location:*ich)`

---

#### IdentityEXE - IdentityAttribute Test 32
**Role Name**: `IdentityEXE - IdentityAttribute Test 32`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
OR
IdentityAttribute Contains 1 Attribute
(jobTitle CONTAINS "Lead" OR jobTitle CONTAINS "Senior")
```
**Expected Output**: `(attributes.jobTitle:*Lead* OR attributes.jobTitle:*Senior*)`

---

#### IdentityEXE - IdentityAttribute Test 33
**Role Name**: `IdentityEXE - IdentityAttribute Test 33`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
OR
IdentityAttribute Equals 1 Attribute
(location EQUALS ["Munich", "Tokyo"] OR department EQUALS "Engineering")
```
**Expected Output**: `((attributes.location.exact:"Munich" OR attributes.location.exact:"Tokyo") OR attributes.department.exact:"Engineering")`

---

#### IdentityEXE - IdentityAttribute Test 34
**Role Name**: `IdentityEXE - IdentityAttribute Test 34`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
OR
IdentityAttribute Equals Multi-Value
(location EQUALS ["Munich", "London"] OR department EQUALS ["Finance", "Legal"])
```
**Expected Output**: `((attributes.location.exact:"Munich" OR attributes.location.exact:"London") OR (attributes.department.exact:"Finance" OR attributes.department.exact:"Legal"))`

---

### Part 1.5: Nested Boolean Trees & Multi-Child Groups

#### IdentityEXE - IdentityAttribute Test 35
**Role Name**: `IdentityEXE - IdentityAttribute Test 35`  
**Criteria For Role**:
```text
(IdentityAttribute Equals 1 Attribute AND IdentityAttribute Equals 1 Attribute)
OR
IdentityAttribute Equals 1 Attribute
((department EQUALS "Human Resources" AND country EQUALS "DE") OR location EQUALS "Tokyo")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "OR",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "AND",
      "key": null,
      "stringValue": null,
      "values": null,
      "children": [
        {
          "operation": "EQUALS",
          "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
          "stringValue": "Human Resources",
          "values": null,
          "children": null
        },
        {
          "operation": "EQUALS",
          "key": { "type": "IDENTITY", "property": "attribute.country", "sourceId": null },
          "stringValue": "DE",
          "values": null,
          "children": null
        }
      ]
    },
    {
      "operation": "EQUALS",
      "key": { "type": "IDENTITY", "property": "attribute.location", "sourceId": null },
      "stringValue": "Tokyo",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output**: `((attributes.department.exact:"Human Resources" AND attributes.country.exact:"DE") OR attributes.location.exact:"Tokyo")`

---

#### IdentityEXE - IdentityAttribute Test 36
**Role Name**: `IdentityEXE - IdentityAttribute Test 36`  
**Criteria For Role**:
```text
(IdentityAttribute Equals 1 Attribute OR IdentityAttribute Equals 1 Attribute)
AND
IdentityAttribute Equals 1 Attribute
((department EQUALS "Human Resources" OR department EQUALS "Finance") AND cloudLifecycleState EQUALS "active")
```
**Expected Output**: `((attributes.department.exact:"Human Resources" OR attributes.department.exact:"Finance") AND attributes.cloudLifecycleState.exact:"active")`

---

#### IdentityEXE - IdentityAttribute Test 37
**Role Name**: `IdentityEXE - IdentityAttribute Test 37`  
**Criteria For Role**:
```text
(IdentityAttribute StartsWith 1 Attribute AND IdentityAttribute Contains 1 Attribute)
OR
(IdentityAttribute EndsWith 1 Attribute AND IdentityAttribute Equals 1 Attribute)
((location STARTS_WITH "Mu" AND jobTitle CONTAINS "Comp") OR (location ENDS_WITH "on" AND country EQUALS "UK"))
```
**Expected Output**: `((attributes.location:Mu* AND attributes.jobTitle:*Comp*) OR (attributes.location:*on AND attributes.country.exact:"UK"))`

---

#### IdentityEXE - IdentityAttribute Test 38
**Role Name**: `IdentityEXE - IdentityAttribute Test 38`  
**Criteria For Role**:
```text
(IdentityAttribute Does Not Equal 1 Attribute AND IdentityAttribute Contains 1 Attribute)
OR
IdentityAttribute Equals Multi-Value
((country NOT_EQUALS "US" AND department CONTAINS "Resource") OR location EQUALS ["Munich", "London"])
```
**Expected Output**: `(((NOT attributes.country.exact:"US") AND attributes.department:*Resource*) OR (attributes.location.exact:"Munich" OR attributes.location.exact:"London"))`

---

#### IdentityEXE - IdentityAttribute Test 39
**Role Name**: `IdentityEXE - IdentityAttribute Test 39`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
AND
IdentityAttribute Equals 1 Attribute
(department EQUALS "Human Resources" AND country EQUALS "DE" AND cloudLifecycleState EQUALS "active")
```
**Expected Output**: `(attributes.department.exact:"Human Resources" AND attributes.country.exact:"DE" AND attributes.cloudLifecycleState.exact:"active")`

---

#### IdentityEXE - IdentityAttribute Test 40
**Role Name**: `IdentityEXE - IdentityAttribute Test 40`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
OR
IdentityAttribute Equals 1 Attribute
(location EQUALS "Munich" OR location EQUALS "London" OR location EQUALS "Tokyo")
```
**Expected Output**: `(attributes.location.exact:"Munich" OR attributes.location.exact:"London" OR attributes.location.exact:"Tokyo")`

---

## Section 2: Entitlement Test Cases

### Part 2.1: Single Entitlement — Single Value Operations

#### IdentityEXE - Entitlement Test 1
**Role Name**: `IdentityEXE - Entitlement Test 1`  
**Criteria For Role**:
```text
Entitlement Equals 1 Entitlement Value
(Active Directory memberOf EQUALS "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com")
```
**Target Object**: Source `Active Directory` (`41e0e50d6ff74103a53652767b2407e6`), Entitlement `Employees`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "EQUALS",
  "key": {
    "type": "ENTITLEMENT",
    "property": "attribute.memberOf",
    "sourceId": "41e0e50d6ff74103a53652767b2407e6"
  },
  "stringValue": "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `@access(type:ENTITLEMENT AND source.id:41e0e50d6ff74103a53652767b2407e6 AND value.exact:"CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com")`
- **Expected Matches**: All identities holding the Active Directory "Employees" group entitlement.

---

#### IdentityEXE - Entitlement Test 2
**Role Name**: `IdentityEXE - Entitlement Test 2`  
**Criteria For Role**:
```text
Entitlement Does Not Equal 1 Entitlement Value
(Active Directory memberOf NOT_EQUALS "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com")
```
**Target Object**: Source `Active Directory` (`41e0e50d6ff74103a53652767b2407e6`), Entitlement `Employees`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "NOT_EQUALS",
  "key": {
    "type": "ENTITLEMENT",
    "property": "attribute.memberOf",
    "sourceId": "41e0e50d6ff74103a53652767b2407e6"
  },
  "stringValue": "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
  "values": null,
  "children": null
}
```
**Expected Output**: `NOT @access(type:ENTITLEMENT AND source.id:41e0e50d6ff74103a53652767b2407e6 AND value.exact:"CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com")`

---

### Part 2.2: Single Entitlement — Multi-Value Operations

#### IdentityEXE - Entitlement Test 3
**Role Name**: `IdentityEXE - Entitlement Test 3`  
**Criteria For Role**:
```text
Entitlement Equals Multi-Value
(Active Directory memberOf EQUALS [
  "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
  "CN=DEV_All,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com"
])
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "EQUALS",
  "key": {
    "type": "ENTITLEMENT",
    "property": "attribute.memberOf",
    "sourceId": "41e0e50d6ff74103a53652767b2407e6"
  },
  "stringValue": null,
  "values": [
    "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
    "CN=DEV_All,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com"
  ],
  "children": null
}
```
**Expected Output**: `@access(type:ENTITLEMENT AND source.id:41e0e50d6ff74103a53652767b2407e6 AND (value.exact:"CN=Employees..." OR value.exact:"CN=DEV_All..."))`

---

#### IdentityEXE - Entitlement Test 4
**Role Name**: `IdentityEXE - Entitlement Test 4`  
**Criteria For Role**:
```text
Entitlement Does Not Equal Multi-Value
(Active Directory memberOf NOT_EQUALS [
  "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
  "CN=DEV_All,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com"
])
```
**Expected Output**: `NOT @access(type:ENTITLEMENT AND source.id:41e0e50d6ff74103a53652767b2407e6 AND (value.exact:"CN=Employees..." OR value.exact:"CN=DEV_All..."))`

---

### Part 2.3: AND Combinations

#### IdentityEXE - Entitlement Test 5
**Role Name**: `IdentityEXE - Entitlement Test 5`  
**Criteria For Role**:
```text
Entitlement Equals 1 Entitlement Value
AND
Entitlement Equals 1 Entitlement Value
(Active Directory memberOf EQUALS "Employees" AND Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: `(@access(source.id:41e0e... AND value.exact:"CN=Employees...") AND @access(source.id:41e0e... AND value.exact:"CN=DEV_All..."))`

---

#### IdentityEXE - Entitlement Test 6
**Role Name**: `IdentityEXE - IdentityEXE - Entitlement Test 6`  
**Criteria For Role**:
```text
Entitlement Does Not Equal 1 Entitlement Value
AND
Entitlement Equals 1 Entitlement Value
(Active Directory memberOf NOT_EQUALS "DEV_All" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: `((NOT @access(source.id:41e0e... AND value.exact:"CN=DEV_All...")) AND @access(source.id:41e0e... AND value.exact:"CN=Employees..."))`

---

#### IdentityEXE - Entitlement Test 7
**Role Name**: `IdentityEXE - Entitlement Test 7`  
**Criteria For Role**:
```text
Entitlement Equals 1 Entitlement Value
AND
Entitlement Does Not Equal 1 Entitlement Value
(Active Directory memberOf EQUALS "DEV_All" AND Active Directory memberOf NOT_EQUALS "TaxAccounting")
```
**Expected Output**: `(@access(source.id:41e0e... AND value.exact:"CN=DEV_All...") AND (NOT @access(source.id:41e0e... AND value.exact:"CN=TaxAccounting...")))`

---

#### IdentityEXE - Entitlement Test 8
**Role Name**: `IdentityEXE - Entitlement Test 8`  
**Criteria For Role**:
```text
Entitlement Does Not Equal 1 Entitlement Value
AND
Entitlement Does Not Equal 1 Entitlement Value
(Active Directory memberOf NOT_EQUALS "DEV_All" AND Active Directory memberOf NOT_EQUALS "TaxAccounting")
```
**Expected Output**: `((NOT @access(source.id:41e0e... AND value.exact:"CN=DEV_All...")) AND (NOT @access(source.id:41e0e... AND value.exact:"CN=TaxAccounting...")))`

---

#### IdentityEXE - Entitlement Test 9
**Role Name**: `IdentityEXE - Entitlement Test 9`  
**Criteria For Role**:
```text
Entitlement Equals Multi-Value
AND
Entitlement Equals 1 Entitlement Value
(Active Directory memberOf EQUALS ["Employees", "DEV_Europe"] AND Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: Matches users with DEV_All AND at least one of (Employees or DEV_Europe).

---

#### IdentityEXE - Entitlement Test 10
**Role Name**: `IdentityEXE - Entitlement Test 10`  
**Criteria For Role**:
```text
Entitlement Equals 1 Entitlement Value (Cross-Source)
AND
Entitlement Equals 1 Entitlement Value (Cross-Source)
(Active Directory memberOf EQUALS "Employees" AND IdentityNow assignedGroups EQUALS "ROLE_ADMIN")
```
**Expected Output**: Evaluates across two distinct connected sources (`Active Directory` and `IdentityNow`).

---

#### IdentityEXE - Entitlement Test 11
**Role Name**: `IdentityEXE - Entitlement Test 11`  
**Criteria For Role**:
```text
Entitlement Equals 1 Entitlement Value
AND
Entitlement Does Not Equal 1 Entitlement Value (Cross-Source)
(Active Directory memberOf EQUALS "Employees" AND IdentityNow assignedGroups NOT_EQUALS "ROLE_ADMIN")
```
**Expected Output**: Users with AD Employees who lack IdentityNow ROLE_ADMIN.

---

### Part 2.4: OR Combinations

#### IdentityEXE - Entitlement Test 12
**Role Name**: `IdentityEXE - Entitlement Test 12`  
**Criteria For Role**:
```text
Entitlement Equals 1 Entitlement Value
OR
Entitlement Equals 1 Entitlement Value
(Active Directory memberOf EQUALS "Employees" OR Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: `(@access(source.id:41e0e... AND value.exact:"CN=Employees...") OR @access(source.id:41e0e... AND value.exact:"CN=DEV_All..."))`

---

#### IdentityEXE - Entitlement Test 13
**Role Name**: `IdentityEXE - Entitlement Test 13`  
**Criteria For Role**:
```text
Entitlement Does Not Equal 1 Entitlement Value
OR
Entitlement Equals 1 Entitlement Value
(Active Directory memberOf NOT_EQUALS "DEV_All" OR Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Union of users without DEV_All and users with Employees.

---

#### IdentityEXE - Entitlement Test 14
**Role Name**: `IdentityEXE - Entitlement Test 14`  
**Criteria For Role**:
```text
Entitlement Does Not Equal 1 Entitlement Value
OR
Entitlement Does Not Equal 1 Entitlement Value
(Active Directory memberOf NOT_EQUALS "DEV_All" OR Active Directory memberOf NOT_EQUALS "Employees")
```
**Expected Output**: Everyone except users possessing both entitlements simultaneously.

---

#### IdentityEXE - Entitlement Test 15
**Role Name**: `IdentityEXE - Entitlement Test 15`  
**Criteria For Role**:
```text
Entitlement Equals Multi-Value
OR
Entitlement Equals 1 Entitlement Value
(Active Directory memberOf EQUALS ["DEV_All", "TaxAccounting"] OR Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Users with either DEV_All, TaxAccounting, or Employees.

---

#### IdentityEXE - Entitlement Test 16
**Role Name**: `IdentityEXE - Entitlement Test 16`  
**Criteria For Role**:
```text
Entitlement Equals 1 Entitlement Value (Cross-Source)
OR
Entitlement Equals 1 Entitlement Value (Cross-Source)
(Active Directory memberOf EQUALS "Employees" OR IdentityNow assignedGroups EQUALS "ROLE_ADMIN")
```
**Expected Output**: Cross-source entitlement union.

---

### Part 2.5: Complex Nested Entitlement Trees

#### IdentityEXE - Entitlement Test 17
**Role Name**: `IdentityEXE - Entitlement Test 17`  
**Criteria For Role**:
```text
(Entitlement Equals AND Entitlement Equals)
OR
Entitlement Equals
((AD.memberOf == "Employees" AND AD.memberOf == "DEV_All") OR AD.memberOf == "TaxAccounting")
```
**Expected Output**: Matches users holding (Employees and DEV_All) or users holding TaxAccounting.

---

#### IdentityEXE - Entitlement Test 18
**Role Name**: `IdentityEXE - Entitlement Test 18`  
**Criteria For Role**:
```text
(Entitlement Equals OR Entitlement Equals)
AND
Entitlement Equals
((AD.memberOf == "DEV_All" OR AD.memberOf == "DEV_Europe") AND AD.memberOf == "Employees")
```
**Expected Output**: Must have Employees AND at least one DEV group.

---

#### IdentityEXE - Entitlement Test 19
**Role Name**: `IdentityEXE - Entitlement Test 19`  
**Criteria For Role**:
```text
(Entitlement Equals AND Entitlement Does Not Equal)
OR
(Entitlement Equals AND Entitlement Equals)
((AD.memberOf == "Employees" AND AD.memberOf != "DEV_All") OR (AD.memberOf == "DEV_All" AND AD.memberOf == "DEV_Internal"))
```
**Expected Output**: Standard employees without DEV_All OR internal developers.

---

#### IdentityEXE - Entitlement Test 20
**Role Name**: `IdentityEXE - Entitlement Test 20`  
**Criteria For Role**:
```text
Entitlement Equals AND Entitlement Equals AND Entitlement Equals (3-Child AND)
(AD.memberOf == "Employees" AND AD.memberOf == "DEV_All" AND AD.memberOf == "DEV_Internal")
```
**Expected Output**: Strict intersection of all three AD groups.

---

#### IdentityEXE - Entitlement Test 21
**Role Name**: `IdentityEXE - Entitlement Test 21`  
**Criteria For Role**:
```text
Entitlement Equals OR Entitlement Equals OR Entitlement Equals (3-Child OR)
(AD.memberOf == "TaxAccounting" OR AD.memberOf == "DEV_Europe" OR AD.memberOf == "incident_assign")
```
**Expected Output**: Broad union across any of three distinct group memberships.

---

## Section 3: Account Attribute Test Cases

### Part 3.1: Single Account Attribute — Single Value Operations

#### IdentityEXE - AccountAttribute Test 1
**Role Name**: `IdentityEXE - AccountAttribute Test 1`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
(Active Directory department EQUALS "Human Resources")
```
**Target Object**: Source `Active Directory` (`41e0e50d6ff74103a53652767b2407e6`), Attribute `department`  
**ISC Criteria JSON Payload**:
```json
{
  "operation": "EQUALS",
  "key": {
    "type": "ACCOUNT",
    "property": "attribute.department",
    "sourceId": "41e0e50d6ff74103a53652767b2407e6"
  },
  "stringValue": "Human Resources",
  "values": null,
  "children": null
}
```
**Expected Output & Simulator Matching Logic**:
- **Evaluation**: Queries `/accounts/v1?filters=sourceId eq "41e0e50d6ff74103a53652767b2407e6"` and filters account objects client-side where `account.attributes.department == "Human Resources"`.
- **Identity Resolution**: Maps matching account `identityId`s to target identities.

---

#### IdentityEXE - AccountAttribute Test 2
**Role Name**: `IdentityEXE - AccountAttribute Test 2`  
**Criteria For Role**:
```text
AccountAttribute Does Not Equal 1 Attribute
(Active Directory department NOT_EQUALS "Human Resources")
```
**Expected Output**: Identities with AD accounts where `department != "Human Resources"`.

---

#### IdentityEXE - AccountAttribute Test 3
**Role Name**: `IdentityEXE - AccountAttribute Test 3`  
**Criteria For Role**:
```text
AccountAttribute Contains 1 Attribute
(Active Directory department CONTAINS "Resource")
```
**Expected Output**: Client-side substring match: `account.attributes.department.includes("Resource")`.

---

#### IdentityEXE - AccountAttribute Test 4
**Role Name**: `IdentityEXE - AccountAttribute Test 4`  
**Criteria For Role**:
```text
AccountAttribute Does Not Contain 1 Attribute
(Active Directory department DOES_NOT_CONTAIN "Resource")
```
**Expected Output**: Client-side negative substring match on AD account department.

---

#### IdentityEXE - AccountAttribute Test 5
**Role Name**: `IdentityEXE - AccountAttribute Test 5`  
**Criteria For Role**:
```text
AccountAttribute StartsWith 1 Attribute
(Active Directory sAMAccountName STARTS_WITH "Diana")
```
**Expected Output**: Matches accounts where username begins with "Diana".

---

#### IdentityEXE - AccountAttribute Test 6
**Role Name**: `IdentityEXE - AccountAttribute Test 6`  
**Criteria For Role**:
```text
AccountAttribute EndsWith 1 Attribute
(Active Directory mail ENDS_WITH "@sailpointdemo.com")
```
**Expected Output**: Matches accounts with company domain email suffix.

---

### Part 3.2: Single Account Attribute — Multi-Value Operations

#### IdentityEXE - AccountAttribute Test 7
**Role Name**: `IdentityEXE - AccountAttribute Test 7`  
**Criteria For Role**:
```text
AccountAttribute Equals Multi-Value
(Active Directory department EQUALS ["Human Resources", "Finance"])
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "EQUALS",
  "key": {
    "type": "ACCOUNT",
    "property": "attribute.department",
    "sourceId": "41e0e50d6ff74103a53652767b2407e6"
  },
  "stringValue": null,
  "values": ["Human Resources", "Finance"],
  "children": null
}
```
**Expected Output**: Accounts whose department matches either "Human Resources" or "Finance".

---

#### IdentityEXE - AccountAttribute Test 8
**Role Name**: `IdentityEXE - AccountAttribute Test 8`  
**Criteria For Role**:
```text
AccountAttribute Does Not Equal Multi-Value
(Active Directory department NOT_EQUALS ["Human Resources", "Finance"])
```
**Expected Output**: Accounts whose department matches neither value.

---

#### IdentityEXE - AccountAttribute Test 9
**Role Name**: `IdentityEXE - AccountAttribute Test 9`  
**Criteria For Role**:
```text
AccountAttribute Contains Multi-Value
(Active Directory mail CONTAINS ["@sailpointdemo", "@demo"])
```
**Expected Output**: Accounts matching either email domain token.

---

#### IdentityEXE - AccountAttribute Test 10
**Role Name**: `IdentityEXE - AccountAttribute Test 10`  
**Criteria For Role**:
```text
AccountAttribute Does Not Contain Multi-Value
(Active Directory mail DOES_NOT_CONTAIN ["contractor", "vendor"])
```
**Expected Output**: Accounts excluding external contractor tags.

---

#### IdentityEXE - AccountAttribute Test 11
**Role Name**: `IdentityEXE - AccountAttribute Test 11`  
**Criteria For Role**:
```text
AccountAttribute StartsWith Multi-Value
(Active Directory sAMAccountName STARTS_WITH ["adm_", "svc_"])
```
**Expected Output**: Privileged service and admin account identities.

---

#### IdentityEXE - AccountAttribute Test 12
**Role Name**: `IdentityEXE - AccountAttribute Test 12`  
**Criteria For Role**:
```text
AccountAttribute EndsWith Multi-Value
(Active Directory mail ENDS_WITH [".de", ".com", ".uk"])
```
**Expected Output**: Regionally targeted corporate email suffix matching.

---

### Part 3.3: AND Combinations

#### IdentityEXE - AccountAttribute Test 13
**Role Name**: `IdentityEXE - AccountAttribute Test 13`  
**Criteria For Role**:
```text
AccountAttribute EndsWith 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Active Directory mail ENDS_WITH ".com" AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Accounts meeting both conditions on Active Directory.

---

#### IdentityEXE - AccountAttribute Test 14
**Role Name**: `IdentityEXE - AccountAttribute Test 14`  
**Criteria For Role**:
```text
AccountAttribute StartsWith 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Active Directory givenName STARTS_WITH "D" AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: HR staff whose first name begins with D.

---

#### IdentityEXE - AccountAttribute Test 15
**Role Name**: `IdentityEXE - AccountAttribute Test 15`  
**Criteria For Role**:
```text
AccountAttribute Does Not Contain 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Active Directory sAMAccountName DOES_NOT_CONTAIN "temp" AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Permanent HR accounts.

---

#### IdentityEXE - AccountAttribute Test 16
**Role Name**: `IdentityEXE - AccountAttribute Test 16`  
**Criteria For Role**:
```text
AccountAttribute Contains 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Active Directory userPrincipalName CONTAINS "sailpointdemo" AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Fully qualified domain UPN in HR.

---

#### IdentityEXE - AccountAttribute Test 17
**Role Name**: `IdentityEXE - AccountAttribute Test 17`  
**Criteria For Role**:
```text
AccountAttribute Does Not Equal 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Active Directory department NOT_EQUALS "Finance" AND Active Directory domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Domain accounts outside Finance.

---

#### IdentityEXE - AccountAttribute Test 18
**Role Name**: `IdentityEXE - AccountAttribute Test 18`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Active Directory department EQUALS "Human Resources" AND Active Directory domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Domain HR accounts.

---

#### IdentityEXE - AccountAttribute Test 19
**Role Name**: `IdentityEXE - AccountAttribute Test 19`  
**Criteria For Role**:
```text
AccountAttribute Equals Multi-Value
AND
AccountAttribute Equals 1 Attribute
(Active Directory department EQUALS ["Human Resources", "Finance"] AND Active Directory domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Corporate domain accounts in HR or Finance.

---

#### IdentityEXE - AccountAttribute Test 20
**Role Name**: `IdentityEXE - AccountAttribute Test 20`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute (Cross-Source)
AND
AccountAttribute Equals 1 Attribute (Cross-Source)
(Active Directory domain EQUALS "sailpointdemo.com" AND HR department EQUALS "Human Resources")
```
**Expected Output**: Evaluates across Active Directory account data and HR source account data simultaneously.

---

### Part 3.4: OR Combinations

#### IdentityEXE - AccountAttribute Test 21
**Role Name**: `IdentityEXE - AccountAttribute Test 21`  
**Criteria For Role**:
```text
AccountAttribute EndsWith 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Active Directory mail ENDS_WITH ".de" OR Active Directory department EQUALS "Finance")
```
**Expected Output**: German domain accounts OR Finance accounts.

---

#### IdentityEXE - AccountAttribute Test 22
**Role Name**: `IdentityEXE - AccountAttribute Test 22`  
**Criteria For Role**:
```text
AccountAttribute StartsWith 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Active Directory sAMAccountName STARTS_WITH "adm_" OR Active Directory department EQUALS "IT")
```
**Expected Output**: Admin account owners OR IT members.

---

#### IdentityEXE - AccountAttribute Test 23
**Role Name**: `IdentityEXE - AccountAttribute Test 23`  
**Criteria For Role**:
```text
AccountAttribute Does Not Contain 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Active Directory sAMAccountName DOES_NOT_CONTAIN "contractor" OR Active Directory department EQUALS "Finance")
```
**Expected Output**: Union of non-contractor accounts and Finance.

---

#### IdentityEXE - AccountAttribute Test 24
**Role Name**: `IdentityEXE - AccountAttribute Test 24`  
**Criteria For Role**:
```text
AccountAttribute Contains 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Active Directory displayName CONTAINS "Consultant" OR Active Directory department EQUALS "Professional Services")
```
**Expected Output**: Consultants or PS staff.

---

#### IdentityEXE - AccountAttribute Test 25
**Role Name**: `IdentityEXE - AccountAttribute Test 25`  
**Criteria For Role**:
```text
AccountAttribute Does Not Equal 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Active Directory department NOT_EQUALS "Engineering" OR Active Directory domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Broad union across negative condition and domain.

---

#### IdentityEXE - AccountAttribute Test 26
**Role Name**: `IdentityEXE - AccountAttribute Test 26`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Active Directory department EQUALS "Human Resources" OR Active Directory department EQUALS "Finance")
```
**Expected Output**: Accounts in either department.

---

#### IdentityEXE - AccountAttribute Test 27
**Role Name**: `IdentityEXE - AccountAttribute Test 27`  
**Criteria For Role**:
```text
AccountAttribute Equals Multi-Value
OR
AccountAttribute Equals 1 Attribute
(Active Directory department EQUALS ["HR", "Finance"] OR Active Directory domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Union of multi-value departments and domain.

---

#### IdentityEXE - AccountAttribute Test 28
**Role Name**: `IdentityEXE - AccountAttribute Test 28`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute (Cross-Source)
OR
AccountAttribute Equals 1 Attribute (Cross-Source)
(Active Directory department EQUALS "Human Resources" OR HR status EQUALS "Active")
```
**Expected Output**: Union across two independent sources.

---

### Part 3.5: Nested Boolean Groups

#### IdentityEXE - AccountAttribute Test 29
**Role Name**: `IdentityEXE - AccountAttribute Test 29`  
**Criteria For Role**:
```text
(AccountAttribute Equals AND AccountAttribute Equals)
OR
AccountAttribute Equals
((AD.department == "Human Resources" AND AD.domain == "sailpointdemo.com") OR AD.department == "Finance")
```
**Expected Output**: Verified corporate HR or any Finance account.

---

#### IdentityEXE - AccountAttribute Test 30
**Role Name**: `IdentityEXE - AccountAttribute Test 30`  
**Criteria For Role**:
```text
(AccountAttribute Equals OR AccountAttribute Equals)
AND
AccountAttribute Equals
((AD.department == "Human Resources" OR AD.department == "Finance") AND AD.domain == "sailpointdemo.com")
```
**Expected Output**: Corporate domain accounts restricted to HR and Finance.

---

#### IdentityEXE - AccountAttribute Test 31
**Role Name**: `IdentityEXE - AccountAttribute Test 31`  
**Criteria For Role**:
```text
AccountAttribute Equals AND AccountAttribute Equals AND AccountAttribute Equals (3-Child AND)
(AD.department == "Human Resources" AND AD.domain == "sailpointdemo.com" AND AD.userAccountControl == "66048")
```
**Expected Output**: HR corporate accounts with non-expiring passwords.

---

#### IdentityEXE - AccountAttribute Test 32
**Role Name**: `IdentityEXE - AccountAttribute Test 32`  
**Criteria For Role**:
```text
AccountAttribute Equals OR AccountAttribute Equals OR AccountAttribute Equals (3-Child OR)
(AD.department == "Human Resources" OR AD.department == "Finance" OR AD.department == "Engineering")
```
**Expected Output**: Union across three distinct account departments.

---

## Section 4: Multi-Type Cross-Combinations

### Part 4.1: Identity Attribute + Entitlement (AND)

#### IdentityEXE - MultiType Test 1
**Role Name**: `IdentityEXE - MultiType Test 1`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Identity.department EQUALS "Human Resources" AND Active Directory memberOf EQUALS "Employees")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "AND",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "EQUALS",
      "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
      "stringValue": "Human Resources",
      "values": null,
      "children": null
    },
    {
      "operation": "EQUALS",
      "key": {
        "type": "ENTITLEMENT",
        "property": "attribute.memberOf",
        "sourceId": "41e0e50d6ff74103a53652767b2407e6"
      },
      "stringValue": "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output & Simulator Matching Logic**:
- **Search Query**: `(attributes.department.exact:"Human Resources" AND @access(type:ENTITLEMENT AND source.id:41e0e50d6ff74103a53652767b2407e6 AND value.exact:"CN=Employees..."))`
- **Expected Matches**: Identities who belong to Human Resources AND hold the Active Directory Employees group entitlement.

---

#### IdentityEXE - MultiType Test 2
**Role Name**: `IdentityEXE - MultiType Test 2`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Identity.country NOT_EQUALS "US" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Non-US identities holding the Employees entitlement.

---

#### IdentityEXE - MultiType Test 3
**Role Name**: `IdentityEXE - MultiType Test 3`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Identity.jobTitle CONTAINS "Comp" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Identities with "Comp" in job title (e.g. Compensation) and AD Employees group.

---

#### IdentityEXE - MultiType Test 4
**Role Name**: `IdentityEXE - MultiType Test 4`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Identity.jobTitle DOES_NOT_CONTAIN "Manager" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Non-manager employees holding AD group.

---

#### IdentityEXE - MultiType Test 5
**Role Name**: `IdentityEXE - MultiType Test 5`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Identity.location STARTS_WITH "Mun" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Munich-based employees.

---

#### IdentityEXE - MultiType Test 6
**Role Name**: `IdentityEXE - MultiType Test 6`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Identity.location ENDS_WITH "ich" AND Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: Munich/Zurich staff with DEV_All entitlement.

---

#### IdentityEXE - MultiType Test 7
**Role Name**: `IdentityEXE - MultiType Test 7`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
Entitlement Does Not Equal 1 Entitlement Value
(Identity.department EQUALS "Human Resources" AND Active Directory memberOf NOT_EQUALS "DEV_All")
```
**Expected Output**: HR staff who do NOT hold DEV_All group.

---

#### IdentityEXE - MultiType Test 8
**Role Name**: `IdentityEXE - MultiType Test 8`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
AND
Entitlement Equals 1 Entitlement Value
(Identity.location EQUALS ["Munich", "London"] AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Employees in Munich or London holding AD group.

---

#### IdentityEXE - MultiType Test 9
**Role Name**: `IdentityEXE - MultiType Test 9`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
Entitlement Equals Multi-Value
(Identity.department EQUALS "Human Resources" AND Active Directory memberOf EQUALS ["Employees", "DEV_All"])
```
**Expected Output**: HR staff holding at least one of the specified AD groups.

---

#### IdentityEXE - MultiType Test 10
**Role Name**: `IdentityEXE - MultiType Test 10`  
**Criteria For Role**:
```text
IdentityAttribute Multi-Value Contains
AND
Entitlement Multi-Value Equals
(Identity.department CONTAINS ["Resource", "Finance"] AND Active Directory memberOf EQUALS ["Employees", "DEV_All"])
```
**Expected Output**: Combined multi-value expansion across identity text and entitlement sets.

---

### Part 4.2: Identity Attribute + Entitlement (OR)

#### IdentityEXE - MultiType Test 11
**Role Name**: `IdentityEXE - MultiType Test 11`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Identity.department EQUALS "Human Resources" OR Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: `(attributes.department.exact:"Human Resources" OR @access(source.id:41e0e... AND value.exact:"CN=DEV_All..."))`

---

#### IdentityEXE - MultiType Test 12
**Role Name**: `IdentityEXE - MultiType Test 12`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Identity.country NOT_EQUALS "US" OR Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Non-US identities OR any user with AD Employees entitlement.

---

#### IdentityEXE - MultiType Test 13
**Role Name**: `IdentityEXE - MultiType Test 13`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Identity.jobTitle CONTAINS "Executive" OR IdentityNow assignedGroups EQUALS "ROLE_ADMIN")
```
**Expected Output**: Corporate executives or tenant role administrators.

---

#### IdentityEXE - MultiType Test 14
**Role Name**: `IdentityEXE - MultiType Test 14`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Identity.location DOES_NOT_CONTAIN "US" OR Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Broad global union.

---

#### IdentityEXE - MultiType Test 15
**Role Name**: `IdentityEXE - MultiType Test 15`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Identity.location STARTS_WITH "Tok" OR Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Tokyo employees or AD Employees group holders.

---

#### IdentityEXE - MultiType Test 16
**Role Name**: `IdentityEXE - MultiType Test 16`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Identity.location ENDS_WITH "ich" OR Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: Munich/Zurich identities OR developers.

---

#### IdentityEXE - MultiType Test 17
**Role Name**: `IdentityEXE - MultiType Test 17`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
Entitlement Does Not Equal 1 Entitlement Value
(Identity.department EQUALS "Finance" OR Active Directory memberOf NOT_EQUALS "Employees")
```
**Expected Output**: Finance members or anyone without the AD Employees group.

---

#### IdentityEXE - MultiType Test 18
**Role Name**: `IdentityEXE - MultiType Test 18`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
OR
Entitlement Equals 1 Entitlement Value
(Identity.location EQUALS ["Munich", "Tokyo"] OR Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: Key regional hubs or any developer.

---

#### IdentityEXE - MultiType Test 19
**Role Name**: `IdentityEXE - MultiType Test 19`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
Entitlement Equals Multi-Value
(Identity.department EQUALS "Engineering" OR Active Directory memberOf EQUALS ["DEV_All", "DEV_Internal"])
```
**Expected Output**: Engineering department members or developers with active group assignments.

---

### Part 4.3: Identity Attribute + Account Attribute (AND)

#### IdentityEXE - MultiType Test 20
**Role Name**: `IdentityEXE - MultiType Test 20`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Identity.cloudLifecycleState EQUALS "active" AND Active Directory department EQUALS "Human Resources")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "AND",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "EQUALS",
      "key": { "type": "IDENTITY", "property": "attribute.cloudLifecycleState", "sourceId": null },
      "stringValue": "active",
      "values": null,
      "children": null
    },
    {
      "operation": "EQUALS",
      "key": {
        "type": "ACCOUNT",
        "property": "attribute.department",
        "sourceId": "41e0e50d6ff74103a53652767b2407e6"
      },
      "stringValue": "Human Resources",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output & Simulator Matching Logic**:
- **Cross-Service Resolution**: Evaluates Identity Elasticsearch query `attributes.cloudLifecycleState.exact:"active"` via `/search/v1`, queries Active Directory accounts via `/accounts/v1`, filters accounts where `department == "Human Resources"`, and intersects the two sets.

---

#### IdentityEXE - MultiType Test 21
**Role Name**: `IdentityEXE - MultiType Test 21`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Identity.country NOT_EQUALS "US" AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Non-US active identities with AD account in HR.

---

#### IdentityEXE - MultiType Test 22
**Role Name**: `IdentityEXE - MultiType Test 22`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Identity.jobTitle CONTAINS "Comp" AND Active Directory domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Compensation staff with corporate AD accounts.

---

#### IdentityEXE - MultiType Test 23
**Role Name**: `IdentityEXE - MultiType Test 23`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Identity.department DOES_NOT_CONTAIN "Contract" AND Active Directory domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Non-contractor corporate domain account owners.

---

#### IdentityEXE - MultiType Test 24
**Role Name**: `IdentityEXE - MultiType Test 24`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Identity.location STARTS_WITH "Mun" AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Munich-located identities with AD HR accounts.

---

#### IdentityEXE - MultiType Test 25
**Role Name**: `IdentityEXE - MultiType Test 25`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
AND
AccountAttribute Equals 1 Attribute
(Identity.location ENDS_WITH "ich" AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Munich/Zurich identities with AD HR accounts.

---

#### IdentityEXE - MultiType Test 26
**Role Name**: `IdentityEXE - MultiType Test 26`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
AccountAttribute Does Not Equal 1 Attribute
(Identity.department EQUALS "Human Resources" AND Active Directory department NOT_EQUALS "Finance")
```
**Expected Output**: HR identities without conflicting AD Finance assignment.

---

#### IdentityEXE - MultiType Test 27
**Role Name**: `IdentityEXE - MultiType Test 27`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
AccountAttribute Contains 1 Attribute
(Identity.department EQUALS "Human Resources" AND Active Directory mail CONTAINS "sailpointdemo")
```
**Expected Output**: HR staff with company email in AD.

---

#### IdentityEXE - MultiType Test 28
**Role Name**: `IdentityEXE - MultiType Test 28`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
AND
AccountAttribute Equals 1 Attribute
(Identity.location EQUALS ["Munich", "Tokyo"] AND Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Munich or Tokyo identities with AD HR accounts.

---

#### IdentityEXE - MultiType Test 29
**Role Name**: `IdentityEXE - MultiType Test 29`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
AccountAttribute Equals Multi-Value
(Identity.cloudLifecycleState EQUALS "active" AND Active Directory department EQUALS ["Human Resources", "Finance"])
```
**Expected Output**: Active lifecycle identities with AD account in HR or Finance.

---

### Part 4.4: Identity Attribute + Account Attribute (OR)

#### IdentityEXE - MultiType Test 30
**Role Name**: `IdentityEXE - MultiType Test 30`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Identity.department EQUALS "Human Resources" OR Active Directory department EQUALS "Finance")
```
**Expected Output**: Union of HR identities and identities owning an AD account in Finance.

---

#### IdentityEXE - MultiType Test 31
**Role Name**: `IdentityEXE - MultiType Test 31`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Identity.country NOT_EQUALS "US" OR Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Non-US identities or AD HR account owners.

---

#### IdentityEXE - MultiType Test 32
**Role Name**: `IdentityEXE - MultiType Test 32`  
**Criteria For Role**:
```text
IdentityAttribute Contains 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Identity.jobTitle CONTAINS "Executive" OR Active Directory department EQUALS "Corporate")
```
**Expected Output**: Executive identities or corporate AD account holders.

---

#### IdentityEXE - MultiType Test 33
**Role Name**: `IdentityEXE - MultiType Test 33`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Contain 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Identity.jobTitle DOES_NOT_CONTAIN "Junior" OR Active Directory department EQUALS "Engineering")
```
**Expected Output**: Mid/senior staff or AD Engineering accounts.

---

#### IdentityEXE - MultiType Test 34
**Role Name**: `IdentityEXE - MultiType Test 34`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Identity.location STARTS_WITH "Lon" OR Active Directory department EQUALS "Sales")
```
**Expected Output**: London personnel or AD Sales account owners.

---

#### IdentityEXE - MultiType Test 35
**Role Name**: `IdentityEXE - MultiType Test 35`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
OR
AccountAttribute Equals 1 Attribute
(Identity.location ENDS_WITH "ich" OR Active Directory department EQUALS "Human Resources")
```
**Expected Output**: Munich/Zurich staff or AD HR accounts.

---

#### IdentityEXE - MultiType Test 36
**Role Name**: `IdentityEXE - MultiType Test 36`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
AccountAttribute Does Not Equal 1 Attribute
(Identity.department EQUALS "Human Resources" OR Active Directory department NOT_EQUALS "Finance")
```
**Expected Output**: Broad union across identity department and negative account filter.

---

#### IdentityEXE - MultiType Test 37
**Role Name**: `IdentityEXE - MultiType Test 37`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
OR
AccountAttribute Equals 1 Attribute
(Identity.location EQUALS ["Munich", "London"] OR Active Directory department EQUALS "Human Resources")
```
**Expected Output**: European hub staff or AD HR account owners.

---

#### IdentityEXE - MultiType Test 38
**Role Name**: `IdentityEXE - MultiType Test 38`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
AccountAttribute Equals Multi-Value
(Identity.department EQUALS "Human Resources" OR Active Directory department EQUALS ["Finance", "Legal"])
```
**Expected Output**: HR staff or AD accounts in Finance/Legal.

---

### Part 4.5: Account Attribute + Entitlement (AND)

#### IdentityEXE - MultiType Test 39
**Role Name**: `IdentityEXE - MultiType Test 39`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Active Directory department EQUALS "Human Resources" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Must have AD account in HR AND possess AD Employees group.

---

#### IdentityEXE - MultiType Test 40
**Role Name**: `IdentityEXE - MultiType Test 40`  
**Criteria For Role**:
```text
AccountAttribute Does Not Equal 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Active Directory department NOT_EQUALS "Finance" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: AD account outside Finance with AD Employees group.

---

#### IdentityEXE - MultiType Test 41
**Role Name**: `IdentityEXE - MultiType Test 41`  
**Criteria For Role**:
```text
AccountAttribute Contains 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Active Directory mail CONTAINS "demo" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Corporate email domain account with Employees group.

---

#### IdentityEXE - MultiType Test 42
**Role Name**: `IdentityEXE - MultiType Test 42`  
**Criteria For Role**:
```text
AccountAttribute StartsWith 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
(Active Directory sAMAccountName STARTS_WITH "D" AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Username starting with D possessing Employees group.

---

#### IdentityEXE - MultiType Test 43
**Role Name**: `IdentityEXE - MultiType Test 43`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
AND
Entitlement Does Not Equal 1 Entitlement Value
(Active Directory department EQUALS "Human Resources" AND Active Directory memberOf NOT_EQUALS "DEV_All")
```
**Expected Output**: AD HR accounts without DEV_All group.

---

#### IdentityEXE - MultiType Test 44
**Role Name**: `IdentityEXE - MultiType Test 44`  
**Criteria For Role**:
```text
AccountAttribute Equals Multi-Value
AND
Entitlement Equals 1 Entitlement Value
(Active Directory department EQUALS ["Human Resources", "Finance"] AND Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: AD HR or Finance accounts holding Employees group.

---

#### IdentityEXE - MultiType Test 45
**Role Name**: `IdentityEXE - MultiType Test 45`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
AND
Entitlement Equals Multi-Value
(Active Directory department EQUALS "Human Resources" AND Active Directory memberOf EQUALS ["Employees", "DEV_All"])
```
**Expected Output**: AD HR account holding at least one specified entitlement.

---

### Part 4.6: Account Attribute + Entitlement (OR)

#### IdentityEXE - MultiType Test 46
**Role Name**: `IdentityEXE - MultiType Test 46`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Active Directory department EQUALS "Human Resources" OR Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: AD HR account owners or any user with DEV_All group.

---

#### IdentityEXE - MultiType Test 47
**Role Name**: `IdentityEXE - MultiType Test 47`  
**Criteria For Role**:
```text
AccountAttribute Does Not Equal 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Active Directory department NOT_EQUALS "Finance" OR Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Accounts outside Finance or holders of Employees group.

---

#### IdentityEXE - MultiType Test 48
**Role Name**: `IdentityEXE - MultiType Test 48`  
**Criteria For Role**:
```text
AccountAttribute Contains 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Active Directory displayName CONTAINS "Admin" OR Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: Display name contains Admin or DEV_All members.

---

#### IdentityEXE - MultiType Test 49
**Role Name**: `IdentityEXE - MultiType Test 49`  
**Criteria For Role**:
```text
AccountAttribute StartsWith 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
(Active Directory sAMAccountName STARTS_WITH "adm_" OR Active Directory memberOf EQUALS "Employees")
```
**Expected Output**: Admin account owners or Employees group holders.

---

#### IdentityEXE - MultiType Test 50
**Role Name**: `IdentityEXE - MultiType Test 50`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
OR
Entitlement Does Not Equal 1 Entitlement Value
(Active Directory department EQUALS "Finance" OR Active Directory memberOf NOT_EQUALS "DEV_All")
```
**Expected Output**: Finance accounts or anyone without DEV_All group.

---

#### IdentityEXE - MultiType Test 51
**Role Name**: `IdentityEXE - MultiType Test 51`  
**Criteria For Role**:
```text
AccountAttribute Equals Multi-Value
OR
Entitlement Equals 1 Entitlement Value
(Active Directory department EQUALS ["HR", "Finance"] OR Active Directory memberOf EQUALS "DEV_All")
```
**Expected Output**: HR/Finance accounts or DEV_All members.

---

#### IdentityEXE - MultiType Test 52
**Role Name**: `IdentityEXE - MultiType Test 52`  
**Criteria For Role**:
```text
AccountAttribute Equals 1 Attribute
OR
Entitlement Equals Multi-Value
(Active Directory department EQUALS "Engineering" OR Active Directory memberOf EQUALS ["Employees", "DEV_All"])
```
**Expected Output**: Engineering accounts or holders of specified groups.

---

### Part 4.7: Tri-Type Combinations (All AND / All OR)

#### IdentityEXE - MultiType Test 53
**Role Name**: `IdentityEXE - MultiType Test 53`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
AND
AccountAttribute Equals 1 Attribute
(Identity.cloudLifecycleState EQUALS "active" AND Active Directory memberOf EQUALS "Employees" AND Active Directory department EQUALS "Human Resources")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "AND",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "EQUALS",
      "key": { "type": "IDENTITY", "property": "attribute.cloudLifecycleState", "sourceId": null },
      "stringValue": "active",
      "values": null,
      "children": null
    },
    {
      "operation": "EQUALS",
      "key": {
        "type": "ENTITLEMENT",
        "property": "attribute.memberOf",
        "sourceId": "41e0e50d6ff74103a53652767b2407e6"
      },
      "stringValue": "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
      "values": null,
      "children": null
    },
    {
      "operation": "EQUALS",
      "key": {
        "type": "ACCOUNT",
        "property": "attribute.department",
        "sourceId": "41e0e50d6ff74103a53652767b2407e6"
      },
      "stringValue": "Human Resources",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output & Simulator Matching Logic**:
- **3-Way Intersection**: Identity must be active in ISC, possess the AD Employees entitlement, AND possess an AD account where department is "Human Resources".

---

#### IdentityEXE - MultiType Test 54
**Role Name**: `IdentityEXE - MultiType Test 54`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
AND
Entitlement Equals Multi-Value
AND
AccountAttribute Equals 1 Attribute
(Identity.location EQUALS ["Munich", "London"] AND AD.memberOf EQUALS ["Employees", "DEV_All"] AND AD.domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Multi-value identity and entitlement conditions intersected with account domain.

---

#### IdentityEXE - MultiType Test 55
**Role Name**: `IdentityEXE - MultiType Test 55`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
AND
Entitlement Does Not Equal 1 Entitlement Value
AND
AccountAttribute Equals 1 Attribute
(Identity.cloudLifecycleState EQUALS "active" AND AD.memberOf NOT_EQUALS "DEV_All" AND AD.department EQUALS "Human Resources")
```
**Expected Output**: Active HR employees explicitly excluding developers.

---

#### IdentityEXE - MultiType Test 56
**Role Name**: `IdentityEXE - MultiType Test 56`  
**Criteria For Role**:
```text
IdentityAttribute StartsWith 1 Attribute
AND
Entitlement Equals 1 Entitlement Value
AND
AccountAttribute Contains 1 Attribute
(Identity.location STARTS_WITH "Mun" AND AD.memberOf EQUALS "Employees" AND AD.mail CONTAINS "demo")
```
**Expected Output**: Munich-located employees with corporate email in AD.

---

#### IdentityEXE - MultiType Test 57
**Role Name**: `IdentityEXE - MultiType Test 57`  
**Criteria For Role**:
```text
IdentityAttribute Equals 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
OR
AccountAttribute Equals 1 Attribute
(Identity.department EQUALS "Human Resources" OR AD.memberOf EQUALS "DEV_All" OR AD.department EQUALS "Finance")
```
**Expected Output**: Union of HR identities, DEV_All group holders, or AD Finance account owners.

---

#### IdentityEXE - MultiType Test 58
**Role Name**: `IdentityEXE - MultiType Test 58`  
**Criteria For Role**:
```text
IdentityAttribute Equals Multi-Value
OR
Entitlement Equals Multi-Value
OR
AccountAttribute Equals 1 Attribute
(Identity.location EQUALS ["Munich", "Tokyo"] OR AD.memberOf EQUALS ["Employees", "TaxAccounting"] OR AD.department EQUALS "Engineering")
```
**Expected Output**: Broad union across multi-value regional hubs, groups, and engineering accounts.

---

#### IdentityEXE - MultiType Test 59
**Role Name**: `IdentityEXE - MultiType Test 59`  
**Criteria For Role**:
```text
IdentityAttribute Does Not Equal 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
OR
AccountAttribute Does Not Equal 1 Attribute
(Identity.country NOT_EQUALS "US" OR AD.memberOf EQUALS "Employees" OR AD.department NOT_EQUALS "Finance")
```
**Expected Output**: Negative conditions combined with entitlement assignment.

---

#### IdentityEXE - MultiType Test 60
**Role Name**: `IdentityEXE - MultiType Test 60`  
**Criteria For Role**:
```text
IdentityAttribute EndsWith 1 Attribute
OR
Entitlement Equals 1 Entitlement Value
OR
AccountAttribute StartsWith 1 Attribute
(Identity.location ENDS_WITH "ich" OR AD.memberOf EQUALS "DEV_All" OR AD.sAMAccountName STARTS_WITH "adm_")
```
**Expected Output**: Munich/Zurich staff, developers, or admin account holders.

---

### Part 4.8: Tri-Type Nested Mixed Boolean Trees

#### IdentityEXE - MultiType Test 61
**Role Name**: `IdentityEXE - MultiType Test 61`  
**Criteria For Role**:
```text
(IdentityAttribute Equals AND Entitlement Equals)
OR
AccountAttribute Equals
((Identity.department EQUALS "Human Resources" AND AD.memberOf EQUALS "Employees") OR AD.department EQUALS "Human Resources")
```
**ISC Criteria JSON Payload**:
```json
{
  "operation": "OR",
  "key": null,
  "stringValue": null,
  "values": null,
  "children": [
    {
      "operation": "AND",
      "key": null,
      "stringValue": null,
      "values": null,
      "children": [
        {
          "operation": "EQUALS",
          "key": { "type": "IDENTITY", "property": "attribute.department", "sourceId": null },
          "stringValue": "Human Resources",
          "values": null,
          "children": null
        },
        {
          "operation": "EQUALS",
          "key": { "type": "ENTITLEMENT", "property": "attribute.memberOf", "sourceId": "41e0e50d6ff74103a53652767b2407e6" },
          "stringValue": "CN=Employees,OU=BirthRight,OU=Groups,OU=Demo,DC=seri,DC=sailpointdemo,DC=com",
          "values": null,
          "children": null
        }
      ]
    },
    {
      "operation": "EQUALS",
      "key": { "type": "ACCOUNT", "property": "attribute.department", "sourceId": "41e0e50d6ff74103a53652767b2407e6" },
      "stringValue": "Human Resources",
      "values": null,
      "children": null
    }
  ]
}
```
**Expected Output**: Identities satisfying (HR and Employees group) OR holding an AD HR account.

---

#### IdentityEXE - MultiType Test 62
**Role Name**: `IdentityEXE - MultiType Test 62`  
**Criteria For Role**:
```text
(IdentityAttribute Equals AND AccountAttribute Equals)
OR
Entitlement Equals
((Identity.location EQUALS "Munich" AND AD.domain EQUALS "sailpointdemo.com") OR AD.memberOf EQUALS "DEV_All")
```
**Expected Output**: Munich corporate account holders OR developers.

---

#### IdentityEXE - MultiType Test 63
**Role Name**: `IdentityEXE - MultiType Test 63`  
**Criteria For Role**:
```text
(AccountAttribute Equals AND Entitlement Equals)
OR
IdentityAttribute Equals
((AD.department EQUALS "Human Resources" AND AD.memberOf EQUALS "Employees") OR Identity.department EQUALS "Finance")
```
**Expected Output**: Verified AD HR staff OR any Finance identity.

---

#### IdentityEXE - MultiType Test 64
**Role Name**: `IdentityEXE - MultiType Test 64`  
**Criteria For Role**:
```text
(IdentityAttribute Equals OR Entitlement Equals)
AND
AccountAttribute Equals
((Identity.department EQUALS "Human Resources" OR AD.memberOf EQUALS "Employees") AND AD.domain EQUALS "sailpointdemo.com")
```
**Expected Output**: Corporate domain account holders who either work in HR or hold the Employees group.

---

#### IdentityEXE - MultiType Test 65
**Role Name**: `IdentityEXE - MultiType Test 65`  
**Criteria For Role**:
```text
(IdentityAttribute Equals OR AccountAttribute Equals)
AND
Entitlement Equals
((Identity.location EQUALS "Munich" OR AD.department EQUALS "Human Resources") AND AD.memberOf EQUALS "Employees")
```
**Expected Output**: Must have Employees group AND (located in Munich OR AD HR account).

---

#### IdentityEXE - MultiType Test 66
**Role Name**: `IdentityEXE - MultiType Test 66`  
**Criteria For Role**:
```text
(AccountAttribute Equals OR Entitlement Equals)
AND
IdentityAttribute Equals
((AD.department EQUALS "Human Resources" OR AD.memberOf EQUALS "Employees") AND Identity.cloudLifecycleState EQUALS "active")
```
**Expected Output**: Active lifecycle identities meeting either the AD account department or group condition.

---

#### IdentityEXE - MultiType Test 67
**Role Name**: `IdentityEXE - MultiType Test 67`  
**Criteria For Role**:
```text
IdentityAttribute Equals
AND
(Entitlement Equals OR AccountAttribute Equals)
(Identity.cloudLifecycleState EQUALS "active" AND (AD.memberOf EQUALS "DEV_All" OR AD.department EQUALS "Engineering"))
```
**Expected Output**: Active identities who either have DEV_All group OR an Engineering AD account.

---

#### IdentityEXE - MultiType Test 68
**Role Name**: `IdentityEXE - MultiType Test 68`  
**Criteria For Role**:
```text
IdentityAttribute Equals
OR
(Entitlement Equals AND AccountAttribute Equals)
(Identity.department EQUALS "Executive" OR (AD.memberOf EQUALS "Employees" AND AD.department EQUALS "Human Resources"))
```
**Expected Output**: Executive identities OR employees in HR.

---

#### IdentityEXE - MultiType Test 69
**Role Name**: `IdentityEXE - MultiType Test 69`  
**Criteria For Role**:
```text
(IdentityAttribute Equals Multi-Value AND Entitlement Equals)
OR
(AccountAttribute Equals AND IdentityAttribute Equals)
((Identity.location EQUALS ["Munich", "London"] AND AD.memberOf EQUALS "Employees") OR (AD.department EQUALS "Finance" AND Identity.cloudLifecycleState EQUALS "active"))
```
**Expected Output**: Complex multi-hub employees OR active corporate Finance staff.

---

#### IdentityEXE - MultiType Test 70
**Role Name**: `IdentityEXE - MultiType Test 70`  
**Criteria For Role**:
```text
(IdentityAttribute Contains OR Entitlement Equals)
AND
(AccountAttribute StartsWith OR IdentityAttribute Equals)
((Identity.jobTitle CONTAINS "Manager" OR AD.memberOf EQUALS "DEV_All") AND (AD.mail STARTS_WITH "d" OR Identity.country EQUALS "DE"))
```
**Expected Output**: Full multi-branch boolean expression stress-testing criteria parser and live tenant evaluation.

---

## PowerShell Role Criteria Testing & Validation Execution Guide

### Overview
The companion script [`Test-IdentityEXERoleCriteria.ps1`](file:///a:/Tyler/Content/Blogs/ui-plugin-role-refresher/Test-IdentityEXERoleCriteria.ps1) provides an automated empirical test and validation framework for all 163 role criteria test cases directly against your SailPoint ISC tenant.

It uses modern SailPoint ISC `/v1` REST APIs exclusively:
- `/sources/v1`: Dynamic discovery and mapping of tenant sources (e.g., Active Directory, HR, PRISM)
- `/accounts/v1`: Source-scoped account attribute retrieval and client-side attribute evaluation
- `/roles/v1`: Role creation, lifecycle management, and pagination
- `/identities/v1/process`: Triggering tenant-wide identity recalculation tasks ("Apply Changes")
- `/search/v1`: Querying identities, nested `@access()` lookups, and assignment polling

### Syntax & Usage

```powershell
# 1. Preview role payloads without modifying the tenant (Dry Run)
.\Test-IdentityEXERoleCriteria.ps1 -DryRun

# 2. Provision all 163 test roles across all categories
.\Test-IdentityEXERoleCriteria.ps1

# 3. Provision a specific category
.\Test-IdentityEXERoleCriteria.ps1 -Category IdentityAttribute
.\Test-IdentityEXERoleCriteria.ps1 -Category Entitlement
.\Test-IdentityEXERoleCriteria.ps1 -Category AccountAttribute
.\Test-IdentityEXERoleCriteria.ps1 -Category MultiType

# 4. Provision a specific test case by number
.\Test-IdentityEXERoleCriteria.ps1 -Category IdentityAttribute -TestNumber 1

# 5. Run full automated validation (Criteria Parser prediction + Apply Changes + Polling against live tenant)
.\Test-IdentityEXERoleCriteria.ps1 -Category IdentityAttribute -TestNumber 1 -Validate
.\Test-IdentityEXERoleCriteria.ps1 -Category Entitlement -Validate -AutoCleanup
.\Test-IdentityEXERoleCriteria.ps1 -Category AccountAttribute -Validate -AutoCleanup
.\Test-IdentityEXERoleCriteria.ps1 -Category MultiType -Validate -AutoCleanup

# 6. List all active IdentityEXE test roles currently present in the tenant
.\Test-IdentityEXERoleCriteria.ps1 -List

# 7. Teardown & Delete all IdentityEXE test roles from the tenant
.\Test-IdentityEXERoleCriteria.ps1 -Cleanup
```

### Manual Validation Workflow in Role Refresher
1. Open the deployed UI Plugin in your browser:
   `https://devrel-ga-25045.identitynow-demo.com/ui/plugin/56fbe377-aea9-4fe2-ab84-450ae289ba50`
2. Select any created test role (e.g. `IdentityEXE - MultiType Test 1`).
3. Verify that the Criteria Inspector renders the exact parsed expression.
4. Compare the **+ Will Gain**, **- Will Lose**, and **= Retained** identity list against the expected output defined in this document.
5. When testing is complete, run `.\Test-IdentityEXERoleCriteria.ps1 -Cleanup` to restore tenant cleanliness.

