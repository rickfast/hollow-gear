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
import { startingEquipmentService } from "@/service/starting-equipment-service";
import type {
    AbilityScores,
    Character,
    CharacterClass,
    ClassConfiguration,
    ClassType,
    SkillType,
    Skills,
    SpeciesType,
} from "@/types";
import {
    ValidationError,
    calculateAbilityModifier,
    calculateArmorClass,
    calculateInitiative,
    calculateProficiencyBonus,
    calculateSkillModifier,
} from "./character-utils";

/**
 * Multiclass ability score prerequisites
 * A character must have at least 13 in the specified ability to multiclass into that class
 */
const MULTICLASS_REQUIREMENTS: Record<ClassType, Partial<AbilityScores>> = {
    Arcanist: { intelligence: 13 },
    Templar: { charisma: 13 },
    Vanguard: { strength: 13 },
    Shadehand: { dexterity: 13 },
    Artifex: { intelligence: 13 },
    Mindweaver: { wisdom: 13 },
    Tweaker: { constitution: 13 },
};

/**
 * Builder class for creating new characters with fluent API
 * Supports both create mode (new characters) and edit mode (existing characters)
 */
export class CharacterBuilder {
    private character: Partial<Character> = {};
    private classConfiguration?: ClassConfiguration;
    private classConfigurations: ClassConfiguration[] = [];
    private isEditMode: boolean = false;
    private originalCharacterId?: string;
    private abilityScoresLocked: boolean = false;

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
        // Check if ability scores are locked (edit mode)
        if (this.abilityScoresLocked) {
            throw new ValidationError(
                "abilityScores",
                scores,
                "cannot modify ability scores after initial creation"
            );
        }

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
     * Set class configuration for level 1
     * This stores the choices made during class configuration (subclass, features, spells, etc.)
     */
    setClassConfiguration(config: ClassConfiguration): this {
        // Validate that configuration matches the character's class
        if (this.character.classes && this.character.classes.length > 0) {
            const characterClass = this.character.classes[0]!.class;
            if (config.classType !== characterClass) {
                throw new ValidationError(
                    "classConfiguration",
                    config.classType,
                    `must match character class ${characterClass}`
                );
            }
        }

        // Validate that configuration is for level 1
        if (config.level !== 1) {
            throw new ValidationError(
                "classConfiguration.level",
                config.level,
                "must be 1 for character creation"
            );
        }

        this.classConfiguration = config;
        return this;
    }

