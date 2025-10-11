import type { Rollable } from "@/types";
import { Avatar } from "@heroui/react";
import { toast } from "sonner";

export interface RollResult {
    rolls: number[];
    total: number;
    rollable: Rollable;
}

/**
 * Simple Dice Icon SVG Component
 */
function DiceIcon({ size = 24 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="16" cy="8" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="8" cy="16" r="1" fill="currentColor" />
            <circle cx="16" cy="16" r="1" fill="currentColor" />
        </svg>
    );
}

/**
 * Performs a dice roll for a single Rollable object
 */
function performRoll(rollable: Rollable): RollResult {
    const rolls: number[] = [];
    for (let i = 0; i < rollable.count; i++) {
        rolls.push(Math.floor(Math.random() * rollable.die) + 1);
    }
    const diceTotal = rolls.reduce((sum, roll) => sum + roll, 0);
    const total = diceTotal + (rollable.bonus || 0);

    return {
        rolls,
        total,
        rollable,
    };
}

/**
 * Performs rolls for multiple Rollable objects
 */
function performRolls(rollables: Rollable[]): RollResult[] {
    return rollables.map(performRoll);
}

/**
 * Formats a roll result as a string
 */
function formatRollResult(result: RollResult): string {
    const diceNotation = `${result.rollable.count}d${result.rollable.die}`;
    const rollsDisplay = result.rolls.join(" + ");
    const bonus = result.rollable.bonus || 0;
    const bonusDisplay = bonus > 0 ? ` + ${bonus}` : bonus < 0 ? ` - ${Math.abs(bonus)}` : "";

    return `${diceNotation}${bonusDisplay}: [${rollsDisplay}]${bonusDisplay} = ${result.total}`;
}

/**
 * Shows a toast with roll results
 */
export function showRollToast(title: string, rollables: Rollable[]) {
    const results = performRolls(rollables);
    const grandTotal = results.reduce((sum, result) => sum + result.total, 0);

    toast(
        <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-primary mt-1">
                <img width={42} src="/dice/d20.png" />
            </div>
            <div className="flex-1">
                <div className="font-bold text-base mb-2">{title}</div>
                <div className="space-y-1 text-sm">
                    {results.map((result, index) => (
                        <div key={index} className="font-mono text-xs">
                            {formatRollResult(result)}
                        </div>
                    ))}
                    {results.length > 1 && (
                        <div className="font-bold text-base mt-2 pt-2 border-t border-default-200">
                            Total: {grandTotal}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        {
            duration: 5000,
            classNames: {
                toast: "bg-background border-default-200",
            },
        }
    );
}

/**
 * Roll component - wrapper for triggering rolls
 */
interface RollProps {
    title: string;
    rollables: Rollable[];
    children: (roll: () => void) => React.ReactNode;
}

const audio = new Audio("/dice.mp3");

export function Roll({ title, rollables, children }: RollProps) {
    const handleRoll = () => {
        audio.play();
        showRollToast(title, rollables);
    };

    return <>{children(handleRoll)}</>;
}
