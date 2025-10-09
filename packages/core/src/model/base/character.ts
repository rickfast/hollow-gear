/**
 * Base character interface and core character data structures
 * This will be expanded in subsequent tasks
 */

import type { CharacterId } from '../types/common.js';

/**
 * Basic character metadata that all characters share
 */
export interface BaseCharacterData {
  /** Unique identifier for the character */
  id: CharacterId;
  /** Character name */
  name: string;
  /** Data model version for migration support */
  version: string;
  /** When the character was created */
  created: Date;
  /** When the character was last modified */
  lastModified: Date;
}

/**
 * Utility functions for character metadata
 */
export namespace CharacterUtils {
  /**
   * Create a new character ID
   */
  export function createCharacterId(): CharacterId {
    return crypto.randomUUID() as CharacterId;
  }

  /**
   * Update the last modified timestamp
   */
  export function updateLastModified<T extends BaseCharacterData>(character: T): T {
    return {
      ...character,
      lastModified: new Date()
    };
  }

  /**
   * Create base character data
   */
  export function createBaseCharacterData(name: string, version: string = '1.0.0'): BaseCharacterData {
    const now = new Date();
    return {
      id: createCharacterId(),
      name,
      version,
      created: now,
      lastModified: now
    };
  }
}