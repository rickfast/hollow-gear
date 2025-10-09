/**
 * # Hollow Gear Character Models
 * 
 * This module provides comprehensive TypeScript types and interfaces for representing 
 * D&D 5e characters enhanced with Hollow Gear mechanics. It serves as the foundation 
 * for character creation, management, and gameplay functionality in the Hollow Gear 
 * TTRPG mobile application.
 * 
 * ## Key Features
 * 
 * - **Type-Safe Character Models**: Comprehensive TypeScript interfaces for all character data
 * - **Modular Architecture**: Organized by functional areas (species, classes, equipment, etc.)
 * - **Offline-First Design**: Optimized for mobile app usage without internet connectivity
 * - **Serialization Support**: Built-in JSON serialization and data migration capabilities
 * - **Validation System**: Comprehensive validation for character data integrity
 * 
 * ## Basic Usage
 * 
 * ### Creating a New Character
 * 
 * ```typescript
 * import { CharacterUtils, type CharacterCreationParams } from '@hollow-gear/character-models';
 * 
 * const params: CharacterCreationParams = {
 *   name: "Zara Cogwright",
 *   species: "vulmir",
 *   startingClass: "arcanist",
 *   abilityScores: {
 *     strength: 10,
 *     dexterity: 16,
 *     constitution: 14,
 *     intelligence: 15,
 *     wisdom: 12,
 *     charisma: 13
 *   }
 * };
 * 
 * const result = await CharacterUtils.createCharacter(params);
 * if (result.success) {
 *   console.log('Character created:', result.data.name);
 * } else {
 *   console.error('Creation failed:', result.error);
 * }
 * ```
 * 
 * ### Working with Character Data
 * 
 * ```typescript
 * import { type HollowGearCharacter, CharacterUtils } from '@hollow-gear/character-models';
 * 
 * function displayCharacterInfo(character: HollowGearCharacter) {
 *   console.log(`${character.name} - Level ${character.level} ${character.species}`);
 *   
 *   // Check for special abilities
 *   if (CharacterUtils.hasSpellcastingAbilities(character)) {
 *     console.log('Has spellcasting abilities');
 *   }
 *   
 *   if (CharacterUtils.hasPsionicAbilities(character)) {
 *     console.log('Has psionic abilities');
 *   }
 * }
 * ```
 * 
 * ### Serialization and Storage
 * 
 * ```typescript
 * import { SerializationUtils, type HollowGearCharacter } from '@hollow-gear/character-models';
 * 
 * // Serialize character for storage
 * const serialized = SerializationUtils.serialize(character);
 * localStorage.setItem('character', JSON.stringify(serialized.data));
 * 
 * // Deserialize character from storage
 * const stored = JSON.parse(localStorage.getItem('character')!);
 * const deserialized = SerializationUtils.deserialize(stored);
 * if (deserialized.success) {
 *   const character: HollowGearCharacter = deserialized.data;
 * }
 * ```
 * 
 * ### Equipment Management
 * 
 * ```typescript
 * import { EquipmentUtils, type Equipment } from '@hollow-gear/character-models';
 * 
 * // Check if equipment can be equipped
 * const canEquip = EquipmentUtils.canEquip(character, weapon);
 * if (canEquip.success) {
 *   // Equip the weapon
 *   character.equipment.mainHand = weapon;
 * }
 * ```
 * 
 * ### Psionic Powers
 * 
 * ```typescript
 * import { type PsionicData, type PsionicPower } from '@hollow-gear/character-models';
 * 
 * function usePsionicPower(character: HollowGearCharacter, power: PsionicPower) {
 *   if (!character.psionics) return;
 *   
 *   const afp = character.psionics.aetherFluxPoints;
 *   if (afp.current >= power.afpCost) {
 *     // Use the power
 *     afp.current -= power.afpCost;
 *     console.log(`Used ${power.name} for ${power.afpCost} AFP`);
 *   }
 * }
 * ```
 * 
 * ## Module Organization
 * 
 * The character models are organized into logical modules:
 * 
 * - **Core Types**: Basic utility types and validation systems
 * - **Base Mechanics**: Core D&D 5e character mechanics (abilities, combat, skills)
 * - **Species System**: Etherborne species traits and abilities
 * - **Class System**: Hollow Gear classes, features, and progression
 * - **Equipment System**: Weapons, armor, modifications, and inventory
 * - **Psionic System**: Mindcraft disciplines and powers
 * - **Spellcasting System**: Arcanist and Templar magic systems
 * - **Hollow Gear Mechanics**: Heat stress, currency, and maintenance
 * - **Character Progression**: Experience, advancement, and multiclassing
 * 
 * @packageDocumentation
 */

// =============================================================================
// CORE TYPES AND UTILITIES
// =============================================================================

/**
 * ## Core Types and Utilities
 * 
 * Fundamental types used throughout the character model system, including
 * validation, error handling, and basic D&D mechanics.
 * 
 * @example
 * ```typescript
 * import { type Result, success, failure } from '@hollow-gear/character-models';
 * 
 * function validateAbilityScore(score: number): Result<number, string> {
 *   if (score < 3 || score > 18) {
 *     return failure('Ability score must be between 3 and 18');
 *   }
 *   return success(score);
 * }
 * ```
 */
