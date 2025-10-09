/**
 * Character utility functions for derived calculations and operations
 *
 * This module provides comprehensive utility functions for calculating derived values,
 * creating character summaries, and performing character comparisons and diffs.
 */

import type { HollowGearCharacter } from './character.js';
import type { AbilityScore } from './types/common.js';
import type { Skill } from './base/skills.js';

/**
 * Derived character statistics and calculated values
 */
export interface DerivedStats {
  /** Total ability modifiers including all bonuses */
  abilityModifiers: Record<AbilityScore, number>;
  /** Effective skill bonuses including proficiency and expertise */
  skillBonuses: Record<Skill, number>;
  /** Effective saving throw bonuses */
  savingThrowBonuses: Record<AbilityScore, number>;
  /** Current effective armor class */
  effectiveArmorClass: number;
  /** Current effective initiative bonus */
  effectiveInitiative: number;
  /** Current effective speed */
  effectiveSpeed: number;
  /** Passive perception score */
  passivePerception: number;
  /** Passive investigation score */
  passiveInvestigation: number;
  /** Passive insight score */
  passiveInsight: number;
  /** Current carrying capacity */
  carryingCapacity: number;
  /** Current encumbrance level */
  encumbranceLevel: EncumbranceLevel;
  /** Spell save DC (if applicable) */
  spellSaveDC?: number;
  /** Spell attack bonus (if applicable) */
  spellAttackBonus?: number;
  /** Psionic save DC (if applicable) */
  psionicSaveDC?: number;
  /** Current heat stress effects */
  heatStressEffects: HeatStressEffect[];
}

/**
 * Encumbrance levels
 */
export type EncumbranceLevel =
  | 'unencumbered'
  | 'encumbered'
  | 'heavily_encumbered'
  | 'overloaded';

/**
 * Heat stress effects on character performance
 */
export interface HeatStressEffect {
  /** Type of effect */
  type: 'dexterity_penalty' | 'speed_reduction' | 'disadvantage' | 'exhaustion';
  /** Severity of the effect */
  severity: number;
  /** Description of the effect */
  description: string;
}

/**
 * Character summary for display purposes
 */
export interface CharacterSummary {
  /** Basic character information */
  basic: {
    name: string;
    species: string;
    classes: string; // e.g., "Arcanist 3/Mindweaver 2"
    level: number;
    background?: string;
  };
  /** Core statistics */
  stats: {
    hitPoints: string; // e.g., "45/52"
    armorClass: number;
    initiative: number;
    speed: number;
    proficiencyBonus: number;
  };
  /** Ability scores with modifiers */
  abilities: Record<AbilityScore, { score: number; modifier: number }>;
  /** Key skills */
  keySkills: Array<{
    name: string;
    bonus: number;
    proficient: boolean;
    expertise: boolean;
  }>;
  /** Resources */
  resources: {
    currency: string; // e.g., "150 Cogs, 12 Gears, 2 Cores"
    heatStress: number;
    spellSlots?: string;
    aetherFluxPoints?: string;
    resonanceCharges?: string;
  };
  /** Equipment summary */
  equipment: {
    weapons: string[];
    armor?: string;
    shield?: string;
    accessories: string[];
  };
  /** Status effects */
  status: {
    conditions: string[];
    heatStressLevel: number;
    maintainedEffects: string[];
  };
}

/**
 * Character comparison result
 */
export interface CharacterComparison {
  /** Characters being compared */
  characters: {
    left: { name: string; id: string };
    right: { name: string; id: string };
  };
  /** Ability score differences */
  abilityDifferences: Record<AbilityScore, number>;
  /** Skill bonus differences */
  skillDifferences: Record<Skill, number>;
  /** Level and class differences */
  levelDifference: number;
  classDifferences: string[];
  /** Equipment differences */
  equipmentDifferences: {
    leftOnly: string[];
    rightOnly: string[];
    different: Array<{ item: string; leftValue: string; rightValue: string }>;
  };
  /** Resource differences */
  resourceDifferences: {
    currency: Record<string, number>;
    hitPoints: number;
    other: Record<string, any>;
  };
}

