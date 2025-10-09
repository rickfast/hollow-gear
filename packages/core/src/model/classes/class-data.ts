/**
 * Class-specific data and mechanics for all Hollow Gear classes
 *
 * This module contains the static data definitions for each class,
 * including their archetypes, hit dice, primary abilities, and special mechanics.
 */

import type {
  HollowGearClass,
  ClassArchetype,
  ClassSpellcasting,
  ClassPsionics,
  SpellcastingType,
  SpellcastingProgression,
  PsionicDiscipline,
  ResourceType,
} from "./index.js";
import type { AbilityScore, DieType } from "../types/common.js";

/**
 * Core class information for each Hollow Gear class
 */
export interface ClassInfo {
  /** Class identifier */
  className: HollowGearClass;
  /** Display name */
  displayName: string;
  /** Class description */
  description: string;
  /** Role description */
  role: string;
  /** Hit die type */
  hitDie: DieType;
  /** Primary ability score */
  primaryAbility: AbilityScore;
  /** Saving throw proficiencies */
  savingThrowProficiencies: AbilityScore[];
  /** Available archetypes */
  archetypes: ClassArchetype[];
  /** Spellcasting information if applicable */
  spellcasting?: ClassSpellcasting;
  /** Psionic information if applicable */
  psionics?: ClassPsionics;
  /** Class-specific resources */
  classResources: ClassResourceInfo[];
}

/**
 * Information about class-specific resources
 */
export interface ClassResourceInfo {
  /** Resource type */
  type: ResourceType;
  /** Display name */
  name: string;
  /** Description of the resource */
  description: string;
  /** Base amount at level 1 */
  baseAmount: number;
  /** How the resource scales with level */
  scaling: ResourceScaling;
  /** When the resource recovers */
  recovery: "short" | "long" | "dawn" | "never";
}

/**
 * How a resource scales with character level
 */
export interface ResourceScaling {
  /** Type of scaling */
  type: "linear" | "table" | "ability_modifier" | "proficiency_bonus";
  /** Scaling value (per level for linear, or table for table) */
  value: number | number[];
  /** Ability modifier to add (if applicable) */
  abilityModifier?: AbilityScore;
}

/**
 * Static data for all Hollow Gear classes
 */
