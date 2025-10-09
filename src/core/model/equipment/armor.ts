/**
 * Armor and shield system implementation for Hollow Gear
 * Includes traditional D&D armor plus powered armor systems
 */

import type { 
  Equipment, 
  ArmorType,
  ShieldType, 
  CraftsmanshipTier, 
  EquipmentProperties,
  PowerRequirement,
  SpecialMaterial
} from './base.js';
import type { ValidationResult, ValidationError, AbilityScore } from '../types/common.js';
import type { DamageType } from './weapons.js';

/**
 * Armor-specific interface extending base Equipment
 */
export interface Armor extends Equipment {
  type: ArmorType;
  armorProperties: ArmorProperties;
}

/**
 * Shield-specific interface extending base Equipment
 */
export interface Shield extends Equipment {
  type: ShieldType;
  shieldProperties: ShieldProperties;
}

/**
 * Core armor properties and statistics
 */
export interface ArmorProperties {
  /** Base armor class provided */
  baseAC: number;
  /** Maximum Dex modifier that can be added */
  maxDexBonus?: number;
  /** Minimum strength required to wear without penalty */
  strengthRequirement?: number;
  /** Whether this armor imposes stealth disadvantage */
  stealthDisadvantage: boolean;
  /** Armor category for proficiency */
  category: ArmorCategory;
  /** Whether this is powered armor */
  powered: boolean;
  /** Power requirements if powered */
  powerRequirement?: PowerRequirement;
  /** Maintenance requirements */
  maintenance?: MaintenanceRequirements;
  /** Environmental protections provided */
  environmentalProtection: EnvironmentalProtection[];
  /** Damage resistances provided */
  damageResistances: DamageType[];
  /** Damage vulnerabilities imposed */
  damageVulnerabilities: DamageType[];
}

/**
 * Core shield properties and statistics
 */
export interface ShieldProperties {
  /** AC bonus provided by the shield */
  acBonus: number;
  /** Whether this shield can be used for shield bash attacks */
  canBash: boolean;
  /** Damage for shield bash if applicable */
  bashDamage?: {
    diceCount: number;
    diceType: 'd4' | 'd6' | 'd8';
    damageType: DamageType;
  };
  /** Shield category for proficiency */
  category: ShieldCategory;
  /** Whether this is a powered shield */
  powered: boolean;
  /** Power requirements if powered */
  powerRequirement?: PowerRequirement;
  /** Special shield abilities */
  specialAbilities: ShieldAbility[];
  /** Coverage area (for tower shields) */
  coverage: ShieldCoverage;
  /** Whether shield provides cover to others */
  providesCover: boolean;
}

/**
 * Armor categories for proficiency requirements
 */
export type ArmorCategory = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'powered'
  | 'natural'; // For creatures with natural armor

/**
 * Shield categories for proficiency requirements
 */
export type ShieldCategory = 
  | 'light'
  | 'heavy'
  | 'tower'
  | 'powered';

/**
 * Environmental protections provided by armor
 */
export type EnvironmentalProtection = 
  | 'vacuum'        // Space/airless environments
  | 'underwater'    // Underwater breathing and pressure
  | 'extreme-heat'  // High temperature environments
  | 'extreme-cold'  // Low temperature environments
  | 'radiation'     // Radioactive environments
  | 'toxic-gas'     // Poisonous atmospheres
  | 'acid-rain'     // Corrosive environments
  | 'electrical'    // High electrical fields
  | 'psionic'       // Psionic interference
  | 'aether-storm'; // Aether energy storms

/**
 * Maintenance requirements for powered equipment
 */
export interface MaintenanceRequirements {
  /** Hours of operation before maintenance needed */
  operatingHours: number;
  /** Current hours since last maintenance */
  currentHours: number;
  /** Type of maintenance required */
  maintenanceType: MaintenanceType;
  /** Skill required for maintenance */
  requiredSkill: string;
  /** DC for maintenance checks */
  maintenanceDC: number;
  /** Cost of maintenance in currency */
  maintenanceCost: {
    cogs: number;
    gears: number;
    cores: number;
  };
}

