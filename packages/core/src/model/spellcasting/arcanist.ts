/**
 * Arcanist spellcasting system (Aether Formulae) for Hollow Gear TTRPG
 * Implements the unique Arcanist magic system with AFP, Overclocking, and Equilibrium Tiers
 */

import type { ResourcePool } from '../types/resources.js';
import type { ValidationResult, ValidationError } from '../types/common.js';
import type { BaseSpellcastingData, KnownSpell } from './shared.js';
import { HeatPointUtils } from './shared.js';

/**
 * Arcanist-specific spellcasting data
 */
export interface ArcanistSpellcastingData extends BaseSpellcastingData {
  type: 'arcanist';
  /** Aether Flux Points used for spellcasting */
  aetherFluxPoints: ResourcePool;
  /** Current Equilibrium Tier (determines maximum spell level) */
  equilibriumTier: number;
  /** Number of Overclocking uses remaining this day */
  overclockUses: number;
  /** Maximum Overclocking uses per day */
  maxOverclockUses: number;
  /** Current Overclocking heat generation multiplier */
  overclockMultiplier: number;
  /** Known Aether Formulae (spells) */
  knownFormulae: ArcanistFormula[];
}

/**
 * An Aether Formula known by an Arcanist
 * Extends the base KnownSpell with Arcanist-specific properties
 */
export interface ArcanistFormula extends KnownSpell {
  /** AFP cost to cast at base level */
  afpCost: number;
  /** Additional AFP cost per spell level above base */
  afpScaling: number;
  /** Heat generation when cast normally */
  baseHeatGeneration: number;
  /** Whether this formula can be Overclocked */
  canOverclock: boolean;
  /** Overclocking effects description */
  overclockEffects?: string;
}

/**
 * Result of casting an Arcanist spell
 */
export interface ArcanistCastingResult {
  /** Whether the spell was successfully cast */
  success: boolean;
  /** AFP cost of the casting */
  afpCost: number;
  /** Heat points generated */
  heatGenerated: number;
  /** Whether Overclocking was used */
  overclocked: boolean;
  /** Any error messages */
  errors?: string[];
  /** Updated spellcasting data after casting */
  updatedData?: ArcanistSpellcastingData;
}

/**
 * Arcanist spellcasting utilities and calculations
 */
export namespace ArcanistUtils {
  /**
   * Calculate Equilibrium Tier based on Arcanist level
   */
  export function calculateEquilibriumTier(arcanistLevel: number): number {
    if (arcanistLevel >= 17) return 9;
    if (arcanistLevel >= 15) return 8;
    if (arcanistLevel >= 13) return 7;
    if (arcanistLevel >= 11) return 6;
    if (arcanistLevel >= 9) return 5;
    if (arcanistLevel >= 7) return 4;
    if (arcanistLevel >= 5) return 3;
    if (arcanistLevel >= 3) return 2;
    if (arcanistLevel >= 1) return 1;
    return 0;
  }

  /**
   * Calculate maximum Overclocking uses per day
   */
  export function calculateMaxOverclockUses(arcanistLevel: number): number {
    return Math.max(1, Math.floor(arcanistLevel / 4));
  }

  /**
   * Calculate AFP cost for casting a spell at a given level
   */
  export function calculateAfpCost(
    formula: ArcanistFormula,
    castingLevel: number
  ): number {
    const levelDifference = Math.max(0, castingLevel - formula.level);
    return formula.afpCost + levelDifference * formula.afpScaling;
  }

  /**
   * Calculate heat generation for a spell
   */
  export function calculateHeatGeneration(
    formula: ArcanistFormula,
    castingLevel: number,
    overclocked: boolean,
    overclockMultiplier: number
  ): number {
    let baseHeat = formula.baseHeatGeneration;

    // Higher level casting generates more heat
    const levelDifference = Math.max(0, castingLevel - formula.level);
    baseHeat += levelDifference;

    // Overclocking multiplies heat generation
    if (overclocked) {
      baseHeat = Math.floor(baseHeat * overclockMultiplier);
    }

    return baseHeat;
  }

  /**
   * Check if an Arcanist can cast a specific formula
   */
  export function canCastFormula(
    data: ArcanistSpellcastingData,
    formula: ArcanistFormula,
    castingLevel: number,
    useOverclock: boolean = false
  ): { canCast: boolean; reasons: string[] } {
    const reasons: string[] = [];

    // Check if spell level is within Equilibrium Tier
    if (castingLevel > data.equilibriumTier) {
      reasons.push(
        `Spell level ${castingLevel} exceeds Equilibrium Tier ${data.equilibriumTier}`
      );
    }

    // Check AFP availability
    const afpCost = calculateAfpCost(formula, castingLevel);
    if (data.aetherFluxPoints.current < afpCost) {
      reasons.push(
        `Insufficient AFP: need ${afpCost}, have ${data.aetherFluxPoints.current}`
      );
    }

    // Check Overclocking availability
    if (useOverclock) {
      if (!formula.canOverclock) {
        reasons.push('This formula cannot be Overclocked');
      } else if (data.overclockUses <= 0) {
        reasons.push('No Overclocking uses remaining');
      }
    }

    // Check heat capacity
    const heatGenerated = calculateHeatGeneration(
      formula,
      castingLevel,
      useOverclock,
      data.overclockMultiplier
    );
    const newHeatTotal = data.heatPoints + heatGenerated;
    if (newHeatTotal > data.maxHeatPoints) {
      reasons.push(
        `Would exceed maximum heat points (${newHeatTotal}/${data.maxHeatPoints})`
      );
    }

    return {
      canCast: reasons.length === 0,
      reasons,
    };
  }

