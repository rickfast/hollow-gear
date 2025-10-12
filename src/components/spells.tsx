import type { Spell } from "@/types";
import { Card, CardBody, Chip } from "@heroui/react";
import { showRollToast } from "./roll";
import type { Rollable } from "@/types";

export const Spells = ({
    resourceType,
    spells,
}: {
    resourceType: "Aether Flux" | "Resonance Charges";
    spells: Spell[];
}) => {
    if (spells.length === 0) {
        return (
            <div className="text-center py-8 text-default-400">
                <p>No spells available</p>
            </div>
        );
    }

    const getActionTime = (castingTime: string): string => {
        if (castingTime.includes("1 action")) return "1A";
        if (castingTime.includes("1 bonus action")) return "1BA";
        if (castingTime.includes("1 reaction")) return "1R";
        if (castingTime.includes("1 minute")) return "1M";
        return castingTime;
    };

    const getHitDC = (spell: Spell): string => {
        if (spell.type === "Attack") return "Spell Attack";
        if (spell.type === "Save" && spell.savingThrow) {
            return `DC ${spell.savingThrow.dc} ${spell.savingThrow.ability.substring(0, 3).toUpperCase()}`;
        }
        if (spell.type === "Automatic Hit") return "Auto Hit";
        return "—";
    };

    const handleDamageRoll = (spell: Spell) => {
        if (!spell.damage) return;

        const damageRollable: Rollable = {
            count: spell.damage.count,
            die: spell.damage.die,
            bonus: spell.damage.bonus,
        };

        showRollToast(`${spell.hollowgearName || spell.name} - ${spell.damage.damageType}`, [
            damageRollable,
        ]);
    };

    const resourceAbbr = resourceType === "Aether Flux" ? "AFP" : "RC";

    return (
        <div className="space-y-2">
            {spells.map((spell, index) => (
                <Card key={index} className="border border-default-200">
                    <CardBody className="p-3">
                        <div className="flex items-start gap-3">
                            {/* Left: Spell Info */}
                            <div className="flex-1 min-w-0">
                                {/* Name and Level */}
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-base">
                                        {spell.hollowgearName || spell.name}
                                    </h4>
                                    {spell.level > 0 && (
                                        <Chip size="sm" variant="flat" color="default">
                                            Lvl {spell.level}
                                        </Chip>
                                    )}
                                    {spell.concentration && (
                                        <Chip size="sm" variant="flat" color="warning">
                                            C
                                        </Chip>
                                    )}
                                </div>

                                {/* Stats Row */}
                                <div className="flex flex-wrap gap-3 mb-2">
                                    {/* Time */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-default-500">Time:</span>
                                        <span className="text-sm font-semibold">
                                            {getActionTime(spell.castingTime)}
                                        </span>
                                    </div>

                                    {/* Cost */}
                                    {spell.aetherCost !== undefined && (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs text-default-500">Cost:</span>
                                            <span className="text-sm font-semibold text-primary">
                                                {spell.aetherCost} {resourceAbbr}
                                            </span>
                                        </div>
                                    )}

                                    {/* Range */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-default-500">Range:</span>
                                        <span className="text-sm font-semibold">{spell.range}</span>
                                    </div>

                                    {/* Hit/DC */}
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-default-500">Hit/DC:</span>
                                        <span className="text-sm font-semibold">
                                            {getHitDC(spell)}
                                        </span>
                                    </div>

                                    {/* Heat */}
                                    {spell.heatGenerated && spell.heatGenerated > 0 && (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs text-default-500">Heat:</span>
                                            <span className="text-sm font-semibold text-danger">
                                                {spell.heatGenerated}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-sm text-default-600 mb-2">{spell.description}</p>

                                {/* Damage/Heal Roll Button */}
                                {spell.damage && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleDamageRoll(spell)}
                                            className="px-3 py-1 text-xs font-medium rounded-md bg-danger/10 text-danger hover:bg-danger/20 transition-colors"
                                        >
                                            Roll {spell.damage.count}d{spell.damage.die}
                                            {spell.damage.bonus
                                                ? ` + ${spell.damage.bonus}`
                                                : ""}{" "}
                                            {spell.damage.damageType}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};
