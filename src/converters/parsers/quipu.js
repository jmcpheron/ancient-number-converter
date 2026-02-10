import { quipuSymbols } from '../quipu';

const { simpleKnot, longKnot, figureEight, zero } = quipuSymbols;

// Build lookup from symbol string to digit value
const symbolToDigit = {};
symbolToDigit[zero] = 0;
symbolToDigit[figureEight] = 1;
for (let d = 2; d <= 9; d++) {
  symbolToDigit[longKnot.repeat(d)] = d;
}
for (let d = 1; d <= 9; d++) {
  symbolToDigit[simpleKnot.repeat(d)] = d;
}

export function parseQuipu(symbols) {
  // symbols is an array from top (most significant) to bottom (least significant)
  // each element is a compound string representing one position level
  if (!symbols || symbols.length === 0) return { value: null, error: 'Add Quipu knot symbols' };

  const positions = symbols.length;
  let total = 0;

  for (let i = 0; i < positions; i++) {
    const sym = symbols[i];
    const pos = positions - 1 - i; // 0 = ones place

    if (!(sym in symbolToDigit)) {
      return { value: null, error: `Unknown symbol at position ${i}` };
    }

    const digit = symbolToDigit[sym];

    // Validate knot types for position
    if (pos === 0 && digit === 1 && sym !== figureEight) {
      return { value: null, error: 'Ones place value of 1 must use figure-eight knot (∞), not simple knot' };
    }
    if (pos === 0 && digit >= 2 && sym[0] !== longKnot) {
      return { value: null, error: 'Ones place values 2–9 must use long knots (◎)' };
    }
    if (pos > 0 && digit >= 1 && sym[0] !== simpleKnot) {
      return { value: null, error: 'Higher places must use simple knots (●)' };
    }

    total += digit * Math.pow(10, pos);
  }

  if (total < 1 || total > 99999) {
    return { value: null, error: 'Result out of range (1–99,999)' };
  }

  return { value: total, error: null };
}

export { symbolToDigit };
