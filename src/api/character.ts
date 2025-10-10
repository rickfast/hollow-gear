import type { Character } from "../types";

export interface CharacterApi {
    getCharacter(id: string): Character | undefined;
    getAllCharacters(): Character[];
    addCharacter(character: Character): void;
    updateCharacter(id: string, character: Partial<Character>): void;
    deleteCharacter(id: string): void;
}
