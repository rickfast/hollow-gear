import { Card, CardBody, Avatar, Chip } from "@heroui/react";
import { useCharacterViewModel } from "@/model/use-character-view-model";

interface CharacterListProps {
    onSelectCharacter?: (characterId: string) => void;
}

export function CharacterList({ onSelectCharacter }: CharacterListProps) {
    const { getAllCharacters } = useCharacterViewModel();
    const characters = getAllCharacters();

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1rem",
            }}
        >
            {characters.map((character) => {
                const primaryClass = character.classes[0];
                const classDisplay = primaryClass
                    ? primaryClass.subclass
                        ? `${primaryClass.class} (${primaryClass.subclass})`
                        : primaryClass.class
                    : "Unknown";

                return (
                    <Card
                        key={character.id}
                        isPressable
                        onPress={() => onSelectCharacter?.(character.id)}
                    >
                        <CardBody>
                            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                                <Avatar
                                    src={character.avatarUrl}
                                    name={character.name}
                                    size="lg"
                                    showFallback
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                                        {character.name}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            opacity: 0.7,
                                            margin: "0.25rem 0",
                                        }}
                                    >
                                        {character.species}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            marginTop: "0.5rem",
                                        }}
                                    >
                                        <Chip size="sm" variant="flat">
                                            Level {character.level}
                                        </Chip>
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                                {classDisplay}
                            </div>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr 1fr",
                                    gap: "0.5rem",
                                    fontSize: "0.875rem",
                                }}
                            >
                                <div>
                                    <div style={{ opacity: 0.6 }}>HP</div>
                                    <div style={{ fontWeight: 500 }}>
                                        {character.hitPoints.current}/{character.hitPoints.maximum}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ opacity: 0.6 }}>AC</div>
                                    <div style={{ fontWeight: 500 }}>{character.armorClass}</div>
                                </div>
                                <div>
                                    <div style={{ opacity: 0.6 }}>Init</div>
                                    <div style={{ fontWeight: 500 }}>
                                        {character.initiative >= 0 ? "+" : ""}
                                        {character.initiative}
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
