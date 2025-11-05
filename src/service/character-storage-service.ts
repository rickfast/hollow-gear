import type { Character } from "@/types";

/**
 * Schema version for localStorage data structure.
 * Increment this when making breaking changes to the storage format.
 */
const CURRENT_VERSION = 2;

/**
 * Key used to store character data in localStorage.
 */
const STORAGE_KEY = "hollowgear:characters";

/**
 * Debounce delay in milliseconds for save operations.
 */
const SAVE_DEBOUNCE_MS = 500;

/**
 * Maximum number of versions to keep per character.
 */
const MAX_VERSIONS_PER_CHARACTER = 10;

/**
 * A single version of a character with metadata.
 */
export interface CharacterVersion {
    version: number;
    character: Character;
    timestamp: string; // ISO format
    description?: string; // e.g., "Level up to 3", "Added Artificer class"
}

/**
 * Versioned character data with history.
 */
export interface VersionedCharacter {
    characterId: string;
    currentVersion: number;
    versions: CharacterVersion[];
}

/**
 * Structure of data stored in localStorage (versioned format).
 */
interface StoredData {
    version: number;
    characters: VersionedCharacter[];
    lastModified: string; // ISO timestamp
}

/**
 * Legacy structure for migration (version 1).
 */
interface LegacyStoredData {
    version: 1;
    characters: Character[];
    lastModified: string;
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
 * Supports versioned character history for rollback functionality.
 */
export class CharacterStorageService {
    private saveTimeout: NodeJS.Timeout | null = null;

    /**
     * Save characters to localStorage immediately (legacy method for backward compatibility).
     * @param characters - Array of characters to persist
     * @throws {StorageError} If save fails (e.g., quota exceeded)
     * @deprecated Use saveCharacterVersion() for versioned storage
     */
    saveCharacters(characters: Character[]): void {
        try {
            // Convert to versioned format
            const versionedCharacters: VersionedCharacter[] = characters.map((char) => ({
                characterId: char.id,
                currentVersion: 1,
                versions: [
                    {
                        version: 1,
                        character: char,
                        timestamp: new Date().toISOString(),
                        description: "Initial save",
                    },
                ],
            }));

            const data: StoredData = {
                version: CURRENT_VERSION,
                characters: versionedCharacters,
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
     * Save a new version of a character.
     * Automatically increments version number and manages version history.
     * @param character - Character to save
     * @param description - Optional description of changes
     * @throws {StorageError} If save fails
     */
    saveCharacterVersion(character: Character, description?: string): void {
        try {
            const data = this.loadStoredData();
            const existingIndex = data.characters.findIndex(
                (vc) => vc.characterId === character.id
            );

            if (existingIndex >= 0) {
                // Update existing character with new version
                const existing = data.characters[existingIndex]!;
                const newVersion = existing.currentVersion + 1;

                const newVersionEntry: CharacterVersion = {
                    version: newVersion,
                    character,
                    timestamp: new Date().toISOString(),
                    description,
                };

                // Add new version and trim if needed
                existing.versions.push(newVersionEntry);
                if (existing.versions.length > MAX_VERSIONS_PER_CHARACTER) {
                    existing.versions = existing.versions.slice(-MAX_VERSIONS_PER_CHARACTER);
                }

                existing.currentVersion = newVersion;
            } else {
                // Create new versioned character
                const newVersionedChar: VersionedCharacter = {
                    characterId: character.id,
                    currentVersion: 1,
                    versions: [
                        {
                            version: 1,
                            character,
                            timestamp: new Date().toISOString(),
                            description: description || "Initial creation",
                        },
                    ],
                };
                data.characters.push(newVersionedChar);
            }

            data.lastModified = new Date().toISOString();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            if (error instanceof Error && error.name === "QuotaExceededError") {
                throw new StorageError(
                    "localStorage quota exceeded. Unable to save character version.",
                    error
                );
            }
            throw new StorageError("Failed to save character version to localStorage", error);
        }
    }

    /**
     * Get all versions of a specific character.
     * @param characterId - ID of the character
     * @returns Array of character versions, or empty array if not found
     */
    getCharacterVersions(characterId: string): CharacterVersion[] {
        const data = this.loadStoredData();
        const versionedChar = data.characters.find((vc) => vc.characterId === characterId);
        return versionedChar?.versions || [];
    }

    /**
     * Get a specific version of a character.
     * @param characterId - ID of the character
     * @param version - Version number to retrieve
     * @returns Character at specified version, or undefined if not found
     */
    getCharacterVersion(characterId: string, version: number): Character | undefined {
        const versions = this.getCharacterVersions(characterId);
        return versions.find((v) => v.version === version)?.character;
    }

    /**
     * Restore a character to a previous version.
     * Creates a new version (doesn't overwrite history).
     * @param characterId - ID of the character
     * @param version - Version number to restore
     * @throws {StorageError} If version not found or save fails
     */
    restoreCharacterVersion(characterId: string, version: number): void {
        const character = this.getCharacterVersion(characterId, version);
        if (!character) {
            throw new StorageError(`Character version not found: ${characterId} v${version}`);
        }

        this.saveCharacterVersion(character, `Restored from version ${version}`);
    }

    /**
     * Get the current (latest) version of a character.
     * @param characterId - ID of the character
     * @returns Current character, or undefined if not found
     */
    getCurrentCharacter(characterId: string): Character | undefined {
        const data = this.loadStoredData();
        const versionedChar = data.characters.find((vc) => vc.characterId === characterId);
        if (!versionedChar) {
            return undefined;
        }

        const currentVersionEntry = versionedChar.versions.find(
            (v) => v.version === versionedChar.currentVersion
        );
        return currentVersionEntry?.character;
    }

    /**
     * Get the current version number of a character.
     * @param characterId - ID of the character
     * @returns Current version number, or 1 if not found
     */
    getCurrentVersionNumber(characterId: string): number {
        const data = this.loadStoredData();
        const versionedChar = data.characters.find((vc) => vc.characterId === characterId);
        return versionedChar?.currentVersion || 1;
    }

    /**
     * Load characters from localStorage with validation.
     * Returns current version of each character.
     * @returns Array of characters, or empty array if no valid data exists
     * @throws {StorageError} If data exists but is corrupted beyond recovery
     */
    loadCharacters(): Character[] {
        const data = this.loadStoredData();
        return data.characters
            .map((vc) => {
                const currentVersionEntry = vc.versions.find(
                    (v) => v.version === vc.currentVersion
                );
                return currentVersionEntry?.character;
            })
            .filter((char): char is Character => char !== undefined);
    }

    /**
     * Load and validate stored data from localStorage.
     * Handles migration from legacy format.
     * @returns Validated stored data
     */
    private loadStoredData(): StoredData {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);

            if (!raw) {
                return {
                    version: CURRENT_VERSION,
                    characters: [],
                    lastModified: new Date().toISOString(),
                };
            }

            const data = JSON.parse(raw) as unknown;

            // Check if it's legacy format (version 1)
            if (this.isLegacyStoredData(data)) {
                console.log("Migrating from legacy storage format (v1) to versioned format (v2)");
                return this.migrateLegacyData(data);
            }

            // Validate versioned structure
            if (!this.isValidStoredData(data)) {
                console.warn("Invalid localStorage data structure. Returning empty data.");
                return {
                    version: CURRENT_VERSION,
                    characters: [],
                    lastModified: new Date().toISOString(),
                };
            }

            return data;
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error("Failed to parse localStorage data:", error);
                return {
                    version: CURRENT_VERSION,
                    characters: [],
                    lastModified: new Date().toISOString(),
                };
            }
            throw new StorageError("Failed to load data from localStorage", error);
        }
    }