export type {
  /**
   * Generic result type for operations that can succeed or fail.
   * Used throughout the system for error handling and validation.
   * 
   * @template T - The success data type
   * @template E - The error type (defaults to Error)
   */
  Result,
  
  /**
   * Specialized result type for validation operations.
   * Always uses ValidationError[] as the error type.
   * 
   * @template T - The data type being validated
   */
  ValidationResult,
  
  /**
   * Represents a validation error with context information.
   * Used to provide detailed feedback about what went wrong during validation.
   */
  ValidationError,
  
  /**
   * Utility type for creating branded/nominal types.
   * Helps prevent mixing up similar primitive types like different ID types.
   * 
   * @template T - The base type to brand
   * @template B - The brand identifier
   */
  Brand,
  
  /**
   * Utility type for making all properties of an object optional recursively.
   * Useful for partial updates and optional configuration objects.
   * 
   * @template T - The type to make deeply partial
   */
  DeepPartial,
  
  /**
   * Utility type for making specific properties required while keeping others optional.
   * 
   * @template T - The base type
   * @template K - The keys to make required
   */
  RequireFields,
  
  /**
   * Utility type for creating immutable versions of objects.
   * All properties become readonly recursively.
   * 
   * @template T - The type to make immutable
   */
  Immutable,
  
  /**
   * Standard D&D dice types used throughout the system.
   * Represents the different polyhedral dice used in tabletop gaming.
   */
  DieType,
  
  /**
   * The six core ability scores in D&D 5e.
   * These form the foundation of character capabilities.
   */
  AbilityScore,
  
  /**
   * Branded type for character IDs to prevent mixing with other ID types.
   */
  CharacterId,
  
  /**
   * Branded type for equipment IDs to prevent mixing with other ID types.
   */
  EquipmentId,
  
  /**
   * Branded type for modification IDs to prevent mixing with other ID types.
   */
  ModId
} from './types/common.js';

export {
  /**
   * Helper function to create a successful Result.
   * 
   * @param data - The success data
   * @returns A successful Result containing the data
   * 
   * @example
   * ```typescript
   * const result = success({ name: "Zara", level: 5 });
   * // result.success === true, result.data === { name: "Zara", level: 5 }
   * ```
   */
  success,
  
  /**
   * Helper function to create a failed Result.
   * 
   * @param error - The error information
   * @returns A failed Result containing the error
   * 
   * @example
   * ```typescript
   * const result = failure("Invalid character name");
   * // result.success === false, result.error === "Invalid character name"
   * ```
   */
  failure,
  
  /**
   * Helper function to create a ValidationError.
   * 
   * @param field - The field that failed validation
   * @param message - Human-readable error message
   * @param code - Error code for programmatic handling
   * @param context - Additional context about the error
   * @returns A ValidationError object
   */
  validationError,
  
  /**
   * Helper function to create a successful ValidationResult.
   * 
   * @param data - The validated data
   * @returns A successful ValidationResult
   */
  validationSuccess,
  
  /**
   * Helper function to create a failed ValidationResult.
   * 
   * @param errors - Array of validation errors
   * @returns A failed ValidationResult
   */
  validationFailure
} from './types/common.js';

/**
 * ## Ability Score System
 * 
 * D&D 5e ability score mechanics with support for racial bonuses, 
 * enhancements, and temporary modifiers.
 * 
 * @example
 * ```typescript
 * import { AbilityScoreUtils, type AbilityScoreData } from '@hollow-gear/character-models';
 * 
 * // Create an ability score with racial bonus
 * const dexterity = AbilityScoreUtils.createAbilityScore(14, 2); // Base 14, +2 racial
 * console.log(dexterity.modifier); // +3 modifier
 * 
 * // Calculate total score
 * const total = AbilityScoreUtils.calculateTotal(dexterity);
 * console.log(total); // 16
 * ```
 */
export type {
  /**
   * Represents a complete ability score with all modifiers.
   * Includes base score, racial bonuses, enhancements, and temporary effects.
   */
  AbilityScoreData,
  
  /**
   * Complete set of ability scores for a character.
   * Contains all six D&D 5e ability scores with their modifiers.
   */
  AbilityScores,
  
  /**
   * Represents an ability score increase from species, feats, or other sources.
   * Used during character creation and advancement.
   */
  AbilityScoreIncrease
} from './types/abilities.js';

export { 
  /**
   * Utility functions for ability score calculations and validation.
   * Provides methods for creating, modifying, and validating ability scores.
   */
  AbilityScoreUtils 
} from './types/abilities.js';

/**
 * Resource management types (ResourcePool from this module takes precedence)
 */
export type {
  ResourcePool
} from './types/resources.js';

export { ResourcePoolUtils } from './types/resources.js';

// =============================================================================
// BASE CHARACTER MECHANICS
// =============================================================================

/**
 * Core D&D 5e character mechanics
 */
export * from './base/index.js';

// =============================================================================
// SPECIES SYSTEM
// =============================================================================

/**
 * ## Etherborne Species System
 * 
 * The seven Etherborne species available in Hollow Gear, each with unique
 * traits, abilities, and cultural characteristics.
 * 
 * @example
 * ```typescript
 * import { SpeciesTraitsUtils, type EtherborneSpecies } from '@hollow-gear/character-models';
 * 
 * const species: EtherborneSpecies = 'vulmir';
 * const displayName = SpeciesTraitsUtils.getSpeciesDisplayName(species);
 * console.log(displayName); // "Vulmir"
 * 
 * const description = SpeciesTraitsUtils.getSpeciesBrief(species);
 * console.log(description); // "Cunning illusionists and saboteurs..."
 * ```
 */
