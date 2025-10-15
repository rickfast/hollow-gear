import { useState } from "react";
import { Card, CardBody, Checkbox, CheckboxGroup, Chip, Divider } from "@heroui/react";
import type { ClassType, Spell } from "@/types";
import { SPELLS_BY_NAME } from "@/data/spells";
import { CardTitle, Description, SecondaryText, TertiaryText } from "./typography";

interface SpellSelectorProps {
    classType: ClassType;
    level: number;
    cantripsKnown?: number;
    spellsKnown?: number;
    availableSpells: string[]; // Spell names
    selectedSpells: string[];
    onSelect: (spells: string[]) => void;
}

/**
 * Spell selection interface for spellcasting classes
 * Displays available spells filtered by class and level
 * Tracks selection counts and validates against class requirements
 */
export function SpellSelector({
    classType,
    level,
    cantripsKnown = 0,
    spellsKnown = 0,
    availableSpells,
    selectedSpells,
    onSelect,
}: SpellSelectorProps) {
    const [expandedSpell, setExpandedSpell] = useState<string | null>(null);

    // Separate cantrips from leveled spells
    const cantrips = availableSpells
        .map((name) => SPELLS_BY_NAME[name])
        .filter((spell): spell is Spell => spell !== undefined && spell.level === 0);

    const leveledSpells = availableSpells
        .map((name) => SPELLS_BY_NAME[name])
        .filter((spell): spell is Spell => spell !== undefined && spell.level > 0 && spell.level <= level);

    // Count selected cantrips and spells
    const selectedCantrips = selectedSpells.filter((name) => {
        const spell = SPELLS_BY_NAME[name];
        return spell && spell.level === 0;
    });

    const selectedLeveledSpells = selectedSpells.filter((name) => {
        const spell = SPELLS_BY_NAME[name];
        return spell && spell.level > 0;
    });

    const handleToggleSpell = (spellName: string) => {
        const spell = SPELLS_BY_NAME[spellName];
        if (!spell) return;

        const isSelected = selectedSpells.includes(spellName);
        const isCantrip = spell.level === 0;

        if (isSelected) {
            // Deselect
            onSelect(selectedSpells.filter((s) => s !== spellName));
        } else {
            // Check if we can select more
            if (isCantrip && selectedCantrips.length >= cantripsKnown) {
                return; // Can't select more cantrips
            }
            if (!isCantrip && selectedLeveledSpells.length >= spellsKnown) {
                return; // Can't select more spells
            }
            onSelect([...selectedSpells, spellName]);
        }
    };

    const renderSpellList = (spells: Spell[], isCantrip: boolean) => {
        const selectedCount = isCantrip ? selectedCantrips.length : selectedLeveledSpells.length;
        const maxCount = isCantrip ? cantripsKnown : spellsKnown;

        if (spells.length === 0) return null;

        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <SecondaryText className="font-semibold">
                        {isCantrip ? "Cantrips" : "Spells"}
                    </SecondaryText>
                    <Chip
                        size="sm"
                        color={selectedCount === maxCount ? "success" : "default"}
                        variant="flat"
                    >
                        {selectedCount} / {maxCount}
                    </Chip>
                </div>

                <CheckboxGroup
                    value={selectedSpells}
                    classNames={{
                        wrapper: "gap-2",
                    }}
                >
                    {spells.map((spell) => {
                        const isSelected = selectedSpells.includes(spell.name);
                        const isExpanded = expandedSpell === spell.name;

                        return (
                            <Card
                                key={spell.name}
                                isPressable
                                onPress={() => setExpandedSpell(isExpanded ? null : spell.name)}
                                className="border border-default-200"
                            >
                                <CardBody className="gap-2 py-2">
                                    <div className="flex items-start gap-2">
                                        <Checkbox
                                            value={spell.name}
                                            isSelected={isSelected}
                                            onValueChange={() => handleToggleSpell(spell.name)}
                                            classNames={{
                                                wrapper: "mt-0.5",
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="text-sm font-semibold">
                                                        {spell.hollowgearName || spell.name}
                                                    </div>
                                                    {spell.hollowgearName && (
                                                        <TertiaryText>
                                                            ({spell.name})
                                                        </TertiaryText>
                                                    )}
                                                </div>
                                                <div className="flex gap-1 flex-shrink-0">
                                                    <Chip size="sm" variant="flat">
                                                        {spell.school}
                                                    </Chip>
                                                    {spell.concentration && (
                                                        <Chip size="sm" color="warning" variant="flat">
                                                            C
                                                        </Chip>
                                                    )}
                                                </div>
                                            </div>

                                            {isExpanded && (
                                                <div className="mt-2 space-y-1">
                                                    <div className="text-xs text-default-600">
                                                        {spell.description}
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 text-xs text-default-500">
                                                        <span>Cast: {spell.castingTime}</span>
                                                        <span>•</span>
                                                        <span>Range: {spell.range}</span>
                                                        <span>•</span>
                                                        <span>Duration: {spell.duration}</span>
                                                    </div>
                                                    {spell.aetherCost && (
                                                        <div className="text-xs text-primary font-semibold">
                                                            Cost: {spell.aetherCost} AFP
                                                        </div>
                                                    )}
                                                    {spell.heatGenerated && (
                                                        <div className="text-xs text-danger">
                                                            Heat: {spell.heatGenerated}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </CheckboxGroup>
            </div>
        );
    };

    return (
        <Card>
            <CardBody className="gap-4">
                <div>
                    <CardTitle>Select Spells</CardTitle>
                    <Description>
                        Choose your starting spells for {classType}. Click on a spell to see more
                        details.
                    </Description>
                </div>

                {cantripsKnown > 0 && renderSpellList(cantrips, true)}

                {cantripsKnown > 0 && spellsKnown > 0 && <Divider />}

                {spellsKnown > 0 && renderSpellList(leveledSpells, false)}

                {cantrips.length === 0 && leveledSpells.length === 0 && (
                    <TertiaryText>No spells available for selection</TertiaryText>
                )}
            </CardBody>
        </Card>
    );
}
