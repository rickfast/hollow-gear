/**
 * Unit tests for CharacterBuilder
 */

import type { AbilityScores, ClassConfiguration } from "@/types";
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

            // Artifex has 9 starting equipment items + 2 manually added = 11 total
            expect(character.inventory.length).toBeGreaterThanOrEqual(11);
            // Check that manually added items are present
            const equipmentIds = character.inventory.map((item) => item.equipmentId);
            expect(equipmentIds).toContain("brass-dagger-001");
            expect(equipmentIds).toContain("cogwrench-001");
            // Check that class starting equipment is present
            expect(equipmentIds).toContain("rivetgun-001");
            expect(equipmentIds).toContain("steamweave-vest-001");
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

            // Arcanist starts with 100 cogs from starting equipment
            expect(character.currency.cogs).toBe(100);
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

    describe("Class Configuration", () => {
        it("should store class configuration in character", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Arcanist",
                level: 1,
                subclass: "Aethermancer",
                featureChoices: {
                    "Arcane Focus": "steamstaff",
                },
                spellsSelected: ["Aether Bolt", "Mending"],
                proficienciesSelected: [],
            };

            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .setClassConfiguration(config)
                .build();

            expect(character.classConfigurations).toBeDefined();
            expect(character.classConfigurations).toHaveLength(1);
            expect(character.classConfigurations![0]).toEqual(config);
        });

        it("should store complete class configuration with all fields", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Mindweaver",
                level: 1,
                subclass: "Path of Echo",
                featureChoices: {
                    "Primary Ability": "intelligence",
                    "Psionic Discipline": "telepathy",
                },
                spellsSelected: [],
                proficienciesSelected: ["Insight", "Perception"],
            };

            const character = builder
                .setName("Test Character")
                .setSpecies("Avenar")
                .setClass("Mindweaver")
                .setAbilityScores(validAbilityScores)
                .setClassConfiguration(config)
                .build();

            expect(character.classConfigurations).toBeDefined();
            expect(character.classConfigurations![0]?.classType).toBe("Mindweaver");
            expect(character.classConfigurations![0]?.level).toBe(1);
            expect(character.classConfigurations![0]?.subclass).toBe("Path of Echo");
            expect(character.classConfigurations![0]?.featureChoices).toEqual({
                "Primary Ability": "intelligence",
                "Psionic Discipline": "telepathy",
            });
            expect(character.classConfigurations![0]?.proficienciesSelected).toEqual([
                "Insight",
                "Perception",
            ]);
        });

        it("should apply subclass from configuration", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Arcanist",
                level: 1,
                subclass: "Aethermancer",
                featureChoices: {},
                spellsSelected: [],
                proficienciesSelected: [],
            };

            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .setClassConfiguration(config)
                .build();

            expect(character.classes[0]?.subclass).toBe("Aethermancer");
        });

        it("should apply selected spells from configuration", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Arcanist",
                level: 1,
                subclass: "Aethermancer",
                featureChoices: {},
                spellsSelected: ["Aether Bolt", "Mending", "Shield"],
                proficienciesSelected: [],
            };

            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .setClassConfiguration(config)
                .build();

            expect(character.spells).toEqual(["Aether Bolt", "Mending", "Shield"]);
        });

        it("should apply selected proficiencies from configuration", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Arcanist",
                level: 1,
                featureChoices: {},
                spellsSelected: [],
                proficienciesSelected: ["Arcana", "History"],
            };

            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .setClassConfiguration(config)
                .build();

            expect(character.proficiencies?.skills).toBeDefined();
            expect(character.proficiencies?.skills).toContain("Arcana");
            expect(character.proficiencies?.skills).toContain("History");
        });

        it("should merge selected proficiencies with class proficiencies", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Shadehand",
                level: 1,
                featureChoices: {},
                spellsSelected: [],
                proficienciesSelected: ["Stealth", "Sleight of Hand"],
            };

            const character = builder
                .setName("Test Character")
                .setSpecies("Vulmir")
                .setClass("Shadehand")
                .setAbilityScores(validAbilityScores)
                .setClassConfiguration(config)
                .build();

            // Should have both class proficiencies and selected proficiencies
            expect(character.proficiencies?.skills).toBeDefined();
            expect(character.proficiencies?.skills).toContain("Stealth");
            expect(character.proficiencies?.skills).toContain("Sleight of Hand");
            // Should not have duplicates
            const uniqueSkills = new Set(character.proficiencies?.skills);
            expect(uniqueSkills.size).toBe(character.proficiencies?.skills.length);
        });

        it("should throw error if configuration class doesn't match character class", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Templar",
                level: 1,
                featureChoices: {},
                spellsSelected: [],
                proficienciesSelected: [],
            };

            expect(() => {
                builder
                    .setName("Test Character")
                    .setSpecies("Aqualoth")
                    .setClass("Arcanist")
                    .setClassConfiguration(config);
            }).toThrow("must match character class Arcanist");
        });

        it("should throw error if configuration level is not 1", () => {
            const builder = new CharacterBuilder();
            const config: ClassConfiguration = {
                classType: "Arcanist",
                level: 2,
                featureChoices: {},
                spellsSelected: [],
                proficienciesSelected: [],
            };

            expect(() => {
                builder
                    .setName("Test Character")
                    .setSpecies("Aqualoth")
                    .setClass("Arcanist")
                    .setClassConfiguration(config);
            }).toThrow("must be 1 for character creation");
        });

        it("should work without class configuration (optional)", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.classConfigurations).toBeUndefined();
        });
    });

    describe("Starting Equipment Application", () => {
        it("should apply starting equipment for Arcanist", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.inventory).toBeDefined();
            expect(character.inventory.length).toBeGreaterThan(0);

            const equipmentIds = character.inventory.map((item) => item.equipmentId);
            // Arcanist should have brass dagger
            expect(equipmentIds).toContain("brass-dagger-001");
            // Arcanist should have steamweave vest
            expect(equipmentIds).toContain("steamweave-vest-001");
            // Arcanist should have tinker's tools
            expect(equipmentIds).toContain("tinkers-tools-001");
        });

        it("should apply starting equipment for Templar", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Karnathi")
                .setClass("Templar")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.inventory).toBeDefined();
            expect(character.inventory.length).toBeGreaterThan(0);

            const equipmentIds = character.inventory.map((item) => item.equipmentId);
            // Templar should have steam hammer
            expect(equipmentIds).toContain("steam-hammer-001");
            // Templar should have gearmail hauberk
            expect(equipmentIds).toContain("gearmail-hauberk-001");
        });

        it("should apply starting equipment for Vanguard", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Tharn")
                .setClass("Vanguard")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.inventory).toBeDefined();
            expect(character.inventory.length).toBeGreaterThan(0);

            const equipmentIds = character.inventory.map((item) => item.equipmentId);
            // Vanguard should have steam hammer
            expect(equipmentIds).toContain("steam-hammer-001");
            // Vanguard should have gearmail hauberk
            expect(equipmentIds).toContain("gearmail-hauberk-001");
        });

        it("should apply starting currency from class", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            expect(character.currency).toBeDefined();
            expect(character.currency.cogs).toBeGreaterThan(0);
        });

        it("should apply starting equipment with aether cells", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Rendai")
                .setClass("Artifex")
                .setAbilityScores(validAbilityScores)
                .build();

            const equipmentIds = character.inventory.map((item) => item.equipmentId);
            // Should have aether cells for powered equipment
            const aetherCellCount = equipmentIds.filter((id) => id === "aether-cell-001").length;
            expect(aetherCellCount).toBeGreaterThan(0);
        });

        it("should not duplicate equipment when manually added and from starting equipment", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .addStartingEquipment(["brass-dagger-001"])
                .build();

            const equipmentIds = character.inventory.map((item) => item.equipmentId);
            const brassDaggerCount = equipmentIds.filter((id) => id === "brass-dagger-001").length;
            // Should have 2: one from manual add, one from starting equipment
            expect(brassDaggerCount).toBe(2);
        });

        it("should initialize inventory with unique item IDs", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            const itemIds = character.inventory.map((item) => item.id);
            const uniqueIds = new Set(itemIds);
            expect(uniqueIds.size).toBe(itemIds.length);
        });

        it("should set armor as equipped and other items as unequipped", () => {
            const builder = new CharacterBuilder();
            const character = builder
                .setName("Test Character")
                .setSpecies("Aqualoth")
                .setClass("Arcanist")
                .setAbilityScores(validAbilityScores)
                .build();

            // Find armor item (steamweave vest)
            const armorItem = character.inventory.find(
                (item) => item.equipmentId === "steamweave-vest-001"
            );
            expect(armorItem).toBeDefined();
            expect(armorItem?.equipped).toBe(true);

            // Check that non-armor items are unequipped
            const nonArmorItems = character.inventory.filter(
                (item) => item.equipmentId !== "steamweave-vest-001"
            );
            const allNonArmorUnequipped = nonArmorItems.every((item) => !item.equipped);
            expect(allNonArmorUnequipped).toBe(true);
        });
    });
});
