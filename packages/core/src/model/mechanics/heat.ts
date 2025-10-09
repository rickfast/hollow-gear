/**
 * Heat Stress and Steam systems for Hollow Gear
 * 
 * Heat Stress represents the accumulation of thermal energy in a character's body
 * and equipment, affecting performance and requiring management through Steam systems.
 */

/**
 * Heat Stress levels and their mechanical effects
 */
export type HeatStressLevel = 0 | 1 | 2 | 3;

/**
 * Types of heat stress effects that can be applied
 */
export type HeatStressEffectType = 
  | 'dexterity_penalty'
  | 'speed_reduction' 
  | 'disadvantage'
  | 'exhaustion'
  | 'equipment_malfunction';

/**
 * Individual heat stress effect with severity
 */
export interface HeatStressEffect {
  type: HeatStressEffectType;
  severity: number;
  description: string;
}

/**
 * Sources that can generate heat stress
 */
export type HeatSource = 
  | 'spellcasting'
  | 'psionic_overload'
  | 'powered_equipment'
  | 'environmental'
  | 'combat_exertion'
  | 'steam_vent_failure';

/**
 * Heat accumulation event
 */
export interface HeatAccumulation {
  source: HeatSource;
  amount: number;
  timestamp: Date;
  description: string;
}

/**
 * Main heat stress data interface
 */
export interface HeatStressData {
  /** Current heat stress level (0-3) */
  currentLevel: HeatStressLevel;
  
  /** Current heat points accumulated */
  currentHeatPoints: number;
  
  /** Heat points required for next level */
  nextLevelThreshold: number;
  
  /** Active heat stress effects */
  effects: HeatStressEffect[];
  
  /** Recent heat accumulation events */
  recentAccumulation: HeatAccumulation[];
  
  /** Steam system data */
  steamSystem: SteamSystemData;
}

/**
 * Steam Vent Harness types
 */
export type SteamVentHarnessType = 
  | 'basic'
  | 'improved'
  | 'superior'
  | 'masterwork';

/**
 * Steam Vent Harness equipment
 */
export interface SteamVentHarness {
  type: SteamVentHarnessType;
  charges: number;
  maxCharges: number;
  heatReductionPerUse: number;
  condition: 'pristine' | 'good' | 'worn' | 'damaged';
  malfunctionRisk: number; // Percentage chance of malfunction
}

/**
 * Steam system data and equipment
 */
export interface SteamSystemData {
  /** Steam Vent Harness if equipped */
  ventHarness?: SteamVentHarness;
  
  /** Pressure Tent for extended cooling */
  pressureTent: boolean;
  
  /** Coolant flasks for emergency cooling */
  coolantFlasks: number;
  
  /** Steam vent charges available */
  steamVentCharges: number;
  
  /** Coolant supplies for maintenance */
  coolantSupplies: number;
}

/**
 * Steam vent usage result
 */
export interface SteamVentResult {
  success: boolean;
  heatReduced: number;
  chargesUsed: number;
  malfunctionOccurred: boolean;
  newHeatLevel: HeatStressLevel;
  effects: string[];
}

/**
 * Heat stress level thresholds
 */
export const HEAT_STRESS_THRESHOLDS = {
  0: { min: 0, max: 4, name: 'Normal' },
  1: { min: 5, max: 9, name: 'Warm' },
  2: { min: 10, max: 14, name: 'Hot' },
  3: { min: 15, max: Infinity, name: 'Overheated' }
} as const;

/**
 * Default heat stress effects by level
 */
export const DEFAULT_HEAT_EFFECTS: Record<HeatStressLevel, HeatStressEffect[]> = {
  0: [], // No effects at normal temperature
  1: [
    {
      type: 'dexterity_penalty',
      severity: 1,
      description: 'Slight sluggishness from heat buildup'
    }
  ],
  2: [
    {
      type: 'dexterity_penalty',
      severity: 2,
      description: 'Noticeable impairment from heat stress'
    },
    {
      type: 'speed_reduction',
      severity: 5,
      description: 'Movement speed reduced by 5 feet'
    }
  ],
  3: [
    {
      type: 'dexterity_penalty',
      severity: 3,
      description: 'Severe heat-induced impairment'
    },
    {
      type: 'speed_reduction',
      severity: 10,
      description: 'Movement speed reduced by 10 feet'
    },
    {
      type: 'disadvantage',
      severity: 1,
      description: 'Disadvantage on Constitution saving throws'
    },
    {
      type: 'equipment_malfunction',
      severity: 1,
      description: 'Increased risk of equipment malfunction'
    }
  ]
};

/**
 * Steam Vent Harness specifications
 */
export const STEAM_VENT_HARNESS_SPECS: Record<SteamVentHarnessType, {
  maxCharges: number;
  heatReduction: number;
  malfunctionRisk: number;
  cost: { gears: number };
}> = {
  basic: {
    maxCharges: 3,
    heatReduction: 3,
    malfunctionRisk: 15,
    cost: { gears: 2 }
  },
  improved: {
    maxCharges: 4,
    heatReduction: 4,
    malfunctionRisk: 10,
    cost: { gears: 5 }
  },
  superior: {
    maxCharges: 5,
    heatReduction: 5,
    malfunctionRisk: 5,
    cost: { gears: 10 }
  },
  masterwork: {
    maxCharges: 6,
    heatReduction: 6,
    malfunctionRisk: 2,
    cost: { gears: 20 }
  }
};

