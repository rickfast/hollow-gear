/**
 * Character serialization and data migration system
 *
 * This module provides JSON serialization/deserialization and version migration
 * support for Hollow Gear characters, optimized for offline-first mobile usage.
 */

import type { HollowGearCharacter } from './character.js';
import type { Result, ValidationError } from './types/common.js';

/**
 * Serializable character data format
 *
 * This interface represents the JSON-serializable format for character data,
 * with Date objects converted to ISO strings and other optimizations for storage.
 */
export interface SerializableCharacter {
  // Metadata with string dates for JSON compatibility
  id: string;
  version: string;
  created: string; // ISO date string
  lastModified: string; // ISO date string

  // All other character data remains the same structure
  // but with Date objects converted to strings
  [key: string]: any;
}

/**
 * Migration function signature
 */
export type MigrationFunction = (
  data: SerializableCharacter
) => SerializableCharacter;

/**
 * Migration registry for version upgrades
 */
export interface MigrationRegistry {
  [fromVersion: string]: {
    toVersion: string;
    migrate: MigrationFunction;
  };
}

/**
 * Serialization options
 */
export interface SerializationOptions {
  /** Whether to include computed/derived values */
  includeComputed?: boolean;
  /** Whether to compress the output */
  compress?: boolean;
  /** Custom field transformations */
  transforms?: Record<string, (value: any) => any>;
}

/**
 * Deserialization options
 */
export interface DeserializationOptions {
  /** Whether to validate the character after deserialization */
  validate?: boolean;
  /** Whether to migrate to the latest version */
  migrate?: boolean;
  /** Custom field transformations */
  transforms?: Record<string, (value: any) => any>;
}

/**
 * Change tracking for incremental updates
 */
export interface CharacterChange {
  /** Path to the changed field (dot notation) */
  path: string;
  /** Previous value */
  oldValue: any;
  /** New value */
  newValue: any;
  /** Timestamp of the change */
  timestamp: Date;
  /** Type of change */
  type: ChangeType;
}

/**
 * Types of changes that can occur
 */
export type ChangeType =
  | 'create'
  | 'update'
  | 'delete'
  | 'add' // For array additions
  | 'remove'; // For array removals

/**
 * Change tracking result
 */
export interface ChangeTrackingResult {
  /** List of changes detected */
  changes: CharacterChange[];
  /** Whether any changes were detected */
  hasChanges: boolean;
  /** Summary of change types */
  summary: Record<ChangeType, number>;
}

/**
 * Serialization result
 */
export type SerializationResult = Result<string, ValidationError[]>;

/**
 * Deserialization result
 */
export type DeserializationResult = Result<
  HollowGearCharacter,
  ValidationError[]
>;

/**
 * Migration result
 */
export type MigrationResult = Result<SerializableCharacter, ValidationError[]>;

/**
 * Character serialization utilities
 */
export namespace SerializationUtils {
  /**
   * Current model version for new characters
   */
  export const CURRENT_VERSION = '1.0.0';

  /**
   * Migration registry for version upgrades
   */
  const migrations: MigrationRegistry = {
    // Future migrations will be added here
    // Example: '0.9.0': { toVersion: '1.0.0', migrate: migrateFrom0_9_0 }
  };

  /**
   * Serialize a character to JSON string
   */
  export function serialize(
    character: HollowGearCharacter,
    options: SerializationOptions = {}
  ): SerializationResult {
    try {
      // Convert character to serializable format
      const serializable = toSerializable(character, options);

      // Convert to JSON string
      const jsonString = JSON.stringify(
        serializable,
        null,
        options.compress ? 0 : 2
      );

      return { success: true, data: jsonString };
    } catch (error) {
      return {
        success: false,
        error: [
          {
            field: 'serialization',
            message: `Serialization failed: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            code: 'SERIALIZATION_FAILED',
          },
        ],
      };
    }
  }

  /**
   * Deserialize a character from JSON string
   */
  export async function deserialize(
    jsonString: string,
    options: DeserializationOptions = {}
  ): Promise<DeserializationResult> {
    try {
      // Parse JSON
      const serializable = JSON.parse(jsonString) as SerializableCharacter;

      // Migrate if requested and needed
      let migratedData = serializable;
      if (
        options.migrate !== false &&
        serializable.version !== CURRENT_VERSION
      ) {
        const migrationResult = migrateToLatest(serializable);
        if (!migrationResult.success) {
          return {
            success: false,
            error: [
              {
                field: 'migration',
                message: 'Migration failed during deserialization',
                code: 'MIGRATION_FAILED',
              },
            ],
          };
        }
        migratedData = migrationResult.data;
      }

      // Convert back to character format
      const character = fromSerializable(migratedData, options);

      // Validate if requested
      if (options.validate !== false) {
        const { CharacterUtils } = await import('./character.js');
        const validationResult = CharacterUtils.validateCharacter(character);
        if (!validationResult.success) {
          return validationResult;
        }
      }

      return { success: true, data: character };
    } catch (error) {
      return {
        success: false,
        error: [
          {
            field: 'deserialization',
            message: `Deserialization failed: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            code: 'DESERIALIZATION_FAILED',
          },
        ],
      };
    }
  }

