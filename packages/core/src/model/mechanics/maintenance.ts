/**
 * Equipment maintenance and malfunction system for Hollow Gear
 *
 * Hollow Gear equipment requires regular maintenance and can malfunction,
 * especially powered equipment and items with modifications.
 */

/**
 * Equipment malfunction severity levels
 */
export type MalfunctionSeverity = "minor" | "moderate" | "major" | "critical";

/**
 * Types of equipment malfunctions
 */
export type MalfunctionType =
  | "power_failure"
  | "mechanical_jam"
  | "overheating"
  | "calibration_drift"
  | "component_failure"
  | "mod_interference"
  | "aether_leak"
  | "structural_damage";

/**
 * Equipment malfunction state
 */
export interface MalfunctionState {
  id: string;
  type: MalfunctionType;
  severity: MalfunctionSeverity;
  description: string;

  /** When the malfunction occurred */
  occurredAt: Date;

  /** Mechanical effects of the malfunction */
  effects: MalfunctionEffect[];

  /** Repair requirements to fix this malfunction */
  repairRequirements: RepairRequirement[];

  /** Whether this malfunction is currently active */
  active: boolean;
}

/**
 * Effects that malfunctions can have on equipment
 */
export interface MalfunctionEffect {
  type:
    | "damage_penalty"
    | "accuracy_penalty"
    | "ac_penalty"
    | "disabled"
    | "unreliable";
  value: number;
  description: string;
}

/**
 * Requirements to repair a malfunction
 */
export interface RepairRequirement {
  type: "skill_check" | "resource" | "time" | "tool";
  requirement: string;
  value: number;
  description: string;
}

/**
 * Equipment maintenance data
 */
export interface MaintenanceData {
  /** Current maintenance level (0-100, where 100 is perfect) */
  maintenanceLevel: number;

  /** Last maintenance date */
  lastMaintenance?: Date;

  /** Hours of use since last maintenance */
  usageHours: number;

  /** Recommended maintenance interval in hours */
  maintenanceInterval: number;

  /** Current malfunctions */
  malfunctions: MalfunctionState[];

  /** Maintenance history */
  maintenanceHistory: MaintenanceRecord[];

  /** Special maintenance requirements */
  specialRequirements: MaintenanceRequirement[];
}

/**
 * Maintenance record entry
 */
export interface MaintenanceRecord {
  date: Date;
  type: "routine" | "repair" | "overhaul" | "emergency";
  description: string;
  resourcesUsed: MaintenanceResource[];
  performedBy?: string;
  result: "success" | "partial" | "failure";
}

/**
 * Resources used in maintenance
 */
export interface MaintenanceResource {
  type: "coolant" | "lubricant" | "spare_parts" | "repair_kit" | "aether_dust";
  quantity: number;
  quality?: "standard" | "superior" | "masterwork";
}

/**
 * Special maintenance requirements for certain equipment
 */
export interface MaintenanceRequirement {
  type: "environmental" | "skill" | "tool" | "resource";
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "per_use";
}

/**
 * Maintenance difficulty levels
 */
export type MaintenanceDifficulty =
  | "trivial"
  | "easy"
  | "moderate"
  | "hard"
  | "very_hard";

/**
 * Maintenance check result
 */
export interface MaintenanceResult {
  success: boolean;
  newMaintenanceLevel: number;
  malfunctionsFixed: string[];
  malfunctionsOccurred: MalfunctionState[];
  resourcesConsumed: MaintenanceResource[];
  timeSpent: number; // in hours
  notes: string[];
}

/**
 * Malfunction risk factors
 */
export interface MalfunctionRiskFactors {
  baseRisk: number;
  maintenanceLevelModifier: number;
  usageHoursModifier: number;
  environmentalModifier: number;
  modificationModifier: number;
  heatStressModifier: number;
  totalRisk: number;
}

/**
 * Malfunction severity effects
 */
export const MALFUNCTION_SEVERITY_EFFECTS: Record<
  MalfunctionSeverity,
  {
    repairDifficulty: MaintenanceDifficulty;
    performancePenalty: number;
    riskOfSpread: number;
  }
> = {
  minor: {
    repairDifficulty: "easy",
    performancePenalty: 0.1,
    riskOfSpread: 5,
  },
  moderate: {
    repairDifficulty: "moderate",
    performancePenalty: 0.25,
    riskOfSpread: 15,
  },
  major: {
    repairDifficulty: "hard",
    performancePenalty: 0.5,
    riskOfSpread: 30,
  },
  critical: {
    repairDifficulty: "very_hard",
    performancePenalty: 0.75,
    riskOfSpread: 50,
  },
};

