import { SPELLS } from "@/data/spells";
import type { Spell } from "@/types";
import {
    buildReferencePath,
    getClassReferenceTarget,
    getSpellReferenceTarget,
} from "@/utils/reference-links";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import {
    CardTitle,
    DangerStat,
    Description,
    PrimaryStat,
    SecondaryText,
    Stat,
    StatRow,
    TertiaryText,
} from "./typography";

interface SpellDetailProps {
    spell: Spell;
}

/**
 * Displays comprehensive spell information for the reference page
 * Shows Hollow Gear name, standard D&D name, casting details, costs, and effects
 */
export function SpellDetail({ spell }: SpellDetailProps) {
    // Format components string
    const components = [
        spell.components.verbal && "V",
        spell.components.somatic && "S",
        spell.components.material && "M",
    ]
        .filter(Boolean)
        .join(", ");

    const componentDetails = spell.components.materials
        ? `${components} (${spell.components.materials})`
        : components;

    // Format spell level
    const levelText = spell.level === 0 ? "Cantrip" : `Level ${spell.level}`;

    const relatedSpells = SPELLS.filter(
        (other) => other.name !== spell.name && other.school === spell.school
    )
        .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
        .slice(0, 8);

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-2 pb-2 p-3 sm:p-4">
                <div className="w-full">
                    <CardTitle className="text-base sm:text-lg break-words">
                        {spell.hollowgearName || spell.name}
                    </CardTitle>
                    {spell.hollowgearName && (
                        <TertiaryText className="text-xs sm:text-sm break-words">
                            ({spell.name})
                        </TertiaryText>
                    )}
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {levelText}
                    </Chip>
                    <Chip size="sm" variant="flat" classNames={{ base: "min-h-[32px]" }}>
                        {spell.school}
                    </Chip>
                    <Chip
                        size="sm"
                        variant="flat"
                        color="secondary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {spell.type}
                    </Chip>
                    {spell.concentration && (
                        <Chip
                            size="sm"
                            variant="flat"
                            color="warning"
                            classNames={{ base: "min-h-[32px]" }}
                        >
                            Concentration
                        </Chip>
                    )}
                    {spell.overclockable && (
                        <Chip
                            size="sm"
                            variant="flat"
                            color="success"
                            classNames={{ base: "min-h-[32px]" }}
                        >
                            Overclockable
                        </Chip>
                    )}
                </div>
            </CardHeader>

            <CardBody className="gap-3 sm:gap-4 pt-2 p-3 sm:p-4">
                {/* Casting Details */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Casting Details
                    </SecondaryText>
                    <StatRow>
                        <Stat label="Casting Time" value={spell.castingTime} />
                        <Stat label="Range" value={spell.range} />
                        <Stat label="Duration" value={spell.duration} />
                    </StatRow>
                    <StatRow>
                        <Stat label="Components" value={componentDetails} />
                    </StatRow>
                </div>

                <Divider />

                {/* Aether Costs */}
                {(spell.aetherCost !== undefined ||
                    spell.heatGenerated !== undefined ||
                    spell.overclockable) && (
                    <>
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Aether Costs
                            </SecondaryText>
                            <StatRow>
                                {spell.aetherCost !== undefined && (
                                    <PrimaryStat
                                        label="Aether Cost"
                                        value={`${spell.aetherCost} AFP`}
                                    />
                                )}
                                {spell.heatGenerated !== undefined && spell.heatGenerated > 0 && (
                                    <DangerStat
                                        label="Heat Generated"
                                        value={spell.heatGenerated}
                                    />
                                )}
                            </StatRow>
                            {spell.overclockable && (
                                <TertiaryText className="text-xs sm:text-sm">
                                    This spell can be overclocked for enhanced effects
                                </TertiaryText>
                            )}
                        </div>
                        <Divider />
                    </>
                )}

                {/* Description */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Effect
                    </SecondaryText>
                    <Description className="text-sm sm:text-base leading-relaxed break-words">
                        {spell.description}
                    </Description>
                </div>

                {/* Higher Levels */}
                {spell.higherLevels && (
                    <div>
                        <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                            At Higher Levels
                        </SecondaryText>
                        <Description className="text-sm sm:text-base leading-relaxed break-words">
                            {spell.higherLevels}
                        </Description>
                    </div>
                )}

                <Divider />

                {/* Classes */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Available To
                    </SecondaryText>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {spell.classes.map((classType) => (
                            <Link
                                key={classType}
                                to={buildReferencePath(getClassReferenceTarget(classType))}
                                className="inline-flex"
                            >
                                <Chip
                                    size="sm"
                                    variant="bordered"
                                    classNames={{ base: "min-h-[32px]" }}
                                >
                                    {classType}
                                </Chip>
                            </Link>
                        ))}
                    </div>
                </div>

                {relatedSpells.length > 0 && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Related Spells
                            </SecondaryText>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {relatedSpells.map((related) => (
                                    <Link
                                        key={related.name}
                                        to={buildReferencePath(getSpellReferenceTarget(related))}
                                        className="inline-flex"
                                    >
                                        <Chip
                                            size="sm"
                                            variant="bordered"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {related.hollowgearName || related.name}
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
