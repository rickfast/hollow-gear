/**
 * Mutable Character View Model
 *
 * This module provides a mutable extension of CharacterViewModel that supports
 * character state mutations including resource updates, rest mechanics, leveling,
 * inventory management, and spell/power management.
 *
 * All mutations validate inputs and return updated Character objects while
 * maintaining immutability of the original Character.
 *
 * @module mutable-character-view-model
 */

import { CLASSES, EQUIPMENT_BY_ID } from "@/data";
import type { AbilityScores, Character, SpellSlots, SubclassType } from "@/types";
import {
    ValidationError,
    calculateAbilityModifier,
    calculateProficiencyBonus,
    validateRange,
} from "./character-utils";
import { CharacterViewModel } from "./character-view-model";

/**
 * Options for leveling up a character
 */
export interface LevelUpOptions {
    /** Hit point roll (if not provided, use average) */
    hitPointRoll?: number;
    /** Subclass selection (required at level 3 if not set) */
    subclass?: SubclassType;
    /** Spells learned on level up (for classes that learn spells) */
    spellsLearned?: string[];
    /** Ability score improvement (at levels 4, 8, 12, 16, 19) */
    abilityScoreImprovement?: {
        ability1: keyof AbilityScores;
        ability2?: keyof AbilityScores;
    };
}

/**
 * Mutable Character View Model
 *
 * Extends CharacterViewModel with mutation capabilities for character state management.
 * All mutation methods validate inputs, apply changes, and return updated Character objects.
 */
export class MutableCharacterViewModel extends CharacterViewModel {
    private _mutableCharacter: Character;

    constructor(character: Character) {
        super(character);
        this._mutableCharacter = character;
    }

    /**
     * Serialize the view model back to a Character object
     * @returns The current character state
     */
    toCharacter(): Character {
        return { ...this._mutableCharacter };
    }

    /**
     * Create a deep clone of this view model
     * @returns A new MutableCharacterViewModel instance with cloned character data
     */
    clone(): MutableCharacterViewModel {
        return new MutableCharacterViewModel(JSON.parse(JSON.stringify(this._mutableCharacter)));
    }

    // ========================================================================
    // RESOURCE UPDATE METHODS
    // ========================================================================

    /**
     * Update hit points
     * @param current - Current hit points (0 to maximum)
     * @param temporary - Temporary hit points (optional, can exceed maximum)
     * @returns Updated character
     * @throws ValidationError if current HP is out of range
     */
    updateHitPoints(current: number, temporary?: number): Character {
        validateRange("hitPoints.current", current, 0, this._mutableCharacter.hitPoints.maximum);

        if (temporary !== undefined && temporary < 0) {
            throw new ValidationError("hitPoints.temporary", temporary, "must be non-negative");
        }

        this._mutableCharacter = {
            ...this._mutableCharacter,
            hitPoints: {
                ...this._mutableCharacter.hitPoints,
                current,
                temporary: temporary ?? this._mutableCharacter.hitPoints.temporary ?? 0,
            },
        };

        return this.toCharacter();
    }

    /**
     * Update heat points
     * @param current - Current heat points (0 to maximum)
     * @returns Updated character
     * @throws ValidationError if heat points are out of range
     */
    updateHeatPoints(current: number): Character {
        validateRange("heatPoints.current", current, 0, this._mutableCharacter.heatPoints.maximum);

        this._mutableCharacter = {
            ...this._mutableCharacter,
            heatPoints: {
                ...this._mutableCharacter.heatPoints,
                current,
            },
        };

        return this.toCharacter();
    }

    /**
     * Update spell slot for a specific level
     * @param level - Spell slot level (1-9)
     * @param current - Current spell slots available
     * @returns Updated character
     * @throws ValidationError if spell slots are out of range or character doesn't have spell slots
     */
    updateSpellSlot(level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, current: number): Character {
        if (!this._mutableCharacter.spellSlots) {
            throw new ValidationError(
                "spellSlots",
                undefined,
                "character does not have spell slots"
            );
        }

        const slotKey = `level${level}` as keyof SpellSlots;
        const maxSlots = this._mutableCharacter.spellSlots[slotKey].maximum;

        validateRange(`spellSlots.${slotKey}.current`, current, 0, maxSlots);

        this._mutableCharacter = {
            ...this._mutableCharacter,
            spellSlots: {
                ...this._mutableCharacter.spellSlots,
                [slotKey]: {
                    ...this._mutableCharacter.spellSlots[slotKey],
                    current,
                },
            },
        };

        return this.toCharacter();
    }

