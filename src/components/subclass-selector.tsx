import { Card, CardBody, Button } from "@heroui/react";
import type { Subclass, SubclassType } from "@/types";
import { CardTitle, Description, SecondaryText } from "./typography";

interface SubclassSelectorProps {
    availableSubclasses: Subclass[];
    selectedSubclass?: SubclassType;
    onSelect: (subclass: SubclassType) => void;
}

/**
 * Displays subclass options with descriptions and features
 * Shows archetype cards that users can select from
 */
export function SubclassSelector({
    availableSubclasses,
    selectedSubclass,
    onSelect,
}: SubclassSelectorProps) {
    return (
        <div className="space-y-4">
            <div>
                <CardTitle>Choose Your Subclass</CardTitle>
                <Description>Select your character's archetype and specialization</Description>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableSubclasses.map((subclass) => {
                    const isSelected = selectedSubclass === subclass.type;

                    return (
                        <Card
                            key={subclass.type}
                            isPressable
                            isHoverable
                            onPress={() => onSelect(subclass.type)}
                            className={
                                isSelected
                                    ? "border-2 border-primary bg-primary-50/50"
                                    : "border-2 border-transparent"
                            }
                        >
                            <CardBody className="gap-3">
                                <div className="flex items-start justify-between">
                                    <h4 className="text-base font-bold">{subclass.type}</h4>
                                    {isSelected && (
                                        <span className="text-xs font-semibold text-primary">
                                            Selected
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <SecondaryText className="block font-semibold">
                                        Features:
                                    </SecondaryText>
                                    <ul className="space-y-1">
                                        {subclass.features.slice(0, 3).map((feature, idx) => (
                                            <li key={idx} className="text-xs text-default-600">
                                                <span className="font-semibold">{feature.name}</span>
                                                {feature.level > 1 && (
                                                    <span className="text-default-400">
                                                        {" "}
                                                        (Level {feature.level})
                                                    </span>
                                                )}
                                                : {feature.description}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button
                                    color={isSelected ? "primary" : "default"}
                                    variant={isSelected ? "solid" : "flat"}
                                    size="sm"
                                    onPress={() => onSelect(subclass.type)}
                                    className="mt-2"
                                >
                                    {isSelected ? "Selected" : "Select"}
                                </Button>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
