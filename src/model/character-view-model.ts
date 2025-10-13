import {
    CLASSES,
    DRONE_TEMPLATES_BY_ID,
    EQUIPMENT_BY_ID,
    MINDCRAFT_POWERS_LOOKUP,
    SPECIES,
    SPELLS_BY_NAME,
} from "@/data";
import { CRAFT_TIER_LOOKUP, MOD_LOOKUP } from "@/data/mods";
import { SKILLS } from "@/data/skills";
import type {
    AetherFluxPoints,
    Character,
    ClassFeature,
    ClassType,
    CraftTier,
    DamageInfo,
    DamageType,
    Die,
    Drone,
    HitPoints,
    InventoryMod,
    MindcraftPower,
    Mod,
    ResonanceCharges,
    Rollable,
    Skill,
    SkillType,
    SpeciesTrait,
    SpeciesType,
    Spell,
    Weapon,
} from "@/types";
import {
    calculateAbilityModifier,
    calculateProficiencyBonus,
    formatModifier,
    getActiveDrone,
    ValidationError,
} from "./character-utils";

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
    activeDroneId?: string;
}

export type FeatureDisplay =
    | {
          type: "Species";
          source: SpeciesType;
          feature: SpeciesTrait;
      }
    | {
          type: "Class";
          source: ClassType;
          feature: ClassFeature;
      }
    | {
          type: "Archetype";
          source: string;
          feature: ClassFeature;
      };

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
    additionalDamage?: DamageInfo[];
}

export type ModViewModel = InventoryMod & { mod: Mod };

export class InventoryViewModel {
    items: InventoryItem[];
    mods: ModViewModel[];

    constructor(inventory: InventoryItem[], mods: ModViewModel[]) {
        this.items = inventory;
        this.mods = mods;
    }

    filterModsForEquipment(inventoryItem: InventoryItem): Mod[] {
        const equipment = EQUIPMENT_BY_ID[inventoryItem.equipmentId]!;
        return this.mods
            .filter((invMod) => invMod.mod.equipmentType === equipment.type)
            .map((m) => m.mod);
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
    mindcraftPowers: MindcraftPower[] = [];
    features: FeatureDisplay[] = [];
    inventory: InventoryViewModel;
    activeDrone?: Drone;
    drones: Drone[] = [];

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
            activeDroneId: this.character.activeDroneId,
        };
        this.abilityScores = {
            strength: new AbilityScore({
                score: this.character.abilityScores.strength,
                modifier: calculateAbilityModifier(this.character.abilityScores.strength),
            }),
            dexterity: new AbilityScore({
                score: this.character.abilityScores.dexterity,
                modifier: calculateAbilityModifier(this.character.abilityScores.dexterity),
            }),
            constitution: new AbilityScore({
                score: this.character.abilityScores.constitution,
                modifier: calculateAbilityModifier(this.character.abilityScores.constitution),
            }),
            intelligence: new AbilityScore({
                score: this.character.abilityScores.intelligence,
                modifier: calculateAbilityModifier(this.character.abilityScores.intelligence),
            }),
            wisdom: new AbilityScore({
                score: this.character.abilityScores.wisdom,
                modifier: calculateAbilityModifier(this.character.abilityScores.wisdom),
            }),
            charisma: new AbilityScore({
                score: this.character.abilityScores.charisma,
                modifier: calculateAbilityModifier(this.character.abilityScores.charisma),
            }),
        };

