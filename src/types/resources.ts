// ============================================================================
// RESOURCES (Chapters 9, 11)
// ============================================================================

export interface Points {
    current: number;
    maximum: number;
}

export interface HitPoints extends Points {
    current: number;
    maximum: number;
    temporary?: number;
}

export interface AetherFluxPoints extends Points {
    current: number;
    maximum: number; // Class Level + Ability Modifier
    rechargeRate: {
        shortRest: number; // usually half
        longRest: number; // usually all
    };
}

export interface ResonanceCharges extends Points {
    current: number;
    maximum: number; // Templar Level + Wisdom modifier
    rechargeRate: {
        shortRest: number; // usually half
        longRest: number; // usually all
    };
}

export interface SpellSlots {
    level1: { current: number; maximum: number };
    level2: { current: number; maximum: number };
    level3: { current: number; maximum: number };
    level4: { current: number; maximum: number };
    level5: { current: number; maximum: number };
    level6: { current: number; maximum: number };
    level7: { current: number; maximum: number };
    level8: { current: number; maximum: number };
    level9: { current: number; maximum: number };
}
