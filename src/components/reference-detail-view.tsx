import type { ReferenceItem } from "@/types/reference";
import { Card, CardBody } from "@heroui/react";
import { ClassDetail } from "./class-detail";
import { EquipmentDetail } from "./equipment-detail";
import { MindcraftDetail } from "./mindcraft-detail";
import { ModDetail } from "./mod-detail";
import { MonsterDetail } from "./monster-detail";
import { SpeciesDetail } from "./species-detail";
import { SpellDetail } from "./spell-detail";
import { SecondaryText } from "./typography";

interface ReferenceDetailViewProps {
    item: ReferenceItem | null;
}

/**
 * Router component that displays the appropriate detail component based on the selected item's category
 * Shows an empty state when no item is selected
 */
export function ReferenceDetailView({ item }: ReferenceDetailViewProps) {
    // Empty state when no item is selected
    if (!item) {
        return (
            <Card className="w-full h-full flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
                <CardBody className="flex items-center justify-center p-4 sm:p-6">
                    <SecondaryText className="text-center text-sm sm:text-base px-2">
                        Select an item from the search results to view details
                    </SecondaryText>
                </CardBody>
            </Card>
        );
    }

    // Route to appropriate detail component based on category
    switch (item.category) {
        case "Spell":
            return <SpellDetail spell={item.data as any} />;

        case "Mindcraft":
            return <MindcraftDetail power={item.data as any} />;

        case "Equipment":
            return <EquipmentDetail equipment={item.data as any} />;

        case "Mod":
            return <ModDetail mod={item.data as any} />;

        case "Species":
            return <SpeciesDetail species={item.data as any} />;

        case "Class":
            return <ClassDetail classData={item.data as any} />;

        case "Monster":
            return <MonsterDetail monster={item.data as any} />;

        default:
            // Fallback for unknown category
            return (
                <Card className="w-full">
                    <CardBody>
                        <SecondaryText className="text-center">
                            Unknown item type: {item.category}
                        </SecondaryText>
                    </CardBody>
                </Card>
            );
    }
}
