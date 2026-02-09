import { verticalDigits, horizontalDigits } from '../chineseRod';

const verticalToValue = {};
const horizontalToValue = {};
Object.entries(verticalDigits).forEach(([val, sym]) => { if (sym) verticalToValue[sym] = Number(val); });
Object.entries(horizontalDigits).forEach(([val, sym]) => { if (sym) horizontalToValue[sym] = Number(val); });

export function parseChineseRod(symbols) {
  if (!symbols || symbols.length === 0) return { value: null, error: 'Add Chinese rod numeral symbols' };

  const digits = [];
  for (const sym of symbols) {
    if (sym === '〇') {
      digits.push(0);
    } else if (sym in verticalToValue) {
      digits.push(verticalToValue[sym]);
    } else if (sym in horizontalToValue) {
      digits.push(horizontalToValue[sym]);
    } else {
      return { value: null, error: `Unknown symbol: ${sym}` };
    }
  }

  const total = digits.reduce((acc, d, i) => acc + d * Math.pow(10, digits.length - 1 - i), 0);
  if (total < 1 || total > 99999) return { value: null, error: 'Result out of range (1–99,999)' };
  return { value: total, error: null };
}
