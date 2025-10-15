// ============================================================================
// SPELLS (Chapter 11)
// ============================================================================

import type { AbilityScores } from "./abilities";
import type { ClassType } from "./classes";
import type { DamageInfo } from "./combat";

export interface Spell {
    name: string;
    level: number; // 0-9 (0 = cantrip)
    school: SpellSchool;
    type: SpellEffect;
    castingTime: string;
    range: string;
    components: {
        verbal: boolean;
        somatic: boolean;
        material: boolean;
        materials?: string;
    };
    duration: string;
    concentration: boolean;

    // Hollowgear-specific
    classes: ClassType[]; // Which classes can cast this spell
    aetherCost?: number; // AFP/RC cost
    hollowgearName?: string; // e.g., "Arc Pulse Array" for Magic Missile
    overclockable: boolean;
    heatGenerated?: number;

    savingThrow?: {
        ability: keyof AbilityScores;
        dc: number;
    };
    damage?: DamageInfo; // for spells that deal damage

    description: string;
    higherLevels?: string;
}

export type SpellEffect =
    | "Attack"
    | "Save"
    | "Automatic Hit"
    | "Heal"
    | "Buff"
    | "Movement"
    | "Utility";

export type SpellSchool =
    | "Abjuration"
    | "Conjuration"
    | "Divination"
    | "Enchantment"
    | "Evocation"
    | "Illusion"
    | "Necromancy"
    | "Transmutation";

export interface SpellcastingMethod {
    type: "Arcanist" | "Templar";
    spellLists: string[];
    resourceType: "AetherFluxPoints" | "ResonanceCharges";
    overclockMechanic: string;
    focusType: string;
}
