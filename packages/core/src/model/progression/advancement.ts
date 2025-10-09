/**
 * Character advancement choice system for Hollow Gear
 *
 * This module handles level-up decisions, ability score improvements,
 * feat selection, class feature acquisition, and archetype selection.
 */

import type { ValidationResult, ValidationError } from '../types/common.js';
import {
  validationSuccess,
  validationFailure,
  validationError,
} from '../types/common.js';
import type { AbilityScore } from '../types/common.js';
import type { AbilityScoreIncrease } from '../types/abilities.js';
import type {
  HollowGearClass,
  ClassArchetype,
  ClassFeature,
} from '../classes/index.js';
import type {
  LevelUpChoices,
  AbilityScoreImprovement,
  ClassFeatureChoice,
} from './experience.js';

/**
 * Comprehensive advancement choices for a character level-up
 */
export interface AdvancementChoices {
  /** Level this advancement applies to */
  level: number;
  /** Class being advanced (for multiclass characters) */
  advancingClass: HollowGearClass;
  /** Hit points gained this level */
  hitPointsGained: number;
  /** Method used to determine hit points */
  hitPointMethod: 'rolled' | 'average';
  /** Ability score improvements (if applicable at this level) */
  abilityScoreImprovements?: AbilityScoreImprovement[];
  /** Feat selected instead of ASI (if applicable) */
  featSelected?: FeatChoice;
  /** Class features gained this level */
  classFeatures: ClassFeature[];
  /** Archetype selection (if applicable at this level) */
  archetypeSelected?: ClassArchetype;
  /** Spells learned (for spellcasters) */
  spellsLearned?: SpellChoice[];
  /** Skills gained (if applicable) */
  skillsGained?: SkillChoice[];
  /** Proficiencies gained (if applicable) */
  proficienciesGained?: ProficiencyChoice[];
  /** Other class-specific choices */
  classSpecificChoices?: Record<string, unknown>;
  /** Timestamp when choices were made */
  choicesMadeAt: Date;
  /** Whether these choices have been applied to the character */
  applied: boolean;
}

/**
 * Feat selection choice
 */
export interface FeatChoice {
  /** Feat identifier */
  featId: string;
  /** Feat name */
  name: string;
  /** Feat description */
  description: string;
  /** Prerequisites met */
  prerequisitesMet: boolean;
  /** Any sub-choices within the feat */
  subChoices?: Record<string, unknown>;
}

/**
 * Spell learning choice
 */
export interface SpellChoice {
  /** Spell identifier */
  spellId: string;
  /** Spell name */
  name: string;
  /** Spell level */
  level: number;
  /** Spellcasting class that learns this spell */
  sourceClass: HollowGearClass;
  /** Whether this replaces an existing spell */
  replacesSpell?: string;
}

/**
 * Skill proficiency choice
 */
export interface SkillChoice {
  /** Skill name */
  skill: string;
  /** Source of the skill (class feature, background, etc.) */
  source: string;
  /** Whether this grants expertise instead of proficiency */
  expertise?: boolean;
}

/**
 * Proficiency choice (tools, languages, etc.)
 */
export interface ProficiencyChoice {
  /** Type of proficiency */
  type: 'tool' | 'language' | 'weapon' | 'armor';
  /** Proficiency name */
  name: string;
  /** Source of the proficiency */
  source: string;
}

/**
 * Available advancement options for a specific level
 */
export interface AdvancementOptions {
  /** Level being advanced to */
  level: number;
  /** Class being advanced */
  advancingClass: HollowGearClass;
  /** Whether ASI is available at this level */
  abilityScoreImprovementAvailable: boolean;
  /** Available feats (if ASI is available) */
  availableFeats: FeatChoice[];
  /** Class features automatically gained */
  automaticClassFeatures: ClassFeature[];
  /** Class features that require choices */
  choiceClassFeatures: ClassFeatureChoice[];
  /** Available archetype selection (if applicable) */
  archetypeSelection?: {
    level: number;
    availableArchetypes: ClassArchetype[];
  };
  /** Available spells to learn */
  availableSpells: SpellChoice[];
  /** Available skills to gain */
  availableSkills: SkillChoice[];
  /** Available proficiencies to gain */
  availableProficiencies: ProficiencyChoice[];
  /** Hit die for hit point calculation */
  hitDie: number;
}

/**
 * Standard D&D 5e levels that grant Ability Score Improvements
 */
export const ASI_LEVELS = [4, 8, 12, 16, 19] as const;

/**
 * Class-specific ASI levels (some classes get additional ASIs)
 */
