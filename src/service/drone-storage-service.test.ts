import type { Drone } from "@/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DroneStorageService, StorageError } from "./drone-storage-service";

// Mock drone data for testing
const mockDrone: Drone = {
    id: "drone-123",
    name: "Test Drone",
    templateId: "coghound",
    level: 1,
    hitPoints: { current: 10, maximum: 10 },
    heatPoints: { current: 0, maximum: 5 },
    modSlots: 2,
    mods: [],
    ownerId: "character-456",
};

describe("DroneStorageService", () => {
    let service: DroneStorageService;

    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        service = new DroneStorageService();
    });

    describe("getAllDrones", () => {
        it("should return empty array when no drones exist", () => {
            const drones = service.getAllDrones();
            expect(drones).toEqual([]);
        });

        it("should return all drones", () => {
            service.saveDrone(mockDrone);
            const drone2 = { ...mockDrone, id: "drone-456", name: "Second Drone" };
            service.saveDrone(drone2);

            const drones = service.getAllDrones();
            expect(drones).toHaveLength(2);
        });
    });

    describe("getDrone", () => {
        it("should return null when drone does not exist", () => {
            const drone = service.getDrone("nonexistent");
            expect(drone).toBeNull();
        });

        it("should return drone by id", () => {
            service.saveDrone(mockDrone);

            const drone = service.getDrone("drone-123");
            expect(drone).toBeTruthy();
            expect(drone?.id).toBe("drone-123");
            expect(drone?.name).toBe("Test Drone");
        });
    });

    describe("saveDrone", () => {
        it("should save a new drone", () => {
            service.saveDrone(mockDrone);

            const drone = service.getDrone("drone-123");
            expect(drone).toBeTruthy();
            expect(drone?.name).toBe("Test Drone");
        });

        it("should persist drone to localStorage", async () => {
            service.saveDrone(mockDrone);

            // Wait for debounced save
            await new Promise((resolve) => setTimeout(resolve, 600));

            const stored = localStorage.getItem("hollowgear:drones");
            expect(stored).toBeTruthy();

            const parsed = JSON.parse(stored!);
            expect(parsed.version).toBe(1);
            expect(parsed.drones).toHaveLength(1);
            expect(parsed.drones[0].id).toBe("drone-123");
        });

        it("should throw error when drone with same id already exists", () => {
            service.saveDrone(mockDrone);

            expect(() => service.saveDrone(mockDrone)).toThrow(
                "Drone with ID drone-123 already exists"
            );
        });
    });

    describe("updateDrone", () => {
        it("should update an existing drone", () => {
            service.saveDrone(mockDrone);

            const updated = { ...mockDrone, name: "Updated Drone" };
            service.updateDrone("drone-123", updated);

            const drone = service.getDrone("drone-123");
            expect(drone?.name).toBe("Updated Drone");
        });

        it("should throw error when drone does not exist", () => {
            expect(() => service.updateDrone("nonexistent", mockDrone)).toThrow(
                "Drone with ID nonexistent not found"
            );
        });

        it("should persist update to localStorage", async () => {
            service.saveDrone(mockDrone);

            const updated = { ...mockDrone, name: "Updated Drone" };
            service.updateDrone("drone-123", updated);

            // Wait for debounced save
            await new Promise((resolve) => setTimeout(resolve, 600));

            const stored = localStorage.getItem("hollowgear:drones");
            const parsed = JSON.parse(stored!);
            expect(parsed.drones[0].name).toBe("Updated Drone");
        });
    });

    describe("deleteDrone", () => {
        it("should delete an existing drone", () => {
            service.saveDrone(mockDrone);

            const deleted = service.deleteDrone("drone-123");
            expect(deleted).toBeTruthy();
            expect(deleted?.id).toBe("drone-123");

            const drone = service.getDrone("drone-123");
            expect(drone).toBeNull();
        });

        it("should return null when drone does not exist", () => {
            const deleted = service.deleteDrone("nonexistent");
            expect(deleted).toBeNull();
        });

        it("should persist deletion to localStorage", async () => {
            service.saveDrone(mockDrone);

            // Wait for initial save
            await new Promise((resolve) => setTimeout(resolve, 600));

            service.deleteDrone("drone-123");

            // Wait for deletion save
            await new Promise((resolve) => setTimeout(resolve, 600));

            const stored = localStorage.getItem("hollowgear:drones");
            const parsed = JSON.parse(stored!);
            expect(parsed.drones).toHaveLength(0);
        });
    });

    describe("getDronesByOwner", () => {
        it("should return empty array when no drones match owner", () => {
            service.saveDrone(mockDrone);

            const drones = service.getDronesByOwner("different-owner");
            expect(drones).toEqual([]);
        });

        it("should return drones for specific owner", () => {
            const drone1 = { ...mockDrone, id: "drone-1", ownerId: "owner-1" };
            const drone2 = { ...mockDrone, id: "drone-2", ownerId: "owner-2" };
            const drone3 = { ...mockDrone, id: "drone-3", ownerId: "owner-1" };

            service.saveDrone(drone1);
            service.saveDrone(drone2);
            service.saveDrone(drone3);

            const owner1Drones = service.getDronesByOwner("owner-1");
            expect(owner1Drones).toHaveLength(2);
            expect(owner1Drones.map((d) => d.id)).toContain("drone-1");
            expect(owner1Drones.map((d) => d.id)).toContain("drone-3");
        });

        it("should handle drones without owner", () => {
            const droneWithOwner = { ...mockDrone, id: "drone-1", ownerId: "owner-1" };
            const droneWithoutOwner = { ...mockDrone, id: "drone-2", ownerId: undefined };

            service.saveDrone(droneWithOwner);
            service.saveDrone(droneWithoutOwner);

            const drones = service.getDronesByOwner("owner-1");
            expect(drones).toHaveLength(1);
            expect(drones[0]?.id).toBe("drone-1");
        });
    });

    describe("clearAll", () => {
        it("should remove all drone data from localStorage", async () => {
            service.saveDrone(mockDrone);

            // Wait for save
            await new Promise((resolve) => setTimeout(resolve, 600));

            expect(localStorage.getItem("hollowgear:drones")).toBeTruthy();

            service.clearAll();
            expect(localStorage.getItem("hollowgear:drones")).toBeNull();
            expect(service.getAllDrones()).toEqual([]);
        });
    });

    describe("cleanup", () => {
        it("should clear pending save timeout", async () => {
            const saveSpy = vi.spyOn(service as any, "saveDrones");

            service.saveDrone(mockDrone);
            service.cleanup();

            // Wait longer than debounce delay
            await new Promise((resolve) => setTimeout(resolve, 600));

            // Should not have called saveDrones because cleanup cleared the timeout
            expect(saveSpy).not.toHaveBeenCalled();
        });
    });

    describe("persistence", () => {
        it("should load drones from localStorage on initialization", async () => {
            service.saveDrone(mockDrone);

            // Wait for save
            await new Promise((resolve) => setTimeout(resolve, 600));

            // Create new service instance
            const newService = new DroneStorageService();

            const drones = newService.getAllDrones();
            expect(drones).toHaveLength(1);
            expect(drones[0]?.id).toBe("drone-123");
        });

        it("should handle invalid localStorage data gracefully", () => {
            localStorage.setItem("hollowgear:drones", "invalid json{");

            const newService = new DroneStorageService();
            expect(newService.getAllDrones()).toEqual([]);
        });

        it("should filter out invalid drones on load", () => {
            const validDrone = mockDrone;
            const invalidDrone = { id: "invalid", name: "Missing Fields" };

            localStorage.setItem(
                "hollowgear:drones",
                JSON.stringify({
                    version: 1,
                    drones: [validDrone, invalidDrone],
                    lastModified: new Date().toISOString(),
                })
            );

            const newService = new DroneStorageService();
            const drones = newService.getAllDrones();
            expect(drones).toHaveLength(1);
            expect(drones[0]?.id).toBe("drone-123");
        });
    });
});
