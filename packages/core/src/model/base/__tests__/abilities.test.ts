/**
 * Unit tests for ability score system
 */

import { describe, it, expect } from 'bun:test';
import { AbilityScoreUtils } from '../abilities.js';
import type { AbilityScoreData } from '../../types/abilities.js';

describe('AbilityScoreUtils', () => {
  describe('calculateTotal', () => {
    it('should calculate total from all components', () => {
      const score = {
        base: 15,
        racial: 2,
        enhancement: 1,
        temporary: -1,
      };

      expect(AbilityScoreUtils.calculateTotal(score)).toBe(17);
    });

    it('should handle zero values', () => {
      const score = {
        base: 10,
        racial: 0,
        enhancement: 0,
        temporary: 0,
      };

      expect(AbilityScoreUtils.calculateTotal(score)).toBe(10);
    });

    it('should handle negative values', () => {
      const score = {
        base: 8,
        racial: 0,
        enhancement: 0,
        temporary: -2,
      };

      expect(AbilityScoreUtils.calculateTotal(score)).toBe(6);
    });
  });

  describe('calculateModifier', () => {
    it('should calculate modifier for score 10-11 as +0', () => {
      expect(AbilityScoreUtils.calculateModifier(10)).toBe(0);
      expect(AbilityScoreUtils.calculateModifier(11)).toBe(0);
    });

    it('should calculate modifier for score 12-13 as +1', () => {
      expect(AbilityScoreUtils.calculateModifier(12)).toBe(1);
      expect(AbilityScoreUtils.calculateModifier(13)).toBe(1);
    });

    it('should calculate modifier for score 8-9 as -1', () => {
      expect(AbilityScoreUtils.calculateModifier(8)).toBe(-1);
      expect(AbilityScoreUtils.calculateModifier(9)).toBe(-1);
    });

    it('should calculate modifier for very high scores', () => {
      expect(AbilityScoreUtils.calculateModifier(20)).toBe(5);
      expect(AbilityScoreUtils.calculateModifier(30)).toBe(10);
    });

    it('should calculate modifier for very low scores', () => {
      expect(AbilityScoreUtils.calculateModifier(1)).toBe(-5);
      expect(AbilityScoreUtils.calculateModifier(3)).toBe(-4);
    });

    it('should handle edge cases correctly', () => {
      // Test the boundary cases for modifier calculation
      expect(AbilityScoreUtils.calculateModifier(14)).toBe(2);
      expect(AbilityScoreUtils.calculateModifier(15)).toBe(2);
      expect(AbilityScoreUtils.calculateModifier(16)).toBe(3);
      expect(AbilityScoreUtils.calculateModifier(17)).toBe(3);
      expect(AbilityScoreUtils.calculateModifier(18)).toBe(4);
    });
  });

  describe('createAbilityScore', () => {
    it('should create ability score with all components', () => {
      const score = AbilityScoreUtils.createAbilityScore(15, 2, 1, -1);

      expect(score.base).toBe(15);
      expect(score.racial).toBe(2);
      expect(score.enhancement).toBe(1);
      expect(score.temporary).toBe(-1);
      expect(score.modifier).toBe(3); // Total 17 = +3 modifier
    });

    it('should create ability score with defaults', () => {
      const score = AbilityScoreUtils.createAbilityScore(14);

      expect(score.base).toBe(14);
      expect(score.racial).toBe(0);
      expect(score.enhancement).toBe(0);
      expect(score.temporary).toBe(0);
      expect(score.modifier).toBe(2); // Total 14 = +2 modifier
    });

    it('should create ability score with partial values', () => {
      const score = AbilityScoreUtils.createAbilityScore(12, 1);

      expect(score.base).toBe(12);
      expect(score.racial).toBe(1);
      expect(score.enhancement).toBe(0);
      expect(score.temporary).toBe(0);
      expect(score.modifier).toBe(1); // Total 13 = +1 modifier
    });

    it('should correctly calculate modifier for created score', () => {
      const lowScore = AbilityScoreUtils.createAbilityScore(8);
      expect(lowScore.modifier).toBe(-1);

      const averageScore = AbilityScoreUtils.createAbilityScore(10);
      expect(averageScore.modifier).toBe(0);

      const highScore = AbilityScoreUtils.createAbilityScore(18);
      expect(highScore.modifier).toBe(4);
    });
  });

  describe('validateAbilityScore', () => {
    it('should validate normal ability scores', () => {
      const result = AbilityScoreUtils.validateAbilityScore(15, 'strength');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(15);
      }
    });

    it('should reject non-integer scores', () => {
      const result = AbilityScoreUtils.validateAbilityScore(15.5, 'dexterity');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toHaveLength(1);
        expect(result.error[0].code).toBe('INVALID_TYPE');
        expect(result.error[0].field).toBe('dexterity');
      }
    });

    it('should reject scores below 1', () => {
      const result = AbilityScoreUtils.validateAbilityScore(0, 'constitution');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toHaveLength(1);
        expect(result.error[0].code).toBe('SCORE_TOO_LOW');
      }
    });

    it('should reject scores above 30', () => {
      const result = AbilityScoreUtils.validateAbilityScore(31, 'intelligence');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toHaveLength(1);
        expect(result.error[0].code).toBe('SCORE_TOO_HIGH');
      }
    });

    it('should accept boundary values', () => {
      const minResult = AbilityScoreUtils.validateAbilityScore(1, 'wisdom');
      expect(minResult.success).toBe(true);

      const maxResult = AbilityScoreUtils.validateAbilityScore(30, 'charisma');
      expect(maxResult.success).toBe(true);
    });

    it('should accumulate multiple errors', () => {
      const result = AbilityScoreUtils.validateAbilityScore(-1.5, 'strength');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toHaveLength(2);
        expect(result.error.some(e => e.code === 'INVALID_TYPE')).toBe(true);
        expect(result.error.some(e => e.code === 'SCORE_TOO_LOW')).toBe(true);
      }
    });
  });

  describe('getAbilityName', () => {
    it('should return formatted ability names', () => {
      expect(AbilityScoreUtils.getAbilityName('strength')).toBe('Strength');
      expect(AbilityScoreUtils.getAbilityName('dexterity')).toBe('Dexterity');
      expect(AbilityScoreUtils.getAbilityName('constitution')).toBe(
        'Constitution'
      );
      expect(AbilityScoreUtils.getAbilityName('intelligence')).toBe(
        'Intelligence'
      );
      expect(AbilityScoreUtils.getAbilityName('wisdom')).toBe('Wisdom');
      expect(AbilityScoreUtils.getAbilityName('charisma')).toBe('Charisma');
    });
  });

  describe('getAbilityAbbreviation', () => {
    it('should return three-letter abbreviations', () => {
      expect(AbilityScoreUtils.getAbilityAbbreviation('strength')).toBe('STR');
      expect(AbilityScoreUtils.getAbilityAbbreviation('dexterity')).toBe('DEX');
      expect(AbilityScoreUtils.getAbilityAbbreviation('constitution')).toBe(
        'CON'
      );
      expect(AbilityScoreUtils.getAbilityAbbreviation('intelligence')).toBe(
        'INT'
      );
      expect(AbilityScoreUtils.getAbilityAbbreviation('wisdom')).toBe('WIS');
      expect(AbilityScoreUtils.getAbilityAbbreviation('charisma')).toBe('CHA');
    });
  });
});
