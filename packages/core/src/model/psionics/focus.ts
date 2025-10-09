/**
 * Psionic focus limit and power maintenance system for Hollow Gear
 * Based on Chapter 6: Mindcraft system
 */

import type { PsionicPower, PowerDuration } from './disciplines';

/**
 * A psionic power that is currently being maintained/sustained
 */
export interface MaintainedPower {
  powerId: string;
  power: PsionicPower;
  startTime: Date;
  duration: PowerDuration;
  remainingDuration?: number; // In rounds/minutes/hours depending on duration type
  concentrationRequired: boolean;
  focusRequired: boolean;
  amplificationLevel?: number; // If the power was amplified when cast
  targetInfo?: {
    targetId?: string;
    targetName?: string;
    area?: string; // Description of affected area
  };
}

/**
 * Focus breaking conditions and their effects
 */
export type FocusBreakCause =
  | 'damage_taken'
  | 'failed_save'
  | 'voluntary'
  | 'overload'
  | 'unconscious'
  | 'death'
  | 'new_power_conflict';

/**
 * Result of a focus break attempt
 */
export interface FocusBreakResult {
  success: boolean;
  psychicBacklash: boolean;
  backlashDamage?: string; // e.g., "1d4"
  powersDropped: string[]; // IDs of powers that were dropped
  cause: FocusBreakCause;
}

/**
 * Character's current focus state
 */
export interface PsionicFocusState {
  focusLimit: number;
  maintainedPowers: MaintainedPower[];
  concentrationPower?: string; // ID of power requiring concentration
  lastFocusBreak?: {
    time: Date;
    cause: FocusBreakCause;
    powersLost: string[];
  };
}

/**
 * Calculate focus limit based on character level
 * Level 1-5: 1, Level 6-9: 2, Level 10+: 3
 */
export function calculateFocusLimit(characterLevel: number): number {
  if (characterLevel >= 10) return 3;
  if (characterLevel >= 6) return 2;
  return 1;
}

/**
 * Check if a character can maintain an additional power
 */
export function canMaintainAdditionalPower(
  focusState: PsionicFocusState,
  newPower: PsionicPower
): { canMaintain: boolean; reason?: string } {
  // Check focus limit
  const currentFocusUsed = focusState.maintainedPowers.filter(
    p => p.focusRequired
  ).length;
  if (newPower.requiresFocus && currentFocusUsed >= focusState.focusLimit) {
    return {
      canMaintain: false,
      reason: `Focus limit reached (${currentFocusUsed}/${focusState.focusLimit})`,
    };
  }

  // Check concentration limit (only one concentration power at a time)
  if (newPower.requiresConcentration && focusState.concentrationPower) {
    return {
      canMaintain: false,
      reason: 'Already concentrating on another power',
    };
  }

  return { canMaintain: true };
}

/**
 * Add a maintained power to the focus state
 */
export function addMaintainedPower(
  focusState: PsionicFocusState,
  power: PsionicPower,
  amplificationLevel?: number,
  targetInfo?: MaintainedPower['targetInfo']
): PsionicFocusState {
  const maintainedPower: MaintainedPower = {
    powerId: power.id,
    power,
    startTime: new Date(),
    duration: power.duration,
    concentrationRequired: power.requiresConcentration || false,
    focusRequired: power.requiresFocus || false,
    amplificationLevel,
    targetInfo,
    remainingDuration: calculateInitialDuration(power.duration),
  };

  const newState: PsionicFocusState = {
    ...focusState,
    maintainedPowers: [...focusState.maintainedPowers, maintainedPower],
  };

  // Set concentration power if needed
  if (power.requiresConcentration) {
    newState.concentrationPower = power.id;
  }

  return newState;
}

/**
 * Remove a maintained power from focus state
 */
export function removeMaintainedPower(
  focusState: PsionicFocusState,
  powerId: string,
  cause: FocusBreakCause = 'voluntary'
): { newState: PsionicFocusState; result: FocusBreakResult } {
  const powerToRemove = focusState.maintainedPowers.find(
    p => p.powerId === powerId
  );

  if (!powerToRemove) {
    return {
      newState: focusState,
      result: {
        success: false,
        psychicBacklash: false,
        powersDropped: [],
        cause,
      },
    };
  }

  const newMaintainedPowers = focusState.maintainedPowers.filter(
    p => p.powerId !== powerId
  );
  const newConcentrationPower =
    focusState.concentrationPower === powerId
      ? undefined
      : focusState.concentrationPower;

  // Determine if psychic backlash occurs (involuntary focus breaks)
  const psychicBacklash = cause !== 'voluntary' && powerToRemove.focusRequired;

  const result: FocusBreakResult = {
    success: true,
    psychicBacklash,
    backlashDamage: psychicBacklash ? '1d4' : undefined,
    powersDropped: [powerId],
    cause,
  };

  const newState: PsionicFocusState = {
    ...focusState,
    maintainedPowers: newMaintainedPowers,
    concentrationPower: newConcentrationPower,
    lastFocusBreak: {
      time: new Date(),
      cause,
      powersLost: [powerId],
    },
  };

  return { newState, result };
}

