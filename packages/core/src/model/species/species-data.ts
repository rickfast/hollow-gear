/**
 * Individual species data and abilities for all seven Etherborne species
 * Contains the specific trait implementations for each species
 */

import type {
  EtherborneSpecies,
  SpeciesTraits,
  SpecialAbility,
  MovementSpeeds,
  Language,
} from './traits.js';
import type { AbilityScoreIncrease } from '../types/abilities.js';
import { SpeciesTraitsUtils } from './traits.js';

/**
 * Aqualoth (Axolotl) species traits
 * Amphibious scholars and bio-mechanical engineers of the flooded ruins
 */
export const AQUALOTH_TRAITS: SpeciesTraits = {
  species: 'aqualoth',
  abilityScoreIncrease: [
    { ability: 'intelligence', increase: 2 },
    { ability: 'wisdom', increase: 1 },
  ],
  speed: {
    walk: 30,
    swim: 30,
    climb: 0,
    fly: 0,
  },
  specialAbilities: [
    {
      id: 'amphibious',
      name: 'Amphibious',
      description: 'You can breathe both air and water.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['underwater breathing', 'aquatic environments'],
        },
      },
    },
    {
      id: 'hydrostatic_memory',
      name: 'Hydrostatic Memory',
      description:
        'You have advantage on History checks involving ruins or ancient machinery.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: [
            'History checks (ruins)',
            'History checks (ancient machinery)',
          ],
        },
      },
    },
    {
      id: 'aether_conduction',
      name: 'Aether Conduction',
      description:
        'Once per short rest, when you take psychic or lightning damage, reduce it by your proficiency bonus.',
      usage: {
        rechargeType: 'short',
        usesPerRecharge: 1,
      },
      mechanics: {
        bonus: {
          type: 'flat',
          applies_to: [
            'psychic damage reduction',
            'lightning damage reduction',
          ],
        },
      },
    },
  ],
  languages: ['common', 'aquan'],
  etherborneTraits: SpeciesTraitsUtils.createEtherborneTraits(),
  description: {
    appearance:
      'Smooth, pastel flesh with external gills that pulse with light when excited.',
    culture:
      'Waterbound artificers who treat technology as a living ecosystem.',
    personality:
      'Gentle, precise, and haunted by the memory of drowned knowledge.',
  },
};

/**
 * Vulmir (Fox) species traits
 * Cunning illusionists and saboteurs, weaving psionics and trickery alike
 */
export const VULMIR_TRAITS: SpeciesTraits = {
  species: 'vulmir',
  abilityScoreIncrease: [
    { ability: 'dexterity', increase: 2 },
    { ability: 'charisma', increase: 1 },
  ],
  speed: {
    walk: 35,
    swim: 0,
    climb: 0,
    fly: 0,
  },
  specialAbilities: [
    {
      id: 'cunning_reflexes',
      name: 'Cunning Reflexes',
      description:
        'You can take the Disengage or Hide action as a bonus action once per short rest.',
      usage: {
        rechargeType: 'short',
        usesPerRecharge: 1,
      },
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['bonus action Disengage', 'bonus action Hide'],
        },
      },
    },
    {
      id: 'echo_mimicry',
      name: 'Echo Mimicry',
      description:
        "You can reproduce any sound or voice you've heard for up to 6 seconds (Deception check contested by Insight).",
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['sound mimicry', 'voice mimicry'],
        },
      },
    },
    {
      id: 'shadow_step',
      name: 'Shadow Step',
      description:
        'When you move from dim light to dim light, you can teleport up to 10 ft (once per long rest).',
      usage: {
        rechargeType: 'long',
        usesPerRecharge: 1,
      },
      mechanics: {
        range: {
          type: 'self',
          distance: 10,
        },
      },
    },
  ],
  languages: ['common', 'street-cant'],
  etherborneTraits: SpeciesTraitsUtils.createEtherborneTraits(),
  description: {
    appearance:
      'Sleek fur, often burnished by soot or dyed with industrial pigments.',
    culture: 'Nomadic couriers, spies, and storytellers.',
    personality: 'Clever, restless, and sardonic — thrives in chaos.',
  },
};

