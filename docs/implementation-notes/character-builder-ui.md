# Character Builder UI

## Overview

A multi-step character creation wizard that guides users through creating a new Hollow Gear 5E character. Focuses on common character elements, with class-specific features to be configured separately.

## Steps

### 1. Basics
- **Input:** Character name
- **Validation:** Name must not be empty
- **Purpose:** Set the character's identity

### 2. Species
- **Input:** Select from 7 Etherborne species
- **Display:** Shows species details including:
  - Speed (walk, swim, climb)
  - Ability score increases
  - Racial traits
- **Options:**
  - Aqualoth (Axolotl)
  - Vulmir (Fox)
  - Rendai (Red Panda)
  - Karnathi (Ibex)
  - Tharn (Elk)
  - Skellin (Gecko)
  - Avenar (Avian)

### 3. Class
- **Input:** Select from 7 classes
- **Display:** Shows class details including:
  - Role and description
  - Hit die
  - Primary ability
- **Options:**
  - Arcanist (Scholar, Aether manipulator)
  - Templar (Psionic paladin)
  - Tweaker (Brawler, flesh modder)
  - Shadehand (Rogue, infiltrator)
  - Vanguard (Frontline fighter)
  - Artifex (Inventor, engineer)
  - Mindweaver (Psionic master)

### 4. Ability Scores
- **Input:** Set 6 ability scores (1-20)
- **Default:** All start at 10
- **Suggestion:** Standard array (15, 14, 13, 12, 10, 8)
- **Abilities:**
  - Strength
  - Dexterity
  - Constitution
  - Intelligence
  - Wisdom
  - Charisma

### 5. Background
- **Input:** Optional background text
- **Default:** "Adventurer" if left empty
- **Examples:** Guild Mechanist, Street Urchin, Noble
- **Purpose:** Provides character context and story

### 6. Review
- **Display:** Summary of all choices
- **Action:** Create character button
- **Note:** Indicates class-specific features will be configured later

## Progress Indicator

Visual progress chips show:
- ✓ Completed steps (green)
- → Current step (blue, solid)
- ○ Upcoming steps (gray, flat)

## Navigation

- **Back Button:** Returns to previous step (disabled on first step)
- **Next Button:** Advances to next step (disabled if current step invalid)
- **Create Button:** Only on review step, creates character and navigates to sheet

## Validation

Each step validates before allowing progression:
- **Basics:** Name must not be empty
- **Species:** Must select a species
- **Class:** Must select a class
- **Abilities:** Always valid (clamped 1-20)
- **Background:** Always valid (optional)
- **Review:** Always valid

## Error Handling

- Displays error messages at top of form
- Catches validation errors from CharacterBuilder
- Shows user-friendly error messages

## Integration

### CharacterBuilder
Uses the existing `CharacterBuilder` class:
```typescript
const builder = new CharacterBuilder();
builder
    .setName(name)
    .setSpecies(species)
    .setClass(classType)
    .setAbilityScores(abilityScores)
    .setBackground(background);

const characterId = createCharacter(builder);
```

### Context
- Uses `createCharacter()` from CharacterViewModelContext
- Returns character ID for navigation
- Character automatically added to character list

### Navigation
- After creation, navigates to `/characters/:id`
- Shows newly created character sheet
- Character appears in character list

## What's NOT Included

The builder focuses on common elements only. These are configured separately:
- ❌ Subclass selection
- ❌ Skill proficiencies
- ❌ Spell selection
- ❌ Equipment selection
- ❌ Mindcraft powers
- ❌ Starting inventory
- ❌ Personality traits/ideals/bonds/flaws

These will be added through:
1. Character sheet editing
2. Separate configuration screens
3. Future builder steps

## User Experience

### Flow
1. User clicks "Build Character" in navbar
2. Guided through 6 steps
3. Can go back to change choices
4. Reviews all choices
5. Creates character
6. Redirected to character sheet

### Visual Design
- Clean, card-based layout
- Progress indicator at top
- Large, clear inputs
- Helpful descriptions
- Preview cards for species/class
- Responsive design

### Mobile Support
- Works on all screen sizes
- Touch-friendly inputs
- Scrollable content
- Responsive grid layouts

## Future Enhancements

Potential additions:
1. **Point Buy System**: Alternative to manual ability scores
2. **Dice Rolling**: Roll 4d6 drop lowest for abilities
3. **Skill Selection**: Choose skill proficiencies
4. **Equipment Packages**: Starting equipment by class
5. **Spell Selection**: Choose starting spells
6. **Portrait Upload**: Custom character avatars
7. **Save Draft**: Save incomplete characters
8. **Templates**: Quick-start character templates
9. **Validation Preview**: Show what's missing
10. **Tooltips**: Hover info for species/class features

## Testing

To test the builder:
1. Navigate to `/builder`
2. Enter name "Test Character"
3. Select species "Rendai"
4. Select class "Artifex"
5. Adjust ability scores
6. Enter background "Guild Mechanist"
7. Review and create
8. Verify character appears in list
9. Verify character sheet loads correctly

## Benefits

1. **Guided Experience**: Step-by-step reduces overwhelm
2. **Validation**: Prevents invalid characters
3. **Preview**: See species/class details before choosing
4. **Flexible**: Can go back and change choices
5. **Fast**: Only essential fields required
6. **Extensible**: Easy to add more steps later
