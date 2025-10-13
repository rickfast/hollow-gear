import { CharacterList } from "@/components/character-list";
import { CharacterSheet } from "@/components/character-sheet";
import { CharacterViewModelProvider } from "@/model/character-view-model-context";
import { Button } from "@heroui/react";
import { useState } from "react";

function AppContent() {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    if (selectedCharacter) {
        return (
            <div>
                <div style={{ padding: "1rem", borderBottom: "1px solid rgba(0,0,0,0.1)" }}>
                    <Button variant="light" onPress={() => setSelectedCharacter(null)} size="sm">
                        ← Back to Characters
                    </Button>
                </div>
                <CharacterSheet id={selectedCharacter} />
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

function App() {
    return (
        <CharacterViewModelProvider>
            <AppContent />
        </CharacterViewModelProvider>
    );
}

export default App;