    /**
     * Update Aether Flux Points
     * @param current - Current AFP (0 to maximum)
     * @returns Updated character
     * @throws ValidationError if AFP is out of range or character doesn't have AFP
     */
    updateAetherFluxPoints(current: number): Character {
        if (!this._mutableCharacter.aetherFluxPoints) {
            throw new ValidationError(
                "aetherFluxPoints",
                undefined,
                "character does not have Aether Flux Points"
            );
        }

        validateRange(
            "aetherFluxPoints.current",
            current,
            0,
            this._mutableCharacter.aetherFluxPoints.maximum
        );

        this._mutableCharacter = {
            ...this._mutableCharacter,
            aetherFluxPoints: {
                ...this._mutableCharacter.aetherFluxPoints,
                current,
            },
        };

        return this.toCharacter();
    }

    /**
     * Update Resonance Charges
     * @param current - Current RC (0 to maximum)
     * @returns Updated character
     * @throws ValidationError if RC is out of range or character doesn't have RC
     */
    updateResonanceCharges(current: number): Character {
        if (!this._mutableCharacter.resonanceCharges) {
            throw new ValidationError(
                "resonanceCharges",
                undefined,
                "character does not have Resonance Charges"
            );
        }

        validateRange(
            "resonanceCharges.current",
            current,
            0,
            this._mutableCharacter.resonanceCharges.maximum
        );

        this._mutableCharacter = {
            ...this._mutableCharacter,
            resonanceCharges: {
                ...this._mutableCharacter.resonanceCharges,
                current,
            },
        };

        return this.toCharacter();
    }

    // ========================================================================
    // REST MECHANICS METHODS
    // ========================================================================

    /**
     * Take a short rest
     * @param hitDiceSpent - Number of hit dice to spend (optional)
     * @returns Updated character
     */
    takeShortRest(hitDiceSpent: number = 0): Character {
        const conMod = calculateAbilityModifier(this._mutableCharacter.abilityScores.constitution);
        const primaryClass = this._mutableCharacter.classes[0];

        if (!primaryClass) {
            throw new ValidationError(
                "classes",
                undefined,
                "character must have at least one class"
            );
        }

        // Calculate HP restoration from hit dice
        let hpRestored = 0;
        if (hitDiceSpent > 0) {
            // Parse hit die (e.g., "1d8" -> 8)
            const classData = CLASSES.find((c) => c.type === primaryClass.class);
            const hitDieMatch = classData?.hitDie.match(/\d+$/);
            const hitDie = hitDieMatch ? parseInt(hitDieMatch[0], 10) : 6;

            // Use average roll for each hit die + CON modifier
            hpRestored = hitDiceSpent * (Math.floor(hitDie / 2) + 1 + conMod);
        }

        const newHP = Math.min(
            this._mutableCharacter.hitPoints.current + hpRestored,
            this._mutableCharacter.hitPoints.maximum
        );

        // Restore AFP (half of maximum, rounded down)
        const updatedAFP = this._mutableCharacter.aetherFluxPoints
            ? {
                  ...this._mutableCharacter.aetherFluxPoints,
                  current: Math.min(
                      this._mutableCharacter.aetherFluxPoints.current +
                          this._mutableCharacter.aetherFluxPoints.rechargeRate.shortRest,
                      this._mutableCharacter.aetherFluxPoints.maximum
                  ),
              }
            : undefined;

        // Restore RC (half of maximum, rounded down)
        const updatedRC = this._mutableCharacter.resonanceCharges
            ? {
                  ...this._mutableCharacter.resonanceCharges,
                  current: Math.min(
                      this._mutableCharacter.resonanceCharges.current +
                          this._mutableCharacter.resonanceCharges.rechargeRate.shortRest,
                      this._mutableCharacter.resonanceCharges.maximum
                  ),
              }
            : undefined;

        this._mutableCharacter = {
            ...this._mutableCharacter,
            hitPoints: {
                ...this._mutableCharacter.hitPoints,
                current: newHP,
            },
            aetherFluxPoints: updatedAFP,
            resonanceCharges: updatedRC,
        };

        return this.toCharacter();
    }

