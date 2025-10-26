import { MODS, WEAPONS } from "@/data";
import type { DroneType, Equipment, Mod, Weapon } from "@/types";
import { Card, CardBody, Checkbox, Chip, Tooltip } from "@heroui/react";
import { useState } from "react";
import { CardTitle, Description, SecondaryText, TertiaryText } from "./typography";

interface DroneEquipmentSelectorProps {
    droneType: DroneType;
    selectedEquipment: string[];
    maxSlots: number;
    onEquipmentChange: (equipment: string[]) => void;
}

/**
 * Equipment selection interface for drones
 * Filters equipment by drone type compatibility
 * Enforces slot limitations based on drone size
 */
export function DroneEquipmentSelector({
    droneType,
    selectedEquipment,
    maxSlots,
    onEquipmentChange,
}: DroneEquipmentSelectorProps) {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "weapons" | "mods">("all");

    // Filter weapons compatible with drones
    // Drones can use: Light weapons, Simple weapons, and specific ranged weapons
    const compatibleWeapons = WEAPONS.filter((weapon) => {
        // Utility drones: Light weapons only
        if (droneType === "Utility") {
            return weapon.properties.includes("Light");
        }
        // Combat drones: Light + Simple melee/ranged
        if (droneType === "Combat") {
            return (
                weapon.properties.includes("Light") ||
                weapon.weaponType === "Melee Simple" ||
                weapon.weaponType === "Ranged Simple"
            );
        }
        // Recon drones: Light ranged only
        if (droneType === "Recon") {
            return weapon.properties.includes("Light") && weapon.weaponType.includes("Ranged");
        }
        return false;
    });

    // Filter mods compatible with drones (Tier I and II only)
    const compatibleMods = MODS.filter((mod) => {
        const tier = mod.tier.split(" ")[0]; // Extract "I", "II", etc.
        return tier === "I" || tier === "II";
    });

    const allCompatibleEquipment: Array<Equipment | Mod> = [
        ...compatibleWeapons,
        ...compatibleMods,
    ];

    // Apply filter
    const filteredEquipment = allCompatibleEquipment.filter((item) => {
        if (filter === "weapons") return "weaponType" in item;
        if (filter === "mods") return "modType" in item;
        return true;
    });

    const handleToggleEquipment = (itemId: string) => {
        const isSelected = selectedEquipment.includes(itemId);

        if (isSelected) {
            onEquipmentChange(selectedEquipment.filter((id) => id !== itemId));
        } else {
            // Check slot limit
            if (selectedEquipment.length >= maxSlots) {
                return;
            }
            onEquipmentChange([...selectedEquipment, itemId]);
        }
    };

    const renderEquipmentItem = (item: Equipment | Mod) => {
        const isSelected = selectedEquipment.includes(item.id);
        const isExpanded = expandedItem === item.id;
        const canSelect = isSelected || selectedEquipment.length < maxSlots;
        const isWeapon = "weaponType" in item;
        const isMod = "modType" in item;

        return (
            <Card
                key={item.id}
                isPressable
                onPress={() => setExpandedItem(isExpanded ? null : item.id)}
                className="border border-default-200"
                style={{ 
                    opacity: canSelect ? 1 : 0.5,
                    transition: "all 0.2s ease",
                }}
                aria-label={`${item.name} - ${isWeapon ? 'Weapon' : 'Mod'}`}
                aria-expanded={isExpanded}
            >
                <CardBody className="gap-2 py-2">
                    <div className="flex items-start gap-2">
                        <Checkbox
                            value={item.id}
                            isSelected={isSelected}
                            isDisabled={!canSelect}
                            onValueChange={() => handleToggleEquipment(item.id)}
                            classNames={{
                                wrapper: "mt-0.5",
                            }}
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="text-sm font-semibold">{item.name}</div>
                                    <TertiaryText>
                                        {isWeapon && (item as Weapon).weaponType}
                                        {isMod && (item as Mod).modType}
                                    </TertiaryText>
                                </div>
                                <div className="flex gap-1 flex-shrink-0 flex-wrap">
                                    <Chip size="sm" variant="flat">
                                        {item.tier}
                                    </Chip>
                                    {isWeapon && (
                                        <Chip size="sm" color="danger" variant="flat">
                                            Weapon
                                        </Chip>
                                    )}
                                    {isMod && (
                                        <Chip size="sm" color="primary" variant="flat">
                                            Mod
                                        </Chip>
                                    )}
                                    {item.cost && (
                                        <Chip size="sm" variant="flat">
                                            {item.cost} ⚙️
                                        </Chip>
                                    )}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="mt-2 space-y-1">
                                    {"description" in item && item.description && (
                                        <div className="text-xs text-default-600">
                                            {item.description}
                                        </div>
                                    )}

                                    {isWeapon && (
                                        <div className="flex flex-wrap gap-2 text-xs text-default-500">
                                            <span>
                                                Damage: {(item as Weapon).damage.count}d
                                                {(item as Weapon).damage.die}{" "}
                                                {(item as Weapon).damage.damageType}
                                            </span>
                                            {(item as Weapon).range && (
                                                <>
                                                    <span>•</span>
                                                    <span>
                                                        Range: {(item as Weapon).range?.normal}/
                                                        {(item as Weapon).range?.max}
                                                    </span>
                                                </>
                                            )}
                                            {(item as Weapon).properties.length > 0 && (
                                                <>
                                                    <span>•</span>
                                                    <span>
                                                        {(item as Weapon).properties.join(", ")}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {isMod && (
                                        <div className="space-y-1">
                                            <div className="text-xs text-default-600">
                                                <span className="font-semibold">Effect: </span>
                                                {(item as Mod).effect}
                                            </div>
                                            {(item as Mod).notes && (
                                                <div className="text-xs text-default-500">
                                                    {(item as Mod).notes}
                                                </div>
                                            )}
                                            {(item as Mod).malfunctionChance && (
                                                <div className="text-xs text-danger">
                                                    Malfunction: {(item as Mod).malfunctionChance}%
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    };

    return (
        <Card>
            <CardBody className="gap-4">
                <div>
                    <CardTitle>Select Equipment</CardTitle>
                    <Description>
                        Choose weapons and modifications for your {droneType} drone. Click on an
                        item to see more details.
                    </Description>
                </div>

                {/* Slot Counter */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <SecondaryText className="font-semibold">Equipment Slots</SecondaryText>
                    <Tooltip 
                        content={`Your ${droneType} drone can equip up to ${maxSlots} items. Each weapon or mod takes one slot.`}
                        placement="left"
                    >
                        <Chip
                            size="sm"
                            color={selectedEquipment.length === maxSlots ? "success" : "default"}
                            variant="flat"
                            aria-label={`${selectedEquipment.length} of ${maxSlots} equipment slots used`}
                            style={{ cursor: "help" }}
                        >
                            {selectedEquipment.length} / {maxSlots}
                        </Chip>
                    </Tooltip>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Equipment filter">
                    <Chip
                        onClick={() => setFilter("all")}
                        variant={filter === "all" ? "solid" : "flat"}
                        color="default"
                        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                        role="tab"
                        aria-selected={filter === "all"}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setFilter("all");
                            }
                        }}
                    >
                        All ({allCompatibleEquipment.length})
                    </Chip>
                    <Chip
                        onClick={() => setFilter("weapons")}
                        variant={filter === "weapons" ? "solid" : "flat"}
                        color="danger"
                        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                        role="tab"
                        aria-selected={filter === "weapons"}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setFilter("weapons");
                            }
                        }}
                    >
                        Weapons ({compatibleWeapons.length})
                    </Chip>
                    <Chip
                        onClick={() => setFilter("mods")}
                        variant={filter === "mods" ? "solid" : "flat"}
                        color="primary"
                        style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                        role="tab"
                        aria-selected={filter === "mods"}
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setFilter("mods");
                            }
                        }}
                    >
                        Mods ({compatibleMods.length})
                    </Chip>
                </div>

                {/* Equipment List */}
                <div className="space-y-2">
                    {filteredEquipment.map((item) => renderEquipmentItem(item))}
                </div>

                {filteredEquipment.length === 0 && (
                    <TertiaryText className="text-center py-4">
                        No compatible equipment available for this filter.
                    </TertiaryText>
                )}
            </CardBody>
        </Card>
    );
}
