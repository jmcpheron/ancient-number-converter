import { parseRoman } from '../parsers/roman';
import { parseEgyptian } from '../parsers/egyptian';
import { parseBabylonian } from '../parsers/babylonian';
import { parseMayan } from '../parsers/mayan';
import { parseChineseRod } from '../parsers/chineseRod';
import { parseGreekAttic } from '../parsers/greekAttic';
import { convertToRoman } from '../roman';
import { convertToEgyptian } from '../egyptian';
import { convertToBabylonian } from '../babylonian';
import { convertToMayan } from '../mayan';
import { convertToChineseRod } from '../chineseRod';
import { convertToGreekAttic } from '../greekAttic';

// ─── Roman Parser ───────────────────────────────────────────────────────────

describe('Roman parser', () => {
  test('parses I to 1', () => {
    expect(parseRoman('I')).toEqual({ value: 1, error: null });
  });

  test('parses V to 5', () => {
    expect(parseRoman('V')).toEqual({ value: 5, error: null });
  });

  test('parses X to 10', () => {
    expect(parseRoman('X')).toEqual({ value: 10, error: null });
  });

  test('parses XLII to 42', () => {
    expect(parseRoman('XLII')).toEqual({ value: 42, error: null });
  });

  test('parses MCMXCIX to 1999', () => {
    expect(parseRoman('MCMXCIX')).toEqual({ value: 1999, error: null });
  });

  test('parses MMMCMXCIX to 3999', () => {
    expect(parseRoman('MMMCMXCIX')).toEqual({ value: 3999, error: null });
  });

  test('handles all subtractive pairs', () => {
    expect(parseRoman('IV').value).toBe(4);
    expect(parseRoman('IX').value).toBe(9);
    expect(parseRoman('XL').value).toBe(40);
    expect(parseRoman('XC').value).toBe(90);
    expect(parseRoman('CD').value).toBe(400);
    expect(parseRoman('CM').value).toBe(900);
  });

  test('is case insensitive', () => {
    expect(parseRoman('xlii')).toEqual({ value: 42, error: null });
    expect(parseRoman('mcmxcix')).toEqual({ value: 1999, error: null });
  });

  test('rejects invalid characters', () => {
    expect(parseRoman('ABC').error).toBeTruthy();
  });

  test('rejects empty input', () => {
    expect(parseRoman('').error).toBeTruthy();
  });
});

// ─── Egyptian Parser ────────────────────────────────────────────────────────

describe('Egyptian parser', () => {
  test('parses single stroke to 1', () => {
    expect(parseEgyptian(['𓏺'])).toEqual({ value: 1, error: null });
  });

  test('parses heel bone to 10', () => {
    expect(parseEgyptian(['𓎆'])).toEqual({ value: 10, error: null });
  });

  test('parses coil of rope to 100', () => {
    expect(parseEgyptian(['𓍢'])).toEqual({ value: 100, error: null });
  });

  test('parses lotus to 1000', () => {
    expect(parseEgyptian(['𓆼'])).toEqual({ value: 1000, error: null });
  });

  test('parses finger to 10000', () => {
    expect(parseEgyptian(['𓂭'])).toEqual({ value: 10000, error: null });
  });

  test('parses tadpole 𓆐 to 100000', () => {
    expect(parseEgyptian(['𓆐'])).toEqual({ value: 100000, error: null });
  });

  test('parses god Heh 𓁨 to 1000000', () => {
    expect(parseEgyptian(['𓁨'])).toEqual({ value: 1000000, error: null });
  });

  test('parses multiple symbols additively for 1234', () => {
    const { value } = parseEgyptian(['𓆼', '𓍢', '𓍢', '𓎆', '𓎆', '𓎆', '𓏺', '𓏺', '𓏺', '𓏺']);
    expect(value).toBe(1234);
  });

  test('parses symbols in any order (additive)', () => {
    // 42 = 4 heel bones + 2 strokes, but in reversed order
    const { value } = parseEgyptian(['𓏺', '𓏺', '𓎆', '𓎆', '𓎆', '𓎆']);
    expect(value).toBe(42);
  });

  test('rejects unknown symbols', () => {
    expect(parseEgyptian(['X']).error).toBeTruthy();
  });

  test('rejects empty input', () => {
    expect(parseEgyptian([]).error).toBeTruthy();
  });
});