/**
 * Character diff for tracking changes
 */
export interface CharacterDiff {
  /** Character being diffed */
  character: { name: string; id: string };
  /** Timestamp of the diff */
  timestamp: Date;
  /** Changed fields */
  changes: Array<{
    field: string;
    oldValue: any;
    newValue: any;
    type: 'added' | 'removed' | 'modified';
  }>;
  /** Summary of changes */
  summary: {
    totalChanges: number;
    categoryCounts: Record<string, number>;
    significance: 'minor' | 'moderate' | 'major';
  };
}

/**
 * Character utility functions
 */
export namespace CharacterUtilities {
  /**
   * Calculate all derived statistics for a character
   */
  export function calculateDerivedStats(
    character: HollowGearCharacter
  ): DerivedStats {
    const abilityModifiers = calculateAbilityModifiers(character);
    const skillBonuses = calculateSkillBonuses(character, abilityModifiers);
    const savingThrowBonuses = calculateSavingThrowBonuses(
      character,
      abilityModifiers
    );

    return {
      abilityModifiers,
      skillBonuses,
      savingThrowBonuses,
      effectiveArmorClass: calculateEffectiveArmorClass(character),
      effectiveInitiative: calculateEffectiveInitiative(
        character,
        abilityModifiers
      ),
      effectiveSpeed: calculateEffectiveSpeed(character),
      passivePerception: 10 + skillBonuses.perception,
      passiveInvestigation: 10 + skillBonuses.investigation,
      passiveInsight: 10 + skillBonuses.insight,
      carryingCapacity: calculateCarryingCapacity(character, abilityModifiers),
      encumbranceLevel: calculateEncumbranceLevel(character),
      spellSaveDC: calculateSpellSaveDC(character, abilityModifiers),
      spellAttackBonus: calculateSpellAttackBonus(character, abilityModifiers),
      psionicSaveDC: calculatePsionicSaveDC(character, abilityModifiers),
      heatStressEffects: calculateHeatStressEffects(character),
    };
  }

  /**
   * Create a character summary for display
   */
  export function createCharacterSummary(
    character: HollowGearCharacter
  ): CharacterSummary {
    const derivedStats = calculateDerivedStats(character);

    return {
      basic: {
        name: character.name,
        species: character.species,
        classes: formatClassString(character.classes),
        level: character.level,
        background: character.background,
      },
      stats: {
        hitPoints: `${character.hitPoints.current}/${character.hitPoints.maximum}`,
        armorClass: derivedStats.effectiveArmorClass,
        initiative: derivedStats.effectiveInitiative,
        speed: derivedStats.effectiveSpeed,
        proficiencyBonus: character.proficiencyBonus,
      },
      abilities: Object.fromEntries(
        Object.entries(derivedStats.abilityModifiers).map(
          ([ability, modifier]) => [
            ability,
            {
              score: getTotalAbilityScore(
                character.abilities[ability as AbilityScore]
              ),
              modifier,
            },
          ]
        )
      ) as Record<AbilityScore, { score: number; modifier: number }>,
      keySkills: getKeySkills(character, derivedStats.skillBonuses),
      resources: {
        currency: formatCurrency(character.currency),
        heatStress: character.heatStress.currentLevel,
        spellSlots: character.spellcasting
          ? formatSpellSlots(character.spellcasting)
          : undefined,
        aetherFluxPoints: character.spellcasting?.resources.arcanist
          ? formatResourcePool(
              character.spellcasting.resources.arcanist.aetherFluxPoints
            )
          : character.psionics
            ? formatResourcePool(character.psionics.aetherFluxPoints)
            : undefined,
        resonanceCharges: character.spellcasting?.resources.templar
          ? formatResourcePool(
              character.spellcasting.resources.templar.resonanceCharges
            )
          : undefined,
      },
      equipment: {
        weapons: getEquippedWeapons(character),
        armor: getEquippedArmor(character),
        shield: getEquippedShield(character),
        accessories: getEquippedAccessories(character),
      },
      status: {
        conditions: getCurrentConditions(character),
        heatStressLevel: character.heatStress.currentLevel,
        maintainedEffects: getMaintainedEffects(character),
      },
    };
  }

