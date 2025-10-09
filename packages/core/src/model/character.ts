/**
 * Main HollowGearCharacter interface and character composition
 *
 * This module defines the complete character interface that composes all
 * subsystems into a unified character representation for the Hollow Gear TTRPG.
 */

import type { CharacterId, Result, ValidationError } from './types/common.js';
import type { BaseCharacterData } from './base/character.js';
import type { AbilityScores } from './base/abilities.js';
import type {
  HitPointData,
  ArmorClassData,
  InitiativeData,
} from './base/combat.js';
import type {
  SkillProficiencies,
  SavingThrowProficiencies,
} from './base/skills.js';
import type { EtherborneSpecies, SpeciesTraits } from './species/index.js';
import type { CharacterClass } from './classes/index.js';
import type { EquippedItems, InventoryData } from './equipment/index.js';
import type { PsionicData } from './psionics/index.js';
import type { SpellcastingData } from './spellcasting/index.js';
import type {
  HeatStressData,
  CurrencyData,
  MaintenanceData,
} from './mechanics/index.js';
import type {
  ExperienceData,
  AdvancementChoices,
} from './progression/index.js';

/**
 * Complete Hollow Gear character representation
 *
 * This interface composes all character subsystems into a unified character
 * that supports both D&D 5e mechanics and Hollow Gear-specific systems.
 */
export interface HollowGearCharacter extends BaseCharacterData {
  // Basic Character Information
  /** Character's Etherborne species */
  species: EtherborneSpecies;
  /** Species traits and abilities */
  speciesTraits: SpeciesTraits;
  /** Character's classes and levels */
  classes: CharacterClass[];
  /** Total character level across all classes */
  level: number;
  /** Character background (optional) */
  background?: string;

  // Core D&D 5e Mechanics
  /** Ability scores (STR, DEX, CON, INT, WIS, CHA) */
  abilities: AbilityScores;
  /** Hit point data and tracking */
  hitPoints: HitPointData;
  /** Armor class calculation and modifiers */
  armorClass: ArmorClassData;
  /** Initiative bonus and modifiers */
  initiative: InitiativeData;
  /** Proficiency bonus based on level */
  proficiencyBonus: number;
  /** Skill proficiencies and bonuses */
  skills: SkillProficiencies;
  /** Saving throw proficiencies */
  savingThrows: SavingThrowProficiencies;

  // Hollow Gear Specific Systems
  /** Heat Stress tracking and effects */
  heatStress: HeatStressData;
  /** Currency (Cogs, Gears, Cores) and resources */
  currency: CurrencyData;
  /** Equipment maintenance and malfunction tracking */
  maintenance: MaintenanceData;

  // Optional Advanced Systems
  /** Psionic abilities and Mindcraft (if character has psionic classes) */
  psionics?: PsionicData;
  /** Spellcasting abilities (if character has spellcasting classes) */
  spellcasting?: SpellcastingData;

  // Equipment and Inventory
  /** Currently equipped items */
  equipment: EquippedItems;
  /** Inventory and item management */
  inventory: InventoryData;

  // Character Progression
  /** Experience points and level tracking */
  experience: ExperienceData;
  /** Advancement choices and level-up decisions */
  advancement: AdvancementChoices;

  // Additional Character Data
  /** Character notes and description */
  notes?: string;
  /** Character portrait or image reference */
  portrait?: string;
  /** Custom character traits or features */
  customTraits?: CustomTrait[];
}

/**
 * Custom character trait or feature
 */
export interface CustomTrait {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of the trait */
  description: string;
  /** Source of the trait (feat, magic item, etc.) */
  source: string;
  /** Whether the trait is currently active */
  active: boolean;
}

/**
 * Character creation parameters
 */
export interface CharacterCreationParams {
  /** Character name */
  name: string;
  /** Chosen species */
  species: EtherborneSpecies;
  /** Starting class */
  startingClass: import('./classes/index.js').HollowGearClass;
  /** Ability score array or point buy results */
  abilityScores: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  /** Optional background */
  background?: string;
  /** Starting equipment choices */
  equipment?: Partial<EquippedItems>;
  /** Character notes */
  notes?: string;
}

/**
 * Character validation result
 */
export type CharacterValidationResult = Result<
  HollowGearCharacter,
  ValidationError[]
>;

/**
 * Character creation result
 */
export type CharacterCreationResult = Result<
  HollowGearCharacter,
  ValidationError[]
>;

/**
 * Character utility functions and operations
 */
