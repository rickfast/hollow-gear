/**
 * Unit tests for CharacterBuilder
 */

import type { AbilityScores } from "@/types";
import { describe, expect, it } from "vitest";
import { CharacterBuilder } from "./character-builder";
import { ValidationError } from "./character-utils";

describe("CharacterBuilder", () => {
    const validAbilityScores: AbilityScores = {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 12,
        wisdom: 10,
        charisma: 8,
    };

    describe("Valid Character Creation", () => {
        it("should create a valid character with all required fields", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.name).toBe("Test Character");
            expect(character.species).toBe("Aqualoth");
            expect(character.classes).toHaveLength(1);
            expect(character.classes[0]?.class).toBe("Arcanist");
            expect(character.level).toBe(1);
            expect(character.id).toBeDefined();
        });

        it("should create a character with optional background", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Vulmir")
                .setClass("Shadehand")
                .setAbilityScores(validAbilityScores)
                .setBackground("Guild Operative")
                .build();

            expect(character.background).toBe("Guild Operative");
        });

        it("should create a character with starting equipment", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Rendai")
                .setClass("Artifex")
                .setAbilityScores(validAbilityScores)
                .addStartingEquipment(["brass-dagger-001", "cogwrench-001"])
                .build();

            expect(character.inventory).toHaveLength(2);
            expect(character.inventory[0]?.equipmentId).toBe("brass-dagger-001");
            expect(character.inventory[1]?.equipmentId).toBe("cogwrench-001");
        });

        it("should create a character with avatar URL", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Karnathi")
                .setClass("Templar")
                .setAbilityScores(validAbilityScores)
                .setAvatarUrl("/avatars/test.png")
                .build();

            expect(character.avatarUrl).toBe("/avatars/test.png");
        });
    });

    describe("Validation Errors", () => {
        it("should throw error when name is missing", () => {
            const builder = new CharacterBuilder();
            expect(() => {
                builder
                    .setSpecies("Aqualoth")
                    .setClass("Arcanist")
                    .setAbilityScores(validAbilityScores)
                    .build();
            }).toThrow(ValidationError);
        });

        it("should throw error when name is empty", () => {
            const builder = new CharacterBuilder();
            expect(() => {
                builder.setName("");
            }).toThrow(ValidationError);
        });

        it("should throw error when species is missing", () => {
            const builder = new CharacterBuilder();
            expect(() => {
                builder
                    .setName("Test Character")
                    .setClass("Arcanist")
                    .setAbilityScores(validAbilityScores)
                    .build();
            }).toThrow(ValidationError);
        });

        it("should throw error when class is missing", () => {
            const builder = new CharacterBuilder();
            expect(() => {
                builder
                    .setName("Test Character")
                    .setSpecies("Aqualoth")
                    .setAbilityScores(validAbilityScores)
                    .build();
            }).toThrow(ValidationError);
        });

        it("should throw error when ability scores are missing", () => {
            const builder = new CharacterBuilder();
            expect(() => {
                builder
                    .setName("Test Character")
                    .setSpecies("Aqualoth")
                    .setClass("Arcanist")
                    .build();
            }).toThrow(ValidationError);
        });

        it("should throw error when ability score is too low", () => {
            const builder = new CharacterBuilder();
            expect(() => {
                builder.setAbilityScores({
                    ...validAbilityScores,
                    strength: 0,
                });
            }).toThrow(ValidationError);
        });

        it("should throw error when ability score is too high", () => {
            const builder = new CharacterBuilder();
            expect(() => {
                builder.setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 21,
                });
            }).toThrow(ValidationError);
        });
    });

    describe("Species Application", () => {
        it("should apply Aqualoth ability score increases", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            // Aqualoth gets +2 INT, +1 WIS
            expect(character.abilityScores.intelligence).toBe(14); // 12 + 2
            expect(character.abilityScores.wisdom).toBe(11); // 10 + 1
        });

        it("should apply Vulmir ability score increases", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Vulmir")
                .setClass("Shadehand")
                .setAbilityScores(validAbilityScores)
                .build();

            // Vulmir gets +2 DEX, +1 CHA
            expect(character.abilityScores.dexterity).toBe(16); // 14 + 2
            expect(character.abilityScores.charisma).toBe(9); // 8 + 1
        });

        it("should apply Rendai ability score increases", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Rendai")
                .setClass("Artifex")
                .setAbilityScores(validAbilityScores)
                .build();

            // Rendai gets +2 INT, +1 DEX
            expect(character.abilityScores.intelligence).toBe(14); // 12 + 2
            expect(character.abilityScores.dexterity).toBe(15); // 14 + 1
        });

        it("should set species speed", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Vulmir")
                .setClass("Shadehand")
                .setAbilityScores(validAbilityScores)
                .build();

            // Vulmir has 35 ft speed
            expect(character.speed).toBe(35);
        });

        it("should set species languages", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.languages).toContain("Common Geartrade");
            expect(character.languages).toContain("Aquan");
        });
    });

    describe("Class Application", () => {
        it("should initialize Arcanist with spell slots", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.spellSlots).toBeDefined();
            expect(character.spellSlots?.level1.maximum).toBe(2);
            expect(character.spellSlots?.level1.current).toBe(2);
        });

        it("should initialize Arcanist with Aether Flux Points", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 16, // +3 modifier
                })
                .build();

            // AFP = Level (1) + INT mod (3) = 4, but after species bonus INT becomes 18 (+4)
            expect(character.aetherFluxPoints).toBeDefined();
            expect(character.aetherFluxPoints?.maximum).toBe(5); // 1 + 4
            expect(character.aetherFluxPoints?.current).toBe(5);
        });

        it("should initialize Templar with Resonance Charges", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Karnathi")
                .setClass("Templar")
                .setAbilityScores({
                    ...validAbilityScores,
                    wisdom: 14, // +2 modifier
                })
                .build();

            // RC = Level (1) + WIS mod (2), but after species bonus WIS becomes 15 (+2)
            expect(character.resonanceCharges).toBeDefined();
            expect(character.resonanceCharges?.maximum).toBe(3); // 1 + 2
            expect(character.resonanceCharges?.current).toBe(3);
        });

        it("should initialize Mindweaver with Aether Flux Points", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Avenar")
                .setClass("Mindweaver")
                .setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 16, // +3 modifier
                })
                .build();

            // AFP = Level (1) + INT mod (3), but after species bonus INT becomes 18 (+4)
            expect(character.aetherFluxPoints).toBeDefined();
            expect(character.aetherFluxPoints?.maximum).toBe(5); // 1 + 4
        });

        it("should initialize Vanguard without spell resources", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Tharn")
                .setClass("Vanguard")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.spellSlots).toBeUndefined();
            expect(character.aetherFluxPoints).toBeUndefined();
            expect(character.resonanceCharges).toBeUndefined();
        });
    });

    describe("Derived Stat Calculations", () => {
        it("should calculate armor class correctly (unarmored)", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Vulmir")
                .setClass("Shadehand")
                .setAbilityScores({
                    ...validAbilityScores,
                    dexterity: 16, // +3 modifier
                })
                .build();

            // Unarmored AC = 10 + DEX mod, after species bonus DEX becomes 18 (+4)
            expect(character.armorClass).toBe(14); // 10 + 4
        });

        it("should calculate initiative correctly", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Skellin")
                .setClass("Shadehand")
                .setAbilityScores({
                    ...validAbilityScores,
                    dexterity: 16, // +3 modifier
                })
                .build();

            // Initiative = DEX mod, after species bonus DEX becomes 18 (+4)
            expect(character.initiative).toBe(4);
        });

        it("should calculate skill modifiers correctly", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores({
                    ...validAbilityScores,
                    intelligence: 16, // +3 modifier
                })
                .build();

            // After species bonus, INT becomes 18 (+4)
            // Proficiency bonus at level 1 is +2
            expect(character.skills.Arcana).toBeDefined();
            expect(character.skills.Arcana.modifier).toBeGreaterThanOrEqual(4); // At least +4 from INT
        });

        it("should calculate hit points correctly", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Tharn")
                .setClass("Tweaker")
                .setAbilityScores({
                    ...validAbilityScores,
                    constitution: 16, // +3 modifier
                })
                .build();

            // Tweaker has d12 hit die, after species bonus CON becomes 18 (+4)
            // HP at level 1 = 12 + CON mod = 12 + 4 = 16
            expect(character.hitPoints.maximum).toBe(16);
            expect(character.hitPoints.current).toBe(16);
        });
    });

    describe("Resource Initialization", () => {
        it("should initialize heat points", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.heatPoints.current).toBe(0);
            expect(character.heatPoints.maximum).toBe(10);
        });

        it("should initialize empty spell list", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.spells).toEqual([]);
        });

        it("should initialize empty mindcraft powers", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Avenar")
                .setClass("Mindweaver")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.mindcraftPowers).toEqual([]);
        });

        it("should initialize currency", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.currency.cogs).toBe(0);
            expect(character.currency.gears).toBe(0);
            expect(character.currency.cores).toBe(0);
        });

        it("should initialize status effects", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.heatStressLevel).toBe(0);
            expect(character.exhaustionLevel).toBe(0);
            expect(character.conditions).toEqual([]);
        });
    });

    describe("Fluent API", () => {
        it("should support method chaining", () => {
            const builder = new CharacterBuilder();
            const result = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .setBackground("Scholar")
                .addStartingEquipment(["brass-dagger-001"]);

            expect(result).toBe(builder);
        });
    });
});
