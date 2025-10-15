import { useEffect, useState } from "react";
import { Card, CardBody, Divider } from "@heroui/react";
import type { ClassConfiguration, ClassType, SubclassType } from "@/types";
import {
    classConfigurationService,
    type LevelConfiguration,
    type ValidationResult,
} from "@/service/class-configuration-service";
import { FeatureSelector } from "./feature-selector";
import { SubclassSelector } from "./subclass-selector";
import { SpellSelector } from "./spell-selector";
import { ProficiencySelector } from "./proficiency-selector";
import { CardTitle, Description, TertiaryText } from "./typography";

interface ClassLevelConfiguratorProps {
    classType: ClassType;
    level: number;
    existingConfig?: ClassConfiguration;
    onConfigurationChange: (config: Partial<ClassConfiguration>) => void;
    onValidationChange: (valid: boolean) => void;
}

/**
 * Container component that orchestrates all class configuration UI
 * Reusable for both character creation and level-up workflows
 */
export function ClassLevelConfigurator({
    classType,
    level,
    existingConfig,
    onConfigurationChange,
    onValidationChange,
}: ClassLevelConfiguratorProps) {
    const [levelConfig, setLevelConfig] = useState<LevelConfiguration | null>(null);
    const [config, setConfig] = useState<Partial<ClassConfiguration>>({
        classType,
        level,
        featureChoices: {},
        spellsSelected: [],
        proficienciesSelected: [],
        ...existingConfig,
    });
    const [validation, setValidation] = useState<ValidationResult>({
        valid: false,
        errors: [],
        warnings: [],
    });

    // Fetch available options when component mounts or props change
    useEffect(() => {
        try {
            const options = classConfigurationService.getAvailableOptions(
                classType,
                level,
                existingConfig
            );
            setLevelConfig(options);
        } catch (error) {
            console.error("Error fetching class configuration options:", error);
        }
    }, [classType, level, existingConfig]);

    // Validate configuration whenever it changes
    useEffect(() => {
        const result = classConfigurationService.validateConfiguration(classType, level, config);
        setValidation(result);
        onValidationChange(result.valid);
    }, [config, classType, level, onValidationChange]);

    // Emit configuration changes
    useEffect(() => {
        onConfigurationChange(config);
    }, [config, onConfigurationChange]);

    const handleSubclassSelect = (subclass: SubclassType) => {
        setConfig((prev) => ({ ...prev, subclass }));
    };

    const handleFeatureSelect = (featureName: string, options: string | string[]) => {
        setConfig((prev) => ({
            ...prev,
            featureChoices: {
                ...prev.featureChoices,
                [featureName]: options,
            },
        }));
    };

    const handleSpellsSelect = (spells: string[]) => {
        setConfig((prev) => ({ ...prev, spellsSelected: spells }));
    };

    const handleProficienciesSelect = (proficiencies: string[]) => {
        setConfig((prev) => ({ ...prev, proficienciesSelected: proficiencies }));
    };

    if (!levelConfig) {
        return (
            <Card>
                <CardBody>
                    <TertiaryText>Loading configuration options...</TertiaryText>
                </CardBody>
            </Card>
        );
    }

    const hasAnyConfiguration =
        levelConfig.requiresSubclass ||
        levelConfig.configurableFeatures.length > 0 ||
        levelConfig.spellSelection ||
        levelConfig.proficiencySelection;

    if (!hasAnyConfiguration) {
        return (
            <Card>
                <CardBody>
                    <CardTitle>Level {level} Configuration</CardTitle>
                    <Description>No configuration required for this level.</Description>
                </CardBody>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardBody>
                    <CardTitle>
                        Configure {classType} - Level {level}
                    </CardTitle>
                    <Description>
                        Complete all required selections to proceed with character creation.
                    </Description>

                    {/* Validation Errors */}
                    {validation.errors.length > 0 && (
                        <div className="mt-3 p-3 bg-danger-50 border border-danger-200 rounded-lg">
                            <div className="text-sm font-semibold text-danger mb-1">
                                Required Selections:
                            </div>
                            <ul className="text-xs text-danger-700 space-y-1">
                                {validation.errors.map((error, idx) => (
                                    <li key={idx}>• {error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Validation Success */}
                    {validation.valid && (
                        <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                            <div className="text-sm font-semibold text-success">
                                ✓ All required selections complete
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Subclass Selection */}
            {levelConfig.requiresSubclass && (
                <>
                    <SubclassSelector
                        availableSubclasses={levelConfig.availableSubclasses}
                        selectedSubclass={config.subclass}
                        onSelect={handleSubclassSelect}
                    />
                    <Divider />
                </>
            )}

            {/* Configurable Features */}
            {levelConfig.configurableFeatures.map((feature) => (
                <div key={feature.featureName}>
                    <FeatureSelector
                        feature={feature}
                        selectedOptions={config.featureChoices?.[feature.featureName]}
                        onSelect={(options) => handleFeatureSelect(feature.featureName, options)}
                    />
                </div>
            ))}

            {/* Spell Selection */}
            {levelConfig.spellSelection && (
                <>
                    {levelConfig.configurableFeatures.length > 0 && <Divider />}
                    <SpellSelector
                        classType={classType}
                        level={level}
                        cantripsKnown={levelConfig.spellSelection.cantripsKnown}
                        spellsKnown={levelConfig.spellSelection.spellsKnown}
                        availableSpells={levelConfig.spellSelection.availableSpells}
                        selectedSpells={config.spellsSelected || []}
                        onSelect={handleSpellsSelect}
                    />
                </>
            )}

            {/* Proficiency Selection */}
            {levelConfig.proficiencySelection && (
                <>
                    <Divider />
                    <ProficiencySelector
                        type={levelConfig.proficiencySelection.type}
                        availableOptions={levelConfig.proficiencySelection.availableOptions}
                        count={levelConfig.proficiencySelection.count}
                        selectedProficiencies={config.proficienciesSelected || []}
                        onSelect={handleProficienciesSelect}
                    />
                </>
            )}
        </div>
    );
}