// ─── Babylonian Parser ──────────────────────────────────────────────────────

describe('Babylonian parser', () => {
  test('parses single wedge to 1', () => {
    expect(parseBabylonian([['𒁹']])).toEqual({ value: 1, error: null });
  });

  test('parses single corner wedge to 10', () => {
    expect(parseBabylonian([['𒌋']])).toEqual({ value: 10, error: null });
  });

  test('parses two groups for 61 (1×60 + 1)', () => {
    expect(parseBabylonian([['𒁹'], ['𒁹']]).value).toBe(61);
  });

  test('parses complex group for 42', () => {
    expect(parseBabylonian([['𒌋', '𒌋', '𒌋', '𒌋', '𒁹', '𒁹']]).value).toBe(42);
  });

  test('parses three groups for 3661 (1×3600 + 1×60 + 1)', () => {
    expect(parseBabylonian([['𒁹'], ['𒁹'], ['𒁹']]).value).toBe(3661);
  });

  test('rejects group value over 59', () => {
    // 60 ones = too much for a single group
    const symbols = Array(60).fill('𒁹');
    expect(parseBabylonian([symbols]).error).toBeTruthy();
  });

  test('rejects unknown symbols', () => {
    expect(parseBabylonian([['X']]).error).toBeTruthy();
  });

  test('rejects empty input', () => {
    expect(parseBabylonian([]).error).toBeTruthy();
  });
});

// ─── Mayan Parser ───────────────────────────────────────────────────────────

describe('Mayan parser', () => {
  test('parses shell to 0', () => {
    expect(parseMayan(['⠀'])).toEqual({ value: 0, error: null });
  });

  test('parses single dot to 1', () => {
    expect(parseMayan(['•'])).toEqual({ value: 1, error: null });
  });

  test('parses single bar to 5', () => {
    expect(parseMayan(['－'])).toEqual({ value: 5, error: null });
  });

  test('parses multi-position for 42 (2×20 + 2)', () => {
    // Top-to-bottom: most significant first
    const { value } = parseMayan(['••', '••']);
    expect(value).toBe(42);
  });

  test('parses 20 (1×20 + 0)', () => {
    const { value } = parseMayan(['•', '⠀']);
    expect(value).toBe(20);
  });

  test('parses 400 (1×400 + 0×20 + 0)', () => {
    const { value } = parseMayan(['•', '⠀', '⠀']);
    expect(value).toBe(400);
  });

  test('rejects unknown symbols', () => {
    expect(parseMayan(['X']).error).toBeTruthy();
  });

  test('rejects empty input', () => {
    expect(parseMayan([]).error).toBeTruthy();
  });
});

// ─── Chinese Rod Parser ────────────────────────────────────────────────────

describe('Chinese Rod parser', () => {
  test('parses single vertical digit 𝍠 to 1', () => {
    expect(parseChineseRod(['𝍠']).value).toBe(1);
  });

  test('parses horizontal digit for tens', () => {
    // 42 = horizontal 4 + vertical 2
    expect(parseChineseRod(['𝍬', '𝍡']).value).toBe(42);
  });

  test('parses zero symbol in middle position', () => {
    // 105 = vertical 1 + zero + vertical 5
    expect(parseChineseRod(['𝍠', '〇', '𝍤']).value).toBe(105);
  });

  test('rejects all-zero input', () => {
    expect(parseChineseRod(['〇']).error).toBeTruthy();
  });

  test('rejects unknown symbols', () => {
    expect(parseChineseRod(['X']).error).toBeTruthy();
  });

  test('rejects empty input', () => {
    expect(parseChineseRod([]).error).toBeTruthy();
  });
});

