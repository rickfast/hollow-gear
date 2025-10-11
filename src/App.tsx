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
                <CharacterSheet id={character.id} />
            </div>
        );
    }

    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <img src="/logo.png" alt="Hollow Gear 5E" style={{ paddingBottom: "1rem" }} />
            <CharacterList onSelectCharacter={setSelectedCharacter} />
        </div>
    );
}

export default App;
