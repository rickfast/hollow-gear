import type { FeatureDisplay } from "@/model/character-view-model";
import { Card, CardBody, Chip } from "@heroui/react";
import { CardTitle, Stat, StatRow, Description, EmptyState } from "./typography";
import { s } from "framer-motion/client";

export const Features = ({ features }: { features: FeatureDisplay[] }) => {
    if (features.length === 0) {
        return <EmptyState message="No features available" />;
    }

    return (
        <div className="space-y-2">
            {features.map((featureDisplay, index) => {
                const { type, feature, source } = featureDisplay;

                return (
                    <Card key={index} className="border border-default-200">
                        <CardBody className="p-3">
                            {/* Feature Name and Type Badge */}
                            <div className="flex items-center gap-2 mb-1">
                                <CardTitle>{feature.name}</CardTitle>
                                <Chip
                                    size="sm"
                                    variant="flat"
                                    color={type === "Class" ? "primary" : "secondary"}
                                >
                                    {source}
                                </Chip>
                            </div>

                            {/* Uses Per Rest */}
                            {feature.usesPerRest && (
                                <StatRow>
                                    <Stat
                                        label="Uses"
                                        value={`${feature.usesPerRest.amount} / ${feature.usesPerRest.restType} rest`}
                                    />
                                </StatRow>
                            )}

                            {/* Description */}
                            <Description>{feature.description}</Description>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
};
