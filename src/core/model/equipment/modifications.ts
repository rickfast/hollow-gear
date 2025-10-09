/**
 * Equipment modification system for Hollow Gear
 * Handles mod installation, compatibility, and effects
 */

import type { 
  Equipment,
  ModSlot,
  ModSlotType,
  EquipmentMod,
  ModEffect,
  ModEffectType,
  PowerRequirement,
  MalfunctionState,
  MalfunctionType,
  CraftsmanshipTier
} from './base.js';
import type { ValidationResult, ValidationError, ModId } from '../types/common.js';

/**
 * Extended mod interface with installation details
 */
export interface InstalledMod extends EquipmentMod {
  /** When this mod was installed */
  installationDate: Date;
  /** Who installed this mod */
  installedBy?: string;
  /** Installation quality (affects performance) */
  installationQuality: InstallationQuality;
  /** Current condition of the mod */
  condition: ModCondition;
  /** Operating hours since installation */
  operatingHours: number;
  /** Calibration state */
  calibration: CalibrationState;
}

/**
 * Quality of mod installation
 */
export type InstallationQuality = 
  | 'poor'      // -1 to effectiveness, higher malfunction chance
  | 'adequate'  // Standard performance
  | 'good'      // +1 to effectiveness
  | 'excellent' // +2 to effectiveness, lower malfunction chance
  | 'masterwork'; // +3 to effectiveness, much lower malfunction chance

/**
 * Condition states for installed mods
 */
export type ModCondition = 
  | 'pristine'   // Perfect condition
  | 'good'       // Minor wear
  | 'worn'       // Noticeable wear, minor penalties
  | 'damaged'    // Significant damage, clear penalties
  | 'failing'    // About to break, major penalties
  | 'broken';    // Non-functional

/**
 * Calibration state for precision mods
 */
export interface CalibrationState {
  /** Whether the mod is properly calibrated */
  calibrated: boolean;
  /** Calibration drift over time (0-100) */
  drift: number;
  /** Last calibration date */
  lastCalibration?: Date;
  /** Calibration quality */
  quality: 'poor' | 'standard' | 'precise' | 'perfect';
}

/**
 * Mod blueprint for crafting and installation
 */
export interface ModBlueprint {
  /** Blueprint identifier */
  id: string;
  /** Display name */
  name: string;
  /** Mod type this blueprint creates */
  modType: ModSlotType;
  /** Tier of mod this blueprint creates */
  tier: number;
  /** Required materials */
  materials: CraftingMaterial[];
  /** Required tools */
  tools: string[];
  /** Crafting time in hours */
  craftingTime: number;
  /** Skill requirements */
  skillRequirements: SkillRequirement[];
  /** Installation requirements */
  installationRequirements: InstallationRequirement[];
}

/**
 * Materials required for crafting
 */
export interface CraftingMaterial {
  /** Material name */
  name: string;
  /** Quantity required */
  quantity: number;
  /** Quality tier required */
  qualityTier: CraftsmanshipTier;
  /** Whether material is consumed in crafting */
  consumed: boolean;
}

/**
 * Skill requirements for crafting or installation
 */
export interface SkillRequirement {
  /** Skill name */
  skill: string;
  /** Minimum proficiency bonus required */
  minimumProficiency: number;
  /** DC for the skill check */
  dc: number;
  /** Whether expertise is required */
  expertiseRequired: boolean;
}

/**
 * Requirements for installing a mod
 */
export interface InstallationRequirement {
  /** Type of requirement */
  type: 'tool' | 'facility' | 'skill' | 'time' | 'assistant';
  /** Specific requirement */
  requirement: string;
  /** Whether this requirement is optional */
  optional: boolean;
}

/**
 * Mod compatibility rules
 */
export interface ModCompatibility {
  /** Mods that cannot be installed together */
  incompatibleMods: ModId[];
  /** Mods that provide synergy bonuses */
  synergyMods: ModSynergy[];
  /** Equipment types this mod can be installed on */
  compatibleEquipment: string[];
  /** Equipment types this mod cannot be installed on */
  incompatibleEquipment: string[];
  /** Minimum equipment tier required */
  minimumEquipmentTier: CraftsmanshipTier;
}

