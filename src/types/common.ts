// ============================================================================
// COMMON / SHARED TYPES
// ============================================================================

export interface Feature {
    name: string;
    description: string;
    usesPerRest?: {
        amount: number;
        restType: "short" | "long";
    };
}