  /**
   * Compare two characters and return differences
   */
  export function compareCharacters(
    leftCharacter: HollowGearCharacter,
    rightCharacter: HollowGearCharacter
  ): CharacterComparison {
    const leftStats = calculateDerivedStats(leftCharacter);
    const rightStats = calculateDerivedStats(rightCharacter);

    return {
      characters: {
        left: { name: leftCharacter.name, id: leftCharacter.id },
        right: { name: rightCharacter.name, id: rightCharacter.id },
      },
      abilityDifferences: calculateAbilityDifferences(
        leftStats.abilityModifiers,
        rightStats.abilityModifiers
      ),
      skillDifferences: calculateSkillDifferences(
        leftStats.skillBonuses,
        rightStats.skillBonuses
      ),
      levelDifference: rightCharacter.level - leftCharacter.level,
      classDifferences: calculateClassDifferences(
        leftCharacter.classes,
        rightCharacter.classes
      ),
      equipmentDifferences: calculateEquipmentDifferences(
        leftCharacter,
        rightCharacter
      ),
      resourceDifferences: calculateResourceDifferences(
        leftCharacter,
        rightCharacter
      ),
    };
  }

  /**
   * Create a diff showing changes between two versions of the same character
   */
  export function createCharacterDiff(
    oldCharacter: HollowGearCharacter,
    newCharacter: HollowGearCharacter
  ): CharacterDiff {
    const changes: CharacterDiff['changes'] = [];

    // Compare all fields recursively
    compareFields('', oldCharacter, newCharacter, changes);

    // Calculate summary
    const categoryCounts: Record<string, number> = {};
    changes.forEach(change => {
      const category = change.field.split('.')[0];
      if (category) {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      }
    });

    const significance = determineSignificance(changes);

    return {
      character: { name: newCharacter.name, id: newCharacter.id },
      timestamp: new Date(),
      changes,
      summary: {
        totalChanges: changes.length,
        categoryCounts,
        significance,
      },
    };
  }

  /**
   * Get character's total modifier for a specific ability
   */
  export function getTotalAbilityModifier(
    character: HollowGearCharacter,
    ability: AbilityScore
  ): number {
    const abilityData = character.abilities[ability];
    const totalScore =
      abilityData.base +
      abilityData.racial +
      abilityData.enhancement +
      abilityData.temporary;
    return Math.floor((totalScore - 10) / 2);
  }

  /**
   * Get character's skill bonus for a specific skill
   */
  export function getSkillBonus(
    character: HollowGearCharacter,
    skill: Skill
  ): number {
    const derivedStats = calculateDerivedStats(character);
    return derivedStats.skillBonuses[skill];
  }

  /**
   * Check if character is proficient in a skill
   */
  export function isSkillProficient(
    character: HollowGearCharacter,
    skill: Skill
  ): boolean {
    return (
      character.skills[skill].level === 'proficient' ||
      character.skills[skill].level === 'expertise'
    );
  }

  /**
   * Check if character has expertise in a skill
   */
  export function hasSkillExpertise(
    character: HollowGearCharacter,
    skill: Skill
  ): boolean {
    return character.skills[skill].level === 'expertise';
  }

  /**
   * Get character's current encumbrance status
   */
  export function getEncumbranceStatus(character: HollowGearCharacter): {
    level: EncumbranceLevel;
    current: number;
    capacity: number;
    percentage: number;
  } {
    const derivedStats = calculateDerivedStats(character);
    const currentWeight = calculateCurrentWeight(character);

    return {
      level: derivedStats.encumbranceLevel,
      current: currentWeight,
      capacity: derivedStats.carryingCapacity,
      percentage: (currentWeight / derivedStats.carryingCapacity) * 100,
    };
  }

  // Private helper functions

