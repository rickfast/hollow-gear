/**
 * Inventory and item management system for Hollow Gear
 * Handles carrying capacity, item locations, and containers
 */

import type { 
  Equipment,
  CurrencyValue,
  PhysicalProperties
} from './base.js';
import type { EquipmentId } from '../types/common.js';
import type { ValidationResult, ValidationError } from '../types/common.js';

/**
 * Complete inventory data for a character
 */
export interface InventoryData {
  /** Items currently equipped on the character */
  equipped: EquippedItems;
  /** Items carried but not equipped */
  carried: CarriedItem[];
  /** Items stored in containers */
  containers: Container[];
  /** Character's currency */
  currency: CurrencyValue;
  /** Carrying capacity information */
  capacity: CarryingCapacity;
  /** Encumbrance state */
  encumbrance: EncumbranceLevel;
}

/**
 * Items currently equipped by the character
 */
export interface EquippedItems {
  /** Main hand weapon */
  mainHand?: EquipmentId;
  /** Off hand weapon or shield */
  offHand?: EquipmentId;
  /** Armor worn */
  armor?: EquipmentId;
  /** Accessories and jewelry */
  accessories: EquipmentId[];
  /** Tools and utility items */
  tools: EquipmentId[];
  /** Maximum number of accessory slots */
  maxAccessories: number;
  /** Maximum number of tool slots */
  maxTools: number;
}

/**
 * Item carried in inventory with location tracking
 */
export interface CarriedItem {
  /** Equipment reference */
  equipment: Equipment;
  /** Quantity of this item */
  quantity: number;
  /** Location where item is stored */
  location: ItemLocation;
  /** Whether item is easily accessible */
  accessible: boolean;
  /** Notes about the item */
  notes?: string;
}

/**
 * Where an item is located
 */
export type ItemLocation = 
  | 'belt'        // On character's belt, easily accessible
  | 'backpack'    // In main backpack
  | 'pockets'     // In clothing pockets
  | 'bandolier'   // On ammunition bandolier
  | 'holster'     // In weapon holster
  | 'sheath'      // In weapon sheath
  | 'pouch'       // In belt pouch
  | 'saddlebags'  // On mount's saddlebags
  | 'cart'        // In cart or wagon
  | 'container';  // In a specific container

/**
 * Container for storing items
 */
export interface Container {
  /** Container identifier */
  id: string;
  /** Container name */
  name: string;
  /** Type of container */
  type: ContainerType;
  /** Items stored in this container */
  contents: CarriedItem[];
  /** Container's physical properties */
  properties: ContainerProperties;
  /** Whether container is currently accessible */
  accessible: boolean;
  /** Location of the container itself */
  location: ItemLocation;
}

/**
 * Types of containers
 */
export type ContainerType = 
  | 'backpack'
  | 'chest'
  | 'barrel'
  | 'crate'
  | 'bag'
  | 'pouch'
  | 'quiver'
  | 'bandolier'
  | 'holster'
  | 'sheath'
  | 'saddlebags'
  | 'cart'
  | 'vault'
  | 'locker';

/**
 * Container-specific properties
 */
export interface ContainerProperties {
  /** Maximum weight the container can hold */
  weightCapacity: number;
  /** Maximum bulk the container can hold */
  bulkCapacity: number;
  /** Maximum number of items */
  itemCapacity?: number;
  /** Container's own weight when empty */
  emptyWeight: number;
  /** Container's own bulk */
  bulk: number;
  /** Whether container is waterproof */
  waterproof: boolean;
  /** Whether container can be locked */
  lockable: boolean;
  /** Current lock state if lockable */
  locked?: boolean;
  /** Special properties */
  specialProperties: ContainerSpecialProperty[];
}

/**
 * Special properties containers can have
 */
