import type {
    Character,
    ClassConfiguration,
    ClassType,
    ConfigurableFeature,
    Subclass,
    SubclassType,
} from "@/types";
import { CLASSES } from "@/data/classes";
import { SPELLS_BY_NAME } from "@/data/spells";
import { SKILLS } from "@/data/skills";

// ============================================================================
// TYPES
// ============================================================================

export interface LevelConfiguration {
    level: number;
    classType: ClassType;
    requiresSubclass: boolean;
    availableSubclasses: Subclass[];
    configurableFeatures: ConfigurableFeature[];
    spellSelection?: SpellSelectionOptions;
    proficiencySelection?: ProficiencySelectionOptions;
}

export interface SpellSelectionOptions {
    cantripsKnown?: number;
    spellsKnown?: number;
    spellsPrepared?: number;
    availableSpells: string[];
    maxSpellLevel: number;
}

export interface ProficiencySelectionOptions {
    type: "skill" | "tool";
    count: number;
    availableOptions: string[];
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}

// ============================================================================
// CLASS CONFIGURATION SERVICE
// ============================================================================

export class ClassConfigurationService {
    /**
     * Get all configurable options for a class at a specific level
     */
    getAvailableOptions(
        classType: ClassType,
        level: number,
        existingConfig?: ClassConfiguration
    ): LevelConfiguration {
        const classData = CLASSES.find((c) => c.type === classType);
        if (!classData) {
            throw new Error(`Unknown class type: ${classType}`);
        }

        const subclassLevel = this.getSubclassSelectionLevel(classType);
        const requiresSubclass = level >= subclassLevel && !existingConfig?.subclass;

        // Get configurable features for this level
        const configurableFeatures = classData.configurableFeatures.filter(
            (f) => f.level === level
        );

        // Build level configuration
        const config: LevelConfiguration = {
            level,
            classType,
            requiresSubclass,
            availableSubclasses: classData.subclasses,
            configurableFeatures,
        };

        // Add spell selection if class has spellcasting
        if (classData.spellcasting) {
            config.spellSelection = this._getSpellSelectionOptions(classData, level);
        }

        // Add proficiency selection if needed (can be extended based on class features)
        // Currently no classes have proficiency selection at level 1, but structure is ready

        return config;
    }

    /**
     * Validate that a configuration is complete and valid
     */
    validateConfiguration(
        classType: ClassType,
        level: number,
        config: Partial<ClassConfiguration>
    ): ValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        const classData = CLASSES.find((c) => c.type === classType);
        if (!classData) {
            errors.push(`Unknown class type: ${classType}`);
            return { valid: false, errors, warnings };
        }

        const availableOptions = this.getAvailableOptions(classType, level, config as ClassConfiguration);

        // Validate subclass selection
        if (availableOptions.requiresSubclass && !config.subclass) {
            errors.push(`Subclass selection is required at level ${level}`);
        }

        // Validate configurable features
        for (const feature of availableOptions.configurableFeatures) {
            if (feature.required) {
                const choice = config.featureChoices?.[feature.featureName];
                if (!choice) {
                    errors.push(`Please select an option for ${feature.featureName}`);
                    continue;
                }

                // Validate choice is from available options
                if (feature.configurationType === "choice") {
                    const validIds = feature.options.map((o) => o.id);
                    if (typeof choice === "string" && !validIds.includes(choice)) {
                        errors.push(`Invalid option selected for ${feature.featureName}`);
                    }
                } else if (feature.configurationType === "multiple") {
                    const validIds = feature.options.map((o) => o.id);
                    const choices = Array.isArray(choice) ? choice : [choice];
                    for (const c of choices) {
                        if (!validIds.includes(c)) {
                            errors.push(`Invalid option "${c}" selected for ${feature.featureName}`);
                        }
                    }
                }
            }
        }

        // Validate spell selection
        if (availableOptions.spellSelection && config.spellsSelected) {
            const spellErrors = this._validateSpellSelection(
                availableOptions.spellSelection,
                config.spellsSelected
            );
            errors.push(...spellErrors);
        }

        // Validate proficiency selection
        if (availableOptions.proficiencySelection && config.proficienciesSelected) {
            const profErrors = this._validateProficiencySelection(
                availableOptions.proficiencySelection,
                config.proficienciesSelected
            );
            errors.push(...profErrors);
        }

