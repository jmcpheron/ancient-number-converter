const quipuSymbols = {
  simpleKnot: '●',
  longKnot: '◎',
  figureEight: '∞',
  zero: '—',
};

export function convertToQuipu(num) {
  if (num < 1 || num > 99999) return { result: ['Invalid input'], steps: [] };

  const digits = [];
  let remaining = num;
  while (remaining > 0) {
    digits.push(remaining % 10);
    remaining = Math.floor(remaining / 10);
  }

  const placeNames = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
  const result = [];
  const steps = [];

  for (let pos = 0; pos < digits.length; pos++) {
    const digit = digits[pos];
    let symbol;

    if (digit === 0) {
      symbol = quipuSymbols.zero;
    } else if (pos === 0) {
      // Ones place: figure-eight for 1, long knots for 2-9
      if (digit === 1) {
        symbol = quipuSymbols.figureEight;
      } else {
        symbol = quipuSymbols.longKnot.repeat(digit);
      }
    } else {
      // Higher places: clusters of simple knots
      symbol = quipuSymbols.simpleKnot.repeat(digit);
    }

    result.push(symbol);

    const place = placeNames[pos] || `position ${pos}`;
    let knotDesc;
    if (digit === 0) {
      knotDesc = 'no knots (zero)';
    } else if (pos === 0 && digit === 1) {
      knotDesc = 'figure-eight knot';
    } else if (pos === 0) {
      knotDesc = `${digit}-turn long knot`;
    } else {
      knotDesc = `${digit} simple knot${digit > 1 ? 's' : ''}`;
    }
    steps.push({
      value: digit * Math.pow(10, pos),
      symbol,
      explanation: `${place}: ${knotDesc} = ${(digit * Math.pow(10, pos)).toLocaleString()}`,
    });
  }

  return { result, steps: steps.reverse() };
}

export { quipuSymbols };
