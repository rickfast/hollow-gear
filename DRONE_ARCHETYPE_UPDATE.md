# Drone Archetype Selection Update

## Summary

Added archetype selection to the drone creation flow, allowing users to choose optional archetypes that modify and enhance their drones with unique characteristics and abilities.

## Changes Made

### 1. New Component

#### `src/components/drone-archetype-selector.tsx` (NEW)

A new component for selecting drone archetypes:

- Displays all available archetypes as selectable cards
- Includes a "Standard Drone" option (no archetype)
- Shows archetype details:
    - Name and type
    - Stat modifications (AC, speed, HP)
    - Special features with descriptions
- Fully accessible with keyboard navigation
- Responsive design matching the template selector

### 2. Updated Components

#### `src/pages/drone-builder-page.tsx`

- **New Step**: Added "Archetype" step between "Template" and "Owner"
- **State Management**: Added `archetypeId` state
- **UI**: Integrated `DroneArchetypeSelector` component
- **Review Step**: Shows selected archetype in review
- **Creation Logic**: Passes archetype to `DroneBuilder`
- **Edit Mode**: Loads and saves archetype data
- **Summary**: Passes archetype to `DroneSummary` component

### 3. Updated Documentation

#### `docs/implementation-notes/drone-templates.md`

- Expanded archetype section with detailed information
- Added all 5 archetypes with full stats and features
- Included code examples for creating drones with archetypes
- Documented the `DroneArchetypeSelector` component

## Available Archetypes

1. **Coghound** - Canine-inspired scout with tracking abilities
2. **Gyrfly** - Aerial drone with recording and flash capabilities
3. **Bulwark Node** - Defensive drone with barrier projection
4. **Scribe Beetle** - Recording drone with perfect transcription
5. **Chimera Frame** - Advanced hybrid with adaptive modes

## User Flow

The updated drone creation flow now has 5 steps:

1. **Basics** - Name and description
2. **Template** - Choose base drone type (Utility, Combat, Recon)
3. **Archetype** - Optional archetype selection (NEW)
4. **Owner** - Assign to an Artifex character
5. **Review** - Confirm all selections

## Features

- **Optional Selection**: Users can skip archetype selection for standard drones
- **Visual Feedback**: Selected archetype is highlighted with checkmark
- **Detailed Information**: Each archetype card shows all modifications and features
- **Live Preview**: DroneSummary sidebar updates to show archetype effects
- **Edit Support**: Existing drones can have their archetype changed

## Technical Details

### Data Flow

```typescript
// User selects archetype
setArchetypeId("gyrfly")

// Passed to DroneBuilder
builder.setArchetype("gyrfly")

// Stored in Drone object
drone.archetypeId = "gyrfly"

// Displayed in DroneSummary
<DroneSummary archetypeId="gyrfly" ... />
```

### Archetype Application

Archetypes modify drones by:

1. Overriding base stats (AC, HP, speed)
2. Adding special features
3. Providing unique abilities

The `DroneSummary` component calculates final stats by:

1. Starting with template base stats
2. Applying archetype modifications
3. Adding level-based bonuses

## Testing

✅ All existing tests pass (32 tests)
✅ Build succeeds with no TypeScript errors
✅ No breaking changes to existing functionality

## Files Modified

- `src/pages/drone-builder-page.tsx`
- `docs/implementation-notes/drone-templates.md`

## Files Added

- `src/components/drone-archetype-selector.tsx`
- `DRONE_ARCHETYPE_UPDATE.md` (this file)

## Backward Compatibility

- Existing drones without archetypes continue to work
- `archetypeId` is optional in the `Drone` type
- Standard drones (no archetype) are fully supported
- No migration needed for existing data

## Future Enhancements

With archetype selection in place, future improvements could include:

1. **Custom Archetypes**: Allow homebrew archetype creation
2. **Archetype Progression**: Archetypes that gain features at higher levels
3. **Archetype Restrictions**: Limit certain archetypes to specific templates
4. **Visual Customization**: Different appearance based on archetype
5. **Archetype Synergies**: Bonuses when paired with specific character builds

## User Benefits

- **Customization**: More options for personalizing drones
- **Variety**: Each drone can feel unique and specialized
- **Strategy**: Choose archetypes that complement character abilities
- **Flavor**: Archetypes add personality and character to drones
- **Flexibility**: Optional system doesn't force complexity on users who want simple drones
