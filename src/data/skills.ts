import type { SkillType, AbilityScores } from "@/types";

export const SKILLS: Record<SkillType, keyof AbilityScores> = {
    Acrobatics: "dexterity",
    "Animal Handling": "wisdom",
    Arcana: "intelligence",
    Athletics: "strength",
    Deception: "charisma",
    History: "intelligence",
    Insight: "wisdom",
    Intimidation: "charisma",
    Investigation: "intelligence",
    Medicine: "wisdom",
    Nature: "intelligence",
    Perception: "wisdom",
    Performance: "charisma",
    Persuasion: "charisma",
    Religion: "intelligence",
    "Sleight of Hand": "dexterity",
    Stealth: "dexterity",
    Survival: "wisdom",
    Tinkering: "intelligence",
};