    /**
     * Initialize builder from an existing character for editing
     * Creates a deep copy to avoid mutating the original
     */
    static fromCharacter(character: Character): CharacterBuilder {
        const builder = new CharacterBuilder();
        builder.isEditMode = true;
        builder.originalCharacterId = character.id;
        builder.abilityScoresLocked = true;

        // Deep copy the character data
        builder.character = {
            ...character,
            abilityScores: { ...character.abilityScores },
            classes: character.classes.map((c) => ({ ...c })),
            hitPoints: { ...character.hitPoints },
            heatPoints: { ...character.heatPoints },
            skills: { ...character.skills },
            inventory: character.inventory.map((item) => ({
                ...item,
                mods: [...item.mods],
            })),
            mods: [...character.mods],
            currency: { ...character.currency },
            spells: [...character.spells],
            mindcraftPowers: [...character.mindcraftPowers],
            conditions: [...character.conditions],
            languages: [...character.languages],
            proficiencies: character.proficiencies
                ? {
                      armor: [...character.proficiencies.armor],
                      weapons: [...character.proficiencies.weapons],
                      tools: [...character.proficiencies.tools],
                      savingThrows: [...character.proficiencies.savingThrows],
                      skills: [...character.proficiencies.skills],
                  }
                : undefined,
            spellSlots: character.spellSlots
                ? {
                      level1: { ...character.spellSlots.level1 },
                      level2: { ...character.spellSlots.level2 },
                      level3: { ...character.spellSlots.level3 },
                      level4: { ...character.spellSlots.level4 },
                      level5: { ...character.spellSlots.level5 },
                      level6: { ...character.spellSlots.level6 },
                      level7: { ...character.spellSlots.level7 },
                      level8: { ...character.spellSlots.level8 },
                      level9: { ...character.spellSlots.level9 },
                  }
                : undefined,
            aetherFluxPoints: character.aetherFluxPoints
                ? {
                      ...character.aetherFluxPoints,
                      rechargeRate: { ...character.aetherFluxPoints.rechargeRate },
                  }
                : undefined,
            resonanceCharges: character.resonanceCharges
                ? {
                      ...character.resonanceCharges,
                      rechargeRate: { ...character.resonanceCharges.rechargeRate },
                  }
                : undefined,
            drones: character.drones?.map((drone) => ({ ...drone })),
            classConfigurations: character.classConfigurations?.map((config) => ({
                ...config,
                featureChoices: { ...config.featureChoices },
                spellsSelected: config.spellsSelected ? [...config.spellsSelected] : undefined,
                powersSelected: config.powersSelected ? [...config.powersSelected] : undefined,
                proficienciesSelected: config.proficienciesSelected
                    ? [...config.proficienciesSelected]
                    : undefined,
            })),
            features: character.features?.map((feature) => ({ ...feature })),
            traits: character.traits ? [...character.traits] : undefined,
            ideals: character.ideals ? [...character.ideals] : undefined,
            bonds: character.bonds ? [...character.bonds] : undefined,
            flaws: character.flaws ? [...character.flaws] : undefined,
        };

        // Copy existing class configurations
        if (character.classConfigurations) {
            builder.classConfigurations = character.classConfigurations.map((config) => ({
                ...config,
                featureChoices: { ...config.featureChoices },
                spellsSelected: config.spellsSelected ? [...config.spellsSelected] : undefined,
                powersSelected: config.powersSelected ? [...config.powersSelected] : undefined,
                proficienciesSelected: config.proficienciesSelected
                    ? [...config.proficienciesSelected]
                    : undefined,
            }));
        }

        return builder;
    }

    /**
     * Set multiple class levels at once (for multiclassing or leveling up)
     */
    setClasses(classes: CharacterClass[]): this {
        if (classes.length === 0) {
            throw new ValidationError("classes", classes, "must have at least one class");
        }

        // Validate each class
        for (const classEntry of classes) {
            const classData = CLASSES.find((c) => c.type === classEntry.class);
            if (!classData) {
                throw new ValidationError("class", classEntry.class, "invalid class type");
            }

            if (classEntry.level < 1 || classEntry.level > 20) {
                throw new ValidationError(
                    "class.level",
                    classEntry.level,
                    "must be between 1 and 20"
                );
            }
        }

        // Calculate total level
        const totalLevel = classes.reduce((sum, c) => sum + c.level, 0);
        if (totalLevel > 20) {
            throw new ValidationError("classes", totalLevel, "total level cannot exceed 20");
        }

        this.character.classes = classes.map((c) => ({ ...c }));
        this.character.level = totalLevel;
        return this;
    }

    /**
     * Add a new class for multiclassing
     * Validates multiclass prerequisites
     */
    addClass(classType: ClassType, level: number = 1): this {
        if (!this.character.abilityScores) {
            throw new ValidationError(
                "abilityScores",
                undefined,
                "must be set before adding classes"
            );
        }

        // Validate class exists
        const classData = CLASSES.find((c) => c.type === classType);
        if (!classData) {
            throw new ValidationError("class", classType, "invalid class type");
        }

        // Check if character already has this class
        const existingClass = this.character.classes?.find((c) => c.class === classType);
        if (existingClass) {
            throw new ValidationError(
                "class",
                classType,
                "character already has this class - use addLevelsToClass instead"
            );
        }

        // Validate multiclass prerequisites if this is not the first class
        if (this.character.classes && this.character.classes.length > 0) {
            if (!this.canMulticlass(classType)) {
                const requirements = MULTICLASS_REQUIREMENTS[classType];
                const reqStr = Object.entries(requirements)
                    .map(([ability, score]) => `${ability} ${score}`)
                    .join(", ");
                throw new ValidationError(
                    "multiclass",
                    classType,
                    `does not meet multiclass requirements (${reqStr})`
                );
            }
        }

        // Validate level
        if (level < 1 || level > 20) {
            throw new ValidationError("level", level, "must be between 1 and 20");
        }

        // Initialize classes array if needed
        if (!this.character.classes) {
            this.character.classes = [];
        }

        // Calculate new total level
        const currentTotalLevel = this.character.classes.reduce((sum, c) => sum + c.level, 0);
        const newTotalLevel = currentTotalLevel + level;

        if (newTotalLevel > 20) {
            throw new ValidationError(
                "level",
                newTotalLevel,
                "total character level cannot exceed 20"
            );
        }

        // Add the new class
        this.character.classes.push({
            class: classType,
            level,
        });

        this.character.level = newTotalLevel;
        return this;
    }

