/**
 * DroneBuilder Module
 *
 * Provides a builder pattern for creating new drones step-by-step.
 * Handles validation, stat calculation, and application of drone templates.
 *
 * @module drone-builder
 */

import { DRONE_TEMPLATES_BY_ID } from "@/data/drones";
import type { Drone, DronePersonalityQuirk, DroneType } from "@/types/drones";
import { ValidationError } from "./character-utils";

/**
 * Validation context for checking uniqueness and compatibility
 */
export interface DroneValidationContext {
    existingDrones: Drone[];
    availableMods?: string[];
}

/**
 * Builder class for creating new drones with fluent API
 */
export class DroneBuilder {
    private drone: Partial<Drone> = {};
    private validationContext?: DroneValidationContext;

    /**
     * Set validation context for uniqueness and compatibility checks
     */
    setValidationContext(context: DroneValidationContext): this {
        this.validationContext = context;
        return this;
    }

    /**
     * Set the drone's name
     */
    setName(name: string): this {
        if (!name || name.trim().length === 0) {
            throw new ValidationError("name", name, "must not be empty");
        }
        if (name.trim().length > 50) {
            throw new ValidationError("name", name, "must be 50 characters or less");
        }
        this.drone.name = name.trim();
        return this;
    }

    /**
     * Validate name uniqueness against existing drones
     */
    validateNameUniqueness(): void {
        if (!this.drone.name || !this.validationContext) {
            return;
        }

        const existingDrone = this.validationContext.existingDrones.find(
            (d) => d.name.toLowerCase() === this.drone.name!.toLowerCase() && d.id !== this.drone.id
        );

        if (existingDrone) {
            throw new ValidationError(
                "name",
                this.drone.name,
                `is already in use. Please choose a unique name for your drone.`
            );
        }
    }

    /**
     * Set the drone's description
     */
    setDescription(description: string): this {
        this.drone.customization = {
            ...this.drone.customization,
            behavioralQuirk: description.trim(),
        };
        return this;
    }

    /**
     * Set the drone's type (which determines the template)
     */
    setType(type: DroneType): this {
        // Find the template for this type
        const template = Object.values(DRONE_TEMPLATES_BY_ID).find((t) => t.type === type);
        if (!template) {
            throw new ValidationError("type", type, "invalid drone type");
        }

        this.drone.templateId = template.id;
        return this;
    }

    /**
     * Set the drone's template directly by ID
     */
    setTemplateId(templateId: string): this {
        const template = DRONE_TEMPLATES_BY_ID[templateId];
        if (!template) {
            throw new ValidationError("templateId", templateId, "invalid template ID");
        }

        this.drone.templateId = templateId;
        return this;
    }

    /**
     * Set the drone's archetype
     */
    setArchetype(archetypeId: string | undefined): this {
        this.drone.archetypeId = archetypeId;
        return this;
    }

    /**
     * Set the drone's level (typically matches owner's level)
     */
    setLevel(level: number): this {
        if (level < 1 || level > 20) {
            throw new ValidationError("level", level, "must be between 1 and 20");
        }
        this.drone.level = level;
        return this;
    }

    /**
     * Add equipment/mod to the drone
     */
    addMod(modId: string): this {
        if (!this.drone.mods) {
            this.drone.mods = [];
        }

        // Validate mod exists if validation context is provided
        if (this.validationContext?.availableMods) {
            if (!this.validationContext.availableMods.includes(modId)) {
                throw new ValidationError(
                    "mods",
                    modId,
                    `is not a valid mod. Please select from available equipment.`
                );
            }
        }

        // Validate against mod slot limit
        const template = this.drone.templateId
            ? DRONE_TEMPLATES_BY_ID[this.drone.templateId]
            : null;
        if (template) {
            const maxSlots = this.calculateModSlots(template.modSlots, this.drone.level || 1);
            if (this.drone.mods.length >= maxSlots) {
                throw new ValidationError(
                    "mods",
                    modId,
                    `cannot exceed ${maxSlots} mod slots. Remove an item before adding more.`
                );
            }
        }

        this.drone.mods.push(modId);
        return this;
    }

    /**
     * Remove a mod from the drone
     */
    removeMod(modId: string): this {
        if (this.drone.mods) {
            this.drone.mods = this.drone.mods.filter((id) => id !== modId);
        }
        return this;
    }

