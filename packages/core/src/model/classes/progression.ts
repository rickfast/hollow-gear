/**
 * Class feature progression system
 *
 * This module handles level-based feature acquisition, multiclassing interactions,
 * and character advancement calculations for all Hollow Gear classes.
 */

import type {
  HollowGearClass,
  CharacterClass,
  ClassFeature,
  ClassArchetype,
  ClassSpellcasting,
  ClassPsionics,
  ResourcePool,
  SpellcastingProgression,
} from './index.js';
import type { ClassInfo, ClassResourceInfo } from './class-data.js';
import { getClassInfo } from './class-data.js';
import type { AbilityScore } from '../types/common.js';

/**
 * Represents the progression data for a character's classes
 */
export interface CharacterProgression {
  /** All classes the character has levels in */
  classes: CharacterClass[];
  /** Total character level */
  totalLevel: number;
  /** Proficiency bonus based on total level */
  proficiencyBonus: number;
  /** All features gained from all classes */
  allFeatures: ClassFeature[];
  /** Combined spellcasting progression if applicable */
  combinedSpellcasting?: CombinedSpellcasting;
  /** All resource pools from all classes */
  resourcePools: ResourcePool[];
}

/**
 * Combined spellcasting information for multiclass characters
 */
export interface CombinedSpellcasting {
  /** Effective caster level */
  casterLevel: number;
  /** Spell slots available */
  spellSlots: number[];
  /** All known spells from all classes */
  allKnownSpells: KnownSpell[];
  /** Spellcasting abilities by class */
  spellcastingAbilities: Partial<Record<HollowGearClass, AbilityScore>>;
}

/**
 * A known spell with its source class
 */
export interface KnownSpell {
  /** Spell identifier */
  id: string;
  /** Spell name */
  name: string;
  /** Spell level */
  level: number;
  /** Class that granted this spell */
  sourceClass: HollowGearClass;
  /** Spellcasting type */
  castingType: 'arcanist' | 'templar';
}

/**
 * Multiclassing prerequisites
 */
export interface MulticlassPrerequisites {
  /** Required ability scores */
  abilities: Partial<Record<AbilityScore, number>>;
  /** Other requirements */
  other?: string[];
}

/**
 * Calculate proficiency bonus based on total character level
 */
export function calculateProficiencyBonus(totalLevel: number): number {
  return Math.ceil(totalLevel / 4) + 1;
}

/**
 * Calculate the total character level from all classes
 */
export function calculateTotalLevel(classes: CharacterClass[]): number {
  return classes.reduce(
    (total, characterClass) => total + characterClass.level,
    0
  );
}

/**
 * Get all features available to a character at their current levels
 */
export function getAllFeatures(classes: CharacterClass[]): ClassFeature[] {
  const allFeatures: ClassFeature[] = [];

  for (const characterClass of classes) {
    // Get base class features
    const classInfo = getClassInfo(characterClass.className);
    const baseFeatures = getClassFeaturesForLevel(
      characterClass.className,
      characterClass.level
    );
    allFeatures.push(...baseFeatures);

    // Get archetype features if applicable
    if (characterClass.archetype) {
      const archetypeFeatures = getArchetypeFeaturesForLevel(
        characterClass.archetype,
        characterClass.level
      );
      allFeatures.push(...archetypeFeatures);
    }
  }

  return allFeatures;
}

/**
 * Get base class features for a specific level
 */
export function getClassFeaturesForLevel(
  className: HollowGearClass,
  level: number
): ClassFeature[] {
  const features: ClassFeature[] = [];

  // Add level-based features based on class
  switch (className) {
    case 'arcanist':
      features.push(...getArcanistFeatures(level));
      break;
    case 'templar':
      features.push(...getTemplarFeatures(level));
      break;
    case 'tweaker':
      features.push(...getTweakerFeatures(level));
      break;
    case 'shadehand':
      features.push(...getShadehandFeatures(level));
      break;
    case 'vanguard':
      features.push(...getVanguardFeatures(level));
      break;
    case 'artifex':
      features.push(...getArtifexFeatures(level));
      break;
    case 'mindweaver':
      features.push(...getMindweaverFeatures(level));
      break;
  }

  return features.filter(feature => feature.level <= level);
}

/**
 * Get archetype features for a specific level
 */
export function getArchetypeFeaturesForLevel(
  archetype: ClassArchetype,
  level: number
): ClassFeature[] {
  return archetype.features.filter(feature => feature.level <= level);
}

/**
 * Calculate combined spellcasting progression for multiclass characters
 */
