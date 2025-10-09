/**
 * Base equipment types and craftsmanship tiers for the Hollow Gear equipment system
 */

import type {
  EquipmentId,
  ValidationResult,
  ValidationError,
} from '../types/common.js';

/**
 * The four craftsmanship tiers in Hollow Gear
 * Each tier represents increasing quality, rarity, and power
 */
export type CraftsmanshipTier = 'workshop' | 'guild' | 'relic' | 'mythic';

/**
 * All possible equipment types in the Hollow Gear system
 */
export type EquipmentType = WeaponType | ArmorType | ShieldType | ItemType;

/**
 * Weapon categories and specific types
 */
export type WeaponType =
  | 'simple-melee'
  | 'martial-melee'
  | 'simple-ranged'
  | 'martial-ranged'
  | 'powered-melee'
  | 'powered-ranged'
  | 'siege-weapon';

/**
 * Armor categories
 */
export type ArmorType =
  | 'light-armor'
  | 'medium-armor'
  | 'heavy-armor'
  | 'powered-armor';

/**
 * Shield types
 */
export type ShieldType =
  | 'light-shield'
  | 'heavy-shield'
  | 'tower-shield'
  | 'powered-shield';

/**
 * General item categories
 */
export type ItemType =
  | 'tool'
  | 'consumable'
  | 'container'
  | 'clothing'
  | 'jewelry'
  | 'component'
  | 'ammunition'
  | 'vehicle'
  | 'misc';

/**
 * Equipment condition states
 */
export type EquipmentCondition =
  | 'pristine' // Perfect condition, no penalties
  | 'good' // Minor wear, no mechanical effects
  | 'worn' // Noticeable wear, minor penalties possible
  | 'damaged' // Significant damage, clear penalties
  | 'broken'; // Non-functional, requires repair

/**
 * Currency value representation
 */
export interface CurrencyValue {
  /** Value in Cogs (copper equivalent) */
  cogs: number;
  /** Value in Gears (silver equivalent) */
  gears: number;
  /** Value in Cores (gold equivalent) */
  cores: number;
}

/**
 * Weight and bulk measurements for inventory management
 */
export interface PhysicalProperties {
  /** Weight in pounds */
  weight: number;
  /** Bulk rating for carrying capacity (0-4) */
  bulk: number;
  /** Physical size category */
  size: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
}

/**
 * Base equipment properties shared by all equipment
 */
export interface EquipmentProperties {
  /** Physical characteristics */
  physical: PhysicalProperties;
  /** Whether this equipment requires power to function */
  requiresPower: boolean;
  /** Whether this equipment can malfunction */
  canMalfunction: boolean;
  /** Special material the equipment is made from */
  material?: SpecialMaterial;
  /** Magical or psionic properties */
  magical: boolean;
  /** Psionic resonance properties */
  psionic: boolean;
}

/**
 * Special materials used in Hollow Gear equipment
 */
export type SpecialMaterial =
  | 'aetherglass' // Translucent, conducts aether energy
  | 'black-brass' // Dark metal, resists corrosion
  | 'living-steel' // Self-repairing metal
  | 'voidstone' // Absorbs magical energy
  | 'resonant-crystal' // Amplifies psionic energy
  | 'steamwood' // Heat-resistant organic material
  | 'etherbone' // Lightweight, strong organic material
  | 'coldsteel' // Always cool to touch, heat resistant
  | 'brightsilver' // Naturally luminous metal
  | 'shadowiron'; // Absorbs light, very dense

/**
 * Core equipment interface that all equipment implements
 */
export interface Equipment {
  /** Unique identifier for this equipment */
  id: EquipmentId;
  /** Display name */
  name: string;
  /** Equipment category and type */
  type: EquipmentType;
  /** Craftsmanship quality tier */
  tier: CraftsmanshipTier;
  /** Physical and magical properties */
  properties: EquipmentProperties;
  /** Current condition of the equipment */
  condition: EquipmentCondition;
  /** Base market value */
  value: CurrencyValue;
  /** Modification slots available on this equipment */
  modSlots: ModSlot[];
  /** Flavor text description */
  description?: string;
  /** Whether this is a unique/named item */
  isUnique: boolean;
  /** Attunement requirements if any */
  attunement?: AttunementRequirement;
}

