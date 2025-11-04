import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import { Avatar, Button, Card, CardBody, CardFooter, Chip } from "@heroui/react";

interface CharacterListProps {
    onSelectCharacter?: (characterId: string) => void;
    onEditCharacter?: (characterId: string) => void;
}

export function CharacterList({ onSelectCharacter, onEditCharacter }: CharacterListProps) {
    const { getAllCharacters } = useCharacterViewModelContext();
    const characters = getAllCharacters();

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "1rem",
            }}
        >
            {characters.map(({ summary }) => {
                return (
                    <Card key={summary.id}>
                        <CardBody
                            className="cursor-pointer"
                            onClick={() => onSelectCharacter?.(summary.id)}
                        >
                            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                                <Avatar
                                    src={summary.avatarUrl}
                                    name={summary.name}
                                    size="lg"
                                    showFallback
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                                        {summary.name}
                                    </h3>
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            opacity: 0.7,
                                            margin: "0.25rem 0",
                                        }}
                                    >
                                        {summary.species}
                                    </p>
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            marginTop: "0.5rem",
                                        }}
                                    >
                                        <Chip size="sm" variant="flat">
                                            Level {summary.level}
                                        </Chip>
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontSize: "0.875rem", marginBottom: "0.75rem" }}>
                                {summary.class}
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
                                        {summary.hitPoints.current}/{summary.hitPoints.maximum}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ opacity: 0.6 }}>AC</div>
                                    <div style={{ fontWeight: 500 }}>{summary.armorClass}</div>
                                </div>
                                <div>
                                    <div style={{ opacity: 0.6 }}>Init</div>
                                    <div style={{ fontWeight: 500 }}>{summary.initiative}</div>
                                </div>
                            </div>
                        </CardBody>
                        <CardFooter style={{ paddingTop: 0 }}>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "0.5rem",
                                    width: "100%",
                                }}
                            >
                                <Button
                                    color="primary"
                                    variant="flat"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => onEditCharacter?.(summary.id)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    color="default"
                                    variant="flat"
                                    size="sm"
                                    style={{ flex: 1 }}
                                    onPress={() => onSelectCharacter?.(summary.id)}
                                >
                                    View
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                );
            })}
        </div>
    );
}
