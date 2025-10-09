/**
 * Common types and utilities for the Hollow Gear character model system
 */

/**
 * Standard D&D dice types used throughout the system
 */
export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

/**
 * The six core ability scores in D&D 5e
 */
export type AbilityScore = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

/**
 * Result type for operations that can succeed or fail
 * Used throughout the system for error handling and validation
 */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

/**
 * Specialized result type for validation operations
 */
export type ValidationResult<T> = Result<T, ValidationError[]>;

/**
 * Represents a validation error with context
 */
export interface ValidationError {
  /** The field or property that failed validation */
  field: string;
  /** Human-readable error message */
  message: string;
  /** Error code for programmatic handling */
  code: string;
  /** Additional context about the error */
  context?: Record<string, unknown>;
}

/**
 * Utility type for creating branded/nominal types
 * Helps prevent mixing up similar primitive types
 */
export type Brand<T, B> = T & { readonly __brand: B };

/**
 * Branded type for character IDs
 */
export type CharacterId = Brand<string, 'CharacterId'>;

/**
 * Branded type for equipment IDs
 */
export type EquipmentId = Brand<string, 'EquipmentId'>;

/**
 * Branded type for mod IDs
 */
export type ModId = Brand<string, 'ModId'>;

/**
 * Utility type for making all properties of an object optional recursively
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Utility type for making specific properties required
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Utility type for creating immutable versions of objects
 */
export type Immutable<T> = {
  readonly [P in keyof T]: T[P] extends object ? Immutable<T[P]> : T[P];
};

/**
 * Helper function to create a successful Result
 */
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/**
 * Helper function to create a failed Result
 */
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Helper function to create a ValidationError
 */
export function validationError(
  field: string, 
  message: string, 
  code: string, 
  context?: Record<string, unknown>
): ValidationError {
  return { field, message, code, context };
}

/**
 * Helper function to create a successful ValidationResult
 */
export function validationSuccess<T>(data: T): ValidationResult<T> {
  return success(data);
}

/**
 * Helper function to create a failed ValidationResult
 */
export function validationFailure<T>(errors: ValidationError[]): ValidationResult<T> {
  return failure(errors);
}