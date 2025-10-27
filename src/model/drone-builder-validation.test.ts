import type { Drone } from "@/types/drones";
import { describe, expect, it } from "vitest";
import { DroneBuilder, type DroneValidationContext } from "./drone-builder";

describe("DroneBuilder Validation", () => {
    describe("Name Uniqueness Validation", () => {
        it("should allow unique drone names", () => {
            const existingDrones: Drone[] = [
                {
                    id: "drone-001",
                    name: "Sparky",
                    templateId: "combat-drone",
                    level: 1,
                    hitPoints: { current: 12, maximum: 12 },
                    heatPoints: { current: 0, maximum: 10 },
                    modSlots: 1,
                    mods: [],
                    destroyed: false,
                },
            ];

            const context: DroneValidationContext = {
                existingDrones,
            };

            const builder = new DroneBuilder();
            builder.setValidationContext(context).setName("Whisper").setType("Recon").setLevel(1);

            const drone = builder.build();
            expect(drone.name).toBe("Whisper");
        });

        it("should throw error for duplicate drone names (case-insensitive)", () => {
            const existingDrones: Drone[] = [
                {
                    id: "drone-001",
                    name: "Sparky",
                    templateId: "combat-drone",
                    level: 1,
                    hitPoints: { current: 12, maximum: 12 },
                    heatPoints: { current: 0, maximum: 10 },
                    modSlots: 1,
                    mods: [],
                    destroyed: false,
                },
            ];

            const context: DroneValidationContext = {
                existingDrones,
            };

            const builder = new DroneBuilder();
            builder
                .setValidationContext(context)
                .setName("sparky") // Different case
                .setType("Recon")
                .setLevel(1);

            expect(() => builder.build()).toThrow(/already in use/);
        });

        it("should allow same name when editing existing drone", () => {
            const existingDrones: Drone[] = [
                {
                    id: "drone-001",
                    name: "Sparky",
                    templateId: "combat-drone",
                    level: 1,
                    hitPoints: { current: 12, maximum: 12 },
                    heatPoints: { current: 0, maximum: 10 },
                    modSlots: 1,
                    mods: [],
                    destroyed: false,
                },
            ];

            const context: DroneValidationContext = {
                existingDrones,
            };

            const builder = new DroneBuilder();
            // Simulate editing by setting the drone id to match existing
            builder.setValidationContext(context).setName("Sparky").setType("Combat").setLevel(1);

            // Manually set the id to simulate editing
            (builder as any).drone.id = "drone-001";

            const drone = builder.build();
            expect(drone.name).toBe("Sparky");
        });
    });

    describe("Equipment Compatibility Validation", () => {
        it("should validate mod exists when validation context is provided", () => {
            const context: DroneValidationContext = {
                existingDrones: [],
                availableMods: ["mod-1", "mod-2", "mod-3"],
            };

            const builder = new DroneBuilder();
            builder
                .setValidationContext(context)
                .setName("TestDrone")
                .setType("Combat")
                .setLevel(1);

            expect(() => builder.addMod("invalid-mod")).toThrow(/not a valid mod/);
        });

        it("should allow valid mods when validation context is provided", () => {
            const context: DroneValidationContext = {
                existingDrones: [],
                availableMods: ["mod-1", "mod-2", "mod-3"],
            };

            const builder = new DroneBuilder();
            builder
                .setValidationContext(context)
                .setName("TestDrone")
                .setType("Combat")
                .setLevel(1)
                .addMod("mod-1");

            const drone = builder.build();
            expect(drone.mods).toContain("mod-1");
        });

        it("should validate all mods when setting mods array", () => {
            const context: DroneValidationContext = {
                existingDrones: [],
                availableMods: ["mod-1", "mod-2", "mod-3"],
            };

            const builder = new DroneBuilder();
            builder
                .setValidationContext(context)
                .setName("TestDrone")
                .setType("Combat")
                .setLevel(1);

            expect(() => builder.setMods(["mod-1", "invalid-mod"])).toThrow(
                /contains invalid mods/
            );
        });

        it("should enforce mod slot limits with helpful error message", () => {
            const builder = new DroneBuilder();
            builder.setName("TestDrone").setType("Combat").setLevel(1); // Level 1 = 1 slot

            builder.addMod("mod-1");
            expect(() => builder.addMod("mod-2")).toThrow(/cannot exceed 1 mod slots/);
        });

        it("should provide helpful error when setting too many mods", () => {
            const builder = new DroneBuilder();
            builder.setName("TestDrone").setType("Combat").setLevel(1); // Level 1 = 1 slot

            expect(() => builder.setMods(["mod-1", "mod-2"])).toThrow(/You have selected 2 items/);
        });
    });

    describe("Validation Context", () => {
        it("should work without validation context", () => {
            const builder = new DroneBuilder();
            builder.setName("TestDrone").setType("Combat").setLevel(1).addMod("any-mod");

            const drone = builder.build();
            expect(drone.name).toBe("TestDrone");
            expect(drone.mods).toContain("any-mod");
        });

        it("should skip uniqueness check when no validation context is provided", () => {
            const builder = new DroneBuilder();
            builder.setName("Sparky").setType("Combat").setLevel(1);

            // Should not throw even if name might be duplicate
            const drone = builder.build();
            expect(drone.name).toBe("Sparky");
        });
    });
});
