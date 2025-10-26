import { DRONE_TEMPLATES } from "@/data/drones";
import type { DroneType } from "@/types/drones";
import { Card, CardBody, Chip } from "@heroui/react";
import { CardTitle, Stat, StatRow } from "./typography";

interface DroneTypeSelectorProps {
    selectedType: DroneType | "";
    onTypeChange: (type: DroneType) => void;
}

export function DroneTypeSelector({ selectedType, onTypeChange }: DroneTypeSelectorProps) {
    return (
        <Card>
            <CardBody>
                <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                        Select Drone Type
                    </h3>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                        Choose a chassis type for your drone. Each type has different capabilities
                        and base statistics.
                    </p>
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                        gap: "1rem",
                    }}
                    role="radiogroup"
                    aria-label="Drone type selection"
                >
                    {DRONE_TEMPLATES.map((template) => {
                        const isSelected = selectedType === template.type;

                        return (
                            <Card
                                key={template.id}
                                isPressable
                                onPress={() => onTypeChange(template.type)}
                                style={{
                                    border: isSelected
                                        ? "3px solid hsl(var(--heroui-primary))"
                                        : "2px solid hsl(var(--heroui-default-200))",
                                    backgroundColor: isSelected
                                        ? "hsl(var(--heroui-primary) / 0.1)"
                                        : "hsl(var(--heroui-default-50))",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                                    boxShadow: isSelected
                                        ? "0 0 0 2px hsl(var(--heroui-primary) / 0.3)"
                                        : "none",
                                    cursor: "pointer",
                                }}
                                role="radio"
                                aria-checked={isSelected}
                                aria-label={`${template.name} drone type`}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onTypeChange(template.type);
                                    }
                                }}
                            >
                                <CardBody style={{ padding: "1rem" }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginBottom: "0.75rem",
                                        }}
                                    >
                                        <CardTitle>{template.name}</CardTitle>
                                        {isSelected && (
                                            <div
                                                style={{
                                                    backgroundColor: "hsl(var(--heroui-primary))",
                                                    color: "white",
                                                    borderRadius: "50%",
                                                    width: "24px",
                                                    height: "24px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "14px",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                ✓
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            marginBottom: "0.75rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <Chip size="sm" variant="flat" color="default">
                                            {template.stats.size}
                                        </Chip>
                                        <Chip size="sm" variant="flat" color="primary">
                                            {template.modSlots} Mod Slot
                                            {template.modSlots !== 1 ? "s" : ""}
                                        </Chip>
                                    </div>

                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            opacity: 0.8,
                                            marginBottom: "1rem",
                                            minHeight: "2.5rem",
                                        }}
                                    >
                                        {template.description}
                                    </p>

                                    <div style={{ marginBottom: "0.75rem" }}>
                                        <StatRow>
                                            <Stat
                                                label="HP"
                                                value={template.stats.hitPoints.average}
                                            />
                                            <Stat label="AC" value={template.stats.armorClass} />
                                            <Stat
                                                label="Speed"
                                                value={`${template.stats.speed.walk} ft`}
                                            />
                                            {template.stats.speed.fly && (
                                                <Stat
                                                    label="Fly"
                                                    value={`${template.stats.speed.fly} ft`}
                                                />
                                            )}
                                        </StatRow>
                                    </div>

                                    {template.stats.attack && (
                                        <div
                                            style={{
                                                marginBottom: "0.75rem",
                                                padding: "0.5rem",
                                                backgroundColor: "hsl(var(--heroui-default-100))",
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    marginBottom: "0.25rem",
                                                }}
                                            >
                                                {template.stats.attack.name}
                                            </div>
                                            <StatRow>
                                                <Stat
                                                    label="Attack"
                                                    value={`+${template.stats.attack.bonus}`}
                                                />
                                                <Stat
                                                    label="Damage"
                                                    value={`${template.stats.attack.damage.count}d${template.stats.attack.damage.die} ${template.stats.attack.damage.damageType}`}
                                                />
                                            </StatRow>
                                        </div>
                                    )}

                                    {template.features.length > 0 && (
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    marginBottom: "0.5rem",
                                                    opacity: 0.9,
                                                }}
                                            >
                                                Features:
                                            </div>
                                            <ul
                                                style={{
                                                    fontSize: "0.75rem",
                                                    opacity: 0.8,
                                                    paddingLeft: "1.25rem",
                                                    margin: 0,
                                                }}
                                            >
                                                {template.features.map((feature, idx) => (
                                                    <li key={idx} style={{ marginBottom: "0.25rem" }}>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        );
                    })}
                </div>
            </CardBody>
        </Card>
    );
}
