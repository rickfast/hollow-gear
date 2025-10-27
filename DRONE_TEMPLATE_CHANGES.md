# Drone Template System Update

## Summary

Updated the drone creation flow to properly support drone templates. The system now uses template IDs directly instead of relying on drone types, making it easier to add new templates and providing better flexibility for future enhancements.

## Changes Made

### 1. Component Updates

#### `src/components/drone-type-selector.tsx`

- **Renamed**: Component now selects templates instead of types
- **Props Changed**:
    - `selectedType: DroneType | ""` → `selectedTemplateId: string`
    - `onTypeChange: (type: DroneType) => void` → `onTemplateChange: (templateId: string) => void`
- **UI Enhancement**: Added type badge to show the drone type alongside template name
- **Behavior**: Now selects templates by ID instead of by type

### 2. Page Updates

#### `src/pages/drone-builder-page.tsx`

- **State Management**: Changed from `droneType` state to `templateId` state
- **Step Label**: Updated "Type" step to "Template" for clarity
- **Validation**: Updated validation to check `templateId` instead of `droneType`
- **Template Selection**: Now uses `DRONE_TEMPLATES_BY_ID[templateId]` directly
- **Builder Integration**: Uses `builder.setTemplateId(templateId)` instead of `builder.setType(droneType)`
- **Review Display**: Shows both template name and type in the review step

### 3. Model Updates

#### `src/model/drone-builder.ts`

- **No Changes Required**: Already supported both `setType()` and `setTemplateId()` methods
- `setType()` is kept as a convenience method that finds the first template matching the type
- `setTemplateId()` is the primary method for template selection

### 4. Documentation

#### `docs/implementation-notes/drone-templates.md` (NEW)

Comprehensive documentation covering:

- Template structure and available templates
- How to use templates in code
- UI component usage
- Template evolution with levels
- Archetype system
- Best practices for adding new templates

## Benefits

1. **Flexibility**: Easy to add new drone templates without changing code structure
2. **Clarity**: Template selection is more explicit and easier to understand
3. **Extensibility**: Future templates can have unique characteristics beyond just type
4. **Type Safety**: Template IDs are validated at build time
5. **Better UX**: Users see all available templates with full details

## Backward Compatibility

- The `DroneBuilder.setType()` method is still available for convenience
- Existing drones with `templateId` field work without changes
- All tests pass without modification

## Testing

All relevant tests pass:

- ✅ `src/model/drone-builder.test.ts` (28 tests)
- ✅ `src/pages/drone-builder-character-association.test.ts` (4 tests)
- ✅ Build succeeds with no TypeScript errors

## Future Enhancements

With this template system in place, it's now easy to:

1. Add new drone templates by simply adding entries to `DRONE_TEMPLATES` array
2. Create specialized templates with unique stat combinations
3. Implement template variants (e.g., "Heavy Combat Drone", "Light Combat Drone")
4. Add template-specific features and abilities
5. Support custom/homebrew templates

## Files Modified

- `src/components/drone-type-selector.tsx`
- `src/pages/drone-builder-page.tsx`

## Files Added

- `docs/implementation-notes/drone-templates.md`
- `DRONE_TEMPLATE_CHANGES.md` (this file)

## Migration Notes

No migration needed for existing data. The system already used `templateId` internally, so this update only affects the UI and how templates are selected during creation.