export const CLASS_DATA: Record<HollowGearClass, ClassInfo> = {
  arcanist: {
    className: "arcanist",
    displayName: "Arcanist",
    description: "Scholar, manipulator of Aether, experimental technomage.",
    role: "Spellcaster and magical researcher",
    hitDie: "d6",
    primaryAbility: "intelligence",
    savingThrowProficiencies: ["intelligence", "wisdom"],
    archetypes: [
      {
        id: "aethermancer",
        name: "Aethermancer",
        parentClass: "arcanist",
        selectionLevel: 2,
        description:
          "Psionically fuses mind and magic. May trade one spell per level for a psionic power.",
        features: [
          {
            id: "aethermancer_psionic_conversion",
            name: "Psionic Conversion",
            level: 2,
            description:
              "Convert spell slots into Aether Flux Points (AFP). Learn 1 psionic Discipline.",
            mechanics: {
              type: "resource",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Convert spell slots to AFP",
                },
              ],
            },
          },
          {
            id: "aethermancer_resonant_pulse",
            name: "Resonant Pulse",
            level: 6,
            description:
              "Gain Resonant Pulse as a bonus action once per short rest.",
            mechanics: {
              type: "bonus_action",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "Resonant pulse effect",
                },
              ],
            },
            uses: {
              maximum: 1,
              current: 1,
              restoreOn: "short",
            },
          },
        ],
      },
      {
        id: "gearwright",
        name: "Gearwright",
        parentClass: "arcanist",
        selectionLevel: 2,
        description:
          "A mechanical magician; crafts sentient constructs known as Aether Familiars.",
        features: [
          {
            id: "gearwright_aether_familiar",
            name: "Aether Familiar",
            level: 2,
            description:
              "Build a mechanical companion (HP = 5 × your proficiency bonus).",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Mechanical companion",
                },
              ],
            },
          },
          {
            id: "gearwright_infuse_device",
            name: "Infuse Device",
            level: 2,
            description: "Infuse devices with low-level spell effects.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "equipment",
                  value: "Spell infusion",
                },
              ],
            },
          },
          {
            id: "gearwright_temporary_constructs",
            name: "Temporary Constructs",
            level: 10,
            description:
              "Create temporary constructs as action (CR ½ or lower).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "Temporary construct creation",
                },
              ],
            },
          },
        ],
      },
    ],
    spellcasting: {
      type: "arcanist",
      ability: "intelligence",
      progression: "full",
      spellsKnown: [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15,
      ],
      spellSlots: [
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
      ],
      ritualCasting: true,
      focus: "arcane_focus",
    },
    classResources: [
      {
        type: "spell_slot",
        name: "Spell Slots",
        description: "Aether-powered magical energy",
        baseAmount: 2,
        scaling: {
          type: "table",
          value: [2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
        },
        recovery: "long",
      },
    ],
  },

  templar: {
    className: "templar",
    displayName: "Templar",
    description: "Psionic paladin, relic guardian, and holy engineer.",
    role: "Divine warrior and support",
    hitDie: "d10",
    primaryAbility: "charisma",
    savingThrowProficiencies: ["wisdom", "charisma"],
    archetypes: [
      {
        id: "relic_knight",
        name: "Relic Knight",
        parentClass: "templar",
        selectionLevel: 3,
        description: "Defender of lost Aether temples.",
        features: [
          {
            id: "relic_knight_aura_of_focus",
            name: "Aura of Focus",
            level: 3,
            description:
              "Allies in 10 ft gain +1 to saving throws vs psionic effects.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "save_bonus",
                  target: "ally",
                  value: "1",
                },
              ],
            },
          },
          {
            id: "relic_knight_channel_healing",
            name: "Channel Healing",
            level: 3,
            description: "Can channel healing energy through armor or shield.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "ally",
                  value: "Healing through equipment",
                },
              ],
            },
          },
          {
            id: "relic_knight_faith_barrier",
            name: "Faith Barrier",
            level: 7,
            description:
              "Project a Faith Barrier once per long rest (temporary HP = 2 × level).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "hp_bonus",
                  target: "ally",
                  value: "level * 2",
                },
              ],
            },
            uses: {
              maximum: 1,
              current: 1,
              restoreOn: "long",
            },
          },
        ],
      },
      {
        id: "iron_saint",
        name: "Iron Saint",
        parentClass: "templar",
        selectionLevel: 3,
        description: "Crusader who sees perfection in steel.",
        features: [
          {
            id: "iron_saint_runic_armor",
            name: "Runic Armor",
            level: 3,
            description:
              "Your armor gains +1 AC and glows with runes of faith.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "ac_bonus",
                  target: "self",
                  value: "1",
                },
              ],
            },
          },
          {
            id: "iron_saint_faithful_resolve",
            name: "Faithful Resolve",
            level: 3,
            description: "Spend 1 Charge to gain advantage on a saving throw.",
            mechanics: {
              type: "reaction",
              effects: [
                {
                  type: "advantage",
                  target: "self",
                  value: "saving throws",
                },
              ],
              activation: {
                actionType: "reaction",
                cost: {
                  type: "resonance_charge",
                  amount: 1,
                },
              },
            },
          },
          {
            id: "iron_saint_divine_immunity",
            name: "Divine Immunity",
            level: 10,
            description:
              "Become immune to fear and psychic damage for 1 minute.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "immunity",
                  target: "self",
                  value: "fear, psychic",
                },
              ],
              duration: {
                type: "minutes",
                value: 1,
              },
            },
            uses: {
              maximum: 1,
              current: 1,
              restoreOn: "long",
            },
          },
        ],
      },
    ],
    spellcasting: {
      type: "templar",
      ability: "charisma",
      progression: "half",
      spellsKnown: [
        0, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11,
      ],
      spellSlots: [
        [0, 0, 0, 0, 0], // Level 1
        [2, 0, 0, 0, 0], // Level 2
        [3, 0, 0, 0, 0], // Level 3
        [3, 0, 0, 0, 0], // Level 4
        [4, 2, 0, 0, 0], // Level 5
        [4, 2, 0, 0, 0], // Level 6
        [4, 3, 0, 0, 0], // Level 7
        [4, 3, 0, 0, 0], // Level 8
        [4, 3, 2, 0, 0], // Level 9
        [4, 3, 2, 0, 0], // Level 10
        [4, 3, 3, 0, 0], // Level 11
        [4, 3, 3, 0, 0], // Level 12
        [4, 3, 3, 1, 0], // Level 13
        [4, 3, 3, 1, 0], // Level 14
        [4, 3, 3, 2, 0], // Level 15
        [4, 3, 3, 2, 0], // Level 16
        [4, 3, 3, 3, 1], // Level 17
        [4, 3, 3, 3, 1], // Level 18
        [4, 3, 3, 3, 2], // Level 19
        [4, 3, 3, 3, 2], // Level 20
      ],
      ritualCasting: false,
      focus: "holy_symbol",
    },
    classResources: [
      {
        type: "resonance_charge",
        name: "Resonance Charges",
        description: "Faith-fueled psionic energy",
        baseAmount: 1,
        scaling: {
          type: "ability_modifier",
          value: 1,
          abilityModifier: "charisma",
        },
        recovery: "long",
      },
    ],
  },

  tweaker: {
    className: "tweaker",
    displayName: "Tweaker",
    description: "Brawler, chemist, reckless modder of the flesh.",
    role: "Melee combatant with chemical enhancement",
    hitDie: "d12",
    primaryAbility: "constitution",
    savingThrowProficiencies: ["strength", "constitution"],
    archetypes: [
      {
        id: "boilerheart",
        name: "Boilerheart",
        parentClass: "tweaker",
        selectionLevel: 3,
        description: "Relies on controlled overpressure.",
        features: [
          {
            id: "boilerheart_pressure_surge",
            name: "Pressure Surge",
            level: 3,
            description: "When reduced to half HP, gain +1 attack each turn.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Extra attack when bloodied",
                },
              ],
            },
          },
          {
            id: "boilerheart_explosion_death",
            name: "Explosion Death Throes",
            level: 3,
            description: "If reduced to 0 HP, emit 10-ft burst (2d6 fire).",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "2d6 fire damage in 10ft burst",
                },
              ],
            },
          },
          {
            id: "boilerheart_heat_immunity",
            name: "Heat Immunity",
            level: 3,
            description: "Immune to exhaustion effects caused by heat.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "immunity",
                  target: "self",
                  value: "heat exhaustion",
                },
              ],
            },
          },
        ],
      },
      {
        id: "neurospike",
        name: "Neurospike",
        parentClass: "tweaker",
        selectionLevel: 3,
        description: "Focuses on reflex and precision.",
        features: [
          {
            id: "neurospike_enhanced_strikes",
            name: "Enhanced Strikes",
            level: 3,
            description: "Add CON to attack rolls for unarmed strikes.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "attack_bonus",
                  target: "self",
                  value: "constitution modifier",
                },
              ],
            },
          },
          {
            id: "neurospike_reactive_defense",
            name: "Reactive Defense",
            level: 3,
            description: "Reaction: Gain +2 AC when attacked once per round.",
            mechanics: {
              type: "reaction",
              effects: [
                {
                  type: "ac_bonus",
                  target: "self",
                  value: "2",
                },
              ],
            },
          },
          {
            id: "neurospike_hyperfocus",
            name: "Hyperfocus",
            level: 7,
            description:
              "Enter Hyperfocus: take two bonus actions per turn for 3 rounds (1/long rest).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Two bonus actions per turn",
                },
              ],
              duration: {
                type: "rounds",
                value: 3,
              },
            },
            uses: {
              maximum: 1,
              current: 1,
              restoreOn: "long",
            },
          },
        ],
      },
    ],
    classResources: [
      {
        type: "custom",
        name: "Adrenal Surges",
        description: "Combat injectors for enhanced performance",
        baseAmount: 1,
        scaling: {
          type: "proficiency_bonus",
          value: 1,
        },
        recovery: "short",
      },
    ],
  },

  shadehand: {
    className: "shadehand",
    displayName: "Shadehand",
    description: "Stealth, infiltration, sabotage, precision strikes.",
    role: "Stealth specialist and precision striker",
    hitDie: "d8",
    primaryAbility: "dexterity",
    savingThrowProficiencies: ["dexterity", "intelligence"],
    archetypes: [
      {
        id: "circuitbreaker",
        name: "Circuitbreaker",
        parentClass: "shadehand",
        selectionLevel: 3,
        description: "Anti-tech infiltrator.",
        features: [
          {
            id: "circuitbreaker_disable_tech",
            name: "Disable Technology",
            level: 3,
            description:
              "Once per turn, disable a mod or device within 5 ft as a bonus action.",
            mechanics: {
              type: "bonus_action",
              effects: [
                {
                  type: "special",
                  target: "equipment",
                  value: "Disable mod or device",
                },
              ],
              range: {
                type: "ranged",
                value: 5,
              },
            },
          },
          {
            id: "circuitbreaker_construct_bane",
            name: "Construct Bane",
            level: 3,
            description: "Critical hits against constructs deal double damage.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "damage_bonus",
                  target: "enemy",
                  value: "double on critical vs constructs",
                },
              ],
            },
          },
          {
            id: "circuitbreaker_aether_resistance",
            name: "Aether Resistance",
            level: 9,
            description:
              "Gain advantage on Dex saves vs traps and Aether pulses.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "advantage",
                  target: "self",
                  value: "Dex saves vs traps and Aether",
                },
              ],
            },
          },
        ],
      },
      {
        id: "mirage_operative",
        name: "Mirage Operative",
        parentClass: "shadehand",
        selectionLevel: 3,
        description: "Specialist in psionic deception.",
        features: [
          {
            id: "mirage_operative_blur",
            name: "Blur",
            level: 3,
            description: "Cast Blur once per long rest using goggles or focus.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Blur spell effect",
                },
              ],
            },
            uses: {
              maximum: 1,
              current: 1,
              restoreOn: "long",
            },
          },
          {
            id: "mirage_operative_deception_expert",
            name: "Deception Expert",
            level: 3,
            description: "Gain proficiency in Deception and Sleight of Hand.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "proficiency",
                  target: "self",
                  value: "Deception, Sleight of Hand",
                },
              ],
            },
          },
          {
            id: "mirage_operative_mirror_image",
            name: "Mirror Image",
            level: 7,
            description:
              "Create illusory duplicates for 1 minute (mirror image effect).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Mirror image duplicates",
                },
              ],
              duration: {
                type: "minutes",
                value: 1,
              },
            },
          },
        ],
      },
    ],
    classResources: [],
  },

  vanguard: {
    className: "vanguard",
    displayName: "Vanguard",
    description:
      "Frontline fighter, tactical commander, and steam-powered bruiser.",
    role: "Tank and battlefield controller",
    hitDie: "d10",
    primaryAbility: "strength",
    savingThrowProficiencies: ["strength", "constitution"],
    archetypes: [
      {
        id: "bulwark_sentinel",
        name: "Bulwark Sentinel",
        parentClass: "vanguard",
        selectionLevel: 3,
        description: "Specializes in protection and counterattack.",
        features: [
          {
            id: "bulwark_sentinel_protective_aura",
            name: "Protective Aura",
            level: 3,
            description: "Allies within 5 ft gain +1 AC.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "ac_bonus",
                  target: "ally",
                  value: "1",
                },
              ],
            },
          },
          {
            id: "bulwark_sentinel_intercept",
            name: "Intercept",
            level: 3,
            description:
              "Reaction: Impose disadvantage on attack against an ally (1/round).",
            mechanics: {
              type: "reaction",
              effects: [
                {
                  type: "disadvantage",
                  target: "enemy",
                  value: "attack rolls vs ally",
                },
              ],
            },
          },
          {
            id: "bulwark_sentinel_expanded_guard",
            name: "Expanded Guard",
            level: 10,
            description: "Can guard 10-ft radius instead.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "Expand protective aura to 10ft",
                },
              ],
            },
          },
        ],
      },
      {
        id: "shockbreaker",
        name: "Shockbreaker",
        parentClass: "vanguard",
        selectionLevel: 3,
        description: "Steam warrior using volatile pressure systems.",
        features: [
          {
            id: "shockbreaker_electrified_strikes",
            name: "Electrified Strikes",
            level: 3,
            description: "Melee attacks deal +1d4 lightning damage.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "damage_bonus",
                  target: "enemy",
                  value: "1d4 lightning",
                },
              ],
            },
          },
          {
            id: "shockbreaker_static_burst",
            name: "Static Burst",
            level: 3,
            description:
              "Once per long rest, unleash Static Burst (15-ft cone, 2d8 lightning).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "2d8 lightning in 15ft cone",
                },
              ],
            },
            uses: {
              maximum: 1,
              current: 1,
              restoreOn: "long",
            },
          },
          {
            id: "shockbreaker_electrical_resistance",
            name: "Electrical Resistance",
            level: 3,
            description: "Resistant to lightning and thunder damage.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "resistance",
                  target: "self",
                  value: "lightning, thunder",
                },
              ],
            },
          },
        ],
      },
    ],
    classResources: [
      {
        type: "custom",
        name: "Steam Charges",
        description: "Steam-powered enhancement charges",
        baseAmount: 1,
        scaling: {
          type: "proficiency_bonus",
          value: 1,
        },
        recovery: "short",
      },
    ],
  },

  artifex: {
    className: "artifex",
    displayName: "Artifex",
    description:
      "Inventor, field engineer, and battlefield support specialist.",
    role: "Support specialist and inventor",
    hitDie: "d8",
    primaryAbility: "intelligence",
    savingThrowProficiencies: ["constitution", "intelligence"],
    archetypes: [
      {
        id: "fieldwright",
        name: "Fieldwright",
        parentClass: "artifex",
        selectionLevel: 3,
        description: "Support specialist.",
        features: [
          {
            id: "fieldwright_repair_ally",
            name: "Repair Ally",
            level: 3,
            description: "Repair ally's mod as bonus action.",
            mechanics: {
              type: "bonus_action",
              effects: [
                {
                  type: "special",
                  target: "ally",
                  value: "Repair equipment mod",
                },
              ],
            },
          },
          {
            id: "fieldwright_assist_attack",
            name: "Assist Attack",
            level: 3,
            description: "Ally's next attack deals +1d6 damage if assisted.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "damage_bonus",
                  target: "ally",
                  value: "1d6",
                },
              ],
            },
          },
          {
            id: "fieldwright_drone_turrets",
            name: "Drone Turrets",
            level: 10,
            description:
              "Deploy temporary drone turrets (AC 15, HP 15, dmg 1d10).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "Deploy drone turrets",
                },
              ],
            },
          },
        ],
      },
      {
        id: "aetherforger",
        name: "Aetherforger",
        parentClass: "artifex",
        selectionLevel: 3,
        description: "Infuses Aether Dust into machinery.",
        features: [
          {
            id: "aetherforger_imbue_weapon",
            name: "Imbue Weapon",
            level: 3,
            description:
              "Spend 1 ⚙️ worth of Aether Dust to imbue weapon with energy (1 minute).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "equipment",
                  value: "Energy weapon imbue",
                },
              ],
              duration: {
                type: "minutes",
                value: 1,
              },
              activation: {
                actionType: "action",
                cost: {
                  type: "custom",
                  amount: 1,
                },
              },
            },
          },
          {
            id: "aetherforger_create_cores",
            name: "Create Aether Cores",
            level: 3,
            description:
              "Create Aether Cores to power other devices (3 uses/day).",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "equipment",
                  value: "Create Aether Core",
                },
              ],
            },
            uses: {
              maximum: 3,
              current: 3,
              restoreOn: "dawn",
            },
          },
          {
            id: "aetherforger_arcane_immunity",
            name: "Arcane Immunity",
            level: 3,
            description: "Immune to arcane feedback.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "immunity",
                  target: "self",
                  value: "arcane feedback",
                },
              ],
            },
          },
        ],
      },
    ],
    classResources: [
      {
        type: "custom",
        name: "Invention Points",
        description: "Points for creating and maintaining inventions",
        baseAmount: 2,
        scaling: {
          type: "ability_modifier",
          value: 1,
          abilityModifier: "intelligence",
        },
        recovery: "long",
      },
    ],
  },

  mindweaver: {
    className: "mindweaver",
    displayName: "Mindweaver",
    description: "Psionic specialist; manipulator of will, energy, and space.",
    role: "Psionic specialist and reality manipulator",
    hitDie: "d8",
    primaryAbility: "intelligence", // Can also be wisdom, chosen at creation
    savingThrowProficiencies: ["intelligence", "wisdom"],
    archetypes: [
      {
        id: "path_of_echo",
        name: "Path of the Echo",
        parentClass: "mindweaver",
        selectionLevel: 2,
        description: "Masters of resonance and vibration.",
        features: [
          {
            id: "echo_resonant_pulse",
            name: "Resonant Pulse",
            level: 2,
            description: "Gain Resonant Pulse power.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "Resonant pulse effect",
                },
              ],
            },
          },
          {
            id: "echo_step",
            name: "Echo Step",
            level: 2,
            description: "Gain Echo Step power.",
            mechanics: {
              type: "bonus_action",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Teleportation via sound",
                },
              ],
            },
          },
          {
            id: "echo_psychic_feedback",
            name: "Psychic Feedback",
            level: 2,
            description:
              "When you manifest a power, nearby enemies take psychic damage equal to your mod.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "special",
                  target: "enemy",
                  value: "Psychic damage on power use",
                },
              ],
            },
          },
        ],
      },
      {
        id: "path_of_flux",
        name: "Path of Flux",
        parentClass: "mindweaver",
        selectionLevel: 2,
        description: "Harness entropy and raw energy.",
        features: [
          {
            id: "flux_entropy_lash",
            name: "Entropy Lash",
            level: 2,
            description: "Learn Entropy Lash power.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "enemy",
                  value: "Entropy damage attack",
                },
              ],
            },
          },
          {
            id: "flux_aether_drain",
            name: "Aether Drain",
            level: 2,
            description: "Learn Aether Drain power.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "enemy",
                  value: "Drain enemy resources",
                },
              ],
            },
          },
          {
            id: "flux_energy_recovery",
            name: "Energy Recovery",
            level: 2,
            description: "Recover 1 AFP when damaging psionic or magical foes.",
            mechanics: {
              type: "passive",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "AFP recovery on damage",
                },
              ],
            },
          },
        ],
      },
      {
        id: "path_of_eidolon",
        name: "Path of Eidolon",
        parentClass: "mindweaver",
        selectionLevel: 2,
        description: "Specializes in projection and soul constructs.",
        features: [
          {
            id: "eidolon_spectral_hand",
            name: "Spectral Hand",
            level: 2,
            description: "Gain Spectral Hand power.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "Spectral hand projection",
                },
              ],
            },
          },
          {
            id: "eidolon_soul_anchor",
            name: "Soul Anchor",
            level: 2,
            description: "Gain Soul Anchor power.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "self",
                  value: "Soul anchoring effect",
                },
              ],
            },
          },
          {
            id: "eidolon_astral_duplicate",
            name: "Astral Duplicate",
            level: 2,
            description:
              "Project an astral duplicate once per short rest for 1 minute.",
            mechanics: {
              type: "action",
              effects: [
                {
                  type: "special",
                  target: "area",
                  value: "Astral projection",
                },
              ],
              duration: {
                type: "minutes",
                value: 1,
              },
            },
            uses: {
              maximum: 1,
              current: 1,
              restoreOn: "short",
            },
          },
        ],
      },
    ],
    psionics: {
      ability: "intelligence",
      afpProgression: [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      ],
      disciplines: ["flux", "echo", "eidolon", "empyric", "veil", "kinesis"],
      powersKnown: [
        2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      ],
      focusLimit: 1,
    },
    classResources: [
      {
        type: "afp",
        name: "Aether Flux Points",
        description: "Psionic energy for manifesting powers",
        baseAmount: 2,
        scaling: {
          type: "linear",
          value: 1,
        },
        recovery: "long",
      },
    ],
  },
};

