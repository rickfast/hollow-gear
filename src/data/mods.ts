import type { CraftTier, Mod, ModTierSpec } from "@/types";

export const MOD_TIERS: ModTierSpec[] = [
    {
        tier: "I - Common",
        craftTier: "Workshop",
        craftDC: 10,
        timeHours: 2,
        cost: 25,
        powerLevel: "Basic (minor stat boost)",
        slots: 1,
    },
    {
        tier: "II - Advanced",
        craftTier: "Guild",
        craftDC: 13,
        timeHours: 4,
        cost: 75,
        powerLevel: "Elemental or reactive mods",
        slots: 2,
    },
    {
        tier: "III - Relic",
        craftTier: "Relic",
        craftDC: 16,
        timeHours: 8,
        cost: 200,
        powerLevel: "Multi-effect or psionic mods",
        slots: 3,
    },
    {
        tier: "IV - Prototype",
        craftTier: "Mythic",
        craftDC: 18,
        timeHours: 16,
        cost: 400,
        powerLevel: "Sentient or unstable",
        slots: 4,
    },
];

export const CRAFT_TIER_LOOKUP: Record<CraftTier, ModTierSpec> = {
    Workshop: MOD_TIERS[0]!,
    Guild: MOD_TIERS[1]!,
    Relic: MOD_TIERS[2]!,
    Mythic: MOD_TIERS[3]!,
};

// ============================================================================
// WEAPON MODS
// ============================================================================

export const WEAPON_MODS: Mod[] = [
    {
        id: "overclock-coil",
        name: "Overclock Coil",
        tier: "I - Common",
        modType: "Power",
        equipmentType: "Weapon",
        effect: "+1d8 damage (once/short rest)",
        craftDC: 10,
        craftTime: 2,
        cost: 25,
        malfunctionChance: 5,
        notes: "Overheat risk",
        additionalDamage: {
            count: 1,
            die: 8,
            damageType: "Fire",
        },
        usesPerRest: {
            amount: 1,
            restType: "short"
        }
    },
    {
        id: "steam-vent-array",
        name: "Steam Vent Array",
        tier: "I - Common",
        modType: "Utility",
        equipmentType: "Weapon",
        effect: "Create 10-ft obscuring cloud for 1 round (1/short rest)",
        craftDC: 10,
        craftTime: 2,
        cost: 25,
        notes: "Also cools armor",
    },
    {
        id: "voltaic-mesh",
        name: "Voltaic Mesh",
        tier: "II - Advanced",
        modType: "Reactive",
        equipmentType: "Weapon",
        effect: "Deals 1d4 lightning to melee attackers",
        craftDC: 13,
        craftTime: 4,
        cost: 75,
        notes: "Counts as powered",
        additionalDamage: {
            count: 1,
            die: 4,
            damageType: "Lightning",
        },
    },
    {
        id: "resonant-core",
        name: "Resonant Core",
        tier: "II - Advanced",
        modType: "Psionic",
        equipmentType: "Weapon",
        effect: "Converts damage to psychic (once/turn)",
        craftDC: 13,
        craftTime: 4,
        cost: 75,
        notes: "Requires psionic focus",
    },
    {
        id: "magnetron-housing",
        name: "Magnetron Housing",
        tier: "II - Advanced",
        modType: "Utility",
        equipmentType: "Weapon",
        effect: "You can disarm metallic weapons within 5 ft as bonus action",
        craftDC: 13,
        craftTime: 4,
        cost: 75,
        notes: "Strength save DC 13",
    },
    {
        id: "aether-injector",
        name: "Aether Injector",
        tier: "III - Relic",
        modType: "Power",
        equipmentType: "Weapon",
        effect: "Spend 1 Aether Cell to double weapon damage dice for 1 round",
        craftDC: 16,
        craftTime: 8,
        cost: 200,
        malfunctionChance: 15,
        notes: "High malfunction risk",
    },
    {
        id: "cryo-edge",
        name: "Cryo Edge",
        tier: "III - Relic",
        modType: "Elemental",
        equipmentType: "Weapon",
        effect: "On hit: target's speed reduced by 10 ft until end of next turn",
        craftDC: 16,
        craftTime: 8,
        cost: 200,
    },
    {
        id: "entropy-lattice",
        name: "Entropy Lattice",
        tier: "IV - Prototype",
        modType: "Psionic",
        equipmentType: "Weapon",
        effect: "Adds +1d6 force damage and 5-ft knockback",
        craftDC: 18,
        craftTime: 16,
        cost: 400,
        notes: "Sentient; whispers in combat",
        additionalDamage: {
            count: 1,
            die: 6,
            damageType: "Force",
        },
    },
    {
        id: "soul-capacitor",
        name: "Soul Capacitor",
        tier: "IV - Prototype",
        modType: "Power",
        equipmentType: "Weapon",
        effect: "Stores 10 psychic dmg; next hit adds it",
        craftDC: 18,
        craftTime: 16,
        cost: 400,
        notes: "Emits eerie hum when charged",
    },
];

// ============================================================================
// ARMOR MODS
// ============================================================================

