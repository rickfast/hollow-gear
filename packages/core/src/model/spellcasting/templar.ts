/**
 * Templar spellcasting system (Resonance Charges) for Hollow Gear TTRPG
 * Implements the unique Templar magic system with RC, Overchannel, and Faith Feedback
 */

import type { ResourcePool } from '../types/resources.js';
import type { ValidationResult, ValidationError } from '../types/common.js';
import type { BaseSpellcastingData, KnownSpell } from './shared.js';
import { HeatPointUtils } from './shared.js';

/**
 * Templar-specific spellcasting data
 */
export interface TemplarSpellcastingData extends BaseSpellcastingData {
  type: 'templar';
  /** Resonance Charges used for spellcasting */
  resonanceCharges: ResourcePool;
  /** Number of Overchannel uses remaining this day */
  overchannelUses: number;
  /** Maximum Overchannel uses per day */
  maxOverchannelUses: number;
  /** Current faith feedback accumulation */
  faithFeedback: number;
  /** Maximum faith feedback before severe penalties */
  maxFaithFeedback: number;
  /** Known Miracles (spells) */
  knownMiracles: TemplarMiracle[];
  /** Current resonance harmony level */
  resonanceHarmony: number;
}

/**
 * A Miracle known by a Templar
 * Extends the base KnownSpell with Templar-specific properties
 */
export interface TemplarMiracle extends KnownSpell {
  /** RC cost to cast at base level */
  rcCost: number;
  /** Additional RC cost per spell level above base */
  rcScaling: number;
  /** Faith feedback generated when cast normally */
  baseFaithFeedback: number;
  /** Whether this miracle can be Overchanneled */
  canOverchannel: boolean;
  /** Overchannel effects description */
  overchannelEffects?: string;
  /** Resonance type for harmony calculations */
  resonanceType: ResonanceType;
}

/**
 * Types of resonance for Templar spells
 */
export type ResonanceType =
  | 'divine' // Traditional divine magic
  | 'harmonic' // Sound and vibration based
  | 'protective' // Defensive and warding
  | 'restorative' // Healing and restoration
  | 'righteous' // Combat and justice
  | 'revelatory'; // Knowledge and truth

/**
 * Result of casting a Templar spell
 */
export interface TemplarCastingResult {
  /** Whether the spell was successfully cast */
  success: boolean;
  /** RC cost of the casting */
  rcCost: number;
  /** Faith feedback generated */
  faithFeedbackGenerated: number;
  /** Heat points generated */
  heatGenerated: number;
  /** Whether Overchannel was used */
  overchanneled: boolean;
  /** Resonance harmony bonus applied */
  harmonyBonus: number;
  /** Any error messages */
  errors?: string[];
  /** Updated spellcasting data after casting */
  updatedData?: TemplarSpellcastingData;
}

/**
 * Templar spellcasting utilities and calculations
 */
export namespace TemplarUtils {
  /**
   * Calculate maximum Overchannel uses per day
   */
  export function calculateMaxOverchannelUses(templarLevel: number): number {
    return Math.max(1, Math.floor(templarLevel / 3));
  }

  /**
   * Calculate maximum faith feedback threshold
   */
  export function calculateMaxFaithFeedback(
    templarLevel: number,
    wisdomModifier: number
  ): number {
    return 10 + templarLevel + wisdomModifier;
  }

  /**
   * Calculate RC cost for casting a spell at a given level
   */
  export function calculateRcCost(
    miracle: TemplarMiracle,
    castingLevel: number
  ): number {
    const levelDifference = Math.max(0, castingLevel - miracle.level);
    return miracle.rcCost + levelDifference * miracle.rcScaling;
  }

  /**
   * Calculate faith feedback generation for a spell
   */
  export function calculateFaithFeedback(
    miracle: TemplarMiracle,
    castingLevel: number,
    overchanneled: boolean
  ): number {
    let baseFeedback = miracle.baseFaithFeedback;

    // Higher level casting generates more feedback
    const levelDifference = Math.max(0, castingLevel - miracle.level);
    baseFeedback += levelDifference;

    // Overchanneling doubles faith feedback
    if (overchanneled) {
      baseFeedback *= 2;
    }

    return baseFeedback;
  }

  /**
   * Calculate resonance harmony bonus
   */
  export function calculateHarmonyBonus(
    currentHarmony: number,
    spellResonance: ResonanceType,
    recentCastings: ResonanceType[]
  ): number {
    // Count recent castings of the same resonance type
    const sameTypeCount = recentCastings.filter(
      type => type === spellResonance
    ).length;

    // Harmony bonus increases with consecutive castings of the same type
    let harmonyBonus = Math.min(3, sameTypeCount);

    // Current harmony level provides additional bonus
    harmonyBonus += Math.floor(currentHarmony / 5);

    return Math.max(0, harmonyBonus);
  }

