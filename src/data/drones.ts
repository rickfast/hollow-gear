import type {
    Drone,
    DroneArchetypeTemplate,
    DroneCraftingRequirements,
    DroneMalfunction,
    DroneRepair,
    DroneTemplate,
} from "@/types/drones";

// ============================================================================
// DRONE TEMPLATES (Basic Types)
// ============================================================================

export const DRONE_TEMPLATES: DroneTemplate[] = [
    {
        id: "utility-drone",
        type: "Utility",
        name: "Utility Drone",
        stats: {
            size: "Tiny",
            armorClass: 13,
            hitPoints: {
                average: 8,
                roll: "2d6+1",
            },
            speed: {
                walk: 30,
                fly: 10,
            },
            attack: {
                name: "Arc Cutter",
                bonus: 3,
                damage: {
                    count: 1,
                    die: 4,
                    damageType: "Slashing",
                },
            },
        },
        features: ["Carries 10 lb", "Assists with repairs"],
        description: "A versatile helper drone designed for field repairs and light cargo transport.",
        modSlots: 1,
    },
    {
        id: "combat-drone",
        type: "Combat",
        name: "Combat Drone",
        stats: {
            size: "Small",
            armorClass: 15,
            hitPoints: {
                average: 12,
                roll: "3d6+3",
            },
            speed: {
                walk: 30,
            },
            attack: {
                name: "Shock Prod",
                bonus: 4,
                damage: {
                    count: 1,
                    die: 6,
                    damageType: "Lightning",
                },
            },
        },
        features: ["Can use your reaction to impose disadvantage on one melee attack"],
        description: "A combat-focused drone built for battlefield support and defense.",
        modSlots: 1,
    },
    {
        id: "recon-drone",
        type: "Recon",
        name: "Recon Drone",
        stats: {
            size: "Tiny",
            armorClass: 12,
            hitPoints: {
                average: 7,
                roll: "2d4+2",
            },
            speed: {
                walk: 20,
                fly: 30,
            },
        },
        features: ["Darkvision 60 ft", "Transmits vision and sound to the Artifex"],
        description: "A surveillance drone designed for scouting and reconnaissance missions.",
        modSlots: 1,
    },
];

// ============================================================================
// DRONE ARCHETYPES
// ============================================================================

export const DRONE_ARCHETYPES: DroneArchetypeTemplate[] = [
    {
        id: "coghound",
        archetype: "Coghound",
        name: "The Coghound",
        baseStats: {
            size: "Small",
            speed: {
                walk: 40, // +10 ft speed bonus
            },
        },
        features: [
            {
                name: "Canine Loyalty",
                description: "Gains advantage on tracking checks.",
            },
            {
                name: "Delivery System",
                description: "Can deliver small items (up to 5 lb).",
            },
            {
                name: "Comforting Hum",
                description: "Allies within 5 ft gain +1 to saves vs fear.",
            },
        ],
        description: "Small, quadrupedal scout drone with canine loyalty.",
    },
    {
        id: "gyrfly",
        archetype: "Gyrfly",
        name: "The Gyrfly",
        baseStats: {
            size: "Tiny",
            speed: {
                walk: 20,
                fly: 40,
            },
        },
        features: [
            {
                name: "Hovering Flight",
                description: "Can hover in place without falling.",
            },
            {
                name: "Audio Recorder",
                description: "Once per day, can record up to 1 minute of sound.",
            },
            {
                name: "Dazzling Flare",
                description: "Emits flash in 5 ft radius (DC 12 Con save or blinded 1 round).",
            },
        ],
        description: "Lightweight aerial assistant with four rotating wings.",
    },
    {
        id: "bulwark-node",
        archetype: "Bulwark Node",
        name: "The Bulwark Node",
        baseStats: {
            size: "Small",
            armorClass: 17, // +2 AC bonus
            speed: {
                walk: 20,
            },
        },
        features: [
            {
                name: "Barrier Pulse",
                description:
                    "As a reaction, can project a barrier giving +2 AC to an adjacent ally for 1 round. Generates Heat +1 each use.",
            },
        ],
        description: "Compact shield-bot for battlefield protection.",
    },
    {
        id: "scribe-beetle",
        archetype: "Scribe Beetle",
        name: "The Scribe Beetle",
        baseStats: {
            size: "Tiny",
            speed: {
                walk: 25,
                climb: 25,
            },
        },
        features: [
            {
                name: "Perfect Transcription",
                description: "Transcribes sound or vision with perfect accuracy.",
            },
            {
                name: "Forgery",
                description: "Can forge or copy written data.",
            },
            {
                name: "Tremorsense",
                description: "When attached to a wall or door, grants tremorsense 15 ft.",
            },
        ],
        description: "Multi-legged recorder drone with psionic ink stylus.",
    },
    {
        id: "chimera-frame",
        archetype: "Chimera Frame",
        name: "The Chimera Frame",
        baseStats: {
            size: "Small",
            armorClass: 16,
            hitPoints: {
                average: 20,
                roll: "4d6+6",
            },
            speed: {
                walk: 30,
                fly: 30,
            },
        },
        features: [
            {
                name: "Adaptive Mode",
                description: "Can switch between ground and aerial mode as a bonus action.",
            },
            {
                name: "Aether Burst",
                description:
                    "Once per long rest, perform Aether Burst (10 ft explosion, 2d6 force damage, Dex save DC 13 half).",
            },
        ],
        description: "Advanced hybrid with adaptive appendages.",
    },
];

