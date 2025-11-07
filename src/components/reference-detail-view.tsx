import { ARCANE_ITEMS, ARMOR, BASIC_EQUIPMENT, SHIELDS, WEAPONS } from "@/data/equipment";
import { MINDCRAFT_POWERS } from "@/data/mindcraft";
import { FORMULAE, MIRACLES, SPELLS } from "@/data/spells";
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
    const location = useLocation(); // Hook must be unconditionally called

    // Helper builds link to detail view via query params
    const buildLink = (category: string, id: string) => {
        return `${location.pathname}?category=${encodeURIComponent(category)}&itemId=${encodeURIComponent(id)}`;
    };

    // Empty state when no item selected: prepare data sets
    if (!item) {
        const species = referenceSearchService.getItemsByCategory("Species");
        const classes = referenceSearchService.getItemsByCategory("Class");
        const monsters = referenceSearchService.getItemsByCategory("Monster");
        const mindcraftPowers = MINDCRAFT_POWERS; // direct import for ordering
        // Group mindcraft powers by tier
        const mindcraftByTier: Record<number, typeof mindcraftPowers> = {};
        mindcraftPowers.forEach((p) => {
            mindcraftByTier[p.tier] ||= [] as any;
            (mindcraftByTier[p.tier] as any).push(p);
        });
        const mindcraftTiers = Object.keys(mindcraftByTier)
            .map(Number)
            .sort((a, b) => a - b);
        // Group spell subsets by level (Formulae = Arcanist, Miracles = Templar)
        const groupByLevel = (list: typeof SPELLS) => {
            const map: Record<number, typeof list> = {};
            list.forEach((spell) => {
                map[spell.level] ||= [] as any;
                (map[spell.level] as any).push(spell);
            });
            return map;
        };
        const formulaeByLevel = groupByLevel(FORMULAE);
        const miraclesByLevel = groupByLevel(MIRACLES);
        const formulaeLevels = Object.keys(formulaeByLevel)
            .map(Number)
            .sort((a, b) => a - b);
        const miraclesLevels = Object.keys(miraclesByLevel)
            .map(Number)
            .sort((a, b) => a - b);
        // Equipment groupings
        const equipmentGroups: { label: string; items: { id: string; name: string }[] }[] = [
            {
                label: "Weapons",
                items: WEAPONS.map((w) => ({ id: `equipment-${w.id}`, name: w.name })),
            },
            {
                label: "Armor",
                items: ARMOR.map((a) => ({ id: `equipment-${a.id}`, name: a.name })),
            },
            {
                label: "Shields",
                items: SHIELDS.map((s) => ({ id: `equipment-${s.id}`, name: s.name })),
            },
            {
                label: "Basic Gear",
                items: BASIC_EQUIPMENT.map((e) => ({ id: `equipment-${e.id}`, name: e.name })),
            },
            {
                label: "Arcane Items",
                items: ARCANE_ITEMS.map((e) => ({ id: `equipment-${e.id}`, name: e.name })),
            },
        ];

        // Simple collapsible section component using <details>
        const Collapsible = ({
            title,
            children,
            defaultOpen = false,
        }: {
            title: string;
            children: React.ReactNode;
            defaultOpen?: boolean;
        }) => (
            <details className="border border-default-200 rounded-md" open={defaultOpen}>
                <summary className="cursor-pointer select-none px-3 py-2 font-semibold text-sm sm:text-base bg-default-50">
                    {title}
                </summary>
                <div className="px-3 py-2 space-y-2">{children}</div>
            </details>
        );

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
                        {/* Mindcraft Powers grouped by Tier */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-semibold">Mindcraft</h3>
                            <SecondaryText className="text-xs sm:text-sm leading-relaxed">
                                Psionic disciplines and powers organized by tier.
                            </SecondaryText>
                            <div className="space-y-2">
                                {mindcraftTiers.map((tier) => (
                                    <Collapsible
                                        key={`mindcraft-tier-${tier}`}
                                        title={`Tier ${tier} (${(mindcraftByTier[tier] || []).length})`}
                                        defaultOpen={tier === 1}
                                    >
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-xs sm:text-sm">
                                            {(mindcraftByTier[tier] || []).map((p) => (
                                                <li key={p.id}>
                                                    <Link
                                                        to={buildLink(
                                                            "Mindcraft",
                                                            `mindcraft-${p.id}`
                                                        )}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {p.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Collapsible>
                                ))}
                            </div>
                        </section>

                        {/* Formulae (Arcanist Spells) */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-semibold">Formulae (Arcanist)</h3>
                            <SecondaryText className="text-xs sm:text-sm leading-relaxed">
                                Arcane engineering spells known to Arcanists. Grouped by level.
                            </SecondaryText>
                            <div className="space-y-2">
                                {formulaeLevels.map((lvl) => (
                                    <Collapsible
                                        key={`formulae-${lvl}`}
                                        title={lvl === 0 ? "Cantrips (Level 0)" : `Level ${lvl}`}
                                        defaultOpen={lvl <= 1}
                                    >
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-xs sm:text-sm">
                                            {(formulaeByLevel[lvl] || []).map((spell) => (
                                                <li key={`formulae-${spell.name}`}>
                                                    <Link
                                                        to={buildLink(
                                                            "Spell",
                                                            `spell-${spell.name}`
                                                        )}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {spell.hollowgearName || spell.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Collapsible>
                                ))}
                            </div>
                        </section>

                        {/* Miracles (Templar Spells) */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-semibold">Miracles (Templar)</h3>
                            <SecondaryText className="text-xs sm:text-sm leading-relaxed">
                                Radiant psionic invocations channeled by Templars. Grouped by level.
                            </SecondaryText>
                            <div className="space-y-2">
                                {miraclesLevels.map((lvl) => (
                                    <Collapsible
                                        key={`miracles-${lvl}`}
                                        title={lvl === 0 ? "Cantrips (Level 0)" : `Level ${lvl}`}
                                        defaultOpen={false}
                                    >
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-xs sm:text-sm">
                                            {(miraclesByLevel[lvl] || []).map((spell) => (
                                                <li key={`miracle-${spell.name}`}>
                                                    <Link
                                                        to={buildLink(
                                                            "Spell",
                                                            `spell-${spell.name}`
                                                        )}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {spell.hollowgearName || spell.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Collapsible>
                                ))}
                            </div>
                        </section>

                        {/* Equipment */}
                        <section className="space-y-3">
                            <h3 className="text-lg font-semibold">Equipment</h3>
                            <SecondaryText className="text-xs sm:text-sm leading-relaxed">
                                Weapons, armor, shields, gear, and arcane items. Expand a group to
                                browse.
                            </SecondaryText>
                            <div className="space-y-2">
                                {equipmentGroups.map((group) => (
                                    <Collapsible
                                        key={group.label}
                                        title={`${group.label} (${group.items.length})`}
                                        defaultOpen={group.label === "Weapons"}
                                    >
                                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1 text-xs sm:text-sm">
                                            {group.items.map((eq) => (
                                                <li key={eq.id}>
                                                    <Link
                                                        to={buildLink("Equipment", eq.id)}
                                                        className="text-primary hover:underline"
                                                    >
                                                        {eq.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </Collapsible>
                                ))}
                            </div>
                        </section>

                        <SecondaryText className="text-[11px] sm:text-xs pt-2">
                            Tip: Start typing to instantly search any item or use these quick browse
                            lists.
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
