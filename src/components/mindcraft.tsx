import type { MindcraftPower } from "@/types";
import { Card, CardBody, Chip } from "@heroui/react";
import { CardTitle, Description, EmptyState, PrimaryStat, Stat, StatRow } from "./typography";

export const Mindcraft = ({ powers }: { powers: MindcraftPower[] }) => {
    if (powers.length === 0) {
        return <EmptyState message="No mindcraft powers available" />;
    }

    const getDisciplineColor = (discipline: string) => {
        switch (discipline) {
            case "Flux":
                return "danger"; // Entropy & Energy - red
            case "Echo":
                return "primary"; // Sound, Vibration - blue
            case "Eidolon":
                return "secondary"; // Soul Projection - purple
            case "Empyric":
                return "warning"; // Emotion, Mind - yellow
            case "Veil":
                return "default"; // Illusion - gray
            case "Kinesis":
                return "success"; // Telekinetic Force - green
            default:
                return "default";
        }
    };

    const getDisciplineDescription = (discipline: string) => {
        switch (discipline) {
            case "Flux":
                return "Entropy & Energy";
            case "Echo":
                return "Sound, Vibration, Resonance";
            case "Eidolon":
                return "Soul Projection";
            case "Empyric":
                return "Emotion, Mind, Memory";
            case "Veil":
                return "Illusion, Concealment";
            case "Kinesis":
                return "Telekinetic Force";
            default:
                return discipline;
        }
    };

    const getSaveDC = (power: MindcraftPower): string => {
        if (power.savingThrow) {
            return `DC ${power.savingThrow.dc} ${power.savingThrow.ability.substring(0, 3).toUpperCase()}`;
        }
        return "—";
    };

    return (
        <div className="space-y-2">
            {powers.map((power) => (
                <Card key={power.id} className="border border-default-200">
                    <CardBody className="p-3">
                        <div className="flex items-start gap-3">
                            {/* Power Info */}
                            <div className="flex-1 min-w-0">
                                {/* Name and Badges */}
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <CardTitle>{power.name}</CardTitle>
                                    <Chip size="sm" variant="flat" color="default">
                                        Tier {power.tier}
                                    </Chip>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color={getDisciplineColor(power.discipline)}
                                        title={getDisciplineDescription(power.discipline)}
                                    >
                                        {power.discipline}
                                    </Chip>
                                    {power.concentration && (
                                        <Chip size="sm" variant="flat" color="warning">
                                            C
                                        </Chip>
                                    )}
                                    {power.amplifiable && (
                                        <Chip size="sm" variant="flat" color="success">
                                            Amplifiable
                                        </Chip>
                                    )}
                                </div>

                                {/* Stats Row */}
                                <StatRow>
                                    {/* AFP Cost */}
                                    <PrimaryStat label="Cost" value={`${power.afpCost} AFP`} />

                                    {/* Range */}
                                    {power.range && <Stat label="Range" value={power.range} />}

                                    {/* Duration */}
                                    {power.duration && (
                                        <Stat label="Duration" value={power.duration} />
                                    )}

                                    {/* Save DC */}
                                    {power.savingThrow && (
                                        <Stat label="Save" value={getSaveDC(power)} />
                                    )}
                                </StatRow>

                                {/* Effect Description */}
                                <Description>{power.effect}</Description>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};