/**
 * Maintenance difficulty DCs
 */
export const MAINTENANCE_DIFFICULTY_DC: Record<MaintenanceDifficulty, number> =
  {
    trivial: 5,
    easy: 10,
    moderate: 15,
    hard: 20,
    very_hard: 25,
  };

/**
 * Standard maintenance resource costs
 */
export const STANDARD_MAINTENANCE_COSTS: Record<string, MaintenanceResource[]> =
  {
    routine_weapon: [
      { type: "lubricant", quantity: 1 },
      { type: "spare_parts", quantity: 1 },
    ],
    routine_armor: [
      { type: "lubricant", quantity: 2 },
      { type: "spare_parts", quantity: 1 },
    ],
    routine_powered: [
      { type: "coolant", quantity: 1 },
      { type: "lubricant", quantity: 1 },
      { type: "spare_parts", quantity: 2 },
    ],
    emergency_repair: [
      { type: "repair_kit", quantity: 1 },
      { type: "spare_parts", quantity: 3 },
    ],
  }; /**
 
* Calculate malfunction risk based on various factors
 */
export function calculateMalfunctionRisk(
  maintenanceData: MaintenanceData,
  heatStressLevel: number = 0,
  environmentalFactor: number = 0,
  modificationCount: number = 0
): MalfunctionRiskFactors {
  // Base risk starts at 1%
  const baseRisk = 1;

  // Maintenance level modifier (0-100 scale, inverted)
  const maintenanceLevelModifier = Math.max(
    0,
    (100 - maintenanceData.maintenanceLevel) * 0.1
  );

  // Usage hours modifier
  const overdueFactor = Math.max(
    0,
    maintenanceData.usageHours - maintenanceData.maintenanceInterval
  );
  const usageHoursModifier = overdueFactor * 0.05;

  // Environmental modifier (extreme conditions)
  const environmentalModifier = environmentalFactor * 2;

  // Modification modifier (more mods = more complexity)
  const modificationModifier = modificationCount * 1;

  // Heat stress modifier
  const heatStressModifier = heatStressLevel * 3;

  const totalRisk =
    baseRisk +
    maintenanceLevelModifier +
    usageHoursModifier +
    environmentalModifier +
    modificationModifier +
    heatStressModifier;

  return {
    baseRisk,
    maintenanceLevelModifier,
    usageHoursModifier,
    environmentalModifier,
    modificationModifier,
    heatStressModifier,
    totalRisk: Math.min(95, totalRisk), // Cap at 95%
  };
}

/**
 * Check if equipment should malfunction
 */
export function checkForMalfunction(
  maintenanceData: MaintenanceData,
  riskFactors: MalfunctionRiskFactors
): MalfunctionState | null {
  const roll = Math.random() * 100;

  if (roll > riskFactors.totalRisk) {
    return null; // No malfunction
  }

  // Determine malfunction type and severity
  const malfunctionType = generateMalfunctionType(maintenanceData, riskFactors);
  const severity = generateMalfunctionSeverity(riskFactors.totalRisk);

  return createMalfunction(malfunctionType, severity);
}

/**
 * Generate malfunction type based on conditions
 */
function generateMalfunctionType(
  maintenanceData: MaintenanceData,
  riskFactors: MalfunctionRiskFactors
): MalfunctionType {
  const types: MalfunctionType[] = [
    "power_failure",
    "mechanical_jam",
    "overheating",
    "calibration_drift",
    "component_failure",
    "mod_interference",
    "aether_leak",
    "structural_damage",
  ];

  // Weight types based on risk factors
  if (riskFactors.heatStressModifier > 5) {
    return "overheating";
  }

  if (riskFactors.modificationModifier > 3) {
    return Math.random() < 0.5 ? "mod_interference" : "aether_leak";
  }

  if (riskFactors.usageHoursModifier > 10) {
    return Math.random() < 0.5 ? "mechanical_jam" : "component_failure";
  }

  // Random selection for other cases
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex] || "component_failure";
}

/**
 * Generate malfunction severity based on total risk
 */
function generateMalfunctionSeverity(totalRisk: number): MalfunctionSeverity {
  if (totalRisk < 10) return "minor";
  if (totalRisk < 25) return Math.random() < 0.7 ? "minor" : "moderate";
  if (totalRisk < 50) return Math.random() < 0.5 ? "moderate" : "major";
  return Math.random() < 0.3 ? "major" : "critical";
}

