import type { Class, Subclass } from "@/types/classes";
import {
    buildReferencePath,
    getClassReferenceTarget,
    getSubclassReferenceTarget,
} from "@/utils/reference-links";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Link } from "react-router-dom";
import { Description, SecondaryText, TertiaryText } from "./typography";

// Data passed from reference search service
export interface SubclassDetailData {
    parentClass: Class;
    subclass: Subclass;
}

interface SubclassDetailProps {
    data: SubclassDetailData;
}

/**
 * Displays subclass features and context linking back to parent class.
 */
export function SubclassDetail({ data }: SubclassDetailProps) {
    const { parentClass, subclass } = data;
    const allFeatures = [...subclass.features].sort((a, b) => a.level - b.level);

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-2 p-3 sm:p-4 pb-2">
                <div className="flex flex-wrap gap-2 items-center">
                    <h2 className="text-base sm:text-lg font-semibold break-words">
                        {subclass.type}
                    </h2>
                    <Link
                        to={buildReferencePath(getClassReferenceTarget(parentClass.type))}
                        className="inline-flex"
                    >
                        <Chip
                            size="sm"
                            variant="flat"
                            color="primary"
                            classNames={{ base: "min-h-[32px]" }}
                        >
                            {parentClass.type}
                        </Chip>
                    </Link>
                </div>
                <TertiaryText className="text-xs sm:text-sm break-words">
                    {parentClass.description.role}
                </TertiaryText>
            </CardHeader>
            <CardBody className="gap-3 sm:gap-4 p-3 sm:p-4 pt-2">
                {/* Summary */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Summary
                    </SecondaryText>
                    <Description className="text-sm sm:text-base leading-relaxed break-words">
                        {subclass.type} is an archetype of the {parentClass.type}. Features gained
                        at key levels are listed below.
                    </Description>
                </div>
                <Divider />
                {/* Features */}
                <div>
                    <SecondaryText className="font-semibold mb-1.5 sm:mb-2 block text-sm sm:text-base">
                        Features
                    </SecondaryText>
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {allFeatures.map((feature, i) => (
                            <div key={i} className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <TertiaryText className="font-semibold text-sm sm:text-base break-words">
                                        {feature.name}
                                    </TertiaryText>
                                    <Chip
                                        size="sm"
                                        variant="flat"
                                        color="primary"
                                        classNames={{ base: "min-h-[32px]" }}
                                    >
                                        Level {feature.level}
                                    </Chip>
                                    {feature.usesPerRest && (
                                        <Chip
                                            size="sm"
                                            variant="flat"
                                            color="success"
                                            classNames={{ base: "min-h-[32px]" }}
                                        >
                                            {feature.usesPerRest.amount}/
                                            {feature.usesPerRest.restType} rest
                                        </Chip>
                                    )}
                                </div>
                                <Description className="text-sm sm:text-base leading-relaxed break-words">
                                    {feature.description}
                                </Description>
                            </div>
                        ))}
                    </div>
                </div>
                <Divider />
                {/* Navigation helpers */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Link
                        to={buildReferencePath(
                            getSubclassReferenceTarget(parentClass.type, subclass.type)
                        )}
                        className="inline-flex"
                    >
                        <Chip size="sm" variant="bordered" classNames={{ base: "min-h-[32px]" }}>
                            Permalink
                        </Chip>
                    </Link>
                    <Link
                        to={buildReferencePath(getClassReferenceTarget(parentClass.type))}
                        className="inline-flex"
                    >
                        <Chip size="sm" variant="bordered" classNames={{ base: "min-h-[32px]" }}>
                            View Class
                        </Chip>
                    </Link>
                </div>
            </CardBody>
        </Card>
    );
}
