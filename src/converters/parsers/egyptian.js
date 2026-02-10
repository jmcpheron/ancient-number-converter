const symbolToValue = {
  '𓏺': 1, '𓎆': 10, '𓍢': 100, '𓆼': 1000,
  '𓂭': 10000, '𓆐': 100000, '𓁨': 1000000
};

const validSymbols = Object.keys(symbolToValue);

export function parseEgyptian(symbols) {
  if (!symbols || symbols.length === 0) return { value: null, error: 'Add Egyptian hieroglyphic symbols' };

  let total = 0;
  for (const sym of symbols) {
    if (!(sym in symbolToValue)) {
      return { value: null, error: `Unknown symbol: ${sym}` };
    }
    total += symbolToValue[sym];
  }

  if (total < 1 || total > 9999999) return { value: null, error: 'Result out of range (1–9,999,999)' };
  return { value: total, error: null };
}

export { validSymbols, symbolToValue };
