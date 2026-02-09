const symbolToValue = { '𒁹': 1, '𒌋': 10 };

export function parseBabylonian(groups) {
  // groups is an array of arrays of symbols, e.g. [['𒌋','𒁹'], ['𒁹','𒁹']]
  if (!groups || groups.length === 0) return { value: null, error: 'Add Babylonian cuneiform symbols' };

  let total = 0;
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    let groupValue = 0;
    for (const sym of group) {
      if (!(sym in symbolToValue)) {
        return { value: null, error: `Unknown symbol: ${sym}` };
      }
      groupValue += symbolToValue[sym];
    }
    if (groupValue > 59) return { value: null, error: 'Each group must be 0–59' };
    const power = Math.pow(60, groups.length - 1 - i);
    total += groupValue * power;
  }

  if (total < 1 || total > 12959999) return { value: null, error: 'Result out of range (1–12,959,999)' };
  return { value: total, error: null };
}
