/**
 * Aether Flux Point management and overload system for Hollow Gear psionics
 * Based on Chapter 6: Mindcraft system
 */

import type { AbilityScore } from '../types/common';

/**
 * Resource pool for tracking current, maximum, and temporary values
 * Used for AFP and other psionic resources
 */
export interface ResourcePool {
  current: number;
  maximum: number;
  temporary: number; // Temporary bonuses that don't affect maximum
}

/**
 * Psionic feedback effects that can occur during overload
 */
export type PsionicFeedbackType = 
  | 'minor_headache'      // Disadvantage on next roll
  | 'static_echo'         // Random nearby device malfunctions  
  | 'neural_spark'        // Take 1d6 psychic damage
  | 'aether_flare'        // Emit 10-ft light, all in area take 1d4 fire
  | 'mindfracture'        // Lose concentration, drop active powers
  | 'collapse';           // Stunned until end of next turn

/**
 * Individual feedback effect with its mechanical impact
 */
export interface PsionicFeedbackEffect {
  type: PsionicFeedbackType;
  description: string;
  damage?: {
    dice: string;
    type: 'psychic' | 'fire';
  };
  conditions?: string[];
  duration?: string;
  areaEffect?: {
    radius: number;
    effect: string;
  };
}

/**
 * Current overload state of a psionic character
 */
export interface OverloadState {
  isOverloaded: boolean;
  excessAfp: number; // How much AFP over the safe limit was spent
  saveDc: number; // Constitution save DC to avoid feedback
  feedbackRisk: boolean; // Whether feedback roll is needed
  lastOverloadTime?: Date; // When the last overload occurred
}

/**
 * Predefined feedback effects based on d6 roll from rulebook
 */
export const PSIONIC_FEEDBACK_EFFECTS: Record<number, PsionicFeedbackEffect> = {
  1: {
    type: 'minor_headache',
    description: 'Minor headache – disadvantage on next roll',
    conditions: ['disadvantage_next_roll']
  },
  2: {
    type: 'static_echo',
    description: 'Static echo – random nearby device malfunctions',
    conditions: ['device_malfunction']
  },
  3: {
    type: 'neural_spark',
    description: 'Neural spark – take 1d6 psychic damage',
    damage: { dice: '1d6', type: 'psychic' }
  },
  4: {
    type: 'aether_flare',
    description: 'Aether flare – emit 10-ft light, all in area take 1d4 fire',
    damage: { dice: '1d4', type: 'fire' },
    areaEffect: { radius: 10, effect: 'bright light and fire damage' }
  },
  5: {
    type: 'mindfracture',
    description: 'Mindfracture – lose concentration, drop active powers',
    conditions: ['lose_concentration', 'drop_active_powers']
  },
  6: {
    type: 'collapse',
    description: 'Collapse – stunned until end of next turn',
    conditions: ['stunned'],
    duration: 'end of next turn'
  }
};

/**
 * Calculate maximum AFP based on class level and ability modifier
 * Formula: Class Level + Ability Modifier (minimum 2)
 */
export function calculateMaximumAfp(classLevel: number, abilityModifier: number): number {
  return Math.max(2, classLevel + abilityModifier);
}

/**
 * Calculate AFP for multiclass characters
 * Each psionic class contributes its level + ability modifier
 */
export function calculateMulticlassAfp(
  psionicClasses: Array<{ level: number; abilityModifier: number }>
): number {
  let totalAfp = 0;
  
  for (const psionicClass of psionicClasses) {
    totalAfp += Math.max(2, psionicClass.level + psionicClass.abilityModifier);
  }
  
  return totalAfp;
}

/**
 * Create a new resource pool with specified maximum
 */
export function createResourcePool(maximum: number, current?: number): ResourcePool {
  return {
    current: current ?? maximum,
    maximum,
    temporary: 0
  };
}

/**
 * Spend AFP from a resource pool
 * Returns updated pool and whether the expenditure was successful
 */
