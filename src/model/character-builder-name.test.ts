import { describe, expect, it } from "bun:test";
import { CharacterBuilder } from "./character-builder";

describe("CharacterBuilder - Name Generation", () => {
    it("should generate a random name", () => {
        const builder = new CharacterBuilder();
        builder.generateName();

        const name = builder.getName();
        expect(name).toBeDefined();
        expect(name).toContain(" "); // Should have first and last name
    });

    it("should generate different names on multiple calls", () => {
        const names = new Set<string>();

        for (let i = 0; i < 10; i++) {
            const builder = new CharacterBuilder();
            builder.generateName();
            const name = builder.getName();
            if (name) {
                names.add(name);
            }
        }

        // Should have generated at least some different names
        expect(names.size).toBeGreaterThan(1);
    });

    it("should allow getName to return undefined before name is set", () => {
        const builder = new CharacterBuilder();
        const name = builder.getName();
        expect(name).toBeUndefined();
    });

    it("should return the set name via getName", () => {
        const builder = new CharacterBuilder();
        builder.setName("Test Character");

        const name = builder.getName();
        expect(name).toBe("Test Character");
    });

    it("should override manual name with generated name", () => {
        const builder = new CharacterBuilder();
        builder.setName("Manual Name");
        builder.generateName();

        const name = builder.getName();
        expect(name).not.toBe("Manual Name");
        expect(name).toContain(" ");
    });
});
