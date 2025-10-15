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

### 5. Class Configuration

- **Input:** Configure class-specific options for level 1
- **Dynamic:** Options vary by selected class
- **Components:**
    - **Subclass Selection:** Choose archetype (if required at level 1)
    - **Feature Choices:** Select from configurable features (e.g., Arcane Focus type)
    - **Spell Selection:** Choose cantrips and spells (for spellcasting classes)
    - **Proficiency Selection:** Choose skill or tool proficiencies (if applicable)
    - **Ability Selection:** Choose primary ability (Mindweaver only)
- **Validation:** All required selections must be made before proceeding
- **Starting Equipment:** Automatically assigned based on class (see Starting Equipment section)

#### Class-Specific Configuration Examples

**Arcanist:**
- Arcane Focus choice: Steamstaff or Aether Lens
- Spell selection: 3 cantrips and 6 spells from Arcanist spell list

**Mindweaver:**
- Primary ability: Intelligence or Wisdom
- Subclass selection: Path of Echo, Flux, or Eidolon
- Initial psionic powers based on selected path

**Templar:**
- Spell preparation from Templar spell list

**Tweaker, Shadehand, Vanguard, Artifex:**
- Skill proficiency selections (if applicable)
- Subclass selection at level 3 (not during initial creation)

### 6. Background

- **Input:** Optional background text
- **Default:** "Adventurer" if left empty
- **Examples:** Guild Mechanist, Street Urchin, Noble
- **Purpose:** Provides character context and story

### 7. Review

- **Display:** Summary of all choices
- **Action:** Create character button
- **Note:** Indicates class-specific features will be configured later

## Configurable Features

The class configuration step presents dynamic options based on the selected class. These features allow players to customize their character's abilities and playstyle.

### Feature Types

**Choice Features:**
- Single selection from a list of options
- Example: Arcane Focus (Steamstaff or Aether Lens)
- Rendered as radio buttons or select dropdown

**Multiple Choice Features:**
- Select multiple options from a list
- Example: Skill proficiencies (choose 2 from list)
- Rendered as checkboxes with count validation

**Spell Selection:**
- Choose cantrips and spells based on class rules
- Filtered by class spell list and level
- Validates correct number of selections
- Shows spell descriptions and details

**Proficiency Selection:**
- Choose skill or tool proficiencies
- Enforces selection count limits
- Shows proficiency descriptions

**Ability Selection:**
- Choose primary ability score (Mindweaver only)
- Affects spellcasting modifier and save DC
- Options: Intelligence or Wisdom

### Configurable Features by Class

**Arcanist (Level 1):**
- Arcane Focus: Choose Steamstaff or Aether Lens
- Spell Selection: 3 cantrips, 6 spells from Arcanist list

**Templar (Level 1):**
- Spell Preparation: Prepare spells from Templar list

**Tweaker (Level 1):**
- Skill Proficiencies: Choose from class skill list (if applicable)

**Shadehand (Level 1):**
- Skill Proficiencies: Choose from class skill list (if applicable)

**Vanguard (Level 1):**
- Fighting Style: Choose combat specialization (if applicable)

**Artifex (Level 1):**
- Tool Proficiencies: Choose from available tools (if applicable)

**Mindweaver (Level 1):**
- Primary Ability: Choose Intelligence or Wisdom
- Subclass: Choose Path of Echo, Flux, or Eidolon
- Psionic Powers: Initial powers based on selected path

### Validation Rules

- All required features must have selections
- Spell counts must match class requirements
- Proficiency counts must match allowed selections
- Prerequisites must be met for advanced options
- Cannot proceed to next step until all validations pass

## Starting Equipment

Each class receives predefined starting equipment and currency when the character is created. Equipment is automatically added to the character's inventory during the build process.

### Equipment by Class

**Arcanist:**
- Weapons: Brass Dagger
- Armor: Steamweave Vest (light armor)
- Tools: Tinker's Tools
- Items: Aether Lamp, Aether Dust Vial, Mechanist's Satchel, 2× Aether Cell
- Currency: 100 Cogs

**Templar:**
- Weapons: Steamhammer, Brass Shield
- Armor: Steamplate Armor (heavy armor)
- Tools: None
- Items: Holy Symbol (Resonant Core), Aether Cell, Prayer Book
- Currency: 80 Cogs

**Tweaker:**
- Weapons: Brass Knuckles, Throwing Knives (5)
- Armor: Leather Jacket (light armor)
- Tools: Chirurgeon's Tools
- Items: Flesh Mod Kit, Stimpack (2), Aether Cell
- Currency: 70 Cogs

**Shadehand:**
- Weapons: Brass Dagger (2), Hand Crossbow
- Armor: Shadowweave Cloak (light armor)
- Tools: Thieves' Tools
- Items: Grappling Hook, Lockpick Set, Smoke Bomb (3), Aether Cell
- Currency: 90 Cogs

