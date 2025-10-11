import type { Character, DamageType, Die, HitPoints, Rollable, SkillType, Weapon } from "@/types";
import { SKILLS } from "@/data/skills";
import { EQUIPMENT_BY_ID } from "@/data";

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
    armorClass: number;
    initiative: string;
    speed: number;
    avatarUrl?: string;
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
    equipped: boolean;
    name: string;
    quantity: number;
    cost: string;
    weight: string;
    tags?: string[];
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

export class CharacterViewModel {
    abilityScores: AbilityScores;
    summary: CharacterSummary;
    savingThrows: SavingThrows;
    skills: Skills;
    inventory: InventoryItem[];
    actions: Action[] = []; // Placeholder for future implementation

    constructor(private character: Character) {
        const primaryClass = this.character.classes[0];
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
        this.inventory = character.inventory.map((item) => {
            const equipment = EQUIPMENT_BY_ID[item.equipmentId]!;
            return {
                id: item.id,
                equipped: item.equipped,
                name: equipment.name,
                quantity: 1,
                cost: `${equipment.cost} Cogs`,
                weight: `${equipment.weight} lbs`,
                tags: [equipment.tier, equipment.type],
            };
        });
        this.character.inventory
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
