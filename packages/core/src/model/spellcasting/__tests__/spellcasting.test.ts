/**
 * Unit tests for spellcasting systems
 * Tests resource management for both Arcanist and Templar, Overclocking and Overchannel mechanics, and heat generation and feedback systems
 */

import { describe, it, expect, beforeEach } from "bun:test";

// Arcanist imports
import {
  ArcanistUtils,
  type ArcanistSpellcastingData,
  type ArcanistFormula,
  type ArcanistCastingResult
} from "../arcanist.js";

// Templar imports
import {
  TemplarUtils,
  type TemplarSpellcastingData,
  type TemplarMiracle,
  type TemplarCastingResult,
  type ResonanceType
} from "../templar.js";

// Heat and feedback imports
import {
  HeatFeedbackUtils,
  type HeatFeedbackState,
  type FeedbackEffect,
  type ConcentrationState
} from "../heat-feedback.js";

// Shared imports
import {
  HeatPointUtils,
  SpellComponentUtils,
  SpellLevelUtils,
  type KnownSpell,
  type SpellComponents
} from "../shared.js";

import type { ResourcePool } from "../../types/resources.js";

describe("Spellcasting Systems", () => {
  describe("Arcanist Spellcasting (Aether Formulae)", () => {
    let mockArcanistData: ArcanistSpellcastingData;
    let mockFormula: ArcanistFormula;

    beforeEach(() => {
      const baseSpell: KnownSpell = {
        id: "magic-missile",
        name: "Magic Missile",
        level: 1,
        school: "evocation",
        hollowGearName: "Arc Pulse Array",
        components: { verbal: true, somatic: true, material: false },
        castingTime: "1 action",
        range: "120 feet",
        duration: "Instantaneous",
        concentration: false,
        description: "Three darts of magical force"
      };

      mockFormula = ArcanistUtils.createArcanistFormula(
        baseSpell,
        1, // AFP cost
        1, // AFP scaling
        1, // Base heat generation
        true, // Can overclock
        "Additional dart per overclock level"
      );

      mockArcanistData = {
        type: 'arcanist',
        casterLevel: 5,
        spellcastingAbility: 'intelligence',
        knownSpells: [baseSpell],
        heatPoints: 2,
        maxHeatPoints: 10,
        aetherFluxPoints: { current: 8, maximum: 8, temporary: 0 },
        equilibriumTier: 3,
        overclockUses: 1,
        maxOverclockUses: 1,
        overclockMultiplier: 1.8,
        knownFormulae: [mockFormula]
      };
    });

    describe("ArcanistUtils calculations", () => {
      it("should calculate Equilibrium Tier correctly", () => {
        expect(ArcanistUtils.calculateEquilibriumTier(1)).toBe(1);
        expect(ArcanistUtils.calculateEquilibriumTier(3)).toBe(2);
        expect(ArcanistUtils.calculateEquilibriumTier(5)).toBe(3);
        expect(ArcanistUtils.calculateEquilibriumTier(9)).toBe(5);
        expect(ArcanistUtils.calculateEquilibriumTier(17)).toBe(9);
        expect(ArcanistUtils.calculateEquilibriumTier(20)).toBe(9);
      });

      it("should calculate maximum Overclock uses", () => {
        expect(ArcanistUtils.calculateMaxOverclockUses(1)).toBe(1);
        expect(ArcanistUtils.calculateMaxOverclockUses(4)).toBe(1);
        expect(ArcanistUtils.calculateMaxOverclockUses(8)).toBe(2);
        expect(ArcanistUtils.calculateMaxOverclockUses(12)).toBe(3);
        expect(ArcanistUtils.calculateMaxOverclockUses(20)).toBe(5);
      });

      it("should calculate AFP cost for different spell levels", () => {
        expect(ArcanistUtils.calculateAfpCost(mockFormula, 1)).toBe(1); // Base level
        expect(ArcanistUtils.calculateAfpCost(mockFormula, 2)).toBe(2); // +1 level
        expect(ArcanistUtils.calculateAfpCost(mockFormula, 3)).toBe(3); // +2 levels
      });

      it("should calculate heat generation", () => {
        // Normal casting
        expect(ArcanistUtils.calculateHeatGeneration(mockFormula, 1, false, 1.8)).toBe(1);
        expect(ArcanistUtils.calculateHeatGeneration(mockFormula, 2, false, 1.8)).toBe(2); // +1 for higher level
        
        // Overclocked casting
        expect(ArcanistUtils.calculateHeatGeneration(mockFormula, 1, true, 1.8)).toBe(1); // floor(1 * 1.8) = 1
        expect(ArcanistUtils.calculateHeatGeneration(mockFormula, 2, true, 1.8)).toBe(3); // floor(2 * 1.8) = 3
      });

      it("should calculate Overclock multiplier", () => {
        expect(ArcanistUtils.calculateOverclockMultiplier(1, 0)).toBe(2.0); // Base multiplier
        expect(ArcanistUtils.calculateOverclockMultiplier(4, 2)).toBe(1.7); // -0.2 for level, -0.1 for int
        expect(ArcanistUtils.calculateOverclockMultiplier(10, 4)).toBe(1.3); // 2.0 - 0.5 - 0.2 = 1.3
        expect(ArcanistUtils.calculateOverclockMultiplier(20, 5)).toBe(1.2); // Still minimum
      });
    });

    describe("Arcanist spell casting", () => {
      it("should successfully cast spell when resources are sufficient", () => {
        const result = ArcanistUtils.castFormula(mockArcanistData, mockFormula, 1, false);
        
        expect(result.success).toBe(true);
        expect(result.afpCost).toBe(1);
        expect(result.heatGenerated).toBe(1);
        expect(result.overclocked).toBe(false);
        expect(result.updatedData?.aetherFluxPoints.current).toBe(7); // 8 - 1
        expect(result.updatedData?.heatPoints).toBe(3); // 2 + 1
      });

      it("should successfully cast with Overclocking", () => {
        const result = ArcanistUtils.castFormula(mockArcanistData, mockFormula, 2, true);
        
        expect(result.success).toBe(true);
        expect(result.afpCost).toBe(2);
        expect(result.heatGenerated).toBe(3); // floor(2 * 1.8) = 3
        expect(result.overclocked).toBe(true);
        expect(result.updatedData?.overclockUses).toBe(0); // 1 - 1
        expect(result.updatedData?.aetherFluxPoints.current).toBe(6); // 8 - 2
        expect(result.updatedData?.heatPoints).toBe(5); // 2 + 3
      });

      it("should fail when insufficient AFP", () => {
        mockArcanistData.aetherFluxPoints.current = 0;
        const result = ArcanistUtils.castFormula(mockArcanistData, mockFormula, 1, false);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("Insufficient AFP: need 1, have 0");
      });

      it("should fail when spell level exceeds Equilibrium Tier", () => {
        const result = ArcanistUtils.castFormula(mockArcanistData, mockFormula, 5, false);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("Spell level 5 exceeds Equilibrium Tier 3");
      });

      it("should fail when no Overclock uses remaining", () => {
        mockArcanistData.overclockUses = 0;
        const result = ArcanistUtils.castFormula(mockArcanistData, mockFormula, 1, true);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("No Overclocking uses remaining");
      });

      it("should fail when formula cannot be Overclocked", () => {
        mockFormula.canOverclock = false;
        const result = ArcanistUtils.castFormula(mockArcanistData, mockFormula, 1, true);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("This formula cannot be Overclocked");
      });

      it("should fail when would exceed maximum heat", () => {
        mockArcanistData.heatPoints = 9; // Close to max of 10
        const result = ArcanistUtils.castFormula(mockArcanistData, mockFormula, 2, false);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("Would exceed maximum heat points (11/10)");
      });
    });

    describe("Arcanist resource management", () => {
      it("should restore Overclock uses on rest", () => {
        mockArcanistData.overclockUses = 0;
        const restored = ArcanistUtils.restoreOverclockUses(mockArcanistData);
        
        expect(restored.overclockUses).toBe(mockArcanistData.maxOverclockUses);
      });

      it("should validate Arcanist data correctly", () => {
        const validResult = ArcanistUtils.validateArcanistData(mockArcanistData);
        expect(validResult.success).toBe(true);

        // Test invalid equilibrium tier
        const invalidData = { ...mockArcanistData, equilibriumTier: -1 };
        const invalidResult = ArcanistUtils.validateArcanistData(invalidData);
        expect(invalidResult.success).toBe(false);
        if (!invalidResult.success) {
          expect(invalidResult.error).toContainEqual(
            expect.objectContaining({ code: 'INVALID_EQUILIBRIUM_TIER' })
          );
        }
      });
    });
  });

  describe("Templar Spellcasting (Resonance Charges)", () => {
    let mockTemplarData: TemplarSpellcastingData;
    let mockMiracle: TemplarMiracle;

    beforeEach(() => {
      const baseSpell: KnownSpell = {
        id: "cure-wounds",
        name: "Cure Wounds",
        level: 1,
        school: "evocation",
        hollowGearName: "Resonant Mending",
        components: { verbal: true, somatic: true, material: false },
        castingTime: "1 action",
        range: "Touch",
        duration: "Instantaneous",
        concentration: false,
        description: "Heal wounds with divine resonance"
      };

      mockMiracle = TemplarUtils.createTemplarMiracle(
        baseSpell,
        1, // RC cost
        1, // RC scaling
        1, // Base faith feedback
        'restorative', // Resonance type
        true, // Can overchannel
        "Increased healing per overchannel level"
      );

      mockTemplarData = {
        type: 'templar',
        casterLevel: 5,
        spellcastingAbility: 'wisdom',
        knownSpells: [baseSpell],
        heatPoints: 1,
        maxHeatPoints: 8,
        resonanceCharges: { current: 6, maximum: 6, temporary: 0 },
        overchannelUses: 1,
        maxOverchannelUses: 1,
        faithFeedback: 2,
        maxFaithFeedback: 15,
        knownMiracles: [mockMiracle],
        resonanceHarmony: 5
      };
    });

    describe("TemplarUtils calculations", () => {
      it("should calculate maximum Overchannel uses", () => {
        expect(TemplarUtils.calculateMaxOverchannelUses(1)).toBe(1);
        expect(TemplarUtils.calculateMaxOverchannelUses(3)).toBe(1);
        expect(TemplarUtils.calculateMaxOverchannelUses(6)).toBe(2);
        expect(TemplarUtils.calculateMaxOverchannelUses(9)).toBe(3);
        expect(TemplarUtils.calculateMaxOverchannelUses(20)).toBe(6);
      });

      it("should calculate maximum faith feedback", () => {
        expect(TemplarUtils.calculateMaxFaithFeedback(5, 3)).toBe(18); // 10 + 5 + 3
        expect(TemplarUtils.calculateMaxFaithFeedback(10, 4)).toBe(24); // 10 + 10 + 4
        expect(TemplarUtils.calculateMaxFaithFeedback(1, -1)).toBe(10); // 10 + 1 + (-1)
      });

      it("should calculate RC cost for different spell levels", () => {
        expect(TemplarUtils.calculateRcCost(mockMiracle, 1)).toBe(1); // Base level
        expect(TemplarUtils.calculateRcCost(mockMiracle, 2)).toBe(2); // +1 level
        expect(TemplarUtils.calculateRcCost(mockMiracle, 3)).toBe(3); // +2 levels
      });

      it("should calculate faith feedback generation", () => {
        // Normal casting
        expect(TemplarUtils.calculateFaithFeedback(mockMiracle, 1, false)).toBe(1);
        expect(TemplarUtils.calculateFaithFeedback(mockMiracle, 2, false)).toBe(2); // +1 for higher level
        
        // Overchanneled casting
        expect(TemplarUtils.calculateFaithFeedback(mockMiracle, 1, true)).toBe(2); // 1 * 2
        expect(TemplarUtils.calculateFaithFeedback(mockMiracle, 2, true)).toBe(4); // 2 * 2
      });

      it("should calculate harmony bonus", () => {
        const recentCastings: ResonanceType[] = ['restorative', 'restorative', 'divine'];
        
        // Same type count: 2, harmony level: 5
        const bonus = TemplarUtils.calculateHarmonyBonus(5, 'restorative', recentCastings);
        expect(bonus).toBe(3); // min(3, 2) + floor(5/5) = 2 + 1 = 3
        
        // Different type
        const bonus2 = TemplarUtils.calculateHarmonyBonus(5, 'protective', recentCastings);
        expect(bonus2).toBe(1); // min(3, 0) + floor(5/5) = 0 + 1 = 1
      });

      it("should update resonance harmony", () => {
        const recentCastings: ResonanceType[] = ['divine', 'protective'];
        
        // Successful casting with varied types increases harmony
        const newHarmony = TemplarUtils.updateResonanceHarmony(
          5, 'restorative', recentCastings, true
        );
        expect(newHarmony).toBe(7); // 5 + min(2, 3-1) = 5 + 2 = 7
        
        // Failed casting reduces harmony
        const failedHarmony = TemplarUtils.updateResonanceHarmony(
          5, 'restorative', recentCastings, false
        );
        expect(failedHarmony).toBe(3); // max(0, 5 - 2) = 3
      });
    });

    describe("Templar spell casting", () => {
      it("should successfully cast miracle when resources are sufficient", () => {
        const result = TemplarUtils.castMiracle(mockTemplarData, mockMiracle, 1, false);
        
        expect(result.success).toBe(true);
        expect(result.rcCost).toBe(1);
        expect(result.faithFeedbackGenerated).toBe(1);
        expect(result.heatGenerated).toBe(1); // floor(1/2) = 0, but min 1
        expect(result.overchanneled).toBe(false);
        expect(result.updatedData?.resonanceCharges.current).toBe(5); // 6 - 1
        expect(result.updatedData?.faithFeedback).toBe(3); // 2 + 1
      });

      it("should successfully cast with Overchannel", () => {
        const result = TemplarUtils.castMiracle(mockTemplarData, mockMiracle, 2, true);
        
        expect(result.success).toBe(true);
        expect(result.rcCost).toBe(2);
        expect(result.faithFeedbackGenerated).toBe(4); // 2 * 2 for overchannel
        expect(result.heatGenerated).toBe(2); // floor(4/2) = 2
        expect(result.overchanneled).toBe(true);
        expect(result.updatedData?.overchannelUses).toBe(0); // 1 - 1
        expect(result.updatedData?.resonanceCharges.current).toBe(4); // 6 - 2
        expect(result.updatedData?.faithFeedback).toBe(6); // 2 + 4
      });

      it("should include harmony bonus in result", () => {
        const recentCastings: ResonanceType[] = ['restorative', 'restorative'];
        const result = TemplarUtils.castMiracle(
          mockTemplarData, mockMiracle, 1, false, recentCastings
        );
        
        expect(result.success).toBe(true);
        expect(result.harmonyBonus).toBeGreaterThan(0);
      });

      it("should fail when insufficient RC", () => {
        mockTemplarData.resonanceCharges.current = 0;
        const result = TemplarUtils.castMiracle(mockTemplarData, mockMiracle, 1, false);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("Insufficient RC: need 1, have 0");
      });

      it("should fail when no Overchannel uses remaining", () => {
        mockTemplarData.overchannelUses = 0;
        const result = TemplarUtils.castMiracle(mockTemplarData, mockMiracle, 1, true);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("No Overchannel uses remaining");
      });

      it("should fail when miracle cannot be Overchanneled", () => {
        mockMiracle.canOverchannel = false;
        const result = TemplarUtils.castMiracle(mockTemplarData, mockMiracle, 1, true);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("This miracle cannot be Overchanneled");
      });

      it("should fail when would exceed maximum faith feedback", () => {
        mockTemplarData.faithFeedback = 14; // Close to max of 15
        const result = TemplarUtils.castMiracle(mockTemplarData, mockMiracle, 2, false);
        
        expect(result.success).toBe(false);
        expect(result.errors).toContain("Would exceed maximum faith feedback (16/15)");
      });
    });

    describe("Templar resource management", () => {
      it("should restore Overchannel uses on rest", () => {
        mockTemplarData.overchannelUses = 0;
        const restored = TemplarUtils.restoreOverchannelUses(mockTemplarData);
        
        expect(restored.overchannelUses).toBe(mockTemplarData.maxOverchannelUses);
      });

      it("should reduce faith feedback", () => {
        mockTemplarData.faithFeedback = 10;
        const reduced = TemplarUtils.reduceFaithFeedback(mockTemplarData, 3);
        
        expect(reduced.faithFeedback).toBe(7); // 10 - 3
        
        // Should not go below 0
        const overReduced = TemplarUtils.reduceFaithFeedback(mockTemplarData, 15);
        expect(overReduced.faithFeedback).toBe(0);
      });

      it("should calculate faith feedback penalties", () => {
        // No penalties at low feedback
        const lowPenalties = TemplarUtils.getFaithFeedbackPenalties(5, 15);
        expect(lowPenalties.spellAttackPenalty).toBe(0);
        expect(lowPenalties.spellDcPenalty).toBe(0);

        // Minor penalties at 50%
        const moderatePenalties = TemplarUtils.getFaithFeedbackPenalties(8, 15);
        expect(moderatePenalties.spellAttackPenalty).toBe(-1);
        expect(moderatePenalties.spellDcPenalty).toBe(-1);

        // Major penalties at 75%
        const highPenalties = TemplarUtils.getFaithFeedbackPenalties(12, 15);
        expect(highPenalties.spellAttackPenalty).toBe(-2);
        expect(highPenalties.spellDcPenalty).toBe(-2);

        // Severe penalties at 100%
        const severePenalties = TemplarUtils.getFaithFeedbackPenalties(15, 15);
        expect(severePenalties.spellAttackPenalty).toBe(-4);
        expect(severePenalties.spellDcPenalty).toBe(-4);
      });

      it("should validate Templar data correctly", () => {
        const validResult = TemplarUtils.validateTemplarData(mockTemplarData);
        expect(validResult.success).toBe(true);

        // Test invalid resonance harmony
        const invalidData = { ...mockTemplarData, resonanceHarmony: -1 };
        const invalidResult = TemplarUtils.validateTemplarData(invalidData);
        expect(invalidResult.success).toBe(false);
        if (!invalidResult.success) {
          expect(invalidResult.error).toContainEqual(
            expect.objectContaining({ code: 'INVALID_RESONANCE_HARMONY' })
          );
        }
      });
    });
  });

  describe("Heat Generation and Feedback Systems", () => {
    let mockHeatFeedbackState: HeatFeedbackState;

    beforeEach(() => {
      mockHeatFeedbackState = HeatFeedbackUtils.createHeatFeedbackState(
        10, // Max heat points
        2,  // Dissipation rate
        'arcanist' // Spellcasting type
      );
    });

    describe("Heat point management", () => {
      it("should calculate feedback threshold correctly", () => {
        expect(HeatFeedbackUtils.calculateFeedbackThreshold(10)).toBe(6); // 60% of 10
        expect(HeatFeedbackUtils.calculateFeedbackThreshold(15)).toBe(9); // 60% of 15
      });

      it("should calculate heat dissipation", () => {
        expect(HeatFeedbackUtils.calculateHeatDissipation('short', 5, 2)).toBe(2);
        expect(HeatFeedbackUtils.calculateHeatDissipation('long', 5, 2)).toBe(5); // All heat
        expect(HeatFeedbackUtils.calculateHeatDissipation('short', 1, 2)).toBe(1); // Can't exceed current
      });

      it("should add heat points and calculate feedback", () => {
        const updated = HeatFeedbackUtils.addHeatPoints(mockHeatFeedbackState, 3, 'arcanist');
        
        expect(updated.heatPoints.current).toBe(3);
        expect(updated.feedback.level).toBe(0); // Below threshold
        expect(updated.feedback.sourceType).toBe('arcanist');
      });

      it("should trigger feedback effects when exceeding threshold", () => {
        // Add enough heat to exceed threshold (6)
        const updated = HeatFeedbackUtils.addHeatPoints(mockHeatFeedbackState, 8, 'arcanist');
        
        expect(updated.heatPoints.current).toBe(8);
        expect(updated.feedback.level).toBe(50); // (8-6)/(10-6) * 100 = 50%
        expect(updated.feedback.effects.length).toBeGreaterThan(0);
      });

      it("should not exceed maximum heat points", () => {
        const updated = HeatFeedbackUtils.addHeatPoints(mockHeatFeedbackState, 15, 'arcanist');
        
        expect(updated.heatPoints.current).toBe(10); // Capped at maximum
      });
    });

    describe("Feedback effects", () => {
      it("should calculate feedback level correctly", () => {
        expect(HeatFeedbackUtils.calculateFeedbackLevel(5, 10, 6)).toBe(0); // Below threshold
        expect(HeatFeedbackUtils.calculateFeedbackLevel(7, 10, 6)).toBe(25); // (7-6)/(10-6) * 100 = 25%
        expect(HeatFeedbackUtils.calculateFeedbackLevel(10, 10, 6)).toBe(100); // At maximum
      });

      it("should generate appropriate feedback effects at different levels", () => {
        // 25% feedback - minor penalties
        const effects25 = HeatFeedbackUtils.calculateFeedbackEffects(25, 'arcanist', []);
        expect(effects25.some(e => e.type === 'spell_attack_penalty')).toBe(true);
        expect(effects25.some(e => e.type === 'concentration_penalty')).toBe(true);

        // 50% feedback - additional penalties
        const effects50 = HeatFeedbackUtils.calculateFeedbackEffects(50, 'arcanist', []);
        expect(effects50.some(e => e.type === 'spell_dc_penalty')).toBe(true);
        expect(effects50.some(e => e.type === 'heat_generation_increase')).toBe(true);

        // 75% feedback - increased penalties
        const effects75 = HeatFeedbackUtils.calculateFeedbackEffects(75, 'arcanist', []);
        const attackPenalty = effects75.find(e => e.type === 'spell_attack_penalty');
        expect(attackPenalty?.severity).toBe(-2);

        // 90% feedback - spell failure chance
        const effects90 = HeatFeedbackUtils.calculateFeedbackEffects(90, 'arcanist', []);
        expect(effects90.some(e => e.type === 'spell_failure_chance')).toBe(true);
        expect(effects90.some(e => e.type === 'casting_time_increase')).toBe(true);
      });

      it("should get penalty values from feedback state", () => {
        // Set up state with feedback effects
        mockHeatFeedbackState.feedback.level = 50;
        mockHeatFeedbackState.feedback.effects = HeatFeedbackUtils.calculateFeedbackEffects(
          50, 'arcanist', []
        );

        expect(HeatFeedbackUtils.getSpellAttackPenalty(mockHeatFeedbackState)).toBe(-1);
        expect(HeatFeedbackUtils.getSpellDcPenalty(mockHeatFeedbackState)).toBe(-1);
        expect(HeatFeedbackUtils.getResourceCostIncrease(mockHeatFeedbackState)).toBe(0); // Not at 75% yet
        expect(HeatFeedbackUtils.getSpellFailureChance(mockHeatFeedbackState)).toBe(0); // Not at 90% yet
      });
    });

    describe("Rest and recovery", () => {
      beforeEach(() => {
        // Set up state with heat and feedback
        mockHeatFeedbackState.heatPoints.current = 8;
        mockHeatFeedbackState.feedback.level = 50;
        mockHeatFeedbackState.feedback.effects = HeatFeedbackUtils.calculateFeedbackEffects(
          50, 'arcanist', []
        );
      });

      it("should apply short rest recovery", () => {
        const rested = HeatFeedbackUtils.applyRest(mockHeatFeedbackState, 'short');
        
        expect(rested.heatPoints.current).toBe(6); // 8 - 2 (dissipation rate)
        expect(rested.feedback.level).toBe(0); // (6-6)/(10-6) * 100 = 0%
        expect(rested.feedback.effects.length).toBe(0); // No effects at 0% feedback
      });

      it("should apply long rest recovery", () => {
        const rested = HeatFeedbackUtils.applyRest(mockHeatFeedbackState, 'long');
        
        expect(rested.heatPoints.current).toBe(0); // All heat removed
        expect(rested.feedback.level).toBe(0);
        expect(rested.feedback.effects.length).toBe(0);
        expect(rested.feedback.recoveryTime).toBe(0);
      });
    });

    describe("Concentration mechanics", () => {
      let concentrationSpell: { id: string; name: string; level: number; duration: string };

      beforeEach(() => {
        concentrationSpell = {
          id: "test-concentration",
          name: "Test Concentration Spell",
          level: 2,
          duration: "Concentration, up to 10 minutes"
        };
      });

      it("should start concentration", () => {
        const updated = HeatFeedbackUtils.startConcentration(mockHeatFeedbackState, concentrationSpell);
        
        expect(updated.concentration.isConcentrating).toBe(true);
        expect(updated.concentration.concentratedSpell).toEqual(concentrationSpell);
        expect(updated.concentration.concentrationSavesThisTurn).toBe(0);
      });

      it("should end concentration", () => {
        mockHeatFeedbackState.concentration.isConcentrating = true;
        mockHeatFeedbackState.concentration.concentratedSpell = concentrationSpell;
        
        const updated = HeatFeedbackUtils.endConcentration(mockHeatFeedbackState);
        
        expect(updated.concentration.isConcentrating).toBe(false);
        expect(updated.concentration.concentratedSpell).toBeUndefined();
      });

      it("should handle concentration saves", () => {
        mockHeatFeedbackState.concentration.isConcentrating = true;
        mockHeatFeedbackState.concentration.concentratedSpell = concentrationSpell;
        
        // Add feedback penalty
        mockHeatFeedbackState.feedback.effects = [{
          type: 'concentration_penalty',
          severity: -2,
          description: 'Test penalty',
          active: true
        }];

        const saveResult = HeatFeedbackUtils.makeConcentrationSave(
          mockHeatFeedbackState,
          20, // 20 damage = DC 10
          3,  // Spellcasting ability modifier
          2   // Proficiency bonus
        );

        expect(saveResult.dc).toBe(10);
        expect(saveResult.updatedState.concentration.concentrationSavesThisTurn).toBe(1);
        // Success/failure depends on random roll, but structure should be correct
        expect(typeof saveResult.success).toBe('boolean');
        expect(typeof saveResult.rollResult).toBe('number');
      });

      it("should not require saves when not concentrating", () => {
        const saveResult = HeatFeedbackUtils.makeConcentrationSave(
          mockHeatFeedbackState, 20, 3, 2
        );

        expect(saveResult.success).toBe(true);
        expect(saveResult.dc).toBe(0);
        expect(saveResult.rollResult).toBe(0);
      });
    });

    describe("Validation", () => {
      it("should validate valid heat feedback state", () => {
        const result = HeatFeedbackUtils.validateHeatFeedbackState(mockHeatFeedbackState);
        expect(result.success).toBe(true);
      });

      it("should detect invalid heat points", () => {
        mockHeatFeedbackState.heatPoints.current = -1;
        const result = HeatFeedbackUtils.validateHeatFeedbackState(mockHeatFeedbackState);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContainEqual(
            expect.objectContaining({ code: 'INVALID_CURRENT_HEAT' })
          );
        }
      });

      it("should detect heat exceeding maximum", () => {
        mockHeatFeedbackState.heatPoints.current = 15;
        const result = HeatFeedbackUtils.validateHeatFeedbackState(mockHeatFeedbackState);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContainEqual(
            expect.objectContaining({ code: 'HEAT_EXCEEDS_MAX' })
          );
        }
      });

      it("should detect invalid feedback level", () => {
        mockHeatFeedbackState.feedback.level = 150;
        const result = HeatFeedbackUtils.validateHeatFeedbackState(mockHeatFeedbackState);
        
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toContainEqual(
            expect.objectContaining({ code: 'INVALID_FEEDBACK_LEVEL' })
          );
        }
      });
    });
  });

  describe("Shared Spellcasting Utilities", () => {
    describe("Heat point utilities", () => {
      it("should calculate feedback threshold", () => {
        expect(HeatPointUtils.getFeedbackThreshold(10)).toBe(7); // 75% of 10, floored
        expect(HeatPointUtils.getFeedbackThreshold(8)).toBe(6);  // 75% of 8, floored
      });

      it("should detect feedback range", () => {
        expect(HeatPointUtils.isInFeedbackRange(8, 10)).toBe(true);  // 8 >= 7 (75% of 10)
        expect(HeatPointUtils.isInFeedbackRange(6, 10)).toBe(false); // 6 < 7
      });

      it("should calculate heat dissipation", () => {
        expect(HeatPointUtils.calculateHeatDissipation('short')).toBe(2);
        expect(HeatPointUtils.calculateHeatDissipation('long')).toBe(Infinity);
      });

      it("should add heat points with cap", () => {
        expect(HeatPointUtils.addHeatPoints(5, 3, 10)).toBe(8);  // 5 + 3 = 8
        expect(HeatPointUtils.addHeatPoints(8, 5, 10)).toBe(10); // Capped at 10
      });

      it("should reduce heat points with floor", () => {
        expect(HeatPointUtils.reduceHeatPoints(5, 2)).toBe(3); // 5 - 2 = 3
        expect(HeatPointUtils.reduceHeatPoints(2, 5)).toBe(0); // Floored at 0
      });
    });

    describe("Spell component utilities", () => {
      let mockComponents: SpellComponents;

      beforeEach(() => {
        mockComponents = {
          verbal: true,
          somatic: true,
          material: true,
          materialComponent: "A pinch of sulfur"
        };
      });

      it("should check component availability", () => {
        const testSpell: KnownSpell = {
          id: "test-spell",
          name: "Test Spell",
          level: 1,
          school: "evocation",
          hollowGearName: "Test Spell",
          components: mockComponents,
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          concentration: false,
          description: "A test spell"
        };

        const result = SpellComponentUtils.canProvideComponents(
          testSpell,
          true,  // Has spellcasting focus
          false, // No material components
          0      // No funds
        );

        expect(result.canCast).toBe(true); // Focus can replace non-costly materials
        expect(result.missingComponents).toEqual([]);
      });

      it("should detect missing costly components", () => {
        const costlyComponents = {
          ...mockComponents,
          materialCost: 100,
          materialComponent: "Diamond worth 100 gp"
        };

        const testSpell: KnownSpell = {
          id: "test-spell",
          name: "Test Spell",
          level: 1,
          school: "evocation",
          hollowGearName: "Test Spell",
          components: costlyComponents,
          castingTime: "1 action",
          range: "30 feet",
          duration: "Instantaneous",
          concentration: false,
          description: "A test spell"
        };

        const result = SpellComponentUtils.canProvideComponents(
          testSpell,
          true,  // Has spellcasting focus
          false, // No material components
          50     // Insufficient funds
        );

        expect(result.canCast).toBe(false);
        expect(result.missingComponents).toContain("Material component: Diamond worth 100 gp");
      });

      it("should generate component descriptions", () => {
        expect(SpellComponentUtils.getComponentDescription(mockComponents))
          .toBe("V, S, M (A pinch of sulfur)");

        const simpleComponents = { verbal: true, somatic: false, material: false };
        expect(SpellComponentUtils.getComponentDescription(simpleComponents)).toBe("V");
      });
    });

    describe("Spell level utilities", () => {
      it("should validate spell levels", () => {
        expect(SpellLevelUtils.isValidSpellLevel(0)).toBe(true);
        expect(SpellLevelUtils.isValidSpellLevel(5)).toBe(true);
        expect(SpellLevelUtils.isValidSpellLevel(9)).toBe(true);
        expect(SpellLevelUtils.isValidSpellLevel(10)).toBe(false);
        expect(SpellLevelUtils.isValidSpellLevel(-1)).toBe(false);
        expect(SpellLevelUtils.isValidSpellLevel(1.5)).toBe(false);
      });

      it("should generate spell level names", () => {
        expect(SpellLevelUtils.getSpellLevelName(0)).toBe("cantrip");
        expect(SpellLevelUtils.getSpellLevelName(1)).toBe("1st level");
        expect(SpellLevelUtils.getSpellLevelName(2)).toBe("2nd level");
        expect(SpellLevelUtils.getSpellLevelName(3)).toBe("3rd level");
        expect(SpellLevelUtils.getSpellLevelName(4)).toBe("4th level");
        expect(SpellLevelUtils.getSpellLevelName(9)).toBe("9th level");
      });

      it("should calculate multiclass spell slots", () => {
        expect(SpellLevelUtils.calculateMulticlassSpellSlots(5, 3)).toBe(8); // Both full casters
        expect(SpellLevelUtils.calculateMulticlassSpellSlots(10, 0)).toBe(10); // Single class
        expect(SpellLevelUtils.calculateMulticlassSpellSlots(0, 7)).toBe(7); // Single class
      });
    });
  });
});