/**
 * Types of maintenance required
 */
export type MaintenanceType = 
  | 'cleaning'      // Basic cleaning and inspection
  | 'lubrication'   // Oil and grease moving parts
  | 'calibration'   // Adjust sensors and systems
  | 'replacement'   // Replace worn components
  | 'overhaul'      // Complete system rebuild
  | 'power-cell'    // Replace power cells
  | 'coolant'       // Refill coolant systems
  | 'filter'        // Replace air/fluid filters
  | 'seal'          // Replace seals and gaskets
  | 'diagnostic';   // Run system diagnostics

/**
 * Special abilities that shields can provide
 */
export interface ShieldAbility {
  /** Name of the ability */
  name: string;
  /** Type of ability */
  type: ShieldAbilityType;
  /** Description of the ability */
  description: string;
  /** Usage limitations */
  usage?: AbilityUsage;
  /** Power cost if applicable */
  powerCost?: number;
}

/**
 * Types of special shield abilities
 */
export type ShieldAbilityType = 
  | 'energy-absorption'  // Absorbs energy attacks
  | 'reflection'         // Reflects attacks back
  | 'force-field'        // Projects protective field
  | 'reactive-armor'     // Explodes outward when hit
  | 'adaptive-plating'   // Changes to resist damage types
  | 'magnetic-field'     // Deflects metal projectiles
  | 'phase-shift'        // Briefly becomes incorporeal
  | 'healing-field'      // Provides regeneration
  | 'concealment'        // Provides camouflage
  | 'communication'      // Built-in communication system
  | 'sensor-array'       // Enhanced perception
  | 'weapon-mount';      // Integrated weapon system

/**
 * Usage limitations for abilities
 */
export interface AbilityUsage {
  /** How often the ability can be used */
  frequency: 'at-will' | 'per-encounter' | 'per-day' | 'per-week';
  /** Number of uses per frequency period */
  uses: number;
  /** Current remaining uses */
  remainingUses: number;
  /** Whether ability recharges on dice roll */
  recharge?: {
    dieType: 'd6' | 'd20';
    target: number;
  };
}

/**
 * Shield coverage areas
 */
export type ShieldCoverage = 
  | 'quarter'    // Covers 1/4 of body
  | 'half'       // Covers 1/2 of body  
  | 'three-quarter' // Covers 3/4 of body
  | 'full'       // Covers entire body
  | 'directional'; // Only covers one direction

/**
 * Powered armor system states
 */
export interface PoweredArmorState {
  /** Whether the armor is currently powered on */
  powered: boolean;
  /** Current power level (0-100) */
  powerLevel: number;
  /** Operating mode */
  mode: PoweredArmorMode;
  /** System status indicators */
  systemStatus: SystemStatus[];
  /** Heat level generated by systems */
  heatLevel: number;
  /** Coolant remaining */
  coolantLevel: number;
}

/**
 * Operating modes for powered armor
 */
export type PoweredArmorMode = 
  | 'standby'     // Minimal power, basic functions
  | 'normal'      // Standard operation
  | 'combat'      // Enhanced performance, higher power draw
  | 'stealth'     // Reduced signatures, limited functions
  | 'emergency'   // Emergency power only
  | 'maintenance' // Systems accessible for repair
  | 'lockdown';   // All systems disabled

/**
 * System status indicators
 */
