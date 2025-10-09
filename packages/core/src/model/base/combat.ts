/**
 * Combat statistics and hit point management for D&D 5e
 */

import type { AbilityScore, ValidationResult, ValidationError } from '../types/common.js';

/**
 * Hit point data for a character
 */
export interface HitPointData {
  /** Current hit points */
  current: number;
  /** Maximum hit points */
  maximum: number;
  /** Temporary hit points */
  temporary: number;
}

/**
 * Armor class calculation data
 */
export interface ArmorClassData {
  /** Base armor class (10 + Dex modifier by default) */
  base: number;
  /** AC bonus from armor */
  armor: number;
  /** AC bonus from shield */
  shield: number;
  /** Natural armor bonus */
  natural: number;
  /** Deflection bonus (magical) */
  deflection: number;
  /** Miscellaneous bonuses */
  miscellaneous: number;
  /** Total armor class (calculated) */
  readonly total: number;
}

/**
 * Initiative data
 */
export interface InitiativeData {
  /** Base initiative modifier (usually Dex modifier) */
  modifier: number;
  /** Miscellaneous bonuses to initiative */
  bonus: number;
  /** Total initiative modifier */
  readonly total: number;
}

/**
 * Combat condition tracking
 */
export interface CombatConditions {
  /** Character is blinded */
  blinded: boolean;
  /** Character is charmed */
  charmed: boolean;
  /** Character is deafened */
  deafened: boolean;
  /** Character is frightened */
  frightened: boolean;
  /** Character is grappled */
  grappled: boolean;
  /** Character is incapacitated */
  incapacitated: boolean;
  /** Character is invisible */
  invisible: boolean;
  /** Character is paralyzed */
  paralyzed: boolean;
  /** Character is petrified */
  petrified: boolean;
  /** Character is poisoned */
  poisoned: boolean;
  /** Character is prone */
  prone: boolean;
  /** Character is restrained */
  restrained: boolean;
  /** Character is stunned */
  stunned: boolean;
  /** Character is unconscious */
  unconscious: boolean;
  /** Character is exhausted (level 1-6) */
  exhaustion: number;
}

/**
 * Death saving throw data
 */
export interface DeathSaves {
  /** Number of successful death saves */
  successes: number;
  /** Number of failed death saves */
  failures: number;
}

/**
 * Complete combat statistics for a character
 */
export interface CombatData {
  /** Hit point information */
  hitPoints: HitPointData;
  /** Armor class calculation */
  armorClass: ArmorClassData;
  /** Initiative modifier */
  initiative: InitiativeData;
  /** Current conditions affecting the character */
  conditions: CombatConditions;
  /** Death saving throws (if applicable) */
  deathSaves: DeathSaves;
}

/**
 * Utility functions for combat calculations
 */
export namespace CombatUtils {
  /**
   * Calculate total armor class from components
   */
  export function calculateArmorClass(ac: Omit<ArmorClassData, 'total'>): ArmorClassData {
    const total = ac.base + ac.armor + ac.shield + ac.natural + ac.deflection + ac.miscellaneous;
    return {
      ...ac,
      total
    };
  }

  /**
   * Calculate total initiative modifier
   */
  export function calculateInitiative(init: Omit<InitiativeData, 'total'>): InitiativeData {
    return {
      ...init,
      total: init.modifier + init.bonus
    };
  }

  /**
   * Create default hit point data
   */
  export function createHitPoints(maximum: number, current?: number): HitPointData {
    return {
      current: current ?? maximum,
      maximum,
      temporary: 0
    };
  }

  /**
   * Create default armor class data with base AC calculation
   */
  export function createArmorClass(dexModifier: number): ArmorClassData {
    const base = 10 + dexModifier;
    return calculateArmorClass({
      base,
      armor: 0,
      shield: 0,
      natural: 0,
      deflection: 0,
      miscellaneous: 0
    });
  }

  /**
   * Create default initiative data
   */
  export function createInitiative(dexModifier: number): InitiativeData {
    return calculateInitiative({
      modifier: dexModifier,
      bonus: 0
    });
  }

  /**
   * Create default combat conditions (all false/0)
   */
  export function createDefaultConditions(): CombatConditions {
    return {
      blinded: false,
      charmed: false,
      deafened: false,
      frightened: false,
      grappled: false,
      incapacitated: false,
      invisible: false,
      paralyzed: false,
      petrified: false,
      poisoned: false,
      prone: false,
      restrained: false,
      stunned: false,
      unconscious: false,
      exhaustion: 0
    };
  }

