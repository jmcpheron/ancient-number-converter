const romanSymbols = [
  { value: 1000, symbol: 'M' },
  { value: 900, symbol: 'CM' },
  { value: 500, symbol: 'D' },
  { value: 400, symbol: 'CD' },
  { value: 100, symbol: 'C' },
  { value: 90, symbol: 'XC' },
  { value: 50, symbol: 'L' },
  { value: 40, symbol: 'XL' },
  { value: 10, symbol: 'X' },
  { value: 9, symbol: 'IX' },
  { value: 5, symbol: 'V' },
  { value: 4, symbol: 'IV' },
  { value: 1, symbol: 'I' }
];

export function convertToRoman(num) {
  if (num < 1 || num > 3999) return { result: ['Invalid input'], steps: [] };

  let result = '';
  const steps = [];
  let remaining = num;

  for (let { value, symbol } of romanSymbols) {
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
        explanation: `${value.toLocaleString()} × ${count} → ${symbol.repeat(count)}`
      });
    }
  }

  return { result: [result], steps };
}

export { romanSymbols };
