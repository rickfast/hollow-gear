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
    levelProgression?: ClassLevelProgression[]; // Detailed 1-20 progression
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
    origin?: "class" | "subclass" | "progression" | "species" | "other"; // provenance for UI/filters
    ephemeral?: boolean; // true if generated from progression featuresGranted without full definition
}

// ============================================================================
// LEVEL PROGRESSION TYPES
// ============================================================================

export interface ClassLevelProgression {
    level: number;
    proficiencyBonus: number;
    featuresGranted: string[]; // names of features gained at this level
    abilityScoreImprovement?: boolean; // ASI/Feat opportunity
    // Spellcasting slots by level (for casters) - undefined if not applicable
    spellSlots?: {
        1?: number;
        2?: number;
        3?: number;
        4?: number;
        5?: number;
        6?: number;
        7?: number;
        8?: number;
        9?: number;
    };
    // Psionic / custom resource scaling
    aetherFluxPointsFormula?: string; // e.g., "level + abilityMod"
    resonanceChargesFormula?: string; // e.g., "level + Cha mod"
    adrenalSurges?: number; // Tweaker surges per long rest
    droneCapacity?: number; // Artifex active drones capacity
    repairPulseDie?: string; // Artifex repair pulse die at this level
    focusLimit?: number; // Mindweaver maximum concurrent maintained effects
    notes?: string; // any clarifying note
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