export type ContainerSpecialProperty = 
  | 'dimensional'     // Holds more than physically possible
  | 'weightless'      // Contents don't add to carrying weight
  | 'preserving'      // Prevents decay of organic items
  | 'cooling'         // Keeps contents cool
  | 'heating'         // Keeps contents warm
  | 'airtight'        // Completely sealed from air
  | 'lead-lined'      // Blocks radiation and scrying
  | 'reinforced'      // Extra protection for contents
  | 'organized'       // Items are easier to find
  | 'quick-access';   // Items can be drawn as free action

/**
 * Character's carrying capacity information
 */
export interface CarryingCapacity {
  /** Maximum weight that can be carried */
  maxWeight: number;
  /** Maximum bulk that can be carried */
  maxBulk: number;
  /** Current total weight being carried */
  currentWeight: number;
  /** Current total bulk being carried */
  currentBulk: number;
  /** Strength modifier affecting capacity */
  strengthModifier: number;
  /** Size category affecting capacity */
  sizeCategory: 'tiny' | 'small' | 'medium' | 'large' | 'huge' | 'gargantuan';
}

/**
 * Encumbrance levels affecting movement and actions
 */
export type EncumbranceLevel = 
  | 'unencumbered'  // No penalties
  | 'light'         // Minor penalties
  | 'moderate'      // Moderate penalties
  | 'heavy'         // Significant penalties
  | 'overloaded';   // Severe penalties, can't move normally

/**
 * Item bundle for similar items
 */
export interface ItemBundle {
  /** Base equipment type */
  baseEquipment: Equipment;
  /** Total quantity in bundle */
  totalQuantity: number;
  /** Individual item conditions if they vary */
  individualConditions?: Map<number, string>;
  /** Bundle location */
  location: ItemLocation;
}

/**
 * Quick access slots for frequently used items
 */
export interface QuickAccessSlots {
  /** Belt slots for easy access items */
  beltSlots: (EquipmentId | null)[];
  /** Bandolier slots for ammunition */
  bandolierSlots: (EquipmentId | null)[];
  /** Holster slots for weapons */
  holsterSlots: (EquipmentId | null)[];
  /** Maximum number of each slot type */
  maxBeltSlots: number;
  maxBandolierSlots: number;
  maxHolsterSlots: number;
}

/**
 * Utility functions for inventory management
 */
export namespace InventoryUtils {
  /**
   * Calculate total weight of inventory
   */
  export function calculateTotalWeight(inventory: InventoryData, allEquipment: Map<EquipmentId, Equipment>): number {
    let totalWeight = 0;
    
    // Add equipped items
    const equipped = inventory.equipped;
    if (equipped.mainHand) {
      const item = allEquipment.get(equipped.mainHand);
      if (item) totalWeight += item.properties.physical.weight;
    }
    if (equipped.offHand) {
      const item = allEquipment.get(equipped.offHand);
      if (item) totalWeight += item.properties.physical.weight;
    }
    if (equipped.armor) {
      const item = allEquipment.get(equipped.armor);
      if (item) totalWeight += item.properties.physical.weight;
    }
    
    // Add accessories and tools
    for (const accessoryId of equipped.accessories) {
      const item = allEquipment.get(accessoryId);
      if (item) totalWeight += item.properties.physical.weight;
    }
    for (const toolId of equipped.tools) {
      const item = allEquipment.get(toolId);
      if (item) totalWeight += item.properties.physical.weight;
    }
    
    // Add carried items
    for (const carriedItem of inventory.carried) {
      totalWeight += carriedItem.equipment.properties.physical.weight * carriedItem.quantity;
    }
    
    // Add container contents
    for (const container of inventory.containers) {
      totalWeight += container.properties.emptyWeight;
      
      // Check if container has weightless property
      if (!container.properties.specialProperties.includes('weightless')) {
        for (const item of container.contents) {
          totalWeight += item.equipment.properties.physical.weight * item.quantity;
        }
      }
    }
    
    return totalWeight;
  }

