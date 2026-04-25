# Flag Guesser — Codebase Standards

## Folder structure

```
src/
├── assets/
├── components/       # Reusable UI (FlagCard, OptionButton, …)
├── constants/        # App-wide constants; one file per domain (game.ts, …)
├── data/             # Static JSON (countries.json)
├── hooks/            # Custom hooks (useGame.ts)
├── pages/            # Route-level components (GameScreen, GameOverScreen)
├── stats/            # Stat persistence — types.ts, storage.ts, rankings.ts
├── types/            # Shared TS interfaces — country.ts, game.ts
├── utils/            # Pure helpers — shuffle.ts, options.ts
├── AppShell/
├── index.css
└── main.tsx
```

Each folder (types/, stats/, utils/, constants/) has an `index.ts` that re-exports everything — consumers always import from the folder root (`@/types`, `@/stats`, etc.), never from individual files inside.

## Styling

**CSS Modules only.** All visual styles live in `.module.css` files colocated with their component. No inline `style={{}}` objects in JSX, with one exception: dynamic CSS custom properties (e.g. `{ '--ans-delay': `${delay}s` } as CSSProperties`) are acceptable when a value must be driven by JS at runtime.

**Theme tokens** are CSS custom properties defined in `src/index.css` under `:root {}`. Components reference them via `var(--color-accent)` etc. in their CSS module — never by hardcoded hex values.

**Fonts** are CSS custom properties: `--font-heading` (Nunito) and `--font-mono` (DM Mono). Use `font-family: var(--font-mono)` in CSS; do not import font strings into JS.

**Hover/focus/active states** use CSS pseudo-selectors (`:hover`, `:focus-visible`, `:active`) — never `onMouseEnter`/`onMouseLeave` event handlers.

**Conditional classes** use the template literal pattern:
```tsx
className={`${styles.base}${condition ? ` ${styles.modifier}` : ''}`}
```

## Imports

**Absolute `@/*`** for any cross-directory import (`@/types`, `@/hooks/useGame`, `@/stats`).  
**Relative `./`** only for co-located files in the same folder (CSS modules, sibling files within a folder).

## Types

Shared interfaces and types live in `src/types/`. Add to `country.ts` for country-shaped data, `game.ts` for game-state types. Hooks do not export types — if a hook's return type contains a public interface, move it to `src/types/`.

## TypeScript

Strict mode is on (`strict: true`, `noUncheckedIndexedAccess: true`). No `any`. Intentional non-null assertions (`!`) are acceptable when the invariant is locally obvious and a comment would be noise.

## Component structure

```tsx
// 1. Imports (types first, then modules, then local)
// 2. Props interface
// 3. Pure helper functions (if any)
// 4. export default function ComponentName
```

No comments unless the WHY is non-obvious. No JSDoc.

## What not to add

- CI/CD config, test setup, Storybook — out of scope for this project
- Dark mode — removed, do not reintroduce
- Inline style objects — blocked by rule above
- Font or color constants in JS — they live in CSS
