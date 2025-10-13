# Character Utilities

This document describes the utility functions created for the character view model enhancement.

## Overview

The `character-utils.ts` module provides core calculation and validation functions used throughout the character management system. These utilities follow D&D 5E rules adapted for Hollow Gear 5E.

## Exported Functions

### Calculation Functions

#### `calculateAbilityModifier(abilityScore: number): number`

Calculates the ability score modifier from an ability score.

- **Formula**: `Math.floor((abilityScore - 10) / 2)`
- **Example**: Score of 16 → modifier of +3

#### `calculateProficiencyBonus(level: number): number`

Calculates proficiency bonus based on character level (1-20).

- **Returns**: +2 to +6 based on level
- **Progression**:
    - Levels 1-4: +2
    - Levels 5-8: +3
    - Levels 9-12: +4
    - Levels 13-16: +5
    - Levels 17-20: +6

#### `calculateSkillModifier(abilityScore, proficient, expertise, proficiencyBonus): number`

Calculates total skill modifier including ability modifier, proficiency, and expertise.

- **Components**:
    - Ability modifier
    - Proficiency bonus (if proficient)
    - Additional proficiency bonus (if expertise)

#### `calculateArmorClass(character, equippedArmor?, equippedShield?): number`

Calculates total armor class for a character.

- **Unarmored**: 10 + Dex modifier
- **With Armor**: Base AC (or formula) + shield bonus
- **Supports**: Armor formulas like "13 + Dex" or "12 + Dex (max 2)"

#### `parseArmorFormula(formula: string, dexModifier: number): number`

Parses armor class formulas and applies dexterity modifier with optional caps.

#### `calculateInitiative(dexterityScore: number): number`

Calculates initiative modifier (same as dexterity modifier).

#### `calculateTotalWeight(inventory): number`

Calculates total weight carried from inventory items.

### Helper Functions

#### `getEquippedArmor(character): Armor | undefined`

Returns the equipped armor from character inventory.

#### `getEquippedShield(character): Shield | undefined`

Returns the equipped shield from character inventory.

#### `formatModifier(modifier: number): string`

Formats a numeric modifier as a string with + or - sign.

- **Example**: 3 → "+3", -1 → "-1", 0 → "+0"

### Validation Functions

#### `validateRange(field, value, min, max): void`

Validates that a value is within a specified range.

- **Throws**: `ValidationError` if out of range

#### `validateNonNegative(field, value): void`

Validates that a value is non-negative.

- **Throws**: `ValidationError` if negative

### Error Classes

#### `ValidationError`

Custom error class for domain-specific validation errors.

- **Properties**:
    - `field`: The field name that failed validation
    - `value`: The invalid value
    - `constraint`: Description of the constraint that was violated
- **Usage**: Thrown by validation functions and mutation methods

## Usage Examples

```typescript
import {
    calculateAbilityModifier,
    calculateProficiencyBonus,
    calculateSkillModifier,
    ValidationError,
    validateRange,
} from "@/model/character-utils";

// Calculate ability modifier
const strMod = calculateAbilityModifier(16); // Returns 3

// Calculate proficiency bonus
const profBonus = calculateProficiencyBonus(5); // Returns 3

// Calculate skill modifier
const athleticsModifier = calculateSkillModifier(
    16, // Strength score
    true, // Proficient
    false, // No expertise
    3 // Proficiency bonus
); // Returns 6 (3 from STR + 3 from proficiency)

// Validate input
try {
    validateRange("hitPoints", newHP, 0, maxHP);
} catch (error) {
    if (error instanceof ValidationError) {
        console.error(`Invalid ${error.field}: ${error.constraint}`);
    }
}
```

## Integration

These utilities are used by:

- `CharacterViewModel` - For display calculations
- `MutableCharacterViewModel` - For mutation validation and recalculation
- `CharacterBuilder` - For character creation validation
- UI Components - For validation and error handling

## Testing

All utility functions have been verified with manual tests covering:

- Edge cases (min/max values)
- Boundary conditions
- Error handling
- Formula parsing
- Validation logic

Run verification: `bun run src/model/__verify-utils.ts` (if verification script exists)
