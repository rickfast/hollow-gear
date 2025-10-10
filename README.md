# Hollow Gear 5E

A steampunk & psionics character management system for D&D 5E, built with React, TypeScript, Vite, and HeroUI.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **HeroUI** - Component library
- **Tailwind CSS** - Styling
- **Bun** - JavaScript runtime and package manager

## Getting Started

### Install Dependencies

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

## Project Structure

```
src/
├── data/          # Static game data (species, classes, equipment, etc.)
├── types/         # TypeScript type definitions
├── api/           # API interfaces
├── App.tsx        # Main React component
├── main.tsx       # Application entry point
└── index.css      # Global styles
```

## Game System

Hollow Gear features:

- **7 Etherborne Species**: Aqualoth, Vulmir, Rendai, Karnathi, Tharn, Skellin, Avenar
- **7 Classes**: Arcanist, Templar, Tweaker, Shadehand, Vanguard, Artifex, Mindweaver
- **Equipment System**: Weapons, armor, shields, and modifications
- **Psionic Powers**: Mindcraft abilities across 6 disciplines
- **Spell Systems**: Arcanist Formulae and Templar Miracles

## Code Formatting

Format all files:

```bash
bun run format
```

Check formatting:

```bash
bun run format:check
```
