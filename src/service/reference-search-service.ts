// ============================================================================
// REFERENCE SEARCH SERVICE
// ============================================================================

import { BESTIARY_CREATURES } from "@/data/bestiary";
import { CLASSES } from "@/data/classes";
import { ALL_EQUIPMENT, MODS } from "@/data/equipment";
import { MINDCRAFT_POWERS } from "@/data/mindcraft";
import { SPECIES } from "@/data/species";
import { SPELLS } from "@/data/spells";
import type { ReferenceCategory, ReferenceItem, Spell } from "@/types";

/**
 * Reference Search Service
 *
 * Provides unified search across all game data categories:
 * - Spells (Arcanist Formulae and Templar Miracles)
 * - Mindcraft Powers (Psionic abilities)
 * - Equipment (Weapons, armor, items)
 * - Mods (Equipment modifications)
 * - Species (Playable races)
 * - Classes (Character classes)
 */
class ReferenceSearchService {
    private allItems: ReferenceItem[];

    constructor() {
        this.allItems = this.buildReferenceItems();
    }

    /**
     * Build the complete list of searchable reference items
     */
    private buildReferenceItems(): ReferenceItem[] {
        const items: ReferenceItem[] = [];

        // Add spells
        SPELLS.forEach((spell) => {
            items.push({
                id: `spell-${spell.name}`,
                name: spell.hollowgearName || spell.name,
                category: "Spell",
                data: spell,
            });
        });

        // Add mindcraft powers
        MINDCRAFT_POWERS.forEach((power) => {
            items.push({
                id: `mindcraft-${power.id}`,
                name: power.name,
                category: "Mindcraft",
                data: power,
            });
        });

        // Add equipment
        ALL_EQUIPMENT.forEach((equipment) => {
            items.push({
                id: `equipment-${equipment.id}`,
                name: equipment.name,
                category: "Equipment",
                data: equipment,
            });
        });

        // Add mods
        MODS.forEach((mod) => {
            items.push({
                id: `mod-${mod.id}`,
                name: mod.name,
                category: "Mod",
                data: mod,
            });
        });

        // Add species
        SPECIES.forEach((species) => {
            items.push({
                id: `species-${species.type}`,
                name: species.type,
                category: "Species",
                data: species,
            });
        });

        // Add classes and subclasses
        CLASSES.forEach((classData) => {
            // Parent class entry
            items.push({
                id: `class-${classData.type}`,
                name: classData.type,
                category: "Class",
                data: classData,
            });

            // Subclasses (if any)
            classData.subclasses.forEach((sub) => {
                // Sanitize ID to avoid spaces
                const subclassSlug = sub.type.replace(/\s+/g, "-");
                items.push({
                    id: `subclass-${classData.type}-${subclassSlug}`,
                    name: `${sub.type} (${classData.type})`, // include parent for disambiguation in search
                    category: "Subclass",
                    data: { parentClass: classData, subclass: sub },
                });
            });
        });

        // Add monsters (bestiary entries)
        BESTIARY_CREATURES.forEach((creature) => {
            items.push({
                id: `monster-${creature.id}`,
                name: creature.name,
                category: "Monster",
                data: creature,
            });
        });

        return items;
    }

    /**
     * Search all reference items by name
     *
     * @param query - Search query string
     * @returns Array of matching reference items (max 50 results)
     */
    searchAll(query: string): ReferenceItem[] {
        // Handle empty query
        if (!query || query.trim() === "") {
            return [];
        }

        const normalizedQuery = query.toLowerCase().trim();

        // Filter and score results
        const results = this.allItems
            .map((item) => {
                const normalizedName = item.name.toLowerCase();
                let matchScore = 0;

                // Exact match (highest priority)
                if (normalizedName === normalizedQuery) {
                    matchScore = 1.0;
                }
                // Starts with query (high priority)
                else if (normalizedName.startsWith(normalizedQuery)) {
                    matchScore = 0.8;
                }
                // Contains query (medium priority)
                else if (normalizedName.includes(normalizedQuery)) {
                    matchScore = 0.5;
                }
                // Check standard spell name for spells
                else if (item.category === "Spell") {
                    const spell = item.data as Spell;
                    const standardName = spell.name.toLowerCase();
                    if (standardName === normalizedQuery) {
                        matchScore = 0.9;
                    } else if (standardName.startsWith(normalizedQuery)) {
                        matchScore = 0.7;
                    } else if (standardName.includes(normalizedQuery)) {
                        matchScore = 0.4;
                    }
                }

                return { item, matchScore };
            })
            .filter((result) => result.matchScore > 0)
            .sort((a, b) => {
                // Sort by match score (descending)
                if (b.matchScore !== a.matchScore) {
                    return b.matchScore - a.matchScore;
                }
                // Then alphabetically by name
                return a.item.name.localeCompare(b.item.name);
            })
            .slice(0, 50) // Limit to 50 results
            .map((result) => result.item);

        return results;
    }

    /**
     * Get a specific item by ID and category
     *
     * @param id - Item ID
     * @param category - Item category
     * @returns Reference item or null if not found
     */
    getItemById(id: string, category: ReferenceCategory): ReferenceItem | null {
        const item = this.allItems.find((item) => item.id === id && item.category === category);
        return item || null;
    }

    /**
     * Get all items in a specific category
     *
     * @param category - Category to filter by
     * @returns Array of reference items in the category
     */
    getItemsByCategory(category: ReferenceCategory): ReferenceItem[] {
        return this.allItems.filter((item) => item.category === category);
    }
}

// Export singleton instance
export const referenceSearchService = new ReferenceSearchService();
