import { PREGENS } from "@/data";
import type { Character, HitPoints } from "@/types";
import { g } from "framer-motion/client";
import { useState } from "react";
import { CharacterViewModel } from "./character-view-model";

export function useCharacterViewModel() {
    const [characters, setCharacters] = useState<Map<string, Character>>(
        PREGENS.reduce((map, obj) => {
            map.set(obj.id, obj);
            return map;
        }, new Map<string, Character>())
    );

    // const getCharacter = (id: string): Character | undefined => {
    //     return characters.get(id);
    // };

    const getCharacter = (id: string): CharacterViewModel => {
        const character = characters.get(id);
        if (!character) throw new Error(`Character with id ${id} not found`);
        return new CharacterViewModel(character);
    };

    const getAllCharacters = (): CharacterViewModel[] => {
        return Array.from(characters.values()).map((char) => new CharacterViewModel(char));
    };

    const addCharacter = (character: Character): void => {
        setCharacters((prev) => new Map(prev).set(character.id, character));
    };

    const updateCharacter = (id: string, character: Partial<Character>): void => {
        setCharacters((prev) => {
            const existing = prev.get(id);
            if (existing) {
                const updated = { ...existing, ...character };
                const newMap = new Map(prev);
                newMap.set(id, updated);
                return newMap;
            }
            return prev;
        });
    };

    return {
        getCharacter,
        getAllCharacters,
        addCharacter,
        updateCharacter,
    };
}
