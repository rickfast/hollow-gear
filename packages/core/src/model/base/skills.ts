/**
 * Skills and proficiency system for D&D 5e
 */

import type {
  AbilityScore,
  ValidationResult,
  ValidationError,
} from '../types/common.js';

/**
 * All D&D 5e skills with their associated ability scores
 */
export type Skill =
  | 'acrobatics'
  | 'animalHandling'
  | 'arcana'
  | 'athletics'
  | 'deception'
  | 'history'
  | 'insight'
  | 'intimidation'
  | 'investigation'
  | 'medicine'
  | 'nature'
  | 'perception'
  | 'performance'
  | 'persuasion'
  | 'religion'
  | 'sleightOfHand'
  | 'stealth'
  | 'survival';

/**
 * Proficiency level for skills
 */
export type ProficiencyLevel = 'none' | 'proficient' | 'expertise';

/**
 * Individual skill proficiency data
 */
export interface SkillProficiency {
  /** The proficiency level for this skill */
  level: ProficiencyLevel;
  /** Any miscellaneous bonus to this skill */
  bonus: number;
  /** Total modifier for this skill (calculated) */
  readonly total: number;
}

/**
 * Complete skill proficiencies for a character
 */
export interface SkillProficiencies {
  acrobatics: SkillProficiency;
  animalHandling: SkillProficiency;
  arcana: SkillProficiency;
  athletics: SkillProficiency;
  deception: SkillProficiency;
  history: SkillProficiency;
  insight: SkillProficiency;
  intimidation: SkillProficiency;
  investigation: SkillProficiency;
  medicine: SkillProficiency;
  nature: SkillProficiency;
  perception: SkillProficiency;
  performance: SkillProficiency;
  persuasion: SkillProficiency;
  religion: SkillProficiency;
  sleightOfHand: SkillProficiency;
  stealth: SkillProficiency;
  survival: SkillProficiency;
}

/**
 * Saving throw proficiency data
 */
export interface SavingThrowProficiency {
  /** Whether the character is proficient in this save */
  proficient: boolean;
  /** Any miscellaneous bonus to this save */
  bonus: number;
  /** Total modifier for this save (calculated) */
  readonly total: number;
}

/**
 * Complete saving throw proficiencies for a character
 */
export interface SavingThrowProficiencies {
  strength: SavingThrowProficiency;
  dexterity: SavingThrowProficiency;
  constitution: SavingThrowProficiency;
  intelligence: SavingThrowProficiency;
  wisdom: SavingThrowProficiency;
  charisma: SavingThrowProficiency;
}

/**
 * Complete proficiency data for a character
 */
export interface ProficiencyData {
  /** Character's proficiency bonus based on level */
  bonus: number;
  /** Skill proficiencies */
  skills: SkillProficiencies;
  /** Saving throw proficiencies */
  savingThrows: SavingThrowProficiencies;
}

/**
 * Utility functions for skill and proficiency calculations
 */
export namespace SkillUtils {
  /**
   * Mapping of skills to their associated ability scores
   */
  export const SKILL_ABILITIES: Record<Skill, AbilityScore> = {
    acrobatics: 'dexterity',
    animalHandling: 'wisdom',
    arcana: 'intelligence',
    athletics: 'strength',
    deception: 'charisma',
    history: 'intelligence',
    insight: 'wisdom',
    intimidation: 'charisma',
    investigation: 'intelligence',
    medicine: 'wisdom',
    nature: 'intelligence',
    perception: 'wisdom',
    performance: 'charisma',
    persuasion: 'charisma',
    religion: 'intelligence',
    sleightOfHand: 'dexterity',
    stealth: 'dexterity',
    survival: 'wisdom',
  };

  /**
   * Get the ability score associated with a skill
   */
  export function getSkillAbility(skill: Skill): AbilityScore {
    return SKILL_ABILITIES[skill];
  }

  /**
   * Calculate proficiency bonus based on character level
   */
  export function calculateProficiencyBonus(level: number): number {
    return Math.ceil(level / 4) + 1;
  }

