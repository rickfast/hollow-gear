/**
 * Currency and resource management for Hollow Gear
 *
 * Hollow Gear uses a three-tier currency system (Cogs, Gears, Cores) along with
 * specialized resources like Aether Cells and Aether Dust.
 */

/**
 * Three-tier currency system
 */
export interface CurrencyData {
  /** Basic currency unit */
  cogs: number;

  /** Mid-tier currency (1 Gear = 10 Cogs) */
  gears: number;

  /** High-tier currency (1 Core = 10 Gears = 100 Cogs) */
  cores: number;

  /** Aether Dust in vials */
  aetherDust: number;

  /** Collection of Aether Cells */
  aetherCells: AetherCell[];
}

/**
 * Aether Cell condition states
 */
export type AetherCellCondition =
  | 'pristine'
  | 'good'
  | 'worn'
  | 'damaged'
  | 'depleted';

/**
 * Aether Cell types based on capacity
 */
export type AetherCellType = 'minor' | 'standard' | 'major' | 'superior';

/**
 * Individual Aether Cell with charge tracking
 */
export interface AetherCell {
  id: string;
  type: AetherCellType;
  charges: number;
  maxCharges: number;
  condition: AetherCellCondition;

  /** Date when cell was last recharged */
  lastRecharged?: Date;

  /** Number of recharge cycles (affects degradation) */
  rechargeCycles: number;

  /** Special properties or modifications */
  properties?: AetherCellProperty[];
}

/**
 * Special properties that Aether Cells can have
 */
export type AetherCellPropertyType =
  | 'overcharged'
  | 'stabilized'
  | 'resonant'
  | 'volatile'
  | 'efficient';

export interface AetherCellProperty {
  type: AetherCellPropertyType;
  description: string;
  effect: string;
}

/**
 * Consumable resources in Hollow Gear
 */
export interface ConsumableResources {
  /** Coolant for equipment maintenance */
  coolant: number;

  /** Repair kits for equipment fixes */
  repairKits: number;

  /** Lubricant for mechanical equipment */
  lubricant: number;

  /** Spare parts for equipment repairs */
  spareParts: number;

  /** Alchemical components */
  alchemicalComponents: AlchemicalComponent[];

  /** Crafting materials */
  craftingMaterials: CraftingMaterial[];
}

/**
 * Alchemical components for crafting
 */
export interface AlchemicalComponent {
  id: string;
  name: string;
  quantity: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';
  properties: string[];
}

/**
 * Crafting materials for equipment creation
 */
export interface CraftingMaterial {
  id: string;
  name: string;
  quantity: number;
  type: 'metal' | 'crystal' | 'organic' | 'synthetic' | 'aetheric';
  quality: 'crude' | 'standard' | 'fine' | 'exceptional';
}

/**
 * Currency conversion rates
 */
export const CURRENCY_CONVERSION = {
  COGS_PER_GEAR: 10,
  GEARS_PER_CORE: 10,
  COGS_PER_CORE: 100,
} as const;

/**
 * Aether Cell specifications by type
 */
export const AETHER_CELL_SPECS: Record<
  AetherCellType,
  {
    maxCharges: number;
    baseValue: { gears: number };
    degradationRate: number;
  }
> = {
  minor: {
    maxCharges: 3,
    baseValue: { gears: 1 },
    degradationRate: 0.1,
  },
  standard: {
    maxCharges: 5,
    baseValue: { gears: 3 },
    degradationRate: 0.08,
  },
  major: {
    maxCharges: 8,
    baseValue: { gears: 8 },
    degradationRate: 0.06,
  },
  superior: {
    maxCharges: 12,
    baseValue: { gears: 20 },
    degradationRate: 0.04,
  },
};

/**
 * Aether Cell condition effects on performance
 */
export const CONDITION_EFFECTS: Record<
  AetherCellCondition,
  {
    chargeEfficiency: number;
    malfunctionRisk: number;
    description: string;
  }
