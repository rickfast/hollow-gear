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
    
    description: "A scuttling insectoid machine built to clean the gears of factories, now corrupted by time. They strip metal from armor and weapons with hungry precision.",
    
    armorClass: {
        value: 13,
        source: "rusted carapace"
    },
    
    hitPoints: {
        count: 2,
        die: 6,
        bonus: 4,
        average: 11
    },
    
    speed: {
        walk: 30,
        climb: 20
    },
    
    abilities: {
        strength: 10,
        dexterity: 14,
        constitution: 14,
        intelligence: 3,
        wisdom: 10,
        charisma: 4
    },
    
    skills: [
        { skill: "Stealth", bonus: 4 }
    ],
    
    resistances: {
        damageTypes: ["Lightning", "Piercing"]
    },
    
    vulnerabilities: {
        damageTypes: ["Acid"]
    },
    
    senses: {
        special: [
            { type: "Darkvision", range: 60 }
        ],
        passivePerception: 10
    },
    
    languages: "—",
    
    challengeRating: {
        rating: "1/4",
        xp: 50
    },
    
    features: [
        {
            name: "Scrap Instinct",
            description: "The Rust Crawler can sense uncorroded metal within 30 ft."
        }
    ],
    
    actions: [
        {
            name: "Rustbite",
            description: "Melee Weapon Attack: +4 to hit, reach 5 ft, one target. Hit: 5 (1d6 + 2) piercing damage, and the target must succeed on a DC 11 Dexterity saving throw or one nonmagical metal weapon or piece of armor becomes corroded, taking a permanent −1 penalty to AC or attack rolls.",
            attackBonus: 4,
            reach: 5,
            damage: [{
                count: 1,
                die: 6,
                bonus: 2,
                damageType: "Piercing",
                average: 5
            }],
            savingThrow: {
                ability: "dexterity",
                dc: 11
            }
        }
    ]
};

export const AETHER_WISP: BestiaryEntry = {
    id: "aether-wisp",
    name: "Aether Wisp",
    size: "Tiny",
    type: "Aberration",
    alignment: "Neutral",
    emoji: "🧠",
    
    description: "A drifting orb of residual psionic energy, left behind by dead Mindweavers. It flickers between dimensions, drawn to strong thoughts and emotions.",
    
    armorClass: {
        value: 12
    },
    
    hitPoints: {
        count: 2,
        die: 4,
        bonus: 4,
        average: 9
    },
    
    speed: {
        fly: 30,
        hover: true
    },
    
    abilities: {
        strength: 3,
        dexterity: 14,
        constitution: 14,
        intelligence: 10,
        wisdom: 12,
        charisma: 8
    },
    
    resistances: {
        damageTypes: ["Psychic", "Force"]
    },
    
    immunities: {
        damageTypes: ["Poison"],
        conditions: ["Prone", "Grappled", "Restrained"]
    },
    
    senses: {
        special: [
            { type: "Darkvision", range: 60 }
        ],
        passivePerception: 11
    },
    
    languages: ["Common", "Avenari"],
    
    challengeRating: {
        rating: "1/2",
        xp: 100
    },
    
    features: [
        {
            name: "Thought Drain",
            description: "When a creature within 10 ft uses a psionic ability, the Wisp may absorb fragments of it, regaining 1d4 hit points."
        },
        {
            name: "Flicker",
            description: "The Wisp can pass through solid objects as if they were difficult terrain."
        }
    ],
    
    actions: [
        {
            name: "Psionic Bolt",
            description: "Ranged Spell Attack: +4 to hit, range 30 ft, one target. Hit: 7 (2d4 + 2) psychic damage.",
            recharge: "5–6",
            attackBonus: 4,
            range: 30,
            damage: [{
                count: 2,
                die: 4,
                bonus: 2,
                damageType: "Psychic",
                average: 7
            }]
        }
    ]
};

