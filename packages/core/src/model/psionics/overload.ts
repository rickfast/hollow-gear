/**
 * Psionic overload, feedback system, and psionic signatures for Hollow Gear
 * Based on Chapter 6: Mindcraft system
 */

import type { PsionicFeedbackEffect, PsionicFeedbackType } from './flux';

/**
 * Emotional states that influence psionic signatures
 */
export type EmotionalState =
  | 'rage'
  | 'calm'
  | 'curiosity'
  | 'despair'
  | 'joy'
  | 'fear'
  | 'determination'
  | 'confusion';

/**
 * Visual and sensory manifestations of psionic signatures
 */
export interface PsionicSignatureManifestation {
  visual: string; // Color, light patterns, etc.
  auditory: string; // Sounds, tones, etc.
  emotional: string; // Emotional aura felt by others
  intensity: 'faint' | 'moderate' | 'strong' | 'overwhelming';
}

/**
 * Unique psionic signature for each character
 */
export interface PsionicSignature {
  characterId: string;
  baseEmotion: EmotionalState;
  manifestation: PsionicSignatureManifestation;
  detectabilityRange: number; // In feet
  lastUsed?: Date;
  powerLevel: number; // Influences how long the signature lingers
}

/**
 * Predefined signature manifestations based on emotional states
 */
export const SIGNATURE_MANIFESTATIONS: Record<
  EmotionalState,
  PsionicSignatureManifestation
> = {
  rage: {
    visual: 'Red flickers of heat and vibration',
    auditory: 'Low rumbling and crackling sounds',
    emotional: 'Waves of anger and aggression',
    intensity: 'strong',
  },
  calm: {
    visual: 'Cool, blue-hued resonance',
    auditory: 'Gentle humming and soft chimes',
    emotional: 'Peaceful, centering presence',
    intensity: 'moderate',
  },
  curiosity: {
    visual: 'Rapid, flickering pulses of yellow-white light',
    auditory: 'Metallic chimes and quick tonal shifts',
    emotional: 'Inquisitive, probing sensation',
    intensity: 'moderate',
  },
  despair: {
    visual: 'Distorted shadows and faint afterimages',
    auditory: 'Hollow echoes and mournful tones',
    emotional: 'Heavy sadness and hopelessness',
    intensity: 'strong',
  },
  joy: {
    visual: 'Bright golden sparkles and warm glows',
    auditory: 'Musical harmonies and uplifting tones',
    emotional: 'Infectious happiness and energy',
    intensity: 'moderate',
  },
  fear: {
    visual: 'Erratic purple flashes and trembling edges',
    auditory: 'Sharp discordant notes and whispers',
    emotional: 'Anxiety and unease',
    intensity: 'strong',
  },
  determination: {
    visual: 'Steady silver-white radiance',
    auditory: 'Rhythmic pulses and resolute tones',
    emotional: 'Unwavering resolve and focus',
    intensity: 'strong',
  },
  confusion: {
    visual: 'Swirling multicolored patterns',
    auditory: 'Overlapping tones and static',
    emotional: 'Disorientation and uncertainty',
    intensity: 'faint',
  },
};

/**
 * Overload recovery state tracking
 */
export interface OverloadRecoveryState {
  isRecovering: boolean;
  recoveryStartTime: Date;
  recoveryDuration: number; // In minutes
  penaltiesActive: boolean;
  nextAfpRecoveryTime?: Date;
}

/**
 * Complete overload state including recovery tracking
 */
export interface ExtendedOverloadState {
  isOverloaded: boolean;
  excessAfp: number;
  saveDc: number;
  feedbackRisk: boolean;
  lastOverloadTime?: Date;
  recovery?: OverloadRecoveryState;
  accumulatedFeedback: PsionicFeedbackEffect[];
}

/**
 * Psionic surge state (once per short rest ability)
 */
export interface PsionicSurgeState {
  available: boolean;
  lastUsed?: Date;
  bonusActive: boolean; // +2 to attack rolls and save DCs
  freeAfpUsed: boolean; // Whether the free Tier 1-2 power was used
  backlashPending: boolean; // 1d4 psychic damage pending
  afpRecoveryBlocked: boolean; // Cannot regain AFP until end of next short rest
}

/**
 * Create a psionic signature for a character
 */
export function createPsionicSignature(
  characterId: string,
  baseEmotion: EmotionalState,
  powerLevel: number = 1
): PsionicSignature {
  return {
    characterId,
    baseEmotion,
    manifestation: SIGNATURE_MANIFESTATIONS[baseEmotion],
    detectabilityRange: 30, // Base range from rulebook
    powerLevel,
  };
}

/**
 * Update psionic signature when power is used
 */
export function updateSignatureAfterPowerUse(
  signature: PsionicSignature,
  powerTier: number,
  currentEmotion?: EmotionalState
): PsionicSignature {
  const updatedSignature = { ...signature };

  // Update last used time
  updatedSignature.lastUsed = new Date();

  // Temporarily shift manifestation if emotion changed
  if (currentEmotion && currentEmotion !== signature.baseEmotion) {
    updatedSignature.manifestation = {
      ...SIGNATURE_MANIFESTATIONS[currentEmotion],
      intensity: calculateSignatureIntensity(powerTier, signature.powerLevel),
    };
  } else {
    updatedSignature.manifestation = {
      ...updatedSignature.manifestation,
      intensity: calculateSignatureIntensity(powerTier, signature.powerLevel),
    };
  }

  return updatedSignature;
}

