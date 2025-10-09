/**
 * Heat point and feedback systems for Hollow Gear spellcasting
 * Manages heat accumulation, feedback effects, and concentration mechanics
 */

import type { ValidationResult, ValidationError } from '../types/common.js';
import type { SpellcastingType } from './shared.js';

/**
 * Heat point tracking data
 */
export interface HeatPointData {
  /** Current heat points accumulated */
  current: number;
  /** Maximum heat points before overheating */
  maximum: number;
  /** Heat dissipation rate per rest period */
  dissipationRate: number;
  /** Heat threshold for feedback effects */
  feedbackThreshold: number;
}

/**
 * Spell feedback effect types
 */
export type FeedbackEffectType = 
  | 'spell_attack_penalty'    // Penalty to spell attack rolls
  | 'spell_dc_penalty'        // Penalty to spell save DCs
  | 'concentration_penalty'   // Penalty to concentration saves
  | 'heat_generation_increase' // Increased heat from spells
  | 'resource_cost_increase'  // Increased AFP/RC costs
  | 'casting_time_increase'   // Longer casting times
  | 'spell_failure_chance';   // Chance for spells to fail

/**
 * A specific feedback effect with its parameters
 */
export interface FeedbackEffect {
  /** Type of feedback effect */
  type: FeedbackEffectType;
  /** Severity of the effect (typically -1 to -5 for penalties) */
  severity: number;
  /** Description of the effect for display */
  description: string;
  /** Whether this effect is currently active */
  active: boolean;
}

/**
 * Complete feedback state for a character
 */
export interface FeedbackState {
  /** Current feedback level (0-100) */
  level: number;
  /** Active feedback effects */
  effects: FeedbackEffect[];
  /** Type of spellcasting causing feedback */
  sourceType: SpellcastingType;
  /** Time until feedback naturally decreases */
  recoveryTime: number;
}

/**
 * Concentration tracking for maintained spells
 */
export interface ConcentrationState {
  /** Whether the character is concentrating on a spell */
  isConcentrating: boolean;
  /** The spell being concentrated on */
  concentratedSpell?: {
    id: string;
    name: string;
    level: number;
    duration: string;
  };
  /** Concentration save DC modifier from feedback */
  concentrationPenalty: number;
  /** Number of concentration saves made this turn */
  concentrationSavesThisTurn: number;
}

/**
 * Combined heat and feedback tracking
 */
export interface HeatFeedbackState {
  /** Heat point tracking */
  heatPoints: HeatPointData;
  /** Spell feedback state */
  feedback: FeedbackState;
  /** Concentration state */
  concentration: ConcentrationState;
}

/**
 * Heat point and feedback utilities
 */
export namespace HeatFeedbackUtils {
  /**
   * Calculate heat feedback threshold based on maximum heat
   */
  export function calculateFeedbackThreshold(maxHeat: number): number {
    return Math.floor(maxHeat * 0.6);
  }

  /**
   * Calculate heat dissipation for different rest types
   */
  export function calculateHeatDissipation(
    restType: 'short' | 'long',
    currentHeat: number,
    dissipationRate: number
  ): number {
    if (restType === 'long') {
      // Long rest removes all heat
      return currentHeat;
    } else {
      // Short rest removes dissipation rate amount
      return Math.min(currentHeat, dissipationRate);
    }
  }

  /**
   * Add heat points with feedback calculation
   */
  export function addHeatPoints(
    state: HeatFeedbackState,
    heatGain: number,
    spellcastingType: SpellcastingType
  ): HeatFeedbackState {
    const newHeatCurrent = Math.min(
      state.heatPoints.maximum,
      state.heatPoints.current + heatGain
    );

    const newFeedbackLevel = calculateFeedbackLevel(
      newHeatCurrent,
      state.heatPoints.maximum,
      state.heatPoints.feedbackThreshold
    );

    const newEffects = calculateFeedbackEffects(
      newFeedbackLevel,
      spellcastingType,
      state.feedback.effects
    );

    return {
      ...state,
      heatPoints: {
        ...state.heatPoints,
        current: newHeatCurrent
      },
      feedback: {
        ...state.feedback,
        level: newFeedbackLevel,
        effects: newEffects,
        sourceType: spellcastingType
      }
    };
  }

  /**
   * Calculate feedback level based on heat accumulation
   */
  export function calculateFeedbackLevel(
    currentHeat: number,
    maxHeat: number,
    feedbackThreshold: number
  ): number {
    if (currentHeat <= feedbackThreshold) {
      return 0;
    }

    const excessHeat = currentHeat - feedbackThreshold;
    const maxExcess = maxHeat - feedbackThreshold;
    
    // Feedback level scales from 0 to 100 based on excess heat
    return Math.min(100, Math.floor((excessHeat / maxExcess) * 100));
  }

