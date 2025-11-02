import type { Class, ClassFeature } from "../types";

// ============================================================================
// SUBCLASS FEATURES
// ============================================================================

const SUBCLASS_FEATURES: Record<string, ClassFeature[]> = {
    // Arcanist Subclasses (features at 3 / 6 / 10 / 14 / 18)
    Aethermancer: [
        {
            name: "Spell Slot Conversion",
            level: 3,
            description: "Trade a spell slot for AFP equal to slot level (once per short rest).",
        },
        {
            name: "Psionic Discipline",
            level: 3,
            description: "Learn 1 psionic discipline (power).",
        },
        {
            name: "Resonant Pulse",
            level: 6,
            description: "Bonus action: 10 ft psychic pulse (2d6 + Int) PB/day.",
            usesPerRest: { amount: 1, restType: "short" },
        },
        {
            name: "Synergized Overchannel",
            level: 10,
            description: "Spend AFP to add Int modifier to spell damage (1/turn).",
        },
        {
            name: "Mind-Arc Relay",
            level: 14,
            description: "Maintain a spell and a psionic power concentration simultaneously.",
        },
        {
            name: "Psionic Convergence",
            level: 18,
            description: "Once per long rest cast a spell and manifest a power in the same action.",
        },
    ],
    Gearwright: [
        {
            name: "Aether Familiar",
            level: 3,
            description: "Mechanical companion (HP = 5 × PB, obeys commands).",
        },
        {
            name: "Device Infusion",
            level: 3,
            description: "Infuse a device to reproduce a 1st‑level utility spell (ritual capable).",
        },
        {
            name: "Construct Creation",
            level: 6,
            description: "Action: create temporary CR 1/2 construct (Int mod / long rest).",
        },
        {
            name: "Integrated Armor Plating",
            level: 10,
            description: "+1 AC to familiar; upgrade its damage die.",
        },
        {
            name: "Autonomous Routine",
            level: 14,
            description: "Familiar can take the Help action as a bonus action.",
        },
        {
            name: "Mass Fabrication",
            level: 18,
            description: "Create two temporary infused devices at once.",
        },
    ],

    // Templar Subclasses
    "Relic Knight": [
        {
            name: "Aura of Focus",
            level: 3,
            description: "Allies within 10 ft gain +1 to saves vs psionic effects.",
        },
        {
            name: "Channel Healing",
            level: 3,
            description: "Channel healing energy through armor or shield (1d6 + Cha).",
        },
        {
            name: "Faith Barrier",
            level: 6,
            description: "Project barrier: temp HP = 2 × level (1/long rest).",
            usesPerRest: { amount: 1, restType: "long" },
        },
        {
            name: "Relic Empowerment",
            level: 10,
            description: "Add Cha mod to ally saving throws while in aura.",
        },
        {
            name: "Resonant Beacon",
            level: 14,
            description: "Bonus action reposition relic aura 30 ft.",
        },
        {
            name: "Guardian Convergence",
            level: 18,
            description: "Aura grants resistance to elemental damage.",
        },
    ],
    "Iron Saint": [
        { name: "Runed Armor", level: 3, description: "+1 AC runed sanctified armor." },
        {
            name: "Divine Advantage",
            level: 3,
            description: "Spend 1 Resonance Charge to gain advantage on a saving throw.",
        },
        {
            name: "Psychic Immunity",
            level: 6,
            description: "1 minute immunity to fear & psychic (1/long rest).",
        },
        {
            name: "Sanctified Strikes",
            level: 10,
            description: "+1d4 radiant damage to weapon hits.",
        },
        {
            name: "Iron Resolve",
            level: 14,
            description: "Reduce incoming damage by Cha mod while RC ≥ 1.",
        },
        {
            name: "Saint Ascendant",
            level: 18,
            description: "Advantage on all saves while wearing armor.",
        },
    ],

    // Tweaker Subclasses
    Boilerheart: [
        {
            name: "Bloodied Fury",
            level: 3,
            description: "Below half HP: gain +1 extra attack (once/turn).",
        },
        {
            name: "Explosion Death Throes",
            level: 3,
            description: "At 0 HP emit 10 ft burst (2d6 fire).",
        },
        { name: "Heat Immunity", level: 3, description: "Immune to heat‑caused exhaustion." },
        {
            name: "Furnace Core",
            level: 6,
            description: "+1 fire damage die once per turn while surged.",
        },
        {
            name: "Volcanic Overpressure",
            level: 10,
            description: "Add fire damage when Surge starts.",
        },
        {
            name: "Molten Recovery",
            level: 14,
            description: "Heal 2d6 when ending Surge at ≤ half HP.",
        },
        {
            name: "Cataclysm Vent",
            level: 18,
            description: "20 ft explosion 4d10 fire (1/long rest).",
            usesPerRest: { amount: 1, restType: "long" },
        },
    ],
    Neurospike: [
        { name: "CON to Attack", level: 3, description: "Add CON mod to unarmed attack rolls." },
        {
            name: "Defensive Reflex",
            level: 3,
            description: "Reaction: +2 AC vs one attack (1/round).",
        },
        {
            name: "Hyperfocus",
            level: 6,
            description: "Two bonus actions per turn for 3 rounds (1/long).",
            usesPerRest: { amount: 1, restType: "long" },
        },
        {
            name: "Neural Precision",
            level: 10,
            description: "+2 initiative; improved reaction attack.",
        },
        {
            name: "Cerebral Shield",
            level: 14,
            description: "Add CON mod to AC vs one attack each round.",
        },
        {
            name: "Synaptic Cascade",
            level: 18,
            description: "Treat natural 1 on d20 as 2 while surged.",
        },
    ],

    // Shadehand Subclasses
    Circuitbreaker: [
        {
            name: "Disable Device",
            level: 3,
            description: "Bonus action disable a mod/device within 5 ft (1/turn).",
        },
        {
            name: "Construct Bane",
            level: 3,
            description: "Critical hits vs constructs deal double damage.",
        },
        {
            name: "Trap Expertise",
            level: 6,
            description: "Advantage on DEX saves vs traps & Aether pulses.",
        },
        { name: "Overload Spike", level: 10, description: "Once/short: disable device at 30 ft." },
        {
            name: "Adaptive Scrambler",
            level: 14,
            description: "Resist lightning & thunder; ignore construct resist on Sneak dmg.",
        },
        {
            name: "System Collapse",
            level: 18,
            description: "Action: 20 ft device shutdown field (1/day).",
        },
    ],
    "Mirage Operative": [
        {
            name: "Blur",
            level: 3,
            description: "Cast Blur (1/long rest) via goggles or focus.",
            usesPerRest: { amount: 1, restType: "long" },
        },
        {
            name: "Deception Master",
            level: 3,
            description: "Gain Deception & Sleight of Hand proficiency.",
        },
        { name: "Mirror Image", level: 6, description: "Cast Mirror Image (1/long rest)." },
        {
            name: "Hallucinatory Field",
            level: 10,
            description: "Create 10 ft illusory cover zone.",
        },
        {
            name: "Veiled Persona",
            level: 14,
            description: "Advantage vs Insight checks against you.",
        },
        {
            name: "Perfect Mirage",
            level: 18,
            description: "Remain invisible while attacking (1/long rest).",
            usesPerRest: { amount: 1, restType: "long" },
        },
    ],

    // Vanguard Subclasses
    "Bulwark Sentinel": [
        { name: "Guardian Aura", level: 3, description: "+1 AC to allies within 5 ft." },
        {
            name: "Protective Reaction",
            level: 3,
            description: "Reaction: impose disadvantage on attack vs ally.",
        },
        { name: "Expanded Guard", level: 6, description: "Aura radius increases to 10 ft." },
        {
            name: "Intercept Momentum",
            level: 10,
            description: "Reduce ally damage by PB × 2 (reaction).",
        },
        {
            name: "Shield Web",
            level: 14,
            description: "Extend aura to a visible ally within 30 ft.",
        },
        { name: "Bastion Pivot", level: 18, description: "Bonus action move aura 15 ft." },
    ],
    Shockbreaker: [
        {
            name: "Lightning Strikes",
            level: 3,
            description: "+1d4 lightning damage on melee attacks.",
        },
        {
            name: "Static Burst",
            level: 3,
            description: "15 ft cone 2d8 lightning (1/long rest).",
            usesPerRest: { amount: 1, restType: "long" },
        },
        {
            name: "Storm Resistance",
            level: 6,
            description: "Resistance to lightning & thunder damage.",
        },
        {
            name: "Charged Riposte",
            level: 10,
            description: "Reaction: deal lightning damage = PB.",
        },
        { name: "Supercharge", level: 14, description: "Steam Charge grants +10 ft movement." },
        {
            name: "Tempest Core",
            level: 18,
            description: "Immunity to lightning for 1 min (1/day).",
            usesPerRest: { amount: 1, restType: "long" },
        },
    ],

    // Artifex Subclasses
    Fieldwright: [
        { name: "Quick Repair", level: 3, description: "Repair a mod as a bonus action." },
        {
            name: "Damage Boost",
            level: 3,
            description: "Ally's next attack +1d6 damage if assisted.",
        },
        {
            name: "Tactical Patch",
            level: 6,
            description: "Bonus action repair also grants +PB temp HP.",
        },
        {
            name: "Deploy Turrets",
            level: 10,
            description: "Deploy temporary drone turret (AC 15 HP 15 1d10).",
        },
        { name: "Network Relay", level: 14, description: "Drones share senses within 60 ft." },
        {
            name: "Mass Patch",
            level: 18,
            description: "Affect two mods with a single repair action.",
        },
    ],
    Aetherforger: [
        {
            name: "Weapon Imbue",
            level: 3,
            description: "Imbue weapon (1 minute) spending Aether Dust.",
        },
        { name: "Create Aether Cores", level: 3, description: "Create 3 Aether Cores per day." },
        {
            name: "Feedback Shield",
            level: 6,
            description: "Reduce self‑inflicted arcane backlash damage.",
        },
        {
            name: "Arcane Feedback Immunity",
            level: 10,
            description: "Immune to arcane feedback; +1 core use/day.",
        },
        { name: "Persistent Imbue", level: 14, description: "Weapon imbue lasts 10 minutes." },
        {
            name: "Core Overdrive",
            level: 18,
            description: "Once/day double core effects for 1 minute.",
        },
    ],

    // Mindweaver Paths (features at 1 / 6 / 10 / 14 / 18)
    "Path of the Echo": [
        {
            name: "Resonant Pulse",
            level: 1,
            description: "Pulse psychic energy (scales with level).",
        },
        { name: "Echo Step", level: 1, description: "Short teleport / reposition ability." },
        {
            name: "Resonant Damage Aura",
            level: 6,
            description: "Psychic splash damage = PB to nearby enemies.",
        },
        {
            name: "Frequency Shift",
            level: 10,
            description: "Change a manifested power's damage type.",
        },
        { name: "Echo Overlay", level: 14, description: "Advantage on first attack each round." },
        {
            name: "Harmonic Unity",
            level: 18,
            description: "Chain a 1 AFP power to second target (1/turn).",
        },
    ],
    "Path of Flux": [
        { name: "Entropy Lash", level: 1, description: "Ranged degrading psionic lash power." },
        {
            name: "Aether Drain",
            level: 1,
            description: "Drain Aether from target to self (temp AFP).",
        },
        {
            name: "AFP Recovery",
            level: 6,
            description: "Recover 1 AFP when damaging psionic/magical foe (1/turn).",
        },
        {
            name: "Entropic Surge",
            level: 10,
            description: "+1 damage die on a power once per turn.",
        },
        { name: "Flux Barrier", level: 14, description: "Reaction: reduce damage by AFP spent." },
        {
            name: "Void Well",
            level: 18,
            description: "Create 10 ft difficult terrain entropic zone.",
        },
    ],
    "Path of Eidolon": [
        {
            name: "Spectral Hand",
            level: 1,
            description: "Manifest spectral hand for manipulations.",
        },
        { name: "Soul Anchor", level: 1, description: "Anchor spirit to resist forced movement." },
        {
            name: "Astral Duplicate",
            level: 6,
            description: "Project duplicate (1/short rest, 1 min).",
            usesPerRest: { amount: 1, restType: "short" },
        },
        { name: "Soul Tether", level: 10, description: "Share damage between you and duplicate." },
        {
            name: "Eidolic Fusion",
            level: 14,
            description: "You and duplicate share actions more fluidly.",
        },
        {
            name: "Permanent Anchor",
            level: 18,
            description: "Maintain duplicate indefinitely while stationary.",
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
        // Updated: Arcanist now tracks spell slots instead of AFP as primary resource
        primaryResource: "SpellSlots",
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
        // Assumed full caster progression (standard 5E wizard-equivalent). Spell slot table provided here.
        levelProgression: [
            {
                level: 1,
                proficiencyBonus: 2,
                featuresGranted: [
                    "Aether Spellcasting",
                    "Spell Recharge",
                    "Tinker Savant",
                    "Arcane Focus",
                ],
                spellSlots: { 1: 2 },
            },
            { level: 2, proficiencyBonus: 2, featuresGranted: [], spellSlots: { 1: 3 } },
            { level: 3, proficiencyBonus: 2, featuresGranted: [], spellSlots: { 1: 4, 2: 2 } },
            {
                level: 4,
                proficiencyBonus: 2,
                featuresGranted: [],
                abilityScoreImprovement: true,
                spellSlots: { 1: 4, 2: 3 },
            },
            {
                level: 5,
                proficiencyBonus: 3,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 2 },
            },
            {
                level: 6,
                proficiencyBonus: 3,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3 },
            },
            {
                level: 7,
                proficiencyBonus: 3,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 1 },
            },
            {
                level: 8,
                proficiencyBonus: 3,
                featuresGranted: [],
                abilityScoreImprovement: true,
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 2 },
            },
            {
                level: 9,
                proficiencyBonus: 4,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
            },
            {
                level: 10,
                proficiencyBonus: 4,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
            },
            {
                level: 11,
                proficiencyBonus: 4,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
            },
            {
                level: 12,
                proficiencyBonus: 4,
                featuresGranted: [],
                abilityScoreImprovement: true,
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1 },
            },
            {
                level: 13,
                proficiencyBonus: 5,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
            },
            {
                level: 14,
                proficiencyBonus: 5,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1 },
            },
            {
                level: 15,
                proficiencyBonus: 5,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
            },
            {
                level: 16,
                proficiencyBonus: 5,
                featuresGranted: [],
                abilityScoreImprovement: true,
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1 },
            },
            {
                level: 17,
                proficiencyBonus: 6,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2, 6: 1, 7: 1, 8: 1, 9: 1 },
            },
            {
                level: 18,
                proficiencyBonus: 6,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 1, 7: 1, 8: 1, 9: 1 },
            },
            {
                level: 19,
                proficiencyBonus: 6,
                featuresGranted: [],
                abilityScoreImprovement: true,
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 1, 8: 1, 9: 1 },
            },
            {
                level: 20,
                proficiencyBonus: 6,
                featuresGranted: [],
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 3, 6: 2, 7: 2, 8: 1, 9: 1 },
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
        // Assumed half-caster progression similar to Paladin; includes Resonance charge formula
        levelProgression: [
            {
                level: 1,
                proficiencyBonus: 2,
                featuresGranted: [
                    "Resonant Smite",
                    "Faith Engine",
                    "Steamshield Mod",
                    "Sacred Repair",
                ],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 2 },
            },
            {
                level: 2,
                proficiencyBonus: 2,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 2 },
            },
            {
                level: 3,
                proficiencyBonus: 2,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 3 },
            },
            {
                level: 4,
                proficiencyBonus: 2,
                featuresGranted: [],
                abilityScoreImprovement: true,
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 3 },
            },
            {
                level: 5,
                proficiencyBonus: 3,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 2 },
            },
            {
                level: 6,
                proficiencyBonus: 3,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 2 },
            },
            {
                level: 7,
                proficiencyBonus: 3,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3 },
            },
            {
                level: 8,
                proficiencyBonus: 3,
                featuresGranted: [],
                abilityScoreImprovement: true,
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3 },
            },
            {
                level: 9,
                proficiencyBonus: 4,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 2 },
            },
            {
                level: 10,
                proficiencyBonus: 4,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 2 },
            },
            {
                level: 11,
                proficiencyBonus: 4,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3 },
            },
            {
                level: 12,
                proficiencyBonus: 4,
                featuresGranted: [],
                abilityScoreImprovement: true,
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3 },
            },
            {
                level: 13,
                proficiencyBonus: 5,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 1 },
            },
            {
                level: 14,
                proficiencyBonus: 5,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 1 },
            },
            {
                level: 15,
                proficiencyBonus: 5,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 2 },
            },
            {
                level: 16,
                proficiencyBonus: 5,
                featuresGranted: [],
                abilityScoreImprovement: true,
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 2 },
            },
            {
                level: 17,
                proficiencyBonus: 6,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
            },
            {
                level: 18,
                proficiencyBonus: 6,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 1 },
            },
            {
                level: 19,
                proficiencyBonus: 6,
                featuresGranted: [],
                abilityScoreImprovement: true,
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
            },
            {
                level: 20,
                proficiencyBonus: 6,
                featuresGranted: [],
                resonanceChargesFormula: "level + Cha mod",
                spellSlots: { 1: 4, 2: 3, 3: 3, 4: 3, 5: 2 },
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
        // Adrenal Surge scaling assumed; ASI levels standard
        levelProgression: [
            {
                level: 1,
                proficiencyBonus: 2,
                featuresGranted: [
                    "Adrenal Surge",
                    "Overdrive",
                    "Steam Vent Harness",
                    "Enhanced Metabolism",
                ],
                adrenalSurges: 1,
            },
            { level: 2, proficiencyBonus: 2, featuresGranted: [], adrenalSurges: 1 },
            { level: 3, proficiencyBonus: 2, featuresGranted: [], adrenalSurges: 2 },
            {
                level: 4,
                proficiencyBonus: 2,
                featuresGranted: [],
                abilityScoreImprovement: true,
                adrenalSurges: 2,
            },
            { level: 5, proficiencyBonus: 3, featuresGranted: [], adrenalSurges: 2 },
            { level: 6, proficiencyBonus: 3, featuresGranted: [], adrenalSurges: 3 },
            { level: 7, proficiencyBonus: 3, featuresGranted: [], adrenalSurges: 3 },
            {
                level: 8,
                proficiencyBonus: 3,
                featuresGranted: [],
                abilityScoreImprovement: true,
                adrenalSurges: 3,
            },
            { level: 9, proficiencyBonus: 4, featuresGranted: [], adrenalSurges: 3 },
            { level: 10, proficiencyBonus: 4, featuresGranted: [], adrenalSurges: 4 },
            { level: 11, proficiencyBonus: 4, featuresGranted: [], adrenalSurges: 4 },
            {
                level: 12,
                proficiencyBonus: 4,
                featuresGranted: [],
                abilityScoreImprovement: true,
                adrenalSurges: 4,
            },
            { level: 13, proficiencyBonus: 5, featuresGranted: [], adrenalSurges: 4 },
            { level: 14, proficiencyBonus: 5, featuresGranted: [], adrenalSurges: 5 },
            { level: 15, proficiencyBonus: 5, featuresGranted: [], adrenalSurges: 5 },
            {
                level: 16,
                proficiencyBonus: 5,
                featuresGranted: [],
                abilityScoreImprovement: true,
                adrenalSurges: 5,
            },
            { level: 17, proficiencyBonus: 6, featuresGranted: [], adrenalSurges: 5 },
            { level: 18, proficiencyBonus: 6, featuresGranted: [], adrenalSurges: 6 },
            {
                level: 19,
                proficiencyBonus: 6,
                featuresGranted: [],
                abilityScoreImprovement: true,
                adrenalSurges: 6,
            },
            { level: 20, proficiencyBonus: 6, featuresGranted: [], adrenalSurges: 6 },
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
        // Sneak Attack scaling implicitly tracked via featuresGranted notes; could be expanded later
        levelProgression: [
            {
                level: 1,
                proficiencyBonus: 2,
                featuresGranted: ["Sneak Attack", "Ghoststep Cloak", "Silent Tools"],
                notes: "Sneak Attack 1d6",
            },
            { level: 2, proficiencyBonus: 2, featuresGranted: [], notes: "Sneak Attack 1d6" },
            { level: 3, proficiencyBonus: 2, featuresGranted: [], notes: "Sneak Attack 2d6" },
            {
                level: 4,
                proficiencyBonus: 2,
                featuresGranted: [],
                abilityScoreImprovement: true,
                notes: "Sneak Attack 2d6",
            },
            { level: 5, proficiencyBonus: 3, featuresGranted: [], notes: "Sneak Attack 3d6" },
            { level: 6, proficiencyBonus: 3, featuresGranted: [], notes: "Sneak Attack 3d6" },
            { level: 7, proficiencyBonus: 3, featuresGranted: [], notes: "Sneak Attack 4d6" },
            {
                level: 8,
                proficiencyBonus: 3,
                featuresGranted: [],
                abilityScoreImprovement: true,
                notes: "Sneak Attack 4d6",
            },
            { level: 9, proficiencyBonus: 4, featuresGranted: [], notes: "Sneak Attack 5d6" },
            { level: 10, proficiencyBonus: 4, featuresGranted: [], notes: "Sneak Attack 5d6" },
            { level: 11, proficiencyBonus: 4, featuresGranted: [], notes: "Sneak Attack 6d6" },
            {
                level: 12,
                proficiencyBonus: 4,
                featuresGranted: [],
                abilityScoreImprovement: true,
                notes: "Sneak Attack 6d6",
            },
            { level: 13, proficiencyBonus: 5, featuresGranted: [], notes: "Sneak Attack 7d6" },
            { level: 14, proficiencyBonus: 5, featuresGranted: [], notes: "Sneak Attack 7d6" },
            { level: 15, proficiencyBonus: 5, featuresGranted: [], notes: "Sneak Attack 8d6" },
            {
                level: 16,
                proficiencyBonus: 5,
                featuresGranted: [],
                abilityScoreImprovement: true,
                notes: "Sneak Attack 8d6",
            },
            { level: 17, proficiencyBonus: 6, featuresGranted: [], notes: "Sneak Attack 9d6" },
            { level: 18, proficiencyBonus: 6, featuresGranted: [], notes: "Sneak Attack 9d6" },
            {
                level: 19,
                proficiencyBonus: 6,
                featuresGranted: [],
                abilityScoreImprovement: true,
                notes: "Sneak Attack 10d6",
            },
            { level: 20, proficiencyBonus: 6, featuresGranted: [], notes: "Sneak Attack 10d6" },
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
        levelProgression: [
            {
                level: 1,
                proficiencyBonus: 2,
                featuresGranted: [
                    "Defensive Stance",
                    "Steam Charge",
                    "Reinforced Frame",
                    "Gear Mod Slot",
                ],
            },
            { level: 2, proficiencyBonus: 2, featuresGranted: [] },
            { level: 3, proficiencyBonus: 2, featuresGranted: [] },
            { level: 4, proficiencyBonus: 2, featuresGranted: [], abilityScoreImprovement: true },
            { level: 5, proficiencyBonus: 3, featuresGranted: [] },
            { level: 6, proficiencyBonus: 3, featuresGranted: [] },
            { level: 7, proficiencyBonus: 3, featuresGranted: [] },
            { level: 8, proficiencyBonus: 3, featuresGranted: [], abilityScoreImprovement: true },
            { level: 9, proficiencyBonus: 4, featuresGranted: [] },
            { level: 10, proficiencyBonus: 4, featuresGranted: [] },
            { level: 11, proficiencyBonus: 4, featuresGranted: [] },
            { level: 12, proficiencyBonus: 4, featuresGranted: [], abilityScoreImprovement: true },
            { level: 13, proficiencyBonus: 5, featuresGranted: [] },
            { level: 14, proficiencyBonus: 5, featuresGranted: [] },
            { level: 15, proficiencyBonus: 5, featuresGranted: [] },
            { level: 16, proficiencyBonus: 5, featuresGranted: [], abilityScoreImprovement: true },
            { level: 17, proficiencyBonus: 6, featuresGranted: [] },
            { level: 18, proficiencyBonus: 6, featuresGranted: [] },
            { level: 19, proficiencyBonus: 6, featuresGranted: [], abilityScoreImprovement: true },
            { level: 20, proficiencyBonus: 6, featuresGranted: [] },
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
        levelProgression: [
            {
                level: 1,
                proficiencyBonus: 2,
                featuresGranted: [
                    "Tinker's Expertise",
                    "Deploy Drone",
                    "Repair Pulse",
                    "Overclock",
                ],
                droneCapacity: 1,
                repairPulseDie: "1d8",
            },
            {
                level: 2,
                proficiencyBonus: 2,
                featuresGranted: [],
                droneCapacity: 1,
                repairPulseDie: "1d8",
            },
            {
                level: 3,
                proficiencyBonus: 2,
                featuresGranted: [],
                droneCapacity: 1,
                repairPulseDie: "1d8",
            },
            {
                level: 4,
                proficiencyBonus: 2,
                featuresGranted: [],
                abilityScoreImprovement: true,
                droneCapacity: 1,
                repairPulseDie: "1d8",
            },
            {
                level: 5,
                proficiencyBonus: 3,
                featuresGranted: [],
                droneCapacity: 2,
                repairPulseDie: "1d10",
            },
            {
                level: 6,
                proficiencyBonus: 3,
                featuresGranted: [],
                droneCapacity: 2,
                repairPulseDie: "1d10",
            },
            {
                level: 7,
                proficiencyBonus: 3,
                featuresGranted: [],
                droneCapacity: 2,
                repairPulseDie: "1d10",
            },
            {
                level: 8,
                proficiencyBonus: 3,
                featuresGranted: [],
                abilityScoreImprovement: true,
                droneCapacity: 2,
                repairPulseDie: "1d10",
            },
            {
                level: 9,
                proficiencyBonus: 4,
                featuresGranted: [],
                droneCapacity: 3,
                repairPulseDie: "2d6",
            },
            {
                level: 10,
                proficiencyBonus: 4,
                featuresGranted: [],
                droneCapacity: 3,
                repairPulseDie: "2d6",
            },
            {
                level: 11,
                proficiencyBonus: 4,
                featuresGranted: [],
                droneCapacity: 3,
                repairPulseDie: "2d6",
            },
            {
                level: 12,
                proficiencyBonus: 4,
                featuresGranted: [],
                abilityScoreImprovement: true,
                droneCapacity: 3,
                repairPulseDie: "2d6",
            },
            {
                level: 13,
                proficiencyBonus: 5,
                featuresGranted: [],
                droneCapacity: 4,
                repairPulseDie: "2d8",
            },
            {
                level: 14,
                proficiencyBonus: 5,
                featuresGranted: [],
                droneCapacity: 4,
                repairPulseDie: "2d8",
            },
            {
                level: 15,
                proficiencyBonus: 5,
                featuresGranted: [],
                droneCapacity: 4,
                repairPulseDie: "2d8",
            },
            {
                level: 16,
                proficiencyBonus: 5,
                featuresGranted: [],
                abilityScoreImprovement: true,
                droneCapacity: 4,
                repairPulseDie: "2d8",
            },
            {
                level: 17,
                proficiencyBonus: 6,
                featuresGranted: [],
                droneCapacity: 5,
                repairPulseDie: "3d8",
            },
            {
                level: 18,
                proficiencyBonus: 6,
                featuresGranted: [],
                droneCapacity: 5,
                repairPulseDie: "3d8",
            },
            {
                level: 19,
                proficiencyBonus: 6,
                featuresGranted: [],
                abilityScoreImprovement: true,
                droneCapacity: 5,
                repairPulseDie: "3d8",
            },
            {
                level: 20,
                proficiencyBonus: 6,
                featuresGranted: [],
                droneCapacity: 5,
                repairPulseDie: "3d8",
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
        levelProgression: [
            {
                level: 1,
                proficiencyBonus: 2,
                featuresGranted: [
                    "Aether Flux Pool",
                    "Telepathic Whispers",
                    "Psionic Awareness",
                    "Focus Limit",
                ],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 1,
            },
            {
                level: 2,
                proficiencyBonus: 2,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 1,
            },
            {
                level: 3,
                proficiencyBonus: 2,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 1,
            },
            {
                level: 4,
                proficiencyBonus: 2,
                featuresGranted: [],
                abilityScoreImprovement: true,
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 1,
            },
            {
                level: 5,
                proficiencyBonus: 3,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 2,
            },
            {
                level: 6,
                proficiencyBonus: 3,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 2,
            },
            {
                level: 7,
                proficiencyBonus: 3,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 2,
            },
            {
                level: 8,
                proficiencyBonus: 3,
                featuresGranted: [],
                abilityScoreImprovement: true,
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 2,
            },
            {
                level: 9,
                proficiencyBonus: 4,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 3,
            },
            {
                level: 10,
                proficiencyBonus: 4,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 3,
            },
            {
                level: 11,
                proficiencyBonus: 4,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 3,
            },
            {
                level: 12,
                proficiencyBonus: 4,
                featuresGranted: [],
                abilityScoreImprovement: true,
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 3,
            },
            {
                level: 13,
                proficiencyBonus: 5,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 4,
            },
            {
                level: 14,
                proficiencyBonus: 5,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 4,
            },
            {
                level: 15,
                proficiencyBonus: 5,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 4,
            },
            {
                level: 16,
                proficiencyBonus: 5,
                featuresGranted: [],
                abilityScoreImprovement: true,
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 4,
            },
            {
                level: 17,
                proficiencyBonus: 6,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 5,
            },
            {
                level: 18,
                proficiencyBonus: 6,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 5,
            },
            {
                level: 19,
                proficiencyBonus: 6,
                featuresGranted: [],
                abilityScoreImprovement: true,
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 5,
            },
            {
                level: 20,
                proficiencyBonus: 6,
                featuresGranted: [],
                aetherFluxPointsFormula: "level + abilityMod",
                focusLimit: 5,
            },
        ],
    },
];
