import { CharacterList } from "@/components/character-list";
import { CharacterSheet } from "@/components/character-sheet";
import { CharacterViewModelProvider } from "@/model/character-view-model-context";
import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { useState } from "react";

function AppContent() {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isBordered maxWidth="full">
                <div
                    style={{
                        maxWidth: "1400px",
                        margin: "0 auto",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <NavbarBrand>
                        <img
                            src="/logo.png"
                            alt="Hollow Gear 5E"
                            style={{ height: "40px", cursor: "pointer" }}
                            onClick={() => setSelectedCharacter(null)}
                        />
                    </NavbarBrand>
                    {selectedCharacter && (
                        <NavbarContent justify="end">
                            <NavbarItem>
                                <Button
                                    variant="light"
                                    onPress={() => setSelectedCharacter(null)}
                                    size="sm"
                                >
                                    ← Back to Characters
                                </Button>
                            </NavbarItem>
                        </NavbarContent>
                    )}
                </div>
            </Navbar>

            <main className="flex-1">
                {selectedCharacter ? (
                    <CharacterSheet id={selectedCharacter} />
                ) : (
                    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
                        <CharacterList onSelectCharacter={setSelectedCharacter} />
                    </div>
                )}
            </main>
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
