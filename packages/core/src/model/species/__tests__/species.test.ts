/**
 * Unit tests for species system
 * Tests species trait application, ability score modifications, special abilities, and data consistency
 */

import { describe, it, expect } from 'bun:test';
import { 
  SpeciesTraitsUtils, 
  SpeciesDataUtils,
  SPECIES_TRAITS_REGISTRY,
  AQUALOTH_TRAITS,
  VULMIR_TRAITS,
  RENDAI_TRAITS,
  KARNATHI_TRAITS,
  THARN_TRAITS,
  SKELLIN_TRAITS,
  AVENAR_TRAITS
} from '../index.js';
import type { 
  EtherborneSpecies, 
  SpeciesTraits, 
  MovementSpeeds,
  SpecialAbility,
  EtherborneTraits 
} from '../traits.js';

describe('Species System', () => {
  describe('SpeciesTraitsUtils', () => {
    describe('getSpeciesDisplayName', () => {
      it('should return correct display names for all species', () => {
        expect(SpeciesTraitsUtils.getSpeciesDisplayName('aqualoth')).toBe('Aqualoth');
        expect(SpeciesTraitsUtils.getSpeciesDisplayName('vulmir')).toBe('Vulmir');
        expect(SpeciesTraitsUtils.getSpeciesDisplayName('rendai')).toBe('Rendai');
        expect(SpeciesTraitsUtils.getSpeciesDisplayName('karnathi')).toBe('Karnathi');
        expect(SpeciesTraitsUtils.getSpeciesDisplayName('tharn')).toBe('Tharn');
        expect(SpeciesTraitsUtils.getSpeciesDisplayName('skellin')).toBe('Skellin');
        expect(SpeciesTraitsUtils.getSpeciesDisplayName('avenar')).toBe('Avenar');
      });
    });

    describe('getSpeciesAnimalType', () => {
      it('should return correct animal types for all species', () => {
        expect(SpeciesTraitsUtils.getSpeciesAnimalType('aqualoth')).toBe('Axolotl');
        expect(SpeciesTraitsUtils.getSpeciesAnimalType('vulmir')).toBe('Fox');
        expect(SpeciesTraitsUtils.getSpeciesAnimalType('rendai')).toBe('Red Panda');
        expect(SpeciesTraitsUtils.getSpeciesAnimalType('karnathi')).toBe('Ibex');
        expect(SpeciesTraitsUtils.getSpeciesAnimalType('tharn')).toBe('Elk');
        expect(SpeciesTraitsUtils.getSpeciesAnimalType('skellin')).toBe('Gecko');
        expect(SpeciesTraitsUtils.getSpeciesAnimalType('avenar')).toBe('Avian');
      });
    });

    describe('getSpeciesBrief', () => {
      it('should return descriptive briefs for all species', () => {
        const briefs = [
          'aqualoth', 'vulmir', 'rendai', 'karnathi', 
          'tharn', 'skellin', 'avenar'
        ] as EtherborneSpecies[];
        
        briefs.forEach(species => {
          const brief = SpeciesTraitsUtils.getSpeciesBrief(species);
          expect(brief).toBeDefined();
          expect(brief.length).toBeGreaterThan(10);
          expect(typeof brief).toBe('string');
        });
      });
    });

    describe('createEtherborneTraits', () => {
      it('should create standard Etherborne traits', () => {
        const traits = SpeciesTraitsUtils.createEtherborneTraits();
        
        expect(traits.aetherSensitivity).toBe(true);
        expect(traits.machineEmpathy).toBe(true);
        expect(traits.instinctiveHarmony).toBe(true);
      });
    });

    describe('hasSpecialAbility', () => {
      it('should correctly identify species special abilities', () => {
        expect(SpeciesTraitsUtils.hasSpecialAbility(AQUALOTH_TRAITS, 'amphibious')).toBe(true);
        expect(SpeciesTraitsUtils.hasSpecialAbility(AQUALOTH_TRAITS, 'echo_mimicry')).toBe(false);
        
        expect(SpeciesTraitsUtils.hasSpecialAbility(VULMIR_TRAITS, 'echo_mimicry')).toBe(true);
        expect(SpeciesTraitsUtils.hasSpecialAbility(VULMIR_TRAITS, 'amphibious')).toBe(false);
      });
    });

    describe('getSpecialAbility', () => {
      it('should return correct special ability by ID', () => {
        const ability = SpeciesTraitsUtils.getSpecialAbility(SKELLIN_TRAITS, 'wall_skitter');
        expect(ability).toBeDefined();
        expect(ability?.name).toBe('Wall Skitter');
        expect(ability?.id).toBe('wall_skitter');
      });

      it('should return undefined for non-existent abilities', () => {
        const ability = SpeciesTraitsUtils.getSpecialAbility(AQUALOTH_TRAITS, 'nonexistent');
        expect(ability).toBeUndefined();
      });
    });

    describe('getTotalAbilityIncreases', () => {
      it('should calculate correct total ability increases for all species', () => {
        // All species should have exactly 3 total ability score increases (2+1)
        const allSpecies: EtherborneSpecies[] = [
          'aqualoth', 'vulmir', 'rendai', 'karnathi', 
          'tharn', 'skellin', 'avenar'
        ];
        
        allSpecies.forEach(species => {
          const traits = SpeciesDataUtils.getSpeciesTraits(species);
          const total = SpeciesTraitsUtils.getTotalAbilityIncreases(traits);
          expect(total).toBe(3);
        });
      });
    });
  });

  describe('Species Trait Application and Ability Score Modifications', () => {
    describe('Ability Score Increases', () => {
      it('should have correct ability score increases for Aqualoth', () => {
        const increases = AQUALOTH_TRAITS.abilityScoreIncrease;
        expect(increases).toHaveLength(2);
        
        const intIncrease = increases.find(inc => inc.ability === 'intelligence');
        const wisIncrease = increases.find(inc => inc.ability === 'wisdom');
        
        expect(intIncrease?.increase).toBe(2);
        expect(wisIncrease?.increase).toBe(1);
      });

      it('should have correct ability score increases for Vulmir', () => {
        const increases = VULMIR_TRAITS.abilityScoreIncrease;
        expect(increases).toHaveLength(2);
        
        const dexIncrease = increases.find(inc => inc.ability === 'dexterity');
        const chaIncrease = increases.find(inc => inc.ability === 'charisma');
        
        expect(dexIncrease?.increase).toBe(2);
        expect(chaIncrease?.increase).toBe(1);
      });

      it('should have correct ability score increases for Rendai', () => {
        const increases = RENDAI_TRAITS.abilityScoreIncrease;
        expect(increases).toHaveLength(2);
        
        const intIncrease = increases.find(inc => inc.ability === 'intelligence');
        const dexIncrease = increases.find(inc => inc.ability === 'dexterity');
        
        expect(intIncrease?.increase).toBe(2);
        expect(dexIncrease?.increase).toBe(1);
      });

      it('should have correct ability score increases for Karnathi', () => {
        const increases = KARNATHI_TRAITS.abilityScoreIncrease;
        expect(increases).toHaveLength(2);
        
        const strIncrease = increases.find(inc => inc.ability === 'strength');
        const wisIncrease = increases.find(inc => inc.ability === 'wisdom');
        
        expect(strIncrease?.increase).toBe(2);
        expect(wisIncrease?.increase).toBe(1);
      });

      it('should have correct ability score increases for Tharn', () => {
        const increases = THARN_TRAITS.abilityScoreIncrease;
        expect(increases).toHaveLength(2);
        
        const conIncrease = increases.find(inc => inc.ability === 'constitution');
        const strIncrease = increases.find(inc => inc.ability === 'strength');
        
        expect(conIncrease?.increase).toBe(2);
        expect(strIncrease?.increase).toBe(1);
      });

      it('should have correct ability score increases for Skellin', () => {
        const increases = SKELLIN_TRAITS.abilityScoreIncrease;
        expect(increases).toHaveLength(2);
        
        const dexIncrease = increases.find(inc => inc.ability === 'dexterity');
        const intIncrease = increases.find(inc => inc.ability === 'intelligence');
        
        expect(dexIncrease?.increase).toBe(2);
        expect(intIncrease?.increase).toBe(1);
      });

      it('should have correct ability score increases for Avenar', () => {
        const increases = AVENAR_TRAITS.abilityScoreIncrease;
        expect(increases).toHaveLength(2);
        
        const intIncrease = increases.find(inc => inc.ability === 'intelligence');
        const wisIncrease = increases.find(inc => inc.ability === 'wisdom');
        
        expect(intIncrease?.increase).toBe(2);
        expect(wisIncrease?.increase).toBe(1);
      });
    });
  });

  describe('Special Ability Implementations and Movement Calculations', () => {
    describe('Movement Speeds', () => {
      it('should have correct movement speeds for Aqualoth', () => {
        const speed = AQUALOTH_TRAITS.speed;
        expect(speed.walk).toBe(30);
        expect(speed.swim).toBe(30);
        expect(speed.climb).toBe(0);
        expect(speed.fly).toBe(0);
      });

      it('should have correct movement speeds for Vulmir', () => {
        const speed = VULMIR_TRAITS.speed;
        expect(speed.walk).toBe(35);
        expect(speed.swim).toBe(0);
        expect(speed.climb).toBe(0);
        expect(speed.fly).toBe(0);
      });

      it('should have correct movement speeds for Karnathi', () => {
        const speed = KARNATHI_TRAITS.speed;
        expect(speed.walk).toBe(30);
        expect(speed.climb).toBe(20);
        expect(speed.restrictions).toBeDefined();
        expect(speed.restrictions?.[0]).toContain('vertical stone');
      });

      it('should have correct movement speeds for Tharn', () => {
        const speed = THARN_TRAITS.speed;
        expect(speed.walk).toBe(35);
        expect(speed.swim).toBe(0);
        expect(speed.climb).toBe(0);
        expect(speed.fly).toBe(0);
      });

      it('should have correct movement speeds for Skellin', () => {
        const speed = SKELLIN_TRAITS.speed;
        expect(speed.walk).toBe(30);
        expect(speed.climb).toBe(20);
        expect(speed.swim).toBe(0);
        expect(speed.fly).toBe(0);
      });

      it('should have correct movement speeds for Avenar', () => {
        const speed = AVENAR_TRAITS.speed;
        expect(speed.walk).toBe(30);
        expect(speed.fly).toBe(25);
        expect(speed.restrictions).toBeDefined();
        expect(speed.restrictions?.[0]).toContain('medium or heavy armor');
      });
    });

    describe('Special Abilities', () => {
      it('should have correct special abilities for Aqualoth', () => {
        const abilities = AQUALOTH_TRAITS.specialAbilities;
        expect(abilities).toHaveLength(3);
        
        const amphibious = abilities.find(a => a.id === 'amphibious');
        const memory = abilities.find(a => a.id === 'hydrostatic_memory');
        const conduction = abilities.find(a => a.id === 'aether_conduction');
        
        expect(amphibious).toBeDefined();
        expect(memory).toBeDefined();
        expect(conduction).toBeDefined();
        expect(conduction?.usage?.rechargeType).toBe('short');
      });

      it('should have correct special abilities for Vulmir', () => {
        const abilities = VULMIR_TRAITS.specialAbilities;
        expect(abilities).toHaveLength(3);
        
        const reflexes = abilities.find(a => a.id === 'cunning_reflexes');
        const mimicry = abilities.find(a => a.id === 'echo_mimicry');
        const shadowStep = abilities.find(a => a.id === 'shadow_step');
        
        expect(reflexes).toBeDefined();
        expect(mimicry).toBeDefined();
        expect(shadowStep).toBeDefined();
        expect(shadowStep?.usage?.rechargeType).toBe('long');
      });

      it('should have correct special abilities for Rendai', () => {
        const abilities = RENDAI_TRAITS.specialAbilities;
        expect(abilities).toHaveLength(3);
        
        const instinct = abilities.find(a => a.id === 'tinkers_instinct');
        const juryRig = abilities.find(a => a.id === 'jury_rig');
        const overclocker = abilities.find(a => a.id === 'overclocker');
        
        expect(instinct).toBeDefined();
        expect(juryRig).toBeDefined();
        expect(overclocker).toBeDefined();
        expect(juryRig?.mechanics?.damage?.dice).toBe('d8');
      });

      it('should have correct special abilities for Karnathi', () => {
        const abilities = KARNATHI_TRAITS.specialAbilities;
        expect(abilities).toHaveLength(3);
        
        const resolve = abilities.find(a => a.id === 'iron_resolve');
        const resonance = abilities.find(a => a.id === 'psionic_resonance');
        const gait = abilities.find(a => a.id === 'climbers_gait');
        
        expect(resolve).toBeDefined();
        expect(resonance).toBeDefined();
        expect(gait).toBeDefined();
        expect(resonance?.mechanics?.damage?.dice).toBe('d4');
      });

      it('should have correct special abilities for Tharn', () => {
        const abilities = THARN_TRAITS.specialAbilities;
        expect(abilities).toHaveLength(3);
        
        const charge = abilities.find(a => a.id === 'charge');
        const linked = abilities.find(a => a.id === 'aether_linked');
        const kin = abilities.find(a => a.id === 'natures_kin');
        
        expect(charge).toBeDefined();
        expect(linked).toBeDefined();
        expect(kin).toBeDefined();
        expect(charge?.mechanics?.damage?.dice).toBe('d6');
        expect(linked?.usage?.rechargeType).toBe('long');
      });

      it('should have correct special abilities for Skellin', () => {
        const abilities = SKELLIN_TRAITS.specialAbilities;
        expect(abilities).toHaveLength(3);
        
        const skitter = abilities.find(a => a.id === 'wall_skitter');
        const camouflage = abilities.find(a => a.id === 'adaptive_camouflage');
        const grip = abilities.find(a => a.id === 'sticky_grip');
        
        expect(skitter).toBeDefined();
        expect(camouflage).toBeDefined();
        expect(grip).toBeDefined();
      });

      it('should have correct special abilities for Avenar', () => {
        const abilities = AVENAR_TRAITS.specialAbilities;
        expect(abilities).toHaveLength(4);
        
        const recall = abilities.find(a => a.id === 'aether_recall');
        const logic = abilities.find(a => a.id === 'resonant_logic');
        const insight = abilities.find(a => a.id === 'mimetic_insight');
        const descent = abilities.find(a => a.id === 'featherlight_descent');
        
        expect(recall).toBeDefined();
        expect(logic).toBeDefined();
        expect(insight).toBeDefined();
        expect(descent).toBeDefined();
        expect(logic?.usage?.rechargeType).toBe('short');
        expect(insight?.mechanics?.range?.distance).toBe(30);
      });
    });
  });

  describe('Species Data Completeness and Consistency', () => {
    describe('SPECIES_TRAITS_REGISTRY', () => {
      it('should contain all seven Etherborne species', () => {
        const species = Object.keys(SPECIES_TRAITS_REGISTRY);
        expect(species).toHaveLength(7);
        
        const expectedSpecies = [
          'aqualoth', 'vulmir', 'rendai', 'karnathi', 
          'tharn', 'skellin', 'avenar'
        ];
        
        expectedSpecies.forEach(species => {
          expect(SPECIES_TRAITS_REGISTRY).toHaveProperty(species);
        });
      });

      it('should have consistent trait structure for all species', () => {
        Object.values(SPECIES_TRAITS_REGISTRY).forEach(traits => {
          // Check required properties exist
          expect(traits.species).toBeDefined();
          expect(traits.abilityScoreIncrease).toBeDefined();
          expect(traits.speed).toBeDefined();
          expect(traits.specialAbilities).toBeDefined();
          expect(traits.languages).toBeDefined();
          expect(traits.etherborneTraits).toBeDefined();
          expect(traits.description).toBeDefined();
          
          // Check ability score increases
          expect(traits.abilityScoreIncrease).toHaveLength(2);
          expect(traits.abilityScoreIncrease.every(inc => inc.increase > 0)).toBe(true);
          
          // Check languages include Common
          expect(traits.languages).toContain('common');
          
          // Check Etherborne traits are all true
          expect(traits.etherborneTraits.aetherSensitivity).toBe(true);
          expect(traits.etherborneTraits.machineEmpathy).toBe(true);
          expect(traits.etherborneTraits.instinctiveHarmony).toBe(true);
          
          // Check description completeness
          expect(traits.description.appearance).toBeDefined();
          expect(traits.description.culture).toBeDefined();
          expect(traits.description.personality).toBeDefined();
        });
      });

      it('should have valid movement speeds for all species', () => {
        Object.values(SPECIES_TRAITS_REGISTRY).forEach(traits => {
          expect(traits.speed.walk).toBeGreaterThan(0);
          expect(traits.speed.swim).toBeGreaterThanOrEqual(0);
          expect(traits.speed.climb).toBeGreaterThanOrEqual(0);
          expect(traits.speed.fly).toBeGreaterThanOrEqual(0);
        });
      });

      it('should have unique special abilities for each species', () => {
        const allAbilityIds = new Set<string>();
        
        Object.values(SPECIES_TRAITS_REGISTRY).forEach(traits => {
          traits.specialAbilities.forEach(ability => {
            expect(allAbilityIds.has(ability.id)).toBe(false);
            allAbilityIds.add(ability.id);
            
            // Check ability structure
            expect(ability.id).toBeDefined();
            expect(ability.name).toBeDefined();
            expect(ability.description).toBeDefined();
            expect(ability.description.length).toBeGreaterThan(10);
          });
        });
      });
    });

    describe('SpeciesDataUtils', () => {
      it('should get species traits correctly', () => {
        const aqualothTraits = SpeciesDataUtils.getSpeciesTraits('aqualoth');
        expect(aqualothTraits).toBe(AQUALOTH_TRAITS);
        expect(aqualothTraits.species).toBe('aqualoth');
      });

      it('should get all species correctly', () => {
        const allSpecies = SpeciesDataUtils.getAllSpecies();
        expect(allSpecies).toHaveLength(7);
        expect(allSpecies).toContain('aqualoth');
        expect(allSpecies).toContain('avenar');
      });

      it('should validate species correctly', () => {
        expect(SpeciesDataUtils.isValidSpecies('aqualoth')).toBe(true);
        expect(SpeciesDataUtils.isValidSpecies('vulmir')).toBe(true);
        expect(SpeciesDataUtils.isValidSpecies('invalid')).toBe(false);
        expect(SpeciesDataUtils.isValidSpecies('')).toBe(false);
      });

      it('should find species by ability increase', () => {
        const intSpecies = SpeciesDataUtils.getSpeciesByAbilityIncrease('intelligence');
        expect(intSpecies).toContain('aqualoth');
        expect(intSpecies).toContain('rendai');
        expect(intSpecies).toContain('skellin');
        expect(intSpecies).toContain('avenar');
        
        const strSpecies = SpeciesDataUtils.getSpeciesByAbilityIncrease('strength');
        expect(strSpecies).toContain('karnathi');
        expect(strSpecies).toContain('tharn');
      });

      it('should find species by movement type', () => {
        const swimSpecies = SpeciesDataUtils.getSpeciesByMovement('swim');
        expect(swimSpecies).toContain('aqualoth');
        expect(swimSpecies).toHaveLength(1);
        
        const climbSpecies = SpeciesDataUtils.getSpeciesByMovement('climb');
        expect(climbSpecies).toContain('karnathi');
        expect(climbSpecies).toContain('skellin');
        
        const flySpecies = SpeciesDataUtils.getSpeciesByMovement('fly');
        expect(flySpecies).toContain('avenar');
        expect(flySpecies).toHaveLength(1);
      });

      it('should find species by special ability', () => {
        const amphibiousSpecies = SpeciesDataUtils.getSpeciesByAbility('amphibious');
        expect(amphibiousSpecies).toContain('aqualoth');
        expect(amphibiousSpecies).toHaveLength(1);
        
        const wallSkitterSpecies = SpeciesDataUtils.getSpeciesByAbility('wall_skitter');
        expect(wallSkitterSpecies).toContain('skellin');
        expect(wallSkitterSpecies).toHaveLength(1);
      });

      it('should find species by language', () => {
        const commonSpecies = SpeciesDataUtils.getSpeciesByLanguage('common');
        expect(commonSpecies).toHaveLength(7); // All species speak Common
        
        const aquanSpecies = SpeciesDataUtils.getSpeciesByLanguage('aquan');
        expect(aquanSpecies).toContain('aqualoth');
        expect(aquanSpecies).toHaveLength(1);
        
        const sylvanSpecies = SpeciesDataUtils.getSpeciesByLanguage('sylvan');
        expect(sylvanSpecies).toContain('tharn');
        expect(sylvanSpecies).toHaveLength(1);
      });
    });

    describe('Species Trait Validation', () => {
      it('should validate correct species traits', () => {
        Object.values(SPECIES_TRAITS_REGISTRY).forEach(traits => {
          const result = SpeciesTraitsUtils.validateSpeciesTraits(traits);
          expect(result.success).toBe(true);
        });
      });

      it('should reject species without ability score increases', () => {
        const invalidTraits: SpeciesTraits = {
          ...AQUALOTH_TRAITS,
          abilityScoreIncrease: []
        };
        
        const result = SpeciesTraitsUtils.validateSpeciesTraits(invalidTraits);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'MISSING_ABILITY_INCREASES')).toBe(true);
        }
      });

      it('should reject species with invalid walking speed', () => {
        const invalidTraits: SpeciesTraits = {
          ...VULMIR_TRAITS,
          speed: { ...VULMIR_TRAITS.speed, walk: 0 }
        };
        
        const result = SpeciesTraitsUtils.validateSpeciesTraits(invalidTraits);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'INVALID_WALK_SPEED')).toBe(true);
        }
      });

      it('should reject species without Common language', () => {
        const invalidTraits: SpeciesTraits = {
          ...RENDAI_TRAITS,
          languages: ['guilders-cant'] // Missing Common
        };
        
        const result = SpeciesTraitsUtils.validateSpeciesTraits(invalidTraits);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'MISSING_COMMON_LANGUAGE')).toBe(true);
        }
      });

      it('should reject species with incomplete Etherborne traits', () => {
        const invalidTraits: SpeciesTraits = {
          ...KARNATHI_TRAITS,
          etherborneTraits: {
            aetherSensitivity: true,
            machineEmpathy: false, // Should be true
            instinctiveHarmony: true
          }
        };
        
        const result = SpeciesTraitsUtils.validateSpeciesTraits(invalidTraits);
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.some(e => e.code === 'MISSING_ETHERBORNE_TRAITS')).toBe(true);
        }
      });
    });
  });

  describe('Integration and Edge Cases', () => {
    it('should handle species with multiple movement types', () => {
      // Karnathi has walk and climb
      const karnathiSpeed = KARNATHI_TRAITS.speed;
      expect(karnathiSpeed.walk).toBeGreaterThan(0);
      expect(karnathiSpeed.climb).toBeGreaterThan(0);
      expect(karnathiSpeed.swim).toBe(0);
      expect(karnathiSpeed.fly).toBe(0);
      
      // Avenar has walk and fly
      const avenarSpeed = AVENAR_TRAITS.speed;
      expect(avenarSpeed.walk).toBeGreaterThan(0);
      expect(avenarSpeed.fly).toBeGreaterThan(0);
      expect(avenarSpeed.swim).toBe(0);
      expect(avenarSpeed.climb).toBe(0);
    });

    it('should handle species with usage-limited abilities', () => {
      const vulmirShadowStep = VULMIR_TRAITS.specialAbilities.find(a => a.id === 'shadow_step');
      expect(vulmirShadowStep?.usage?.rechargeType).toBe('long');
      expect(vulmirShadowStep?.usage?.usesPerRecharge).toBe(1);
      
      const tharnLinked = THARN_TRAITS.specialAbilities.find(a => a.id === 'aether_linked');
      expect(tharnLinked?.usage?.rechargeType).toBe('long');
      expect(tharnLinked?.usage?.usesPerRecharge).toBe(1);
    });

    it('should handle species with damage-dealing abilities', () => {
      const tharnCharge = THARN_TRAITS.specialAbilities.find(a => a.id === 'charge');
      expect(tharnCharge?.mechanics?.damage?.dice).toBe('d6');
      expect(tharnCharge?.mechanics?.damage?.count).toBe(1);
      expect(tharnCharge?.mechanics?.damage?.type).toBe('bonus');
      
      const rendaiJuryRig = RENDAI_TRAITS.specialAbilities.find(a => a.id === 'jury_rig');
      expect(rendaiJuryRig?.mechanics?.damage?.dice).toBe('d8');
      expect(rendaiJuryRig?.mechanics?.damage?.type).toBe('healing');
    });

    it('should maintain consistency across all species data', () => {
      const allSpecies = SpeciesDataUtils.getAllSpecies();
      
      // Each species should have exactly 2 ability score increases totaling 3 points
      allSpecies.forEach(species => {
        const traits = SpeciesDataUtils.getSpeciesTraits(species);
        expect(traits.abilityScoreIncrease).toHaveLength(2);
        
        const total = traits.abilityScoreIncrease.reduce((sum, inc) => sum + inc.increase, 0);
        expect(total).toBe(3);
        
        // One increase should be +2, one should be +1
        const increases = traits.abilityScoreIncrease.map(inc => inc.increase).sort();
        expect(increases).toEqual([1, 2]);
      });
      
      // All species should have at least 2 languages (Common + 1 other)
      allSpecies.forEach(species => {
        const traits = SpeciesDataUtils.getSpeciesTraits(species);
        expect(traits.languages.length).toBeGreaterThanOrEqual(2);
        expect(traits.languages).toContain('common');
      });
      
      // All species should have at least 2 special abilities
      allSpecies.forEach(species => {
        const traits = SpeciesDataUtils.getSpeciesTraits(species);
        expect(traits.specialAbilities.length).toBeGreaterThanOrEqual(2);
      });
    });
  });
});