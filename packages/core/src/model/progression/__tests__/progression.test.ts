/**
 * Unit tests for progression system (experience and advancement)
 */

import { describe, it, expect } from "bun:test";
import {
  // Experience system
  calculateLevelFromXP,
  getXPForLevel,
  getXPForNextLevel,
  getXPToNextLevel,
  createExperienceData,
  validateExperiencePoints,
  validateLevel,
  validateXPLevelConsistency,
  calculateLevelAdvancement,
  addExperience,
  setExperience,
  canLevelUp,
  getLevelsAvailable,
  createDefaultLevelUpChoices,
  validateLevelUpChoices,
  applyLevelUpChoices,
  getExperienceMilestones,
  getXPBetweenLevels,
  getExperienceProgressSummary,
  EXPERIENCE_THRESHOLDS,
  MAX_LEVEL,
  MIN_LEVEL,
  type ExperienceData,
  type LevelAdvancement,
  type LevelUpChoices,
  type AbilityScoreImprovement,
} from "../experience.js";
import {
  // Advancement system
  isASILevel,
  getAdvancementOptions,
  getAvailableFeats,
  createDefaultAdvancementChoices,
  validateAdvancementChoices,
  calculateHitPointsGained,
  applyAbilityScoreImprovements,
  areAdvancementChoicesComplete,
  createAdvancementChoicesFromLevelUp,
  getAdvancementChoicesSummary,
  ASI_LEVELS,
  type AdvancementChoices,
  type AdvancementOptions,
  type FeatChoice,
} from "../advancement.js";
import type { HollowGearClass } from "../../classes/index.js";

