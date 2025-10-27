// ============================================================================
// REFERENCE SYSTEM
// ============================================================================

import type { Class } from "./classes";
import type { Equipment } from "./equipment";
import type { MindcraftPower } from "./mindcraft";
import type { Mod } from "./mods";
import type { Species } from "./species";
import type { Spell } from "./spells";

export type ReferenceCategory = "Spell" | "Mindcraft" | "Equipment" | "Mod" | "Species" | "Class";

export type ReferenceItemData = Spell | MindcraftPower | Equipment | Mod | Species | Class;

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