/**
 * Calculate how long a psionic signature lingers
 */
export function calculateSignatureLingerDuration(
  powerTier: number,
  powerLevel: number
): number {
  // Base duration in minutes: Tier * PowerLevel * 10
  return powerTier * powerLevel * 10;
}

/**
 * Check if a signature is still detectable
 */
export function isSignatureDetectable(
  signature: PsionicSignature,
  powerTier: number,
  currentTime: Date = new Date()
): boolean {
  if (!signature.lastUsed) return false;

  const lingerDuration = calculateSignatureLingerDuration(
    powerTier,
    signature.powerLevel
  );
  const timeSinceUse = currentTime.getTime() - signature.lastUsed.getTime();
  const lingerDurationMs = lingerDuration * 60 * 1000; // Convert to milliseconds

  return timeSinceUse < lingerDurationMs;
}

/**
 * Handle psionic surge activation
 */
export function activatePsionicSurge(surgeState: PsionicSurgeState): {
  newState: PsionicSurgeState;
  success: boolean;
} {
  if (!surgeState.available) {
    return { newState: surgeState, success: false };
  }

  const newState: PsionicSurgeState = {
    available: false,
    lastUsed: new Date(),
    bonusActive: true,
    freeAfpUsed: false,
    backlashPending: true,
    afpRecoveryBlocked: true,
  };

  return { newState, success: true };
}

/**
 * End psionic surge turn effects
 */
export function endPsionicSurgeTurn(
  surgeState: PsionicSurgeState
): PsionicSurgeState {
  return {
    ...surgeState,
    bonusActive: false,
    backlashPending: false, // Damage should be applied when this is called
  };
}

/**
 * Restore psionic surge on short rest
 */
export function restorePsionicSurge(
  surgeState: PsionicSurgeState,
  restType: 'short' | 'long'
): PsionicSurgeState {
  if (restType === 'short' || restType === 'long') {
    return {
      available: true,
      bonusActive: false,
      freeAfpUsed: false,
      backlashPending: false,
      afpRecoveryBlocked: false,
    };
  }

  return surgeState;
}

/**
 * Calculate overload recovery time based on excess AFP
 */
export function calculateOverloadRecovery(
  excessAfp: number
): OverloadRecoveryState {
  const recoveryDuration = excessAfp * 10; // 10 minutes per excess AFP

  return {
    isRecovering: true,
    recoveryStartTime: new Date(),
    recoveryDuration,
    penaltiesActive: true,
    nextAfpRecoveryTime: new Date(Date.now() + recoveryDuration * 60 * 1000),
  };
}

/**
 * Check if overload recovery is complete
 */
export function checkOverloadRecovery(
  recovery: OverloadRecoveryState,
  currentTime: Date = new Date()
): { isComplete: boolean; updatedRecovery?: OverloadRecoveryState } {
  const elapsedMs =
    currentTime.getTime() - recovery.recoveryStartTime.getTime();
  const recoveryMs = recovery.recoveryDuration * 60 * 1000;

  if (elapsedMs >= recoveryMs) {
    return {
      isComplete: true,
      updatedRecovery: {
        ...recovery,
        isRecovering: false,
        penaltiesActive: false,
      },
    };
  }

  return { isComplete: false };
}

/**
 * Accumulate feedback effects from multiple overloads
 */
export function accumulateFeedbackEffects(
  currentEffects: PsionicFeedbackEffect[],
  newEffect: PsionicFeedbackEffect
): PsionicFeedbackEffect[] {
  // Some effects stack, others replace
  const stackableTypes: PsionicFeedbackType[] = [
    'neural_spark',
    'aether_flare',
  ];

  if (stackableTypes.includes(newEffect.type)) {
    return [...currentEffects, newEffect];
  } else {
    // Replace existing effect of same type
    const filtered = currentEffects.filter(
      effect => effect.type !== newEffect.type
    );
    return [...filtered, newEffect];
  }
}

/**
 * Clear temporary feedback effects after appropriate time
 */
export function clearExpiredFeedbackEffects(
  effects: PsionicFeedbackEffect[],
  timeElapsed: number // in minutes
): PsionicFeedbackEffect[] {
  // Most feedback effects are temporary and clear after a few minutes
  const persistentTypes: PsionicFeedbackType[] = ['mindfracture']; // Lasts until rest

  return effects.filter(
    effect => persistentTypes.includes(effect.type) || timeElapsed < 10 // 10 minute default
  );
}

/**
 * Calculate signature intensity based on power tier and character power level
 */
function calculateSignatureIntensity(
  powerTier: number,
  characterPowerLevel: number
): 'faint' | 'moderate' | 'strong' | 'overwhelming' {
  const intensity = powerTier + Math.floor(characterPowerLevel / 3);

  if (intensity >= 7) return 'overwhelming';
  if (intensity >= 5) return 'strong';
  if (intensity >= 3) return 'moderate';
  return 'faint';
}

/**
 * Create initial extended overload state
 */
export function createInitialOverloadState(): ExtendedOverloadState {
  return {
    isOverloaded: false,
    excessAfp: 0,
    saveDc: 0,
    feedbackRisk: false,
    accumulatedFeedback: [],
  };
}

/**
 * Create initial psionic surge state
 */
export function createInitialSurgeState(): PsionicSurgeState {
  return {
    available: true,
    bonusActive: false,
    freeAfpUsed: false,
    backlashPending: false,
    afpRecoveryBlocked: false,
  };
}
