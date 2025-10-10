import { Card, CardHeader, CardBody, Button } from "@heroui/react";
import { CharacterList } from "@/components/character-list";
import { CharacterSheet } from "@/components/character-sheet";
import { PREGENS } from "@/data/pregens";
import { useState } from "react";

function App() {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    const character = selectedCharacter ? PREGENS.find((c) => c.id === selectedCharacter) : null;

    if (character) {
        return (
            <div>
                <div style={{ padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                    <Button variant="light" onPress={() => setSelectedCharacter(null)} size="sm">
                        ← Back to Characters
                    </Button>
                </div>
                <CharacterSheet character={character} />
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <Card style={{ marginBottom: "2rem" }}>
                <CardHeader>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: 700, margin: 0 }}>
                        Hollow Gear 5E
                    </h1>
                </CardHeader>
                <CardBody>
                    <p style={{ fontSize: "1.125rem", opacity: 0.8, margin: 0 }}>
                        Select a pre-generated character to view their character sheet
                    </p>
                </CardBody>
            </Card>
            <CharacterList onSelectCharacter={setSelectedCharacter} />
        </div>
    );
}

export default App;