    /**
     * Take a long rest
     * @returns Updated character
     */
    takeLongRest(): Character {
        // Restore all HP
        const restoredHP = {
            current: this._mutableCharacter.hitPoints.maximum,
            maximum: this._mutableCharacter.hitPoints.maximum,
            temporary: 0,
        };

        // Reset heat to 0
        const restoredHeat = {
            current: 0,
            maximum: this._mutableCharacter.heatPoints.maximum,
        };

        // Restore all spell slots
        const restoredSpellSlots = this._mutableCharacter.spellSlots
            ? ({
                  level1: {
                      current: this._mutableCharacter.spellSlots.level1.maximum,
                      maximum: this._mutableCharacter.spellSlots.level1.maximum,
                  },
                  level2: {
                      current: this._mutableCharacter.spellSlots.level2.maximum,
                      maximum: this._mutableCharacter.spellSlots.level2.maximum,
                  },
                  level3: {
                      current: this._mutableCharacter.spellSlots.level3.maximum,
                      maximum: this._mutableCharacter.spellSlots.level3.maximum,
                  },
                  level4: {
                      current: this._mutableCharacter.spellSlots.level4.maximum,
                      maximum: this._mutableCharacter.spellSlots.level4.maximum,
                  },
                  level5: {
                      current: this._mutableCharacter.spellSlots.level5.maximum,
                      maximum: this._mutableCharacter.spellSlots.level5.maximum,
                  },
                  level6: {
                      current: this._mutableCharacter.spellSlots.level6.maximum,
                      maximum: this._mutableCharacter.spellSlots.level6.maximum,
                  },
                  level7: {
                      current: this._mutableCharacter.spellSlots.level7.maximum,
                      maximum: this._mutableCharacter.spellSlots.level7.maximum,
                  },
                  level8: {
                      current: this._mutableCharacter.spellSlots.level8.maximum,
                      maximum: this._mutableCharacter.spellSlots.level8.maximum,
                  },
                  level9: {
                      current: this._mutableCharacter.spellSlots.level9.maximum,
                      maximum: this._mutableCharacter.spellSlots.level9.maximum,
                  },
              } as SpellSlots)
            : undefined;

        // Restore all AFP
        const restoredAFP = this._mutableCharacter.aetherFluxPoints
            ? {
                  ...this._mutableCharacter.aetherFluxPoints,
                  current: this._mutableCharacter.aetherFluxPoints.maximum,
              }
            : undefined;

        // Restore all RC
        const restoredRC = this._mutableCharacter.resonanceCharges
            ? {
                  ...this._mutableCharacter.resonanceCharges,
                  current: this._mutableCharacter.resonanceCharges.maximum,
              }
            : undefined;

        this._mutableCharacter = {
            ...this._mutableCharacter,
            hitPoints: restoredHP,
            heatPoints: restoredHeat,
            spellSlots: restoredSpellSlots,
            aetherFluxPoints: restoredAFP,
            resonanceCharges: restoredRC,
            heatStressLevel: 0,
        };

        return this.toCharacter();
    }

    // ========================================================================
    // CHARACTER PROGRESSION METHODS
    // ========================================================================

