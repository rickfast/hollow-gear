import { Card, CardBody, Checkbox, CheckboxGroup, Chip } from "@heroui/react";
import type { SkillType, Tool } from "@/types";
import { SKILLS } from "@/data/skills";
import { CardTitle, Description, SecondaryText } from "./typography";

interface ProficiencySelectorProps {
    type: "skill" | "tool";
    availableOptions: string[];
    count: number;
    selectedProficiencies: string[];
    onSelect: (proficiencies: string[]) => void;
    title?: string;
    description?: string;
}

/**
 * Proficiency selection interface for skills and tools
 * Enforces selection count limits and displays proficiency descriptions
 */
export function ProficiencySelector({
    type,
    availableOptions,
    count,
    selectedProficiencies,
    onSelect,
    title,
    description,
}: ProficiencySelectorProps) {
    const handleToggle = (proficiency: string) => {
        const isSelected = selectedProficiencies.includes(proficiency);

        if (isSelected) {
            // Deselect
            onSelect(selectedProficiencies.filter((p) => p !== proficiency));
        } else {
            // Check if we can select more
            if (selectedProficiencies.length >= count) {
                return; // Can't select more
            }
            onSelect([...selectedProficiencies, proficiency]);
        }
    };

    const getSkillAbility = (skill: string): string | null => {
        if (type === "skill" && skill in SKILLS) {
            const ability = SKILLS[skill as SkillType];
            return ability.substring(0, 3).toUpperCase();
        }
        return null;
    };

    const defaultTitle = type === "skill" ? "Select Skill Proficiencies" : "Select Tool Proficiencies";
    const defaultDescription =
        type === "skill"
            ? `Choose ${count} skill${count !== 1 ? "s" : ""} to gain proficiency in`
            : `Choose ${count} tool${count !== 1 ? "s" : ""} to gain proficiency in`;

    return (
        <Card>
            <CardBody className="gap-3">
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle>{title || defaultTitle}</CardTitle>
                        <Description>{description || defaultDescription}</Description>
                    </div>
                    <Chip
                        size="sm"
                        color={selectedProficiencies.length === count ? "success" : "default"}
                        variant="flat"
                    >
                        {selectedProficiencies.length} / {count}
                    </Chip>
                </div>

                <CheckboxGroup
                    value={selectedProficiencies}
                    classNames={{
                        wrapper: "gap-2",
                    }}
                >
                    {availableOptions.map((option) => {
                        const isSelected = selectedProficiencies.includes(option);
                        const ability = getSkillAbility(option);

                        return (
                            <div
                                key={option}
                                className="flex items-center gap-2 p-2 rounded-lg hover:bg-default-100 cursor-pointer"
                                onClick={() => handleToggle(option)}
                            >
                                <Checkbox
                                    value={option}
                                    isSelected={isSelected}
                                    classNames={{
                                        wrapper: "mt-0",
                                    }}
                                />
                                <div className="flex-1 flex items-center justify-between">
                                    <span className="text-sm font-semibold">{option}</span>
                                    {ability && (
                                        <Chip size="sm" variant="flat" className="ml-2">
                                            {ability}
                                        </Chip>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </CheckboxGroup>

                {availableOptions.length === 0 && (
                    <SecondaryText>No proficiencies available for selection</SecondaryText>
                )}
            </CardBody>
        </Card>
    );
}