export function calculateCombinedSpellcasting(
  classes: CharacterClass[]
): CombinedSpellcasting | undefined {
  const spellcastingClasses = classes.filter(cls => cls.spellcasting);

  if (spellcastingClasses.length === 0) {
    return undefined;
  }

  let totalCasterLevel = 0;
  const spellcastingAbilities: Partial<Record<HollowGearClass, AbilityScore>> =
    {};
  const allKnownSpells: KnownSpell[] = [];

  // Calculate effective caster level
  for (const characterClass of spellcastingClasses) {
    if (!characterClass.spellcasting) continue;

    const progression = characterClass.spellcasting.progression;
    let casterLevel = 0;

    switch (progression) {
      case 'full':
        casterLevel = characterClass.level;
        break;
      case 'half':
        casterLevel = Math.floor(characterClass.level / 2);
        break;
      case 'third':
        casterLevel = Math.floor(characterClass.level / 3);
        break;
      case 'warlock':
        // Warlock-style doesn't contribute to multiclass spellcasting
        casterLevel = 0;
        break;
    }

    totalCasterLevel += casterLevel;
    spellcastingAbilities[characterClass.className] =
      characterClass.spellcasting.ability;

    // Add known spells (this would be populated from actual spell data)
    // For now, we'll leave this as a placeholder
  }

  // Calculate spell slots based on total caster level
  const spellSlots = calculateSpellSlots(totalCasterLevel) || [];

  return {
    casterLevel: totalCasterLevel,
    spellSlots,
    allKnownSpells,
    spellcastingAbilities,
  };
}

/**
 * Calculate spell slots for a given caster level
 */
export function calculateSpellSlots(casterLevel: number): number[] {
  if (casterLevel === 0) return [];

  // Standard D&D 5e spell slot progression
  const spellSlotTable: number[][] = [
    [2, 0, 0, 0, 0, 0, 0, 0, 0], // Level 1
    [3, 0, 0, 0, 0, 0, 0, 0, 0], // Level 2
    [4, 2, 0, 0, 0, 0, 0, 0, 0], // Level 3
    [4, 3, 0, 0, 0, 0, 0, 0, 0], // Level 4
    [4, 3, 2, 0, 0, 0, 0, 0, 0], // Level 5
    [4, 3, 3, 0, 0, 0, 0, 0, 0], // Level 6
    [4, 3, 3, 1, 0, 0, 0, 0, 0], // Level 7
    [4, 3, 3, 2, 0, 0, 0, 0, 0], // Level 8
    [4, 3, 3, 3, 1, 0, 0, 0, 0], // Level 9
    [4, 3, 3, 3, 2, 0, 0, 0, 0], // Level 10
    [4, 3, 3, 3, 2, 1, 0, 0, 0], // Level 11
    [4, 3, 3, 3, 2, 1, 0, 0, 0], // Level 12
    [4, 3, 3, 3, 2, 1, 1, 0, 0], // Level 13
    [4, 3, 3, 3, 2, 1, 1, 0, 0], // Level 14
    [4, 3, 3, 3, 2, 1, 1, 1, 0], // Level 15
    [4, 3, 3, 3, 2, 1, 1, 1, 0], // Level 16
    [4, 3, 3, 3, 2, 1, 1, 1, 1], // Level 17
    [4, 3, 3, 3, 3, 1, 1, 1, 1], // Level 18
    [4, 3, 3, 3, 3, 2, 1, 1, 1], // Level 19
    [4, 3, 3, 3, 3, 2, 2, 1, 1], // Level 20
  ];

  const clampedLevel = Math.min(Math.max(casterLevel, 1), 20);
  return spellSlotTable[clampedLevel - 1] || [];
}

/**
 * Get multiclassing prerequisites for a class
 */
export function getMulticlassPrerequisites(
  className: HollowGearClass
): MulticlassPrerequisites {
  const prerequisites: Record<HollowGearClass, MulticlassPrerequisites> = {
    arcanist: {
      abilities: { intelligence: 13 },
    },
    templar: {
      abilities: { charisma: 13 },
    },
    tweaker: {
      abilities: { constitution: 13 },
    },
    shadehand: {
      abilities: { dexterity: 13 },
    },
    vanguard: {
      abilities: { strength: 13 },
    },
    artifex: {
      abilities: { intelligence: 13 },
    },
    mindweaver: {
      abilities: { intelligence: 13, wisdom: 13 }, // Either one
      other: ['Must have Intelligence 13 OR Wisdom 13'],
    },
  };

  return prerequisites[className];
}

/**
 * Check if a character meets multiclassing prerequisites
 */
