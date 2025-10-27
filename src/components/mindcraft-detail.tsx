import type { MindcraftPower } from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import {
    CardTitle,
    Description,
    PrimaryStat,
    SecondaryText,
    Stat,
    StatRow,
    TertiaryText,
} from "./typography";

interface MindcraftDetailProps {
    power: MindcraftPower;
}

/**
 * Displays comprehensive mindcraft power information for the reference page
 * Shows power name, tier, discipline, AFP cost, range, duration, and effects
 */
export function MindcraftDetail({ power }: MindcraftDetailProps) {
    // Format tier text
    const tierText = `Tier ${power.tier}`;

    // Format saving throw text
    const savingThrowText = power.savingThrow
        ? `${power.savingThrow.ability.toUpperCase()} DC ${power.savingThrow.dc}`
        : null;

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-2 pb-2 p-3 sm:p-4">
                <div className="w-full">
                    <CardTitle className="text-base sm:text-lg break-words">{power.name}</CardTitle>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Chip size="sm" variant="flat" color="primary" classNames={{ base: "min-h-[32px]" }}>
                        {tierText}
                    </Chip>
                    <Chip size="sm" variant="flat" classNames={{ base: "min-h-[32px]" }}>
                        {power.discipline}
                    </Chip>
                    {power.concentration && (
                        <Chip size="sm" variant="flat" color="warning" classNames={{ base: "min-h-[32px]" }}>
                            Concentration
                        </Chip>
                    )}
                    {power.amplifiable && (
                        <Chip size="sm" variant="flat" color="success" classNames={{ base: "min-h-[32px]" }}>
                            Amplifiable
                        </Chip>
                    )}
                </div>
            </CardHeader>

            <CardBody className="gap-3 sm:gap-4 pt-2 p-3 sm:p-4">
                {/* Power Details */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Power Details
                    </SecondaryText>
                    <StatRow>
                        <PrimaryStat label="AFP Cost" value={`${power.afpCost} AFP`} />
                        {power.range && <Stat label="Range" value={power.range} />}
                        {power.duration && <Stat label="Duration" value={power.duration} />}
                    </StatRow>
                </div>

                <Divider />

                {/* Effect */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">Effect</SecondaryText>
                    <Description className="text-sm sm:text-base leading-relaxed break-words">{power.effect}</Description>
                </div>

                {/* Saving Throw */}
                {power.savingThrow && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Saving Throw
                            </SecondaryText>
                            <TertiaryText className="text-xs sm:text-sm">{savingThrowText}</TertiaryText>
                        </div>
                    </>
                )}

                {/* Amplifiable Note */}
                {power.amplifiable && (
                    <>
                        <Divider />
                        <div>
                            <TertiaryText className="text-xs sm:text-sm">
                                This power can be amplified by spending additional AFP for
                                enhanced effects
                            </TertiaryText>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