    /**
     * Level up the character
     * @param options - Level up options
     * @returns Updated character
     * @throws ValidationError if level up requirements are not met
     */
    levelUp(options: LevelUpOptions = {}): Character {
        const newLevel = this._mutableCharacter.level + 1;

        if (newLevel > 20) {
            throw new ValidationError("level", newLevel, "cannot exceed level 20");
        }

        const primaryClass = this._mutableCharacter.classes[0];
        if (!primaryClass) {
            throw new ValidationError(
                "classes",
                undefined,
                "character must have at least one class"
            );
        }

        const classData = CLASSES.find((c) => c.type === primaryClass.class);
        if (!classData) {
            throw new ValidationError("class", primaryClass.class, "invalid class type");
        }

        // Check for subclass requirement at level 3
        if (newLevel === 3 && !primaryClass.subclass && !options.subclass) {
            throw new ValidationError(
                "subclass",
                undefined,
                "subclass selection required at level 3"
            );
        }

        // Calculate HP increase
        const conMod = calculateAbilityModifier(this._mutableCharacter.abilityScores.constitution);
        const hitDieMatch = classData.hitDie.match(/\d+$/);
        const hitDie = hitDieMatch ? parseInt(hitDieMatch[0], 10) : 6;
        const hpIncrease =
            (options.hitPointRoll ?? Math.floor(hitDie / 2) + 1) + Math.max(conMod, 0);

        // Update proficiency bonus if needed
        const newProfBonus = calculateProficiencyBonus(newLevel);
        const oldProfBonus = calculateProficiencyBonus(this._mutableCharacter.level);

        // Recalculate skills if proficiency bonus changed
        const updatedSkills =
            oldProfBonus !== newProfBonus
                ? this._recalculateSkills(newProfBonus)
                : this._mutableCharacter.skills;

        // Update spell slots for spellcasters
        const updatedSpellSlots = this._updateSpellSlotsForLevel(newLevel);

        // Update AFP maximum
        const updatedAFP = this._mutableCharacter.aetherFluxPoints
            ? {
                  ...this._mutableCharacter.aetherFluxPoints,
                  maximum: this._calculateAFPMaximum(newLevel),
              }
            : undefined;

        // Update RC maximum
        const updatedRC = this._mutableCharacter.resonanceCharges
            ? {
                  ...this._mutableCharacter.resonanceCharges,
                  maximum: this._calculateRCMaximum(newLevel),
              }
            : undefined;

        // Apply ability score improvements if applicable
        let updatedAbilityScores = { ...this._mutableCharacter.abilityScores };
        if (options.abilityScoreImprovement && [4, 8, 12, 16, 19].includes(newLevel)) {
            const { ability1, ability2 } = options.abilityScoreImprovement;
            updatedAbilityScores[ability1] += 1;
            if (ability2) {
                updatedAbilityScores[ability2] += 1;
            }
        }

        // Update character
        this._mutableCharacter = {
            ...this._mutableCharacter,
            level: newLevel,
            classes: [
                {
                    ...primaryClass,
                    level: newLevel,
                    subclass: options.subclass ?? primaryClass.subclass,
                },
            ],
            hitPoints: {
                ...this._mutableCharacter.hitPoints,
                maximum: this._mutableCharacter.hitPoints.maximum + hpIncrease,
                current: this._mutableCharacter.hitPoints.current + hpIncrease,
            },
            abilityScores: updatedAbilityScores,
            skills: updatedSkills,
            spellSlots: updatedSpellSlots,
            aetherFluxPoints: updatedAFP,
            resonanceCharges: updatedRC,
            spells: options.spellsLearned
                ? [...this._mutableCharacter.spells, ...options.spellsLearned]
                : this._mutableCharacter.spells,
        };

        return this.toCharacter();
    }

    /**
     * Recalculate all skill modifiers with new proficiency bonus
     * @param proficiencyBonus - New proficiency bonus
     * @returns Updated skills
     */
    private _recalculateSkills(proficiencyBonus: number) {
        const skills = { ...this._mutableCharacter.skills };
        const abilityScores = this._mutableCharacter.abilityScores;

        // Map of skills to their ability scores
        const skillAbilities: Record<string, keyof AbilityScores> = {
            Acrobatics: "dexterity",
            "Animal Handling": "wisdom",
            Arcana: "intelligence",
            Athletics: "strength",
            Deception: "charisma",
            History: "intelligence",
            Insight: "wisdom",
            Intimidation: "charisma",
            Investigation: "intelligence",
            Medicine: "wisdom",
            Nature: "intelligence",
            Perception: "wisdom",
            Performance: "charisma",
            Persuasion: "charisma",
            Religion: "intelligence",
            "Sleight of Hand": "dexterity",
            Stealth: "dexterity",
            Survival: "wisdom",
            Tinkering: "intelligence",
        };

        for (const [skillName, skillData] of Object.entries(skills)) {
            const ability = skillAbilities[skillName];
            if (ability) {
                const abilityMod = calculateAbilityModifier(abilityScores[ability]);
                const profMod = skillData.proficient ? proficiencyBonus : 0;
                const expertiseMod = skillData.expertise ? proficiencyBonus : 0;
                (skills as Record<string, typeof skillData>)[skillName] = {
                    ...skillData,
                    modifier: abilityMod + profMod + expertiseMod,
                };
            }
        }

        return skills;
    }

