import type { Character } from "@/types";
import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import type { MutableCharacterViewModel } from "./mutable-character-view-model";
import type { CharacterBuilder } from "./character-builder";
import { useCharacterViewModel } from "./use-character-view-model";

interface CharacterViewModelContextType {
    getCharacter: (id: string) => MutableCharacterViewModel;
    getAllCharacters: () => MutableCharacterViewModel[];
    createCharacter: (builder: CharacterBuilder) => string;
    updateCharacter: (id: string, updater: (vm: MutableCharacterViewModel) => Character) => void;
    deleteCharacter: (id: string) => void;
    exportCharacter: (id: string) => string;
    importCharacter: (json: string) => string;
    isLoading: boolean;
    error: Error | null;
}

const CharacterViewModelContext = createContext<CharacterViewModelContextType | undefined>(
    undefined
);

interface CharacterViewModelProviderProps {
    children: ReactNode;
}

export function CharacterViewModelProvider({ children }: CharacterViewModelProviderProps) {
    const viewModel = useCharacterViewModel();

    return (
        <CharacterViewModelContext.Provider value={viewModel}>
            {children}
        </CharacterViewModelContext.Provider>
    );
}

export function useCharacterViewModelContext() {
    const context = useContext(CharacterViewModelContext);
    if (context === undefined) {
        throw new Error(
            "useCharacterViewModelContext must be used within a CharacterViewModelProvider"
        );
    }
    return context;
}