  function calculateAbilityModifiers(
    character: HollowGearCharacter
  ): Record<AbilityScore, number> {
    const modifiers: Record<AbilityScore, number> = {} as any;

    for (const ability of [
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma',
    ] as AbilityScore[]) {
      modifiers[ability] = getTotalAbilityModifier(character, ability);
    }

    return modifiers;
  }

  function calculateSkillBonuses(
    character: HollowGearCharacter,
    abilityModifiers: Record<AbilityScore, number>
  ): Record<Skill, number> {
    const bonuses: Record<Skill, number> = {} as any;

    // Import skill abilities from the skills module
    const { SkillUtils } = require('./base/skills.js');

    for (const [skill, ability] of Object.entries(
      SkillUtils.SKILL_ABILITIES
    ) as [Skill, AbilityScore][]) {
      const skillData = character.skills[skill];
      let bonus = abilityModifiers[ability];

      if (skillData.level === 'proficient') {
        bonus += character.proficiencyBonus;
      } else if (skillData.level === 'expertise') {
        bonus += character.proficiencyBonus * 2; // Double proficiency for expertise
      }

      // Add any miscellaneous bonus
      bonus += skillData.bonus;

      bonuses[skill] = bonus;
    }

    return bonuses;
  }

  function calculateSavingThrowBonuses(
    character: HollowGearCharacter,
    abilityModifiers: Record<AbilityScore, number>
  ): Record<AbilityScore, number> {
    const bonuses: Record<AbilityScore, number> = {} as any;

    for (const ability of [
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma',
    ] as AbilityScore[]) {
      let bonus = abilityModifiers[ability];

      if (character.savingThrows[ability].proficient) {
        bonus += character.proficiencyBonus;
      }

      bonuses[ability] = bonus;
    }

    return bonuses;
  }

  function calculateEffectiveArmorClass(
    character: HollowGearCharacter
  ): number {
    // This would calculate AC based on equipped armor, dex modifier, shields, etc.
    // For now, return the base AC from character data
    return character.armorClass.total;
  }

  function calculateEffectiveInitiative(
    character: HollowGearCharacter,
    abilityModifiers: Record<AbilityScore, number>
  ): number {
    return abilityModifiers.dexterity + (character.initiative.bonus || 0);
  }

  function calculateEffectiveSpeed(character: HollowGearCharacter): number {
    // This would calculate speed based on species, equipment, conditions, etc.
    // For now, return a default based on species
    return 30; // Default speed, would be calculated from species traits
  }

  function calculateCarryingCapacity(
    character: HollowGearCharacter,
    abilityModifiers: Record<AbilityScore, number>
  ): number {
    const strengthScore = getTotalAbilityScore(character.abilities.strength);
    return strengthScore * 15; // Standard D&D 5e carrying capacity
  }

  function calculateEncumbranceLevel(
    character: HollowGearCharacter
  ): EncumbranceLevel {
    const currentWeight = calculateCurrentWeight(character);
    const capacity = calculateCarryingCapacity(
      character,
      calculateAbilityModifiers(character)
    );

    if (currentWeight <= capacity) return 'unencumbered';
    if (currentWeight <= capacity * 2) return 'encumbered';
    if (currentWeight <= capacity * 3) return 'heavily_encumbered';
    return 'overloaded';
  }

  function calculateCurrentWeight(character: HollowGearCharacter): number {
    // This would sum up all carried item weights
    // For now, return 0 as placeholder
    return 0;
  }

  function calculateSpellSaveDC(
    character: HollowGearCharacter,
    abilityModifiers: Record<AbilityScore, number>
  ): number | undefined {
    if (!character.spellcasting) return undefined;

    const spellcastingAbility = character.spellcasting.spellcastingAbility;
    const modifier = abilityModifiers[spellcastingAbility];
    return modifier !== undefined
      ? 8 + character.proficiencyBonus + modifier
      : undefined;
  }