export interface SystemStatus {
  /** System name */
  system: string;
  /** Current status */
  status: 'operational' | 'degraded' | 'offline' | 'critical';
  /** Status message */
  message: string;
  /** Repair priority */
  priority: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Utility functions for armor and shield management
 */
export namespace ArmorUtils {
  /**
   * Calculate effective AC including Dex modifier
   */
  export function calculateAC(
    armor: Armor, 
    dexModifier: number, 
    shieldBonus: number = 0,
    otherBonuses: number = 0
  ): number {
    let ac = armor.armorProperties.baseAC;
    
    // Add Dex modifier up to maximum allowed
    if (armor.armorProperties.maxDexBonus !== undefined) {
      ac += Math.min(dexModifier, armor.armorProperties.maxDexBonus);
    } else {
      ac += dexModifier;
    }
    
    // Add shield and other bonuses
    ac += shieldBonus + otherBonuses;
    
    return ac;
  }

  /**
   * Check if character meets strength requirement
   */
  export function meetsStrengthRequirement(armor: Armor, strength: number): boolean {
    if (!armor.armorProperties.strengthRequirement) {
      return true;
    }
    return strength >= armor.armorProperties.strengthRequirement;
  }

  /**
   * Get speed penalty for not meeting strength requirement
   */
  export function getSpeedPenalty(armor: Armor, strength: number): number {
    if (meetsStrengthRequirement(armor, strength)) {
      return 0;
    }
    return 10; // Standard D&D penalty
  }

  /**
   * Check if armor needs maintenance
   */
  export function needsMaintenance(armor: Armor): boolean {
    if (!armor.armorProperties.maintenance) {
      return false;
    }
    
    const maint = armor.armorProperties.maintenance;
    return maint.currentHours >= maint.operatingHours;
  }

  /**
   * Get maintenance urgency level
   */
  export function getMaintenanceUrgency(armor: Armor): 'none' | 'due' | 'overdue' | 'critical' {
    if (!armor.armorProperties.maintenance) {
      return 'none';
    }
    
    const maint = armor.armorProperties.maintenance;
    const ratio = maint.currentHours / maint.operatingHours;
    
    if (ratio < 1) return 'none';
    if (ratio < 1.2) return 'due';
    if (ratio < 1.5) return 'overdue';
    return 'critical';
  }

  /**
   * Perform maintenance on armor
   */
  export function performMaintenance(armor: Armor): Armor {
    if (!armor.armorProperties.maintenance) {
      return armor;
    }

    const newMaintenance = {
      ...armor.armorProperties.maintenance,
      currentHours: 0
    };

    return {
      ...armor,
      armorProperties: {
        ...armor.armorProperties,
        maintenance: newMaintenance
      }
    };
  }

  /**
   * Validate armor data
   */
  export function validateArmor(armor: Armor): ValidationResult<Armor> {
    const errors: ValidationError[] = [];

    // Validate AC
    if (armor.armorProperties.baseAC < 10 || armor.armorProperties.baseAC > 25) {
      errors.push({
        field: 'armorProperties.baseAC',
        message: 'Base AC must be between 10 and 25',
        code: 'INVALID_BASE_AC'
      });
    }

    // Validate max dex bonus
    if (armor.armorProperties.maxDexBonus !== undefined && armor.armorProperties.maxDexBonus < 0) {
      errors.push({
        field: 'armorProperties.maxDexBonus',
        message: 'Max Dex bonus cannot be negative',
        code: 'INVALID_MAX_DEX'
      });
    }

    // Validate strength requirement
    if (armor.armorProperties.strengthRequirement !== undefined) {
      if (armor.armorProperties.strengthRequirement < 8 || armor.armorProperties.strengthRequirement > 20) {
        errors.push({
          field: 'armorProperties.strengthRequirement',
          message: 'Strength requirement must be between 8 and 20',
          code: 'INVALID_STR_REQ'
        });
      }
    }

    // Validate maintenance if present
    if (armor.armorProperties.maintenance) {
      const maint = armor.armorProperties.maintenance;
      
      if (maint.operatingHours <= 0) {
        errors.push({
          field: 'armorProperties.maintenance.operatingHours',
          message: 'Operating hours must be positive',
          code: 'INVALID_OPERATING_HOURS'
        });
      }

      if (maint.currentHours < 0) {
        errors.push({
          field: 'armorProperties.maintenance.currentHours',
          message: 'Current hours cannot be negative',
          code: 'INVALID_CURRENT_HOURS'
        });
      }
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: armor };
  }
}

/**
 * Utility functions for shield management
 */
export namespace ShieldUtils {
  /**
   * Check if shield can be used for bashing
   */
  export function canBash(shield: Shield): boolean {
    return shield.shieldProperties.canBash && shield.shieldProperties.bashDamage !== undefined;
  }

