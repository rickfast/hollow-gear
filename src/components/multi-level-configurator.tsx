import { CLASSES } from "@/data/classes";
import type { ClassConfiguration, ClassType } from "@/types";
import { Card, CardBody, Divider } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import { ClassLevelConfigurator } from "./class-level-configurator";
import { CardTitle, Description, TertiaryText } from "./typography";

interface MultiLevelConfiguratorProps {
    classType: ClassType;
    levels: number[]; // Array of level numbers to configure (e.g., [2, 3, 4])
    existingConfigs?: ClassConfiguration[]; // Existing configurations if editing
    onConfigurationsChange: (configs: ClassConfiguration[]) => void;
    onValidationChange: (valid: boolean) => void;
}

interface LevelConfigState {
    level: number;
    config: Partial<ClassConfiguration>;
    isValid: boolean;
}

/**
 * Multi-level class configuration component
 * Handles configuration for multiple levels at once (level up or starting at higher level)
 * Groups configuration UI by level with clear visual separation
 */
export function MultiLevelConfigurator({
    classType,
    levels,
    existingConfigs = [],
    onConfigurationsChange,
    onValidationChange,
}: MultiLevelConfiguratorProps) {
    // Initialize state for each level
    const [levelStates, setLevelStates] = useState<LevelConfigState[]>(() =>
        levels.map((level) => {
            const existingConfig = existingConfigs.find(
                (c) => c.classType === classType && c.level === level
            );
            return {
                level,
                config: existingConfig || {
                    classType,
                    level,
                    featureChoices: {},
                    spellsSelected: [],
                    proficienciesSelected: [],
                },
                isValid: false,
            };
        })
    );

    // Get class data for displaying features
    const classData = CLASSES.find((c) => c.type === classType);

    // Update parent when configurations change
    useEffect(() => {
        const completeConfigs = levelStates
            .filter((state) => state.isValid)
            .map((state) => state.config as ClassConfiguration);

        onConfigurationsChange(completeConfigs);
    }, [levelStates, onConfigurationsChange]);

    // Update parent validation status
    useEffect(() => {
        const allValid = levelStates.every((state) => state.isValid);
        onValidationChange(allValid);
    }, [levelStates, onValidationChange]);

    // Handle configuration change for a specific level
    const handleLevelConfigChange = useCallback(
        (level: number, config: Partial<ClassConfiguration>) => {
            setLevelStates((prev) =>
                prev.map((state) => (state.level === level ? { ...state, config } : state))
            );
        },
        []
    );

    // Handle validation change for a specific level
    const handleLevelValidationChange = useCallback((level: number, isValid: boolean) => {
        setLevelStates((prev) =>
            prev.map((state) => (state.level === level ? { ...state, isValid } : state))
        );
    }, []);

    // Get features granted at a specific level
    const getFeaturesAtLevel = (level: number): string[] => {
        if (!classData) return [];

        const features: string[] = [];

        // Get features from levelProgression if available
        const progression = classData.levelProgression?.find((p) => p.level === level);
        if (progression?.featuresGranted) {
            features.push(...progression.featuresGranted);
        }

        // Get features from class features array
        const classFeatures = classData.features.filter((f) => f.level === level);
        features.push(...classFeatures.map((f) => f.name));

        // Check for ASI
        if (progression?.abilityScoreImprovement) {
            features.push("Ability Score Improvement");
        }

        return features;
    };

    if (!classData) {
        return (
            <Card>
                <CardBody>
                    <TertiaryText>Error: Unknown class type</TertiaryText>
                </CardBody>
            </Card>
        );
    }

    const completedCount = levelStates.filter((s) => s.isValid).length;
    const totalCount = levelStates.length;

    return (
        <div className="space-y-6">
            {/* Overall Progress Card */}
            <Card>
                <CardBody>
                    <CardTitle>
                        Configure {classType} Levels {levels[0]}-{levels[levels.length - 1]}
                    </CardTitle>
                    <Description>
                        Complete configuration for all {totalCount} level{totalCount > 1 ? "s" : ""}{" "}
                        to proceed.
                    </Description>

                    {/* Progress Indicator */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 bg-default-200 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300"
                                style={{ width: `${(completedCount / totalCount) * 100}%` }}
                            />
                        </div>
                        <TertiaryText>
                            {completedCount} / {totalCount} complete
                        </TertiaryText>
                    </div>

                    {/* Overall Validation Status */}
                    {completedCount === totalCount ? (
                        <div className="mt-3 p-3 bg-success-50 border border-success-200 rounded-lg">
                            <div className="text-sm font-semibold text-success">
                                ✓ All levels configured successfully
                            </div>
                        </div>
                    ) : (
                        <div className="mt-3 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                            <div className="text-sm font-semibold text-warning">
                                ⚠ {totalCount - completedCount} level{totalCount - completedCount > 1 ? "s" : ""} still need configuration
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Individual Level Configurations */}
            {levelStates.map((state, index) => {
                const features = getFeaturesAtLevel(state.level);
                const isComplete = state.isValid;

                return (
                    <div key={state.level} className="space-y-3">
                        {/* Level Header Card */}
                        <Card className={isComplete ? "border-2 border-success" : ""}>
                            <CardBody>
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <CardTitle>Level {state.level}</CardTitle>
                                            {isComplete && (
                                                <span className="text-success text-xl">✓</span>
                                            )}
                                        </div>

                                        {/* Features Gained */}
                                        {features.length > 0 && (
                                            <div className="mt-2">
                                                <TertiaryText className="font-semibold">
                                                    Features Gained:
                                                </TertiaryText>
                                                <ul className="mt-1 space-y-1">
                                                    {features.map((feature, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="text-sm text-default-600"
                                                        >
                                                            • {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Level Configuration */}
                        <ClassLevelConfigurator
                            classType={classType}
                            level={state.level}
                            existingConfig={state.config as ClassConfiguration}
                            onConfigurationChange={(config) =>
                                handleLevelConfigChange(state.level, config)
                            }
                            onValidationChange={(valid) =>
                                handleLevelValidationChange(state.level, valid)
                            }
                        />

                        {/* Divider between levels (except last) */}
                        {index < levelStates.length - 1 && <Divider className="my-6" />}
                    </div>
                );
            })}
        </div>
    );
}
