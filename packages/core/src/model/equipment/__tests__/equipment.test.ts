/**
 * Unit tests for equipment system
 * Tests equipment creation, property validation, mod installation, and inventory management
 */

import { describe, it, expect } from 'bun:test';
import {
  EquipmentUtils,
  WeaponUtils,
  ArmorUtils,
  ShieldUtils,
  ModUtils,
  InventoryUtils,
} from '../index.js';
import type {
  Equipment,
  Weapon,
  Armor,
  Shield,
  EquipmentMod,
  ModSlot,
  InventoryData,
  CarriedItem,
  CraftsmanshipTier,
  EquipmentCondition,
  ModSlotType,
  ItemLocation,
  EncumbranceLevel,
} from '../index.js';
import type { EquipmentId } from '../../types/common.js';

describe('Equipment System', () => {
  // Test data setup
  const createTestEquipment = (
    id: string = 'test-equipment',
    tier: CraftsmanshipTier = 'workshop',
    condition: EquipmentCondition = 'pristine'
  ): Equipment => ({
    id: id as EquipmentId,
    name: 'Test Equipment',
    type: 'tool',
    tier,
    properties: {
      physical: {
        weight: 2,
        bulk: 1,
        size: 'medium',
      },
      requiresPower: false,
      canMalfunction: false,
      magical: false,
      psionic: false,
    },
    condition,
    value: { cogs: 50, gears: 0, cores: 0 },
    modSlots: [],
    isUnique: false,
  });

  const createTestWeapon = (): Weapon => ({
    ...createTestEquipment('test-weapon'),
    type: 'simple-melee',
    weaponProperties: {
      damage: {
        diceCount: 1,
        diceType: 'd6',
        damageType: 'slashing',
      },
      properties: ['light'],
      range: { normal: 5, long: 5 },
      powered: false,
      proficiency: 'simple-melee',
      attackAbility: 'strength',
      throwable: false,
    },
  });

  const createTestArmor = (): Armor => ({
    ...createTestEquipment('test-armor'),
    type: 'light-armor',
    armorProperties: {
      baseAC: 12,
      maxDexBonus: 3,
      stealthDisadvantage: false,
      category: 'light',
      powered: false,
      environmentalProtection: [],
      damageResistances: [],
      damageVulnerabilities: [],
    },
  });

  const createTestMod = (type: ModSlotType = 'utility'): EquipmentMod => ({
    id: 'test-mod',
    name: 'Test Modification',
    tier: 1,
    type,
    effects: [
      {
        type: 'damage-bonus',
        value: 1,
        description: 'Adds +1 damage',
      },
    ],
    installationTier: 'workshop',
    description: 'A test modification',
  });

  describe('EquipmentUtils', () => {
    describe('getTierMultiplier', () => {
      it('should return correct multipliers for each tier', () => {
        expect(EquipmentUtils.getTierMultiplier('workshop')).toBe(1);
        expect(EquipmentUtils.getTierMultiplier('guild')).toBe(5);
        expect(EquipmentUtils.getTierMultiplier('relic')).toBe(25);
        expect(EquipmentUtils.getTierMultiplier('mythic')).toBe(125);
      });
    });

    describe('getTotalValueInCogs', () => {
      it('should calculate total value correctly', () => {
        const value = { cogs: 5, gears: 3, cores: 2 };
        const total = EquipmentUtils.getTotalValueInCogs(value);
        expect(total).toBe(235); // 5 + (3 * 10) + (2 * 100)
      });

      it('should handle zero values', () => {
        const value = { cogs: 0, gears: 0, cores: 0 };
        expect(EquipmentUtils.getTotalValueInCogs(value)).toBe(0);
      });
    });

    describe('cogsToMixedCurrency', () => {
      it('should convert cogs to mixed currency', () => {
        const result = EquipmentUtils.cogsToMixedCurrency(235);
        expect(result).toEqual({ cores: 2, gears: 3, cogs: 5 });
      });

      it('should handle exact conversions', () => {
        const result = EquipmentUtils.cogsToMixedCurrency(100);
        expect(result).toEqual({ cores: 1, gears: 0, cogs: 0 });
      });

      it('should handle zero value', () => {
        const result = EquipmentUtils.cogsToMixedCurrency(0);
        expect(result).toEqual({ cores: 0, gears: 0, cogs: 0 });
      });
    });

    describe('isFunctional', () => {
      it('should return true for pristine equipment', () => {
        const equipment = createTestEquipment();
        expect(EquipmentUtils.isFunctional(equipment)).toBe(true);
      });

      it('should return false for broken equipment', () => {
        const equipment = createTestEquipment('test', 'workshop', 'broken');
        expect(EquipmentUtils.isFunctional(equipment)).toBe(false);
      });

      it('should return false for equipment with disabling malfunctions', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          {
            id: 'slot1',
            type: 'utility',
            accessible: true,
            malfunctionState: {
              type: 'power-drain',
              severity: 3,
              description: 'Critical malfunction',
              disabling: true,
              repairDC: 20,
            },
          },
        ];
        expect(EquipmentUtils.isFunctional(equipment)).toBe(false);
      });
    });

    describe('getAvailableModSlots', () => {
      it('should return available slots', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          { id: 'slot1', type: 'utility', accessible: true },
          {
            id: 'slot2',
            type: 'power',
            accessible: true,
            installedMod: createTestMod(),
          },
          { id: 'slot3', type: 'utility', accessible: false },
        ];

        const available = EquipmentUtils.getAvailableModSlots(equipment);
        expect(available).toHaveLength(1);
        expect(available[0]?.id).toBe('slot1');
      });

      it('should filter by slot type', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          { id: 'slot1', type: 'utility', accessible: true },
          { id: 'slot2', type: 'power', accessible: true },
          { id: 'slot3', type: 'universal', accessible: true },
        ];

        const utilitySlots = EquipmentUtils.getAvailableModSlots(
          equipment,
          'utility'
        );
        expect(utilitySlots).toHaveLength(2); // utility + universal
        expect(utilitySlots.map(s => s.id)).toContain('slot1');
        expect(utilitySlots.map(s => s.id)).toContain('slot3');
      });
    });

    describe('validateEquipment', () => {
      it('should validate correct equipment', () => {
        const equipment = createTestEquipment();
        const result = EquipmentUtils.validateEquipment(equipment);
        expect(result.success).toBe(true);
      });

      it('should reject equipment with missing ID', () => {
        const equipment = createTestEquipment();
        equipment.id = '' as EquipmentId;
        const result = EquipmentUtils.validateEquipment(equipment);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'MISSING_ID')).toBe(true);
        }
      });

      it('should reject equipment with negative weight', () => {
        const equipment = createTestEquipment();
        equipment.properties.physical.weight = -1;
        const result = EquipmentUtils.validateEquipment(equipment);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_WEIGHT')).toBe(
            true
          );
        }
      });

      it('should reject equipment with invalid bulk', () => {
        const equipment = createTestEquipment();
        equipment.properties.physical.bulk = 5; // Max is 4
        const result = EquipmentUtils.validateEquipment(equipment);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_BULK')).toBe(true);
        }
      });

      it('should reject equipment with duplicate mod slot IDs', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          { id: 'slot1', type: 'utility', accessible: true },
          { id: 'slot1', type: 'power', accessible: true },
        ];
        const result = EquipmentUtils.validateEquipment(equipment);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'DUPLICATE_SLOT_ID')).toBe(
            true
          );
        }
      });
    });
  });

  describe('WeaponUtils', () => {
    describe('hasProperty', () => {
      it('should detect weapon properties', () => {
        const weapon = createTestWeapon();
        expect(WeaponUtils.hasProperty(weapon, 'light')).toBe(true);
        expect(WeaponUtils.hasProperty(weapon, 'heavy')).toBe(false);
      });
    });

    describe('requiresAmmunition', () => {
      it('should detect ammunition requirement', () => {
        const weapon = createTestWeapon();
        expect(WeaponUtils.requiresAmmunition(weapon)).toBe(false);

        weapon.weaponProperties.properties.push('ammunition');
        weapon.weaponProperties.ammunition = {
          type: 'arrow',
          current: 20,
          capacity: 30,
          recoverable: true,
        };
        expect(WeaponUtils.requiresAmmunition(weapon)).toBe(true);
      });
    });

    describe('hasAmmunition', () => {
      it('should check ammunition availability', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.properties.push('ammunition');
        weapon.weaponProperties.ammunition = {
          type: 'arrow',
          current: 5,
          capacity: 30,
          recoverable: true,
        };

        expect(WeaponUtils.hasAmmunition(weapon, 3)).toBe(true);
        expect(WeaponUtils.hasAmmunition(weapon, 6)).toBe(false);
      });
    });

    describe('consumeAmmunition', () => {
      it('should consume ammunition correctly', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.ammunition = {
          type: 'arrow',
          current: 10,
          capacity: 30,
          recoverable: true,
        };

        const updated = WeaponUtils.consumeAmmunition(weapon, 3);
        expect(updated.weaponProperties.ammunition?.current).toBe(7);
      });

      it('should not go below zero ammunition', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.ammunition = {
          type: 'arrow',
          current: 2,
          capacity: 30,
          recoverable: true,
        };

        const updated = WeaponUtils.consumeAmmunition(weapon, 5);
        expect(updated.weaponProperties.ammunition?.current).toBe(0);
      });
    });

    describe('reloadWeapon', () => {
      it('should reload ammunition correctly', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.ammunition = {
          type: 'arrow',
          current: 5,
          capacity: 30,
          recoverable: true,
        };

        const updated = WeaponUtils.reloadWeapon(weapon, 10);
        expect(updated.weaponProperties.ammunition?.current).toBe(15);
      });

      it('should not exceed capacity', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.ammunition = {
          type: 'arrow',
          current: 25,
          capacity: 30,
          recoverable: true,
        };

        const updated = WeaponUtils.reloadWeapon(weapon, 10);
        expect(updated.weaponProperties.ammunition?.current).toBe(30);
      });
    });

    describe('validateWeapon', () => {
      it('should validate correct weapon', () => {
        const weapon = createTestWeapon();
        const result = WeaponUtils.validateWeapon(weapon);
        expect(result.success).toBe(true);
      });

      it('should reject weapon with invalid damage dice', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.damage.diceCount = 0;
        const result = WeaponUtils.validateWeapon(weapon);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_DAMAGE_DICE')).toBe(
            true
          );
        }
      });

      it('should reject weapon with invalid range', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.range.long = 3; // Less than normal range
        const result = WeaponUtils.validateWeapon(weapon);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_LONG_RANGE')).toBe(
            true
          );
        }
      });

      it('should require ammunition data for ammunition weapons', () => {
        const weapon = createTestWeapon();
        weapon.weaponProperties.properties.push('ammunition');
        // Don't add ammunition data
        const result = WeaponUtils.validateWeapon(weapon);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(
            result.error.some(e => e.code === 'MISSING_AMMUNITION_DATA')
          ).toBe(true);
        }
      });
    });

    describe('createWeapon', () => {
      it('should create weapon with default properties', () => {
        const weapon = WeaponUtils.createWeapon(
          'sword',
          'Longsword',
          'martial-melee',
          'guild',
          { diceCount: 1, diceType: 'd8', damageType: 'slashing' },
          { normal: 5, long: 5 },
          ['versatile'],
          'martial-melee'
        );

        expect(weapon.name).toBe('Longsword');
        expect(weapon.type).toBe('martial-melee');
        expect(weapon.tier).toBe('guild');
        expect(weapon.weaponProperties.damage.diceType).toBe('d8');
        expect(weapon.weaponProperties.properties).toContain('versatile');
      });
    });
  });

  describe('ArmorUtils', () => {
    describe('calculateAC', () => {
      it('should calculate AC with Dex modifier', () => {
        const armor = createTestArmor();
        const ac = ArmorUtils.calculateAC(armor, 2, 2, 1); // +2 Dex, +2 shield, +1 other
        expect(ac).toBe(17); // 12 + 2 + 2 + 1
      });

      it('should cap Dex modifier at max allowed', () => {
        const armor = createTestArmor();
        armor.armorProperties.maxDexBonus = 2;
        const ac = ArmorUtils.calculateAC(armor, 4); // +4 Dex, but capped at +2
        expect(ac).toBe(14); // 12 + 2
      });
    });

    describe('meetsStrengthRequirement', () => {
      it('should check strength requirements', () => {
        const armor = createTestArmor();
        armor.armorProperties.strengthRequirement = 13;

        expect(ArmorUtils.meetsStrengthRequirement(armor, 15)).toBe(true);
        expect(ArmorUtils.meetsStrengthRequirement(armor, 12)).toBe(false);
      });

      it('should return true when no requirement', () => {
        const armor = createTestArmor();
        expect(ArmorUtils.meetsStrengthRequirement(armor, 8)).toBe(true);
      });
    });

    describe('validateArmor', () => {
      it('should validate correct armor', () => {
        const armor = createTestArmor();
        const result = ArmorUtils.validateArmor(armor);
        expect(result.success).toBe(true);
      });

      it('should reject armor with invalid AC', () => {
        const armor = createTestArmor();
        armor.armorProperties.baseAC = 30; // Too high
        const result = ArmorUtils.validateArmor(armor);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_BASE_AC')).toBe(
            true
          );
        }
      });
    });
  });

  describe('ModUtils', () => {
    describe('canInstallMod', () => {
      it('should allow compatible mod installation', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          { id: 'slot1', type: 'utility', accessible: true },
        ];
        const mod = createTestMod('utility');

        const result = ModUtils.canInstallMod(equipment, mod, 'slot1');
        expect(result.success).toBe(true);
      });

      it('should reject installation on occupied slot', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          {
            id: 'slot1',
            type: 'utility',
            accessible: true,
            installedMod: createTestMod(),
          },
        ];
        const mod = createTestMod('utility');

        const result = ModUtils.canInstallMod(equipment, mod, 'slot1');
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'SLOT_OCCUPIED')).toBe(true);
        }
      });

      it('should reject incompatible mod types', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [{ id: 'slot1', type: 'power', accessible: true }];
        const mod = createTestMod('utility');

        const result = ModUtils.canInstallMod(equipment, mod, 'slot1');
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'TYPE_INCOMPATIBLE')).toBe(
            true
          );
        }
      });

      it('should allow universal slots to accept any mod', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          { id: 'slot1', type: 'universal', accessible: true },
        ];
        const mod = createTestMod('power');

        const result = ModUtils.canInstallMod(equipment, mod, 'slot1');
        expect(result.success).toBe(true);
      });
    });

    describe('installMod', () => {
      it('should install mod successfully', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          { id: 'slot1', type: 'utility', accessible: true },
        ];
        const mod = createTestMod('utility');

        const result = ModUtils.installMod(equipment, mod, 'slot1');
        expect(result.success).toBe(true);
        expect(result.equipment?.modSlots[0]?.installedMod?.name).toBe(
          'Test Modification'
        );
      });

      it('should fail installation on invalid slot', () => {
        const equipment = createTestEquipment();
        const mod = createTestMod();

        const result = ModUtils.installMod(equipment, mod, 'nonexistent');
        expect(result.success).toBe(false);
        expect(result.errors).toContain('Mod slot not found');
      });
    });

    describe('removeMod', () => {
      it('should remove installed mod', () => {
        const equipment = createTestEquipment();
        equipment.modSlots = [
          {
            id: 'slot1',
            type: 'utility',
            accessible: true,
            installedMod: createTestMod(),
          },
        ];

        const updated = ModUtils.removeMod(equipment, 'slot1');
        expect(updated.modSlots[0]?.installedMod).toBeUndefined();
      });
    });

    describe('validateMod', () => {
      it('should validate correct mod', () => {
        const mod = createTestMod();
        const result = ModUtils.validateMod(mod);
        expect(result.success).toBe(true);
      });

      it('should reject mod with invalid tier', () => {
        const mod = createTestMod();
        mod.tier = 5; // Invalid tier
        const result = ModUtils.validateMod(mod);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_TIER')).toBe(true);
        }
      });

      it('should reject mod with no effects', () => {
        const mod = createTestMod();
        mod.effects = [];
        const result = ModUtils.validateMod(mod);

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'NO_EFFECTS')).toBe(true);
        }
      });
    });
  });

  describe('InventoryUtils', () => {
    const createTestInventory = (): InventoryData => ({
      equipped: {
        mainHand: undefined,
        offHand: undefined,
        armor: undefined,
        accessories: [],
        tools: [],
        maxAccessories: 3,
        maxTools: 2,
      },
      carried: [],
      containers: [],
      currency: { cogs: 100, gears: 5, cores: 1 },
      capacity: {
        maxWeight: 150,
        maxBulk: 10,
        currentWeight: 0,
        currentBulk: 0,
        strengthModifier: 2,
        sizeCategory: 'medium',
      },
      encumbrance: 'unencumbered',
    });

    describe('calculateEncumbrance', () => {
      it('should calculate unencumbered state', () => {
        const capacity = {
          maxWeight: 150,
          maxBulk: 10,
          currentWeight: 30, // 20% of max
          currentBulk: 2, // 20% of max
          strengthModifier: 2,
          sizeCategory: 'medium' as const,
        };

        const encumbrance = InventoryUtils.calculateEncumbrance(capacity);
        expect(encumbrance).toBe('unencumbered');
      });

      it('should calculate heavy encumbrance', () => {
        const capacity = {
          maxWeight: 150,
          maxBulk: 10,
          currentWeight: 130, // 87% of max
          currentBulk: 8, // 80% of max
          strengthModifier: 2,
          sizeCategory: 'medium' as const,
        };

        const encumbrance = InventoryUtils.calculateEncumbrance(capacity);
        expect(encumbrance).toBe('heavy');
      });

      it('should calculate overloaded state', () => {
        const capacity = {
          maxWeight: 150,
          maxBulk: 10,
          currentWeight: 160, // Over max
          currentBulk: 8,
          strengthModifier: 2,
          sizeCategory: 'medium' as const,
        };

        const encumbrance = InventoryUtils.calculateEncumbrance(capacity);
        expect(encumbrance).toBe('overloaded');
      });
    });

    describe('getSpeedModifier', () => {
      it('should return correct speed modifiers', () => {
        expect(InventoryUtils.getSpeedModifier('unencumbered')).toBe(0);
        expect(InventoryUtils.getSpeedModifier('light')).toBe(-5);
        expect(InventoryUtils.getSpeedModifier('moderate')).toBe(-10);
        expect(InventoryUtils.getSpeedModifier('heavy')).toBe(-15);
        expect(InventoryUtils.getSpeedModifier('overloaded')).toBe(-20);
      });
    });

    describe('hasEncumbranceDisadvantage', () => {
      it('should detect disadvantage conditions', () => {
        expect(InventoryUtils.hasEncumbranceDisadvantage('unencumbered')).toBe(
          false
        );
        expect(InventoryUtils.hasEncumbranceDisadvantage('light')).toBe(false);
        expect(InventoryUtils.hasEncumbranceDisadvantage('moderate')).toBe(
          false
        );
        expect(InventoryUtils.hasEncumbranceDisadvantage('heavy')).toBe(true);
        expect(InventoryUtils.hasEncumbranceDisadvantage('overloaded')).toBe(
          true
        );
      });
    });

    describe('addItem', () => {
      it('should add item to inventory', () => {
        const inventory = createTestInventory();
        const equipment = createTestEquipment();

        const result = InventoryUtils.addItem(
          inventory,
          equipment,
          2,
          'backpack'
        );
        expect(result.success).toBe(true);

        if (result.success) {
          expect(result.data.carried).toHaveLength(1);
          expect(result.data.carried[0]?.quantity).toBe(2);
          expect(result.data.capacity.currentWeight).toBe(4); // 2 * 2 weight
        }
      });

      it('should stack with existing items', () => {
        const inventory = createTestInventory();
        const equipment = createTestEquipment();

        // Add first batch
        let result = InventoryUtils.addItem(
          inventory,
          equipment,
          2,
          'backpack'
        );
        expect(result.success).toBe(true);

        if (result.success) {
          // Add second batch
          result = InventoryUtils.addItem(
            result.data,
            equipment,
            3,
            'backpack'
          );
          expect(result.success).toBe(true);

          if (result.success) {
            expect(result.data.carried).toHaveLength(1);
            expect(result.data.carried[0]?.quantity).toBe(5);
          }
        }
      });

      it('should reject items that exceed capacity', () => {
        const inventory = createTestInventory();
        const heavyEquipment = createTestEquipment();
        heavyEquipment.properties.physical.weight = 200; // Exceeds capacity

        const result = InventoryUtils.addItem(inventory, heavyEquipment, 1);
        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.some(e => e.code === 'WEIGHT_EXCEEDED')).toBe(
            true
          );
        }
      });
    });

    describe('removeItem', () => {
      it('should remove item from inventory', () => {
        const inventory = createTestInventory();
        const equipment = createTestEquipment();

        // Add item first
        let result = InventoryUtils.addItem(inventory, equipment, 5);
        expect(result.success).toBe(true);

        if (result.success) {
          // Remove some quantity
          const removeResult = InventoryUtils.removeItem(
            result.data,
            equipment.id,
            2
          );
          expect(removeResult.success).toBe(true);

          if (removeResult.success) {
            expect(removeResult.data.carried[0]?.quantity).toBe(3);
          }
        }
      });

      it('should remove item entirely when quantity matches', () => {
        const inventory = createTestInventory();
        const equipment = createTestEquipment();

        // Add item first
        let result = InventoryUtils.addItem(inventory, equipment, 3);
        expect(result.success).toBe(true);

        if (result.success) {
          // Remove all quantity
          const removeResult = InventoryUtils.removeItem(
            result.data,
            equipment.id,
            3
          );
          expect(removeResult.success).toBe(true);

          if (removeResult.success) {
            expect(removeResult.data.carried).toHaveLength(0);
          }
        }
      });

      it('should reject removing more than available', () => {
        const inventory = createTestInventory();
        const equipment = createTestEquipment();

        // Add item first
        let result = InventoryUtils.addItem(inventory, equipment, 2);
        expect(result.success).toBe(true);

        if (result.success) {
          // Try to remove more than available
          const removeResult = InventoryUtils.removeItem(
            result.data,
            equipment.id,
            5
          );
          expect(removeResult.success).toBe(false);

          if (!removeResult.success) {
            expect(
              removeResult.error.some(e => e.code === 'INSUFFICIENT_QUANTITY')
            ).toBe(true);
          }
        }
      });
    });

    describe('equipItem', () => {
      it('should equip item from inventory', () => {
        const inventory = createTestInventory();
        const equipment = createTestEquipment();

        // Add item to inventory first
        let result = InventoryUtils.addItem(inventory, equipment, 1);
        expect(result.success).toBe(true);

        if (result.success) {
          // Equip the item
          const equipResult = InventoryUtils.equipItem(
            result.data,
            equipment.id,
            'accessories'
          );
          expect(equipResult.success).toBe(true);

          if (equipResult.success) {
            expect(equipResult.data.equipped.accessories).toContain(
              equipment.id
            );
            expect(equipResult.data.carried).toHaveLength(0);
          }
        }
      });

      it('should reject equipping when no slots available', () => {
        const inventory = createTestInventory();
        inventory.equipped.maxAccessories = 0; // No slots available
        const equipment = createTestEquipment();

        // Add item to inventory first
        let result = InventoryUtils.addItem(inventory, equipment, 1);
        expect(result.success).toBe(true);

        if (result.success) {
          // Try to equip when no slots
          const equipResult = InventoryUtils.equipItem(
            result.data,
            equipment.id,
            'accessories'
          );
          expect(equipResult.success).toBe(false);

          if (!equipResult.success) {
            expect(
              equipResult.error.some(e => e.code === 'NO_ACCESSORY_SLOTS')
            ).toBe(true);
          }
        }
      });
    });

    describe('findItems', () => {
      it('should find items by name', () => {
        const inventory = createTestInventory();
        const equipment1 = createTestEquipment('item1');
        equipment1.name = 'Magic Sword';
        const equipment2 = createTestEquipment('item2');
        equipment2.name = 'Steel Shield';

        // Add items
        let result = InventoryUtils.addItem(inventory, equipment1, 1);
        if (result.success) {
          result = InventoryUtils.addItem(result.data, equipment2, 1);
        }

        expect(result.success).toBe(true);
        if (result.success) {
          const found = InventoryUtils.findItems(result.data, 'sword', 'name');
          expect(found).toHaveLength(1);
          expect(found[0]?.equipment.name).toBe('Magic Sword');
        }
      });
    });

    describe('validateInventory', () => {
      it('should validate correct inventory', () => {
        const inventory = createTestInventory();
        const result = InventoryUtils.validateInventory(inventory);
        expect(result.success).toBe(true);
      });

      it('should reject inventory exceeding weight capacity', () => {
        const inventory = createTestInventory();
        inventory.capacity.currentWeight = 200; // Exceeds max of 150

        const result = InventoryUtils.validateInventory(inventory);
        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.some(e => e.code === 'WEIGHT_EXCEEDED')).toBe(
            true
          );
        }
      });

      it('should reject negative currency', () => {
        const inventory = createTestInventory();
        inventory.currency.cogs = -10;

        const result = InventoryUtils.validateInventory(inventory);
        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.some(e => e.code === 'NEGATIVE_CURRENCY')).toBe(
            true
          );
        }
      });

      it('should reject items with invalid quantity', () => {
        const inventory = createTestInventory();
        const equipment = createTestEquipment();

        inventory.carried.push({
          equipment,
          quantity: 0, // Invalid quantity
          location: 'backpack',
          accessible: true,
        });

        const result = InventoryUtils.validateInventory(inventory);
        expect(result.success).toBe(false);

        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_QUANTITY')).toBe(
            true
          );
        }
      });
    });
  });
});
