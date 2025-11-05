// ============================================================================
// BESTIARY DATA
// ============================================================================
// Sample creature statblocks from Chapter 8: Bestiary

import type { BestiaryEntry } from "../types";

export const RUST_CRAWLER: BestiaryEntry = {
    id: "rust-crawler",
    name: "Rust Crawler",
    size: "Small",
    type: "Construct",
    alignment: "Unaligned",
    emoji: "⚙️",

    description:
        "A scuttling insectoid machine built to clean the gears of factories, now corrupted by time. They strip metal from armor and weapons with hungry precision.",

    armorClass: {
        value: 13,
        source: "rusted carapace",
    },

    hitPoints: {
        count: 2,
        die: 6,
        bonus: 4,
        average: 11,
    },

    speed: {
        walk: 30,
        climb: 20,
    },

    abilities: {
        strength: 10,
        dexterity: 14,
        constitution: 14,
        intelligence: 3,
        wisdom: 10,
        charisma: 4,
    },

    skills: [{ skill: "Stealth", bonus: 4 }],

    resistances: {
        damageTypes: ["Lightning", "Piercing"],
    },

    vulnerabilities: {
        damageTypes: ["Acid"],
    },

    senses: {
        special: [{ type: "Darkvision", range: 60 }],
        passivePerception: 10,
    },

    languages: "—",

    challengeRating: {
        rating: "1/4",
        xp: 50,
    },

    features: [
        {
            name: "Scrap Instinct",
            description: "The Rust Crawler can sense uncorroded metal within 30 ft.",
        },
    ],

    actions: [
        {
            name: "Rustbite",
            description:
                "Melee Weapon Attack: +4 to hit, reach 5 ft, one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 11 Dexterity saving throw or one nonmagical metal weapon or piece of armor becomes corroded, taking a permanent −1 penalty to AC or attack rolls.",
            attackBonus: 4,
            reach: 5,
            damage: [
                {
                    count: 1,
                    die: 6,
                    bonus: 2,
                    damageType: "Piercing",
                    average: 5,
                },
            ],
            savingThrow: {
                ability: "dexterity",
                dc: 11,
            },
        },
    ],
};

export const AETHER_WISP: BestiaryEntry = {
    id: "aether-wisp",
    name: "Aether Wisp",
    size: "Tiny",
    type: "Aberration",
    alignment: "Neutral",
    emoji: "🧠",

    description:
        "A drifting orb of residual psionic energy, left behind by dead Mindweavers. It flickers between dimensions, drawn to strong thoughts and emotions.",

    armorClass: {
        value: 12,
    },

    hitPoints: {
        count: 2,
        die: 4,
        bonus: 4,
        average: 9,
    },

    speed: {
        fly: 30,
        hover: true,
    },

    abilities: {
        strength: 3,
        dexterity: 14,
        constitution: 14,
        intelligence: 10,
        wisdom: 12,
        charisma: 8,
    },

    resistances: {
        damageTypes: ["Psychic", "Force"],
    },

    immunities: {
        damageTypes: ["Poison"],
        conditions: ["Prone", "Grappled", "Restrained"],
    },

    senses: {
        special: [{ type: "Darkvision", range: 60 }],
        passivePerception: 11,
    },

    languages: ["Common", "Avenari"],

    challengeRating: {
        rating: "1/2",
        xp: 100,
    },

    features: [
        {
            name: "Thought Drain",
            description:
                "When a creature within 10 ft uses a psionic ability, the Wisp may absorb fragments of it, regaining 1d4 hit points.",
        },
        {
            name: "Flicker",
            description:
                "The Wisp can pass through solid objects as if they were difficult terrain.",
        },
    ],

    actions: [
        {
            name: "Psionic Bolt",
            description:
                "Ranged Spell Attack: +4 to hit, range 30 ft, one target. Hit: 7 (2d4 + 2) psychic damage.",
            recharge: "5–6",
            attackBonus: 4,
            range: 30,
            damage: [
                {
                    count: 2,
                    die: 4,
                    bonus: 2,
                    damageType: "Psychic",
                    average: 7,
                },
            ],
        },
    ],
};

