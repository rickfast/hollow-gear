/**
 * Unit tests for equipment maintenance and malfunction system
 */

import { describe, it, expect } from 'bun:test';
import {
  calculateMalfunctionRisk,
  checkForMalfunction,
  createMalfunction,
  performMaintenance,
  createDefaultMaintenanceData,
  addUsageHours,
  MALFUNCTION_SEVERITY_EFFECTS,
  MAINTENANCE_DIFFICULTY_DC,
  STANDARD_MAINTENANCE_COSTS,
  type MalfunctionSeverity,
  type MalfunctionType,
  type MaintenanceDifficulty,
  type MaintenanceData,
} from '../maintenance.js';

describe('Malfunction Risk System', () => {
  describe('calculateMalfunctionRisk', () => {
    it('should calculate base risk correctly', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const risk = calculateMalfunctionRisk(maintenanceData);

      expect(risk.baseRisk).toBe(1);
      expect(risk.totalRisk).toBe(1); // Only base risk with perfect maintenance
    });

    it('should increase risk with poor maintenance', () => {
      const maintenanceData = {
        ...createDefaultMaintenanceData(),
        maintenanceLevel: 50, // Poor maintenance
      };

      const risk = calculateMalfunctionRisk(maintenanceData);

      expect(risk.maintenanceLevelModifier).toBe(5); // (100 - 50) * 0.1
      expect(risk.totalRisk).toBe(6); // 1 + 5
    });

    it('should increase risk with overdue maintenance', () => {
      const maintenanceData = {
        ...createDefaultMaintenanceData(100), // 100 hour interval
        usageHours: 120, // 20 hours overdue
      };

      const risk = calculateMalfunctionRisk(maintenanceData);

      expect(risk.usageHoursModifier).toBe(1); // 20 * 0.05
      expect(risk.totalRisk).toBe(2); // 1 + 1
    });

    it('should increase risk with heat stress', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const risk = calculateMalfunctionRisk(maintenanceData, 2); // Heat stress level 2

      expect(risk.heatStressModifier).toBe(6); // 2 * 3
      expect(risk.totalRisk).toBe(7); // 1 + 6
    });

    it('should increase risk with modifications', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const risk = calculateMalfunctionRisk(maintenanceData, 0, 0, 3); // 3 modifications

      expect(risk.modificationModifier).toBe(3); // 3 * 1
      expect(risk.totalRisk).toBe(4); // 1 + 3
    });

    it('should cap total risk at 95%', () => {
      const maintenanceData = {
        ...createDefaultMaintenanceData(10),
        maintenanceLevel: 0, // Terrible maintenance
        usageHours: 1000, // Way overdue
      };

      const risk = calculateMalfunctionRisk(maintenanceData, 3, 10, 10);

      expect(risk.totalRisk).toBe(95); // Capped at 95%
    });
  });

  describe('checkForMalfunction', () => {
    it('should return null when no malfunction occurs', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const riskFactors = calculateMalfunctionRisk(maintenanceData);

      // Mock Math.random to return high value (no malfunction)
      const originalRandom = Math.random;
      Math.random = () => 0.99; // 99% - above 1% risk

      const result = checkForMalfunction(maintenanceData, riskFactors);
      expect(result).toBeNull();

      Math.random = originalRandom;
    });

    it('should return malfunction when risk threshold is met', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const riskFactors = calculateMalfunctionRisk(maintenanceData);

      // Mock Math.random to return low value (malfunction occurs)
      const originalRandom = Math.random;
      Math.random = () => 0.005; // 0.5% - below 1% risk

      const result = checkForMalfunction(maintenanceData, riskFactors);
      expect(result).not.toBeNull();
      expect(result?.type).toBeDefined();
      expect(result?.severity).toBeDefined();
      expect(result?.active).toBe(true);

      Math.random = originalRandom;
    });
  });

  describe('createMalfunction', () => {
    it('should create malfunction with correct properties', () => {
      const malfunction = createMalfunction('power_failure', 'major');

      expect(malfunction.type).toBe('power_failure');
      expect(malfunction.severity).toBe('major');
      expect(malfunction.active).toBe(true);
      expect(malfunction.id).toBeDefined();
      expect(malfunction.occurredAt).toBeInstanceOf(Date);
      expect(malfunction.effects).toBeDefined();
      expect(malfunction.repairRequirements).toBeDefined();
    });

    it('should generate appropriate effects for power failure', () => {
      const malfunction = createMalfunction('power_failure', 'minor');

      expect(malfunction.effects).toHaveLength(1);
      expect(malfunction.effects[0].type).toBe('disabled');
      expect(malfunction.effects[0].value).toBe(1);
    });

    it('should generate appropriate effects for mechanical jam', () => {
      const malfunction = createMalfunction('mechanical_jam', 'moderate');

      expect(malfunction.effects).toHaveLength(1);
      expect(malfunction.effects[0].type).toBe('unreliable');
      expect(malfunction.effects[0].value).toBeGreaterThan(0);
    });

    it('should generate repair requirements', () => {
      const malfunction = createMalfunction('component_failure', 'major');

      expect(malfunction.repairRequirements.length).toBeGreaterThan(0);

      const skillCheck = malfunction.repairRequirements.find(
        r => r.type === 'skill_check'
      );
      expect(skillCheck).toBeDefined();
      expect(skillCheck?.requirement).toBe('Tinker Tools');

      const timeReq = malfunction.repairRequirements.find(
        r => r.type === 'time'
      );
      expect(timeReq).toBeDefined();
    });
  });
});

