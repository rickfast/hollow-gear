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
 * Builder class for creating new characters with fluent API
 */
export class CharacterBuilder {
    private character: Partial<Character> = {};
    private classConfiguration?: ClassConfiguration;

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

        // Initialize features array
        const grantedFeatures: import("@/types").ClassFeature[] = [];
        // Base class level 1 features
        grantedFeatures.push(
            ...classData.features
                .filter((f) => f.level === 1)
                .map((f) => ({ ...f, origin: "class" as const }))
        );
        // Subclass features at level 1 (only for classes whose subclass chosen at 1)
        if (this.classConfiguration?.subclass) {
            const subclass = classData.subclasses.find(
                (s) => s.type === this.classConfiguration!.subclass
            );
            if (subclass) {
                grantedFeatures.push(
                    ...subclass.features
                        .filter((f) => f.level === 1)
                        .map((f) => ({ ...f, origin: "subclass" as const }))
                );
            }
        }
        // Progression featuresGranted entries at level 1
        const progressionRow = classData.levelProgression?.find((p) => p.level === 1);
        if (progressionRow?.featuresGranted) {
            for (const featureName of progressionRow.featuresGranted) {
                // Try to reference existing feature definitions by name & level
                const matchInClass = classData.features.find(
                    (f) => f.name === featureName && f.level === 1
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
                        level: 1,
                        description: featureName,
                        origin: "progression",
                        ephemeral: true,
                    });
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

        try {
            // Use StartingEquipmentService to apply equipment
            const characterWithEquipment = startingEquipmentService.applyStartingEquipment(
                this.character as Character,
                classType
            );

            // Update character with new inventory and currency
            this.character.inventory = characterWithEquipment.inventory;
            this.character.currency = characterWithEquipment.currency;
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
        if (this.classConfiguration) {
            // Initialize classConfigurations array if not present
            if (!this.character.classConfigurations) {
                this.character.classConfigurations = [];
            }

            // Add the configuration to the character
            this.character.classConfigurations.push(this.classConfiguration);

            // Apply subclass if selected
            if (this.classConfiguration.subclass && this.character.classes) {
                this.character.classes[0]!.subclass = this.classConfiguration.subclass;
            }

            // Apply selected spells if any
            if (this.classConfiguration.spellsSelected) {
                this.character.spells = [...this.classConfiguration.spellsSelected];
            }

            // Apply selected Mindcraft powers if any (Mindweavers)
            if (this.classConfiguration.powersSelected) {
                this.character.mindcraftPowers = [...this.classConfiguration.powersSelected];
            }

            // Apply selected proficiencies if any
            if (
                this.classConfiguration.proficienciesSelected &&
                this.classConfiguration.proficienciesSelected.length > 0
            ) {
                // Add to existing proficiencies
                if (this.character.proficiencies) {
                    // Merge with existing skills, avoiding duplicates
                    const existingSkills = new Set(this.character.proficiencies.skills);
                    for (const prof of this.classConfiguration.proficienciesSelected) {
                        // Type assertion since proficienciesSelected should contain valid SkillType values
                        existingSkills.add(prof as SkillType);
                    }
                    this.character.proficiencies.skills = Array.from(existingSkills);
                }
            }
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

        // Initialize spell slots using levelProgression table if present
        if (classData.spellcasting) {
            const progressionRow = classData.levelProgression?.find((p) => p.level === 1);
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
            const progressionRow = classData.levelProgression?.find((p) => p.level === 1);
            const abilityMod = calculateAbilityModifier(
                this.character.abilityScores![classData.primaryAbility]
            );
            // Currently AFP formula standardized as level + abilityMod; retain compatibility
            const maxAFP = this.character.level! + abilityMod;
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
            // Adjust to charisma modifier per docs (Templar primary ability is charisma)
            const chaMod = calculateAbilityModifier(this.character.abilityScores!.charisma);
            const maxRC = this.character.level! + chaMod;
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
