import type { Species } from "../types";

export const SPECIES: Species[] = [
    // ============================================================================
    // AQUALOTH (Axolotl)
    // ============================================================================
    {
        type: "Aqualoth",
        abilityScoreIncrease: {
            intelligence: 2,
            wisdom: 1,
        },
        speed: 30,
        swimSpeed: 30,
        traits: [
            {
                name: "Amphibious",
                description: "You can breathe both air and water.",
            },
            {
                name: "Hydrostatic Memory",
                description:
                    "You have advantage on History checks involving ruins or ancient machinery.",
            },
            {
                name: "Aether Conduction",
                description:
                    "Once per short rest, when you take psychic or lightning damage, reduce it by your proficiency bonus.",
                usesPerRest: {
                    amount: 1,
                    restType: "short",
                },
            },
            {
                name: "Aether Sensitivity",
                description:
                    "You can sense active psionic effects or Aether machinery within 30 ft (no precise location).",
            },
            {
                name: "Machine Empathy",
                description: "Constructs and automatons regard you as neutral unless provoked.",
            },
            {
                name: "Instinctive Harmony",
                description:
                    "Once per long rest, reroll a failed saving throw against exhaustion, poison, or psionic feedback.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
        ],
        languages: ["Common Geartrade", "Aquan"],
    },

    // ============================================================================
    // VULMIR (Fox)
    // ============================================================================
    {
        type: "Vulmir",
        abilityScoreIncrease: {
            dexterity: 2,
            charisma: 1,
        },
        speed: 35,
        traits: [
            {
                name: "Cunning Reflexes",
                description:
                    "You can take the Disengage or Hide action as a bonus action once per short rest.",
                usesPerRest: {
                    amount: 1,
                    restType: "short",
                },
            },
            {
                name: "Echo Mimicry",
                description:
                    "You can reproduce any sound or voice you've heard for up to 6 seconds (Deception check contested by Insight).",
            },
            {
                name: "Shadow Step",
                description:
                    "When you move from dim light to dim light, you can teleport up to 10 ft (once per long rest).",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
            {
                name: "Aether Sensitivity",
                description:
                    "You can sense active psionic effects or Aether machinery within 30 ft (no precise location).",
            },
            {
                name: "Machine Empathy",
                description: "Constructs and automatons regard you as neutral unless provoked.",
            },
            {
                name: "Instinctive Harmony",
                description:
                    "Once per long rest, reroll a failed saving throw against exhaustion, poison, or psionic feedback.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
        ],
        languages: ["Common Geartrade", "Undertrade"],
    },

    // ============================================================================
    // RENDAI (Red Panda)
    // ============================================================================
    {
        type: "Rendai",
        abilityScoreIncrease: {
            intelligence: 2,
            dexterity: 1,
        },
        speed: 30,
        traits: [
            {
                name: "Tinker's Instinct",
                description:
                    "You gain proficiency with Tinker's Tools. If already proficient, double your proficiency bonus.",
            },
            {
                name: "Jury-Rig",
                description:
                    "Once per short rest, repair or improvise an item to restore 1d8 HP to a construct or mechanical device.",
                usesPerRest: {
                    amount: 1,
                    restType: "short",
                },
            },
            {
                name: "Overclocker",
                description:
                    "When you roll a 1 on a weapon damage die for a modded weapon, you may reroll once.",
            },
            {
                name: "Aether Sensitivity",
                description:
                    "You can sense active psionic effects or Aether machinery within 30 ft (no precise location).",
            },
            {
                name: "Machine Empathy",
                description: "Constructs and automatons regard you as neutral unless provoked.",
            },
            {
                name: "Instinctive Harmony",
                description:
                    "Once per long rest, reroll a failed saving throw against exhaustion, poison, or psionic feedback.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
        ],
        languages: ["Common Geartrade", "Guilder's Cant"],
    },

    // ============================================================================
    // KARNATHI (Ibex)
    // ============================================================================
    {
        type: "Karnathi",
        abilityScoreIncrease: {
            strength: 2,
            wisdom: 1,
        },
        speed: 30,
        traits: [
            {
                name: "Iron Resolve",
                description: "Advantage on saving throws against being frightened or charmed.",
            },
            {
                name: "Psionic Resonance",
                description:
                    "Once per long rest, add +1d4 to any saving throw or attack roll after seeing the result.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
            {
                name: "Climber's Gait",
                description:
                    "You can climb difficult surfaces, including vertical stone, without a check up to 20 ft.",
            },
            {
                name: "Aether Sensitivity",
                description:
                    "You can sense active psionic effects or Aether machinery within 30 ft (no precise location).",
            },
            {
                name: "Machine Empathy",
                description: "Constructs and automatons regard you as neutral unless provoked.",
            },
            {
                name: "Instinctive Harmony",
                description:
                    "Once per long rest, reroll a failed saving throw against exhaustion, poison, or psionic feedback.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
        ],
        languages: ["Common Geartrade", "Old Tongue"],
    },

    // ============================================================================
    // THARN (Elk)
    // ============================================================================
    {
        type: "Tharn",
        abilityScoreIncrease: {
            constitution: 2,
            strength: 1,
        },
        speed: 35,
        traits: [
            {
                name: "Charge",
                description:
                    "If you move at least 20 ft straight toward a creature before hitting with a melee attack, add +1d6 damage.",
            },
            {
                name: "Aether-Linked",
                description:
                    "Once per long rest, when you drop to 0 HP, you instead drop to 1 HP and emit a psionic pulse (5-ft radius, push 10 ft).",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
            {
                name: "Nature's Kin",
                description:
                    "You have advantage on Survival checks to track, forage, or navigate in wilderness or ruin.",
            },
            {
                name: "Aether Sensitivity",
                description:
                    "You can sense active psionic effects or Aether machinery within 30 ft (no precise location).",
            },
            {
                name: "Machine Empathy",
                description: "Constructs and automatons regard you as neutral unless provoked.",
            },
            {
                name: "Instinctive Harmony",
                description:
                    "Once per long rest, reroll a failed saving throw against exhaustion, poison, or psionic feedback.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
        ],
        languages: ["Common Geartrade", "Sylvan"],
    },

    // ============================================================================
    // SKELLIN (Gecko)
    // ============================================================================
    {
        type: "Skellin",
        abilityScoreIncrease: {
            dexterity: 2,
            intelligence: 1,
        },
        speed: 30,
        climbSpeed: 20,
        traits: [
            {
                name: "Wall Skitter",
                description: "You can climb vertical surfaces without a check.",
            },
            {
                name: "Adaptive Camouflage",
                description:
                    "As a bonus action, blend with surroundings to gain advantage on Stealth checks until you move.",
            },
            {
                name: "Sticky Grip",
                description:
                    "Advantage on checks or saves to avoid being disarmed or knocked prone.",
            },
            {
                name: "Aether Sensitivity",
                description:
                    "You can sense active psionic effects or Aether machinery within 30 ft (no precise location).",
            },
            {
                name: "Machine Empathy",
                description: "Constructs and automatons regard you as neutral unless provoked.",
            },
            {
                name: "Instinctive Harmony",
                description:
                    "Once per long rest, reroll a failed saving throw against exhaustion, poison, or psionic feedback.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
        ],
        languages: ["Common Geartrade", "Undertrade"],
    },

    // ============================================================================
    // AVENAR (Avian)
    // ============================================================================
    {
        type: "Avenar",
        abilityScoreIncrease: {
            intelligence: 2,
            wisdom: 1,
        },
        speed: 30,
        traits: [
            {
                name: "Flight",
                description:
                    "You have a flying speed of 25 ft. You cannot fly while wearing medium or heavy armor.",
            },
            {
                name: "Aether Recall",
                description:
                    "You can perfectly recall any text, sound, or symbol you've encountered within the last week.",
            },
            {
                name: "Resonant Logic",
                description:
                    "Once per short rest, when you fail an Intelligence or Wisdom check, you may reroll it. You must use the new result.",
                usesPerRest: {
                    amount: 1,
                    restType: "short",
                },
            },
            {
                name: "Mimetic Insight",
                description:
                    "As a bonus action, you can analyze a creature or device within 30 ft. You learn one of the following (your choice): its AC, HP range (low/medium/high), or whether it has psionic capacity.",
            },
            {
                name: "Featherlight Descent",
                description:
                    "You can fall up to 60 feet without taking damage, and you always land on your feet.",
            },
            {
                name: "Aether Sensitivity",
                description:
                    "You can sense active psionic effects or Aether machinery within 30 ft (no precise location).",
            },
            {
                name: "Machine Empathy",
                description: "Constructs and automatons regard you as neutral unless provoked.",
            },
            {
                name: "Instinctive Harmony",
                description:
                    "Once per long rest, reroll a failed saving throw against exhaustion, poison, or psionic feedback.",
                usesPerRest: {
                    amount: 1,
                    restType: "long",
                },
            },
        ],
        languages: ["Common Geartrade", "Skycant"],
    },
];
