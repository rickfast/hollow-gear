import { Card, CardBody, CardHeader } from "@heroui/react";

export function RulesPage() {
    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <Card>
                <CardHeader>
                    <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Hollow Gear 5E Rules</h1>
                </CardHeader>
                <CardBody>
                    <div
                        style={{
                            padding: "4rem",
                            textAlign: "center",
                            opacity: 0.6,
                        }}
                    >
                        <p style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
                            Rules Reference Coming Soon
                        </p>
                        <p style={{ fontSize: "0.875rem" }}>
                            Browse the complete Hollow Gear 5E ruleset including species, classes,
                            equipment, spells, and mindcraft powers.
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
