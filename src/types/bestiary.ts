// ============================================================================
// BESTIARY TYPES (Chapter 8)
// ============================================================================

import type { AbilityScores } from "./abilities";
import type { DamageType, Rollable } from "./combat";
import type { SkillType } from "./proficiencies";

export type CreatureType =
    | "Aberration"
    | "Beast"
    | "Celestial"
    | "Construct"
    | "Dragon"
    | "Elemental"
    | "Fey"
    | "Fiend"
    | "Giant"
    | "Humanoid"
    | "Monstrosity"
    | "Ooze"
    | "Plant"
    | "Undead";

export type CreatureSize = "Tiny" | "Small" | "Medium" | "Large" | "Huge" | "Gargantuan";

export type Alignment =
    | "Lawful Good"
    | "Neutral Good"
    | "Chaotic Good"
    | "Lawful Neutral"
    | "Neutral"
    | "Chaotic Neutral"
    | "Lawful Evil"
    | "Neutral Evil"
    | "Chaotic Evil"
    | "Unaligned";

export type SenseType = "Blindsight" | "Darkvision" | "Tremorsense" | "Truesight";

export type LanguageType =
    | "Common"
    | "Avenari"
    | "Karnathi"
    | "Rendai"
    | "Skellin"
    | "Tharn"
    | "Vulmir"
    | "Aqualoth"
    | "Draconic"
    | "Celestial"
    | "Infernal"
    | "Primordial"
    | "Sylvan"
    | "Abyssal";

export type ConditionType =
    | "Blinded"
    | "Charmed"
    | "Deafened"
    | "Frightened"
    | "Grappled"
    | "Incapacitated"
    | "Invisible"
    | "Paralyzed"
    | "Petrified"
    | "Poisoned"
    | "Prone"
    | "Restrained"
    | "Stunned"
    | "Unconscious"
    | "Exhaustion";

export interface CreatureHitPoints extends Rollable {
    average: number; // The calculated average HP
}

export interface ArmorClass {
    value: number;
    source?: string; // e.g., "rusted carapace", "patchwork plating"
}

export interface Speed {
    walk?: number;
    fly?: number;
    swim?: number;
    climb?: number;
    burrow?: number;
    hover?: boolean; // for fly speed
}

export interface SavingThrow {
    ability: keyof AbilityScores;
    bonus: number;
}

export interface CreatureSkill {
    skill: SkillType;
    bonus: number;
}

export interface Sense {
    type: SenseType;
    range: number; // in feet
}

export interface Resistance {
    damageTypes: DamageType[];
}

export interface Immunity {
    damageTypes?: DamageType[];
    conditions?: ConditionType[];
}

export interface Vulnerability {
    damageTypes: DamageType[];
}

export interface ChallengeRating {
    rating: string; // e.g., "1/4", "1/2", "1", "2"
    xp: number;
}

export interface CreatureAction {
    name: string;
    description: string;
    actionType?: "Action" | "Bonus Action" | "Reaction";
    recharge?: string; // e.g., "5–6", "6"
    attackBonus?: number;
    reach?: number; // in feet
    range?: number; // in feet
    damage?: CreatureDamage[];
    savingThrow?: {
        ability: keyof AbilityScores;
        dc: number;
    };
}

export interface CreatureDamage extends Rollable {
    damageType: DamageType;
    average: number; // calculated average damage
}

export interface CreatureFeature {
    name: string;
    description: string;
}

export interface Statblock {
    id: string;
    name: string;
    size: CreatureSize;
    type: CreatureType;
    subtype?: string; // e.g., "Former Humanoid", "Part Construct"
    alignment: Alignment;

    // Core stats
    armorClass: ArmorClass;
    hitPoints: CreatureHitPoints;
    speed: Speed;
    abilities: AbilityScores;

    // Optional defensive stats
    savingThrows?: SavingThrow[];
    skills?: CreatureSkill[];
    resistances?: Resistance;
    immunities?: Immunity;
    vulnerabilities?: Vulnerability;

    // Senses and communication
    senses: {
        special?: Sense[];
        passivePerception: number;
    };
    languages: LanguageType[] | "—" | string; // string for custom descriptions

    // Challenge
    challengeRating: ChallengeRating;

    // Special abilities and actions
    features?: CreatureFeature[]; // Passive abilities
    actions?: CreatureAction[]; // Active abilities/attacks
    reactions?: CreatureAction[]; // Reaction abilities
    legendaryActions?: CreatureAction[]; // For powerful creatures

    // Flavor
    description?: string;
    lore?: string;
    emoji?: string; // For visual identification
}

export interface BestiaryEntry extends Statblock {
    // Additional metadata for bestiary organization
    environment?: string[];
    rarity?: "Common" | "Uncommon" | "Rare" | "Very Rare" | "Legendary";
    tags?: string[];
}
