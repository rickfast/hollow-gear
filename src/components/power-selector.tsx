import { MINDCRAFT_POWERS } from "@/data";
import { Card, CardBody, Checkbox, Chip } from "@heroui/react";
import { useState } from "react";
import { CardTitle, Stat, StatRow } from "./typography";

interface PowerSelectorProps {
    selectedPowers: string[];
    maxPowers: number;
    onPowersChange: (powers: string[]) => void;
    level?: number;
}

export function PowerSelector({
    selectedPowers,
    maxPowers,
    onPowersChange,
    level = 1,
}: PowerSelectorProps) {
    const [filter, setFilter] = useState<string>("all");

    // Filter powers by tier based on level
    // Tier 1: Levels 1-4, Tier 2: Levels 5-8, Tier 3: Levels 9+
    const maxTier = level >= 9 ? 3 : level >= 5 ? 2 : 1;

    const availablePowers = MINDCRAFT_POWERS.filter((power) => power.tier <= maxTier);

    const disciplines = Array.from(new Set(availablePowers.map((p) => p.discipline)));

    const filteredPowers =
        filter === "all" ? availablePowers : availablePowers.filter((p) => p.discipline === filter);

    const handleTogglePower = (powerId: string) => {
        if (selectedPowers.includes(powerId)) {
            onPowersChange(selectedPowers.filter((id) => id !== powerId));
        } else if (selectedPowers.length < maxPowers) {
            onPowersChange([...selectedPowers, powerId]);
        }
    };

    const getDisciplineColor = (discipline: string) => {
        const colors: Record<string, "primary" | "secondary" | "success" | "warning" | "danger"> = {
            Flux: "danger",
            Echo: "primary",
            Eidolon: "secondary",
            Veil: "success",
            Kinesis: "warning",
            Empathy: "primary",
        };
        return colors[discipline] || "default";
    };

    return (
        <Card>
            <CardBody>
                <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                        Select Mindcraft Powers
                    </h3>
                    <div
                        style={{
                            display: "flex",
                            gap: "0.5rem",
                            alignItems: "center",
                            marginBottom: "1rem",
                        }}
                    >
                        <Chip
                            color={selectedPowers.length === maxPowers ? "success" : "primary"}
                            variant="flat"
                        >
                            {selectedPowers.length} / {maxPowers} selected
                        </Chip>
                        <Chip color="default" variant="flat">
                            Max Tier: {maxTier}
                        </Chip>
                    </div>

                    {/* Discipline Filter */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        <Chip
                            onClick={() => setFilter("all")}
                            variant={filter === "all" ? "solid" : "flat"}
                            color="default"
                            style={{ cursor: "pointer" }}
                        >
                            All
                        </Chip>
                        {disciplines.map((discipline) => (
                            <Chip
                                key={discipline}
                                onClick={() => setFilter(discipline)}
                                variant={filter === discipline ? "solid" : "flat"}
                                color={getDisciplineColor(discipline)}
                                style={{ cursor: "pointer" }}
                            >
                                {discipline}
                            </Chip>
                        ))}
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {filteredPowers.map((power) => {
                        const isSelected = selectedPowers.includes(power.id);
                        const canSelect = isSelected || selectedPowers.length < maxPowers;

                        return (
                            <Card
                                key={power.id}
                                style={{
                                    opacity: canSelect ? 1 : 0.5,
                                    border: isSelected
                                        ? "2px solid hsl(var(--heroui-primary))"
                                        : "1px solid hsl(var(--heroui-default-200))",
                                }}
                            >
                                <CardBody style={{ padding: "0.75rem" }}>
                                    <div style={{ display: "flex", gap: "0.75rem" }}>
                                        <Checkbox
                                            isSelected={isSelected}
                                            onValueChange={() => handleTogglePower(power.id)}
                                            isDisabled={!canSelect}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "0.5rem",
                                                    marginBottom: "0.25rem",
                                                    flexWrap: "wrap",
                                                }}
                                            >
                                                <CardTitle>{power.name}</CardTitle>
                                                <Chip size="sm" variant="flat" color="default">
                                                    Tier {power.tier}
                                                </Chip>
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    color={getDisciplineColor(power.discipline)}
                                                >
                                                    {power.discipline}
                                                </Chip>
                                                {power.concentration && (
                                                    <Chip size="sm" variant="flat" color="warning">
                                                        Concentration
                                                    </Chip>
                                                )}
                                                {power.amplifiable && (
                                                    <Chip size="sm" variant="flat" color="success">
                                                        Amplifiable
                                                    </Chip>
                                                )}
                                            </div>

                                            <div
                                                style={{
                                                    marginBottom: "0.5rem",
                                                    fontSize: "0.875rem",
                                                    opacity: 0.8,
                                                }}
                                            >
                                                {power.effect}
                                            </div>

                                            <StatRow>
                                                <Stat label="Cost" value={`${power.afpCost} AFP`} />
                                                {power.range && (
                                                    <Stat label="Range" value={power.range} />
                                                )}
                                                {power.duration && (
                                                    <Stat label="Duration" value={power.duration} />
                                                )}
                                                {power.savingThrow && (
                                                    <Stat
                                                        label="Save"
                                                        value={`DC ${power.savingThrow.dc} ${power.savingThrow.ability.substring(0, 3).toUpperCase()}`}
                                                    />
                                                )}
                                            </StatRow>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>

                {filteredPowers.length === 0 && (
                    <div style={{ textAlign: "center", padding: "2rem", opacity: 0.7 }}>
                        No powers available for this filter.
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
