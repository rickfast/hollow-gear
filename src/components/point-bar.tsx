import type { Points } from "@/types";
import { Button, Progress } from "@heroui/react";

export const PointBar = ({
    label,
    points,
    invert = false,
    onIncrement,
    onDecrement,
}: {
    label: string;
    points: Points;
    invert?: boolean;
    onIncrement?: () => void;
    onDecrement?: () => void;
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

    const canIncrement = points.current < points.maximum;
    const canDecrement = points.current > 0;

    return (
        <div style={{ marginTop: "1.5rem" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.5rem",
                    gap: "0.5rem",
                }}
            >
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>{label}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem" }}>
                        {points.current} / {points.maximum}
                    </span>
                    {(onIncrement || onDecrement) && (
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                onPress={onDecrement}
                                isDisabled={!canDecrement}
                                aria-label={`Decrease ${label}`}
                            >
                                −
                            </Button>
                            <Button
                                isIconOnly
                                size="sm"
                                variant="flat"
                                onPress={onIncrement}
                                isDisabled={!canIncrement}
                                aria-label={`Increase ${label}`}
                            >
                                +
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <Progress
                aria-label={label}
                value={(points.current / points.maximum) * 100}
                size="md"
                color={color}
            />
        </div>
    );
};
