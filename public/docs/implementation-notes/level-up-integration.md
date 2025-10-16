# Level-Up Integration Guide

## Overview

This document describes how to integrate the ClassLevelConfigurator component into a level-up UI workflow. The class configuration system is designed to be reusable for both character creation and level-up scenarios.

## Architecture

The level-up flow uses the same components and services as character creation:

- **ClassLevelConfigurator**: Container component that orchestrates configuration UI
- **ClassConfigurationService**: Business logic for fetching options and validating choices
- **MutableCharacterViewModel.levelUp()**: Accepts ClassConfiguration in options

## Integration Steps

### 1. Create Level-Up UI Component

Create a component that presents the level-up interface to the user:

```typescript
import { ClassLevelConfigurator } from "@/components/class-level-configurator";
import { MutableCharacterViewModel } from "@/model/mutable-character-view-model";
import type { ClassConfiguration } from "@/types";

interface LevelUpPageProps {
    characterId: string;
}

export function LevelUpPage({ characterId }: LevelUpPageProps) {
    const character = useCharacter(characterId);
    const [configuration, setConfiguration] = useState<Partial<ClassConfiguration>>();
    const [isValid, setIsValid] = useState(false);
    
    const currentClass = character.classes[0]?.class;
    const currentLevel = character.level;
    const newLevel = currentLevel + 1;
    
    const handleLevelUp = () => {
        if (!isValid || !configuration) return;
        
        const mutableVM = new MutableCharacterViewModel(character);
        const updatedCharacter = mutableVM.levelUp({
            classConfiguration: configuration as ClassConfiguration,
            // Other options like hitPointRoll, abilityScoreImprovement
        });
        
        // Save updated character
        updateCharacter(characterId, updatedCharacter);
    };
    
    return (
        <div>
            <h1>Level Up to {newLevel}</h1>
            
            <ClassLevelConfigurator
                classType={currentClass}
                level={newLevel}
                existingConfig={character.classConfigurations?.find(c => c.level === newLevel)}
                onConfigurationChange={setConfiguration}
                onValidationChange={setIsValid}
            />
            
            <Button 
                onClick={handleLevelUp} 
                disabled={!isValid}
            >
                Complete Level Up
            </Button>
        </div>
    );
}
```

### 2. Fetch Existing Configurations

When presenting the configurator, pass any existing configurations for context:

```typescript
const existingConfigs = character.classConfigurations || [];
const previousConfig = existingConfigs[existingConfigs.length - 1];

<ClassLevelConfigurator
    classType={currentClass}
    level={newLevel}
    existingConfig={previousConfig}
    onConfigurationChange={setConfiguration}
    onValidationChange={setIsValid}
/>
```

### 3. Handle Configuration Changes

The ClassLevelConfigurator emits partial configurations as the user makes selections:

```typescript
const handleConfigurationChange = (config: Partial<ClassConfiguration>) => {
    setConfiguration(config);
    
    // Optionally save draft configuration
    saveDraftConfiguration(characterId, config);
};
```

### 4. Validate Before Level-Up

The configurator emits validation status. Only allow level-up when valid:

```typescript
const [isValid, setIsValid] = useState(false);

<ClassLevelConfigurator
    onValidationChange={setIsValid}
    // ... other props
/>

<Button disabled={!isValid} onClick={handleLevelUp}>
    Complete Level Up
</Button>
```

### 5. Apply Level-Up with Configuration

Pass the configuration to the levelUp method:

```typescript
const mutableVM = new MutableCharacterViewModel(character);

const updatedCharacter = mutableVM.levelUp({
    classConfiguration: configuration as ClassConfiguration,
    hitPointRoll: rollHitDie(), // Optional: let user roll
    abilityScoreImprovement: newLevel % 4 === 0 ? {
        ability1: "strength",
        ability2: "constitution"
    } : undefined,
});

updateCharacter(characterId, updatedCharacter);
```

## Level-Specific Configuration

Different levels require different configurations:

### Level 1 (Character Creation)
- Subclass selection (for some classes)
- Initial feature choices
- Spell selection
- Proficiency selection

### Level 2
- Additional spells (for spellcasters)
- Class features (no choices typically)

