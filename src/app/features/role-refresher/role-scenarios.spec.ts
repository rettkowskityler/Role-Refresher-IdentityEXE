import { describe, expect, it } from 'vitest';
import { TEST_POPULATION } from './testing/mock-identities.fixture';
import { evaluateRoleDefinition } from './testing/role-evaluator';
import { ROLE_TEST_SCENARIOS, RoleTestCase } from './testing/role-scenarios.fixture';

describe('SailPoint ISC Role JSON Scenarios (15 Pure Test Cases)', () => {
  it('confirms the test population has 10 diverse identity records', () => {
    expect(TEST_POPULATION.length).toBe(10);
  });

  describe.each(ROLE_TEST_SCENARIOS)(
    '$id: $name',
    (scenario: RoleTestCase) => {
      it(`evaluates criteria correctly: ${scenario.description}`, () => {
        const result = evaluateRoleDefinition(
          scenario.roleJson,
          TEST_POPULATION,
          scenario.currentlyAssigned
        );

        // 1. Verify Matching Identities
        expect(result.matchedUserIds.sort()).toEqual(
          [...scenario.expected.matchedUserIds].sort()
        );

        // 2. Verify Delta: Gain Users (+ Will Gain)
        expect(result.gainUserIds.sort()).toEqual(
          [...scenario.expected.gainUserIds].sort()
        );

        // 3. Verify Delta: Lose Users (- Will Lose / Deprovisioning Risk)
        expect(result.loseUserIds.sort()).toEqual(
          [...scenario.expected.loseUserIds].sort()
        );

        // 4. Verify Delta: Retained Users (= Retained)
        expect(result.retainedUserIds.sort()).toEqual(
          [...scenario.expected.retainedUserIds].sort()
        );
      });
    }
  );
});