describe("Experience System", () => {
  describe("calculateLevelFromXP", () => {
    it("should return level 1 for 0 XP", () => {
      expect(calculateLevelFromXP(0)).toBe(1);
    });

    it("should return level 1 for XP below level 2 threshold", () => {
      expect(calculateLevelFromXP(299)).toBe(1);
    });

    it("should return level 2 for XP at level 2 threshold", () => {
      expect(calculateLevelFromXP(300)).toBe(2);
    });

    it("should return level 20 for maximum XP", () => {
      expect(calculateLevelFromXP(355000)).toBe(20);
    });

    it("should return level 20 for XP above maximum", () => {
      expect(calculateLevelFromXP(500000)).toBe(20);
    });

    it("should return level 1 for negative XP", () => {
      expect(calculateLevelFromXP(-100)).toBe(1);
    });

    it("should handle all level thresholds correctly", () => {
      // Test each level threshold
      expect(calculateLevelFromXP(300)).toBe(2);
      expect(calculateLevelFromXP(900)).toBe(3);
      expect(calculateLevelFromXP(2700)).toBe(4);
      expect(calculateLevelFromXP(6500)).toBe(5);
      expect(calculateLevelFromXP(14000)).toBe(6);
      expect(calculateLevelFromXP(23000)).toBe(7);
      expect(calculateLevelFromXP(34000)).toBe(8);
      expect(calculateLevelFromXP(48000)).toBe(9);
      expect(calculateLevelFromXP(64000)).toBe(10);
    });
  });

  describe("getXPForLevel", () => {
    it("should return correct XP for each level", () => {
      expect(getXPForLevel(1)).toBe(0);
      expect(getXPForLevel(2)).toBe(300);
      expect(getXPForLevel(5)).toBe(6500);
      expect(getXPForLevel(10)).toBe(64000);
      expect(getXPForLevel(20)).toBe(355000);
    });

    it("should handle levels below minimum", () => {
      expect(getXPForLevel(0)).toBe(0);
      expect(getXPForLevel(-5)).toBe(0);
    });

    it("should handle levels above maximum", () => {
      expect(getXPForLevel(25)).toBe(355000);
      expect(getXPForLevel(100)).toBe(355000);
    });
  });

  describe("getXPForNextLevel", () => {
    it("should return next level XP for levels 1-19", () => {
      expect(getXPForNextLevel(1)).toBe(300);
      expect(getXPForNextLevel(4)).toBe(6500);
      expect(getXPForNextLevel(19)).toBe(355000);
    });

    it("should return max level XP for level 20", () => {
      expect(getXPForNextLevel(20)).toBe(355000);
      expect(getXPForNextLevel(25)).toBe(355000);
    });
  });

  describe("getXPToNextLevel", () => {
    it("should calculate XP needed to next level", () => {
      expect(getXPToNextLevel(0, 1)).toBe(300); // Need 300 XP to reach level 2
      expect(getXPToNextLevel(150, 1)).toBe(150); // Need 150 more XP to reach level 2
      expect(getXPToNextLevel(300, 2)).toBe(600); // Need 600 XP to reach level 3
    });

    it("should return 0 for max level", () => {
      expect(getXPToNextLevel(355000, 20)).toBe(0);
    });

    it("should handle cases where character already has enough XP", () => {
      expect(getXPToNextLevel(400, 2)).toBe(500); // Level 2 with 400 XP, need 500 more for level 3 (900 total)
    });
  });

  describe("createExperienceData", () => {
    it("should create correct experience data for level 1", () => {
      const data = createExperienceData(0);
      expect(data.currentXP).toBe(0);
      expect(data.currentLevel).toBe(1);
      expect(data.nextLevelXP).toBe(300);
      expect(data.currentLevelXP).toBe(0);
      expect(data.maxLevelXP).toBe(355000);
    });

    it("should create correct experience data for mid-level", () => {
      const data = createExperienceData(7000);
      expect(data.currentXP).toBe(7000);
      expect(data.currentLevel).toBe(5);
      expect(data.nextLevelXP).toBe(14000);
      expect(data.currentLevelXP).toBe(6500);
      expect(data.maxLevelXP).toBe(355000);
    });

    it("should create correct experience data for max level", () => {
      const data = createExperienceData(355000);
      expect(data.currentXP).toBe(355000);
      expect(data.currentLevel).toBe(20);
      expect(data.nextLevelXP).toBe(355000);
      expect(data.currentLevelXP).toBe(355000);
      expect(data.maxLevelXP).toBe(355000);
    });
  });

  describe("validateExperiencePoints", () => {
    it("should validate positive integer XP", () => {
      const result = validateExperiencePoints(1000);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(1000);
      }
    });

    it("should reject negative XP", () => {
      const result = validateExperiencePoints(-100);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toHaveLength(1);
        expect(result.error[0].code).toBe("INVALID_XP_NEGATIVE");
      }
    });

    it("should reject non-integer XP", () => {
      const result = validateExperiencePoints(100.5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toHaveLength(1);
        expect(result.error[0].code).toBe("INVALID_XP_NOT_INTEGER");
      }
    });

    it("should warn about very high XP", () => {
      const result = validateExperiencePoints(1000000);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toHaveLength(1);
        expect(result.error[0].code).toBe("WARNING_XP_VERY_HIGH");
      }
    });

    it("should accept zero XP", () => {
      const result = validateExperiencePoints(0);
      expect(result.success).toBe(true);
    });
  });

  describe("validateLevel", () => {
    it("should validate levels 1-20", () => {
      for (let level = 1; level <= 20; level++) {
        const result = validateLevel(level);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(level);
        }
      }
    });

    it("should reject levels below 1", () => {
      const result = validateLevel(0);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_LEVEL_TOO_LOW");
      }
    });

    it("should reject levels above 20", () => {
      const result = validateLevel(25);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_LEVEL_TOO_HIGH");
      }
    });

    it("should reject non-integer levels", () => {
      const result = validateLevel(5.5);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_LEVEL_NOT_INTEGER");
      }
    });
  });

  describe("validateXPLevelConsistency", () => {
    it("should validate consistent XP and level", () => {
      const result = validateXPLevelConsistency(300, 2);
      expect(result.success).toBe(true);
    });

    it("should reject inconsistent XP and level", () => {
      const result = validateXPLevelConsistency(300, 3);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INCONSISTENT_XP_LEVEL");
      }
    });

    it("should handle edge cases correctly", () => {
      // Test boundary cases
      expect(validateXPLevelConsistency(299, 1).success).toBe(true);
      expect(validateXPLevelConsistency(300, 2).success).toBe(true);
      expect(validateXPLevelConsistency(899, 2).success).toBe(true);
      expect(validateXPLevelConsistency(900, 3).success).toBe(true);
    });
  });

  describe("calculateLevelAdvancement", () => {
    it("should calculate advancement with no level change", () => {
      const advancement = calculateLevelAdvancement(100, 1, 50);
      expect(advancement.fromLevel).toBe(1);
      expect(advancement.toLevel).toBe(1);
      expect(advancement.xpGained).toBe(50);
      expect(advancement.isValid).toBe(true);
    });

    it("should calculate advancement with level increase", () => {
      const advancement = calculateLevelAdvancement(250, 1, 100);
      expect(advancement.fromLevel).toBe(1);
      expect(advancement.toLevel).toBe(2);
      expect(advancement.xpGained).toBe(100);
      expect(advancement.isValid).toBe(true);
    });

    it("should calculate advancement with multiple level increases", () => {
      const advancement = calculateLevelAdvancement(0, 1, 1000);
      expect(advancement.fromLevel).toBe(1);
      expect(advancement.toLevel).toBe(3);
      expect(advancement.xpGained).toBe(1000);
      expect(advancement.isValid).toBe(true);
    });

    it("should reject negative XP gain", () => {
      const advancement = calculateLevelAdvancement(100, 1, -50);
      expect(advancement.isValid).toBe(false);
      expect(advancement.errors).toBeDefined();
      if (advancement.errors) {
        expect(advancement.errors[0].code).toBe("INVALID_XP_GAIN_NEGATIVE");
      }
    });

    it("should detect inconsistent current level", () => {
      const advancement = calculateLevelAdvancement(300, 1, 100); // Should be level 2, not 1
      expect(advancement.isValid).toBe(false);
      expect(advancement.errors).toBeDefined();
      if (advancement.errors) {
        expect(advancement.errors[0].code).toBe("INCONSISTENT_CURRENT_LEVEL");
      }
    });
  });

  describe("addExperience", () => {
    it("should add valid experience", () => {
      const initialData = createExperienceData(100);
      const result = addExperience(initialData, 200);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentXP).toBe(300);
        expect(result.data.currentLevel).toBe(2);
      }
    });

    it("should reject negative experience gain", () => {
      const initialData = createExperienceData(100);
      const result = addExperience(initialData, -50);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_XP_NEGATIVE");
      }
    });

    it("should handle level advancement correctly", () => {
      const initialData = createExperienceData(250);
      const result = addExperience(initialData, 700);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentXP).toBe(950);
        expect(result.data.currentLevel).toBe(3);
      }
    });
  });

  describe("canLevelUp", () => {
    it("should return true when character can level up", () => {
      const data = createExperienceData(900); // 900 XP = level 3
      // Need to manually set the current level to test the function properly
      const testData = { 
        ...data, 
        currentLevel: 2,
        nextLevelXP: 900 // Level 2 needs 900 XP to reach level 3
      }; 
      expect(canLevelUp(testData)).toBe(true);
    });

    it("should return false when character cannot level up", () => {
      const data = createExperienceData(250);
      expect(canLevelUp(data)).toBe(false);
    });

    it("should return false for max level character", () => {
      const data = createExperienceData(400000);
      expect(canLevelUp(data)).toBe(false);
    });
  });

  describe("getLevelsAvailable", () => {
    it("should return 0 when no levels available", () => {
      const data = createExperienceData(250);
      expect(getLevelsAvailable(data)).toBe(0);
    });

    it("should return 1 when one level available", () => {
      const data = createExperienceData(900); // 900 XP = level 3
      // Manually set current level to 2 to test advancement
      const testData = { ...data, currentLevel: 2 };
      expect(getLevelsAvailable(testData)).toBe(1);
    });

    it("should return multiple levels when multiple available", () => {
      const data = createExperienceData(2700); // 2700 XP = level 4
      // Manually set current level to 2 to test advancement
      const testData = { ...data, currentLevel: 2 };
      expect(getLevelsAvailable(testData)).toBe(2); // Should advance from level 2 to level 4
    });
  });

  describe("validateLevelUpChoices", () => {
    it("should validate valid level-up choices", () => {
      const choices: LevelUpChoices = {
        level: 2,
        hitPointsGained: 6,
        hitPointMethod: "rolled",
        abilityScoreImprovements: []
      };
      
      const result = validateLevelUpChoices(choices);
      expect(result.success).toBe(true);
    });

    it("should reject negative hit points", () => {
      const choices: LevelUpChoices = {
        level: 2,
        hitPointsGained: -1,
        hitPointMethod: "average"
      };
      
      const result = validateLevelUpChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_HP_GAIN_NEGATIVE");
      }
    });

    it("should reject too many ability score improvements", () => {
      const choices: LevelUpChoices = {
        level: 4,
        hitPointsGained: 5,
        hitPointMethod: "average",
        abilityScoreImprovements: [
          { ability: "strength", improvement: 2 },
          { ability: "dexterity", improvement: 1 }
        ]
      };
      
      const result = validateLevelUpChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_ASI_TOO_MANY");
      }
    });

    it("should accept valid ability score improvements", () => {
      const choices: LevelUpChoices = {
        level: 4,
        hitPointsGained: 5,
        hitPointMethod: "average",
        abilityScoreImprovements: [
          { ability: "strength", improvement: 1 },
          { ability: "dexterity", improvement: 1 }
        ]
      };
      
      const result = validateLevelUpChoices(choices);
      expect(result.success).toBe(true);
    });
  });

  describe("getExperienceProgressSummary", () => {
    it("should provide correct progress summary", () => {
      const data = createExperienceData(450); // Level 2, partway to 3
      const summary = getExperienceProgressSummary(data);
      
      expect(summary.level).toBe(2);
      expect(summary.xp).toBe(450);
      expect(summary.xpToNext).toBe(450); // 900 - 450
      expect(summary.canLevelUp).toBe(false);
      expect(summary.levelsAvailable).toBe(0);
      expect(summary.progressPercent).toBeGreaterThan(0);
      expect(summary.progressPercent).toBeLessThan(100);
    });

    it("should handle max level correctly", () => {
      const data = createExperienceData(355000);
      const summary = getExperienceProgressSummary(data);
      
      expect(summary.level).toBe(20);
      expect(summary.xpToNext).toBe(0);
      expect(summary.canLevelUp).toBe(false);
      expect(summary.progressPercent).toBe(100);
    });
  });
});

