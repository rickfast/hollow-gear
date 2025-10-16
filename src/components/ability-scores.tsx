import type { AbilityScores as AbilityScoresType } from "@/types";

interface AbilityScore {
    score: number;
    modifierDisplay: string;
}

interface AbilityScoresProps {
    abilityScores: Record<keyof AbilityScoresType, AbilityScore>;
    compact?: boolean;
}

export function AbilityScores({ abilityScores, compact = false }: AbilityScoresProps) {
    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: compact ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                gap: compact ? "0.5rem" : "1rem",
            }}
        >
            {(Object.entries(abilityScores) as [keyof typeof abilityScores, AbilityScore][]).map(
                ([ability, value]) => (
                    <div
                        key={ability}
                        style={{
                            textAlign: "center",
                            padding: compact ? "0.5rem" : "0.75rem",
                            border: "2px solid rgba(0,0,0,0.1)",
                            borderRadius: "8px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "0.75rem",
                                textTransform: "uppercase",
                                opacity: 0.7,
                                marginBottom: "0.25rem",
                            }}
                        >
                            {ability.substring(0, 3)}
                        </div>
                        <div
                            style={{
                                fontSize: compact ? "1.25rem" : "1.5rem",
                                fontWeight: 700,
                            }}
                        >
                            {value.score}
                        </div>
                        <div style={{ fontSize: "0.875rem", opacity: 0.8 }}>
                            {value.modifierDisplay}
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