    /**
     * Set all mods at once
     */
    setMods(modIds: string[]): this {
        // Validate each mod exists if validation context is provided
        if (this.validationContext?.availableMods) {
            const invalidMods = modIds.filter(
                (id) => !this.validationContext!.availableMods!.includes(id)
            );
            if (invalidMods.length > 0) {
                throw new ValidationError(
                    "mods",
                    invalidMods.join(", "),
                    `contains invalid mods. Please select from available equipment.`
                );
            }
        }

        // Validate against mod slot limit
        const template = this.drone.templateId
            ? DRONE_TEMPLATES_BY_ID[this.drone.templateId]
            : null;
        if (template) {
            const maxSlots = this.calculateModSlots(template.modSlots, this.drone.level || 1);
            if (modIds.length > maxSlots) {
                throw new ValidationError(
                    "mods",
                    modIds.length,
                    `cannot exceed ${maxSlots} mod slots. You have selected ${modIds.length} items.`
                );
            }
        }

        this.drone.mods = [...modIds];
        return this;
    }

    /**
     * Set the drone's owner (character ID)
     */
    setOwner(characterId: string | undefined): this {
        this.drone.ownerId = characterId;
        return this;
    }

    /**
     * Set the drone's personality quirk
     */
    setPersonalityQuirk(quirk: DronePersonalityQuirk | undefined): this {
        this.drone.personalityQuirk = quirk;
        return this;
    }

    /**
     * Set the drone's shell finish
     */
    setShellFinish(finish: "Verdigris brass" | "Black enamel" | "Mindglass lacquer"): this {
        this.drone.customization = {
            ...this.drone.customization,
            shellFinish: finish,
        };
        return this;
    }

    /**
     * Set the drone's core color
     */
    setCoreColor(color: "Blue" | "Green" | "Red"): this {
        this.drone.customization = {
            ...this.drone.customization,
            coreColor: color,
        };
        return this;
    }

    /**
     * Build and validate the complete drone
     */
    build(): Drone {
        this.validateRequiredFields();
        this.validateNameUniqueness();
        this.initializeResources();
        this.calculateDerivedStats();

        return this.drone as Drone;
    }

    /**
     * Validate that all required fields are set
     */
    private validateRequiredFields(): void {
        if (!this.drone.name) {
            throw new ValidationError("name", undefined, "is required");
        }
        if (!this.drone.templateId) {
            throw new ValidationError("templateId", undefined, "is required");
        }
        if (!this.drone.level) {
            throw new ValidationError("level", undefined, "is required");
        }

        // Validate template exists
        const template = DRONE_TEMPLATES_BY_ID[this.drone.templateId];
        if (!template) {
            throw new ValidationError(
                "templateId",
                this.drone.templateId,
                "references non-existent template"
            );
        }
    }

    /**
     * Initialize resources at maximum values
     */
    private initializeResources(): void {
        const template = DRONE_TEMPLATES_BY_ID[this.drone.templateId!];
        if (!template) {
            return;
        }

        // Initialize hit points based on template
        const maxHP = template.stats.hitPoints.average;
        this.drone.hitPoints = {
            current: maxHP,
            maximum: maxHP,
            temporary: 0,
        };

        // Initialize heat points
        this.drone.heatPoints = {
            current: 0,
            maximum: 10,
        };

        // Calculate mod slots based on level
        this.drone.modSlots = this.calculateModSlots(template.modSlots, this.drone.level!);

        // Initialize mods array if not set
        if (!this.drone.mods) {
            this.drone.mods = [];
        }

        // Set destroyed flag to false
        this.drone.destroyed = false;
    }

    /**
     * Calculate derived stats and generate ID
     */
    private calculateDerivedStats(): void {
        // Generate unique ID
        this.drone.id = this.generateDroneId();
    }

    /**
     * Calculate mod slots based on base slots and level
     * Mod slots increase at levels 5, 9, 13, etc.
     */
    private calculateModSlots(baseSlots: number, level: number): number {
        let additionalSlots = 0;

        // Add 1 slot at level 5
        if (level >= 5) additionalSlots++;
        // Add another slot at level 9
        if (level >= 9) additionalSlots++;
        // Add another slot at level 13
        if (level >= 13) additionalSlots++;
        // Add another slot at level 17
        if (level >= 17) additionalSlots++;

        return baseSlots + additionalSlots;
    }

    /**
     * Generate a unique drone ID
     */
    private generateDroneId(): string {
        return `drone-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
}
