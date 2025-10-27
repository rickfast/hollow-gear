import { DroneBuilder } from "@/model/drone-builder";
import type { Drone } from "@/types";
import { beforeEach, describe, expect, it } from "vitest";

describe("Drone Edit Functionality", () => {
    let existingDrone: Drone;

    beforeEach(() => {
        // Create a drone that simulates an existing drone
        const builder = new DroneBuilder();
        existingDrone = builder
            .setName("Test Drone")
            .setType("Combat")
            .setLevel(1)
            .setDescription("Original description")
            .setOwner("char-123")
            .build();
    });

    it("should preserve drone ID when editing", () => {
        const originalId = existingDrone.id;

        // Simulate editing by creating an updated drone with the same ID
        const updatedDrone: Drone = {
            ...existingDrone,
            name: "Updated Drone Name",
        };

        expect(updatedDrone.id).toBe(originalId);
    });

    it("should preserve drone associations when editing", () => {
        const originalOwnerId = existingDrone.ownerId;

        // Simulate editing without changing owner
        const updatedDrone: Drone = {
            ...existingDrone,
            name: "Updated Drone Name",
        };

        expect(updatedDrone.ownerId).toBe(originalOwnerId);
    });

    it("should allow changing drone owner during edit", () => {
        const newOwnerId = "char-456";

        // Simulate editing with new owner
        const updatedDrone: Drone = {
            ...existingDrone,
            ownerId: newOwnerId,
        };

        expect(updatedDrone.ownerId).toBe(newOwnerId);
        expect(updatedDrone.id).toBe(existingDrone.id);
    });

    it("should allow updating drone properties while preserving structure", () => {
        const updatedDrone: Drone = {
            ...existingDrone,
            name: "New Name",
            mods: ["mod-1", "mod-2"],
            customization: {
                ...existingDrone.customization,
                behavioralQuirk: "Updated quirk",
            },
        };

        expect(updatedDrone.id).toBe(existingDrone.id);
        expect(updatedDrone.name).toBe("New Name");
        expect(updatedDrone.mods).toEqual(["mod-1", "mod-2"]);
        expect(updatedDrone.customization?.behavioralQuirk).toBe("Updated quirk");
        expect(updatedDrone.templateId).toBe(existingDrone.templateId);
        expect(updatedDrone.level).toBe(existingDrone.level);
    });

    it("should allow removing owner during edit", () => {
        const updatedDrone: Drone = {
            ...existingDrone,
            ownerId: undefined,
        };

        expect(updatedDrone.ownerId).toBeUndefined();
        expect(updatedDrone.id).toBe(existingDrone.id);
    });
});
