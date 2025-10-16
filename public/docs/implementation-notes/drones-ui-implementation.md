# Drones UI Implementation

## Overview

This document describes the UI implementation for the Artifex Drone system in the character sheet.

## Components Added

### 1. Drones Component (`src/components/drones.tsx`)

A new component that displays all drones owned by an Artifex character.

**Features:**

- Lists all drones with their stats and information
- Shows active/destroyed status with chips
- Displays drone template information (type, description)
- Shows stat blocks (Size, AC, HP, Heat)
- Lists speed types (walk, fly, climb, swim)
- Shows attack information if available
- Displays features from the template
- Shows personality quirks and customization
- Indicates mod slot usage

**Props:**

```typescript
interface DronesProps {
    drones: Drone[];
    activeDroneId?: string;
}
```

**Visual Design:**

- Active drones have a primary border
- Destroyed drones are shown with reduced opacity
- Stat blocks use a grid layout with centered values
- Chips indicate status (Active, Destroyed, Level)
- Customization shown with bordered chips

## Character Sheet Integration

### Tab Addition

Added a new "Drones" tab to the character sheet that:

- Only shows for Artifex characters
- Only displays if the character has drones
- Appears between "Spells" and "Features" tabs

**Implementation:**

```typescript
const isArtifex = summary.class === "Artifex" || summary.fullClass.includes("Artifex");
const showDronesTab = isArtifex && getCharacter(id).drones.length > 0;
```

### Mobile Support

The Drones tab is included in the mobile Select dropdown when available.

## CharacterViewModel Updates

### Summary Enhancement

Added `activeDroneId` to `CharacterSummary`:

```typescript
export interface CharacterSummary {
    // ... existing fields
    activeDroneId?: string;
}
```

### Drone Properties

Added to `CharacterViewModel`:

```typescript
class CharacterViewModel {
    activeDrone?: Drone;
    drones: Drone[] = [];
    // ... other properties
}
```

### Drone Actions

Active drones now create actions that appear in the Actions tab:

**Action Creation Logic:**

1. Check if character has an active drone
2. Verify the drone is not destroyed
3. Get the drone template
4. If template has an attack, create an action

**Action Format:**

```typescript
{
    name: "Sparky - Shock Prod",
    type: "Drone Attack",
    hit: { modifier: "+4" },
    damage: {
        count: 1,
        die: 6,
        bonus: 0,
        damageType: "Lightning",
    },
    description: "Your drone Sparky attacks with its Shock Prod.",
    range: "60 ft (command range)",
}
```

## User Experience

### Viewing Drones

1. Open an Artifex character (e.g., Lyrra Quenchcoil)
2. Navigate to the "Drones" tab
3. See all drones with their stats and status
4. Active drone is highlighted with a border and "Active" chip
5. Destroyed drones are grayed out with "Destroyed" chip

### Using Drone Actions

1. Navigate to the "Actions" tab
2. See drone attack alongside character weapons
3. Click the roll button to roll drone attack
4. Drone actions show:
    - Drone name + attack name
    - "Drone Attack" as type
    - Attack bonus and damage
    - Command range (60 ft)

## Testing

### Unit Tests

**Drone Utils Tests** (`src/model/drone-utils.test.ts`):

- ✓ Validates drone ownership (Artifex only)
- ✓ Validates active drone state
- ✓ Gets active drone correctly

**Pregen Tests** (`src/data/pregens.test.ts`):

- ✓ Lyrra has drones
- ✓ Sparky is active
- ✓ Tinker is destroyed
- ✓ Passes validation

**ViewModel Tests** (`src/model/character-view-model-drones.test.ts`):

- ✓ Includes activeDroneId in summary
- ✓ Includes drones array
- ✓ Sets activeDrone correctly
- ✓ Creates action for active drone
- ✓ Doesn't create action for destroyed drone
- ✓ Includes all actions together

All tests passing: **23/23** ✓

## Example: Lyrra Quenchcoil

Lyrra's character sheet now shows:

**Drones Tab:**

- **Sparky** (Active) - Combat Drone
    - AC 15, HP 12/12, Heat 0/10
    - Attack: Shock Prod +4, 1d6 lightning
    - Features: Can impose disadvantage on melee attacks
    - Personality: "Emits low mechanical purring when praised"
    - Customization: Black enamel shell, blue core

- **Tinker** (Destroyed) - Utility Drone
    - AC 13, HP 8/8, Heat 0/10
    - Attack: Arc Cutter +3, 1d4 slashing
    - Features: Carries 10 lb, assists with repairs
    - Personality: "Obsessively catalogs all mechanical sounds"
    - Customization: Verdigris brass shell, green core

**Actions Tab:**

- Rivetgun (equipped weapon)
- Cogwrench (equipped weapon)
- **Sparky - Shock Prod** (drone attack) ← NEW
- Unarmed Strike

## Future Enhancements

Potential additions:

1. **Drone HP Management**: Add increment/decrement buttons for drone HP
2. **Drone Heat Tracking**: Visual heat bar for active drone
3. **Activate/Deactivate**: Button to switch active drone
4. **Rebuild Destroyed**: Action to rebuild destroyed drones
5. **Mod Management**: Attach/detach mods to drones
6. **Drone Commands**: Special actions (defend, scout, return)
7. **Heat Malfunction Rolls**: Automatic malfunction checks at 5+ heat
8. **Evolution Tracking**: Show available upgrades at levels 5, 9, 13

## Design Decisions

### Why Show Destroyed Drones?

Destroyed drones are shown (grayed out) to:

- Maintain narrative continuity
- Show rebuild options
- Track drone history
- Preserve personality and customization

### Why Include Drone Actions in Main Actions Tab?

Drone attacks appear alongside character actions because:

- Players roll them during combat like any other attack
- Keeps all combat actions in one place
- Makes it clear the drone is an active combat participant
- Follows D&D 5E familiar/companion patterns

### Why Conditional Tab Display?

The Drones tab only shows when relevant to:

- Reduce UI clutter for non-Artifex characters
- Avoid empty tabs
- Make the feature discoverable when applicable
