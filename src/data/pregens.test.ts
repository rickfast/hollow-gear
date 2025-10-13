import {
    getActiveDrone,
    validateActiveDrone,
    validateDroneOwnership,
} from "@/model/character-utils";
import { describe, expect, it } from "bun:test";
import { PREGENS, PREGEN_DRONES } from "./pregens";

describe("Pregen Characters with Drones", () => {
    it("should have Lyrra Quenchcoil as an Artifex with drones", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        expect(lyrra).toBeDefined();
        expect(lyrra?.classes[0]?.class).toBe("Artifex");
        expect(lyrra?.drones).toBeDefined();
        expect(lyrra?.drones?.length).toBe(2);
    });

    it("should have Sparky as the active drone", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        expect(lyrra?.activeDroneId).toBe("lyrra-drone-sparky");

        const activeDrone = getActiveDrone(lyrra!);
        expect(activeDrone).toBeDefined();
        expect(activeDrone?.name).toBe("Sparky");
        expect(activeDrone?.templateId).toBe("combat-drone");
    });

    it("should have Tinker as a destroyed drone", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        const tinker = lyrra?.drones?.find((d) => d.name === "Tinker");

        expect(tinker).toBeDefined();
        expect(tinker?.destroyed).toBe(true);
        expect(tinker?.templateId).toBe("utility-drone");
    });

    it("should pass drone validation for Lyrra", () => {
        const lyrra = PREGENS.find((c) => c.name === "Lyrra Quenchcoil");
        expect(() => validateDroneOwnership(lyrra!)).not.toThrow();
        expect(() => validateActiveDrone(lyrra!)).not.toThrow();
    });

    it("should export PREGEN_DRONES array", () => {
        expect(PREGEN_DRONES).toBeDefined();
        expect(PREGEN_DRONES.length).toBe(2);
        expect(PREGEN_DRONES[0]?.name).toBe("Sparky");
        expect(PREGEN_DRONES[1]?.name).toBe("Tinker");
    });

    it("should have correct drone stats for Sparky", () => {
        const sparky = PREGEN_DRONES[0];
        expect(sparky?.hitPoints.maximum).toBe(12);
        expect(sparky?.hitPoints.current).toBe(12);
        expect(sparky?.level).toBe(1);
        expect(sparky?.modSlots).toBe(1);
        expect(sparky?.personalityQuirk).toBe("Emits low mechanical purring when praised");
    });

    it("should have correct customization for both drones", () => {
        const sparky = PREGEN_DRONES[0];
        const tinker = PREGEN_DRONES[1];

        expect(sparky?.customization?.shellFinish).toBe("Black enamel");
        expect(sparky?.customization?.coreColor).toBe("Blue");

        expect(tinker?.customization?.shellFinish).toBe("Verdigris brass");
        expect(tinker?.customization?.coreColor).toBe("Green");
    });
});
