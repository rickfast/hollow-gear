import { Card, CardBody, CardHeader } from "@heroui/react";

export function CharacterBuilderPage() {
    return (
        <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
            <Card>
                <CardHeader>
                    <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Character Builder</h1>
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
                            Character Builder Coming Soon
                        </p>
                        <p style={{ fontSize: "0.875rem" }}>
                            Create custom characters with the full Hollow Gear 5E character creation
                            system.
                        </p>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
