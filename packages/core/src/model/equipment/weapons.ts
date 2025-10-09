/**
 * Weapon system implementation for Hollow Gear
 * Includes traditional D&D weapons plus powered and siege weapons
 */

import type {
  Equipment,
  WeaponType,
  CraftsmanshipTier,
  EquipmentProperties,
  PowerRequirement,
  SpecialMaterial,
} from './base.js';
import type { ValidationResult, ValidationError } from '../types/common.js';
import type { DieType, AbilityScore } from '../types/common.js';

/**
 * Weapon-specific interface extending base Equipment
 */
export interface Weapon extends Equipment {
  type: WeaponType;
  weaponProperties: WeaponProperties;
}

/**
 * Core weapon properties and statistics
 */
export interface WeaponProperties {
  /** Damage dice and type */
  damage: WeaponDamage;
  /** Weapon properties (finesse, heavy, etc.) */
  properties: WeaponProperty[];
  /** Attack range information */
  range: WeaponRange;
  /** Ammunition requirements if ranged */
  ammunition?: AmmunitionData;
  /** Whether this is a powered weapon */
  powered: boolean;
  /** Power requirements if powered */
  powerRequirement?: PowerRequirement;
  /** Proficiency category */
  proficiency: WeaponProficiency;
  /** Primary ability score for attacks */
  attackAbility: AbilityScore;
  /** Whether weapon can be thrown */
  throwable: boolean;
  /** Thrown range if applicable */
  thrownRange?: WeaponRange;
}

/**
 * Weapon damage information
 */
export interface WeaponDamage {
  /** Number of dice to roll */
  diceCount: number;
  /** Type of die to roll */
  diceType: DieType;
  /** Type of damage dealt */
  damageType: DamageType;
  /** Additional damage for two-handed use */
  versatileDamage?: {
    diceCount: number;
    diceType: DieType;
  };
}

/**
 * Types of damage in Hollow Gear
 */
export type DamageType =
  | 'bludgeoning'
  | 'piercing'
  | 'slashing'
  | 'acid'
  | 'cold'
  | 'fire'
  | 'force'
  | 'lightning'
  | 'necrotic'
  | 'poison'
  | 'psychic'
  | 'radiant'
  | 'thunder'
  | 'aether' // Hollow Gear specific
  | 'steam' // Hollow Gear specific
  | 'kinetic'; // Hollow Gear specific

/**
 * Weapon properties that affect usage
 */
export type WeaponProperty =
  | 'ammunition' // Requires ammunition
  | 'finesse' // Can use Dex instead of Str
  | 'heavy' // Small creatures have disadvantage
  | 'light' // Can be used for two-weapon fighting
  | 'loading' // Can only fire once per action
  | 'range' // Ranged weapon
  | 'reach' // 10-foot reach instead of 5
  | 'thrown' // Can be thrown
  | 'two-handed' // Requires two hands
  | 'versatile' // Can be used one or two-handed
  | 'powered' // Requires power to function
  | 'overcharge' // Can be overcharged for extra damage
  | 'steam-vented' // Vents steam when fired
  | 'aether-charged' // Uses aether energy
  | 'recoil' // Has significant recoil
  | 'siege' // Deals double damage to objects
  | 'reload' // Requires reloading action
  | 'burst-fire' // Can fire in burst mode
  | 'automatic'; // Can fire in automatic mode

/**
 * Weapon range information
 */
export interface WeaponRange {
  /** Normal range in feet */
  normal: number;
  /** Long range in feet (disadvantage) */
  long: number;
  /** Maximum effective range */
  maximum?: number;
}

/**
 * Ammunition tracking and properties
 */
export interface AmmunitionData {
  /** Type of ammunition used */
  type: AmmunitionType;
  /** Current ammunition count */
  current: number;
  /** Maximum ammunition capacity */
  capacity: number;
  /** Whether ammunition is recoverable after use */
  recoverable: boolean;
  /** Special ammunition properties */
  properties?: AmmunitionProperty[];
}

/**
 * Types of ammunition
 */
export type AmmunitionType =
  | 'arrow'
  | 'bolt'
  | 'bullet'
  | 'dart'
  | 'needle'
  | 'shell'
  | 'rocket'
  | 'energy-cell'
  | 'steam-cartridge'
  | 'aether-charge'
  | 'kinetic-slug';

/**
 * Special ammunition properties
 */
export type AmmunitionProperty =
  | 'explosive' // Deals area damage
  | 'incendiary' // Sets targets on fire
  | 'armor-piercing' // Ignores some armor
  | 'tracking' // Seeks targets
  | 'non-lethal' // Deals subdual damage
  | 'silver' // Effective against certain creatures
  | 'cold-iron' // Effective against fey
  | 'blessed' // Effective against undead/fiends
  | 'aether-tipped' // Enhanced with aether energy
  | 'psionic' // Guided by psionic energy
  | 'fragmenting' // Breaks apart on impact
  | 'emp' // Disrupts electronics
  | 'smoke' // Creates concealment
  | 'flash' // Blinds targets
  | 'sonic'; // Deals thunder damage