export type {
  /**
   * Union type representing all seven Etherborne species.
   * Each species has unique traits, abilities, and cultural characteristics.
   * 
   * - **aqualoth**: Amphibious scholars and bio-mechanical engineers
   * - **vulmir**: Cunning illusionists and saboteurs  
   * - **rendai**: Inventors, mechanics, and cheerful scavengers
   * - **karnathi**: Stalwart defenders and psionic knights
   * - **tharn**: Nomadic guardians of the wild gears
   * - **skellin**: Wall-crawling scouts and infiltrators
   * - **avenar**: Scholars of the skies, calm and calculating
   */
  EtherborneSpecies,
  
  /**
   * Complete trait package for an Etherborne species.
   * Includes ability score increases, movement speeds, special abilities,
   * languages, and cultural information.
   */
  SpeciesTraits,
  
  /**
   * Shared traits that all Etherborne possess.
   * These represent the common heritage and connection to Aether technology.
   */
  EtherborneTraits,
  
  /**
   * Represents a special ability granted by a species.
   * Can include active abilities, passive traits, or situational bonuses.
   */
  SpecialAbility,
  
  /**
   * Usage limitations for special abilities.
   * Defines how often an ability can be used and when it recharges.
   */
  AbilityUsage,
  
  /**
   * Mechanical effects of special abilities.
   * Defines damage, bonuses, ranges, and other game mechanics.
   */
  AbilityMechanics,
  
  /**
   * Movement speeds for different types of locomotion.
   * Includes walking, swimming, climbing, and flying speeds.
   */
  MovementSpeeds,
  
  /**
   * Language proficiencies available in the Hollow Gear setting.
   * Includes common languages and specialized dialects.
   */
  Language
} from './species/index.js';

export { 
  /**
   * Utility functions for working with species traits.
   * Provides methods for validation, display names, and trait management.
   */
  SpeciesTraitsUtils 
} from './species/index.js';

// =============================================================================
// CLASS SYSTEM
// =============================================================================

/**
 * ## Hollow Gear Class System
 * 
 * The seven Hollow Gear classes, each with unique mechanics, archetypes,
 * and progression systems that blend D&D 5e with steampunk technology.
 * 
 * @example
 * ```typescript
 * import { type HollowGearClass, type CharacterClass } from '@hollow-gear/character-models';
 * 
 * const arcanistClass: CharacterClass = {
 *   className: 'arcanist',
 *   level: 3,
 *   hitDie: 'd6',
 *   primaryAbility: 'intelligence',
 *   features: [
 *     // Class features gained at levels 1-3
 *   ],
 *   spellcasting: {
 *     type: 'arcanist',
 *     ability: 'intelligence',
 *     progression: 'full'
 *   }
 * };
 * ```
 */
export type {
  /**
   * The seven Hollow Gear classes available to players.
   * Each class represents a different approach to combining magic and technology.
   * 
   * - **arcanist**: Spellcaster using Aether Formulae
   * - **templar**: Divine spellcaster using Resonance Charges  
   * - **tweaker**: Equipment specialist and inventor
   * - **shadehand**: Stealth and infiltration expert
   * - **vanguard**: Front-line fighter and protector
   * - **artifex**: Crafter and equipment master
   * - **mindweaver**: Psionic specialist
   */
  HollowGearClass,
  
  /**
   * Represents a character's class level and associated data.
   * Contains all information about a character's progression in a specific class.
   */
  CharacterClass,
  
  /**
   * Class archetype/subclass information.
   * Represents specialized paths within each class, chosen at specific levels.
   */
  ClassArchetype,
  
  /**
   * Represents a class feature gained at a specific level.
   * Features define the unique abilities and mechanics of each class.
   */
  ClassFeature,
  
  /**
   * Mechanical effects and rules for a class feature.
   * Defines how features interact with the game mechanics.
   */
  FeatureMechanics,
  
  /**
   * Specific effect of a feature.
   * Represents bonuses, abilities, or modifications granted by features.
   */
  FeatureEffect,
  
  /**
   * Usage limitations for a feature.
   * Defines how often features can be used and when they recharge.
   */
  FeatureUses,
  
  /**
   * Spellcasting information for a class.
   * Defines how a class interacts with the magic system.
   */
  ClassSpellcasting,
  
  /**
   * Psionic abilities for a class.
   * Defines how a class interacts with the Mindcraft system.
   */
  ClassPsionics,
  
  /**
   * Class-specific resources.
   * Represents unique resource pools and mechanics for each class.
   */
  ClassResources,
  
  /**
   * Spellcasting progression types.
   * Defines how quickly a class gains spellcasting abilities.
   */
  SpellcastingProgression,
  
  /**
   * Spellcasting focus types.
   * Defines what implements a class uses for spellcasting.
   */
  SpellcastingFocus
} from './classes/index.js';

// =============================================================================
// EQUIPMENT SYSTEM
// =============================================================================