  /**
   * Update resonance harmony after casting
   */
  export function updateResonanceHarmony(
    currentHarmony: number,
    spellResonance: ResonanceType,
    recentCastings: ResonanceType[],
    successful: boolean
  ): number {
    if (!successful) {
      // Failed castings reduce harmony
      return Math.max(0, currentHarmony - 2);
    }

    // Successful castings of varied types increase harmony
    const uniqueTypes = new Set([...recentCastings, spellResonance]).size;
    const harmonyIncrease = Math.min(2, uniqueTypes - 1);

    return Math.min(20, currentHarmony + harmonyIncrease);
  }

  /**
   * Check if a Templar can cast a specific miracle
   */
  export function canCastMiracle(
    data: TemplarSpellcastingData,
    miracle: TemplarMiracle,
    castingLevel: number,
    useOverchannel: boolean = false
  ): { canCast: boolean; reasons: string[] } {
    const reasons: string[] = [];

    // Check RC availability
    const rcCost = calculateRcCost(miracle, castingLevel);
    if (data.resonanceCharges.current < rcCost) {
      reasons.push(
        `Insufficient RC: need ${rcCost}, have ${data.resonanceCharges.current}`
      );
    }

    // Check Overchannel availability
    if (useOverchannel) {
      if (!miracle.canOverchannel) {
        reasons.push('This miracle cannot be Overchanneled');
      } else if (data.overchannelUses <= 0) {
        reasons.push('No Overchannel uses remaining');
      }
    }

    // Check faith feedback capacity
    const faithFeedbackGenerated = calculateFaithFeedback(
      miracle,
      castingLevel,
      useOverchannel
    );
    const newFeedbackTotal = data.faithFeedback + faithFeedbackGenerated;
    if (newFeedbackTotal > data.maxFaithFeedback) {
      reasons.push(
        `Would exceed maximum faith feedback (${newFeedbackTotal}/${data.maxFaithFeedback})`
      );
    }

    return {
      canCast: reasons.length === 0,
      reasons,
    };
  }

  /**
   * Cast a Templar miracle
   */
  export function castMiracle(
    data: TemplarSpellcastingData,
    miracle: TemplarMiracle,
    castingLevel: number,
    useOverchannel: boolean = false,
    recentCastings: ResonanceType[] = []
  ): TemplarCastingResult {
    const canCastCheck = canCastMiracle(
      data,
      miracle,
      castingLevel,
      useOverchannel
    );

    if (!canCastCheck.canCast) {
      return {
        success: false,
        rcCost: 0,
        faithFeedbackGenerated: 0,
        heatGenerated: 0,
        overchanneled: false,
        harmonyBonus: 0,
        errors: canCastCheck.reasons,
      };
    }

    const rcCost = calculateRcCost(miracle, castingLevel);
    const faithFeedbackGenerated = calculateFaithFeedback(
      miracle,
      castingLevel,
      useOverchannel
    );
    const harmonyBonus = calculateHarmonyBonus(
      data.resonanceHarmony,
      miracle.resonanceType,
      recentCastings
    );

    // Heat generation is lower for Templars but increases with faith feedback
    const heatGenerated = Math.max(1, Math.floor(faithFeedbackGenerated / 2));

    // Create updated data
    const updatedData: TemplarSpellcastingData = {
      ...data,
      resonanceCharges: {
        ...data.resonanceCharges,
        current: data.resonanceCharges.current - rcCost,
      },
      faithFeedback: Math.min(
        data.maxFaithFeedback,
        data.faithFeedback + faithFeedbackGenerated
      ),
      heatPoints: HeatPointUtils.addHeatPoints(
        data.heatPoints,
        heatGenerated,
        data.maxHeatPoints
      ),
      overchannelUses: useOverchannel
        ? data.overchannelUses - 1
        : data.overchannelUses,
      resonanceHarmony: updateResonanceHarmony(
        data.resonanceHarmony,
        miracle.resonanceType,
        recentCastings,
        true
      ),
    };

    return {
      success: true,
      rcCost,
      faithFeedbackGenerated,
      heatGenerated,
      overchanneled: useOverchannel,
      harmonyBonus,
      updatedData,
    };
  }

  /**
   * Restore Overchannel uses (typically on long rest)
   */
  export function restoreOverchannelUses(
    data: TemplarSpellcastingData
  ): TemplarSpellcastingData {
    return {
      ...data,
      overchannelUses: data.maxOverchannelUses,
    };
  }

  /**
   * Reduce faith feedback (typically on rest or meditation)
   */
  export function reduceFaithFeedback(
    data: TemplarSpellcastingData,
    reduction: number
  ): TemplarSpellcastingData {
    return {
      ...data,
      faithFeedback: Math.max(0, data.faithFeedback - reduction),
    };
  }

