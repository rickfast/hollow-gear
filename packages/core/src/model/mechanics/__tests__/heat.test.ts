/**
 * Unit tests for Heat Stress and Steam systems
 */

import { describe, it, expect } from "bun:test";
import {
  calculateHeatStressLevel,
  getHeatStressEffects,
  getNextLevelThreshold,
  addHeatPoints,
  useSteamVent,
  useCoolantFlask,
  createSteamVentHarness,
  createDefaultHeatStressData,
  HEAT_STRESS_THRESHOLDS,
  DEFAULT_HEAT_EFFECTS,
  STEAM_VENT_HARNESS_SPECS,
  type HeatStressLevel,
  type HeatSource,
  type SteamVentHarnessType,
} from "../heat.js";

describe("Heat Stress System", () => {
  describe("calculateHeatStressLevel", () => {
    it("should return correct heat stress levels", () => {
      expect(calculateHeatStressLevel(0)).toBe(0);
      expect(calculateHeatStressLevel(4)).toBe(0);
      expect(calculateHeatStressLevel(5)).toBe(1);
      expect(calculateHeatStressLevel(9)).toBe(1);
      expect(calculateHeatStressLevel(10)).toBe(2);
      expect(calculateHeatStressLevel(14)).toBe(2);
      expect(calculateHeatStressLevel(15)).toBe(3);
      expect(calculateHeatStressLevel(100)).toBe(3);
    });

    it("should handle negative heat points", () => {
      expect(calculateHeatStressLevel(-5)).toBe(0);
    });
  });

  describe("getHeatStressEffects", () => {
    it("should return no effects for level 0", () => {
      const effects = getHeatStressEffects(0);
      expect(effects).toEqual([]);
    });

    it("should return dexterity penalty for level 1", () => {
      const effects = getHeatStressEffects(1);
      expect(effects).toHaveLength(1);
      expect(effects[0].type).toBe("dexterity_penalty");
      expect(effects[0].severity).toBe(1);
    });

    it("should return multiple effects for level 2", () => {
      const effects = getHeatStressEffects(2);
      expect(effects).toHaveLength(2);
      expect(effects.some(e => e.type === "dexterity_penalty")).toBe(true);
      expect(effects.some(e => e.type === "speed_reduction")).toBe(true);
    });

    it("should return all effects for level 3", () => {
      const effects = getHeatStressEffects(3);
      expect(effects).toHaveLength(4);
      expect(effects.some(e => e.type === "dexterity_penalty")).toBe(true);
      expect(effects.some(e => e.type === "speed_reduction")).toBe(true);
      expect(effects.some(e => e.type === "disadvantage")).toBe(true);
      expect(effects.some(e => e.type === "equipment_malfunction")).toBe(true);
    });
  });

  describe("getNextLevelThreshold", () => {
    it("should return correct thresholds", () => {
      expect(getNextLevelThreshold(0)).toBe(5);
      expect(getNextLevelThreshold(1)).toBe(10);
      expect(getNextLevelThreshold(2)).toBe(15);
      expect(getNextLevelThreshold(3)).toBe(Infinity);
    });
  });

  describe("addHeatPoints", () => {
    it("should add heat points and update level", () => {
      const initialData = createDefaultHeatStressData();
      const result = addHeatPoints(initialData, "spellcasting", 6, "Cast fireball");

      expect(result.currentHeatPoints).toBe(6);
      expect(result.currentLevel).toBe(1);
      expect(result.nextLevelThreshold).toBe(10);
      expect(result.effects).toHaveLength(1);
      expect(result.recentAccumulation).toHaveLength(1);
      expect(result.recentAccumulation[0].source).toBe("spellcasting");
      expect(result.recentAccumulation[0].amount).toBe(6);
    });

    it("should handle negative heat points (cooling)", () => {
      const initialData = {
        ...createDefaultHeatStressData(),
        currentHeatPoints: 8,
        currentLevel: 1 as HeatStressLevel,
      };
      
      const result = addHeatPoints(initialData, "environmental", -3, "Cool breeze");

      expect(result.currentHeatPoints).toBe(5);
      expect(result.currentLevel).toBe(1);
    });

    it("should not go below 0 heat points", () => {
      const initialData = {
        ...createDefaultHeatStressData(),
        currentHeatPoints: 2,
      };
      
      const result = addHeatPoints(initialData, "environmental", -5, "Ice bath");

      expect(result.currentHeatPoints).toBe(0);
      expect(result.currentLevel).toBe(0);
    });

    it("should maintain recent accumulation history", () => {
      let data = createDefaultHeatStressData();
      
      // Add multiple heat events
      for (let i = 0; i < 12; i++) {
        data = addHeatPoints(data, "spellcasting", 1, `Event ${i}`);
      }

      // Should keep only last 10 events
      expect(data.recentAccumulation).toHaveLength(10);
      expect(data.recentAccumulation[0].description).toBe("Event 11");
      expect(data.recentAccumulation[9].description).toBe("Event 2");
    });
  });
});