export const IRON_HUSK: BestiaryEntry = {
    id: "iron-husk",
    name: "Iron Husk",
    size: "Medium",
    type: "Construct",
    subtype: "Former Humanoid",
    alignment: "Chaotic Evil",
    emoji: "🧟",
    
    description: "A fallen worker reanimated by psionic residue and mechanical rot. Its flesh is threaded with copper wire, and its voice is the hiss of escaping steam.",
    
    armorClass: {
        value: 14,
        source: "patchwork plating"
    },
    
    hitPoints: {
        count: 3,
        die: 8,
        bonus: 3,
        average: 16
    },
    
    speed: {
        walk: 25
    },
    
    abilities: {
        strength: 13,
        dexterity: 8,
        constitution: 13,
        intelligence: 5,
        wisdom: 10,
        charisma: 6
    },
    
    savingThrows: [
        { ability: "constitution", bonus: 3 }
    ],
    
    resistances: {
        damageTypes: ["Fire", "Lightning"]
    },
    
    immunities: {
        conditions: ["Charmed", "Frightened", "Exhaustion"]
    },
    
    senses: {
        special: [
            { type: "Darkvision", range: 60 }
        ],
        passivePerception: 10
    },
    
    languages: ["Common"],
    
    challengeRating: {
        rating: "1",
        xp: 200
    },
    
    features: [
        {
            name: "Unstable Core",
            description: "When reduced to 0 HP, the Husk explodes. Creatures within 10 ft take 6 (2d6) fire damage (DEX save DC 12 for half)."
        }
    ],
    
    actions: [
        {
            name: "Steam Slam",
            description: "Melee Weapon Attack: +3 to hit, reach 5 ft, one target. Hit: 7 (2d6 + 1) bludgeoning damage.",
            attackBonus: 3,
            reach: 5,
            damage: [{
                count: 2,
                die: 6,
                bonus: 1,
                damageType: "Bludgeoning",
                average: 7
            }]
        },
        {
            name: "Overpressure",
            description: "The Iron Husk releases built-up steam in a 10-ft radius. Each creature must make a DC 12 Constitution saving throw or take 5 (2d4) fire damage and be pushed 5 ft.",
            recharge: "6",
            savingThrow: {
                ability: "constitution",
                dc: 12
            },
            damage: [{
                count: 2,
                die: 4,
                bonus: 0,
                damageType: "Fire",
                average: 5
            }]
        }
    ]
};

export const GEAR_RAT: BestiaryEntry = {
    id: "gear-rat",
    name: "Gear Rat",
    size: "Small",
    type: "Beast",
    subtype: "Part Construct",
    alignment: "Unaligned",
    emoji: "🐀",
    
    description: "A common pest in the undercities — rodents with implanted brass teeth and clockwork tails. Their survival instinct is matched only by their appetite for insulation and wiring.",
    
    armorClass: {
        value: 13
    },
    
    hitPoints: {
        count: 2,
        die: 6,
        bonus: 0,
        average: 7
    },
    
    speed: {
        walk: 30,
        climb: 20
    },
    
    abilities: {
        strength: 8,
        dexterity: 15,
        constitution: 10,
        intelligence: 2,
        wisdom: 10,
        charisma: 4
    },
    
    skills: [
        { skill: "Stealth", bonus: 4 }
    ],
    
    senses: {
        special: [
            { type: "Darkvision", range: 30 }
        ],
        passivePerception: 10
    },
    
    languages: "—",
    
    challengeRating: {
        rating: "1/8",
        xp: 25
    },
    
    features: [
        {
            name: "Conductive Tail",
            description: "When struck by lightning damage, the Gear Rat arcs the current to another creature within 5 ft (DC 10 Dex save or take 2 lightning damage)."
        },
        {
            name: "Swarm Instinct",
            description: "If at least one other Gear Rat is within 5 ft, the Gear Rat gains advantage on attack rolls."
        }
    ],
    
    actions: [
        {
            name: "Bite",
            description: "Melee Weapon Attack: +4 to hit, reach 5 ft, one target. Hit: 4 (1d4 + 2) piercing damage.",
            attackBonus: 4,
            reach: 5,
            damage: [{
                count: 1,
                die: 4,
                bonus: 2,
                damageType: "Piercing",
                average: 4
            }]
        }
    ]
};

// Export all creatures as a collection
export const BESTIARY_CREATURES = [
    RUST_CRAWLER,
    AETHER_WISP,
    IRON_HUSK,
    GEAR_RAT
] as const;

// Helper function to get creature by ID
export function getCreatureById(id: string): BestiaryEntry | undefined {
    return BESTIARY_CREATURES.find(creature => creature.id === id);
}

// Helper function to get creatures by type
export function getCreaturesByType(type: string): BestiaryEntry[] {
    return BESTIARY_CREATURES.filter(creature => creature.type === type);
}

// Helper function to get creatures by challenge rating
export function getCreaturesByCR(cr: string): BestiaryEntry[] {
    return BESTIARY_CREATURES.filter(creature => creature.challengeRating.rating === cr);
}