/**
 * Get class information by class name
 */
export function getClassInfo(className: HollowGearClass): ClassInfo {
  return CLASS_DATA[className];
}

/**
 * Get all available archetypes for a class
 */
export function getClassArchetypes(
  className: HollowGearClass
): ClassArchetype[] {
  return CLASS_DATA[className].archetypes;
}

/**
 * Get a specific archetype by ID
 */
export function getArchetype(archetypeId: string): ClassArchetype | undefined {
  for (const classData of Object.values(CLASS_DATA)) {
    const archetype = classData.archetypes.find(
      (arch) => arch.id === archetypeId
    );
    if (archetype) {
      return archetype;
    }
  }
  return undefined;
}

/**
 * Check if a class has spellcasting
 */
export function hasSpellcasting(className: HollowGearClass): boolean {
  return CLASS_DATA[className].spellcasting !== undefined;
}

/**
 * Check if a class has psionic abilities
 */
export function hasPsionics(className: HollowGearClass): boolean {
  return CLASS_DATA[className].psionics !== undefined;
}

/**
 * Get the primary ability for a class
 */
export function getClassPrimaryAbility(
  className: HollowGearClass
): AbilityScore {
  return CLASS_DATA[className].primaryAbility;
}

/**
 * Get the hit die for a class
 */