  /**
   * Calculate faith feedback penalties
   */
  export function getFaithFeedbackPenalties(
    currentFeedback: number,
    maxFeedback: number
  ): {
    spellAttackPenalty: number;
    spellDcPenalty: number;
    description: string;
  } {
    const feedbackRatio = currentFeedback / maxFeedback;

    if (feedbackRatio >= 1.0) {
      return {
        spellAttackPenalty: -4,
        spellDcPenalty: -4,
        description:
          'Severe faith feedback: major penalties to all spellcasting',
      };
    } else if (feedbackRatio >= 0.75) {
      return {
        spellAttackPenalty: -2,
        spellDcPenalty: -2,
        description: 'High faith feedback: penalties to spellcasting',
      };
    } else if (feedbackRatio >= 0.5) {
      return {
        spellAttackPenalty: -1,
        spellDcPenalty: -1,
        description: 'Moderate faith feedback: minor penalties to spellcasting',
      };
    }

    return {
      spellAttackPenalty: 0,
      spellDcPenalty: 0,
      description: 'Faith feedback within acceptable limits',
    };
  }

  /**
   * Validate Templar spellcasting data
   */
  export function validateTemplarData(
    data: TemplarSpellcastingData
  ): ValidationResult<TemplarSpellcastingData> {
    const errors: ValidationError[] = [];

    // Validate overchannel uses
    if (!Number.isInteger(data.overchannelUses) || data.overchannelUses < 0) {
      errors.push({
        field: 'overchannelUses',
        message: 'Overchannel uses must be a non-negative integer',
        code: 'INVALID_OVERCHANNEL_USES',
      });
    }

    if (
      !Number.isInteger(data.maxOverchannelUses) ||
      data.maxOverchannelUses < 0
    ) {
      errors.push({
        field: 'maxOverchannelUses',
        message: 'Max overchannel uses must be a non-negative integer',
        code: 'INVALID_MAX_OVERCHANNEL_USES',
      });
    }

    if (data.overchannelUses > data.maxOverchannelUses) {
      errors.push({
        field: 'overchannelUses',
        message: 'Current overchannel uses cannot exceed maximum',
        code: 'OVERCHANNEL_USES_EXCEEDS_MAX',
      });
    }

    // Validate faith feedback
    if (!Number.isInteger(data.faithFeedback) || data.faithFeedback < 0) {
      errors.push({
        field: 'faithFeedback',
        message: 'Faith feedback must be a non-negative integer',
        code: 'INVALID_FAITH_FEEDBACK',
      });
    }

    if (!Number.isInteger(data.maxFaithFeedback) || data.maxFaithFeedback < 0) {
      errors.push({
        field: 'maxFaithFeedback',
        message: 'Max faith feedback must be a non-negative integer',
        code: 'INVALID_MAX_FAITH_FEEDBACK',
      });
    }

    // Validate resonance harmony
    if (
      !Number.isInteger(data.resonanceHarmony) ||
      data.resonanceHarmony < 0 ||
      data.resonanceHarmony > 20
    ) {
      errors.push({
        field: 'resonanceHarmony',
        message: 'Resonance harmony must be an integer between 0 and 20',
        code: 'INVALID_RESONANCE_HARMONY',
      });
    }

    // Validate miracles
    data.knownMiracles.forEach((miracle, index) => {
      if (!Number.isInteger(miracle.rcCost) || miracle.rcCost < 0) {
        errors.push({
          field: `knownMiracles[${index}].rcCost`,
          message: 'RC cost must be a non-negative integer',
          code: 'INVALID_RC_COST',
        });
      }

      if (!Number.isInteger(miracle.rcScaling) || miracle.rcScaling < 0) {
        errors.push({
          field: `knownMiracles[${index}].rcScaling`,
          message: 'RC scaling must be a non-negative integer',
          code: 'INVALID_RC_SCALING',
        });
      }

      if (
        !Number.isInteger(miracle.baseFaithFeedback) ||
        miracle.baseFaithFeedback < 0
      ) {
        errors.push({
          field: `knownMiracles[${index}].baseFaithFeedback`,
          message: 'Base faith feedback must be a non-negative integer',
          code: 'INVALID_FAITH_FEEDBACK_GENERATION',
        });
      }

      const validResonanceTypes: ResonanceType[] = [
        'divine',
        'harmonic',
        'protective',
        'restorative',
        'righteous',
        'revelatory',
      ];
      if (!validResonanceTypes.includes(miracle.resonanceType)) {
        errors.push({
          field: `knownMiracles[${index}].resonanceType`,
          message: 'Invalid resonance type',
          code: 'INVALID_RESONANCE_TYPE',
        });
      }
    });

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data };
  }

  /**
   * Create a new Templar miracle
   */
  export function createTemplarMiracle(
    baseSpell: KnownSpell,
    rcCost: number,
    rcScaling: number = 1,
    baseFaithFeedback: number = 1,
    resonanceType: ResonanceType,
    canOverchannel: boolean = true,
    overchannelEffects?: string
  ): TemplarMiracle {
    return {
      ...baseSpell,
      rcCost,
      rcScaling,
      baseFaithFeedback,
      resonanceType,
      canOverchannel,
      overchannelEffects,
    };
  }
}
