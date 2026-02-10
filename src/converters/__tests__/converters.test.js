import { convertToMayan } from '../mayan';
import { convertToEgyptian } from '../egyptian';
import { convertToBabylonian } from '../babylonian';
import { convertToRoman } from '../roman';
import { convertToChineseRod } from '../chineseRod';
import { convertToGreekAttic } from '../greekAttic';

// ─── Roman Numerals ─────────────────────────────────────────────────────────

describe('Roman converter', () => {
  test('converts 1 to I', () => {
    expect(convertToRoman(1).result).toEqual(['I']);
  });

  test('converts 4 to IV (subtractive)', () => {
    expect(convertToRoman(4).result).toEqual(['IV']);
  });

  test('converts 9 to IX (subtractive)', () => {
    expect(convertToRoman(9).result).toEqual(['IX']);
  });

  test('converts 42 to XLII', () => {
    expect(convertToRoman(42).result).toEqual(['XLII']);
  });

  test('converts 90 to XC', () => {
    expect(convertToRoman(90).result).toEqual(['XC']);
  });

  test('converts 100 to C', () => {
    expect(convertToRoman(100).result).toEqual(['C']);
  });

  test('converts 400 to CD', () => {
    expect(convertToRoman(400).result).toEqual(['CD']);
  });

  test('converts 500 to D', () => {
    expect(convertToRoman(500).result).toEqual(['D']);
  });

  test('converts 900 to CM', () => {
    expect(convertToRoman(900).result).toEqual(['CM']);
  });

  test('converts 1999 to MCMXCIX', () => {
    expect(convertToRoman(1999).result).toEqual(['MCMXCIX']);
  });

  test('converts 3999 to MMMCMXCIX (max)', () => {
    expect(convertToRoman(3999).result).toEqual(['MMMCMXCIX']);
  });

  test('converts 2024 to MMXXIV', () => {
    expect(convertToRoman(2024).result).toEqual(['MMXXIV']);
  });

  test('converts 3888 to MMMDCCCLXXXVIII (max non-subtractive repetitions)', () => {
    expect(convertToRoman(3888).result).toEqual(['MMMDCCCLXXXVIII']);
  });

  test('all subtractive pairs produce correct symbols', () => {
    const pairs = [
      [4, 'IV'], [9, 'IX'], [40, 'XL'], [90, 'XC'],
      [400, 'CD'], [900, 'CM']
    ];
    for (const [num, expected] of pairs) {
      expect(convertToRoman(num).result).toEqual([expected]);
    }
  });

  test('returns steps for 42 (XL + II)', () => {
    const { steps } = convertToRoman(42);
    expect(steps.length).toBe(2);
    expect(steps[0].value).toBe(40);
    expect(steps[1].value).toBe(2);
  });

  test('rejects 0', () => {
    expect(convertToRoman(0).result).toEqual(['Invalid input']);
  });

  test('rejects 4000', () => {
    expect(convertToRoman(4000).result).toEqual(['Invalid input']);
  });

  test('rejects negative numbers', () => {
    expect(convertToRoman(-1).result).toEqual(['Invalid input']);
  });
});

// ─── Egyptian Hieroglyphic Numerals ─────────────────────────────────────────