/**
 * Weapon proficiency categories
 */
export type WeaponProficiency =
  | 'simple-melee'
  | 'martial-melee'
  | 'simple-ranged'
  | 'martial-ranged'
  | 'powered-weapons'
  | 'siege-weapons'
  | 'exotic-weapons';

/**
 * Reload mechanics for weapons that require it
 */
export interface ReloadMechanics {
  /** Action type required to reload */
  reloadAction: 'action' | 'bonus-action' | 'reaction' | 'free';
  /** Time in rounds to reload */
  reloadTime: number;
  /** Whether reloading provokes opportunity attacks */
  provokesOpportunity: boolean;
  /** Special requirements for reloading */
  requirements?: string[];
}

/**
 * Overcharge mechanics for powered weapons
 */
export interface OverchargeMechanics {
  /** Additional damage dice when overcharged */
  bonusDamage: {
    diceCount: number;
    diceType: DieType;
    damageType: DamageType;
  };
  /** Additional power consumption */
  extraPowerCost: number;
  /** Heat generated by overcharging */
  heatGenerated: number;
  /** Risk of malfunction (percentage) */
  malfunctionRisk: number;
}

/**
 * Weapon material properties that affect performance
 */
export interface WeaponMaterialProperties {
  /** Base material */
  material: SpecialMaterial;
  /** Damage bonus from material */
  damageBonus: number;
  /** Attack bonus from material */
  attackBonus: number;
  /** Special properties granted by material */
  specialProperties: WeaponProperty[];
  /** Resistance to damage types */
  resistances: DamageType[];
  /** Vulnerability to damage types */
  vulnerabilities: DamageType[];
}

/**
 * Utility functions for weapon management
 */
export namespace WeaponUtils {
  /**
   * Calculate total weapon damage including bonuses
   */
  export function calculateDamage(
    weapon: Weapon,
    twoHanded: boolean = false,
    overcharged: boolean = false
  ): WeaponDamage {
    let damage = weapon.weaponProperties.damage;

    // Use versatile damage if two-handed and available
    if (twoHanded && damage.versatileDamage) {
      damage = {
        ...damage,
        diceCount: damage.versatileDamage.diceCount,
        diceType: damage.versatileDamage.diceType,
      };
    }

    return damage;
  }

  /**
   * Check if weapon has a specific property
   */
  export function hasProperty(
    weapon: Weapon,
    property: WeaponProperty
  ): boolean {
    return weapon.weaponProperties.properties.includes(property);
  }

  /**
   * Get effective range for attack calculations
   */
  export function getEffectiveRange(
    weapon: Weapon,
    thrown: boolean = false
  ): WeaponRange {
    if (thrown && weapon.weaponProperties.thrownRange) {
      return weapon.weaponProperties.thrownRange;
    }
    return weapon.weaponProperties.range;
  }

  /**
   * Check if weapon requires ammunition
   */
  export function requiresAmmunition(weapon: Weapon): boolean {
    return (
      hasProperty(weapon, 'ammunition') &&
      weapon.weaponProperties.ammunition !== undefined
    );
  }

  /**
   * Check if weapon has sufficient ammunition
   */
  export function hasAmmunition(
    weapon: Weapon,
    shotsNeeded: number = 1
  ): boolean {
    if (!requiresAmmunition(weapon) || !weapon.weaponProperties.ammunition) {
      return true;
    }
    return weapon.weaponProperties.ammunition.current >= shotsNeeded;
  }

  /**
   * Consume ammunition from weapon
   */
  export function consumeAmmunition(weapon: Weapon, shots: number = 1): Weapon {
    if (!weapon.weaponProperties.ammunition) {
      return weapon;
    }

    const newAmmunition = {
      ...weapon.weaponProperties.ammunition,
      current: Math.max(0, weapon.weaponProperties.ammunition.current - shots),
    };

    return {
      ...weapon,
      weaponProperties: {
        ...weapon.weaponProperties,
        ammunition: newAmmunition,
      },
    };
  }

  /**
   * Reload weapon ammunition
   */
  export function reloadWeapon(
    weapon: Weapon,
    ammunitionAdded: number
  ): Weapon {
    if (!weapon.weaponProperties.ammunition) {
      return weapon;
    }

    const newCurrent = Math.min(
      weapon.weaponProperties.ammunition.capacity,
      weapon.weaponProperties.ammunition.current + ammunitionAdded
    );

    const newAmmunition = {
      ...weapon.weaponProperties.ammunition,
      current: newCurrent,
    };

    return {
      ...weapon,
      weaponProperties: {
        ...weapon.weaponProperties,
        ammunition: newAmmunition,
      },
    };
  }