/**
 * Rendai (Red Panda) species traits
 * Inventors, mechanics, and cheerful scavengers who view machines as art
 */
export const RENDAI_TRAITS: SpeciesTraits = {
  species: 'rendai',
  abilityScoreIncrease: [
    { ability: 'intelligence', increase: 2 },
    { ability: 'dexterity', increase: 1 },
  ],
  speed: {
    walk: 30,
    swim: 0,
    climb: 0,
    fly: 0,
  },
  specialAbilities: [
    {
      id: 'tinkers_instinct',
      name: "Tinker's Instinct",
      description:
        "You gain proficiency with Tinker's Tools. If already proficient, double your proficiency bonus.",
      mechanics: {
        bonus: {
          type: 'proficiency',
          applies_to: ["Tinker's Tools"],
        },
      },
    },
    {
      id: 'jury_rig',
      name: 'Jury-Rig',
      description:
        'Once per short rest, repair or improvise an item to restore 1d8 HP to a construct or mechanical device.',
      usage: {
        rechargeType: 'short',
        usesPerRecharge: 1,
      },
      mechanics: {
        damage: {
          dice: 'd8',
          count: 1,
          type: 'healing',
        },
        range: {
          type: 'touch',
        },
      },
    },
    {
      id: 'overclocker',
      name: 'Overclocker',
      description:
        'When you roll a 1 on a weapon damage die for a modded weapon, you may reroll once.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['modded weapon damage rerolls'],
        },
      },
    },
  ],
  languages: ['common', 'guilders-cant'],
  etherborneTraits: SpeciesTraitsUtils.createEtherborneTraits(),
  description: {
    appearance:
      'Round-faced, striped tails, expressive eyes, and soot-smudged fur.',
    culture:
      'Cooperative tinker-collectives that share knowledge through laughter and song.',
    personality: 'Optimistic, impulsive, ingenious — the soul of the workshop.',
  },
};

/**
 * Karnathi (Ibex) species traits
 * Stalwart defenders and psionic knights who blend faith and machinery
 */
export const KARNATHI_TRAITS: SpeciesTraits = {
  species: 'karnathi',
  abilityScoreIncrease: [
    { ability: 'strength', increase: 2 },
    { ability: 'wisdom', increase: 1 },
  ],
  speed: {
    walk: 30,
    swim: 0,
    climb: 20,
    fly: 0,
    restrictions: [
      'Can climb difficult surfaces including vertical stone without a check up to 20 ft',
    ],
  },
  specialAbilities: [
    {
      id: 'iron_resolve',
      name: 'Iron Resolve',
      description:
        'Advantage on saving throws against being frightened or charmed.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: [
            'saving throws vs frightened',
            'saving throws vs charmed',
          ],
        },
      },
    },
    {
      id: 'psionic_resonance',
      name: 'Psionic Resonance',
      description:
        'Once per long rest, add +1d4 to any saving throw or attack roll after seeing the result.',
      usage: {
        rechargeType: 'long',
        usesPerRecharge: 1,
      },
      mechanics: {
        damage: {
          dice: 'd4',
          count: 1,
          type: 'bonus',
        },
      },
    },
    {
      id: 'climbers_gait',
      name: "Climber's Gait",
      description:
        'You can climb difficult surfaces, including vertical stone, without a check up to 20 ft.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['climbing checks', 'vertical surface climbing'],
        },
      },
    },
  ],
  languages: ['common', 'holy-dialect'],
  etherborneTraits: SpeciesTraitsUtils.createEtherborneTraits(),
  description: {
    appearance:
      'Muscular, horned, stoic; armor often etched with filigree and light.',
    culture: 'Monastic orders that preserve Aether relics.',
    personality: 'Honorable, restrained, perfectionist.',
  },
};

/**
 * Tharn (Elk) species traits
 * Nomadic guardians of the wild gears — defenders of nature's mechanical heart
 */
