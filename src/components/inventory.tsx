import type { InventoryItem, InventoryViewModel } from "@/model/character-view-model";
import {
    Checkbox,
    Chip,
    Card,
    CardBody,
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Listbox,
    ListboxItem,
} from "@heroui/react";
import { CardTitle, TertiaryText, SecondaryText, EmptyState } from "./typography";
import { useState } from "react";
import { MODS } from "@/data/mods";

export const Inventory = ({ inventory }: { inventory: InventoryViewModel }) => {
    const items = inventory.items;
    const [selectedMods, setSelectedMods] = useState<Map<string, Set<string>>>(new Map());

    if (items.length === 0) {
        return <EmptyState message="No items in inventory" />;
    }

    const handleModSelection = (itemId: string, keys: Set<string>) => {
        setSelectedMods((prev) => {
            const newMap = new Map(prev);
            newMap.set(itemId, keys);
            return newMap;
        });
    };

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
                                            <Popover placement="bottom">
                                                <PopoverTrigger>
                                                    <Button
                                                        size="sm"
                                                        variant="bordered"
                                                        isDisabled={availableMods.length === 0}
                                                    >
                                                        {Array.from({ length: item.slots }).map(
                                                            (_, index) => {
                                                                const hasMod =
                                                                    index < item.mods.length;
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
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[300px]">
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold mb-2">
                                                            Available Mods ({availableMods.length})
                                                        </div>
                                                        <Listbox
                                                            aria-label="Select mods"
                                                            variant="flat"
                                                            disallowEmptySelection={false}
                                                            selectionMode="multiple"
                                                            selectedKeys={
                                                                selectedMods.get(item.id) ||
                                                                new Set()
                                                            }
                                                            onSelectionChange={(keys) =>
                                                                handleModSelection(
                                                                    item.id,
                                                                    keys as Set<string>
                                                                )
                                                            }
                                                        >
                                                            {availableMods.map((mod) => (
                                                                <ListboxItem
                                                                    key={mod.id}
                                                                    textValue={mod.name}
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="text-sm font-semibold">
                                                                            {mod.name}
                                                                        </div>
                                                                        <div className="text-xs text-default-500">
                                                                            {mod.tier} •{" "}
                                                                            {mod.modType}
                                                                        </div>
                                                                        <div className="text-xs text-default-400">
                                                                            {mod.effect}
                                                                        </div>
                                                                    </div>
                                                                </ListboxItem>
                                                            ))}
                                                        </Listbox>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
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
