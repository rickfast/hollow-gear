import { Card, CardBody, Radio, RadioGroup, Checkbox, CheckboxGroup } from "@heroui/react";
import type { ConfigurableFeature } from "@/types";
import { CardTitle, Description } from "./typography";

interface FeatureSelectorProps {
    feature: ConfigurableFeature;
    selectedOptions?: string | string[];
    onSelect: (options: string | string[]) => void;
}

/**
 * Generic feature selection component that adapts UI based on configuration type
 * Supports single choice (radio), multiple choice (checkboxes), and ability selection
 */
export function FeatureSelector({ feature, selectedOptions, onSelect }: FeatureSelectorProps) {
    const { featureName, description, configurationType, options, required } = feature;

    // Render single choice (radio buttons)
    if (configurationType === "choice" || configurationType === "ability-selection") {
        const value = typeof selectedOptions === "string" ? selectedOptions : "";

        return (
            <Card>
                <CardBody>
                    <CardTitle>
                        {featureName}
                        {required && <span className="text-danger ml-1">*</span>}
                    </CardTitle>
                    <Description>{description}</Description>

                    <RadioGroup
                        value={value}
                        onValueChange={(val) => onSelect(val)}
                        classNames={{
                            wrapper: "gap-3",
                        }}
                    >
                        {options.map((option) => (
                            <Radio
                                key={option.id}
                                value={option.id}
                                description={option.description}
                                classNames={{
                                    base: "max-w-full",
                                    label: "text-sm font-semibold",
                                    description: "text-xs text-default-500",
                                }}
                            >
                                {option.name}
                            </Radio>
                        ))}
                    </RadioGroup>
                </CardBody>
            </Card>
        );
    }

    // Render multiple choice (checkboxes)
    if (configurationType === "multiple") {
        const values = Array.isArray(selectedOptions) ? selectedOptions : [];

        return (
            <Card>
                <CardBody>
                    <CardTitle>
                        {featureName}
                        {required && <span className="text-danger ml-1">*</span>}
                    </CardTitle>
                    <Description>{description}</Description>

                    <CheckboxGroup
                        value={values}
                        onValueChange={(vals) => onSelect(vals)}
                        classNames={{
                            wrapper: "gap-3",
                        }}
                    >
                        {options.map((option) => (
                            <Checkbox
                                key={option.id}
                                value={option.id}
                                classNames={{
                                    base: "max-w-full",
                                    label: "text-sm font-semibold",
                                }}
                            >
                                <div>
                                    <div className="text-sm font-semibold">{option.name}</div>
                                    <div className="text-xs text-default-500">{option.description}</div>
                                </div>
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                </CardBody>
            </Card>
        );
    }

    // For spell-selection and proficiency-selection, return null
    // These are handled by specialized components
    return null;
}
