import * as Data from "./data";
// @ts-ignore
import type {
    Character,
    CharacterClass,
    Class,
    ClassDescription,
    ClassFeature,
    Species,
} from "./types";
// @ts-ignore
import type { CharacterApi } from "./api/character";

console.log("Data loaded:", {
    Data,
});

const api: CharacterApi = new (await import("./service/character-service")).CharacterService();

// Example usage
const allCharacters: Character[] = api.getAllCharacters();
console.log("All Characters:", allCharacters);