    /**
     * Add levels to an existing class
     * Returns array of level numbers that need configuration
     */
    addLevelsToClass(classType: ClassType, additionalLevels: number): number[] {
        if (!this.character.classes || this.character.classes.length === 0) {
            throw new ValidationError("classes", undefined, "character has no classes");
        }

        const classEntry = this.character.classes.find((c) => c.class === classType);
        if (!classEntry) {
            throw new ValidationError(
                "class",
                classType,
                "character does not have this class - use addClass instead"
            );
        }

        if (additionalLevels < 1) {
            throw new ValidationError(
                "additionalLevels",
                additionalLevels,
                "must be at least 1"
            );
        }

        const currentLevel = classEntry.level;
        const newLevel = currentLevel + additionalLevels;

        if (newLevel > 20) {
            throw new ValidationError(
                "level",
                newLevel,
                "class level cannot exceed 20"
            );
        }

        // Calculate new total character level
        const currentTotalLevel = this.character.classes.reduce((sum, c) => sum + c.level, 0);
        const newTotalLevel = currentTotalLevel + additionalLevels;

        if (newTotalLevel > 20) {
            throw new ValidationError(
                "level",
                newTotalLevel,
                "total character level cannot exceed 20"
            );
        }

        // Update the class level
        classEntry.level = newLevel;
        this.character.level = newTotalLevel;

        // Return array of levels that need configuration
        const levelsToConfig: number[] = [];
        for (let i = 1; i <= additionalLevels; i++) {
            levelsToConfig.push(currentLevel + i);
        }

        return levelsToConfig;
    }

    /**
     * Set multiple class configurations at once
     * Used when adding multiple levels or multiclassing
     */
    setClassConfigurations(configs: ClassConfiguration[]): this {
        // Validate each configuration
        for (const config of configs) {
            // Validate that configuration matches one of the character's classes
            const hasClass = this.character.classes?.some((c) => c.class === config.classType);
            if (!hasClass) {
                throw new ValidationError(
                    "classConfiguration",
                    config.classType,
                    "character does not have this class"
                );
            }

            // Validate level is within range
            if (config.level < 1 || config.level > 20) {
                throw new ValidationError(
                    "classConfiguration.level",
                    config.level,
                    "must be between 1 and 20"
                );
            }
        }

        this.classConfigurations = configs.map((config) => ({
            ...config,
            featureChoices: { ...config.featureChoices },
            spellsSelected: config.spellsSelected ? [...config.spellsSelected] : undefined,
            powersSelected: config.powersSelected ? [...config.powersSelected] : undefined,
            proficienciesSelected: config.proficienciesSelected
                ? [...config.proficienciesSelected]
                : undefined,
        }));

        return this;
    }

    /**
     * Check if character meets multiclass prerequisites for a class
     */
    canMulticlass(newClassType: ClassType): boolean {
        if (!this.character.abilityScores) {
            return false;
        }

        const requirements = MULTICLASS_REQUIREMENTS[newClassType];
        if (!requirements) {
            return true; // No requirements means always allowed
        }

        // Check each required ability score
        for (const [ability, requiredScore] of Object.entries(requirements)) {
            const characterScore = this.character.abilityScores[ability as keyof AbilityScores];
            if (characterScore < requiredScore) {
                return false;
            }
        }

        return true;
    }

