import type { Armor, Equipment, Shield, Weapon } from "@/types";
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

interface EquipmentDetailProps {
    equipment: Equipment;
}

/**
 * Displays comprehensive equipment information for the reference page
 * Shows item name, type, tier, and conditionally displays weapon/armor stats
 */
export function EquipmentDetail({ equipment }: EquipmentDetailProps) {
    const isWeapon = equipment.type === "Weapon";
    const isArmor = equipment.type === "Armor";
    const isShield = equipment.type === "Shield";

    const weapon = isWeapon ? (equipment as Weapon) : null;
    const armor = isArmor ? (equipment as Armor) : null;
    const shield = isShield ? (equipment as Shield) : null;

    // Format weapon damage
    const formatDamage = (weapon: Weapon): string => {
        const { damage } = weapon;
        let result = `${damage.count}d${damage.die}`;
        if (damage.bonus) {
            result += ` + ${damage.bonus}`;
        }
        result += ` ${damage.damageType}`;
        return result;
    };

    // Format weapon range
    const formatRange = (weapon: Weapon): string | null => {
        if (!weapon.range) return null;
        return `${weapon.range.normal}/${weapon.range.max} ft`;
    };

    // Format weapon properties
    const formatProperties = (properties: string[]): string => {
        return properties.join(", ");
    };

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-2 pb-2 p-3 sm:p-4">
                <div className="w-full">
                    <CardTitle className="text-base sm:text-lg break-words">
                        {equipment.name}
                    </CardTitle>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        classNames={{ base: "min-h-[32px]" }}
                    >
                        {equipment.type}
                    </Chip>
                    <Chip size="sm" variant="flat" classNames={{ base: "min-h-[32px]" }}>
                        {equipment.tier}
                    </Chip>
                    {weapon?.powered && (
                        <Chip
                            size="sm"
                            variant="flat"
                            color="warning"
                            classNames={{ base: "min-h-[32px]" }}
                        >
                            Powered
                        </Chip>
                    )}
                    {armor?.powered && (
                        <Chip
                            size="sm"
                            variant="flat"
                            color="warning"
                            classNames={{ base: "min-h-[32px]" }}
                        >
                            Powered
                        </Chip>
                    )}
                </div>
            </CardHeader>

            <CardBody className="gap-3 sm:gap-4 pt-2 p-3 sm:p-4">
                {/* Weapon Stats */}
                {weapon && (
                    <>
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Weapon Stats
                            </SecondaryText>
                            <StatRow>
                                <PrimaryStat label="Damage" value={formatDamage(weapon)} />
                                <Stat label="Type" value={weapon.weaponType} />
                            </StatRow>
                            <StatRow>
                                <Stat
                                    label="Properties"
                                    value={formatProperties(weapon.properties)}
                                />
                            </StatRow>
                            {weapon.range && (
                                <StatRow>
                                    <Stat label="Range" value={formatRange(weapon)!} />
                                </StatRow>
                            )}
                            {weapon.ammoType && (
                                <StatRow>
                                    <Stat label="Ammo Type" value={weapon.ammoType} />
                                </StatRow>
                            )}
                        </div>
                        <Divider />
                    </>
                )}

                {/* Armor Stats */}
                {armor && (
                    <>
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Armor Stats
                            </SecondaryText>
                            <StatRow>
                                <PrimaryStat
                                    label="Armor Class"
                                    value={armor.armorClass.toString()}
                                />
                                <Stat label="Type" value={armor.armorType} />
                            </StatRow>
                            {armor.strengthRequirement && (
                                <StatRow>
                                    <Stat label="Strength Req" value={armor.strengthRequirement} />
                                </StatRow>
                            )}
                            <StatRow>
                                <Stat
                                    label="Stealth"
                                    value={armor.stealthDisadvantage ? "Disadvantage" : "Normal"}
                                />
                            </StatRow>
                        </div>
                        <Divider />
                    </>
                )}

                {/* Shield Stats */}
                {shield && (
                    <>
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Shield Stats
                            </SecondaryText>
                            <StatRow>
                                <PrimaryStat
                                    label="AC Bonus"
                                    value={`+${shield.armorClassBonus}`}
                                />
                            </StatRow>
                        </div>
                        <Divider />
                    </>
                )}

                {/* General Stats */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        General
                    </SecondaryText>
                    <StatRow>
                        <Stat label="Cost" value={`${equipment.cost} Cogs`} />
                        <Stat label="Weight" value={`${equipment.weight} lbs`} />
                    </StatRow>
                </div>

                {/* Description */}
                {equipment.description && (
                    <>
                        <Divider />
                        <div>
                            <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                                Description
                            </SecondaryText>
                            <Description className="text-sm sm:text-base leading-relaxed break-words">
                                {equipment.description}
                            </Description>
                        </div>
                    </>
                )}

                {/* Powered Equipment Note */}
                {(weapon?.powered || armor?.powered) && (
                    <>
                        <Divider />
                        <div>
                            <TertiaryText className="text-xs sm:text-sm">
                                This equipment requires Aether Cells to function
                            </TertiaryText>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
}
