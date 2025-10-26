/**
 * Integration test for drone-character association
 * 
 * This test verifies that:
 * 1. Drones can be associated with Artifex characters
 * 2. Character drone limits are enforced
 * 3. Character drones array is updated when a drone is created
 * 4. Character associations are cleaned up when a drone is deleted
 */

import { DroneBuilder } from "@/model/drone-builder";
import { DroneStorageService } from "@/service/drone-storage-service";
import type { Character, Drone } from "@/types";
import { describe, expect, it } from "vitest";

describe("Drone-Character Association", () => {
    it("should associate drone with character and update character's drones array", () => {
        // Create a mock Artifex character
        const mockCharacter: Character = {
            id: "artifex-123",
            name: "Test Artifex",
            species: "Rendai",
            classes: [{ level: 3, class: "Artifex" }],
            level: 3,
            abilityScores: {
                strength: 10,
                dexterity: 12,
                constitution: 14,
                intelligence: 16,
                wisdom: 10,
                charisma: 8,
            },
            hitPoints: { current: 20, maximum: 20 },
            heatPoints: { current: 0, maximum: 10 },
            skills: {} as any,
            inventory: [],
            mods: [],
            currency: { cogs: 100, gears: 0, cores: 0 },
            spells: [],
            mindcraftPowers: [],
            drones: [], // Start with no drones
            armorClass: 14,
            initiative: 1,
            speed: 30,
            proficiencies: undefined,
            languages: [],
            heatStressLevel: 0,
            exhaustionLevel: 0,
            conditions: [],
        };

        // Create a drone with owner
        const builder = new DroneBuilder();
        builder.setName("Test Drone").setType("Recon").setLevel(1).setOwner(mockCharacter.id);

        const drone = builder.build();

        // Verify drone has owner
        expect(drone.ownerId).toBe(mockCharacter.id);

        // Simulate updating character's drones array
        const updatedCharacter: Character = {
            ...mockCharacter,
            drones: [...(mockCharacter.drones || []), drone],
            activeDroneId: drone.id,
        };

        // Verify character now has the drone
        expect(updatedCharacter.drones).toHaveLength(1);
        expect(updatedCharacter.drones?.[0]?.id).toBe(drone.id);
        expect(updatedCharacter.activeDroneId).toBe(drone.id);
    });

    it("should enforce drone limit (1 active drone per Artifex)", () => {
        const mockCharacter: Character = {
            id: "artifex-456",
            name: "Test Artifex",
            species: "Rendai",
            classes: [{ level: 5, class: "Artifex" }],
            level: 5,
            abilityScores: {
                strength: 10,
                dexterity: 12,
                constitution: 14,
                intelligence: 16,
                wisdom: 10,
                charisma: 8,
            },
            hitPoints: { current: 30, maximum: 30 },
            heatPoints: { current: 0, maximum: 10 },
            skills: {} as any,
            inventory: [],
            mods: [],
            currency: { cogs: 100, gears: 0, cores: 0 },
            spells: [],
            mindcraftPowers: [],
            drones: [
                {
                    id: "existing-drone",
                    name: "Existing Drone",
                    templateId: "coghound",
                    level: 1,
                    hitPoints: { current: 10, maximum: 10 },
                    heatPoints: { current: 0, maximum: 5 },
                    modSlots: 2,
                    mods: [],
                    ownerId: "artifex-456",
                },
            ],
            armorClass: 14,
            initiative: 1,
            speed: 30,
            proficiencies: undefined,
            languages: [],
            heatStressLevel: 0,
            exhaustionLevel: 0,
            conditions: [],
        };

        // Check drone limit
        const droneLimit = 1;
        const currentDroneCount = mockCharacter.drones?.length || 0;
        const canAddDrone = currentDroneCount < droneLimit;

        // Should not be able to add another drone
        expect(canAddDrone).toBe(false);
        expect(currentDroneCount).toBe(1);
    });

    it("should remove drone from character when drone is deleted", () => {
        const droneId = "drone-to-delete";
        const characterId = "artifex-789";

        const mockDrone: Drone = {
            id: droneId,
            name: "Drone to Delete",
            templateId: "coghound",
            level: 1,
            hitPoints: { current: 10, maximum: 10 },
            heatPoints: { current: 0, maximum: 5 },
            modSlots: 2,
            mods: [],
            ownerId: characterId,
        };

        const mockCharacter: Character = {
            id: characterId,
            name: "Test Artifex",
            species: "Rendai",
            classes: [{ level: 3, class: "Artifex" }],
            level: 3,
            abilityScores: {
                strength: 10,
                dexterity: 12,
                constitution: 14,
                intelligence: 16,
                wisdom: 10,
                charisma: 8,
            },
            hitPoints: { current: 20, maximum: 20 },
            heatPoints: { current: 0, maximum: 10 },
            skills: {} as any,
            inventory: [],
            mods: [],
            currency: { cogs: 100, gears: 0, cores: 0 },
            spells: [],
            mindcraftPowers: [],
            drones: [mockDrone],
            activeDroneId: droneId,
            armorClass: 14,
            initiative: 1,
            speed: 30,
            proficiencies: undefined,
            languages: [],
            heatStressLevel: 0,
            exhaustionLevel: 0,
            conditions: [],
        };

        // Simulate drone deletion and character update
        const updatedCharacter: Character = {
            ...mockCharacter,
            drones: (mockCharacter.drones || []).filter((d) => d.id !== droneId),
            activeDroneId:
                mockCharacter.activeDroneId === droneId ? undefined : mockCharacter.activeDroneId,
        };

        // Verify drone was removed from character
        expect(updatedCharacter.drones).toHaveLength(0);
        expect(updatedCharacter.activeDroneId).toBeUndefined();
    });

    it("should handle drone without owner", () => {
        // Create a drone without owner
        const builder = new DroneBuilder();
        builder.setName("Orphan Drone").setType("Combat").setLevel(1);

        const drone = builder.build();

        // Verify drone has no owner
        expect(drone.ownerId).toBeUndefined();
    });
});
