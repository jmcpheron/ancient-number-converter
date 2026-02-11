/**
 * Curated showcase examples per number system.
 * Each example highlights a specific mathematical property or teaching moment.
 */
const showcaseExamples = {
  mayan: [
    { number: 0, highlight: 'One of the earliest explicit zero symbols in history', concept: 'zero' },
    { number: 19, highlight: 'Largest single-position value — four dots over three bars', concept: 'max-digit' },
    { number: 20, highlight: 'Base-20 rollover — zero in the ones, one in the twenties', concept: 'base-rollover' },
    { number: 399, highlight: 'Largest two-position number (19×20 + 19)', concept: 'position-max' },
    { number: 400, highlight: 'Third position opens — 1×20² shows powers of twenty', concept: 'higher-position' },
    { number: 7999, highlight: 'Three full positions, each showing 19', concept: 'full-positions' },
  ],
  egyptian: [
    { number: 1, highlight: 'A single stroke — the simplest hieroglyphic numeral', concept: 'unit' },
    { number: 9, highlight: 'Nine strokes: the maximum repetition before a new symbol', concept: 'repetition-limit' },
    { number: 10, highlight: 'The heel bone glyph replaces ten strokes', concept: 'symbol-transition' },
    { number: 111, highlight: 'One of each: rope coil + heel bone + stroke', concept: 'additive' },
    { number: 5555, highlight: 'Five of each symbol through the thousands — pure addition', concept: 'full-additive' },
    { number: 1234567, highlight: 'All seven hieroglyphs used — from stroke to kneeling god Heh', concept: 'full-symbol-set' },
  ],
  babylonian: [
    { number: 1, highlight: 'A single unit wedge — the foundation of cuneiform math', concept: 'unit' },
    { number: 59, highlight: 'Largest single-position value — five ten-wedges plus nine units', concept: 'max-digit' },
    { number: 60, highlight: 'Base-60 rollover — one group of 60, zero in the ones', concept: 'base-rollover' },
    { number: 61, highlight: 'Two positions: 1×60 + 1 — distinguishing 61 from 2', concept: 'positional' },
    { number: 3600, highlight: 'Third position: 1×60² — reaching into the thousands', concept: 'higher-position' },
    { number: 3661, highlight: 'All three positions active: 1×3600 + 1×60 + 1', concept: 'full-positions' },
  ],
  roman: [
    { number: 4, highlight: 'IV — the first subtractive pair (5 minus 1)', concept: 'subtraction' },
    { number: 9, highlight: 'IX — subtractive pair at the ones place', concept: 'subtraction' },
    { number: 49, highlight: 'XLIX — compound subtraction at two levels', concept: 'compound-subtraction' },
    { number: 400, highlight: 'CD — subtractive pair in the hundreds', concept: 'subtraction-hundreds' },
    { number: 900, highlight: 'CM — the largest subtractive pair', concept: 'max-subtraction' },
    { number: 1994, highlight: 'MCMXCIV — uses three subtractive pairs in one number', concept: 'all-subtractive' },
    { number: 3999, highlight: 'MMMCMXCIX — the maximum representable Roman numeral', concept: 'system-max' },
  ],
  chineseRod: [
    { number: 5, highlight: 'A single horizontal bar — vertical orientation for ones place', concept: 'orientation' },
    { number: 50, highlight: 'Horizontal orientation for tens place — showing alternation', concept: 'alternation' },
    { number: 505, highlight: 'Zero placeholder between matching digits', concept: 'zero-placeholder' },
    { number: 6789, highlight: 'Alternating vertical-horizontal-vertical-horizontal across four places', concept: 'full-alternation' },
    { number: 12345, highlight: 'All five positions active — full decimal positional display', concept: 'five-positions' },
  ],
  greekAttic: [
    { number: 1, highlight: 'A single vertical stroke (Ι) — the simplest glyph', concept: 'unit' },
    { number: 5, highlight: 'Pi (Π) for pente — the acrophonic principle: first letter of the word', concept: 'acrophonic' },
    { number: 10, highlight: 'Delta (Δ) for deka — each power of ten gets its own letter', concept: 'powers' },
    { number: 50, highlight: 'The five-ligature 𐅄 — combining "five" with "ten"', concept: 'ligature' },
    { number: 500, highlight: 'The five-ligature 𐅅 — five times hekaton', concept: 'ligature-hundreds' },
    { number: 5000, highlight: 'The five-ligature 𐅆 — five times khilioi', concept: 'ligature-thousands' },
    { number: 50000, highlight: 'The five-ligature 𐅇 — the largest standard Attic numeral', concept: 'ligature-max' },
  ],
  quipu: [
    { number: 1, highlight: 'Figure-eight knot (∞) — the only knot type used for "one" in the ones place', concept: 'figure-eight' },
    { number: 5, highlight: 'Five-turn long knot in the ones place — long knots encode 2–9', concept: 'long-knot' },
    { number: 10, highlight: 'One simple knot in the tens place — higher places use a different knot type', concept: 'simple-knot' },
    { number: 100, highlight: 'Zero gap in the tens, one knot in hundreds — absence means zero', concept: 'zero-gap' },
    { number: 305, highlight: 'Zeros between non-zero positions — physical gaps on the cord carry meaning', concept: 'zero-placeholder' },
    { number: 12345, highlight: 'All five positions occupied — a full positional decimal on a single cord', concept: 'full-positions' },
  ],
};

export default showcaseExamples;