> = {
  pristine: {
    chargeEfficiency: 1.0,
    malfunctionRisk: 0,
    description: 'Perfect condition, full efficiency',
  },
  good: {
    chargeEfficiency: 0.95,
    malfunctionRisk: 2,
    description: 'Minor wear, slight efficiency loss',
  },
  worn: {
    chargeEfficiency: 0.85,
    malfunctionRisk: 5,
    description: 'Noticeable wear, reduced efficiency',
  },
  damaged: {
    chargeEfficiency: 0.7,
    malfunctionRisk: 15,
    description: 'Significant damage, poor efficiency',
  },
  depleted: {
    chargeEfficiency: 0,
    malfunctionRisk: 50,
    description: 'Cannot hold charge, high malfunction risk',
  },
}; /**
 
* Convert currency to total cogs value
 */
export function convertToTotalCogs(
  currency: Pick<CurrencyData, 'cogs' | 'gears' | 'cores'>
): number {
  return (
    currency.cogs +
    currency.gears * CURRENCY_CONVERSION.COGS_PER_GEAR +
    currency.cores * CURRENCY_CONVERSION.COGS_PER_CORE
  );
}

/**
 * Convert total cogs back to currency breakdown
 */
export function convertFromTotalCogs(
  totalCogs: number
): Pick<CurrencyData, 'cogs' | 'gears' | 'cores'> {
  const cores = Math.floor(totalCogs / CURRENCY_CONVERSION.COGS_PER_CORE);
  const remainingAfterCores = totalCogs % CURRENCY_CONVERSION.COGS_PER_CORE;

  const gears = Math.floor(
    remainingAfterCores / CURRENCY_CONVERSION.COGS_PER_GEAR
  );
  const cogs = remainingAfterCores % CURRENCY_CONVERSION.COGS_PER_GEAR;

  return { cores, gears, cogs };
}

/**
 * Add currency amounts
 */
export function addCurrency(
  current: Pick<CurrencyData, 'cogs' | 'gears' | 'cores'>,
  toAdd: Pick<CurrencyData, 'cogs' | 'gears' | 'cores'>
): Pick<CurrencyData, 'cogs' | 'gears' | 'cores'> {
  const totalCogs = convertToTotalCogs(current) + convertToTotalCogs(toAdd);
  return convertFromTotalCogs(totalCogs);
}

/**
 * Subtract currency amounts (returns null if insufficient funds)
 */
export function subtractCurrency(
  current: Pick<CurrencyData, 'cogs' | 'gears' | 'cores'>,
  toSubtract: Pick<CurrencyData, 'cogs' | 'gears' | 'cores'>
): Pick<CurrencyData, 'cogs' | 'gears' | 'cores'> | null {
  const currentTotal = convertToTotalCogs(current);
  const subtractTotal = convertToTotalCogs(toSubtract);

  if (currentTotal < subtractTotal) {
    return null; // Insufficient funds
  }

  return convertFromTotalCogs(currentTotal - subtractTotal);
}

/**
 * Check if character has sufficient currency
 */
export function hasSufficientCurrency(
  current: Pick<CurrencyData, 'cogs' | 'gears' | 'cores'>,
  required: Pick<CurrencyData, 'cogs' | 'gears' | 'cores'>
): boolean {
  return convertToTotalCogs(current) >= convertToTotalCogs(required);
}

/**
 * Create a new Aether Cell
 */
