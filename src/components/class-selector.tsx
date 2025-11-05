/**
 * ClassSelector Component
 *
 * Displays current classes and allows adding levels or multiclassing
 * Supports both create mode (single class) and edit mode (multiclass)
 */

import { CLASSES } from "@/data";
import type { AbilityScores, CharacterClass, ClassType } from "@/types";
import { Button, Card, CardBody, CardHeader, Chip, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

interface ClassSelectorProps {
    currentClasses: CharacterClass[];
    abilityScores?: AbilityScores;
    onClassAdd: (classType: ClassType, levels: number) => void;
    onClassLevelChange: (classType: ClassType, additionalLevels: number) => void;
    onClassRemove?: (classType: ClassType) => void;
    isEditMode?: boolean;
}

/**
 * Multiclass ability score prerequisites
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

export function ClassSelector({
    currentClasses,
    abilityScores,
    onClassAdd,
    onClassLevelChange,
    onClassRemove,
    isEditMode = false,
}: ClassSelectorProps) {
    const [selectedNewClass, setSelectedNewClass] = useState<ClassType | "">("");
    const [levelsToAdd, setLevelsToAdd] = useState<Partial<Record<ClassType, number>>>({});

    const totalLevel = currentClasses.reduce((sum, c) => sum + c.level, 0);

    /**
     * Check if character meets multiclass prerequisites for a class
     */
    const canMulticlass = (classType: ClassType): boolean => {
        if (!abilityScores) {
            return false;
        }

        const requirements = MULTICLASS_REQUIREMENTS[classType];
        if (!requirements) {
            return true;
        }

        for (const [ability, requiredScore] of Object.entries(requirements)) {
            const characterScore = abilityScores[ability as keyof AbilityScores];
            if (characterScore < requiredScore) {
                return false;
            }
        }

        return true;
    };

    /**
     * Get reason why a class is unavailable for multiclassing
     */
    const getMulticlassRequirementText = (classType: ClassType): string => {
        const requirements = MULTICLASS_REQUIREMENTS[classType];
        if (!requirements) {
            return "";
        }

        return Object.entries(requirements)
            .map(([ability, score]) => `${ability.substring(0, 3).toUpperCase()} ${score}`)
            .join(", ");
    };

    /**
     * Get available classes for multiclassing (not already taken)
     */
    const availableClasses = CLASSES.filter(
        (c) => !currentClasses.some((cc) => cc.class === c.type)
    );

    /**
     * Filter classes by multiclass eligibility
     */
    const eligibleClasses = availableClasses.filter((c) => canMulticlass(c.type));
    const ineligibleClasses = availableClasses.filter((c) => !canMulticlass(c.type));

    const handleAddLevels = (classType: ClassType) => {
        const levels = levelsToAdd[classType] || 1;
        if (levels > 0) {
            onClassLevelChange(classType, levels);
            // Reset the input
            setLevelsToAdd((prev) => ({ ...prev, [classType]: 0 }));
        }
    };

    const handleAddNewClass = () => {
        if (selectedNewClass) {
            onClassAdd(selectedNewClass, 1);
            setSelectedNewClass("");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                {currentClasses.length === 0 ? "Choose Class" : "Manage Classes"}
            </h2>

            {/* Current Classes */}
            {currentClasses.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 600 }}>Current Classes</h3>
                    {currentClasses.map((charClass) => {
                        const classData = CLASSES.find((c) => c.type === charClass.class);
                        if (!classData) return null;

                        return (
                            <Card key={charClass.class}>
                                <CardHeader>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            width: "100%",
                                        }}
                                    >
                                        <div>
                                            <h4 style={{ fontWeight: 600, fontSize: "1.125rem" }}>
                                                {charClass.class}
                                            </h4>
                                            <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                                Level {charClass.level}
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem" }}>
                                            {charClass.subclass && (
                                                <Chip size="sm" variant="flat" color="primary">
                                                    {charClass.subclass}
                                                </Chip>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "1rem",
                                        }}
                                    >
                                        <p style={{ fontSize: "0.875rem" }}>
                                            {classData.description.description}
                                        </p>

                                        {/* Add Levels Section */}
                                        {isEditMode && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "0.5rem",
                                                    alignItems: "flex-end",
                                                }}
                                            >
                                                <Input
                                                    type="number"
                                                    label="Levels to Add"
                                                    placeholder="1"
                                                    min={1}
                                                    max={20 - totalLevel}
                                                    value={
                                                        levelsToAdd[charClass.class]?.toString() ||
                                                        ""
                                                    }
                                                    onValueChange={(value) => {
                                                        const num = parseInt(value) || 0;
                                                        setLevelsToAdd((prev) => ({
                                                            ...prev,
                                                            [charClass.class]: num,
                                                        }));
                                                    }}
                                                    size="sm"
                                                    style={{ maxWidth: "150px" }}
                                                />
                                                <Button
                                                    color="primary"
                                                    size="sm"
                                                    onPress={() => handleAddLevels(charClass.class)}
                                                    isDisabled={
                                                        !levelsToAdd[charClass.class] ||
                                                        (levelsToAdd[charClass.class] ?? 0) <= 0 ||
                                                        totalLevel +
                                                            (levelsToAdd[charClass.class] ?? 0) >
                                                            20
                                                    }
                                                >
                                                    Add Levels
                                                </Button>
                                                {onClassRemove && currentClasses.length > 1 && (
                                                    <Button
                                                        color="danger"
                                                        variant="flat"
                                                        size="sm"
                                                        onPress={() =>
                                                            onClassRemove(charClass.class)
                                                        }
                                                    >
                                                        Remove Class
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add New Class (for create mode or multiclassing) */}
            {currentClasses.length === 0 && (
                <div>
                    <Select
                        label="Class"
                        placeholder="Select a class"
                        selectedKeys={selectedNewClass ? [selectedNewClass] : []}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as ClassType;
                            setSelectedNewClass(selected);
                        }}
                        size="lg"
                        isRequired
                    >
                        {CLASSES.map((c) => (
                            <SelectItem key={c.type}>{c.type}</SelectItem>
                        ))}
                    </Select>

                    {selectedNewClass && (
                        <Card style={{ marginTop: "1rem" }}>
                            <CardBody>
                                {(() => {
                                    const classData = CLASSES.find(
                                        (c) => c.type === selectedNewClass
                                    );
                                    if (!classData) return null;

                                    return (
                                        <>
                                            <h3
                                                style={{
                                                    fontWeight: 600,
                                                    marginBottom: "0.5rem",
                                                }}
                                            >
                                                {classData.type}
                                            </h3>
                                            <p
                                                style={{
                                                    fontSize: "0.875rem",
                                                    marginBottom: "1rem",
                                                }}
                                            >
                                                {classData.description.description}
                                            </p>
                                            <div style={{ marginBottom: "1rem" }}>
                                                <strong style={{ fontSize: "0.875rem" }}>
                                                    Role:
                                                </strong>{" "}
                                                {classData.description.role}
                                            </div>
                                            <div>
                                                <strong style={{ fontSize: "0.875rem" }}>
                                                    Hit Die:
                                                </strong>{" "}
                                                {classData.hitDie}
                                            </div>
                                        </>
                                    );
                                })()}
                            </CardBody>
                        </Card>
                    )}
                </div>
            )}

            {/* Multiclass Section */}
            {currentClasses.length > 0 && isEditMode && totalLevel < 20 && (
                <Card>
                    <CardHeader>
                        <h3 style={{ fontWeight: 600 }}>Add Another Class (Multiclass)</h3>
                    </CardHeader>
                    <CardBody>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            {eligibleClasses.length > 0 ? (
                                <>
                                    <Select
                                        label="Available Classes"
                                        placeholder="Select a class to multiclass"
                                        selectedKeys={selectedNewClass ? [selectedNewClass] : []}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] as ClassType;
                                            setSelectedNewClass(selected);
                                        }}
                                        size="md"
                                    >
                                        {eligibleClasses.map((c) => (
                                            <SelectItem key={c.type}>{c.type}</SelectItem>
                                        ))}
                                    </Select>

                                    {selectedNewClass && (
                                        <Button
                                            color="primary"
                                            onPress={handleAddNewClass}
                                            style={{ alignSelf: "flex-start" }}
                                        >
                                            Add {selectedNewClass}
                                        </Button>
                                    )}
                                </>
                            ) : (
                                <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                    No classes available for multiclassing. You have either taken
                                    all classes or don't meet the requirements.
                                </p>
                            )}

                            {/* Show ineligible classes with requirements */}
                            {ineligibleClasses.length > 0 && (
                                <div style={{ marginTop: "1rem" }}>
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        Requirements Not Met:
                                    </p>
                                    <div
                                        style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                                    >
                                        {ineligibleClasses.map((c) => (
                                            <Chip
                                                key={c.type}
                                                size="sm"
                                                variant="flat"
                                                color="default"
                                            >
                                                {c.type} (Requires:{" "}
                                                {getMulticlassRequirementText(c.type)})
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Total Level Display */}
            {currentClasses.length > 0 && (
                <div
                    style={{
                        padding: "1rem",
                        backgroundColor: "var(--heroui-content2)",
                        borderRadius: "0.5rem",
                    }}
                >
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontWeight: 600 }}>Total Character Level:</span>
                        <span style={{ fontWeight: 600, fontSize: "1.125rem" }}>{totalLevel}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