    /**
     * Lock ability scores (prevent modification after initial creation)
     */
    lockAbilityScores(): this {
        this.abilityScoresLocked = true;
        return this;
    }

    /**
     * Check if ability scores are locked
     */
    areAbilityScoresLocked(): boolean {
        return this.abilityScoresLocked;
    }

    /**
     * Build and validate the complete character
     */
    build(): Character {
        this.validateRequiredFields();
        this.applySpeciesTraits();
        this.applyClassFeatures();
        this.initializeResources();
        this.applyStartingEquipment();
        this.storeClassConfiguration();
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

        // Set proficiencies (initialize empty if not defined)
        if (classData.proficiencies) {
            this.character.proficiencies = {
                armor: classData.proficiencies.armor || [],
                weapons: classData.proficiencies.weapons || [],
                tools: classData.proficiencies.tools || [],
                savingThrows: classData.proficiencies.savingThrows || [],
                skills: classData.proficiencies.skills || [],
            };
        } else {
            // Initialize empty proficiencies structure
            this.character.proficiencies = {
                armor: [],
                weapons: [],
                tools: [],
                savingThrows: [],
                skills: [],
            };
        }

        // Initialize features array - apply features for all levels up to character level
        const grantedFeatures: import("@/types").ClassFeature[] = [];
        const totalLevel = this.character.level || 1;
        
        // Apply features for each level from 1 to totalLevel
        for (let level = 1; level <= totalLevel; level++) {
            // Base class features at this level
            grantedFeatures.push(
                ...classData.features
                    .filter((f) => f.level === level)
                    .map((f) => ({ ...f, origin: "class" as const }))
            );
            
            // Subclass features at this level (if subclass is configured)
            // Check all configurations for subclass selection
            const subclassConfig = this.classConfigurations.find(
                (config) => config.subclass && config.classType === this.character.classes![0]!.class
            );
            if (subclassConfig?.subclass) {
                const subclass = classData.subclasses.find(
                    (s) => s.type === subclassConfig.subclass
                );
                if (subclass) {
                    grantedFeatures.push(
                        ...subclass.features
                            .filter((f) => f.level === level)
                            .map((f) => ({ ...f, origin: "subclass" as const }))
                    );
                }
            }
            
            // Progression featuresGranted entries at this level
            const progressionRow = classData.levelProgression?.find((p) => p.level === level);
            if (progressionRow?.featuresGranted) {
                for (const featureName of progressionRow.featuresGranted) {
                    // Try to reference existing feature definitions by name & level
                    const matchInClass = classData.features.find(
                        (f) => f.name === featureName && f.level === level
                    );
                    if (matchInClass) {
                        grantedFeatures.push({
                            ...matchInClass,
                            origin: matchInClass.origin ?? "class",
                        });
                    } else {
                        // Create ephemeral feature entry if not defined yet
                        grantedFeatures.push({
                            name: featureName,
                            level: level,
                            description: featureName,
                            origin: "progression",
                            ephemeral: true,
                        });
                    }
                }
            }
        }
        
        this.character.features = grantedFeatures;
    }

