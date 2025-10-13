# Drones Implementation

## Overview

This document describes the implementation of the Artifex Drone system in Hollow Gear 5E.

## Data Model

### Character-Drone Relationship

Characters can own multiple drones, but only one can be active at a time:

```typescript
interface Character {
    // ... other fields
    drones?: Drone[]; // All drones the Artifex has built
    activeDroneId?: string; // ID of currently active/deployed drone
}
```

### Drone Structure

```typescript
interface Drone {
    id: string;
    name: string; // Custom name given by player
    templateId: string; // References DroneTemplate (utility, combat, recon)
    archetypeId?: string; // Optional archetype (coghound, gyrfly, etc.)
    level: number; // Matches Artifex level
    hitPoints: HitPoints; // Same pattern as Character
    heatPoints: { current: number; maximum: number };
    modSlots: number;
    mods: string[]; // Array of mod IDs
    personalityQuirk?: DronePersonalityQuirk;
    customization?: {
        shellFinish?: "Verdigris brass" | "Black enamel" | "Mindglass lacquer";
        coreColor?: "Blue" | "Green" | "Red";
        behavioralQuirk?: string;
    };
    destroyed?: boolean; // Track if drone has been destroyed (can be rebuilt)
}
```

## Design Decisions

### Why Array Instead of Single Drone?

**Chosen Approach:** `drones?: Drone[]` with `activeDroneId?: string`

**Rationale:**
1. **Game Rules:** Drones can be destroyed and rebuilt. Players may want to keep multiple drones and swap between them.
2. **History Tracking:** Preserves information about destroyed drones for narrative purposes.
3. **Flexibility:** Allows future features like drone workshops or multiple drone management.
4. **Consistency:** Matches the pattern used for inventory and mods.

### Why `destroyed` Flag Instead of Removing?

Keeping destroyed drones in the array allows:
- Tracking drone history for roleplay
- Easier "rebuild" mechanics (restore HP, clear destroyed flag)
- Narrative continuity (players get attached to named drones)

### Why `activeDroneId` Instead of `active: boolean` on Drone?

Using a single `activeDroneId` on Character:
- Single source of truth
- Prevents multiple drones being marked active
- Easier validation
- Clearer intent in the data model

## Validation Rules

### 1. Drone Ownership
Only Artifex characters can have drones:

```typescript
validateDroneOwnership(character);
// Throws if non-Artifex has drones
```

### 2. Active Drone
Only one drone can be active, and it must exist and not be destroyed:

```typescript
validateActiveDrone(character);
// Validates:
// - activeDroneId matches a drone in drones array
// - active drone is not destroyed
// - no activeDroneId if no drones exist
```

## Utility Functions

### `getActiveDrone(character: Character): Drone | undefined`
Returns the currently active drone, or undefined if none is active.

### `validateDroneOwnership(character: Character): void`
Validates that only Artifex characters have drones.

### `validateActiveDrone(character: Character): void`
Validates the active drone state is consistent.

## Data Files

### `src/data/drones.ts`
Contains:
- **DRONE_TEMPLATES**: 3 basic drone types (Utility, Combat, Recon)
- **DRONE_ARCHETYPES**: 5 special archetypes (Coghound, Gyrfly, Bulwark Node, Scribe Beetle, Chimera Frame)
- **DRONE_CRAFTING**: Crafting requirements and repair mechanics
- **DRONE_MALFUNCTIONS**: Heat overload effects (d6 table)
- **DRONE_EVOLUTIONS**: Level-based upgrades (levels 5, 9, 13)
- **EXAMPLE_DRONES**: Sample drones for testing

### Lookup Objects
- `DRONE_TEMPLATES_BY_ID`: O(1) template lookup
- `DRONE_ARCHETYPES_BY_ID`: O(1) archetype lookup

## Integration with CharacterViewModel

The CharacterViewModel exposes:
```typescript
class CharacterViewModel {
    drones: Drone[] = [];
    activeDrone?: Drone;
    // ... other fields
}
```

This provides easy access to drone information in UI components.

## Future Enhancements

Potential additions:
1. **Drone Actions**: Add drone-specific actions to the Actions panel
2. **Drone Heat Management**: UI for tracking and managing drone heat
3. **Drone Mod System**: Full integration with the mod crafting system
4. **Drone Builder**: UI for creating and customizing drones
5. **Drone Evolution**: Automatic upgrades at levels 5, 9, 13
6. **Psionic Uplink**: Mental communication feature for high-level Artifex

## Testing

See `src/model/drone-utils.test.ts` for comprehensive validation tests.

All tests pass ✓
