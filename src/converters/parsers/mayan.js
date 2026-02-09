import { mayanSymbols } from '../mayan';

const symbolToValue = {};
mayanSymbols.forEach((sym, i) => {
  symbolToValue[sym] = i;
});

export function parseMayan(symbols) {
  // symbols is an array from top (most significant) to bottom (least significant)
  if (!symbols || symbols.length === 0) return { value: null, error: 'Add Mayan numeral symbols' };

  let total = 0;
  for (let i = 0; i < symbols.length; i++) {
    const sym = symbols[i];
    if (!(sym in symbolToValue)) {
      return { value: null, error: `Unknown symbol at position ${i}` };
    }
    const position = symbols.length - 1 - i;
    total += symbolToValue[sym] * Math.pow(20, position);
  }

  if (total > 7999999) return { value: null, error: 'Result out of range (0–7,999,999)' };
  return { value: total, error: null };
}

export { symbolToValue };
