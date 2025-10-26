import { DRONE_ARCHETYPES_BY_ID, DRONE_TEMPLATES_BY_ID } from "@/data/drones";
import type { Character } from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

interface DroneSummaryProps {
    name: string;
    templateId: string;
    archetypeId?: string;
    level: number;
    mods: string[];
    owner?: Character;
}

export function DroneSummary({
    name,
    templateId,
    archetypeId,
    level,
    mods,
    owner,
}: DroneSummaryProps) {
    const template = DRONE_TEMPLATES_BY_ID[templateId];
    const archetype = archetypeId ? DRONE_ARCHETYPES_BY_ID[archetypeId] : undefined;

    // Calculate final stats based on template, archetype, and level
    const calculateFinalStats = () => {
        if (!template) return null;

        // Base stats from template
        let ac = template.stats.armorClass;
        let hp = template.stats.hitPoints.average;
        let modSlots = template.modSlots;

        // Apply archetype bonuses
        if (archetype?.baseStats) {
            if (archetype.baseStats.armorClass) {
                ac = archetype.baseStats.armorClass;
            }
        }

        // Apply level-based bonuses (from drone evolutions)
        // Level 5: +1 AC, +5 HP, +1 mod slot
        if (level >= 5) {
            ac += 1;
            hp += 5;
            modSlots += 1;
        }

        // Level 9: Additional features
        // Level 13: Self-direction feature

        return { ac, hp, modSlots };
    };

    const finalStats = calculateFinalStats();

    // Get speed information
    const getSpeed = () => {
        if (!template) return null;

        const speed = { ...template.stats.speed };

        // Apply archetype speed modifications
        if (archetype?.baseStats?.speed) {
            Object.assign(speed, archetype.baseStats.speed);
        }

        return speed;
    };

    const speed = getSpeed();

    // Get all features
    const getAllFeatures = () => {
        const features: string[] = [];

        if (template) {
            features.push(...template.features);
        }

        if (archetype) {
            features.push(...archetype.features.map((f) => f.name));
        }

        // Add level-based features
        if (level >= 9) {
            features.push("Enhanced Movement Options");
        }
        if (level >= 13) {
            features.push("Limited Self-Direction");
        }

        return features;
    };

    const allFeatures = getAllFeatures();

    return (
        <Card className="sticky top-4">
            <CardHeader>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Drone Summary</h3>
            </CardHeader>
            <CardBody>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {/* Name */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
                            NAME
                        </div>
                        <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                            {name || <span style={{ opacity: 0.4 }}>Not set</span>}
                        </div>
                    </div>

                    <Divider />

                    {/* Type */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
                            TYPE
                        </div>
                        {template ? (
                            <div>
                                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                                    {template.name}
                                </div>
                                {archetype && (
                                    <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                        {archetype.name}
                                    </div>
                                )}
                                <div
                                    style={{
                                        fontSize: "0.875rem",
                                        opacity: 0.8,
                                        marginTop: "0.25rem",
                                    }}
                                >
                                    Size: {template.stats.size}
                                </div>
                            </div>
                        ) : (
                            <span style={{ opacity: 0.4 }}>Not selected</span>
                        )}
                    </div>

                    <Divider />

                    {/* Level */}
                    <div>
                        <div style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "0.25rem" }}>
                            LEVEL
                        </div>
                        <div style={{ fontWeight: 600 }}>Level {level}</div>
                    </div>

                    {/* Stats */}
                    {finalStats && (
                        <>
                            <Divider />
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.6,
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    COMBAT STATS
                                </div>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: "0.5rem",
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>AC</div>
                                        <div style={{ fontWeight: 600, fontSize: "1.125rem" }}>
                                            {finalStats.ac}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>HP</div>
                                        <div style={{ fontWeight: 600, fontSize: "1.125rem" }}>
                                            {finalStats.hp}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                                            Mod Slots
                                        </div>
                                        <div style={{ fontWeight: 600, fontSize: "1.125rem" }}>
                                            {finalStats.modSlots}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Speed */}
                    {speed && (
                        <>
                            <Divider />
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.6,
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    SPEED
                                </div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                    <div>
                                        <span style={{ opacity: 0.8 }}>Walk:</span>{" "}
                                        <span style={{ fontWeight: 600 }}>{speed.walk} ft</span>
                                    </div>
                                    {speed.fly && (
                                        <div>
                                            <span style={{ opacity: 0.8 }}>Fly:</span>{" "}
                                            <span style={{ fontWeight: 600 }}>{speed.fly} ft</span>
                                        </div>
                                    )}
                                    {speed.climb && (
                                        <div>
                                            <span style={{ opacity: 0.8 }}>Climb:</span>{" "}
                                            <span style={{ fontWeight: 600 }}>
                                                {speed.climb} ft
                                            </span>
                                        </div>
                                    )}
                                    {speed.swim && (
                                        <div>
                                            <span style={{ opacity: 0.8 }}>Swim:</span>{" "}
                                            <span style={{ fontWeight: 600 }}>{speed.swim} ft</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Attack */}
                    {template?.stats.attack && (
                        <>
                            <Divider />
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.6,
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    ATTACK
                                </div>
                                <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
                                    {template.stats.attack.name}
                                </div>
                                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                    +{template.stats.attack.bonus} to hit, {" "}
                                    {template.stats.attack.damage.count}d
                                    {template.stats.attack.damage.die}{" "}
                                    {template.stats.attack.damage.damageType.toLowerCase()} damage
                                </div>
                            </div>
                        </>
                    )}

                    {/* Features */}
                    {allFeatures.length > 0 && (
                        <>
                            <Divider />
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.6,
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    FEATURES
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.25rem",
                                    }}
                                >
                                    {allFeatures.map((feature, index) => (
                                        <div
                                            key={index}
                                            style={{ fontSize: "0.875rem", opacity: 0.9 }}
                                        >
                                            • {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Mods */}
                    {mods.length > 0 && (
                        <>
                            <Divider />
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.6,
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    MODIFICATIONS
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.25rem",
                                    }}
                                >
                                    {mods.map((mod) => (
                                        <Chip key={mod} size="sm" variant="flat">
                                            {mod}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Owner */}
                    {owner && (
                        <>
                            <Divider />
                            <div>
                                <div
                                    style={{
                                        fontSize: "0.75rem",
                                        opacity: 0.6,
                                        marginBottom: "0.25rem",
                                    }}
                                >
                                    OWNER
                                </div>
                                <div style={{ fontWeight: 600 }}>{owner.name}</div>
                                <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                                    {owner.classes.map((c) => `${c.class} ${c.level}`).join(", ")}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </CardBody>
        </Card>
    );
}