  /**
   * Get shield bash damage
   */
  export function getBashDamage(shield: Shield) {
    return shield.shieldProperties.bashDamage;
  }

  /**
   * Check if shield ability is available
   */
  export function isAbilityAvailable(ability: ShieldAbility): boolean {
    if (!ability.usage) {
      return true; // No usage restrictions
    }
    return ability.usage.remainingUses > 0;
  }

  /**
   * Use a shield ability
   */
  export function useAbility(shield: Shield, abilityName: string): Shield {
    const abilityIndex = shield.shieldProperties.specialAbilities.findIndex(
      ability => ability.name === abilityName
    );
    
    if (abilityIndex === -1) {
      return shield; // Ability not found
    }

    const ability = shield.shieldProperties.specialAbilities[abilityIndex];
    if (!ability?.usage || ability.usage.remainingUses <= 0) {
      return shield; // No uses remaining
    }

    const newAbilities = [...shield.shieldProperties.specialAbilities];
    newAbilities[abilityIndex] = {
      ...ability,
      usage: {
        ...ability.usage,
        remainingUses: ability.usage.remainingUses - 1
      }
    };

    return {
      ...shield,
      shieldProperties: {
        ...shield.shieldProperties,
        specialAbilities: newAbilities
      }
    };
  }

  /**
   * Restore shield ability uses
   */
  export function restoreAbilityUses(shield: Shield, frequency: 'per-encounter' | 'per-day' | 'per-week'): Shield {
    const newAbilities = shield.shieldProperties.specialAbilities.map(ability => {
      if (ability.usage && ability.usage.frequency === frequency) {
        return {
          ...ability,
          usage: {
            ...ability.usage,
            remainingUses: ability.usage.uses
          }
        };
      }
      return ability;
    });

    return {
      ...shield,
      shieldProperties: {
        ...shield.shieldProperties,
        specialAbilities: newAbilities
      }
    };
  }

  /**
   * Validate shield data
   */
  export function validateShield(shield: Shield): ValidationResult<Shield> {
    const errors: ValidationError[] = [];

    // Validate AC bonus
    if (shield.shieldProperties.acBonus < 1 || shield.shieldProperties.acBonus > 5) {
      errors.push({
        field: 'shieldProperties.acBonus',
        message: 'Shield AC bonus must be between 1 and 5',
        code: 'INVALID_AC_BONUS'
      });
    }

    // Validate bash damage if present
    if (shield.shieldProperties.canBash && !shield.shieldProperties.bashDamage) {
      errors.push({
        field: 'shieldProperties.bashDamage',
        message: 'Shield that can bash must have bash damage defined',
        code: 'MISSING_BASH_DAMAGE'
      });
    }

    // Validate special abilities
    for (const ability of shield.shieldProperties.specialAbilities) {
      if (ability.usage) {
        if (ability.usage.uses <= 0) {
          errors.push({
            field: 'shieldProperties.specialAbilities',
            message: `Ability ${ability.name} must have positive uses`,
            code: 'INVALID_ABILITY_USES'
          });
        }

        if (ability.usage.remainingUses < 0 || ability.usage.remainingUses > ability.usage.uses) {
          errors.push({
            field: 'shieldProperties.specialAbilities',
            message: `Ability ${ability.name} has invalid remaining uses`,
            code: 'INVALID_REMAINING_USES'
          });
        }
      }
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: shield };
  }
}