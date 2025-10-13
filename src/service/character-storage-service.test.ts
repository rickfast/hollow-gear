import type { Character } from "@/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CharacterStorageService, StorageError } from "./character-storage-service";

// Mock character data for testing
const mockCharacter: Character = {
    id: "test-123",
    name: "Test Character",
    species: "Vulmir",
    classes: [{ level: 1, class: "Arcanist" }],
    level: 1,
    abilityScores: {
        strength: 10,
        dexterity: 14,
        constitution: 12,
        intelligence: 16,
        wisdom: 10,
        charisma: 8,
    },
    hitPoints: { current: 8, maximum: 8 },
    heatPoints: { current: 0, maximum: 10 },
    skills: {
        Acrobatics: { modifier: 2, proficient: false, expertise: false },
        "Animal Handling": { modifier: 0, proficient: false, expertise: false },
        Arcana: { modifier: 5, proficient: true, expertise: false },
        Athletics: { modifier: 0, proficient: false, expertise: false },
        Deception: { modifier: -1, proficient: false, expertise: false },
        History: { modifier: 5, proficient: true, expertise: false },
        Insight: { modifier: 0, proficient: false, expertise: false },
        Intimidation: { modifier: -1, proficient: false, expertise: false },
        Investigation: { modifier: 5, proficient: true, expertise: false },
        Medicine: { modifier: 0, proficient: false, expertise: false },
        Nature: { modifier: 3, proficient: false, expertise: false },
        Perception: { modifier: 0, proficient: false, expertise: false },
        Performance: { modifier: -1, proficient: false, expertise: false },
        Persuasion: { modifier: -1, proficient: false, expertise: false },
        Religion: { modifier: 3, proficient: false, expertise: false },
        "Sleight of Hand": { modifier: 2, proficient: false, expertise: false },
        Stealth: { modifier: 2, proficient: false, expertise: false },
        Survival: { modifier: 0, proficient: false, expertise: false },
        Tinkering: { modifier: 3, proficient: false, expertise: false },
    },
    inventory: [],
    mods: [],
    currency: { cogs: 100, gears: 0, cores: 0 },
    spells: [],
    mindcraftPowers: [],
    armorClass: 12,
    initiative: 2,
    speed: 30,
    languages: ["Common Geartrade"],
    heatStressLevel: 0,
    exhaustionLevel: 0,
    conditions: [],
};

describe("CharacterStorageService", () => {
    let service: CharacterStorageService;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        service = new CharacterStorageService();
    });

    describe("saveCharacters", () => {
        it("should save characters to localStorage", () => {
            const characters = [mockCharacter];

            service.saveCharacters(characters);

            const stored = localStorage.getItem("hollowgear:characters");
            expect(stored).toBeTruthy();

            const parsed = JSON.parse(stored!);
            expect(parsed.version).toBe(1);
            expect(parsed.characters).toHaveLength(1);
            expect(parsed.characters[0].id).toBe("test-123");
            expect(parsed.lastModified).toBeTruthy();
        });

        it("should save multiple characters", () => {
            const characters = [
                mockCharacter,
                { ...mockCharacter, id: "test-456", name: "Second Character" },
            ];

            service.saveCharacters(characters);

            const stored = localStorage.getItem("hollowgear:characters");
            const parsed = JSON.parse(stored!);
            expect(parsed.characters).toHaveLength(2);
        });

        it("should throw StorageError when storage fails", () => {
            // Mock JSON.stringify to throw an error
            const originalStringify = JSON.stringify;
            const mockError = new Error("Storage failed");
            mockError.name = "QuotaExceededError";

            vi.spyOn(JSON, "stringify").mockImplementationOnce(() => {
                throw mockError;
            });

            expect(() => service.saveCharacters([mockCharacter])).toThrow(StorageError);

            // Restore
            JSON.stringify = originalStringify;
        });
    });

    describe("loadCharacters", () => {
        it("should return empty array when localStorage is empty", () => {
            const characters = service.loadCharacters();
            expect(characters).toEqual([]);
        });

        it("should load characters from localStorage", () => {
            service.saveCharacters([mockCharacter]);

            const loaded = service.loadCharacters();
            expect(loaded).toHaveLength(1);
            expect(loaded[0]?.id).toBe("test-123");
            expect(loaded[0]?.name).toBe("Test Character");
        });

        it("should return empty array for invalid JSON", () => {
            localStorage.setItem("hollowgear:characters", "invalid json{");

            const characters = service.loadCharacters();
            expect(characters).toEqual([]);
        });

        it("should return empty array for invalid data structure", () => {
            localStorage.setItem("hollowgear:characters", JSON.stringify({ invalid: "structure" }));

            const characters = service.loadCharacters();
            expect(characters).toEqual([]);
        });

        it("should return empty array for version mismatch", () => {
            localStorage.setItem(
                "hollowgear:characters",
                JSON.stringify({
                    version: 999,
                    characters: [mockCharacter],
                    lastModified: new Date().toISOString(),
                })
            );

            const characters = service.loadCharacters();
            expect(characters).toEqual([]);
        });

        it("should filter out invalid characters", () => {
            const validChar = mockCharacter;
            const invalidChar = { id: "invalid", name: "Missing Fields" };

            localStorage.setItem(
                "hollowgear:characters",
                JSON.stringify({
                    version: 1,
                    characters: [validChar, invalidChar],
                    lastModified: new Date().toISOString(),
                })
            );

            const characters = service.loadCharacters();
            expect(characters).toHaveLength(1);
            expect(characters[0]?.id).toBe("test-123");
        });
    });

    describe("debouncedSave", () => {
        it("should debounce multiple save calls", async () => {
            const saveSpy = vi.spyOn(service, "saveCharacters");

            // Call debouncedSave multiple times rapidly
            service.debouncedSave([mockCharacter]);
            service.debouncedSave([mockCharacter]);
            service.debouncedSave([mockCharacter]);

            // Should not have called saveCharacters yet
            expect(saveSpy).not.toHaveBeenCalled();

            // Wait for debounce delay
            await new Promise((resolve) => setTimeout(resolve, 600));

            // Should have called saveCharacters only once
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });

        it("should save the latest data after debounce", async () => {
            const char1 = { ...mockCharacter, name: "First" };
            const char2 = { ...mockCharacter, name: "Second" };
            const char3 = { ...mockCharacter, name: "Third" };

            service.debouncedSave([char1]);
            service.debouncedSave([char2]);
            service.debouncedSave([char3]);

            await new Promise((resolve) => setTimeout(resolve, 600));

            const loaded = service.loadCharacters();
            expect(loaded[0]?.name).toBe("Third");
        });
    });

    describe("clearAll", () => {
        it("should remove all character data from localStorage", () => {
            service.saveCharacters([mockCharacter]);
            expect(localStorage.getItem("hollowgear:characters")).toBeTruthy();

            service.clearAll();
            expect(localStorage.getItem("hollowgear:characters")).toBeNull();
        });
    });

    describe("cleanup", () => {
        it("should clear pending save timeout", async () => {
            const saveSpy = vi.spyOn(service, "saveCharacters");

            service.debouncedSave([mockCharacter]);
            service.cleanup();

            // Wait longer than debounce delay
            await new Promise((resolve) => setTimeout(resolve, 600));

            // Should not have called saveCharacters because cleanup cleared the timeout
            expect(saveSpy).not.toHaveBeenCalled();
        });
    });
});