/**
 * ## Equipment and Modification System
 * 
 * Comprehensive equipment system supporting weapons, armor, modifications,
 * and inventory management with Hollow Gear's unique craftsmanship tiers
 * and modification system.
 * 
 * @example
 * ```typescript
 * import { EquipmentUtils, ModUtils, type Weapon } from '@hollow-gear/character-models';
 * 
 * // Create a Guild-tier weapon
 * const steamRifle: Weapon = {
 *   id: 'steam-rifle-001',
 *   name: 'Guild Steam Rifle',
 *   type: 'firearm',
 *   tier: 'guild',
 *   damage: { dice: 'd8', count: 1, type: 'piercing' },
 *   properties: ['two-handed', 'reload'],
 *   modSlots: [
 *     { id: 'barrel-slot', type: 'utility', installedMod: undefined }
 *   ]
 * };
 * 
 * // Check if a mod can be installed
 * const canInstall = ModUtils.canInstallMod(steamRifle, accuracyMod);
 * ```
 */
export type {
  /**
   * Base equipment interface for all items.
   * Defines common properties shared by weapons, armor, and other items.
   */
  Equipment,
  
  /**
   * Union type for all equipment categories.
   * Helps with type discrimination and equipment management.
   */
  EquipmentType,
  
  /**
   * Specific weapon type classifications.
   * Used for proficiency and feature interactions.
   */
  WeaponType,
  
  /**
   * Armor type classifications.
   * Determines AC calculations and restrictions.
   */
  ArmorType,
  
  /**
   * Shield type classifications.
   * Affects AC bonuses and special abilities.
   */
  ShieldType,
  
  /**
   * General item type classifications.
   * Used for non-weapon, non-armor equipment.
   */
  ItemType,
  
  /**
   * Craftsmanship quality tiers in Hollow Gear.
   * Determines item power, rarity, and modification capacity.
   * 
   * - **workshop**: Basic quality, common items
   * - **guild**: Professional quality, enhanced capabilities
   * - **relic**: Masterwork quality, significant bonuses
   * - **mythic**: Legendary quality, unique properties
   */
  CraftsmanshipTier,
  
  /**
   * Current condition of equipment.
   * Affects performance and maintenance requirements.
   */
  EquipmentCondition,
  
  /**
   * Weapon interface with combat statistics.
   * Extends base equipment with damage, properties, and combat mechanics.
   */
  Weapon,
  
  /**
   * Weapon-specific properties and mechanics.
   * Defines special rules and combat interactions.
   */
  WeaponProperties,
  
  /**
   * Weapon damage information.
   * Specifies dice, damage type, and special effects.
   */
  WeaponDamage,
  
  /**
   * Armor interface with protection statistics.
   * Extends base equipment with AC calculations and restrictions.
   */
  Armor,
  
  /**
   * Shield interface with defensive capabilities.
   * Provides AC bonuses and special defensive abilities.
   */
  Shield,
  
  /**
   * Armor-specific properties and mechanics.
   * Defines protection, restrictions, and special features.
   */
  ArmorProperties,
  
  /**
   * Equipment modification interface.
   * Represents upgrades and enhancements that can be installed on equipment.
   */
  EquipmentMod,
  
  /**
   * Modification slot on equipment.
   * Defines where mods can be installed and their current state.
   */
  ModSlot,
  
  /**
   * Effect provided by an equipment modification.
   * Defines bonuses, abilities, or changes granted by mods.
   */
  ModEffect,
  
  /**
   * Complete inventory data for a character.
   * Manages all items, containers, and carrying capacity.
   */
  InventoryData,
  
  /**
   * Currently equipped items on a character.
   * Defines what equipment is actively worn or wielded.
   */
  EquippedItems,
  
  /**
   * Item carried in inventory.
   * Includes quantity, location, and condition information.
   */
  CarriedItem,
  
  /**
   * Container for organizing inventory items.
   * Provides additional storage capacity and organization.
   */
  Container,
  
  /**
   * Carrying capacity calculations.
   * Tracks weight, bulk, and encumbrance effects.
   */
  CarryingCapacity
} from './equipment/index.js';

export { 
  /**
   * General equipment utility functions.
   * Provides validation, creation, and management tools.
   */
  EquipmentUtils,
  
  /**
   * Weapon-specific utility functions.
   * Handles weapon mechanics, damage calculations, and properties.
   */
  WeaponUtils,
  
  /**
   * Armor and shield utility functions.
   * Manages AC calculations, restrictions, and special abilities.
   */
  ArmorUtils,
  
  /**
   * Equipment modification utility functions.
   * Handles mod installation, compatibility, and effects.
   */
  ModUtils,
  
  /**
   * Inventory management utility functions.
   * Provides tools for organizing and managing character possessions.
   */
  InventoryUtils 
} from './equipment/index.js';

// =============================================================================
// PSIONIC SYSTEM
// =============================================================================

/**
 * ## Mindcraft Psionic System
 * 
 * The Mindcraft system from Chapter 6, providing psionic abilities through
 * six disciplines and Aether Flux Point management.
 * 
 * @example
 * ```typescript
 * import { type PsionicData, type PsionicPower } from '@hollow-gear/character-models';
 * 
 * // Use a psionic power
 * function manifestPower(character: HollowGearCharacter, power: PsionicPower) {
 *   if (!character.psionics) return false;
 *   
 *   const afp = character.psionics.aetherFluxPoints;
 *   if (afp.current >= power.afpCost) {
 *     afp.current -= power.afpCost;
 *     console.log(`Manifested ${power.name} (${power.discipline})`);
 *     return true;
 *   }
 *   return false;
 * }
 * ```
 */
