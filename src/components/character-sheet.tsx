import { Card, CardBody, CardHeader, Avatar, Chip, Tabs, Tab } from "@heroui/react";
import type { Character } from "@/types";

interface CharacterSheetProps {
    character: Character;
}

// Helper function to calculate ability modifier
function getAbilityModifier(score: number): number {
    return Math.floor((score - 10) / 2);
}

// Helper function to format modifier
function formatModifier(modifier: number): string {
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

export function CharacterSheet({ character }: CharacterSheetProps) {
    const primaryClass = character.classes[0];
    const classDisplay = primaryClass
        ? primaryClass.subclass
            ? `${primaryClass.class} (${primaryClass.subclass})`
            : primaryClass.class
        : "Unknown";

    // Calculate ability modifiers
    const abilityMods = {
        strength: getAbilityModifier(character.abilityScores.strength),
        dexterity: getAbilityModifier(character.abilityScores.dexterity),
        constitution: getAbilityModifier(character.abilityScores.constitution),
        intelligence: getAbilityModifier(character.abilityScores.intelligence),
        wisdom: getAbilityModifier(character.abilityScores.wisdom),
        charisma: getAbilityModifier(character.abilityScores.charisma),
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            {/* Header Section */}
            <Card style={{ marginBottom: "1.5rem" }}>
                <CardBody>
                    <div
                        style={{
                            display: "flex",
                            gap: "1.5rem",
                            alignItems: "flex-start",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Avatar */}
                        <Avatar
                            src={character.avatarUrl}
                            name={character.name}
                            size="lg"
                            showFallback
                            style={{ width: "120px", height: "120px", flexShrink: 0 }}
                        />

                        {/* Character Info */}
                        <div style={{ flex: "1", minWidth: "250px" }}>
                            <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
                                {character.name}
                            </h1>
                            <p style={{ fontSize: "1.125rem", margin: "0.5rem 0", opacity: 0.8 }}>
                                Level {character.level} {character.species} {primaryClass?.class}
                            </p>
                            <p style={{ fontSize: "0.875rem", opacity: 0.7 }}>{classDisplay}</p>
                            {character.background && (
                                <Chip size="sm" variant="flat" style={{ marginTop: "0.5rem" }}>
                                    {character.background}
                                </Chip>
                            )}
                        </div>

                        {/* Combat Stats */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                gap: "1rem",
                                minWidth: "250px",
                            }}
                        >
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.7,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    ARMOR CLASS
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                                    {character.armorClass}
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.7,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    INITIATIVE
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                                    {formatModifier(character.initiative)}
                                </div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.7,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    SPEED
                                </div>
                                <div style={{ fontSize: "2rem", fontWeight: 700 }}>
                                    {character.speed}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hit Points */}
                    <div style={{ marginTop: "1.5rem" }}>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                                Hit Points
                            </span>
                            <span style={{ fontSize: "0.875rem" }}>
                                {character.hitPoints.current} / {character.hitPoints.maximum}
                            </span>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                height: "8px",
                                background: "rgba(0,0,0,0.1)",
                                borderRadius: "4px",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    width: `${(character.hitPoints.current / character.hitPoints.maximum) * 100}%`,
                                    height: "100%",
                                    background: "var(--heroui-success)",
                                    transition: "width 0.3s",
                                }}
                            />
                        </div>
                        {character.hitPoints.temporary > 0 && (
                            <div
                                style={{ fontSize: "0.75rem", marginTop: "0.25rem", opacity: 0.7 }}
                            >
                                +{character.hitPoints.temporary} temp HP
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>

            {/* Main Content */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 2fr",
                    gap: "1.5rem",
                    alignItems: "flex-start",
                }}
            >
                {/* Left Column - Ability Scores & Saving Throws */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {/* Ability Scores */}
                    <Card>
                        <CardHeader>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                                Ability Scores
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(2, 1fr)",
                                    gap: "1rem",
                                }}
                            >
                                {(
                                    Object.entries(character.abilityScores) as [
                                        keyof typeof character.abilityScores,
                                        number,
                                    ][]
                                ).map(([ability, score]) => (
                                    <div
                                        key={ability}
                                        style={{
                                            textAlign: "center",
                                            padding: "0.75rem",
                                            border: "2px solid rgba(0,0,0,0.1)",
                                            borderRadius: "8px",
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                textTransform: "uppercase",
                                                opacity: 0.7,
                                                marginBottom: "0.25rem",
                                            }}
                                        >
                                            {ability.substring(0, 3)}
                                        </div>
                                        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                                            {score}
                                        </div>
                                        <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                            {formatModifier(abilityMods[ability])}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>

                    {/* Saving Throws */}
                    <Card>
                        <CardHeader>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                                Saving Throws
                            </h3>
                        </CardHeader>
                        <CardBody>
                            <div
                                style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
                            >
                                {(
                                    Object.entries(abilityMods) as [
                                        keyof typeof abilityMods,
                                        number,
                                    ][]
                                ).map(([ability, modifier]) => {
                                    const isProficient =
                                        character.proficiencies?.savingThrows?.includes(ability) ||
                                        false;
                                    const profBonus = isProficient ? 2 : 0; // Simplified, should use actual proficiency bonus
                                    const total = modifier + profBonus;

                                    return (
                                        <div
                                            key={ability}
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                padding: "0.5rem",
                                                background: isProficient
                                                    ? "rgba(0,0,0,0.05)"
                                                    : "transparent",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: "0.875rem",
                                                    textTransform: "capitalize",
                                                }}
                                            >
                                                {isProficient && "● "}
                                                {ability}
                                            </span>
                                            <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>
                                                {formatModifier(total)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Right Column - Navigation Tabs */}
                <Card>
                    <CardBody>
                        <Tabs aria-label="Character sections" variant="underlined" size="lg">
                            <Tab key="skills" title="Skills">
                                <div style={{ padding: "1rem" }}>
                                    <p style={{ opacity: 0.7 }}>Skills content coming soon...</p>
                                </div>
                            </Tab>
                            <Tab key="actions" title="Actions">
                                <div style={{ padding: "1rem" }}>
                                    <p style={{ opacity: 0.7 }}>Actions content coming soon...</p>
                                </div>
                            </Tab>
                            <Tab key="inventory" title="Inventory">
                                <div style={{ padding: "1rem" }}>
                                    <p style={{ opacity: 0.7 }}>Inventory content coming soon...</p>
                                </div>
                            </Tab>
                            <Tab key="spells" title="Spells">
                                <div style={{ padding: "1rem" }}>
                                    <p style={{ opacity: 0.7 }}>Spells content coming soon...</p>
                                </div>
                            </Tab>
                            <Tab key="features" title="Features + Traits">
                                <div style={{ padding: "1rem" }}>
                                    <p style={{ opacity: 0.7 }}>
                                        Features & Traits content coming soon...
                                    </p>
                                </div>
                            </Tab>
                            <Tab key="mindcraft" title="Mindcraft">
                                <div style={{ padding: "1rem" }}>
                                    <p style={{ opacity: 0.7 }}>Mindcraft content coming soon...</p>
                                </div>
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
