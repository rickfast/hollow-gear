import { EXAMPLE_DRONES } from "@/data/drones";
import type { Drone } from "@/types";

/**
 * Schema version for localStorage data structure.
 * Increment this when making breaking changes to the storage format.
 */
const CURRENT_VERSION = 1;

/**
 * Key used to store drone data in localStorage.
 */
const STORAGE_KEY = "hollowgear:drones";

/**
 * Debounce delay in milliseconds for save operations.
 */
const SAVE_DEBOUNCE_MS = 500;

/**
 * Structure of data stored in localStorage.
 */
interface StoredData {
    version: number;
    drones: Drone[];
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
 * Service for persisting drone data to localStorage.
 * Handles serialization, validation, schema versioning, and debounced saves.
 */
export class DroneStorageService {
    private saveTimeout: NodeJS.Timeout | null = null;
    private drones: Map<string, Drone> = new Map();

    constructor() {
        this.loadFromStorage();
    }

    /**
     * Load drones from localStorage into memory.
     * If no drones exist, initialize with example drones.
     */
    private loadFromStorage(): void {
        const drones = this.loadDrones();
        this.drones.clear();

        // If no drones exist, initialize with example drones
        if (drones.length === 0) {
            for (const drone of EXAMPLE_DRONES) {
                this.drones.set(drone.id, drone);
            }
            // Save the example drones to localStorage
            this.saveDrones(EXAMPLE_DRONES);
        } else {
            for (const drone of drones) {
                this.drones.set(drone.id, drone);
            }
        }
    }

    /**
     * Save all drones to localStorage immediately.
     * @throws {StorageError} If save fails (e.g., quota exceeded)
     */
    private saveDrones(drones: Drone[]): void {
        try {
            const data: StoredData = {
                version: CURRENT_VERSION,
                drones,
                lastModified: new Date().toISOString(),
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            if (error instanceof Error && error.name === "QuotaExceededError") {
                throw new StorageError(
                    "localStorage quota exceeded. Unable to save drones.",
                    error
                );
            }
            throw new StorageError("Failed to save drones to localStorage", error);
        }
    }

    /**
     * Load drones from localStorage with validation.
     * @returns Array of drones, or empty array if no valid data exists
     * @throws {StorageError} If data exists but is corrupted beyond recovery
     */
    private loadDrones(): Drone[] {
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

            // Validate each drone has required fields
            const validDrones = data.drones.filter((drone) => this.isValidDrone(drone));

            if (validDrones.length !== data.drones.length) {
                console.warn(
                    `Filtered out ${data.drones.length - validDrones.length} invalid drones from localStorage`
                );
            }

            return validDrones;
        } catch (error) {
            if (error instanceof SyntaxError) {
                console.error("Failed to parse localStorage data:", error);
                return [];
            }
            throw new StorageError("Failed to load drones from localStorage", error);
        }
    }

    /**
     * Save drones with debouncing to avoid excessive writes.
     * Multiple rapid calls will be batched into a single save operation.
     */
    private debouncedSave(): void {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }

        this.saveTimeout = setTimeout(() => {
            this.saveDrones(Array.from(this.drones.values()));
            this.saveTimeout = null;
        }, SAVE_DEBOUNCE_MS);
    }

    /**
     * Get all drones.
     * @returns Array of all drones
     */
    getAllDrones(): Drone[] {
        return Array.from(this.drones.values());
    }

    /**
     * Get a single drone by ID.
     * @param id - Drone ID
     * @returns Drone if found, null otherwise
     */
    getDrone(id: string): Drone | null {
        return this.drones.get(id) ?? null;
    }

    /**
     * Save a new drone.
     * @param drone - Drone to save
     * @throws {Error} If drone with same ID already exists
     */
    saveDrone(drone: Drone): void {
        if (this.drones.has(drone.id)) {
            throw new Error(`Drone with ID ${drone.id} already exists`);
        }

        this.drones.set(drone.id, drone);
        this.debouncedSave();
    }

    /**
     * Update an existing drone.
     * @param id - Drone ID
     * @param drone - Updated drone data
     * @throws {Error} If drone doesn't exist
     */
    updateDrone(id: string, drone: Drone): void {
        if (!this.drones.has(id)) {
            throw new Error(`Drone with ID ${id} not found`);
        }

        this.drones.set(id, drone);
        this.debouncedSave();
    }

    /**
     * Delete a drone.
     * @param id - Drone ID
     * @returns The deleted drone if found, null otherwise
     */
    deleteDrone(id: string): Drone | null {
        const drone = this.drones.get(id);
        if (!drone) {
            return null;
        }

        this.drones.delete(id);
        this.debouncedSave();
        return drone;
    }

    /**
     * Get all drones owned by a specific character.
     * @param characterId - Character ID
     * @returns Array of drones owned by the character
     */
    getDronesByOwner(characterId: string): Drone[] {
        return Array.from(this.drones.values()).filter((drone) => drone.ownerId === characterId);
    }

    /**
     * Clear all drone data from localStorage.
     */
    clearAll(): void {
        this.drones.clear();
        localStorage.removeItem(STORAGE_KEY);
    }

    /**
     * Check if a name is unique (case-insensitive).
     * @param name - Drone name to check
     * @param excludeId - Optional drone ID to exclude from check (for editing)
     * @returns true if name is unique, false otherwise
     */
    isNameUnique(name: string, excludeId?: string): boolean {
        const normalizedName = name.toLowerCase().trim();
        return !Array.from(this.drones.values()).some(
            (drone) => drone.name.toLowerCase().trim() === normalizedName && drone.id !== excludeId
        );
    }

    /**
     * Validate that a name is unique, throwing an error if not.
     * @param name - Drone name to validate
     * @param excludeId - Optional drone ID to exclude from check (for editing)
     * @throws {Error} If name is not unique
     */
    validateNameUniqueness(name: string, excludeId?: string): void {
        if (!this.isNameUnique(name, excludeId)) {
            throw new Error(`A drone named "${name}" already exists. Please choose a unique name.`);
        }
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
            Array.isArray(obj.drones) &&
            typeof obj.lastModified === "string"
        );
    }

    /**
     * Validate that a drone has the minimum required fields.
     */
    private isValidDrone(drone: unknown): drone is Drone {
        if (typeof drone !== "object" || drone === null) {
            return false;
        }

        const obj = drone as Record<string, unknown>;

        // Check essential fields
        return (
            typeof obj.id === "string" &&
            typeof obj.name === "string" &&
            typeof obj.templateId === "string" &&
            typeof obj.level === "number" &&
            typeof obj.hitPoints === "object" &&
            typeof obj.heatPoints === "object" &&
            typeof obj.modSlots === "number" &&
            Array.isArray(obj.mods)
        );
    }
}