export type {
  /**
   * Complete psionic data for a character.
   * Combines all psionic subsystems including disciplines, powers, and resources.
   */
  PsionicData,
  
  /**
   * Individual psionic power with mechanics and costs.
   * Represents specific abilities within the Mindcraft disciplines.
   */
  PsionicPower,
  
  /**
   * Power tier classification (1-9).
   * Determines power level, AFP cost, and availability.
   */
  PowerTier,
  
  /**
   * Currently maintained psionic power.
   * Tracks sustained effects and focus requirements.
   */
  MaintainedPower,
  
  /**
   * Character's psionic focus state.
   * Manages concentration and maintained power limits.
   */
  PsionicFocusState,
  
  /**
   * Unique psionic signature of a character.
   * Used for identification and psionic interactions.
   */
  PsionicSignature,
  
  /**
   * Psionic surge ability state.
   * Tracks usage and recovery of surge abilities.
   */
  PsionicSurgeState,
  
  /**
   * Extended overload state tracking.
   * Manages psionic feedback and overload conditions.
   */
  ExtendedOverloadState
} from './psionics/index.js';

/**
 * The six Mindcraft disciplines available to psionic characters.
 * Each discipline focuses on different aspects of mental power.
 * 
 * - **flux**: Energy manipulation and elemental forces
 * - **echo**: Sound, vibration, and sonic effects
 * - **eidolon**: Illusion, phantasm, and false reality
 * - **empyric**: Mind reading, emotion, and mental influence
 * - **veil**: Concealment, stealth, and misdirection
 * - **kinesis**: Movement, force, and telekinetic effects
 */
export type { PsionicDiscipline as PsionicDisciplineEnum } from './psionics/index.js';

// =============================================================================
// SPELLCASTING SYSTEM
// =============================================================================

/**
 * ## Spellcasting Systems
 * 
 * Dual spellcasting systems for Arcanist (Aether Formulae) and Templar 
 * (Resonance Charges) classes, with heat management and feedback mechanics.
 * 
 * @example
 * ```typescript
 * import { type SpellcastingData, type ArcanistSpellcasting } from '@hollow-gear/character-models';
 * 
 * // Cast an Arcanist spell with Overclocking
 * function castWithOverclock(character: HollowGearCharacter, spellLevel: number) {
 *   if (!character.spellcasting?.resources.arcanist) return false;
 *   
 *   const arcanist = character.spellcasting.resources.arcanist;
 *   if (arcanist.overclockUses > 0) {
 *     // Use Overclocking to cast above Equilibrium Tier
 *     arcanist.overclockUses--;
 *     character.spellcasting.heatFeedback.heatPoints += spellLevel * 2;
 *     return true;
 *   }
 *   return false;
 * }
 * ```
 */
export type {
  /**
   * Complete spellcasting data for a character.
   * Extends base spellcasting with class-specific resources and heat tracking.
   */
  SpellcastingData,
  
  /**
   * Combined spellcasting resources for different caster types.
   * Contains class-specific resource pools and mechanics.
   */
  SpellcastingResources,
  
  /**
   * Arcanist-specific spellcasting resources.
   * Manages Aether Flux Points, Equilibrium Tier, and Overclocking.
   */
  ArcanistSpellcasting,
  
  /**
   * Templar-specific spellcasting resources.
   * Manages Resonance Charges, Overchannel, and faith feedback.
   */
  TemplarSpellcasting,
  
  /**
   * Heat point and feedback tracking state.
   * Manages the consequences of magical overuse.
   */
  HeatFeedbackState,
  
  /**
   * Spell component requirements.
   * Defines what materials and focuses are needed for spells.
   */
  SpellComponents,
  
  /**
   * Magical school classifications.
   * Used for spell organization and class features.
   */
  SpellSchool
} from './spellcasting/index.js';

/**
 * Types of spellcasting systems available in Hollow Gear.
 * 
 * - **arcanist**: Aether Formulae system using AFP and Overclocking
 * - **templar**: Resonance Charges system using RC and Overchannel
 */
export type { SpellcastingType as SpellcastingSystemType } from './spellcasting/index.js';

/**
 * Known spell data with Hollow Gear naming conventions.
 * Maps D&D spells to their Hollow Gear equivalents (e.g., "Arc Pulse Array" for Magic Missile).
 */
export type { KnownSpell as SpellData } from './spellcasting/index.js';

// =============================================================================
// HOLLOW GEAR MECHANICS
// =============================================================================

/**
 * ## Hollow Gear Mechanics
 * 
 * Unique game mechanics specific to the Hollow Gear setting, including
 * Heat Stress, currency systems, and equipment maintenance.
 * 
 * @example
 * ```typescript
 * import { type HeatStressData, type CurrencyData } from '@hollow-gear/character-models';
 * 
 * // Check heat stress effects
 * function checkHeatStress(character: HollowGearCharacter) {
 *   const heat = character.heatStress;
 *   if (heat.currentLevel >= 2) {
 *     console.log('Character is suffering from heat stress!');
 *     // Apply penalties to Dexterity and movement
 *   }
 * }
 * 
 * // Convert currency
 * function convertCurrency(character: HollowGearCharacter) {
 *   if (character.currency.cogs >= 10) {
 *     character.currency.cogs -= 10;
 *     character.currency.gears += 1;
 *   }
 * }
 * ```
 */