// ─── Greek Attic Parser ────────────────────────────────────────────────────

describe('Greek Attic parser', () => {
  test('parses Ι to 1', () => {
    expect(parseGreekAttic('Ι')).toEqual({ value: 1, error: null });
  });

  test('parses Π to 5', () => {
    expect(parseGreekAttic('Π')).toEqual({ value: 5, error: null });
  });

  test('parses Δ to 10', () => {
    expect(parseGreekAttic('Δ')).toEqual({ value: 10, error: null });
  });

  test('parses compound symbol 𐅄 to 50', () => {
    expect(parseGreekAttic('𐅄').value).toBe(50);
  });

  test('parses Η to 100', () => {
    expect(parseGreekAttic('Η').value).toBe(100);
  });

  test('parses compound symbol 𐅅 to 500', () => {
    expect(parseGreekAttic('𐅅').value).toBe(500);
  });

  test('parses Χ to 1000', () => {
    expect(parseGreekAttic('Χ').value).toBe(1000);
  });

  test('parses compound symbol 𐅆 to 5000', () => {
    expect(parseGreekAttic('𐅆').value).toBe(5000);
  });

  test('parses M to 10000', () => {
    expect(parseGreekAttic('M').value).toBe(10000);
  });

  test('parses compound symbol 𐅇 to 50000', () => {
    expect(parseGreekAttic('𐅇').value).toBe(50000);
  });

  test('parses compound number ΔΔΔΔΙΙ to 42', () => {
    expect(parseGreekAttic('ΔΔΔΔΙΙ').value).toBe(42);
  });

  test('rejects invalid characters', () => {
    expect(parseGreekAttic('ABC').error).toBeTruthy();
  });

  test('rejects empty input', () => {
    expect(parseGreekAttic('').error).toBeTruthy();
  });
});

// ─── Round-trip Tests (convert then parse back) ─────────────────────────────

describe('Round-trip: convert then parse', () => {
  const romanValues = [1, 4, 9, 42, 90, 100, 400, 500, 900, 1999, 3999];
  test.each(romanValues)('Roman round-trip for %i', (num) => {
    const { result } = convertToRoman(num);
    const { value } = parseRoman(result[0]);
    expect(value).toBe(num);
  });

  const egyptianValues = [1, 10, 42, 100, 1234, 100000, 1000000];
  test.each(egyptianValues)('Egyptian round-trip for %i', (num) => {
    const { result } = convertToEgyptian(num);
    const { value } = parseEgyptian(result);
    expect(value).toBe(num);
  });

  const babylonianValues = [1, 10, 42, 59, 61, 3600, 3661];
  test.each(babylonianValues)('Babylonian round-trip for %i', (num) => {
    const { result } = convertToBabylonian(num);
    const { value } = parseBabylonian(result);
    expect(value).toBe(num);
  });

  const mayanValues = [0, 1, 5, 19, 20, 42, 400];
  test.each(mayanValues)('Mayan round-trip for %i', (num) => {
    const { result } = convertToMayan(num);
    // Parser expects top-to-bottom (most significant first), converter returns bottom-to-top
    const { value } = parseMayan([...result].reverse());
    expect(value).toBe(num);
  });

  const chineseRodValues = [1, 10, 42, 105, 99999];
  test.each(chineseRodValues)('Chinese Rod round-trip for %i', (num) => {
    const { result } = convertToChineseRod(num);
    const { value } = parseChineseRod(result);
    expect(value).toBe(num);
  });

  const greekAtticValues = [1, 5, 10, 42, 50, 100, 500, 1000, 5000, 10000, 50000];
  test.each(greekAtticValues)('Greek Attic round-trip for %i', (num) => {
    const { result } = convertToGreekAttic(num);
    const { value } = parseGreekAttic(result[0]);
    expect(value).toBe(num);
  });
});
