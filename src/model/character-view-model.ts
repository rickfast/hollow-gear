import type {
    AetherFluxPoints,
    Character,
    CharacterClass,
    CraftTier,
    DamageType,
    Die,
    Feature,
    HitPoints,
    InventoryMod,
    ResonanceCharges,
    Rollable,
    SkillType,
    Spell,
    Weapon,
} from "@/types";
import { SKILLS } from "@/data/skills";
import { CLASSES, EQUIPMENT_BY_ID, SPECIES, SPELLS_BY_NAME } from "@/data";
import { ARMOR_MODS, CRAFT_TIER_LOOKUP, MOD_LOOKUP, SHIELD_MODS, WEAPON_MODS } from "@/data/mods";

const formatModifier = (modifier: number) => (modifier >= 0 ? `+${modifier}` : `${modifier}`);

export class AbilityScore {
    public score: number;
    public modifier: number;

    constructor(score: { score: number; modifier: number }) {
        this.score = score.score;
        this.modifier = score.modifier;
    }

    get modifierDisplay() {
        return formatModifier(this.modifier);
    }
}

export interface AbilityScores {
    strength: AbilityScore;
    dexterity: AbilityScore;
    constitution: AbilityScore;
    intelligence: AbilityScore;
    wisdom: AbilityScore;
    charisma: AbilityScore;
}

export interface CharacterSummary {
    id: string;
    name: string;
    class: string;
    fullClass: string;
    level: number;
    species: string;
    background: string;
    hitPoints: HitPoints;
    heatPoints: HitPoints;
    aetherFluxPoints?: AetherFluxPoints;
    resonanceCharges?: ResonanceCharges;
    armorClass: number;
    initiative: string;
    speed: number;
    avatarUrl?: string;
}

export interface FeatureDisplay {
    type: "Class" | "Species";
    source: string;
    feature: Feature;
}

export interface SavingThrow {
    proficient: boolean;
    modifier: string;
    rollable: Rollable;
}

export interface SavingThrows {
    strength: SavingThrow;
    dexterity: SavingThrow;
    constitution: SavingThrow;
    intelligence: SavingThrow;
    wisdom: SavingThrow;
    charisma: SavingThrow;
}

export type Skills = Record<
    string,
    {
        modifier: string;
        proficient: boolean;
        expertise: boolean;
        ability: string;
        rollable: Rollable;
    }
>;

export interface InventoryItem {
    id: string;
    equipmentId: string;
    equipped: boolean;
    name: string;
    quantity: number;
    cost: string;
    weight: string;
    tags?: string[];
    craftTier: CraftTier;
    slots: number;
    mods: string[];
}

export interface Action {
    name: string;
    type: string;
    hit?: { modifier: string };
    damage?: Damage;
    description?: string;
    range?: string;
}

export interface Damage extends Rollable {
    count: number;
    die: Die;
    staticDamage?: number;
    damageType: DamageType;
    bonus?: number;
}

export class InventoryViewModel {
    items: InventoryItem[];
    mods: InventoryMod[];

    constructor(inventory: InventoryItem[], mods: InventoryMod[]) {
        this.items = inventory;
        this.mods = mods;
    }

    filterModsForEquipment(inventoryItem: InventoryItem): InventoryMod[] {
        if (!inventoryItem) return [];

        const equipment = EQUIPMENT_BY_ID[inventoryItem.equipmentId];
        const modIds = this.mods.map((mod) => mod.modId);

        if (!equipment) return [];

        switch (equipment?.type) {
            case "Armor":
                const armorMods = ARMOR_MODS.filter((mod) => modIds.includes(mod.id)).map(
                    (mod) => mod.id
                );
                return this.mods.filter((mod) => armorMods.includes(mod.id));
            case "Weapon":
                const weaponMods = WEAPON_MODS.filter((mod) => modIds.includes(mod.id)).map(
                    (mod) => mod.id
                );
                return this.mods.filter((mod) => weaponMods.includes(mod.id));
            case "Shield":
                const shieldMods = SHIELD_MODS.filter((mod) => modIds.includes(mod.id)).map(
                    (mod) => mod.id
                );
                return this.mods.filter((mod) => shieldMods.includes(mod.id));
            default:
                return [];
        }
    }
}

