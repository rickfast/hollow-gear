/**
 * Unit tests for currency and resource management
 */

import { describe, it, expect } from 'bun:test';
import {
  convertToTotalCogs,
  convertFromTotalCogs,
  addCurrency,
  subtractCurrency,
  hasSufficientCurrency,
  createAetherCell,
  useAetherCellCharges,
  rechargeAetherCell,
  getEffectiveChargeCapacity,
  calculateAetherCellValue,
  findBestAetherCell,
  createDefaultCurrencyData,
  CURRENCY_CONVERSION,
  AETHER_CELL_SPECS,
  CONDITION_EFFECTS,
  type AetherCellType,
  type AetherCellCondition,
} from '../currency.js';

describe('Currency System', () => {
  describe('convertToTotalCogs', () => {
    it('should convert currency to total cogs correctly', () => {
      expect(convertToTotalCogs({ cogs: 5, gears: 2, cores: 1 })).toBe(125); // 5 + 20 + 100
      expect(convertToTotalCogs({ cogs: 0, gears: 0, cores: 0 })).toBe(0);
      expect(convertToTotalCogs({ cogs: 10, gears: 0, cores: 0 })).toBe(10);
      expect(convertToTotalCogs({ cogs: 0, gears: 5, cores: 0 })).toBe(50);
      expect(convertToTotalCogs({ cogs: 0, gears: 0, cores: 2 })).toBe(200);
    });
  });

  describe('convertFromTotalCogs', () => {
    it('should convert total cogs back to currency breakdown', () => {
      expect(convertFromTotalCogs(125)).toEqual({
        cogs: 5,
        gears: 2,
        cores: 1,
      });
      expect(convertFromTotalCogs(0)).toEqual({ cogs: 0, gears: 0, cores: 0 });
      expect(convertFromTotalCogs(5)).toEqual({ cogs: 5, gears: 0, cores: 0 }); // Less than 1 gear
      expect(convertFromTotalCogs(10)).toEqual({ cogs: 0, gears: 1, cores: 0 }); // Exactly 1 gear
      expect(convertFromTotalCogs(50)).toEqual({ cogs: 0, gears: 5, cores: 0 });
      expect(convertFromTotalCogs(200)).toEqual({
        cogs: 0,
        gears: 0,
        cores: 2,
      });
      expect(convertFromTotalCogs(157)).toEqual({
        cogs: 7,
        gears: 5,
        cores: 1,
      });
    });
  });

  describe('addCurrency', () => {
    it('should add currency amounts correctly', () => {
      const current = { cogs: 5, gears: 2, cores: 1 };
      const toAdd = { cogs: 3, gears: 1, cores: 0 };
      const result = addCurrency(current, toAdd);

      expect(result).toEqual({ cogs: 8, gears: 3, cores: 1 });
    });

    it('should handle overflow correctly', () => {
      const current = { cogs: 8, gears: 9, cores: 0 };
      const toAdd = { cogs: 5, gears: 2, cores: 0 };
      const result = addCurrency(current, toAdd);

      // 8 + 5 = 13 cogs, 9 + 2 = 11 gears
      // 13 cogs + 110 cogs (11 gears) = 123 cogs = 1 core, 2 gears, 3 cogs
      expect(result).toEqual({ cogs: 3, gears: 2, cores: 1 });
    });
  });

  describe('subtractCurrency', () => {
    it('should subtract currency amounts correctly', () => {
      const current = { cogs: 5, gears: 3, cores: 1 };
      const toSubtract = { cogs: 2, gears: 1, cores: 0 };
      const result = subtractCurrency(current, toSubtract);

      expect(result).toEqual({ cogs: 3, gears: 2, cores: 1 });
    });

    it('should return null for insufficient funds', () => {
      const current = { cogs: 5, gears: 2, cores: 0 };
      const toSubtract = { cogs: 0, gears: 0, cores: 1 };
      const result = subtractCurrency(current, toSubtract);

      expect(result).toBeNull();
    });

    it('should handle borrowing from higher denominations', () => {
      const current = { cogs: 2, gears: 0, cores: 1 };
      const toSubtract = { cogs: 5, gears: 0, cores: 0 };
      const result = subtractCurrency(current, toSubtract);

      // 102 total cogs - 5 cogs = 97 cogs = 9 gears, 7 cogs
      expect(result).toEqual({ cogs: 7, gears: 9, cores: 0 });
    });
  });

  describe('hasSufficientCurrency', () => {
    it('should return true for sufficient funds', () => {
      const current = { cogs: 5, gears: 3, cores: 1 };
      const required = { cogs: 2, gears: 1, cores: 0 };

      expect(hasSufficientCurrency(current, required)).toBe(true);
    });

    it('should return false for insufficient funds', () => {
      const current = { cogs: 5, gears: 2, cores: 0 };
      const required = { cogs: 0, gears: 0, cores: 1 };

      expect(hasSufficientCurrency(current, required)).toBe(false);
    });

    it('should handle exact amounts', () => {
      const current = { cogs: 5, gears: 2, cores: 1 };
      const required = { cogs: 5, gears: 2, cores: 1 };

      expect(hasSufficientCurrency(current, required)).toBe(true);
    });
  });
});

