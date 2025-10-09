/**
 * Equipment and modification system exports
 */

// Base equipment types and interfaces
export type {
  Equipment,
  EquipmentType,
  WeaponType,
  ArmorType,
  ShieldType,
  ItemType,
  CraftsmanshipTier,
  EquipmentCondition,
  EquipmentProperties,
  PhysicalProperties,
  CurrencyValue,
  SpecialMaterial,
  ModSlot,
  ModSlotType,
  EquipmentMod,
  ModEffect,
  ModEffectType,
  PowerRequirement,
  PowerSource,
  MalfunctionState,
  MalfunctionType,
  AttunementRequirement,
  AttunementCondition,
} from './base.js';

// Equipment utilities
export { EquipmentUtils } from './base.js';

// Weapon system
export type {
  Weapon,
  WeaponProperties,
  WeaponDamage,
  WeaponRange,
  WeaponProperty,
  WeaponProficiency,
  DamageType,
  AmmunitionData,
  AmmunitionType,
  AmmunitionProperty,
  ReloadMechanics,
  OverchargeMechanics,
  WeaponMaterialProperties,
} from './weapons.js';

export { WeaponUtils } from './weapons.js';

// Armor and shield system
export type {
  Armor,
  Shield,
  ArmorProperties,
  ShieldProperties,
  ArmorCategory,
  ShieldCategory,
  EnvironmentalProtection,
  MaintenanceRequirements,
  MaintenanceType,
  ShieldAbility,
  ShieldAbilityType,
  AbilityUsage,
  ShieldCoverage,
  PoweredArmorState,
  PoweredArmorMode,
  SystemStatus,
} from './armor.js';

export { ArmorUtils, ShieldUtils } from './armor.js';

// Equipment modification system
export type {
  InstalledMod,
  InstallationQuality,
  ModCondition,
  CalibrationState,
  ModBlueprint,
  CraftingMaterial,
  SkillRequirement,
  InstallationRequirement,
  ModCompatibility,
  ModSynergy,
  InstallationResult,
  InstallationComplication,
  ComplicationType,
} from './modifications.js';

export { ModUtils } from './modifications.js';

// Inventory and item management
export type {
  InventoryData,
  EquippedItems,
  CarriedItem,
  ItemLocation,
  Container,
  ContainerType,
  ContainerProperties,
  ContainerSpecialProperty,
  CarryingCapacity,
  EncumbranceLevel,
  ItemBundle,
  QuickAccessSlots,
} from './inventory.js';

export { InventoryUtils } from './inventory.js';