export const IRON_HUSK: BestiaryEntry = {
    id: "iron-husk",
    name: "Iron Husk",
    size: "Medium",
    type: "Construct",
    subtype: "Former Humanoid",
    alignment: "Chaotic Evil",
    emoji: "🧟",

    description:
        "A fallen etherborne worker (typically tharn or aqualoth) reanimated by psionic residue and mechanical rot. Its flesh is threaded with copper wire, and its voice is the hiss of escaping steam.",

    armorClass: {
        value: 14,
        source: "patchwork plating",
    },

    hitPoints: {
        count: 3,
        die: 8,
        bonus: 3,
        average: 16,
    },

    speed: {
        walk: 25,
    },

    abilities: {
        strength: 13,
        dexterity: 8,
        constitution: 13,
        intelligence: 5,
        wisdom: 10,
        charisma: 6,
    },

    savingThrows: [{ ability: "constitution", bonus: 3 }],

    resistances: {
        damageTypes: ["Fire", "Lightning"],
    },

    immunities: {
        conditions: ["Charmed", "Frightened", "Exhaustion"],
    },

    senses: {
        special: [{ type: "Darkvision", range: 60 }],
        passivePerception: 10,
    },

    languages: ["Common"],

    challengeRating: {
        rating: "1",
        xp: 200,
    },

    features: [
        {
            name: "Unstable Core",
            description:
                "When reduced to 0 HP, the Husk explodes. Creatures within 10 ft take 6 (2d6) fire damage (DEX save DC 12 for half).",
        },
    ],

    actions: [
        {
            name: "Steam Slam",
            description:
                "Melee Weapon Attack: +3 to hit, reach 5 ft, one target. Hit: 7 (2d6 + 1) bludgeoning damage.",
            attackBonus: 3,
            reach: 5,
            damage: [
                {
                    count: 2,
                    die: 6,
                    bonus: 1,
                    damageType: "Bludgeoning",
                    average: 7,
                },
            ],
        },
        {
            name: "Overpressure",
            description:
                "The Iron Husk releases built-up steam in a 10-ft radius. Each creature must make a DC 12 Constitution saving throw or take 5 (2d4) fire damage and be pushed 5 ft.",
            recharge: "6",
            savingThrow: {
                ability: "constitution",
                dc: 12,
            },
            damage: [
                {
                    count: 2,
                    die: 4,
                    bonus: 0,
                    damageType: "Fire",
                    average: 5,
                },
            ],
        },
    ],
};

export const GEAR_RAT: BestiaryEntry = {
    id: "gear-rat",
    name: "Gear Rat",
    size: "Small",
    type: "Beast",
    subtype: "Part Construct",
    alignment: "Unaligned",
    emoji: "🐀",

    description:
        "A common pest in the undercities — rodents with implanted brass teeth and clockwork tails. Their survival instinct is matched only by their appetite for insulation and wiring.",

    armorClass: {
        value: 13,
    },

    hitPoints: {
        count: 2,
        die: 6,
        bonus: 0,
        average: 7,
    },

    speed: {
        walk: 30,
        climb: 20,
    },

    abilities: {
        strength: 8,
        dexterity: 15,
        constitution: 10,
        intelligence: 2,
        wisdom: 10,
        charisma: 4,
    },

    skills: [{ skill: "Stealth", bonus: 4 }],

    senses: {
        special: [{ type: "Darkvision", range: 30 }],
        passivePerception: 10,
    },

    languages: "—",

    challengeRating: {
        rating: "1/8",
        xp: 25,
    },

    features: [
        {
            name: "Conductive Tail",
            description:
                "When struck by lightning damage, the Gear Rat arcs the current to another creature within 5 ft (DC 10 Dex save or take 2 lightning damage).",
        },
        {
            name: "Swarm Instinct",
            description:
                "If at least one other Gear Rat is within 5 ft, the Gear Rat gains advantage on attack rolls.",
        },
    ],

    actions: [
        {
            name: "Bite",
            description:
                "Melee Weapon Attack: +4 to hit, reach 5 ft, one target. Hit: 4 (1d4 + 2) piercing damage.",
            attackBonus: 4,
            reach: 5,
            damage: [
                {
                    count: 1,
                    die: 4,
                    bonus: 2,
                    damageType: "Piercing",
                    average: 4,
                },
            ],
        },
    ],
};

// ============================================================================
// NEW CREATURES (CR 1/4 - 2)
// ============================================================================

