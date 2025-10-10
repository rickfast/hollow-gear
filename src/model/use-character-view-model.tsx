import { PREGENS } from "@/data";
import type { Character } from "@/types";
import { useState } from "react";

export interface AbilityScoreDisplay {
    score: number;
    modifier: number;
}

export interface AbilityScoresDisplay {
    strength: AbilityScoreDisplay;
    dexterity: AbilityScoreDisplay;
    constitution: AbilityScoreDisplay;
    intelligence: AbilityScoreDisplay;
    wisdom: AbilityScoreDisplay;
    charisma: AbilityScoreDisplay;
}

export function useCharacterViewModel() {
    const [characters, setCharacters] = useState<Map<string, Character>>(
        PREGENS.reduce((map, obj) => {
            map.set(obj.id, obj);
            return map;
        }, new Map<string, Character>())
    );

    const getCharacter = (id: string): Character | undefined => {
        return characters.get(id);
    };

    const getAllCharacters = (): Character[] => {
        return Array.from(characters.values());
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
    const getAbilityScoreDisplay = (id: string): AbilityScoresDisplay | null => {
        const character = characters.get(id);
        if (!character) return null;

        const abilityScores: AbilityScoresDisplay = {
            strength: {
                score: character.abilityScores.strength,
                modifier: Math.floor((character.abilityScores.strength - 10) / 2),
            },
            dexterity: {
                score: character.abilityScores.dexterity,
                modifier: Math.floor((character.abilityScores.dexterity - 10) / 2),
            },
            constitution: {
                score: character.abilityScores.constitution,
                modifier: Math.floor((character.abilityScores.constitution - 10) / 2),
            },
            intelligence: {
                score: character.abilityScores.intelligence,
                modifier: Math.floor((character.abilityScores.intelligence - 10) / 2),
            },
            wisdom: {
                score: character.abilityScores.wisdom,
                modifier: Math.floor((character.abilityScores.wisdom - 10) / 2),
            },
            charisma: {
                score: character.abilityScores.charisma,
                modifier: Math.floor((character.abilityScores.charisma - 10) / 2),
            },
        };

        return abilityScores;
    };

    return {
        getCharacter,
        getAllCharacters,
        addCharacter,
        updateCharacter,
        getAbilityScoreDisplay,
    };
}
