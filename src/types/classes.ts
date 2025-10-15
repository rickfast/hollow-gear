// ============================================================================
// CLASSES (Chapter 3)
// ============================================================================

import type { AbilityScores } from "./abilities";
import type { DamageInfo } from "./combat";
import type { Feature } from "./common";
import type { Proficiencies } from "./proficiencies";

export interface CharacterClass {
    level: number;
    class: ClassType;
    subclass?: SubclassType;
}

export type ClassType =
    | "Arcanist" // Scholar, Aether manipulator
    | "Templar" // Psionic paladin
    | "Tweaker" // Brawler, flesh modder
    | "Shadehand" // Rogue, infiltrator
    | "Vanguard" // Frontline fighter
    | "Artifex" // Inventor, engineer
    | "Mindweaver"; // Psionic master

export type ClassDescription = {
    role: string;
    description: string;
    archetypes: string[];
};

export interface Class {
    type: ClassType;
    primaryAbility: keyof AbilityScores;
    hitDie: string;
    primaryResource: ResourceType;
    spellcasting?: SpellcastingInfo;
    description: ClassDescription;
    proficiencies?: Proficiencies;
    features: ClassFeature[];
    subclasses: Subclass[];
    startingEquipment: StartingEquipment;
    configurableFeatures: ConfigurableFeature[];
}

export type ResourceType =
    | "SpellSlots"
    | "AetherFluxPoints"
    | "ResonanceCharges"
    | "AdrenalSurges"
    | "None";

export interface SpellcastingInfo {
    spellcastingAbility: keyof AbilityScores;
    spellLists: string[]; // e.g., ["Wizard", "Warlock"]
    cantripsKnown?: number;
    spellsKnown?: number;
    spellsPrepared?: number;
}

export type SubclassType =
    // Arcanist
    | "Aethermancer"
    | "Gearwright"
    // Templar
    | "Relic Knight"
    | "Iron Saint"
    | "Voice of the Choir"
    // Tweaker
    | "Boilerheart"
    | "Neurospike"
    // Shadehand
    | "Circuitbreaker"
    | "Mirage Operative"
    // Vanguard
    | "Bulwark Sentinel"
    | "Shockbreaker"
    // Artifex
    | "Fieldwright"
    | "Aetherforger"
    // Mindweaver
    | string;

export interface Subclass {
    type: SubclassType;
    features: ClassFeature[];
}

export interface ClassFeature extends Feature {
    level: number;
    damage?: DamageInfo; // for features that deal damage
}

// ============================================================================
// CLASS CONFIGURATION SYSTEM
// ============================================================================

export interface StartingEquipment {
    weapons: string[]; // Equipment IDs
    armor?: string; // Equipment ID
    tools: string[]; // Equipment IDs
    items: string[]; // Equipment IDs
    currency: {
        cogs: number;
        gears: number;
        cores: number;
    };
}

export interface ConfigurableFeature {
    featureName: string;
    level: number;
    configurationType: FeatureConfigurationType;
    options: FeatureOption[];
    required: boolean;
    description: string;
}

export type FeatureConfigurationType =
    | "choice" // Single choice from list
    | "multiple" // Multiple choices from list
    | "spell-selection" // Spell selection
    | "proficiency-selection" // Skill/tool proficiency
    | "ability-selection"; // Primary ability (e.g., Mindweaver INT/WIS)

export interface FeatureOption {
    id: string;
    name: string;
    description: string;
    prerequisites?: string[];
}
