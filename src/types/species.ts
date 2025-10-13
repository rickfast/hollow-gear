// ============================================================================
// SPECIES (Chapter 2)
// ============================================================================

import type { AbilityScores } from "./abilities";
import type { Feature } from "./common";
import type { Language } from "./languages";

export type SpeciesType =
    | "Aqualoth" // Axolotl
    | "Vulmir" // Fox
    | "Rendai" // Red Panda
    | "Karnathi" // Ibex
    | "Tharn" // Elk
    | "Skellin" // Gecko
    | "Avenar"; // Avian

export interface Species {
    type: SpeciesType;
    abilityScoreIncrease: Partial<AbilityScores>;
    speed: number;
    swimSpeed?: number;
    climbSpeed?: number;
    traits: SpeciesTrait[];
    languages: Language[];
}

export interface SpeciesTrait extends Feature {}
