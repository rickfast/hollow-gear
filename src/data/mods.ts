import type { CraftTier, ModTierSpec } from "@/types";

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

export const CRAFT_TIER_LOOKUP: Record<CraftTier, ModTierSpec> = {
    Workshop: MOD_TIERS[0]!,
    Guild: MOD_TIERS[1]!,
    Relic: MOD_TIERS[2]!,
    Mythic: MOD_TIERS[3]!,
};
