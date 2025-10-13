// ============================================================================
// CORE CHARACTER TYPE
// ============================================================================

import type { AbilityScores } from "./abilities";
import type { CharacterClass } from "./classes";
import type { Condition } from "./conditions";
import type { Currency } from "./currency";
import type { Drone } from "./drones";
import type { InventoryItem, InventoryMod } from "./equipment";
import type { Language } from "./languages";
import type { Proficiencies, Skills } from "./proficiencies";
import type { AetherFluxPoints, HitPoints, ResonanceCharges, SpellSlots } from "./resources";
import type { SpeciesType } from "./species";

export interface Character {
    avatarUrl?: string;
    id: string; // unique identifier
    name: string;
    species: SpeciesType;
    classes: CharacterClass[];
    level: number; // derived from classes

    // Core Ability Scores
    abilityScores: AbilityScores;

    // Resources
    hitPoints: HitPoints;
    heatPoints: {
        current: number;
        maximum: number; // normally 10
    };

    skills: Skills;

    // Equipment & Inventory
    inventory: InventoryItem[];
    mods: InventoryMod[];
    currency: Currency;

    // Magic & Psionics
    spells: string[];
    spellSlots?: SpellSlots; // For Arcanist/Templar
    aetherFluxPoints?: AetherFluxPoints; // For Mindweaver/Arcanist
    resonanceCharges?: ResonanceCharges; // For Templar
    mindcraftPowers: string[];

    // Drones (Artifex only)
    drones?: Drone[]; // All drones the Artifex has built
    activeDroneId?: string; // ID of currently active/deployed drone

    // Combat Stats
    armorClass: number;
    initiative: number;
    speed: number;

    // Proficiencies & Skills
    proficiencies?: Proficiencies;
    languages: Language[];

    // Status Effects
    heatStressLevel: number; // 0-4
    exhaustionLevel: number;
    conditions: Condition[];

    // Background & Personality
    background?: string;
    traits?: string[];
    ideals?: string[];
    bonds?: string[];
    flaws?: string[];
}