export namespace CharacterUtils {
  /**
   * Create a new Hollow Gear character with the specified parameters
   */
  export async function createCharacter(
    params: CharacterCreationParams
  ): Promise<CharacterCreationResult> {
    try {
      // Validate creation parameters
      const validationResult = validateCreationParams(params);
      if (!validationResult.success) {
        return validationResult;
      }

      // Create base character data
      const { CharacterUtils: BaseCharacterUtils } = await import(
        './base/character.js'
      );
      const { MODEL_VERSION } = await import('./index.js');
      const baseData = BaseCharacterUtils.createBaseCharacterData(
        params.name,
        MODEL_VERSION
      );

      // Initialize character with default values
      const character: HollowGearCharacter = {
        ...baseData,
        species: params.species,
        speciesTraits: getSpeciesTraits(params.species),
        classes: [
          createStartingClass(params.startingClass, params.abilityScores),
        ],
        level: 1,
        background: params.background,

        // Initialize abilities
        abilities: createAbilityScores(params.abilityScores, params.species),

        // Initialize combat stats
        hitPoints: createInitialHitPoints(
          params.startingClass,
          params.abilityScores.constitution
        ),
        armorClass: createInitialArmorClass(),
        initiative: createInitialInitiative(params.abilityScores.dexterity),
        proficiencyBonus: 2, // Level 1 proficiency bonus

        // Initialize skills and saves
        skills: createInitialSkills(params.startingClass),
        savingThrows: createInitialSavingThrows(params.startingClass),

        // Initialize Hollow Gear systems
        heatStress: createInitialHeatStress(),
        currency: createInitialCurrency(),
        maintenance: createInitialMaintenance(),

        // Initialize equipment and inventory
        equipment: { ...createDefaultEquipment(), ...params.equipment },
        inventory: createInitialInventory(),

        // Initialize progression
        experience: createInitialExperience(),
        advancement: createInitialAdvancement(),

        // Optional fields
        notes: params.notes,
      };

      // Add optional systems based on class
      if (classHasSpellcasting(params.startingClass)) {
        character.spellcasting = createInitialSpellcasting(
          params.startingClass,
          character.abilities
        );
      }

      if (classHasPsionics(params.startingClass)) {
        character.psionics = createInitialPsionics(
          params.startingClass,
          character.abilities
        );
      }

      // Final validation
      const finalValidation = validateCharacter(character);
      if (!finalValidation.success) {
        return finalValidation;
      }

      return { success: true, data: character };
    } catch (error) {
      return {
        success: false,
        error: [
          {
            field: 'character',
            message: `Character creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            code: 'CREATION_FAILED',
          },
        ],
      };
    }
  }

  /**
   * Validate a complete character for consistency and correctness
   */
  export function validateCharacter(
    character: HollowGearCharacter
  ): CharacterValidationResult {
    const errors: ValidationError[] = [];

    // Validate basic character data
    if (!character.name || character.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Character name is required',
        code: 'REQUIRED_FIELD',
      });
    }

    if (character.level < 1 || character.level > 20) {
      errors.push({
        field: 'level',
        message: 'Character level must be between 1 and 20',
        code: 'INVALID_RANGE',
      });
    }

    // Validate class levels sum to total level
    const classLevelSum = character.classes.reduce(
      (sum, cls) => sum + cls.level,
      0
    );
    if (classLevelSum !== character.level) {
      errors.push({
        field: 'classes',
        message: `Class levels (${classLevelSum}) do not match total level (${character.level})`,
        code: 'LEVEL_MISMATCH',
      });
    }

    // Validate ability scores
    const abilityErrors = validateAbilityScores(character.abilities);
    errors.push(...abilityErrors);

    // Validate hit points
    if (character.hitPoints.current < 0) {
      errors.push({
        field: 'hitPoints.current',
        message: 'Current hit points cannot be negative',
        code: 'INVALID_VALUE',
      });
    }

    if (character.hitPoints.maximum < 1) {
      errors.push({
        field: 'hitPoints.maximum',
        message: 'Maximum hit points must be at least 1',
        code: 'INVALID_VALUE',
      });
    }

    // Validate proficiency bonus matches level
    const expectedProficiencyBonus = Math.ceil(character.level / 4) + 1;
    if (character.proficiencyBonus !== expectedProficiencyBonus) {
      errors.push({
        field: 'proficiencyBonus',
        message: `Proficiency bonus (${character.proficiencyBonus}) does not match level ${character.level} (expected ${expectedProficiencyBonus})`,
        code: 'INVALID_VALUE',
      });
    }

    // Return validation result
    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: character };
  }

  /**
   * Update a character's last modified timestamp
   */
  export function updateLastModified(
    character: HollowGearCharacter
  ): HollowGearCharacter {
    return {
      ...character,
      lastModified: new Date(),
    };
  }

  /**
   * Get the character's total level across all classes
   */
  export function getTotalLevel(character: HollowGearCharacter): number {
    return character.classes.reduce((total, cls) => total + cls.level, 0);
  }

  /**
   * Check if character has a specific class
   */
  export function hasClass(
    character: HollowGearCharacter,
    className: import('./classes/index.js').HollowGearClass
  ): boolean {
    return character.classes.some(cls => cls.className === className);
  }

  /**
   * Get character's level in a specific class
   */
  export function getClassLevel(
    character: HollowGearCharacter,
    className: import('./classes/index.js').HollowGearClass
  ): number {
    const characterClass = character.classes.find(
      cls => cls.className === className
    );
    return characterClass?.level || 0;
  }

  /**
   * Check if character has spellcasting abilities
   */
  export function hasSpellcastingAbilities(
    character: HollowGearCharacter
  ): boolean {
    return character.spellcasting !== undefined;
  }

  /**
   * Check if character has psionic abilities
   */
  export function hasPsionicAbilities(character: HollowGearCharacter): boolean {
    return character.psionics !== undefined;
  }

  // Helper functions for character creation (implementations would be added)
  function validateCreationParams(
    params: CharacterCreationParams
  ): Result<CharacterCreationParams, ValidationError[]> {
    const errors: ValidationError[] = [];

    if (!params.name || params.name.trim().length === 0) {
      errors.push({
        field: 'name',
        message: 'Character name is required',
        code: 'REQUIRED_FIELD',
      });
    }

    // Validate ability scores are in valid range (3-18 for standard array/point buy)
    const abilities = params.abilityScores;
    for (const [ability, score] of Object.entries(abilities)) {
      if (score < 3 || score > 18) {
        errors.push({
          field: `abilityScores.${ability}`,
          message: `${ability} score must be between 3 and 18`,
          code: 'INVALID_RANGE',
        });
      }
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: params };
  }

  function getSpeciesTraits(species: EtherborneSpecies): SpeciesTraits {
    // This would import and use the species data
    // For now, return a placeholder
    return {} as SpeciesTraits;
  }

  function createStartingClass(
    className: import('./classes/index.js').HollowGearClass,
    abilities: CharacterCreationParams['abilityScores']
  ): CharacterClass {
    // This would create the initial class with level 1 features
    return {} as CharacterClass;
  }

  function createAbilityScores(
    scores: CharacterCreationParams['abilityScores'],
    species: EtherborneSpecies
  ): AbilityScores {
    // This would apply racial bonuses to the base scores
    return {} as AbilityScores;
  }

  function createInitialHitPoints(
    className: import('./classes/index.js').HollowGearClass,
    constitution: number
  ): HitPointData {
    return {} as HitPointData;
  }

  function createInitialArmorClass(): ArmorClassData {
    return {} as ArmorClassData;
  }

  function createInitialInitiative(dexterity: number): InitiativeData {
    return {} as InitiativeData;
  }

  function createInitialSkills(
    className: import('./classes/index.js').HollowGearClass
  ): SkillProficiencies {
    return {} as SkillProficiencies;
  }

  function createInitialSavingThrows(
    className: import('./classes/index.js').HollowGearClass
  ): SavingThrowProficiencies {
    return {} as SavingThrowProficiencies;
  }

  function createInitialHeatStress(): HeatStressData {
    return {} as HeatStressData;
  }

  function createInitialCurrency(): CurrencyData {
    return {} as CurrencyData;
  }

  function createInitialMaintenance(): MaintenanceData {
    return {} as MaintenanceData;
  }

  function createDefaultEquipment(): EquippedItems {
    return {} as EquippedItems;
  }

  function createInitialInventory(): InventoryData {
    return {} as InventoryData;
  }

  function createInitialExperience(): ExperienceData {
    return {} as ExperienceData;
  }

  function createInitialAdvancement(): AdvancementChoices {
    return {} as AdvancementChoices;
  }

  function classHasSpellcasting(
    className: import('./classes/index.js').HollowGearClass
  ): boolean {
    return className === 'arcanist' || className === 'templar';
  }

  function classHasPsionics(
    className: import('./classes/index.js').HollowGearClass
  ): boolean {
    return className === 'mindweaver';
  }

  function createInitialSpellcasting(
    className: import('./classes/index.js').HollowGearClass,
    abilities: AbilityScores
  ): SpellcastingData {
    return {} as SpellcastingData;
  }

  function createInitialPsionics(
    className: import('./classes/index.js').HollowGearClass,
    abilities: AbilityScores
  ): PsionicData {
    return {} as PsionicData;
  }

  function validateAbilityScores(abilities: AbilityScores): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate each ability score
    for (const [ability, scoreData] of Object.entries(abilities)) {
      const total =
        scoreData.base +
        scoreData.racial +
        scoreData.enhancement +
        scoreData.temporary;
      if (total < 1 || total > 30) {
        errors.push({
          field: `abilities.${ability}`,
          message: `Total ${ability} score must be between 1 and 30`,
          code: 'INVALID_RANGE',
        });
      }
    }

    return errors;
  }
}
