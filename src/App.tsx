import { CharacterList } from "@/components/character-list";
import { CharacterSheet } from "@/components/character-sheet";
import { CharacterViewModelProvider } from "@/model/character-view-model-context";
import {
    Button,
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@heroui/react";
import { useState } from "react";

function AppContent() {
    const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { name: "Characters", key: "characters" },
        { name: "Build Character", key: "build" },
        { name: "Rules", key: "rules" },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar isBordered maxWidth="full" onMenuOpenChange={setIsMenuOpen}>
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
                    <NavbarContent>
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="sm:hidden"
                        />
                        <NavbarBrand>
                            <img
                                src="/logo.png"
                                alt="Hollow Gear 5E"
                                style={{ height: "40px", cursor: "pointer" }}
                                onClick={() => setSelectedCharacter(null)}
                            />
                        </NavbarBrand>
                    </NavbarContent>

                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        {menuItems.map((item) => (
                            <NavbarItem key={item.key}>
                                <Link color="foreground" href="#" className="cursor-pointer">
                                    {item.name}
                                </Link>
                            </NavbarItem>
                        ))}
                    </NavbarContent>

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

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item.key}-${index}`}>
                            <Link
                                color="foreground"
                                className="w-full cursor-pointer"
                                href="#"
                                size="lg"
                            >
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
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
