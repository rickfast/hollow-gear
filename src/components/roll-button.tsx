import type { Rollable } from "@/types";
import { Button } from "@heroui/react";
import { showRollToast } from "./roll";

export const RollButton = ({
    title,
    rollables,
    children,
}: {
    title: string;
    rollables: Rollable[];
    children: React.ReactNode;
}) => {
    const handleDamageRoll = (rollables: Rollable[]) => {
        showRollToast(title, rollables);
    };

    return (
        <Button variant="bordered" size="sm" onPress={() => handleDamageRoll(rollables)}>
            {children}
        </Button>
    );
};
