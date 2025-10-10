# Hollow Gear 5E Theme Implementation

## ✅ Theme Applied Successfully

The custom Hollow Gear theme has been fully implemented based on the design guidelines from `theming-instructions.md`.

## 🎨 Color Palette Implemented

### Primary Colors
- **Gear Brass** (`#C59B42`) - Primary buttons, highlights, and borders
- **Aether Blue** (`#4E8BAE`) - Secondary actions, links, and hover effects
- **Rust Red** (`#A3472A`) - Critical actions (currently used in gradients)

### Background Colors
- **Paper Gray** (`#F2EEE8`) - Main UI background
- **Steel Wash** (`#D7D9DA`) - Card and panel backgrounds
- **Iron Ink** (`#1F1F1F`) - Primary text color

### Accent Colors
- **Radiant Gold** (`#FAD55E`) - Hover glows and highlights (warning variant)
- **Verdigris Green** (`#5F9E83`) - Success states and healing effects
- **Overheat Ember** (`#D1582C`) - Danger states and damage
- **Aether Glow** (`#B9E3F9`) - Psionic energy and info states
- **Aether Silver** (`#B8BFC4`) - Dividers and subtle elements
- **Smokestack Gray** (`#8D8F8E`) - Disabled/inactive states

## 📝 Typography

### Fonts Loaded
- **Crimson Pro** - Used for all headings (H1-H6)
  - Weights: 400, 600, 700
- **Inter** - Used for body text and UI elements
  - Weights: 400, 500, 600, 700

### Usage in Components
```tsx
// Headings automatically use Crimson Pro via CSS
<h1 className="font-heading text-6xl">Hollow Gear 5E</h1>

// Body text uses Inter by default
<p className="text-iron-ink/80">Description text...</p>
```

## 🎭 HeroUI Theme Integration

### Light Theme
- Background: Paper Gray (`#F2EEE8`)
- Foreground: Iron Ink (`#1F1F1F`)
- Primary: Gear Brass with full color scale (50-900)
- Secondary: Aether Blue with full color scale
- Success: Verdigris Green
- Warning: Radiant Gold
- Danger: Overheat Ember

### Dark Theme
- Background: Iron Ink (`#1F1F1F`)
- Foreground: Paper Gray (`#F2EEE8`)
- Colors maintain the same palette with inverted scales

## 🌈 Gradient Options Available

### Pre-defined Gradient Classes
You can use these in your components:

```tsx
// Aether Gradient (Psionic FX)
className="bg-gradient-to-r from-aether-blue to-aether-glow"

// Forge Gradient (Mechanical UI)
className="bg-gradient-to-r from-rust-red via-gear-brass to-radiant-gold"

// Sanctum Gradient (Templar/Healing)
className="bg-gradient-to-r from-verdigris-green to-paper-gray"
```

## 🎯 Component Usage Examples

### Cards
```tsx
<Card className="bg-steel-wash/80 border-2 border-gear-brass/30">
```

### Buttons
```tsx
// Primary
<Button color="primary" className="bg-gear-brass text-iron-ink">

// Secondary
<Button color="secondary" className="bg-aether-blue text-paper-gray">

// Danger
<Button color="danger" className="bg-overheat-ember text-paper-gray">
```

### Progress Bars / Meters
- **Heat Points**: Use `overheat-ember` color
- **Aether Flux Points (AFP)**: Use `aether-blue` color
- **Resonance Charges (RC)**: Use `verdigris-green` color

## 📁 Files Modified

1. **tailwind.config.js** - Added custom colors and HeroUI theme configuration
2. **index.html** - Added Google Fonts (Crimson Pro & Inter)
3. **src/index.css** - Updated root styles and font families
4. **src/App.tsx** - Updated to use new theme colors and classes

## 🚀 Using Custom Colors

All custom colors are available as Tailwind classes:

```tsx
// Text colors
<p className="text-gear-brass">Brass text</p>
<p className="text-aether-blue">Blue text</p>

// Background colors
<div className="bg-paper-gray">Background</div>
<div className="bg-steel-wash">Panel background</div>

// Border colors
<div className="border-2 border-gear-brass/40">Brass border</div>

// With opacity
<div className="bg-aether-glow/20">20% opacity</div>
```

## 🎨 Design Philosophy

**Visual Tone**: Watercolor + Metallic aesthetic
**Mood**: Arcane Industrial Elegance
**Contrast**: Bright Aether blue against rusted brass and parchment neutrals
**Feel**: Aged yet luminous

The theme creates a unique steampunk aesthetic that balances:
- Warm metallic tones (Gear Brass, Radiant Gold)
- Cool psionic energy (Aether Blue, Aether Glow)
- Industrial grunge (Rust Red, Smokestack Gray)
- Readable neutrals (Paper Gray, Steel Wash, Iron Ink)
