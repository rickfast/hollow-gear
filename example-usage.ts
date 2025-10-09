/**
 * Example usage of the @hollow-gear/core workspace package
 */

import {
  MODEL_VERSION,
  type EtherborneSpecies,
  type HollowGearClass,
  AbilityScoreUtils,
} from '@hollow-gear/core';

console.log(`🎲 Hollow Gear TTRPG Core v${MODEL_VERSION}`);
console.log('');

// Example 1: Working with species
const species: EtherborneSpecies[] = [
  'vulmir',
  'rendai',
  'aqualoth',
  'karnathi',
  'tharn',
  'skellin',
  'avenar',
];
console.log('🦊 Available Etherborne Species:');
species.forEach(s => console.log(`   - ${s}`));
console.log('');

// Example 2: Working with classes
const classes: HollowGearClass[] = [
  'arcanist',
  'templar',
  'tweaker',
  'shadehand',
  'vanguard',
  'artifex',
  'mindweaver',
];
console.log('⚙️  Available Hollow Gear Classes:');
classes.forEach(c => console.log(`   - ${c}`));
console.log('');

// Example 3: Using utility functions
const abilityScore = AbilityScoreUtils.createAbilityScore(14, 2); // Base 14, +2 racial
console.log('🎯 Ability Score Example:');
console.log(
  `   Base: 14, Racial: +2, Total: ${AbilityScoreUtils.calculateTotal(abilityScore)}`
);
console.log(`   Modifier: ${abilityScore.modifier}`);
console.log('');

console.log('✅ Workspace package is working correctly!');
console.log('📚 Check packages/core/README.md for detailed usage examples.');