export const CLASS_ASI_LEVELS: Partial<
  Record<HollowGearClass, readonly number[]>
> = {
  // Most classes use standard ASI levels
  // Fighters would get additional ASIs at 6, 14 if we had them
  // Rogues would get additional ASI at 10 if we had them
} as const;

/**
 * Check if a level grants an Ability Score Improvement for a class
 */
export function isASILevel(level: number, className: HollowGearClass): boolean {
  const standardASI = ASI_LEVELS.includes(level as (typeof ASI_LEVELS)[number]);
  const classSpecificASI =
    CLASS_ASI_LEVELS[className]?.includes(level) ?? false;

  return standardASI || classSpecificASI;
}

/**
 * Get available advancement options for a specific level and class
 */
export function getAdvancementOptions(
  level: number,
  advancingClass: HollowGearClass,
  currentChoices?: Partial<AdvancementChoices>
): AdvancementOptions {
  const abilityScoreImprovementAvailable = isASILevel(level, advancingClass);

  // Get class-specific hit die
  const hitDieMap: Record<HollowGearClass, number> = {
    arcanist: 6,
    templar: 10,
    tweaker: 12,
    shadehand: 8,
    vanguard: 10,
    artifex: 8,
    mindweaver: 8,
  };

  const hitDie = hitDieMap[advancingClass];

  return {
    level,
    advancingClass,
    abilityScoreImprovementAvailable,
    availableFeats: getAvailableFeats(level, advancingClass),
    automaticClassFeatures: getAutomaticClassFeatures(level, advancingClass),
    choiceClassFeatures: getChoiceClassFeatures(level, advancingClass),
    archetypeSelection: getArchetypeSelection(level, advancingClass),
    availableSpells: getAvailableSpells(level, advancingClass),
    availableSkills: getAvailableSkills(level, advancingClass),
    availableProficiencies: getAvailableProficiencies(level, advancingClass),
    hitDie,
  };
}

/**
 * Get available feats for a character at a specific level
 */
export function getAvailableFeats(
  level: number,
  className: HollowGearClass
): FeatChoice[] {
  // This would be populated with actual feat data
  // For now, return some common Hollow Gear feats as examples
  const commonFeats: FeatChoice[] = [
    {
      featId: 'aether_sensitive',
      name: 'Aether Sensitive',
      description:
        'Increase sensitivity to Aetheric energies, gain +1 to psionic saves',
      prerequisitesMet: true,
    },
    {
      featId: 'steam_engineer',
      name: 'Steam Engineer',
      description:
        'Expertise with steam-powered devices, reduce heat stress by 1',
      prerequisitesMet: true,
    },
    {
      featId: 'gear_savant',
      name: 'Gear Savant',
      description:
        'Proficiency with all artisan tools, +1 to equipment modification rolls',
      prerequisitesMet: true,
    },
    {
      featId: 'psionic_adept',
      name: 'Psionic Adept',
      description: 'Learn one 1st-tier psionic power from any discipline',
      prerequisitesMet: true,
    },
  ];

  return commonFeats;
}

/**
 * Get automatic class features gained at a specific level
 */
export function getAutomaticClassFeatures(
  level: number,
  className: HollowGearClass
): ClassFeature[] {
  // This would integrate with the class progression system
  // For now, return empty array as features are handled by class progression
  return [];
}

/**
 * Get class features that require choices at a specific level
 */
export function getChoiceClassFeatures(
  level: number,
  className: HollowGearClass
): ClassFeatureChoice[] {
  // This would be populated with actual class feature choice data
  return [];
}

/**
 * Get archetype selection options if applicable at this level
 */
export function getArchetypeSelection(
  level: number,
  className: HollowGearClass
): AdvancementOptions['archetypeSelection'] {
  // Most classes select archetype at level 2 or 3
  const archetypeSelectionLevels: Record<HollowGearClass, number> = {
    arcanist: 2,
    templar: 3,
    tweaker: 3,
    shadehand: 3,
    vanguard: 3,
    artifex: 3,
    mindweaver: 2,
  };

  if (level === archetypeSelectionLevels[className]) {
    // This would be populated with actual archetype data from class-data.ts
    return {
      level,
      availableArchetypes: [], // Would be populated from CLASS_DATA
    };
  }

  return undefined;
}

/**
 * Get available spells to learn at a specific level
 */