  function calculateSpellAttackBonus(
    character: HollowGearCharacter,
    abilityModifiers: Record<AbilityScore, number>
  ): number | undefined {
    if (!character.spellcasting) return undefined;

    const spellcastingAbility = character.spellcasting.spellcastingAbility;
    const modifier = abilityModifiers[spellcastingAbility];
    return modifier !== undefined
      ? character.proficiencyBonus + modifier
      : undefined;
  }

  function calculatePsionicSaveDC(
    character: HollowGearCharacter,
    abilityModifiers: Record<AbilityScore, number>
  ): number | undefined {
    if (!character.psionics) return undefined;

    const psionicAbility = character.psionics.primaryAbility;
    return 8 + character.proficiencyBonus + abilityModifiers[psionicAbility];
  }

  function calculateHeatStressEffects(
    character: HollowGearCharacter
  ): HeatStressEffect[] {
    const effects: HeatStressEffect[] = [];
    const level = character.heatStress.currentLevel;

    if (level >= 1) {
      effects.push({
        type: 'dexterity_penalty',
        severity: 1,
        description: 'Dexterity checks and saves have disadvantage',
      });
    }

    if (level >= 2) {
      effects.push({
        type: 'speed_reduction',
        severity: 10,
        description: 'Speed reduced by 10 feet',
      });
    }

    if (level >= 3) {
      effects.push({
        type: 'exhaustion',
        severity: 1,
        description: 'Gain one level of exhaustion',
      });
    }

    return effects;
  }

  function getTotalAbilityScore(abilityData: any): number {
    return (
      abilityData.base +
      abilityData.racial +
      abilityData.enhancement +
      abilityData.temporary
    );
  }

  function formatClassString(classes: any[]): string {
    return classes.map(cls => `${cls.className} ${cls.level}`).join('/');
  }

  function getKeySkills(
    character: HollowGearCharacter,
    skillBonuses: Record<Skill, number>
  ): any[] {
    // Return top skills or proficient skills
    return Object.entries(skillBonuses)
      .filter(([skill]) => {
        const skillData = character.skills[skill as Skill];
        return (
          skillData.level === 'proficient' || skillData.level === 'expertise'
        );
      })
      .map(([skill, bonus]) => {
        const skillData = character.skills[skill as Skill];
        return {
          name: skill,
          bonus,
          proficient: skillData.level !== 'none',
          expertise: skillData.level === 'expertise',
        };
      })
      .slice(0, 6); // Top 6 skills
  }

  function formatCurrency(currency: any): string {
    const parts = [];
    if (currency.cores > 0) parts.push(`${currency.cores} Cores`);
    if (currency.gears > 0) parts.push(`${currency.gears} Gears`);
    if (currency.cogs > 0) parts.push(`${currency.cogs} Cogs`);
    return parts.join(', ') || '0 Cogs';
  }

  function formatSpellSlots(spellcasting: any): string {
    // Format spell slots by level
    return 'Spell slots formatted'; // Placeholder
  }

  function formatResourcePool(pool: any): string {
    return `${pool.current}/${pool.maximum}`;
  }

  function getEquippedWeapons(character: HollowGearCharacter): string[] {
    // Return list of equipped weapon names
    return []; // Placeholder
  }

  function getEquippedArmor(
    character: HollowGearCharacter
  ): string | undefined {
    // Return the armor ID as string, or undefined if no armor equipped
    return character.equipment.armor;
  }

  function getEquippedShield(
    character: HollowGearCharacter
  ): string | undefined {
    // Return equipped shield name
    return undefined; // Placeholder
  }

  function getEquippedAccessories(character: HollowGearCharacter): string[] {
    // Return list of equipped accessory names
    return []; // Placeholder
  }

  function getCurrentConditions(character: HollowGearCharacter): string[] {
    // Return list of current conditions
    return []; // Placeholder
  }

  function getMaintainedEffects(character: HollowGearCharacter): string[] {
    // Return list of maintained spell/psionic effects
    return []; // Placeholder
  }