export type {
  /**
   * Heat Stress tracking and effects.
   * Manages the accumulation and consequences of heat exposure.
   */
  HeatStressData,
  
  /**
   * Heat Stress severity levels (0-3).
   * Determines the magnitude of penalties and effects.
   */
  HeatStressLevel,
  
  /**
   * Steam Vent Harness equipment.
   * Provides heat management and cooling capabilities.
   */
  SteamVentHarness,
  
  /**
   * Hollow Gear currency system.
   * Manages Cogs, Gears, Cores, and Aether-based resources.
   */
  CurrencyData,
  
  /**
   * Aether Cell power source.
   * Rechargeable energy storage for powered equipment.
   */
  AetherCell,
  
  /**
   * Equipment maintenance tracking.
   * Manages repair needs, malfunction states, and upkeep.
   */
  MaintenanceData,
  
  /**
   * Requirements for repairing equipment.
   * Specifies materials, skills, and time needed for repairs.
   */
  RepairRequirement
} from './mechanics/index.js';

/**
 * Equipment malfunction state tracking.
 * Manages when equipment breaks down and needs repair.
 */
export type { MalfunctionState as EquipmentMalfunctionState } from './mechanics/index.js';

// =============================================================================
// CHARACTER PROGRESSION
// =============================================================================

/**
 * ## Character Progression System
 * 
 * Experience tracking, level advancement, and character development
 * including ability score improvements and feat selection.
 * 
 * @example
 * ```typescript
 * import { type ExperienceData, type AdvancementChoices } from '@hollow-gear/character-models';
 * 
 * // Award experience and check for level up
 * function awardExperience(character: HollowGearCharacter, amount: number) {
 *   character.experience.current += amount;
 *   
 *   const nextLevelXP = character.experience.nextLevelThreshold;
 *   if (character.experience.current >= nextLevelXP) {
 *     console.log('Character is ready to level up!');
 *     // Trigger level advancement process
 *   }
 * }
 * ```
 */
export type {
  /**
   * Experience points and level tracking.
   * Manages current XP, level thresholds, and advancement readiness.
   */
  ExperienceData,
  
  /**
   * Level advancement information.
   * Tracks what happens when a character gains a level.
   */
  LevelAdvancement,
  
  /**
   * Character advancement choices.
   * Records decisions made during level-up (ASIs, feats, etc.).
   */
  AdvancementChoices
} from './progression/index.js';

// =============================================================================
// MAIN CHARACTER COMPOSITION
// =============================================================================

/**
 * ## Main Character Interface
 * 
 * The complete HollowGearCharacter interface that composes all subsystems
 * into a unified character representation, along with creation and validation utilities.
 * 
 * @example
 * ```typescript
 * import { CharacterUtils, type CharacterCreationParams } from '@hollow-gear/character-models';
 * 
 * // Create a new character
 * const params: CharacterCreationParams = {
 *   name: "Zara Cogwright",
 *   species: "vulmir",
 *   startingClass: "arcanist",
 *   abilityScores: {
 *     strength: 10, dexterity: 16, constitution: 14,
 *     intelligence: 15, wisdom: 12, charisma: 13
 *   }
 * };
 * 
 * const result = await CharacterUtils.createCharacter(params);
 * if (result.success) {
 *   const character = result.data;
 *   console.log(`Created ${character.name}, Level ${character.level} ${character.species}`);
 * }
 * ```
 */
export type { 
  /**
   * Complete Hollow Gear character representation.
   * Composes all character subsystems into a unified interface supporting
   * both D&D 5e mechanics and Hollow Gear-specific systems.
   */
  HollowGearCharacter, 
  
  /**
   * Custom character trait or feature.
   * Represents additional abilities from feats, magic items, or other sources.
   */
  CustomTrait, 
  
  /**
   * Parameters for creating a new character.
   * Defines the minimum information needed to generate a valid character.
   */
  CharacterCreationParams,
  
  /**
   * Result of character validation operations.
   * Contains either a valid character or detailed error information.
   */
  CharacterValidationResult,
  
  /**
   * Result of character creation operations.
   * Contains either a newly created character or creation errors.
   */
  CharacterCreationResult
} from './character.js';

export { 
  /**
   * Character utility functions and operations.
   * Provides methods for creating, validating, and manipulating characters.
   */
  CharacterUtils 
} from './character.js';

// =============================================================================
// SERIALIZATION AND DATA MANAGEMENT
// =============================================================================

/**
 * ## Serialization and Data Management
 * 
 * Character serialization, migration, and change tracking for offline-first
 * mobile app usage with version compatibility and data integrity.
 * 
 * @example
 * ```typescript
 * import { SerializationUtils, type HollowGearCharacter } from '@hollow-gear/character-models';
 * 
 * // Serialize character for storage
 * const character: HollowGearCharacter = // ... existing character
 * const serialized = SerializationUtils.serialize(character);
 * if (serialized.success) {
 *   localStorage.setItem('character', JSON.stringify(serialized.data));
 * }
 * 
 * // Deserialize and migrate if needed
 * const stored = JSON.parse(localStorage.getItem('character')!);
 * const deserialized = SerializationUtils.deserialize(stored);
 * if (deserialized.success) {
 *   const character = deserialized.data; // Automatically migrated to current version
 * }
 * ```
 */
