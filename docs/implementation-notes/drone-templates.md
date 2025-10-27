# Drone Templates System

## Overview

The drone creation system uses **templates** to define the base characteristics of drones. Each template represents a specific drone configuration with predefined stats, features, and capabilities.

## Template Structure

A drone template (`DroneTemplate`) includes:

- **id**: Unique identifier (e.g., `"utility-drone"`, `"combat-drone"`, `"recon-drone"`)
- **type**: Category of drone (`"Utility"`, `"Combat"`, or `"Recon"`)
- **name**: Display name (e.g., `"Utility Drone"`)
- **stats**: Base statistics including:
    - Size (Tiny or Small)
    - Armor Class
    - Hit Points (average and roll formula)
    - Speed (walk, fly, climb, swim)
    - Attack (optional)
- **features**: Array of special abilities
- **description**: Flavor text describing the drone
- **modSlots**: Base number of modification slots (increases with level)

## Available Templates

### Utility Drone

- **Type**: Utility
- **Size**: Tiny
- **AC**: 13, **HP**: 8 (2d6+1)
- **Speed**: 30 ft walk, 10 ft fly
- **Features**: Carries 10 lb, Assists with repairs
- **Attack**: Arc Cutter (+3, 1d4 slashing)

### Combat Drone

- **Type**: Combat
- **Size**: Small
- **AC**: 15, **HP**: 12 (3d6+3)
- **Speed**: 30 ft walk
- **Features**: Can impose disadvantage on melee attacks
- **Attack**: Shock Prod (+4, 1d6 lightning)

### Recon Drone

- **Type**: Recon
- **Size**: Tiny
- **AC**: 12, **HP**: 7 (2d4+2)
- **Speed**: 20 ft walk, 30 ft fly
- **Features**: Darkvision 60 ft, Transmits vision and sound

## Using Templates in Code

### Creating a Drone with a Template

```typescript
import { DroneBuilder } from "@/model/drone-builder";

const builder = new DroneBuilder();
const drone = builder
    .setName("Sparky")
    .setTemplateId("combat-drone") // Use template ID directly
    .setLevel(1)
    .build();
```

### Creating a Drone with an Archetype

```typescript
const drone = builder
    .setName("Whisper")
    .setTemplateId("recon-drone")
    .setArchetype("gyrfly") // Add archetype
    .setLevel(1)
    .build();
```

### Alternative: Using Type (Convenience Method)

```typescript
// This finds the first template matching the type
const drone = builder
    .setName("Sparky")
    .setType("Combat") // Automatically finds "combat-drone" template
    .setLevel(1)
    .build();
```

### Accessing Template Data

```typescript
import { DRONE_TEMPLATES_BY_ID } from "@/data/drones";

const template = DRONE_TEMPLATES_BY_ID["combat-drone"];
console.log(template.name); // "Combat Drone"
console.log(template.stats.armorClass); // 15
console.log(template.features); // ["Can use your reaction..."]
```

## UI Components

### DroneTypeSelector

The `DroneTypeSelector` component displays all available templates as selectable cards:

```typescript
<DroneTypeSelector
    selectedTemplateId={templateId}
    onTemplateChange={(id) => setTemplateId(id)}
/>
```

Each card shows:

- Template name and type
- Size and mod slots
- Description
- Combat stats (HP, AC, Speed)
- Attack information (if applicable)
- Special features

### DroneArchetypeSelector

The `DroneArchetypeSelector` component allows optional archetype selection:

```typescript
<DroneArchetypeSelector
    selectedArchetypeId={archetypeId}
    onArchetypeChange={(id) => setArchetypeId(id)}
/>
```

Features:

- Includes a "Standard Drone" option (no archetype)
- Shows all available archetypes with details
- Displays stat modifications and special features
- Optional selection (can be skipped)

### DroneSummary

The `DroneSummary` component displays a drone's final stats based on its template, level, and archetype:

```typescript
<DroneSummary
    name="Sparky"
    templateId="combat-drone"
    level={3}
    mods={[]}
/>
```