export const THARN_TRAITS: SpeciesTraits = {
  species: 'tharn',
  abilityScoreIncrease: [
    { ability: 'constitution', increase: 2 },
    { ability: 'strength', increase: 1 },
  ],
  speed: {
    walk: 35,
    swim: 0,
    climb: 0,
    fly: 0,
  },
  specialAbilities: [
    {
      id: 'charge',
      name: 'Charge',
      description:
        'If you move at least 20 ft straight toward a creature before hitting with a melee attack, add +1d6 damage.',
      mechanics: {
        damage: {
          dice: 'd6',
          count: 1,
          type: 'bonus',
        },
        range: {
          type: 'self',
          distance: 20,
        },
      },
    },
    {
      id: 'aether_linked',
      name: 'Aether-Linked',
      description:
        'Once per long rest, when you drop to 0 HP, you instead drop to 1 HP and emit a psionic pulse (5-ft radius, push 10 ft).',
      usage: {
        rechargeType: 'long',
        usesPerRecharge: 1,
      },
      mechanics: {
        range: {
          type: 'area',
          area: '5-ft radius',
        },
      },
    },
    {
      id: 'natures_kin',
      name: "Nature's Kin",
      description:
        'You have advantage on Survival checks to track, forage, or navigate in wilderness or ruin.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: [
            'Survival (tracking)',
            'Survival (foraging)',
            'Survival (navigation)',
          ],
        },
      },
    },
  ],
  languages: ['common', 'sylvan'],
  etherborneTraits: SpeciesTraitsUtils.createEtherborneTraits(),
  description: {
    appearance: 'Towering, antlered, fur mixed with metal or moss.',
    culture: 'Tribal stewards of Aether wildlands.',
    personality: 'Calm, patient, but wrathful when balance is broken.',
  },
};

/**
 * Skellin (Gecko) species traits
 * Wall-crawling scouts and infiltrators with reflexes tuned to survival
 */
export const SKELLIN_TRAITS: SpeciesTraits = {
  species: 'skellin',
  abilityScoreIncrease: [
    { ability: 'dexterity', increase: 2 },
    { ability: 'intelligence', increase: 1 },
  ],
  speed: {
    walk: 30,
    swim: 0,
    climb: 20,
    fly: 0,
  },
  specialAbilities: [
    {
      id: 'wall_skitter',
      name: 'Wall Skitter',
      description: 'You can climb vertical surfaces without a check.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['vertical surface climbing', 'wall climbing'],
        },
      },
    },
    {
      id: 'adaptive_camouflage',
      name: 'Adaptive Camouflage',
      description:
        'As a bonus action, blend with surroundings to gain advantage on Stealth checks until you move.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['Stealth checks'],
        },
      },
    },
    {
      id: 'sticky_grip',
      name: 'Sticky Grip',
      description:
        'Advantage on checks or saves to avoid being disarmed or knocked prone.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['saves vs disarmed', 'saves vs knocked prone'],
        },
      },
    },
  ],
  languages: ['common', 'undertrade'],
  etherborneTraits: SpeciesTraitsUtils.createEtherborneTraits(),
  description: {
    appearance: 'Scaled and sleek, often bioluminescent under certain light.',
    culture: 'Clannish and mobile; they prize adaptability above all.',
    personality:
      'Curious, impulsive, and sly with a moral compass that changes by the minute.',
  },
};

/**
 * Avenar (Avian) species traits
 * Scholars of the skies — calm, calculating, and eternally curious
 */
