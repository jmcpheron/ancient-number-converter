# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Vite dev server with HMR
npm run build        # Production build to dist/
npm test             # Run all tests (vitest run)
npm run test:watch   # Run tests in watch mode
npx vitest run src/converters/__tests__/converters.test.js  # Single test file
```

CI runs `npm test` on PRs to `main`. Pushing to `main` triggers test + auto-deploy to GitHub Pages.

## Architecture

**No framework.** Vanilla JS with template-literal components returning HTML strings. No virtual DOM, no JSX.

### Core patterns

- **Registry-driven UI**: `src/data/numberSystems.js` is the central registry. Every system entry has `id`, `convert`, `symbols`, `range`, `color`, `renderMode`, etc. All UI components read from this registry — adding a new number system requires zero UI changes.

- **Converters** (`src/converters/{name}.js`): Pure functions `convertTo{Name}(num)` → `{ result: string[], steps: {value, symbol, explanation}[] }`. The `result` is always an array. `'Invalid input'` as `result[0]` is the sentinel for out-of-range.

- **Parsers** (`src/converters/parsers/{name}.js`): Pure functions `parse{Name}(input)` → `{ value: number|null, error: string|null }`. Input type varies: `'text'` (Roman, Greek Attic), `'symbols'` (Egyptian, Mayan, Chinese Rod, Quipu), `'groups'` (Babylonian nested arrays).

- **Reactive store** (`src/store.js`): ~30-line get/set/subscribe with previous-state diffing. State keys: `number`, `activeTab`, `showCompare`, `reverseMode`, `showQuiz`, `showShowcase`.

- **Event delegation**: Four listeners on `#root` (`click`, `input`, `change`, `keydown`). Elements use `data-action`, `data-tab`, `data-panel`, `data-arrow`, `data-label` attributes.

- **Scoped rendering**: Structural changes (tab switch, mode switch) → `renderMainArea()`. Number-only changes → `updateDisplay()` (just refreshes conversion display + steps, no re-render of tabs/input).

- **Toggle panels**: Steps, Legend, History use `data-panel`/`data-arrow`/`data-label` attrs + `.hidden` class toggle — no store state needed. Handled by `togglePanel(name)` in `app.js`.

### Adding a new number system

1. Create converter at `src/converters/{name}.js` exporting `convertTo{Name}(num)` → `{ result, steps }`
2. Create parser at `src/converters/parsers/{name}.js` exporting `parse{Name}(input)` → `{ value, error }`
3. Add entry to registry in `src/data/numberSystems.js`
4. Add tests in `src/converters/__tests__/`
5. No UI changes needed — registry drives tabs, display, reverse input, quiz, comparison

### Multi-page app

Two entry points: `index.html` (main converter) and `volume.html` (Mayan volume control). Both configured in `vite.config.js` `rollupOptions.input`. Volume page code lives in `src/volume/`.

## Key gotchas

- **QuizView lifecycle**: `initQuiz(rerenderFn)` must be called BEFORE `renderQuizView()` so the question exists when HTML is generated. Call `cleanupQuiz()` when leaving quiz mode to stop the timer interval.
- **`__BUILD_DATE__`**: Vite-defined global replaced at build time. Use it bare in template literals — do not import it.
- **Mayan/Quipu result arrays** are bottom-to-top; parsers expect top-to-bottom, so reverse before parsing.
- **macOS FS**: Renaming files with only case changes (e.g. `App.js` → `app.js`) requires delete + create on case-insensitive HFS+.
- **CJS configs**: `tailwind.config.cjs` and `postcss.config.cjs` need `.cjs` extension because `"type": "module"` in package.json.

## Style

- Tailwind 3 with custom color tokens per system: `jungle` (Mayan), `amber` (Egyptian), `clay` (Babylonian), `imperial` (Roman), `vermilion` (Chinese Rod), `mediterranean` (Greek Attic), `inca` (Quipu), `parchment` (background).
- Custom fonts: `font-cinzel` (Cinzel) for headings, `font-crimson` (Crimson Text) for body.
- GitHub Pages deployment with `base: '/ancient-number-converter/'` in vite.config.js.