export function meetsMulticlassPrerequisites(
  className: HollowGearClass,
  abilityScores: Record<AbilityScore, number>
): boolean {
  const prerequisites = getMulticlassPrerequisites(className);

  // Special case for Mindweaver (needs either INT or WIS 13)
  if (className === 'mindweaver') {
    return abilityScores.intelligence >= 13 || abilityScores.wisdom >= 13;
  }

  // Check all required ability scores
  for (const [ability, requiredScore] of Object.entries(
    prerequisites.abilities
  )) {
    if (abilityScores[ability as AbilityScore] < requiredScore) {
      return false;
    }
  }

  return true;
}

/**
 * Calculate all resource pools for a character
 */
export function calculateResourcePools(
  classes: CharacterClass[]
): ResourcePool[] {
  const pools: ResourcePool[] = [];

  for (const characterClass of classes) {
    const classInfo = getClassInfo(characterClass.className);

    for (const resourceInfo of classInfo.classResources) {
      const maximum = calculateResourceMaximum(
        resourceInfo,
        characterClass.level
      );

      pools.push({
        type: resourceInfo.type,
        current: maximum,
        maximum,
        temporary: 0,
        recovery: resourceInfo.recovery,
      });
    }
  }

  return pools;
}

/**
 * Calculate the maximum value for a resource at a given level
 */
export function calculateResourceMaximum(
  resourceInfo: ClassResourceInfo,
  level: number
): number {
  let maximum = resourceInfo.baseAmount;

  switch (resourceInfo.scaling.type) {
    case 'linear':
      maximum += (level - 1) * (resourceInfo.scaling.value as number);
      break;
    case 'table':
      const table = resourceInfo.scaling.value as number[];
      maximum =
        table[Math.min(level - 1, table.length - 1)] || resourceInfo.baseAmount;
      break;
    case 'proficiency_bonus':
      const profBonus = calculateProficiencyBonus(level);
      maximum += profBonus * (resourceInfo.scaling.value as number);
      break;
    case 'ability_modifier':
      // This would need the actual ability score, so we'll use a placeholder
      // In practice, this would be calculated with the character's ability scores
      maximum += 3; // Placeholder for ability modifier
      break;
  }

  return Math.max(maximum, 0);
}

// Class-specific feature definitions
function getArcanistFeatures(level: number): ClassFeature[] {
  const features: ClassFeature[] = [
    {
      id: 'arcanist_spellcasting',
      name: 'Spellcasting',
      level: 1,
      description: 'You can cast spells using Aether Formulae.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'special',
            target: 'self',
            value: 'Spellcasting ability',
          },
        ],
      },
    },
    {
      id: 'arcanist_tinker_savant',
      name: 'Tinker Savant',
      level: 1,
      description: "You gain proficiency in Tinker's Tools.",
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'proficiency',
            target: 'self',
            value: "Tinker's Tools",
          },
        ],
      },
    },
    {
      id: 'arcanist_spell_recharge',
      name: 'Spell Recharge',
      level: 2,
      description:
        'Recover one spent slot after a short rest by burning 1 ⚙️ worth of materials.',
      mechanics: {
        type: 'action',
        effects: [
          {
            type: 'special',
            target: 'self',
            value: 'Spell slot recovery',
          },
        ],
      },
      uses: {
        maximum: 1,
        current: 1,
        restoreOn: 'short',
      },
    },
  ];

  return features;
}

function getTemplarFeatures(level: number): ClassFeature[] {
  const features: ClassFeature[] = [
    {
      id: 'templar_resonant_smite',
      name: 'Resonant Smite',
      level: 1,
      description:
        'Consume 1 Resonance Charge to deal +2d8 radiant or lightning damage.',
      mechanics: {
        type: 'free',
        effects: [
          {
            type: 'damage_bonus',
            target: 'enemy',
            value: '2d8 radiant or lightning',
          },
        ],
        activation: {
          actionType: 'free',
          cost: {
            type: 'resonance_charge',
            amount: 1,
          },
        },
      },
    },
    {
      id: 'templar_faith_engine',
      name: 'Faith Engine',
      level: 1,
      description: 'Your armor or weapon acts as a psionic focus.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'special',
            target: 'equipment',
            value: 'Equipment as psionic focus',
          },
        ],
      },
    },
    {
      id: 'templar_spellcasting',
      name: 'Spellcasting',
      level: 2,
      description: 'You can cast spells using Resonance Charges.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'special',
            target: 'self',
            value: 'Spellcasting ability',
          },
        ],
      },
    },
  ];

  return features;
}

