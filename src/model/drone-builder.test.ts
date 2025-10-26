/**
 * Unit tests for DroneBuilder
 */

import { describe, expect, it } from "vitest";
import { DroneBuilder } from "./drone-builder";
import { ValidationError } from "./character-utils";

describe("DroneBuilder", () => {
    describe("Valid Drone Creation", () => {
        it("should create a valid drone with all required fields", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .build();

            expect(drone.name).toBe("Sparky");
            expect(drone.templateId).toBe("combat-drone");
            expect(drone.level).toBe(1);
            expect(drone.id).toBeDefined();
            expect(drone.hitPoints).toBeDefined();
            expect(drone.hitPoints.current).toBe(12);
            expect(drone.hitPoints.maximum).toBe(12);
            expect(drone.heatPoints).toBeDefined();
            expect(drone.heatPoints.current).toBe(0);
            expect(drone.heatPoints.maximum).toBe(10);
            expect(drone.modSlots).toBe(1);
            expect(drone.mods).toEqual([]);
            expect(drone.destroyed).toBe(false);
        });

        it("should create a utility drone", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Helper")
                .setType("Utility")
                .setLevel(1)
                .build();

            expect(drone.templateId).toBe("utility-drone");
            expect(drone.hitPoints.maximum).toBe(8);
        });

        it("should create a recon drone", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Scout")
                .setType("Recon")
                .setLevel(1)
                .build();

            expect(drone.templateId).toBe("recon-drone");
            expect(drone.hitPoints.maximum).toBe(7);
        });

        it("should create a drone with optional description", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .setDescription("A loyal combat companion")
                .build();

            expect(drone.customization?.behavioralQuirk).toBe("A loyal combat companion");
        });

        it("should create a drone with owner", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .setOwner("char-123")
                .build();

            expect(drone.ownerId).toBe("char-123");
        });

        it("should create a drone with personality quirk", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .setPersonalityQuirk("Emits low mechanical purring when praised")
                .build();

            expect(drone.personalityQuirk).toBe("Emits low mechanical purring when praised");
        });

        it("should create a drone with customization options", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .setShellFinish("Black enamel")
                .setCoreColor("Blue")
                .build();

            expect(drone.customization?.shellFinish).toBe("Black enamel");
            expect(drone.customization?.coreColor).toBe("Blue");
        });

        it("should create a drone with archetype", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .setArchetype("coghound")
                .build();

            expect(drone.archetypeId).toBe("coghound");
        });

        it("should create a drone with mods", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .addMod("mod-001")
                .build();

            expect(drone.mods).toEqual(["mod-001"]);
        });

        it("should allow setting mods array directly", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(5) // Level 5 has 2 mod slots
                .setMods(["mod-001", "mod-002"])
                .build();

            expect(drone.mods).toEqual(["mod-001", "mod-002"]);
        });

        it("should allow removing mods", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(5) // Level 5 has 2 mod slots
                .addMod("mod-001")
                .addMod("mod-002")
                .removeMod("mod-001")
                .build();

            expect(drone.mods).toEqual(["mod-002"]);
        });
    });

    describe("Mod Slot Calculation", () => {
        it("should have 1 mod slot at level 1", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(1)
                .build();

            expect(drone.modSlots).toBe(1);
        });

        it("should have 2 mod slots at level 5", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(5)
                .build();

            expect(drone.modSlots).toBe(2);
        });

        it("should have 3 mod slots at level 9", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(9)
                .build();

            expect(drone.modSlots).toBe(3);
        });

        it("should have 4 mod slots at level 13", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(13)
                .build();

            expect(drone.modSlots).toBe(4);
        });

        it("should have 5 mod slots at level 17", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(17)
                .build();

            expect(drone.modSlots).toBe(5);
        });
    });

    describe("Validation Errors", () => {
        it("should throw error when name is missing", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder
                    .setType("Combat")
                    .setLevel(1)
                    .build();
            }).toThrow(ValidationError);
        });

        it("should throw error when name is empty", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder.setName("");
            }).toThrow(ValidationError);
        });

        it("should throw error when name is too long", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder.setName("A".repeat(51));
            }).toThrow(ValidationError);
        });

        it("should throw error when type is missing", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder
                    .setName("Sparky")
                    .setLevel(1)
                    .build();
            }).toThrow(ValidationError);
        });

        it("should throw error when level is missing", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder
                    .setName("Sparky")
                    .setType("Combat")
                    .build();
            }).toThrow(ValidationError);
        });

        it("should throw error when level is below 1", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder.setLevel(0);
            }).toThrow(ValidationError);
        });

        it("should throw error when level is above 20", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder.setLevel(21);
            }).toThrow(ValidationError);
        });

        it("should throw error when invalid drone type is provided", () => {
            const builder = new DroneBuilder();
            expect(() => {
                // @ts-expect-error Testing invalid type
                builder.setType("InvalidType");
            }).toThrow(ValidationError);
        });

        it("should throw error when invalid template ID is provided", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder.setTemplateId("invalid-template-id");
            }).toThrow(ValidationError);
        });

        it("should throw error when too many mods are added", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder
                    .setName("Sparky")
                    .setType("Combat")
                    .setLevel(1)
                    .addMod("mod-001")
                    .addMod("mod-002"); // Level 1 only has 1 slot
            }).toThrow(ValidationError);
        });

        it("should throw error when setting too many mods at once", () => {
            const builder = new DroneBuilder();
            expect(() => {
                builder
                    .setName("Sparky")
                    .setType("Combat")
                    .setLevel(1)
                    .setMods(["mod-001", "mod-002"]); // Level 1 only has 1 slot
            }).toThrow(ValidationError);
        });
    });

    describe("Fluent API", () => {
        it("should allow method chaining", () => {
            const builder = new DroneBuilder();
            const drone = builder
                .setName("Sparky")
                .setType("Combat")
                .setLevel(3)
                .setOwner("char-123")
                .setPersonalityQuirk("Emits low mechanical purring when praised")
                .setShellFinish("Black enamel")
                .setCoreColor("Blue")
                .setDescription("A loyal companion")
                .addMod("mod-001")
                .build();

            expect(drone.name).toBe("Sparky");
            expect(drone.level).toBe(3);
            expect(drone.ownerId).toBe("char-123");
            expect(drone.personalityQuirk).toBe("Emits low mechanical purring when praised");
            expect(drone.customization?.shellFinish).toBe("Black enamel");
            expect(drone.customization?.coreColor).toBe("Blue");
            expect(drone.customization?.behavioralQuirk).toBe("A loyal companion");
            expect(drone.mods).toEqual(["mod-001"]);
        });
    });
});
