import { AbilityScoreSelector } from "@/components/ability-score-selector";
import { CharacterBuilderSummary } from "@/components/character-builder-summary";
import { ClassLevelConfigurator } from "@/components/class-level-configurator";
import { CLASSES, SPECIES } from "@/data";
import { CharacterBuilder } from "@/model/character-builder";
import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import type { AbilityScores, ClassConfiguration, ClassType, SpeciesType } from "@/types";
import { Button, Card, CardBody, CardHeader, Chip, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type BuilderStep =
    | "basics"
    | "species"
    | "class"
    | "class-configuration"
    | "abilities"
    | "background"
    | "review";

export function CharacterBuilderPage() {
    const navigate = useNavigate();
    const { createCharacter } = useCharacterViewModelContext();

    const [step, setStep] = useState<BuilderStep>("basics");
    const [name, setName] = useState("");
    const [species, setSpecies] = useState<SpeciesType | "">("");
    const [classType, setClassType] = useState<ClassType | "">("");
    const [classConfiguration, setClassConfiguration] = useState<Partial<ClassConfiguration>>({});
    const [isConfigurationValid, setIsConfigurationValid] = useState(false);
    const [abilityScores, setAbilityScores] = useState<AbilityScores>({
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    });
    const [background, setBackground] = useState("");
    const [error, setError] = useState<string | null>(null);

    const steps: { key: BuilderStep; label: string }[] = [
        { key: "basics", label: "Basics" },
        { key: "species", label: "Species" },
        { key: "class", label: "Class" },
        { key: "class-configuration", label: "Configuration" },
        { key: "abilities", label: "Abilities" },
        { key: "background", label: "Background" },
        { key: "review", label: "Review" },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === step);

    const handleNext = () => {
        setError(null);
        if (currentStepIndex < steps.length - 1) {
            setStep(steps[currentStepIndex + 1]!.key);
        }
    };

    const handleBack = () => {
        setError(null);
        if (currentStepIndex > 0) {
            setStep(steps[currentStepIndex - 1]!.key);
        }
    };

    const handleCreate = () => {
        try {
            const builder = new CharacterBuilder();
            builder
                .setName(name)
                .setSpecies(species as SpeciesType)
                .setClass(classType as ClassType)
                .setAbilityScores(abilityScores)
                .setBackground(background || "Adventurer");

            // Apply class configuration if provided
            if (classConfiguration.classType && classConfiguration.level) {
                builder.setClassConfiguration(classConfiguration as ClassConfiguration);
            }

            const characterId = createCharacter(builder);
            navigate(`/characters/${characterId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create character");
        }
    };

    const canProceed = () => {
        switch (step) {
            case "basics":
                return name.trim().length > 0;
            case "species":
                return species !== "";
            case "class":
                return classType !== "";
            case "class-configuration":
                return isConfigurationValid;
            case "abilities":
                return true; // Always valid
            case "background":
                return true; // Optional
            case "review":
                return true;
            default:
                return false;
        }
    };

    const selectedSpecies = SPECIES.find((s) => s.type === species);
    const selectedClass = CLASSES.find((c) => c.type === classType);

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <div
                style={{
                    display: "grid",
                    gap: "2rem",
                }}
                className="grid-cols-1 lg:grid-cols-[1fr_400px]"
            >
                {/* Main Content */}
                <Card>
                    <CardHeader>
                        <div style={{ width: "100%" }}>
                            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1rem" }}>
                                Create Character
                            </h1>
                            {/* Progress Steps */}
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                {steps.map((s, idx) => (
                                    <Chip
                                        key={s.key}
                                        color={
                                            idx < currentStepIndex
                                                ? "success"
                                                : idx === currentStepIndex
                                                  ? "primary"
                                                  : "default"
                                        }
                                        variant={idx === currentStepIndex ? "solid" : "flat"}
                                        size="sm"
                                    >
                                        {idx + 1}. {s.label}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div style={{ minHeight: "400px", padding: "1rem" }}>
                            {error && (
                                <div
                                    style={{
                                        padding: "1rem",
                                        marginBottom: "1rem",
                                        backgroundColor: "var(--heroui-danger-50)",
                                        borderRadius: "0.5rem",
                                        color: "var(--heroui-danger)",
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            {/* Step: Basics */}
                            {step === "basics" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Character Basics
                                    </h2>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            alignItems: "flex-end",
                                        }}
                                    >
                                        <Input
                                            label="Character Name"
                                            placeholder="Enter your character's name"
                                            value={name}
                                            onValueChange={setName}
                                            size="lg"
                                            isRequired
                                            style={{ flex: 1 }}
                                            endContent={
                                                <Button
                                                    variant="faded"
                                                    onPress={() => {
                                                        const builder = new CharacterBuilder();
                                                        builder.generateName();
                                                        const generatedName = builder.getName();
                                                        if (generatedName) {
                                                            setName(generatedName);
                                                        }
                                                    }}
                                                    size="sm"
                                                >
                                                    Generate
                                                </Button>
                                            }
                                        />
                                    </div>
                                    <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                        Choose a name that fits the steampunk & psionics world of
                                        Hollow Gear, or click Generate for a random name.
                                    </p>
                                </div>
                            )}

                            {/* Step: Species */}
                            {step === "species" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Choose Species
                                    </h2>
                                    <Select
                                        label="Species"
                                        placeholder="Select a species"
                                        selectedKeys={species ? [species] : []}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] as SpeciesType;
                                            setSpecies(selected);
                                        }}
                                        size="lg"
                                        isRequired
                                    >
                                        {SPECIES.map((s) => (
                                            <SelectItem key={s.type}>{s.type}</SelectItem>
                                        ))}
                                    </Select>

                                    {selectedSpecies && (
                                        <Card>
                                            <CardBody>
                                                <h3
                                                    style={{
                                                        fontWeight: 600,
                                                        marginBottom: "0.5rem",
                                                    }}
                                                >
                                                    {selectedSpecies.type}
                                                </h3>
                                                <p
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        marginBottom: "1rem",
                                                    }}
                                                >
                                                    Speed: {selectedSpecies.speed} ft
                                                    {selectedSpecies.swimSpeed &&
                                                        `, Swim: ${selectedSpecies.swimSpeed} ft`}
                                                    {selectedSpecies.climbSpeed &&
                                                        `, Climb: ${selectedSpecies.climbSpeed} ft`}
                                                </p>
                                                <div style={{ marginBottom: "1rem" }}>
                                                    <strong style={{ fontSize: "0.875rem" }}>
                                                        Ability Score Increases:
                                                    </strong>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            gap: "0.5rem",
                                                            marginTop: "0.5rem",
                                                            flexWrap: "wrap",
                                                        }}
                                                    >
                                                        {Object.entries(
                                                            selectedSpecies.abilityScoreIncrease
                                                        ).map(([ability, bonus]) => (
                                                            <Chip
                                                                key={ability}
                                                                size="sm"
                                                                variant="flat"
                                                            >
                                                                {ability
                                                                    .substring(0, 3)
                                                                    .toUpperCase()}{" "}
                                                                +{bonus}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: "0.875rem" }}>
                                                        Traits:
                                                    </strong>
                                                    <ul
                                                        style={{
                                                            marginTop: "0.5rem",
                                                            paddingLeft: "1.5rem",
                                                            fontSize: "0.875rem",
                                                        }}
                                                    >
                                                        {selectedSpecies.traits.map(
                                                            (trait, idx) => (
                                                                <li key={idx}>{trait.name}</li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Step: Class */}
                            {step === "class" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Choose Class
                                    </h2>
                                    <Select
                                        label="Class"
                                        placeholder="Select a class"
                                        selectedKeys={classType ? [classType] : []}
                                        onSelectionChange={(keys) => {
                                            const selected = Array.from(keys)[0] as ClassType;
                                            setClassType(selected);
                                            // Reset configuration when class changes
                                            setClassConfiguration({});
                                            setIsConfigurationValid(false);
                                        }}
                                        size="lg"
                                        isRequired
                                    >
                                        {CLASSES.map((c) => (
                                            <SelectItem key={c.type}>{c.type}</SelectItem>
                                        ))}
                                    </Select>

                                    {selectedClass && (
                                        <Card>
                                            <CardBody>
                                                <h3
                                                    style={{
                                                        fontWeight: 600,
                                                        marginBottom: "0.5rem",
                                                    }}
                                                >
                                                    {selectedClass.type}
                                                </h3>
                                                <p
                                                    style={{
                                                        fontSize: "0.875rem",
                                                        marginBottom: "1rem",
                                                    }}
                                                >
                                                    {selectedClass.description.description}
                                                </p>
                                                <div style={{ marginBottom: "1rem" }}>
                                                    <strong style={{ fontSize: "0.875rem" }}>
                                                        Role:
                                                    </strong>{" "}
                                                    {selectedClass.description.role}
                                                </div>
                                                <div>
                                                    <strong style={{ fontSize: "0.875rem" }}>
                                                        Hit Die:
                                                    </strong>{" "}
                                                    {selectedClass.hitDie}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )}
                                </div>
                            )}

                            {/* Step: Class Configuration */}
                            {step === "class-configuration" && classType && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Configure {classType}
                                    </h2>
                                    <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                        Select your class features, subclass, spells, and other
                                        options for level 1.
                                    </p>
                                    <ClassLevelConfigurator
                                        classType={classType as ClassType}
                                        level={1}
                                        existingConfig={
                                            classConfiguration as ClassConfiguration | undefined
                                        }
                                        onConfigurationChange={(config) => {
                                            setClassConfiguration(config);
                                        }}
                                        onValidationChange={(valid) => {
                                            setIsConfigurationValid(valid);
                                        }}
                                    />
                                </div>
                            )}

                            {/* Step: Abilities */}
                            {step === "abilities" && (
                                <div>
                                    <AbilityScoreSelector
                                        abilityScores={abilityScores}
                                        onAbilityScoresChange={setAbilityScores}
                                        selectedClass={classType || undefined}
                                    />
                                </div>
                            )}

                            {/* Step: Background */}
                            {step === "background" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Background
                                    </h2>
                                    <Input
                                        label="Background"
                                        placeholder="e.g., Guild Mechanist, Street Urchin, Noble"
                                        value={background}
                                        onValueChange={setBackground}
                                        size="lg"
                                    />
                                    <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                        Your character's background provides context for their story
                                        and skills. This is optional.
                                    </p>
                                </div>
                            )}

                            {/* Step: Review */}
                            {step === "review" && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Review Character
                                    </h2>
                                    <Card>
                                        <CardBody>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "1rem",
                                                }}
                                            >
                                                <div>
                                                    <strong>Name:</strong> {name}
                                                </div>
                                                <div>
                                                    <strong>Species:</strong> {species}
                                                </div>
                                                <div>
                                                    <strong>Class:</strong> {classType} (Level 1)
                                                </div>
                                                {classConfiguration.subclass && (
                                                    <div>
                                                        <strong>Subclass:</strong>{" "}
                                                        {classConfiguration.subclass}
                                                    </div>
                                                )}
                                                <div>
                                                    <strong>Background:</strong>{" "}
                                                    {background || "Adventurer"}
                                                </div>
                                                <div>
                                                    <strong>Ability Scores:</strong>
                                                    <div
                                                        style={{
                                                            display: "grid",
                                                            gridTemplateColumns: "repeat(3, 1fr)",
                                                            gap: "0.5rem",
                                                            marginTop: "0.5rem",
                                                        }}
                                                    >
                                                        {Object.entries(abilityScores).map(
                                                            ([ability, score]) => (
                                                                <Chip key={ability} size="sm">
                                                                    {ability
                                                                        .substring(0, 3)
                                                                        .toUpperCase()}
                                                                    : {score}
                                                                </Chip>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                                {classConfiguration.spellsSelected &&
                                                    classConfiguration.spellsSelected.length >
                                                        0 && (
                                                        <div>
                                                            <strong>Spells Selected:</strong>{" "}
                                                            {
                                                                classConfiguration.spellsSelected
                                                                    .length
                                                            }{" "}
                                                            spell(s)
                                                        </div>
                                                    )}
                                                {classConfiguration.proficienciesSelected &&
                                                    classConfiguration.proficienciesSelected
                                                        .length > 0 && (
                                                        <div>
                                                            <strong>
                                                                Additional Proficiencies:
                                                            </strong>{" "}
                                                            {classConfiguration.proficienciesSelected.join(
                                                                ", "
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </CardBody>
                                    </Card>
                                    <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                        Starting equipment will be automatically added based on your
                                        class.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Navigation Buttons */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginTop: "2rem",
                                paddingTop: "1rem",
                                borderTop: "1px solid var(--heroui-divider)",
                            }}
                        >
                            <Button
                                variant="flat"
                                onPress={handleBack}
                                isDisabled={currentStepIndex === 0}
                            >
                                Back
                            </Button>
                            {step !== "review" ? (
                                <Button
                                    color="primary"
                                    onPress={handleNext}
                                    isDisabled={!canProceed()}
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button color="success" onPress={handleCreate}>
                                    Create Character
                                </Button>
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* Summary Sidebar - Only visible on large screens */}
                <div className="hidden lg:block">
                    <CharacterBuilderSummary
                        name={name}
                        species={species}
                        classType={classType}
                        classConfiguration={classConfiguration}
                        abilityScores={abilityScores}
                        background={background}
                    />
                </div>
            </div>
        </div>
    );
}
