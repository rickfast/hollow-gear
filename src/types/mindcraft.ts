// ============================================================================
// MINDCRAFT / PSIONICS (Chapter 6)
// ============================================================================

import type { AbilityScores } from "./abilities";
import type { DamageInfo } from "./combat";

export interface MindcraftPower {
    id: string;
    name: string;
    tier: number; // 1-5
    discipline: PsionicDiscipline;
    afpCost: number;
    range?: string;
    duration?: string;
    concentration?: boolean;
    savingThrow?: {
        ability: keyof AbilityScores;
        dc: number;
    };
    effect: string;
    amplifiable: boolean; // Can spend extra AFP to enhance
}

export type PsionicDiscipline =
    | "Flux" // Entropy & Energy
    | "Echo" // Sound, Vibration, Resonance
    | "Eidolon" // Soul Projection
    | "Empyric" // Emotion, Mind, Memory
    | "Veil" // Illusion, Concealment
    | "Kinesis"; // Telekinetic Force

export interface PsionicFeedback {
    roll: number;
    effect: string;
    damage?: DamageInfo;
}

export interface FocusLimit {
    maximum: number; // Number of effects you can sustain
    active: MindcraftPower[];
}