describe('Aether Cell System', () => {
  describe('createAetherCell', () => {
    it('should create aether cell with correct specs', () => {
      const cell = createAetherCell('standard');

      expect(cell.type).toBe('standard');
      expect(cell.charges).toBe(5);
      expect(cell.maxCharges).toBe(5);
      expect(cell.condition).toBe('pristine');
      expect(cell.rechargeCycles).toBe(0);
      expect(cell.id).toBeDefined();
    });

    it('should create cells with different capacities', () => {
      const minor = createAetherCell('minor');
      const major = createAetherCell('major');
      const superior = createAetherCell('superior');

      expect(minor.maxCharges).toBe(3);
      expect(major.maxCharges).toBe(8);
      expect(superior.maxCharges).toBe(12);
    });

    it('should accept custom ID', () => {
      const cell = createAetherCell('standard', 'custom-id');
      expect(cell.id).toBe('custom-id');
    });
  });

  describe('useAetherCellCharges', () => {
    it('should reduce charges correctly', () => {
      const cell = createAetherCell('standard');
      const result = useAetherCellCharges(cell, 2);

      expect(result.charges).toBe(3);
      expect(result.maxCharges).toBe(5);
    });

    it('should not go below 0 charges', () => {
      const cell = createAetherCell('minor');
      cell.charges = 1;
      const result = useAetherCellCharges(cell, 5);

      expect(result.charges).toBe(0);
    });
  });

  describe('rechargeAetherCell', () => {
    it('should recharge cell to full capacity', () => {
      const cell = createAetherCell('standard');
      cell.charges = 2;

      const result = rechargeAetherCell(cell);

      expect(result.charges).toBe(5);
      expect(result.rechargeCycles).toBe(1);
      expect(result.lastRecharged).toBeDefined();
    });

    it('should apply condition efficiency', () => {
      const cell = createAetherCell('standard');
      cell.charges = 0;
      cell.condition = 'worn'; // 85% efficiency

      const result = rechargeAetherCell(cell, 5);

      expect(result.charges).toBe(4); // 5 * 0.85 = 4.25, floored to 4
    });

    it('should degrade condition after many cycles', () => {
      const cell = createAetherCell('standard');
      cell.rechargeCycles = 49;

      const result = rechargeAetherCell(cell);

      expect(result.condition).toBe('pristine');
      expect(result.rechargeCycles).toBe(50);

      const result2 = rechargeAetherCell(result);
      expect(result2.condition).toBe('good');
    });

    it('should handle progressive degradation', () => {
      let cell = createAetherCell('standard');

      // Test pristine -> good at 50 cycles
      cell.rechargeCycles = 50;
      cell = rechargeAetherCell(cell);
      expect(cell.condition).toBe('good');

      // Test good -> worn at 100 cycles
      cell.rechargeCycles = 100;
      cell = rechargeAetherCell(cell);
      expect(cell.condition).toBe('worn');

      // Test worn -> damaged at 200 cycles
      cell.rechargeCycles = 200;
      cell = rechargeAetherCell(cell);
      expect(cell.condition).toBe('damaged');

      // Test damaged -> depleted at 500 cycles
      cell.rechargeCycles = 500;
      cell = rechargeAetherCell(cell);
      expect(cell.condition).toBe('depleted');
    });
  });

  describe('getEffectiveChargeCapacity', () => {
    it('should return full capacity for pristine condition', () => {
      const cell = createAetherCell('standard');
      expect(getEffectiveChargeCapacity(cell)).toBe(5);
    });

    it('should return reduced capacity for damaged condition', () => {
      const cell = createAetherCell('standard');
      cell.condition = 'damaged'; // 70% efficiency
      expect(getEffectiveChargeCapacity(cell)).toBe(3); // 5 * 0.7 = 3.5, floored to 3
    });

    it('should return 0 for depleted condition', () => {
      const cell = createAetherCell('standard');
      cell.condition = 'depleted';
      expect(getEffectiveChargeCapacity(cell)).toBe(0);
    });
  });

  describe('calculateAetherCellValue', () => {
    it('should calculate full value for pristine, full cell', () => {
      const cell = createAetherCell('standard');
      const value = calculateAetherCellValue(cell);
      expect(value.gears).toBe(3); // Base value for standard cell
    });

    it('should reduce value for damaged condition', () => {
      const cell = createAetherCell('standard');
      cell.condition = 'damaged'; // 70% efficiency
      const value = calculateAetherCellValue(cell);
      expect(value.gears).toBe(2); // 3 * 0.7 * 1.0 = 2.1, floored to 2
    });

    it('should reduce value for partial charges', () => {
      const cell = createAetherCell('standard');
      cell.charges = 2; // 40% charged
      const value = calculateAetherCellValue(cell);
      expect(value.gears).toBe(1); // 3 * 1.0 * 0.4 = 1.2, floored to 1
    });

    it('should have minimum value of 1 gear', () => {
      const cell = createAetherCell('minor');
      cell.condition = 'depleted';
      cell.charges = 0;
      const value = calculateAetherCellValue(cell);
      expect(value.gears).toBe(1); // Minimum value
    });
  });

  describe('findBestAetherCell', () => {
    it('should return null if no suitable cells', () => {
      const cells = [
        { ...createAetherCell('minor'), charges: 1 },
        { ...createAetherCell('standard'), charges: 2 },
      ];

      const result = findBestAetherCell(cells, 5);
      expect(result).toBeNull();
    });

    it('should prefer better condition cells', () => {
      const pristineCell = { ...createAetherCell('standard'), charges: 5 };
      const damagedCell = {
        ...createAetherCell('standard'),
        charges: 5,
        condition: 'damaged' as AetherCellCondition,
      };

      const cells = [damagedCell, pristineCell];
      const result = findBestAetherCell(cells, 3);

      expect(result).toBe(pristineCell);
    });

    it('should prefer cells with fewer charges to minimize waste', () => {
      const fullCell = { ...createAetherCell('standard'), charges: 5 };
      const partialCell = { ...createAetherCell('standard'), charges: 3 };

      const cells = [fullCell, partialCell];
      const result = findBestAetherCell(cells, 3);

      expect(result).toBe(partialCell);
    });
  });
});

