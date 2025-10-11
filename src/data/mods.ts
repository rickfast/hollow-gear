import type { ModTierSpec } from "@/types";

export const MOD_TIERS: ModTierSpec[] = [
    {
        tier: "I - Common",
        craftTier: "Workshop",
        craftDC: 10,
        timeHours: 2,
        cost: 25,
        powerLevel: "Basic (minor stat boost)",
        slots: 1,
    },
    {
        tier: "II - Advanced",
        craftTier: "Guild",
        craftDC: 13,
        timeHours: 4,
        cost: 75,
        powerLevel: "Elemental or reactive mods",
        slots: 2,
    },
    {
        tier: "III - Relic",
        craftTier: "Relic",
        craftDC: 16,
        timeHours: 8,
        cost: 200,
        powerLevel: "Multi-effect or psionic mods",
        slots: 3,
    },
    {
        tier: "IV - Prototype",
        craftTier: "Mythic",
        craftDC: 18,
        timeHours: 16,
        cost: 400,
        powerLevel: "Sentient or unstable",
        slots: 4,
    },
];

export const MOD_TIER_LOOKUP: Record<string, ModTierSpec> = {
    I: MOD_TIERS[0]!,
    II: MOD_TIERS[1]!,
    III: MOD_TIERS[2]!,
    IV: MOD_TIERS[3]!,
};
