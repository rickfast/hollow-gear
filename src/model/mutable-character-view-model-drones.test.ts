import { describe, expect, it } from "bun:test";
import { PREGENS } from "@/data";
import { MutableCharacterViewModel } from "./mutable-character-view-model";

describe("MutableCharacterViewModel - Drone Updates", () => {
    it("should update drone hit points", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new MutableCharacterViewModel(lyrra!);

        const updatedChar = vm.updateDroneHitPoints("lyrra-drone-sparky", 8);
        const updatedVm = new MutableCharacterViewModel(updatedChar);

        const sparky = updatedVm.drones.find((d) => d.id === "lyrra-drone-sparky");
        expect(sparky?.hitPoints.current).toBe(8);
        expect(sparky?.hitPoints.maximum).toBe(12);
    });

    it("should update drone heat points", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new MutableCharacterViewModel(lyrra!);

        const updatedChar = vm.updateDroneHeatPoints("lyrra-drone-sparky", 5);
        const updatedVm = new MutableCharacterViewModel(updatedChar);

        const sparky = updatedVm.drones.find((d) => d.id === "lyrra-drone-sparky");
        expect(sparky?.heatPoints.current).toBe(5);
        expect(sparky?.heatPoints.maximum).toBe(10);
    });

    it("should throw error if drone not found", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new MutableCharacterViewModel(lyrra!);

        expect(() => vm.updateDroneHitPoints("invalid-drone-id", 5)).toThrow("drone not found");
    });

    it("should throw error if character has no drones", () => {
        const karn = PREGENS.find((c) => c.name === "Karn Voss");
        const vm = new MutableCharacterViewModel(karn!);

        expect(() => vm.updateDroneHitPoints("any-id", 5)).toThrow("character has no drones");
    });

    it("should validate HP range", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new MutableCharacterViewModel(lyrra!);

        expect(() => vm.updateDroneHitPoints("lyrra-drone-sparky", -1)).toThrow();
        expect(() => vm.updateDroneHitPoints("lyrra-drone-sparky", 100)).toThrow();
    });

    it("should validate heat range", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new MutableCharacterViewModel(lyrra!);

        expect(() => vm.updateDroneHeatPoints("lyrra-drone-sparky", -1)).toThrow();
        expect(() => vm.updateDroneHeatPoints("lyrra-drone-sparky", 100)).toThrow();
    });

    it("should not affect other drones when updating one", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new MutableCharacterViewModel(lyrra!);

        const updatedChar = vm.updateDroneHitPoints("lyrra-drone-sparky", 5);
        const updatedVm = new MutableCharacterViewModel(updatedChar);

        const sparky = updatedVm.drones.find((d) => d.id === "lyrra-drone-sparky");
        const tinker = updatedVm.drones.find((d) => d.id === "lyrra-drone-tinker");

        expect(sparky?.hitPoints.current).toBe(5);
        expect(tinker?.hitPoints.current).toBe(8); // Should remain unchanged
    });

    it("should maintain immutability", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new MutableCharacterViewModel(lyrra!);

        const originalSparkyHP = vm.drones.find((d) => d.id === "lyrra-drone-sparky")?.hitPoints
            .current;

        vm.updateDroneHitPoints("lyrra-drone-sparky", 5);

        // Original VM should be unchanged
        const currentSparkyHP = vm.drones.find((d) => d.id === "lyrra-drone-sparky")?.hitPoints
            .current;
        expect(currentSparkyHP).toBe(originalSparkyHP);
    });
});