        return {
            valid: errors.length === 0,
            errors,
            warnings,
        };
    }

    /**
     * Apply a configuration to a character
     */
    applyConfiguration(character: Character, config: ClassConfiguration): Character {
        // Create a copy of the character
        const updatedCharacter = { ...character };

        // Update or add class configuration
        if (!updatedCharacter.classConfigurations) {
            updatedCharacter.classConfigurations = [];
        }

        // Remove existing configuration for this class/level if it exists
        updatedCharacter.classConfigurations = updatedCharacter.classConfigurations.filter(
            (c) => !(c.classType === config.classType && c.level === config.level)
        );

        // Add new configuration
        updatedCharacter.classConfigurations.push(config);

        // Update character's class subclass if this is their primary class
        const primaryClass = updatedCharacter.classes[0];
        if (primaryClass && primaryClass.class === config.classType && config.subclass) {
            updatedCharacter.classes = [
                {
                    ...primaryClass,
                    subclass: config.subclass,
                },
                ...updatedCharacter.classes.slice(1),
            ];
        }

        // Apply spell selections
        if (config.spellsSelected && config.spellsSelected.length > 0) {
            // Merge with existing spells, avoiding duplicates
            const existingSpells = new Set(updatedCharacter.spells || []);
            for (const spell of config.spellsSelected) {
                existingSpells.add(spell);
            }
            updatedCharacter.spells = Array.from(existingSpells);
        }

        // Apply proficiency selections
        if (config.proficienciesSelected && config.proficienciesSelected.length > 0) {
            if (!updatedCharacter.proficiencies) {
                updatedCharacter.proficiencies = {
                    armor: [],
                    weapons: [],
                    tools: [],
                    savingThrows: [],
                    skills: [],
                };
            }

            // Add skill proficiencies
            for (const prof of config.proficienciesSelected) {
                if (prof in SKILLS) {
                    // It's a skill - update the skills object
                    const skillKey = prof as keyof typeof updatedCharacter.skills;
                    const currentSkill = updatedCharacter.skills[skillKey];
                    updatedCharacter.skills[skillKey] = {
                        ...currentSkill,
                        proficient: true,
                    };
                    
                    // Also add to proficiencies.skills array if not already there
                    if (!updatedCharacter.proficiencies.skills.includes(prof as any)) {
                        updatedCharacter.proficiencies.skills.push(prof as any);
                    }
                } else {
                    // It's a tool - add to tools array if not already there
                    if (!updatedCharacter.proficiencies.tools.includes(prof as any)) {
                        updatedCharacter.proficiencies.tools.push(prof as any);
                    }
                }
            }
        }

        // Apply feature choices (stored for reference, actual effects applied elsewhere)
        // Feature choices are already stored in the ClassConfiguration

        return updatedCharacter;
    }

    /**
     * Get the level at which subclass selection occurs for a class
     */
    getSubclassSelectionLevel(classType: ClassType): number {
        // Most classes select subclass at level 3
        // Mindweaver selects at level 1
        switch (classType) {
            case "Mindweaver":
                return 1;
            default:
                return 3;
        }
    }

    // ========================================================================
    // PRIVATE HELPER METHODS
    // ========================================================================

    private _getSpellSelectionOptions(
        classData: { spellcasting?: any; type: ClassType },
        level: number
    ): SpellSelectionOptions | undefined {
        if (!classData.spellcasting) {
            return undefined;
        }

        const { spellcastingAbility, spellLists, cantripsKnown, spellsKnown } =
            classData.spellcasting;

        // Determine max spell level based on character level
        const maxSpellLevel = Math.min(Math.ceil(level / 2), 9);

        // Get available spells from spell lists
        const availableSpells = this._getAvailableSpellsForClass(
            classData.type,
            spellLists,
            maxSpellLevel
        );

        return {
            cantripsKnown,
            spellsKnown,
            spellsPrepared: classData.spellcasting.spellsPrepared,
            availableSpells,
            maxSpellLevel,
        };
    }

    private _getAvailableSpellsForClass(
        classType: ClassType,
        spellLists: string[],
        maxSpellLevel: number
    ): string[] {
        // Get all spells that match the class's spell lists and level
        const availableSpells: string[] = [];

        for (const [spellName, spell] of Object.entries(SPELLS_BY_NAME)) {
            if (spell.level <= maxSpellLevel) {
                // For now, include all spells up to max level
                // In a full implementation, would filter by spell list
                availableSpells.push(spellName);
            }
        }

        return availableSpells;
    }

    private _validateSpellSelection(
        options: SpellSelectionOptions,
        selectedSpells: string[]
    ): string[] {
        const errors: string[] = [];

        // Separate cantrips from leveled spells
        const cantrips = selectedSpells.filter((name) => {
            const spell = SPELLS_BY_NAME[name];
            return spell && spell.level === 0;
        });

        const leveledSpells = selectedSpells.filter((name) => {
            const spell = SPELLS_BY_NAME[name];
            return spell && spell.level > 0;
        });

        // Validate cantrip count
        if (options.cantripsKnown !== undefined) {
            if (cantrips.length !== options.cantripsKnown) {
                errors.push(
                    `You must select exactly ${options.cantripsKnown} cantrips (currently ${cantrips.length})`
                );
            }
        }

        // Validate spell count
        if (options.spellsKnown !== undefined) {
            if (leveledSpells.length !== options.spellsKnown) {
                errors.push(
                    `You must select exactly ${options.spellsKnown} spells (currently ${leveledSpells.length})`
                );
            }
        }

        // Validate all selected spells exist and are within level range
        for (const spellName of selectedSpells) {
            const spell = SPELLS_BY_NAME[spellName];
            if (!spell) {
                errors.push(`Unknown spell: ${spellName}`);
            } else if (spell.level > options.maxSpellLevel) {
                errors.push(
                    `Spell "${spellName}" is level ${spell.level}, but max spell level is ${options.maxSpellLevel}`
                );
            }
        }

        // Validate spells are from available list
        for (const spellName of selectedSpells) {
            if (!options.availableSpells.includes(spellName)) {
                errors.push(`Spell "${spellName}" is not available for this class`);
            }
        }

        return errors;
    }

    private _validateProficiencySelection(
        options: ProficiencySelectionOptions,
        selectedProficiencies: string[]
    ): string[] {
        const errors: string[] = [];

        // Validate count
        if (selectedProficiencies.length !== options.count) {
            errors.push(
                `You must select exactly ${options.count} ${options.type} proficiencies (currently ${selectedProficiencies.length})`
            );
        }

        // Validate all selections are from available options
        for (const prof of selectedProficiencies) {
            if (!options.availableOptions.includes(prof)) {
                errors.push(`"${prof}" is not an available ${options.type} proficiency option`);
            }
        }

        return errors;
    }
}

// Export singleton instance
export const classConfigurationService = new ClassConfigurationService();