/**
 * Break all maintained powers (e.g., when unconscious or overloaded)
 */
export function breakAllMaintainedPowers(
  focusState: PsionicFocusState,
  cause: FocusBreakCause
): { newState: PsionicFocusState; result: FocusBreakResult } {
  const powersDropped = focusState.maintainedPowers.map(p => p.powerId);
  const focusPowersDropped = focusState.maintainedPowers.filter(
    p => p.focusRequired
  );

  const psychicBacklash =
    cause !== 'voluntary' && focusPowersDropped.length > 0;

  const result: FocusBreakResult = {
    success: true,
    psychicBacklash,
    backlashDamage: psychicBacklash ? '1d4' : undefined,
    powersDropped,
    cause,
  };

  const newState: PsionicFocusState = {
    ...focusState,
    maintainedPowers: [],
    concentrationPower: undefined,
    lastFocusBreak: {
      time: new Date(),
      cause,
      powersLost: powersDropped,
    },
  };

  return { newState, result };
}

/**
 * Update maintained powers (reduce duration, check for expiration)
 */
export function updateMaintainedPowers(
  focusState: PsionicFocusState,
  timeElapsed: { rounds?: number; minutes?: number; hours?: number }
): PsionicFocusState {
  const updatedPowers = focusState.maintainedPowers
    .map(power => updatePowerDuration(power, timeElapsed))
    .filter(power => !isPowerExpired(power));

  // Update concentration power if it expired
  const concentrationPowerStillActive = updatedPowers.some(
    p => p.powerId === focusState.concentrationPower
  );

  return {
    ...focusState,
    maintainedPowers: updatedPowers,
    concentrationPower: concentrationPowerStillActive
      ? focusState.concentrationPower
      : undefined,
  };
}

/**
 * Check if a power requires a Constitution save to maintain focus
 * Used when taking damage while concentrating
 */
export function calculateConcentrationSave(damage: number): number {
  return Math.max(10, Math.floor(damage / 2));
}

/**
 * Handle concentration save failure
 */
export function handleConcentrationFailure(focusState: PsionicFocusState): {
  newState: PsionicFocusState;
  result: FocusBreakResult;
} {
  if (!focusState.concentrationPower) {
    return {
      newState: focusState,
      result: {
        success: false,
        psychicBacklash: false,
        powersDropped: [],
        cause: 'failed_save',
      },
    };
  }

  return removeMaintainedPower(
    focusState,
    focusState.concentrationPower,
    'failed_save'
  );
}

/**
 * Get current focus usage
 */
export function getCurrentFocusUsage(focusState: PsionicFocusState): {
  used: number;
  limit: number;
  available: number;
  concentrationUsed: boolean;
} {
  const used = focusState.maintainedPowers.filter(p => p.focusRequired).length;

  return {
    used,
    limit: focusState.focusLimit,
    available: focusState.focusLimit - used,
    concentrationUsed: !!focusState.concentrationPower,
  };
}

/**
 * Create initial focus state for a character
 */
export function createInitialFocusState(
  characterLevel: number
): PsionicFocusState {
  return {
    focusLimit: calculateFocusLimit(characterLevel),
    maintainedPowers: [],
    concentrationPower: undefined,
  };
}

/**
 * Helper function to calculate initial duration in appropriate units
 */
function calculateInitialDuration(duration: PowerDuration): number | undefined {
  if (typeof duration === 'object') {
    if ('rounds' in duration) return duration.rounds;
    if ('minutes' in duration) return duration.minutes;
    if ('hours' in duration) return duration.hours;
  }
  return undefined;
}

/**
 * Update a single power's remaining duration
 */
function updatePowerDuration(
  power: MaintainedPower,
  timeElapsed: { rounds?: number; minutes?: number; hours?: number }
): MaintainedPower {
  if (!power.remainingDuration || typeof power.duration === 'string') {
    return power; // No duration tracking needed
  }

  let reduction = 0;

  if (typeof power.duration === 'object') {
    if ('rounds' in power.duration && timeElapsed.rounds) {
      reduction = timeElapsed.rounds;
    } else if ('minutes' in power.duration && timeElapsed.minutes) {
      reduction = timeElapsed.minutes;
    } else if ('hours' in power.duration && timeElapsed.hours) {
      reduction = timeElapsed.hours;
    }
  }

  return {
    ...power,
    remainingDuration: Math.max(0, power.remainingDuration - reduction),
  };
}

/**
 * Check if a power has expired
 */
function isPowerExpired(power: MaintainedPower): boolean {
  if (typeof power.duration === 'string') {
    return power.duration === 'instantaneous';
  }

  return power.remainingDuration !== undefined && power.remainingDuration <= 0;
}
