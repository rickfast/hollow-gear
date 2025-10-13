// ============================================================================
// HELPER TYPES / EVENTS
// ============================================================================

import type { ClassFeature, ClassType } from "./classes";
import type { SpellSlots } from "./resources";

export interface RestEvent {
    type: "short" | "long";
    timestamp: Date;
    resourcesRestored: {
        hitPoints?: number;
        heatPoints?: number;
        spellSlots?: Partial<SpellSlots>;
        aetherFluxPoints?: number;
        resonanceCharges?: number;
    };
}

export interface LevelUpEvent {
    newLevel: number;
    classType: ClassType;
    hitPointIncrease: number;
    featuresGained: ClassFeature[];
    timestamp: Date;
}
