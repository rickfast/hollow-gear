# Editable Drone Resources

## Overview

Drone Hit Points and Heat Points are now editable using the same PointBar component and patterns as character resources.

## Implementation

### 1. Drones Component Updates

**Added Props:**
```typescript
interface DronesProps {
    drones: Drone[];
    activeDroneId?: string;
    onDroneHitPointsChange?: (droneId: string, delta: number) => void;
    onDroneHeatPointsChange?: (droneId: string, delta: number) => void;
}
```

**Layout Changes:**
- Moved AC and Speed to a 2-column grid (static stats)
- Added HP and Heat as PointBar components below (editable resources)
- Disabled editing for destroyed drones

**PointBar Integration:**
```typescript
<PointBar
    label="Hit Points"
    points={drone.hitPoints}
    onIncrement={onDroneHitPointsChange && !isDestroyed 
        ? () => onDroneHitPointsChange(drone.id, 1) 
        : undefined}
    onDecrement={onDroneHitPointsChange && !isDestroyed 
        ? () => onDroneHitPointsChange(drone.id, -1) 
        : undefined}
/>
```

### 2. MutableCharacterViewModel Methods

Added two new methods for drone resource management:

**updateDroneHitPoints(droneId: string, current: number): Character**
- Validates drone exists
- Validates HP is within range (0 to maximum)
- Updates specific drone's HP
- Returns updated Character object
- Maintains immutability

**updateDroneHeatPoints(droneId: string, current: number): Character**
- Validates drone exists
- Validates heat is within range (0 to maximum)
- Updates specific drone's heat
- Returns updated Character object
- Maintains immutability

**Error Handling:**
- Throws `ValidationError` if character has no drones
- Throws `ValidationError` if drone ID not found
- Throws `ValidationError` if value out of range

### 3. Character Sheet Integration

**Added Handlers:**
```typescript
const handleDroneHitPointsChange = (droneId: string, delta: number) => {
    updateCharacter(id, (vm) => {
        const drone = vm.drones.find((d) => d.id === droneId);
        if (!drone) return vm.toCharacter();
        const newValue = Math.max(
            0,
            Math.min(drone.hitPoints.maximum, drone.hitPoints.current + delta)
        );
        return vm.updateDroneHitPoints(droneId, newValue);
    });
};

const handleDroneHeatPointsChange = (droneId: string, delta: number) => {
    updateCharacter(id, (vm) => {
        const drone = vm.drones.find((d) => d.id === droneId);
        if (!drone) return vm.toCharacter();
        const newValue = Math.max(
            0,
            Math.min(drone.heatPoints.maximum, drone.heatPoints.current + delta)
        );
        return vm.updateDroneHeatPoints(droneId, newValue);
    });
};
```

**Passed to Drones Component:**
```typescript
<Drones
    drones={getCharacter(id).drones}
    activeDroneId={getCharacter(id).summary.activeDroneId}
    onDroneHitPointsChange={handleDroneHitPointsChange}
    onDroneHeatPointsChange={handleDroneHeatPointsChange}
/>
```

## User Experience

### Editing Drone Resources

1. Navigate to the Drones tab
2. See PointBar components for HP and Heat
3. Click + or - buttons to adjust values
4. Values are clamped to valid range (0 to maximum)
5. Changes persist in character state

### Destroyed Drones

- Destroyed drones show PointBars without buttons
- Cannot edit resources of destroyed drones
- Visual indication through disabled state

### Visual Design

**Before (Static Display):**
```
┌──────────────────────────────────────────┐
│  ARMOR CLASS │ HIT POINTS │ SPEED │ HEAT │
│      15      │   12/12    │  30   │ 0/10 │
└──────────────────────────────────────────┘
```

**After (Editable Resources):**
```
┌──────────────────────────┐
│ ARMOR CLASS │   SPEED    │
│     15      │     30     │
└──────────────────────────┘

┌─────────────────────────────────────┐
│ Hit Points        [−] 12/12 [+]     │
│ Heat Points       [−]  0/10 [+]     │
└─────────────────────────────────────┘
```

## Testing

### Unit Tests (8/8 passing ✓)

**MutableCharacterViewModel Tests:**
1. ✓ Should update drone hit points
2. ✓ Should update drone heat points
3. ✓ Should throw error if drone not found
4. ✓ Should throw error if character has no drones
5. ✓ Should validate HP range
6. ✓ Should validate heat range
7. ✓ Should not affect other drones when updating one
8. ✓ Should maintain immutability

### Test Coverage

- ✓ Valid updates
- ✓ Range validation (0 to maximum)
- ✓ Error handling (missing drone, no drones)
- ✓ Immutability preservation
- ✓ Multiple drone isolation

## Consistency with Character Resources

The drone resource editing follows the exact same patterns as character resources:

| Feature | Character | Drone |
|---------|-----------|-------|
| Component | PointBar | PointBar |
| Increment/Decrement | ±1 | ±1 |
| Range Validation | 0 to max | 0 to max |
| Update Method | updateHitPoints() | updateDroneHitPoints() |
| Handler Pattern | handleHitPointsChange() | handleDroneHitPointsChange() |
| Immutability | ✓ | ✓ |
| Error Handling | ValidationError | ValidationError |

## Future Enhancements

Potential additions:
1. **Bulk Updates**: Heal all drones at once
2. **Heat Warnings**: Visual indicator at 5+ heat (malfunction risk)
3. **Auto-Vent**: Button to reduce heat by 1d6 (action cost)
4. **Repair Action**: Spend Cogs to heal drone HP
5. **Rebuild**: Button to restore destroyed drone (8 hours + 25 Cogs)
6. **Heat Malfunction Roll**: Automatic d6 roll at 5+ heat
7. **Temporary HP**: Support for temporary HP on drones
8. **Keyboard Shortcuts**: Arrow keys to adjust values

## Benefits

1. **Consistency**: Matches character resource editing exactly
2. **Usability**: Familiar interface for players
3. **Safety**: Range validation prevents invalid values
4. **Flexibility**: Can adjust resources during combat
5. **Persistence**: Changes saved to character state
6. **Accessibility**: Clear visual feedback on changes
