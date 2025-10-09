/**
 * Hollow Gear class system
 *
 * This module defines the seven Hollow Gear classes and their mechanics,
 * including archetypes, features, and progression systems.
 */

import type { AbilityScore, DieType } from '../types/common.js';

/**
 * The seven Hollow Gear classes available to players
 */
export type HollowGearClass =
  | 'arcanist' // Spellcaster using Aether Formulae
  | 'templar' // Divine spellcaster using Resonance Charges
  | 'tweaker' // Equipment specialist and inventor
  | 'shadehand' // Stealth and infiltration expert
  | 'vanguard' // Front-line fighter and protector
  | 'artifex' // Crafter and equipment master
  | 'mindweaver'; // Psionic specialist

/**
 * Represents a character's class level and associated data
 */
export interface CharacterClass {
  /** The class type */
  className: HollowGearClass;
  /** Current level in this class (1-20) */
  level: number;
  /** Selected archetype/subclass (chosen at appropriate level) */
  archetype?: ClassArchetype;
  /** Hit die type for this class */
  hitDie: DieType;
  /** Primary ability score for this class */
  primaryAbility: AbilityScore;
  /** Class features gained at current level */
  features: ClassFeature[];
  /** Spellcasting data if this class has spellcasting */
  spellcasting?: ClassSpellcasting;
  /** Psionic data if this class has psionic abilities */
  psionics?: ClassPsionics;
  /** Class-specific resources */
  resources?: ClassResources;
}

/**
 * Represents a class feature gained at a specific level
 */
export interface ClassFeature {
  /** Unique identifier for this feature */
  id: string;
  /** Display name of the feature */
  name: string;
  /** Level at which this feature is gained */
  level: number;
  /** Detailed description of the feature */
  description: string;
  /** Optional mechanical effects of the feature */
  mechanics?: FeatureMechanics;
  /** Whether this feature can be used multiple times */
  uses?: FeatureUses;
  /** Prerequisites for this feature */
  prerequisites?: FeaturePrerequisites;
}

/**
 * Mechanical effects and rules for a class feature
 */
export interface FeatureMechanics {
  /** Type of mechanical effect */
  type: FeatureMechanicType;
  /** Specific effects and modifiers */
  effects: FeatureEffect[];
  /** Activation requirements */
  activation?: FeatureActivation;
  /** Duration of the effect */
  duration?: FeatureDuration;
  /** Range or area of effect */
  range?: FeatureRange;
}

/**
 * Types of mechanical effects a feature can have
 */
export type FeatureMechanicType =
  | 'passive' // Always active
  | 'action' // Requires an action to use
  | 'bonus_action' // Requires a bonus action
  | 'reaction' // Triggered reaction
  | 'free' // No action required
  | 'ritual' // Special ritual activation
  | 'resource'; // Consumes a resource

/**
 * Specific effect of a feature
 */
export interface FeatureEffect {
  /** Type of effect */
  type: FeatureEffectType;
  /** Target of the effect */
  target: FeatureTarget;
  /** Magnitude or value of the effect */
  value?: number | string;
  /** Conditions under which the effect applies */
  conditions?: string[];
}

/**
 * Types of effects a feature can produce
 */
export type FeatureEffectType =
  | 'ability_bonus' // Bonus to ability scores
  | 'skill_bonus' // Bonus to skill checks
  | 'save_bonus' // Bonus to saving throws
  | 'ac_bonus' // Bonus to armor class
  | 'hp_bonus' // Bonus to hit points
  | 'damage_bonus' // Bonus to damage rolls
  | 'attack_bonus' // Bonus to attack rolls
  | 'speed_bonus' // Bonus to movement speed
  | 'resistance' // Damage resistance
  | 'immunity' // Damage immunity
  | 'advantage' // Advantage on rolls
  | 'disadvantage' // Disadvantage on rolls
  | 'proficiency' // Gain proficiency
  | 'expertise' // Gain expertise
  | 'special'; // Special unique effect

/**
 * Target of a feature effect
 */
export type FeatureTarget =
  | 'self' // Affects the character
  | 'ally' // Affects an ally
  | 'enemy' // Affects an enemy
  | 'area' // Affects an area
  | 'equipment' // Affects equipment
  | 'environment'; // Affects environment

/**
 * Usage limitations for a feature
 */
export interface FeatureUses {
  /** Maximum uses per rest period */
  maximum: number;
  /** Current remaining uses */
  current: number;
  /** When uses are restored */
  restoreOn: RestType;
  /** Whether uses scale with level */
  scalesWithLevel?: boolean;
  /** Ability modifier that affects uses */
  abilityModifier?: AbilityScore;
}

/**
 * Types of rest that can restore feature uses
 */
export type RestType = 'short' | 'long' | 'dawn' | 'never';

/**
 * Prerequisites for gaining or using a feature
 */
export interface FeaturePrerequisites {
  /** Minimum level required */
  level?: number;
  /** Required ability score minimums */
  abilities?: Partial<Record<AbilityScore, number>>;
  /** Required other features */
  features?: string[];
  /** Required equipment or items */
  equipment?: string[];
  /** Other custom requirements */
  custom?: string[];
}