  /**
   * Migrate character data to the latest version
   */
  export function migrateToLatest(
    data: SerializableCharacter
  ): MigrationResult {
    try {
      let currentData = { ...data };
      let currentVersion = data.version;

      // Apply migrations in sequence until we reach the current version
      while (currentVersion !== CURRENT_VERSION) {
        const migration = migrations[currentVersion];
        if (!migration) {
          return {
            success: false,
            error: [
              {
                field: 'version',
                message: `No migration path found from version ${currentVersion} to ${CURRENT_VERSION}`,
                code: 'NO_MIGRATION_PATH',
              },
            ],
          };
        }

        // Apply the migration
        currentData = migration.migrate(currentData);
        currentData.version = migration.toVersion;
        currentVersion = migration.toVersion;
      }

      return { success: true, data: currentData };
    } catch (error) {
      return {
        success: false,
        error: [
          {
            field: 'migration',
            message: `Migration failed: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            code: 'MIGRATION_FAILED',
          },
        ],
      };
    }
  }

  /**
   * Track changes between two character states
   */
  export function trackChanges(
    oldCharacter: HollowGearCharacter,
    newCharacter: HollowGearCharacter
  ): ChangeTrackingResult {
    const changes: CharacterChange[] = [];
    const timestamp = new Date();

    // Compare the two character objects recursively
    compareObjects('', oldCharacter, newCharacter, changes, timestamp);

    // Calculate summary
    const summary: Record<ChangeType, number> = {
      create: 0,
      update: 0,
      delete: 0,
      add: 0,
      remove: 0,
    };

    changes.forEach(change => {
      summary[change.type]++;
    });

    return {
      changes,
      hasChanges: changes.length > 0,
      summary,
    };
  }

  /**
   * Create an incremental update patch
   */
  export function createPatch(
    oldCharacter: HollowGearCharacter,
    newCharacter: HollowGearCharacter
  ): CharacterPatch {
    const changeResult = trackChanges(oldCharacter, newCharacter);

    return {
      id: newCharacter.id,
      version: newCharacter.version,
      timestamp: new Date(),
      changes: changeResult.changes,
      checksum: calculateChecksum(newCharacter),
    };
  }

  /**
   * Apply a patch to a character
   */
  export function applyPatch(
    character: HollowGearCharacter,
    patch: CharacterPatch
  ): Result<HollowGearCharacter, ValidationError[]> {
    try {
      let updatedCharacter = { ...character };

      // Apply each change in the patch
      for (const change of patch.changes) {
        updatedCharacter = applyChange(updatedCharacter, change);
      }

      // Update metadata
      updatedCharacter.version = patch.version;
      updatedCharacter.lastModified = patch.timestamp;

      // Verify checksum if provided
      if (patch.checksum) {
        const newChecksum = calculateChecksum(updatedCharacter);
        if (newChecksum !== patch.checksum) {
          return {
            success: false,
            error: [
              {
                field: 'checksum',
                message: 'Patch checksum mismatch - data may be corrupted',
                code: 'CHECKSUM_MISMATCH',
              },
            ],
          };
        }
      }

      return { success: true, data: updatedCharacter };
    } catch (error) {
      return {
        success: false,
        error: [
          {
            field: 'patch',
            message: `Patch application failed: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
            code: 'PATCH_FAILED',
          },
        ],
      };
    }
  }

  /**
   * Register a migration function
   */
  export function registerMigration(
    fromVersion: string,
    toVersion: string,
    migrationFunction: MigrationFunction
  ): void {
    migrations[fromVersion] = {
      toVersion,
      migrate: migrationFunction,
    };
  }

  // Private helper functions

  function toSerializable(
    character: HollowGearCharacter,
    options: SerializationOptions
  ): SerializableCharacter {
    const serializable: any = {};

    for (const [key, value] of Object.entries(character)) {
      if (value instanceof Date) {
        serializable[key] = value.toISOString();
      } else if (options.transforms && options.transforms[key]) {
        serializable[key] = options.transforms[key](value);
      } else {
        serializable[key] = value;
      }
    }

    return serializable;
  }

