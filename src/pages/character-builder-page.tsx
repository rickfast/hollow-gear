import { AbilityScoreSelector } from "@/components/ability-score-selector";
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation";
import { CharacterBuilderSummary } from "@/components/character-builder-summary";
import { ClassLevelConfigurator } from "@/components/class-level-configurator";
import { ClassSelector } from "@/components/class-selector";
import { PortraitSelector } from "@/components/portrait-selector";
import { SPECIES } from "@/data";
import { CharacterBuilder } from "@/model/character-builder";
import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import { CharacterStorageService } from "@/service/character-storage-service";
import type {
    AbilityScores,
    CharacterClass,
    ClassConfiguration,
    ClassType,
    SpeciesType,
} from "@/types";
import { Button, Card, CardBody, CardHeader, Chip, Input, Select, SelectItem } from "@heroui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

type BuilderStep =
    | "basics"
    | "species"
    | "class"
    | "class-configuration"
    | "abilities"
    | "portrait"
    | "background"
    | "review";

type BuilderMode = "create" | "edit";

export function CharacterBuilderPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { createCharacter, getCharacter, updateCharacter } = useCharacterViewModelContext();

    // Determine mode based on route parameters
    const mode: BuilderMode = id ? "edit" : "create";
    const isEditMode = mode === "edit";

    const [step, setStep] = useState<BuilderStep>("basics");
    const [name, setName] = useState("");
    const [species, setSpecies] = useState<SpeciesType | "">("");
    const [startingLevel, setStartingLevel] = useState(1); // New: starting level selection
    const [classes, setClasses] = useState<CharacterClass[]>([]);
    const [classConfigurations, setClassConfigurations] = useState<ClassConfiguration[]>([]);
    const [pendingLevels, setPendingLevels] = useState<
        Array<{ classType: ClassType; level: number }>
    >([]);
    const [abilityScores, setAbilityScores] = useState<AbilityScores>({
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    });
    const [abilityScoresLocked, setAbilityScoresLocked] = useState(false);
    const [background, setBackground] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<Set<BuilderStep>>(new Set());
    const [incompleteSteps, setIncompleteSteps] = useState<Set<BuilderStep>>(new Set());
    const [originalCharacterId, setOriginalCharacterId] = useState<string | undefined>(undefined);

    // Load existing character data in edit mode
    useEffect(() => {
        if (isEditMode && id) {
            try {
                const viewModel = getCharacter(id);
                const character = viewModel.toCharacter();
                
                // Initialize state from loaded character
                setName(character.name);
                setSpecies(character.species);
                setClasses(character.classes.map(c => ({ ...c })));
                setAbilityScores({ ...character.abilityScores });
                setAbilityScoresLocked(true); // Lock ability scores in edit mode
                setBackground(character.background || "");
                setAvatarUrl(character.avatarUrl || "");
                setOriginalCharacterId(character.id);
                
                // Load existing class configurations if available
                if (character.classConfigurations) {
                    setClassConfigurations(character.classConfigurations.map(c => ({ ...c })));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load character");
                console.error("Failed to load character for editing:", err);
            }
        }
    }, [isEditMode, id, getCharacter]);

    const steps: { key: BuilderStep; label: string }[] = [
        { key: "basics", label: "Basics" },
        { key: "species", label: "Species" },
        { key: "class", label: "Class" },
        { key: "class-configuration", label: "Configuration" },
        { key: "abilities", label: "Abilities" },
        { key: "portrait", label: "Portrait" },
        { key: "background", label: "Background" },
        { key: "review", label: "Review" },
    ];

    const currentStepIndex = steps.findIndex((s) => s.key === step);

    // Validation function for each step
    const validateStep = (stepKey: BuilderStep): boolean => {
        switch (stepKey) {
            case "basics":
                return name.trim().length > 0;
            case "species":
                return species !== "";
            case "class":
                return classes.length > 0;
            case "class-configuration":
                // Check if all pending levels have configurations
                return pendingLevels.every((pending) =>
                    classConfigurations.some(
                        (config) =>
                            config.classType === pending.classType && config.level === pending.level
                    )
                );
            case "abilities":
                return true; // Always valid
            case "portrait":
                return avatarUrl !== ""; // Must select a portrait
            case "background":
                return true; // Optional
            case "review":
                return true;
            default:
                return false;
        }
    };

    // Update completion status whenever relevant state changes
    useEffect(() => {
        const newCompletedSteps = new Set<BuilderStep>();
        const newIncompleteSteps = new Set<BuilderStep>();

        steps.forEach((s) => {
            // Skip the current step and steps that haven't been visited
            if (s.key === step) {
                return;
            }

            const isValid = validateStep(s.key);
            
            // Determine if step has been visited (has some data)
            const hasBeenVisited = (() => {
                switch (s.key) {
                    case "basics":
                        return name.trim().length > 0;
                    case "species":
                        return species !== "";
                    case "class":
                        return classes.length > 0;
                    case "class-configuration":
                        return classConfigurations.length > 0 || pendingLevels.length > 0;
                    case "abilities":
                        return Object.values(abilityScores).some((score) => score !== 10);
                    case "portrait":
                        return avatarUrl !== "";
                    case "background":
                        return background.trim().length > 0;
                    case "review":
                        return false; // Review is never marked as visited until complete
                    default:
                        return false;
                }
            })();

            if (hasBeenVisited) {
                if (isValid) {
                    newCompletedSteps.add(s.key);
                } else {
                    newIncompleteSteps.add(s.key);
                }
            }
        });

        setCompletedSteps(newCompletedSteps);
        setIncompleteSteps(newIncompleteSteps);
    }, [name, species, classes, classConfigurations, pendingLevels, abilityScores, avatarUrl, background, step]);

    const handleStepClick = (stepKey: BuilderStep) => {
        setError(null);
        setStep(stepKey);
    };

    const handleClassAdd = (classType: ClassType, levels: number) => {
        try {
            // In create mode, use the starting level if this is the first class
            const actualLevels = !isEditMode && classes.length === 0 ? startingLevel : levels;
            
            // Add new class to the list
            const newClass: CharacterClass = {
                class: classType,
                level: actualLevels,
            };
            setClasses((prev) => [...prev, newClass]);

            // Add pending levels for configuration
            const levelsToConfig: Array<{ classType: ClassType; level: number }> = [];
            for (let i = 1; i <= actualLevels; i++) {
                levelsToConfig.push({ classType, level: i });
            }
            setPendingLevels((prev) => [...prev, ...levelsToConfig]);

            // Move to configuration step
            setStep("class-configuration");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add class");
        }
    };

    const handleClassLevelChange = (classType: ClassType, additionalLevels: number) => {
        try {
            // Update the class level
            setClasses((prev) =>
                prev.map((c) =>
                    c.class === classType ? { ...c, level: c.level + additionalLevels } : c
                )
            );

            // Add pending levels for configuration
            const currentClass = classes.find((c) => c.class === classType);
            if (currentClass) {
                const levelsToConfig: Array<{ classType: ClassType; level: number }> = [];
                for (let i = 1; i <= additionalLevels; i++) {
                    levelsToConfig.push({ classType, level: currentClass.level + i });
                }
                setPendingLevels((prev) => [...prev, ...levelsToConfig]);

                // Move to configuration step
                setStep("class-configuration");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add levels");
        }
    };

    const handleClassRemove = (classType: ClassType) => {
        // Remove class from list (only if not the only class)
        if (classes.length > 1) {
            setClasses((prev) => prev.filter((c) => c.class !== classType));
            // Remove associated configurations
            setClassConfigurations((prev) => prev.filter((c) => c.classType !== classType));
        }
    };

    // Check if all required steps are complete
    const canSaveCharacter = (): { valid: boolean; errors: string[] } => {
        const errors: string[] = [];
        
        if (!validateStep("basics")) {
            errors.push("Character name is required");
        }
        if (!validateStep("species")) {
            errors.push("Species selection is required");
        }
        if (!validateStep("class")) {
            errors.push("At least one class is required");
        }
        if (!validateStep("class-configuration")) {
            errors.push("All class levels must be configured");
        }
        if (!validateStep("portrait")) {
            errors.push("Portrait selection is required");
        }
        
        return {
            valid: errors.length === 0,
            errors
        };
    };

    // Navigate to the first incomplete step
    const navigateToFirstIncompleteStep = () => {
        for (const stepInfo of steps) {
            if (!validateStep(stepInfo.key)) {
                setStep(stepInfo.key);
                return stepInfo.key;
            }
        }
        return null;
    };

    const handleSave = () => {
        try {
            const validation = canSaveCharacter();
            
            if (!validation.valid) {
                // Navigate to first incomplete step
                navigateToFirstIncompleteStep();
                
                // Show error with all incomplete requirements
                const errorMessage = `Cannot save character. Please complete the following:\n${validation.errors.map(e => `• ${e}`).join('\n')}`;
                setError(errorMessage);
                return;
            }

            let builder: CharacterBuilder;
            let characterId: string;

            if (isEditMode && originalCharacterId) {
                // Edit mode: load existing character and update
                const viewModel = getCharacter(originalCharacterId);
                const existingCharacter = viewModel.toCharacter();
                
                // Update character using context method
                updateCharacter(
                    originalCharacterId,
                    (vm) => {
                        builder = CharacterBuilder.fromCharacter(vm.toCharacter());
                        
                        // Update modifiable fields
                        builder
                            .setName(name)
                            .setClasses(classes)
                            .setAvatarUrl(avatarUrl)
                            .setBackground(background || "Adventurer");

                        // Apply class configurations if provided
                        if (classConfigurations.length > 0) {
                            builder.setClassConfigurations(classConfigurations);
                        }

                        return builder.build();
                    },
                    generateVersionDescription(existingCharacter, {
                        name,
                        classes,
                        background: background || "Adventurer",
                    } as any)
                );
                
                characterId = originalCharacterId;
            } else {
                // Create mode: build new character
                builder = new CharacterBuilder();
                builder
                    .setName(name)
                    .setSpecies(species as SpeciesType)
                    .setClasses(classes)
                    .setAbilityScores(abilityScores)
                    .setAvatarUrl(avatarUrl)
                    .setBackground(background || "Adventurer");

                // Apply class configurations if provided
                if (classConfigurations.length > 0) {
                    builder.setClassConfigurations(classConfigurations);
                }

                characterId = createCharacter(builder);
            }

            navigate(`/characters/${characterId}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} character`);
        }
    };

    const handleCancel = () => {
        if (isEditMode && originalCharacterId) {
            // Discard changes and return to character sheet
            navigate(`/characters/${originalCharacterId}`);
        } else {
            // Return to character list
            navigate('/');
        }
    };

    // Generate a description for the version based on changes
    const generateVersionDescription = (oldChar: any, newChar: any): string => {
        const changes: string[] = [];
        
        if (oldChar.name !== newChar.name) {
            changes.push(`renamed to "${newChar.name}"`);
        }
        
        if (oldChar.classes.length !== newChar.classes.length) {
            changes.push("added class");
        } else {
            for (let i = 0; i < oldChar.classes.length; i++) {
                if (oldChar.classes[i].level !== newChar.classes[i].level) {
                    changes.push(`leveled up ${newChar.classes[i].class}`);
                }
            }
        }
        
        if (oldChar.background !== newChar.background) {
            changes.push("updated background");
        }
        
        if (changes.length === 0) {
            return "Character updated";
        }
        
        return changes.join(", ");
    };

    const selectedSpecies = SPECIES.find((s) => s.type === species);

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
                                {isEditMode ? "Edit Character" : "Create Character"}
                            </h1>
                            {/* Breadcrumb Navigation */}
                            <BreadcrumbNavigation<BuilderStep>
                                steps={steps}
                                currentStep={step}
                                completedSteps={completedSteps}
                                incompleteSteps={incompleteSteps}
                                onStepClick={handleStepClick}
                            />
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
                                        whiteSpace: "pre-line",
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

                                    {/* Starting Level Selector - Only in create mode */}
                                    {!isEditMode && (
                                        <>
                                            <Select
                                                label="Starting Level"
                                                placeholder="Select starting level"
                                                selectedKeys={[startingLevel.toString()]}
                                                onSelectionChange={(keys) => {
                                                    const selected = Array.from(keys)[0] as string;
                                                    setStartingLevel(parseInt(selected));
                                                }}
                                                size="lg"
                                                description="Choose the level your character starts at (1-20)"
                                            >
                                                {Array.from({ length: 20 }, (_, i) => i + 1).map((level) => (
                                                    <SelectItem key={level.toString()}>
                                                        Level {level}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            {startingLevel > 1 && (
                                                <div
                                                    style={{
                                                        padding: "1rem",
                                                        backgroundColor: "var(--heroui-primary-50)",
                                                        borderRadius: "0.5rem",
                                                        borderLeft: "4px solid var(--heroui-primary)",
                                                    }}
                                                >
                                                    <p style={{ fontSize: "0.875rem" }}>
                                                        Starting at level {startingLevel} will require you to configure all levels from 1 to {startingLevel} during class selection. 
                                                        Your character will receive all class features, ability score improvements, and benefits for these levels.
                                                    </p>
                                                </div>
                                            )}
                                        </>
                                    )}
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
                                <ClassSelector
                                    currentClasses={classes}
                                    abilityScores={abilityScores}
                                    onClassAdd={handleClassAdd}
                                    onClassLevelChange={handleClassLevelChange}
                                    onClassRemove={handleClassRemove}
                                    isEditMode={isEditMode}
                                />
                            )}

                            {/* Step: Class Configuration */}
                            {step === "class-configuration" && pendingLevels.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "1.5rem",
                                    }}
                                >
                                    <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                        Configure Class Levels
                                    </h2>
                                    <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>
                                        Configure each level for your class(es). Select features,
                                        subclass, spells, and other options.
                                    </p>

                                    {/* Group pending levels by class */}
                                    {Array.from(
                                        new Set(pendingLevels.map((p) => p.classType))
                                    ).map((classType) => {
                                        const levelsForClass = pendingLevels
                                            .filter((p) => p.classType === classType)
                                            .map((p) => p.level)
                                            .sort((a, b) => a - b);

                                        return (
                                            <div
                                                key={classType}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "1rem",
                                                }}
                                            >
                                                <h3
                                                    style={{
                                                        fontSize: "1.25rem",
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {classType}
                                                </h3>

                                                {levelsForClass.map((level) => {
                                                    const existingConfig =
                                                        classConfigurations.find(
                                                            (c) =>
                                                                c.classType === classType &&
                                                                c.level === level
                                                        );

                                                    return (
                                                        <Card key={`${classType}-${level}`}>
                                                            <CardHeader>
                                                                <h4
                                                                    style={{
                                                                        fontWeight: 600,
                                                                    }}
                                                                >
                                                                    Level {level}
                                                                </h4>
                                                            </CardHeader>
                                                            <CardBody>
                                                                <ClassLevelConfigurator
                                                                    classType={classType}
                                                                    level={level}
                                                                    existingConfig={
                                                                        existingConfig
                                                                    }
                                                                    onConfigurationChange={(
                                                                        config
                                                                    ) => {
                                                                        // Only add if config is complete
                                                                        if (
                                                                            config.classType &&
                                                                            config.level
                                                                        ) {
                                                                            setClassConfigurations(
                                                                                (prev) => {
                                                                                    // Remove existing config for this class/level
                                                                                    const filtered =
                                                                                        prev.filter(
                                                                                            (c) =>
                                                                                                !(
                                                                                                    c.classType ===
                                                                                                        classType &&
                                                                                                    c.level ===
                                                                                                        level
                                                                                                )
                                                                                        );
                                                                                    // Add new config
                                                                                    return [
                                                                                        ...filtered,
                                                                                        config as ClassConfiguration,
                                                                                    ];
                                                                                }
                                                                            );
                                                                        }
                                                                    }}
                                                                    onValidationChange={() => {
                                                                        // Validation handled by canProceed
                                                                    }}
                                                                />
                                                            </CardBody>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Step: Abilities */}
                            {step === "abilities" && (
                                <div>
                                    {abilityScoresLocked ? (
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "1.5rem",
                                            }}
                                        >
                                            <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
                                                Ability Scores
                                            </h2>
                                            <div
                                                style={{
                                                    padding: "1rem",
                                                    backgroundColor: "var(--heroui-default-100)",
                                                    borderRadius: "0.5rem",
                                                    borderLeft: "4px solid var(--heroui-primary)",
                                                }}
                                            >
                                                <p style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
                                                    Ability scores cannot be modified after initial character creation.
                                                </p>
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(3, 1fr)",
                                                        gap: "0.5rem",
                                                    }}
                                                >
                                                    {Object.entries(abilityScores).map(
                                                        ([ability, score]) => (
                                                            <Chip key={ability} size="lg" variant="flat">
                                                                {ability
                                                                    .substring(0, 3)
                                                                    .toUpperCase()}
                                                                : {score}
                                                            </Chip>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <AbilityScoreSelector
                                            abilityScores={abilityScores}
                                            onAbilityScoresChange={setAbilityScores}
                                            selectedClass={classes[0]?.class}
                                        />
                                    )}
                                </div>
                            )}

                            {/* Step: Portrait */}
                            {step === "portrait" && (
                                <div>
                                    <PortraitSelector
                                        selectedPortrait={avatarUrl}
                                        onPortraitChange={setAvatarUrl}
                                        speciesFilter={species || undefined}
                                        classFilter={undefined}
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

                                    {/* Show incomplete requirements if any */}
                                    {(() => {
                                        const validation = canSaveCharacter();
                                        if (!validation.valid) {
                                            return (
                                                <Card>
                                                    <CardBody>
                                                        <div
                                                            style={{
                                                                padding: "1rem",
                                                                backgroundColor: "var(--heroui-warning-50)",
                                                                borderRadius: "0.5rem",
                                                                borderLeft: "4px solid var(--heroui-warning)",
                                                            }}
                                                        >
                                                            <h3
                                                                style={{
                                                                    fontWeight: 600,
                                                                    marginBottom: "0.5rem",
                                                                    color: "var(--heroui-warning-700)",
                                                                }}
                                                            >
                                                                Incomplete Requirements
                                                            </h3>
                                                            <p
                                                                style={{
                                                                    fontSize: "0.875rem",
                                                                    marginBottom: "0.75rem",
                                                                    color: "var(--heroui-warning-700)",
                                                                }}
                                                            >
                                                                Please complete the following before creating your character:
                                                            </p>
                                                            <ul
                                                                style={{
                                                                    listStyle: "disc",
                                                                    paddingLeft: "1.5rem",
                                                                    fontSize: "0.875rem",
                                                                    color: "var(--heroui-warning-700)",
                                                                }}
                                                            >
                                                                {validation.errors.map((error, idx) => (
                                                                    <li key={idx}>{error}</li>
                                                                ))}
                                                            </ul>
                                                            <Button
                                                                color="warning"
                                                                variant="flat"
                                                                size="sm"
                                                                onPress={() => {
                                                                    navigateToFirstIncompleteStep();
                                                                }}
                                                                style={{ marginTop: "1rem" }}
                                                            >
                                                                Go to First Incomplete Step
                                                            </Button>
                                                        </div>
                                                    </CardBody>
                                                </Card>
                                            );
                                        }
                                        return null;
                                    })()}

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
                                                    <strong>Classes:</strong>
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "0.5rem",
                                                            marginTop: "0.5rem",
                                                        }}
                                                    >
                                                        {classes.map((c) => (
                                                            <Chip
                                                                key={c.class}
                                                                size="sm"
                                                                variant="flat"
                                                            >
                                                                {c.class} {c.level}
                                                                {c.subclass &&
                                                                    ` (${c.subclass})`}
                                                            </Chip>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <strong>Total Level:</strong>{" "}
                                                    {classes.reduce(
                                                        (sum, c) => sum + c.level,
                                                        0
                                                    )}
                                                </div>
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
                                                {classConfigurations.some(
                                                    (c) =>
                                                        c.spellsSelected &&
                                                        c.spellsSelected.length > 0
                                                ) && (
                                                    <div>
                                                        <strong>Spells Selected:</strong>{" "}
                                                        {classConfigurations.reduce(
                                                            (sum, c) =>
                                                                sum +
                                                                (c.spellsSelected?.length || 0),
                                                            0
                                                        )}{" "}
                                                        spell(s)
                                                    </div>
                                                )}
                                                {classConfigurations.some(
                                                    (c) =>
                                                        c.proficienciesSelected &&
                                                        c.proficienciesSelected.length > 0
                                                ) && (
                                                    <div>
                                                        <strong>Additional Proficiencies:</strong>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexWrap: "wrap",
                                                                gap: "0.5rem",
                                                                marginTop: "0.5rem",
                                                            }}
                                                        >
                                                            {Array.from(
                                                                new Set(
                                                                    classConfigurations.flatMap(
                                                                        (c) =>
                                                                            c.proficienciesSelected ||
                                                                            []
                                                                    )
                                                                )
                                                            ).map((prof) => (
                                                                <Chip
                                                                    key={prof}
                                                                    size="sm"
                                                                    variant="flat"
                                                                >
                                                                    {prof}
                                                                </Chip>
                                                            ))}
                                                        </div>
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
                                onPress={handleCancel}
                            >
                                Cancel
                            </Button>
                            <Button color="success" onPress={handleSave}>
                                {isEditMode ? "Save Changes" : "Create Character"}
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Summary Sidebar - Only visible on large screens */}
                <div className="hidden lg:block">
                    <CharacterBuilderSummary
                        name={name}
                        species={species}
                        classes={classes}
                        classConfigurations={classConfigurations}
                        abilityScores={abilityScores}
                        background={background}
                    />
                </div>
            </div>
        </div>
    );
}