/**
 * Synergy effects between compatible mods
 */
export interface ModSynergy {
  /** Other mod that provides synergy */
  modId: ModId;
  /** Bonus effects when both mods are installed */
  synergyEffects: ModEffect[];
  /** Description of the synergy */
  description: string;
}

/**
 * Mod installation result
 */
export interface InstallationResult {
  /** Whether installation was successful */
  success: boolean;
  /** Resulting equipment with mod installed */
  equipment?: Equipment;
  /** Installation quality achieved */
  quality?: InstallationQuality;
  /** Any complications that occurred */
  complications?: InstallationComplication[];
  /** Error messages if installation failed */
  errors?: string[];
}

/**
 * Complications that can occur during installation
 */
export interface InstallationComplication {
  /** Type of complication */
  type: ComplicationType;
  /** Severity of the complication */
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  /** Description of what happened */
  description: string;
  /** Effects on the equipment or mod */
  effects: string[];
}

/**
 * Types of installation complications
 */
export type ComplicationType = 
  | 'power-surge'      // Electrical damage
  | 'calibration-drift' // Mod not properly tuned
  | 'component-damage' // Parts damaged during install
  | 'compatibility-issue' // Unexpected interaction
  | 'tool-failure'     // Installation tool broke
  | 'contamination'    // Foreign matter in system
  | 'overheating'      // Thermal damage
  | 'short-circuit'    // Electrical fault
  | 'mechanical-stress' // Physical damage
  | 'software-conflict'; // Programming issues

/**
 * Utility functions for mod management
 */
export namespace ModUtils {
  /**
   * Check if a mod can be installed on equipment
   */
  export function canInstallMod(
    equipment: Equipment, 
    mod: EquipmentMod, 
    slotId: string
  ): ValidationResult<boolean> {
    const errors: ValidationError[] = [];
    
    // Find the target slot
    const slot = equipment.modSlots.find(s => s.id === slotId);
    if (!slot) {
      errors.push({
        field: 'slotId',
        message: 'Mod slot not found',
        code: 'SLOT_NOT_FOUND'
      });
      return { success: false, error: errors };
    }

    // Check if slot is accessible
    if (!slot.accessible) {
      errors.push({
        field: 'slot.accessible',
        message: 'Mod slot is not accessible',
        code: 'SLOT_NOT_ACCESSIBLE'
      });
    }

    // Check if slot is already occupied
    if (slot.installedMod) {
      errors.push({
        field: 'slot.installedMod',
        message: 'Mod slot is already occupied',
        code: 'SLOT_OCCUPIED'
      });
    }

    // Check slot type compatibility
    if (slot.type !== 'universal' && slot.type !== mod.type) {
      errors.push({
        field: 'mod.type',
        message: `Mod type ${mod.type} is not compatible with slot type ${slot.type}`,
        code: 'TYPE_INCOMPATIBLE'
      });
    }

    // Check equipment tier requirements
    const equipmentTierValue = getTierValue(equipment.tier);
    const requiredTierValue = getTierValue(mod.installationTier);
    
    if (equipmentTierValue < requiredTierValue) {
      errors.push({
        field: 'equipment.tier',
        message: `Equipment tier ${equipment.tier} is insufficient for mod requiring ${mod.installationTier}`,
        code: 'TIER_INSUFFICIENT'
      });
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: true };
  }

  /**
   * Install a mod on equipment
   */
  export function installMod(
    equipment: Equipment,
    mod: EquipmentMod,
    slotId: string,
    installationQuality: InstallationQuality = 'adequate'
  ): InstallationResult {
    // Validate installation
    const validation = canInstallMod(equipment, mod, slotId);
    if (!validation.success) {
      return {
        success: false,
        errors: validation.error.map(e => e.message)
      };
    }

    // Find the slot
    const slotIndex = equipment.modSlots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) {
      return {
        success: false,
        errors: ['Mod slot not found']
      };
    }

