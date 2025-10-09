/**
 * Psionic disciplines and power framework for the Hollow Gear TTRPG
 * Based on the Mindcraft system from Chapter 6
 */

/**
 * The six psionic disciplines available in Hollow Gear
 */
export type PsionicDiscipline =
  | "flux" // Entropy & Energy
  | "echo" // Sound, Vibration, & Resonance
  | "eidolon" // Soul Projection & Manifestation
  | "empyric" // Emotion, Mind, & Memory
  | "veil" // Illusion, Concealment, & Deception
  | "kinesis"; // Telekinetic Force & Motion

/**
 * Power tiers determine AFP cost and relative strength
 */
export type PowerTier = 1 | 2 | 3 | 4 | 5;

/**
 * Different types of power effects
 */
export type PowerEffectType =
  | "damage"
  | "healing"
  | "movement"
  | "control"
  | "utility"
  | "defensive"
  | "mental"
  | "illusion";

/**
 * Damage types that psionic powers can deal
 */
export type PsionicDamageType =
  | "psychic"
  | "force"
  | "thunder"
  | "necrotic"
  | "fire"
  | "cold";

/**
 * Duration types for psionic powers
 */
export type PowerDuration =
  | "instantaneous"
  | "concentration"
  | "sustained"
  | { minutes: number }
  | { hours: number }
  | { rounds: number };

/**
 * Range types for psionic powers
 */
export type PowerRange =
  | "self"
  | "touch"
  | { feet: number }
  | { cone: number }
  | { sphere: number }
  | { cube: number };

/**
 * Individual effect within a psionic power
 */
export interface PowerEffect {
  type: PowerEffectType;
  description: string;
  damage?: {
    dice: string; // e.g., "1d8", "3d6"
    type: PsionicDamageType;
  };
  healing?: {
    dice: string;
  };
  savingThrow?: {
    ability:
      | "strength"
      | "dexterity"
      | "constitution"
      | "intelligence"
      | "wisdom"
      | "charisma";
    onSuccess: "half" | "negates" | "partial";
  };
  conditions?: string[]; // e.g., ["stunned", "prone", "restrained"]
}

/**
 * Scaling options for amplifying powers with additional AFP
 */
export interface PowerScaling {
  additionalAfp: number;
  effect: "damage" | "range" | "duration" | "save_dc";
  bonus: string; // Description of the scaling bonus
}

/**
 * Core psionic power definition
 */
export interface PsionicPower {
  id: string;
  name: string;
  discipline: PsionicDiscipline;
  tier: PowerTier;
  afpCost: number;
  range: PowerRange;
  duration: PowerDuration;
  description: string;
  effects: PowerEffect[];
  scalingOptions?: PowerScaling[];
  requiresConcentration?: boolean;
  requiresFocus?: boolean; // For sustained powers
}

/**
 * Predefined powers for each discipline based on the rulebook
 */
