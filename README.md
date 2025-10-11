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

## Docker Deployment

### Quick Start with Make

```bash
# Show all commands
make help

# Build and run
make build
make run
```

### Or with Docker Compose

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

The application will be available at [http://localhost:8080](http://localhost:8080)

### Using Docker CLI

```bash
# Build
docker build -t hollow-gear-5e .

# Run
docker run -d -p 8080:80 --name hollow-gear-5e hollow-gear-5e
```

**Image Details:**

- Ultra-lightweight (~15-20 MB)
- Multi-stage build with Bun + nginx:alpine
- Includes health checks and optimized nginx config
- Production-ready static file serving

For detailed Docker documentation, see [docs/DOCKER.md](docs/DOCKER.md)

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
