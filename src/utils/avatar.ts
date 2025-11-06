// Utility functions for selecting portrait images for species, classes, and monsters.
// Updated: class & species reference views now use species/class specific portrait assets
// located in /public/portraits (e.g. Aqualoth-Arcanist.portrait.png).
// We retain a small generic avatar fallback set for cases where a generated combo doesn't exist.

import { CLASSES } from "@/data/classes";
import { SPECIES } from "@/data/species";

// Generic fallback avatars (legacy) used only if a constructed portrait path is missing.
const AVATAR_FILES = [
    "ixoth.png",
    "karn-voss.png",
    "lyrra-quenchcoil.png",
    "rhul-greypike.png",
    "rick-vaul.png",
    "selenn-vire.png",
    "velka.png",
];

// Monster portrait files discovered in /public/monsters/portraits
// Filenames follow <slug>.portrait.png
const MONSTER_PORTRAIT_SLUGS = new Set([
    "aether-wisp",
    "aetherforge-myrmidon",
    "cogling-swarm",
    "gear-rat",
    "gear-sentinel",
    "iron-husk",
    "magnetron-drone",
    "rivet-hound",
    "rust-crawler",
    "steam-stitcher",
    "void-leech",
]);

function hashString(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        hash = (hash << 5) - hash + input.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

function pickFallbackAvatar(key: string): string {
    if (AVATAR_FILES.length === 0) return "";
    const index = hashString(key) % AVATAR_FILES.length;
    return `/avatars/${AVATAR_FILES[index]}`;
}

// Pre-computed species & class type arrays for deterministic selection.
const SPECIES_TYPES = SPECIES.map((s) => s.type);
const CLASS_TYPES = CLASSES.map((c) => c.type);

function buildPortraitPath(speciesType: string, classType: string): string {
    // Assets use exact casing: Species-Class.portrait.png
    return `/portraits/${speciesType}-${classType}.png`;
}

// NOTE: We cannot statically verify file existence here without bundling steps; we optimistically
// return the constructed path. If an image is missing the client will 404 and can fall back via onError.
// To offer a consistent image we still provide a deterministic generic fallback if desired.

export function getAvatarForSpecies(speciesType: string): string {
    // Deterministically pick a class variant for a species detail view.
    const speciesBestClassMap: Record<string, string> = {
        Aqualoth: "Mindweaver",
        Vulmir: "Tweaker",
        Rendai: "Artifex",
        Karnathi: "Vanguard",
        Tharn: "Templar",
        Skellin: "Shadehand",
        Avenar: "Arcanist",
    };

    return buildPortraitPath(speciesType, speciesBestClassMap[speciesType]!);
}

export function getAvatarForClass(classType: string): string {
    // Deterministically pick a species variant for a class detail view.
    if (!classType) return "";
    if (SPECIES_TYPES.length === 0) return pickFallbackAvatar(`class:${classType}`);
    const speciesIndex = hashString(`class:${classType}`) % SPECIES_TYPES.length;
    const speciesType = SPECIES_TYPES[speciesIndex]!; // guarded above
    return buildPortraitPath(speciesType, classType);
}

export function getAvatarForSpeciesClass(speciesType: string, classType: string): string {
    if (!speciesType || !classType) return "";
    return buildPortraitPath(speciesType, classType);
}

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function getPortraitForMonster(monsterName: string): string {
    const slug = slugify(monsterName);
    if (MONSTER_PORTRAIT_SLUGS.has(slug)) {
        return `/monsters/portraits/${slug}.portrait.png`;
    }
    // Fallback to generic avatar selection so all monsters get an image
    return pickFallbackAvatar(`monster:${monsterName}`);
}

export function getAvatarForReference(opts: {
    species?: string;
    classType?: string;
    monsterName?: string;
}): string | null {
    if (opts.monsterName) return getPortraitForMonster(opts.monsterName);
    if (opts.species && opts.classType) {
        return getAvatarForSpeciesClass(opts.species, opts.classType);
    }
    if (opts.species) {
        return getAvatarForSpecies(opts.species);
    }
    if (opts.classType) {
        return getAvatarForClass(opts.classType);
    }
    return null;
}

// Simple pre-flight validation helper (can be used in tests)
export function _debugAvatarIndex(key: string): number {
    return hashString(key) % AVATAR_FILES.length;
}

// Export fallback avatar util in case components want explicit generic imagery.
export const _pickFallbackAvatar = pickFallbackAvatar;
