/**
 * Resource management types for tracking pools like HP, AFP, spell slots, etc.
 */

import type { ValidationResult, ValidationError } from './common.js';

/**
 * Represents a resource pool with current, maximum, and temporary values
 * Used for hit points, Aether Flux Points, spell slots, etc.
 */
export interface ResourcePool {
  /** Current amount of the resource */
  current: number;
  /** Maximum amount of the resource */
  maximum: number;
  /** Temporary bonus to the maximum (doesn't affect current) */
  temporary: number;
}

/**
 * Utility functions for resource pool management
 */
export namespace ResourcePoolUtils {
  /**
   * Calculate the effective maximum including temporary bonuses
   */
  export function getEffectiveMaximum(pool: ResourcePool): number {
    return pool.maximum + pool.temporary;
  }

  /**
   * Create a new resource pool
   */
  export function createResourcePool(
    maximum: number,
    current?: number,
    temporary: number = 0
  ): ResourcePool {
    return {
      current: current ?? maximum,
      maximum,
      temporary
    };
  }

  /**
   * Spend resources from a pool, returning the new pool state
   */
  export function spendResources(pool: ResourcePool, amount: number): ResourcePool {
    const newCurrent = Math.max(0, pool.current - amount);
    return {
      ...pool,
      current: newCurrent
    };
  }

  /**
   * Restore resources to a pool, capped at effective maximum
   */
  export function restoreResources(pool: ResourcePool, amount: number): ResourcePool {
    const effectiveMax = getEffectiveMaximum(pool);
    const newCurrent = Math.min(effectiveMax, pool.current + amount);
    return {
      ...pool,
      current: newCurrent
    };
  }

  /**
   * Set the current value directly, capped at effective maximum
   */
  export function setCurrentResources(pool: ResourcePool, amount: number): ResourcePool {
    const effectiveMax = getEffectiveMaximum(pool);
    const newCurrent = Math.max(0, Math.min(effectiveMax, amount));
    return {
      ...pool,
      current: newCurrent
    };
  }

  /**
   * Check if the pool has enough resources for a given cost
   */
  export function hasResources(pool: ResourcePool, cost: number): boolean {
    return pool.current >= cost;
  }

  /**
   * Get the percentage of resources remaining (0-1)
   */
  export function getResourcePercentage(pool: ResourcePool): number {
    const effectiveMax = getEffectiveMaximum(pool);
    return effectiveMax > 0 ? pool.current / effectiveMax : 0;
  }

  /**
   * Validate a resource pool
   */
  export function validateResourcePool(pool: ResourcePool, context: string): ValidationResult<ResourcePool> {
    const errors: ValidationError[] = [];

    if (!Number.isInteger(pool.current) || pool.current < 0) {
      errors.push({
        field: `${context}.current`,
        message: 'Current resources must be a non-negative integer',
        code: 'INVALID_CURRENT'
      });
    }

    if (!Number.isInteger(pool.maximum) || pool.maximum < 0) {
      errors.push({
        field: `${context}.maximum`,
        message: 'Maximum resources must be a non-negative integer',
        code: 'INVALID_MAXIMUM'
      });
    }

    if (!Number.isInteger(pool.temporary)) {
      errors.push({
        field: `${context}.temporary`,
        message: 'Temporary resources must be an integer',
        code: 'INVALID_TEMPORARY'
      });
    }

    const effectiveMax = getEffectiveMaximum(pool);
    if (pool.current > effectiveMax) {
      errors.push({
        field: `${context}.current`,
        message: 'Current resources cannot exceed effective maximum',
        code: 'CURRENT_EXCEEDS_MAXIMUM',
        context: { current: pool.current, effectiveMaximum: effectiveMax }
      });
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: pool };
  }
}