/**
 * Activation requirements for a feature
 */
export interface FeatureActivation {
  /** Action type required */
  actionType: FeatureMechanicType;
  /** Resource cost if any */
  cost?: ResourceCost;
  /** Range requirement */
  range?: number;
  /** Target requirements */
  targeting?: TargetingRequirements;
}

/**
 * Duration of a feature effect
 */
export interface FeatureDuration {
  /** Type of duration */
  type: DurationType;
  /** Duration value (in rounds, minutes, etc.) */
  value?: number;
  /** Whether concentration is required */
  concentration?: boolean;
}

/**
 * Types of duration
 */
export type DurationType =
  | 'instantaneous'
  | 'rounds'
  | 'minutes'
  | 'hours'
  | 'days'
  | 'permanent'
  | 'until_rest'
  | 'until_triggered';

/**
 * Range specification for a feature
 */
export interface FeatureRange {
  /** Type of range */
  type: RangeType;
  /** Range value in feet */
  value?: number;
}

/**
 * Types of range
 */
export type RangeType = 'self' | 'touch' | 'ranged' | 'sight' | 'unlimited';

/**
 * Resource cost for using a feature
 */
export interface ResourceCost {
  /** Type of resource consumed */
  type: ResourceType;
  /** Amount consumed */
  amount: number;
}

/**
 * Types of resources that can be consumed
 */
export type ResourceType =
  | 'spell_slot'
  | 'afp' // Aether Flux Points
  | 'resonance_charge'
  | 'heat_point'
  | 'steam_charge'
  | 'aether_cell'
  | 'custom';

/**
 * Targeting requirements for a feature
 */
export interface TargetingRequirements {
  /** Number of targets */
  count: number;
  /** Type of valid targets */
  type: TargetType[];
  /** Line of sight required */
  lineOfSight?: boolean;
  /** Size restrictions */
  sizeRestrictions?: CreatureSize[];
}

/**
 * Valid target types
 */
export type TargetType = 'creature' | 'object' | 'point' | 'area' | 'self_only';

/**
 * Creature size categories
 */
export type CreatureSize =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'huge'
  | 'gargantuan';

/**
 * Class archetype/subclass information
 */
export interface ClassArchetype {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Class this archetype belongs to */
  parentClass: HollowGearClass;
  /** Level at which this archetype is chosen */
  selectionLevel: number;
  /** Description of the archetype */
  description: string;
  /** Features granted by this archetype */
  features: ClassFeature[];
}

/**
 * Spellcasting information for a class
 */
export interface ClassSpellcasting {
  /** Type of spellcasting */
  type: SpellcastingType;
  /** Spellcasting ability */
  ability: AbilityScore;
  /** Whether this is a full, half, or third caster */
  progression: SpellcastingProgression;
  /** Known spells or spells prepared */
  spellsKnown?: number[];
  /** Spell slots by level (table: [level][spell_level]) */
  spellSlots?: number[][];
  /** Ritual casting ability */
  ritualCasting?: boolean;
  /** Spellcasting focus required */
  focus?: SpellcastingFocus;
}

/**
 * Types of spellcasting systems
 */
export type SpellcastingType =
  | 'arcanist' // Aether Formulae
  | 'templar'; // Resonance Charges

/**
 * Spellcasting progression types
 */
export type SpellcastingProgression =
  | 'full' // Full caster (Arcanist, Templar)
  | 'half' // Half caster
  | 'third' // Third caster
  | 'warlock'; // Warlock-style (short rest recovery)

/**
 * Spellcasting focus types
 */
export type SpellcastingFocus =
  | 'arcane_focus'
  | 'holy_symbol'
  | 'component_pouch'
  | 'natural'
  | 'none';

/**
 * Psionic abilities for a class
 */
export interface ClassPsionics {
  /** Primary psionic ability */
  ability: AbilityScore;
  /** Aether Flux Points progression */
  afpProgression: number[];
  /** Known disciplines */
  disciplines: PsionicDiscipline[];
  /** Powers known by level */
  powersKnown: number[];
  /** Focus limit */
  focusLimit: number;
}

/**
 * Psionic disciplines
 */
export type PsionicDiscipline =
  | 'flux' // Energy manipulation
  | 'echo' // Sound and vibration
  | 'eidolon' // Illusion and phantasm
  | 'empyric' // Mind and emotion
  | 'veil' // Concealment and stealth
  | 'kinesis'; // Movement and force

/**
 * Class-specific resources
 */
export interface ClassResources {
  /** Resource pools specific to this class */
  pools: ResourcePool[];
  /** Special mechanics or currencies */
  special?: Record<string, number>;
}

/**
 * A pool of resources (like spell slots, AFP, etc.)
 */
export interface ResourcePool {
  /** Type of resource */
  type: ResourceType;
  /** Current amount */
  current: number;
  /** Maximum amount */
  maximum: number;
  /** Temporary bonus amount */
  temporary: number;
  /** When this resource recovers */
  recovery: RestType;
}

// Re-export common types for convenience
export type { AbilityScore, DieType } from '../types/common.js';

// Export class data and utilities
export * from './class-data.js';

// Export progression system
export * from './progression.js';
