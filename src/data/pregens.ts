import type { Character, InventoryItem, Equipment } from "../types";
import {
    CLASSES,
    BASIC_EQUIPMENT,
    WEAPONS,
    ARMOR,
    ARCANE_ITEMS,
    SHIELDS,
    FORMULAE,
    MINDCRAFT_POWERS,
    MIRACLES,
} from ".";

// Helper function to create an InventoryItem from Equipment
function createInventoryItem(equipment: Equipment, equipped: boolean = false): InventoryItem {
    return {
        id: `${equipment.id}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID for inventory item
        equipmentId: equipment.id,
        mods: [],
        equipped,
    };
}

export const PREGENS: Character[] = [
    // ========================================================================
    // Lyrra Quenchcoil — Rendai Artifex (Engineer)
    // ========================================================================
    {
        avatarUrl: "/avatars/lyrra-quenchcoil.png",
        id: "lyrra-quenchcoil-pregen-001",
        name: "Lyrra Quenchcoil",
        species: "Rendai",
        classes: [
            {
                level: 1,
                class: "Artifex",
                subclass: "Fieldwright",
            },
        ],
        level: 1,
        abilityScores: {
            strength: 10,
            dexterity: 13,
            constitution: 12,
            intelligence: 16,
            wisdom: 11,
            charisma: 14,
        },
        hitPoints: {
            current: 8,
            maximum: 8,
            temporary: 0,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        inventory: [
            createInventoryItem(WEAPONS.find((w) => w.name === "Rivetgun")!),
            createInventoryItem(WEAPONS.find((w) => w.name === "Cogwrench")!),
            createInventoryItem(BASIC_EQUIPMENT.find((e) => e.name === "Tinker's Tools")!),
            createInventoryItem(ARCANE_ITEMS.find((e) => e.name === "Aether Cell")!),
            createInventoryItem(ARCANE_ITEMS.find((e) => e.name === "Aether Cell")!),
            createInventoryItem(ARCANE_ITEMS.find((e) => e.name === "Steam Vent Harness")!),
            createInventoryItem(ARMOR.find((a) => a.name === "Steamweave Vest")!, true),
        ],
        currency: {
            cogs: 50,
            gears: 0,
            cores: 0,
        },
        spells: [],
        mindcraftPowers: [],
        armorClass: 13,
        initiative: 1,
        speed: 30,
        languages: ["Common Geartrade", "Guild Cant"],
        heatStressLevel: 0,
        exhaustionLevel: 0,
        conditions: [],
        background: "Guild Mechanist",
        traits: ["If it rattles, I fix it. If it screams, I patent it."],
        ideals: ["Innovation and progress above all"],
        bonds: ["Loyal to my guild and fellow mechanists"],
        flaws: ["Can't resist tinkering with things that work fine"],
    },

    // ========================================================================
    // Karn Voss — Karnathi Templar (Relic Knight)
    // ========================================================================
    {
        id: "karn-voss-pregen-002",
        avatarUrl: "/avatars/karn-voss.png",
        name: "Karn Voss",
        species: "Karnathi",
        classes: [
            {
                level: 1,
                class: "Templar",
                subclass: "Relic Knight",
            },
        ],
        level: 1,
        abilityScores: {
            strength: 15,
            dexterity: 10,
            constitution: 14,
            intelligence: 10,
            wisdom: 13,
            charisma: 14,
        },
        hitPoints: {
            current: 11,
            maximum: 11,
            temporary: 0,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        inventory: [
            createInventoryItem(WEAPONS.find((w) => w.name === "Aether Spear")!),
            createInventoryItem(ARMOR.find((a) => a.name === "Gearmail Hauberk")!, true),
            createInventoryItem(SHIELDS.find((s) => s.name === "Standard Shield")!, true),
        ],
        currency: {
            cogs: 30,
            gears: 0,
            cores: 0,
        },
        spells: [
            MIRACLES.find((s) => s.name === "Cure Wounds")!,
            MIRACLES.find((s) => s.name === "Bless")!,
            MIRACLES.find((s) => s.name === "Sanctuary")!,
        ],
        resonanceCharges: {
            current: 2,
            maximum: 2, // Level 1 + Wis mod (+1)
            rechargeRate: {
                shortRest: 1,
                longRest: 2,
            },
        },
        mindcraftPowers: [],
        armorClass: 18, // 15 (armor) + 2 (shield) + 1 (Karnathi trait)
        initiative: 0,
        speed: 30,
        languages: ["Common Geartrade", "Old Tongue"],
        heatStressLevel: 0,
        exhaustionLevel: 0,
        conditions: [],
        background: "Pilgrim of the Resonant Orders",
        traits: ["My faith hums with purpose. My armor sings the truth."],
        ideals: ["Order and duty must be maintained"],
        bonds: ["Sworn to protect the innocent and uphold the faith"],
        flaws: ["Rigid in my beliefs, struggles with moral ambiguity"],
    },

    // ========================================================================
    // Rick Vaul — Tharn Vanguard (Bulwark Sentinel)
    // ========================================================================
    {
        id: "rick-vaul-pregen-003",
        avatarUrl: "/avatars/rick-vaul.png",
        name: "Rick Vaul",
        species: "Tharn",
        classes: [
            {
                level: 1,
                class: "Vanguard",
                subclass: "Bulwark Sentinel",
            },
        ],
        level: 1,
        abilityScores: {
            strength: 16,
            dexterity: 12,
            constitution: 14,
            intelligence: 10,
            wisdom: 10,
            charisma: 8,
        },
        hitPoints: {
            current: 12,
            maximum: 12,
            temporary: 0,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        inventory: [
            createInventoryItem(WEAPONS.find((w) => w.name === "Steam Hammer")!),
            createInventoryItem(WEAPONS.find((w) => w.name === "Aether Spear")!),
            createInventoryItem(ARMOR.find((a) => a.name === "Gearmail Hauberk")!, true),
        ],
        currency: {
            cogs: 40,
            gears: 0,
            cores: 0,
        },
        spells: [],
        mindcraftPowers: [],
        armorClass: 16, // 15 (armor) + 1 (Tharn trait)
        initiative: 1,
        speed: 30,
        languages: ["Common Geartrade", "Undertrade"],
        heatStressLevel: 0,
        exhaustionLevel: 0,
        conditions: [],
        background: "Gear Legionnaire",
        traits: ["You hold the line until the line holds you."],
        ideals: ["Duty and protection above personal glory"],
        bonds: ["My squad is my family"],
        flaws: ["Stubborn and unwilling to retreat"],
    },

    // ========================================================================
    // Velka — Skellin Shadehand (Circuitbreaker)
    // ========================================================================
    {
        id: "velka-pregen-004",
        avatarUrl: "/avatars/velka.png",
        name: "Velka",
        species: "Skellin",
        classes: [
            {
                level: 1,
                class: "Shadehand",
                subclass: "Circuitbreaker",
            },
        ],
        level: 1,
        abilityScores: {
            strength: 10,
            dexterity: 17,
            constitution: 12,
            intelligence: 13,
            wisdom: 10,
            charisma: 11,
        },
        hitPoints: {
            current: 8,
            maximum: 8,
            temporary: 0,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        inventory: [
            createInventoryItem(WEAPONS.find((w) => w.name === "Brass Dagger")!),
            createInventoryItem(WEAPONS.find((w) => w.name === "Steam Slingshot")!),
            createInventoryItem(BASIC_EQUIPMENT.find((e) => e.name === "Mechanist's Satchel")!),
            createInventoryItem(ARMOR.find((a) => a.name === "Wireweave Jacket")!, true),
        ],
        currency: {
            cogs: 60,
            gears: 0,
            cores: 0,
        },
        spells: [],
        mindcraftPowers: [],
        armorClass: 14,
        initiative: 3,
        speed: 30,
        languages: ["Common Geartrade", "Undertrade", "Rustspeech"],
        heatStressLevel: 0,
        exhaustionLevel: 0,
        conditions: [],
        background: "Undercity Operative",
        traits: ["If they can't see you, they can't invoice you."],
        ideals: ["Freedom and independence at any cost"],
        bonds: ["Owes a debt to the Undercity guilds"],
        flaws: ["Kleptomaniac tendencies, can't resist a shiny mod"],
    },

    // ========================================================================
    // Ixoth — Aqualoth Mindweaver (Path of Flux)
    // ========================================================================
    {
        id: "ixoth-pregen-005",
        avatarUrl: "/avatars/ixoth.png",
        name: "Ixoth",
        species: "Aqualoth",
        classes: [
            {
                level: 1,
                class: "Mindweaver",
                subclass: "Path of Flux",
            },
        ],
        level: 1,
        abilityScores: {
            strength: 8,
            dexterity: 12,
            constitution: 13,
            intelligence: 16,
            wisdom: 14,
            charisma: 10,
        },
        hitPoints: {
            current: 7,
            maximum: 7,
            temporary: 0,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        inventory: [createInventoryItem(ARMOR.find((a) => a.name === "Aetherweave Coat")!, true)],
        currency: {
            cogs: 25,
            gears: 0,
            cores: 0,
        },
        spells: [],
        aetherFluxPoints: {
            current: 4,
            maximum: 4, // Level 1 + Int mod (+3)
            rechargeRate: {
                shortRest: 2,
                longRest: 4,
            },
        },
        mindcraftPowers: [
            MINDCRAFT_POWERS.find((p) => p.name === "Entropy Lash")!,
            MINDCRAFT_POWERS.find((p) => p.name === "Aether Push")!,
            MINDCRAFT_POWERS.find((p) => p.name === "Empathic Link")!,
        ],
        armorClass: 12,
        initiative: 1,
        speed: 30,
        languages: ["Common Geartrade", "Aquan", "Aetheric"],
        heatStressLevel: 0,
        exhaustionLevel: 0,
        conditions: [],
        background: "Psionic Apprentice",
        traits: ["The mind is its own weapon — and I sharpen mine daily."],
        ideals: ["Knowledge and understanding lead to power"],
        bonds: ["Seeking to master all psionic disciplines"],
        flaws: ["Overconfident in mental abilities"],
    },

    // ========================================================================
    // Selenn Vire — Avenar Arcanist (Aethermancer)
    // ========================================================================
    {
        id: "selenn-vire-pregen-006",
        avatarUrl: "/avatars/selenn-vire.png",
        name: "Selenn Vire",
        species: "Avenar",
        classes: [
            {
                level: 1,
                class: "Arcanist",
                subclass: "Aethermancer",
            },
        ],
        level: 1,
        abilityScores: {
            strength: 9,
            dexterity: 13,
            constitution: 12,
            intelligence: 17,
            wisdom: 14,
            charisma: 10,
        },
        hitPoints: {
            current: 6,
            maximum: 6,
            temporary: 0,
        },
        heatPoints: {
            current: 7,
            maximum: 10,
        },
        inventory: [
            createInventoryItem(BASIC_EQUIPMENT.find((e) => e.name === "Mechanist's Satchel")!),
            createInventoryItem(ARCANE_ITEMS.find((e) => e.name === "Aether Lamp")!),
        ],
        currency: {
            cogs: 35,
            gears: 0,
            cores: 0,
        },
        spells: [
            FORMULAE.find((s) => s.name === "Magic Missile")!,
            FORMULAE.find((s) => s.name === "Shield")!,
            FORMULAE.find((s) => s.name === "Burning Hands")!,
        ],
        aetherFluxPoints: {
            current: 4,
            maximum: 4, // Level 1 + Int mod (+3)
            rechargeRate: {
                shortRest: 2,
                longRest: 4,
            },
        },
        mindcraftPowers: [
            MINDCRAFT_POWERS.find((p) => p.name === "Resonant Pulse")!,
            MINDCRAFT_POWERS.find((p) => p.name === "Echo Step")!,
            MINDCRAFT_POWERS.find((p) => p.name === "Veil Touch")!,
        ],
        armorClass: 12, // 11 + Dex mod (+1)
        initiative: 1,
        speed: 30,
        languages: ["Common Geartrade", "Skycant", "Old Tongue"],
        heatStressLevel: 0,
        exhaustionLevel: 0,
        conditions: [],
        background: "Archivist of the Skyforge",
        traits: ["Every question is a shape; I just find the right angle to see the answer."],
        ideals: ["Knowledge should be preserved and shared"],
        bonds: ["Guardian of ancient Aetheric texts"],
        flaws: ["Obsessive about cataloging and categorizing"],
    },

    // ========================================================================
    // Rhul Greypike — Tharn Tweaker (Boilerheart)
    // ========================================================================
    {
        id: "rhul-greypike-pregen-007",
        name: "Rhul Greypike",
        species: "Tharn",
        classes: [
            {
                level: 1,
                class: "Tweaker",
                subclass: "Boilerheart",
            },
        ],
        level: 1,
        abilityScores: {
            strength: 16,
            dexterity: 13,
            constitution: 15,
            intelligence: 10,
            wisdom: 9,
            charisma: 8,
        },
        hitPoints: {
            current: 14,
            maximum: 14,
            temporary: 0,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        inventory: [
            createInventoryItem(WEAPONS.find((w) => w.name === "Cogwrench")!),
            createInventoryItem(ARCANE_ITEMS.find((e) => e.name === "Steam Vent Harness")!),
            createInventoryItem(ARMOR.find((a) => a.name === "Steamweave Vest")!, true),
        ],
        currency: {
            cogs: 20,
            gears: 0,
            cores: 0,
        },
        spells: [],
        mindcraftPowers: [],
        armorClass: 13, // 11 + Dex mod (+1) + Tharn trait (+1)
        initiative: 1,
        speed: 30,
        languages: ["Common Geartrade", "Undertrade"],
        heatStressLevel: 0,
        exhaustionLevel: 0,
        conditions: [],
        background: "Forge Fighter",
        traits: ["The gods didn't build this body — I did."],
        ideals: ["Self-improvement through any means necessary"],
        bonds: ["Owes life to underground mod-doctors"],
        flaws: ["Reckless with experimental modifications"],
    },
];