    /**
     * Migrate legacy (v1) data to versioned format (v2).
     * @param legacyData - Legacy stored data
     * @returns Migrated versioned data
     */
    private migrateLegacyData(legacyData: LegacyStoredData): StoredData {
        const versionedCharacters: VersionedCharacter[] = legacyData.characters
            .filter((char) => this.isValidCharacter(char))
            .map((char) => ({
                characterId: char.id,
                currentVersion: 1,
                versions: [
                    {
                        version: 1,
                        character: char,
                        timestamp: legacyData.lastModified,
                        description: "Migrated from legacy format",
                    },
                ],
            }));

        const migratedData: StoredData = {
            version: CURRENT_VERSION,
            characters: versionedCharacters,
            lastModified: new Date().toISOString(),
        };

        // Save migrated data
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedData));
        } catch (error) {
            console.error("Failed to save migrated data:", error);
        }

        return migratedData;
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
     * Type guard to validate legacy StoredData structure (v1).
     */
    private isLegacyStoredData(data: unknown): data is LegacyStoredData {
        if (typeof data !== "object" || data === null) {
            return false;
        }

        const obj = data as Record<string, unknown>;

        return (
            obj.version === 1 &&
            Array.isArray(obj.characters) &&
            typeof obj.lastModified === "string" &&
            // Check if characters array contains Character objects (not VersionedCharacter)
            (obj.characters.length === 0 ||
                (typeof obj.characters[0] === "object" &&
                    obj.characters[0] !== null &&
                    "id" in obj.characters[0] &&
                    !("characterId" in obj.characters[0])))
        );
    }

    /**
     * Type guard to validate versioned StoredData structure (v2+).
     */
    private isValidStoredData(data: unknown): data is StoredData {
        if (typeof data !== "object" || data === null) {
            return false;
        }

        const obj = data as Record<string, unknown>;

        if (
            typeof obj.version !== "number" ||
            !Array.isArray(obj.characters) ||
            typeof obj.lastModified !== "string"
        ) {
            return false;
        }

        // Validate versioned character structure
        return obj.characters.every((vc) => this.isValidVersionedCharacter(vc));
    }

    /**
     * Type guard to validate VersionedCharacter structure.
     */
    private isValidVersionedCharacter(vc: unknown): vc is VersionedCharacter {
        if (typeof vc !== "object" || vc === null) {
            return false;
        }

        const obj = vc as Record<string, unknown>;

        return (
            typeof obj.characterId === "string" &&
            typeof obj.currentVersion === "number" &&
            Array.isArray(obj.versions) &&
            obj.versions.every((v) => this.isValidCharacterVersion(v))
        );
    }

    /**
     * Type guard to validate CharacterVersion structure.
     */
    private isValidCharacterVersion(v: unknown): v is CharacterVersion {
        if (typeof v !== "object" || v === null) {
            return false;
        }

        const obj = v as Record<string, unknown>;

        return (
            typeof obj.version === "number" &&
            typeof obj.timestamp === "string" &&
            this.isValidCharacter(obj.character)
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
