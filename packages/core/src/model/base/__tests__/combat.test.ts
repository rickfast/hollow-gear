/**
 * Unit tests for combat system
 */

import { describe, it, expect } from 'bun:test';
import { CombatUtils } from '../combat.js';
import type {
  HitPointData,
  ArmorClassData,
  InitiativeData,
  DeathSaves,
} from '../combat.js';

describe('CombatUtils', () => {
  describe('calculateArmorClass', () => {
    it('should calculate total AC from all components', () => {
      const acData = {
        base: 12,
        armor: 3,
        shield: 2,
        natural: 1,
        deflection: 1,
        miscellaneous: 1,
      };

      const result = CombatUtils.calculateArmorClass(acData);
      expect(result.total).toBe(20);
      expect(result.base).toBe(12);
      expect(result.armor).toBe(3);
    });

    it('should handle zero bonuses', () => {
      const acData = {
        base: 10,
        armor: 0,
        shield: 0,
        natural: 0,
        deflection: 0,
        miscellaneous: 0,
      };

      const result = CombatUtils.calculateArmorClass(acData);
      expect(result.total).toBe(10);
    });

    it('should handle negative modifiers', () => {
      const acData = {
        base: 8, // 10 + (-2) Dex modifier
        armor: 2,
        shield: 0,
        natural: 0,
        deflection: 0,
        miscellaneous: -1,
      };

      const result = CombatUtils.calculateArmorClass(acData);
      expect(result.total).toBe(9);
    });
  });

  describe('calculateInitiative', () => {
    it('should calculate total initiative modifier', () => {
      const initData = {
        modifier: 3, // Dex modifier
        bonus: 2, // Improved Initiative feat
      };

      const result = CombatUtils.calculateInitiative(initData);
      expect(result.total).toBe(5);
      expect(result.modifier).toBe(3);
      expect(result.bonus).toBe(2);
    });

    it('should handle zero bonus', () => {
      const initData = {
        modifier: 2,
        bonus: 0,
      };

      const result = CombatUtils.calculateInitiative(initData);
      expect(result.total).toBe(2);
    });

    it('should handle negative modifiers', () => {
      const initData = {
        modifier: -1, // Low Dex
        bonus: 0,
      };

      const result = CombatUtils.calculateInitiative(initData);
      expect(result.total).toBe(-1);
    });
  });

  describe('createHitPoints', () => {
    it('should create hit points with specified current and maximum', () => {
      const hp = CombatUtils.createHitPoints(25, 20);
      expect(hp.maximum).toBe(25);
      expect(hp.current).toBe(20);
      expect(hp.temporary).toBe(0);
    });

    it('should default current to maximum when not specified', () => {
      const hp = CombatUtils.createHitPoints(30);
      expect(hp.maximum).toBe(30);
      expect(hp.current).toBe(30);
      expect(hp.temporary).toBe(0);
    });
  });

  describe('createArmorClass', () => {
    it('should create AC with Dex modifier', () => {
      const ac = CombatUtils.createArmorClass(3); // +3 Dex
      expect(ac.base).toBe(13); // 10 + 3
      expect(ac.total).toBe(13);
      expect(ac.armor).toBe(0);
      expect(ac.shield).toBe(0);
    });

    it('should handle negative Dex modifier', () => {
      const ac = CombatUtils.createArmorClass(-1); // -1 Dex
      expect(ac.base).toBe(9); // 10 + (-1)
      expect(ac.total).toBe(9);
    });
  });

  describe('createInitiative', () => {
    it('should create initiative with Dex modifier', () => {
      const init = CombatUtils.createInitiative(4); // +4 Dex
      expect(init.modifier).toBe(4);
      expect(init.bonus).toBe(0);
      expect(init.total).toBe(4);
    });
  });

  describe('applyDamage', () => {
    it('should apply damage to current hit points', () => {
      const hp: HitPointData = { current: 25, maximum: 30, temporary: 0 };
      const result = CombatUtils.applyDamage(hp, 10);

      expect(result.current).toBe(15);
      expect(result.maximum).toBe(30);
      expect(result.temporary).toBe(0);
    });

    it('should apply damage to temporary hit points first', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: 5 };
      const result = CombatUtils.applyDamage(hp, 8);

      expect(result.current).toBe(17); // 5 temp absorbed, 3 to current
      expect(result.temporary).toBe(0);
    });

    it('should not reduce current HP below 0', () => {
      const hp: HitPointData = { current: 5, maximum: 25, temporary: 0 };
      const result = CombatUtils.applyDamage(hp, 10);

      expect(result.current).toBe(0);
    });

    it('should handle damage exactly equal to temp HP', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: 8 };
      const result = CombatUtils.applyDamage(hp, 8);

      expect(result.current).toBe(20);
      expect(result.temporary).toBe(0);
    });

    it('should handle massive damage', () => {
      const hp: HitPointData = { current: 15, maximum: 25, temporary: 3 };
      const result = CombatUtils.applyDamage(hp, 50);

      expect(result.current).toBe(0);
      expect(result.temporary).toBe(0);
    });
  });

  describe('applyHealing', () => {
    it('should heal current hit points', () => {
      const hp: HitPointData = { current: 10, maximum: 25, temporary: 0 };
      const result = CombatUtils.applyHealing(hp, 8);

      expect(result.current).toBe(18);
      expect(result.maximum).toBe(25);
    });

    it('should not heal above maximum', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: 0 };
      const result = CombatUtils.applyHealing(hp, 10);

      expect(result.current).toBe(25);
    });

    it('should not affect temporary hit points', () => {
      const hp: HitPointData = { current: 15, maximum: 25, temporary: 5 };
      const result = CombatUtils.applyHealing(hp, 5);

      expect(result.current).toBe(20);
      expect(result.temporary).toBe(5);
    });
  });

  describe('addTemporaryHitPoints', () => {
    it('should add temporary hit points when none exist', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: 0 };
      const result = CombatUtils.addTemporaryHitPoints(hp, 8);

      expect(result.temporary).toBe(8);
      expect(result.current).toBe(20);
    });

    it('should take higher value when temp HP already exist', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: 5 };
      const result = CombatUtils.addTemporaryHitPoints(hp, 8);

      expect(result.temporary).toBe(8);
    });

    it('should keep existing temp HP if higher', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: 10 };
      const result = CombatUtils.addTemporaryHitPoints(hp, 6);

      expect(result.temporary).toBe(10);
    });
  });

  describe('validateHitPoints', () => {
    it('should validate normal hit point data', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: 5 };
      const result = CombatUtils.validateHitPoints(hp);

      expect(result.success).toBe(true);
    });

    it('should reject negative current HP', () => {
      const hp: HitPointData = { current: -5, maximum: 25, temporary: 0 };
      const result = CombatUtils.validateHitPoints(hp);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.some(e => e.code === 'INVALID_CURRENT_HP')).toBe(
          true
        );
      }
    });

    it('should reject maximum HP less than 1', () => {
      const hp: HitPointData = { current: 0, maximum: 0, temporary: 0 };
      const result = CombatUtils.validateHitPoints(hp);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.some(e => e.code === 'INVALID_MAX_HP')).toBe(true);
      }
    });

    it('should reject negative temporary HP', () => {
      const hp: HitPointData = { current: 20, maximum: 25, temporary: -3 };
      const result = CombatUtils.validateHitPoints(hp);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.some(e => e.code === 'INVALID_TEMP_HP')).toBe(true);
      }
    });

    it('should reject current HP exceeding maximum', () => {
      const hp: HitPointData = { current: 30, maximum: 25, temporary: 0 };
      const result = CombatUtils.validateHitPoints(hp);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.some(e => e.code === 'CURRENT_EXCEEDS_MAX')).toBe(
          true
        );
      }
    });
  });

  describe('death saves', () => {
    it('should create default death saves', () => {
      const saves = CombatUtils.createDefaultDeathSaves();
      expect(saves.successes).toBe(0);
      expect(saves.failures).toBe(0);
    });

    it('should add death save success', () => {
      const saves: DeathSaves = { successes: 1, failures: 2 };
      const result = CombatUtils.addDeathSaveSuccess(saves);

      expect(result.successes).toBe(2);
      expect(result.failures).toBe(2);
    });

    it('should cap death save successes at 3', () => {
      const saves: DeathSaves = { successes: 3, failures: 1 };
      const result = CombatUtils.addDeathSaveSuccess(saves);

      expect(result.successes).toBe(3);
    });

    it('should add death save failure', () => {
      const saves: DeathSaves = { successes: 1, failures: 1 };
      const result = CombatUtils.addDeathSaveFailure(saves);

      expect(result.successes).toBe(1);
      expect(result.failures).toBe(2);
    });

    it('should cap death save failures at 3', () => {
      const saves: DeathSaves = { successes: 0, failures: 3 };
      const result = CombatUtils.addDeathSaveFailure(saves);

      expect(result.failures).toBe(3);
    });

    it('should check if character is stable', () => {
      const stableSaves: DeathSaves = { successes: 3, failures: 1 };
      const unstableSaves: DeathSaves = { successes: 2, failures: 1 };

      expect(CombatUtils.isStable(stableSaves)).toBe(true);
      expect(CombatUtils.isStable(unstableSaves)).toBe(false);
    });

    it('should check if character is dead', () => {
      const deadSaves: DeathSaves = { successes: 1, failures: 3 };
      const aliveSaves: DeathSaves = { successes: 1, failures: 2 };

      expect(CombatUtils.isDead(deadSaves)).toBe(true);
      expect(CombatUtils.isDead(aliveSaves)).toBe(false);
    });
  });

  describe('unconscious and death checks', () => {
    it('should detect unconsciousness from 0 HP', () => {
      const unconsciousHP: HitPointData = {
        current: 0,
        maximum: 25,
        temporary: 0,
      };
      const consciousHP: HitPointData = {
        current: 1,
        maximum: 25,
        temporary: 0,
      };

      expect(CombatUtils.isUnconsciousFromDamage(unconsciousHP)).toBe(true);
      expect(CombatUtils.isUnconsciousFromDamage(consciousHP)).toBe(false);
    });

    it('should detect death from massive damage', () => {
      // Character at full HP taking massive damage
      const fullHP: HitPointData = { current: 20, maximum: 20, temporary: 0 };

      // Damage that reduces to 0 and excess equals max HP = death (20 + 20 = 40 damage)
      expect(CombatUtils.isDeadFromMassiveDamage(fullHP, 40)).toBe(true);

      // Damage that reduces to 0 but excess less than max HP = not death (20 + 19 = 39 damage)
      expect(CombatUtils.isDeadFromMassiveDamage(fullHP, 39)).toBe(false);

      // Character already at 0 HP
      const zeroHP: HitPointData = { current: 0, maximum: 20, temporary: 0 };

      // Damage equal to max HP while at 0 = death
      expect(CombatUtils.isDeadFromMassiveDamage(zeroHP, 20)).toBe(true);

      // Damage less than max HP while at 0 = not death
      expect(CombatUtils.isDeadFromMassiveDamage(zeroHP, 19)).toBe(false);

      // Character with some HP remaining
      const partialHP: HitPointData = { current: 5, maximum: 20, temporary: 0 };

      // Damage that would bring to -15 (5 + 20 = 25 damage) = death
      expect(CombatUtils.isDeadFromMassiveDamage(partialHP, 25)).toBe(true);

      // Damage that would bring to -14 (5 + 19 = 24 damage) = not death
      expect(CombatUtils.isDeadFromMassiveDamage(partialHP, 24)).toBe(false);
    });
  });
});