describe('Maintenance System', () => {
  describe('performMaintenance', () => {
    it('should improve maintenance level on success', () => {
      const maintenanceData = {
        ...createDefaultMaintenanceData(),
        maintenanceLevel: 80,
      };

      const resources = [
        { type: 'lubricant' as const, quantity: 1 },
        { type: 'spare_parts' as const, quantity: 1 },
      ];

      // Mock Math.random for successful skill check
      const originalRandom = Math.random;
      Math.random = () => 0.5; // Roll of 10 + skill bonus

      const result = performMaintenance(maintenanceData, resources, 5, 2);

      expect(result.success).toBe(true);
      expect(result.newMaintenanceLevel).toBeGreaterThan(80);
      expect(result.resourcesConsumed).toEqual(resources);
      expect(result.timeSpent).toBe(2);

      Math.random = originalRandom;
    });

    it('should fail maintenance on poor skill check', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const resources = [{ type: 'lubricant' as const, quantity: 1 }];

      // Mock Math.random for failed skill check
      const originalRandom = Math.random;
      Math.random = () => 0.1; // Roll of 2 + skill bonus = 7, below DC 10

      const result = performMaintenance(maintenanceData, resources, 5, 1);

      expect(result.success).toBe(false);
      expect(result.newMaintenanceLevel).toBe(100); // Unchanged
      expect(result.notes).toContain('Maintenance attempt failed');

      Math.random = originalRandom;
    });

    it('should fix malfunctions on successful repair', () => {
      const malfunction = createMalfunction('mechanical_jam', 'minor');
      const maintenanceData = {
        ...createDefaultMaintenanceData(),
        malfunctions: [malfunction],
      };

      const resources = [{ type: 'repair_kit' as const, quantity: 1 }];

      // Mock Math.random for successful checks
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = () => {
        callCount++;
        return callCount === 1 ? 0.8 : 0.9; // First call for maintenance, second for repair
      };

      const result = performMaintenance(maintenanceData, resources, 10, 2);

      expect(result.success).toBe(true);
      expect(result.malfunctionsFixed).toContain(malfunction.id);

      Math.random = originalRandom;
    });

    it('should cause malfunction on critical failure', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const resources = [{ type: 'lubricant' as const, quantity: 1 }];

      // Mock Math.random for critical failure
      const originalRandom = Math.random;
      let callCount = 0;
      Math.random = () => {
        callCount++;
        if (callCount === 1) return 0.05; // Critical failure (roll of 1)
        return 0.01; // Malfunction occurs
      };

      const result = performMaintenance(maintenanceData, resources, 0, 1);

      expect(result.success).toBe(false);
      expect(result.malfunctionsOccurred.length).toBeGreaterThan(0);
      expect(result.notes).toContain(
        'Maintenance error caused new malfunction!'
      );

      Math.random = originalRandom;
    });
  });

  describe('addUsageHours', () => {
    it('should add usage hours correctly', () => {
      const maintenanceData = createDefaultMaintenanceData();
      const result = addUsageHours(maintenanceData, 25);

      expect(result.usageHours).toBe(25);
      expect(result.maintenanceLevel).toBe(100); // Unchanged
    });

    it('should accumulate usage hours', () => {
      let maintenanceData = createDefaultMaintenanceData();
      maintenanceData = addUsageHours(maintenanceData, 10);
      maintenanceData = addUsageHours(maintenanceData, 15);

      expect(maintenanceData.usageHours).toBe(25);
    });
  });
});

