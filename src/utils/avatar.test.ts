import { describe, it, expect } from 'vitest';
import { getAvatarForClass, getAvatarForSpecies, getAvatarForSpeciesClass, getPortraitForMonster, _debugAvatarIndex } from './avatar';

describe('avatar utility', () => {
  it('returns deterministic avatar for class', () => {
    const first = getAvatarForClass('Engineer');
    const second = getAvatarForClass('Engineer');
    expect(first).toEqual(second);
  });

  it('returns different avatar indices for different classes (likely)', () => {
    const idxA = _debugAvatarIndex('class:Engineer');
    const idxB = _debugAvatarIndex('class:Scrapper');
    // Not strictly guaranteed, but extremely likely with distinct strings
    expect(idxA).not.toEqual(idxB);
  });

  it('combines species and class for combo selection', () => {
    const combo1 = getAvatarForSpeciesClass('Cogborn', 'Engineer');
    const combo2 = getAvatarForSpeciesClass('Cogborn', 'Engineer');
    const combo3 = getAvatarForSpeciesClass('Cogborn', 'Scrapper');
    expect(combo1).toEqual(combo2);
    expect(combo1).not.toEqual(combo3);
  });

  it('falls back to avatar when monster portrait missing', () => {
    const portrait = getPortraitForMonster('Nonexistent Creature');
    expect(portrait.startsWith('/avatars/')).toBe(true);
  });

  it('returns portrait path for known monster slug', () => {
    const portrait = getPortraitForMonster('Aether Wisp');
    expect(portrait).toEqual('/monsters/portraits/aether-wisp.portrait.png');
  });

  it('species selection deterministic', () => {
    expect(getAvatarForSpecies('Cogborn')).toEqual(getAvatarForSpecies('Cogborn'));
  });
});
