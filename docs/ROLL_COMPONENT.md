# Roll Component Usage Guide

The `Roll` component provides dice rolling functionality with toast notifications showing detailed roll results.

## Features

- Roll any number of dice with any number of sides
- Support for bonuses/modifiers
- Display results in a toast notification with dice icon
- Show individual dice rolls and total
- Support for multiple rollables in a single toast

## Basic Usage

### Method 1: Using the Roll Component (Render Props Pattern)

```tsx
import { Roll } from "@/components/roll";
import { Button } from "@heroui/react";
import type { Rollable } from "@/types";

function MyComponent() {
    const attackRoll: Rollable = {
        count: 1, // Roll 1 die
        die: 20, // d20
        bonus: 5, // +5 modifier
    };

    return (
        <Roll title="Attack Roll" rollables={[attackRoll]}>
            {(roll) => <Button onPress={roll}>Roll Attack</Button>}
        </Roll>
    );
}
```

### Method 2: Using showRollToast Directly

```tsx
import { showRollToast } from "@/components/roll";
import { Button } from "@heroui/react";
import type { Rollable } from "@/types";

function MyComponent() {
    const handleRoll = () => {
        const damageRoll: Rollable = {
            count: 2, // Roll 2 dice
            die: 6, // d6
            bonus: 3, // +3 modifier
        };

        showRollToast("Damage Roll", [damageRoll]);
    };

    return <Button onPress={handleRoll}>Roll Damage</Button>;
}
```

## Multiple Dice Rolls

You can roll multiple different dice in a single toast:

```tsx
const rollables: Rollable[] = [
    { count: 1, die: 20, bonus: 5 }, // Attack roll
    { count: 2, die: 6, bonus: 3 }, // Main damage
    { count: 1, die: 4 }, // Additional damage
];

showRollToast("Critical Hit!", rollables);
```

This will show:

- Each roll result separately
- The grand total of all rolls

## Toast Display

The toast shows:

- **Title**: The action name (e.g., "Attack Roll", "Longsword Damage")
- **Dice Icon**: A dice icon on the left
- **Roll Details**: For each rollable:
    - Dice notation (e.g., "2d6+3")
    - Individual dice results in brackets
    - Final total
- **Grand Total**: If multiple rollables, shows the sum of all

### Example Toast Output

```
🎲 Longsword Attack

1d20+5: [15] +5 = 20

---

Longsword Damage (Slashing)

1d8+3: [6] +3 = 9
```

## Integration Example (Actions Component)

The Actions component demonstrates practical usage:

```tsx
const handleAttackRoll = (action: Action) => {
    const attackRollable: Rollable = {
        count: 1,
        die: 20,
        bonus: parseInt(action.hit.modifier),
    };

    showRollToast(`${action.name} - Attack Roll`, [attackRollable]);
};

const handleDamageRoll = (action: Action) => {
    const damageRollable: Rollable = {
        count: action.damage.count,
        die: action.damage.die,
        bonus: action.damage.bonus,
    };

    showRollToast(`${action.name} - Damage (${action.damage.damageType})`, [damageRollable]);
};
```

## Types

### Rollable

```typescript
interface Rollable {
    count: number; // Number of dice to roll
    die: Die; // Type of die (4, 6, 8, 10, 12, 20, 100)
    bonus?: number; // Optional modifier to add
}
```

### Die

```typescript
type Die = 1 | 4 | 6 | 8 | 10 | 12 | 20 | 100;
```

### RollResult

```typescript
interface RollResult {
    rolls: number[]; // Individual die results
    total: number; // Final total (sum of rolls + bonus)
    rollable: Rollable; // Original rollable object
}
```

## Setup Required

Make sure you have the Toaster component in your app root (already added to `main.tsx`):

```tsx
import { Toaster } from "sonner";

<HeroUIProvider>
    <App />
    <Toaster position="top-right" richColors />
</HeroUIProvider>;
```

## Customization

You can customize the toast duration and appearance by modifying the `showRollToast` function:

```tsx
toast(content, {
    duration: 5000, // 5 seconds
    classNames: {
        toast: "bg-background border-default-200",
    },
});
```
