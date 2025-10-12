import { Card, CardBody, Chip } from "@heroui/react";
import { CardTitle, Stat, StatRow, Description, EmptyState } from "./typography";
import type { InventoryViewModel } from "@/model/character-view-model";

interface ModsProps {
    inventory: InventoryViewModel;
}

export const Mods = ({ inventory }: ModsProps) => {
    const mods = inventory.mods;
    if (mods.length === 0) {
        return <EmptyState message="No mods in inventory" />;
    }

    if (mods.length === 0) {
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
            {mods.map((mod) => (
                <Card key={mod.id} className="border border-default-200">
                    <CardBody className="p-3">
                        {/* Mod Name and Badges */}
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <CardTitle>{mod.mod.name}</CardTitle>
                            <Chip size="sm" variant="flat" color={getTierColor(mod.mod.tier)}>
                                {mod.mod.tier}
                            </Chip>
                            <Chip size="sm" variant="flat" color={getModTypeColor(mod.mod.modType)}>
                                {mod.mod.modType}
                            </Chip>
                            {mod.equipped && (
                                <Chip size="sm" variant="solid" color="success">
                                    Equipped
                                </Chip>
                            )}
                        </div>

                        {/* Stats Row */}
                        <StatRow>
                            <Stat label="Craft DC" value={mod.mod.craftDC} />
                            <Stat label="Time" value={`${mod.mod.craftTime}h`} />
                            <Stat label="Cost" value={`${mod.mod.cost} Cogs`} />
                            {mod.mod.malfunctionChance !== undefined && (
                                <Stat
                                    label="Malfunction"
                                    value={
                                        <span className="text-danger">
                                            {mod.mod.malfunctionChance}%
                                        </span>
                                    }
                                />
                            )}
                        </StatRow>

                        {/* Effect */}
                        <Description>{mod.mod.effect}</Description>

                        {/* Additional Damage */}
                        {mod.mod.additionalDamage && (
                            <div className="text-sm mb-1">
                                <span className="text-xs text-default-500">Damage: </span>
                                <span className="font-semibold text-danger">
                                    {mod.mod.additionalDamage.count}d{mod.mod.additionalDamage.die}{" "}
                                    {mod.mod.additionalDamage.damageType}
                                </span>
                            </div>
                        )}

                        {/* Notes */}
                        {mod.mod.notes && (
                            <div className="text-xs text-default-400 italic">{mod.mod.notes}</div>
                        )}
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};