    // Create installed mod
    const installedMod: InstalledMod = {
      ...mod,
      installationDate: new Date(),
      installationQuality,
      condition: 'pristine',
      operatingHours: 0,
      calibration: {
        calibrated: true,
        drift: 0,
        lastCalibration: new Date(),
        quality: 'standard'
      }
    };

    // Update the slot
    const newSlots = [...equipment.modSlots];
    const currentSlot = newSlots[slotIndex];
    if (!currentSlot) {
      return { success: false, errors: ['Invalid slot index'] };
    }
    
    newSlots[slotIndex] = {
      id: currentSlot.id,
      type: currentSlot.type,
      accessible: currentSlot.accessible,
      malfunctionState: currentSlot.malfunctionState,
      installedMod: installedMod
    };

    // Create updated equipment
    const updatedEquipment: Equipment = {
      ...equipment,
      modSlots: newSlots
    };

    return {
      success: true,
      equipment: updatedEquipment,
      quality: installationQuality
    };
  }

  /**
   * Remove a mod from equipment
   */
  export function removeMod(equipment: Equipment, slotId: string): Equipment {
    const slotIndex = equipment.modSlots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) {
      return equipment; // Slot not found, return unchanged
    }

    const newSlots = [...equipment.modSlots];
    const currentSlot = newSlots[slotIndex];
    if (!currentSlot) {
      return equipment; // Invalid slot, return unchanged
    }
    
    newSlots[slotIndex] = {
      id: currentSlot.id,
      type: currentSlot.type,
      accessible: currentSlot.accessible,
      installedMod: undefined,
      malfunctionState: undefined
    };

    return {
      ...equipment,
      modSlots: newSlots
    };
  }

  /**
   * Get all active mod effects on equipment
   */
  export function getActiveModEffects(equipment: Equipment): ModEffect[] {
    const effects: ModEffect[] = [];
    
    for (const slot of equipment.modSlots) {
      const installedMod = slot.installedMod as InstalledMod | undefined;
      if (installedMod && installedMod.condition !== 'broken') {
        // Apply installation quality modifier
        const qualityModifier = getQualityModifier(installedMod.installationQuality);
        
        const modifiedEffects = installedMod.effects.map(effect => ({
          ...effect,
          value: effect.value + qualityModifier
        }));
        
        effects.push(...modifiedEffects);
      }
    }
    
    return effects;
  }

  /**
   * Check for mod synergies
   */
  export function checkSynergies(equipment: Equipment): ModEffect[] {
    const synergyEffects: ModEffect[] = [];
    const installedMods = equipment.modSlots
      .map(slot => slot.installedMod)
      .filter((mod): mod is EquipmentMod => mod !== undefined);

    // This would need to be expanded with actual synergy data
    // For now, return empty array
    return synergyEffects;
  }

  /**
   * Calculate mod malfunction chance
   */
  export function calculateMalfunctionChance(
    mod: InstalledMod,
    operatingConditions: 'normal' | 'harsh' | 'extreme' = 'normal'
  ): number {
    let baseChance = 0.01; // 1% base chance
    
    // Adjust for condition
    switch (mod.condition) {
      case 'pristine': baseChance *= 0.5; break;
      case 'good': baseChance *= 0.8; break;
      case 'worn': baseChance *= 1.5; break;
      case 'damaged': baseChance *= 3; break;
      case 'failing': baseChance *= 10; break;
      case 'broken': return 1; // Always malfunctions
    }
    
    // Adjust for installation quality
    switch (mod.installationQuality) {
      case 'poor': baseChance *= 2; break;
      case 'adequate': break; // No change
      case 'good': baseChance *= 0.8; break;
      case 'excellent': baseChance *= 0.6; break;
      case 'masterwork': baseChance *= 0.4; break;
    }
    
    // Adjust for operating conditions
    switch (operatingConditions) {
      case 'normal': break; // No change
      case 'harsh': baseChance *= 1.5; break;
      case 'extreme': baseChance *= 3; break;
    }
    
    // Adjust for calibration drift
    if (!mod.calibration.calibrated || mod.calibration.drift > 50) {
      baseChance *= 1.5;
    }
    
    return Math.min(baseChance, 0.95); // Cap at 95%
  }

  /**
   * Perform maintenance on a mod
   */
  export function performModMaintenance(
    equipment: Equipment,
    slotId: string,
    maintenanceQuality: 'basic' | 'thorough' | 'overhaul' = 'basic'
  ): Equipment {
    const slotIndex = equipment.modSlots.findIndex(s => s.id === slotId);
    if (slotIndex === -1) {
      return equipment;
    }

    const slot = equipment.modSlots[slotIndex];
    if (!slot?.installedMod) {
      return equipment;
    }

    const mod = slot.installedMod as InstalledMod;
    
    let newCondition = mod.condition;
    let newCalibration = { ...mod.calibration };
    
    // Improve condition based on maintenance quality
    switch (maintenanceQuality) {
      case 'basic':
        if (newCondition === 'worn') newCondition = 'good';
        newCalibration.drift = Math.max(0, newCalibration.drift - 10);
        break;
      case 'thorough':
        if (newCondition === 'damaged') newCondition = 'worn';
        else if (newCondition === 'worn') newCondition = 'good';
        newCalibration.drift = Math.max(0, newCalibration.drift - 25);
        newCalibration.calibrated = true;
        break;
      case 'overhaul':
        if (newCondition !== 'broken') newCondition = 'pristine';
        newCalibration = {
          calibrated: true,
          drift: 0,
          lastCalibration: new Date(),
          quality: 'precise'
        };
        break;
    }
    
    const updatedMod: InstalledMod = {
      ...mod,
      condition: newCondition,
      operatingHours: 0, // Reset operating hours
      calibration: newCalibration
    };
    
    const newSlots = [...equipment.modSlots];
    newSlots[slotIndex] = {
      id: slot.id,
      type: slot.type,
      accessible: slot.accessible,
      installedMod: updatedMod,
      malfunctionState: newCondition === 'broken' ? slot.malfunctionState : undefined
    };
    
    return {
      ...equipment,
      modSlots: newSlots
    };
  }

  /**
   * Get tier numeric value for comparison
   */
  function getTierValue(tier: CraftsmanshipTier): number {
    switch (tier) {
      case 'workshop': return 1;
      case 'guild': return 2;
      case 'relic': return 3;
      case 'mythic': return 4;
    }
  }

  /**
   * Get quality modifier for effects
   */
  function getQualityModifier(quality: InstallationQuality): number {
    switch (quality) {
      case 'poor': return -1;
      case 'adequate': return 0;
      case 'good': return 1;
      case 'excellent': return 2;
      case 'masterwork': return 3;
    }
  }

  /**
   * Validate mod data
   */
  export function validateMod(mod: EquipmentMod): ValidationResult<EquipmentMod> {
    const errors: ValidationError[] = [];

    // Validate basic properties
    if (!mod.id || mod.id.trim() === '') {
      errors.push({
        field: 'id',
        message: 'Mod ID is required',
        code: 'MISSING_ID'
      });
    }

    if (!mod.name || mod.name.trim() === '') {
      errors.push({
        field: 'name',
        message: 'Mod name is required',
        code: 'MISSING_NAME'
      });
    }

    // Validate tier
    if (mod.tier < 1 || mod.tier > 4) {
      errors.push({
        field: 'tier',
        message: 'Mod tier must be between 1 and 4',
        code: 'INVALID_TIER'
      });
    }

    // Validate effects
    if (mod.effects.length === 0) {
      errors.push({
        field: 'effects',
        message: 'Mod must have at least one effect',
        code: 'NO_EFFECTS'
      });
    }

    for (const effect of mod.effects) {
      if (effect.value === 0) {
        errors.push({
          field: 'effects',
          message: 'Effect value cannot be zero',
          code: 'ZERO_EFFECT_VALUE'
        });
      }
    }

    if (errors.length > 0) {
      return { success: false, error: errors };
    }

    return { success: true, data: mod };
  }
}