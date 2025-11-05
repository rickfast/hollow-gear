import { PREGENS } from "@/data";
import { CharacterStorageService } from "@/service/character-storage-service";
import type { Character } from "@/types";
import { useEffect, useRef, useState } from "react";
import { CharacterBuilder } from "./character-builder";
import { MutableCharacterViewModel } from "./mutable-character-view-model";

/**
 * Initialize characters from localStorage or fall back to PREGENS
 * Uses getCurrentCharacter() to get the latest version of each character
 */
function initializeCharacters(storageService: CharacterStorageService): Map<string, Character> {
    try {
        const storedCharacters = storageService.loadCharacters();

        if (storedCharacters.length > 0) {
            console.log(`Loaded ${storedCharacters.length} characters from localStorage`);
            return storedCharacters.reduce((map, char) => {
                map.set(char.id, char);
                return map;
            }, new Map<string, Character>());
        }

        // Fall back to PREGENS if localStorage is empty
        console.log("localStorage empty, initializing with PREGENS");
        const pregenMap = PREGENS.reduce((map, char) => {
            map.set(char.id, char);
            return map;
        }, new Map<string, Character>());

        // Save PREGENS to localStorage as version 1 for each character
        Array.from(pregenMap.values()).forEach((char) => {
            storageService.saveCharacterVersion(char, "Initial creation");
        });

        return pregenMap;
    } catch (error) {
        console.error("Error loading characters from localStorage:", error);
        console.log("Falling back to PREGENS");

        // Fall back to PREGENS on error
        return PREGENS.reduce((map, char) => {
            map.set(char.id, char);
            return map;
        }, new Map<string, Character>());
    }
}

export function useCharacterViewModel() {
    const storageServiceRef = useRef(new CharacterStorageService());
    const [characters, setCharacters] = useState<Map<string, Character>>(() =>
        initializeCharacters(storageServiceRef.current)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            storageServiceRef.current.cleanup();
        };
    }, []);

    /**
     * Get a single character as a MutableCharacterViewModel
     * Uses getCurrentCharacter() to ensure we get the latest version
     * @param id - Character ID
     * @returns MutableCharacterViewModel instance
     * @throws Error if character not found
     */
    const getCharacter = (id: string): MutableCharacterViewModel => {
        try {
            // Try to get current version from storage first
            const currentCharacter = storageServiceRef.current.getCurrentCharacter(id);
            const character = currentCharacter || characters.get(id);

            if (!character) {
                throw new Error(`Character with id ${id} not found`);
            }
            return new MutableCharacterViewModel(character);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            throw error;
        }
    };

    /**
     * Get all characters as MutableCharacterViewModel array
     * @returns Array of MutableCharacterViewModel instances
     */
    const getAllCharacters = (): MutableCharacterViewModel[] => {
        return Array.from(characters.values()).map((char) => new MutableCharacterViewModel(char));
    };

    /**
     * Create a new character using CharacterBuilder
     * Saves as version 1 using versioned storage
     * @param builder - CharacterBuilder instance
     * @returns The new character's ID
     */
    const createCharacter = (builder: CharacterBuilder): string => {
        try {
            setIsLoading(true);
            setError(null);

            const newCharacter = builder.build();

            setCharacters((prev) => {
                const newMap = new Map(prev);
                newMap.set(newCharacter.id, newCharacter);

                // Save as version 1 using versioned storage
                storageServiceRef.current.saveCharacterVersion(newCharacter, "Initial creation");

                return newMap;
            });

            return newCharacter.id;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Update a character using an updater function
     * Creates a new version using versioned storage
     * @param id - Character ID
     * @param updater - Function that receives MutableCharacterViewModel and returns updated Character
     * @param description - Optional description of the changes (e.g., "Leveled up to 3")
     */
    const updateCharacter = (
        id: string,
        updater: (vm: MutableCharacterViewModel) => Character,
        description?: string
    ): void => {
        try {
            setIsLoading(true);
            setError(null);

            setCharacters((prev) => {
                // Get current version from storage
                const existing = storageServiceRef.current.getCurrentCharacter(id) || prev.get(id);
                if (!existing) {
                    throw new Error(`Character with id ${id} not found`);
                }

                const viewModel = new MutableCharacterViewModel(existing);
                const updated = updater(viewModel);

                const newMap = new Map(prev);
                newMap.set(id, updated);

                // Create new version using versioned storage
                storageServiceRef.current.saveCharacterVersion(updated, description);

                return newMap;
            });
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Delete a character
     * Note: This removes all versions of the character from storage
     * @param id - Character ID to delete
     */
    const deleteCharacter = (id: string): void => {
        try {
            setIsLoading(true);
            setError(null);

            setCharacters((prev) => {
                if (!prev.has(id)) {
                    throw new Error(`Character with id ${id} not found`);
                }

                const newMap = new Map(prev);
                newMap.delete(id);

                // Save all remaining characters (this will remove the deleted character from storage)
                storageServiceRef.current.saveCharacters(Array.from(newMap.values()));

                return newMap;
            });
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Export a character as JSON string
     * @param id - Character ID to export
     * @returns JSON string representation of the character
     * @throws Error if character not found
     */
    const exportCharacter = (id: string): string => {
        try {
            setError(null);
            const character = characters.get(id);
            if (!character) {
                throw new Error(`Character with id ${id} not found`);
            }
            return JSON.stringify(character, null, 2);
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            throw error;
        }
    };

    /**
     * Import a character from JSON string
     * Saves as version 1 using versioned storage
     * @param json - JSON string representation of a character
     * @returns The imported character's ID
     * @throws Error if JSON is invalid or character structure is invalid
     */
    const importCharacter = (json: string): string => {
        try {
            setIsLoading(true);
            setError(null);

            const character = JSON.parse(json) as Character;

            // Basic validation
            if (!character.id || !character.name || !character.species || !character.classes) {
                throw new Error("Invalid character structure: missing required fields");
            }

            // Generate new ID if one already exists
            let finalCharacter = character;
            if (characters.has(character.id)) {
                console.log(`Character with id ${character.id} already exists, generating new ID`);
                finalCharacter = {
                    ...character,
                    id: `char-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                };
            }

            setCharacters((prev) => {
                const newMap = new Map(prev);
                newMap.set(finalCharacter.id, finalCharacter);

                // Save as version 1 using versioned storage
                storageServiceRef.current.saveCharacterVersion(
                    finalCharacter,
                    "Imported character"
                );

                return newMap;
            });

            return finalCharacter.id;
        } catch (err) {
            const error =
                err instanceof SyntaxError
                    ? new Error(`Invalid JSON: ${err.message}`)
                    : err instanceof Error
                      ? err
                      : new Error(String(err));
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        getCharacter,
        getAllCharacters,
        createCharacter,
        updateCharacter,
        deleteCharacter,
        exportCharacter,
        importCharacter,
        isLoading,
        error,
    };
}