export function spendAfp(
  pool: ResourcePool, 
  amount: number
): { pool: ResourcePool; success: boolean; remaining: number } {
  const totalAvailable = pool.current + pool.temporary;
  
  if (amount > totalAvailable) {
    return { pool, success: false, remaining: totalAvailable };
  }
  
  let remaining = amount;
  let newTemporary = pool.temporary;
  let newCurrent = pool.current;
  
  // Spend temporary AFP first
  if (remaining > 0 && newTemporary > 0) {
    const tempSpent = Math.min(remaining, newTemporary);
    newTemporary -= tempSpent;
    remaining -= tempSpent;
  }
  
  // Then spend current AFP
  if (remaining > 0) {
    newCurrent -= remaining;
  }
  
  return {
    pool: {
      ...pool,
      current: newCurrent,
      temporary: newTemporary
    },
    success: true,
    remaining: newCurrent + newTemporary
  };
}

/**
 * Restore AFP during rest
 * Short rest: restore all AFP
 * Long rest: restore all AFP and clear temporary penalties
 */
export function restoreAfp(
  pool: ResourcePool, 
  restType: 'short' | 'long'
): ResourcePool {
  const restored: ResourcePool = {
    current: pool.maximum,
    maximum: pool.maximum,
    temporary: restType === 'long' ? 0 : pool.temporary
  };
  
  return restored;
}

/**
 * Add temporary AFP (from items, abilities, etc.)
 */
export function addTemporaryAfp(pool: ResourcePool, amount: number): ResourcePool {
  return {
    ...pool,
    temporary: pool.temporary + amount
  };
}

/**
 * Check if AFP expenditure would cause overload
 * Overload occurs when spending more AFP than character level allows
 */
export function checkOverloadRisk(
  afpToSpend: number, 
  characterLevel: number, 
  currentAfp: number
): OverloadState {
  const isOverloaded = afpToSpend > characterLevel;
  const excessAfp = Math.max(0, afpToSpend - characterLevel);
  const saveDc = 12 + excessAfp;
  
  return {
    isOverloaded,
    excessAfp,
    saveDc,
    feedbackRisk: isOverloaded,
    lastOverloadTime: isOverloaded ? new Date() : undefined
  };
}

/**
 * Roll for psionic feedback effect (d6)
 */
export function rollPsionicFeedback(): PsionicFeedbackEffect {
  const roll = Math.floor(Math.random() * 6) + 1;
  return PSIONIC_FEEDBACK_EFFECTS[roll]!; // Non-null assertion since roll is always 1-6
}

/**
 * Calculate the safe AFP expenditure limit for a character level
 */
export function getSafeAfpLimit(characterLevel: number): number {
  return characterLevel;
}

/**
 * Check if a character has sufficient AFP for a power
 */
export function canAffordPower(pool: ResourcePool, afpCost: number): boolean {
  return (pool.current + pool.temporary) >= afpCost;
}

/**
 * Calculate AFP recovery rate for different rest types
 */
export function getAfpRecoveryAmount(
  pool: ResourcePool, 
  restType: 'short' | 'long'
): number {
  switch (restType) {
    case 'short':
    case 'long':
      return pool.maximum - pool.current; // Full recovery
    default:
      return 0;
  }
}

/**
 * Apply fatigue when AFP reaches 0
 * Per rulebook: gain 1 level of Fatigue until long rest
 */
export function checkAfpFatigue(pool: ResourcePool): boolean {
  return pool.current <= 0 && pool.temporary <= 0;
}

/**
 * Utility function to get total available AFP
 */
export function getTotalAfp(pool: ResourcePool): number {
  return pool.current + pool.temporary;
}

/**
 * Create an overload state for safe (non-overloaded) power usage
 */
export function createSafeOverloadState(): OverloadState {
  return {
    isOverloaded: false,
    excessAfp: 0,
    saveDc: 0,
    feedbackRisk: false
  };
}