  /**
   * Calculate skill modifier
   */
  export function calculateSkillModifier(
    abilityModifier: number,
    proficiencyLevel: ProficiencyLevel,
    proficiencyBonus: number,
    miscBonus: number = 0
  ): number {
    let profBonus = 0;

    switch (proficiencyLevel) {
      case 'proficient':
        profBonus = proficiencyBonus;
        break;
      case 'expertise':
        profBonus = proficiencyBonus * 2;
        break;
      case 'none':
      default:
        profBonus = 0;
        break;
    }

    return abilityModifier + profBonus + miscBonus;
  }

  /**
   * Calculate saving throw modifier
   */
  export function calculateSaveModifier(
    abilityModifier: number,
    proficient: boolean,
    proficiencyBonus: number,
    miscBonus: number = 0
  ): number {
    const profBonus = proficient ? proficiencyBonus : 0;
    return abilityModifier + profBonus + miscBonus;
  }

  /**
   * Create a skill proficiency with calculated total
   */
  export function createSkillProficiency(
    level: ProficiencyLevel,
    abilityModifier: number,
    proficiencyBonus: number,
    bonus: number = 0
  ): SkillProficiency {
    const total = calculateSkillModifier(
      abilityModifier,
      level,
      proficiencyBonus,
      bonus
    );
    return {
      level,
      bonus,
      total,
    };
  }

  /**
   * Create a saving throw proficiency with calculated total
   */
  export function createSavingThrowProficiency(
    proficient: boolean,
    abilityModifier: number,
    proficiencyBonus: number,
    bonus: number = 0
  ): SavingThrowProficiency {
    const total = calculateSaveModifier(
      abilityModifier,
      proficient,
      proficiencyBonus,
      bonus
    );
    return {
      proficient,
      bonus,
      total,
    };
  }

  /**
   * Create default skill proficiencies (all none)
   */
  export function createDefaultSkillProficiencies(
    abilityModifiers: Record<AbilityScore, number>,
    proficiencyBonus: number
  ): SkillProficiencies {
    const skills: Partial<SkillProficiencies> = {};

    for (const skill of Object.keys(SKILL_ABILITIES) as Skill[]) {
      const ability = SKILL_ABILITIES[skill];
      const abilityMod = abilityModifiers[ability];
      skills[skill] = createSkillProficiency(
        'none',
        abilityMod,
        proficiencyBonus
      );
    }

    return skills as SkillProficiencies;
  }

  /**
   * Create default saving throw proficiencies (all not proficient)
   */
  export function createDefaultSavingThrowProficiencies(
    abilityModifiers: Record<AbilityScore, number>,
    proficiencyBonus: number
  ): SavingThrowProficiencies {
    return {
      strength: createSavingThrowProficiency(
        false,
        abilityModifiers.strength,
        proficiencyBonus
      ),
      dexterity: createSavingThrowProficiency(
        false,
        abilityModifiers.dexterity,
        proficiencyBonus
      ),
      constitution: createSavingThrowProficiency(
        false,
        abilityModifiers.constitution,
        proficiencyBonus
      ),
      intelligence: createSavingThrowProficiency(
        false,
        abilityModifiers.intelligence,
        proficiencyBonus
      ),
      wisdom: createSavingThrowProficiency(
        false,
        abilityModifiers.wisdom,
        proficiencyBonus
      ),
      charisma: createSavingThrowProficiency(
        false,
        abilityModifiers.charisma,
        proficiencyBonus
      ),
    };
  }

  /**
   * Update skill proficiencies with new ability modifiers and proficiency bonus
   */
  export function updateSkillProficiencies(
    skills: SkillProficiencies,
    abilityModifiers: Record<AbilityScore, number>,
    proficiencyBonus: number
  ): SkillProficiencies {
    const updated: Partial<SkillProficiencies> = {};

    for (const skill of Object.keys(skills) as Skill[]) {
      const current = skills[skill];
      const ability = SKILL_ABILITIES[skill];
      const abilityMod = abilityModifiers[ability];
      updated[skill] = createSkillProficiency(
        current.level,
        abilityMod,
        proficiencyBonus,
        current.bonus
      );
    }

    return updated as SkillProficiencies;
  }