  /**
   * Check if weapon can be used (has power, ammunition, not broken)
   */
  export function canUseWeapon(weapon: Weapon): boolean {
    // Check if weapon is functional
    if (weapon.condition === 'broken') {
      return false;
    }

    // Check ammunition if required
    if (requiresAmmunition(weapon) && !hasAmmunition(weapon)) {
      return false;
    }

    // Check for disabling malfunctions
    const hasDisablingMalfunction = weapon.modSlots.some(
      slot => slot.malfunctionState?.disabling === true
    );

    return !hasDisablingMalfunction;
  }

  /**
   * Get weapon attack ability score
   */
  export function getAttackAbility(
    weapon: Weapon,
    useFinesse: boolean = false
  ): AbilityScore {
    if (useFinesse && hasProperty(weapon, 'finesse')) {
      return 'dexterity';
    }
    return weapon.weaponProperties.attackAbility;
  }

  /**
   * Validate weapon data
   */
  export function validateWeapon(weapon: Weapon): ValidationResult<Weapon> {
    const errors: ValidationError[] = [];

    // Validate damage
    if (weapon.weaponProperties.damage.diceCount <= 0) {
      errors.push({
        field: 'weaponProperties.damage.diceCount',
        message: 'Damage dice count must be positive',
        code: 'INVALID_DAMAGE_DICE',
      });
    }

    // Validate range
    if (weapon.weaponProperties.range.normal <= 0) {
      errors.push({
        field: 'weaponProperties.range.normal',
        message: 'Normal range must be positive',
        code: 'INVALID_RANGE',
      });
    }

    if (
      weapon.weaponProperties.range.long < weapon.weaponProperties.range.normal
    ) {
      errors.push({
        field: 'weaponProperties.range.long',
        message: 'Long range must be greater than or equal to normal range',
        code: 'INVALID_LONG_RANGE',
      });
    }

    // Validate ammunition if present
    if (weapon.weaponProperties.ammunition) {
      const ammo = weapon.weaponProperties.ammunition;

      if (ammo.capacity <= 0) {
        errors.push({
          field: 'weaponProperties.ammunition.capacity',
          message: 'Ammunition capacity must be positive',
          code: 'INVALID_AMMO_CAPACITY',
        });
      }

      if (ammo.current < 0 || ammo.current > ammo.capacity) {
        errors.push({
          field: 'weaponProperties.ammunition.current',
          message: 'Current ammunition must be between 0 and capacity',
          code: 'INVALID_AMMO_CURRENT',
        });
      }
    }

    // Validate property consistency
    const props = weapon.weaponProperties.properties;

    if (props.includes('ammunition') && !weapon.weaponProperties.ammunition) {
      errors.push({
        field: 'weaponProperties.ammunition',
        message: 'Weapon with ammunition property must have ammunition data',
        code: 'MISSING_AMMUNITION_DATA',
      });
    }

    if (props.includes('thrown') && !weapon.weaponProperties.thrownRange) {
      errors.push({
        field: 'weaponProperties.thrownRange',
        message: 'Thrown weapon must have thrown range data',
        code: 'MISSING_THROWN_RANGE',
      });
    }

    if (
      props.includes('powered') &&
      !weapon.weaponProperties.powerRequirement
    ) {
      errors.push({
        field: 'weaponProperties.powerRequirement',
        message: 'Powered weapon must have power requirement data',
        code: 'MISSING_POWER_REQUIREMENT',
      });
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: weapon };
  }

  /**
   * Create a basic weapon with default properties
   */
  export function createWeapon(
    id: string,
    name: string,
    type: WeaponType,
    tier: CraftsmanshipTier,
    damage: WeaponDamage,
    range: WeaponRange,
    properties: WeaponProperty[] = [],
    proficiency: WeaponProficiency = 'simple-melee'
  ): Weapon {
    const baseProperties: EquipmentProperties = {
      physical: {
        weight: 1,
        bulk: 1,
        size: 'medium',
      },
      requiresPower: properties.includes('powered'),
      canMalfunction: properties.includes('powered'),
      magical: false,
      psionic: false,
    };

    const weaponProperties: WeaponProperties = {
      damage,
      properties,
      range,
      powered: properties.includes('powered'),
      proficiency,
      attackAbility: properties.includes('finesse') ? 'dexterity' : 'strength',
      throwable: properties.includes('thrown'),
    };

    return {
      id: id as any, // Type assertion for branded type
      name,
      type,
      tier,
      properties: baseProperties,
      condition: 'pristine',
      value: { cogs: 0, gears: 1, cores: 0 },
      modSlots: [],
      isUnique: false,
      weaponProperties,
    };
  }
}
