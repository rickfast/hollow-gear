import type { Character } from "@/types";
import { describe, expect, it } from "vitest";
import { ValidationError } from "./character-utils";
import { MutableCharacterViewModel } from "./mutable-character-view-model";

// Helper to create a minimal test character
function createTestCharacter(): Character {
    return {
        id: "test-1",
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
            History: { modifier: 3, proficient: false, expertise: false },
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
}

describe("MutableCharacterViewModel", () => {
    describe("toCharacter and clone", () => {
        it("should serialize to Character object", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);
            const serialized = vm.toCharacter();

            expect(serialized).toEqual(character);
        });

        it("should create a deep clone", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);
            const cloned = vm.clone();

            expect(cloned).toBeInstanceOf(MutableCharacterViewModel);
            expect(cloned.toCharacter()).toEqual(character);
            expect(cloned).not.toBe(vm);
        });
    });

    describe("updateHitPoints", () => {
        it("should update current hit points", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.updateHitPoints(5);

            expect(updated.hitPoints.current).toBe(5);
            expect(updated.hitPoints.maximum).toBe(8);
        });

        it("should update temporary hit points", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.updateHitPoints(8, 5);

            expect(updated.hitPoints.current).toBe(8);
            expect(updated.hitPoints.temporary).toBe(5);
        });

        it("should throw error for negative HP", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            expect(() => vm.updateHitPoints(-1)).toThrow(ValidationError);
        });

        it("should throw error for HP above maximum", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            expect(() => vm.updateHitPoints(10)).toThrow(ValidationError);
        });
    });

    describe("updateHeatPoints", () => {
        it("should update heat points", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.updateHeatPoints(5);

            expect(updated.heatPoints.current).toBe(5);
        });

        it("should throw error for heat above maximum", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            expect(() => vm.updateHeatPoints(11)).toThrow(ValidationError);
        });
    });

    describe("takeLongRest", () => {
        it("should restore all HP", () => {
            const character = createTestCharacter();
            character.hitPoints.current = 3;
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.takeLongRest();

            expect(updated.hitPoints.current).toBe(8);
            expect(updated.hitPoints.temporary).toBe(0);
        });

        it("should reset heat to 0", () => {
            const character = createTestCharacter();
            character.heatPoints.current = 5;
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.takeLongRest();

            expect(updated.heatPoints.current).toBe(0);
        });

        it("should reset heat stress level", () => {
            const character = createTestCharacter();
            character.heatStressLevel = 2;
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.takeLongRest();

            expect(updated.heatStressLevel).toBe(0);
        });
    });

    describe("learnSpell", () => {
        it("should add spell to character", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.learnSpell("Magic Missile");

            expect(updated.spells).toContain("Magic Missile");
        });

        it("should throw error if spell already known", () => {
            const character = createTestCharacter();
            character.spells = ["Magic Missile"];
            const vm = new MutableCharacterViewModel(character);

            expect(() => vm.learnSpell("Magic Missile")).toThrow(ValidationError);
        });

        it("should throw error if class cannot learn spells", () => {
            const character = createTestCharacter();
            character.classes = [{ level: 1, class: "Vanguard" }];
            const vm = new MutableCharacterViewModel(character);

            expect(() => vm.learnSpell("Magic Missile")).toThrow(ValidationError);
        });
    });

    describe("forgetSpell", () => {
        it("should remove spell from character", () => {
            const character = createTestCharacter();
            character.spells = ["Magic Missile", "Fireball"];
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.forgetSpell("Magic Missile");

            expect(updated.spells).not.toContain("Magic Missile");
            expect(updated.spells).toContain("Fireball");
        });

        it("should throw error if spell not known", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            expect(() => vm.forgetSpell("Magic Missile")).toThrow(ValidationError);
        });
    });

    describe("addItem", () => {
        it("should add item to inventory", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.addItem("brass-dagger-001");

            expect(updated.inventory).toHaveLength(1);
            expect(updated.inventory[0]?.equipmentId).toBe("brass-dagger-001");
            expect(updated.inventory[0]?.equipped).toBe(false);
        });

        it("should add equipped item", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            const updated = vm.addItem("brass-dagger-001", true);

            expect(updated.inventory[0]?.equipped).toBe(true);
        });
    });

    describe("removeItem", () => {
        it("should remove item from inventory", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            // Add an item first
            const withItem = vm.addItem("brass-dagger-001");
            const itemId = withItem.inventory[0]!.id;

            // Create new VM with the updated character
            const vm2 = new MutableCharacterViewModel(withItem);
            const updated = vm2.removeItem(itemId);

            expect(updated.inventory).toHaveLength(0);
        });

        it("should throw error if item not found", () => {
            const character = createTestCharacter();
            const vm = new MutableCharacterViewModel(character);

            expect(() => vm.removeItem("nonexistent")).toThrow(ValidationError);
        });
    });
});
