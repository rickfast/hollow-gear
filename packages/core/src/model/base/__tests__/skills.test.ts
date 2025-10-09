/**
 * Unit tests for skills and proficiency system
 */

import { describe, it, expect } from 'bun:test';
import { SkillUtils } from '../skills.js';
import type {
  Skill,
  ProficiencyLevel,
  SkillProficiencies,
  SavingThrowProficiencies,
  ProficiencyData,
} from '../skills.js';
import type { AbilityScore } from '../../types/common.js';

describe('SkillUtils', () => {
  const mockAbilityModifiers: Record<AbilityScore, number> = {
    strength: 2,
    dexterity: 3,
    constitution: 1,
    intelligence: 4,
    wisdom: 1,
    charisma: 0,
  };

  describe('SKILL_ABILITIES mapping', () => {
    it('should map skills to correct abilities', () => {
      expect(SkillUtils.SKILL_ABILITIES.athletics).toBe('strength');
      expect(SkillUtils.SKILL_ABILITIES.acrobatics).toBe('dexterity');
      expect(SkillUtils.SKILL_ABILITIES.stealth).toBe('dexterity');
      expect(SkillUtils.SKILL_ABILITIES.arcana).toBe('intelligence');
      expect(SkillUtils.SKILL_ABILITIES.perception).toBe('wisdom');
      expect(SkillUtils.SKILL_ABILITIES.persuasion).toBe('charisma');
    });

    it('should have all 18 D&D 5e skills', () => {
      const skills = Object.keys(SkillUtils.SKILL_ABILITIES);
      expect(skills).toHaveLength(18);

      const expectedSkills = [
        'acrobatics',
        'animalHandling',
        'arcana',
        'athletics',
        'deception',
        'history',
        'insight',
        'intimidation',
        'investigation',
        'medicine',
        'nature',
        'perception',
        'performance',
        'persuasion',
        'religion',
        'sleightOfHand',
        'stealth',
        'survival',
      ];

      expectedSkills.forEach(skill => {
        expect(skills).toContain(skill);
      });
    });
  });

  describe('getSkillAbility', () => {
    it('should return correct ability for each skill', () => {
      expect(SkillUtils.getSkillAbility('athletics')).toBe('strength');
      expect(SkillUtils.getSkillAbility('sleightOfHand')).toBe('dexterity');
      expect(SkillUtils.getSkillAbility('investigation')).toBe('intelligence');
      expect(SkillUtils.getSkillAbility('insight')).toBe('wisdom');
      expect(SkillUtils.getSkillAbility('deception')).toBe('charisma');
    });
  });

  describe('calculateProficiencyBonus', () => {
    it('should calculate correct proficiency bonus by level', () => {
      expect(SkillUtils.calculateProficiencyBonus(1)).toBe(2);
      expect(SkillUtils.calculateProficiencyBonus(4)).toBe(2);
      expect(SkillUtils.calculateProficiencyBonus(5)).toBe(3);
      expect(SkillUtils.calculateProficiencyBonus(8)).toBe(3);
      expect(SkillUtils.calculateProficiencyBonus(9)).toBe(4);
      expect(SkillUtils.calculateProficiencyBonus(12)).toBe(4);
      expect(SkillUtils.calculateProficiencyBonus(13)).toBe(5);
      expect(SkillUtils.calculateProficiencyBonus(16)).toBe(5);
      expect(SkillUtils.calculateProficiencyBonus(17)).toBe(6);
      expect(SkillUtils.calculateProficiencyBonus(20)).toBe(6);
    });
  });

  describe('calculateSkillModifier', () => {
    it('should calculate modifier with no proficiency', () => {
      const modifier = SkillUtils.calculateSkillModifier(3, 'none', 2, 0);
      expect(modifier).toBe(3); // Just ability modifier
    });

    it('should calculate modifier with proficiency', () => {
      const modifier = SkillUtils.calculateSkillModifier(3, 'proficient', 2, 0);
      expect(modifier).toBe(5); // 3 + 2
    });

    it('should calculate modifier with expertise', () => {
      const modifier = SkillUtils.calculateSkillModifier(3, 'expertise', 2, 0);
      expect(modifier).toBe(7); // 3 + (2 * 2)
    });

    it('should include miscellaneous bonus', () => {
      const modifier = SkillUtils.calculateSkillModifier(3, 'proficient', 2, 1);
      expect(modifier).toBe(6); // 3 + 2 + 1
    });

    it('should handle negative ability modifiers', () => {
      const modifier = SkillUtils.calculateSkillModifier(
        -1,
        'proficient',
        2,
        0
      );
      expect(modifier).toBe(1); // -1 + 2
    });

    it('should handle negative miscellaneous bonus', () => {
      const modifier = SkillUtils.calculateSkillModifier(2, 'none', 2, -1);
      expect(modifier).toBe(1); // 2 + 0 - 1
    });
  });

  describe('calculateSaveModifier', () => {
    it('should calculate save modifier without proficiency', () => {
      const modifier = SkillUtils.calculateSaveModifier(2, false, 3, 0);
      expect(modifier).toBe(2); // Just ability modifier
    });

    it('should calculate save modifier with proficiency', () => {
      const modifier = SkillUtils.calculateSaveModifier(2, true, 3, 0);
      expect(modifier).toBe(5); // 2 + 3
    });

    it('should include miscellaneous bonus', () => {
      const modifier = SkillUtils.calculateSaveModifier(2, true, 3, 1);
      expect(modifier).toBe(6); // 2 + 3 + 1
    });

    it('should handle negative values', () => {
      const modifier = SkillUtils.calculateSaveModifier(-1, false, 2, -1);
      expect(modifier).toBe(-2); // -1 + 0 - 1
    });
  });

  describe('createSkillProficiency', () => {
    it('should create skill proficiency with calculated total', () => {
      const skill = SkillUtils.createSkillProficiency('proficient', 3, 2, 1);

      expect(skill.level).toBe('proficient');
      expect(skill.bonus).toBe(1);
      expect(skill.total).toBe(6); // 3 + 2 + 1
    });

    it('should create skill proficiency with expertise', () => {
      const skill = SkillUtils.createSkillProficiency('expertise', 4, 3, 0);

      expect(skill.level).toBe('expertise');
      expect(skill.total).toBe(10); // 4 + (3 * 2) + 0
    });
  });

  describe('createSavingThrowProficiency', () => {
    it('should create saving throw proficiency with calculated total', () => {
      const save = SkillUtils.createSavingThrowProficiency(true, 2, 3, 1);

      expect(save.proficient).toBe(true);
      expect(save.bonus).toBe(1);
      expect(save.total).toBe(6); // 2 + 3 + 1
    });

    it('should create non-proficient saving throw', () => {
      const save = SkillUtils.createSavingThrowProficiency(false, 1, 2, 0);

      expect(save.proficient).toBe(false);
      expect(save.total).toBe(1); // 1 + 0 + 0
    });
  });

  describe('createDefaultSkillProficiencies', () => {
    it('should create all skills with none proficiency', () => {
      const skills = SkillUtils.createDefaultSkillProficiencies(
        mockAbilityModifiers,
        2
      );

      expect(skills.athletics.level).toBe('none');
      expect(skills.athletics.total).toBe(2); // STR modifier

      expect(skills.acrobatics.level).toBe('none');
      expect(skills.acrobatics.total).toBe(3); // DEX modifier

      expect(skills.arcana.level).toBe('none');
      expect(skills.arcana.total).toBe(4); // INT modifier

      expect(skills.perception.level).toBe('none');
      expect(skills.perception.total).toBe(1); // WIS modifier
    });

    it('should have all 18 skills', () => {
      const skills = SkillUtils.createDefaultSkillProficiencies(
        mockAbilityModifiers,
        2
      );
      const skillNames = Object.keys(skills);
      expect(skillNames).toHaveLength(18);
    });
  });

  describe('createDefaultSavingThrowProficiencies', () => {
    it('should create all saves as not proficient', () => {
      const saves = SkillUtils.createDefaultSavingThrowProficiencies(
        mockAbilityModifiers,
        3
      );

      expect(saves.strength.proficient).toBe(false);
      expect(saves.strength.total).toBe(2); // STR modifier only

      expect(saves.dexterity.proficient).toBe(false);
      expect(saves.dexterity.total).toBe(3); // DEX modifier only

      expect(saves.intelligence.proficient).toBe(false);
      expect(saves.intelligence.total).toBe(4); // INT modifier only
    });

    it('should have all 6 ability saves', () => {
      const saves = SkillUtils.createDefaultSavingThrowProficiencies(
        mockAbilityModifiers,
        3
      );
      const saveNames = Object.keys(saves);
      expect(saveNames).toHaveLength(6);

      expect(saves.strength).toBeDefined();
      expect(saves.dexterity).toBeDefined();
      expect(saves.constitution).toBeDefined();
      expect(saves.intelligence).toBeDefined();
      expect(saves.wisdom).toBeDefined();
      expect(saves.charisma).toBeDefined();
    });
  });

  describe('updateSkillProficiencies', () => {
    it('should update skill totals with new modifiers', () => {
      const originalSkills = SkillUtils.createDefaultSkillProficiencies(
        mockAbilityModifiers,
        2
      );

      // Set athletics to proficient
      const updatedSkills = SkillUtils.setSkillProficiency(
        originalSkills,
        'athletics',
        'proficient',
        mockAbilityModifiers,
        2
      );

      expect(updatedSkills.athletics.level).toBe('proficient');
      expect(updatedSkills.athletics.total).toBe(4); // 2 (STR) + 2 (prof)

      // Now update with new ability modifiers and proficiency bonus
      const newModifiers = { ...mockAbilityModifiers, strength: 3 };
      const finalSkills = SkillUtils.updateSkillProficiencies(
        updatedSkills,
        newModifiers,
        3
      );

      expect(finalSkills.athletics.level).toBe('proficient');
      expect(finalSkills.athletics.total).toBe(6); // 3 (STR) + 3 (prof)
    });
  });

  describe('setSkillProficiency', () => {
    it('should set skill proficiency level', () => {
      const skills = SkillUtils.createDefaultSkillProficiencies(
        mockAbilityModifiers,
        2
      );
      const updated = SkillUtils.setSkillProficiency(
        skills,
        'stealth',
        'expertise',
        mockAbilityModifiers,
        2
      );

      expect(updated.stealth.level).toBe('expertise');
      expect(updated.stealth.total).toBe(7); // 3 (DEX) + 4 (expertise)

      // Other skills should remain unchanged
      expect(updated.athletics.level).toBe('none');
      expect(updated.athletics.total).toBe(2);
    });
  });

  describe('setSavingThrowProficiency', () => {
    it('should set saving throw proficiency', () => {
      const saves = SkillUtils.createDefaultSavingThrowProficiencies(
        mockAbilityModifiers,
        3
      );
      const updated = SkillUtils.setSavingThrowProficiency(
        saves,
        'dexterity',
        true,
        mockAbilityModifiers,
        3
      );

      expect(updated.dexterity.proficient).toBe(true);
      expect(updated.dexterity.total).toBe(6); // 3 (DEX) + 3 (prof)

      // Other saves should remain unchanged
      expect(updated.strength.proficient).toBe(false);
      expect(updated.strength.total).toBe(2);
    });
  });

  describe('getSkillName', () => {
    it('should return formatted skill names', () => {
      expect(SkillUtils.getSkillName('animalHandling')).toBe('Animal Handling');
      expect(SkillUtils.getSkillName('sleightOfHand')).toBe('Sleight of Hand');
      expect(SkillUtils.getSkillName('athletics')).toBe('Athletics');
      expect(SkillUtils.getSkillName('perception')).toBe('Perception');
    });
  });

  describe('validateProficiencyData', () => {
    it('should validate correct proficiency data', () => {
      const data: ProficiencyData = {
        bonus: 3,
        skills: SkillUtils.createDefaultSkillProficiencies(
          mockAbilityModifiers,
          3
        ),
        savingThrows: SkillUtils.createDefaultSavingThrowProficiencies(
          mockAbilityModifiers,
          3
        ),
      };

      const result = SkillUtils.validateProficiencyData(data);
      expect(result.success).toBe(true);
    });

    it('should reject invalid proficiency bonus', () => {
      const data: ProficiencyData = {
        bonus: 1, // Too low
        skills: SkillUtils.createDefaultSkillProficiencies(
          mockAbilityModifiers,
          2
        ),
        savingThrows: SkillUtils.createDefaultSavingThrowProficiencies(
          mockAbilityModifiers,
          2
        ),
      };

      const result = SkillUtils.validateProficiencyData(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.some(e => e.code === 'INVALID_PROFICIENCY_BONUS')
        ).toBe(true);
      }
    });

    it('should reject proficiency bonus too high', () => {
      const data: ProficiencyData = {
        bonus: 7, // Too high
        skills: SkillUtils.createDefaultSkillProficiencies(
          mockAbilityModifiers,
          2
        ),
        savingThrows: SkillUtils.createDefaultSavingThrowProficiencies(
          mockAbilityModifiers,
          2
        ),
      };

      const result = SkillUtils.validateProficiencyData(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(
          result.error.some(e => e.code === 'INVALID_PROFICIENCY_BONUS')
        ).toBe(true);
      }
    });
  });

  describe('edge cases and integration', () => {
    it('should handle high-level character calculations', () => {
      const highLevelModifiers: Record<AbilityScore, number> = {
        strength: 5, // 20 STR
        dexterity: 4, // 18 DEX
        constitution: 3, // 16 CON
        intelligence: 4, // 18 INT
        wisdom: 2, // 14 WIS
        charisma: 1, // 12 CHA
      };

      const profBonus = SkillUtils.calculateProficiencyBonus(17); // Level 17 = +6
      expect(profBonus).toBe(6);

      const skills = SkillUtils.createDefaultSkillProficiencies(
        highLevelModifiers,
        profBonus
      );
      const expertiseSkills = SkillUtils.setSkillProficiency(
        skills,
        'athletics',
        'expertise',
        highLevelModifiers,
        profBonus
      );

      expect(expertiseSkills.athletics.total).toBe(17); // 5 + (6 * 2)
    });

    it('should maintain consistency across updates', () => {
      let skills = SkillUtils.createDefaultSkillProficiencies(
        mockAbilityModifiers,
        2
      );

      // Add proficiency to multiple skills
      skills = SkillUtils.setSkillProficiency(
        skills,
        'athletics',
        'proficient',
        mockAbilityModifiers,
        2
      );
      skills = SkillUtils.setSkillProficiency(
        skills,
        'perception',
        'expertise',
        mockAbilityModifiers,
        2
      );

      // Level up (proficiency bonus increases)
      const updatedSkills = SkillUtils.updateSkillProficiencies(
        skills,
        mockAbilityModifiers,
        3
      );

      expect(updatedSkills.athletics.level).toBe('proficient');
      expect(updatedSkills.athletics.total).toBe(5); // 2 + 3

      expect(updatedSkills.perception.level).toBe('expertise');
      expect(updatedSkills.perception.total).toBe(7); // 1 + (3 * 2)

      expect(updatedSkills.stealth.level).toBe('none');
      expect(updatedSkills.stealth.total).toBe(3); // 3 + 0
    });
  });
});
