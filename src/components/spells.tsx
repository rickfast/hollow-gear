import type { Spell } from "@/types";
import { Card, CardBody, Chip } from "@heroui/react";
import { showRollToast } from "./roll";
import type { Rollable } from "@/types";
import {
    CardTitle,
    Stat,
    PrimaryStat,
    DangerStat,
    StatRow,
    Description,
    EmptyState,
} from "./typography";

export const Spells = ({
    resourceType,
    spells,
}: {
    resourceType: "Aether Flux" | "Resonance Charges";
    spells: Spell[];
}) => {
    if (spells.length === 0) {
        return <EmptyState message="No spells available" />;
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
                                    <CardTitle>{spell.hollowgearName || spell.name}</CardTitle>
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
                                <StatRow>
                                    {/* Time */}
                                    <Stat label="Time" value={getActionTime(spell.castingTime)} />

                                    {/* Cost */}
                                    {spell.aetherCost !== undefined && (
                                        <PrimaryStat
                                            label="Cost"
                                            value={`${spell.aetherCost} ${resourceAbbr}`}
                                        />
                                    )}

                                    {/* Range */}
                                    <Stat label="Range" value={spell.range} />

                                    {/* Hit/DC */}
                                    <Stat label="Hit/DC" value={getHitDC(spell)} />

                                    {/* Heat */}
                                    {spell.heatGenerated && spell.heatGenerated > 0 && (
                                        <DangerStat label="Heat" value={spell.heatGenerated} />
                                    )}
                                </StatRow>

                                {/* Description */}
                                <Description>{spell.description}</Description>

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
