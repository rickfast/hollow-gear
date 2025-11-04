import { AbilityScores as AbilityScoresComponent } from "@/components/ability-scores";
import { CLASSES, SPECIES } from "@/data";
import type {
    AbilityScores,
    CharacterClass,
    ClassConfiguration,
    ClassType,
    SpeciesType,
} from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

interface CharacterBuilderSummaryProps {
    name: string;
    species: SpeciesType | "";
    classes: CharacterClass[];
    classConfigurations: ClassConfiguration[];
    abilityScores: AbilityScores;
    background: string;
}

export function CharacterBuilderSummary({
    name,
    species,
    classes,
    classConfigurations,
    abilityScores,
    background,
}: CharacterBuilderSummaryProps) {
    const selectedSpecies = SPECIES.find((s) => s.type === species);
    const totalLevel = classes.reduce((sum, c) => sum + c.level, 0);

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

                    {/* Classes */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
                            {classes.length > 1 ? "CLASSES" : "CLASS"}
                        </div>
                        {classes.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                {classes.map((charClass) => {
                                    const classData = CLASSES.find(
                                        (c) => c.type === charClass.class
                                    );
                                    return (
                                        <div key={charClass.class}>
                                            <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                                                {charClass.class} {charClass.level}
                                            </div>
                                            {charClass.subclass && (
                                                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                                    {charClass.subclass}
                                                </div>
                                            )}
                                            {classData && (
                                                <div
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        opacity: 0.8,
                                                        marginTop: "0.25rem",
                                                    }}
                                                >
                                                    Hit Die: {classData.hitDie}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                {totalLevel > 0 && (
                                    <div
                                        style={{
                                            fontSize: "0.875rem",
                                            opacity: 0.8,
                                            marginTop: "0.25rem",
                                            fontWeight: 600,
                                        }}
                                    >
                                        Total Level: {totalLevel}
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
                        <AbilityScoresComponent
                            abilityScores={{
                                strength: {
                                    score: finalAbilityScores.strength,
                                    modifierDisplay: calculateModifier(finalAbilityScores.strength),
                                },
                                dexterity: {
                                    score: finalAbilityScores.dexterity,
                                    modifierDisplay: calculateModifier(
                                        finalAbilityScores.dexterity
                                    ),
                                },
                                constitution: {
                                    score: finalAbilityScores.constitution,
                                    modifierDisplay: calculateModifier(
                                        finalAbilityScores.constitution
                                    ),
                                },
                                intelligence: {
                                    score: finalAbilityScores.intelligence,
                                    modifierDisplay: calculateModifier(
                                        finalAbilityScores.intelligence
                                    ),
                                },
                                wisdom: {
                                    score: finalAbilityScores.wisdom,
                                    modifierDisplay: calculateModifier(finalAbilityScores.wisdom),
                                },
                                charisma: {
                                    score: finalAbilityScores.charisma,
                                    modifierDisplay: calculateModifier(finalAbilityScores.charisma),
                                },
                            }}
                            compact
                        />
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
                    {classConfigurations.some(
                        (c) => c.spellsSelected && c.spellsSelected.length > 0
                    ) && (
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
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.25rem",
                                    }}
                                >
                                    {Array.from(
                                        new Set(
                                            classConfigurations.flatMap(
                                                (c) => c.spellsSelected || []
                                            )
                                        )
                                    ).map((spell) => (
                                        <Chip key={spell} size="sm" variant="flat">
                                            {spell}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Proficiencies */}
                    {classConfigurations.some(
                        (c) => c.proficienciesSelected && c.proficienciesSelected.length > 0
                    ) && (
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
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.25rem",
                                    }}
                                >
                                    {Array.from(
                                        new Set(
                                            classConfigurations.flatMap(
                                                (c) => c.proficienciesSelected || []
                                            )
                                        )
                                    ).map((prof) => (
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