describe('Maintenance Constants', () => {
  it('should have malfunction severity effects', () => {
    const severities: MalfunctionSeverity[] = [
      'minor',
      'moderate',
      'major',
      'critical',
    ];

    severities.forEach(severity => {
      expect(MALFUNCTION_SEVERITY_EFFECTS[severity]).toBeDefined();
      expect(
        MALFUNCTION_SEVERITY_EFFECTS[severity].repairDifficulty
      ).toBeDefined();
      expect(
        MALFUNCTION_SEVERITY_EFFECTS[severity].performancePenalty
      ).toBeGreaterThan(0);
      expect(
        MALFUNCTION_SEVERITY_EFFECTS[severity].riskOfSpread
      ).toBeGreaterThanOrEqual(0);
    });
  });

  it('should have maintenance difficulty DCs', () => {
    const difficulties: MaintenanceDifficulty[] = [
      'trivial',
      'easy',
      'moderate',
      'hard',
      'very_hard',
    ];

    difficulties.forEach(difficulty => {
      expect(MAINTENANCE_DIFFICULTY_DC[difficulty]).toBeDefined();
      expect(MAINTENANCE_DIFFICULTY_DC[difficulty]).toBeGreaterThan(0);
    });

    // Verify ascending difficulty
    expect(MAINTENANCE_DIFFICULTY_DC.trivial).toBeLessThan(
      MAINTENANCE_DIFFICULTY_DC.easy
    );
    expect(MAINTENANCE_DIFFICULTY_DC.easy).toBeLessThan(
      MAINTENANCE_DIFFICULTY_DC.moderate
    );
    expect(MAINTENANCE_DIFFICULTY_DC.moderate).toBeLessThan(
      MAINTENANCE_DIFFICULTY_DC.hard
    );
    expect(MAINTENANCE_DIFFICULTY_DC.hard).toBeLessThan(
      MAINTENANCE_DIFFICULTY_DC.very_hard
    );
  });

  it('should have standard maintenance costs', () => {
    expect(STANDARD_MAINTENANCE_COSTS.routine_weapon).toBeDefined();
    expect(STANDARD_MAINTENANCE_COSTS.routine_armor).toBeDefined();
    expect(STANDARD_MAINTENANCE_COSTS.routine_powered).toBeDefined();
    expect(STANDARD_MAINTENANCE_COSTS.emergency_repair).toBeDefined();

    // Verify powered equipment requires more resources
    expect(STANDARD_MAINTENANCE_COSTS.routine_powered.length).toBeGreaterThan(
      STANDARD_MAINTENANCE_COSTS.routine_weapon.length
    );
  });
});

describe('Edge Cases and Error Handling', () => {
  it('should handle zero maintenance level', () => {
    const maintenanceData = {
      ...createDefaultMaintenanceData(),
      maintenanceLevel: 0,
    };

    const risk = calculateMalfunctionRisk(maintenanceData);
    expect(risk.maintenanceLevelModifier).toBe(10); // (100 - 0) * 0.1
  });

  it('should handle negative usage hours gracefully', () => {
    const maintenanceData = {
      ...createDefaultMaintenanceData(100),
      usageHours: -10, // Shouldn't happen but test robustness
    };

    const risk = calculateMalfunctionRisk(maintenanceData);
    expect(risk.usageHoursModifier).toBe(0); // Math.max(0, ...) prevents negative
  });

  it('should handle empty resource list in maintenance', () => {
    const maintenanceData = createDefaultMaintenanceData();

    // Mock successful skill check
    const originalRandom = Math.random;
    Math.random = () => 0.8;

    const result = performMaintenance(maintenanceData, [], 10, 1);

    expect(result.success).toBe(true);
    expect(result.resourcesConsumed).toEqual([]);

    Math.random = originalRandom;
  });
});