    /**
     * Update spell slots for new level
     * @param level - New character level
     * @returns Updated spell slots or undefined
     */
    private _updateSpellSlotsForLevel(level: number): SpellSlots | undefined {
        if (!this._mutableCharacter.spellSlots) {
            return undefined;
        }

        // Spell slot progression table (simplified - would need full table for production)
        // This is a basic implementation - full implementation would reference spell slot tables
        const spellSlotsByLevel: Record<number, Partial<Record<keyof SpellSlots, number>>> = {
            1: { level1: 2 },
            2: { level1: 3 },
            3: { level1: 4, level2: 2 },
            4: { level1: 4, level2: 3 },
            5: { level1: 4, level2: 3, level3: 2 },
            // ... would continue for all levels
        };

        const newSlots = spellSlotsByLevel[level] || {};
        const updatedSpellSlots = { ...this._mutableCharacter.spellSlots };

        for (const [slotLevel, maxSlots] of Object.entries(newSlots)) {
            const key = slotLevel as keyof SpellSlots;
            if (maxSlots !== undefined) {
                updatedSpellSlots[key] = {
                    current: maxSlots,
                    maximum: maxSlots,
                };
            }
        }

        return updatedSpellSlots;
    }

    /**
     * Calculate AFP maximum for level
     * @param level - Character level
     * @returns AFP maximum
     */
    private _calculateAFPMaximum(level: number): number {
        // AFP = Level + Ability Modifier (INT or WIS depending on class)
        const primaryClass = this._mutableCharacter.classes[0];
        if (!primaryClass) return 0;

        const classData = CLASSES.find((c) => c.type === primaryClass.class);
        const abilityMod = classData
            ? calculateAbilityModifier(
                  this._mutableCharacter.abilityScores[classData.primaryAbility]
              )
            : 0;

        return level + abilityMod;
    }

    /**
     * Calculate RC maximum for level
     * @param level - Character level
     * @returns RC maximum
     */
    private _calculateRCMaximum(level: number): number {
        // RC = Templar Level + Wisdom modifier
        const wisMod = calculateAbilityModifier(this._mutableCharacter.abilityScores.wisdom);
        return level + wisMod;
    }

    // ========================================================================
    // INVENTORY MANAGEMENT METHODS
    // ========================================================================

    /**
     * Add an item to inventory
     * @param equipmentId - Equipment ID to add
     * @param equipped - Whether the item should be equipped (default: false)
     * @returns Updated character
     */
    addItem(equipmentId: string, equipped: boolean = false): Character {
        const newItem = {
            id: crypto.randomUUID(),
            equipmentId,
            mods: [],
            equipped,
        };

        this._mutableCharacter = {
            ...this._mutableCharacter,
            inventory: [...this._mutableCharacter.inventory, newItem],
        };

        // If equipped, recalculate AC if it's armor or shield
        if (equipped) {
            this._recalculateArmorClass();
        }

        return this.toCharacter();
    }

    /**
     * Remove an item from inventory
     * @param inventoryItemId - Inventory item ID to remove
     * @returns Updated character
     * @throws ValidationError if item not found
     */
    removeItem(inventoryItemId: string): Character {
        const itemIndex = this._mutableCharacter.inventory.findIndex(
            (item) => item.id === inventoryItemId
        );

        if (itemIndex === -1) {
            throw new ValidationError("inventoryItemId", inventoryItemId, "item not found");
        }

        const wasEquipped = this._mutableCharacter.inventory[itemIndex]!.equipped;

        this._mutableCharacter = {
            ...this._mutableCharacter,
            inventory: this._mutableCharacter.inventory.filter(
                (item) => item.id !== inventoryItemId
            ),
        };

        // Recalculate AC if equipped armor/shield was removed
        if (wasEquipped) {
            this._recalculateArmorClass();
        }

        return this.toCharacter();
    }