/**
 * Modification slot on equipment
 */
export interface ModSlot {
  /** Unique identifier for this slot */
  id: string;
  /** Type of modifications this slot accepts */
  type: ModSlotType;
  /** Currently installed modification, if any */
  installedMod?: EquipmentMod;
  /** Current malfunction state of this slot */
  malfunctionState?: MalfunctionState;
  /** Whether this slot is accessible for modification */
  accessible: boolean;
}

/**
 * Types of modification slots
 */
export type ModSlotType =
  | 'power' // Power systems and energy sources
  | 'utility' // General utility modifications
  | 'reactive' // Defensive and reactive systems
  | 'psionic' // Psionic enhancement systems
  | 'elemental' // Elemental damage or resistance
  | 'defensive' // Armor and protection systems
  | 'offensive' // Weapon enhancement systems
  | 'universal'; // Can accept any type of mod

/**
 * Equipment modification interface
 */
export interface EquipmentMod {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Modification tier (1-4, higher is better) */
  tier: number;
  /** Type of modification */
  type: ModSlotType;
  /** Mechanical effects this mod provides */
  effects: ModEffect[];
  /** Power requirement to function */
  powerRequirement?: PowerRequirement;
  /** Craftsmanship tier required to install */
  installationTier: CraftsmanshipTier;
  /** Description of the modification */
  description: string;
}

/**
 * Effect provided by a modification
 */
export interface ModEffect {
  /** Type of effect */
  type: ModEffectType;
  /** Magnitude of the effect */
  value: number;
  /** Conditions under which this effect applies */
  conditions?: string[];
  /** Description of the effect */
  description: string;
}

/**
 * Types of effects modifications can provide
 */
export type ModEffectType =
  | 'damage-bonus'
  | 'ac-bonus'
  | 'attack-bonus'
  | 'ability-bonus'
  | 'skill-bonus'
  | 'resistance'
  | 'immunity'
  | 'advantage'
  | 'disadvantage'
  | 'special-ability'
  | 'resource-bonus'
  | 'speed-bonus'
  | 'healing-bonus';

/**
 * Power requirements for equipment and modifications
 */
export interface PowerRequirement {
  /** Type of power source needed */
  source: PowerSource;
  /** Amount of power consumed per use/hour */
  consumption: number;
  /** Whether power is consumed continuously or per use */
  consumptionType: 'continuous' | 'per-use' | 'per-activation';
}

/**
 * Types of power sources in Hollow Gear
 */
export type PowerSource =
  | 'aether-cell' // Standard power cells
  | 'steam-engine' // Steam-powered systems
  | 'muscle-power' // Manual operation
  | 'ambient-aether' // Draws from environmental aether
  | 'psionic-energy' // Powered by user's AFP
  | 'solar-collector' // Solar power systems
  | 'kinetic-dynamo'; // Motion-powered systems

/**
 * Malfunction states for equipment and mod slots
 */
export interface MalfunctionState {
  /** Type of malfunction */
  type: MalfunctionType;
  /** Severity level (1-3) */
  severity: number;
  /** Description of the malfunction */
  description: string;
  /** Whether the malfunction prevents use */
  disabling: boolean;
  /** Repair difficulty class */
  repairDC: number;
}

/**
 * Types of equipment malfunctions
 */
export type MalfunctionType =
  | 'power-drain' // Consumes extra power
  | 'jamming' // Weapon jams or sticks
  | 'overheating' // Generates excess heat
  | 'short-circuit' // Electrical problems
  | 'mechanical-wear' // Moving parts wearing out
  | 'aether-leak' // Aether energy escaping
  | 'resonance-drift' // Psionic tuning problems
  | 'structural-damage'; // Physical damage to equipment

