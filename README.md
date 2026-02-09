# Ancient Number Converter

Convert modern numbers into six ancient numeral systems and back again. Explore how different civilizations represented quantities, with step-by-step breakdowns showing the math behind each conversion.

**[Live Demo](https://jmcpheron.github.io/ancient-number-converter)**

## Number Systems

| System | Range | Example |
|--------|-------|---------|
| Egyptian Hieroglyphic | 0 – 9,999,999 | 𓆼𓂭𓏲 |
| Babylonian Cuneiform | 1 – 12,959,999 | 𒐕𒐏 |
| Mayan | 0 – 12,799,999 | dots & bars |
| Roman Numerals | 1 – 3,999 | XLII |
| Chinese Rod Numerals | 0 – 99,999 | 𝍡𝍧 |
| Greek Attic | 1 – 99,999 | ΔΔΔ𐅃ΙΙ |

## Features

- **Converter** — Enter a decimal number, see it in any of the six systems
- **Reverse Conversion** — Type ancient numerals and get the decimal value
- **Comparison View** — See a number in all six systems side-by-side
- **Step Breakdown** — Expandable explanation of each conversion step
- **Quiz Mode** — Timed or untimed quizzes across all systems
- **History Panel** — Track your recent conversions per system

## Tech Stack

- **Vite 7** — vanilla JS, no framework
- **Tailwind CSS 3** — utility-first styling
- **Vitest** — 44 unit tests covering all converters and parsers
- **GitHub Pages** — automated deployment via `gh-pages`

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm test           # run tests (44 tests)
npm run build      # production build → dist/
npm run deploy     # deploy to GitHub Pages
```

## Project Structure

```
src/
├── main.js                  # entry point
├── app.js                   # orchestration & event delegation
├── store.js                 # minimal reactive store
├── components/              # UI components (template-literal functions)
├── converters/              # decimal → ancient conversion logic
│   ├── parsers/             # ancient → decimal parsing logic
│   └── __tests__/           # converter & parser tests
└── data/
    ├── numberSystems.js     # system registry (drives all UI)
    └── historicalContent.js # educational content
```