export function getAvailableSpells(
  level: number,
  className: HollowGearClass
): SpellChoice[] {
  // Only spellcasting classes learn spells
  const spellcastingClasses: HollowGearClass[] = ['arcanist', 'templar'];

  if (!spellcastingClasses.includes(className)) {
    return [];
  }

  // This would be populated with actual spell data
  return [];
}

/**
 * Get available skills to gain at a specific level
 */
export function getAvailableSkills(
  level: number,
  className: HollowGearClass
): SkillChoice[] {
  // This would be populated based on class features that grant skill choices
  return [];
}

/**
 * Get available proficiencies to gain at a specific level
 */
export function getAvailableProficiencies(
  level: number,
  className: HollowGearClass
): ProficiencyChoice[] {
  // This would be populated based on class features that grant proficiency choices
  return [];
}

/**
 * Create default advancement choices for a level
 */
export function createDefaultAdvancementChoices(
  level: number,
  advancingClass: HollowGearClass
): AdvancementChoices {
  const options = getAdvancementOptions(level, advancingClass);

  return {
    level,
    advancingClass,
    hitPointsGained: 0, // Will be set when hit points are determined
    hitPointMethod: 'average',
    classFeatures: options.automaticClassFeatures,
    choicesMadeAt: new Date(),
    applied: false,
  };
}

/**
 * Validate advancement choices
 */
export function validateAdvancementChoices(
  choices: AdvancementChoices
): ValidationResult<AdvancementChoices> {
  const errors: ValidationError[] = [];

  // Validate level
  if (choices.level < 1 || choices.level > 20) {
    errors.push(
      validationError(
        'level',
        'Level must be between 1 and 20',
        'INVALID_LEVEL_RANGE'
      )
    );
  }

  // Validate hit points gained
  if (choices.hitPointsGained < 0) {
    errors.push(
      validationError(
        'hitPointsGained',
        'Hit points gained cannot be negative',
        'INVALID_HP_GAIN'
      )
    );
  }

  // Validate ability score improvements
  if (choices.abilityScoreImprovements) {
    const totalImprovements = choices.abilityScoreImprovements.reduce(
      (total, improvement) => total + improvement.improvement,
      0
    );

    if (totalImprovements > 2) {
      errors.push(
        validationError(
          'abilityScoreImprovements',
          'Cannot improve ability scores by more than 2 points total',
          'INVALID_ASI_TOTAL'
        )
      );
    }

    // Check for duplicate ability improvements
    const abilities = choices.abilityScoreImprovements.map(asi => asi.ability);
    const uniqueAbilities = new Set(abilities);
    if (abilities.length !== uniqueAbilities.size) {
      errors.push(
        validationError(
          'abilityScoreImprovements',
          'Cannot improve the same ability score multiple times',
          'DUPLICATE_ASI'
        )
      );
    }
  }

  // Validate ASI vs Feat selection
  if (choices.abilityScoreImprovements && choices.featSelected) {
    errors.push(
      validationError(
        'featSelected',
        'Cannot select both ability score improvements and a feat',
        'ASI_AND_FEAT_CONFLICT'
      )
    );
  }

  // Validate feat prerequisites
  if (choices.featSelected && !choices.featSelected.prerequisitesMet) {
    errors.push(
      validationError(
        'featSelected',
        `Prerequisites not met for feat: ${choices.featSelected.name}`,
        'FEAT_PREREQUISITES_NOT_MET'
      )
    );
  }

  if (errors.length > 0) {
    return validationFailure(errors);
  }

  return validationSuccess(choices);
}

/**
 * Calculate hit points for a level based on method and hit die
 */
export function calculateHitPointsGained(
  hitDie: number,
  method: 'rolled' | 'average',
  rolledValue?: number
): ValidationResult<number> {
  if (method === 'average') {
    // Average is (max + 1) / 2, rounded up
    const average = Math.ceil((hitDie + 1) / 2);
    return validationSuccess(average);
  }

  if (method === 'rolled') {
    if (rolledValue === undefined) {
      return validationFailure([
        validationError(
          'rolledValue',
          'Rolled value required when using rolled method',
          'MISSING_ROLLED_VALUE'
        ),
      ]);
    }

    if (rolledValue < 1 || rolledValue > hitDie) {
      return validationFailure([
        validationError(
          'rolledValue',
          `Rolled value must be between 1 and ${hitDie}`,
          'INVALID_ROLLED_VALUE'
        ),
      ]);
    }

    return validationSuccess(rolledValue);
  }

  return validationFailure([
    validationError(
      'method',
      'Invalid hit point calculation method',
      'INVALID_HP_METHOD'
    ),
  ]);
}

/**
 * Apply ability score improvements to current ability scores
 */
