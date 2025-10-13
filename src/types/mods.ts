// ============================================================================
// MODS (Chapter 5)
// ============================================================================

import type { DamageInfo, Rollable } from "./combat";
import type { CraftTier, EquipmentType } from "./equipment";

export interface ModSlot {
    tier: ModTier;
    mod?: Mod;
    empty: boolean;
}

export type ModTier = "I - Common" | "II - Advanced" | "III - Relic" | "IV - Prototype";

export interface ModTierSpec {
    tier: ModTier;
    craftTier: CraftTier;
    craftDC: number;
    timeHours: number;
    cost: number; // in Cogs
    powerLevel: string;
    slots: number; // number of mod slots of this tier
}

export type EffectType = "Hit Bonus" | "Damage Bonus" | "Heal";

export interface Effect {
    type: EffectType;
    value?: number; // flat bonus
    duration: "Instant" | "Round" | "Minute" | "Hour" | "UntilRest" | "Permanent";
    rollable?: Rollable;
}

export interface Mod {
    id: string;
    name: string;
    tier: ModTier;
    modType: ModType;
    equipmentType?: EquipmentType; // if restricted to certain equipment
    effect: string;
    craftDC: number;
    craftTime: number; // in hours
    cost: number; // in Cogs
    malfunctionChance?: number;
    notes?: string;
    additionalDamage?: DamageInfo;
}

export type ModType =
    | "Power" // Damage/output enhancement
    | "Utility" // Functional/utility
    | "Reactive" // Triggered effects
    | "Psionic" // Aether-based
    | "Elemental" // Element-specific
    | "Defense"; // Protective

export interface MalfunctionResult {
    roll: number;
    effect: string;
    severity: "Minor" | "Major" | "Critical";
}
