import { referenceSearchService } from "@/service/reference-search-service";
import type { ReferenceItem } from "@/types/reference";
import { Card, CardBody } from "@heroui/react";
import { Link, useLocation } from "react-router-dom";
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
        // Preload category lists for quick navigation
        const species = referenceSearchService.getItemsByCategory("Species");
        const classes = referenceSearchService.getItemsByCategory("Class");
        const monsters = referenceSearchService.getItemsByCategory("Monster");
        const location = useLocation();

        const buildLink = (category: string, id: string) => {
            // Preserve pathname, replace search params
            return `${location.pathname}?category=${encodeURIComponent(category)}&itemId=${encodeURIComponent(id)}`;
        };

        return (
            <Card className="w-full h-full min-h-[300px] sm:min-h-[400px]">
                <CardBody className="p-4 sm:p-6">
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-1">
                                Reference Table of Contents
                            </h2>
                            <SecondaryText className="text-sm sm:text-base">
                                Nothing selected yet. Use the search on the left or browse the core
                                categories below.
                            </SecondaryText>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Species */}
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Species</h3>
                                <SecondaryText className="text-xs sm:text-sm leading-relaxed mb-3">
                                    Playable origins with unique traits, ability score adjustments,
                                    and special features.
                                </SecondaryText>
                                <ul className="space-y-1 max-h-[260px] overflow-auto pr-1">
                                    {species.map((s) => (
                                        <li key={s.id}>
                                            <Link
                                                to={buildLink(s.category, s.id)}
                                                className="text-primary hover:underline text-xs sm:text-sm"
                                            >
                                                {s.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            {/* Classes */}
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Classes</h3>
                                <SecondaryText className="text-xs sm:text-sm leading-relaxed mb-3">
                                    Archetypes that define a character’s role, progression, powers
                                    and proficiencies.
                                </SecondaryText>
                                <ul className="space-y-1 max-h-[260px] overflow-auto pr-1">
                                    {classes.map((c) => (
                                        <li key={c.id}>
                                            <Link
                                                to={buildLink(c.category, c.id)}
                                                className="text-primary hover:underline text-xs sm:text-sm"
                                            >
                                                {c.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                            {/* Monsters */}
                            <section>
                                <h3 className="text-lg font-semibold mb-2">Monsters</h3>
                                <SecondaryText className="text-xs sm:text-sm leading-relaxed mb-3">
                                    Creatures, adversaries and NPC stat blocks for encounters and
                                    world building.
                                </SecondaryText>
                                <ul className="space-y-1 max-h-[260px] overflow-auto pr-1">
                                    {monsters.map((m) => (
                                        <li key={m.id}>
                                            <Link
                                                to={buildLink(m.category, m.id)}
                                                className="text-primary hover:underline text-xs sm:text-sm"
                                            >
                                                {m.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </div>
                        <SecondaryText className="text-[11px] sm:text-xs pt-2">
                            Tip: Start typing to instantly search spells, mindcraft powers,
                            equipment, mods and more.
                        </SecondaryText>
                    </div>
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