    /**
     * Equip an item
     * @param inventoryItemId - Inventory item ID to equip
     * @returns Updated character
     * @throws ValidationError if item not found
     */
    equipItem(inventoryItemId: string): Character {
        const itemIndex = this._mutableCharacter.inventory.findIndex(
            (item) => item.id === inventoryItemId
        );

        if (itemIndex === -1) {
            throw new ValidationError("inventoryItemId", inventoryItemId, "item not found");
        }

        const updatedInventory = [...this._mutableCharacter.inventory];
        updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex]!,
            equipped: true,
        };

        this._mutableCharacter = {
            ...this._mutableCharacter,
            inventory: updatedInventory,
        };

        this._recalculateArmorClass();

        return this.toCharacter();
    }

    /**
     * Unequip an item
     * @param inventoryItemId - Inventory item ID to unequip
     * @returns Updated character
     * @throws ValidationError if item not found
     */
    unequipItem(inventoryItemId: string): Character {
        const itemIndex = this._mutableCharacter.inventory.findIndex(
            (item) => item.id === inventoryItemId
        );

        if (itemIndex === -1) {
            throw new ValidationError("inventoryItemId", inventoryItemId, "item not found");
        }

        const updatedInventory = [...this._mutableCharacter.inventory];
        updatedInventory[itemIndex] = {
            ...updatedInventory[itemIndex]!,
            equipped: false,
        };

        this._mutableCharacter = {
            ...this._mutableCharacter,
            inventory: updatedInventory,
        };

        this._recalculateArmorClass();

        return this.toCharacter();
    }

    /**
     * Attach a mod to an equipment item
     * @param inventoryItemId - Inventory item ID
     * @param modId - Mod ID to attach
     * @returns Updated character
     * @throws ValidationError if item not found or mod tier incompatible
     */
    attachMod(inventoryItemId: string, modId: string): Character {
        const itemIndex = this._mutableCharacter.inventory.findIndex(
            (item) => item.id === inventoryItemId
        );

        if (itemIndex === -1) {
            throw new ValidationError("inventoryItemId", inventoryItemId, "item not found");
        }

        // TODO: Add tier validation when mod system is fully implemented

        const updatedInventory = [...this._mutableCharacter.inventory];
        const item = updatedInventory[itemIndex]!;
        updatedInventory[itemIndex] = {
            ...item,
            mods: [...item.mods, modId],
        };

        this._mutableCharacter = {
            ...this._mutableCharacter,
            inventory: updatedInventory,
        };

        return this.toCharacter();
    }

    /**
     * Detach a mod from an equipment item
     * @param inventoryItemId - Inventory item ID
     * @param modId - Mod ID to detach
     * @returns Updated character
     * @throws ValidationError if item or mod not found
     */
    detachMod(inventoryItemId: string, modId: string): Character {
        const itemIndex = this._mutableCharacter.inventory.findIndex(
            (item) => item.id === inventoryItemId
        );

        if (itemIndex === -1) {
            throw new ValidationError("inventoryItemId", inventoryItemId, "item not found");
        }

        const item = this._mutableCharacter.inventory[itemIndex]!;
        if (!item.mods.includes(modId)) {
            throw new ValidationError("modId", modId, "mod not attached to this item");
        }

        const updatedInventory = [...this._mutableCharacter.inventory];
        updatedInventory[itemIndex] = {
            ...item,
            mods: item.mods.filter((m) => m !== modId),
        };

        this._mutableCharacter = {
            ...this._mutableCharacter,
            inventory: updatedInventory,
        };

        return this.toCharacter();
    }

    /**
     * Recalculate armor class based on equipped armor and shield
     */
    private _recalculateArmorClass(): void {
        const dexMod = calculateAbilityModifier(this._mutableCharacter.abilityScores.dexterity);

        // Find equipped armor
        const equippedArmor = this._mutableCharacter.inventory.find((item) => {
            const equipment = EQUIPMENT_BY_ID[item.equipmentId];
            return item.equipped && equipment?.type === "Armor";
        });

        // Find equipped shield
        const equippedShield = this._mutableCharacter.inventory.find((item) => {
            const equipment = EQUIPMENT_BY_ID[item.equipmentId];
            return item.equipped && equipment?.type === "Shield";
        });

        let ac = 10 + dexMod; // Base unarmored AC

        if (equippedArmor) {
            const armor = EQUIPMENT_BY_ID[equippedArmor.equipmentId];
            if (armor && armor.type === "Armor") {
                const armorData = armor as import("@/types").Armor;
                if (typeof armorData.armorClass === "number") {
                    ac = armorData.armorClass;
                } else {
                    // Parse formula like "13 + Dex"
                    const baseMatch = armorData.armorClass.match(/^(\d+)/);
                    const baseAC = baseMatch && baseMatch[1] ? parseInt(baseMatch[1], 10) : 10;
                    const maxMatch = armorData.armorClass.match(/max\s+(\d+)/i);
                    const maxDex = maxMatch && maxMatch[1] ? parseInt(maxMatch[1], 10) : Infinity;
                    ac = baseAC + Math.min(dexMod, maxDex);
                }
            }
        }

        if (equippedShield) {
            const shield = EQUIPMENT_BY_ID[equippedShield.equipmentId];
            if (shield && shield.type === "Shield") {
                const shieldData = shield as import("@/types").Shield;
                ac += shieldData.armorClassBonus;
            }
        }

        this._mutableCharacter = {
            ...this._mutableCharacter,
            armorClass: ac,
        };
    }

    // ========================================================================
    // SPELL AND POWER MANAGEMENT METHODS
    // ========================================================================

    /**
     * Learn a new spell
     * @param spellName - Name of the spell to learn
     * @returns Updated character
     * @throws ValidationError if character cannot learn spells or spell is invalid
     */
    learnSpell(spellName: string): Character {
        // Check if character can learn spells
        const primaryClass = this._mutableCharacter.classes[0];
        if (!primaryClass) {
            throw new ValidationError(
                "classes",
                undefined,
                "character must have at least one class"
            );
        }

        const classData = CLASSES.find((c) => c.type === primaryClass.class);
        if (!classData?.spellcasting) {
            throw new ValidationError(
                "spellcasting",
                primaryClass.class,
                "character class cannot learn spells"
            );
        }

        // Check if spell is already known
        if (this._mutableCharacter.spells.includes(spellName)) {
            throw new ValidationError("spellName", spellName, "spell already known");
        }

        // TODO: Add spell level validation when spell data is available

        this._mutableCharacter = {
            ...this._mutableCharacter,
            spells: [...this._mutableCharacter.spells, spellName],
        };

        return this.toCharacter();
    }

    /**
     * Forget a spell
     * @param spellName - Name of the spell to forget
     * @returns Updated character
     * @throws ValidationError if spell is not known
     */
    forgetSpell(spellName: string): Character {
        if (!this._mutableCharacter.spells.includes(spellName)) {
            throw new ValidationError("spellName", spellName, "spell not known");
        }

        this._mutableCharacter = {
            ...this._mutableCharacter,
            spells: this._mutableCharacter.spells.filter((s) => s !== spellName),
        };

        return this.toCharacter();
    }

    /**
     * Learn a new mindcraft power
     * @param power - Mindcraft power to learn
     * @returns Updated character
     * @throws ValidationError if power tier is too high for character level
     */
    learnMindcraftPower(power: import("@/types").MindcraftPower): Character {
        // Validate power tier is appropriate for character level
        const maxTier = Math.ceil(this._mutableCharacter.level / 4);
        if (power.tier > maxTier) {
            throw new ValidationError(
                "power.tier",
                power.tier,
                `character level ${this._mutableCharacter.level} can only learn powers up to tier ${maxTier}`
            );
        }

        // Check if power is already known
        if (this._mutableCharacter.mindcraftPowers.some((p) => p === power.id)) {
            throw new ValidationError("power.name", power.name, "power already known");
        }

        this._mutableCharacter = {
            ...this._mutableCharacter,
            mindcraftPowers: [...this._mutableCharacter.mindcraftPowers, power.id],
        };

        return this.toCharacter();
    }

    /**
     * Forget a mindcraft power
     * @param powerName - Name of the power to forget
     * @returns Updated character
     * @throws ValidationError if power is not known
     */
    forgetMindcraftPower(id: string): Character {
        const powerIndex = this._mutableCharacter.mindcraftPowers.findIndex((p) => p === id);

        if (powerIndex === -1) {
            throw new ValidationError("id", id, "power not known");
        }

        this._mutableCharacter = {
            ...this._mutableCharacter,
            mindcraftPowers: this._mutableCharacter.mindcraftPowers.filter((p) => p !== id),
        };

        return this.toCharacter();
    }
}
