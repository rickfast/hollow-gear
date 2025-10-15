// ============================================================================
// COMMON / SHARED TYPES
// ============================================================================

export interface PerRestUse {
    amount: number;
    restType: "short" | "long"
}

export interface Feature {
    name: string;
    description: string;
    usesPerRest?: PerRestUse;
}