export class CharacterViewModel {
    abilityScores: AbilityScores;
    summary: CharacterSummary;
    savingThrows: SavingThrows;
    skills: Skills;
    actions: Action[] = []; // Placeholder for future implementation
    spellType: "Formulae" | "Miracles" | "None";
    spells: Spell[] = [];
    features: FeatureDisplay[] = [];
    inventory: InventoryViewModel;

    constructor(private character: Character) {
        const primaryClass = this.character.classes[0];
        const classes = this.character.classes.map((cls) => cls.class);
        this.spellType = classes.includes("Templar")
            ? "Miracles"
            : classes.includes("Arcanist")
              ? "Formulae"
              : "None";
        this.summary = {
            name: this.character.name,
            class: primaryClass ? primaryClass.class : "Unknown",
            fullClass: primaryClass
                ? primaryClass.subclass
                    ? `${primaryClass.class} (${primaryClass.subclass})`
                    : primaryClass.class
                : "Unknown",
            level: this.character.level,
            species: this.character.species,
            background: this.character.background || "Unknown",
            hitPoints: this.character.hitPoints,
            heatPoints: this.character.heatPoints,
            aetherFluxPoints: this.character.aetherFluxPoints,
            resonanceCharges: this.character.resonanceCharges,
            armorClass: this.character.armorClass,
            initiative: formatModifier(this.character.initiative),
            speed: this.character.speed,
            avatarUrl: this.character.avatarUrl,
            id: this.character.id,
        };
        this.abilityScores = {
            strength: new AbilityScore({
                score: this.character.abilityScores.strength,
                modifier: Math.floor((this.character.abilityScores.strength - 10) / 2),
            }),
            dexterity: new AbilityScore({
                score: this.character.abilityScores.dexterity,
                modifier: Math.floor((this.character.abilityScores.dexterity - 10) / 2),
            }),
            constitution: new AbilityScore({
                score: this.character.abilityScores.constitution,
                modifier: Math.floor((this.character.abilityScores.constitution - 10) / 2),
            }),
            intelligence: new AbilityScore({
                score: this.character.abilityScores.intelligence,
                modifier: Math.floor((this.character.abilityScores.intelligence - 10) / 2),
            }),
            wisdom: new AbilityScore({
                score: this.character.abilityScores.wisdom,
                modifier: Math.floor((this.character.abilityScores.wisdom - 10) / 2),
            }),
            charisma: new AbilityScore({
                score: this.character.abilityScores.charisma,
                modifier: Math.floor((this.character.abilityScores.charisma - 10) / 2),
            }),
        };

        let savingThrows = {} as SavingThrows;
        for (const ability of [
            "strength",
            "dexterity",
            "constitution",
            "intelligence",
            "wisdom",
            "charisma",
        ] as const) {
            const score = this.character.abilityScores[ability];
            const modifier = Math.floor((score - 10) / 2);
            const isProficient =
                this.character.proficiencies?.savingThrows?.includes(ability) || false;
            const profBonus = isProficient ? 2 : 0; // Simplified, should use actual proficiency bonus
            const total = modifier + profBonus;

            savingThrows = {
                ...savingThrows,
                [ability]: {
                    proficient: isProficient,
                    modifier: formatModifier(total),
                    rollable: {
                        count: 1,
                        die: 20,
                        bonus: total,
                    },
                },
            };
        }
        this.savingThrows = savingThrows;
        this.skills = Object.fromEntries(
            Object.entries(character.skills).map(([skillName, skillData]) => {
                return [
                    skillName,
                    {
                        modifier: formatModifier(skillData.modifier),
                        proficient: skillData.proficient,
                        expertise: skillData.expertise,
                        ability: SKILLS[skillName as SkillType].substring(0, 3).toUpperCase(),
                        rollable: {
                            count: 1,
                            die: 20,
                            bonus: skillData.modifier,
                        },
                    },
                ];
            })
        );
        const inventoryItems = character.inventory.map((item) => {
            const equipment = EQUIPMENT_BY_ID[item.equipmentId]!;
            return {
                id: item.id,
                equipped: item.equipped,
                equipmentId: equipment.id,
                name: equipment.name,
                quantity: 1,
                cost: `${equipment.cost} Cogs`,
                weight: `${equipment.weight} lbs`,
                tags: [equipment.tier, equipment.type],
                craftTier: equipment.tier,
                slots: CRAFT_TIER_LOOKUP[equipment.tier]?.slots || 0,
                mods: item.mods || [],
            };
        });
        inventoryItems
            .filter((item) => {
                const equipment = EQUIPMENT_BY_ID[item.equipmentId]!;
                return item.equipped && equipment.type === "Weapon";
            })
            .forEach((item) => {
                const equipment = EQUIPMENT_BY_ID[item.equipmentId]! as Weapon;
                const damage = equipment.damage;
                const { hitModifier, damageBonus } = calculateHitAndDamage(
                    this.abilityScores,
                    equipment
                );

                this.actions.push({
                    name: equipment.name,
                    type: equipment.weaponType,
                    hit: { modifier: hitModifier },
                    damage: {
                        count: damage.count,
                        die: damage.die,
                        bonus: damageBonus,
                        damageType: damage.damageType,
                    },
                    description: equipment.description,
                    range: equipment.range
                        ? `${equipment.range?.normal}' (${equipment.range?.max}')`
                        : "",
                });
            });
        this.actions.push(createUnarmedStrikeAction(this.abilityScores.strength.modifier));
        this.spells =
            (character.spells
                ?.map((spellName) => {
                    // Map spell names to full spell data
                    return SPELLS_BY_NAME[spellName];
                })
                .filter((spell) => spell !== undefined) as Spell[]) || [];
        const species = SPECIES.find((s) => s.type === character.species);
        const cls = CLASSES.find((c) => c.type === primaryClass?.class);

        this.features = [
            ...(species?.traits.map((feature) => ({
                type: "Species" as const,
                source: species.type,
                feature,
            })) || []),
            ...(cls?.features.map((feature) => ({
                type: "Class" as const,
                source: cls.type,
                feature,
            })) || []),
        ];

        const inventoryMods = character.mods;

        this.inventory = new InventoryViewModel(inventoryItems, inventoryMods);
    }
}

function calculateHitAndDamage(abilityScores: AbilityScores, weapon: Weapon) {
    const strengthMod = abilityScores.strength.modifier;
    const dexterityMod = abilityScores.dexterity.modifier;
    const isFinesse = weapon.properties?.includes("Finesse");
    const isRanged = ["Simple Ranged", "Martial Ranged"].includes(weapon.weaponType);

    let attackMod = isFinesse
        ? Math.max(strengthMod, dexterityMod)
        : isRanged
          ? dexterityMod
          : strengthMod;

    return {
        hitModifier: formatModifier(attackMod),
        damageBonus: attackMod,
    };
}

function createUnarmedStrikeAction(strengthModifier: number): Action {
    return {
        name: "Unarmed Strike",
        type: "Melee",
        hit: { modifier: formatModifier(1 + strengthModifier) },
        damage: {
            count: 1,
            die: 1,
            staticDamage: 1 + strengthModifier,
            damageType: "Bludgeoning",
            bonus: strengthModifier,
        },
        description: "Your unarmed strike can deal damage equal to 1 + your Strength modifier.",
    };
}