export const COGLING_SWARM: BestiaryEntry = {
    id: "cogling-swarm",
    name: "Cogling Swarm",
    size: "Tiny",
    type: "Construct",
    subtype: "Swarm",
    alignment: "Unaligned",
    emoji: "🪳",
    description:
        "Miniature gear-ticks — maintenance mites that now roam abandoned tunnels. Individually weak, dangerous in masses.",
    armorClass: { value: 12 },
    hitPoints: { count: 3, die: 4, bonus: 6, average: 13 },
    speed: { walk: 30, climb: 20 },
    abilities: {
        strength: 6,
        dexterity: 14,
        constitution: 14,
        intelligence: 2,
        wisdom: 10,
        charisma: 3,
    },
    resistances: { damageTypes: ["Piercing", "Slashing"] },
    immunities: {
        conditions: [
            "Charmed",
            "Frightened",
            "Grappled",
            "Paralyzed",
            "Petrified",
            "Prone",
            "Restrained",
        ],
    },
    senses: { special: [{ type: "Darkvision", range: 30 }], passivePerception: 10 },
    languages: "—",
    challengeRating: { rating: "1/4", xp: 50 },
    features: [
        {
            name: "Metal Sense",
            description: "The swarm detects unattended metal objects within 20 ft.",
        },
        { name: "Distributed Form", description: "The swarm cannot be knocked prone." },
    ],
    actions: [
        {
            name: "Swarm Bite",
            description:
                "Melee Weapon Attack: +4 to hit, reach 5 ft, one target. Hit: 5 (2d4) piercing damage, or 3 (1d4 + 1) piercing damage if the swarm has half its hit points or fewer.",
            attackBonus: 4,
            reach: 5,
            damage: [{ count: 2, die: 4, bonus: 0, damageType: "Piercing", average: 5 }],
        },
    ],
};

export const STEAM_STITCHER: BestiaryEntry = {
    id: "steam-stitcher",
    name: "Steam Stitcher",
    size: "Small",
    type: "Construct",
    alignment: "Neutral",
    emoji: "🩺",
    description:
        "An auto-suturing medical drone repurposed by scavengers; its needle arrays now inject destabilizing coolant.",
    armorClass: { value: 13, source: "plated casing" },
    hitPoints: { count: 2, die: 6, bonus: 4, average: 11 },
    speed: { walk: 20, fly: 30, hover: true },
    abilities: {
        strength: 8,
        dexterity: 14,
        constitution: 14,
        intelligence: 8,
        wisdom: 12,
        charisma: 6,
    },
    skills: [{ skill: "Medicine", bonus: 3 }],
    resistances: { damageTypes: ["Lightning"] },
    senses: { special: [{ type: "Darkvision", range: 30 }], passivePerception: 11 },
    languages: ["Common"],
    challengeRating: { rating: "1/4", xp: 50 },
    features: [
        {
            name: "Coolant Splash",
            description:
                "When reduced to 0 HP, releases freezing vapor; creatures within 5 ft take 3 (1d6) cold damage.",
        },
    ],
    actions: [
        {
            name: "Injector Needles",
            description:
                "Melee Weapon Attack: +4 to hit, reach 5 ft, one target. Hit: 5 (1d4 + 3) piercing damage and the target's speed is reduced by 5 ft until the end of its next turn.",
            attackBonus: 4,
            reach: 5,
            damage: [{ count: 1, die: 4, bonus: 3, damageType: "Piercing", average: 5 }],
        },
        {
            name: "Emergency Patch",
            description:
                "The Stitcher targets a construct or creature within 5 ft, restoring 1d6 hit points.",
            recharge: "6",
        },
    ],
};

export const RIVET_HOUND: BestiaryEntry = {
    id: "rivet-hound",
    name: "Rivet Hound",
    size: "Medium",
    type: "Construct",
    subtype: "Beast-Frame",
    alignment: "Lawful Neutral",
    emoji: "🐕",
    description:
        "Originally watchdog chassis for foundries; they now roam as territorial guardians with magnetic jaws.",
    armorClass: { value: 14, source: "riveted plating" },
    hitPoints: { count: 4, die: 8, bonus: 0, average: 18 },
    speed: { walk: 40 },
    abilities: {
        strength: 14,
        dexterity: 12,
        constitution: 11,
        intelligence: 3,
        wisdom: 12,
        charisma: 6,
    },
    skills: [{ skill: "Perception", bonus: 3 }],
    senses: { special: [{ type: "Darkvision", range: 60 }], passivePerception: 13 },
    languages: "—",
    challengeRating: { rating: "1/2", xp: 100 },
    features: [
        {
            name: "Scent of Ozone",
            description:
                "Advantage on Perception checks relying on smell to detect powered devices.",
        },
    ],
    actions: [
        {
            name: "Bite",
            description:
                "Melee Weapon Attack: +4 to hit, reach 5 ft. Hit: 7 (1d8 + 3) piercing damage.",
            attackBonus: 4,
            reach: 5,
            damage: [{ count: 1, die: 8, bonus: 3, damageType: "Piercing", average: 7 }],
        },
        {
            name: "Magnetic Lock",
            description:
                "On a successful Bite, the target must succeed on a DC 12 Strength saving throw or be grappled (escape DC 12). Until the grapple ends, the Hound has advantage on Bite attacks against that target.",
            recharge: "5–6",
            savingThrow: { ability: "strength", dc: 12 },
        },
    ],
};