describe('Currency Constants', () => {
  it('should have correct conversion rates', () => {
    expect(CURRENCY_CONVERSION.COGS_PER_GEAR).toBe(10);
    expect(CURRENCY_CONVERSION.GEARS_PER_CORE).toBe(10);
    expect(CURRENCY_CONVERSION.COGS_PER_CORE).toBe(100);
  });

  it('should have aether cell specs for all types', () => {
    const types: AetherCellType[] = ['minor', 'standard', 'major', 'superior'];

    types.forEach(type => {
      expect(AETHER_CELL_SPECS[type]).toBeDefined();
      expect(AETHER_CELL_SPECS[type].maxCharges).toBeGreaterThan(0);
      expect(AETHER_CELL_SPECS[type].baseValue.gears).toBeGreaterThan(0);
      expect(AETHER_CELL_SPECS[type].degradationRate).toBeGreaterThan(0);
    });
  });

  it('should have condition effects for all conditions', () => {
    const conditions: AetherCellCondition[] = [
      'pristine',
      'good',
      'worn',
      'damaged',
      'depleted',
    ];

    conditions.forEach(condition => {
      expect(CONDITION_EFFECTS[condition]).toBeDefined();
      expect(
        CONDITION_EFFECTS[condition].chargeEfficiency
      ).toBeGreaterThanOrEqual(0);
      expect(
        CONDITION_EFFECTS[condition].malfunctionRisk
      ).toBeGreaterThanOrEqual(0);
    });
  });
});