export const AVENAR_TRAITS: SpeciesTraits = {
  species: 'avenar',
  abilityScoreIncrease: [
    { ability: 'intelligence', increase: 2 },
    { ability: 'wisdom', increase: 1 },
  ],
  speed: {
    walk: 30,
    swim: 0,
    climb: 0,
    fly: 25,
    restrictions: ['Cannot fly while wearing medium or heavy armor'],
  },
  specialAbilities: [
    {
      id: 'aether_recall',
      name: 'Aether Recall',
      description:
        "You can perfectly recall any text, sound, or symbol you've encountered within the last week.",
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['memory recall', 'text recall', 'symbol recall'],
        },
      },
    },
    {
      id: 'resonant_logic',
      name: 'Resonant Logic',
      description:
        'Once per short rest, when you fail an Intelligence or Wisdom check, you may reroll it. You must use the new result.',
      usage: {
        rechargeType: 'short',
        usesPerRecharge: 1,
      },
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['Intelligence check rerolls', 'Wisdom check rerolls'],
        },
      },
    },
    {
      id: 'mimetic_insight',
      name: 'Mimetic Insight',
      description:
        'As a bonus action, you can analyze a creature or device within 30 ft. You learn one of the following (your choice): its AC, HP range (low/medium/high), or whether it has psionic capacity.',
      mechanics: {
        range: {
          type: 'ranged',
          distance: 30,
        },
      },
    },
    {
      id: 'featherlight_descent',
      name: 'Featherlight Descent',
      description:
        'You can fall up to 60 feet without taking damage, and you always land on your feet.',
      mechanics: {
        bonus: {
          type: 'advantage',
          applies_to: ['fall damage immunity (60 ft)', 'landing safely'],
        },
      },
    },
  ],
  languages: ['common', 'avenari'],
  etherborneTraits: SpeciesTraitsUtils.createEtherborneTraits(),
  description: {
    appearance:
      'Tall, sleek birdfolk with metallic feathers that shimmer from black to silver-blue under light. Their faces are framed by intricate beak-guards or data-filigree masks.',
    culture:
      'Matriarchal and consensus-driven, governed by "choirs" — councils of thinkers who harmonize thought until unity is reached.',
    personality:
      'Analytical, quiet, and courteous, but prone to arrogance when challenged intellectually.',
  },
};

/**
 * Registry of all species traits indexed by species name
 */
export const SPECIES_TRAITS_REGISTRY: Record<EtherborneSpecies, SpeciesTraits> =
  {
    aqualoth: AQUALOTH_TRAITS,
    vulmir: VULMIR_TRAITS,
    rendai: RENDAI_TRAITS,
    karnathi: KARNATHI_TRAITS,
    tharn: THARN_TRAITS,
    skellin: SKELLIN_TRAITS,
    avenar: AVENAR_TRAITS,
  };

/**
 * Utility functions for working with species data
 */
export namespace SpeciesDataUtils {
  /**
   * Get traits for a specific species
   */
  export function getSpeciesTraits(species: EtherborneSpecies): SpeciesTraits {
    return SPECIES_TRAITS_REGISTRY[species];
  }

  /**
   * Get all available species
   */
  export function getAllSpecies(): EtherborneSpecies[] {
    return Object.keys(SPECIES_TRAITS_REGISTRY) as EtherborneSpecies[];
  }

  /**
   * Check if a species exists
   */
  export function isValidSpecies(
    species: string
  ): species is EtherborneSpecies {
    return species in SPECIES_TRAITS_REGISTRY;
  }

  /**
   * Get species with specific ability score increases
   */
  export function getSpeciesByAbilityIncrease(
    ability: string
  ): EtherborneSpecies[] {
    return getAllSpecies().filter(species => {
      const traits = getSpeciesTraits(species);
      return traits.abilityScoreIncrease.some(
        increase => increase.ability === ability
      );
    });
  }

  /**
   * Get species with specific movement types
   */
  export function getSpeciesByMovement(
    movementType: 'walk' | 'swim' | 'climb' | 'fly'
  ): EtherborneSpecies[] {
    return getAllSpecies().filter(species => {
      const traits = getSpeciesTraits(species);
      const speed = traits.speed[movementType];
      return typeof speed === 'number' && speed > 0;
    });
  }

  /**
   * Get species with specific special abilities
   */
  export function getSpeciesByAbility(abilityId: string): EtherborneSpecies[] {
    return getAllSpecies().filter(species => {
      const traits = getSpeciesTraits(species);
      return traits.specialAbilities.some(ability => ability.id === abilityId);
    });
  }

  /**
   * Get species that speak a specific language
   */
  export function getSpeciesByLanguage(
    language: Language
  ): EtherborneSpecies[] {
    return getAllSpecies().filter(species => {
      const traits = getSpeciesTraits(species);
      return traits.languages.includes(language);
    });
  }
}
