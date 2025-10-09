# @hollow-gear/core

Core character models and game mechanics for the Hollow Gear TTRPG system.

## Overview

This package provides comprehensive TypeScript types and interfaces for representing D&D 5e characters enhanced with Hollow Gear mechanics. It serves as the foundation for character creation, management, and gameplay functionality in the Hollow Gear TTRPG mobile application.

## Features

- **Type-Safe Character Models**: Comprehensive TypeScript interfaces for all character data
- **Modular Architecture**: Organized by functional areas (species, classes, equipment, etc.)
- **Offline-First Design**: Optimized for mobile app usage without internet connectivity
- **Serialization Support**: Built-in JSON serialization and data migration capabilities
- **Validation System**: Comprehensive validation for character data integrity

## Installation

```bash
bun add @hollow-gear/core
```

## Usage

```typescript
import { CharacterUtils, type CharacterCreationParams } from '@hollow-gear/core';

const params: CharacterCreationParams = {
  name: "Zara Cogwright",
  species: "vulmir",
  startingClass: "arcanist",
  abilityScores: {
    strength: 10,
    dexterity: 16,
    constitution: 14,
    intelligence: 15,
    wisdom: 12,
    charisma: 13
  }
};

const result = await CharacterUtils.createCharacter(params);
if (result.success) {
  console.log('Character created:', result.data.name);
}
```

## Package Structure

```
@hollow-gear/core/
└── src/
    └── model/                    # Character model system
        ├── types/               # Core types and utilities
        ├── base/                # Base D&D 5e mechanics
        ├── species/             # Etherborne species system
        ├── classes/             # Hollow Gear class system
        ├── equipment/           # Equipment and modifications
        ├── psionics/            # Mindcraft psionic system
        ├── spellcasting/        # Magic systems
        ├── mechanics/           # Hollow Gear mechanics
        ├── progression/         # Character advancement
        ├── character.ts         # Main character interface
        ├── character-utils.ts   # Character utilities
        ├── serialization.ts     # Data serialization
        └── index.ts            # Main exports
```

## Module Organization

- **Core Types**: Basic utility types and validation systems
- **Base Mechanics**: Core D&D 5e character mechanics (abilities, combat, skills)
- **Species System**: Etherborne species traits and abilities
- **Class System**: Hollow Gear classes, features, and progression
- **Equipment System**: Weapons, armor, modifications, and inventory
- **Psionic System**: Mindcraft disciplines and powers
- **Spellcasting System**: Arcanist and Templar magic systems
- **Hollow Gear Mechanics**: Heat stress, currency, and maintenance
- **Character Progression**: Experience, advancement, and multiclassing

## License

MIT