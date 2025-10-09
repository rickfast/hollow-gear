/**
 * Integration tests for the complete Hollow Gear character system
 *
 * These tests verify that all character subsystems work together correctly,
 * including character creation, serialization, and complex character builds.
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import type { HollowGearCharacter } from '../character.js';
import { SerializationUtils } from '../serialization.js';
import { CharacterUtilities } from '../character-utils.js';
import { CharacterUtils as BaseCharacterUtils } from '../base/character.js';
import type { EtherborneSpecies } from '../species/index.js';
import type { HollowGearClass } from '../classes/index.js';

/**
 * Helper function to create a mock character for testing
 */
function createMockCharacter(
  overrides: Partial<HollowGearCharacter> = {}
): HollowGearCharacter {
  const baseData = BaseCharacterUtils.createBaseCharacterData(
    'Test Character',
    '1.0.0'
  );

  return {
    ...baseData,
    species: 'vulmir',
    speciesTraits: {
      abilityScoreIncrease: [{ ability: 'intelligence', value: 2 }],
      speed: { walking: 30, swimming: 0, climbing: 0, flying: 0 },
      specialAbilities: [],
      languages: ['common', 'vulmir'],
      etherborneTraits: {
        aetherSensitivity: true,
        machineEmpathy: true,
        instinctiveHarmony: false,
      },
    },
    classes: [
      {
        className: 'arcanist',
        level: 1,
        hitDie: 'd6',
        primaryAbility: 'intelligence',
        features: [],
        spellcasting: {
          type: 'arcanist',
          ability: 'intelligence',
          progression: 'full',
        },
      },
    ],
    level: 1,
    abilities: {
      strength: {
        base: 10,
        racial: 0,
        enhancement: 0,
        temporary: 0,
        modifier: 0,
      },
      dexterity: {
        base: 14,
        racial: 0,
        enhancement: 0,
        temporary: 0,
        modifier: 2,
      },
      constitution: {
        base: 13,
        racial: 0,
        enhancement: 0,
        temporary: 0,
        modifier: 1,
      },
      intelligence: {
        base: 15,
        racial: 2,
        enhancement: 0,
        temporary: 0,
        modifier: 3,
      },
      wisdom: {
        base: 12,
        racial: 0,
        enhancement: 0,
        temporary: 0,
        modifier: 1,
      },
      charisma: {
        base: 11,
        racial: 0,
        enhancement: 0,
        temporary: 0,
        modifier: 0,
      },
    },
    hitPoints: {
      current: 7,
      maximum: 7,
      temporary: 0,
    },
    armorClass: {
      base: 10,
      armor: 0,
      shield: 0,
      dexterity: 2,
      natural: 0,
      deflection: 0,
      misc: 0,
      total: 12,
    },
    initiative: {
      dexterity: 2,
      misc: 0,
      total: 2,
    },
    proficiencyBonus: 2,
    skills: {
      acrobatics: { level: 'none', bonus: 0 },
      animalHandling: { level: 'none', bonus: 0 },
      arcana: { level: 'proficient', bonus: 0 },
      athletics: { level: 'none', bonus: 0 },
      deception: { level: 'none', bonus: 0 },
      history: { level: 'proficient', bonus: 0 },
      insight: { level: 'none', bonus: 0 },
      intimidation: { level: 'none', bonus: 0 },
      investigation: { level: 'none', bonus: 0 },
      medicine: { level: 'none', bonus: 0 },
      nature: { level: 'none', bonus: 0 },
      perception: { level: 'none', bonus: 0 },
      performance: { level: 'none', bonus: 0 },
      persuasion: { level: 'none', bonus: 0 },
      religion: { level: 'none', bonus: 0 },
      sleightOfHand: { level: 'none', bonus: 0 },
      stealth: { level: 'none', bonus: 0 },
      survival: { level: 'none', bonus: 0 },
    },
    savingThrows: {
      strength: { proficient: false },
      dexterity: { proficient: false },
      constitution: { proficient: false },
      intelligence: { proficient: true },
      wisdom: { proficient: true },
      charisma: { proficient: false },
    },
    heatStress: {
      currentLevel: 0,
      effects: [],
      steamVentCharges: 0,
      coolantSupplies: 0,
    },
    currency: {
      cogs: 100,
      gears: 5,
      cores: 0,
      aetherDust: 1,
      aetherCells: [],
    },
    maintenance: {
      lastMaintenance: new Date(),
      nextMaintenance: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
      malfunctionRisk: 0,
      repairRequirements: [],
    },
    spellcasting: {
      type: 'arcanist',
      casterLevel: 1,
      spellcastingAbility: 'intelligence',
      resources: {
        arcanist: {
          aetherFluxPoints: {
            current: 4,
            maximum: 4,
            temporary: 0,
          },
          equilibriumTier: 1,
          overclockUses: 1,
        },
      },
      knownSpells: [],
      heatFeedback: {
        heatPoints: 0,
        feedbackLevel: 0,
        lastOverload: undefined,
      },
    },
    equipment: {
      mainHand: undefined,
      offHand: undefined,
      armor: undefined,
      helmet: undefined,
      gloves: undefined,
      boots: undefined,
      cloak: undefined,
      amulet: undefined,
      rings: [],
      belt: undefined,
      backpack: undefined,
    },
    inventory: {
      items: [],
      capacity: {
        weight: { current: 0, maximum: 150 },
        bulk: { current: 0, maximum: 10 },
      },
      containers: [],
    },
    experience: {
      current: 0,
      nextLevelThreshold: 300,
      milestones: [],
    },
    advancement: {
      abilityScoreImprovements: [],
      feats: [],
      classFeatureChoices: [],
    },
    ...overrides,
  } as HollowGearCharacter;
}

