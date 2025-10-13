import type { InventoryViewModel } from "@/model/character-view-model";
import { useCharacterViewModelContext } from "@/model/character-view-model-context";
import {
    Button,
    Card,
    CardBody,
    Checkbox,
    Chip,
    Listbox,
    ListboxItem,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@heroui/react";
import { CardTitle, EmptyState, SecondaryText, TertiaryText } from "./typography";

export const Inventory = ({
    inventory,
    characterId,
}: {
    inventory: InventoryViewModel;
    characterId: string;
}) => {
    const items = inventory.items;
    const { updateCharacter } = useCharacterViewModelContext();

    if (items.length === 0) {
        return <EmptyState message="No items in inventory" />;
    }

    const handleEquipToggle = (inventoryItemId: string, currentlyEquipped: boolean) => {
        updateCharacter(characterId, (vm) => {
            if (currentlyEquipped) {
                vm.unequipItem(inventoryItemId);
            } else {
                vm.equipItem(inventoryItemId);
            }
            return vm.toCharacter();
        });
    };

    const handleModSelection = (inventoryItemId: string, keys: Set<string>) => {
        const item = items.find((i) => i.id === inventoryItemId);
        if (!item) return;

        const currentMods = new Set(item.mods);
        const newMods = keys as Set<string>;

        // Find mods to attach (in newMods but not in currentMods)
        const modsToAttach = Array.from(newMods).filter((modId) => !currentMods.has(modId));

        // Find mods to detach (in currentMods but not in newMods)
        const modsToDetach = Array.from(currentMods).filter((modId) => !newMods.has(modId));

        // Check if we're exceeding slot limit
        if (newMods.size > item.slots) {
            return; // Don't allow more mods than slots
        }

        // Apply changes
        updateCharacter(characterId, (vm) => {
            // Attach new mods
            for (const modId of modsToAttach) {
                vm.attachMod(inventoryItemId, modId);
            }

            // Detach removed mods
            for (const modId of modsToDetach) {
                vm.detachMod(inventoryItemId, modId);
            }

            return vm.toCharacter();
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
                                        onValueChange={() =>
                                            handleEquipToggle(item.id, item.equipped)
                                        }
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

                                    {/* Installed Mods */}
                                    {item.mods.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-1">
                                            {item.mods.map((modId) => {
                                                const modData = inventory.mods.find(
                                                    (m) => m.mod.id === modId
                                                )?.mod;
                                                if (!modData) return null;
                                                return (
                                                    <Chip
                                                        key={modId}
                                                        size="sm"
                                                        variant="flat"
                                                        color="primary"
                                                        className="text-xs"
                                                    >
                                                        {modData.name}
                                                    </Chip>
                                                );
                                            })}
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
                                                            selectedKeys={new Set(item.mods)}
                                                            onSelectionChange={(keys) =>
                                                                handleModSelection(
                                                                    item.id,
                                                                    keys as Set<string>
                                                                )
                                                            }
                                                            disabledKeys={
                                                                item.mods.length >= item.slots
                                                                    ? Array.from(
                                                                          new Set(
                                                                              availableMods
                                                                                  .map((m) => m.id)
                                                                                  .filter(
                                                                                      (id) =>
                                                                                          !item.mods.includes(
                                                                                              id
                                                                                          )
                                                                                  )
                                                                          )
                                                                      )
                                                                    : []
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
