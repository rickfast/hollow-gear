import type { BestiaryEntry, ClassType, MindcraftPower, Mod, SpeciesType, Spell } from "@/types";
import type { ReferenceCategory } from "@/types/reference";

export interface ReferenceLinkTarget {
    category: ReferenceCategory;
    itemId: string;
}

/**
 * Build a reference page path for the given target.
 *
 * Example: `/reference?category=Spell&itemId=spell-Magic%20Missile`
 */
export function buildReferencePath({ category, itemId }: ReferenceLinkTarget): string {
    const params = new URLSearchParams({
        category,
        itemId,
    });

    return `/reference?${params.toString()}`;
}

export const getClassReferenceTarget = (classType: ClassType | string): ReferenceLinkTarget => ({
    category: "Class",
    itemId: `class-${classType}`,
});

export const getSpeciesReferenceTarget = (
    speciesType: SpeciesType | string
): ReferenceLinkTarget => ({
    category: "Species",
    itemId: `species-${speciesType}`,
});

export const getSpellReferenceTarget = (spell: Spell): ReferenceLinkTarget => ({
    category: "Spell",
    itemId: `spell-${spell.name}`,
});

export const getMindcraftReferenceTarget = (power: MindcraftPower): ReferenceLinkTarget => ({
    category: "Mindcraft",
    itemId: `mindcraft-${power.id}`,
});

export const getEquipmentReferenceTarget = (equipmentId: string): ReferenceLinkTarget => ({
    category: "Equipment",
    itemId: `equipment-${equipmentId}`,
});

export const getModReferenceTarget = (mod: Mod): ReferenceLinkTarget => ({
    category: "Mod",
    itemId: `mod-${mod.id}`,
});

export const getMonsterReferenceTarget = (
    monster: BestiaryEntry | string
): ReferenceLinkTarget => ({
    category: "Monster",
    itemId: typeof monster === "string" ? `monster-${monster}` : `monster-${monster.id}`,
});
