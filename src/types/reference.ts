// ============================================================================
// REFERENCE SYSTEM
// ============================================================================

import type { BestiaryEntry } from "./bestiary";
import type { Class, Subclass } from "./classes";
import type { Equipment } from "./equipment";
import type { MindcraftPower } from "./mindcraft";
import type { Mod } from "./mods";
import type { Species } from "./species";
import type { Spell } from "./spells";

export type ReferenceCategory =
    | "Spell"
    | "Mindcraft"
    | "Equipment"
    | "Mod"
    | "Species"
    | "Class"
    | "Subclass" // Newly added: dedicated subclass detail pages
    | "Monster";

// Data structure for subclass reference entries, pairing the subclass with its parent class
export interface SubclassReferenceData {
    parentClass: Class; // full parent class object for context
    subclass: Subclass; // specific subclass definition
}

export type ReferenceItemData =
    | Spell
    | MindcraftPower
    | Equipment
    | Mod
    | Species
    | Class
    | SubclassReferenceData
    | BestiaryEntry;

export interface ReferenceItem {
    id: string;
    name: string;
    category: ReferenceCategory;
    data: ReferenceItemData;
}

export interface SearchResult {
    item: ReferenceItem;
    matchScore: number; // For ranking results (0-1, higher is better)
}
