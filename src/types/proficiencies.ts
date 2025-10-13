// ============================================================================
// PROFICIENCIES & SKILLS
// ============================================================================

import type { AbilityScores } from "./abilities";
import type { ArmorType, WeaponType } from "./equipment";

export interface Proficiencies {
    armor: ArmorType[];
    weapons: WeaponType[];
    tools: Tool[];
    savingThrows: (keyof AbilityScores)[];
    skills: SkillType[];
}

export type Tool =
    | "Tinker's Tools"
    | "Thieves' Tools"
    | "Disguise Kit"
    | "Navigator's Tools"
    | "Smith's Tools"
    | "Alchemist's Supplies";

export type SkillType =
    | "Acrobatics"
    | "Animal Handling"
    | "Arcana"
    | "Athletics"
    | "Deception"
    | "History"
    | "Insight"
    | "Intimidation"
    | "Investigation"
    | "Medicine"
    | "Nature"
    | "Perception"
    | "Performance"
    | "Persuasion"
    | "Religion"
    | "Sleight of Hand"
    | "Stealth"
    | "Survival"
    | "Tinkering"; // Hollowgear-specific

export interface Skill {
    modifier: number;
    proficient: boolean;
    expertise: boolean;
}

export interface Skills {
    Acrobatics: Skill;
    "Animal Handling": Skill;
    Arcana: Skill;
    Athletics: Skill;
    Deception: Skill;
    History: Skill;
    Insight: Skill;
    Intimidation: Skill;
    Investigation: Skill;
    Medicine: Skill;
    Nature: Skill;
    Perception: Skill;
    Performance: Skill;
    Persuasion: Skill;
    Religion: Skill;
    "Sleight of Hand": Skill;
    Stealth: Skill;
    Survival: Skill;
    Tinkering: Skill;
}