// ============================================================================
// DRONE CRAFTING & REPAIR
// ============================================================================

export const DRONE_CRAFTING: DroneCraftingRequirements = {
    proficiency: "Tinker's Tools",
    timeHours: 8,
    materialCost: 25, // in Cogs
    dc: 14,
    repairCost: {
        timeHours: 2,
        materialCost: 5,
    },
};

export const DRONE_REPAIR: DroneRepair = {
    actionType: "Action",
    cost: 1, // in Cogs
    healing: "1d6",
    overclock: {
        cost: 3,
        healing: {
            count: 3,
            die: 6
        },
        heatGain: 1,
    },
};

// ============================================================================
// DRONE MALFUNCTIONS (at 5+ Heat)
// ============================================================================

export const DRONE_MALFUNCTIONS: DroneMalfunction[] = [
    {
        roll: 1,
        effect: "Shuts down for 1 round.",
    },
    {
        roll: 2,
        effect: "Discharges static (5 ft radius, 1d4 lightning damage).",
        damage: {
            count: 1,
            die: 4,
            damageType: "Lightning",
        },
    },
    {
        roll: 3,
        effect: "Vocal loop (emits random noise, reveals position).",
    },
    {
        roll: 4,
        effect: "Reverses targeting; attacks ally until reset.",
    },
    {
        roll: 5,
        effect: "Random movement 10 ft in random direction.",
    },
    {
        roll: 6,
        effect: "No effect; cooling successful.",
    },
];

// ============================================================================
// DRONE EVOLUTION UPGRADES
// ============================================================================

export const DRONE_EVOLUTIONS = [
    {
        level: 5,
        upgrade: "Enhanced Construction",
        bonuses: {
            armorClass: 1,
            hitPoints: 5,
            modSlots: 1,
        },
    },
    {
        level: 9,
        upgrade: "Active Feature",
        bonuses: {
            features: ["Flight", "Climb", "Swim", "Darkvision 60 ft"],
        },
    },
    {
        level: 13,
        upgrade: "Limited Self-Direction",
        bonuses: {
            features: ["Acts independently for up to 3 rounds without command"],
        },
    },
];

// ============================================================================
// LOOKUP OBJECTS
// ============================================================================

export const DRONE_TEMPLATES_BY_ID = Object.fromEntries(
    DRONE_TEMPLATES.map((template) => [template.id, template])
);

export const DRONE_ARCHETYPES_BY_ID = Object.fromEntries(
    DRONE_ARCHETYPES.map((archetype) => [archetype.id, archetype])
);

// ============================================================================
// EXAMPLE DRONES (for testing/pregens)
// ============================================================================

export const EXAMPLE_DRONES: Drone[] = [
    {
        id: "drone-001",
        name: "Sparky",
        templateId: "combat-drone",
        level: 3,
        hitPoints: {
            current: 12,
            maximum: 12,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        modSlots: 1,
        mods: [],
        personalityQuirk: "Emits low mechanical purring when praised",
        customization: {
            shellFinish: "Black enamel",
            coreColor: "Blue",
        },
    },
    {
        id: "drone-002",
        name: "Whisper",
        templateId: "recon-drone",
        archetypeId: "gyrfly",
        level: 5,
        hitPoints: {
            current: 12,
            maximum: 12,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        modSlots: 2,
        mods: [],
        personalityQuirk: "Collects small shiny objects or screws",
        customization: {
            shellFinish: "Verdigris brass",
            coreColor: "Green",
        },
        destroyed: false,
    },
];
