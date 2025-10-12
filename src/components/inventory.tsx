import type { InventoryItem, InventoryViewModel } from "@/model/character-view-model";
import { Checkbox, Chip, Card, CardBody, Button } from "@heroui/react";
import { CardTitle, TertiaryText, SecondaryText, EmptyState } from "./typography";

export const Inventory = ({ inventory }: { inventory: InventoryViewModel }) => {
    const items = inventory.items;

    if (items.length === 0) {
        return <EmptyState message="No items in inventory" />;
    }

    return (
        <div className="space-y-2">
            {items.map((item) => {
                const availableMods = inventory.filterModsForEquipment(item);

                return (
                    <Card key={item.id} className="border border-default-200">
                        <CardBody className="p-3">
                            <div className="flex items-start gap-3">
                                {/* Equipped Checkbox */}
                                <div className="flex-shrink-0 pt-0.5">
                                    <Checkbox
                                        isSelected={item.equipped}
                                        isReadOnly
                                        size="sm"
                                        color="primary"
                                        aria-label="Equipped"
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="flex-1 min-w-0">
                                    {/* Item Name */}
                                    <CardTitle className="mb-1">{item.name}</CardTitle>

                                    {/* Tags */}
                                    {item.tags && item.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-1">
                                            {item.tags.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    size="sm"
                                                    variant="flat"
                                                    color="default"
                                                    className="text-xs"
                                                >
                                                    {tag}
                                                </Chip>
                                            ))}
                                        </div>
                                    )}

                                    {/* Mod Slots */}
                                    {item.slots > 0 && (
                                        <div className="flex items-center gap-1 mb-1">
                                            <TertiaryText className="mr-1">Mods:</TertiaryText>
                                            <Button
                                                size="sm"
                                                variant="bordered"
                                                disabled={availableMods.length === 0}
                                            >
                                                {Array.from({ length: item.slots }).map(
                                                    (_, index) => {
                                                        const hasMod = index < item.mods.length;
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={`w-3 h-3 rounded-full border-2 ${
                                                                    hasMod
                                                                        ? "bg-primary border-primary"
                                                                        : "border-default-300"
                                                                }`}
                                                                title={
                                                                    hasMod
                                                                        ? "Mod installed"
                                                                        : "Empty slot"
                                                                }
                                                            />
                                                        );
                                                    }
                                                )}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Cost */}
                                    <TertiaryText>{item.cost}</TertiaryText>
                                </div>

                                {/* Quantity and Weight */}
                                <div className="flex-shrink-0 text-right">
                                    <SecondaryText className="font-medium">
                                        ×{item.quantity}
                                    </SecondaryText>
                                    <TertiaryText>{item.weight}</TertiaryText>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
};