**Vanguard:**
- Weapons: Steamblade, Brass Shield
- Armor: Steamplate Armor (heavy armor)
- Tools: None
- Items: Whetstone, Repair Kit, Aether Cell (2)
- Currency: 75 Cogs

**Artifex:**
- Weapons: Light Hammer, Hand Crossbow
- Armor: Steamweave Vest (light armor)
- Tools: Tinker's Tools, Mechanist's Tools
- Items: Blueprint Case, Scrap Metal (5 lbs), Aether Cell (3), Mechanist's Satchel
- Currency: 85 Cogs

**Mindweaver:**
- Weapons: Quarterstaff
- Armor: Robes (no armor)
- Tools: None
- Items: Psionic Focus Crystal, Meditation Incense, Aether Cell (2), Scholar's Pack
- Currency: 60 Cogs

### Equipment Notes

- All equipment is automatically equipped in appropriate slots (weapons, armor)
- Tools and items are added to inventory
- Currency is added to character's purse
- Aether Cells provide power for equipment that requires it
- Equipment values are based on standard pricing from Chapter 4

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
- **Class Configuration:** All required selections must be made
    - Subclass (if required at level 1)
    - Feature choices (e.g., Arcane Focus)
    - Spell selections (correct number of cantrips and spells)
    - Proficiency selections (correct number of skills/tools)
    - Ability selection (Mindweaver only)
- **Background:** Always valid (optional)
- **Review:** Always valid

## Error Handling

- Displays error messages at top of form
- Catches validation errors from CharacterBuilder
- Shows user-friendly error messages

## Integration

### CharacterBuilder

Uses the existing `CharacterBuilder` class with class configuration:

```typescript
const builder = new CharacterBuilder();
builder
    .setName(name)
    .setSpecies(species)
    .setClass(classType)
    .setAbilityScores(abilityScores)
    .setClassConfiguration(classConfiguration) // New: class-specific choices
    .setBackground(background);

const characterId = createCharacter(builder);
```

The `build()` method automatically:
- Applies starting equipment based on class
- Stores class configuration choices
- Initializes spells and proficiencies from configuration

### Context

- Uses `createCharacter()` from CharacterViewModelContext
- Returns character ID for navigation
- Character automatically added to character list

### Navigation

- After creation, navigates to `/characters/:id`
- Shows newly created character sheet
- Character appears in character list

## What's Included vs. Not Included

### ✅ Now Included (as of Class Configuration System)

- ✅ Subclass selection (for classes that choose at level 1)
- ✅ Skill proficiencies (via class configuration)
- ✅ Spell selection (for spellcasting classes)
- ✅ Starting equipment (automatic by class)
- ✅ Starting inventory (equipment added automatically)
- ✅ Feature choices (e.g., Arcane Focus, primary ability)

### ❌ Still Not Included

These are configured separately or in future updates:

- ❌ Mindcraft powers (configured on character sheet)
- ❌ Equipment modifications (added after creation)
- ❌ Personality traits/ideals/bonds/flaws (optional flavor text)
- ❌ Custom equipment purchases (use character sheet inventory)
- ❌ Multiclassing (future enhancement)

These will be added through:

1. Character sheet editing
2. Level-up configuration
3. Future builder enhancements

## User Experience

### Flow

1. User clicks "Build Character" in navbar
2. Guided through 7 steps:
    - Basics (name)
    - Species selection
    - Class selection
    - Ability scores
    - Class configuration (new step)
    - Background
    - Review
3. Can go back to change choices
4. Reviews all choices
5. Creates character with starting equipment
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
6. Configure class options:
    - Select any required proficiencies
    - Make feature choices if applicable
7. Enter background "Guild Mechanist"
8. Review and create
9. Verify character appears in list
10. Verify character sheet loads correctly
11. Verify starting equipment appears in inventory
12. Verify currency is set correctly

### Testing Class-Specific Configuration

**Test Arcanist:**
- Verify Arcane Focus choice appears (Steamstaff or Aether Lens)
- Verify spell selection interface (3 cantrips, 6 spells)
- Verify starting equipment includes Tinker's Tools and Aether Cells

**Test Mindweaver:**
- Verify primary ability choice (Intelligence or Wisdom)
- Verify subclass selection (Path of Echo, Flux, or Eidolon)
- Verify psionic powers are initialized

**Test Templar:**
- Verify spell preparation interface
- Verify starting equipment includes Steamhammer and Steamplate Armor

**Test Non-Spellcasters (Tweaker, Shadehand, Vanguard, Artifex):**
- Verify skill proficiency selections if applicable
- Verify no spell selection interface
- Verify appropriate starting equipment

## Benefits

1. **Guided Experience**: Step-by-step reduces overwhelm
2. **Validation**: Prevents invalid characters
3. **Preview**: See species/class details before choosing
4. **Flexible**: Can go back and change choices
5. **Fast**: Only essential fields required
6. **Extensible**: Easy to add more steps later
