import type { Action, Damage } from "@/model/character-view-model";
import type { Rollable } from "@/types";
import { Button, Card, CardBody, Chip } from "@heroui/react";
import { showRollToast } from "./roll";
import { CardTitle, EmptyState, Stat, StatRow } from "./typography";

export const Actions = ({ actions }: { actions: Action[] }) => {
    if (actions.length === 0) {
        return <EmptyState message="No actions available" />;
    }

    const handleAttackRoll = (action: Action) => {
        if (!action.hit || !action.damage) return;

        // Roll attack (d20 + modifier)
        const attackModifier = parseInt(action.hit.modifier);
        const attackRollable: Rollable = {
            count: 1,
            die: 20,
            bonus: attackModifier,
        };

        showRollToast(`${action.name} - Attack Roll`, [attackRollable]);
    };

    const handleDamageRoll = (action: Action) => {
        if (!action.damage) return;

        const damageRollable: Rollable = {
            count: action.damage.count,
            die: action.damage.die,
            bonus: action.damage.bonus,
        };

        showRollToast(`${action.name} - Damage (${action.damage.damageType})`, [damageRollable]);
    };

    return (
        <div className="space-y-2">
            {actions.map((action, index) => (
                <Card key={index} className="border border-default-200">
                    <CardBody className="p-3">
                        {/* Action Name and Type */}
                        <div className="flex items-start justify-between mb-2">
                            <CardTitle>{action.name}</CardTitle>
                            <Chip size="sm" variant="flat" color="primary">
                                {action.type}
                            </Chip>
                        </div>

                        {/* Attack Info */}
                        {action.hit && action.damage && (
                            <StatRow>
                                {/* Hit Modifier */}
                                <Stat
                                    label="Hit"
                                    value={
                                        <span className="text-primary">
                                            <Button
                                                variant="bordered"
                                                size="sm"
                                                onPress={() => handleAttackRoll(action)}
                                            >
                                                {action.hit.modifier}
                                            </Button>
                                        </span>
                                    }
                                />

                                {/* Damage */}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-default-500">Damage:</span>
                                    <span className="font-semibold">
                                        <Button
                                            variant="bordered"
                                            size="sm"
                                            onPress={() => handleDamageRoll(action)}
                                        >
                                            <DamageDisplay damage={action.damage} />
                                        </Button>
                                    </span>
                                    <span className="text-xs text-default-400 ml-1">
                                        ({action.damage.damageType})
                                    </span>
                                </div>

                                {/* Range */}
                                {action.range && <Stat label="Range" value={action.range} />}
                            </StatRow>
                        )}

                        {/* Roll Buttons */}
                        {/* {action.hit && action.damage && (
                            <div className="flex gap-2 mt-3">
                                <Button
                                    size="sm"
                                    color="primary"
                                    variant="flat"
                                    onPress={() => handleAttackRoll(action)}
                                >
                                    Roll Attack
                                </Button>
                                <Button
                                    size="sm"
                                    color="danger"
                                    variant="flat"
                                    onPress={() => handleDamageRoll(action)}
                                >
                                    Roll Damage
                                </Button>
                            </div>
                        )} */}

                        {/* Description */}
                        {action.description && (
                            <p className="text-sm text-default-600 mt-2">{action.description}</p>
                        )}
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

const DamageDisplay = ({ damage }: { damage: Damage }) => {
    return damage.staticDamage ? (
        <span className="font-semibold">{damage.staticDamage}</span>
    ) : (
        <span className="font-semibold">
            {damage.count}d{damage.die}
            {damage.bonus ? ` + ${damage.bonus}` : ""}
        </span>
    );
};