function getTweakerFeatures(level: number): ClassFeature[] {
  const features: ClassFeature[] = [
    {
      id: 'tweaker_adrenal_surge',
      name: 'Adrenal Surge',
      level: 1,
      description:
        'Bonus action, gain +2 STR and +10 ft speed for 1 minute (1/short rest).',
      mechanics: {
        type: 'bonus_action',
        effects: [
          {
            type: 'ability_bonus',
            target: 'self',
            value: '2 STR',
          },
          {
            type: 'speed_bonus',
            target: 'self',
            value: '10',
          },
        ],
        duration: {
          type: 'minutes',
          value: 1,
        },
      },
      uses: {
        maximum: 1,
        current: 1,
        restoreOn: 'short',
      },
    },
    {
      id: 'tweaker_enhanced_metabolism',
      name: 'Enhanced Metabolism',
      level: 1,
      description:
        'You regain an extra 1d4 HP whenever you consume a healing effect.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'hp_bonus',
            target: 'self',
            value: '1d4',
          },
        ],
      },
    },
  ];

  return features;
}

function getShadehandFeatures(level: number): ClassFeature[] {
  const features: ClassFeature[] = [
    {
      id: 'shadehand_sneak_attack',
      name: 'Sneak Attack',
      level: 1,
      description:
        'Deal extra damage when you have advantage or an ally is adjacent to your target.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'damage_bonus',
            target: 'enemy',
            value: `${Math.ceil(level / 2)}d6`,
          },
        ],
      },
    },
    {
      id: 'shadehand_silent_tools',
      name: 'Silent Tools',
      level: 1,
      description: "You have proficiency with Thieves' Tools and Disguise Kit.",
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'proficiency',
            target: 'self',
            value: "Thieves' Tools, Disguise Kit",
          },
        ],
      },
    },
  ];

  return features;
}

function getVanguardFeatures(level: number): ClassFeature[] {
  const features: ClassFeature[] = [
    {
      id: 'vanguard_defensive_stance',
      name: 'Defensive Stance',
      level: 1,
      description: 'Add +2 AC when you take the Dodge action.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'ac_bonus',
            target: 'self',
            value: '2',
          },
        ],
      },
    },
    {
      id: 'vanguard_steam_charge',
      name: 'Steam Charge',
      level: 1,
      description:
        'Dash as a bonus action; next melee attack deals +1d6 damage.',
      mechanics: {
        type: 'bonus_action',
        effects: [
          {
            type: 'damage_bonus',
            target: 'enemy',
            value: '1d6',
          },
        ],
      },
    },
  ];

  return features;
}

function getArtifexFeatures(level: number): ClassFeature[] {
  const features: ClassFeature[] = [
    {
      id: 'artifex_tinkers_expertise',
      name: "Tinker's Expertise",
      level: 1,
      description: "Double proficiency in Tinker's Tools.",
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'expertise',
            target: 'self',
            value: "Tinker's Tools",
          },
        ],
      },
    },
    {
      id: 'artifex_deploy_drone',
      name: 'Deploy Drone',
      level: 1,
      description:
        'Create a small construct familiar (AC 12, HP 10, range 60 ft).',
      mechanics: {
        type: 'action',
        effects: [
          {
            type: 'special',
            target: 'area',
            value: 'Deploy construct drone',
          },
        ],
      },
    },
  ];

  return features;
}

function getMindweaverFeatures(level: number): ClassFeature[] {
  const features: ClassFeature[] = [
    {
      id: 'mindweaver_aether_flux_pool',
      name: 'Aether Flux Pool',
      level: 1,
      description: 'Used to manifest psionic powers.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'special',
            target: 'self',
            value: 'AFP resource pool',
          },
        ],
      },
    },
    {
      id: 'mindweaver_telepathic_whispers',
      name: 'Telepathic Whispers',
      level: 1,
      description: 'Communicate mentally within 30 ft.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'special',
            target: 'ally',
            value: 'Telepathic communication',
          },
        ],
        range: {
          type: 'ranged',
          value: 30,
        },
      },
    },
    {
      id: 'mindweaver_psionic_awareness',
      name: 'Psionic Awareness',
      level: 1,
      description: 'Sense Aetheric signatures within 30 ft.',
      mechanics: {
        type: 'passive',
        effects: [
          {
            type: 'special',
            target: 'area',
            value: 'Detect psionic signatures',
          },
        ],
        range: {
          type: 'ranged',
          value: 30,
        },
      },
    },
  ];

  return features;
}

/**
 * Create a complete character progression from class data
 */
export function createCharacterProgression(
  classes: CharacterClass[]
): CharacterProgression {
  const totalLevel = calculateTotalLevel(classes);
  const proficiencyBonus = calculateProficiencyBonus(totalLevel);
  const allFeatures = getAllFeatures(classes);
  const combinedSpellcasting = calculateCombinedSpellcasting(classes);
  const resourcePools = calculateResourcePools(classes);

  return {
    classes,
    totalLevel,
    proficiencyBonus,
    allFeatures,
    combinedSpellcasting,
    resourcePools,
  };
}
