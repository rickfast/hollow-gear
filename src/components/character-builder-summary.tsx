import { CLASSES, SPECIES } from "@/data";
import type { AbilityScores, ClassConfiguration, ClassType, SpeciesType } from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

interface CharacterBuilderSummaryProps {
    name: string;
    species: SpeciesType | "";
    classType: ClassType | "";
    classConfiguration: Partial<ClassConfiguration>;
    abilityScores: AbilityScores;
    background: string;
}

export function CharacterBuilderSummary({
    name,
    species,
    classType,
    classConfiguration,
    abilityScores,
    background,
}: CharacterBuilderSummaryProps) {
    const selectedSpecies = SPECIES.find((s) => s.type === species);
    const selectedClass = CLASSES.find((c) => c.type === classType);

    // Calculate final ability scores with species bonuses
    const finalAbilityScores = { ...abilityScores };
    if (selectedSpecies) {
        Object.entries(selectedSpecies.abilityScoreIncrease).forEach(([ability, bonus]) => {
            finalAbilityScores[ability as keyof AbilityScores] += bonus;
        });
    }

    const calculateModifier = (score: number) => {
        const mod = Math.floor((score - 10) / 2);
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Character Summary</h3>
            </CardHeader>
            <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Name */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
                            NAME
                        </div>
                        <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                            {name || <span style={{ opacity: 0.4 }}>Not set</span>}
                        </div>
                    </div>

                    <Divider />

                    {/* Species */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
                            SPECIES
                        </div>
                        {species ? (
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
                                    {species}
                                </div>
                                {selectedSpecies && (
                                    <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                        Speed: {selectedSpecies.speed} ft
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span style={{ opacity: 0.4 }}>Not selected</span>
                        )}
                    </div>

                    <Divider />

                    {/* Class */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
                            CLASS
                        </div>
                        {classType ? (
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                                    {classType} 1
                                </div>
                                {classConfiguration.subclass && (
                                    <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                        {classConfiguration.subclass}
                                    </div>
                                )}
                                {selectedClass && (
                                    <div
                                        style={{
                                            fontSize: "0.875rem",
                                            opacity: 0.8,
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        Hit Die: {selectedClass.hitDie}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <span style={{ opacity: 0.4 }}>Not selected</span>
                        )}
                    </div>

                    <Divider />

                    {/* Ability Scores */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.5rem" }}>
                            ABILITY SCORES
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: "0.5rem",
                            }}
                        >
                            {(
                                [
                                    "strength",
                                    "dexterity",
                                    "constitution",
                                    "intelligence",
                                    "wisdom",
                                    "charisma",
                                ] as const
                            ).map((ability) => {
                                const base = abilityScores[ability];
                                const final = finalAbilityScores[ability];
                                const hasBonus = base !== final;

                                return (
                                    <div
                                        key={ability}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            fontSize: "0.875rem",
                                        }}
                                    >
                                        <span style={{ textTransform: "uppercase", fontSize: "0.75rem" }}>
                                            {ability.substring(0, 3)}
                                        </span>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                                            {hasBonus && (
                                                <span style={{ opacity: 0.5, textDecoration: "line-through" }}>
                                                    {base}
                                                </span>
                                            )}
                                            <span style={{ fontWeight: 600 }}>
                                                {final} ({calculateModifier(final)})
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedSpecies && (
                            <div style={{ fontSize: "0.75rem", opacity: 0.6, marginTop: "0.5rem" }}>
                                Includes species bonuses
                            </div>
                        )}
                    </div>

                    {/* Background */}
                    {background && (
                        <>
                            <Divider />
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.6,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    BACKGROUND
                                </div>
                                <div style={{ fontWeight: 600 }}>{background}</div>
                            </div>
                        </>
                    )}

                    {/* Spells */}
                    {classConfiguration.spellsSelected &&
                        classConfiguration.spellsSelected.length > 0 && (
                            <>
                                <Divider />
                                <div>
                                    <div
                                        style={{
                                            fontSize: "0.75rem",
                                            opacity: 0.6,
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        SPELLS
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                                        {classConfiguration.spellsSelected.map((spell) => (
                                            <Chip key={spell} size="sm" variant="flat">
                                                {spell}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                    {/* Proficiencies */}
                    {classConfiguration.proficienciesSelected &&
                        classConfiguration.proficienciesSelected.length > 0 && (
                            <>
                                <Divider />
                                <div>
                                    <div
                                        style={{
                                            fontSize: "0.75rem",
                                            opacity: 0.6,
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        SKILL PROFICIENCIES
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                                        {classConfiguration.proficienciesSelected.map((prof) => (
                                            <Chip key={prof} size="sm" variant="flat">
                                                {prof}
                                            </Chip>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                </div>
            </CardBody>
        </Card>
    );
}