export function createAetherCell(
  type: AetherCellType,
  id?: string
): AetherCell {
  const specs = AETHER_CELL_SPECS[type];

  return {
    id:
      id ||
      `aether-cell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    charges: specs.maxCharges,
    maxCharges: specs.maxCharges,
    condition: 'pristine',
    rechargeCycles: 0,
    properties: [],
  };
}

/**
 * Use charges from an Aether Cell
 */
export function useAetherCellCharges(
  cell: AetherCell,
  chargesUsed: number
): AetherCell {
  const newCharges = Math.max(0, cell.charges - chargesUsed);

  return {
    ...cell,
    charges: newCharges,
  };
}

/**
 * Recharge an Aether Cell
 */
export function rechargeAetherCell(
  cell: AetherCell,
  chargesToAdd: number = cell.maxCharges
): AetherCell {
  const conditionEffect = CONDITION_EFFECTS[cell.condition];
  const effectiveCharges = Math.floor(
    chargesToAdd * conditionEffect.chargeEfficiency
  );
  const newCharges = Math.min(cell.maxCharges, cell.charges + effectiveCharges);

  // Increase recharge cycles and potentially degrade condition
  const newRechargeCycles = cell.rechargeCycles + 1;
  let newCondition = cell.condition;

  // Check for condition degradation based on recharge cycles
  if (newRechargeCycles > 50 && cell.condition === 'pristine') {
    newCondition = 'good';
  } else if (newRechargeCycles > 100 && cell.condition === 'good') {
    newCondition = 'worn';
  } else if (newRechargeCycles > 200 && cell.condition === 'worn') {
    newCondition = 'damaged';
  } else if (newRechargeCycles > 500 && cell.condition === 'damaged') {
    newCondition = 'depleted';
  }

  return {
    ...cell,
    charges: newCharges,
    condition: newCondition,
    rechargeCycles: newRechargeCycles,
    lastRecharged: new Date(),
  };
}

/**
 * Get the effective charge capacity of an Aether Cell based on condition
 */
export function getEffectiveChargeCapacity(cell: AetherCell): number {
  const conditionEffect = CONDITION_EFFECTS[cell.condition];
  return Math.floor(cell.maxCharges * conditionEffect.chargeEfficiency);
}

/**
 * Calculate the value of an Aether Cell based on condition and charges
 */
export function calculateAetherCellValue(cell: AetherCell): { gears: number } {
  const baseValue = AETHER_CELL_SPECS[cell.type].baseValue.gears;
  const conditionMultiplier =
    CONDITION_EFFECTS[cell.condition].chargeEfficiency;
  const chargeRatio = cell.charges / cell.maxCharges;

  const adjustedValue = Math.floor(
    baseValue * conditionMultiplier * chargeRatio
  );

  return { gears: Math.max(1, adjustedValue) }; // Minimum value of 1 gear
}

/**
 * Find the best Aether Cell for a specific charge requirement
 */
export function findBestAetherCell(
  cells: AetherCell[],
  chargesNeeded: number
): AetherCell | null {
  // Filter cells that have enough charges
  const suitableCells = cells.filter(cell => cell.charges >= chargesNeeded);

  if (suitableCells.length === 0) {
    return null;
  }

  // Sort by condition (best first), then by charges (least waste first)
  const sortedCells = suitableCells.sort((a, b) => {
    const conditionOrder = ['pristine', 'good', 'worn', 'damaged', 'depleted'];
    const aConditionIndex = conditionOrder.indexOf(a.condition);
    const bConditionIndex = conditionOrder.indexOf(b.condition);

    if (aConditionIndex !== bConditionIndex) {
      return aConditionIndex - bConditionIndex;
    }

    // If same condition, prefer cell with fewer charges to minimize waste
    return a.charges - b.charges;
  });

  return sortedCells[0] || null;
}

/**
 * Create default currency data
 */
export function createDefaultCurrencyData(): CurrencyData {
  return {
    cogs: 0,
    gears: 0,
    cores: 0,
    aetherDust: 0,
    aetherCells: [],
  };
}

/**
 * Create default consumable resources
 */
export function createDefaultConsumableResources(): ConsumableResources {
  return {
    coolant: 0,
    repairKits: 0,
    lubricant: 0,
    spareParts: 0,
    alchemicalComponents: [],
    craftingMaterials: [],
  };
}
