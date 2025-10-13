// ============================================================================
// COMBAT & HEAT (Chapter 7)
// ============================================================================

import type { ResourceType } from "./classes";

export type ActionType = "Action" | "Bonus Action" | "Reaction";
export type Die = 1 | 4 | 6 | 8 | 10 | 12 | 20 | 100;

export interface Rollable {
    count: number; // number of dice
    die: Die; // type of die (e.g., d6, d20)
    bonus?: number; // flat bonus to add
}

export interface DamageInfo extends Rollable {
    damageType: DamageType;
}

export type DamageType =
    | "Slashing"
    | "Piercing"
    | "Bludgeoning"
    | "Fire"
    | "Cold"
    | "Lightning"
    | "Thunder"
    | "Acid"
    | "Poison"
    | "Necrotic"
    | "Radiant"
    | "Force"
    | "Psychic";

export interface HeatTracking {
    current: number;
    maximum: number;
    stressLevel: number; // 0-4
    sources: HeatSource[];
}

export interface HeatSource {
    source: string;
    amount: number;
    timestamp?: Date;
}

export type OverheatResult = {
    roll: number;
    effect: string;
    damage?: DamageInfo;
};

export interface CombatAction {
    type: CombatActionType;
    name: string;
    description: string;
    heatCost?: number;
    resourceCost?: {
        type: ResourceType;
        amount: number;
    };
}

export type CombatActionType =
    | "Action"
    | "BonusAction"
    | "Reaction"
    | "Overclock"
    | "VentSteam"
    | "StabilizeMod"
    | "ChannelPsionics"
    | "CalibrateArmor";