  /**
   * Calculate total bulk of inventory
   */
  export function calculateTotalBulk(inventory: InventoryData, allEquipment: Map<EquipmentId, Equipment>): number {
    let totalBulk = 0;
    
    // Equipped items don't count toward bulk (being worn)
    
    // Add carried items
    for (const carriedItem of inventory.carried) {
      totalBulk += carriedItem.equipment.properties.physical.bulk * carriedItem.quantity;
    }
    
    // Add containers and their contents
    for (const container of inventory.containers) {
      totalBulk += container.properties.bulk;
      
      for (const item of container.contents) {
        totalBulk += item.equipment.properties.physical.bulk * item.quantity;
      }
    }
    
    return totalBulk;
  }

  /**
   * Determine encumbrance level based on current load
   */
  export function calculateEncumbrance(capacity: CarryingCapacity): EncumbranceLevel {
    const weightRatio = capacity.currentWeight / capacity.maxWeight;
    const bulkRatio = capacity.currentBulk / capacity.maxBulk;
    const maxRatio = Math.max(weightRatio, bulkRatio);
    
    if (maxRatio > 1.0) return 'overloaded';
    if (maxRatio > 0.8) return 'heavy';
    if (maxRatio > 0.6) return 'moderate';
    if (maxRatio > 0.3) return 'light';
    return 'unencumbered';
  }

  /**
   * Get movement speed modifier based on encumbrance
   */
  export function getSpeedModifier(encumbrance: EncumbranceLevel): number {
    switch (encumbrance) {
      case 'unencumbered': return 0;
      case 'light': return -5;
      case 'moderate': return -10;
      case 'heavy': return -15;
      case 'overloaded': return -20;
    }
  }

  /**
   * Check if character has disadvantage on ability checks due to encumbrance
   */
  export function hasEncumbranceDisadvantage(encumbrance: EncumbranceLevel): boolean {
    return encumbrance === 'heavy' || encumbrance === 'overloaded';
  }

  /**
   * Add item to inventory
   */
  export function addItem(
    inventory: InventoryData,
    equipment: Equipment,
    quantity: number = 1,
    location: ItemLocation = 'backpack'
  ): ValidationResult<InventoryData> {
    const errors: ValidationError[] = [];
    
    // Check if adding this item would exceed capacity
    const newWeight = equipment.properties.physical.weight * quantity;
    const newBulk = equipment.properties.physical.bulk * quantity;
    
    if (inventory.capacity.currentWeight + newWeight > inventory.capacity.maxWeight) {
      errors.push({
        field: 'capacity.weight',
        message: 'Adding item would exceed weight capacity',
        code: 'WEIGHT_EXCEEDED'
      });
    }
    
    if (inventory.capacity.currentBulk + newBulk > inventory.capacity.maxBulk) {
      errors.push({
        field: 'capacity.bulk',
        message: 'Adding item would exceed bulk capacity',
        code: 'BULK_EXCEEDED'
      });
    }
    
    if (errors.length > 0) {
      return { success: false, error: errors };
    }
    
    // Find existing item to stack with
    const existingItemIndex = inventory.carried.findIndex(
      item => item.equipment.id === equipment.id && item.location === location
    );
    
    let newCarried: CarriedItem[];
    if (existingItemIndex >= 0) {
      // Stack with existing item
      newCarried = [...inventory.carried];
      const existingItem = newCarried[existingItemIndex];
      if (existingItem) {
        newCarried[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity
        };
      }
    } else {
      // Add as new item
      const newItem: CarriedItem = {
        equipment,
        quantity,
        location,
        accessible: isLocationAccessible(location)
      };
      newCarried = [...inventory.carried, newItem];
    }
    
    // Update capacity
    const newCapacity: CarryingCapacity = {
      ...inventory.capacity,
      currentWeight: inventory.capacity.currentWeight + newWeight,
      currentBulk: inventory.capacity.currentBulk + newBulk
    };
    
    const updatedInventory: InventoryData = {
      ...inventory,
      carried: newCarried,
      capacity: newCapacity,
      encumbrance: calculateEncumbrance(newCapacity)
    };
    
    return { success: true, data: updatedInventory };
  }