/**
 * Attunement requirements for magical/psionic equipment
 */
export interface AttunementRequirement {
  /** Whether attunement is required */
  required: boolean;
  /** Specific requirements to attune */
  requirements?: AttunementCondition[];
  /** Time required to attune (in minutes) */
  attunementTime: number;
}

/**
 * Conditions that must be met to attune to equipment
 */
export interface AttunementCondition {
  /** Type of requirement */
  type: 'class' | 'species' | 'ability-score' | 'skill' | 'special';
  /** Specific requirement details */
  requirement: string;
  /** Minimum value if applicable */
  minimumValue?: number;
}

/**
 * Utility functions for equipment management
 */
export namespace EquipmentUtils {
  /**
   * Get the tier multiplier for equipment values
   */
  export function getTierMultiplier(tier: CraftsmanshipTier): number {
    switch (tier) {
      case 'workshop':
        return 1;
      case 'guild':
        return 5;
      case 'relic':
        return 25;
      case 'mythic':
        return 125;
    }
  }

  /**
   * Calculate total currency value in cogs
   */
  export function getTotalValueInCogs(value: CurrencyValue): number {
    return value.cogs + value.gears * 10 + value.cores * 100;
  }

  /**
   * Convert cogs to mixed currency representation
   */
  export function cogsToMixedCurrency(totalCogs: number): CurrencyValue {
    const cores = Math.floor(totalCogs / 100);
    const remaining = totalCogs % 100;
    const gears = Math.floor(remaining / 10);
    const cogs = remaining % 10;

    return { cores, gears, cogs };
  }

  /**
   * Check if equipment is functional (not broken and no disabling malfunctions)
   */
  export function isFunctional(equipment: Equipment): boolean {
    if (equipment.condition === 'broken') {
      return false;
    }

    return !equipment.modSlots.some(
      slot => slot.malfunctionState?.disabling === true
    );
  }

  /**
   * Get available mod slots of a specific type
   */
  export function getAvailableModSlots(
    equipment: Equipment,
    type?: ModSlotType
  ): ModSlot[] {
    return equipment.modSlots.filter(
      slot =>
        slot.accessible &&
        !slot.installedMod &&
        (!type || slot.type === type || slot.type === 'universal')
    );
  }

  /**
   * Validate equipment data
   */
  export function validateEquipment(
    equipment: Equipment
  ): ValidationResult<Equipment> {
    const errors: ValidationError[] = [];

    // Validate basic properties
    if (!equipment.id || equipment.id.trim() === '') {
      errors.push({
        field: 'id',
        message: 'Equipment ID is required',
        code: 'MISSING_ID',
      });
    }

    if (!equipment.name || equipment.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Equipment name is required',
        code: 'MISSING_NAME',
      });
    }

    // Validate physical properties
    if (equipment.properties.physical.weight < 0) {
      errors.push({
        field: 'properties.physical.weight',
        message: 'Weight cannot be negative',
        code: 'INVALID_WEIGHT',
      });
    }

    if (
      equipment.properties.physical.bulk < 0 ||
      equipment.properties.physical.bulk > 4
    ) {
      errors.push({
        field: 'properties.physical.bulk',
        message: 'Bulk must be between 0 and 4',
        code: 'INVALID_BULK',
      });
    }

    // Validate currency values
    if (
      equipment.value.cogs < 0 ||
      equipment.value.gears < 0 ||
      equipment.value.cores < 0
    ) {
      errors.push({
        field: 'value',
        message: 'Currency values cannot be negative',
        code: 'INVALID_CURRENCY',
      });
    }

    // Validate mod slots
    const slotIds = new Set<string>();
    for (const slot of equipment.modSlots) {
      if (slotIds.has(slot.id)) {
        errors.push({
          field: 'modSlots',
          message: `Duplicate mod slot ID: ${slot.id}`,
          code: 'DUPLICATE_SLOT_ID',
        });
      }
      slotIds.add(slot.id);
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: equipment };
  }
}
