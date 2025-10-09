# Hollow Gear TTRPG

A steampunk tabletop role-playing game based on D&D 5e mechanics, featuring Etherborne species, unique classes, and steam-powered technology. This repository contains the core game rules, character models, and companion mobile app.

## Project Structure

This is a Bun workspace containing multiple packages:

```
hollow-gear-5e/
├── packages/
│   └── core/                 # @hollow-gear/core - Character models and game mechanics
│       └── src/
│           └── model/       # Character model system
├── docs/                     # Core rulebook chapters and appendices
├── table-top/               # Generated and static game assets
└── src/                     # Mobile app source code (future)
```

## Quick Start

### Installation

```bash
bun install
```

### Development

```bash
# Run the main project
bun start

# Type check all packages
bun run typecheck

# Build all packages
bun run build

# Run tests
bun test
```

## Packages

### @hollow-gear/core

The core character models and game mechanics package. Provides TypeScript types and utilities for:

- Character creation and management
- Species traits and abilities (7 Etherborne species)
- Class systems (7 unique Hollow Gear classes)
- Equipment and modification systems
- Psionic (Mindcraft) abilities
- Spellcasting systems (Arcanist & Templar)
- Heat stress and steam mechanics
- Serialization and data migration

```typescript
import { CharacterUtils, type HollowGearCharacter } from '@hollow-gear/core';

const character = await CharacterUtils.createCharacter({
  name: "Zara Cogwright",
  species: "vulmir",
  startingClass: "arcanist",
  abilityScores: { /* ... */ }
});
```

## Game Features

- **7 Etherborne Species**: Unique anthropomorphic species with distinct abilities
- **7 Hollow Gear Classes**: Steampunk-themed classes blending magic and technology
- **Equipment Modification System**: Upgrade weapons and armor with steam-powered mods
- **Heat Stress Mechanics**: Environmental hazard system for steam-powered world
- **Dual Magic Systems**: Arcanist (Aether Formulae) and Templar (Resonance Charges)
- **Psionic System**: Mindcraft disciplines for mental powers

## Development Philosophy

- **Playtest-focused**: All features support rapid iteration and testing
- **Player-centric**: Mobile app streamlines character management
- **Asset-rich**: AI pipelines generate high-quality visual aids
- **5e Compatible**: Maintains compatibility with D&D 5e where applicable

## Technology Stack

- **Runtime**: Bun for fast JavaScript/TypeScript execution
- **Language**: TypeScript with strict type checking
- **Architecture**: Workspace-based monorepo structure
- **Mobile**: Cross-platform mobile app (planned)

## Contributing

This is a playtest version with frequent rule changes. The mobile app should work offline for game sessions, and generated assets should be print-friendly for physical play.

## License

MIT
