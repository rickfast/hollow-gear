import type { InventoryItem } from "@/model/character-view-model";
import { Checkbox, Chip } from "@heroui/react";

export const Inventory = ({ items }: { items: InventoryItem[] }) => {
    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-default-400">
                <p>No items in inventory</p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {items.map((item) => (
                <div
                    key={item.id}
                    className="flex items-start gap-3 py-3 px-3 hover:bg-default-100 rounded-lg border border-default-200"
                >
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
                        <div className="font-medium text-sm mb-1">{item.name}</div>

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

                        {/* Cost */}
                        <div className="text-xs text-default-500">{item.cost}</div>
                    </div>

                    {/* Quantity and Weight */}
                    <div className="flex-shrink-0 text-right">
                        <div className="text-sm font-medium">×{item.quantity}</div>
                        <div className="text-xs text-default-500">{item.weight}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};
