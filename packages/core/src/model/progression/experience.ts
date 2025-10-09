/**
 * Experience and leveling system for Hollow Gear characters
 *
 * This module handles experience point tracking, level advancement calculations,
 * and validation for character progression in the Hollow Gear TTRPG system.
 */

import type { ValidationResult, ValidationError } from '../types/common.js';
import {
  validationSuccess,
  validationFailure,
  validationError,
} from '../types/common.js';

/**
 * Experience data for a character
 */
export interface ExperienceData {
  /** Current experience points */
  currentXP: number;
  /** Current character level (1-20) */
  currentLevel: number;
  /** Experience points required for next level */
  nextLevelXP: number;
  /** Experience points required for current level */
  currentLevelXP: number;
  /** Total experience points needed to reach maximum level */
  maxLevelXP: number;
}

/**
 * Level advancement information
 */
export interface LevelAdvancement {
  /** Previous level */
  fromLevel: number;
  /** New level */
  toLevel: number;
  /** Experience points gained */
  xpGained: number;
  /** Whether this advancement is valid */
  isValid: boolean;
  /** Any validation errors */
  errors?: ValidationError[];
}

/**
 * Level-up choice tracking for character advancement
 */
export interface LevelUpChoices {
  /** Level this choice applies to */
  level: number;
  /** Hit points gained (rolled or average) */
  hitPointsGained: number;
  /** Whether hit points were rolled or taken as average */
  hitPointMethod: 'rolled' | 'average';
  /** Ability score improvement choices (if applicable) */
  abilityScoreImprovements?: AbilityScoreImprovement[];
  /** Feat selected (if applicable) */
  featSelected?: string;
  /** Class features selected (if choices available) */
  classFeatureChoices?: ClassFeatureChoice[];
  /** Spells learned (for spellcasters) */
  spellsLearned?: string[];
  /** Skills gained (if applicable) */
  skillsGained?: string[];
  /** Other choices made during level-up */
  otherChoices?: Record<string, unknown>;
}

/**
 * Ability score improvement choice
 */
export interface AbilityScoreImprovement {
  /** Ability score to improve */
  ability:
    | 'strength'
    | 'dexterity'
    | 'constitution'
    | 'intelligence'
    | 'wisdom'
    | 'charisma';
  /** Amount to improve (typically 1) */
  improvement: number;
}

/**
 * Class feature choice made during level-up
 */
export interface ClassFeatureChoice {
  /** Feature identifier */
  featureId: string;
  /** Choice made (e.g., archetype selection, spell selection) */
  choice: string;
  /** Additional data for the choice */
  data?: Record<string, unknown>;
}

/**
 * Standard D&D 5e experience point thresholds for each level
 * Index 0 = Level 1, Index 19 = Level 20
 */
export const EXPERIENCE_THRESHOLDS: readonly number[] = [
  0, // Level 1
  300, // Level 2
  900, // Level 3
  2700, // Level 4
  6500, // Level 5
  14000, // Level 6
  23000, // Level 7
  34000, // Level 8
  48000, // Level 9
  64000, // Level 10
  85000, // Level 11
  100000, // Level 12
  120000, // Level 13
  140000, // Level 14
  165000, // Level 15
  195000, // Level 16
  225000, // Level 17
  265000, // Level 18
  305000, // Level 19
  355000, // Level 20
] as const;

/**
 * Maximum character level
 */
export const MAX_LEVEL = 20;

/**
 * Minimum character level
 */
export const MIN_LEVEL = 1;

/**
 * Calculate the level for a given amount of experience points
 */
export function calculateLevelFromXP(xp: number): number {
  if (xp < 0) return MIN_LEVEL;

  for (let level = MAX_LEVEL; level >= MIN_LEVEL; level--) {
    if (xp >= EXPERIENCE_THRESHOLDS[level - 1]!) {
      return level;
    }
  }

  return MIN_LEVEL;
}

