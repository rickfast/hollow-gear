/**
 * Character Utilities Module
 *
 * This module provides utility functions for character calculations and validations.
 * It includes functions for:
 * - Ability score modifier calculations
 * - Proficiency bonus calculations
 * - Skill modifier calculations
 * - Armor class calculations
 * - Initiative calculations
 * - Validation helpers
 * - Formatting utilities
 *
 * All calculations follow D&D 5E rules adapted for Hollow Gear 5E.
 *
 * @module character-utils
 */

import type {
    AbilityScores,
    Armor,
    Character,
    Shield,
    InventoryItem as CharacterInventoryItem,
} from "@/types";
import { EQUIPMENT_BY_ID } from "@/data";

/**
 * Custom error class for domain-specific validation errors
 */
export class ValidationError extends Error {
    constructor(
        public field: string,
        public value: unknown,
        public constraint: string
    ) {
        super(`Validation failed for ${field}: ${constraint} (received: ${value})`);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Calculate ability score modifier from ability score
 * @param abilityScore - The ability score (typically 1-30)
 * @returns The modifier (e.g., 10 -> 0, 16 -> +3, 8 -> -1)
 */
export function calculateAbilityModifier(abilityScore: number): number {
    return Math.floor((abilityScore - 10) / 2);
}

/**
 * Calculate proficiency bonus based on character level
 * @param level - Character level (1-20)
 * @returns Proficiency bonus (+2 to +6)
 */
export function calculateProficiencyBonus(level: number): number {
    if (level < 1 || level > 20) {
        throw new ValidationError("level", level, "must be between 1 and 20");
    }
    return Math.floor((level - 1) / 4) + 2;
    // Level 1-4: +2
    // Level 5-8: +3
    // Level 9-12: +4
    // Level 13-16: +5
    // Level 17-20: +6
}

/**
 * Calculate skill modifier
 * @param abilityScore - The relevant ability score
 * @param proficient - Whether the character is proficient in the skill
 * @param expertise - Whether the character has expertise in the skill
 * @param proficiencyBonus - The character's proficiency bonus
 * @returns The total skill modifier
 */
export function calculateSkillModifier(
    abilityScore: number,
    proficient: boolean,
    expertise: boolean,
    proficiencyBonus: number
): number {
    const abilityMod = calculateAbilityModifier(abilityScore);
    const profMod = proficient ? proficiencyBonus : 0;
    const expertiseMod = expertise ? proficiencyBonus : 0;
    return abilityMod + profMod + expertiseMod;
}

/**
 * Parse armor class formula like "13 + Dex" or "12 + Dex (max 2)"
 * @param formula - The armor class formula string
 * @param dexModifier - The character's dexterity modifier
 * @returns The calculated armor class
 */
export function parseArmorFormula(formula: string, dexModifier: number): number {
    // Handle formulas like "13 + Dex" or "12 + Dex (max 2)"
    const baseMatch = formula.match(/^(\d+)/);
    if (!baseMatch || !baseMatch[1]) {
        throw new ValidationError("armorFormula", formula, "invalid format");
    }

    const baseAC = parseInt(baseMatch[1], 10);

    if (!formula.includes("Dex")) {
        return baseAC;
    }

    // Check for max dex modifier
    const maxMatch = formula.match(/max\s+(\d+)/i);
    const maxDex = maxMatch && maxMatch[1] ? parseInt(maxMatch[1], 10) : Infinity;

    return baseAC + Math.min(dexModifier, maxDex);
}

/**
 * Calculate armor class for a character
 * @param character - The character
 * @param equippedArmor - The equipped armor (if any)
 * @param equippedShield - The equipped shield (if any)
 * @returns The calculated armor class
 */
export function calculateArmorClass(
    character: Character,
    equippedArmor?: Armor,
    equippedShield?: Shield
): number {
    const dexMod = calculateAbilityModifier(character.abilityScores.dexterity);

    if (!equippedArmor) {
        // Unarmored: 10 + Dex modifier
        return 10 + dexMod;
    }

    let ac: number;
    if (typeof equippedArmor.armorClass === "number") {
        ac = equippedArmor.armorClass;
    } else {
        // Parse formula like "13 + Dex" or "12 + Dex (max 2)"
        ac = parseArmorFormula(equippedArmor.armorClass, dexMod);
    }

    // Add shield bonus if equipped
    if (equippedShield) {
        ac += equippedShield.armorClassBonus;
    }

    return ac;
}

/**
 * Get equipped armor from character inventory
 * @param character - The character
 * @returns The equipped armor or undefined
 */
export function getEquippedArmor(character: Character): Armor | undefined {
    const equippedArmorItem = character.inventory.find((item) => {
        const equipment = EQUIPMENT_BY_ID[item.equipmentId];
        return item.equipped && equipment?.type === "Armor";
    });

    if (!equippedArmorItem) {
        return undefined;
    }

    return EQUIPMENT_BY_ID[equippedArmorItem.equipmentId] as Armor;
}

/**
 * Get equipped shield from character inventory
 * @param character - The character
 * @returns The equipped shield or undefined
 */
export function getEquippedShield(character: Character): Shield | undefined {
    const equippedShieldItem = character.inventory.find((item) => {
        const equipment = EQUIPMENT_BY_ID[item.equipmentId];
        return item.equipped && equipment?.type === "Shield";
    });

    if (!equippedShieldItem) {
        return undefined;
    }

    return EQUIPMENT_BY_ID[equippedShieldItem.equipmentId] as Shield;
}

/**
 * Calculate initiative modifier
 * @param dexterityScore - The character's dexterity score
 * @returns The initiative modifier
 */
export function calculateInitiative(dexterityScore: number): number {
    return calculateAbilityModifier(dexterityScore);
}

/**
 * Format a modifier as a string with + or - sign
 * @param modifier - The numeric modifier
 * @returns Formatted string (e.g., "+3", "-1", "+0")
 */
export function formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

/**
 * Validate that a value is within a range
 * @param field - The field name for error messages
 * @param value - The value to validate
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @throws ValidationError if value is out of range
 */
export function validateRange(field: string, value: number, min: number, max: number): void {
    if (value < min || value > max) {
        throw new ValidationError(field, value, `must be between ${min} and ${max}`);
    }
}

/**
 * Validate that a value is non-negative
 * @param field - The field name for error messages
 * @param value - The value to validate
 * @throws ValidationError if value is negative
 */
export function validateNonNegative(field: string, value: number): void {
    if (value < 0) {
        throw new ValidationError(field, value, "must be non-negative");
    }
}

/**
 * Calculate total weight carried by character
 * @param inventory - The character's inventory
 * @returns Total weight in pounds
 */
export function calculateTotalWeight(inventory: CharacterInventoryItem[]): number {
    return inventory.reduce((total, item) => {
        const equipment = EQUIPMENT_BY_ID[item.equipmentId];
        return total + (equipment?.weight || 0);
    }, 0);
}
