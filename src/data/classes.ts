import type { Class, ClassFeature } from "../types";

// ============================================================================
// SUBCLASS FEATURES
// ============================================================================

const SUBCLASS_FEATURES: Record<string, ClassFeature[]> = {
    // Arcanist Subclasses
    Aethermancer: [
        {
            name: "Spell Slot Conversion",
            level: 1,
            description: "Convert spell slots into Aether Flux Points (AFP).",
        },
        {
            name: "Psionic Discipline",
            level: 1,
            description: "Learn 1 psionic Discipline.",
        },
        {
            name: "Resonant Pulse",
            level: 6,
            description: "Gain Resonant Pulse as a bonus action once per short rest.",
            usesPerRest: { amount: 1, restType: "short" },
        },
    ],
    Gearwright: [
        {
            name: "Aether Familiar",
            level: 1,
            description: "Build a mechanical companion (HP = 5 × your proficiency bonus).",
        },
        {
            name: "Device Infusion",
            level: 1,
            description: "Infuse devices with low-level spell effects.",
        },
        {
            name: "Construct Creation",
            level: 10,
            description: "Create temporary constructs as action (CR ½ or lower).",
        },
    ],

    // Templar Subclasses
    "Relic Knight": [
        {
            name: "Aura of Focus",
            level: 1,
            description: "Allies in 10 ft gain +1 to saving throws vs psionic effects.",
        },
        {
            name: "Channel Healing",
            level: 1,
            description: "Can channel healing energy through armor or shield.",
        },
        {
            name: "Faith Barrier",
            level: 7,
            description: "Project a Faith Barrier once per long rest (temporary HP = 2 × level).",
            usesPerRest: { amount: 1, restType: "long" },
        },
    ],
    "Iron Saint": [
        {
            name: "Runed Armor",
            level: 1,
            description: "Your armor gains +1 AC and glows with runes of faith.",
        },
        {
            name: "Divine Advantage",
            level: 1,
            description: "Spend 1 Charge to gain advantage on a saving throw.",
        },
        {
            name: "Psychic Immunity",
            level: 10,
            description: "Become immune to fear and psychic damage for 1 minute.",
        },
    ],

    // Tweaker Subclasses
    Boilerheart: [
        {
            name: "Bloodied Fury",
            level: 1,
            description: "When reduced to half HP, gain +1 attack each turn.",
        },
        {
            name: "Explosion Death Throes",
            level: 1,
            description: "If reduced to 0 HP, emit 10-ft burst (2d6 fire).",
        },
        {
            name: "Heat Immunity",
            level: 1,
            description: "Immune to exhaustion effects caused by heat.",
        },
    ],
    Neurospike: [
        {
            name: "CON to Attack",
            level: 1,
            description: "Add CON to attack rolls for unarmed strikes.",
        },
        {
            name: "Defensive Reflex",
            level: 1,
            description: "Reaction: Gain +2 AC when attacked once per round.",
        },
        {
            name: "Hyperfocus",
            level: 7,
            description: "Take two bonus actions per turn for 3 rounds (1/long rest).",
            usesPerRest: { amount: 1, restType: "long" },
        },
    ],

    // Shadehand Subclasses
    Circuitbreaker: [
        {
            name: "Disable Device",
            level: 1,
            description: "Once per turn, disable a mod or device within 5 ft as a bonus action.",
        },
        {
            name: "Construct Bane",
            level: 1,
            description: "Critical hits against constructs deal double damage.",
        },
        {
            name: "Trap Expertise",
            level: 9,
            description: "Gain advantage on Dex saves vs traps and Aether pulses.",
        },
    ],
    "Mirage Operative": [
        {
            name: "Blur",
            level: 1,
            description: "Cast Blur once per long rest using goggles or focus.",
            usesPerRest: { amount: 1, restType: "long" },
        },
        {
            name: "Deception Master",
            level: 1,
            description: "Gain proficiency in Deception and Sleight of Hand.",
        },
        {
            name: "Mirror Image",
            level: 7,
            description: "Create illusory duplicates for 1 minute (mirror image effect).",
        },
    ],

    // Vanguard Subclasses
    "Bulwark Sentinel": [
        {
            name: "Guardian Aura",
            level: 1,
            description: "Allies within 5 ft gain +1 AC.",
        },
        {
            name: "Protective Reaction",
            level: 1,
            description: "Reaction: Impose disadvantage on attack against an ally (1/round).",
        },
        {
            name: "Expanded Guard",
            level: 10,
            description: "Can guard 10-ft radius instead of 5 ft.",
        },
    ],
    Shockbreaker: [
        {
            name: "Lightning Strikes",
            level: 1,
            description: "Melee attacks deal +1d4 lightning damage.",
        },
        {
            name: "Static Burst",
            level: 1,
            description: "Once per long rest, unleash Static Burst (15-ft cone, 2d8 lightning).",
            usesPerRest: { amount: 1, restType: "long" },
        },
        {
            name: "Storm Resistance",
            level: 1,
            description: "Resistant to lightning and thunder damage.",
        },
    ],

    // Artifex Subclasses
    Fieldwright: [
        {
            name: "Quick Repair",
            level: 1,
            description: "Repair ally's mod as bonus action.",
        },
        {
            name: "Damage Boost",
            level: 1,
            description: "Ally's next attack deals +1d6 damage if assisted.",
        },
        {
            name: "Deploy Turrets",
            level: 10,
            description: "Deploy temporary drone turrets (AC 15, HP 15, dmg 1d10).",
        },
    ],
    Aetherforger: [
        {
            name: "Weapon Imbue",
            level: 1,
            description: "Spend 1 ⚙️ worth of Aether Dust to imbue weapon with energy (1 minute).",
        },
        {
            name: "Create Aether Cores",
            level: 1,
            description: "Create Aether Cores to power other devices (3 uses/day).",
        },
        {
            name: "Arcane Feedback Immunity",
            level: 1,
            description: "Immune to arcane feedback.",
        },
    ],

    // Mindweaver Subclasses
    "Path of the Echo": [
        {
            name: "Echo Powers",
            level: 1,
            description: "Gain Resonant Pulse and Echo Step.",
        },
        {
            name: "Resonant Damage",
            level: 1,
            description:
                "When you manifest a power, nearby enemies take psychic damage equal to your mod.",
        },
    ],
    "Path of Flux": [
        {
            name: "Flux Powers",
            level: 1,
            description: "Learn Entropy Lash and Aether Drain.",
        },
        {
            name: "AFP Recovery",
            level: 1,
            description: "Recover 1 AFP when damaging psionic or magical foes.",
        },
    ],
    "Path of Eidolon": [
        {
            name: "Eidolon Powers",
            level: 1,
            description: "Gain Spectral Hand and Soul Anchor.",
        },
        {
            name: "Astral Duplicate",
            level: 1,
            description: "Project an astral duplicate once per short rest for 1 minute.",
            usesPerRest: { amount: 1, restType: "short" },
        },
    ],
} as const;