  /**
   * Calculate active feedback effects based on feedback level
   */
  export function calculateFeedbackEffects(
    feedbackLevel: number,
    spellcastingType: SpellcastingType,
    currentEffects: FeedbackEffect[]
  ): FeedbackEffect[] {
    const effects: FeedbackEffect[] = [];

    if (feedbackLevel >= 25) {
      effects.push({
        type: 'spell_attack_penalty',
        severity: -1,
        description: 'Minor penalty to spell attacks from heat feedback',
        active: true
      });

      effects.push({
        type: 'concentration_penalty',
        severity: -1,
        description: 'Minor penalty to concentration saves from heat feedback',
        active: true
      });
    }

    if (feedbackLevel >= 50) {
      effects.push({
        type: 'spell_dc_penalty',
        severity: -1,
        description: 'Minor penalty to spell save DCs from heat feedback',
        active: true
      });

      effects.push({
        type: 'heat_generation_increase',
        severity: 1,
        description: 'Spells generate additional heat due to feedback',
        active: true
      });
    }

    if (feedbackLevel >= 75) {
      // Increase existing penalties
      const attackPenalty = effects.find(e => e.type === 'spell_attack_penalty');
      if (attackPenalty) attackPenalty.severity = -2;

      const dcPenalty = effects.find(e => e.type === 'spell_dc_penalty');
      if (dcPenalty) dcPenalty.severity = -2;

      const concentrationPenalty = effects.find(e => e.type === 'concentration_penalty');
      if (concentrationPenalty) concentrationPenalty.severity = -2;

      // Add resource cost increase
      effects.push({
        type: 'resource_cost_increase',
        severity: 1,
        description: `Increased ${spellcastingType === 'arcanist' ? 'AFP' : 'RC'} costs from severe feedback`,
        active: true
      });
    }

    if (feedbackLevel >= 90) {
      effects.push({
        type: 'spell_failure_chance',
        severity: 10, // 10% failure chance
        description: 'Chance for spells to fail due to extreme heat feedback',
        active: true
      });

      effects.push({
        type: 'casting_time_increase',
        severity: 1,
        description: 'Casting times increased due to extreme feedback',
        active: true
      });
    }

    return effects;
  }

  /**
   * Apply rest to reduce heat and feedback
   */
  export function applyRest(
    state: HeatFeedbackState,
    restType: 'short' | 'long'
  ): HeatFeedbackState {
    const heatReduction = calculateHeatDissipation(
      restType,
      state.heatPoints.current,
      state.heatPoints.dissipationRate
    );

    const newHeatCurrent = state.heatPoints.current - heatReduction;
    const newFeedbackLevel = calculateFeedbackLevel(
      newHeatCurrent,
      state.heatPoints.maximum,
      state.heatPoints.feedbackThreshold
    );

    const newEffects = calculateFeedbackEffects(
      newFeedbackLevel,
      state.feedback.sourceType,
      state.feedback.effects
    );

    return {
      ...state,
      heatPoints: {
        ...state.heatPoints,
        current: newHeatCurrent
      },
      feedback: {
        ...state.feedback,
        level: newFeedbackLevel,
        effects: newEffects,
        recoveryTime: restType === 'long' ? 0 : Math.max(0, state.feedback.recoveryTime - 1)
      },
      concentration: {
        ...state.concentration,
        concentrationSavesThisTurn: 0 // Reset concentration saves on rest
      }
    };
  }

  /**
   * Handle concentration save
   */
  export function makeConcentrationSave(
    state: HeatFeedbackState,
    damage: number,
    spellcastingAbilityModifier: number,
    proficiencyBonus: number
  ): { success: boolean; rollResult: number; dc: number; updatedState: HeatFeedbackState } {
    if (!state.concentration.isConcentrating) {
      return {
        success: true,
        rollResult: 0,
        dc: 0,
        updatedState: state
      };
    }

    // Calculate DC: 10 or half damage, whichever is higher
    const dc = Math.max(10, Math.floor(damage / 2));
    
    // Calculate modifier with feedback penalties
    const concentrationPenalty = state.feedback.effects
      .filter(e => e.type === 'concentration_penalty' && e.active)
      .reduce((total, effect) => total + effect.severity, 0);

    const totalModifier = spellcastingAbilityModifier + proficiencyBonus + concentrationPenalty;
    
    // Simulate d20 roll (in actual implementation, this would be provided)
    const rollResult = Math.floor(Math.random() * 20) + 1 + totalModifier;
    const success = rollResult >= dc;

    const updatedState: HeatFeedbackState = {
      ...state,
      concentration: {
        ...state.concentration,
        concentrationSavesThisTurn: state.concentration.concentrationSavesThisTurn + 1,
        isConcentrating: success ? state.concentration.isConcentrating : false,
        concentratedSpell: success ? state.concentration.concentratedSpell : undefined
      }
    };

    return {
      success,
      rollResult,
      dc,
      updatedState
    };
  }