/**
 * Get the experience points required for a specific level
 */
export function getXPForLevel(level: number): number {
  if (level < MIN_LEVEL) return EXPERIENCE_THRESHOLDS[0]!;
  if (level > MAX_LEVEL) return EXPERIENCE_THRESHOLDS[MAX_LEVEL - 1]!;

  return EXPERIENCE_THRESHOLDS[level - 1]!;
}

/**
 * Get the experience points required for the next level
 */
export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= MAX_LEVEL) {
    return EXPERIENCE_THRESHOLDS[MAX_LEVEL - 1]!;
  }

  return getXPForLevel(currentLevel + 1);
}

/**
 * Calculate experience points needed to reach the next level
 */
export function getXPToNextLevel(
  currentXP: number,
  currentLevel: number
): number {
  if (currentLevel >= MAX_LEVEL) return 0;

  const nextLevelXP = getXPForNextLevel(currentLevel);
  return Math.max(0, nextLevelXP - currentXP);
}

/**
 * Create experience data from current XP
 */
export function createExperienceData(currentXP: number): ExperienceData {
  const currentLevel = calculateLevelFromXP(currentXP);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const maxLevelXP = EXPERIENCE_THRESHOLDS[MAX_LEVEL - 1]!;

  return {
    currentXP,
    currentLevel,
    nextLevelXP,
    currentLevelXP,
    maxLevelXP,
  };
}

/**
 * Validate experience points
 */
export function validateExperiencePoints(xp: number): ValidationResult<number> {
  const errors: ValidationError[] = [];

  if (xp < 0) {
    errors.push(
      validationError(
        'currentXP',
        'Experience points cannot be negative',
        'INVALID_XP_NEGATIVE'
      )
    );
  }

  if (!Number.isInteger(xp)) {
    errors.push(
      validationError(
        'currentXP',
        'Experience points must be a whole number',
        'INVALID_XP_NOT_INTEGER'
      )
    );
  }

  if (xp > EXPERIENCE_THRESHOLDS[MAX_LEVEL - 1]! * 2) {
    errors.push(
      validationError(
        'currentXP',
        `Experience points are unusually high (${xp})`,
        'WARNING_XP_VERY_HIGH',
        { maxRecommended: EXPERIENCE_THRESHOLDS[MAX_LEVEL - 1]! * 2 }
      )
    );
  }

  if (errors.length > 0) {
    return validationFailure(errors);
  }

  return validationSuccess(xp);
}

/**
 * Validate a level value
 */
export function validateLevel(level: number): ValidationResult<number> {
  const errors: ValidationError[] = [];

  if (!Number.isInteger(level)) {
    errors.push(
      validationError(
        'level',
        'Level must be a whole number',
        'INVALID_LEVEL_NOT_INTEGER'
      )
    );
  }

  if (level < MIN_LEVEL) {
    errors.push(
      validationError(
        'level',
        `Level cannot be less than ${MIN_LEVEL}`,
        'INVALID_LEVEL_TOO_LOW',
        { minLevel: MIN_LEVEL }
      )
    );
  }

  if (level > MAX_LEVEL) {
    errors.push(
      validationError(
        'level',
        `Level cannot be greater than ${MAX_LEVEL}`,
        'INVALID_LEVEL_TOO_HIGH',
        { maxLevel: MAX_LEVEL }
      )
    );
  }

  if (errors.length > 0) {
    return validationFailure(errors);
  }

  return validationSuccess(level);
}

/**
 * Validate that experience points match the claimed level
 */
export function validateXPLevelConsistency(
  xp: number,
  level: number
): ValidationResult<{ xp: number; level: number }> {
  const errors: ValidationError[] = [];

  const calculatedLevel = calculateLevelFromXP(xp);

  if (calculatedLevel !== level) {
    errors.push(
      validationError(
        'level',
        `Level ${level} does not match experience points ${xp} (should be level ${calculatedLevel})`,
        'INCONSISTENT_XP_LEVEL',
        {
          providedLevel: level,
          calculatedLevel,
          xp,
        }
      )
    );
  }

  if (errors.length > 0) {
    return validationFailure(errors);
  }

  return validationSuccess({ xp, level });
}

