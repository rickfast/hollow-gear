import type { CharacterApi } from "../api/character";
import { PREGENS } from "../data";
import type { Character } from "../types";

export class CharacterService implements CharacterApi {
    private characters: Map<string, Character> = new Map();

    constructor() {
        PREGENS.forEach((pregen) => {
            this.characters.set(pregen.id, pregen);
        });
    }

    getCharacter(id: string): Character | undefined {
        return this.characters.get(id);
    }

    getAllCharacters(): Character[] {
        return Array.from(this.characters.values());
    }

    addCharacter(character: Character): void {
        this.characters.set(character.id, character);
    }

    updateCharacter(id: string, character: Partial<Character>): void {
        const existing = this.characters.get(id);
        if (existing) {
            this.characters.set(id, { ...existing, ...character });
        }
    }

    deleteCharacter(id: string): void {
        this.characters.delete(id);
    }
}
