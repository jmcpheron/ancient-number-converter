# Ancient Number Converter

[![CI/CD](https://github.com/jmcpheron/ancient-number-converter/actions/workflows/deploy.yml/badge.svg)](https://github.com/jmcpheron/ancient-number-converter/actions/workflows/deploy.yml)
[![Tests](https://img.shields.io/badge/tests-185%20passed-brightgreen)](https://github.com/jmcpheron/ancient-number-converter/actions)
[![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev)

Convert modern numbers into seven ancient numeral systems and back again. Explore how different civilizations represented quantities, with step-by-step breakdowns showing the math behind each conversion.

**[Live Demo](https://jmcpheron.github.io/ancient-number-converter)**

## Number Systems

![Egyptian](https://img.shields.io/badge/%F0%93%86%BC%F0%93%8D%A2%F0%93%8F%BA-Egyptian_Hieroglyphic-E8A435?style=for-the-badge)
![Babylonian](https://img.shields.io/badge/%F0%92%81%B9%F0%92%8C%8B-Babylonian_Cuneiform-C4813D?style=for-the-badge)
![Mayan](https://img.shields.io/badge/%E2%80%A2%E2%80%A2%E2%89%A1-Mayan_Vigesimal-2D6A4F?style=for-the-badge)
![Roman](https://img.shields.io/badge/XLII-Roman_Numerals-8B0000?style=for-the-badge)
![Chinese Rod](https://img.shields.io/badge/%F0%9D%8D%A0%F0%9D%8D%AC-Chinese_Rod-C41E3A?style=for-the-badge)
![Greek Attic](https://img.shields.io/badge/%CE%94%CE%94%CE%A0%CE%99%CE%99-Greek_Attic-1E6091?style=for-the-badge)
![Quipu](https://img.shields.io/badge/%E2%97%8F%E2%97%8E%E2%88%9E-Quipu_(Inca)-C4620A?style=for-the-badge)

| System | Range | Example |
|--------|-------|---------|
| Egyptian Hieroglyphic | 1 – 9,999,999 | 𓆼𓍢𓏺 |
| Babylonian Cuneiform | 1 – 12,959,999 | 𒁹𒌋 |
| Mayan | 0 – 7,999,999 | dots & bars |
| Roman Numerals | 1 – 3,999 | XLII |
| Chinese Rod Numerals | 1 – 99,999 | 𝍬𝍡 |
| Greek Attic | 1 – 99,999 | ΔΔΔΔΠΙΙ |
| Quipu (Inca) | 1 – 99,999 | knotted cords |

## Features

- **Converter** — Enter a decimal number, see it in any of the seven systems
- **Reverse Conversion** — Type ancient numerals and get the decimal value
- **Comparison View** — See a number in all seven systems side-by-side
- **Step Breakdown** — Expandable explanation of each conversion step
- **Quiz Mode** — Timed or untimed quizzes across all systems
- **History Panel** — Track your recent conversions per system

## Tech Stack

- **Vite 7** — vanilla JS, no framework
- **Tailwind CSS 3** — utility-first styling
- **Vitest** — 185 unit tests covering all converters and parsers
- **GitHub Actions** — CI/CD with auto-deploy to GitHub Pages

## Getting Started

```bash
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm test           # run tests (185 tests)
npm run build      # production build → dist/
```

## Deployment

Pushing to `main` automatically runs tests and deploys to GitHub Pages via GitHub Actions. Pull requests run tests only — no deploy until merged.

The workflow lives in `.github/workflows/deploy.yml`.

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