  /**
   * Remove item from inventory
   */
  export function removeItem(
    inventory: InventoryData,
    equipmentId: EquipmentId,
    quantity: number = 1,
    location?: ItemLocation
  ): ValidationResult<InventoryData> {
    const errors: ValidationError[] = [];
    
    // Find the item
    const itemIndex = inventory.carried.findIndex(
      item => item.equipment.id === equipmentId && 
               (!location || item.location === location)
    );
    
    if (itemIndex === -1) {
      errors.push({
        field: 'equipmentId',
        message: 'Item not found in inventory',
        code: 'ITEM_NOT_FOUND'
      });
      return { success: false, error: errors };
    }
    
    const item = inventory.carried[itemIndex];
    if (!item) {
      errors.push({
        field: 'equipmentId',
        message: 'Item not found in inventory',
        code: 'ITEM_NOT_FOUND'
      });
      return { success: false, error: errors };
    }
    
    if (item.quantity < quantity) {
      errors.push({
        field: 'quantity',
        message: 'Not enough items to remove',
        code: 'INSUFFICIENT_QUANTITY'
      });
      return { success: false, error: errors };
    }
    
    let newCarried: CarriedItem[];
    if (item.quantity === quantity) {
      // Remove item entirely
      newCarried = inventory.carried.filter((_, index) => index !== itemIndex);
    } else {
      // Reduce quantity
      newCarried = [...inventory.carried];
      newCarried[itemIndex] = {
        equipment: item.equipment,
        quantity: item.quantity - quantity,
        location: item.location,
        accessible: item.accessible,
        notes: item.notes
      };
    }
    
    // Update capacity
    const removedWeight = item.equipment.properties.physical.weight * quantity;
    const removedBulk = item.equipment.properties.physical.bulk * quantity;
    
    const newCapacity: CarryingCapacity = {
      ...inventory.capacity,
      currentWeight: inventory.capacity.currentWeight - removedWeight,
      currentBulk: inventory.capacity.currentBulk - removedBulk
    };
    
    const updatedInventory: InventoryData = {
      ...inventory,
      carried: newCarried,
      capacity: newCapacity,
      encumbrance: calculateEncumbrance(newCapacity)
    };
    
    return { success: true, data: updatedInventory };
  }

  /**
   * Move item to different location
   */
  export function moveItem(
    inventory: InventoryData,
    equipmentId: EquipmentId,
    fromLocation: ItemLocation,
    toLocation: ItemLocation,
    quantity?: number
  ): ValidationResult<InventoryData> {
    // Remove from old location
    const removeResult = removeItem(inventory, equipmentId, quantity, fromLocation);
    if (!removeResult.success) {
      return removeResult;
    }
    
    // Find the item to get equipment reference
    const item = inventory.carried.find(
      item => item.equipment.id === equipmentId && item.location === fromLocation
    );
    
    if (!item) {
      return {
        success: false,
        error: [{
          field: 'equipmentId',
          message: 'Item not found',
          code: 'ITEM_NOT_FOUND'
        }]
      };
    }
    
    // Add to new location
    return addItem(removeResult.data, item.equipment, quantity || item.quantity, toLocation);
  }