export function applyAbilityScoreImprovements(
  currentAbilityScores: Record<AbilityScore, number>,
  improvements: AbilityScoreImprovement[]
): ValidationResult<Record<AbilityScore, number>> {
  const errors: ValidationError[] = [];
  const newScores = { ...currentAbilityScores };

  for (const improvement of improvements) {
    const currentScore = newScores[improvement.ability];
    const newScore = currentScore + improvement.improvement;

    // Check ability score maximum (20 for most cases, 30 absolute max)
    if (newScore > 20) {
      errors.push(
        validationError(
          'abilityScoreImprovements',
          `${improvement.ability} cannot exceed 20 (would be ${newScore})`,
          'ABILITY_SCORE_MAX_EXCEEDED'
        )
      );
    } else {
      newScores[improvement.ability] = newScore;
    }
  }

  if (errors.length > 0) {
    return validationFailure(errors);
  }

  return validationSuccess(newScores);
}

/**
 * Check if advancement choices are complete and ready to apply
 */
export function areAdvancementChoicesComplete(
  choices: AdvancementChoices,
  options: AdvancementOptions
): ValidationResult<boolean> {
  const errors: ValidationError[] = [];

  // Check if hit points have been determined
  if (choices.hitPointsGained === 0) {
    errors.push(
      validationError(
        'hitPointsGained',
        'Hit points must be determined before applying advancement',
        'MISSING_HIT_POINTS'
      )
    );
  }

  // Check if ASI or feat has been selected when available
  if (options.abilityScoreImprovementAvailable) {
    if (!choices.abilityScoreImprovements && !choices.featSelected) {
      errors.push(
        validationError(
          'advancement',
          'Must select either ability score improvements or a feat',
          'MISSING_ASI_OR_FEAT'
        )
      );
    }
  }

  // Check if archetype has been selected when required
  if (options.archetypeSelection && !choices.archetypeSelected) {
    errors.push(
      validationError(
        'archetypeSelected',
        'Must select an archetype at this level',
        'MISSING_ARCHETYPE_SELECTION'
      )
    );
  }

  // Check if required class feature choices have been made
  for (const featureChoice of options.choiceClassFeatures) {
    const hasChoice = choices.classSpecificChoices?.[featureChoice.featureId];
    if (!hasChoice) {
      errors.push(
        validationError(
          'classSpecificChoices',
          `Must make choice for class feature: ${featureChoice.featureId}`,
          'MISSING_CLASS_FEATURE_CHOICE'
        )
      );
    }
  }

  if (errors.length > 0) {
    return validationFailure(errors);
  }

  return validationSuccess(true);
}

/**
 * Create advancement choices from level-up choices (for backward compatibility)
 */
export function createAdvancementChoicesFromLevelUp(
  levelUpChoices: LevelUpChoices,
  advancingClass: HollowGearClass
): AdvancementChoices {
  return {
    level: levelUpChoices.level,
    advancingClass,
    hitPointsGained: levelUpChoices.hitPointsGained,
    hitPointMethod: levelUpChoices.hitPointMethod,
    abilityScoreImprovements: levelUpChoices.abilityScoreImprovements,
    classFeatures: [],
    spellsLearned: levelUpChoices.spellsLearned?.map(spellId => ({
      spellId,
      name: spellId, // Would be resolved from spell data
      level: 1, // Would be resolved from spell data
      sourceClass: advancingClass,
    })),
    skillsGained: levelUpChoices.skillsGained?.map(skill => ({
      skill,
      source: 'class',
    })),
    choicesMadeAt: new Date(),
    applied: false,
  };
}

/**
 * Get a summary of advancement choices for display
 */
export function getAdvancementChoicesSummary(choices: AdvancementChoices): {
  level: number;
  className: string;
  hitPointsGained: number;
  abilityImprovements: string[];
  featSelected?: string;
  archetypeSelected?: string;
  spellsLearned: number;
  skillsGained: number;
  isComplete: boolean;
} {
  const abilityImprovements =
    choices.abilityScoreImprovements?.map(
      asi => `${asi.ability} +${asi.improvement}`
    ) || [];

  return {
    level: choices.level,
    className: choices.advancingClass,
    hitPointsGained: choices.hitPointsGained,
    abilityImprovements,
    featSelected: choices.featSelected?.name,
    archetypeSelected: choices.archetypeSelected?.name,
    spellsLearned: choices.spellsLearned?.length || 0,
    skillsGained: choices.skillsGained?.length || 0,
    isComplete: choices.applied,
  };
}
