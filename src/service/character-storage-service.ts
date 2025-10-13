import type { Character } from "@/types";

/**
 * Schema version for localStorage data structure.
 * Increment this when making breaking changes to the storage format.
 */
const CURRENT_VERSION = 1;

/**
 * Key used to store character data in localStorage.
 */
const STORAGE_KEY = "hollowgear:characters";

/**
 * Debounce delay in milliseconds for save operations.
 */
const SAVE_DEBOUNCE_MS = 500;

/**
 * Structure of data stored in localStorage.
 */
interface StoredData {
    version: number;
    characters: Character[];
    lastModified: string; // ISO timestamp
}

/**
 * Custom error for storage-related failures.
 */
export class StorageError extends Error {
    public override readonly cause?: unknown;

    constructor(message: string, cause?: unknown) {
        super(message);
        this.name = "StorageError";
        this.cause = cause;
    }
}

/**
 * Service for persisting character data to localStorage.
 * Handles serialization, validation, schema versioning, and debounced saves.
 */
export class CharacterStorageService {
    private saveTimeout: NodeJS.Timeout | null = null;

    /**
     * Save characters to localStorage immediately.
     * @param characters - Array of characters to persist
     * @throws {StorageError} If save fails (e.g., quota exceeded)
     */
    saveCharacters(characters: Character[]): void {
        try {
            const data: StoredData = {
                version: CURRENT_VERSION,
                characters,
                lastModified: new Date().toISOString(),
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            if (error instanceof Error && error.name === "QuotaExceededError") {
                throw new StorageError(
                    "localStorage quota exceeded. Unable to save characters.",
                    error
                );
            }
            throw new StorageError("Failed to save characters to localStorage", error);
        }
    }

    /**
     * Load characters from localStorage with validation.
     * @returns Array of characters, or empty array if no valid data exists
     * @throws {StorageError} If data exists but is corrupted beyond recovery
     */
    loadCharacters(): Character[] {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return [];
            }

            const data = JSON.parse(raw) as unknown;

            // Validate structure
            if (!this.isValidStoredData(data)) {
                console.warn("Invalid localStorage data structure. Returning empty array.");
                return [];
            }

            // Check version compatibility
            if (data.version !== CURRENT_VERSION) {
                console.warn(
                    `localStorage schema version mismatch (found: ${data.version}, expected: ${CURRENT_VERSION}). Attempting to migrate or returning empty array.`
                );
                // Future: Add migration logic here
                return [];
            }

            // Validate each character has required fields
            const validCharacters = data.characters.filter((char) => this.isValidCharacter(char));

            if (validCharacters.length !== data.characters.length) {
                console.warn(
                    `Filtered out ${data.characters.length - validCharacters.length} invalid characters from localStorage`
                );
            }

            return validCharacters;
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error("Failed to parse localStorage data:", error);
                return [];
            }
            throw new StorageError("Failed to load characters from localStorage", error);
        }
    }

    /**
     * Save characters with debouncing to avoid excessive writes.
     * Multiple rapid calls will be batched into a single save operation.
     * @param characters - Array of characters to persist
     */
    debouncedSave(characters: Character[]): void {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = setTimeout(() => {
            this.saveCharacters(characters);
            this.saveTimeout = null;
        }, SAVE_DEBOUNCE_MS);
    }

    /**
     * Clear all character data from localStorage.
     */
    clearAll(): void {
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Cleanup any pending save operations.
     * Should be called when the service is no longer needed.
     */
    cleanup(): void {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }
    }

    /**
     * Type guard to validate StoredData structure.
     */
    private isValidStoredData(data: unknown): data is StoredData {
        if (typeof data !== "object" || data === null) {
            return false;
        }

        const obj = data as Record<string, unknown>;

        return (
            typeof obj.version === "number" &&
            Array.isArray(obj.characters) &&
            typeof obj.lastModified === "string"
        );
    }

    /**
     * Validate that a character has the minimum required fields.
     */
    private isValidCharacter(char: unknown): char is Character {
        if (typeof char !== "object" || char === null) {
            return false;
        }

        const obj = char as Record<string, unknown>;

        // Check essential fields
        return (
            typeof obj.id === "string" &&
            typeof obj.name === "string" &&
            typeof obj.species === "string" &&
            Array.isArray(obj.classes) &&
            typeof obj.level === "number" &&
            typeof obj.abilityScores === "object" &&
            typeof obj.hitPoints === "object" &&
            typeof obj.heatPoints === "object"
        );
    }
}
