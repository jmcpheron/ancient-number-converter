const atticValues = {
  'M𐅂': 50000, 'M': 10000, '𐅁': 5000, 'Χ': 1000,
  '𐅀': 500, 'Η': 100, '𐄿': 50, 'Δ': 10, 'Π': 5, 'Ι': 1
};

// Sorted by length descending so multi-char symbols match first
const sortedSymbols = Object.keys(atticValues).sort((a, b) => b.length - a.length);

export function parseGreekAttic(str) {
  const input = str.trim();
  if (!input) return { value: null, error: 'Enter a Greek Attic numeral' };

  let total = 0;
  let remaining = input;

  while (remaining.length > 0) {
    let matched = false;
    for (const sym of sortedSymbols) {
      if (remaining.startsWith(sym)) {
        total += atticValues[sym];
        remaining = remaining.slice(sym.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      return { value: null, error: `Unknown symbol at: "${remaining[0]}"` };
    }
  }

  if (total < 1 || total > 99999) return { value: null, error: 'Result out of range (1–99,999)' };
  return { value: total, error: null };
}
