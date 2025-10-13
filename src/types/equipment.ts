// ============================================================================
// EQUIPMENT (Chapter 4)
// ============================================================================

import type { DamageInfo } from "./combat";

export interface InventoryItem {
    id: string;
    equipmentId: string;
    mods: string[];
    equipped: boolean;
}

export interface InventoryMod {
    id: string;
    modId: string;
    equipped: boolean;
}

export interface Equipment {
    id: string;
    name: string;
    type: EquipmentType;
    tier: CraftTier;
    cost: number; // in Cogs
    weight: number; // in lbs
    description?: string;
}

export type EquipmentType =
    | "Weapon"
    | "Armor"
    | "Shield"
    | "Tool"
    | "Item"
    | "Consumable"
    | "AetherCell"
    | "Focus";

export type CraftTier = "Workshop" | "Guild" | "Relic" | "Mythic";

export interface Weapon extends Equipment {
    type: "Weapon";
    weaponType: WeaponType;
    damage: DamageInfo;
    additionalDamage?: DamageInfo[];
    properties: WeaponProperty[];
    range?: { normal: number; max: number };
    ammoType?: AmmoType;
    powered?: boolean; // requires Aether Cells
}

export type WeaponType =
    | "Melee Simple"
    | "Melee Martial"
    | "Ranged Simple"
    | "Ranged Martial"
    | "Heavy";

export type WeaponProperty =
    | "Light"
    | "Finesse"
    | "Versatile"
    | "Two-Handed"
    | "Thrown"
    | "Reach"
    | "Reload"
    | "Powered"
    | "Burst"
    | "Silent"
    | "Heavy";

export type AmmoType = "Slugs" | "Rivets" | "Bolts" | "AetherCells" | "AetherCore" | "Pellets";

export interface Armor extends Equipment {
    type: "Armor";
    armorType: ArmorType;
    armorClass: number | string; // e.g., "13 + Dex" or 16
    strengthRequirement?: number;
    stealthDisadvantage: boolean;
    powered?: boolean;
}

export type ArmorType = "Light" | "Medium" | "Heavy";

export interface Shield extends Equipment {
    type: "Shield";
    armorClassBonus: number;
}