export const MAGNETRON_DRONE: BestiaryEntry = {
    id: "magnetron-drone",
    name: "Magnetron Drone",
    size: "Small",
    type: "Construct",
    alignment: "Unaligned",
    emoji: "🛰️",
    description:
        "Survey drones used to map Aether currents; their field projectors can hurl debris or deflect attacks.",
    armorClass: { value: 13 },
    hitPoints: { count: 5, die: 6, bonus: 0, average: 17 },
    speed: { fly: 40, hover: true },
    abilities: {
        strength: 6,
        dexterity: 16,
        constitution: 10,
        intelligence: 11,
        wisdom: 12,
        charisma: 5,
    },
    skills: [{ skill: "Perception", bonus: 3 }],
    resistances: { damageTypes: ["Lightning"] },
    senses: { special: [{ type: "Darkvision", range: 60 }], passivePerception: 13 },
    languages: ["Common"],
    challengeRating: { rating: "1/2", xp: 100 },
    features: [
        {
            name: "Magnetic Sweep",
            description:
                "As a bonus action, pulls one unattended metal object (≤10 lb) within 20 ft to itself.",
        },
    ],
    actions: [
        {
            name: "Pulse Bolt",
            description:
                "Ranged Weapon Attack: +5 to hit, range 60 ft. Hit: 6 (1d6 + 3) lightning damage.",
            attackBonus: 5,
            range: 60,
            damage: [{ count: 1, die: 6, bonus: 3, damageType: "Lightning", average: 6 }],
        },
        {
            name: "Repulsion Field",
            description:
                "Creatures of the Drone's choice within 10 ft must succeed on a DC 12 Strength saving throw or be pushed 10 ft.",
            recharge: "6",
            savingThrow: { ability: "strength", dc: 12 },
        },
    ],
};

export const VOID_LEECH: BestiaryEntry = {
    id: "void-leech",
    name: "Void Leech",
    size: "Small",
    type: "Aberration",
    alignment: "Neutral Evil",
    emoji: "🪱",
    description:
        "An extradimensional scavenger that feeds on psionic discharge, clinging to powered armor seams.",
    armorClass: { value: 13, source: "slick hide" },
    hitPoints: { count: 5, die: 6, bonus: 5, average: 22 },
    speed: { walk: 20, climb: 20 },
    abilities: {
        strength: 8,
        dexterity: 14,
        constitution: 12,
        intelligence: 5,
        wisdom: 12,
        charisma: 6,
    },
    resistances: { damageTypes: ["Psychic"] },
    senses: { special: [{ type: "Darkvision", range: 60 }], passivePerception: 11 },
    languages: "—",
    challengeRating: { rating: "1", xp: 200 },
    features: [
        {
            name: "Cling",
            description:
                "Can move into the space of a Medium or larger creature; has advantage on attack rolls against a creature it is clinging to.",
        },
    ],
    actions: [
        {
            name: "Leech Bite",
            description:
                "Melee Weapon Attack: +4 to hit, reach 5 ft. Hit: 6 (1d6 + 3) piercing plus 3 (1d6) psychic damage.",
            attackBonus: 4,
            reach: 5,
            damage: [
                { count: 1, die: 6, bonus: 3, damageType: "Piercing", average: 6 },
                { count: 1, die: 6, bonus: 0, damageType: "Psychic", average: 3 },
            ],
        },
        {
            name: "Siphon Field",
            description:
                "One powered item or creature within 10 ft loses 1 charge (or suffers −1 on next attack if no charges); the Void Leech regains 5 hit points.",
            recharge: "5–6",
        },
    ],
};

