const egyptianSymbols = {
  1: '𓏺', 10: '𓎆', 100: '𓍢', 1000: '𓆼', 10000: '𓂭', 100000: '𓆐', 1000000: '𓁨'
};

const egyptianNames = {
  1: 'stroke', 10: 'heel bone', 100: 'coil of rope', 1000: 'lotus',
  10000: 'finger', 100000: 'tadpole', 1000000: 'god'
};

export function convertToEgyptian(num) {
  if (num < 1 || num > 9999999) return { result: ['Invalid input'], steps: [] };

  const result = [];
  const steps = [];
  const values = Object.keys(egyptianSymbols).map(Number).sort((a, b) => b - a);
  let remaining = num;

  for (let value of values) {
    let count = 0;
    while (remaining >= value) {
      result.push(egyptianSymbols[value]);
      remaining -= value;
      count++;
    }
    if (count > 0) {
      steps.push({
        value: value * count,
        symbol: egyptianSymbols[value].repeat(count),
        explanation: count === 1
          ? `${egyptianNames[value]} = ${value.toLocaleString()}`
          : `${count} ${egyptianNames[value]}s = ${(value * count).toLocaleString()}`
      });
    }
  }

  return { result, steps };
}

export { egyptianSymbols, egyptianNames };