describe('Egyptian converter', () => {
  test('converts 1 to stroke 𓏺', () => {
    expect(convertToEgyptian(1).result).toEqual(['𓏺']);
  });

  test('converts 10 to heel bone 𓎆', () => {
    expect(convertToEgyptian(10).result).toEqual(['𓎆']);
  });

  test('converts 100 to coil of rope 𓍢', () => {
    expect(convertToEgyptian(100).result).toEqual(['𓍢']);
  });

  test('converts 1000 to lotus 𓆼', () => {
    expect(convertToEgyptian(1000).result).toEqual(['𓆼']);
  });

  test('converts 10000 to finger 𓂭', () => {
    expect(convertToEgyptian(10000).result).toEqual(['𓂭']);
  });

  test('converts 100000 to tadpole 𓆐', () => {
    expect(convertToEgyptian(100000).result).toEqual(['𓆐']);
  });

  test('converts 1000000 to god Heh 𓁨', () => {
    expect(convertToEgyptian(1000000).result).toEqual(['𓁨']);
  });

  test('each power of 10 maps to the correct hieroglyph', () => {
    const expected = {
      1: '𓏺', 10: '𓎆', 100: '𓍢', 1000: '𓆼',
      10000: '𓂭', 100000: '𓆐', 1000000: '𓁨'
    };
    for (const [num, sym] of Object.entries(expected)) {
      expect(convertToEgyptian(Number(num)).result).toEqual([sym]);
    }
  });

  test('converts 1234 using additive notation', () => {
    const { result } = convertToEgyptian(1234);
    expect(result).toEqual(['𓆼', '𓍢', '𓍢', '𓎆', '𓎆', '𓎆', '𓏺', '𓏺', '𓏺', '𓏺']);
  });

  test('converts 42 to 4 heel bones + 2 strokes', () => {
    const { result } = convertToEgyptian(42);
    expect(result).toEqual(['𓎆', '𓎆', '𓎆', '𓎆', '𓏺', '𓏺']);
  });

  test('converts 9999999 with correct symbol counts', () => {
    const { result } = convertToEgyptian(9999999);
    expect(result.length).toBe(63); // 9 symbols × 7 powers
    expect(result.filter(s => s === '𓁨').length).toBe(9);  // gods (1M)
    expect(result.filter(s => s === '𓆐').length).toBe(9);  // tadpoles (100K)
    expect(result.filter(s => s === '𓂭').length).toBe(9);  // fingers (10K)
  });

  test('steps include correct symbol names', () => {
    const { steps } = convertToEgyptian(1234);
    expect(steps.length).toBe(4);
    expect(steps[0].explanation).toContain('lotus');
    expect(steps[1].explanation).toContain('coil of rope');
    expect(steps[2].explanation).toContain('heel bone');
    expect(steps[3].explanation).toContain('stroke');
  });

  test('rejects 0', () => {
    expect(convertToEgyptian(0).result).toEqual(['Invalid input']);
  });

  test('rejects values over 9999999', () => {
    expect(convertToEgyptian(10000000).result).toEqual(['Invalid input']);
  });
});

// ─── Babylonian Cuneiform Numerals ──────────────────────────────────────────

describe('Babylonian converter', () => {
  test('converts 1 to single vertical wedge', () => {
    const { result } = convertToBabylonian(1);
    expect(result).toEqual([['𒁹']]);
  });

  test('converts 10 to single corner wedge', () => {
    const { result } = convertToBabylonian(10);
    expect(result).toEqual([['𒌋']]);
  });

  test('converts 42 to one group: 4 tens + 2 ones', () => {
    const { result } = convertToBabylonian(42);
    expect(result).toEqual([['𒌋', '𒌋', '𒌋', '𒌋', '𒁹', '𒁹']]);
  });

  test('converts 59 to max single group', () => {
    const { result } = convertToBabylonian(59);
    expect(result.length).toBe(1);
    // 5 tens + 9 ones = 14 symbols
    expect(result[0].length).toBe(14);
  });

  test('converts 60 to two groups with zero placeholder', () => {
    const { result } = convertToBabylonian(60);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual(['𒁹']);  // 1 × 60
    expect(result[1]).toEqual([]);      // 0 × 1
  });

  test('converts 61 to two groups', () => {
    const { result } = convertToBabylonian(61);
    expect(result.length).toBe(2);
    expect(result[0]).toEqual(['𒁹']);
    expect(result[1]).toEqual(['𒁹']);
  });

  test('converts 3600 (60²) to three groups', () => {
    const { result } = convertToBabylonian(3600);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(['𒁹']);
    expect(result[1]).toEqual([]);
    expect(result[2]).toEqual([]);
  });

  test('converts 3661 (1×3600 + 1×60 + 1)', () => {
    const { result } = convertToBabylonian(3661);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(['𒁹']);
    expect(result[1]).toEqual(['𒁹']);
    expect(result[2]).toEqual(['𒁹']);
  });

  test('converts 7225 (2×3600 + 0×60 + 25)', () => {
    const { result } = convertToBabylonian(7225);
    expect(result.length).toBe(3);
    expect(result[0]).toEqual(['𒁹', '𒁹']);
    expect(result[1]).toEqual([]);
    expect(result[2]).toEqual(['𒌋', '𒌋', '𒁹', '𒁹', '𒁹', '𒁹', '𒁹']);
  });

  test('returns steps with position info', () => {
    const { steps } = convertToBabylonian(61);
    expect(steps.length).toBe(2);
    expect(steps[0].explanation).toContain('Position');
  });

  test('rejects 0', () => {
    expect(convertToBabylonian(0).result).toEqual(['Invalid input']);
  });

  test('rejects values over 12959999', () => {
    expect(convertToBabylonian(12960000).result).toEqual(['Invalid input']);
  });
});