/**
 * Create a malfunction state
 */
export function createMalfunction(
  type: MalfunctionType,
  severity: MalfunctionSeverity
): MalfunctionState {
  const effects = generateMalfunctionEffects(type, severity);
  const repairRequirements = generateRepairRequirements(type, severity);

  return {
    id: `malfunction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    description: generateMalfunctionDescription(type, severity),
    occurredAt: new Date(),
    effects,
    repairRequirements,
    active: true,
  };
}

/**
 * Generate malfunction effects based on type and severity
 */
function generateMalfunctionEffects(
  type: MalfunctionType,
  severity: MalfunctionSeverity
): MalfunctionEffect[] {
  const severityMultiplier =
    MALFUNCTION_SEVERITY_EFFECTS[severity].performancePenalty;
  const effects: MalfunctionEffect[] = [];

  switch (type) {
    case "power_failure":
      effects.push({
        type: "disabled",
        value: 1,
        description: "Equipment is non-functional until repaired",
      });
      break;

    case "mechanical_jam":
      effects.push({
        type: "unreliable",
        value: Math.floor(severityMultiplier * 20),
        description: `${Math.floor(
          severityMultiplier * 20
        )}% chance of failure on use`,
      });
      break;

    case "overheating":
      effects.push({
        type: "damage_penalty",
        value: Math.floor(severityMultiplier * 4),
        description: `Damage reduced by ${Math.floor(severityMultiplier * 4)}`,
      });
      break;

    case "calibration_drift":
      effects.push({
        type: "accuracy_penalty",
        value: Math.floor(severityMultiplier * 4),
        description: `Attack rolls reduced by ${Math.floor(
          severityMultiplier * 4
        )}`,
      });
      break;

    case "component_failure":
      effects.push({
        type: "damage_penalty",
        value: Math.floor(severityMultiplier * 2),
        description: `Reduced effectiveness due to component failure`,
      });
      break;

    case "mod_interference":
      effects.push({
        type: "unreliable",
        value: Math.floor(severityMultiplier * 15),
        description: "Modifications interfere with normal operation",
      });
      break;

    case "aether_leak":
      effects.push({
        type: "unreliable",
        value: Math.floor(severityMultiplier * 10),
        description: "Aether leakage causes unpredictable behavior",
      });
      break;

    case "structural_damage":
      effects.push({
        type: "ac_penalty",
        value: Math.floor(severityMultiplier * 3),
        description: `AC reduced by ${Math.floor(
          severityMultiplier * 3
        )} due to structural damage`,
      });
      break;
  }

  return effects;
}

/**
 * Generate repair requirements for a malfunction
 */
function generateRepairRequirements(
  type: MalfunctionType,
  severity: MalfunctionSeverity
): RepairRequirement[] {
  const difficulty = MALFUNCTION_SEVERITY_EFFECTS[severity].repairDifficulty;
  const dc = MAINTENANCE_DIFFICULTY_DC[difficulty];

  const requirements: RepairRequirement[] = [
    {
      type: "skill_check",
      requirement: "Tinker Tools",
      value: dc,
      description: `DC ${dc} Tinker Tools check to repair`,
    },
    {
      type: "time",
      requirement: "hours",
      value:
        severity === "minor"
          ? 1
          : severity === "moderate"
          ? 2
          : severity === "major"
          ? 4
          : 8,
      description: "Time required for repair",
    },
  ];

  // Add resource requirements based on type and severity
  switch (type) {
    case "power_failure":
      requirements.push({
        type: "resource",
        requirement: "spare_parts",
        value: severity === "critical" ? 3 : 2,
        description: "Spare parts needed for power system repair",
      });
      break;

    case "mechanical_jam":
      requirements.push({
        type: "resource",
        requirement: "lubricant",
        value: 1,
        description: "Lubricant needed to free jammed components",
      });
      break;

    case "overheating":
      requirements.push({
        type: "resource",
        requirement: "coolant",
        value: severity === "critical" ? 3 : 2,
        description: "Coolant needed to address overheating",
      });
      break;

    case "component_failure":
      requirements.push({
        type: "resource",
        requirement: "spare_parts",
        value: severity === "minor" ? 1 : severity === "moderate" ? 2 : 3,
        description: "Replacement components needed",
      });
      break;

    case "aether_leak":
      requirements.push({
        type: "resource",
        requirement: "aether_dust",
        value: 1,
        description: "Aether dust needed to seal leak",
      });
      break;
  }

  return requirements;
}

/**
 * Generate malfunction description
 */
function generateMalfunctionDescription(
  type: MalfunctionType,
  severity: MalfunctionSeverity
): string {
  const severityDesc =
    severity === "minor"
      ? "slight"
      : severity === "moderate"
      ? "noticeable"
      : severity === "major"
      ? "significant"
      : "critical";

  switch (type) {
    case "power_failure":
      return `${severityDesc} power system failure affecting equipment operation`;
    case "mechanical_jam":
      return `${severityDesc} mechanical jamming in moving components`;
    case "overheating":
      return `${severityDesc} overheating causing performance degradation`;
    case "calibration_drift":
      return `${severityDesc} calibration drift affecting accuracy`;
    case "component_failure":
      return `${severityDesc} component failure reducing effectiveness`;
    case "mod_interference":
      return `${severityDesc} interference between installed modifications`;
    case "aether_leak":
      return `${severityDesc} aether leakage causing instability`;
    case "structural_damage":
      return `${severityDesc} structural damage compromising integrity`;
    default:
      return `${severityDesc} equipment malfunction`;
  }
}

/**
 * Perform maintenance on equipment
 */
export function performMaintenance(
  maintenanceData: MaintenanceData,
  resources: MaintenanceResource[],
  skillBonus: number,
  timeSpent: number
): MaintenanceResult {
  const result: MaintenanceResult = {
    success: false,
    newMaintenanceLevel: maintenanceData.maintenanceLevel,
    malfunctionsFixed: [],
    malfunctionsOccurred: [],
    resourcesConsumed: [],
    timeSpent,
    notes: [],
  };

  // Calculate maintenance effectiveness
  const skillCheck = Math.floor(Math.random() * 20) + 1 + skillBonus;
  const resourceQuality = calculateResourceQuality(resources);

  // Determine success
  const baseDC = 10;
  const success = skillCheck >= baseDC;
  result.success = success;

  if (success) {
    // Improve maintenance level
    const improvement = Math.min(
      20,
      5 + Math.floor(timeSpent * 2) + resourceQuality
    );
    result.newMaintenanceLevel = Math.min(
      100,
      maintenanceData.maintenanceLevel + improvement
    );

    // Attempt to fix malfunctions
    const activeMalfunctions = maintenanceData.malfunctions.filter(
      (m) => m.active
    );
    for (const malfunction of activeMalfunctions) {
      const repairCheck = Math.floor(Math.random() * 20) + 1 + skillBonus;
      const repairDC =
        malfunction.repairRequirements.find((r) => r.type === "skill_check")
          ?.value || 15;

      if (repairCheck >= repairDC) {
        result.malfunctionsFixed.push(malfunction.id);
        result.notes.push(`Fixed ${malfunction.type} malfunction`);
      }
    }

    result.notes.push(
      `Maintenance level improved to ${result.newMaintenanceLevel}`
    );
  } else {
    result.notes.push("Maintenance attempt failed");

    // Risk of causing new malfunction on critical failure
    if (skillCheck <= 5) {
      const riskFactors = calculateMalfunctionRisk(maintenanceData);
      const newMalfunction = checkForMalfunction(maintenanceData, riskFactors);
      if (newMalfunction) {
        result.malfunctionsOccurred.push(newMalfunction);
        result.notes.push("Maintenance error caused new malfunction!");
      }
    }
  }

  // Consume resources
  result.resourcesConsumed = [...resources];

  return result;
}

/**
 * Calculate resource quality modifier
 */
function calculateResourceQuality(resources: MaintenanceResource[]): number {
  let qualityBonus = 0;

  for (const resource of resources) {
    switch (resource.quality) {
      case "superior":
        qualityBonus += 2;
        break;
      case "masterwork":
        qualityBonus += 4;
        break;
      default:
        qualityBonus += 0;
    }
  }

  return qualityBonus;
}

/**
 * Create default maintenance data
 */
export function createDefaultMaintenanceData(
  maintenanceInterval: number = 100
): MaintenanceData {
  return {
    maintenanceLevel: 100,
    usageHours: 0,
    maintenanceInterval,
    malfunctions: [],
    maintenanceHistory: [],
    specialRequirements: [],
  };
}

/**
 * Add usage hours to equipment
 */
export function addUsageHours(
  maintenanceData: MaintenanceData,
  hours: number
): MaintenanceData {
  return {
    ...maintenanceData,
    usageHours: maintenanceData.usageHours + hours,
  };
}
