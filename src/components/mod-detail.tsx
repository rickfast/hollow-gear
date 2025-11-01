import { ALL_EQUIPMENT } from "@/data/equipment";
import { MODS } from "@/data/mods";
import type { Equipment, Mod } from "@/types";
import {
    buildReferencePath,
    getEquipmentReferenceTarget,
    getModReferenceTarget,
} from "@/utils/reference-links";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import {
    CardTitle,
    Description,
    PrimaryStat,
    SecondaryText,
    Stat,
    StatRow,
    TertiaryText,
} from "./typography";

interface ModDetailProps {
    mod: Mod;
}

/**
 * Displays comprehensive mod information for the reference page
 * Shows mod name, tier, type, equipment compatibility, crafting requirements, and effects
 */
export function ModDetail({ mod }: ModDetailProps) {
    // Format craft time
    const formatCraftTime = (hours: number): string => {
        if (hours < 24) {
            return `${hours} hours`;
        }
        const days = Math.floor(hours / 24);
        const remainingHours = hours % 24;
        if (remainingHours === 0) {
            return `${days} ${days === 1 ? "day" : "days"}`;
        }
        return `${days}d ${remainingHours}h`;
    };

    // Format uses per rest
    const formatUsesPerRest = (): string | null => {
        if (!mod.usesPerRest) return null;
        const { amount, restType } = mod.usesPerRest;
        return `${amount}/${restType} rest`;
    };

    const usesPerRest = formatUsesPerRest();

    const compatibleEquipment: Equipment[] = mod.equipmentType
        ? ALL_EQUIPMENT.filter((item) => item.type === mod.equipmentType).slice(0, 8)
        : [];

    const relatedMods = MODS.filter((other) => other.id !== mod.id && other.modType === mod.modType)
        .sort((a, b) => a.tier.localeCompare(b.tier) || a.name.localeCompare(b.name))
        .slice(0, 6);

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-2 pb-2 p-3 sm:p-4">
                <div className="w-full">
                    <CardTitle className="text-base sm:text-lg break-words">{mod.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {mod.tier}
                    </Chip>
                    <Chip
                        size="sm"
                        variant="flat"
                        color="secondary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {mod.modType}
                    </Chip>
                    {mod.equipmentType && (
                        <Chip size="sm" variant="flat" classNames={{ base: "min-h-[32px]" }}>
                            {mod.equipmentType}
                        </Chip>
                    )}
                    {mod.malfunctionChance && (
                        <Chip
                            size="sm"
                            variant="flat"
                            color="danger"
                            classNames={{ base: "min-h-[32px]" }}
                        >
                            Malfunction Risk
                        </Chip>
                    )}
                </div>
            </CardHeader>

            <CardBody className="gap-3 sm:gap-4 pt-2 p-3 sm:p-4">
                {/* Equipment Type */}
                {mod.equipmentType && (
                    <>
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Applies To
                            </SecondaryText>
                            <Description className="text-sm sm:text-base">
                                {mod.equipmentType}
                            </Description>
                        </div>
                        <Divider />
                    </>
                )}

                {/* Effect */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Effect
                    </SecondaryText>
                    <Description className="text-sm sm:text-base leading-relaxed break-words">
                        {mod.effect}
                    </Description>
                    {usesPerRest && (
                        <div className="mt-2">
                            <Chip
                                size="sm"
                                variant="flat"
                                color="success"
                                classNames={{ base: "min-h-[32px]" }}
                            >
                                {usesPerRest}
                            </Chip>
                        </div>
                    )}
                </div>

                <Divider />

                {/* Crafting Requirements */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Crafting Requirements
                    </SecondaryText>
                    <StatRow>
                        <PrimaryStat label="Craft DC" value={mod.craftDC.toString()} />
                        <Stat label="Time" value={formatCraftTime(mod.craftTime)} />
                    </StatRow>
                    <StatRow>
                        <Stat label="Cost" value={`${mod.cost} Cogs`} />
                    </StatRow>
                </div>

                {/* Malfunction Chance */}
                {mod.malfunctionChance && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Malfunction Risk
                            </SecondaryText>
                            <StatRow>
                                <PrimaryStat label="Chance" value={`${mod.malfunctionChance}%`} />
                            </StatRow>
                            <TertiaryText className="mt-2 text-xs sm:text-sm">
                                This mod has a chance to malfunction when used
                            </TertiaryText>
                        </div>
                    </>
                )}

                {/* Additional Damage */}
                {mod.additionalDamage && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Additional Damage
                            </SecondaryText>
                            <StatRow>
                                <Stat
                                    label="Damage"
                                    value={`${mod.additionalDamage.count}d${mod.additionalDamage.die} ${mod.additionalDamage.damageType}`}
                                />
                            </StatRow>
                        </div>
                    </>
                )}

                {compatibleEquipment.length > 0 && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Compatible Equipment
                            </SecondaryText>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {compatibleEquipment.map((item) => (
                                    <Link
                                        key={item.id}
                                        to={buildReferencePath(
                                            getEquipmentReferenceTarget(item.id)
                                        )}
                                        className="inline-flex"
                                    >
                                        <Chip
                                            size="sm"
                                            variant="bordered"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {item.name}
                                        </Chip>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {relatedMods.length > 0 && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Related Mods
                            </SecondaryText>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {relatedMods.map((related) => (
                                    <Link
                                        key={related.id}
                                        to={buildReferencePath(getModReferenceTarget(related))}
                                        className="inline-flex"
                                    >
                                        <Chip
                                            size="sm"
                                            variant="bordered"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {related.name}
                                        </Chip>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Notes */}
                {mod.notes && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Notes
                            </SecondaryText>
                            <Description className="text-sm sm:text-base leading-relaxed break-words">
                                {mod.notes}
                            </Description>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
