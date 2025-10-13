import { DRONE_TEMPLATES_BY_ID } from "@/data";
import type { Drone } from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

interface DronesProps {
    drones: Drone[];
    activeDroneId?: string;
}

export function Drones({ drones, activeDroneId }: DronesProps) {
    if (!drones || drones.length === 0) {
        return (
            <div style={{ padding: "1rem", textAlign: "center", opacity: 0.6 }}>
                <p>No drones built yet.</p>
                <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
                    Drones can be constructed during a long rest with Tinker's Tools and 25 Cogs
                    worth of components.
                </p>
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {drones.map((drone) => {
                const template = DRONE_TEMPLATES_BY_ID[drone.templateId];
                const isActive = drone.id === activeDroneId;
                const isDestroyed = drone.destroyed;

                return (
                    <Card
                        key={drone.id}
                        style={{
                            opacity: isDestroyed ? 0.6 : 1,
                            border: isActive ? "2px solid var(--heroui-primary)" : undefined,
                        }}
                    >
                        <CardHeader
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <h4 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
                                        {drone.name}
                                    </h4>
                                    {isActive && (
                                        <Chip color="primary" size="sm" variant="flat">
                                            Active
                                        </Chip>
                                    )}
                                    {isDestroyed && (
                                        <Chip color="danger" size="sm" variant="flat">
                                            Destroyed
                                        </Chip>
                                    )}
                                </div>
                                <p style={{ margin: 0, fontSize: "0.875rem", opacity: 0.7 }}>
                                    Level {drone.level} {template?.stats.size} {template?.type} Drone
                                </p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                {/* Drone Type & Template */}
                                <div>
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            fontWeight: 600,
                                            marginBottom: "0.25rem",
                                        }}
                                    >
                                        {template?.name || "Unknown Template"}
                                    </p>
                                    <p style={{ fontSize: "0.875rem", opacity: 0.7, margin: 0 }}>
                                        {template?.description}
                                    </p>
                                </div>

                                {/* Combat Stats - Similar to Character Sheet */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: "1rem",
                                        padding: "1rem",
                                        backgroundColor: "var(--heroui-content2)",
                                        borderRadius: "0.75rem",
                                    }}
                                >
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                opacity: 0.7,
                                                marginBottom: "0.25rem",
                                                textTransform: "uppercase",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Armor Class
                                        </div>
                                        <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                                            {template?.stats.armorClass || "—"}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                opacity: 0.7,
                                                marginBottom: "0.25rem",
                                                textTransform: "uppercase",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Hit Points
                                        </div>
                                        <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                                            {drone.hitPoints.current}/{drone.hitPoints.maximum}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                opacity: 0.7,
                                                marginBottom: "0.25rem",
                                                textTransform: "uppercase",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Speed
                                        </div>
                                        <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                                            {template?.stats.speed.walk || "—"}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <div
                                            style={{
                                                fontSize: "0.75rem",
                                                opacity: 0.7,
                                                marginBottom: "0.25rem",
                                                textTransform: "uppercase",
                                                fontWeight: 600,
                                            }}
                                        >
                                            Heat
                                        </div>
                                        <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>
                                            {drone.heatPoints.current}/{drone.heatPoints.maximum}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Speed Types */}
                                {(template?.stats.speed.fly ||
                                    template?.stats.speed.climb ||
                                    template?.stats.speed.swim) && (
                                    <div>
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                marginBottom: "0.5rem",
                                                textTransform: "uppercase",
                                                opacity: 0.7,
                                            }}
                                        >
                                            Additional Movement
                                        </p>
                                        <div
                                            style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                                        >
                                            {template?.stats.speed.fly && (
                                                <Chip size="sm" variant="flat">
                                                    Fly {template.stats.speed.fly} ft
                                                </Chip>
                                            )}
                                            {template?.stats.speed.climb && (
                                                <Chip size="sm" variant="flat">
                                                    Climb {template.stats.speed.climb} ft
                                                </Chip>
                                            )}
                                            {template?.stats.speed.swim && (
                                                <Chip size="sm" variant="flat">
                                                    Swim {template.stats.speed.swim} ft
                                                </Chip>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Attack */}
                                {template?.stats.attack && (
                                    <div>
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                marginBottom: "0.25rem",
                                                textTransform: "uppercase",
                                                opacity: 0.7,
                                            }}
                                        >
                                            Attack
                                        </p>
                                        <p style={{ fontSize: "0.875rem", margin: 0 }}>
                                            <strong>{template.stats.attack.name}</strong>: +
                                            {template.stats.attack.bonus} to hit,{" "}
                                            {template.stats.attack.damage.count}d
                                            {template.stats.attack.damage.die}{" "}
                                            {template.stats.attack.damage.damageType} damage
                                        </p>
                                    </div>
                                )}

                                {/* Features */}
                                {template?.features && template.features.length > 0 && (
                                    <div>
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                marginBottom: "0.25rem",
                                                textTransform: "uppercase",
                                                opacity: 0.7,
                                            }}
                                        >
                                            Features
                                        </p>
                                        <ul
                                            style={{
                                                margin: 0,
                                                paddingLeft: "1.25rem",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            {template.features.map((feature, idx) => (
                                                <li key={idx}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Personality & Customization */}
                                {(drone.personalityQuirk || drone.customization) && (
                                    <div>
                                        <p
                                            style={{
                                                fontSize: "0.75rem",
                                                fontWeight: 600,
                                                marginBottom: "0.25rem",
                                                textTransform: "uppercase",
                                                opacity: 0.7,
                                            }}
                                        >
                                            Personality & Customization
                                        </p>
                                        {drone.personalityQuirk && (
                                            <p
                                                style={{
                                                    fontSize: "0.875rem",
                                                    fontStyle: "italic",
                                                    margin: "0 0 0.25rem 0",
                                                }}
                                            >
                                                "{drone.personalityQuirk}"
                                            </p>
                                        )}
                                        {drone.customization && (
                                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                                {drone.customization.shellFinish && (
                                                    <Chip size="sm" variant="bordered">
                                                        {drone.customization.shellFinish}
                                                    </Chip>
                                                )}
                                                {drone.customization.coreColor && (
                                                    <Chip size="sm" variant="bordered">
                                                        {drone.customization.coreColor} core
                                                    </Chip>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mod Slots */}
                                <div>
                                    <p
                                        style={{
                                            fontSize: "0.75rem",
                                            fontWeight: 600,
                                            marginBottom: "0.25rem",
                                            textTransform: "uppercase",
                                            opacity: 0.7,
                                        }}
                                    >
                                        Mod Slots
                                    </p>
                                    <p style={{ fontSize: "0.875rem", margin: 0 }}>
                                        {drone.mods.length} / {drone.modSlots} slots used
                                    </p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
}