export const CLASSES: Class[] = [
    // ============================================================================
    // ARCANIST - Scholar, manipulator of Aether, experimental technomage
    // ============================================================================
    {
        type: "Arcanist",
        primaryAbility: "intelligence",
        hitDie: "1d6",
        primaryResource: "AetherFluxPoints",
        spellcasting: {
            spellcastingAbility: "intelligence",
            spellLists: ["Wizard", "Warlock"],
            cantripsKnown: 3,
            spellsKnown: 6,
        },
        features: [
            {
                name: "Aether Spellcasting",
                level: 1,
                description:
                    "Functions like 5E arcane casting, but powered by Aether Cells instead of components.",
            },
            {
                name: "Spell Recharge",
                level: 1,
                description:
                    "Recover one spent slot after a short rest by burning 1 ⚙️ worth of materials.",
            },
            {
                name: "Tinker Savant",
                level: 1,
                description: "You gain proficiency in Tinker's Tools.",
            },
            {
                name: "Arcane Focus",
                level: 1,
                description:
                    "Choose Steamstaff or Aether Lens. Enhances spells with elemental modulation.",
            },
        ],
        description: {
            role: "Scholar, manipulator of Aether, experimental technomage",
            description:
                "Arcanists are the thinkers and dreamers who see the Aether as both art and science. They record the laws of psionics, but also break them — crafting machines that blur the line between spell and mechanism.",
            archetypes: ["Aethermancer", "Gearwright"],
        },
        startingEquipment: {
            weapons: ["brass-dagger-001"],
            armor: "steamweave-vest-001",
            tools: ["tinkers-tools-001"],
            items: [
                "aether-lamp-001",
                "aether-dust-vial-001",
                "mechanists-satchel-001",
                "aether-cell-001",
                "aether-cell-001",
            ],
            currency: {
                cogs: 100,
                gears: 0,
                cores: 0,
            },
        },
        configurableFeatures: [
            {
                featureName: "Arcane Focus",
                level: 1,
                configurationType: "choice",
                required: true,
                description: "Choose your arcane focus type",
                options: [
                    {
                        id: "steamstaff",
                        name: "Steamstaff",
                        description: "A staff that channels Aether through steam pressure",
                    },
                    {
                        id: "aether-lens",
                        name: "Aether Lens",
                        description: "Crystalline lens that focuses psionic energy",
                    },
                ],
            },
        ],
        subclasses: [
            {
                type: "Aethermancer",
                features: SUBCLASS_FEATURES.Aethermancer!,
            },
            {
                type: "Gearwright",
                features: SUBCLASS_FEATURES.Gearwright!,
            },
        ],
    },

    // ============================================================================
    // TEMPLAR - Psionic paladin, relic guardian, and holy engineer
    // ============================================================================
    {
        type: "Templar",
        primaryAbility: "charisma",
        hitDie: "1d10",
        primaryResource: "ResonanceCharges",
        spellcasting: {
            spellcastingAbility: "wisdom",
            spellLists: ["Cleric"],
            spellsPrepared: 0, // Calculated as Templar Level + Wisdom modifier
        },
        description: {
            role: "Psionic paladin, relic guardian, and holy engineer",
            description:
                "Templars channel both devotion and invention through sacred relics known as Resonant Cores — crystalline engines housing fragments of divine Aether.",
            archetypes: ["Relic Knight", "Iron Saint", "Voice of the Choir"],
        },
        features: [
            {
                name: "Resonant Smite",
                level: 1,
                description: "Consume 1 Resonance Charge to deal +2d8 radiant or lightning damage.",
            },
            {
                name: "Faith Engine",
                level: 1,
                description: "Your armor or weapon acts as a psionic focus.",
            },
            {
                name: "Steamshield Mod",
                level: 1,
                description: "Once per rest, reflect a ranged spell or attack.",
                usesPerRest: { amount: 1, restType: "short" },
            },
            {
                name: "Sacred Repair",
                level: 1,
                description: "Heal a construct or machine for 1d8 HP per Charge spent.",
            },
        ],
        startingEquipment: {
            weapons: ["steam-hammer-001", "standard-shield-001"],
            armor: "gearmail-hauberk-001",
            tools: [],
            items: [
                "aether-cell-001",
                "aether-cell-001",
                "repair-paste-vial-001",
                "steam-lantern-001",
            ],
            currency: {
                cogs: 120,
                gears: 0,
                cores: 0,
            },
        },
        configurableFeatures: [],
        subclasses: [
            {
                type: "Relic Knight",
                features: SUBCLASS_FEATURES["Relic Knight"]!,
            },
            {
                type: "Iron Saint",
                features: SUBCLASS_FEATURES["Iron Saint"]!,
            },
        ],
    },

    // ============================================================================
    // TWEAKER - Brawler, chemist, reckless modder of the flesh
    // ============================================================================
    {
        type: "Tweaker",
        primaryAbility: "constitution",
        hitDie: "1d12",
        primaryResource: "AdrenalSurges",
        description: {
            role: "Brawler, chemist, reckless modder of the flesh",
            description:
                "Tweakers embody chaos made flesh. They inject volatile compounds, overclock their hearts, and graft experimental mods directly into their bodies.",
            archetypes: ["Boilerheart", "Neurospike"],
        },
        features: [
            {
                name: "Adrenal Surge",
                level: 1,
                description:
                    "Bonus action, gain +2 STR and +10 ft speed for 1 minute (1/short rest).",
                usesPerRest: { amount: 1, restType: "short" },
            },
            {
                name: "Overdrive",
                level: 1,
                description: "Temporarily boost CON by +1 for each Surge active.",
            },
            {
                name: "Steam Vent Harness",
                level: 1,
                description: "Release steam as an obscuring cloud for 1 round.",
            },
            {
                name: "Enhanced Metabolism",
                level: 1,
                description: "You regain an extra 1d4 HP whenever you consume a healing effect.",
            },
        ],
        startingEquipment: {
            weapons: ["cogwrench-001"],
            armor: "wireweave-jacket-001",
            tools: [],
            items: [
                "steam-vent-harness-001",
                "coolant-flask-001",
                "coolant-flask-001",
                "repair-paste-vial-001",
                "aether-cell-001",
            ],
            currency: {
                cogs: 80,
                gears: 0,
                cores: 0,
            },
        },
        configurableFeatures: [],
        subclasses: [
            {
                type: "Boilerheart",
                features: SUBCLASS_FEATURES.Boilerheart!,
            },
            {
                type: "Neurospike",
                features: SUBCLASS_FEATURES.Neurospike!,
            },
        ],
    },

    // ============================================================================
    // SHADEHAND - Stealth, infiltration, sabotage, precision strikes
    // ============================================================================
    {
        type: "Shadehand",
        primaryAbility: "dexterity",
        hitDie: "1d8",
        primaryResource: "None",
        description: {
            role: "Stealth, infiltration, sabotage, precision strikes",
            description:
                "Shadehands are rogues, thieves, and assassins who view stealth as both art and philosophy. Their tools combine psionic projection, light manipulation, and mechanical precision.",
            archetypes: ["Circuitbreaker", "Mirage Operative"],
        },
        features: [
            {
                name: "Sneak Attack",
                level: 1,
                description: "As 5E rogue. Starts at 1d6, increases to 2d6 at level 3.",
            },
            {
                name: "Ghoststep Cloak",
                level: 1,
                description:
                    "Once per short rest, become invisible for 1 round after making an attack.",
                usesPerRest: { amount: 1, restType: "short" },
            },
            {
                name: "Silent Tools",
                level: 1,
                description: "You have proficiency with Thieves' Tools and Disguise Kit.",
            },
        ],
        startingEquipment: {
            weapons: ["brass-dagger-001", "brass-dagger-001"],
            armor: "steamweave-vest-001",
            tools: ["tinkers-tools-001"],
            items: [
                "goggles-of-clarity-001",
                "wireweave-rope-50-ft-001",
                "aether-lamp-001",
                "mechanists-satchel-001",
            ],
            currency: {
                cogs: 90,
                gears: 0,
                cores: 0,
            },
        },
        configurableFeatures: [],
        subclasses: [
            {
                type: "Circuitbreaker",
                features: SUBCLASS_FEATURES.Circuitbreaker!,
            },
            {
                type: "Mirage Operative",
                features: SUBCLASS_FEATURES["Mirage Operative"]!,
            },
        ],
    },

    // ============================================================================
    // VANGUARD - Frontline fighter, tactical commander, and steam-powered bruiser
    // ============================================================================
    {
        type: "Vanguard",
        primaryAbility: "strength",
        hitDie: "1d10",
        primaryResource: "None",
        description: {
            role: "Frontline fighter, tactical commander, and steam-powered bruiser",
            description:
                "Vanguards are the wall between civilization and ruin — heavy soldiers enhanced with mech plating or steam-augments. They are both weapon and engine.",
            archetypes: ["Bulwark Sentinel", "Shockbreaker"],
        },
        features: [
            {
                name: "Defensive Stance",
                level: 1,
                description: "Add +2 AC when you take the Dodge action.",
            },
            {
                name: "Steam Charge",
                level: 1,
                description: "Dash as a bonus action; next melee attack deals +1d6 damage.",
            },
            {
                name: "Reinforced Frame",
                level: 1,
                description: "Your carrying capacity doubles.",
            },
            {
                name: "Gear Mod Slot",
                level: 1,
                description: "Install one armor or weapon mod without penalty.",
            },
        ],
        startingEquipment: {
            weapons: ["steam-hammer-001", "standard-shield-001"],
            armor: "gearmail-hauberk-001",
            tools: [],
            items: [
                "aether-cell-001",
                "aether-cell-001",
                "repair-paste-vial-001",
                "wireweave-rope-50-ft-001",
            ],
            currency: {
                cogs: 110,
                gears: 0,
                cores: 0,
            },
        },
        configurableFeatures: [],
        subclasses: [
            {
                type: "Bulwark Sentinel",
                features: SUBCLASS_FEATURES["Bulwark Sentinel"]!,
            },
            {
                type: "Shockbreaker",
                features: SUBCLASS_FEATURES.Shockbreaker!,
            },
        ],
    },

    // ============================================================================
    // ARTIFEX - Inventor, field engineer, and battlefield support specialist
    // ============================================================================
    {
        type: "Artifex",
        primaryAbility: "intelligence",
        hitDie: "1d8",
        primaryResource: "None",
        description: {
            role: "Inventor, field engineer, and battlefield support specialist",
            description:
                "Artifex are builders of wonder — blending technology, chemistry, and psionics into living art. They see the world as raw material for improvement, and themselves as its sculptors.",
            archetypes: ["Fieldwright", "Aetherforger"],
        },
        features: [
            {
                name: "Tinker's Expertise",
                level: 1,
                description: "Double proficiency in Tinker's Tools.",
            },
            {
                name: "Deploy Drone",
                level: 1,
                description: "Create a small construct familiar (AC 12, HP 10, range 60 ft).",
            },
            {
                name: "Repair Pulse",
                level: 1,
                description: "Restore 1d8 HP to mechanical allies as an action.",
            },
            {
                name: "Overclock",
                level: 1,
                description: "Add INT to weapon damage rolls for modded items.",
            },
        ],
        startingEquipment: {
            weapons: ["rivetgun-001"],
            armor: "steamweave-vest-001",
            tools: ["tinkers-tools-001"],
            items: [
                "mechanists-satchel-001",
                "aether-cell-001",
                "aether-cell-001",
                "aether-dust-vial-001",
                "repair-paste-vial-001",
                "aether-compass-001",
            ],
            currency: {
                cogs: 100,
                gears: 0,
                cores: 0,
            },
        },
        configurableFeatures: [],
        subclasses: [
            {
                type: "Fieldwright",
                features: SUBCLASS_FEATURES.Fieldwright!,
            },
            {
                type: "Aetherforger",
                features: SUBCLASS_FEATURES.Aetherforger!,
            },
        ],
    },

    // ============================================================================
    // MINDWEAVER - Psionic specialist; manipulator of will, energy, and space
    // ============================================================================
    {
        type: "Mindweaver",
        primaryAbility: "intelligence", // or wisdom, choose at creation
        hitDie: "1d8",
        primaryResource: "AetherFluxPoints",
        description: {
            role: "Psionic specialist; manipulator of will, energy, and space",
            description:
                "Mindweavers are the inheritors of the first consciousnesses. They don't cast spells — they reshape the probability field. Where others wield tools, a Mindweaver wields focus.",
            archetypes: ["Path of the Echo", "Path of Flux", "Path of Eidolon"],
        },
        features: [
            {
                name: "Aether Flux Pool",
                level: 1,
                description: "Used to manifest psionic powers. AFP = Level + Ability Modifier.",
            },
            {
                name: "Telepathic Whispers",
                level: 1,
                description: "Communicate mentally within 30 ft.",
            },
            {
                name: "Psionic Awareness",
                level: 1,
                description: "Sense Aetheric signatures within 30 ft.",
            },
            {
                name: "Focus Limit",
                level: 1,
                description: "Maintain one psionic effect (increases with level).",
            },
        ],
        startingEquipment: {
            weapons: ["brass-dagger-001"],
            armor: "aetherweave-coat-001",
            tools: [],
            items: [
                "aether-lamp-001",
                "aether-dust-vial-001",
                "aether-dust-vial-001",
                "aether-cell-001",
                "mnemonic-lens-001",
            ],
            currency: {
                cogs: 90,
                gears: 0,
                cores: 0,
            },
        },
        configurableFeatures: [
            {
                featureName: "Primary Ability",
                level: 1,
                configurationType: "ability-selection",
                required: true,
                description: "Choose your primary psionic ability",
                options: [
                    {
                        id: "intelligence",
                        name: "Intelligence",
                        description: "Focus on analytical and structured psionic manipulation",
                    },
                    {
                        id: "wisdom",
                        name: "Wisdom",
                        description: "Focus on intuitive and perceptive psionic awareness",
                    },
                ],
            },
        ],
        subclasses: [
            {
                type: "Path of the Echo",
                features: SUBCLASS_FEATURES["Path of the Echo"]!,
            },
            {
                type: "Path of Flux",
                features: SUBCLASS_FEATURES["Path of Flux"]!,
            },
            {
                type: "Path of Eidolon",
                features: SUBCLASS_FEATURES["Path of Eidolon"]!,
            },
        ],
    },
];
