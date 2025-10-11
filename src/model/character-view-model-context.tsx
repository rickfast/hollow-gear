import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import { useCharacterViewModel } from "./use-character-view-model";
import type { Character } from "@/types";
import type { CharacterViewModel } from "./character-view-model";

interface CharacterViewModelContextType {
    getCharacter: (id: string) => CharacterViewModel;
    getAllCharacters: () => CharacterViewModel[];
    addCharacter: (character: Character) => void;
    updateCharacter: (id: string, character: Partial<Character>) => void;
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
