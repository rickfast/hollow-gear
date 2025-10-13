# React Router Implementation

## Overview

The application now uses React Router for client-side routing, providing a better user experience with proper URLs and browser navigation.

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | CharactersPage | Character list (home page) |
| `/characters/:id` | CharacterSheetPage | Individual character sheet |
| `/builder` | CharacterBuilderPage | Character builder (placeholder) |
| `/rules` | RulesPage | Rules reference (placeholder) |

## File Structure

```
src/
├── App.tsx                          # Router setup and navigation
├── pages/
│   ├── characters-page.tsx          # Character list page
│   ├── character-sheet-page.tsx     # Character sheet page
│   ├── character-builder-page.tsx   # Builder placeholder
│   └── rules-page.tsx               # Rules placeholder
└── components/
    ├── character-list.tsx           # Character list component
    └── character-sheet.tsx          # Character sheet component
```

## Navigation

### Navbar Links

The navbar includes three main navigation items:
- **Characters** → `/` (home)
- **Build Character** → `/builder`
- **Rules** → `/rules`

### Active State

- Current route is highlighted in the navbar
- Uses `location.pathname` to determine active state
- Active links show in primary color

### Back Navigation

- Character sheet pages show "← Back to Characters" link
- Detected by checking if path starts with `/characters/`
- Links back to home page (`/`)

## Implementation Details

### BrowserRouter

```typescript
<BrowserRouter>
    <CharacterViewModelProvider>
        <AppContent />
    </CharacterViewModelProvider>
</BrowserRouter>
```

- Wraps the entire app
- Provides routing context
- Enables browser history navigation

### Routes Configuration

```typescript
<Routes>
    <Route path="/" element={<CharactersPage />} />
    <Route path="/characters/:id" element={<CharacterSheetPage />} />
    <Route path="/builder" element={<CharacterBuilderPage />} />
    <Route path="/rules" element={<RulesPage />} />
</Routes>
```

### Dynamic Route Parameters

Character sheet uses URL parameter:
```typescript
const { id } = useParams<{ id: string }>();
```

### Programmatic Navigation

Character list navigates on selection:
```typescript
const navigate = useNavigate();
const handleSelectCharacter = (id: string) => {
    navigate(`/characters/${id}`);
};
```

## Benefits

1. **Bookmarkable URLs**: Users can bookmark specific characters
2. **Browser Navigation**: Back/forward buttons work correctly
3. **Shareable Links**: Can share direct links to characters
4. **Better UX**: Proper page transitions and history
5. **SEO Ready**: URLs are meaningful and crawlable

## Mobile Support

- Mobile menu includes all navigation items
- Uses same RouterLink components
- Closes menu on navigation
- Responsive design maintained

## Future Enhancements

Potential additions:
1. **404 Page**: Handle unknown routes
2. **Loading States**: Show loading during navigation
3. **Route Guards**: Protect certain routes
4. **Nested Routes**: Sub-routes for character sections
5. **Query Parameters**: Filter/search in character list
6. **Scroll Restoration**: Remember scroll position
7. **Route Transitions**: Animated page transitions

## Testing

To test routing:
1. Navigate to `/` - see character list
2. Click a character - URL changes to `/characters/:id`
3. Click "Back to Characters" - returns to `/`
4. Click "Build Character" - navigates to `/builder`
5. Click "Rules" - navigates to `/rules`
6. Use browser back/forward - navigation works correctly

## Dependencies

- `react-router-dom@7.9.4` - Routing library
- Compatible with React 19
- No additional configuration needed