export const DISCIPLINE_POWERS: Record<PsionicDiscipline, PsionicPower[]> = {
  flux: [
    {
      id: "entropy-lash",
      name: "Entropy Lash",
      discipline: "flux",
      tier: 1,
      afpCost: 1,
      range: "touch",
      duration: "instantaneous",
      description:
        "Melee spell attack that deals necrotic damage and pushes the target.",
      effects: [
        {
          type: "damage",
          description: "Melee spell attack: 1d8 necrotic + push 5 ft",
          damage: { dice: "1d8", type: "necrotic" },
        },
      ],
    },
    {
      id: "aether-push",
      name: "Aether Push",
      discipline: "flux",
      tier: 2,
      afpCost: 2,
      range: { feet: 30 },
      duration: "instantaneous",
      description: "10-ft force push; STR save or knocked prone.",
      effects: [
        {
          type: "control",
          description: "10-ft force push; STR save or knocked prone",
          savingThrow: { ability: "strength", onSuccess: "negates" },
          conditions: ["prone"],
        },
      ],
    },
    {
      id: "plasma-burst",
      name: "Plasma Burst",
      discipline: "flux",
      tier: 3,
      afpCost: 3,
      range: { cone: 15 },
      duration: "instantaneous",
      description: "15-ft cone of fire/force damage.",
      effects: [
        {
          type: "damage",
          description: "15-ft cone, 3d8 fire/force damage",
          damage: { dice: "3d8", type: "fire" },
        },
      ],
    },
    {
      id: "kinetic-barrier",
      name: "Kinetic Barrier",
      discipline: "flux",
      tier: 4,
      afpCost: 4,
      range: { feet: 30 },
      duration: { minutes: 1 },
      description: "Create 10-ft wall of telekinetic force for 1 minute.",
      effects: [
        {
          type: "defensive",
          description: "Create 10-ft wall of telekinetic force",
        },
      ],
      requiresConcentration: true,
    },
    {
      id: "collapse-field",
      name: "Collapse Field",
      discipline: "flux",
      tier: 5,
      afpCost: 5,
      range: { feet: 60 },
      duration: "instantaneous",
      description: "20-ft radius implosion dealing massive force damage.",
      effects: [
        {
          type: "damage",
          description: "20-ft radius implosion (6d10 force, Dex save half)",
          damage: { dice: "6d10", type: "force" },
          savingThrow: { ability: "dexterity", onSuccess: "half" },
        },
      ],
    },
  ],

  echo: [
    {
      id: "resonant-pulse",
      name: "Resonant Pulse",
      discipline: "echo",
      tier: 1,
      afpCost: 1,
      range: { cone: 15 },
      duration: "instantaneous",
      description: "15-ft cone of thunder damage that removes reactions.",
      effects: [
        {
          type: "damage",
          description: "15-ft cone, 1d8 thunder dmg; creatures lose reactions",
          damage: { dice: "1d8", type: "thunder" },
        },
      ],
    },
    {
      id: "echo-step",
      name: "Echo Step",
      discipline: "echo",
      tier: 2,
      afpCost: 2,
      range: "self",
      duration: "instantaneous",
      description: "Teleport up to 15 ft as bonus action.",
      effects: [
        {
          type: "movement",
          description: "Teleport up to 15 ft as bonus action",
        },
      ],
    },
    {
      id: "dissonant-strike",
      name: "Dissonant Strike",
      discipline: "echo",
      tier: 3,
      afpCost: 3,
      range: "touch",
      duration: "instantaneous",
      description:
        "Add thunder damage to melee hit; next attack vs target has advantage.",
      effects: [
        {
          type: "damage",
          description:
            "Add 2d8 thunder to melee hit; next attack vs target has advantage",
          damage: { dice: "2d8", type: "thunder" },
        },
      ],
    },
    {
      id: "waveform-shatter",
      name: "Waveform Shatter",
      discipline: "echo",
      tier: 4,
      afpCost: 4,
      range: { feet: 30 },
      duration: "instantaneous",
      description: "Break crystal, glass, or armor with focused sound.",
      effects: [
        {
          type: "damage",
          description:
            "Break crystal, glass, or armor (2d10 thunder, 10-ft radius)",
          damage: { dice: "2d10", type: "thunder" },
        },
      ],
    },
    {
      id: "harmonic-collapse",
      name: "Harmonic Collapse",
      discipline: "echo",
      tier: 5,
      afpCost: 5,
      range: { feet: 60 },
      duration: "instantaneous",
      description: "Create a resonance storm in a large area.",
      effects: [
        {
          type: "damage",
          description:
            "Create a resonance storm; 30-ft sphere deals 5d10 thunder + deafened",
          damage: { dice: "5d10", type: "thunder" },
          conditions: ["deafened"],
        },
      ],
    },
  ],

  eidolon: [
    {
      id: "spectral-hand",
      name: "Spectral Hand",
      discipline: "eidolon",
      tier: 1,
      afpCost: 1,
      range: { feet: 30 },
      duration: { minutes: 1 },
      description: "Create spectral appendage for manipulation within 30 ft.",
      effects: [
        {
          type: "utility",
          description:
            "Create spectral appendage for manipulation within 30 ft",
        },
      ],
      requiresConcentration: true,
    },
    {
      id: "soul-anchor",
      name: "Soul Anchor",
      discipline: "eidolon",
      tier: 2,
      afpCost: 2,
      range: { feet: 30 },
      duration: "instantaneous",
      description: "Transfer HP to an ally or pull HP from self.",
      effects: [
        {
          type: "healing",
          description: "Transfer 1d8 HP to an ally (or pull 1d8 HP from self)",
          healing: { dice: "1d8" },
        },
      ],
    },
    {
      id: "astral-shard",
      name: "Astral Shard",
      discipline: "eidolon",
      tier: 3,
      afpCost: 3,
      range: { feet: 30 },
      duration: { minutes: 1 },
      description: "Create a duplicate that mimics your attacks.",
      effects: [
        {
          type: "utility",
          description:
            "Create a duplicate (HP 10 + Int mod) that mimics your attacks",
        },
      ],
      requiresConcentration: true,
    },
    {
      id: "phantom-strike",
      name: "Phantom Strike",
      discipline: "eidolon",
      tier: 4,
      afpCost: 4,
      range: { feet: 60 },
      duration: "instantaneous",
      description: "Attack through walls or cover.",
      effects: [
        {
          type: "utility",
          description:
            "Attack through walls or cover (ignore half and three-quarters cover)",
        },
      ],
    },
    {
      id: "reunion-of-thought",
      name: "Reunion of Thought",
      discipline: "eidolon",
      tier: 5,
      afpCost: 5,
      range: { feet: 30 },
      duration: { minutes: 1 },
      description: "Merge your soul with another; share HP and senses.",
      effects: [
        {
          type: "utility",
          description:
            "Merge your soul with another; share HP and senses for 1 min",
        },
      ],
      requiresConcentration: true,
    },
  ],

  empyric: [
    {
      id: "empathic-link",
      name: "Empathic Link",
      discipline: "empyric",
      tier: 1,
      afpCost: 1,
      range: { feet: 30 },
      duration: { minutes: 1 },
      description: "Telepathically communicate emotion with 1 creature.",
      effects: [
        {
          type: "mental",
          description:
            "Telepathically communicate emotion with 1 creature (1 min)",
        },
      ],
    },
    {
      id: "mind-dull",
      name: "Mind Dull",
      discipline: "empyric",
      tier: 2,
      afpCost: 2,
      range: { feet: 30 },
      duration: { minutes: 1 },
      description: "Target has disadvantage on INT and WIS checks.",
      effects: [
        {
          type: "mental",
          description:
            "Target has disadvantage on INT and WIS checks for 1 min",
          savingThrow: { ability: "wisdom", onSuccess: "negates" },
        },
      ],
    },
    {
      id: "calm-hostility",
      name: "Calm Hostility",
      discipline: "empyric",
      tier: 3,
      afpCost: 3,
      range: { feet: 20 },
      duration: { minutes: 1 },
      description: "Suppress hostility in 20-ft radius.",
      effects: [
        {
          type: "mental",
          description: "Suppress hostility in 20-ft radius (WIS save negates)",
          savingThrow: { ability: "wisdom", onSuccess: "negates" },
        },
      ],
    },
    {
      id: "memory-echo",
      name: "Memory Echo",
      discipline: "empyric",
      tier: 4,
      afpCost: 4,
      range: "touch",
      duration: "instantaneous",
      description: "See a 10-second vision of an object's last owner.",
      effects: [
        {
          type: "utility",
          description: "See a 10-second vision of an object's last owner",
        },
      ],
    },
    {
      id: "mass-link",
      name: "Mass Link",
      discipline: "empyric",
      tier: 5,
      afpCost: 5,
      range: { feet: 30 },
      duration: { hours: 1 },
      description: "Form telepathic bond with up to 6 creatures.",
      effects: [
        {
          type: "mental",
          description: "Form telepathic bond with up to 6 creatures for 1 hour",
        },
      ],
      requiresConcentration: true,
    },
  ],

  veil: [
    {
      id: "veil-touch",
      name: "Veil Touch",
      discipline: "veil",
      tier: 1,
      afpCost: 1,
      range: "touch",
      duration: { minutes: 10 },
      description: "Alter minor sensory details (color, sound, scent).",
      effects: [
        {
          type: "illusion",
          description: "Alter minor sensory details (color, sound, scent)",
        },
      ],
    },
    {
      id: "phase-blur",
      name: "Phase Blur",
      discipline: "veil",
      tier: 2,
      afpCost: 2,
      range: "self",
      duration: { rounds: 1 },
      description: "Disadvantage on attacks against you until next turn.",
      effects: [
        {
          type: "defensive",
          description: "Disadvantage on attacks against you until next turn",
        },
      ],
    },
    {
      id: "mirage-step",
      name: "Mirage Step",
      discipline: "veil",
      tier: 3,
      afpCost: 3,
      range: "self",
      duration: { minutes: 1 },
      description: "Create illusionary duplicate (mirror image effect).",
      effects: [
        {
          type: "illusion",
          description:
            "Create illusionary duplicate for 1 min (mirror image effect)",
        },
      ],
      requiresConcentration: true,
    },
    {
      id: "aether-veil",
      name: "Aether Veil",
      discipline: "veil",
      tier: 4,
      afpCost: 4,
      range: "self",
      duration: { minutes: 10 },
      description:
        "Invisible 10-ft radius sphere; creatures inside gain advantage on Stealth.",
      effects: [
        {
          type: "illusion",
          description:
            "Invisible 10-ft radius sphere; creatures inside gain advantage on Stealth",
        },
      ],
      requiresConcentration: true,
    },
    {
      id: "false-horizon",
      name: "False Horizon",
      discipline: "veil",
      tier: 5,
      afpCost: 5,
      range: { feet: 120 },
      duration: { hours: 1 },
      description: "Create vast illusory landscape.",
      effects: [
        {
          type: "illusion",
          description:
            "Create vast illusory landscape; DC 16 Insight to disbelieve",
        },
      ],
      requiresConcentration: true,
    },
  ],

  kinesis: [
    {
      id: "telekinetic-grip",
      name: "Telekinetic Grip",
      discipline: "kinesis",
      tier: 1,
      afpCost: 1,
      range: { feet: 30 },
      duration: { minutes: 1 },
      description: "Move 1 small object within 30 ft.",
      effects: [
        {
          type: "utility",
          description: "Move 1 small object within 30 ft",
        },
      ],
      requiresConcentration: true,
    },
    {
      id: "force-pull",
      name: "Force Pull",
      discipline: "kinesis",
      tier: 2,
      afpCost: 2,
      range: { feet: 30 },
      duration: "instantaneous",
      description: "Pull one creature or object 10 ft.",
      effects: [
        {
          type: "control",
          description: "Pull one creature or object 10 ft (STR save resists)",
          savingThrow: { ability: "strength", onSuccess: "negates" },
        },
      ],
    },
    {
      id: "levitate-self",
      name: "Levitate Self",
      discipline: "kinesis",
      tier: 3,
      afpCost: 3,
      range: "self",
      duration: { minutes: 10 },
      description: "Float 20 ft for up to 10 minutes.",
      effects: [
        {
          type: "movement",
          description: "Float 20 ft for up to 10 minutes",
        },
      ],
      requiresConcentration: true,
    },
    {
      id: "crush-field",
      name: "Crush Field",
      discipline: "kinesis",
      tier: 4,
      afpCost: 4,
      range: { feet: 60 },
      duration: "instantaneous",
      description: "15-ft cube of crushing force.",
      effects: [
        {
          type: "damage",
          description:
            "15-ft cube, 3d8 force damage, restrained on failed STR save",
          damage: { dice: "3d8", type: "force" },
          savingThrow: { ability: "strength", onSuccess: "negates" },
          conditions: ["restrained"],
        },
      ],
    },
    {
      id: "mass-lift",
      name: "Mass Lift",
      discipline: "kinesis",
      tier: 5,
      afpCost: 5,
      range: { feet: 20 },
      duration: { minutes: 1 },
      description: "Levitate all objects/creatures within 20 ft.",
      effects: [
        {
          type: "control",
          description:
            "Levitate all objects/creatures within 20 ft (Concentration 1 min)",
        },
      ],
      requiresConcentration: true,
    },
  ],
};

/**
 * Get all powers for a specific discipline
 */
export function getPowersForDiscipline(
  discipline: PsionicDiscipline
): PsionicPower[] {
  return DISCIPLINE_POWERS[discipline] || [];
}

/**
 * Get a specific power by ID
 */
export function getPowerById(powerId: string): PsionicPower | undefined {
  for (const disciplinePowers of Object.values(DISCIPLINE_POWERS)) {
    const power = disciplinePowers.find((p) => p.id === powerId);
    if (power) return power;
  }
  return undefined;
}

/**
 * Get all powers of a specific tier
 */
export function getPowersByTier(tier: PowerTier): PsionicPower[] {
  const powers: PsionicPower[] = [];
  for (const disciplinePowers of Object.values(DISCIPLINE_POWERS)) {
    powers.push(...disciplinePowers.filter((p) => p.tier === tier));
  }
  return powers;
}

/**
 * Calculate the amplified AFP cost for a power with scaling
 */
export function calculateAmplifiedCost(
  baseCost: number,
  amplificationLevel: number
): number {
  return Math.min(baseCost * 2, baseCost + amplificationLevel);
}
