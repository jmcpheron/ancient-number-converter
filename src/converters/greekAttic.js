// Greek Attic (Acrophonic) numerals — the predecessor to the more familiar Greek alphabetic system.
// Uses initial letters of number words: Pente (5), Deka (10), Hekaton (100), etc.

const atticSymbols = [
  { value: 50000, symbol: 'M𐅂', name: 'five myriads' },
  { value: 10000, symbol: 'M', name: 'myriad' },
  { value: 5000, symbol: '𐅁', name: 'five thousands' },
  { value: 1000, symbol: 'Χ', name: 'khilioi (thousand)' },
  { value: 500, symbol: '𐅀', name: 'five hundreds' },
  { value: 100, symbol: 'Η', name: 'hekaton (hundred)' },
  { value: 50, symbol: '𐄿', name: 'fifty' },
  { value: 10, symbol: 'Δ', name: 'deka (ten)' },
  { value: 5, symbol: 'Π', name: 'pente (five)' },
  { value: 1, symbol: 'Ι', name: 'one' }
];

export function convertToGreekAttic(num) {
  if (num < 1 || num > 99999) return { result: ['Invalid input'], steps: [] };

  let result = '';
  const steps = [];
  let remaining = num;

  for (let { value, symbol, name } of atticSymbols) {
    let count = 0;
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
      count++;
    }
    if (count > 0) {
      steps.push({
        value: value * count,
        symbol: symbol.repeat(count),
        explanation: `${value.toLocaleString()} × ${count} → ${symbol.repeat(count)} (${name})`
      });
    }
  }

  return { result: [result], steps };
}

export { atticSymbols };