    /**
     * Apply starting equipment from the character's class
     */
    private applyStartingEquipment(): void {
        const classType = this.character.classes![0]!.class;
        const totalLevel = this.character.level || 1;

        try {
            if (totalLevel === 1) {
                // Level 1: Use standard starting equipment
                const characterWithEquipment = startingEquipmentService.applyStartingEquipment(
                    this.character as Character,
                    classType
                );

                // Update character with new inventory and currency
                this.character.inventory = characterWithEquipment.inventory;
                this.character.currency = characterWithEquipment.currency;
            } else {
                // Higher levels: Calculate starting wealth based on level
                // Use a formula: base equipment value * level multiplier
                const startingEquipment = startingEquipmentService.getStartingEquipment(classType);
                const baseValue = startingEquipmentService.calculateEquipmentValue(startingEquipment);
                
                // Wealth by level (approximate D&D 5E guidelines adapted for Hollow Gear)
                // Level 1-4: base value, Level 5-10: 10x, Level 11-16: 50x, Level 17-20: 100x
                let wealthMultiplier = 1;
                if (totalLevel >= 5 && totalLevel <= 10) {
                    wealthMultiplier = 10;
                } else if (totalLevel >= 11 && totalLevel <= 16) {
                    wealthMultiplier = 50;
                } else if (totalLevel >= 17) {
                    wealthMultiplier = 100;
                }
                
                const totalWealth = baseValue * wealthMultiplier;
                
                // Convert to currency (cogs, gears, cores)
                // 1 gear = 10 cogs, 1 core = 100 cogs
                const cores = Math.floor(totalWealth / 100);
                const remainingAfterCores = totalWealth % 100;
                const gears = Math.floor(remainingAfterCores / 10);
                const cogs = remainingAfterCores % 10;
                
                // Initialize with starting currency
                this.character.currency = {
                    cogs,
                    gears,
                    cores,
                };
                
                // For higher levels, also give the basic starting equipment
                const characterWithEquipment = startingEquipmentService.applyStartingEquipment(
                    this.character as Character,
                    classType
                );
                this.character.inventory = characterWithEquipment.inventory;
            }
        } catch (error) {
            // If starting equipment fails, log warning but continue
            // This allows character creation to proceed even if equipment data is incomplete
            console.warn(`Failed to apply starting equipment for ${classType}:`, error);
        }
    }

