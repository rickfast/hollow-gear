/**
 * CharacterBuilder Module
 *
 * Provides a builder pattern for creating new characters step-by-step.
 * Handles validation, derived stat calculation, and application of species/class features.
 *
 * @module character-builder
 */

import { CLASSES } from "@/data/classes";
import { FIRST_NAMES, LAST_NAMES } from "@/data/names";
import { SPECIES } from "@/data/species";
import type { AbilityScores, Character, ClassType, SkillType, Skills, SpeciesType } from "@/types";
import {
    ValidationError,
    calculateAbilityModifier,
    calculateArmorClass,
    calculateInitiative,
    calculateProficiencyBonus,
    calculateSkillModifier,
} from "./character-utils";

/**
 * Builder class for creating new characters with fluent API
 */
export class CharacterBuilder {
    private character: Partial<Character> = {};

    /**
     * Set the character's name
     */
    setName(name: string): this {
        if (!name || name.trim().length === 0) {
            throw new ValidationError("name", name, "must not be empty");
        }
        this.character.name = name.trim();
        return this;
    }

    generateName(): this {
        const randomFirstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const randomLastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];

        const generatedName = `${randomFirstName} ${randomLastName}`;

        return this.setName(generatedName);
    }

    /**
     * Get the current name (useful for accessing generated names)
     */
    getName(): string | undefined {
        return this.character.name;
    }

    /**
     * Set the character's species
     */
    setSpecies(species: SpeciesType): this {
        const speciesData = SPECIES.find((s) => s.type === species);
        if (!speciesData) {
            throw new ValidationError("species", species, "invalid species type");
        }
        this.character.species = species;
        return this;
    }

    /**
     * Set the character's class
     */
    setClass(classType: ClassType): this {
        const classData = CLASSES.find((c) => c.type === classType);
        if (!classData) {
            throw new ValidationError("class", classType, "invalid class type");
        }

        this.character.classes = [
            {
                level: 1,
                class: classType,
            },
        ];
        this.character.level = 1;
        return this;
    }

    /**
     * Set the character's ability scores
     */
    setAbilityScores(scores: AbilityScores): this {
        // Validate ability scores are in valid range (typically 3-20 for starting characters)
        const abilities: (keyof AbilityScores)[] = [
            "strength",
            "dexterity",
            "constitution",
            "intelligence",
            "wisdom",
            "charisma",
        ];

        for (const ability of abilities) {
            const score = scores[ability];
            if (score < 1 || score > 20) {
                throw new ValidationError(
                    `abilityScores.${ability}`,
                    score,
                    "must be between 1 and 20"
                );
            }
        }

        this.character.abilityScores = { ...scores };
        return this;
    }

    /**
     * Set the character's background
     */
    setBackground(background: string): this {
        this.character.background = background;
        return this;
    }

    /**
     * Add starting equipment by equipment IDs
     */
    addStartingEquipment(equipmentIds: string[]): this {
        if (!this.character.inventory) {
            this.character.inventory = [];
        }

        for (const equipmentId of equipmentIds) {
            this.character.inventory.push({
                id: this.generateInventoryItemId(),
                equipmentId,
                mods: [],
                equipped: false,
            });
        }

        return this;
    }

    /**
     * Set avatar URL
     */
    setAvatarUrl(avatarUrl: string): this {
        this.character.avatarUrl = avatarUrl;
        return this;
    }

    /**
     * Build and validate the complete character
     */
    build(): Character {
        this.validateRequiredFields();
        this.applySpeciesTraits();
        this.applyClassFeatures();
        this.initializeResources();
        this.calculateDerivedStats();

        return this.character as Character;
    }

    /**
     * Validate that all required fields are set
     */
    private validateRequiredFields(): void {
        if (!this.character.name) {
            throw new ValidationError("name", undefined, "is required");
        }
        if (!this.character.species) {
            throw new ValidationError("species", undefined, "is required");
        }
        if (!this.character.classes || this.character.classes.length === 0) {
            throw new ValidationError("class", undefined, "is required");
        }
        if (!this.character.abilityScores) {
            throw new ValidationError("abilityScores", undefined, "are required");
        }
    }

    /**
     * Apply species ability score increases and traits
     */
    private applySpeciesTraits(): void {
        const speciesData = SPECIES.find((s) => s.type === this.character.species);
        if (!speciesData) {
            return;
        }

        // Apply ability score increases
        if (speciesData.abilityScoreIncrease && this.character.abilityScores) {
            const increases = speciesData.abilityScoreIncrease;
            const abilities: (keyof AbilityScores)[] = [
                "strength",
                "dexterity",
                "constitution",
                "intelligence",
                "wisdom",
                "charisma",
            ];

            for (const ability of abilities) {
                if (increases[ability]) {
                    this.character.abilityScores[ability] += increases[ability]!;
                }
            }
        }

        // Set speed
        this.character.speed = speciesData.speed;

        // Set languages
        this.character.languages = [...speciesData.languages];
    }

    /**
     * Apply class proficiencies and starting features
     */
    private applyClassFeatures(): void {
        const classData = CLASSES.find((c) => c.type === this.character.classes![0]!.class);
        if (!classData) {
            return;
        }

        // Set proficiencies
        if (classData.proficiencies) {
            this.character.proficiencies = {
                armor: classData.proficiencies.armor || [],
                weapons: classData.proficiencies.weapons || [],
                tools: classData.proficiencies.tools || [],
                savingThrows: classData.proficiencies.savingThrows || [],
                skills: classData.proficiencies.skills || [],
            };
        }
    }

    /**
     * Initialize resources at maximum values
     */
    private initializeResources(): void {
        const classData = CLASSES.find((c) => c.type === this.character.classes![0]!.class);
        if (!classData) {
            return;
        }

        const conMod = calculateAbilityModifier(this.character.abilityScores!.constitution);
        const hitDie = parseInt(classData.hitDie.substring(2)); // "1d8" -> 8

        // Initialize hit points (max at level 1)
        const maxHP = hitDie + conMod;
        this.character.hitPoints = {
            current: maxHP,
            maximum: maxHP,
            temporary: 0,
        };

        // Initialize heat points
        this.character.heatPoints = {
            current: 0,
            maximum: 10,
        };

        // Initialize spell slots for spellcasters
        if (classData.spellcasting) {
            this.character.spellSlots = {
                level1: { current: 2, maximum: 2 }, // Level 1 spellcasters get 2 slots
                level2: { current: 0, maximum: 0 },
                level3: { current: 0, maximum: 0 },
                level4: { current: 0, maximum: 0 },
                level5: { current: 0, maximum: 0 },
                level6: { current: 0, maximum: 0 },
                level7: { current: 0, maximum: 0 },
                level8: { current: 0, maximum: 0 },
                level9: { current: 0, maximum: 0 },
            };
        }

        // Initialize Aether Flux Points for classes that use them
        if (classData.primaryResource === "AetherFluxPoints") {
            const abilityMod = calculateAbilityModifier(
                this.character.abilityScores![classData.primaryAbility]
            );
            const maxAFP = this.character.level! + abilityMod;

            this.character.aetherFluxPoints = {
                current: maxAFP,
                maximum: maxAFP,
                rechargeRate: {
                    shortRest: Math.floor(maxAFP / 2),
                    longRest: maxAFP,
                },
            };
        }

        // Initialize Resonance Charges for Templars
        if (classData.primaryResource === "ResonanceCharges") {
            const wisMod = calculateAbilityModifier(this.character.abilityScores!.wisdom);
            const maxRC = this.character.level! + wisMod;

            this.character.resonanceCharges = {
                current: maxRC,
                maximum: maxRC,
                rechargeRate: {
                    shortRest: Math.floor(maxRC / 2),
                    longRest: maxRC,
                },
            };
        }

        // Initialize empty arrays
        this.character.spells = [];
        this.character.mindcraftPowers = [];
        this.character.conditions = [];
        this.character.mods = [];

        // Initialize inventory if not already set
        if (!this.character.inventory) {
            this.character.inventory = [];
        }

        // Initialize currency
        this.character.currency = {
            cogs: 0,
            gears: 0,
            cores: 0,
        };

        // Initialize status
        this.character.heatStressLevel = 0;
        this.character.exhaustionLevel = 0;
    }

    /**
     * Calculate derived stats (AC, initiative, skill modifiers)
     */
    private calculateDerivedStats(): void {
        if (!this.character.abilityScores) {
            return;
        }

        // Generate unique ID
        this.character.id = this.generateCharacterId();

        // Calculate initiative
        this.character.initiative = calculateInitiative(this.character.abilityScores.dexterity);

        // Calculate armor class (unarmored by default)
        this.character.armorClass = calculateArmorClass(this.character as Character);

        // Calculate skill modifiers
        this.character.skills = this.calculateSkills();
    }

    /**
     * Calculate all skill modifiers
     */
    private calculateSkills(): Skills {
        const proficiencyBonus = calculateProficiencyBonus(this.character.level!);
        const abilityScores = this.character.abilityScores!;
        const proficientSkills = this.character.proficiencies?.skills || [];

        const skillAbilityMap: Record<SkillType, keyof AbilityScores> = {
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

        const skills: Partial<Skills> = {};

        for (const [skillName, abilityKey] of Object.entries(skillAbilityMap)) {
            const isProficient = proficientSkills.includes(skillName as SkillType);
            const modifier = calculateSkillModifier(
                abilityScores[abilityKey],
                isProficient,
                false, // No expertise at level 1
                proficiencyBonus
            );

            skills[skillName as SkillType] = {
                modifier,
                proficient: isProficient,
                expertise: false,
            };
        }

        return skills as Skills;
    }

    /**
     * Generate a unique character ID
     */
    private generateCharacterId(): string {
        return `char-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Generate a unique inventory item ID
     */
    private generateInventoryItemId(): string {
        return `inv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
}
