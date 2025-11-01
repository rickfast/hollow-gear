import type { BestiaryEntry, CreatureAction, CreatureDamage } from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { Fragment } from "react";
import { CardTitle, Description, SecondaryText, Stat, StatRow, TertiaryText } from "./typography";

const ABILITY_ORDER: (keyof BestiaryEntry["abilities"])[] = [
    "strength",
    "dexterity",
    "constitution",
    "intelligence",
    "wisdom",
    "charisma",
];

const ABILITY_LABELS: Record<keyof BestiaryEntry["abilities"], string> = {
    strength: "STR",
    dexterity: "DEX",
    constitution: "CON",
    intelligence: "INT",
    wisdom: "WIS",
    charisma: "CHA",
};

const formatModifier = (score: number): string => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
};

const formatHitPoints = (monster: BestiaryEntry): string => {
    const { hitPoints } = monster;
    const parts = [`${hitPoints.count}d${hitPoints.die}`];
    if (hitPoints.bonus && hitPoints.bonus !== 0) {
        const sign = hitPoints.bonus > 0 ? "+" : "-";
        parts.push(`${sign} ${Math.abs(hitPoints.bonus)}`);
    }
    return `${hitPoints.average} (${parts.join(" ")})`;
};

const formatSpeed = (monster: BestiaryEntry): string => {
    const parts: string[] = [];
    const { speed } = monster;
    if (speed.walk) parts.push(`${speed.walk} ft.`);
    if (speed.fly) parts.push(`fly ${speed.fly} ft.${speed.hover ? " (hover)" : ""}`);
    if (speed.swim) parts.push(`swim ${speed.swim} ft.`);
    if (speed.climb) parts.push(`climb ${speed.climb} ft.`);
    if (speed.burrow) parts.push(`burrow ${speed.burrow} ft.`);
    return parts.join(", ");
};

const formatDamage = (damage: CreatureDamage): string => {
    const dice = `${damage.count}d${damage.die}`;
    const bonus =
        damage.bonus && damage.bonus !== 0
            ? ` ${damage.bonus > 0 ? "+" : "-"} ${Math.abs(damage.bonus)}`
            : "";
    return `${damage.average} (${dice}${bonus}) ${damage.damageType.toLowerCase()}`;
};

const formatSavingThrow = (action: CreatureAction): string | null => {
    if (!action.savingThrow) {
        return null;
    }
    const abilityLabel = ABILITY_LABELS[action.savingThrow.ability];
    return `DC ${action.savingThrow.dc} ${abilityLabel}`;
};

const formatLanguages = (languages: BestiaryEntry["languages"]): string => {
    if (Array.isArray(languages)) {
        return languages.join(", ");
    }
    return languages;
};

const formatSenses = (monster: BestiaryEntry): string => {
    const parts: string[] = [];
    monster.senses.special?.forEach((sense) => {
        parts.push(`${sense.type} ${sense.range} ft.`);
    });
    parts.push(`passive Perception ${monster.senses.passivePerception}`);
    return parts.join(", ");
};

interface MonsterDetailProps {
    monster: BestiaryEntry;
}

/**
 * Displays a bestiary entry with D&D-style stat block information
 */
