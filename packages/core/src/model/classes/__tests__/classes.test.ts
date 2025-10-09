/**
 * Unit tests for class system
 * Tests class feature progression, level-based acquisition, archetype selection,
 * class-specific mechanics, and multiclassing calculations and interactions
 */

import { describe, it, expect } from 'bun:test';
import {
  calculateProficiencyBonus,
  calculateTotalLevel,
  getAllFeatures,
  getClassFeaturesForLevel,
  getArchetypeFeaturesForLevel,
  calculateCombinedSpellcasting,
  calculateSpellSlots,
  getMulticlassPrerequisites,
  meetsMulticlassPrerequisites,
  calculateResourcePools,
  calculateResourceMaximum,
  createCharacterProgression,
} from '../progression.js';
import {
  CLASS_DATA,
  getClassInfo,
  getAllClasses,
  isValidClass,
  getClassesBySpellcasting,
  getClassesByPsionics,
  getClassesByHitDie,
  getClassesByPrimaryAbility,
} from '../class-data.js';
import type {
  HollowGearClass,
  CharacterClass,
  ClassFeature,
  ClassArchetype,
  SpellcastingProgression,
  ResourcePool,
} from '../index.js';
import type { AbilityScore } from '../../types/common.js';

describe('Class System', () => {
  describe('Class Feature Progression and Level-based Acquisition', () => {
    describe('calculateProficiencyBonus', () => {
      it('should calculate correct proficiency bonus for all levels', () => {
        expect(calculateProficiencyBonus(1)).toBe(2);
        expect(calculateProficiencyBonus(4)).toBe(2);
        expect(calculateProficiencyBonus(5)).toBe(3);
        expect(calculateProficiencyBonus(8)).toBe(3);
        expect(calculateProficiencyBonus(9)).toBe(4);
        expect(calculateProficiencyBonus(12)).toBe(4);
        expect(calculateProficiencyBonus(13)).toBe(5);
        expect(calculateProficiencyBonus(16)).toBe(5);
        expect(calculateProficiencyBonus(17)).toBe(6);
        expect(calculateProficiencyBonus(20)).toBe(6);
      });

      it('should handle edge cases', () => {
        expect(calculateProficiencyBonus(0)).toBe(1); // Minimum
        expect(calculateProficiencyBonus(21)).toBe(7); // Beyond max level (Math.ceil(21/4) + 1 = 6 + 1 = 7)
      });
    });

    describe('calculateTotalLevel', () => {
      it('should calculate total level from single class', () => {
        const classes: CharacterClass[] = [
          {
            className: 'arcanist',
            level: 5,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
          },
        ];

        expect(calculateTotalLevel(classes)).toBe(5);
      });

      it('should calculate total level from multiclass', () => {
        const classes: CharacterClass[] = [
          {
            className: 'arcanist',
            level: 3,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
          },
          {
            className: 'templar',
            level: 2,
            hitDie: 'd10',
            primaryAbility: 'charisma',
            features: [],
          },
        ];

        expect(calculateTotalLevel(classes)).toBe(5);
      });

      it('should handle empty class array', () => {
        expect(calculateTotalLevel([])).toBe(0);
      });
    });

    describe('getClassFeaturesForLevel', () => {
      it('should get correct features for Arcanist at level 1', () => {
        const features = getClassFeaturesForLevel('arcanist', 1);

        expect(features.length).toBeGreaterThan(0);
        expect(features.every(f => f.level <= 1)).toBe(true);

        const spellcasting = features.find(
          f => f.id === 'arcanist_spellcasting'
        );
        const tinkerSavant = features.find(
          f => f.id === 'arcanist_tinker_savant'
        );

        expect(spellcasting).toBeDefined();
        expect(tinkerSavant).toBeDefined();
      });

      it('should get correct features for Templar at level 2', () => {
        const features = getClassFeaturesForLevel('templar', 2);

        expect(features.length).toBeGreaterThan(0);
        expect(features.every(f => f.level <= 2)).toBe(true);

        const resonantSmite = features.find(
          f => f.id === 'templar_resonant_smite'
        );
        const faithEngine = features.find(f => f.id === 'templar_faith_engine');
        const spellcasting = features.find(
          f => f.id === 'templar_spellcasting'
        );

        expect(resonantSmite).toBeDefined();
        expect(faithEngine).toBeDefined();
        expect(spellcasting).toBeDefined();
      });

      it('should get correct features for Tweaker at level 1', () => {
        const features = getClassFeaturesForLevel('tweaker', 1);

        const adrenalSurge = features.find(
          f => f.id === 'tweaker_adrenal_surge'
        );
        const metabolism = features.find(
          f => f.id === 'tweaker_enhanced_metabolism'
        );

        expect(adrenalSurge).toBeDefined();
        expect(metabolism).toBeDefined();
        expect(adrenalSurge?.uses?.maximum).toBe(1);
        expect(adrenalSurge?.uses?.restoreOn).toBe('short');
      });

      it('should get correct features for Shadehand with sneak attack scaling', () => {
        const level1Features = getClassFeaturesForLevel('shadehand', 1);
        const level3Features = getClassFeaturesForLevel('shadehand', 3);

        const sneakAttack1 = level1Features.find(
          f => f.id === 'shadehand_sneak_attack'
        );
        const sneakAttack3 = level3Features.find(
          f => f.id === 'shadehand_sneak_attack'
        );

        expect(sneakAttack1).toBeDefined();
        expect(sneakAttack3).toBeDefined();

        // Sneak attack should scale with level
        expect(sneakAttack1?.mechanics?.effects[0].value).toBe('1d6');
        expect(sneakAttack3?.mechanics?.effects[0].value).toBe('2d6');
      });

      it('should not include features above character level', () => {
        const features = getClassFeaturesForLevel('arcanist', 1);

        // Should not include level 2 features
        const spellRecharge = features.find(
          f => f.id === 'arcanist_spell_recharge'
        );
        expect(spellRecharge).toBeUndefined();
      });
    });

    describe('getAllFeatures', () => {
      it('should get all features from single class', () => {
        const classes: CharacterClass[] = [
          {
            className: 'vanguard',
            level: 1,
            hitDie: 'd10',
            primaryAbility: 'strength',
            features: [],
          },
        ];

        const features = getAllFeatures(classes);

        expect(features.length).toBeGreaterThan(0);
        expect(features.every(f => f.level <= 1)).toBe(true);

        const defensiveStance = features.find(
          f => f.id === 'vanguard_defensive_stance'
        );
        const steamCharge = features.find(
          f => f.id === 'vanguard_steam_charge'
        );

        expect(defensiveStance).toBeDefined();
        expect(steamCharge).toBeDefined();
      });

      it('should get all features from multiclass character', () => {
        const classes: CharacterClass[] = [
          {
            className: 'artifex',
            level: 2,
            hitDie: 'd8',
            primaryAbility: 'intelligence',
            features: [],
          },
          {
            className: 'mindweaver',
            level: 1,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
          },
        ];

        const features = getAllFeatures(classes);

        // Should have features from both classes
        const artifexFeatures = features.filter(f =>
          f.id.startsWith('artifex_')
        );
        const mindweaverFeatures = features.filter(f =>
          f.id.startsWith('mindweaver_')
        );

        expect(artifexFeatures.length).toBeGreaterThan(0);
        expect(mindweaverFeatures.length).toBeGreaterThan(0);
      });

      it('should include archetype features when present', () => {
        const archetype: ClassArchetype = {
          id: 'aethermancer',
          name: 'Aethermancer',
          parentClass: 'arcanist',
          selectionLevel: 2,
          description: 'Psionically fuses mind and magic.',
          features: [
            {
              id: 'aethermancer_psionic_conversion',
              name: 'Psionic Conversion',
              level: 2,
              description: 'Convert spell slots into AFP.',
              mechanics: {
                type: 'resource',
                effects: [
                  {
                    type: 'special',
                    target: 'self',
                    value: 'Convert spell slots to AFP',
                  },
                ],
              },
            },
          ],
        };

        const classes: CharacterClass[] = [
          {
            className: 'arcanist',
            level: 3,
            archetype,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
          },
        ];

        const features = getAllFeatures(classes);

        const archetypeFeature = features.find(
          f => f.id === 'aethermancer_psionic_conversion'
        );
        expect(archetypeFeature).toBeDefined();
      });
    });
  });

  describe('Archetype Selection and Class-specific Mechanics', () => {
    describe('getArchetypeFeaturesForLevel', () => {
      it('should get archetype features at appropriate level', () => {
        const archetype: ClassArchetype = CLASS_DATA.templar.archetypes[0]; // Relic Knight

        const level3Features = getArchetypeFeaturesForLevel(archetype, 3);
        const level7Features = getArchetypeFeaturesForLevel(archetype, 7);

        expect(level3Features.length).toBe(2); // Aura of Focus and Channel Healing
        expect(level7Features.length).toBe(3); // Previous + Faith Barrier

        const auraOfFocus = level3Features.find(
          f => f.id === 'relic_knight_aura_of_focus'
        );
        const faithBarrier = level7Features.find(
          f => f.id === 'relic_knight_faith_barrier'
        );

        expect(auraOfFocus).toBeDefined();
        expect(faithBarrier).toBeDefined();
        expect(faithBarrier?.uses?.maximum).toBe(1);
        expect(faithBarrier?.uses?.restoreOn).toBe('long');
      });

      it('should not include features above character level', () => {
        const archetype: ClassArchetype = CLASS_DATA.tweaker.archetypes[1]; // Neurospike

        const level3Features = getArchetypeFeaturesForLevel(archetype, 3);

        // Should not include Hyperfocus (level 7)
        const hyperfocus = level3Features.find(
          f => f.id === 'neurospike_hyperfocus'
        );
        expect(hyperfocus).toBeUndefined();
      });
    });

    describe('Class-specific Resource Mechanics', () => {
      it('should handle Arcanist spellcasting resources', () => {
        const arcanistInfo = getClassInfo('arcanist');

        expect(arcanistInfo.spellcasting).toBeDefined();
        expect(arcanistInfo.spellcasting?.type).toBe('arcanist');
        expect(arcanistInfo.spellcasting?.ability).toBe('intelligence');
        expect(arcanistInfo.spellcasting?.progression).toBe('full');
        expect(arcanistInfo.spellcasting?.ritualCasting).toBe(true);
      });

      it('should handle Templar spellcasting resources', () => {
        const templarInfo = getClassInfo('templar');

        expect(templarInfo.spellcasting).toBeDefined();
        expect(templarInfo.spellcasting?.type).toBe('templar');
        expect(templarInfo.spellcasting?.ability).toBe('charisma');
        expect(templarInfo.spellcasting?.progression).toBe('half');
        expect(templarInfo.spellcasting?.ritualCasting).toBe(false);

        const resonanceCharges = templarInfo.classResources.find(
          r => r.type === 'resonance_charge'
        );
        expect(resonanceCharges).toBeDefined();
        expect(resonanceCharges?.scaling.type).toBe('ability_modifier');
        expect(resonanceCharges?.scaling.abilityModifier).toBe('charisma');
      });

      it('should handle Mindweaver psionic resources', () => {
        const mindweaverInfo = getClassInfo('mindweaver');

        expect(mindweaverInfo.psionics).toBeDefined();
        expect(mindweaverInfo.psionics?.ability).toBe('intelligence');
        expect(mindweaverInfo.psionics?.disciplines).toContain('flux');
        expect(mindweaverInfo.psionics?.afpProgression).toBeDefined();
        expect(mindweaverInfo.psionics?.afpProgression.length).toBe(20);
      });

      it('should handle non-spellcasting class resources', () => {
        const tweakerInfo = getClassInfo('tweaker');
        const vanguardInfo = getClassInfo('vanguard');
        const artifexInfo = getClassInfo('artifex');

        expect(tweakerInfo.spellcasting).toBeUndefined();
        expect(vanguardInfo.spellcasting).toBeUndefined();
        expect(artifexInfo.spellcasting).toBeUndefined();

        // Should have class-specific resources
        expect(tweakerInfo.classResources.length).toBeGreaterThan(0);
        expect(vanguardInfo.classResources.length).toBeGreaterThan(0);
        expect(artifexInfo.classResources.length).toBeGreaterThan(0);
      });
    });

    describe('Feature Usage and Mechanics', () => {
      it('should handle features with usage limitations', () => {
        const features = getClassFeaturesForLevel('tweaker', 1);
        const adrenalSurge = features.find(
          f => f.id === 'tweaker_adrenal_surge'
        );

        expect(adrenalSurge?.uses).toBeDefined();
        expect(adrenalSurge?.uses?.maximum).toBe(1);
        expect(adrenalSurge?.uses?.restoreOn).toBe('short');
        expect(adrenalSurge?.mechanics?.type).toBe('bonus_action');
      });

      it('should handle passive features', () => {
        const features = getClassFeaturesForLevel('shadehand', 1);
        const silentTools = features.find(
          f => f.id === 'shadehand_silent_tools'
        );

        expect(silentTools?.mechanics?.type).toBe('passive');
        expect(silentTools?.uses).toBeUndefined();
      });

      it('should handle features with resource costs', () => {
        const features = getClassFeaturesForLevel('templar', 1);
        const resonantSmite = features.find(
          f => f.id === 'templar_resonant_smite'
        );

        expect(resonantSmite?.mechanics?.activation?.cost).toBeDefined();
        expect(resonantSmite?.mechanics?.activation?.cost?.type).toBe(
          'resonance_charge'
        );
        expect(resonantSmite?.mechanics?.activation?.cost?.amount).toBe(1);
      });
    });
  });

  describe('Multiclassing Calculations and Interactions', () => {
    describe('getMulticlassPrerequisites', () => {
      it('should return correct prerequisites for all classes', () => {
        const arcanistPrereqs = getMulticlassPrerequisites('arcanist');
        expect(arcanistPrereqs.abilities.intelligence).toBe(13);

        const templarPrereqs = getMulticlassPrerequisites('templar');
        expect(templarPrereqs.abilities.charisma).toBe(13);

        const tweakerPrereqs = getMulticlassPrerequisites('tweaker');
        expect(tweakerPrereqs.abilities.constitution).toBe(13);

        const shadehandPrereqs = getMulticlassPrerequisites('shadehand');
        expect(shadehandPrereqs.abilities.dexterity).toBe(13);

        const vanguardPrereqs = getMulticlassPrerequisites('vanguard');
        expect(vanguardPrereqs.abilities.strength).toBe(13);

        const artifexPrereqs = getMulticlassPrerequisites('artifex');
        expect(artifexPrereqs.abilities.intelligence).toBe(13);

        const mindweaverPrereqs = getMulticlassPrerequisites('mindweaver');
        expect(mindweaverPrereqs.abilities.intelligence).toBe(13);
        expect(mindweaverPrereqs.abilities.wisdom).toBe(13);
        expect(mindweaverPrereqs.other).toBeDefined();
      });
    });

    describe('meetsMulticlassPrerequisites', () => {
      const abilityScores = {
        strength: 15,
        dexterity: 14,
        constitution: 13,
        intelligence: 16,
        wisdom: 12,
        charisma: 10,
      };

      it('should correctly validate prerequisites', () => {
        expect(meetsMulticlassPrerequisites('arcanist', abilityScores)).toBe(
          true
        );
        expect(meetsMulticlassPrerequisites('templar', abilityScores)).toBe(
          false
        ); // CHA 10 < 13
        expect(meetsMulticlassPrerequisites('tweaker', abilityScores)).toBe(
          true
        );
        expect(meetsMulticlassPrerequisites('vanguard', abilityScores)).toBe(
          true
        );
        expect(meetsMulticlassPrerequisites('artifex', abilityScores)).toBe(
          true
        );
      });

      it('should handle Mindweaver special case (INT OR WIS)', () => {
        const highIntLowWis = {
          ...abilityScores,
          intelligence: 15,
          wisdom: 10,
        };
        const lowIntHighWis = {
          ...abilityScores,
          intelligence: 10,
          wisdom: 15,
        };
        const bothLow = { ...abilityScores, intelligence: 10, wisdom: 10 };

        expect(meetsMulticlassPrerequisites('mindweaver', highIntLowWis)).toBe(
          true
        );
        expect(meetsMulticlassPrerequisites('mindweaver', lowIntHighWis)).toBe(
          true
        );
        expect(meetsMulticlassPrerequisites('mindweaver', bothLow)).toBe(false);
      });
    });

    describe('calculateCombinedSpellcasting', () => {
      it('should handle single full caster', () => {
        const classes: CharacterClass[] = [
          {
            className: 'arcanist',
            level: 5,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: CLASS_DATA.arcanist.spellcasting,
          },
        ];

        const combined = calculateCombinedSpellcasting(classes);

        expect(combined).toBeDefined();
        expect(combined?.casterLevel).toBe(5);
        expect(combined?.spellcastingAbilities.arcanist).toBe('intelligence');
      });

      it('should handle single half caster', () => {
        const classes: CharacterClass[] = [
          {
            className: 'templar',
            level: 6,
            hitDie: 'd10',
            primaryAbility: 'charisma',
            features: [],
            spellcasting: CLASS_DATA.templar.spellcasting,
          },
        ];

        const combined = calculateCombinedSpellcasting(classes);

        expect(combined).toBeDefined();
        expect(combined?.casterLevel).toBe(3); // Half of 6
        expect(combined?.spellcastingAbilities.templar).toBe('charisma');
      });

      it('should handle multiclass spellcasters', () => {
        const classes: CharacterClass[] = [
          {
            className: 'arcanist',
            level: 3,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: CLASS_DATA.arcanist.spellcasting,
          },
          {
            className: 'templar',
            level: 4,
            hitDie: 'd10',
            primaryAbility: 'charisma',
            features: [],
            spellcasting: CLASS_DATA.templar.spellcasting,
          },
        ];

        const combined = calculateCombinedSpellcasting(classes);

        expect(combined).toBeDefined();
        expect(combined?.casterLevel).toBe(5); // 3 (full) + 2 (half of 4)
        expect(combined?.spellcastingAbilities.arcanist).toBe('intelligence');
        expect(combined?.spellcastingAbilities.templar).toBe('charisma');
      });

      it('should return undefined for non-spellcasters', () => {
        const classes: CharacterClass[] = [
          {
            className: 'tweaker',
            level: 5,
            hitDie: 'd12',
            primaryAbility: 'constitution',
            features: [],
          },
        ];

        const combined = calculateCombinedSpellcasting(classes);
        expect(combined).toBeUndefined();
      });
    });

    describe('calculateSpellSlots', () => {
      it('should calculate correct spell slots for various caster levels', () => {
        const level1Slots = calculateSpellSlots(1);
        expect(level1Slots).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 0]);

        const level5Slots = calculateSpellSlots(5);
        expect(level5Slots).toEqual([4, 3, 2, 0, 0, 0, 0, 0, 0]);

        const level20Slots = calculateSpellSlots(20);
        expect(level20Slots).toEqual([4, 3, 3, 3, 3, 2, 2, 1, 1]);
      });

      it('should handle edge cases', () => {
        expect(calculateSpellSlots(0)).toEqual([]);
        expect(calculateSpellSlots(21)).toEqual([4, 3, 3, 3, 3, 2, 2, 1, 1]); // Caps at 20
      });
    });
  });

  describe('Resource Pool Calculations', () => {
    describe('calculateResourceMaximum', () => {
      it('should calculate linear scaling resources', () => {
        const resourceInfo = {
          type: 'custom' as const,
          name: 'Test Resource',
          description: 'Test',
          baseAmount: 2,
          scaling: {
            type: 'linear' as const,
            value: 1,
          },
          recovery: 'short' as const,
        };

        expect(calculateResourceMaximum(resourceInfo, 1)).toBe(2);
        expect(calculateResourceMaximum(resourceInfo, 5)).toBe(6); // 2 + (5-1)*1
        expect(calculateResourceMaximum(resourceInfo, 10)).toBe(11); // 2 + (10-1)*1
      });

      it('should calculate table-based scaling resources', () => {
        const resourceInfo = {
          type: 'spell_slot' as const,
          name: 'Spell Slots',
          description: 'Test',
          baseAmount: 2,
          scaling: {
            type: 'table' as const,
            value: [2, 3, 4, 4, 4, 4, 4, 4, 4, 4],
          },
          recovery: 'long' as const,
        };

        expect(calculateResourceMaximum(resourceInfo, 1)).toBe(2);
        expect(calculateResourceMaximum(resourceInfo, 2)).toBe(3);
        expect(calculateResourceMaximum(resourceInfo, 5)).toBe(4);
        expect(calculateResourceMaximum(resourceInfo, 15)).toBe(4); // Beyond table length
      });

      it('should calculate proficiency bonus scaling resources', () => {
        const resourceInfo = {
          type: 'custom' as const,
          name: 'Steam Charges',
          description: 'Test',
          baseAmount: 1,
          scaling: {
            type: 'proficiency_bonus' as const,
            value: 1,
          },
          recovery: 'short' as const,
        };

        expect(calculateResourceMaximum(resourceInfo, 1)).toBe(3); // 1 + 2 (prof bonus)
        expect(calculateResourceMaximum(resourceInfo, 5)).toBe(4); // 1 + 3 (prof bonus)
        expect(calculateResourceMaximum(resourceInfo, 9)).toBe(5); // 1 + 4 (prof bonus)
      });

      it('should handle ability modifier scaling (placeholder)', () => {
        const resourceInfo = {
          type: 'resonance_charge' as const,
          name: 'Resonance Charges',
          description: 'Test',
          baseAmount: 1,
          scaling: {
            type: 'ability_modifier' as const,
            value: 1,
            abilityModifier: 'charisma' as AbilityScore,
          },
          recovery: 'long' as const,
        };

        // Uses placeholder value of 3 for ability modifier
        expect(calculateResourceMaximum(resourceInfo, 1)).toBe(4); // 1 + 3
      });
    });

    describe('calculateResourcePools', () => {
      it('should calculate resource pools for single class', () => {
        const classes: CharacterClass[] = [
          {
            className: 'templar',
            level: 3,
            hitDie: 'd10',
            primaryAbility: 'charisma',
            features: [],
          },
        ];

        const pools = calculateResourcePools(classes);

        expect(pools.length).toBeGreaterThan(0);

        const resonancePool = pools.find(p => p.type === 'resonance_charge');
        expect(resonancePool).toBeDefined();
        expect(resonancePool?.recovery).toBe('long');
      });

      it('should calculate resource pools for multiclass', () => {
        const classes: CharacterClass[] = [
          {
            className: 'tweaker',
            level: 2,
            hitDie: 'd12',
            primaryAbility: 'constitution',
            features: [],
          },
          {
            className: 'vanguard',
            level: 1,
            hitDie: 'd10',
            primaryAbility: 'strength',
            features: [],
          },
        ];

        const pools = calculateResourcePools(classes);

        // Should have pools from both classes
        expect(pools.length).toBeGreaterThanOrEqual(2);

        const adrenalPool = pools.find(
          p => p.type === 'custom' && p.recovery === 'short'
        );
        const steamPool = pools.find(
          p => p.type === 'custom' && p.recovery === 'short'
        );

        expect(adrenalPool).toBeDefined();
        expect(steamPool).toBeDefined();
      });
    });
  });

  describe('Character Progression Integration', () => {
    describe('createCharacterProgression', () => {
      it('should create complete progression for single class character', () => {
        const classes: CharacterClass[] = [
          {
            className: 'arcanist',
            level: 5,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: CLASS_DATA.arcanist.spellcasting,
          },
        ];

        const progression = createCharacterProgression(classes);

        expect(progression.totalLevel).toBe(5);
        expect(progression.proficiencyBonus).toBe(3);
        expect(progression.allFeatures.length).toBeGreaterThan(0);
        expect(progression.combinedSpellcasting).toBeDefined();
        expect(progression.resourcePools.length).toBeGreaterThan(0);
      });

      it('should create complete progression for multiclass character', () => {
        const classes: CharacterClass[] = [
          {
            className: 'shadehand',
            level: 3,
            hitDie: 'd8',
            primaryAbility: 'dexterity',
            features: [],
          },
          {
            className: 'artifex',
            level: 2,
            hitDie: 'd8',
            primaryAbility: 'intelligence',
            features: [],
          },
        ];

        const progression = createCharacterProgression(classes);

        expect(progression.totalLevel).toBe(5);
        expect(progression.proficiencyBonus).toBe(3);
        expect(progression.classes).toHaveLength(2);
        expect(progression.combinedSpellcasting).toBeUndefined(); // No spellcasters

        // Should have features from both classes
        const shadehandFeatures = progression.allFeatures.filter(f =>
          f.id.startsWith('shadehand_')
        );
        const artifexFeatures = progression.allFeatures.filter(f =>
          f.id.startsWith('artifex_')
        );

        expect(shadehandFeatures.length).toBeGreaterThan(0);
        expect(artifexFeatures.length).toBeGreaterThan(0);
      });

      it('should handle character with archetypes', () => {
        const archetype: ClassArchetype = CLASS_DATA.arcanist.archetypes[0]; // Aethermancer

        const classes: CharacterClass[] = [
          {
            className: 'arcanist',
            level: 6,
            archetype,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: CLASS_DATA.arcanist.spellcasting,
          },
        ];

        const progression = createCharacterProgression(classes);

        // Should include archetype features
        const archetypeFeatures = progression.allFeatures.filter(f =>
          f.id.startsWith('aethermancer_')
        );

        expect(archetypeFeatures.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Class Data Validation and Completeness', () => {
    describe('CLASS_DATA registry', () => {
      it('should contain all seven Hollow Gear classes', () => {
        const classes = Object.keys(CLASS_DATA);
        expect(classes).toHaveLength(7);

        const expectedClasses: HollowGearClass[] = [
          'arcanist',
          'templar',
          'tweaker',
          'shadehand',
          'vanguard',
          'artifex',
          'mindweaver',
        ];

        expectedClasses.forEach(className => {
          expect(CLASS_DATA).toHaveProperty(className);
        });
      });

      it('should have consistent class structure', () => {
        Object.values(CLASS_DATA).forEach(classInfo => {
          expect(classInfo.className).toBeDefined();
          expect(classInfo.displayName).toBeDefined();
          expect(classInfo.description).toBeDefined();
          expect(classInfo.role).toBeDefined();
          expect(classInfo.hitDie).toBeDefined();
          expect(classInfo.primaryAbility).toBeDefined();
          expect(classInfo.savingThrowProficiencies).toHaveLength(2);
          expect(classInfo.archetypes.length).toBeGreaterThanOrEqual(2);
          expect(classInfo.classResources).toBeDefined();
        });
      });

      it('should have valid hit dice for all classes', () => {
        const validHitDice = ['d6', 'd8', 'd10', 'd12'];

        Object.values(CLASS_DATA).forEach(classInfo => {
          expect(validHitDice).toContain(classInfo.hitDie);
        });
      });

      it('should have valid primary abilities', () => {
        const validAbilities: AbilityScore[] = [
          'strength',
          'dexterity',
          'constitution',
          'intelligence',
          'wisdom',
          'charisma',
        ];

        Object.values(CLASS_DATA).forEach(classInfo => {
          expect(validAbilities).toContain(classInfo.primaryAbility);
        });
      });

      it('should have spellcasting data for spellcasting classes', () => {
        const spellcastingClasses: HollowGearClass[] = ['arcanist', 'templar'];

        spellcastingClasses.forEach(className => {
          const classInfo = CLASS_DATA[className];
          expect(classInfo.spellcasting).toBeDefined();
          expect(classInfo.spellcasting?.type).toBeDefined();
          expect(classInfo.spellcasting?.ability).toBeDefined();
          expect(classInfo.spellcasting?.progression).toBeDefined();
        });
      });

      it('should have psionic data for psionic classes', () => {
        const psionicClasses: HollowGearClass[] = ['mindweaver'];

        psionicClasses.forEach(className => {
          const classInfo = CLASS_DATA[className];
          expect(classInfo.psionics).toBeDefined();
          expect(classInfo.psionics?.ability).toBeDefined();
          expect(classInfo.psionics?.afpProgression).toBeDefined();
          expect(classInfo.psionics?.disciplines).toBeDefined();
        });
      });
    });

    describe('Class data utility functions', () => {
      it('should get class info correctly', () => {
        const arcanistInfo = getClassInfo('arcanist');
        expect(arcanistInfo.className).toBe('arcanist');
        expect(arcanistInfo.displayName).toBe('Arcanist');
      });

      it('should get all classes', () => {
        const allClasses = getAllClasses();
        expect(allClasses).toHaveLength(7);
        expect(allClasses).toContain('arcanist');
        expect(allClasses).toContain('mindweaver');
      });

      it('should validate class names', () => {
        expect(isValidClass('arcanist')).toBe(true);
        expect(isValidClass('templar')).toBe(true);
        expect(isValidClass('invalid')).toBe(false);
        expect(isValidClass('')).toBe(false);
      });

      it('should find classes by spellcasting type', () => {
        const arcanistClasses = getClassesBySpellcasting('arcanist');
        expect(arcanistClasses).toContain('arcanist');
        expect(arcanistClasses).toHaveLength(1);

        const templarClasses = getClassesBySpellcasting('templar');
        expect(templarClasses).toContain('templar');
        expect(templarClasses).toHaveLength(1);
      });

      it('should find classes by psionic ability', () => {
        const psionicClasses = getClassesByPsionics();
        expect(psionicClasses).toContain('mindweaver');
        expect(psionicClasses.length).toBeGreaterThanOrEqual(1);
      });

      it('should find classes by hit die', () => {
        const d6Classes = getClassesByHitDie('d6');
        expect(d6Classes).toContain('arcanist');
        // Mindweaver actually has d8, not d6

        const d8Classes = getClassesByHitDie('d8');
        expect(d8Classes).toContain('mindweaver');
        expect(d8Classes).toContain('shadehand');
        expect(d8Classes).toContain('artifex');

        const d12Classes = getClassesByHitDie('d12');
        expect(d12Classes).toContain('tweaker');
      });

      it('should find classes by primary ability', () => {
        const intClasses = getClassesByPrimaryAbility('intelligence');
        expect(intClasses).toContain('arcanist');
        expect(intClasses).toContain('artifex');
        expect(intClasses).toContain('mindweaver');

        const strClasses = getClassesByPrimaryAbility('strength');
        expect(strClasses).toContain('vanguard');
      });
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle empty class arrays gracefully', () => {
      expect(calculateTotalLevel([])).toBe(0);
      expect(getAllFeatures([])).toEqual([]);
      expect(calculateCombinedSpellcasting([])).toBeUndefined();
      expect(calculateResourcePools([])).toEqual([]);
    });

    it('should handle classes without archetypes', () => {
      const classes: CharacterClass[] = [
        {
          className: 'tweaker',
          level: 1,
          hitDie: 'd12',
          primaryAbility: 'constitution',
          features: [],
          // No archetype
        },
      ];

      const features = getAllFeatures(classes);
      expect(features.length).toBeGreaterThan(0);
    });

    it('should handle invalid levels gracefully', () => {
      expect(calculateProficiencyBonus(-1)).toBe(1);
      expect(calculateProficiencyBonus(0)).toBe(1);
      // calculateSpellSlots clamps negative values to 1, so it returns level 1 slots
      expect(calculateSpellSlots(-1)).toEqual([2, 0, 0, 0, 0, 0, 0, 0, 0]);
      expect(getClassFeaturesForLevel('arcanist', 0)).toEqual([]);
    });

    it('should handle multiclass with same class multiple times', () => {
      // This shouldn't happen in normal gameplay, but test robustness
      const classes: CharacterClass[] = [
        {
          className: 'arcanist',
          level: 2,
          hitDie: 'd6',
          primaryAbility: 'intelligence',
          features: [],
        },
        {
          className: 'arcanist',
          level: 3,
          hitDie: 'd6',
          primaryAbility: 'intelligence',
          features: [],
        },
      ];

      const totalLevel = calculateTotalLevel(classes);
      expect(totalLevel).toBe(5);

      const features = getAllFeatures(classes);
      expect(features.length).toBeGreaterThan(0);
    });
  });
});
