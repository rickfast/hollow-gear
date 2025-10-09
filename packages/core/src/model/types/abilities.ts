/**
 * Ability score types and related enums for D&D 5e mechanics
 */

import type { AbilityScore, ValidationResult } from './common.js';

/**
 * Represents a complete ability score with all modifiers
 */
export interface AbilityScoreData {
  /** Base ability score (typically 8-15 at character creation) */
  base: number;
  /** Racial bonus to the ability score */
  racial: number;
  /** Enhancement bonus (from magic items, etc.) */
  enhancement: number;
  /** Temporary bonus/penalty */
  temporary: number;
  /** Calculated modifier (derived from total score) */
  readonly modifier: number;
}

/**
 * Complete set of ability scores for a character
 */
export interface AbilityScores {
  strength: AbilityScoreData;
  dexterity: AbilityScoreData;
  constitution: AbilityScoreData;
  intelligence: AbilityScoreData;
  wisdom: AbilityScoreData;
  charisma: AbilityScoreData;
}

/**
 * Represents an ability score increase (from species, feats, etc.)
 */
export interface AbilityScoreIncrease {
  /** The ability score to increase */
  ability: AbilityScore;
  /** The amount to increase by */
  increase: number;
}

/**
 * Utility functions for ability score calculations
 */
export namespace AbilityScoreUtils {
  /**
   * Calculate the total ability score from all components
   */
  export function calculateTotal(
    score: Omit<AbilityScoreData, 'modifier'>
  ): number {
    return score.base + score.racial + score.enhancement + score.temporary;
  }

  /**
   * Calculate the ability modifier from a total score
   * Uses standard D&D 5e formula: (score - 10) / 2, rounded down
   */
  export function calculateModifier(totalScore: number): number {
    return Math.floor((totalScore - 10) / 2);
  }

  /**
   * Create a complete AbilityScoreData with calculated modifier
   */
  export function createAbilityScore(
    base: number,
    racial: number = 0,
    enhancement: number = 0,
    temporary: number = 0
  ): AbilityScoreData {
    const total = base + racial + enhancement + temporary;
    return {
      base,
      racial,
      enhancement,
      temporary,
      modifier: calculateModifier(total),
    };
  }

  /**
   * Validate an ability score value
   */
  export function validateAbilityScore(
    score: number,
    context: string
  ): ValidationResult<number> {
    const errors = [];

    if (!Number.isInteger(score)) {
      errors.push({
        field: context,
        message: 'Ability score must be an integer',
        code: 'INVALID_TYPE',
      });
    }

    if (score < 1) {
      errors.push({
        field: context,
        message: 'Ability score cannot be less than 1',
        code: 'SCORE_TOO_LOW',
      });
    }

    if (score > 30) {
      errors.push({
        field: context,
        message: 'Ability score cannot exceed 30',
        code: 'SCORE_TOO_HIGH',
      });
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: score };
  }

  /**
   * Get the ability score name as a formatted string
   */
  export function getAbilityName(ability: AbilityScore): string {
    const names: Record<AbilityScore, string> = {
      strength: 'Strength',
      dexterity: 'Dexterity',
      constitution: 'Constitution',
      intelligence: 'Intelligence',
      wisdom: 'Wisdom',
      charisma: 'Charisma',
    };
    return names[ability];
  }

  /**
   * Get the three-letter abbreviation for an ability score
   */
  export function getAbilityAbbreviation(ability: AbilityScore): string {
    const abbreviations: Record<AbilityScore, string> = {
      strength: 'STR',
      dexterity: 'DEX',
      constitution: 'CON',
      intelligence: 'INT',
      wisdom: 'WIS',
      charisma: 'CHA',
    };
    return abbreviations[ability];
  }
}