### Level 3
- Subclass selection (for most classes)
- Subclass-specific features
- Additional spells

### Level 4, 8, 12, 16, 19
- Ability Score Improvement or Feat
- Additional spells
- Class features

### Other Levels
- Additional spells
- Class features
- Subclass features

## ClassLevelConfigurator Props

```typescript
interface ClassLevelConfiguratorProps {
    /** The class being configured */
    classType: ClassType;
    
    /** The level being configured (new level, not current) */
    level: number;
    
    /** Existing configuration for this level (if editing) */
    existingConfig?: ClassConfiguration;
    
    /** Callback when configuration changes */
    onConfigurationChange: (config: Partial<ClassConfiguration>) => void;
    
    /** Callback when validation status changes */
    onValidationChange: (valid: boolean) => void;
}
```

## Configuration Object Structure

```typescript
interface ClassConfiguration {
    classType: ClassType;
    level: number;
    subclass?: SubclassType;
    featureChoices: Record<string, string | string[]>;
    spellsSelected?: string[];
    proficienciesSelected?: string[];
}
```

### Example Configurations

**Arcanist Level 1:**
```typescript
{
    classType: "Arcanist",
    level: 1,
    featureChoices: {
        "Arcane Focus": "steamstaff"
    },
    spellsSelected: [
        "mage-hand", "prestidigitation", "ray-of-frost", // Cantrips
        "detect-magic", "identify", "mage-armor", 
        "magic-missile", "shield", "thunderwave" // 1st level
    ]
}
```

**Arcanist Level 3 (Aethermancer):**
```typescript
{
    classType: "Arcanist",
    level: 3,
    subclass: "Aethermancer",
    featureChoices: {
        "Psionic Discipline": "telekinesis"
    },
    spellsSelected: ["fireball", "lightning-bolt"]
}
```

**Mindweaver Level 1:**
```typescript
{
    classType: "Mindweaver",
    level: 1,
    subclass: "Path of Echo",
    featureChoices: {
        "Primary Ability": "intelligence"
    },
    spellsSelected: ["mind-thrust", "psychic-shield", "telepathic-bond"]
}
```

## UI Flow

### Step 1: Initiate Level-Up
User clicks "Level Up" button on character sheet

### Step 2: Show Level-Up Summary
Display:
- Current level → New level
- HP increase (with optional roll)
- New features gained
- Ability Score Improvement (if applicable)

### Step 3: Class Configuration
Present ClassLevelConfigurator for class-specific choices:
- Subclass selection (if applicable)
- Feature choices
- Spell selection
- Proficiency selection

### Step 4: Ability Score Improvement
If level 4, 8, 12, 16, or 19:
- Show ability score selector
- Allow +2 to one ability or +1 to two abilities
- Alternative: Feat selection (future enhancement)

### Step 5: Review
Show summary of all changes:
- HP increase
- New features
- New spells
- Ability score changes
- Subclass (if selected)

### Step 6: Confirm
Apply all changes and update character

## Error Handling

### Validation Errors

```typescript
try {
    const updatedCharacter = mutableVM.levelUp({
        classConfiguration: configuration
    });
} catch (error) {
    if (error instanceof ValidationError) {
        // Show user-friendly error message
        showError(`Cannot level up: ${error.message}`);
    }
}
```

### Common Validation Errors
- Missing required subclass selection
- Incorrect number of spells selected
- Invalid feature choices
- Missing proficiency selections
- Ability score exceeds maximum (20)

## Future Enhancements

### Multiclassing
When multiclassing is supported:
- Allow selecting which class to level up
- Show available classes based on ability score requirements
- Configure the selected class for the new level
- Track multiple class configurations

### Feat Selection
Alternative to Ability Score Improvement:
- Present feat options at ASI levels
- Show feat prerequisites
- Apply feat benefits

### Respec/Retraining
Allow changing previous level configurations:
- Load existing configuration for a level
- Allow modifications
- Recalculate derived values
- Validate changes don't break character

### Configuration Presets
Provide recommended builds:
- "Damage Dealer" preset
- "Support" preset
- "Tank" preset
- Apply preset configurations automatically

## Testing Level-Up

