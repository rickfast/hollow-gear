import type { Character, Drone } from "@/types";
import { describe, expect, it } from "bun:test";
import { getActiveDrone, validateActiveDrone, validateDroneOwnership } from "./character-utils";

describe("Drone Utilities", () => {
    const mockDrone: Drone = {
        id: "drone-001",
        name: "Sparky",
        templateId: "combat-drone",
        level: 3,
        hitPoints: {
            current: 12,
            maximum: 12,
        },
        heatPoints: {
            current: 0,
            maximum: 10,
        },
        modSlots: 1,
        mods: [],
    };

    const mockArtifexCharacter: Partial<Character> = {
        id: "char-001",
        name: "Test Artifex",
        classes: [{ class: "Artifex", level: 3 }],
        drones: [mockDrone],
        activeDroneId: "drone-001",
    };

    const mockNonArtifexCharacter: Partial<Character> = {
        id: "char-002",
        name: "Test Vanguard",
        classes: [{ class: "Vanguard", level: 3 }],
        drones: [mockDrone],
    };

    describe("validateDroneOwnership", () => {
        it("should allow Artifex to have drones", () => {
            expect(() => validateDroneOwnership(mockArtifexCharacter as Character)).not.toThrow();
        });

        it("should throw error if non-Artifex has drones", () => {
            expect(() => validateDroneOwnership(mockNonArtifexCharacter as Character)).toThrow(
                "only Artifex characters can have drones"
            );
        });

        it("should allow non-Artifex with no drones", () => {
            const char = { ...mockNonArtifexCharacter, drones: [] };
            expect(() => validateDroneOwnership(char as Character)).not.toThrow();
        });
    });

    describe("validateActiveDrone", () => {
        it("should validate correct active drone", () => {
            expect(() => validateActiveDrone(mockArtifexCharacter as Character)).not.toThrow();
        });

        it("should throw if activeDroneId doesn't match any drone", () => {
            const char = { ...mockArtifexCharacter, activeDroneId: "invalid-id" };
            expect(() => validateActiveDrone(char as Character)).toThrow(
                "activeDroneId does not match any drone"
            );
        });

        it("should throw if active drone is destroyed", () => {
            const destroyedDrone = { ...mockDrone, destroyed: true };
            const char = {
                ...mockArtifexCharacter,
                drones: [destroyedDrone],
                activeDroneId: "drone-001",
            };
            expect(() => validateActiveDrone(char as Character)).toThrow(
                "active drone is marked as destroyed"
            );
        });

        it("should throw if activeDroneId is set but no drones exist", () => {
            const char = { ...mockArtifexCharacter, drones: [], activeDroneId: "drone-001" };
            expect(() => validateActiveDrone(char as Character)).toThrow(
                "character has no drones but activeDroneId is set"
            );
        });
    });

    describe("getActiveDrone", () => {
        it("should return active drone", () => {
            const drone = getActiveDrone(mockArtifexCharacter as Character);
            expect(drone).toBeDefined();
            expect(drone?.id).toBe("drone-001");
        });

        it("should return undefined if no active drone", () => {
            const char = { ...mockArtifexCharacter, activeDroneId: undefined };
            const drone = getActiveDrone(char as Character);
            expect(drone).toBeUndefined();
        });

        it("should return undefined if no drones array", () => {
            const char = { ...mockArtifexCharacter, drones: undefined };
            const drone = getActiveDrone(char as Character);
            expect(drone).toBeUndefined();
        });
    });
});
