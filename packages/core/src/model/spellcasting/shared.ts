/**
 * Shared spellcasting infrastructure for Hollow Gear TTRPG
 * Common types and interfaces used by both Arcanist and Templar spellcasting systems
 */

import type { AbilityScore } from '../types/common.js';
import type { ResourcePool } from '../types/resources.js';
import type { PsionicSignature } from '../psionics/overload.js';

/**
 * The two spellcasting types available in Hollow Gear
 */
export type SpellcastingType = 'arcanist' | 'templar';

/**
 * Standard D&D 5e spell schools with Hollow Gear naming
 */
export type SpellSchool = 
  | 'abjuration'
  | 'conjuration'
  | 'divination'
  | 'enchantment'
  | 'evocation'
  | 'illusion'
  | 'necromancy'
  | 'transmutation';

/**
 * Spell components required for casting
 */
export interface SpellComponents {
  /** Verbal component required */
  verbal: boolean;
  /** Somatic component required */
  somatic: boolean;
  /** Material component required */
  material: boolean;
  /** Specific material component description */
  materialComponent?: string;
  /** Component has a cost */
  materialCost?: number;
  /** Component is consumed when cast */
  materialConsumed?: boolean;
}

/**
 * A spell known by a character with both D&D and Hollow Gear names
 */
export interface KnownSpell {
  /** Unique identifier for the spell */
  id: string;
  /** Standard D&D 5e spell name */
  name: string;
  /** Spell level (0-9) */
  level: number;
  /** Spell school */
  school: SpellSchool;
  /** Hollow Gear thematic name (e.g., "Arc Pulse Array" for Magic Missile) */
  hollowGearName: string;
  /** Required components for casting */
  components: SpellComponents;
  /** Casting time description */
  castingTime: string;
  /** Range description */
  range: string;
  /** Duration description */
  duration: string;
  /** Whether the spell requires concentration */
  concentration: boolean;
  /** Psionic signature left by the spell (if any) */
  psionicSignature?: PsionicSignature;
  /** Brief description of the spell's effects */
  description: string;
  /** Higher level casting effects */
  higherLevels?: string;
}

/**
 * Base spellcasting data shared by all casters
 */
export interface BaseSpellcastingData {
  /** Type of spellcasting (Arcanist or Templar) */
  type: SpellcastingType;
  /** Effective caster level for spell calculations */
  casterLevel: number;
  /** Primary spellcasting ability */
  spellcastingAbility: AbilityScore;
  /** Spells known by the character */
  knownSpells: KnownSpell[];
  /** Current heat points accumulated */
  heatPoints: number;
  /** Maximum heat points before feedback */
  maxHeatPoints: number;
}

/**
 * Heat point management utilities
 */
export namespace HeatPointUtils {
  /**
   * Calculate heat point threshold for feedback effects
   */
  export function getFeedbackThreshold(maxHeatPoints: number): number {
    return Math.floor(maxHeatPoints * 0.75);
  }

  /**
   * Check if character is in heat feedback range
   */
  export function isInFeedbackRange(current: number, max: number): boolean {
    return current >= getFeedbackThreshold(max);
  }

  /**
   * Calculate heat dissipation per rest
   */
  export function calculateHeatDissipation(restType: 'short' | 'long'): number {
    return restType === 'long' ? Infinity : 2; // Long rest clears all heat, short rest reduces by 2
  }

  /**
   * Apply heat point gain with maximum cap
   */
  export function addHeatPoints(current: number, gain: number, max: number): number {
    return Math.min(max, current + gain);
  }

  /**
   * Apply heat point reduction with minimum of 0
   */
  export function reduceHeatPoints(current: number, reduction: number): number {
    return Math.max(0, current - reduction);
  }
}

/**
 * Spell component validation utilities
 */
export namespace SpellComponentUtils {
  /**
   * Check if a character can provide the required components
   */
  export function canProvideComponents(
    spell: KnownSpell,
    hasSpellcastingFocus: boolean,
    hasMaterialComponents: boolean,
    availableFunds: number = 0
  ): { canCast: boolean; missingComponents: string[] } {
    const missing: string[] = [];

    // Verbal components can be blocked by silence or being unable to speak
    // This would be checked by the calling code based on character conditions

    // Somatic components require free hands or a spellcasting focus
    if (spell.components.somatic && !hasSpellcastingFocus) {
      // This would need to be validated by checking if hands are free
      // For now, we assume this is handled by the UI/character sheet
    }

    // Material components
    if (spell.components.material) {
      if (spell.components.materialCost && spell.components.materialCost > 0) {
        // Costly components cannot be replaced by a focus
        if (!hasMaterialComponents || availableFunds < spell.components.materialCost) {
          missing.push(`Material component: ${spell.components.materialComponent || 'costly component'}`);
        }
      } else if (!hasSpellcastingFocus && !hasMaterialComponents) {
        // Non-costly components can be replaced by a focus
        missing.push(`Material component or spellcasting focus`);
      }
    }

    return {
      canCast: missing.length === 0,
      missingComponents: missing
    };
  }

  /**
   * Get a description of required components for display
   */
  export function getComponentDescription(components: SpellComponents): string {
    const parts: string[] = [];
    
    if (components.verbal) parts.push('V');
    if (components.somatic) parts.push('S');
    if (components.material) {
      if (components.materialComponent) {
        parts.push(`M (${components.materialComponent})`);
      } else {
        parts.push('M');
      }
    }

    return parts.join(', ');
  }
}

/**
 * Spell level validation utilities
 */
export namespace SpellLevelUtils {
  /**
   * Validate that a spell level is within valid bounds
   */
  export function isValidSpellLevel(level: number): boolean {
    return Number.isInteger(level) && level >= 0 && level <= 9;
  }

  /**
   * Get the spell level name (e.g., "cantrip" for level 0)
   */
  export function getSpellLevelName(level: number): string {
    if (level === 0) return 'cantrip';
    if (level === 1) return '1st level';
    if (level === 2) return '2nd level';
    if (level === 3) return '3rd level';
    return `${level}th level`;
  }

  /**
   * Calculate spell slot level for multiclass casters
   */
  export function calculateMulticlassSpellSlots(
    arcanistLevels: number,
    templarLevels: number
  ): number {
    // Both Arcanist and Templar are full casters in Hollow Gear
    return arcanistLevels + templarLevels;
  }
}