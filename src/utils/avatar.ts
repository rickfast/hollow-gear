// Utility functions for selecting avatar and portrait images for species, classes, and monsters
// Deterministic pseudo-random selection using a hash of identifying strings so the same
// entity always gets the same avatar during a session.

// Public assets are served from the /public folder; Vite allows referencing them with root-relative paths.

const AVATAR_FILES = [
  'ixoth.png',
  'karn-voss.png',
  'lyrra-quenchcoil.png',
  'rhul-greypike.png',
  'rick-vaul.png',
  'selenn-vire.png',
  'velka.png'
];

// Monster portrait files discovered in /public/monsters/portraits
// Filenames follow <slug>.portrait.png
const MONSTER_PORTRAIT_SLUGS = new Set([
  'aether-wisp',
  'aetherforge-myrmidon',
  'cogling-swarm',
  'gear-rat',
  'gear-sentinel',
  'iron-husk',
  'magnetron-drone',
  'rivet-hound',
  'rust-crawler',
  'steam-stitcher',
  'void-leech'
]);

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function pickAvatar(key: string): string {
  if (AVATAR_FILES.length === 0) return '';
  const index = hashString(key) % AVATAR_FILES.length;
  return `/avatars/${AVATAR_FILES[index]}`;
}

export function getAvatarForSpecies(speciesType: string): string {
  return pickAvatar(`species:${speciesType}`);
}

export function getAvatarForClass(classType: string): string {
  return pickAvatar(`class:${classType}`);
}

export function getAvatarForSpeciesClass(speciesType: string, classType: string): string {
  return pickAvatar(`combo:${speciesType}|${classType}`);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getPortraitForMonster(monsterName: string): string {
  const slug = slugify(monsterName);
  if (MONSTER_PORTRAIT_SLUGS.has(slug)) {
    return `/monsters/portraits/${slug}.portrait.png`;
  }
  // Fallback to avatar selection so all monsters get an image
  return pickAvatar(`monster:${monsterName}`);
}

export function getAvatarForReference(opts: { species?: string; classType?: string; monsterName?: string }): string | null {
  if (opts.monsterName) return getPortraitForMonster(opts.monsterName);
  if (opts.species && opts.classType) return getAvatarForSpeciesClass(opts.species, opts.classType);
  if (opts.species) return getAvatarForSpecies(opts.species);
  if (opts.classType) return getAvatarForClass(opts.classType);
  return null;
}

// Simple pre-flight validation helper (can be used in tests)
export function _debugAvatarIndex(key: string): number {
  return hashString(key) % AVATAR_FILES.length;
}
