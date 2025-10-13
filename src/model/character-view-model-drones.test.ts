import { describe, expect, it } from "bun:test";
import { PREGENS } from "@/data";
import { CharacterViewModel } from "./character-view-model";

describe("CharacterViewModel - Drones", () => {
    it("should include active drone in summary", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new CharacterViewModel(lyrra!);

        expect(vm.summary.activeDroneId).toBe("lyrra-drone-sparky");
    });

    it("should include drones array", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new CharacterViewModel(lyrra!);

        expect(vm.drones).toBeDefined();
        expect(vm.drones.length).toBe(2);
    });

    it("should set activeDrone to the active drone", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new CharacterViewModel(lyrra!);

        expect(vm.activeDrone).toBeDefined();
        expect(vm.activeDrone?.name).toBe("Sparky");
        expect(vm.activeDrone?.id).toBe("lyrra-drone-sparky");
    });

    it("should create an action for active drone attack", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new CharacterViewModel(lyrra!);

        const droneAction = vm.actions.find((a) => a.name.includes("Sparky"));
        expect(droneAction).toBeDefined();
        expect(droneAction?.name).toBe("Sparky - Shock Prod");
        expect(droneAction?.type).toBe("Drone Attack");
        expect(droneAction?.hit?.modifier).toBe("+4");
        expect(droneAction?.damage?.damageType).toBe("Lightning");
    });

    it("should not create drone action for destroyed drone", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new CharacterViewModel(lyrra!);

        const tinkerAction = vm.actions.find((a) => a.name.includes("Tinker"));
        expect(tinkerAction).toBeUndefined();
    });

    it("should include unarmed strike and weapon actions alongside drone action", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const vm = new CharacterViewModel(lyrra!);

        expect(vm.actions.length).toBeGreaterThan(2); // At least weapon + unarmed + drone
        expect(vm.actions.some((a) => a.name === "Unarmed Strike")).toBe(true);
        expect(vm.actions.some((a) => a.name.includes("Sparky"))).toBe(true);
    });
});
