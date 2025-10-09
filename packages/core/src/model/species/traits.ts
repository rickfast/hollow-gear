/**
 * Etherborne species traits and type definitions
 * Core interfaces and types for the seven Etherborne species
 */

import type {
  AbilityScore,
  DieType,
  ValidationResult,
} from '../types/common.js';
import type { AbilityScoreIncrease } from '../types/abilities.js';

/**
 * Union type representing all seven Etherborne species
 */
export type EtherborneSpecies =
  | 'aqualoth' // Axolotl - Amphibious scholars and bio-mechanical engineers
  | 'vulmir' // Fox - Cunning illusionists and saboteurs
  | 'rendai' // Red Panda - Inventors, mechanics, and cheerful scavengers
  | 'karnathi' // Ibex - Stalwart defenders and psionic knights
  | 'tharn' // Elk - Nomadic guardians of the wild gears
  | 'skellin' // Gecko - Wall-crawling scouts and infiltrators
  | 'avenar'; // Avian - Scholars of the skies, calm and calculating

/**
 * Movement speeds for different types of locomotion
 */
export interface MovementSpeeds {
  /** Base walking speed in feet */
  walk: number;
  /** Swimming speed in feet (0 if cannot swim) */
  swim: number;
  /** Climbing speed in feet (0 if cannot climb) */
  climb: number;
  /** Flying speed in feet (0 if cannot fly) */
  fly: number;
  /** Special movement notes or restrictions */
  restrictions?: string[];
}

/**
 * Represents a special ability granted by a species
 */
export interface SpecialAbility {
  /** Unique identifier for the ability */
  id: string;
  /** Display name of the ability */
  name: string;
  /** Detailed description of the ability's effects */
  description: string;
  /** Usage limitations (per short rest, per long rest, etc.) */
  usage?: AbilityUsage;
  /** Mechanical effects of the ability */
  mechanics?: AbilityMechanics;
}

/**
 * Usage limitations for special abilities
 */
export interface AbilityUsage {
  /** Type of rest required to recharge */
  rechargeType: 'short' | 'long' | 'none';
  /** Number of uses per recharge period */
  usesPerRecharge: number;
  /** Additional usage conditions */
  conditions?: string[];
}

/**
 * Mechanical effects of special abilities
 */
export interface AbilityMechanics {
  /** Damage dice if the ability deals damage */
  damage?: {
    dice: DieType;
    count: number;
    type: string;
  };
  /** Bonus to specific checks or saves */
  bonus?: {
    type: 'advantage' | 'proficiency' | 'flat';
    value?: number;
    applies_to: string[];
  };
  /** Range or area of effect */
  range?: {
    type: 'self' | 'touch' | 'ranged' | 'area';
    distance?: number;
    area?: string;
  };
}

/**
 * Language proficiencies for a species
 */
export type Language =
  | 'common'
  | 'aquan'
  | 'avenari'
  | 'guilders-cant'
  | 'holy-dialect'
  | 'sylvan'
  | 'undertrade'
  | 'street-cant';

/**
 * Shared traits that all Etherborne possess
 */
export interface EtherborneTraits {
  /** Can sense active psionic effects or Aether machinery within 30 ft */
  aetherSensitivity: boolean;
  /** Constructs and automatons regard you as neutral unless provoked */
  machineEmpathy: boolean;
  /** Once per long rest, reroll a failed save against exhaustion, poison, or psionic feedback */
  instinctiveHarmony: boolean;
}

/**
 * Complete trait package for an Etherborne species
 */
export interface SpeciesTraits {
  /** The species this trait package belongs to */
  species: EtherborneSpecies;
  /** Ability score increases granted by this species */
  abilityScoreIncrease: AbilityScoreIncrease[];
  /** Movement speeds for this species */
  speed: MovementSpeeds;
  /** Special abilities unique to this species */
  specialAbilities: SpecialAbility[];
  /** Languages known by this species */
  languages: Language[];
  /** Shared Etherborne traits (always true for all species) */
  etherborneTraits: EtherborneTraits;
  /** Additional flavor text and cultural information */
  description: {
    appearance: string;
    culture: string;
    personality: string;
  };
}

/**
 * Utility functions for working with species traits
 */
