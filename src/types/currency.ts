// ============================================================================
// CURRENCY (Chapter 4)
// ============================================================================

export interface Currency {
    cogs: number; // 1 Cog = base unit
    gears: number; // 1 Gear = 10 Cogs
    cores: number; // 1 Core = 100 Cogs
    aetherDust?: number; // ~25 Cogs per vial
}
