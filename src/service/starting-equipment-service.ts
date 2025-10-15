import type { Character, ClassType, InventoryItem, StartingEquipment } from "@/types";
import { CLASSES } from "@/data/classes";
import { EQUIPMENT_BY_ID } from "@/data/equipment";

/**
 * Service for managing starting equipment for character classes.
 * Handles retrieval, application, and valuation of starting equipment.
 */
export class StartingEquipmentService {
    /**
     * Get starting equipment definition for a class
     * @param classType The class type to get starting equipment for
     * @returns The starting equipment definition
     * @throws Error if class type is invalid or not found
     */
    getStartingEquipment(classType: ClassType): StartingEquipment {
        const classData = CLASSES.find((c) => c.type === classType);

        if (!classData) {
            throw new Error(`Invalid class type: ${classType}`);
        }

        if (!classData.startingEquipment) {
            throw new Error(`No starting equipment defined for class: ${classType}`);
        }

        return classData.startingEquipment;
    }

    /**
     * Apply starting equipment to a character
     * @param character The character to apply equipment to
     * @param classType The class type to get starting equipment from
     * @returns A new character object with starting equipment applied
     * @throws Error if class type is invalid or equipment IDs are not found
     */
    applyStartingEquipment(character: Character, classType: ClassType): Character {
        const startingEquipment = this.getStartingEquipment(classType);

        // Create new inventory items from starting equipment
        const newInventoryItems: InventoryItem[] = [];

        // Add weapons
        for (const weaponId of startingEquipment.weapons) {
            if (!EQUIPMENT_BY_ID[weaponId]) {
                throw new Error(`Equipment not found: ${weaponId}`);
            }
            newInventoryItems.push({
                id: this.generateInventoryItemId(),
                equipmentId: weaponId,
                mods: [],
                equipped: false, // User can equip manually
            });
        }

        // Add armor
        if (startingEquipment.armor) {
            if (!EQUIPMENT_BY_ID[startingEquipment.armor]) {
                throw new Error(`Equipment not found: ${startingEquipment.armor}`);
            }
            newInventoryItems.push({
                id: this.generateInventoryItemId(),
                equipmentId: startingEquipment.armor,
                mods: [],
                equipped: true, // Armor is typically equipped by default
            });
        }

        // Add tools
        for (const toolId of startingEquipment.tools) {
            if (!EQUIPMENT_BY_ID[toolId]) {
                throw new Error(`Equipment not found: ${toolId}`);
            }
            newInventoryItems.push({
                id: this.generateInventoryItemId(),
                equipmentId: toolId,
                mods: [],
                equipped: false,
            });
        }

        // Add items
        for (const itemId of startingEquipment.items) {
            if (!EQUIPMENT_BY_ID[itemId]) {
                throw new Error(`Equipment not found: ${itemId}`);
            }
            newInventoryItems.push({
                id: this.generateInventoryItemId(),
                equipmentId: itemId,
                mods: [],
                equipped: false,
            });
        }

        // Return new character with updated inventory and currency
        return {
            ...character,
            inventory: [...character.inventory, ...newInventoryItems],
            currency: {
                cogs: character.currency.cogs + startingEquipment.currency.cogs,
                gears: character.currency.gears + startingEquipment.currency.gears,
                cores: character.currency.cores + startingEquipment.currency.cores,
            },
        };
    }

    /**
     * Calculate the total value of starting equipment in cogs
     * @param equipment The starting equipment to calculate value for
     * @returns Total value in cogs
     */
    calculateEquipmentValue(equipment: StartingEquipment): number {
        let totalValue = 0;

        // Add weapon values
        for (const weaponId of equipment.weapons) {
            const item = EQUIPMENT_BY_ID[weaponId];
            if (item) {
                totalValue += item.cost;
            }
        }

        // Add armor value
        if (equipment.armor) {
            const item = EQUIPMENT_BY_ID[equipment.armor];
            if (item) {
                totalValue += item.cost;
            }
        }

        // Add tool values
        for (const toolId of equipment.tools) {
            const item = EQUIPMENT_BY_ID[toolId];
            if (item) {
                totalValue += item.cost;
            }
        }

        // Add item values
        for (const itemId of equipment.items) {
            const item = EQUIPMENT_BY_ID[itemId];
            if (item) {
                totalValue += item.cost;
            }
        }

        // Add currency value
        totalValue += equipment.currency.cogs;
        totalValue += equipment.currency.gears * 10; // 1 gear = 10 cogs
        totalValue += equipment.currency.cores * 100; // 1 core = 100 cogs

        return totalValue;
    }

    /**
     * Generate a unique inventory item ID
     * @returns A unique ID string
     */
    private generateInventoryItemId(): string {
        return `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
}

// Export a singleton instance for convenience
export const startingEquipmentService = new StartingEquipmentService();
