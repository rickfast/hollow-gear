/**
 * Psionic system (Mindcraft) exports for Hollow Gear TTRPG
 * Complete implementation of the Mindcraft system from Chapter 6
 */

// Core discipline and power system
export * from './disciplines';
export * from './flux';
export * from './focus';
export * from './overload';

// Import types for use in PsionicData interface
import type { PsionicDiscipline, PsionicPower } from './disciplines';

import type { ResourcePool } from './flux';

import type { PsionicFocusState } from './focus';

import type {
  PsionicSignature,
  PsionicSurgeState,
  ExtendedOverloadState,
} from './overload';

// Re-export key types for convenience
export type {
  PsionicDiscipline,
  PsionicPower,
  PowerTier,
  PowerEffect,
  PowerScaling,
} from './disciplines';

export type {
  ResourcePool,
  PsionicFeedbackEffect,
  OverloadState,
} from './flux';

export type {
  MaintainedPower,
  PsionicFocusState,
  FocusBreakResult,
} from './focus';

export type {
  PsionicSignature,
  EmotionalState,
  PsionicSurgeState,
  ExtendedOverloadState,
} from './overload';

/**
 * Complete psionic data for a character
 * This is the main interface that combines all psionic subsystems
 */
export interface PsionicData {
  // Known disciplines and powers
  knownDisciplines: PsionicDiscipline[];
  knownPowers: PsionicPower[];

  // Resource management
  aetherFluxPoints: ResourcePool;

  // Focus and maintenance
  focusState: PsionicFocusState;

  // Overload and feedback tracking
  overloadState: ExtendedOverloadState;

  // Psionic surge ability
  surgeState: PsionicSurgeState;

  // Character's unique psionic signature
  signature: PsionicSignature;

  // Metadata
  psionicLevel: number; // Character's effective psionic level
  primaryAbility: 'intelligence' | 'wisdom'; // Chosen at character creation
}
