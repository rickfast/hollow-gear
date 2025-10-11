import type { HitPoints } from "@/types";
import { Progress } from "@heroui/react";

export const PointBar = ({
    label,
    points,
    invert = false,
}: {
    label: string;
    points: HitPoints;
    invert?: boolean;
}) => {
    const color = invert
        ? points.current / points.maximum > 0.5
            ? "danger"
            : points.current / points.maximum > 0.2
              ? "warning"
              : "success"
        : points.current / points.maximum > 0.5
          ? "success"
          : points.current / points.maximum > 0.2
            ? "warning"
            : "danger";

    return (
        <div style={{ marginTop: "1.5rem" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                }}
            >
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: "0.875rem" }}>
                    {points.current} / {points.maximum}
                </span>
            </div>
            <Progress value={(points.current / points.maximum) * 100} size="md" color={color} />
            {points.temporary ||
                (0 > 0 && (
                    <div
                        style={{
                            fontSize: "0.75rem",
                            marginTop: "0.25rem",
                            opacity: 0.7,
                        }}
                    >
                        +{points.temporary} temp HP
                    </div>
                ))}
        </div>
    );
};
