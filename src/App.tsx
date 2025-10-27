import { NavigationSidesheet } from "@/components/navigation-sidesheet";
import { CharacterViewModelProvider } from "@/model/character-view-model-context";
import { CharacterBuilderPage } from "@/pages/character-builder-page";
import { CharacterSheetPage } from "@/pages/character-sheet-page";
import { CharactersPage } from "@/pages/characters-page";
import { DroneBuilderPage } from "@/pages/drone-builder-page";
import { DronesPage } from "@/pages/drones-page";
import { ReferencePage } from "@/pages/reference-page";
import { RulesPage } from "@/pages/rules-page";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

function AppContent() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavigationSidesheet />

            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<CharactersPage />} />
                    <Route path="/characters/:id" element={<CharacterSheetPage />} />
                    <Route path="/builder" element={<CharacterBuilderPage />} />
                    <Route path="/drones" element={<DronesPage />} />
                    <Route path="/drones/new" element={<DroneBuilderPage />} />
                    <Route path="/drones/:id/edit" element={<DroneBuilderPage />} />
                    <Route path="/reference" element={<ReferencePage />} />
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
                <Toaster richColors position="top-right" />
            </CharacterViewModelProvider>
        </BrowserRouter>
    );
}

export default App;