  /**
   * Start concentrating on a spell
   */
  export function startConcentration(
    state: HeatFeedbackState,
    spell: { id: string; name: string; level: number; duration: string }
  ): HeatFeedbackState {
    return {
      ...state,
      concentration: {
        ...state.concentration,
        isConcentrating: true,
        concentratedSpell: spell,
        concentrationSavesThisTurn: 0
      }
    };
  }

  /**
   * End concentration
   */
  export function endConcentration(state: HeatFeedbackState): HeatFeedbackState {
    return {
      ...state,
      concentration: {
        ...state.concentration,
        isConcentrating: false,
        concentratedSpell: undefined,
        concentrationSavesThisTurn: 0
      }
    };
  }

  /**
   * Get total spell attack penalty from feedback
   */
  export function getSpellAttackPenalty(state: HeatFeedbackState): number {
    return state.feedback.effects
      .filter(e => e.type === 'spell_attack_penalty' && e.active)
      .reduce((total, effect) => total + effect.severity, 0);
  }

  /**
   * Get total spell DC penalty from feedback
   */
  export function getSpellDcPenalty(state: HeatFeedbackState): number {
    return state.feedback.effects
      .filter(e => e.type === 'spell_dc_penalty' && e.active)
      .reduce((total, effect) => total + effect.severity, 0);
  }

  /**
   * Get resource cost increase from feedback
   */
  export function getResourceCostIncrease(state: HeatFeedbackState): number {
    return state.feedback.effects
      .filter(e => e.type === 'resource_cost_increase' && e.active)
      .reduce((total, effect) => total + effect.severity, 0);
  }

  /**
   * Get spell failure chance from feedback
   */
  export function getSpellFailureChance(state: HeatFeedbackState): number {
    return state.feedback.effects
      .filter(e => e.type === 'spell_failure_chance' && e.active)
      .reduce((total, effect) => total + effect.severity, 0);
  }

  /**
   * Validate heat feedback state
   */
  export function validateHeatFeedbackState(state: HeatFeedbackState): ValidationResult<HeatFeedbackState> {
    const errors: ValidationError[] = [];

    // Validate heat points
    if (!Number.isInteger(state.heatPoints.current) || state.heatPoints.current < 0) {
      errors.push({
        field: 'heatPoints.current',
        message: 'Current heat points must be a non-negative integer',
        code: 'INVALID_CURRENT_HEAT'
      });
    }

    if (!Number.isInteger(state.heatPoints.maximum) || state.heatPoints.maximum < 0) {
      errors.push({
        field: 'heatPoints.maximum',
        message: 'Maximum heat points must be a non-negative integer',
        code: 'INVALID_MAX_HEAT'
      });
    }

    if (state.heatPoints.current > state.heatPoints.maximum) {
      errors.push({
        field: 'heatPoints.current',
        message: 'Current heat points cannot exceed maximum',
        code: 'HEAT_EXCEEDS_MAX'
      });
    }

    // Validate feedback level
    if (!Number.isInteger(state.feedback.level) || state.feedback.level < 0 || state.feedback.level > 100) {
      errors.push({
        field: 'feedback.level',
        message: 'Feedback level must be an integer between 0 and 100',
        code: 'INVALID_FEEDBACK_LEVEL'
      });
    }

    // Validate spellcasting type
    if (!['arcanist', 'templar'].includes(state.feedback.sourceType)) {
      errors.push({
        field: 'feedback.sourceType',
        message: 'Invalid spellcasting type',
        code: 'INVALID_SPELLCASTING_TYPE'
      });
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: state };
  }

  /**
   * Create initial heat feedback state
   */
  export function createHeatFeedbackState(
    maxHeatPoints: number,
    dissipationRate: number,
    spellcastingType: SpellcastingType
  ): HeatFeedbackState {
    const feedbackThreshold = calculateFeedbackThreshold(maxHeatPoints);

    return {
      heatPoints: {
        current: 0,
        maximum: maxHeatPoints,
        dissipationRate,
        feedbackThreshold
      },
      feedback: {
        level: 0,
        effects: [],
        sourceType: spellcastingType,
        recoveryTime: 0
      },
      concentration: {
        isConcentrating: false,
        concentrationPenalty: 0,
        concentrationSavesThisTurn: 0
      }
    };
  }
}