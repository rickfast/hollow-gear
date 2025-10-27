import { ReferenceDetailView } from "@/components/reference-detail-view";
import { referenceSearchService } from "@/service/reference-search-service";
import type { ReferenceItem } from "@/types";
import { Card, CardBody, CardHeader, Input, Listbox, ListboxItem } from "@heroui/react";
import { useEffect, useRef, useState } from "react";

/**
 * Reference Page
 *
 * Provides unified search and display interface for all game system data:
 * - Spells (Arcanist Formulae and Templar Miracles)
 * - Mindcraft Powers (Psionic abilities)
 * - Equipment (Weapons, armor, items)
 * - Mods (Equipment modifications)
 * - Species (Playable races)
 * - Classes (Character classes)
 */
export function ReferencePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [searchResults, setSearchResults] = useState<ReferenceItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ReferenceItem | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce search query (300ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Perform search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim()) {
            const results = referenceSearchService.searchAll(debouncedQuery);
            setSearchResults(results);
            setShowDropdown(true);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
    }, [debouncedQuery]);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

    // Handle result selection
    const handleSelectItem = (key: string | number) => {
        const item = searchResults.find((item) => item.id === key);
        if (item) {
            setSelectedItem(item);
            setShowDropdown(false); // Dismiss dropdown after selection
        }
    };

    return (
        <div className="p-3 sm:p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto">
            {/* Mobile: Single column, Tablet/Desktop: Two columns */}
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-6">
                {/* Search Section - Full width on mobile, fixed width on desktop */}
                <div className="w-full md:w-[380px] lg:w-[400px] flex-shrink-0 relative">
                    <Card className="md:sticky md:top-4 overflow-visible">
                        <CardHeader className="pb-3">
                            <h1 className="text-xl sm:text-2xl font-bold">Reference</h1>
                        </CardHeader>
                        <CardBody className="gap-3 sm:gap-4 overflow-visible">
                            {/* Search Input Container with Floating Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                {/* Search Input - Touch-friendly on mobile (min 44px) */}
                                <Input
                                    ref={inputRef}
                                    type="search"
                                    placeholder="Search spells, equipment, classes..."
                                    value={searchQuery}
                                    onValueChange={setSearchQuery}
                                    isClearable
                                    onClear={() => {
                                        setSearchQuery("");
                                        setShowDropdown(false);
                                    }}
                                    onFocus={(e) => {
                                        // Select all text when focused
                                        e.target.select();
                                        if (searchResults.length > 0) {
                                            setShowDropdown(true);
                                        }
                                    }}
                                    onClick={(e) => {
                                        // Select all text when clicked
                                        (e.target as HTMLInputElement).select();
                                    }}
                                    classNames={{
                                        input: "text-base", // 16px to prevent mobile zoom
                                        inputWrapper: "h-11 sm:h-12 min-h-[44px]", // Touch-friendly min height
                                    }}
                                />

                                {/* Floating Search Results - Positioned absolutely */}
                                {showDropdown && searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 z-50 border border-default-200 rounded-lg overflow-hidden bg-content1 shadow-lg">
                                        <Listbox
                                            aria-label="Search results"
                                            onAction={handleSelectItem}
                                            classNames={{
                                                base: "max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] overflow-auto",
                                            }}
                                        >
                                            {searchResults.map((item) => (
                                                <ListboxItem
                                                    key={item.id}
                                                    textValue={item.name}
                                                    classNames={{
                                                        base: "py-3 sm:py-3.5 min-h-[44px]", // Touch-friendly tap target
                                                    }}
                                                >
                                                    <div className="flex flex-col gap-0.5 sm:gap-1">
                                                        <div className="text-sm sm:text-base font-semibold break-words">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-xs sm:text-sm text-default-500">
                                                            {item.category}
                                                        </div>
                                                    </div>
                                                </ListboxItem>
                                            ))}
                                        </Listbox>
                                    </div>
                                )}
                            </div>

                            {/* No Results Message - Responsive text */}
                            {searchQuery.trim() &&
                                debouncedQuery === searchQuery &&
                                searchResults.length === 0 && (
                                    <div className="text-center py-6 sm:py-8 text-default-500">
                                        <p className="text-sm sm:text-base">No items found</p>
                                        <p className="text-xs sm:text-sm mt-1">
                                            Try a different search term
                                        </p>
                                    </div>
                                )}

                            {/* Empty State - Responsive text and padding */}
                            {!searchQuery.trim() && (
                                <div className="text-center py-6 sm:py-8 text-default-500 px-2">
                                    <p className="text-xs sm:text-sm leading-relaxed">
                                        Search for spells, mindcraft powers, equipment, mods,
                                        species, or classes
                                    </p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </div>

                {/* Detail View Section - Full width on mobile, flexible on desktop */}
                <div className="flex-1 min-w-0">
                    <ReferenceDetailView item={selectedItem} />
                </div>
            </div>
        </div>
    );
}