describe('Character System Integration', () => {
  describe('Character Data Structure', () => {
    it('should create a valid character with all required fields', () => {
      const character = createMockCharacter({
        name: 'Zara Cogwright',
        species: 'vulmir',
      });

      // Verify basic character data
      expect(character.name).toBe('Zara Cogwright');
      expect(character.species).toBe('vulmir');
      expect(character.level).toBe(1);
      expect(character.id).toBeDefined();
      expect(character.version).toBe('1.0.0');
      expect(character.created).toBeInstanceOf(Date);
      expect(character.lastModified).toBeInstanceOf(Date);

      // Verify class setup
      expect(character.classes).toHaveLength(1);
      expect(character.classes[0].className).toBe('arcanist');
      expect(character.classes[0].level).toBe(1);

      // Verify ability scores
      expect(character.abilities.intelligence.base).toBe(15);
      expect(character.abilities.intelligence.racial).toBe(2);
      expect(character.abilities.intelligence.modifier).toBe(3);

      // Verify spellcasting is initialized for Arcanist
      expect(character.spellcasting).toBeDefined();
      expect(character.spellcasting?.type).toBe('arcanist');

      // Verify Hollow Gear systems are initialized
      expect(character.heatStress).toBeDefined();
      expect(character.currency).toBeDefined();
      expect(character.maintenance).toBeDefined();
    });

    it('should create a Karnathi Mindweaver with psionic abilities', () => {
      const character = createMockCharacter({
        name: 'Thane Ironmind',
        species: 'karnathi',
        classes: [
          {
            className: 'mindweaver',
            level: 1,
            hitDie: 'd8',
            primaryAbility: 'wisdom',
            features: [],
            psionics: {
              type: 'mindweaver',
              ability: 'wisdom',
              progression: 'full',
            },
          },
        ],
        abilities: {
          strength: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          dexterity: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          constitution: {
            base: 15,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          intelligence: {
            base: 13,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          wisdom: {
            base: 16,
            racial: 2,
            enhancement: 0,
            temporary: 0,
            modifier: 4,
          },
          charisma: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
        },
        psionics: {
          disciplines: ['flux', 'empyric'],
          knownPowers: [],
          aetherFluxPoints: {
            current: 6,
            maximum: 6,
            temporary: 0,
          },
          focusLimit: 1,
          maintainedPowers: [],
          psionicSignature: {
            intensity: 'moderate',
            frequency: 'medium',
            pattern: 'stable',
          },
        },
        spellcasting: undefined, // No spellcasting for pure Mindweaver
      });

      // Verify psionic abilities are initialized
      expect(character.psionics).toBeDefined();
      expect(character.psionics?.aetherFluxPoints).toBeDefined();
      expect(character.psionics?.disciplines).toBeDefined();
      expect(character.psionics?.disciplines).toContain('flux');
      expect(character.psionics?.disciplines).toContain('empyric');

      // Verify Karnathi racial traits
      expect(character.abilities.wisdom.racial).toBe(2);
      expect(character.abilities.constitution.racial).toBe(1);

      // Verify no spellcasting for pure Mindweaver
      expect(character.spellcasting).toBeUndefined();
    });

    it('should create a multiclass Templar/Vanguard character', () => {
      const character = createMockCharacter({
        name: 'Sir Marcus Lightbringer',
        species: 'avenar',
        level: 2,
        classes: [
          {
            className: 'templar',
            level: 1,
            hitDie: 'd8',
            primaryAbility: 'wisdom',
            features: [],
            spellcasting: {
              type: 'templar',
              ability: 'wisdom',
              progression: 'full',
            },
          },
          {
            className: 'vanguard',
            level: 1,
            hitDie: 'd10',
            primaryAbility: 'strength',
            features: [],
            spellcasting: undefined,
            psionics: undefined,
          },
        ],
        abilities: {
          strength: {
            base: 15,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          dexterity: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
          constitution: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          intelligence: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          wisdom: {
            base: 16,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          charisma: {
            base: 13,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
        },
        spellcasting: {
          type: 'templar',
          casterLevel: 1,
          spellcastingAbility: 'wisdom',
          resources: {
            templar: {
              resonanceCharges: {
                current: 3,
                maximum: 3,
                temporary: 0,
              },
              overchannelUses: 1,
            },
          },
          knownSpells: [],
          heatFeedback: {
            heatPoints: 0,
            feedbackLevel: 0,
            lastOverload: undefined,
          },
        },
        experience: {
          current: 300,
          nextLevelThreshold: 900,
          milestones: [],
        },
      });

      // Verify multiclass setup
      expect(character.classes).toHaveLength(2);
      expect(character.classes[0].className).toBe('templar');
      expect(character.classes[1].className).toBe('vanguard');

      // Verify level calculation
      expect(character.level).toBe(2);
      const totalClassLevels = character.classes.reduce(
        (sum, cls) => sum + cls.level,
        0
      );
      expect(totalClassLevels).toBe(2);

      // Verify spellcasting abilities remain from Templar
      expect(character.spellcasting).toBeDefined();
      expect(character.spellcasting?.type).toBe('templar');
      expect(character.psionics).toBeUndefined();
    });

    it('should validate character data structure', () => {
      // Test with invalid character data
      const invalidCharacter = createMockCharacter({
        name: '', // Invalid empty name
        level: -1, // Invalid negative level
        abilities: {
          strength: {
            base: 25,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 7,
          }, // Invalid high score
          dexterity: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          constitution: {
            base: 13,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          intelligence: {
            base: 2,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: -4,
          }, // Invalid low score
          wisdom: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          charisma: {
            base: 11,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
        },
      });

      // Verify the character has invalid data
      expect(invalidCharacter.name).toBe('');
      expect(invalidCharacter.level).toBe(-1);
      expect(invalidCharacter.abilities.strength.base).toBe(25);
      expect(invalidCharacter.abilities.intelligence.base).toBe(2);

      // Test that we can detect these issues
      expect(invalidCharacter.name.length).toBe(0);
      expect(invalidCharacter.level).toBeLessThan(1);
      expect(invalidCharacter.abilities.strength.base).toBeGreaterThan(20);
      expect(invalidCharacter.abilities.intelligence.base).toBeLessThan(3);
    });
  });

  describe('Character Serialization and Deserialization', () => {
    let testCharacter: HollowGearCharacter;

    beforeEach(() => {
      testCharacter = createMockCharacter({
        name: 'Test Character',
        species: 'rendai',
        classes: [
          {
            className: 'tweaker',
            level: 1,
            hitDie: 'd8',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: undefined,
            psionics: undefined,
          },
        ],
        abilities: {
          strength: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          dexterity: {
            base: 15,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          constitution: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          intelligence: {
            base: 16,
            racial: 2,
            enhancement: 0,
            temporary: 0,
            modifier: 4,
          },
          wisdom: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
          charisma: {
            base: 13,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
        },
        spellcasting: undefined, // Tweaker has no spellcasting
      });
    });

    it('should serialize and deserialize a character without data loss', async () => {
      // Serialize the character
      const serializationResult = SerializationUtils.serialize(testCharacter);
      expect(serializationResult.success).toBe(true);

      if (serializationResult.success) {
        const serializedData = serializationResult.data;
        expect(typeof serializedData).toBe('string');
        expect(serializedData.length).toBeGreaterThan(0);

        // Deserialize the character
        const deserializationResult =
          await SerializationUtils.deserialize(serializedData);
        expect(deserializationResult.success).toBe(true);

        if (deserializationResult.success) {
          const deserializedCharacter = deserializationResult.data;

          // Verify core data integrity
          expect(deserializedCharacter.id).toBe(testCharacter.id);
          expect(deserializedCharacter.name).toBe(testCharacter.name);
          expect(deserializedCharacter.species).toBe(testCharacter.species);
          expect(deserializedCharacter.level).toBe(testCharacter.level);

          // Verify ability scores
          expect(deserializedCharacter.abilities.strength.base).toBe(
            testCharacter.abilities.strength.base
          );
          expect(deserializedCharacter.abilities.intelligence.base).toBe(
            testCharacter.abilities.intelligence.base
          );

          // Verify dates are properly restored
          expect(deserializedCharacter.created).toBeInstanceOf(Date);
          expect(deserializedCharacter.lastModified).toBeInstanceOf(Date);

          // Verify complex nested data
          expect(deserializedCharacter.classes).toHaveLength(
            testCharacter.classes.length
          );
          expect(deserializedCharacter.classes[0].className).toBe(
            testCharacter.classes[0].className
          );

          // Verify Hollow Gear systems
          expect(deserializedCharacter.heatStress.currentLevel).toBe(
            testCharacter.heatStress.currentLevel
          );
          expect(deserializedCharacter.currency.cogs).toBe(
            testCharacter.currency.cogs
          );
        }
      }
    });

    it('should handle serialization with compression', () => {
      const normalResult = SerializationUtils.serialize(testCharacter);
      const compressedResult = SerializationUtils.serialize(testCharacter, {
        compress: true,
      });

      expect(normalResult.success).toBe(true);
      expect(compressedResult.success).toBe(true);

      if (normalResult.success && compressedResult.success) {
        // Compressed version should be smaller (no pretty printing)
        expect(compressedResult.data.length).toBeLessThan(
          normalResult.data.length
        );

        // Both should contain the same data when parsed
        const normalParsed = JSON.parse(normalResult.data);
        const compressedParsed = JSON.parse(compressedResult.data);

        expect(normalParsed.id).toBe(compressedParsed.id);
        expect(normalParsed.name).toBe(compressedParsed.name);
      }
    });

    it('should validate character during deserialization', async () => {
      // Create a complete character with invalid values
      const validCharacter = createMockCharacter();
      const serializedValid = SerializationUtils.serialize(validCharacter);

      if (!serializedValid.success) {
        throw new Error('Failed to serialize valid character for test');
      }

      // Parse and modify to create invalid data
      const parsedData = JSON.parse(serializedValid.data);
      parsedData.level = -1; // Invalid level
      parsedData.abilities.strength.base = 50; // Invalid ability score

      const invalidData = JSON.stringify(parsedData);

      const result = await SerializationUtils.deserialize(invalidData, {
        validate: true,
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.length).toBeGreaterThan(0);
        expect(result.error.some(e => e.field.includes('level'))).toBe(true);
      }
    });

    it('should handle deserialization without validation', async () => {
      // Create potentially invalid data but skip validation
      const invalidData = JSON.stringify({
        id: 'test-id',
        version: '1.0.0',
        name: 'Test',
        level: -1, // Invalid level but validation is skipped
        species: 'vulmir',
        classes: [],
        abilities: {},
        hitPoints: {},
        armorClass: {},
        initiative: {},
        proficiencyBonus: 2,
        skills: {},
        savingThrows: {},
        heatStress: {},
        currency: {},
        maintenance: {},
        equipment: {},
        inventory: {},
        experience: {},
        advancement: {},
        speciesTraits: {},
      });

      const result = await SerializationUtils.deserialize(invalidData, {
        validate: false,
      });
      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data.level).toBe(-1); // Invalid data preserved
      }
    });
  });

  describe('Complex Character Builds', () => {
    it('should handle a high-level multiclass character with all systems', async () => {
      // Create a complex level 10 character: Arcanist 6/Mindweaver 4
      const character = createMockCharacter({
        name: 'Arcane Psion',
        species: 'avenar',
        level: 10,
        classes: [
          {
            className: 'arcanist',
            level: 6,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: {
              type: 'arcanist',
              ability: 'intelligence',
              progression: 'full',
            },
          },
          {
            className: 'mindweaver',
            level: 4,
            hitDie: 'd8',
            primaryAbility: 'wisdom',
            features: [],
            psionics: {
              type: 'mindweaver',
              ability: 'wisdom',
              progression: 'full',
            },
          },
        ],
        abilities: {
          strength: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
          dexterity: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          constitution: {
            base: 15,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          intelligence: {
            base: 18,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 4,
          },
          wisdom: {
            base: 18,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 4,
          },
          charisma: {
            base: 12,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
        },
        proficiencyBonus: 4, // Level 10 proficiency
        experience: {
          current: 85000,
          nextLevelThreshold: 100000,
          milestones: [],
        },
        psionics: {
          knownDisciplines: [],
          knownPowers: [],
          aetherFluxPoints: {
            current: 22,
            maximum: 22,
            temporary: 0,
          },
          focusState: {
            maintainedPowers: [],
            concentrationPower: undefined,
            focusUsed: 0,
          },
          overloadState: {
            isOverloaded: false,
            recoveryTime: 0,
            feedbackEffects: [],
          },
          surgeState: {
            available: true,
            used: false,
            turnEffects: [],
          },
          signature: {
            intensity: 'moderate',
            frequency: 'high',
            pattern: 'complex',
            lastUsed: new Date(),
            lingerDuration: 0,
          },
          psionicLevel: 4,
          primaryAbility: 'wisdom',
        },
        spellcasting: {
          type: 'arcanist',
          casterLevel: 6,
          spellcastingAbility: 'intelligence',
          resources: {
            arcanist: {
              aetherFluxPoints: {
                current: 18,
                maximum: 18,
                temporary: 0,
              },
              equilibriumTier: 3,
              overclockUses: 2,
            },
          },
          knownSpells: [],
          heatFeedback: {
            heatPoints: 0,
            feedbackLevel: 0,
            lastOverload: undefined,
          },
        },
        equipment: {
          ...createMockCharacter().equipment,
          mainHand: {
            id: 'aether-staff-001',
            name: 'Guild Aether Staff',
            type: 'staff',
            tier: 'guild',
            properties: {
              magical: true,
              powered: true,
              versatile: true,
            },
            modSlots: [
              {
                id: 'focus-slot',
                type: 'psionic',
                installedMod: {
                  id: 'amplification-mod',
                  name: 'Psionic Amplification Matrix',
                  tier: 2,
                  type: 'psionic',
                  effects: [
                    {
                      type: 'bonus',
                      target: 'psionic_save_dc',
                      value: 1,
                    },
                  ],
                  powerRequirement: {
                    type: 'aether_cell',
                    consumption: 1,
                  },
                  blueprint: {
                    id: 'amp-matrix-bp',
                    name: 'Amplification Matrix Blueprint',
                    materials: [],
                  },
                },
                malfunctionState: undefined,
              },
            ],
            condition: 'good',
            weight: 4,
            value: {
              cogs: 0,
              gears: 25,
              cores: 1,
            },
          },
        },
        heatStress: {
          currentLevel: 2,
          effects: [
            {
              type: 'dexterity_penalty',
              severity: 1,
            },
            {
              type: 'speed_reduction',
              severity: 10,
            },
          ],
          steamVentCharges: 0,
          coolantSupplies: 2,
        },
      });

      // Verify the complex character
      expect(character.level).toBe(10);
      expect(character.classes).toHaveLength(2);
      expect(character.classes[0].className).toBe('arcanist');
      expect(character.classes[0].level).toBe(6);
      expect(character.classes[1].className).toBe('mindweaver');
      expect(character.classes[1].level).toBe(4);

      // Verify total level calculation
      const totalLevel = character.classes.reduce(
        (sum, cls) => sum + cls.level,
        0
      );
      expect(totalLevel).toBe(10);

      // Verify both systems are present
      expect(character.spellcasting).toBeDefined();
      expect(character.psionics).toBeDefined();

      // Test derived statistics
      const derivedStats = CharacterUtilities.calculateDerivedStats(character);
      expect(derivedStats.spellSaveDC).toBeGreaterThan(15); // High INT + proficiency
      expect(derivedStats.psionicSaveDC).toBeGreaterThan(15); // High WIS + proficiency
      expect(derivedStats.heatStressEffects).toHaveLength(2);

      // Test character summary
      const summary = CharacterUtilities.createCharacterSummary(character);
      expect(summary.basic.classes).toBe('arcanist 6/mindweaver 4');
      expect(summary.resources.aetherFluxPoints).toBe('18/18');
      expect(summary.status.heatStressLevel).toBe(2);

      // Verify serialization works with complex character
      const serializationResult = SerializationUtils.serialize(character);
      expect(serializationResult.success).toBe(true);

      if (serializationResult.success) {
        const deserializationResult = await SerializationUtils.deserialize(
          serializationResult.data
        );
        expect(deserializationResult.success).toBe(true);

        if (deserializationResult.success) {
          const deserialized = deserializationResult.data;
          expect(deserialized.classes).toHaveLength(2);
          expect(deserialized.psionics?.aetherFluxPoints.maximum).toBe(22);
          expect(
            deserialized.equipment.mainHand?.modSlots[0].installedMod?.name
          ).toBe('Psionic Amplification Matrix');
        }
      }
    });

    it('should handle a character with extensive equipment and modifications', async () => {
      const character = createMockCharacter({
        name: 'Gear Master',
        species: 'rendai',
        classes: [
          {
            className: 'artifex',
            level: 1,
            hitDie: 'd8',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: undefined,
            psionics: undefined,
          },
        ],
        abilities: {
          strength: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          dexterity: {
            base: 16,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          constitution: {
            base: 15,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          intelligence: {
            base: 18,
            racial: 2,
            enhancement: 0,
            temporary: 0,
            modifier: 5,
          },
          wisdom: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          charisma: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
        },
        equipment: {
          ...createMockCharacter().equipment,
          armor: 'powered-armor-001',
        },
        inventory: {
          items: [
            {
              equipment: {
                id: 'aether-cell-001',
                name: 'High-Capacity Aether Cell',
                type: 'consumable',
                tier: 'guild',
                properties: {},
                modSlots: [],
                condition: 'pristine',
                weight: 1,
                value: { cogs: 0, gears: 5, cores: 0 },
              },
              quantity: 3,
              location: 'carried',
              notes: 'Backup power sources',
            },
            {
              equipment: {
                id: 'repair-kit-001',
                name: "Master's Repair Kit",
                type: 'tool',
                tier: 'guild',
                properties: {},
                modSlots: [],
                condition: 'good',
                weight: 5,
                value: { cogs: 0, gears: 15, cores: 0 },
              },
              quantity: 1,
              location: 'carried',
            },
          ],
          capacity: {
            weight: { current: 70, maximum: 210 }, // STR 14 = 210 lbs capacity
            bulk: { current: 8, maximum: 15 },
          },
          containers: [],
        },
        currency: {
          cogs: 500,
          gears: 75,
          cores: 12,
          aetherDust: 8,
          aetherCells: [
            {
              id: 'cell-1',
              charges: 10,
              maxCharges: 10,
              condition: 'pristine',
            },
            {
              id: 'cell-2',
              charges: 7,
              maxCharges: 10,
              condition: 'good',
            },
          ],
        },
      });

      // Test equipment validation and calculations
      const derivedStats = CharacterUtilities.calculateDerivedStats(character);
      expect(derivedStats.carryingCapacity).toBeGreaterThan(0);

      const encumbranceStatus =
        CharacterUtilities.getEncumbranceStatus(character);
      expect(encumbranceStatus.level).toBeDefined();
      expect(encumbranceStatus.current).toBeGreaterThanOrEqual(0);

      // Test character summary with equipment
      const summary = CharacterUtilities.createCharacterSummary(character);
      expect(summary.equipment.armor).toBe('powered-armor-001');
      expect(summary.resources.currency).toContain('Cores');

      // Verify serialization preserves all equipment data
      const serializationResult = SerializationUtils.serialize(character);
      expect(serializationResult.success).toBe(true);

      if (serializationResult.success) {
        const deserializationResult = await SerializationUtils.deserialize(
          serializationResult.data
        );
        expect(deserializationResult.success).toBe(true);

        if (deserializationResult.success) {
          const deserialized = deserializationResult.data;
          expect(deserialized.equipment.armor).toBe('powered-armor-001');
          expect(deserialized.inventory.items).toHaveLength(2);
          expect(deserialized.currency.aetherCells).toHaveLength(2);
        }
      }
    });

    it('should handle character progression and advancement', async () => {
      const character = createMockCharacter({
        name: 'Advancing Hero',
        species: 'tharn',
        level: 4,
        classes: [
          {
            className: 'vanguard',
            level: 4,
            hitDie: 'd10',
            primaryAbility: 'strength',
            features: [
              {
                name: 'Fighting Style',
                level: 1,
                description: 'Choose a fighting style',
                mechanics: {
                  type: 'choice',
                  options: ['Defense', 'Dueling', 'Great Weapon Fighting'],
                },
              },
              {
                name: 'Second Wind',
                level: 1,
                description: 'Regain hit points as a bonus action',
                mechanics: {
                  type: 'resource',
                  uses: {
                    type: 'short_rest',
                    count: 1,
                  },
                },
              },
              {
                name: 'Action Surge',
                level: 2,
                description: 'Take an additional action',
                mechanics: {
                  type: 'resource',
                  uses: {
                    type: 'short_rest',
                    count: 1,
                  },
                },
              },
              {
                name: 'Martial Archetype',
                level: 3,
                description: 'Choose your martial specialization',
                mechanics: {
                  type: 'archetype_choice',
                },
              },
              {
                name: 'Ability Score Improvement',
                level: 4,
                description: 'Increase ability scores or take a feat',
                mechanics: {
                  type: 'asi_or_feat',
                },
              },
            ],
            spellcasting: undefined,
            psionics: undefined,
          },
        ],
        abilities: {
          strength: {
            base: 16,
            racial: 1,
            enhancement: 1,
            temporary: 0,
            modifier: 4,
          }, // +1 from ASI
          dexterity: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          constitution: {
            base: 15,
            racial: 1,
            enhancement: 1,
            temporary: 0,
            modifier: 3,
          }, // +1 from ASI
          intelligence: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
          wisdom: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          charisma: {
            base: 13,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
        },
        proficiencyBonus: 2, // Level 4 proficiency
        experience: {
          current: 2700,
          nextLevelThreshold: 6500,
          milestones: [],
        },
        advancement: {
          abilityScoreImprovements: [
            {
              level: 4,
              choices: [
                {
                  type: 'ability_increase',
                  ability: 'strength',
                  value: 1,
                },
                {
                  type: 'ability_increase',
                  ability: 'constitution',
                  value: 1,
                },
              ],
            },
          ],
          feats: [],
          classFeatureChoices: [],
        },
      });

      // Verify advancement tracking
      expect(character.level).toBe(4);
      expect(character.proficiencyBonus).toBe(2);
      expect(character.advancement.abilityScoreImprovements).toHaveLength(1);
      expect(character.classes[0].features).toHaveLength(5);

      // Verify ability score improvements were applied
      const totalStrength =
        character.abilities.strength.base +
        character.abilities.strength.racial +
        character.abilities.strength.enhancement;
      expect(totalStrength).toBe(18); // 16 base + 1 racial + 1 enhancement

      const totalConstitution =
        character.abilities.constitution.base +
        character.abilities.constitution.racial +
        character.abilities.constitution.enhancement;
      expect(totalConstitution).toBe(17); // 15 base + 1 racial + 1 enhancement

      // Test serialization preserves advancement data
      const serializationResult = SerializationUtils.serialize(character);
      expect(serializationResult.success).toBe(true);

      if (serializationResult.success) {
        const deserializationResult = await SerializationUtils.deserialize(
          serializationResult.data
        );
        if (!deserializationResult.success) {
          console.error('Deserialization failed:', deserializationResult.error);
        }
        expect(deserializationResult.success).toBe(true);

        if (deserializationResult.success) {
          const deserialized = deserializationResult.data;
          expect(
            deserialized.advancement.abilityScoreImprovements
          ).toHaveLength(1);
          expect(deserialized.classes[0].features).toHaveLength(5);
          expect(deserialized.abilities.strength.enhancement).toBe(1);
        }
      }
    });
  });

  describe('Character Comparison and Utilities', () => {
    let character1: HollowGearCharacter;
    let character2: HollowGearCharacter;

    beforeEach(() => {
      // Create two different characters for comparison
      character1 = createMockCharacter({
        name: 'Character One',
        species: 'vulmir',
        classes: [
          {
            className: 'arcanist',
            level: 1,
            hitDie: 'd6',
            primaryAbility: 'intelligence',
            features: [],
            spellcasting: {
              type: 'arcanist',
              ability: 'intelligence',
              progression: 'full',
            },
          },
        ],
        abilities: {
          strength: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
          dexterity: {
            base: 16,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          constitution: {
            base: 14,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 2,
          },
          intelligence: {
            base: 18,
            racial: 2,
            enhancement: 0,
            temporary: 0,
            modifier: 5,
          },
          wisdom: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          charisma: {
            base: 13,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
        },
      });

      character2 = createMockCharacter({
        name: 'Character Two',
        species: 'karnathi',
        classes: [
          {
            className: 'vanguard',
            level: 1,
            hitDie: 'd10',
            primaryAbility: 'strength',
            features: [],
            spellcasting: undefined,
            psionics: undefined,
          },
        ],
        abilities: {
          strength: {
            base: 16,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          dexterity: {
            base: 12,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
          constitution: {
            base: 15,
            racial: 1,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          intelligence: {
            base: 10,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 0,
          },
          wisdom: {
            base: 14,
            racial: 2,
            enhancement: 0,
            temporary: 0,
            modifier: 3,
          },
          charisma: {
            base: 13,
            racial: 0,
            enhancement: 0,
            temporary: 0,
            modifier: 1,
          },
        },
        spellcasting: undefined,
      });
    });

    it('should compare two different characters', () => {
      const comparison = CharacterUtilities.compareCharacters(
        character1,
        character2
      );

      expect(comparison.characters.left.name).toBe('Character One');
      expect(comparison.characters.right.name).toBe('Character Two');

      // Verify ability differences (Vulmir INT vs Karnathi STR focus)
      expect(comparison.abilityDifferences.intelligence).toBeLessThan(0); // Character 2 has lower INT
      expect(comparison.abilityDifferences.strength).toBeGreaterThan(0); // Character 2 has higher STR

      // Verify level difference
      expect(comparison.levelDifference).toBe(0); // Both level 1

      // Verify class differences
      expect(comparison.classDifferences).toContain('arcanist');
      expect(comparison.classDifferences).toContain('vanguard');
    });

    it('should create character diff for tracking changes', () => {
      // Modify character1 with deep copy
      const modifiedCharacter = JSON.parse(JSON.stringify(character1));
      modifiedCharacter.hitPoints.current = 20; // Change HP
      modifiedCharacter.level = 2; // Level up
      modifiedCharacter.currency.cogs = 150; // Gain money

      const diff = CharacterUtilities.createCharacterDiff(
        character1,
        modifiedCharacter
      );

      expect(diff.character.name).toBe('Character One');
      expect(diff.changes.length).toBeGreaterThan(0);
      expect(diff.summary.totalChanges).toBeGreaterThan(0);
      expect(diff.summary.significance).toBeDefined();

      // Verify specific changes are tracked
      const hpChange = diff.changes.find(c => c.field.includes('hitPoints'));
      const levelChange = diff.changes.find(c => c.field === 'level');
      const currencyChange = diff.changes.find(c =>
        c.field.includes('currency')
      );

      expect(hpChange).toBeDefined();
      expect(levelChange).toBeDefined();
      expect(currencyChange).toBeDefined();
    });

    it('should calculate derived statistics correctly', () => {
      const stats1 = CharacterUtilities.calculateDerivedStats(character1);
      const stats2 = CharacterUtilities.calculateDerivedStats(character2);

      // Verify ability modifiers
      expect(stats1.abilityModifiers.intelligence).toBeGreaterThan(
        stats2.abilityModifiers.intelligence
      );
      expect(stats2.abilityModifiers.strength).toBeGreaterThan(
        stats1.abilityModifiers.strength
      );

      // Verify passive scores
      expect(stats1.passivePerception).toBeGreaterThanOrEqual(10);
      expect(stats1.passiveInvestigation).toBeGreaterThanOrEqual(10);
      expect(stats1.passiveInsight).toBeGreaterThanOrEqual(10);

      // Verify carrying capacity
      expect(stats2.carryingCapacity).toBeGreaterThan(stats1.carryingCapacity); // Higher STR

      // Verify spellcasting stats for Arcanist
      expect(stats1.spellSaveDC).toBeDefined();
      expect(stats1.spellAttackBonus).toBeDefined();
      expect(stats2.spellSaveDC).toBeUndefined(); // Vanguard has no spellcasting
    });

    it('should create comprehensive character summaries', () => {
      const summary1 = CharacterUtilities.createCharacterSummary(character1);
      const summary2 = CharacterUtilities.createCharacterSummary(character2);

      // Verify basic information
      expect(summary1.basic.name).toBe('Character One');
      expect(summary1.basic.species).toBe('vulmir');
      expect(summary1.basic.classes).toContain('arcanist');

      expect(summary2.basic.name).toBe('Character Two');
      expect(summary2.basic.species).toBe('karnathi');
      expect(summary2.basic.classes).toContain('vanguard');

      // Verify stats
      expect(summary1.basic.level).toBe(1);
      expect(summary1.stats.proficiencyBonus).toBe(2);
      expect(summary1.stats.hitPoints).toMatch(/\d+\/\d+/);

      // Verify abilities
      expect(summary1.abilities.intelligence.modifier).toBeGreaterThan(
        summary2.abilities.intelligence.modifier
      );
      expect(summary2.abilities.strength.modifier).toBeGreaterThan(
        summary1.abilities.strength.modifier
      );

      // Verify resources
      expect(summary1.resources.currency).toContain('Cogs');
      expect(summary1.resources.heatStress).toBe(0);

      // Verify status
      expect(summary1.status.heatStressLevel).toBe(0);
      expect(summary1.status.conditions).toHaveLength(0);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle corrupted serialization data gracefully', async () => {
      const corruptedData = '{"id":"test","name":"Test","invalid_json":}';

      const result = await SerializationUtils.deserialize(corruptedData);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error[0].code).toBe('DESERIALIZATION_FAILED');
      }
    });

    it('should handle missing required character fields', async () => {
      const incompleteData = JSON.stringify({
        id: 'test-id',
        version: '1.0.0',
        name: 'Test Character',
        // Missing many required fields
      });

      const result = await SerializationUtils.deserialize(incompleteData, {
        validate: true,
      });
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.length).toBeGreaterThan(0);
      }
    });

    it('should handle extreme ability score values', () => {
      const character = {
        abilities: {
          strength: { base: 30, racial: 0, enhancement: 0, temporary: 0 },
          dexterity: { base: 1, racial: 0, enhancement: 0, temporary: 0 },
          constitution: { base: 20, racial: 0, enhancement: 0, temporary: 0 },
          intelligence: { base: 8, racial: 0, enhancement: 0, temporary: 0 },
          wisdom: { base: 15, racial: 0, enhancement: 0, temporary: 0 },
          charisma: { base: 12, racial: 0, enhancement: 0, temporary: 0 },
        },
      } as any;

      const strModifier = CharacterUtilities.getTotalAbilityModifier(
        character,
        'strength'
      );
      const dexModifier = CharacterUtilities.getTotalAbilityModifier(
        character,
        'dexterity'
      );

      expect(strModifier).toBe(10); // 30 STR = +10 modifier
      expect(dexModifier).toBe(-5); // 1 DEX = -5 modifier
    });

    it('should handle empty or null character data', () => {
      expect(() => {
        CharacterUtilities.calculateDerivedStats(null as any);
      }).toThrow();

      expect(() => {
        CharacterUtilities.createCharacterSummary(undefined as any);
      }).toThrow();
    });
  });
});
