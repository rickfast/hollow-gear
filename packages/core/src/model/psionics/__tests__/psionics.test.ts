/**
 * Unit tests for psionic system (Mindcraft)
 * Tests AFP calculations, resource management, power manifestation, focus maintenance, and overload conditions
 */

import { describe, it, expect, beforeEach } from "bun:test";
import {
  // AFP and resource management
  calculateMaximumAfp,
  calculateMulticlassAfp,
  createResourcePool,
  spendAfp,
  restoreAfp,
  addTemporaryAfp,
  checkOverloadRisk,
  rollPsionicFeedback,
  getSafeAfpLimit,
  canAffordPower,
  getAfpRecoveryAmount,
  checkAfpFatigue,
  getTotalAfp,
  createSafeOverloadState,
  PSIONIC_FEEDBACK_EFFECTS,
  
  // Focus and maintenance
  calculateFocusLimit,
  canMaintainAdditionalPower,
  addMaintainedPower,
  removeMaintainedPower,
  breakAllMaintainedPowers,
  updateMaintainedPowers,
  calculateConcentrationSave,
  handleConcentrationFailure,
  getCurrentFocusUsage,
  createInitialFocusState,
  
  // Disciplines and powers
  getPowersForDiscipline,
  getPowerById,
  getPowersByTier,
  calculateAmplifiedCost,
  DISCIPLINE_POWERS,
  
  // Overload and signatures
  createPsionicSignature,
  updateSignatureAfterPowerUse,
  calculateSignatureLingerDuration,
  isSignatureDetectable,
  activatePsionicSurge,
  endPsionicSurgeTurn,
  restorePsionicSurge,
  calculateOverloadRecovery,
  checkOverloadRecovery,
  accumulateFeedbackEffects,
  clearExpiredFeedbackEffects,
  createInitialOverloadState,
  createInitialSurgeState,
  SIGNATURE_MANIFESTATIONS
} from "../index.js";

import type {
  ResourcePool,
  PsionicFocusState,
  PsionicPower,
  ExtendedOverloadState,
  PsionicSurgeState,
  PsionicSignature,
  MaintainedPower
} from "../index.js";