/**
 * Calculate heat stress level from current heat points
 */
export function calculateHeatStressLevel(heatPoints: number): HeatStressLevel {
  if (heatPoints >= 15) return 3;
  if (heatPoints >= 10) return 2;
  if (heatPoints >= 5) return 1;
  return 0;
}

/**
 * Get heat stress effects for a given level
 */
export function getHeatStressEffects(level: HeatStressLevel): HeatStressEffect[] {
  return [...DEFAULT_HEAT_EFFECTS[level]];
}

/**
 * Calculate next level threshold for heat points
 */
export function getNextLevelThreshold(currentLevel: HeatStressLevel): number {
  switch (currentLevel) {
    case 0: return 5;
    case 1: return 10;
    case 2: return 15;
    case 3: return Infinity;
    default: return Infinity;
  }
}

/**
 * Add heat points and recalculate heat stress
 */
export function addHeatPoints(
  currentData: HeatStressData,
  source: HeatSource,
  amount: number,
  description: string
): HeatStressData {
  const newHeatPoints = Math.max(0, currentData.currentHeatPoints + amount);
  const newLevel = calculateHeatStressLevel(newHeatPoints);
  
  const accumulation: HeatAccumulation = {
    source,
    amount,
    timestamp: new Date(),
    description
  };

  return {
    ...currentData,
    currentHeatPoints: newHeatPoints,
    currentLevel: newLevel,
    nextLevelThreshold: getNextLevelThreshold(newLevel),
    effects: getHeatStressEffects(newLevel),
    recentAccumulation: [
      accumulation,
      ...currentData.recentAccumulation.slice(0, 9) // Keep last 10 events
    ]
  };
}

/**
 * Use steam vent to reduce heat stress
 */
export function useSteamVent(
  currentData: HeatStressData,
  chargesUsed: number = 1
): SteamVentResult {
  const { ventHarness } = currentData.steamSystem;
  
  if (!ventHarness) {
    return {
      success: false,
      heatReduced: 0,
      chargesUsed: 0,
      malfunctionOccurred: false,
      newHeatLevel: currentData.currentLevel,
      effects: ['No Steam Vent Harness equipped']
    };
  }

  if (ventHarness.charges < chargesUsed) {
    return {
      success: false,
      heatReduced: 0,
      chargesUsed: 0,
      malfunctionOccurred: false,
      newHeatLevel: currentData.currentLevel,
      effects: ['Insufficient charges in Steam Vent Harness']
    };
  }

  // Check for malfunction
  const malfunctionRoll = Math.random() * 100;
  const malfunctionOccurred = malfunctionRoll < ventHarness.malfunctionRisk;

  if (malfunctionOccurred) {
    return {
      success: false,
      heatReduced: 0,
      chargesUsed: chargesUsed,
      malfunctionOccurred: true,
      newHeatLevel: currentData.currentLevel,
      effects: ['Steam Vent Harness malfunctioned!']
    };
  }

  // Calculate heat reduction
  const heatReduced = ventHarness.heatReductionPerUse * chargesUsed;
  const newHeatPoints = Math.max(0, currentData.currentHeatPoints - heatReduced);
  const newHeatLevel = calculateHeatStressLevel(newHeatPoints);

  return {
    success: true,
    heatReduced,
    chargesUsed,
    malfunctionOccurred: false,
    newHeatLevel,
    effects: [`Reduced heat by ${heatReduced} points`]
  };
}

/**
 * Use coolant flask for emergency cooling
 */
export function useCoolantFlask(currentData: HeatStressData): HeatStressData {
  if (currentData.steamSystem.coolantFlasks <= 0) {
    return currentData;
  }

  // Coolant flask reduces heat by 2 points
  const heatReduced = 2;
  const newHeatPoints = Math.max(0, currentData.currentHeatPoints - heatReduced);
  const newLevel = calculateHeatStressLevel(newHeatPoints);

  return {
    ...currentData,
    currentHeatPoints: newHeatPoints,
    currentLevel: newLevel,
    nextLevelThreshold: getNextLevelThreshold(newLevel),
    effects: getHeatStressEffects(newLevel),
    steamSystem: {
      ...currentData.steamSystem,
      coolantFlasks: currentData.steamSystem.coolantFlasks - 1
    }
  };
}

/**
 * Create a new Steam Vent Harness
 */
export function createSteamVentHarness(type: SteamVentHarnessType): SteamVentHarness {
  const specs = STEAM_VENT_HARNESS_SPECS[type];
  
  return {
    type,
    charges: specs.maxCharges,
    maxCharges: specs.maxCharges,
    heatReductionPerUse: specs.heatReduction,
    condition: 'pristine',
    malfunctionRisk: specs.malfunctionRisk
  };
}

/**
 * Create default heat stress data
 */
export function createDefaultHeatStressData(): HeatStressData {
  return {
    currentLevel: 0,
    currentHeatPoints: 0,
    nextLevelThreshold: 5,
    effects: [],
    recentAccumulation: [],
    steamSystem: {
      pressureTent: false,
      coolantFlasks: 0,
      steamVentCharges: 0,
      coolantSupplies: 0
    }
  };
}