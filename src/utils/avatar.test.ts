import { describe, expect, it } from "vitest";
import {
    _debugAvatarIndex,
    getAvatarForClass,
    getAvatarForSpecies,
    getAvatarForSpeciesClass,
    getPortraitForMonster,
} from "./avatar";

describe("avatar utility", () => {
    it("returns deterministic portrait path for class", () => {
        const first = getAvatarForClass("Arcanist");
        const second = getAvatarForClass("Arcanist");
        expect(first).toEqual(second);
        expect(first.startsWith("/portraits/")).toBe(true);
        expect(first.includes("-Arcanist.portrait.png")).toBe(true);
    });

    it("returns deterministic portrait path for species", () => {
        const first = getAvatarForSpecies("Aqualoth");
        const second = getAvatarForSpecies("Aqualoth");
        expect(first).toEqual(second);
        expect(first.startsWith("/portraits/Aqualoth-")).toBe(true);
        expect(first.endsWith(".portrait.png")).toBe(true);
    });

    it("combines species and class directly", () => {
        const combo = getAvatarForSpeciesClass("Avenar", "Vanguard");
        expect(combo).toEqual("/portraits/Avenar-Vanguard.portrait.png");
    });

    it("falls back to generic avatar when monster portrait missing", () => {
        const portrait = getPortraitForMonster("Nonexistent Creature");
        expect(portrait.startsWith("/avatars/")).toBe(true);
    });

    it("returns portrait path for known monster slug", () => {
        const portrait = getPortraitForMonster("Aether Wisp");
        expect(portrait).toEqual("/monsters/portraits/aether-wisp.portrait.png");
    });

    it("debug avatar index stable", () => {
        expect(_debugAvatarIndex("class:Arcanist")).toEqual(_debugAvatarIndex("class:Arcanist"));
    });
});