export const ARMOR_MODS: Mod[] = [
    {
        id: "pressure-vents",
        name: "Pressure Vents",
        tier: "I - Common",
        modType: "Utility",
        equipmentType: "Armor",
        effect: "Release steam to remove Heat Stress",
        craftDC: 10,
        craftTime: 2,
        cost: 25,
        notes: "1/short rest",
        usesPerRest: {
            amount: 1,
            restType: "short"
        }
    },
    {
        id: "reinforced-plating",
        name: "Reinforced Plating",
        tier: "I - Common",
        modType: "Defense",
        equipmentType: "Armor",
        effect: "+1 AC vs slashing or piercing",
        craftDC: 10,
        craftTime: 2,
        cost: 25,
        notes: "Stackable up to +2",
    },
    {
        id: "reflective-sigil",
        name: "Reflective Sigil",
        tier: "II - Advanced",
        modType: "Reactive",
        equipmentType: "Armor",
        effect: "Reflects 1 spell or psionic effect (1/long rest)",
        craftDC: 13,
        craftTime: 4,
        cost: 75,
        notes: "Consumes sigil charge",
        usesPerRest: {
            amount: 1,
            restType: "long"
        }
    },
    {
        id: "flux-dampener",
        name: "Flux Dampener",
        tier: "II - Advanced",
        modType: "Psionic",
        equipmentType: "Armor",
        effect: "Reduces psychic damage by 3",
        craftDC: 13,
        craftTime: 4,
        cost: 75,
        notes: "Passive",
    },
    {
        id: "servo-stabilizers",
        name: "Servo Stabilizers",
        tier: "II - Advanced",
        modType: "Power",
        equipmentType: "Armor",
        effect: "+5 ft movement; ignore heavy armor Strength req",
        craftDC: 13,
        craftTime: 4,
        cost: 75,
        notes: "Requires maintenance",
    },
    {
        id: "overheat-regulator",
        name: "Overheat Regulator",
        tier: "III - Relic",
        modType: "Utility",
        equipmentType: "Armor",
        effect: "Ignore 1 level of Heat Stress per short rest",
        craftDC: 16,
        craftTime: 8,
        cost: 200,
        notes: "Cannot stack",
        usesPerRest: {
            amount: 1,
            restType: "short"
        }
    },
    {
        id: "aether-amplifier",
        name: "Aether Amplifier",
        tier: "III - Relic",
        modType: "Psionic",
        equipmentType: "Armor",
        effect: "Gain +1 to attack rolls or save DCs for psionic powers",
        craftDC: 16,
        craftTime: 8,
        cost: 200,
    },
    {
        id: "graviton-anchor",
        name: "Graviton Anchor",
        tier: "IV - Prototype",
        modType: "Power",
        equipmentType: "Armor",
        effect: "Advantage vs knockback, forced move, or push/pull",
        craftDC: 18,
        craftTime: 16,
        cost: 400,
        notes: "Creates heavy hum field",
    },
    {
        id: "soul-mirror",
        name: "Soul Mirror",
        tier: "IV - Prototype",
        modType: "Psionic",
        equipmentType: "Armor",
        effect: "Transfer ½ psychic dmg taken to nearest enemy within 10 ft",
        craftDC: 18,
        craftTime: 16,
        cost: 400,
        notes: "Once per short rest",
        usesPerRest: {
            amount: 1,
            restType: "short"
        }
    },
];

// ============================================================================
// SHIELD MODS
// ============================================================================

export const SHIELD_MODS: Mod[] = [
    {
        id: "steam-deflector",
        name: "Steam Deflector",
        tier: "I - Common",
        modType: "Defense",
        equipmentType: "Shield",
        effect: "Gain +2 AC vs ranged attacks for 1 round (1/short rest)",
        craftDC: 10,
        craftTime: 2,
        cost: 25,
        notes: "Vent-assisted",
        usesPerRest: {
            amount: 1,
            restType: "short"
        }
    },
    {
        id: "resonant-aegis-core",
        name: "Resonant Aegis Core",
        tier: "II - Advanced",
        modType: "Defense",
        equipmentType: "Shield",
        effect: "Allies within 10 ft gain +1 AC",
        craftDC: 13,
        craftTime: 4,
        cost: 75,
        notes: "Emits low harmonic field",
    },
    {
        id: "aether-ward-lens",
        name: "Aether Ward Lens",
        tier: "III - Relic",
        modType: "Psionic",
        equipmentType: "Shield",
        effect: "Absorbs 10 psychic dmg per day",
        craftDC: 16,
        craftTime: 8,
        cost: 200,
        notes: "Refills at dawn",
        usesPerRest: {
            amount: 1,
            restType: "long"
        }
    },
    {
        id: "voltaic-pulse-coil",
        name: "Voltaic Pulse Coil",
        tier: "III - Relic",
        modType: "Reactive",
        equipmentType: "Shield",
        effect: "When hit in melee, emit 5-ft burst (1d6 lightning)",
        craftDC: 16,
        craftTime: 8,
        cost: 200,
        additionalDamage: {
            count: 1,
            die: 6,
            damageType: "Lightning",
        },
    },
    {
        id: "kinetic-redirector",
        name: "Kinetic Redirector",
        tier: "IV - Prototype",
        modType: "Reactive",
        equipmentType: "Shield",
        effect: "Once/long rest, redirect melee attack to another target",
        craftDC: 18,
        craftTime: 16,
        cost: 400,
        notes: "Reaction",
        usesPerRest: {
            amount: 1,
            restType: "long"
        }
    },
];

// ============================================================================
// ALL MODS
// ============================================================================

export const MODS: Mod[] = [...WEAPON_MODS, ...ARMOR_MODS, ...SHIELD_MODS];
export const MOD_LOOKUP: Record<string, Mod> = MODS.reduce(
    (acc, mod) => {
        acc[mod.id] = mod;
        return acc;
    },
    {} as Record<string, Mod>
);
