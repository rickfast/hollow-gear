/**
 * Unit tests for CharacterBuilder starting level functionality
 */

import type { AbilityScores } from "@/types";
import { describe, expect, it } from "vitest";
import { CharacterBuilder } from "./character-builder";

describe("CharacterBuilder - Starting Level", () => {
    const validAbilityScores: AbilityScores = {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8,
    };

    describe("Level 1 Character", () => {
        it("should create a level 1 character with standard starting equipment", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Level 1 Test")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.level).toBe(1);
            expect(character.classes[0]?.level).toBe(1);

            // Should have starting equipment
            expect(character.inventory.length).toBeGreaterThan(0);

            // Should have starting currency (not multiplied)
            const totalCogs =
                character.currency.cogs +
                character.currency.gears * 10 +
                character.currency.cores * 100;
            expect(totalCogs).toBeLessThan(1000); // Standard starting wealth
        });

        it("should calculate HP correctly for level 1 (max hit die + CON mod)", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Level 1 HP Test")
                .setSpecies("Vulmir")
                .setClass("Vanguard") // d10 hit die
                .setAbilityScores({
                    ...validAbilityScores,
                    constitution: 14, // +2 modifier
                })
                .build();

            // Level 1: max hit die (10) + CON mod (2) = 12
            expect(character.hitPoints.maximum).toBe(12);
            expect(character.hitPoints.current).toBe(12);
        });
    });

    describe("Higher Level Character", () => {
        it("should create a level 5 character with appropriate HP", () => {
            const builder = new CharacterBuilder();
            builder
                .setName("Level 5 Test")
                .setSpecies("Karnathi")
                .setAbilityScores(validAbilityScores);

            // Add a class at level 5
            builder.addClass("Vanguard", 5);

            const character = builder.build();

            expect(character.level).toBe(5);
            expect(character.classes[0]?.level).toBe(5);

            // HP calculation for Vanguard (d10):
            // Level 1: 10 + CON mod (1) = 11
            // Levels 2-5: (6 + 1) * 4 = 28
            // Total: 11 + 28 = 39
            expect(character.hitPoints.maximum).toBe(39);
        });

        it("should create a level 10 character with increased starting wealth", () => {
            const builder = new CharacterBuilder();
            builder
                .setName("Level 10 Test")
                .setSpecies("Rendai")
                .setAbilityScores(validAbilityScores);

            builder.addClass("Artifex", 10);

            const character = builder.build();

            expect(character.level).toBe(10);

            // Should have starting equipment
            expect(character.inventory.length).toBeGreaterThan(0);

            // Should have increased wealth (10x multiplier for level 5-10)
            const totalCogs =
                character.currency.cogs +
                character.currency.gears * 10 +
                character.currency.cores * 100;
            expect(totalCogs).toBeGreaterThan(1000); // Significantly more than level 1
        });

        it("should create a level 15 character with high starting wealth", () => {
            const builder = new CharacterBuilder();
            builder
                .setName("Level 15 Test")
                .setSpecies("Skellin")
                .setAbilityScores(validAbilityScores);

            builder.addClass("Templar", 15);

            const character = builder.build();

            expect(character.level).toBe(15);

            // Should have very high wealth (50x multiplier for level 11-16)
            const totalCogs =
                character.currency.cogs +
                character.currency.gears * 10 +
                character.currency.cores * 100;
            expect(totalCogs).toBeGreaterThan(10000); // Much more than level 10
        });

        it("should apply all class features for higher level characters", () => {
            const builder = new CharacterBuilder();
            builder
                .setName("Level 5 Features Test")
                .setSpecies("Tharn")
                .setAbilityScores(validAbilityScores);

            builder.addClass("Vanguard", 5);

            const character = builder.build();

            expect(character.level).toBe(5);
            expect(character.features).toBeDefined();

            // Should have features from levels 1-5
            // Vanguard gets features at multiple levels
            expect(character.features!.length).toBeGreaterThan(0);

            // Check that features from level 1 are present
            const featureLevels = character.features!.map((f) => f.level);
            expect(featureLevels).toContain(1);

            // Vanguard should have features at level 1 at minimum
            const level1Features = character.features!.filter((f) => f.level === 1);
            expect(level1Features.length).toBeGreaterThan(0);
        });

        it("should calculate spell slots correctly for higher level spellcasters", () => {
            const builder = new CharacterBuilder();
            builder
                .setName("Level 5 Spellcaster")
                .setSpecies("Avenar")
                .setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 16,
                });

            builder.addClass("Arcanist", 5);

            const character = builder.build();

            expect(character.level).toBe(5);
            expect(character.spellSlots).toBeDefined();

            // Level 5 Arcanist should have spell slots
            expect(character.spellSlots!.level1.maximum).toBeGreaterThan(0);
            expect(character.spellSlots!.level2.maximum).toBeGreaterThan(0);
            expect(character.spellSlots!.level3.maximum).toBeGreaterThan(0);
        });
    });

    describe("Multiclass with Starting Level", () => {
        it("should handle multiclass characters starting at higher levels", () => {
            const builder = new CharacterBuilder();
            builder.setName("Multiclass Test").setSpecies("Vulmir").setAbilityScores({
                strength: 15,
                dexterity: 14,
                constitution: 13,
                intelligence: 13, // Meets multiclass requirement
                wisdom: 10,
                charisma: 8,
            });

            // Add first class at level 3
            builder.addClass("Vanguard", 3);

            // Add second class at level 2
            builder.addClass("Artifex", 2);

            const character = builder.build();

            expect(character.level).toBe(5); // Total level
            expect(character.classes).toHaveLength(2);
            expect(character.classes.find((c) => c.class === "Vanguard")?.level).toBe(3);
            expect(character.classes.find((c) => c.class === "Artifex")?.level).toBe(2);
        });
    });
});