export function MonsterDetail({ monster }: MonsterDetailProps) {
    const defenses: { label: string; value: string | null }[] = [];

    if (monster.resistances?.damageTypes?.length) {
        defenses.push({
            label: "Resistances",
            value: monster.resistances.damageTypes.join(", "),
        });
    }

    if (monster.immunities?.damageTypes?.length) {
        defenses.push({
            label: "Damage Immunities",
            value: monster.immunities.damageTypes.join(", "),
        });
    }

    if (monster.immunities?.conditions?.length) {
        defenses.push({
            label: "Condition Immunities",
            value: monster.immunities.conditions.join(", "),
        });
    }

    if (monster.vulnerabilities?.damageTypes?.length) {
        defenses.push({
            label: "Vulnerabilities",
            value: monster.vulnerabilities.damageTypes.join(", "),
        });
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex-col items-start gap-3 pb-2 p-3 sm:p-4">
                <div className="flex items-center gap-2 w-full">
                    {monster.emoji && (
                        <span className="text-2xl" aria-hidden>
                            {monster.emoji}
                        </span>
                    )}
                    <CardTitle className="text-base sm:text-lg break-words">
                        {monster.name}
                    </CardTitle>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Chip size="sm" variant="flat" classNames={{ base: "min-h-[28px]" }}>
                        {monster.size}
                    </Chip>
                    <Chip size="sm" variant="flat" classNames={{ base: "min-h-[28px]" }}>
                        {monster.type}
                        {monster.subtype ? ` (${monster.subtype})` : ""}
                    </Chip>
                    <Chip size="sm" variant="flat" classNames={{ base: "min-h-[28px]" }}>
                        {monster.alignment}
                    </Chip>
                    <Chip
                        size="sm"
                        variant="flat"
                        color="primary"
                        classNames={{ base: "min-h-[28px]" }}
                    >
                        CR {monster.challengeRating.rating}
                    </Chip>
                    <Chip
                        size="sm"
                        variant="flat"
                        color="secondary"
                        classNames={{ base: "min-h-[28px]" }}
                    >
                        {monster.challengeRating.xp} XP
                    </Chip>
                </div>
            </CardHeader>

            <CardBody className="gap-3 sm:gap-4 pt-2 p-3 sm:p-4">
                {monster.description && (
                    <Description className="text-sm sm:text-base leading-relaxed">
                        {monster.description}
                    </Description>
                )}

                <div>
                    <SecondaryText className="font-semibold mb-1 block text-sm sm:text-base">
                        Defenses & Vital Stats
                    </SecondaryText>
                    <StatRow>
                        <Stat
                            label="Armor Class"
                            value={`${monster.armorClass.value}${monster.armorClass.source ? ` (${monster.armorClass.source})` : ""}`}
                        />
                        <Stat label="Hit Points" value={formatHitPoints(monster)} />
                        <Stat label="Speed" value={formatSpeed(monster) || "—"} />
                    </StatRow>
                    {monster.savingThrows && monster.savingThrows.length > 0 && (
                        <StatRow>
                            <Stat
                                label="Saving Throws"
                                value={monster.savingThrows
                                    .map((save) => `${ABILITY_LABELS[save.ability]} +${save.bonus}`)
                                    .join(", ")}
                            />
                        </StatRow>
                    )}
                    {monster.skills && monster.skills.length > 0 && (
                        <StatRow>
                            <Stat
                                label="Skills"
                                value={monster.skills
                                    .map((skill) => `${skill.skill} +${skill.bonus}`)
                                    .join(", ")}
                            />
                        </StatRow>
                    )}
                    {defenses.length > 0 && (
                        <div className="mt-1 space-y-1.5">
                            {defenses.map((entry) => (
                                <Stat
                                    key={entry.label}
                                    label={entry.label}
                                    value={entry.value ?? "—"}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Divider />

                <div>
                    <SecondaryText className="font-semibold mb-1 block text-sm sm:text-base">
                        Ability Scores
                    </SecondaryText>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {ABILITY_ORDER.map((ability) => {
                            const score = monster.abilities[ability];
                            return (
                                <div
                                    key={ability}
                                    className="border border-default-200 rounded-lg p-2 flex flex-col gap-1"
                                >
                                    <SecondaryText className="text-[11px] uppercase tracking-wide">
                                        {ABILITY_LABELS[ability]}
                                    </SecondaryText>
                                    <span className="text-sm font-semibold">
                                        {score} ({formatModifier(score)})
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Divider />

                <div className="space-y-1.5">
                    <Stat label="Senses" value={formatSenses(monster)} />
                    <Stat label="Languages" value={formatLanguages(monster.languages)} />
                    {monster.environment && (
                        <Stat label="Environment" value={monster.environment.join(", ")} />
                    )}
                    {monster.tags && monster.tags.length > 0 && (
                        <Stat label="Tags" value={monster.tags.join(", ")} />
                    )}
                    {monster.rarity && <Stat label="Rarity" value={monster.rarity} />}
                </div>

                {monster.features && monster.features.length > 0 && (
                    <>
                        <Divider />
                        <div className="space-y-3">
                            <SecondaryText className="font-semibold block text-sm sm:text-base">
                                Traits
                            </SecondaryText>
                            {monster.features.map((feature) => (
                                <div key={feature.name} className="space-y-1">
                                    <span className="text-sm font-semibold">{feature.name}</span>
                                    <Description className="mb-0 leading-relaxed">
                                        {feature.description}
                                    </Description>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {monster.actions && monster.actions.length > 0 && (
                    <>
                        <Divider />
                        <ActionSection title="Actions" actions={monster.actions} />
                    </>
                )}

                {monster.reactions && monster.reactions.length > 0 && (
                    <>
                        <Divider />
                        <ActionSection title="Reactions" actions={monster.reactions} />
                    </>
                )}

                {monster.legendaryActions && monster.legendaryActions.length > 0 && (
                    <>
                        <Divider />
                        <ActionSection
                            title="Legendary Actions"
                            actions={monster.legendaryActions}
                        />
                    </>
                )}

                {monster.lore && (
                    <>
                        <Divider />
                        <TertiaryText className="leading-relaxed block">
                            {monster.lore}
                        </TertiaryText>
                    </>
                )}
            </CardBody>
        </Card>
    );
}

interface ActionSectionProps {
    title: string;
    actions: CreatureAction[];
}

const ActionSection = ({ title, actions }: ActionSectionProps) => (
    <div className="space-y-3">
        <SecondaryText className="font-semibold block text-sm sm:text-base">{title}</SecondaryText>
        <div className="space-y-3">
            {actions.map((action) => (
                <Fragment key={action.name}>
                    <div className="space-y-1">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-semibold break-words">{action.name}</span>
                            {action.actionType && (
                                <Chip
                                    size="sm"
                                    variant="bordered"
                                    classNames={{ base: "min-h-[26px]" }}
                                >
                                    {action.actionType}
                                </Chip>
                            )}
                            {action.recharge && (
                                <Chip
                                    size="sm"
                                    color="warning"
                                    variant="flat"
                                    classNames={{ base: "min-h-[26px]" }}
                                >
                                    Recharge {action.recharge}
                                </Chip>
                            )}
                        </div>
                        <Description className="mb-1 leading-relaxed">
                            {action.description}
                        </Description>
                        <StatRow>
                            {action.attackBonus !== undefined && (
                                <Stat label="Attack" value={`+${action.attackBonus} to hit`} />
                            )}
                            {action.reach && <Stat label="Reach" value={`${action.reach} ft.`} />}
                            {action.range && <Stat label="Range" value={`${action.range} ft.`} />}
                            {action.savingThrow && (
                                <Stat label="Save" value={formatSavingThrow(action) ?? "—"} />
                            )}
                        </StatRow>
                        {action.damage && action.damage.length > 0 && (
                            <div className="space-y-1">
                                {action.damage.map((damage, index) => (
                                    <Stat
                                        key={`${action.name}-damage-${index}`}
                                        label={index === 0 ? "Damage" : ""}
                                        value={formatDamage(damage)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Fragment>
            ))}
        </div>
    </div>
);
