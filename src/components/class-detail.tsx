import { CLASSES } from "@/data/classes";
import { EQUIPMENT_BY_ID } from "@/data/equipment";
import { SPELLS } from "@/data/spells";
import type { Class, Equipment } from "@/types";
import {
    buildReferencePath,
    getClassReferenceTarget,
    getEquipmentReferenceTarget,
    getSpellReferenceTarget,
} from "@/utils/reference-links";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import { CardTitle, Description, SecondaryText, Stat, StatRow, TertiaryText } from "./typography";

interface ClassDetailProps {
    classData: Class;
}

/**
 * Displays comprehensive class information for the reference page
 * Shows class name, primary ability, hit die, role, features, spellcasting, and starting equipment
 */
export function ClassDetail({ classData }: ClassDetailProps) {
    // Format primary ability
    const formatAbility = (ability: string): string => {
        return ability.charAt(0).toUpperCase() + ability.slice(1);
    };

    // Format uses per rest
    const formatUsesPerRest = (amount: number, restType: string): string => {
        return `${amount}/${restType} rest`;
    };

    // Format currency
    const formatCurrency = (): string => {
        const { cogs, gears, cores } = classData.startingEquipment.currency;
        const parts: string[] = [];
        if (cogs > 0) parts.push(`${cogs}⚙️`);
        if (gears > 0) parts.push(`${gears}🔧`);
        if (cores > 0) parts.push(`${cores}💎`);
        return parts.join(", ");
    };

    // Build starting equipment lookup with quantities
    const summarizeEquipment = (ids: string[]): { equipment: Equipment; quantity: number }[] => {
        const counts = new Map<string, number>();
        ids.forEach((id) => {
            if (EQUIPMENT_BY_ID[id]) {
                counts.set(id, (counts.get(id) ?? 0) + 1);
            }
        });
        return Array.from(counts.entries()).map(([id, quantity]) => ({
            equipment: EQUIPMENT_BY_ID[id]!,
            quantity,
        }));
    };

    const startingWeapons = summarizeEquipment(classData.startingEquipment.weapons);
    const startingTools = summarizeEquipment(classData.startingEquipment.tools);
    const startingItems = summarizeEquipment(classData.startingEquipment.items);
    const startingArmor = classData.startingEquipment.armor
        ? EQUIPMENT_BY_ID[classData.startingEquipment.armor]
        : null;

    const classSpells = SPELLS.filter((spell) => spell.classes.includes(classData.type))
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
        .slice(0, 10);

    const relatedClasses = CLASSES.filter(
        (cls) =>
            cls.type !== classData.type &&
            (cls.primaryAbility === classData.primaryAbility ||
                cls.primaryResource === classData.primaryResource)
    )
        .sort((a, b) => a.type.localeCompare(b.type))
        .slice(0, 4);

    const renderEquipmentChips = (entries: { equipment: Equipment; quantity: number }[]) => {
        if (entries.length === 0) {
            return null;
        }
        return (
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {entries.map(({ equipment, quantity }) => (
                    <Link
                        key={equipment.id}
                        to={buildReferencePath(getEquipmentReferenceTarget(equipment.id))}
                        className="inline-flex"
                    >
                        <Chip size="sm" variant="bordered" classNames={{ base: "min-h-[32px]" }}>
                            {quantity > 1 ? `${equipment.name} ×${quantity}` : equipment.name}
                        </Chip>
                    </Link>
                ))}
            </div>
        );
    };

    const renderEquipmentItem = (equipment: Equipment | null) => {
        if (!equipment) return null;
        return (
            <Link
                to={buildReferencePath(getEquipmentReferenceTarget(equipment.id))}
                className="inline-flex"
            >
                <Chip size="sm" variant="bordered" classNames={{ base: "min-h-[32px]" }}>
                    {equipment.name}
                </Chip>
            </Link>
        );
    };

    // Get all features including subclass features
    const allFeatures = [...classData.features];
    classData.subclasses.forEach((subclass) => {
        allFeatures.push(...subclass.features);
    });

    // Sort features by level
    const sortedFeatures = allFeatures.sort((a, b) => a.level - b.level);

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-2 pb-2 p-3 sm:p-4">
                <div className="w-full">
                    <CardTitle className="text-base sm:text-lg break-words">
                        {classData.type}
                    </CardTitle>
                    <TertiaryText className="text-xs sm:text-sm break-words">
                        {classData.description.role}
                    </TertiaryText>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {formatAbility(classData.primaryAbility)}
                    </Chip>
                    <Chip size="sm" variant="flat" classNames={{ base: "min-h-[32px]" }}>
                        {classData.hitDie} Hit Die
                    </Chip>
                    <Chip
                        size="sm"
                        variant="flat"
                        color="secondary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {classData.primaryResource}
                    </Chip>
                </div>
            </CardHeader>

            <CardBody className="gap-3 sm:gap-4 pt-2 p-3 sm:p-4">
                {/* Description */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Description
                    </SecondaryText>
                    <Description className="text-sm sm:text-base leading-relaxed break-words">
                        {classData.description.description}
                    </Description>
                </div>

                <Divider />

                {/* Archetypes */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Archetypes
                    </SecondaryText>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {classData.description.archetypes.map((archetype) => (
                            <Chip
                                key={archetype}
                                size="sm"
                                variant="bordered"
                                classNames={{ base: "min-h-[32px]" }}
                            >
                                {archetype}
                            </Chip>
                        ))}
                    </div>
                </div>

                <Divider />

                {/* Spellcasting */}
                {classData.spellcasting && (
                    <>
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Spellcasting
                            </SecondaryText>
                            <StatRow>
                                <Stat
                                    label="Spellcasting Ability"
                                    value={formatAbility(
                                        classData.spellcasting.spellcastingAbility
                                    )}
                                />
                                {classData.spellcasting.cantripsKnown !== undefined && (
                                    <Stat
                                        label="Cantrips Known"
                                        value={classData.spellcasting.cantripsKnown}
                                    />
                                )}
                            </StatRow>
                            <StatRow>
                                {classData.spellcasting.spellsKnown !== undefined && (
                                    <Stat
                                        label="Spells Known"
                                        value={classData.spellcasting.spellsKnown}
                                    />
                                )}
                                {classData.spellcasting.spellsPrepared !== undefined && (
                                    <Stat
                                        label="Spells Prepared"
                                        value={
                                            classData.spellcasting.spellsPrepared === 0
                                                ? "Level + Modifier"
                                                : classData.spellcasting.spellsPrepared
                                        }
                                    />
                                )}
                            </StatRow>
                            <div className="mt-2">
                                <TertiaryText className="font-semibold mb-1 block text-xs sm:text-sm">
                                    Spell Lists
                                </TertiaryText>
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                    {classData.spellcasting.spellLists.map((list) => (
                                        <Chip
                                            key={list}
                                            size="sm"
                                            variant="flat"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {list}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Divider />
                    </>
                )}

                {/* Signature Spells */}
                {classSpells.length > 0 && (
                    <>
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Signature Spells
                            </SecondaryText>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {classSpells.map((spell) => (
                                    <Link
                                        key={spell.name}
                                        to={buildReferencePath(getSpellReferenceTarget(spell))}
                                        className="inline-flex"
                                    >
                                        <Chip
                                            size="sm"
                                            variant="bordered"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {spell.hollowgearName || spell.name}
                                        </Chip>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Divider />
                    </>
                )}

                {/* Class Features */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Class Features
                    </SecondaryText>
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {sortedFeatures.map((feature, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <TertiaryText className="font-semibold text-sm sm:text-base break-words">
                                        {feature.name}
                                    </TertiaryText>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        classNames={{ base: "min-h-[32px]" }}
                                    >
                                        Level {feature.level}
                                    </Chip>
                                    {feature.usesPerRest && (
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color="success"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {formatUsesPerRest(
                                                feature.usesPerRest.amount,
                                                feature.usesPerRest.restType
                                            )}
                                        </Chip>
                                    )}
                                </div>
                                <Description className="text-sm sm:text-base leading-relaxed break-words">
                                    {feature.description}
                                </Description>
                            </div>
                        ))}
                    </div>
                </div>

                <Divider />

                {/* Starting Equipment */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Starting Equipment
                    </SecondaryText>
                    <div className="flex flex-col gap-1.5 sm:gap-2">
                        {/* Weapons */}
                        {startingWeapons.length > 0 && (
                            <div>
                                <TertiaryText className="font-semibold text-xs sm:text-sm">
                                    Weapons
                                </TertiaryText>
                                {renderEquipmentChips(startingWeapons)}
                            </div>
                        )}

                        {/* Armor */}
                        {startingArmor && (
                            <div>
                                <TertiaryText className="font-semibold text-xs sm:text-sm">
                                    Armor
                                </TertiaryText>
                                {renderEquipmentItem(startingArmor)}
                            </div>
                        )}

                        {/* Tools */}
                        {startingTools.length > 0 && (
                            <div>
                                <TertiaryText className="font-semibold text-xs sm:text-sm">
                                    Tools
                                </TertiaryText>
                                {renderEquipmentChips(startingTools)}
                            </div>
                        )}

                        {/* Items */}
                        {startingItems.length > 0 && (
                            <div>
                                <TertiaryText className="font-semibold text-xs sm:text-sm">
                                    Items
                                </TertiaryText>
                                {renderEquipmentChips(startingItems)}
                            </div>
                        )}

                        {/* Currency */}
                        <div>
                            <TertiaryText className="font-semibold text-xs sm:text-sm">
                                Currency
                            </TertiaryText>
                            <Description className="text-sm sm:text-base">
                                {formatCurrency()}
                            </Description>
                        </div>
                    </div>
                </div>

                {relatedClasses.length > 0 && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Related Classes
                            </SecondaryText>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {relatedClasses.map((cls) => (
                                    <Link
                                        key={cls.type}
                                        to={buildReferencePath(getClassReferenceTarget(cls.type))}
                                        className="inline-flex"
                                    >
                                        <Chip
                                            size="sm"
                                            variant="bordered"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {cls.type}
                                        </Chip>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