  /**
   * Cast an Arcanist formula
   */
  export function castFormula(
    data: ArcanistSpellcastingData,
    formula: ArcanistFormula,
    castingLevel: number,
    useOverclock: boolean = false
  ): ArcanistCastingResult {
    const canCastCheck = canCastFormula(
      data,
      formula,
      castingLevel,
      useOverclock
    );

    if (!canCastCheck.canCast) {
      return {
        success: false,
        afpCost: 0,
        heatGenerated: 0,
        overclocked: false,
        errors: canCastCheck.reasons,
      };
    }

    const afpCost = calculateAfpCost(formula, castingLevel);
    const heatGenerated = calculateHeatGeneration(
      formula,
      castingLevel,
      useOverclock,
      data.overclockMultiplier
    );

    // Create updated data
    const updatedData: ArcanistSpellcastingData = {
      ...data,
      aetherFluxPoints: {
        ...data.aetherFluxPoints,
        current: data.aetherFluxPoints.current - afpCost,
      },
      heatPoints: HeatPointUtils.addHeatPoints(
        data.heatPoints,
        heatGenerated,
        data.maxHeatPoints
      ),
      overclockUses: useOverclock ? data.overclockUses - 1 : data.overclockUses,
    };

    return {
      success: true,
      afpCost,
      heatGenerated,
      overclocked: useOverclock,
      updatedData,
    };
  }

  /**
   * Restore Overclocking uses (typically on long rest)
   */
  export function restoreOverclockUses(
    data: ArcanistSpellcastingData
  ): ArcanistSpellcastingData {
    return {
      ...data,
      overclockUses: data.maxOverclockUses,
    };
  }

  /**
   * Calculate Overclocking heat multiplier based on character level and abilities
   */
  export function calculateOverclockMultiplier(
    arcanistLevel: number,
    intelligenceModifier: number
  ): number {
    // Base multiplier starts at 2.0 and decreases with level and intelligence
    let multiplier = 2.0;

    // Reduce by 0.1 per 2 levels
    multiplier -= Math.floor(arcanistLevel / 2) * 0.1;

    // Reduce by intelligence modifier * 0.05
    multiplier -= intelligenceModifier * 0.05;

    // Minimum multiplier of 1.2
    return Math.max(1.2, multiplier);
  }

  /**
   * Validate Arcanist spellcasting data
   */
  export function validateArcanistData(
    data: ArcanistSpellcastingData
  ): ValidationResult<ArcanistSpellcastingData> {
    const errors: ValidationError[] = [];

    // Validate equilibrium tier
    if (
      !Number.isInteger(data.equilibriumTier) ||
      data.equilibriumTier < 0 ||
      data.equilibriumTier > 9
    ) {
      errors.push({
        field: 'equilibriumTier',
        message: 'Equilibrium Tier must be an integer between 0 and 9',
        code: 'INVALID_EQUILIBRIUM_TIER',
      });
    }

    // Validate overclock uses
    if (!Number.isInteger(data.overclockUses) || data.overclockUses < 0) {
      errors.push({
        field: 'overclockUses',
        message: 'Overclock uses must be a non-negative integer',
        code: 'INVALID_OVERCLOCK_USES',
      });
    }

    if (!Number.isInteger(data.maxOverclockUses) || data.maxOverclockUses < 0) {
      errors.push({
        field: 'maxOverclockUses',
        message: 'Max overclock uses must be a non-negative integer',
        code: 'INVALID_MAX_OVERCLOCK_USES',
      });
    }

    if (data.overclockUses > data.maxOverclockUses) {
      errors.push({
        field: 'overclockUses',
        message: 'Current overclock uses cannot exceed maximum',
        code: 'OVERCLOCK_USES_EXCEEDS_MAX',
      });
    }

    // Validate overclock multiplier
    if (
      typeof data.overclockMultiplier !== 'number' ||
      data.overclockMultiplier < 1.0
    ) {
      errors.push({
        field: 'overclockMultiplier',
        message: 'Overclock multiplier must be a number >= 1.0',
        code: 'INVALID_OVERCLOCK_MULTIPLIER',
      });
    }

    // Validate formulae
    data.knownFormulae.forEach((formula, index) => {
      if (!Number.isInteger(formula.afpCost) || formula.afpCost < 0) {
        errors.push({
          field: `knownFormulae[${index}].afpCost`,
          message: 'AFP cost must be a non-negative integer',
          code: 'INVALID_AFP_COST',
        });
      }

      if (!Number.isInteger(formula.afpScaling) || formula.afpScaling < 0) {
        errors.push({
          field: `knownFormulae[${index}].afpScaling`,
          message: 'AFP scaling must be a non-negative integer',
          code: 'INVALID_AFP_SCALING',
        });
      }

      if (
        !Number.isInteger(formula.baseHeatGeneration) ||
        formula.baseHeatGeneration < 0
      ) {
        errors.push({
          field: `knownFormulae[${index}].baseHeatGeneration`,
          message: 'Base heat generation must be a non-negative integer',
          code: 'INVALID_HEAT_GENERATION',
        });
      }
    });

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data };
  }

  /**
   * Create a new Arcanist formula
   */
  export function createArcanistFormula(
    baseSpell: KnownSpell,
    afpCost: number,
    afpScaling: number = 1,
    baseHeatGeneration: number = 1,
    canOverclock: boolean = true,
    overclockEffects?: string
  ): ArcanistFormula {
    return {
      ...baseSpell,
      afpCost,
      afpScaling,
      baseHeatGeneration,
      canOverclock,
      overclockEffects,
    };
  }
}
