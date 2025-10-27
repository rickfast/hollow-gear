import { DRONE_ARCHETYPES } from "@/data/drones";
import { Card, CardBody, Chip } from "@heroui/react";
import { CardTitle } from "./typography";

interface DroneArchetypeSelectorProps {
    selectedArchetypeId: string;
    onArchetypeChange: (archetypeId: string) => void;
}

export function DroneArchetypeSelector({
    selectedArchetypeId,
    onArchetypeChange,
}: DroneArchetypeSelectorProps) {
    return (
        <Card>
            <CardBody>
                <div style={{ marginBottom: "1rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                        Select Drone Archetype (Optional)
                    </h3>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                        Choose an archetype to give your drone unique characteristics and abilities.
                        You can skip this step to create a standard drone.
                    </p>
                </div>

                {/* None Option */}
                <div style={{ marginBottom: "1rem" }}>
                    <Card
                        isPressable
                        onPress={() => onArchetypeChange("")}
                        style={{
                            border:
                                selectedArchetypeId === ""
                                    ? "3px solid hsl(var(--heroui-primary))"
                                    : "2px solid hsl(var(--heroui-default-200))",
                            backgroundColor:
                                selectedArchetypeId === ""
                                    ? "hsl(var(--heroui-primary) / 0.1)"
                                    : "hsl(var(--heroui-default-50))",
                            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                            transform: selectedArchetypeId === "" ? "scale(1.02)" : "scale(1)",
                            boxShadow:
                                selectedArchetypeId === ""
                                    ? "0 0 0 2px hsl(var(--heroui-primary) / 0.3)"
                                    : "none",
                            cursor: "pointer",
                        }}
                        role="radio"
                        aria-checked={selectedArchetypeId === ""}
                        aria-label="No archetype - standard drone"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                onArchetypeChange("");
                            }
                        }}
                    >
                        <CardBody style={{ padding: "1rem" }}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <CardTitle>Standard Drone</CardTitle>
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            opacity: 0.8,
                                            marginTop: "0.25rem",
                                        }}
                                    >
                                        No archetype - uses base template stats only
                                    </p>
                                </div>
                                {selectedArchetypeId === "" && (
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
                        </CardBody>
                    </Card>
                </div>

                {/* Archetype Options */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
                        gap: "1rem",
                    }}
                    role="radiogroup"
                    aria-label="Drone archetype selection"
                >
                    {DRONE_ARCHETYPES.map((archetype) => {
                        const isSelected = selectedArchetypeId === archetype.id;

                        return (
                            <Card
                                key={archetype.id}
                                isPressable
                                onPress={() => onArchetypeChange(archetype.id)}
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
                                aria-label={`${archetype.name} archetype`}
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onArchetypeChange(archetype.id);
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
                                        <CardTitle>{archetype.name}</CardTitle>
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
                                        <Chip size="sm" variant="flat" color="secondary">
                                            {archetype.archetype}
                                        </Chip>
                                        {archetype.baseStats.size && (
                                            <Chip size="sm" variant="flat" color="default">
                                                {archetype.baseStats.size}
                                            </Chip>
                                        )}
                                    </div>

                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            opacity: 0.8,
                                            marginBottom: "1rem",
                                            minHeight: "2.5rem",
                                        }}
                                    >
                                        {archetype.description}
                                    </p>

                                    {/* Stat Modifications */}
                                    {(archetype.baseStats.armorClass ||
                                        archetype.baseStats.speed) && (
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
                                                Stat Modifications
                                            </div>
                                            <div style={{ fontSize: "0.75rem", opacity: 0.8 }}>
                                                {archetype.baseStats.armorClass && (
                                                    <div>AC: {archetype.baseStats.armorClass}</div>
                                                )}
                                                {archetype.baseStats.speed?.walk && (
                                                    <div>
                                                        Speed: {archetype.baseStats.speed.walk} ft
                                                    </div>
                                                )}
                                                {archetype.baseStats.speed?.fly && (
                                                    <div>
                                                        Fly: {archetype.baseStats.speed.fly} ft
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Features */}
                                    {archetype.features.length > 0 && (
                                        <div>
                                            <div
                                                style={{
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                    marginBottom: "0.5rem",
                                                    opacity: 0.9,
                                                }}
                                            >
                                                Special Features:
                                            </div>
                                            <ul
                                                style={{
                                                    fontSize: "0.75rem",
                                                    opacity: 0.8,
                                                    paddingLeft: "1.25rem",
                                                    margin: 0,
                                                }}
                                            >
                                                {archetype.features.map((feature, idx) => (
                                                    <li
                                                        key={idx}
                                                        style={{ marginBottom: "0.25rem" }}
                                                    >
                                                        <strong>{feature.name}:</strong>{" "}
                                                        {feature.description}
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
