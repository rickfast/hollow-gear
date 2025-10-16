# Drones UI Design

## Design Alignment with Character Sheet

The Drones component now follows the same visual design patterns as the Character Sheet for consistency.

## Layout Structure

### Header Section

```
┌─────────────────────────────────────────────────┐
│ Sparky [Active]                                 │
│ Level 1 Small Combat Drone                      │
└─────────────────────────────────────────────────┘
```

**Similar to Character Sheet:**

- Name in large, bold font (1.25rem, weight 700)
- Status chips (Active/Destroyed) inline with name
- Subtitle with level, size, and type (0.875rem, opacity 0.7)

### Combat Stats Grid

```
┌─────────────────────────────────────────────────┐
│  ARMOR CLASS  │  HIT POINTS  │  SPEED  │  HEAT  │
│      15       │    12/12     │   30    │  0/10  │
└─────────────────────────────────────────────────┘
```

**Design Features:**

- 4-column grid layout
- Uppercase labels (0.75rem, opacity 0.7, weight 600)
- Large values (1.75rem, weight 700)
- Background color: `var(--heroui-content2)`
- Border radius: 0.75rem
- Padding: 1rem
- Centered text alignment

**Matches Character Sheet Pattern:**

- Same label styling (uppercase, small, muted)
- Same value styling (large, bold)
- Same background treatment
- Same spacing and padding

### Additional Movement

```
┌─────────────────────────────────────────────────┐
│ ADDITIONAL MOVEMENT                             │
│ [Fly 10 ft] [Climb 25 ft]                       │
└─────────────────────────────────────────────────┘
```

**Only shown when drone has:**

- Fly speed
- Climb speed
- Swim speed

## Visual Hierarchy

### Before (Old Design)

- Stats in small boxes with individual backgrounds
- Less visual prominence
- Harder to scan quickly
- Inconsistent with character sheet

### After (New Design)

- Stats in unified grid with shared background
- High visual prominence
- Easy to scan at a glance
- Consistent with character sheet design language

## Responsive Behavior

The 4-column grid automatically adjusts:

- Desktop: All 4 stats in one row
- Tablet: May wrap to 2x2 grid
- Mobile: May stack vertically

## Color & Contrast

**Active Drone:**

- Border: 2px solid primary color
- Full opacity
- Primary chip for "Active" status

**Destroyed Drone:**

- Opacity: 0.6 (entire card)
- Danger chip for "Destroyed" status
- Maintains readability while indicating inactive state

## Typography Scale

Matches character sheet typography:

- **Drone Name**: 1.25rem, weight 700
- **Subtitle**: 0.875rem, opacity 0.7
- **Stat Labels**: 0.75rem, uppercase, weight 600, opacity 0.7
- **Stat Values**: 1.75rem, weight 700
- **Body Text**: 0.875rem

## Spacing System

Consistent spacing throughout:

- Card gap: 1rem
- Grid gap: 1rem
- Section gap: 1rem
- Chip gap: 0.5rem
- Header gap: 0.25rem (vertical), 0.5rem (horizontal)

## Example: Sparky (Combat Drone)

```
┌───────────────────────────────────────────────────────────┐
│ Sparky [Active]                                           │
│ Level 1 Small Combat Drone                                │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ Combat Drone                                              │
│ A combat-focused drone built for battlefield support...  │
│                                                           │
│ ┌─────────────────────────────────────────────────────┐ │
│ │  ARMOR CLASS  │  HIT POINTS  │  SPEED  │   HEAT    │ │
│ │      15       │    12/12     │   30    │   0/10    │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                           │
│ ATTACK                                                    │
│ Shock Prod: +4 to hit, 1d6 Lightning damage              │
│                                                           │
│ FEATURES                                                  │
│ • Can use your reaction to impose disadvantage...        │
│                                                           │
│ PERSONALITY & CUSTOMIZATION                               │
│ "Emits low mechanical purring when praised"              │
│ [Black enamel] [Blue core]                               │
│                                                           │
│ MOD SLOTS                                                 │
│ 0 / 1 slots used                                          │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Design Benefits

1. **Consistency**: Matches character sheet visual language
2. **Scannability**: Key stats immediately visible
3. **Hierarchy**: Important info (stats) more prominent
4. **Professional**: Polished, cohesive design
5. **Accessibility**: High contrast, clear labels
6. **Responsive**: Adapts to different screen sizes

## Future Enhancements

Potential additions to match character sheet features:

- Interactive HP/Heat bars (like PointBar component)
- Increment/decrement buttons for HP and Heat
- Hover states for interactive elements
- Animation on stat changes
- Visual heat warning at 5+ heat
