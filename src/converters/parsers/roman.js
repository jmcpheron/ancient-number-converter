const romanValues = {
  M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1
};

export function parseRoman(str) {
  const input = str.trim().toUpperCase();
  if (!input) return { value: null, error: 'Enter a Roman numeral' };
  if (!/^[MDCLXVI]+$/.test(input)) return { value: null, error: 'Invalid characters. Use only M, D, C, L, X, V, I' };

  let total = 0;
  for (let i = 0; i < input.length; i++) {
    const current = romanValues[input[i]];
    const next = romanValues[input[i + 1]];
    if (next && current < next) {
      total -= current;
    } else {
      total += current;
    }
  }

  if (total < 1 || total > 3999) return { value: null, error: 'Result out of range (1–3,999)' };
  return { value: total, error: null };
}
