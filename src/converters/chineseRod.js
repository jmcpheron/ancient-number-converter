// Chinese Rod Numerals use vertical and horizontal bars, alternating by place value.
// Ones place uses vertical bars, tens uses horizontal, hundreds vertical, etc.
// Each digit 1-9 has a specific pattern; 0 is represented by a blank space.

const verticalDigits = {
  0: '',
  1: '𝍠', 2: '𝍡', 3: '𝍢', 4: '𝍣', 5: '𝍤',
  6: '𝍥', 7: '𝍦', 8: '𝍧', 9: '𝍨'
};

const horizontalDigits = {
  0: '',
  1: '𝍩', 2: '𝍪', 3: '𝍫', 4: '𝍬', 5: '𝍭',
  6: '𝍮', 7: '𝍯', 8: '𝍰', 9: '𝍱'
};

const placeNames = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];

export function convertToChineseRod(num) {
  if (num < 1 || num > 99999) return { result: ['Invalid input'], steps: [] };

  const digits = String(num).split('').map(Number);
  const result = [];
  const steps = [];
  const totalPositions = digits.length;

  digits.forEach((digit, i) => {
    const position = totalPositions - 1 - i;
    const useVertical = position % 2 === 0;
    const symbolSet = useVertical ? verticalDigits : horizontalDigits;
    const orientation = useVertical ? 'vertical' : 'horizontal';
    const symbol = digit === 0 ? '〇' : symbolSet[digit];
    result.push(symbol);

    const placeValue = Math.pow(10, position);
    steps.push({
      value: digit * placeValue,
      symbol,
      explanation: `${placeNames[position]} place: ${digit} (${orientation})`
    });
  });

  return { result, steps };
}

export { verticalDigits, horizontalDigits };
