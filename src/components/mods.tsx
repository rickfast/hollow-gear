import { Card, CardBody, Chip } from "@heroui/react";
import { CardTitle, Stat, StatRow, Description, EmptyState } from "./typography";
import { MODS } from "@/data/mods";
import type { InventoryMod } from "@/types";

interface ModsProps {
    inventoryMods: InventoryMod[];
}

export const Mods = ({ inventoryMods }: ModsProps) => {
    if (inventoryMods.length === 0) {
        return <EmptyState message="No mods in inventory" />;
    }

    // Look up full mod details from MODS data
    const modsWithDetails = inventoryMods
        .map((inventoryMod) => {
            const modData = MODS.find((m) => m.id === inventoryMod.modId);
            if (!modData) return null;
            return {
                ...inventoryMod,
                modData,
            };
        })
        .filter((mod) => mod !== null);

    if (modsWithDetails.length === 0) {
        return <EmptyState message="No mods in inventory" />;
    }

    const getTierColor = (tier: string) => {
        if (tier.includes("I - Common")) return "default";
        if (tier.includes("II - Advanced")) return "primary";
        if (tier.includes("III - Relic")) return "secondary";
        if (tier.includes("IV - Prototype")) return "warning";
        return "default";
    };

    const getModTypeColor = (modType: string) => {
        switch (modType) {
            case "Power":
                return "danger";
            case "Defense":
                return "success";
            case "Psionic":
                return "secondary";
            case "Elemental":
                return "warning";
            case "Reactive":
                return "primary";
            case "Utility":
            default:
                return "default";
        }
    };

    return (
        <div className="space-y-2">
            {modsWithDetails.map((mod) => (
                <Card key={mod.id} className="border border-default-200">
                    <CardBody className="p-3">
                        {/* Mod Name and Badges */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle>{mod.modData.name}</CardTitle>
                            <Chip size="sm" variant="flat" color={getTierColor(mod.modData.tier)}>
                                {mod.modData.tier}
                            </Chip>
                            <Chip
                                size="sm"
                                variant="flat"
                                color={getModTypeColor(mod.modData.modType)}
                            >
                                {mod.modData.modType}
                            </Chip>
                            {mod.equipped && (
                                <Chip size="sm" variant="solid" color="success">
                                    Equipped
                                </Chip>
                            )}
                        </div>

                        {/* Stats Row */}
                        <StatRow>
                            <Stat label="Craft DC" value={mod.modData.craftDC} />
                            <Stat label="Time" value={`${mod.modData.craftTime}h`} />
                            <Stat label="Cost" value={`${mod.modData.cost} Cogs`} />
                            {mod.modData.malfunctionChance !== undefined && (
                                <Stat
                                    label="Malfunction"
                                    value={
                                        <span className="text-danger">
                                            {mod.modData.malfunctionChance}%
                                        </span>
                                    }
                                />
                            )}
                        </StatRow>

                        {/* Effect */}
                        <Description>{mod.modData.effect}</Description>

                        {/* Additional Damage */}
                        {mod.modData.additionalDamage && (
                            <div className="text-sm mb-1">
                                <span className="text-xs text-default-500">Damage: </span>
                                <span className="font-semibold text-danger">
                                    {mod.modData.additionalDamage.count}d
                                    {mod.modData.additionalDamage.die}{" "}
                                    {mod.modData.additionalDamage.damageType}
                                </span>
                            </div>
                        )}

                        {/* Notes */}
                        {mod.modData.notes && (
                            <div className="text-xs text-default-400 italic">
                                {mod.modData.notes}
                            </div>
                        )}
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};
