import { parseRoman } from '../parsers/roman';
import { parseEgyptian } from '../parsers/egyptian';
import { parseBabylonian } from '../parsers/babylonian';
import { parseMayan } from '../parsers/mayan';
import { parseChineseRod } from '../parsers/chineseRod';
import { parseGreekAttic } from '../parsers/greekAttic';

describe('Roman parser', () => {
  test('parses XLII to 42', () => {
    expect(parseRoman('XLII')).toEqual({ value: 42, error: null });
  });

  test('parses MCMXCIX to 1999', () => {
    expect(parseRoman('MCMXCIX')).toEqual({ value: 1999, error: null });
  });

  test('is case insensitive', () => {
    expect(parseRoman('xlii')).toEqual({ value: 42, error: null });
  });

  test('rejects invalid characters', () => {
    const { error } = parseRoman('ABC');
    expect(error).toBeTruthy();
  });

  test('rejects empty input', () => {
    const { error } = parseRoman('');
    expect(error).toBeTruthy();
  });
});

describe('Egyptian parser', () => {
  test('parses single stroke to 1', () => {
    expect(parseEgyptian(['𓏺'])).toEqual({ value: 1, error: null });
  });

  test('parses multiple symbols', () => {
    const { value } = parseEgyptian(['𓆼', '𓍢', '𓍢', '𓎆', '𓎆', '𓎆', '𓏺', '𓏺', '𓏺', '𓏺']);
    expect(value).toBe(1234);
  });

  test('rejects unknown symbols', () => {
    const { error } = parseEgyptian(['X']);
    expect(error).toBeTruthy();
  });
});

describe('Babylonian parser', () => {
  test('parses single wedge to 1', () => {
    expect(parseBabylonian([['𒁹']])).toEqual({ value: 1, error: null });
  });

  test('parses two groups for 61', () => {
    const { value } = parseBabylonian([['𒁹'], ['𒁹']]);
    expect(value).toBe(61);
  });

  test('rejects unknown symbols', () => {
    const { error } = parseBabylonian([['X']]);
    expect(error).toBeTruthy();
  });
});

describe('Mayan parser', () => {
  test('parses zero', () => {
    expect(parseMayan(['⠀'])).toEqual({ value: 0, error: null });
  });

  test('parses single dot to 1', () => {
    expect(parseMayan(['•'])).toEqual({ value: 1, error: null });
  });

  test('parses multi-position number', () => {
    // 42 = 2*20 + 2 → top-to-bottom: [••, ••]
    const { value } = parseMayan(['••', '••']);
    expect(value).toBe(42);
  });
});

describe('Chinese Rod parser', () => {
  test('parses single vertical digit', () => {
    const { value } = parseChineseRod(['𝍠']);
    expect(value).toBe(1);
  });

  test('rejects zero result', () => {
    const { error } = parseChineseRod(['〇']);
    expect(error).toBeTruthy();
  });
});

describe('Greek Attic parser', () => {
  test('parses Ι to 1', () => {
    expect(parseGreekAttic('Ι')).toEqual({ value: 1, error: null });
  });

  test('parses compound number', () => {
    const { value } = parseGreekAttic('ΔΔΔΔΙΙ');
    expect(value).toBe(42);
  });

  test('rejects invalid characters', () => {
    const { error } = parseGreekAttic('ABC');
    expect(error).toBeTruthy();
  });
});
