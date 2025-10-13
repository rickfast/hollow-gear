// ============================================================================
// ARTIFEX DRONES (Chapter 13)
// ============================================================================

import type { DamageInfo, Rollable } from "./combat";
import type { Feature } from "./common";
import type { HitPoints } from "./resources";

export type DroneSize = "Tiny" | "Small";

export type DroneType = "Utility" | "Combat" | "Recon";

export type DroneArchetype =
    | "Coghound"
    | "Gyrfly"
    | "Bulwark Node"
    | "Scribe Beetle"
    | "Chimera Frame";

export type DronePersonalityQuirk =
    | "Obsessively catalogs all mechanical sounds"
    | "Defends its maker's reputation with chirps or lights"
    | "Mimics the voice of its creator imperfectly"
    | "Collects small shiny objects or screws"
    | "Displays jealousy when ignored for too long"
    | "Emits low mechanical purring when praised";

export interface DroneStats {
    size: DroneSize;
    armorClass: number;
    hitPoints: {
        average: number;
        roll: string; // e.g., "2d6+1"
    };
    speed: {
        walk: number;
        fly?: number;
        climb?: number;
        swim?: number;
    };
    attack?: {
        name: string;
        bonus: number;
        damage: DamageInfo;
    };
}

export interface DroneTemplate {
    id: string;
    type: DroneType;
    name: string;
    stats: DroneStats;
    features: string[];
    description: string;
    modSlots: number; // Base mod slots (increases with Artifex level)
}

export interface DroneArchetypeTemplate {
    id: string;
    archetype: DroneArchetype;
    name: string;
    baseStats: Partial<DroneStats>;
    features: Feature[];
    description: string;
}

export interface Drone {
    id: string;
    name: string; // Custom name given by player
    templateId: string; // References DroneTemplate
    archetypeId?: string; // Optional archetype
    level: number; // Matches Artifex level
    hitPoints: HitPoints;
    heatPoints: {
        current: number;
        maximum: number;
    };
    modSlots: number;
    mods: string[]; // Array of mod IDs
    personalityQuirk?: DronePersonalityQuirk;
    customization?: {
        shellFinish?: "Verdigris brass" | "Black enamel" | "Mindglass lacquer";
        coreColor?: "Blue" | "Green" | "Red";
        behavioralQuirk?: string;
    };
    destroyed?: boolean; // Track if drone has been destroyed (can be rebuilt)
}

export interface DroneCommand {
    type: "Attack" | "Move" | "Defend" | "Ability" | "Return";
    target?: string;
    description: string;
    actionType: "Bonus Action" | "Action" | "Reaction";
}

export interface DroneMalfunction {
    roll: number;
    effect: string;
    damage?: DamageInfo;
}

export interface DroneEvolution {
    level: number; // Artifex level when upgrade is gained
    upgrade: string;
    bonuses: {
        armorClass?: number;
        hitPoints?: number;
        modSlots?: number;
        features?: string[];
    };
}

export interface DroneHeatSource {
    source: "Attack" | "Ability" | "Overclock" | "Flight" | "Heavy Lifting";
    amount: number;
}

// Drone crafting requirements
export interface DroneCraftingRequirements {
    proficiency: "Tinker's Tools";
    timeHours: number;
    materialCost: number; // in Cogs
    dc: number; // Tinkering check DC
    repairCost?: {
        timeHours: number;
        materialCost: number;
    };
}

// Drone repair action
export interface DroneRepair {
    actionType: "Action";
    cost: number; // in Cogs
    healing: string; // e.g., "1d6"
    overclock?: {
        cost: number;
        healing: Rollable; // e.g., "3d6"
        heatGain: number;
    };
}