  function fromSerializable(
    data: SerializableCharacter,
    options: DeserializationOptions
  ): HollowGearCharacter {
    const character: any = {};

    for (const [key, value] of Object.entries(data)) {
      if (key === 'created' || key === 'lastModified') {
        character[key] = new Date(value as string);
      } else if (options.transforms && options.transforms[key]) {
        character[key] = options.transforms[key](value);
      } else {
        character[key] = value;
      }
    }

    return character as HollowGearCharacter;
  }

  function compareObjects(
    path: string,
    oldObj: any,
    newObj: any,
    changes: CharacterChange[],
    timestamp: Date
  ): void {
    // Handle null/undefined cases
    if (oldObj === null || oldObj === undefined) {
      if (newObj !== null && newObj !== undefined) {
        changes.push({
          path,
          oldValue: oldObj,
          newValue: newObj,
          timestamp,
          type: 'create',
        });
      }
      return;
    }

    if (newObj === null || newObj === undefined) {
      changes.push({
        path,
        oldValue: oldObj,
        newValue: newObj,
        timestamp,
        type: 'delete',
      });
      return;
    }

    // Handle primitive values
    if (typeof oldObj !== 'object' || typeof newObj !== 'object') {
      if (oldObj !== newObj) {
        changes.push({
          path,
          oldValue: oldObj,
          newValue: newObj,
          timestamp,
          type: 'update',
        });
      }
      return;
    }

    // Handle arrays
    if (Array.isArray(oldObj) && Array.isArray(newObj)) {
      compareArrays(path, oldObj, newObj, changes, timestamp);
      return;
    }

    // Handle objects
    const allKeys = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
    for (const key of allKeys) {
      const newPath = path ? `${path}.${key}` : key;
      compareObjects(newPath, oldObj[key], newObj[key], changes, timestamp);
    }
  }

  function compareArrays(
    path: string,
    oldArray: any[],
    newArray: any[],
    changes: CharacterChange[],
    timestamp: Date
  ): void {
    const maxLength = Math.max(oldArray.length, newArray.length);

    for (let i = 0; i < maxLength; i++) {
      const itemPath = `${path}[${i}]`;

      if (i >= oldArray.length) {
        // Item added
        changes.push({
          path: itemPath,
          oldValue: undefined,
          newValue: newArray[i],
          timestamp,
          type: 'add',
        });
      } else if (i >= newArray.length) {
        // Item removed
        changes.push({
          path: itemPath,
          oldValue: oldArray[i],
          newValue: undefined,
          timestamp,
          type: 'remove',
        });
      } else {
        // Item potentially changed
        compareObjects(itemPath, oldArray[i], newArray[i], changes, timestamp);
      }
    }
  }

  function applyChange(
    character: HollowGearCharacter,
    change: CharacterChange
  ): HollowGearCharacter {
    const pathParts = change.path.split('.');
    const updatedCharacter = JSON.parse(JSON.stringify(character)); // Deep clone

    let current = updatedCharacter;
    for (let i = 0; i < pathParts.length - 1; i++) {
      const part = pathParts[i];
      if (part && part.includes('[') && part.includes(']')) {
        // Handle array access
        const splitResult = part.split('[');
        if (splitResult.length >= 2) {
          const key = splitResult[0];
          const indexStr = splitResult[1];
          if (indexStr && key) {
            const index = parseInt(indexStr.replace(']', ''));
            if (!isNaN(index) && current[key] && Array.isArray(current[key])) {
              current = current[key][index];
            }
          }
        }
      } else if (part) {
        current = current[part];
      }
    }

    const finalKey = pathParts[pathParts.length - 1];
    if (finalKey && (change.type === 'delete' || change.type === 'remove')) {
      delete current[finalKey];
    } else if (finalKey) {
      current[finalKey] = change.newValue;
    }

    return updatedCharacter;
  }

  function calculateChecksum(character: HollowGearCharacter): string {
    // Simple checksum calculation - in production, use a proper hash function
    const serialized = JSON.stringify(character, Object.keys(character).sort());
    let hash = 0;
    for (let i = 0; i < serialized.length; i++) {
      const char = serialized.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}

/**
 * Character patch for incremental updates
 */
export interface CharacterPatch {
  /** Character ID this patch applies to */
  id: string;
  /** Target version after applying patch */
  version: string;
  /** When this patch was created */
  timestamp: Date;
  /** List of changes in this patch */
  changes: CharacterChange[];
  /** Optional checksum for verification */
  checksum?: string;
}

/**
 * Patch application result
 */
export type PatchResult = Result<HollowGearCharacter, ValidationError[]>;