// ─── Mayan Numerals ─────────────────────────────────────────────────────────

describe('Mayan converter', () => {
  test('converts 0 to shell symbol', () => {
    expect(convertToMayan(0).result).toEqual(['⠀']);
  });

  test('converts 1 to single dot', () => {
    const { result } = convertToMayan(1);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('•');
  });

  test('converts 5 to single bar', () => {
    const { result } = convertToMayan(5);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('－');
  });

  test('converts 19 to three bars + four dots (max single digit)', () => {
    const { result } = convertToMayan(19);
    expect(result.length).toBe(1);
    expect(result[0]).toBe('••••≡');
  });

  test('converts 20 to two positions: [shell, dot]', () => {
    const { result } = convertToMayan(20);
    expect(result.length).toBe(2);
    expect(result[0]).toBe('⠀'); // ones = 0
    expect(result[1]).toBe('•'); // twenties = 1
  });

  test('converts 42 (2×20 + 2)', () => {
    const { result } = convertToMayan(42);
    expect(result.length).toBe(2);
    expect(result[0]).toBe('••');  // ones = 2
    expect(result[1]).toBe('••'); // twenties = 2
  });

  test('converts 400 (20²) to three positions', () => {
    const { result } = convertToMayan(400);
    expect(result.length).toBe(3);
    expect(result[0]).toBe('⠀'); // ones = 0
    expect(result[1]).toBe('⠀'); // twenties = 0
    expect(result[2]).toBe('•'); // 400s = 1
  });

  test('dot-and-bar values match expected pattern for 0-19', () => {
    // Verify dots: 1-4 are •, ••, •••, ••••
    expect(convertToMayan(1).result[0]).toBe('•');
    expect(convertToMayan(2).result[0]).toBe('••');
    expect(convertToMayan(3).result[0]).toBe('•••');
    expect(convertToMayan(4).result[0]).toBe('••••');
    // Verify bar: 5 is single bar
    expect(convertToMayan(5).result[0]).toBe('－');
    // Verify bar + dots: 6-9
    expect(convertToMayan(6).result[0]).toBe('•－');
    expect(convertToMayan(10).result[0]).toBe('＝');
    expect(convertToMayan(15).result[0]).toBe('≡');
  });

  test('steps are in most-to-least significant order', () => {
    const { steps } = convertToMayan(42);
    expect(steps[0].explanation).toContain('Position 1');
    expect(steps[1].explanation).toContain('Position 0');
  });

  test('rejects negative numbers', () => {
    expect(convertToMayan(-1).result).toEqual(['Invalid input']);
  });

  test('rejects values over 7999999', () => {
    expect(convertToMayan(8000000).result).toEqual(['Invalid input']);
  });
});

// ─── Chinese Rod Numerals ───────────────────────────────────────────────────