    /**
     * Store class configuration in character data
     */
    private storeClassConfiguration(): void {
        // Only initialize if we have configurations to store
        const hasConfigurations =
            this.classConfiguration || this.classConfigurations.length > 0;

        if (!hasConfigurations) {
            return;
        }

        // Initialize classConfigurations array if not present
        if (!this.character.classConfigurations) {
            this.character.classConfigurations = [];
        }

        // Handle legacy single configuration (for backward compatibility)
        if (this.classConfiguration) {
            // Check if this configuration already exists
            const existingIndex = this.character.classConfigurations.findIndex(
                (c) =>
                    c.classType === this.classConfiguration!.classType &&
                    c.level === this.classConfiguration!.level
            );

            if (existingIndex >= 0) {
                // Replace existing configuration
                this.character.classConfigurations[existingIndex] = this.classConfiguration;
            } else {
                // Add new configuration
                this.character.classConfigurations.push(this.classConfiguration);
            }
        }

        // Handle multiple configurations
        for (const config of this.classConfigurations) {
            // Check if this configuration already exists
            const existingIndex = this.character.classConfigurations.findIndex(
                (c) => c.classType === config.classType && c.level === config.level
            );

            if (existingIndex >= 0) {
                // Replace existing configuration
                this.character.classConfigurations[existingIndex] = config;
            } else {
                // Add new configuration
                this.character.classConfigurations.push(config);
            }
        }

        // Apply configurations to character
        const allSpells = new Set<string>(this.character.spells || []);
        const allPowers = new Set<string>(this.character.mindcraftPowers || []);
        const allSkills = new Set<string>(this.character.proficiencies?.skills || []);

        for (const config of this.character.classConfigurations) {
            // Apply subclass if selected
            if (config.subclass && this.character.classes) {
                const classEntry = this.character.classes.find((c) => c.class === config.classType);
                if (classEntry && !classEntry.subclass) {
                    classEntry.subclass = config.subclass;
                }
            }

            // Collect spells
            if (config.spellsSelected) {
                for (const spell of config.spellsSelected) {
                    allSpells.add(spell);
                }
            }

            // Collect powers
            if (config.powersSelected) {
                for (const power of config.powersSelected) {
                    allPowers.add(power);
                }
            }

            // Collect proficiencies
            if (config.proficienciesSelected) {
                for (const prof of config.proficienciesSelected) {
                    allSkills.add(prof);
                }
            }
        }

        // Apply collected data
        this.character.spells = Array.from(allSpells);
        this.character.mindcraftPowers = Array.from(allPowers);

        if (this.character.proficiencies) {
            this.character.proficiencies.skills = Array.from(allSkills) as SkillType[];
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
        const totalLevel = this.character.level || 1;

        // Calculate hit points based on total level
        // Level 1: max hit die + CON mod
        // Levels 2+: average of hit die (rounded up) + CON mod per level
        let maxHP = hitDie + conMod; // Level 1 HP (always max)
        
        if (totalLevel > 1) {
            // For levels 2+, use average hit die value (rounded up) + CON mod
            const averageHitDie = Math.ceil(hitDie / 2) + 1; // e.g., d8 = 5, d10 = 6, d6 = 4
            maxHP += (averageHitDie + conMod) * (totalLevel - 1);
        }

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

        // Initialize spell slots using levelProgression table if present
        if (classData.spellcasting) {
            const totalLevel = this.character.level || 1;
            const progressionRow = classData.levelProgression?.find((p) => p.level === totalLevel);
            const slots = progressionRow?.spellSlots;
            this.character.spellSlots = {
                level1: { current: slots?.[1] ?? 0, maximum: slots?.[1] ?? 0 },
                level2: { current: slots?.[2] ?? 0, maximum: slots?.[2] ?? 0 },
                level3: { current: slots?.[3] ?? 0, maximum: slots?.[3] ?? 0 },
                level4: { current: slots?.[4] ?? 0, maximum: slots?.[4] ?? 0 },
                level5: { current: slots?.[5] ?? 0, maximum: slots?.[5] ?? 0 },
                level6: { current: slots?.[6] ?? 0, maximum: slots?.[6] ?? 0 },
                level7: { current: slots?.[7] ?? 0, maximum: slots?.[7] ?? 0 },
                level8: { current: slots?.[8] ?? 0, maximum: slots?.[8] ?? 0 },
                level9: { current: slots?.[9] ?? 0, maximum: slots?.[9] ?? 0 },
            };
        }

        // Initialize Aether Flux Points using formula if progression provides one
        if (classData.primaryResource === "AetherFluxPoints") {
            const totalLevel = this.character.level || 1;
            const progressionRow = classData.levelProgression?.find((p) => p.level === totalLevel);
            const abilityMod = calculateAbilityModifier(
                this.character.abilityScores![classData.primaryAbility]
            );
            // Currently AFP formula standardized as level + abilityMod; retain compatibility
            const maxAFP = totalLevel + abilityMod;
            this.character.aetherFluxPoints = {
                current: maxAFP,
                maximum: maxAFP,
                rechargeRate: {
                    shortRest: Math.floor(maxAFP / 2),
                    longRest: maxAFP,
                },
            };
            if (progressionRow?.focusLimit !== undefined) {
                this.character.focusLimit = progressionRow.focusLimit;
            }
        }

        // Initialize Resonance Charges for Templars using formula (level + Cha/Wis? docs say Cha mod for pool, but code used wisdom earlier)
        if (classData.primaryResource === "ResonanceCharges") {
            const totalLevel = this.character.level || 1;
            // Adjust to charisma modifier per docs (Templar primary ability is charisma)
            const chaMod = calculateAbilityModifier(this.character.abilityScores!.charisma);
            const maxRC = totalLevel + chaMod;
            this.character.resonanceCharges = {
                current: maxRC,
                maximum: maxRC,
                rechargeRate: {
                    shortRest: Math.floor(maxRC / 2),
                    longRest: maxRC,
                },
            };
        }

        // Initialize empty arrays (only if not already set, for edit mode compatibility)
        if (!this.character.spells) {
            this.character.spells = [];
        }
        if (!this.character.mindcraftPowers) {
            this.character.mindcraftPowers = [];
        }
        if (!this.character.conditions) {
            this.character.conditions = [];
        }
        if (!this.character.mods) {
            this.character.mods = [];
        }

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

        // Generate unique ID (or preserve original in edit mode)
        if (!this.character.id) {
            this.character.id = this.originalCharacterId || this.generateCharacterId();
        }

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
