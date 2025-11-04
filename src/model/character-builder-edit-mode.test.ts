/**
 * Tests for CharacterBuilder edit mode and multiclassing functionality
 */

import { describe, expect, it } from "vitest";
import { CharacterBuilder } from "./character-builder";
import { ValidationError } from "./character-utils";
import type { AbilityScores, Character } from "@/types";

describe("CharacterBuilder Edit Mode", () => {
    const validAbilityScores: AbilityScores = {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8,
    };

    const createTestCharacter = (): Character => {
        return new CharacterBuilder()
            .setName("Test Character")
            .setSpecies("Aqualoth")
            .setClass("Arcanist")
            .setAbilityScores(validAbilityScores)
            .build();
    };

    describe("fromCharacter", () => {
        it("should create a builder from an existing character", () => {
            const original = createTestCharacter();
            const builder = CharacterBuilder.fromCharacter(original);

            expect(builder).toBeInstanceOf(CharacterBuilder);
            expect(builder.areAbilityScoresLocked()).toBe(true);
        });

        it("should create an independent copy of the character", () => {
            const original = createTestCharacter();
            const builder = CharacterBuilder.fromCharacter(original);
            const modified = builder.setName("Modified Character").build();

            expect(original.name).toBe("Test Character");
            expect(modified.name).toBe("Modified Character");
            expect(original.id).toBe(modified.id); // ID should be preserved
        });

        it("should deep copy nested objects", () => {
            const original = createTestCharacter();
            const builder = CharacterBuilder.fromCharacter(original);
            const modified = builder.build();

            // Modify the copy's ability scores
            modified.abilityScores.strength = 20;

            // Original should be unchanged
            expect(original.abilityScores.strength).not.toBe(20);
        });
    });

    describe("ability score locking", () => {
        it("should lock ability scores in edit mode", () => {
            const original = createTestCharacter();
            const builder = CharacterBuilder.fromCharacter(original);

            expect(() => {
                builder.setAbilityScores({
                    ...validAbilityScores,
                    strength: 18,
                });
            }).toThrow(ValidationError);
        });

        it("should allow locking ability scores manually", () => {
            const builder = new CharacterBuilder();
            builder.lockAbilityScores();

            expect(builder.areAbilityScoresLocked()).toBe(true);
            expect(() => {
                builder.setAbilityScores(validAbilityScores);
            }).toThrow(ValidationError);
        });

        it("should not lock ability scores in create mode by default", () => {
            const builder = new CharacterBuilder();

            expect(builder.areAbilityScoresLocked()).toBe(false);
            expect(() => {
                builder.setAbilityScores(validAbilityScores);
            }).not.toThrow();
        });
    });

    describe("multiclassing", () => {
        it("should check multiclass prerequisites", () => {
            const builder = new CharacterBuilder();
            builder.setAbilityScores({
                ...validAbilityScores,
                intelligence: 13, // Meets Arcanist requirement
                dexterity: 13, // Meets Shadehand requirement
                strength: 10, // Does not meet Vanguard requirement (needs 13)
            });

            expect(builder.canMulticlass("Arcanist")).toBe(true);
            expect(builder.canMulticlass("Shadehand")).toBe(true);
            expect(builder.canMulticlass("Vanguard")).toBe(false); // STR only 10, needs 13
        });

        it("should add a new class with validation", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 13,
                    dexterity: 13,
                });

            builder.addClass("Shadehand", 1);
            const character = builder.build();

            expect(character.classes).toHaveLength(2);
            expect(character.classes[0]?.class).toBe("Arcanist");
            expect(character.classes[1]?.class).toBe("Shadehand");
            expect(character.level).toBe(2);
        });

        it("should reject multiclass without prerequisites", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 13,
                    strength: 10, // Does not meet Vanguard requirement
                });

            expect(() => {
                builder.addClass("Vanguard", 1);
            }).toThrow(ValidationError);
        });

        it("should reject adding a class the character already has", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores);

            expect(() => {
                builder.addClass("Arcanist", 1);
            }).toThrow(ValidationError);
        });

        it("should enforce level 20 cap", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 13,
                    dexterity: 13,
                });

            builder.setClasses([
                { class: "Arcanist", level: 15 },
            ]);

            expect(() => {
                builder.addClass("Shadehand", 10); // Would exceed 20
            }).toThrow(ValidationError);
        });
    });

    describe("addLevelsToClass", () => {
        it("should add levels to an existing class", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores);

            const levelsToConfig = builder.addLevelsToClass("Arcanist", 2);

            expect(levelsToConfig).toEqual([2, 3]);

            const character = builder.build();
            expect(character.classes[0]?.level).toBe(3);
            expect(character.level).toBe(3);
        });

        it("should reject adding levels to a class the character doesn't have", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores);

            expect(() => {
                builder.addLevelsToClass("Vanguard", 1);
            }).toThrow(ValidationError);
        });

        it("should enforce class level 20 cap", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setAbilityScores(validAbilityScores);

            builder.setClasses([{ class: "Arcanist", level: 18 }]);

            expect(() => {
                builder.addLevelsToClass("Arcanist", 5); // Would exceed 20
            }).toThrow(ValidationError);
        });
    });

    describe("setClasses", () => {
        it("should set multiple classes at once", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setAbilityScores(validAbilityScores);

            builder.setClasses([
                { class: "Arcanist", level: 5 },
                { class: "Shadehand", level: 3 },
            ]);

            const character = builder.build();
            expect(character.classes).toHaveLength(2);
            expect(character.level).toBe(8);
        });

        it("should validate total level doesn't exceed 20", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setAbilityScores(validAbilityScores);

            expect(() => {
                builder.setClasses([
                    { class: "Arcanist", level: 15 },
                    { class: "Shadehand", level: 10 },
                ]);
            }).toThrow(ValidationError);
        });
    });

    describe("setClassConfigurations", () => {
        it("should set multiple class configurations", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setAbilityScores(validAbilityScores);

            builder.setClasses([
                { class: "Arcanist", level: 2 },
            ]);

            builder.setClassConfigurations([
                {
                    classType: "Arcanist",
                    level: 1,
                    featureChoices: {},
                    spellsSelected: ["Magic Missile"],
                },
                {
                    classType: "Arcanist",
                    level: 2,
                    featureChoices: {},
                    subclass: "Aethermancer",
                },
            ]);

            const character = builder.build();
            expect(character.classConfigurations).toHaveLength(2);
            expect(character.spells).toContain("Magic Missile");
            expect(character.classes[0]?.subclass).toBe("Aethermancer");
        });

        it("should reject configuration for class character doesn't have", () => {
            const builder = new CharacterBuilder()
                .setName("Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores);

            expect(() => {
                builder.setClassConfigurations([
                    {
                        classType: "Vanguard",
                        level: 1,
                        featureChoices: {},
                    },
                ]);
            }).toThrow(ValidationError);
        });
    });
});