  function calculateAbilityDifferences(
    left: Record<AbilityScore, number>,
    right: Record<AbilityScore, number>
  ): Record<AbilityScore, number> {
    const differences: Record<AbilityScore, number> = {} as any;

    for (const ability of [
      'strength',
      'dexterity',
      'constitution',
      'intelligence',
      'wisdom',
      'charisma',
    ] as AbilityScore[]) {
      differences[ability] = right[ability] - left[ability];
    }

    return differences;
  }

  function calculateSkillDifferences(
    left: Record<Skill, number>,
    right: Record<Skill, number>
  ): Record<Skill, number> {
    const differences: Record<Skill, number> = {} as any;

    for (const skill in left) {
      differences[skill as Skill] =
        right[skill as Skill] - left[skill as Skill];
    }

    return differences;
  }

  function calculateClassDifferences(
    leftClasses: any[],
    rightClasses: any[]
  ): string[] {
    const differences: string[] = [];

    // Get all unique class names from both characters
    const leftClassNames = new Set(leftClasses.map(cls => cls.className));
    const rightClassNames = new Set(rightClasses.map(cls => cls.className));

    // Find classes that are in left but not in right
    for (const className of leftClassNames) {
      if (!rightClassNames.has(className)) {
        differences.push(className);
      }
    }

    // Find classes that are in right but not in left
    for (const className of rightClassNames) {
      if (!leftClassNames.has(className)) {
        differences.push(className);
      }
    }

    return differences;
  }

  function calculateEquipmentDifferences(
    left: HollowGearCharacter,
    right: HollowGearCharacter
  ): any {
    // Calculate equipment differences
    return {
      leftOnly: [],
      rightOnly: [],
      different: [],
    }; // Placeholder
  }

  function calculateResourceDifferences(
    left: HollowGearCharacter,
    right: HollowGearCharacter
  ): any {
    // Calculate resource differences
    return {
      currency: {},
      hitPoints: right.hitPoints.current - left.hitPoints.current,
      other: {},
    }; // Placeholder
  }

  function compareFields(
    path: string,
    oldObj: any,
    newObj: any,
    changes: CharacterDiff['changes']
  ): void {
    // Handle null/undefined cases
    if (oldObj === null || oldObj === undefined) {
      if (newObj !== null && newObj !== undefined) {
        changes.push({
          field: path,
          oldValue: oldObj,
          newValue: newObj,
          type: 'added',
        });
      }
      return;
    }

    if (newObj === null || newObj === undefined) {
      changes.push({
        field: path,
        oldValue: oldObj,
        newValue: newObj,
        type: 'removed',
      });
      return;
    }

    // Handle primitive values
    if (typeof oldObj !== 'object' || typeof newObj !== 'object') {
      if (oldObj !== newObj) {
        changes.push({
          field: path,
          oldValue: oldObj,
          newValue: newObj,
          type: 'modified',
        });
      }
      return;
    }

    // Handle arrays
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      // For arrays, compare length and elements
      if (oldObj.length !== newObj.length) {
        changes.push({
          field: `${path}.length`,
          oldValue: oldObj.length,
          newValue: newObj.length,
          type: 'modified',
        });
      }

      const maxLength = Math.max(oldObj.length, newObj.length);
      for (let i = 0; i < maxLength; i++) {
        const itemPath = path ? `${path}[${i}]` : `[${i}]`;
        compareFields(itemPath, oldObj[i], newObj[i], changes);
      }
      return;
    }

    // Handle objects - skip certain fields that shouldn't be tracked
    const skipFields = new Set(['id', 'created', 'lastModified', 'version']);
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);

    for (const key of allKeys) {
      if (skipFields.has(key)) continue;

      const fieldPath = path ? `${path}.${key}` : key;
      compareFields(fieldPath, oldObj[key], newObj[key], changes);
    }
  }

  function determineSignificance(
    changes: CharacterDiff['changes']
  ): 'minor' | 'moderate' | 'major' {
    if (changes.length === 0) return 'minor';
    if (changes.length < 5) return 'minor';
    if (changes.length < 15) return 'moderate';
    return 'major';
  }
}
