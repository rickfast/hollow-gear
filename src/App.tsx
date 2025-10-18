import { CharacterViewModelProvider } from "@/model/character-view-model-context";
import { CharacterBuilderPage } from "@/pages/character-builder-page";
import { CharacterSheetPage } from "@/pages/character-sheet-page";
import { CharactersPage } from "@/pages/characters-page";
import { RulesPage } from "@/pages/rules-page";
import {
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
import { BrowserRouter, Route, Link as RouterLink, Routes, useLocation } from "react-router-dom";

function AppContent() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { name: "Characters", path: "/", key: "characters" },
        { name: "Build Character", path: "/builder", key: "build" },
        { name: "Rules", path: "/rules", key: "rules" },
    ];

    const isCharacterSheet = location.pathname.startsWith("/characters/");

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
                            <RouterLink to="/">
                                <img
                                    src="/logo.png"
                                    alt="Hollow Gear 5E"
                                    style={{
                                        height: "40px",
                                        width: "auto",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                        cursor: "pointer",
                                    }}
                                />
                            </RouterLink>
                        </NavbarBrand>
                    </NavbarContent>

                    <NavbarContent className="hidden sm:flex gap-4" justify="center">
                        {menuItems.map((item) => (
                            <NavbarItem key={item.key} isActive={location.pathname === item.path}>
                                <Link
                                    as={RouterLink}
                                    to={item.path}
                                    color={
                                        location.pathname === item.path ? "primary" : "foreground"
                                    }
                                    className="cursor-pointer"
                                >
                                    {item.name}
                                </Link>
                            </NavbarItem>
                        ))}
                    </NavbarContent>

                    {isCharacterSheet && (
                        <NavbarContent justify="end">
                            <NavbarItem>
                                <Link
                                    as={RouterLink}
                                    to="/"
                                    color="foreground"
                                    className="cursor-pointer"
                                >
                                    ← Back to Characters
                                </Link>
                            </NavbarItem>
                        </NavbarContent>
                    )}
                </div>

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item.key}-${index}`}>
                            <Link
                                as={RouterLink}
                                to={item.path}
                                color="foreground"
                                className="w-full cursor-pointer"
                                size="lg"
                            >
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </Navbar>

            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<CharactersPage />} />
                    <Route path="/characters/:id" element={<CharacterSheetPage />} />
                    <Route path="/builder" element={<CharacterBuilderPage />} />
                    <Route path="/rules" element={<RulesPage />} />
                </Routes>
            </main>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <CharacterViewModelProvider>
                <AppContent />
            </CharacterViewModelProvider>
        </BrowserRouter>
    );
}

export default App;
