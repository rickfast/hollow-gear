import type { Character, HitPoints, SkillType } from "@/types";
import { SKILLS } from "@/data/skills";
import { EQUIPMENT_BY_ID } from "@/data";

const formatModifier = (modifier: number) => (modifier >= 0 ? `+${modifier}` : `${modifier}`);

export interface AbilityScore {
    score: number;
    modifier: string;
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
    { modifier: string; proficient: boolean; expertise: boolean; ability: string }
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

export class CharacterViewModel {
    abilityScores: AbilityScores;
    summary: CharacterSummary;
    savingThrows: SavingThrows;
    skills: Skills;
    inventory: InventoryItem[];

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
            strength: {
                score: this.character.abilityScores.strength,
                modifier: formatModifier(
                    Math.floor((this.character.abilityScores.strength - 10) / 2)
                ),
            },
            dexterity: {
                score: this.character.abilityScores.dexterity,
                modifier: formatModifier(
                    Math.floor((this.character.abilityScores.dexterity - 10) / 2)
                ),
            },
            constitution: {
                score: this.character.abilityScores.constitution,
                modifier: formatModifier(
                    Math.floor((this.character.abilityScores.constitution - 10) / 2)
                ),
            },
            intelligence: {
                score: this.character.abilityScores.intelligence,
                modifier: formatModifier(
                    Math.floor((this.character.abilityScores.intelligence - 10) / 2)
                ),
            },
            wisdom: {
                score: this.character.abilityScores.wisdom,
                modifier: formatModifier(
                    Math.floor((this.character.abilityScores.wisdom - 10) / 2)
                ),
            },
            charisma: {
                score: this.character.abilityScores.charisma,
                modifier: formatModifier(
                    Math.floor((this.character.abilityScores.charisma - 10) / 2)
                ),
            },
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
    }
}
