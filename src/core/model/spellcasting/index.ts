/**
 * Spellcasting system exports for Hollow Gear TTRPG
 * Supports both Arcanist (Aether Formulae) and Templar (Resonance Charges) spellcasting
 */

// Shared spellcasting infrastructure
export * from './shared.js';

// Heat point and feedback systems
export * from './heat-feedback.js';

// Arcanist and Templar specific systems
export * from './arcanist.js';
export * from './templar.js';

// Import types for main interface
import type { BaseSpellcastingData, SpellcastingType } from './shared.js';
import type { ResourcePool } from '../types/resources.js';
import type { HeatFeedbackState } from './heat-feedback.js';

/**
 * Arcanist-specific spellcasting resources
 */
export interface ArcanistSpellcasting {
  /** Aether Flux Points used for spellcasting */
  aetherFluxPoints: ResourcePool;
  /** Current Equilibrium Tier (maximum spell level) */
  equilibriumTier: number;
  /** Number of Overclocking uses remaining */
  overclockUses: number;
  /** Overclocking heat generation multiplier */
  overclockMultiplier: number;
}

/**
 * Templar-specific spellcasting resources
 */
export interface TemplarSpellcasting {
  /** Resonance Charges used for spellcasting */
  resonanceCharges: ResourcePool;
  /** Number of Overchannel uses remaining */
  overchannelUses: number;
  /** Faith feedback accumulation */
  faithFeedback: number;
  /** Maximum faith feedback before penalties */
  maxFaithFeedback: number;
}

/**
 * Combined spellcasting resources for different caster types
 */
export interface SpellcastingResources {
  /** Arcanist-specific resources (if character is an Arcanist) */
  arcanist?: ArcanistSpellcasting;
  /** Templar-specific resources (if character is a Templar) */
  templar?: TemplarSpellcasting;
}

/**
 * Complete spellcasting data for a character
 * Extends the base spellcasting data with class-specific resources and heat/feedback tracking
 */
export interface SpellcastingData extends BaseSpellcastingData {
  /** Class-specific spellcasting resources */
  resources: SpellcastingResources;
  /** Heat point and feedback tracking */
  heatFeedback: HeatFeedbackState;
}