### Manual Testing Steps

1. Create a level 1 character
2. Navigate to level-up UI
3. Verify ClassLevelConfigurator shows level 2 options
4. Make required selections
5. Verify validation prevents incomplete configuration
6. Complete level-up
7. Verify character is now level 2
8. Verify new features/spells are applied
9. Repeat for level 3 (subclass selection)
10. Repeat for level 4 (ASI)

### Test Cases

**Test Arcanist Level-Up:**
- Level 1 → 2: Add 2 new spells
- Level 2 → 3: Select subclass, add discipline choice
- Level 3 → 4: ASI, add 2 new spells

**Test Mindweaver Level-Up:**
- Level 1 → 2: Add psionic powers
- Level 2 → 3: Add more powers
- Level 3 → 4: ASI, add powers

**Test Non-Spellcaster Level-Up:**
- Verify no spell selection UI
- Verify class features are applied
- Verify subclass selection at level 3

## Integration Checklist

- [ ] Create level-up page/modal component
- [ ] Import ClassLevelConfigurator
- [ ] Fetch character data
- [ ] Calculate new level
- [ ] Pass correct props to configurator
- [ ] Handle configuration changes
- [ ] Handle validation status
- [ ] Implement HP roll (optional)
- [ ] Implement ASI selection (if applicable)
- [ ] Show level-up summary
- [ ] Call mutableVM.levelUp() with configuration
- [ ] Save updated character
- [ ] Show success message
- [ ] Navigate to character sheet
- [ ] Add error handling
- [ ] Add loading states
- [ ] Test with all classes
- [ ] Test at different levels

## Code Examples

### Complete Level-Up Component

```typescript
import { useState } from "react";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { ClassLevelConfigurator } from "@/components/class-level-configurator";
import { MutableCharacterViewModel } from "@/model/mutable-character-view-model";
import type { Character, ClassConfiguration } from "@/types";

interface LevelUpModalProps {
    character: Character;
    onComplete: (updatedCharacter: Character) => void;
    onCancel: () => void;
}

export function LevelUpModal({ character, onComplete, onCancel }: LevelUpModalProps) {
    const [configuration, setConfiguration] = useState<Partial<ClassConfiguration>>();
    const [isValid, setIsValid] = useState(false);
    const [hitPointRoll, setHitPointRoll] = useState<number>();
    
    const currentClass = character.classes[0]!;
    const newLevel = character.level + 1;
    
    const handleLevelUp = () => {
        if (!isValid || !configuration) return;
        
        try {
            const mutableVM = new MutableCharacterViewModel(character);
            const updatedCharacter = mutableVM.levelUp({
                classConfiguration: configuration as ClassConfiguration,
                hitPointRoll,
            });
            
            onComplete(updatedCharacter);
        } catch (error) {
            console.error("Level up failed:", error);
            alert(`Failed to level up: ${error.message}`);
        }
    };
    
    return (
        <Card className="max-w-4xl mx-auto">
            <CardHeader>
                <h2>Level Up: {character.name}</h2>
                <p>Level {character.level} → {newLevel}</p>
            </CardHeader>
            
            <CardBody className="space-y-6">
                {/* HP Roll Section */}
                <div>
                    <h3>Hit Points</h3>
                    <p>Roll your hit die or take the average</p>
                    {/* HP roll UI */}
                </div>
                
                {/* Class Configuration */}
                <div>
                    <h3>Class Configuration</h3>
                    <ClassLevelConfigurator
                        classType={currentClass.class}
                        level={newLevel}
                        onConfigurationChange={setConfiguration}
                        onValidationChange={setIsValid}
                    />
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 justify-end">
                    <Button variant="flat" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button 
                        color="primary" 
                        onClick={handleLevelUp}
                        disabled={!isValid}
                    >
                        Complete Level Up
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
```

## Summary

The ClassLevelConfigurator component is fully reusable for level-up scenarios. The main integration points are:

1. Pass the new level (not current level) to the configurator
2. Capture configuration and validation state
3. Pass configuration to `mutableVM.levelUp()`
4. Handle errors and update character

The system is designed to be flexible and extensible, supporting future enhancements like multiclassing, feats, and respec functionality.