export const GEAR_SENTINEL: BestiaryEntry = {
    id: "gear-sentinel",
    name: "Gear Sentinel",
    size: "Medium",
    type: "Construct",
    alignment: "Lawful Neutral",
    emoji: "🛡️",
    description: "Automated corridor guardian bearing rotating shield-rings and kinetic hammers.",
    armorClass: { value: 15, source: "geared plating" },
    hitPoints: { count: 8, die: 8, bonus: 0, average: 36 },
    speed: { walk: 30 },
    abilities: {
        strength: 16,
        dexterity: 10,
        constitution: 14,
        intelligence: 8,
        wisdom: 12,
        charisma: 8,
    },
    savingThrows: [{ ability: "constitution", bonus: 4 }],
    resistances: { damageTypes: ["Bludgeoning", "Piercing"] },
    senses: { special: [{ type: "Darkvision", range: 60 }], passivePerception: 11 },
    languages: ["Common", "Tharn"],
    challengeRating: { rating: "2", xp: 450 },
    features: [
        {
            name: "Kinetic Rebound",
            description: "When hit by a melee attack, the attacker takes 3 (1d6) force damage.",
        },
    ],
    actions: [
        {
            name: "Hammer Strike",
            description:
                "Melee Weapon Attack: +5 to hit, reach 5 ft. Hit: 9 (1d10 + 4) bludgeoning damage.",
            attackBonus: 5,
            reach: 5,
            damage: [{ count: 1, die: 10, bonus: 4, damageType: "Bludgeoning", average: 9 }],
        },
        {
            name: "Shield Ring",
            description:
                "The Sentinel gains +2 AC until the start of its next turn and all creatures of its choice within 5 ft gain +1 AC.",
            recharge: "5–6",
        },
    ],
};

export const AETHERFORGE_MYRMIDON: BestiaryEntry = {
    id: "aetherforge-myrmidon",
    name: "Aetherforge Myrmidon",
    size: "Medium",
    type: "Construct",
    alignment: "Neutral",
    emoji: "🧪",
    description:
        "An experimental foundry servitor infused with controlled psionic matrices; its limbs glow with lattice fire.",
    armorClass: { value: 16, source: "aether lattice" },
    hitPoints: { count: 8, die: 8, bonus: 8, average: 42 },
    speed: { walk: 30 },
    abilities: {
        strength: 14,
        dexterity: 12,
        constitution: 14,
        intelligence: 11,
        wisdom: 12,
        charisma: 8,
    },
    resistances: { damageTypes: ["Fire", "Lightning", "Psychic"] },
    senses: { special: [{ type: "Darkvision", range: 60 }], passivePerception: 11 },
    languages: ["Common", "Avenari"],
    challengeRating: { rating: "2", xp: 450 },
    features: [
        {
            name: "Overchannel",
            description:
                "Once per day, the Myrmidon doubles the lightning dice of Lattice Blade for 1 minute, then gains 1 level of Heat Stress.",
        },
    ],
    actions: [
        {
            name: "Lattice Blade",
            description:
                "Melee Weapon Attack: +4 to hit, reach 5 ft. Hit: 10 (2d6 + 3) slashing plus 3 (1d6) lightning damage.",
            attackBonus: 4,
            reach: 5,
            damage: [
                { count: 2, die: 6, bonus: 3, damageType: "Slashing", average: 10 },
                { count: 1, die: 6, bonus: 0, damageType: "Lightning", average: 3 },
            ],
        },
        {
            name: "Aether Pulse",
            description:
                "15-ft cone; creatures make a DC 13 Constitution saving throw, taking 10 (3d6) psychic damage on a failure, half on success.",
            recharge: "6",
            savingThrow: { ability: "constitution", dc: 13 },
            damage: [{ count: 3, die: 6, bonus: 0, damageType: "Psychic", average: 10 }],
        },
    ],
};

// Export all creatures as a collection
export const BESTIARY_CREATURES = [
    RUST_CRAWLER,
    AETHER_WISP,
    IRON_HUSK,
    GEAR_RAT,
    COGLING_SWARM,
    STEAM_STITCHER,
    RIVET_HOUND,
    MAGNETRON_DRONE,
    VOID_LEECH,
    GEAR_SENTINEL,
    AETHERFORGE_MYRMIDON,
] as const;

// Helper function to get creature by ID
export function getCreatureById(id: string): BestiaryEntry | undefined {
    return BESTIARY_CREATURES.find((creature) => creature.id === id);
}

// Helper function to get creatures by type
export function getCreaturesByType(type: string): BestiaryEntry[] {
    return BESTIARY_CREATURES.filter((creature) => creature.type === type);
}

// Helper function to get creatures by challenge rating
export function getCreaturesByCR(cr: string): BestiaryEntry[] {
    return BESTIARY_CREATURES.filter((creature) => creature.challengeRating.rating === cr);
}