describe("Advancement System", () => {
  describe("isASILevel", () => {
    it("should return true for standard ASI levels", () => {
      for (const level of ASI_LEVELS) {
        expect(isASILevel(level, "arcanist")).toBe(true);
        expect(isASILevel(level, "templar")).toBe(true);
        expect(isASILevel(level, "tweaker")).toBe(true);
      }
    });

    it("should return false for non-ASI levels", () => {
      expect(isASILevel(1, "arcanist")).toBe(false);
      expect(isASILevel(2, "templar")).toBe(false);
      expect(isASILevel(3, "tweaker")).toBe(false);
      expect(isASILevel(5, "shadehand")).toBe(false);
    });

    it("should handle all standard ASI levels", () => {
      expect(isASILevel(4, "vanguard")).toBe(true);
      expect(isASILevel(8, "artifex")).toBe(true);
      expect(isASILevel(12, "mindweaver")).toBe(true);
      expect(isASILevel(16, "arcanist")).toBe(true);
      expect(isASILevel(19, "templar")).toBe(true);
    });
  });

  describe("getAdvancementOptions", () => {
    it("should provide correct options for ASI level", () => {
      const options = getAdvancementOptions(4, "arcanist");
      
      expect(options.level).toBe(4);
      expect(options.advancingClass).toBe("arcanist");
      expect(options.abilityScoreImprovementAvailable).toBe(true);
      expect(options.hitDie).toBe(6); // Arcanist hit die
      expect(options.availableFeats).toBeDefined();
    });

    it("should provide correct options for non-ASI level", () => {
      const options = getAdvancementOptions(3, "templar");
      
      expect(options.level).toBe(3);
      expect(options.advancingClass).toBe("templar");
      expect(options.abilityScoreImprovementAvailable).toBe(false);
      expect(options.hitDie).toBe(10); // Templar hit die
    });

    it("should provide archetype selection at appropriate levels", () => {
      const arcanistOptions = getAdvancementOptions(2, "arcanist");
      expect(arcanistOptions.archetypeSelection).toBeDefined();
      expect(arcanistOptions.archetypeSelection?.level).toBe(2);

      const templarOptions = getAdvancementOptions(3, "templar");
      expect(templarOptions.archetypeSelection).toBeDefined();
      expect(templarOptions.archetypeSelection?.level).toBe(3);
    });

    it("should provide correct hit dice for all classes", () => {
      expect(getAdvancementOptions(1, "arcanist").hitDie).toBe(6);
      expect(getAdvancementOptions(1, "templar").hitDie).toBe(10);
      expect(getAdvancementOptions(1, "tweaker").hitDie).toBe(12);
      expect(getAdvancementOptions(1, "shadehand").hitDie).toBe(8);
      expect(getAdvancementOptions(1, "vanguard").hitDie).toBe(10);
      expect(getAdvancementOptions(1, "artifex").hitDie).toBe(8);
      expect(getAdvancementOptions(1, "mindweaver").hitDie).toBe(8);
    });
  });

  describe("getAvailableFeats", () => {
    it("should return available feats", () => {
      const feats = getAvailableFeats(4, "arcanist");
      
      expect(feats).toBeDefined();
      expect(Array.isArray(feats)).toBe(true);
      expect(feats.length).toBeGreaterThan(0);
      
      // Check that feats have required properties
      for (const feat of feats) {
        expect(feat.featId).toBeDefined();
        expect(feat.name).toBeDefined();
        expect(feat.description).toBeDefined();
        expect(typeof feat.prerequisitesMet).toBe("boolean");
      }
    });

    it("should include Hollow Gear specific feats", () => {
      const feats = getAvailableFeats(4, "mindweaver");
      const featNames = feats.map(f => f.name);
      
      expect(featNames).toContain("Aether Sensitive");
      expect(featNames).toContain("Steam Engineer");
      expect(featNames).toContain("Psionic Adept");
    });
  });

  describe("validateAdvancementChoices", () => {
    it("should validate valid advancement choices", () => {
      const choices: AdvancementChoices = {
        level: 2,
        advancingClass: "arcanist",
        hitPointsGained: 4,
        hitPointMethod: "average",
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(true);
    });

    it("should reject invalid level", () => {
      const choices: AdvancementChoices = {
        level: 25,
        advancingClass: "templar",
        hitPointsGained: 6,
        hitPointMethod: "average",
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_LEVEL_RANGE");
      }
    });

    it("should reject negative hit points", () => {
      const choices: AdvancementChoices = {
        level: 3,
        advancingClass: "tweaker",
        hitPointsGained: -2,
        hitPointMethod: "rolled",
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_HP_GAIN");
      }
    });

    it("should reject both ASI and feat selection", () => {
      const choices: AdvancementChoices = {
        level: 4,
        advancingClass: "shadehand",
        hitPointsGained: 5,
        hitPointMethod: "average",
        abilityScoreImprovements: [{ ability: "dexterity", improvement: 2 }],
        featSelected: {
          featId: "aether_sensitive",
          name: "Aether Sensitive",
          description: "Test feat",
          prerequisitesMet: true
        },
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("ASI_AND_FEAT_CONFLICT");
      }
    });

    it("should reject feat without prerequisites", () => {
      const choices: AdvancementChoices = {
        level: 4,
        advancingClass: "vanguard",
        hitPointsGained: 6,
        hitPointMethod: "rolled",
        featSelected: {
          featId: "advanced_feat",
          name: "Advanced Feat",
          description: "Requires prerequisites",
          prerequisitesMet: false
        },
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("FEAT_PREREQUISITES_NOT_MET");
      }
    });

    it("should reject duplicate ability score improvements", () => {
      const choices: AdvancementChoices = {
        level: 4,
        advancingClass: "artifex",
        hitPointsGained: 5,
        hitPointMethod: "average",
        abilityScoreImprovements: [
          { ability: "strength", improvement: 1 },
          { ability: "strength", improvement: 1 }
        ],
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("DUPLICATE_ASI");
      }
    });
  });

  describe("calculateHitPointsGained", () => {
    it("should calculate average hit points correctly", () => {
      const result = calculateHitPointsGained(8, "average");
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(5); // (8 + 1) / 2 = 4.5, rounded up to 5
      }
    });

    it("should calculate average for different hit dice", () => {
      const result6 = calculateHitPointsGained(6, "average");
      expect(result6.success).toBe(true);
      if (result6.success) {
        expect(result6.data).toBe(4); // (6 + 1) / 2 = 3.5, rounded up to 4
      }
      
      const result10 = calculateHitPointsGained(10, "average");
      expect(result10.success).toBe(true);
      if (result10.success) {
        expect(result10.data).toBe(6); // (10 + 1) / 2 = 5.5, rounded up to 6
      }
      
      const result12 = calculateHitPointsGained(12, "average");
      expect(result12.success).toBe(true);
      if (result12.success) {
        expect(result12.data).toBe(7); // (12 + 1) / 2 = 6.5, rounded up to 7
      }
    });

    it("should accept valid rolled values", () => {
      const result = calculateHitPointsGained(8, "rolled", 6);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(6);
      }
    });

    it("should reject rolled values without roll", () => {
      const result = calculateHitPointsGained(8, "rolled");
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("MISSING_ROLLED_VALUE");
      }
    });

    it("should reject invalid rolled values", () => {
      const lowResult = calculateHitPointsGained(8, "rolled", 0);
      expect(lowResult.success).toBe(false);
      if (!lowResult.success) {
        expect(lowResult.error[0].code).toBe("INVALID_ROLLED_VALUE");
      }

      const highResult = calculateHitPointsGained(8, "rolled", 10);
      expect(highResult.success).toBe(false);
      if (!highResult.success) {
        expect(highResult.error[0].code).toBe("INVALID_ROLLED_VALUE");
      }
    });

    it("should reject invalid method", () => {
      const result = calculateHitPointsGained(8, "invalid" as any);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("INVALID_HP_METHOD");
      }
    });
  });

  describe("applyAbilityScoreImprovements", () => {
    it("should apply valid improvements", () => {
      const currentScores = {
        strength: 14,
        dexterity: 12,
        constitution: 13,
        intelligence: 10,
        wisdom: 15,
        charisma: 8
      };
      
      const improvements: AbilityScoreImprovement[] = [
        { ability: "strength", improvement: 1 },
        { ability: "dexterity", improvement: 1 }
      ];
      
      const result = applyAbilityScoreImprovements(currentScores, improvements);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.strength).toBe(15);
        expect(result.data.dexterity).toBe(13);
        expect(result.data.constitution).toBe(13); // Unchanged
      }
    });

    it("should reject improvements that exceed maximum", () => {
      const currentScores = {
        strength: 20,
        dexterity: 12,
        constitution: 13,
        intelligence: 10,
        wisdom: 15,
        charisma: 8
      };
      
      const improvements: AbilityScoreImprovement[] = [
        { ability: "strength", improvement: 1 }
      ];
      
      const result = applyAbilityScoreImprovements(currentScores, improvements);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("ABILITY_SCORE_MAX_EXCEEDED");
      }
    });

    it("should handle multiple improvements to different abilities", () => {
      const currentScores = {
        strength: 14,
        dexterity: 12,
        constitution: 13,
        intelligence: 10,
        wisdom: 15,
        charisma: 8
      };
      
      const improvements: AbilityScoreImprovement[] = [
        { ability: "constitution", improvement: 2 }
      ];
      
      const result = applyAbilityScoreImprovements(currentScores, improvements);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.constitution).toBe(15);
      }
    });
  });

  describe("areAdvancementChoicesComplete", () => {
    it("should return true for complete choices", () => {
      const choices: AdvancementChoices = {
        level: 2,
        advancingClass: "arcanist",
        hitPointsGained: 4,
        hitPointMethod: "average",
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const options: AdvancementOptions = {
        level: 2,
        advancingClass: "arcanist",
        abilityScoreImprovementAvailable: false,
        availableFeats: [],
        automaticClassFeatures: [],
        choiceClassFeatures: [],
        availableSpells: [],
        availableSkills: [],
        availableProficiencies: [],
        hitDie: 6
      };
      
      const result = areAdvancementChoicesComplete(choices, options);
      expect(result.success).toBe(true);
    });

    it("should return false when hit points not determined", () => {
      const choices: AdvancementChoices = {
        level: 2,
        advancingClass: "templar",
        hitPointsGained: 0,
        hitPointMethod: "average",
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const options: AdvancementOptions = {
        level: 2,
        advancingClass: "templar",
        abilityScoreImprovementAvailable: false,
        availableFeats: [],
        automaticClassFeatures: [],
        choiceClassFeatures: [],
        availableSpells: [],
        availableSkills: [],
        availableProficiencies: [],
        hitDie: 10
      };
      
      const result = areAdvancementChoicesComplete(choices, options);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("MISSING_HIT_POINTS");
      }
    });

    it("should return false when ASI/feat not selected", () => {
      const choices: AdvancementChoices = {
        level: 4,
        advancingClass: "tweaker",
        hitPointsGained: 7,
        hitPointMethod: "rolled",
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const options: AdvancementOptions = {
        level: 4,
        advancingClass: "tweaker",
        abilityScoreImprovementAvailable: true,
        availableFeats: [],
        automaticClassFeatures: [],
        choiceClassFeatures: [],
        availableSpells: [],
        availableSkills: [],
        availableProficiencies: [],
        hitDie: 12
      };
      
      const result = areAdvancementChoicesComplete(choices, options);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error[0].code).toBe("MISSING_ASI_OR_FEAT");
      }
    });
  });

  describe("getAdvancementChoicesSummary", () => {
    it("should provide correct summary", () => {
      const choices: AdvancementChoices = {
        level: 4,
        advancingClass: "shadehand",
        hitPointsGained: 5,
        hitPointMethod: "average",
        abilityScoreImprovements: [
          { ability: "dexterity", improvement: 1 },
          { ability: "wisdom", improvement: 1 }
        ],
        classFeatures: [],
        spellsLearned: [
          { spellId: "spell1", name: "Test Spell", level: 1, sourceClass: "shadehand" }
        ],
        skillsGained: [
          { skill: "Stealth", source: "class" },
          { skill: "Investigation", source: "class" }
        ],
        choicesMadeAt: new Date(),
        applied: true
      };
      
      const summary = getAdvancementChoicesSummary(choices);
      
      expect(summary.level).toBe(4);
      expect(summary.className).toBe("shadehand");
      expect(summary.hitPointsGained).toBe(5);
      expect(summary.abilityImprovements).toEqual(["dexterity +1", "wisdom +1"]);
      expect(summary.spellsLearned).toBe(1);
      expect(summary.skillsGained).toBe(2);
      expect(summary.isComplete).toBe(true);
    });

    it("should handle feat selection", () => {
      const choices: AdvancementChoices = {
        level: 4,
        advancingClass: "vanguard",
        hitPointsGained: 6,
        hitPointMethod: "rolled",
        featSelected: {
          featId: "steam_engineer",
          name: "Steam Engineer",
          description: "Steam expertise",
          prerequisitesMet: true
        },
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const summary = getAdvancementChoicesSummary(choices);
      
      expect(summary.featSelected).toBe("Steam Engineer");
      expect(summary.abilityImprovements).toEqual([]);
      expect(summary.isComplete).toBe(false);
    });
  });

  describe("Multiclassing Support (Basic)", () => {
    it("should handle advancement choices for different classes", () => {
      const arcanistChoices = createDefaultAdvancementChoices(2, "arcanist");
      const templarChoices = createDefaultAdvancementChoices(3, "templar");
      
      expect(arcanistChoices.advancingClass).toBe("arcanist");
      expect(templarChoices.advancingClass).toBe("templar");
      expect(arcanistChoices.level).toBe(2);
      expect(templarChoices.level).toBe(3);
    });

    it("should validate advancement choices for different classes", () => {
      const choices: AdvancementChoices = {
        level: 1,
        advancingClass: "mindweaver",
        hitPointsGained: 5,
        hitPointMethod: "average",
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(true);
    });

    it("should provide different hit dice for different classes", () => {
      const classes: Array<{ class: HollowGearClass; expectedHitDie: number }> = [
        { class: "arcanist", expectedHitDie: 6 },
        { class: "templar", expectedHitDie: 10 },
        { class: "tweaker", expectedHitDie: 12 },
        { class: "shadehand", expectedHitDie: 8 },
        { class: "vanguard", expectedHitDie: 10 },
        { class: "artifex", expectedHitDie: 8 },
        { class: "mindweaver", expectedHitDie: 8 }
      ];

      for (const { class: className, expectedHitDie } of classes) {
        const options = getAdvancementOptions(1, className);
        expect(options.hitDie).toBe(expectedHitDie);
      }
    });

    it("should handle archetype selection at different levels for different classes", () => {
      // Arcanist selects archetype at level 2
      const arcanistOptions = getAdvancementOptions(2, "arcanist");
      expect(arcanistOptions.archetypeSelection).toBeDefined();
      expect(arcanistOptions.archetypeSelection?.level).toBe(2);

      // Templar selects archetype at level 3
      const templarOptions = getAdvancementOptions(3, "templar");
      expect(templarOptions.archetypeSelection).toBeDefined();
      expect(templarOptions.archetypeSelection?.level).toBe(3);

      // No archetype selection at wrong levels
      expect(getAdvancementOptions(1, "arcanist").archetypeSelection).toBeUndefined();
      expect(getAdvancementOptions(2, "templar").archetypeSelection).toBeUndefined();
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("should handle very large experience values", () => {
      const data = createExperienceData(1000000);
      expect(data.currentLevel).toBe(20);
      expect(data.currentXP).toBe(1000000);
    });

    it("should handle zero hit points gained", () => {
      const result = calculateHitPointsGained(8, "rolled", 1);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(1);
      }
    });

    it("should validate complex ability score improvements", () => {
      const currentScores = {
        strength: 19,
        dexterity: 18,
        constitution: 16,
        intelligence: 14,
        wisdom: 12,
        charisma: 10
      };
      
      // Try to improve strength from 19 to 20 (valid)
      const validImprovements: AbilityScoreImprovement[] = [
        { ability: "strength", improvement: 1 },
        { ability: "charisma", improvement: 1 }
      ];
      
      const result = applyAbilityScoreImprovements(currentScores, validImprovements);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.strength).toBe(20);
        expect(result.data.charisma).toBe(11);
      }
    });

    it("should handle advancement choices with all optional fields", () => {
      const choices: AdvancementChoices = {
        level: 4,
        advancingClass: "artifex",
        hitPointsGained: 5,
        hitPointMethod: "average",
        abilityScoreImprovements: [
          { ability: "intelligence", improvement: 2 }
        ],
        classFeatures: [],
        spellsLearned: [],
        skillsGained: [],
        proficienciesGained: [],
        classSpecificChoices: {
          "infusion_choice": "enhanced_weapon"
        },
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(true);
    });

    it("should provide meaningful error messages for validation failures", () => {
      const choices: AdvancementChoices = {
        level: 0, // Invalid level
        advancingClass: "vanguard",
        hitPointsGained: -5, // Invalid HP
        hitPointMethod: "average",
        abilityScoreImprovements: [
          { ability: "strength", improvement: 3 } // Too many points
        ],
        featSelected: { // Conflict with ASI
          featId: "test",
          name: "Test Feat",
          description: "Test",
          prerequisitesMet: true
        },
        classFeatures: [],
        choicesMadeAt: new Date(),
        applied: false
      };
      
      const result = validateAdvancementChoices(choices);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.length).toBeGreaterThan(1); // Multiple errors
        const errorCodes = result.error.map(e => e.code);
        expect(errorCodes).toContain("INVALID_LEVEL_RANGE");
        expect(errorCodes).toContain("INVALID_HP_GAIN");
        expect(errorCodes).toContain("ASI_AND_FEAT_CONFLICT");
      }
    });

    it("should handle experience milestones correctly", () => {
      const milestones = getExperienceMilestones();
      expect(milestones).toHaveLength(20);
      expect(milestones[0]).toEqual({ level: 1, xp: 0 });
      expect(milestones[19]).toEqual({ level: 20, xp: 355000 });
      
      // Check that milestones are in ascending order
      for (let i = 1; i < milestones.length; i++) {
        expect(milestones[i].xp).toBeGreaterThan(milestones[i - 1].xp);
        expect(milestones[i].level).toBe(milestones[i - 1].level + 1);
      }
    });

    it("should calculate XP between levels correctly", () => {
      expect(getXPBetweenLevels(1, 2)).toBe(300); // 300 - 0
      expect(getXPBetweenLevels(2, 5)).toBe(6200); // 6500 - 300
      expect(getXPBetweenLevels(5, 5)).toBe(0); // Same level
      expect(getXPBetweenLevels(10, 5)).toBe(0); // Backwards
    });
  });
});