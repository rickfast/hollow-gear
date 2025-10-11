import type { Action, Damage } from "@/model/character-view-model";
import { Card, CardBody, Chip } from "@heroui/react";

export const Actions = ({ actions }: { actions: Action[] }) => {
    if (actions.length === 0) {
        return (
            <div className="text-center py-8 text-default-400">
                <p>No actions available</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {actions.map((action, index) => (
                <Card key={index} className="border border-default-200">
                    <CardBody className="p-4">
                        {/* Action Name and Type */}
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-lg">{action.name}</h3>
                            <Chip size="sm" variant="flat" color="primary">
                                {action.type}
                            </Chip>
                        </div>

                        {/* Attack Info */}
                        {action.hit && action.damage && (
                            <div className="flex flex-wrap gap-4 mb-2">
                                {/* Hit Modifier */}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-default-500">Hit:</span>
                                    <span className="font-semibold text-primary">
                                        {action.hit.modifier}
                                    </span>
                                </div>

                                {/* Damage */}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-default-500">Damage:</span>
                                    <span className="font-semibold">
                                        <Damage damage={action.damage} />
                                    </span>
                                    <span className="text-xs text-default-400 ml-1">
                                        ({action.damage.damageType})
                                    </span>
                                </div>

                                {/* Range */}
                                {action.range && (
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-sm text-default-500">Range:</span>
                                        <span className="font-semibold">{action.range}</span>
                                    </div>
                                )}
                            </div>
                        )}

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

const Damage = ({ damage }: { damage: Damage }) => {
    return damage.staticDamage ? (
        <span className="font-semibold">{damage.staticDamage}</span>
    ) : (
        <span className="font-semibold">
            ({damage.count}d{damage.die}
            {damage.bonus ? ` + ${damage.bonus}` : ""})
        </span>
    );
};