## Template Evolution

Templates provide base stats that evolve with the drone's level:

- **Level 1**: Base template stats
- **Level 5**: +1 AC, +5 HP, +1 mod slot
- **Level 9**: Additional movement features
- **Level 13**: Limited self-direction
- **Level 17**: +1 mod slot

## Archetypes

Drones can optionally have an **archetype** that modifies the base template. Archetypes are selected during drone creation and provide unique characteristics and abilities.

### Available Archetypes

#### Coghound

- **Size**: Small
- **Speed**: +10 ft (40 ft walk)
- **Features**:
    - Canine Loyalty: Advantage on tracking checks
    - Delivery System: Can deliver small items (up to 5 lb)
    - Comforting Hum: Allies within 5 ft gain +1 to saves vs fear

#### Gyrfly

- **Size**: Tiny
- **Speed**: 20 ft walk, 40 ft fly
- **Features**:
    - Hovering Flight: Can hover in place without falling
    - Audio Recorder: Once per day, record up to 1 minute of sound
    - Dazzling Flare: Emits flash in 5 ft radius (DC 12 Con save or blinded 1 round)

#### Bulwark Node

- **Size**: Small
- **AC**: +2 (17 AC)
- **Speed**: 20 ft walk
- **Features**:
    - Barrier Pulse: As a reaction, project a barrier giving +2 AC to an adjacent ally for 1 round (generates Heat +1)

#### Scribe Beetle

- **Size**: Tiny
- **Speed**: 25 ft walk, 25 ft climb
- **Features**:
    - Perfect Transcription: Transcribes sound or vision with perfect accuracy
    - Forgery: Can forge or copy written data
    - Tremorsense: When attached to a wall or door, grants tremorsense 15 ft

#### Chimera Frame

- **Size**: Small
- **AC**: 16
- **HP**: 20 (4d6+6)
- **Speed**: 30 ft walk, 30 ft fly
- **Features**:
    - Adaptive Mode: Switch between ground and aerial mode as a bonus action
    - Aether Burst: Once per long rest, perform Aether Burst (10 ft explosion, 2d6 force damage, Dex save DC 13 half)

### Using Archetypes

Archetypes are applied on top of the base template and can override certain stats. When a drone has an archetype:

1. Base template stats are used as the foundation
2. Archetype stat modifications override base stats (e.g., AC, speed)
3. Archetype features are added to the drone's feature list
4. The drone gains the archetype's unique abilities

## Adding New Templates

To add a new drone template:

1. Add the template to `DRONE_TEMPLATES` array in `src/data/drones.ts`:

```typescript
{
    id: "stealth-drone",
    type: "Recon",
    name: "Stealth Drone",
    stats: {
        size: "Tiny",
        armorClass: 14,
        hitPoints: { average: 9, roll: "2d6+2" },
        speed: { walk: 25, fly: 35 },
    },
    features: ["Invisibility (1/day)", "Silent movement"],
    description: "A specialized reconnaissance drone with stealth capabilities.",
    modSlots: 1,
}
```

2. The template will automatically appear in the `DroneTypeSelector` UI
3. The `DRONE_TEMPLATES_BY_ID` lookup object is auto-generated

## Best Practices

1. **Use Template IDs**: When storing or referencing drones, always use the `templateId` field
2. **Type Safety**: The `DroneTemplate` type ensures all required fields are present
3. **Immutability**: Templates are read-only data; never modify them directly
4. **Validation**: The `DroneBuilder` validates that template IDs exist before creating drones
5. **Consistency**: Keep template IDs lowercase with hyphens (e.g., `"combat-drone"`)

## Related Files

- `src/types/drones.ts` - Type definitions
- `src/data/drones.ts` - Template data
- `src/model/drone-builder.ts` - Drone creation logic
- `src/components/drone-type-selector.tsx` - Template selection UI
- `src/components/drone-summary.tsx` - Template display
- `src/pages/drone-builder-page.tsx` - Drone creation flow