export function getClassHitDie(className: HollowGearClass): DieType {
  return CLASS_DATA[className].hitDie;
}
/**
 * Get all available class names
 */
export function getAllClasses(): HollowGearClass[] {
  return Object.keys(CLASS_DATA) as HollowGearClass[];
}

/**
 * Check if a class name is valid
 */
export function isValidClass(className: string): className is HollowGearClass {
  return className in CLASS_DATA;
}

/**
 * Get classes by spellcasting type
 */
export function getClassesBySpellcasting(type: SpellcastingType): HollowGearClass[] {
  return getAllClasses().filter(className => {
    const classInfo = CLASS_DATA[className];
    return classInfo.spellcasting?.type === type;
  });
}

/**
 * Get classes that have psionic abilities
 */
export function getClassesByPsionics(): HollowGearClass[] {
  return getAllClasses().filter(className => hasPsionics(className));
}

/**
 * Get classes by hit die type
 */
export function getClassesByHitDie(hitDie: DieType): HollowGearClass[] {
  return getAllClasses().filter(className => {
    return CLASS_DATA[className].hitDie === hitDie;
  });
}

/**
 * Get classes by primary ability
 */
export function getClassesByPrimaryAbility(ability: AbilityScore): HollowGearClass[] {
  return getAllClasses().filter(className => {
    return CLASS_DATA[className].primaryAbility === ability;
  });
}