/**
 * Calculate level advancement from XP gain
 */
export function calculateLevelAdvancement(
  currentXP: number,
  currentLevel: number,
  xpGained: number
): LevelAdvancement {
  const errors: ValidationError[] = [];

  // Validate inputs
  if (xpGained < 0) {
    errors.push(
      validationError(
        'xpGained',
        'Experience gained cannot be negative',
        'INVALID_XP_GAIN_NEGATIVE'
      )
    );
  }

  const newXP = currentXP + xpGained;
  const newLevel = calculateLevelFromXP(newXP);

  // Check if the current level is consistent with current XP
  const expectedCurrentLevel = calculateLevelFromXP(currentXP);
  if (expectedCurrentLevel !== currentLevel) {
    errors.push(
      validationError(
        'currentLevel',
        `Current level ${currentLevel} does not match current XP ${currentXP}`,
        'INCONSISTENT_CURRENT_LEVEL'
      )
    );
  }

  return {
    fromLevel: currentLevel,
    toLevel: newLevel,
    xpGained,
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Add experience points to a character
 */
export function addExperience(
  experienceData: ExperienceData,
  xpGained: number
): ValidationResult<ExperienceData> {
  const validation = validateExperiencePoints(xpGained);
  if (!validation.success) {
    return validation;
  }

  if (xpGained < 0) {
    return validationFailure([
      validationError(
        'xpGained',
        'Cannot add negative experience points',
        'INVALID_XP_GAIN_NEGATIVE'
      ),
    ]);
  }

  const newXP = experienceData.currentXP + xpGained;
  const newExperienceData = createExperienceData(newXP);

  return validationSuccess(newExperienceData);
}

/**
 * Set experience points directly (for GM tools or character creation)
 */
export function setExperience(xp: number): ValidationResult<ExperienceData> {
  const validation = validateExperiencePoints(xp);
  if (!validation.success) {
    return validation;
  }

  const experienceData = createExperienceData(xp);
  return validationSuccess(experienceData);
}

/**
 * Check if a character can level up
 */
export function canLevelUp(experienceData: ExperienceData): boolean {
  return (
    experienceData.currentLevel < MAX_LEVEL &&
    experienceData.currentXP >= experienceData.nextLevelXP
  );
}

/**
 * Get the number of levels a character can advance
 */
export function getLevelsAvailable(experienceData: ExperienceData): number {
  const newLevel = calculateLevelFromXP(experienceData.currentXP);
  return Math.max(0, newLevel - experienceData.currentLevel);
}

/**
 * Create default level-up choices for a given level
 */
export function createDefaultLevelUpChoices(level: number): LevelUpChoices {
  return {
    level,
    hitPointsGained: 0, // Will be set when hit points are rolled/chosen
    hitPointMethod: 'average',
    abilityScoreImprovements: [],
    classFeatureChoices: [],
    spellsLearned: [],
    skillsGained: [],
    otherChoices: {},
  };
}

/**
 * Validate level-up choices
 */
export function validateLevelUpChoices(
  choices: LevelUpChoices
): ValidationResult<LevelUpChoices> {
  const errors: ValidationError[] = [];

  // Validate level
  const levelValidation = validateLevel(choices.level);
  if (!levelValidation.success) {
    errors.push(...levelValidation.error);
  }

  // Validate hit points gained
  if (choices.hitPointsGained < 0) {
    errors.push(
      validationError(
        'hitPointsGained',
        'Hit points gained cannot be negative',
        'INVALID_HP_GAIN_NEGATIVE'
      )
    );
  }

  if (!Number.isInteger(choices.hitPointsGained)) {
    errors.push(
      validationError(
        'hitPointsGained',
        'Hit points gained must be a whole number',
        'INVALID_HP_GAIN_NOT_INTEGER'
      )
    );
  }

  // Validate ability score improvements
  if (choices.abilityScoreImprovements) {
    let totalImprovements = 0;
    for (const improvement of choices.abilityScoreImprovements) {
      totalImprovements += improvement.improvement;

      if (improvement.improvement < 0) {
        errors.push(
          validationError(
            'abilityScoreImprovements',
            'Ability score improvements cannot be negative',
            'INVALID_ASI_NEGATIVE'
          )
        );
      }
    }

    // Standard D&D allows 2 points of improvement at ASI levels
    if (totalImprovements > 2) {
      errors.push(
        validationError(
          'abilityScoreImprovements',
          'Cannot improve ability scores by more than 2 points total',
          'INVALID_ASI_TOO_MANY',
          { totalImprovements, maxAllowed: 2 }
        )
      );
    }
  }

  if (errors.length > 0) {
    return validationFailure(errors);
  }

  return validationSuccess(choices);
}

/**
 * Apply level-up choices to update character data
 * This is a helper function that would be used by the main character system
 */
export function applyLevelUpChoices(
  currentExperience: ExperienceData,
  choices: LevelUpChoices
): ValidationResult<ExperienceData> {
  const validation = validateLevelUpChoices(choices);
  if (!validation.success) {
    return validation;
  }

  // Ensure the character has enough XP for the level
  const requiredXP = getXPForLevel(choices.level);
  if (currentExperience.currentXP < requiredXP) {
    return validationFailure([
      validationError(
        'level',
        `Not enough experience points to reach level ${choices.level}`,
        'INSUFFICIENT_XP_FOR_LEVEL',
        {
          currentXP: currentExperience.currentXP,
          requiredXP,
          targetLevel: choices.level,
        }
      ),
    ]);
  }

  // Create new experience data with the updated level
  const newExperienceData = createExperienceData(currentExperience.currentXP);

  return validationSuccess(newExperienceData);
}

/**
 * Get experience point milestones for display purposes
 */
export function getExperienceMilestones(): Array<{
  level: number;
  xp: number;
}> {
  return EXPERIENCE_THRESHOLDS.map((xp, index) => ({
    level: index + 1,
    xp,
  }));
}

/**
 * Calculate experience points needed between two levels
 */
export function getXPBetweenLevels(fromLevel: number, toLevel: number): number {
  if (fromLevel >= toLevel) return 0;

  const fromXP = getXPForLevel(fromLevel);
  const toXP = getXPForLevel(toLevel);

  return toXP - fromXP;
}

/**
 * Get a summary of experience progression
 */
export function getExperienceProgressSummary(experienceData: ExperienceData): {
  level: number;
  xp: number;
  xpToNext: number;
  progressPercent: number;
  canLevelUp: boolean;
  levelsAvailable: number;
} {
  const xpToNext = getXPToNextLevel(
    experienceData.currentXP,
    experienceData.currentLevel
  );
  const currentLevelXP = experienceData.currentLevelXP;
  const nextLevelXP = experienceData.nextLevelXP;
  const xpInCurrentLevel = experienceData.currentXP - currentLevelXP;
  const xpNeededForCurrentLevel = nextLevelXP - currentLevelXP;

  const progressPercent =
    xpNeededForCurrentLevel > 0
      ? Math.min(100, (xpInCurrentLevel / xpNeededForCurrentLevel) * 100)
      : 100;

  return {
    level: experienceData.currentLevel,
    xp: experienceData.currentXP,
    xpToNext,
    progressPercent: Math.round(progressPercent * 100) / 100, // Round to 2 decimal places
    canLevelUp: canLevelUp(experienceData),
    levelsAvailable: getLevelsAvailable(experienceData),
  };
}
