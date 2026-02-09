const babylonianSymbols = {
  1: '𒁹',
  10: '𒌋'
};

export function convertToBabylonian(num) {
  if (num < 1 || num > 12959999) return { result: ['Invalid input'], steps: [] };

  const result = [];
  const steps = [];
  let remaining = num;

  for (let i = 3; i >= 0; i--) {
    let powerOf60 = Math.pow(60, i);
    let quotient = Math.floor(remaining / powerOf60);
    remaining %= powerOf60;

    if (quotient > 0 || result.length > 0) {
      let groupResult = [];
      let q = quotient;
      while (q > 0) {
        if (q >= 10) {
          groupResult.push(babylonianSymbols[10]);
          q -= 10;
        } else {
          groupResult.push(babylonianSymbols[1]);
          q -= 1;
        }
      }
      result.push(groupResult);
      if (quotient > 0) {
        steps.push({
          value: quotient * powerOf60,
          symbol: groupResult.join(''),
          explanation: `Position ${i} (×${powerOf60.toLocaleString()}): ${quotient} → ${groupResult.join('')}`
        });
      }
    }
  }

  return { result, steps };
}

export { babylonianSymbols };