  /**
   * Update saving throw proficiencies with new ability modifiers and proficiency bonus
   */
  export function updateSavingThrowProficiencies(
    saves: SavingThrowProficiencies,
    abilityModifiers: Record<AbilityScore, number>,
    proficiencyBonus: number
  ): SavingThrowProficiencies {
    return {
      strength: createSavingThrowProficiency(
        saves.strength.proficient,
        abilityModifiers.strength,
        proficiencyBonus,
        saves.strength.bonus
      ),
      dexterity: createSavingThrowProficiency(
        saves.dexterity.proficient,
        abilityModifiers.dexterity,
        proficiencyBonus,
        saves.dexterity.bonus
      ),
      constitution: createSavingThrowProficiency(
        saves.constitution.proficient,
        abilityModifiers.constitution,
        proficiencyBonus,
        saves.constitution.bonus
      ),
      intelligence: createSavingThrowProficiency(
        saves.intelligence.proficient,
        abilityModifiers.intelligence,
        proficiencyBonus,
        saves.intelligence.bonus
      ),
      wisdom: createSavingThrowProficiency(
        saves.wisdom.proficient,
        abilityModifiers.wisdom,
        proficiencyBonus,
        saves.wisdom.bonus
      ),
      charisma: createSavingThrowProficiency(
        saves.charisma.proficient,
        abilityModifiers.charisma,
        proficiencyBonus,
        saves.charisma.bonus
      ),
    };
  }

  /**
   * Get skill name as formatted string
   */
  export function getSkillName(skill: Skill): string {
    const names: Record<Skill, string> = {
      acrobatics: 'Acrobatics',
      animalHandling: 'Animal Handling',
      arcana: 'Arcana',
      athletics: 'Athletics',
      deception: 'Deception',
      history: 'History',
      insight: 'Insight',
      intimidation: 'Intimidation',
      investigation: 'Investigation',
      medicine: 'Medicine',
      nature: 'Nature',
      perception: 'Perception',
      performance: 'Performance',
      persuasion: 'Persuasion',
      religion: 'Religion',
      sleightOfHand: 'Sleight of Hand',
      stealth: 'Stealth',
      survival: 'Survival',
    };
    return names[skill];
  }

  /**
   * Set skill proficiency level
   */
  export function setSkillProficiency(
    skills: SkillProficiencies,
    skill: Skill,
    level: ProficiencyLevel,
    abilityModifiers: Record<AbilityScore, number>,
    proficiencyBonus: number
  ): SkillProficiencies {
    const ability = SKILL_ABILITIES[skill];
    const abilityMod = abilityModifiers[ability];
    const current = skills[skill];

    return {
      ...skills,
      [skill]: createSkillProficiency(
        level,
        abilityMod,
        proficiencyBonus,
        current.bonus
      ),
    };
  }

  /**
   * Set saving throw proficiency
   */
  export function setSavingThrowProficiency(
    saves: SavingThrowProficiencies,
    ability: AbilityScore,
    proficient: boolean,
    abilityModifiers: Record<AbilityScore, number>,
    proficiencyBonus: number
  ): SavingThrowProficiencies {
    const abilityMod = abilityModifiers[ability];
    const current = saves[ability];

    return {
      ...saves,
      [ability]: createSavingThrowProficiency(
        proficient,
        abilityMod,
        proficiencyBonus,
        current.bonus
      ),
    };
  }

  /**
   * Validate proficiency data
   */
  export function validateProficiencyData(
    data: ProficiencyData
  ): ValidationResult<ProficiencyData> {
    const errors: ValidationError[] = [];

    if (data.bonus < 2 || data.bonus > 6) {
      errors.push({
        field: 'proficiencyBonus',
        message: 'Proficiency bonus must be between 2 and 6',
        code: 'INVALID_PROFICIENCY_BONUS',
      });
    }

    // Validate that all skill totals are calculated correctly
    for (const skill of Object.keys(data.skills) as Skill[]) {
      const skillData = data.skills[skill];
      if (typeof skillData.total !== 'number') {
        errors.push({
          field: `skills.${skill}.total`,
          message: 'Skill total must be a number',
          code: 'INVALID_SKILL_TOTAL',
        });
      }
    }

    // Validate that all save totals are calculated correctly
    for (const ability of Object.keys(data.savingThrows) as AbilityScore[]) {
      const saveData = data.savingThrows[ability];
      if (typeof saveData.total !== 'number') {
        errors.push({
          field: `savingThrows.${ability}.total`,
          message: 'Saving throw total must be a number',
          code: 'INVALID_SAVE_TOTAL',
        });
      }
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data };
  }
}