        const proficiencyBonus = calculateProficiencyBonus(this.character.level);
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
            const modifier = calculateAbilityModifier(score);
            const isProficient =
                this.character.proficiencies?.savingThrows?.includes(ability) || false;
            const profBonus = isProficient ? proficiencyBonus : 0;
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
                const skill = skillData as Skill;
                return [
                    skillName,
                    {
                        modifier: formatModifier(skill.modifier),
                        proficient: skill.proficient,
                        expertise: skill.expertise,
                        ability: SKILLS[skillName as SkillType].substring(0, 3).toUpperCase(),
                        rollable: {
                            count: 1,
                            die: 20,
                            bonus: skill.modifier,
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

                // Calculate additional damage from mods
                const attachedMods = item.mods
                    .map((modId: string) => MOD_LOOKUP[modId])
                    .filter(
                        (mod: Mod | undefined): mod is Mod =>
                            mod !== undefined && mod.additionalDamage !== undefined
                    );

                // Build description with mod effects
                let description = equipment.description || "";
                if (attachedMods.length > 0) {
                    const modEffects = attachedMods
                        .map((mod: Mod) => {
                            if (mod.additionalDamage) {
                                return `+${mod.additionalDamage.count}d${mod.additionalDamage.die} ${mod.additionalDamage.damageType} (${mod.name})`;
                            }
                            return mod.effect;
                        })
                        .join(", ");
                    description = description
                        ? `${description}\nMods: ${modEffects}`
                        : `Mods: ${modEffects}`;
                }

                this.actions.push({
                    name: equipment.name,
                    type: equipment.weaponType,
                    hit: { modifier: hitModifier },
                    damage: {
                        count: damage.count,
                        die: damage.die,
                        bonus: damageBonus,
                        damageType: damage.damageType,
                        additionalDamage: attachedMods
                            .map((mod: Mod) => mod.additionalDamage!)
                            .filter(
                                (dmg: DamageInfo | undefined): dmg is DamageInfo =>
                                    dmg !== undefined
                            ),
                    },
                    description,
                    range: equipment.range
                        ? `${equipment.range?.normal}' (${equipment.range?.max}')`
                        : "",
                });
            });
        this.actions.push(createUnarmedStrikeAction(this.abilityScores.strength.modifier));

        // Add drone actions if there's an active drone
        if (character.activeDroneId && character.drones) {
            const activeDrone = character.drones.find((d) => d.id === character.activeDroneId);
            if (activeDrone && !activeDrone.destroyed) {
                const droneTemplate = DRONE_TEMPLATES_BY_ID[activeDrone.templateId];
                if (droneTemplate?.stats.attack) {
                    this.actions.push({
                        name: `${activeDrone.name} - ${droneTemplate.stats.attack.name}`,
                        type: "Drone Attack",
                        hit: { modifier: formatModifier(droneTemplate.stats.attack.bonus) },
                        damage: {
                            count: droneTemplate.stats.attack.damage.count,
                            die: droneTemplate.stats.attack.damage.die,
                            bonus: 0,
                            damageType: droneTemplate.stats.attack.damage.damageType,
                        },
                        description: `Your drone ${activeDrone.name} attacks with its ${droneTemplate.stats.attack.name}.`,
                        range: "60 ft (command range)",
                    });
                }
            }
        }

        this.spells =
            (character.spells
                ?.map((spellName) => {
                    // Map spell names to full spell data
                    return SPELLS_BY_NAME[spellName];
                })
                .filter((spell) => spell !== undefined) as Spell[]) || [];
        const species = SPECIES.find((s) => s.type === character.species);
        const cls = CLASSES.find((c) => c.type === primaryClass?.class);
        const subclass = cls?.subclasses.find((s) => s.type === primaryClass?.subclass);

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
            ...(subclass?.features.map((feature) => ({
                type: "Archetype" as const,
                source: subclass.type,
                feature,
            })) || []),
        ];

        const inventoryMods = character.mods.map((invMod) => {
            const mod = MOD_LOOKUP[invMod.modId]!;
            return {
                ...invMod,
                mod,
            } as ModViewModel;
        });

        this.inventory = new InventoryViewModel(inventoryItems, inventoryMods);
        this.mindcraftPowers =
            character.mindcraftPowers?.map((id) => {
                const power = MINDCRAFT_POWERS_LOOKUP[id];
                if (!power) {
                    throw new ValidationError("mindcraftPower", id, "unknown mindcraft power");
                }
                return power;
            }) || [];

        // Drones (Artifex only)
        this.drones = character.drones || [];
        this.activeDrone = getActiveDrone(character);
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