describe('Chinese Rod converter', () => {
  test('converts 1 to vertical rod 𝍠', () => {
    expect(convertToChineseRod(1).result).toEqual(['𝍠']);
  });

  test('converts 5 to vertical rod 𝍤', () => {
    expect(convertToChineseRod(5).result).toEqual(['𝍤']);
  });

  test('converts 10 with horizontal rod + zero', () => {
    expect(convertToChineseRod(10).result).toEqual(['𝍩', '〇']);
  });

  test('converts 42 with alternating orientations', () => {
    const { result } = convertToChineseRod(42);
    expect(result).toEqual(['𝍬', '𝍡']); // tens=horizontal 4, ones=vertical 2
  });

  test('converts 105 with zero in the middle', () => {
    const { result } = convertToChineseRod(105);
    expect(result).toEqual(['𝍠', '〇', '𝍤']); // hundreds=vert 1, tens=0, ones=vert 5
  });

  test('converts 99999 (max)', () => {
    const { result } = convertToChineseRod(99999);
    expect(result.length).toBe(5);
  });

  test('orientation alternates correctly for multi-digit numbers', () => {
    const { steps } = convertToChineseRod(12345);
    expect(steps[0].explanation).toContain('vertical');    // ten-thousands
    expect(steps[1].explanation).toContain('horizontal');  // thousands
    expect(steps[2].explanation).toContain('vertical');    // hundreds
    expect(steps[3].explanation).toContain('horizontal');  // tens
    expect(steps[4].explanation).toContain('vertical');    // ones
  });

  test('returns steps with orientation info', () => {
    const { steps } = convertToChineseRod(42);
    expect(steps.length).toBe(2);
    expect(steps[0].explanation).toContain('horizontal');
    expect(steps[1].explanation).toContain('vertical');
  });

  test('rejects 0', () => {
    expect(convertToChineseRod(0).result).toEqual(['Invalid input']);
  });

  test('rejects values over 99999', () => {
    expect(convertToChineseRod(100000).result).toEqual(['Invalid input']);
  });
});

// ─── Greek Attic Numerals ───────────────────────────────────────────────────

describe('Greek Attic converter', () => {
  test('converts 1 to Ι', () => {
    expect(convertToGreekAttic(1).result).toEqual(['Ι']);
  });

  test('converts 5 to Π (pente)', () => {
    expect(convertToGreekAttic(5).result).toEqual(['Π']);
  });

  test('converts 10 to Δ (deka)', () => {
    expect(convertToGreekAttic(10).result).toEqual(['Δ']);
  });

  test('converts 42 to ΔΔΔΔΙΙ', () => {
    expect(convertToGreekAttic(42).result[0]).toBe('ΔΔΔΔΙΙ');
  });

  test('converts 50 using compound symbol 𐅄 (U+10144)', () => {
    expect(convertToGreekAttic(50).result[0]).toBe('𐅄');
  });

  test('converts 100 to Η (hekaton)', () => {
    expect(convertToGreekAttic(100).result).toEqual(['Η']);
  });

  test('converts 500 using compound symbol 𐅅 (U+10145)', () => {
    expect(convertToGreekAttic(500).result[0]).toBe('𐅅');
  });

  test('converts 1000 to Χ (khilioi)', () => {
    expect(convertToGreekAttic(1000).result).toEqual(['Χ']);
  });

  test('converts 5000 using compound symbol 𐅆 (U+10146)', () => {
    expect(convertToGreekAttic(5000).result[0]).toBe('𐅆');
  });

  test('converts 10000 to M (myriad)', () => {
    expect(convertToGreekAttic(10000).result).toEqual(['M']);
  });

  test('converts 50000 using compound symbol 𐅇 (U+10147)', () => {
    expect(convertToGreekAttic(50000).result[0]).toBe('𐅇');
  });

  test('converts 7777 correctly', () => {
    // 5000 + 1000 + 1000 + 500 + 100 + 100 + 50 + 10 + 10 + 5 + 1 + 1
    expect(convertToGreekAttic(7777).result[0]).toBe('𐅆ΧΧ𐅅ΗΗ𐅄ΔΔΠΙΙ');
  });

  test('converts 99999 (max) correctly', () => {
    // 50000 + 40000(4×M) + 5000 + 4000(4×Χ) + 500 + 400(4×Η) + 50 + 40(4×Δ) + 5 + 4(4×Ι)
    expect(convertToGreekAttic(99999).result[0]).toBe('𐅇MMMM𐅆ΧΧΧΧ𐅅ΗΗΗΗ𐅄ΔΔΔΔΠΙΙΙΙ');
  });

  test('returns steps', () => {
    const { steps } = convertToGreekAttic(42);
    expect(steps.length).toBe(2);
  });

  test('rejects 0', () => {
    expect(convertToGreekAttic(0).result).toEqual(['Invalid input']);
  });

  test('rejects values over 99999', () => {
    expect(convertToGreekAttic(100000).result).toEqual(['Invalid input']);
  });
});