describe("Steam System", () => {
  describe("createSteamVentHarness", () => {
    it("should create basic harness with correct specs", () => {
      const harness = createSteamVentHarness("basic");
      
      expect(harness.type).toBe("basic");
      expect(harness.charges).toBe(3);
      expect(harness.maxCharges).toBe(3);
      expect(harness.heatReductionPerUse).toBe(3);
      expect(harness.condition).toBe("pristine");
      expect(harness.malfunctionRisk).toBe(15);
    });

    it("should create masterwork harness with superior specs", () => {
      const harness = createSteamVentHarness("masterwork");
      
      expect(harness.type).toBe("masterwork");
      expect(harness.charges).toBe(6);
      expect(harness.maxCharges).toBe(6);
      expect(harness.heatReductionPerUse).toBe(6);
      expect(harness.malfunctionRisk).toBe(2);
    });
  });

  describe("useSteamVent", () => {
    it("should fail if no harness equipped", () => {
      const data = createDefaultHeatStressData();
      const result = useSteamVent(data);

      expect(result.success).toBe(false);
      expect(result.heatReduced).toBe(0);
      expect(result.effects[0]).toBe("No Steam Vent Harness equipped");
    });

    it("should fail if insufficient charges", () => {
      const harness = createSteamVentHarness("basic");
      harness.charges = 1;
      
      const data = {
        ...createDefaultHeatStressData(),
        steamSystem: {
          ...createDefaultHeatStressData().steamSystem,
          ventHarness: harness,
        },
      };

      const result = useSteamVent(data, 2);

      expect(result.success).toBe(false);
      expect(result.heatReduced).toBe(0);
      expect(result.effects[0]).toBe("Insufficient charges in Steam Vent Harness");
    });

    it("should reduce heat on successful use", () => {
      const harness = createSteamVentHarness("basic");
      
      const data = {
        ...createDefaultHeatStressData(),
        currentHeatPoints: 8,
        currentLevel: 1 as HeatStressLevel,
        steamSystem: {
          ...createDefaultHeatStressData().steamSystem,
          ventHarness: harness,
        },
      };

      // Mock Math.random to avoid malfunction
      const originalRandom = Math.random;
      Math.random = () => 0.5; // 50% - above malfunction risk of 15%

      const result = useSteamVent(data, 1);

      expect(result.success).toBe(true);
      expect(result.heatReduced).toBe(3);
      expect(result.chargesUsed).toBe(1);
      expect(result.malfunctionOccurred).toBe(false);
      expect(result.newHeatLevel).toBe(1); // 8 - 3 = 5, still level 1

      Math.random = originalRandom;
    });

    it("should handle malfunction", () => {
      const harness = createSteamVentHarness("basic");
      
      const data = {
        ...createDefaultHeatStressData(),
        currentHeatPoints: 8,
        steamSystem: {
          ...createDefaultHeatStressData().steamSystem,
          ventHarness: harness,
        },
      };

      // Mock Math.random to force malfunction
      const originalRandom = Math.random;
      Math.random = () => 0.1; // 10% - below malfunction risk of 15%

      const result = useSteamVent(data, 1);

      expect(result.success).toBe(false);
      expect(result.heatReduced).toBe(0);
      expect(result.chargesUsed).toBe(1);
      expect(result.malfunctionOccurred).toBe(true);
      expect(result.effects[0]).toBe("Steam Vent Harness malfunctioned!");

      Math.random = originalRandom;
    });
  });

  describe("useCoolantFlask", () => {
    it("should not reduce heat if no flasks available", () => {
      const data = createDefaultHeatStressData();
      data.currentHeatPoints = 8;
      
      const result = useCoolantFlask(data);

      expect(result.currentHeatPoints).toBe(8);
      expect(result.steamSystem.coolantFlasks).toBe(0);
    });

    it("should reduce heat and consume flask", () => {
      const data = {
        ...createDefaultHeatStressData(),
        currentHeatPoints: 8,
        currentLevel: 1 as HeatStressLevel,
        steamSystem: {
          ...createDefaultHeatStressData().steamSystem,
          coolantFlasks: 2,
        },
      };

      const result = useCoolantFlask(data);

      expect(result.currentHeatPoints).toBe(6); // 8 - 2
      expect(result.currentLevel).toBe(1);
      expect(result.steamSystem.coolantFlasks).toBe(1);
    });

    it("should not go below 0 heat points", () => {
      const data = {
        ...createDefaultHeatStressData(),
        currentHeatPoints: 1,
        steamSystem: {
          ...createDefaultHeatStressData().steamSystem,
          coolantFlasks: 1,
        },
      };

      const result = useCoolantFlask(data);

      expect(result.currentHeatPoints).toBe(0);
      expect(result.currentLevel).toBe(0);
    });
  });
});

describe("Heat Stress Constants", () => {
  it("should have correct threshold values", () => {
    expect(HEAT_STRESS_THRESHOLDS[0]).toEqual({ min: 0, max: 4, name: "Normal" });
    expect(HEAT_STRESS_THRESHOLDS[1]).toEqual({ min: 5, max: 9, name: "Warm" });
    expect(HEAT_STRESS_THRESHOLDS[2]).toEqual({ min: 10, max: 14, name: "Hot" });
    expect(HEAT_STRESS_THRESHOLDS[3]).toEqual({ min: 15, max: Infinity, name: "Overheated" });
  });

  it("should have steam vent harness specs for all types", () => {
    const types: SteamVentHarnessType[] = ["basic", "improved", "superior", "masterwork"];
    
    types.forEach(type => {
      expect(STEAM_VENT_HARNESS_SPECS[type]).toBeDefined();
      expect(STEAM_VENT_HARNESS_SPECS[type].maxCharges).toBeGreaterThan(0);
      expect(STEAM_VENT_HARNESS_SPECS[type].heatReduction).toBeGreaterThan(0);
      expect(STEAM_VENT_HARNESS_SPECS[type].malfunctionRisk).toBeGreaterThanOrEqual(0);
    });
  });
});