  /**
   * Equip an item from inventory
   */
  export function equipItem(
    inventory: InventoryData,
    equipmentId: EquipmentId,
    slot: keyof EquippedItems
  ): ValidationResult<InventoryData> {
    const errors: ValidationError[] = [];
    
    // Find item in carried items
    const itemIndex = inventory.carried.findIndex(item => item.equipment.id === equipmentId);
    if (itemIndex === -1) {
      errors.push({
        field: 'equipmentId',
        message: 'Item not found in inventory',
        code: 'ITEM_NOT_FOUND'
      });
      return { success: false, error: errors };
    }
    
    const item = inventory.carried[itemIndex];
    
    // Remove from carried items
    const newCarried = inventory.carried.filter((_, index) => index !== itemIndex);
    
    // Add to equipped items
    const newEquipped = { ...inventory.equipped };
    
    if (slot === 'accessories') {
      if (newEquipped.accessories.length >= newEquipped.maxAccessories) {
        errors.push({
          field: 'accessories',
          message: 'No available accessory slots',
          code: 'NO_ACCESSORY_SLOTS'
        });
        return { success: false, error: errors };
      }
      newEquipped.accessories = [...newEquipped.accessories, equipmentId];
    } else if (slot === 'tools') {
      if (newEquipped.tools.length >= newEquipped.maxTools) {
        errors.push({
          field: 'tools',
          message: 'No available tool slots',
          code: 'NO_TOOL_SLOTS'
        });
        return { success: false, error: errors };
      }
      newEquipped.tools = [...newEquipped.tools, equipmentId];
    } else {
      // Single item slots
      (newEquipped as any)[slot] = equipmentId;
    }
    
    const updatedInventory: InventoryData = {
      ...inventory,
      carried: newCarried,
      equipped: newEquipped
    };
    
    return { success: true, data: updatedInventory };
  }

  /**
   * Check if a location is easily accessible during combat
   */
  function isLocationAccessible(location: ItemLocation): boolean {
    switch (location) {
      case 'belt':
      case 'pockets':
      case 'bandolier':
      case 'holster':
      case 'sheath':
      case 'pouch':
        return true;
      case 'backpack':
      case 'saddlebags':
      case 'cart':
      case 'container':
        return false;
    }
  }

  /**
   * Find items by name or type
   */
  export function findItems(
    inventory: InventoryData,
    searchTerm: string,
    searchType: 'name' | 'type' | 'description' = 'name'
  ): CarriedItem[] {
    const searchLower = searchTerm.toLowerCase();
    
    return inventory.carried.filter(item => {
      switch (searchType) {
        case 'name':
          return item.equipment.name.toLowerCase().includes(searchLower);
        case 'type':
          return item.equipment.type.toLowerCase().includes(searchLower);
        case 'description':
          return item.equipment.description?.toLowerCase().includes(searchLower) || false;
        default:
          return false;
      }
    });
  }

  /**
   * Get items by location
   */
  export function getItemsByLocation(
    inventory: InventoryData,
    location: ItemLocation
  ): CarriedItem[] {
    return inventory.carried.filter(item => item.location === location);
  }

  /**
   * Validate inventory data
   */
  export function validateInventory(inventory: InventoryData): ValidationResult<InventoryData> {
    const errors: ValidationError[] = [];
    
    // Validate capacity
    if (inventory.capacity.currentWeight > inventory.capacity.maxWeight) {
      errors.push({
        field: 'capacity.currentWeight',
        message: 'Current weight exceeds maximum capacity',
        code: 'WEIGHT_EXCEEDED'
      });
    }
    
    if (inventory.capacity.currentBulk > inventory.capacity.maxBulk) {
      errors.push({
        field: 'capacity.currentBulk',
        message: 'Current bulk exceeds maximum capacity',
        code: 'BULK_EXCEEDED'
      });
    }
    
    // Validate currency
    if (inventory.currency.cogs < 0 || inventory.currency.gears < 0 || inventory.currency.cores < 0) {
      errors.push({
        field: 'currency',
        message: 'Currency values cannot be negative',
        code: 'NEGATIVE_CURRENCY'
      });
    }
    
    // Validate carried items
    for (const item of inventory.carried) {
      if (item.quantity <= 0) {
        errors.push({
          field: 'carried',
          message: `Item ${item.equipment.name} has invalid quantity`,
          code: 'INVALID_QUANTITY'
        });
      }
    }
    
    if (errors.length > 0) {
      return { success: false, error: errors };
    }
    
    return { success: true, data: inventory };
  }
}