export type {
  /**
   * Serializable representation of a character.
   * Optimized for JSON storage with version information.
   */
  SerializableCharacter,
  
  /**
   * Function for migrating character data between versions.
   * Handles data structure changes and compatibility updates.
   */
  MigrationFunction,
  
  /**
   * Registry of migration functions by version.
   * Manages the migration chain for data compatibility.
   */
  MigrationRegistry,
  
  /**
   * Options for character serialization.
   * Controls what data is included and how it's formatted.
   */
  SerializationOptions,
  
  /**
   * Options for character deserialization.
   * Controls validation, migration, and error handling.
   */
  DeserializationOptions,
  
  /**
   * Represents a change to character data.
   * Used for change tracking and incremental updates.
   */
  CharacterChange,
  
  /**
   * Type of change made to character data.
   * Categorizes modifications for tracking and syncing.
   */
  ChangeType,
  
  /**
   * Result of change tracking operations.
   * Contains tracked changes or tracking errors.
   */
  ChangeTrackingResult,
  
  /**
   * Result of serialization operations.
   * Contains serialized data or serialization errors.
   */
  SerializationResult,
  
  /**
   * Result of deserialization operations.
   * Contains deserialized character or deserialization errors.
   */
  DeserializationResult,
  
  /**
   * Result of migration operations.
   * Contains migrated data or migration errors.
   */
  MigrationResult,
  
  /**
   * Patch for incremental character updates.
   * Represents partial changes that can be applied to characters.
   */
  CharacterPatch,
  
  /**
   * Result of patch application operations.
   * Contains updated character or patch errors.
   */
  PatchResult
} from './serialization.js';

export { 
  /**
   * Serialization utility functions.
   * Provides methods for converting characters to/from storage formats.
   */
  SerializationUtils 
} from './serialization.js';

// =============================================================================
// CHARACTER UTILITIES
// =============================================================================

/**
 * ## Character Analysis and Utilities
 * 
 * Advanced character analysis, comparison, and utility functions for
 * calculating derived statistics and character summaries.
 * 
 * @example
 * ```typescript
 * import { CharacterUtilities, type DerivedStats } from '@hollow-gear/character-models';
 * 
 * // Calculate derived statistics
 * const character: HollowGearCharacter = // ... existing character
 * const derived = CharacterUtilities.calculateDerivedStats(character);
 * console.log(`Total AC: ${derived.totalArmorClass}`);
 * console.log(`Initiative: ${derived.initiativeBonus}`);
 * 
 * // Generate character summary
 * const summary = CharacterUtilities.generateSummary(character);
 * console.log(summary.description); // "Level 5 Vulmir Arcanist"
 * ```
 */
export type {
  /**
   * Calculated derived statistics for a character.
   * Includes totals, bonuses, and computed values from base character data.
   */
  DerivedStats,
  
  /**
   * Comprehensive character summary.
   * Provides overview information and key statistics.
   */
  CharacterSummary,
  
  /**
   * Comparison between two characters.
   * Highlights differences and similarities for analysis.
   */
  CharacterComparison,
  
  /**
   * Detailed difference analysis between character versions.
   * Shows what changed between two character states.
   */
  CharacterDiff
} from './character-utils.js';

/**
 * Character encumbrance level from carrying capacity.
 * Determines movement penalties and restrictions.
 */
export type { EncumbranceLevel as CharacterEncumbranceLevel } from './character-utils.js';

/**
 * Heat stress effects on character performance.
 * Defines penalties and restrictions from heat exposure.
 */
export type { HeatStressEffect as CharacterHeatStressEffect } from './character-utils.js';

export { 
  /**
   * Character analysis and utility functions.
   * Provides advanced calculations, comparisons, and character insights.
   */
  CharacterUtilities 
} from './character-utils.js';

// =============================================================================
// MODULE METADATA AND UTILITIES
// =============================================================================

/**
 * Module version for compatibility checking
 */
export const MODEL_VERSION = '1.0.0';

/**
 * Type guard to check if a value is a successful Result
 * 
 * @example
 * ```typescript
 * const result = CharacterUtils.validateCharacter(character);
 * if (isSuccess(result)) {
 *   // result.data is now typed as the success value
 *   console.log('Character is valid:', result.data);
 * }
 * ```
 */
export function isSuccess<T, E>(result: import('./types/common.js').Result<T, E>): result is { success: true; data: T } {
  return result.success;
}

/**
 * Type guard to check if a value is a failed Result
 * 
 * @example
 * ```typescript
 * const result = CharacterUtils.validateCharacter(character);
 * if (isFailure(result)) {
 *   // result.error is now typed as the error value
 *   console.error('Character validation failed:', result.error);
 * }
 * ```
 */
export function isFailure<T, E>(result: import('./types/common.js').Result<T, E>): result is { success: false; error: E } {
  return !result.success;
}

// =============================================================================
// ADVANCED USAGE EXAMPLES AND PATTERNS
// =============================================================================

