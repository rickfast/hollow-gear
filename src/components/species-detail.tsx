import { SPECIES } from "@/data/species";
import type { Species } from "@/types";
import { buildReferencePath, getSpeciesReferenceTarget } from "@/utils/reference-links";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import { CardTitle, Description, SecondaryText, Stat, StatRow, TertiaryText } from "./typography";
import { getAvatarForSpecies } from "@/utils/avatar";

interface SpeciesDetailProps {
    species: Species;
}

/**
 * Displays comprehensive species information for the reference page
 * Shows species name, ability score increases, movement speeds, traits, and languages
 */
export function SpeciesDetail({ species }: SpeciesDetailProps) {
    // Format ability score increases
    const formatAbilityScoreIncrease = (): string => {
        const increases: string[] = [];
        const { abilityScoreIncrease } = species;

        if (abilityScoreIncrease.strength) {
            increases.push(`STR +${abilityScoreIncrease.strength}`);
        }
        if (abilityScoreIncrease.dexterity) {
            increases.push(`DEX +${abilityScoreIncrease.dexterity}`);
        }
        if (abilityScoreIncrease.constitution) {
            increases.push(`CON +${abilityScoreIncrease.constitution}`);
        }
        if (abilityScoreIncrease.intelligence) {
            increases.push(`INT +${abilityScoreIncrease.intelligence}`);
        }
        if (abilityScoreIncrease.wisdom) {
            increases.push(`WIS +${abilityScoreIncrease.wisdom}`);
        }
        if (abilityScoreIncrease.charisma) {
            increases.push(`CHA +${abilityScoreIncrease.charisma}`);
        }

        return increases.join(", ");
    };

    // Format uses per rest
    const formatUsesPerRest = (amount: number, restType: string): string => {
        return `${amount}/${restType} rest`;
    };

    const abilityKeys = Object.keys(species.abilityScoreIncrease) as Array<
        keyof typeof species.abilityScoreIncrease
    >;
    const primaryAbilities = abilityKeys.filter(
        (ability) => (species.abilityScoreIncrease[ability] ?? 0) > 0
    );

    const relatedSpecies = SPECIES.filter(
        (other) =>
            other.type !== species.type &&
            primaryAbilities.some((ability) => (other.abilityScoreIncrease[ability] ?? 0) > 0)
    )
        .sort((a, b) => a.type.localeCompare(b.type))
        .slice(0, 6);

    const avatarUrl = getAvatarForSpecies(species.type);

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-2 pb-2 p-3 sm:p-4">
                <div className="flex w-full gap-3">
                    {avatarUrl && (
                        <img
                            src={avatarUrl}
                            alt={`${species.type} avatar`}
                            className="w-16 h-16 rounded-lg object-cover border border-default-300 shadow-sm hidden sm:block"
                            loading="lazy"
                        />
                    )}
                    <div className="flex-1">
                        <CardTitle className="text-base sm:text-lg break-words">
                            {species.type}
                        </CardTitle>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {formatAbilityScoreIncrease()}
                    </Chip>
                </div>
            </CardHeader>

            <CardBody className="gap-3 sm:gap-4 pt-2 p-3 sm:p-4">
                {/* Movement Speeds */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Movement
                    </SecondaryText>
                    <StatRow>
                        <Stat label="Base Speed" value={`${species.speed} ft`} />
                        {species.swimSpeed && (
                            <Stat label="Swim Speed" value={`${species.swimSpeed} ft`} />
                        )}
                        {species.climbSpeed && (
                            <Stat label="Climb Speed" value={`${species.climbSpeed} ft`} />
                        )}
                    </StatRow>
                </div>

                <Divider />

                {/* Racial Traits */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Racial Traits
                    </SecondaryText>
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {species.traits.map((trait, index) => (
                            <div key={index} className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <TertiaryText className="font-semibold text-sm sm:text-base break-words">
                                        {trait.name}
                                    </TertiaryText>
                                    {trait.usesPerRest && (
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color="success"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {formatUsesPerRest(
                                                trait.usesPerRest.amount,
                                                trait.usesPerRest.restType
                                            )}
                                        </Chip>
                                    )}
                                </div>
                                <Description className="text-sm sm:text-base leading-relaxed break-words">
                                    {trait.description}
                                </Description>
                            </div>
                        ))}
                    </div>
                </div>

                <Divider />

                {/* Languages */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Languages
                    </SecondaryText>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {species.languages.map((language) => (
                            <Chip
                                key={language}
                                size="sm"
                                variant="bordered"
                                classNames={{ base: "min-h-[32px]" }}
                            >
                                {language}
                            </Chip>
                        ))}
                    </div>
                </div>

                {relatedSpecies.length > 0 && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Related Species
                            </SecondaryText>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {relatedSpecies.map((other) => (
                                    <Link
                                        key={other.type}
                                        to={buildReferencePath(
                                            getSpeciesReferenceTarget(other.type)
                                        )}
                                        className="inline-flex"
                                    >
                                        <Chip
                                            size="sm"
                                            variant="bordered"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {other.type}
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
