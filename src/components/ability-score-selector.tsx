import type { AbilityScores } from "@/types";
import { Button, Card, CardBody, CardHeader, Chip, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

type AbilityScoreMode = "standard-array" | "point-buy" | "roll";

interface AbilityScoreSelectorProps {
    abilityScores: AbilityScores;
    onAbilityScoresChange: (scores: AbilityScores) => void;
}

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const POINT_BUY_COSTS: Record<number, number> = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
};

const POINT_BUY_MAX = 27;

export function AbilityScoreSelector({
    abilityScores,
    onAbilityScoresChange,
}: AbilityScoreSelectorProps) {
    const [mode, setMode] = useState<AbilityScoreMode>("standard-array");
    const [availableScores, setAvailableScores] = useState<number[]>([...STANDARD_ARRAY]);

    const abilities: (keyof AbilityScores)[] = [
        "strength",
        "dexterity",
        "constitution",
        "intelligence",
        "wisdom",
        "charisma",
    ];

    const rollDice = () => {
        const rolls: number[] = [];
        for (let i = 0; i < 6; i++) {
            const fourDice = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            fourDice.sort((a, b) => b - a);
            const sum = fourDice.slice(0, 3).reduce((a, b) => a + b, 0);
            rolls.push(sum);
        }
        rolls.sort((a, b) => b - a);
        return rolls;
    };

    const handleModeChange = (newMode: AbilityScoreMode) => {
        setMode(newMode);

        if (newMode === "standard-array") {
            setAvailableScores([...STANDARD_ARRAY]);
            // Reset all scores to 10
            const resetScores: AbilityScores = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
            };
            onAbilityScoresChange(resetScores);
        } else if (newMode === "roll") {
            const rolled = rollDice();
            setAvailableScores(rolled);
            // Reset all scores to 10
            const resetScores: AbilityScores = {
                strength: 10,
                dexterity: 10,
                constitution: 10,
                intelligence: 10,
                wisdom: 10,
                charisma: 10,
            };
            onAbilityScoresChange(resetScores);
        } else if (newMode === "point-buy") {
            // Start with all 8s for point buy
            const resetScores: AbilityScores = {
                strength: 8,
                dexterity: 8,
                constitution: 8,
                intelligence: 8,
                wisdom: 8,
                charisma: 8,
            };
            onAbilityScoresChange(resetScores);
        }
    };

    const handleRollAgain = () => {
        const rolled = rollDice();
        setAvailableScores(rolled);
        // Reset all scores to 10
        const resetScores: AbilityScores = {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10,
        };
        onAbilityScoresChange(resetScores);
    };

    const handleStandardArrayChange = (ability: keyof AbilityScores, value: string) => {
        const newValue = parseInt(value);
        const oldValue = abilityScores[ability];

        // Return old value to available pool if it was from the array
        let newAvailable = [...availableScores];
        if (oldValue !== 10 && STANDARD_ARRAY.includes(oldValue)) {
            newAvailable.push(oldValue);
        }

        // Remove new value from available pool
        const index = newAvailable.indexOf(newValue);
        if (index > -1) {
            newAvailable.splice(index, 1);
        }

        newAvailable.sort((a, b) => b - a);
        setAvailableScores(newAvailable);

        onAbilityScoresChange({
            ...abilityScores,
            [ability]: newValue,
        });
    };

    const calculatePointBuyTotal = () => {
        return abilities.reduce((total, ability) => {
            const score = abilityScores[ability];
            return total + (POINT_BUY_COSTS[score] || 0);
        }, 0);
    };

    const handlePointBuyChange = (ability: keyof AbilityScores, increment: boolean) => {
        const currentScore = abilityScores[ability];
        const newScore = increment ? currentScore + 1 : currentScore - 1;

        if (newScore < 8 || newScore > 15) return;

        const currentTotal = calculatePointBuyTotal();
        const currentCost = POINT_BUY_COSTS[currentScore] || 0;
        const newCost = POINT_BUY_COSTS[newScore] || 0;
        const costDiff = newCost - currentCost;

        if (currentTotal + costDiff > POINT_BUY_MAX) return;

        onAbilityScoresChange({
            ...abilityScores,
            [ability]: newScore,
        });
    };

    const pointsRemaining = POINT_BUY_MAX - calculatePointBuyTotal();

    return (
        <Card>
            <CardHeader>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
                        Ability Scores
                    </h3>
                    <Select
                        label="Generation Method"
                        selectedKeys={[mode]}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0] as AbilityScoreMode;
                            handleModeChange(selected);
                        }}
                        size="sm"
                    >
                        <SelectItem key="standard-array">Standard Array (15, 14, 13, 12, 10, 8)</SelectItem>
                        <SelectItem key="point-buy">Point Buy (27 points)</SelectItem>
                        <SelectItem key="roll">Roll 4d6 Drop Lowest</SelectItem>
                    </Select>
                </div>
            </CardHeader>
            <CardBody>
                {mode === "point-buy" && (
                    <div style={{ marginBottom: "1rem" }}>
                        <Chip color={pointsRemaining === 0 ? "success" : "primary"} variant="flat">
                            Points Remaining: {pointsRemaining} / {POINT_BUY_MAX}
                        </Chip>
                    </div>
                )}

                {mode === "roll" && (
                    <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem", alignItems: "center" }}>
                        <div style={{ fontSize: "0.875rem" }}>
                            Rolled: {availableScores.join(", ")}
                        </div>
                        <Button size="sm" variant="flat" onPress={handleRollAgain}>
                            Roll Again
                        </Button>
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {abilities.map((ability) => (
                        <div
                            key={ability}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "1rem",
                            }}
                        >
                            <div style={{ minWidth: "120px", textTransform: "capitalize" }}>
                                {ability}
                            </div>

                            {mode === "standard-array" || mode === "roll" ? (
                                <Select
                                    selectedKeys={[abilityScores[ability].toString()]}
                                    onSelectionChange={(keys) => {
                                        const value = Array.from(keys)[0] as string;
                                        handleStandardArrayChange(ability, value);
                                    }}
                                    size="sm"
                                    className="max-w-xs"
                                    aria-label={`${ability} score`}
                                >
                                    {[
                                        <SelectItem key="10">10 (default)</SelectItem>,
                                        ...availableScores.map((score) => (
                                            <SelectItem key={score.toString()}>{score}</SelectItem>
                                        )),
                                        ...(abilityScores[ability] !== 10 &&
                                        !availableScores.includes(abilityScores[ability])
                                            ? [
                                                  <SelectItem
                                                      key={abilityScores[ability].toString()}
                                                  >
                                                      {abilityScores[ability]} (current)
                                                  </SelectItem>,
                                              ]
                                            : []),
                                    ]}
                                </Select>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        onPress={() => handlePointBuyChange(ability, false)}
                                        isDisabled={abilityScores[ability] <= 8}
                                    >
                                        -
                                    </Button>
                                    <div
                                        style={{
                                            minWidth: "40px",
                                            textAlign: "center",
                                            fontWeight: 600,
                                        }}
                                    >
                                        {abilityScores[ability]}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        onPress={() => handlePointBuyChange(ability, true)}
                                        isDisabled={
                                            abilityScores[ability] >= 15 ||
                                            pointsRemaining <
                                                (POINT_BUY_COSTS[abilityScores[ability] + 1] || 0) -
                                                    (POINT_BUY_COSTS[abilityScores[ability]] || 0)
                                        }
                                    >
                                        +
                                    </Button>
                                    <div style={{ fontSize: "0.75rem", opacity: 0.7, minWidth: "60px" }}>
                                        ({POINT_BUY_COSTS[abilityScores[ability]] || 0} pts)
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {mode === "standard-array" && availableScores.length > 0 && (
                    <div style={{ marginTop: "1rem", fontSize: "0.875rem", opacity: 0.7 }}>
                        Unassigned scores: {availableScores.join(", ")}
                    </div>
                )}
            </CardBody>
        </Card>
    );
}