/**
 * ## Advanced Usage Examples
 * 
 * ### Complete Character Creation Workflow
 * 
 * ```typescript
 * import { 
 *   CharacterUtils, 
 *   SerializationUtils,
 *   type CharacterCreationParams,
 *   type HollowGearCharacter 
 * } from '@hollow-gear/character-models';
 * 
 * async function createAndSaveCharacter() {
 *   // Define character parameters
 *   const params: CharacterCreationParams = {
 *     name: "Kira Steamwright",
 *     species: "rendai",
 *     startingClass: "tweaker",
 *     abilityScores: {
 *       strength: 12, dexterity: 16, constitution: 14,
 *       intelligence: 15, wisdom: 10, charisma: 13
 *     },
 *     background: "Guild Apprentice",
 *     notes: "Specializes in steam-powered gadgets"
 *   };
 * 
 *   // Create the character
 *   const result = await CharacterUtils.createCharacter(params);
 *   if (!result.success) {
 *     console.error('Character creation failed:', result.error);
 *     return null;
 *   }
 * 
 *   const character = result.data;
 * 
 *   // Validate the character
 *   const validation = CharacterUtils.validateCharacter(character);
 *   if (!validation.success) {
 *     console.error('Character validation failed:', validation.error);
 *     return null;
 *   }
 * 
 *   // Serialize for storage
 *   const serialized = SerializationUtils.serialize(character);
 *   if (serialized.success) {
 *     localStorage.setItem(`character_${character.id}`, JSON.stringify(serialized.data));
 *     console.log(`Character ${character.name} created and saved!`);
 *   }
 * 
 *   return character;
 * }
 * ```
 * 
 * ### Equipment Management
 * 
 * ```typescript
 * import { 
 *   EquipmentUtils, 
 *   ModUtils,
 *   type Weapon, 
 *   type EquipmentMod 
 * } from '@hollow-gear/character-models';
 * 
 * function upgradeWeapon(character: HollowGearCharacter) {
 *   // Get the character's main weapon
 *   const weapon = character.equipment.mainHand as Weapon;
 *   if (!weapon) return;
 * 
 *   // Create an accuracy modification
 *   const accuracyMod: EquipmentMod = {
 *     id: 'accuracy-sight-001',
 *     name: 'Precision Sight',
 *     tier: 2,
 *     type: 'utility',
 *     effects: [
 *       {
 *         type: 'attack_bonus',
 *         value: 1,
 *         description: '+1 to attack rolls'
 *       }
 *     ],
 *     powerRequirement: { type: 'none', amount: 0 }
 *   };
 * 
 *   // Check if the mod can be installed
 *   const canInstall = ModUtils.canInstallMod(weapon, accuracyMod);
 *   if (canInstall.success) {
 *     // Install the modification
 *     const availableSlot = weapon.modSlots.find(slot => 
 *       slot.type === 'utility' && !slot.installedMod
 *     );
 *     if (availableSlot) {
 *       availableSlot.installedMod = accuracyMod;
 *       console.log(`Installed ${accuracyMod.name} on ${weapon.name}`);
 *     }
 *   }
 * }
 * ```
 * 
 * ### Psionic Power Management
 * 
 * ```typescript
 * import { type PsionicPower, type HollowGearCharacter } from '@hollow-gear/character-models';
 * 
 * function managePsionicPowers(character: HollowGearCharacter) {
 *   if (!character.psionics) {
 *     console.log('Character has no psionic abilities');
 *     return;
 *   }
 * 
 *   const psionics = character.psionics;
 *   
 *   // Check available AFP
 *   console.log(`AFP: ${psionics.aetherFluxPoints.current}/${psionics.aetherFluxPoints.maximum}`);
 *   
 *   // Find a power to use
 *   const fluxPower = psionics.knownPowers.find(power => 
 *     power.discipline === 'flux' && power.afpCost <= psionics.aetherFluxPoints.current
 *   );
 * 
 *   if (fluxPower) {
 *     // Use the power
 *     psionics.aetherFluxPoints.current -= fluxPower.afpCost;
 *     console.log(`Used ${fluxPower.name} for ${fluxPower.afpCost} AFP`);
 *     
 *     // Check for overload risk
 *     if (psionics.overloadState.riskLevel > 0) {
 *       console.log('Warning: Psionic overload risk detected!');
 *     }
 *   }
 * }
 * ```
 * 
 * ### Heat Stress Management
 * 
 * ```typescript
 * import { type HeatStressData } from '@hollow-gear/character-models';
 * 
 * function manageHeatStress(character: HollowGearCharacter) {
 *   const heat = character.heatStress;
 *   
 *   // Check current heat level
 *   console.log(`Heat Stress Level: ${heat.currentLevel}/3`);
 *   
 *   // Apply heat stress effects
 *   if (heat.currentLevel >= 1) {
 *     console.log('Suffering from heat stress - reduced Dexterity');
 *   }
 *   
 *   if (heat.currentLevel >= 2) {
 *     console.log('Severe heat stress - movement speed reduced');
 *   }
 *   
 *   if (heat.currentLevel >= 3) {
 *     console.log('Critical heat stress - disadvantage on all rolls!');
 *   }
 *   
 *   // Use steam vent to reduce heat
 *   if (heat.steamVentCharges > 0 && heat.currentLevel > 0) {
 *     heat.steamVentCharges--;
 *     heat.currentLevel = Math.max(0, heat.currentLevel - 1);
 *     console.log('Used steam vent to reduce heat stress');
 *   }
 * }
 * ```
 * 
 * ## System Relationships
 * 
 * The character model systems are designed to work together seamlessly:
 * 
 * - **Species** provide ability score bonuses that affect **Base Mechanics**
 * - **Classes** determine access to **Spellcasting** and **Psionic** systems
 * - **Equipment** modifications can affect **Heat Stress** and resource management
 * - **Progression** unlocks new features across all systems
 * - **Serialization** preserves all system states for offline usage
 * 
 * This interconnected design ensures that all character aspects work together
 * to create a cohesive gameplay experience in the Hollow Gear TTRPG.
 */