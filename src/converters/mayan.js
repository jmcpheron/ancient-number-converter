const mayanSymbols = [
  '𝋠', '•', '••', '•••', '••••',
  '－', '•－', '••－', '•••－', '••••－',
  '＝', '•＝', '••＝', '•••＝', '••••＝',
  '≡', '•≡', '••≡', '•••≡', '••••≡'
];

export function convertToMayan(num) {
  if (num < 0 || num > 7999999) return { result: ['Invalid input'], steps: [] };

  const result = [];
  const steps = [];
  let remaining = num;
  let position = 0;

  while (remaining > 0 || result.length === 0) {
    const digit = remaining % 20;
    result.push(mayanSymbols[digit]);
    if (remaining > 0) {
      const power = Math.pow(20, position);
      steps.push({
        value: digit * power,
        symbol: mayanSymbols[digit],
        explanation: `Position ${position} (×${power.toLocaleString()}): ${digit} = ${(digit * power).toLocaleString()}`
      });
    }
    remaining = Math.floor(remaining / 20);
    position++;
  }

  return { result, steps: steps.reverse() };
}

export { mayanSymbols };