describe("Psionic System", () => {
  describe("AFP Calculations and Resource Management", () => {
    describe("calculateMaximumAfp", () => {
      it("should calculate AFP with minimum of 2", () => {
        expect(calculateMaximumAfp(1, -2)).toBe(2); // 1 + (-2) = -1, but minimum is 2
        expect(calculateMaximumAfp(1, 0)).toBe(2); // 1 + 0 = 1, but minimum is 2
        expect(calculateMaximumAfp(1, 1)).toBe(2); // 1 + 1 = 2
      });

      it("should calculate AFP for typical character levels", () => {
        expect(calculateMaximumAfp(3, 2)).toBe(5); // Level 3 + 2 modifier
        expect(calculateMaximumAfp(5, 3)).toBe(8); // Level 5 + 3 modifier
        expect(calculateMaximumAfp(10, 4)).toBe(14); // Level 10 + 4 modifier
        expect(calculateMaximumAfp(20, 5)).toBe(25); // Level 20 + 5 modifier
      });

      it("should handle negative ability modifiers", () => {
        expect(calculateMaximumAfp(5, -1)).toBe(4); // 5 + (-1) = 4
        expect(calculateMaximumAfp(10, -2)).toBe(8); // 10 + (-2) = 8
      });
    });

    describe("calculateMulticlassAfp", () => {
      it("should sum AFP from multiple psionic classes", () => {
        const classes = [
          { level: 3, abilityModifier: 2 }, // 5 AFP
          { level: 2, abilityModifier: 1 }  // 3 AFP
        ];
        expect(calculateMulticlassAfp(classes)).toBe(8);
      });

      it("should apply minimum of 2 to each class", () => {
        const classes = [
          { level: 1, abilityModifier: -1 }, // 2 AFP (minimum)
          { level: 1, abilityModifier: 0 }   // 2 AFP (minimum)
        ];
        expect(calculateMulticlassAfp(classes)).toBe(4);
      });

      it("should handle single class", () => {
        const classes = [{ level: 5, abilityModifier: 3 }];
        expect(calculateMulticlassAfp(classes)).toBe(8);
      });

      it("should handle empty array", () => {
        expect(calculateMulticlassAfp([])).toBe(0);
      });
    });

    describe("createResourcePool", () => {
      it("should create pool with specified maximum", () => {
        const pool = createResourcePool(10);
        expect(pool.maximum).toBe(10);
        expect(pool.current).toBe(10);
        expect(pool.temporary).toBe(0);
      });

      it("should create pool with custom current value", () => {
        const pool = createResourcePool(10, 5);
        expect(pool.maximum).toBe(10);
        expect(pool.current).toBe(5);
        expect(pool.temporary).toBe(0);
      });
    });

    describe("spendAfp", () => {
      let pool: ResourcePool;

      beforeEach(() => {
        pool = createResourcePool(10, 8); // 8/10 AFP
      });

      it("should spend AFP successfully when sufficient", () => {
        const result = spendAfp(pool, 3);
        expect(result.success).toBe(true);
        expect(result.pool.current).toBe(5);
        expect(result.remaining).toBe(5);
      });

      it("should fail when insufficient AFP", () => {
        const result = spendAfp(pool, 12);
        expect(result.success).toBe(false);
        expect(result.pool.current).toBe(8); // Unchanged
        expect(result.remaining).toBe(8);
      });

      it("should spend temporary AFP first", () => {
        const poolWithTemp = addTemporaryAfp(pool, 3); // 8 current + 3 temp = 11 total
        const result = spendAfp(poolWithTemp, 5);
        
        expect(result.success).toBe(true);
        expect(result.pool.temporary).toBe(0); // All 3 temp spent
        expect(result.pool.current).toBe(6); // 2 current spent (5 - 3 temp)
        expect(result.remaining).toBe(6);
      });

      it("should handle exact AFP amount", () => {
        const result = spendAfp(pool, 8);
        expect(result.success).toBe(true);
        expect(result.pool.current).toBe(0);
        expect(result.remaining).toBe(0);
      });
    });

    describe("restoreAfp", () => {
      let depleted: ResourcePool;

      beforeEach(() => {
        depleted = createResourcePool(10, 3); // 3/10 AFP
        depleted.temporary = 2;
      });

      it("should fully restore AFP on short rest", () => {
        const restored = restoreAfp(depleted, 'short');
        expect(restored.current).toBe(10);
        expect(restored.maximum).toBe(10);
        expect(restored.temporary).toBe(2); // Temporary AFP preserved
      });

      it("should fully restore AFP and clear temporary on long rest", () => {
        const restored = restoreAfp(depleted, 'long');
        expect(restored.current).toBe(10);
        expect(restored.maximum).toBe(10);
        expect(restored.temporary).toBe(0); // Temporary AFP cleared
      });
    });

    describe("checkOverloadRisk", () => {
      it("should detect no overload for safe AFP expenditure", () => {
        const overload = checkOverloadRisk(3, 5, 10); // Spending 3 AFP at level 5
        expect(overload.isOverloaded).toBe(false);
        expect(overload.excessAfp).toBe(0);
        expect(overload.feedbackRisk).toBe(false);
      });

      it("should detect overload when exceeding character level", () => {
        const overload = checkOverloadRisk(7, 5, 10); // Spending 7 AFP at level 5
        expect(overload.isOverloaded).toBe(true);
        expect(overload.excessAfp).toBe(2); // 7 - 5 = 2 excess
        expect(overload.saveDc).toBe(14); // 12 + 2 excess
        expect(overload.feedbackRisk).toBe(true);
        expect(overload.lastOverloadTime).toBeInstanceOf(Date);
      });

      it("should calculate correct save DC for high overload", () => {
        const overload = checkOverloadRisk(15, 8, 20); // Spending 15 AFP at level 8
        expect(overload.excessAfp).toBe(7); // 15 - 8 = 7 excess
        expect(overload.saveDc).toBe(19); // 12 + 7 excess
      });
    });

    describe("rollPsionicFeedback", () => {
      it("should return a valid feedback effect", () => {
        const feedback = rollPsionicFeedback();
        expect(feedback).toBeDefined();
        expect(feedback.type).toBeDefined();
        expect(feedback.description).toBeDefined();
        expect(Object.values(PSIONIC_FEEDBACK_EFFECTS)).toContain(feedback);
      });

      it("should return different effects on multiple rolls", () => {
        const results = new Set();
        for (let i = 0; i < 20; i++) {
          results.add(rollPsionicFeedback().type);
        }
        expect(results.size).toBeGreaterThan(1); // Should get different results
      });
    });

    describe("utility functions", () => {
      it("getSafeAfpLimit should return character level", () => {
        expect(getSafeAfpLimit(5)).toBe(5);
        expect(getSafeAfpLimit(12)).toBe(12);
      });

      it("canAffordPower should check total available AFP", () => {
        const pool = createResourcePool(10, 5);
        pool.temporary = 2; // 5 + 2 = 7 total
        
        expect(canAffordPower(pool, 6)).toBe(true);
        expect(canAffordPower(pool, 7)).toBe(true);
        expect(canAffordPower(pool, 8)).toBe(false);
      });

      it("checkAfpFatigue should detect when AFP is depleted", () => {
        const empty = createResourcePool(10, 0);
        expect(checkAfpFatigue(empty)).toBe(true);
        
        const withTemp = createResourcePool(10, 0);
        withTemp.temporary = 1;
        expect(checkAfpFatigue(withTemp)).toBe(false);
        
        const normal = createResourcePool(10, 5);
        expect(checkAfpFatigue(normal)).toBe(false);
      });

      it("getTotalAfp should sum current and temporary", () => {
        const pool = createResourcePool(10, 6);
        pool.temporary = 3;
        expect(getTotalAfp(pool)).toBe(9);
      });
    });
  });

  describe("Focus and Power Maintenance", () => {
    describe("calculateFocusLimit", () => {
      it("should return 1 for levels 1-5", () => {
        expect(calculateFocusLimit(1)).toBe(1);
        expect(calculateFocusLimit(3)).toBe(1);
        expect(calculateFocusLimit(5)).toBe(1);
      });

      it("should return 2 for levels 6-9", () => {
        expect(calculateFocusLimit(6)).toBe(2);
        expect(calculateFocusLimit(8)).toBe(2);
        expect(calculateFocusLimit(9)).toBe(2);
      });

      it("should return 3 for levels 10+", () => {
        expect(calculateFocusLimit(10)).toBe(3);
        expect(calculateFocusLimit(15)).toBe(3);
        expect(calculateFocusLimit(20)).toBe(3);
      });
    });

    describe("canMaintainAdditionalPower", () => {
      let focusState: PsionicFocusState;
      let testPower: PsionicPower;

      beforeEach(() => {
        focusState = createInitialFocusState(5); // Focus limit of 1
        // Create a test power that requires focus
        testPower = {
          ...getPowerById("telekinetic-grip")!,
          id: "test-focus-power",
          requiresFocus: true,
          requiresConcentration: false
        };
      });

      it("should allow maintaining power when under focus limit", () => {
        const result = canMaintainAdditionalPower(focusState, testPower);
        expect(result.canMaintain).toBe(true);
        expect(result.reason).toBeUndefined();
      });

      it("should prevent maintaining power when focus limit reached", () => {
        // Add a maintained power that requires focus
        focusState = addMaintainedPower(focusState, testPower);
        
        const result = canMaintainAdditionalPower(focusState, testPower);
        expect(result.canMaintain).toBe(false);
        expect(result.reason).toContain("Focus limit reached");
      });

      it("should prevent multiple concentration powers", () => {
        const concentrationPower = getPowerById("kinetic-barrier")!; // Requires concentration
        focusState.concentrationPower = "kinetic-barrier";
        
        const result = canMaintainAdditionalPower(focusState, concentrationPower);
        expect(result.canMaintain).toBe(false);
        expect(result.reason).toContain("Already concentrating");
      });

      it("should allow non-focus powers when focus limit reached", () => {
        // Fill focus limit
        focusState = addMaintainedPower(focusState, testPower);
        
        // Try to add a power that doesn't require focus
        const nonFocusPower: PsionicPower = {
          ...testPower,
          id: "test-non-focus-power",
          requiresFocus: false,
          requiresConcentration: false
        };
        
        const result = canMaintainAdditionalPower(focusState, nonFocusPower);
        expect(result.canMaintain).toBe(true);
      });
    });

    describe("addMaintainedPower", () => {
      let focusState: PsionicFocusState;
      let testPower: PsionicPower;

      beforeEach(() => {
        focusState = createInitialFocusState(10);
        testPower = getPowerById("telekinetic-grip")!;
      });

      it("should add maintained power to focus state", () => {
        const newState = addMaintainedPower(focusState, testPower);
        
        expect(newState.maintainedPowers).toHaveLength(1);
        expect(newState.maintainedPowers[0].powerId).toBe(testPower.id);
        expect(newState.maintainedPowers[0].power).toBe(testPower);
        expect(newState.maintainedPowers[0].startTime).toBeInstanceOf(Date);
      });

      it("should set concentration power when required", () => {
        const concentrationPower = getPowerById("kinetic-barrier")!;
        const newState = addMaintainedPower(focusState, concentrationPower);
        
        expect(newState.concentrationPower).toBe(concentrationPower.id);
      });

      it("should include amplification level and target info", () => {
        const targetInfo = { targetName: "Test Target", area: "10-ft radius" };
        const newState = addMaintainedPower(focusState, testPower, 2, targetInfo);
        
        const maintained = newState.maintainedPowers[0];
        expect(maintained.amplificationLevel).toBe(2);
        expect(maintained.targetInfo).toEqual(targetInfo);
      });
    });

    describe("removeMaintainedPower", () => {
      let focusState: PsionicFocusState;
      let testPower: PsionicPower;

      beforeEach(() => {
        focusState = createInitialFocusState(10);
        // Create a test power that requires focus for backlash testing
        testPower = {
          ...getPowerById("telekinetic-grip")!,
          id: "test-focus-power",
          requiresFocus: true,
          requiresConcentration: false
        };
        focusState = addMaintainedPower(focusState, testPower);
      });

      it("should remove maintained power successfully", () => {
        const { newState, result } = removeMaintainedPower(focusState, testPower.id);
        
        expect(result.success).toBe(true);
        expect(result.powersDropped).toEqual([testPower.id]);
        expect(newState.maintainedPowers).toHaveLength(0);
        expect(newState.lastFocusBreak).toBeDefined();
      });

      it("should handle removing non-existent power", () => {
        const { newState, result } = removeMaintainedPower(focusState, "non-existent");
        
        expect(result.success).toBe(false);
        expect(result.powersDropped).toEqual([]);
        expect(newState).toBe(focusState); // Unchanged
      });

      it("should cause psychic backlash for involuntary focus breaks", () => {
        const { result } = removeMaintainedPower(focusState, testPower.id, 'damage_taken');
        
        expect(result.psychicBacklash).toBe(true);
        expect(result.backlashDamage).toBe('1d4');
        expect(result.cause).toBe('damage_taken');
      });

      it("should not cause backlash for voluntary breaks", () => {
        const { result } = removeMaintainedPower(focusState, testPower.id, 'voluntary');
        
        expect(result.psychicBacklash).toBe(false);
        expect(result.backlashDamage).toBeUndefined();
      });

      it("should clear concentration power when removed", () => {
        const concentrationPower = getPowerById("kinetic-barrier")!;
        focusState = addMaintainedPower(focusState, concentrationPower);
        
        const { newState } = removeMaintainedPower(focusState, concentrationPower.id);
        expect(newState.concentrationPower).toBeUndefined();
      });
    });

    describe("breakAllMaintainedPowers", () => {
      let focusState: PsionicFocusState;

      beforeEach(() => {
        focusState = createInitialFocusState(10);
        // Create powers that require focus for backlash testing
        const power1: PsionicPower = {
          ...getPowerById("telekinetic-grip")!,
          id: "test-focus-power-1",
          requiresFocus: true,
          requiresConcentration: false
        };
        const power2: PsionicPower = {
          ...getPowerById("kinetic-barrier")!,
          id: "test-focus-power-2", 
          requiresFocus: true,
          requiresConcentration: false
        };
        
        focusState = addMaintainedPower(focusState, power1);
        focusState = addMaintainedPower(focusState, power2);
      });

      it("should break all maintained powers", () => {
        const { newState, result } = breakAllMaintainedPowers(focusState, 'unconscious');
        
        expect(newState.maintainedPowers).toHaveLength(0);
        expect(newState.concentrationPower).toBeUndefined();
        expect(result.powersDropped).toHaveLength(2);
        expect(result.psychicBacklash).toBe(true); // Has focus-requiring powers
      });

      it("should not cause backlash if no focus powers", () => {
        // Create state with only non-focus powers
        const nonFocusState = createInitialFocusState(10);
        const nonFocusPower: PsionicPower = {
          ...getPowerById("telekinetic-grip")!,
          id: "non-focus-power",
          requiresFocus: false,
          requiresConcentration: false
        };
        const stateWithNonFocus = addMaintainedPower(nonFocusState, nonFocusPower);
        
        const { result } = breakAllMaintainedPowers(stateWithNonFocus, 'unconscious');
        expect(result.psychicBacklash).toBe(false);
      });
    });

    describe("updateMaintainedPowers", () => {
      let focusState: PsionicFocusState;
      let timedPower: PsionicPower;

      beforeEach(() => {
        focusState = createInitialFocusState(10);
        timedPower = {
          ...getPowerById("telekinetic-grip")!,
          duration: { minutes: 5 }
        };
        focusState = addMaintainedPower(focusState, timedPower);
      });

      it("should reduce remaining duration", () => {
        const updated = updateMaintainedPowers(focusState, { minutes: 2 });
        
        expect(updated.maintainedPowers).toHaveLength(1);
        expect(updated.maintainedPowers[0].remainingDuration).toBe(3); // 5 - 2 = 3
      });

      it("should remove expired powers", () => {
        const updated = updateMaintainedPowers(focusState, { minutes: 6 });
        
        expect(updated.maintainedPowers).toHaveLength(0);
        expect(updated.concentrationPower).toBeUndefined();
      });

      it("should handle powers without duration tracking", () => {
        const instantPower: PsionicPower = {
          ...getPowerById("telekinetic-grip")!,
          duration: "instantaneous"
        };
        const stateWithInstant = addMaintainedPower(focusState, instantPower);
        
        const updated = updateMaintainedPowers(stateWithInstant, { minutes: 1 });
        expect(updated.maintainedPowers).toHaveLength(1); // Instant power removed, timed power remains
      });
    });

    describe("concentration mechanics", () => {
      it("calculateConcentrationSave should use correct formula", () => {
        expect(calculateConcentrationSave(5)).toBe(10); // Min 10
        expect(calculateConcentrationSave(20)).toBe(10); // 20/2 = 10
        expect(calculateConcentrationSave(30)).toBe(15); // 30/2 = 15
        expect(calculateConcentrationSave(50)).toBe(25); // 50/2 = 25
      });

      it("handleConcentrationFailure should remove concentration power", () => {
        let focusState = createInitialFocusState(10);
        const concentrationPower = getPowerById("kinetic-barrier")!;
        focusState = addMaintainedPower(focusState, concentrationPower);
        
        const { newState, result } = handleConcentrationFailure(focusState);
        
        expect(result.success).toBe(true);
        expect(result.powersDropped).toEqual([concentrationPower.id]);
        expect(newState.concentrationPower).toBeUndefined();
      });

      it("handleConcentrationFailure should handle no concentration power", () => {
        const focusState = createInitialFocusState(10);
        
        const { newState, result } = handleConcentrationFailure(focusState);
        
        expect(result.success).toBe(false);
        expect(result.powersDropped).toEqual([]);
        expect(newState).toBe(focusState);
      });
    });

    describe("getCurrentFocusUsage", () => {
      it("should calculate focus usage correctly", () => {
        let focusState = createInitialFocusState(10); // Focus limit 3
        
        const usage1 = getCurrentFocusUsage(focusState);
        expect(usage1.used).toBe(0);
        expect(usage1.limit).toBe(3);
        expect(usage1.available).toBe(3);
        expect(usage1.concentrationUsed).toBe(false);
        
        // Add focus-requiring power
        const focusPower: PsionicPower = {
          ...getPowerById("telekinetic-grip")!,
          id: "test-focus-power",
          requiresFocus: true,
          requiresConcentration: true
        };
        focusState = addMaintainedPower(focusState, focusPower);
        
        const usage2 = getCurrentFocusUsage(focusState);
        expect(usage2.used).toBe(1);
        expect(usage2.available).toBe(2);
        expect(usage2.concentrationUsed).toBe(true); // test power requires concentration
      });
    });
  });

  describe("Power Manifestation and Disciplines", () => {
    describe("getPowersForDiscipline", () => {
      it("should return powers for valid disciplines", () => {
        const fluxPowers = getPowersForDiscipline("flux");
        expect(fluxPowers.length).toBeGreaterThan(0);
        expect(fluxPowers.every(p => p.discipline === "flux")).toBe(true);
        
        const echoPowers = getPowersForDiscipline("echo");
        expect(echoPowers.length).toBeGreaterThan(0);
        expect(echoPowers.every(p => p.discipline === "echo")).toBe(true);
      });

      it("should return all expected disciplines", () => {
        const disciplines = ["flux", "echo", "eidolon", "empyric", "veil", "kinesis"] as const;
        
        for (const discipline of disciplines) {
          const powers = getPowersForDiscipline(discipline);
          expect(powers.length).toBeGreaterThan(0);
        }
      });
    });

    describe("getPowerById", () => {
      it("should find existing powers", () => {
        const power = getPowerById("entropy-lash");
        expect(power).toBeDefined();
        expect(power!.id).toBe("entropy-lash");
        expect(power!.discipline).toBe("flux");
      });

      it("should return undefined for non-existent powers", () => {
        const power = getPowerById("non-existent-power");
        expect(power).toBeUndefined();
      });

      it("should find powers from all disciplines", () => {
        const testPowers = [
          "entropy-lash", // flux
          "resonant-pulse", // echo
          "spectral-hand", // eidolon
          "empathic-link", // empyric
          "veil-touch", // veil
          "telekinetic-grip" // kinesis
        ];
        
        for (const powerId of testPowers) {
          const power = getPowerById(powerId);
          expect(power).toBeDefined();
          expect(power!.id).toBe(powerId);
        }
      });
    });

    describe("getPowersByTier", () => {
      it("should return powers of specified tier", () => {
        const tier1Powers = getPowersByTier(1);
        expect(tier1Powers.length).toBeGreaterThan(0);
        expect(tier1Powers.every(p => p.tier === 1)).toBe(true);
        
        const tier5Powers = getPowersByTier(5);
        expect(tier5Powers.length).toBeGreaterThan(0);
        expect(tier5Powers.every(p => p.tier === 5)).toBe(true);
      });

      it("should return powers from all disciplines for each tier", () => {
        for (let tier = 1; tier <= 5; tier++) {
          const powers = getPowersByTier(tier as any);
          expect(powers.length).toBeGreaterThanOrEqual(6); // At least one per discipline
        }
      });
    });

    describe("calculateAmplifiedCost", () => {
      it("should calculate amplified costs correctly", () => {
        expect(calculateAmplifiedCost(2, 1)).toBe(3); // 2 + 1 = 3
        expect(calculateAmplifiedCost(3, 2)).toBe(5); // 3 + 2 = 5
        expect(calculateAmplifiedCost(5, 3)).toBe(8); // 5 + 3 = 8
      });

      it("should cap at double base cost", () => {
        expect(calculateAmplifiedCost(2, 5)).toBe(4); // Capped at 2 * 2 = 4
        expect(calculateAmplifiedCost(3, 10)).toBe(6); // Capped at 3 * 2 = 6
      });

      it("should handle zero amplification", () => {
        expect(calculateAmplifiedCost(3, 0)).toBe(3); // 3 + 0 = 3
      });
    });

    describe("power data integrity", () => {
      it("should have valid power structures", () => {
        for (const disciplinePowers of Object.values(DISCIPLINE_POWERS)) {
          for (const power of disciplinePowers) {
            expect(power.id).toBeDefined();
            expect(power.name).toBeDefined();
            expect(power.discipline).toBeDefined();
            expect(power.tier).toBeGreaterThanOrEqual(1);
            expect(power.tier).toBeLessThanOrEqual(5);
            expect(power.afpCost).toBeGreaterThan(0);
            expect(power.effects).toBeDefined();
            expect(power.effects.length).toBeGreaterThan(0);
          }
        }
      });

      it("should have unique power IDs", () => {
        const allIds = new Set();
        for (const disciplinePowers of Object.values(DISCIPLINE_POWERS)) {
          for (const power of disciplinePowers) {
            expect(allIds.has(power.id)).toBe(false);
            allIds.add(power.id);
          }
        }
      });

      it("should have AFP costs matching tiers", () => {
        for (const disciplinePowers of Object.values(DISCIPLINE_POWERS)) {
          for (const power of disciplinePowers) {
            expect(power.afpCost).toBe(power.tier);
          }
        }
      });
    });
  });

  describe("Overload Conditions and Feedback Mechanics", () => {
    describe("psionic signatures", () => {
      it("should create valid psionic signatures", () => {
        const signature = createPsionicSignature("char-123", "rage", 5);
        
        expect(signature.characterId).toBe("char-123");
        expect(signature.baseEmotion).toBe("rage");
        expect(signature.powerLevel).toBe(5);
        expect(signature.manifestation).toEqual(SIGNATURE_MANIFESTATIONS.rage);
        expect(signature.detectabilityRange).toBe(30);
      });

      it("should update signature after power use", () => {
        const signature = createPsionicSignature("char-123", "calm", 3);
        const updated = updateSignatureAfterPowerUse(signature, 3, "rage");
        
        expect(updated.lastUsed).toBeInstanceOf(Date);
        expect(updated.manifestation.visual).toBe(SIGNATURE_MANIFESTATIONS.rage.visual);
        expect(updated.manifestation.intensity).toBe("moderate"); // Tier 3 + level 3 = 6, which is moderate
      });

      it("should calculate signature linger duration", () => {
        expect(calculateSignatureLingerDuration(1, 3)).toBe(30); // 1 * 3 * 10 = 30 minutes
        expect(calculateSignatureLingerDuration(3, 5)).toBe(150); // 3 * 5 * 10 = 150 minutes
        expect(calculateSignatureLingerDuration(5, 2)).toBe(100); // 5 * 2 * 10 = 100 minutes
      });

      it("should detect signature based on time", () => {
        const signature = createPsionicSignature("char-123", "calm", 2);
        signature.lastUsed = new Date(Date.now() - 10 * 60 * 1000); // 10 minutes ago
        
        // Tier 1 power: 1 * 2 * 10 = 20 minutes linger
        expect(isSignatureDetectable(signature, 1)).toBe(true);
        
        // Signature from 30 minutes ago should not be detectable for tier 1
        signature.lastUsed = new Date(Date.now() - 30 * 60 * 1000);
        expect(isSignatureDetectable(signature, 1)).toBe(false);
      });
    });

    describe("psionic surge", () => {
      it("should activate surge when available", () => {
        const surgeState = createInitialSurgeState();
        const { newState, success } = activatePsionicSurge(surgeState);
        
        expect(success).toBe(true);
        expect(newState.available).toBe(false);
        expect(newState.bonusActive).toBe(true);
        expect(newState.backlashPending).toBe(true);
        expect(newState.afpRecoveryBlocked).toBe(true);
        expect(newState.lastUsed).toBeInstanceOf(Date);
      });

      it("should fail to activate when not available", () => {
        const surgeState = createInitialSurgeState();
        surgeState.available = false;
        
        const { newState, success } = activatePsionicSurge(surgeState);
        
        expect(success).toBe(false);
        expect(newState).toBe(surgeState); // Unchanged
      });

      it("should end surge turn effects", () => {
        const surgeState: PsionicSurgeState = {
          available: false,
          bonusActive: true,
          backlashPending: true,
          freeAfpUsed: false,
          afpRecoveryBlocked: true,
          lastUsed: new Date()
        };
        
        const ended = endPsionicSurgeTurn(surgeState);
        
        expect(ended.bonusActive).toBe(false);
        expect(ended.backlashPending).toBe(false);
        expect(ended.afpRecoveryBlocked).toBe(true); // Still blocked until rest
      });

      it("should restore surge on rest", () => {
        const usedSurge: PsionicSurgeState = {
          available: false,
          bonusActive: false,
          backlashPending: false,
          freeAfpUsed: true,
          afpRecoveryBlocked: true,
          lastUsed: new Date()
        };
        
        const restored = restorePsionicSurge(usedSurge, 'short');
        
        expect(restored.available).toBe(true);
        expect(restored.bonusActive).toBe(false);
        expect(restored.freeAfpUsed).toBe(false);
        expect(restored.backlashPending).toBe(false);
        expect(restored.afpRecoveryBlocked).toBe(false);
        expect(restored.lastUsed).toBeUndefined();
      });
    });

    describe("overload recovery", () => {
      it("should calculate recovery time based on excess AFP", () => {
        const recovery = calculateOverloadRecovery(3);
        
        expect(recovery.isRecovering).toBe(true);
        expect(recovery.recoveryDuration).toBe(30); // 3 * 10 = 30 minutes
        expect(recovery.penaltiesActive).toBe(true);
        expect(recovery.recoveryStartTime).toBeInstanceOf(Date);
        expect(recovery.nextAfpRecoveryTime).toBeInstanceOf(Date);
      });

      it("should check recovery completion", () => {
        const recovery = calculateOverloadRecovery(2); // 2 * 10 = 20 minutes recovery
        recovery.recoveryStartTime = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
        
        // Should not be complete yet (needs 20 minutes, only 15 have passed)
        const check1 = checkOverloadRecovery(recovery);
        expect(check1.isComplete).toBe(false);
        
        // Simulate 10 minutes later (total 25 minutes, more than 20 needed)
        const futureTime = new Date(Date.now() + 10 * 60 * 1000);
        const check2 = checkOverloadRecovery(recovery, futureTime);
        expect(check2.isComplete).toBe(true);
        expect(check2.updatedRecovery!.isRecovering).toBe(false);
        expect(check2.updatedRecovery!.penaltiesActive).toBe(false);
      });
    });

    describe("feedback accumulation", () => {
      it("should stack stackable feedback effects", () => {
        const effects = [PSIONIC_FEEDBACK_EFFECTS[3]]; // neural_spark
        const newEffect = PSIONIC_FEEDBACK_EFFECTS[3]; // another neural_spark
        
        const accumulated = accumulateFeedbackEffects(effects, newEffect);
        expect(accumulated).toHaveLength(2);
        expect(accumulated.every(e => e.type === 'neural_spark')).toBe(true);
      });

      it("should replace non-stackable feedback effects", () => {
        const effects = [PSIONIC_FEEDBACK_EFFECTS[1]]; // minor_headache
        const newEffect = PSIONIC_FEEDBACK_EFFECTS[1]; // another minor_headache
        
        const accumulated = accumulateFeedbackEffects(effects, newEffect);
        expect(accumulated).toHaveLength(1);
        expect(accumulated[0].type).toBe('minor_headache');
      });

      it("should clear expired feedback effects", () => {
        const effects = [
          PSIONIC_FEEDBACK_EFFECTS[1], // minor_headache (temporary)
          PSIONIC_FEEDBACK_EFFECTS[5]  // mindfracture (persistent)
        ];
        
        const cleared = clearExpiredFeedbackEffects(effects, 15); // 15 minutes elapsed
        expect(cleared).toHaveLength(1);
        expect(cleared[0].type).toBe('mindfracture');
      });
    });

    describe("initial state creation", () => {
      it("should create safe initial overload state", () => {
        const overloadState = createInitialOverloadState();
        
        expect(overloadState.isOverloaded).toBe(false);
        expect(overloadState.excessAfp).toBe(0);
        expect(overloadState.saveDc).toBe(0);
        expect(overloadState.feedbackRisk).toBe(false);
        expect(overloadState.accumulatedFeedback).toEqual([]);
      });

      it("should create initial surge state", () => {
        const surgeState = createInitialSurgeState();
        
        expect(surgeState.available).toBe(true);
        expect(surgeState.bonusActive).toBe(false);
        expect(surgeState.freeAfpUsed).toBe(false);
        expect(surgeState.backlashPending).toBe(false);
        expect(surgeState.afpRecoveryBlocked).toBe(false);
      });

      it("should create initial focus state", () => {
        const focusState = createInitialFocusState(8);
        
        expect(focusState.focusLimit).toBe(2); // Level 8 = focus limit 2
        expect(focusState.maintainedPowers).toEqual([]);
        expect(focusState.concentrationPower).toBeUndefined();
      });
    });
  });
});