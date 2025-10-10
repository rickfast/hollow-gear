import type { Character, AbilityScores } from "../types";

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

export interface CharacterApi {
    getCharacter(id: string): Character | undefined;
    getAllCharacters(): Character[];
    addCharacter(character: Character): void;
    updateCharacter(id: string, character: Partial<Character>): void;
    deleteCharacter(id: string): void;
}
