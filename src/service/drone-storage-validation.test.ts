import type { Drone } from "@/types/drones";
import { beforeEach, describe, expect, it } from "vitest";
import { DroneStorageService } from "./drone-storage-service";

// Mock localStorage for testing
const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        removeItem: (key: string) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
    };
})();

// @ts-ignore
global.localStorage = localStorageMock;

describe("DroneStorageService Validation", () => {
    let service: DroneStorageService;

    beforeEach(() => {
        localStorage.clear();
        service = new DroneStorageService();
    });

    describe("Name Uniqueness Validation", () => {
        const createTestDrone = (id: string, name: string): Drone => ({
            id,
            name,
            templateId: "combat-drone",
            level: 1,
            hitPoints: { current: 12, maximum: 12 },
            heatPoints: { current: 0, maximum: 10 },
            modSlots: 1,
            mods: [],
            destroyed: false,
        });

        it("should return true for unique names", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            expect(service.isNameUnique("Whisper")).toBe(true);
        });

        it("should return false for duplicate names (case-insensitive)", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            expect(service.isNameUnique("sparky")).toBe(false);
            expect(service.isNameUnique("SPARKY")).toBe(false);
            expect(service.isNameUnique("Sparky")).toBe(false);
        });

        it("should ignore whitespace when checking uniqueness", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            expect(service.isNameUnique("  Sparky  ")).toBe(false);
        });

        it("should allow same name when excluding specific drone ID", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            // Should return true when excluding the drone with that name
            expect(service.isNameUnique("Sparky", "drone-001")).toBe(true);
        });

        it("should return false for duplicate even when excluding different ID", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            // Should return false when excluding a different drone
            expect(service.isNameUnique("Sparky", "drone-002")).toBe(false);
        });

        it("should validate name uniqueness and throw error for duplicates", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            expect(() => service.validateNameUniqueness("Sparky")).toThrow(/already exists/);
        });

        it("should not throw error for unique names", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            expect(() => service.validateNameUniqueness("Whisper")).not.toThrow();
        });

        it("should not throw error when excluding the drone being edited", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            expect(() => service.validateNameUniqueness("Sparky", "drone-001")).not.toThrow();
        });
    });

    describe("Integration with save operations", () => {
        const createTestDrone = (id: string, name: string): Drone => ({
            id,
            name,
            templateId: "combat-drone",
            level: 1,
            hitPoints: { current: 12, maximum: 12 },
            heatPoints: { current: 0, maximum: 10 },
            modSlots: 1,
            mods: [],
            destroyed: false,
        });

        it("should check uniqueness before saving new drone", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            // Validate before attempting to save
            expect(() => service.validateNameUniqueness("Sparky")).toThrow();
        });

        it("should allow updating drone with same name", () => {
            const drone1 = createTestDrone("drone-001", "Sparky");
            service.saveDrone(drone1);

            // Should be able to update with same name
            expect(() => service.validateNameUniqueness("Sparky", "drone-001")).not.toThrow();

            const updatedDrone = { ...drone1, level: 2 };
            service.updateDrone("drone-001", updatedDrone);

            const retrieved = service.getDrone("drone-001");
            expect(retrieved?.level).toBe(2);
        });
    });
});
