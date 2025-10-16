import type { AbilityScores, ClassType } from "@/types";

/**
 * Optimized ability score arrays for each class.
 * These arrays are designed to maximize effectiveness for each class's primary abilities
 * and typical playstyle, using the standard array values [15, 14, 13, 12, 10, 8].
 */
export const OPTIMIZED_ABILITY_SCORES: Record<ClassType, AbilityScores> = {
    // Arcanist: INT primary, DEX for AC, CON for survivability
    Arcanist: {
        strength: 8,
        dexterity: 14,
        constitution: 12,
        intelligence: 15,
        wisdom: 10,
        charisma: 13,
    },

    // Templar: CHA primary for features, WIS for spellcasting, STR for melee, CON for tanking
    Templar: {
        strength: 14,
        dexterity: 8,
        constitution: 13,
        intelligence: 10,
        wisdom: 12,
        charisma: 15,
    },

    // Tweaker: CON primary, STR for melee damage, DEX for AC
    Tweaker: {
        strength: 14,
        dexterity: 12,
        constitution: 15,
        intelligence: 8,
        wisdom: 10,
        charisma: 13,
    },

    // Shadehand: DEX primary for attacks and AC, INT for skills, CON for survivability
    Shadehand: {
        strength: 8,
        dexterity: 15,
        constitution: 12,
        intelligence: 14,
        wisdom: 10,
        charisma: 13,
    },

    // Vanguard: STR primary for attacks, CON for tanking, DEX for initiative
    Vanguard: {
        strength: 15,
        dexterity: 12,
        constitution: 14,
        intelligence: 8,
        wisdom: 10,
        charisma: 13,
    },

    // Artifex: INT primary for features, DEX for AC and ranged attacks, CON for survivability
    Artifex: {
        strength: 8,
        dexterity: 14,
        constitution: 12,
        intelligence: 15,
        wisdom: 13,
        charisma: 10,
    },

    // Mindweaver: INT primary (default), WIS secondary for awareness, DEX for AC
    Mindweaver: {
        strength: 8,
        dexterity: 13,
        constitution: 12,
        intelligence: 15,
        wisdom: 14,
        charisma: 10,
    },
};