export namespace SpeciesTraitsUtils {
  /**
   * Get the display name for a species
   */
  export function getSpeciesDisplayName(species: EtherborneSpecies): string {
    const names: Record<EtherborneSpecies, string> = {
      aqualoth: 'Aqualoth',
      vulmir: 'Vulmir',
      rendai: 'Rendai',
      karnathi: 'Karnathi',
      tharn: 'Tharn',
      skellin: 'Skellin',
      avenar: 'Avenar',
    };
    return names[species];
  }

  /**
   * Get the animal type for a species
   */
  export function getSpeciesAnimalType(species: EtherborneSpecies): string {
    const types: Record<EtherborneSpecies, string> = {
      aqualoth: 'Axolotl',
      vulmir: 'Fox',
      rendai: 'Red Panda',
      karnathi: 'Ibex',
      tharn: 'Elk',
      skellin: 'Gecko',
      avenar: 'Avian',
    };
    return types[species];
  }

  /**
   * Get a brief description for a species
   */
  export function getSpeciesBrief(species: EtherborneSpecies): string {
    const briefs: Record<EtherborneSpecies, string> = {
      aqualoth:
        'Amphibious scholars and bio-mechanical engineers of the flooded ruins',
      vulmir:
        'Cunning illusionists and saboteurs, weaving psionics and trickery alike',
      rendai:
        'Inventors, mechanics, and cheerful scavengers who view machines as art',
      karnathi:
        'Stalwart defenders and psionic knights who blend faith and machinery',
      tharn:
        "Nomadic guardians of the wild gears — defenders of nature's mechanical heart",
      skellin:
        'Wall-crawling scouts and infiltrators with reflexes tuned to survival',
      avenar:
        'Scholars of the skies — calm, calculating, and eternally curious',
    };
    return briefs[species];
  }

  /**
   * Validate a species traits object
   */
  export function validateSpeciesTraits(
    traits: SpeciesTraits
  ): ValidationResult<SpeciesTraits> {
    const errors = [];

    // Validate ability score increases
    if (
      !traits.abilityScoreIncrease ||
      traits.abilityScoreIncrease.length === 0
    ) {
      errors.push({
        field: 'abilityScoreIncrease',
        message: 'Species must have at least one ability score increase',
        code: 'MISSING_ABILITY_INCREASES',
      });
    }

    // Validate movement speeds
    if (traits.speed.walk <= 0) {
      errors.push({
        field: 'speed.walk',
        message: 'Walking speed must be greater than 0',
        code: 'INVALID_WALK_SPEED',
      });
    }

    // Validate languages
    if (!traits.languages || traits.languages.length === 0) {
      errors.push({
        field: 'languages',
        message: 'Species must know at least one language',
        code: 'MISSING_LANGUAGES',
      });
    }

    // All Etherborne must have Common
    if (!traits.languages.includes('common')) {
      errors.push({
        field: 'languages',
        message: 'All Etherborne must know Common',
        code: 'MISSING_COMMON_LANGUAGE',
      });
    }

    // Validate Etherborne traits are present
    if (
      !traits.etherborneTraits.aetherSensitivity ||
      !traits.etherborneTraits.machineEmpathy ||
      !traits.etherborneTraits.instinctiveHarmony
    ) {
      errors.push({
        field: 'etherborneTraits',
        message: 'All Etherborne traits must be present and true',
        code: 'MISSING_ETHERBORNE_TRAITS',
      });
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: traits };
  }

  /**
   * Create the standard Etherborne traits object
   */
  export function createEtherborneTraits(): EtherborneTraits {
    return {
      aetherSensitivity: true,
      machineEmpathy: true,
      instinctiveHarmony: true,
    };
  }

  /**
   * Check if a species has a specific special ability
   */
  export function hasSpecialAbility(
    traits: SpeciesTraits,
    abilityId: string
  ): boolean {
    return traits.specialAbilities.some(ability => ability.id === abilityId);
  }

  /**
   * Get a specific special ability by ID
   */
  export function getSpecialAbility(
    traits: SpeciesTraits,
    abilityId: string
  ): SpecialAbility | undefined {
    return traits.specialAbilities.find(ability => ability.id === abilityId);
  }

  /**
   * Calculate total ability score increases for a species
   */
  export function getTotalAbilityIncreases(traits: SpeciesTraits): number {
    return traits.abilityScoreIncrease.reduce(
      (total, increase) => total + increase.increase,
      0
    );
  }
}