  /**
   * Create default death saves
   */
  export function createDefaultDeathSaves(): DeathSaves {
    return {
      successes: 0,
      failures: 0
    };
  }

  /**
   * Apply damage to hit points
   */
  export function applyDamage(hitPoints: HitPointData, damage: number): HitPointData {
    let remainingDamage = damage;
    let newTemporary = hitPoints.temporary;
    let newCurrent = hitPoints.current;

    // Temporary hit points absorb damage first
    if (remainingDamage > 0 && newTemporary > 0) {
      const tempDamage = Math.min(remainingDamage, newTemporary);
      newTemporary -= tempDamage;
      remainingDamage -= tempDamage;
    }

    // Apply remaining damage to current hit points
    if (remainingDamage > 0) {
      newCurrent = Math.max(0, newCurrent - remainingDamage);
    }

    return {
      ...hitPoints,
      current: newCurrent,
      temporary: newTemporary
    };
  }

  /**
   * Apply healing to hit points
   */
  export function applyHealing(hitPoints: HitPointData, healing: number): HitPointData {
    const newCurrent = Math.min(hitPoints.maximum, hitPoints.current + healing);
    return {
      ...hitPoints,
      current: newCurrent
    };
  }

  /**
   * Add temporary hit points
   */
  export function addTemporaryHitPoints(hitPoints: HitPointData, tempHP: number): HitPointData {
    // Temporary hit points don't stack - take the higher value
    const newTemporary = Math.max(hitPoints.temporary, tempHP);
    return {
      ...hitPoints,
      temporary: newTemporary
    };
  }

  /**
   * Validate hit point data
   */
  export function validateHitPoints(hitPoints: HitPointData): ValidationResult<HitPointData> {
    const errors: ValidationError[] = [];

    if (hitPoints.current < 0) {
      errors.push({
        field: 'hitPoints.current',
        message: 'Current hit points cannot be negative',
        code: 'INVALID_CURRENT_HP'
      });
    }

    if (hitPoints.maximum < 1) {
      errors.push({
        field: 'hitPoints.maximum',
        message: 'Maximum hit points must be at least 1',
        code: 'INVALID_MAX_HP'
      });
    }

    if (hitPoints.temporary < 0) {
      errors.push({
        field: 'hitPoints.temporary',
        message: 'Temporary hit points cannot be negative',
        code: 'INVALID_TEMP_HP'
      });
    }

    if (hitPoints.current > hitPoints.maximum) {
      errors.push({
        field: 'hitPoints.current',
        message: 'Current hit points cannot exceed maximum',
        code: 'CURRENT_EXCEEDS_MAX'
      });
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: hitPoints };
  }

  /**
   * Check if character is unconscious due to hit points
   */
  export function isUnconsciousFromDamage(hitPoints: HitPointData): boolean {
    return hitPoints.current === 0;
  }

  /**
   * Check if character is dead from massive damage
   * In D&D 5e, if damage reduces you to 0 HP and the remaining damage 
   * equals or exceeds your hit point maximum, you die instantly
   */
  export function isDeadFromMassiveDamage(hitPoints: HitPointData, damage: number): boolean {
    if (hitPoints.current > 0) {
      // Calculate what HP would be after damage
      const hpAfterDamage = hitPoints.current - damage;
      if (hpAfterDamage <= 0) {
        // Character would be reduced to 0 or below
        const excessDamage = Math.abs(hpAfterDamage);
        return excessDamage >= hitPoints.maximum;
      }
    } else if (hitPoints.current === 0) {
      // Already at 0 HP, any damage equal to max HP kills instantly
      return damage >= hitPoints.maximum;
    }
    return false;
  }

  /**
   * Reset death saves
   */
  export function resetDeathSaves(): DeathSaves {
    return createDefaultDeathSaves();
  }

  /**
   * Add a death save success
   */
  export function addDeathSaveSuccess(deathSaves: DeathSaves): DeathSaves {
    return {
      ...deathSaves,
      successes: Math.min(3, deathSaves.successes + 1)
    };
  }

  /**
   * Add a death save failure
   */
  export function addDeathSaveFailure(deathSaves: DeathSaves): DeathSaves {
    return {
      ...deathSaves,
      failures: Math.min(3, deathSaves.failures + 1)
    };
  }

  /**
   * Check if character is stable (3 death save successes)
   */
  export function isStable(deathSaves: DeathSaves): boolean {
    return deathSaves.successes >= 3;
  }

  /**
   * Check if character is dead (3 death save failures)
   */
  export function isDead(deathSaves: DeathSaves): boolean {
    return deathSaves.failures >= 3;
  }
}