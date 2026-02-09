import { convertToMayan } from '../mayan';
import { convertToEgyptian } from '../egyptian';
import { convertToBabylonian } from '../babylonian';
import { convertToRoman } from '../roman';
import { convertToChineseRod } from '../chineseRod';
import { convertToGreekAttic } from '../greekAttic';

describe('Mayan converter', () => {
  test('converts 0', () => {
    const { result } = convertToMayan(0);
    expect(result).toEqual(['⠀']);
  });

  test('converts 42', () => {
    const { result } = convertToMayan(42);
    expect(result.length).toBe(2);
  });

  test('returns steps', () => {
    const { steps } = convertToMayan(42);
    expect(steps.length).toBeGreaterThan(0);
  });

  test('rejects out of range', () => {
    const { result } = convertToMayan(-1);
    expect(result).toEqual(['Invalid input']);
  });
});

describe('Egyptian converter', () => {
  test('converts 1', () => {
    const { result } = convertToEgyptian(1);
    expect(result).toEqual(['𓏺']);
  });

  test('converts 1234', () => {
    const { result } = convertToEgyptian(1234);
    expect(result).toContain('𓆼');
    expect(result).toContain('𓍢');
    expect(result).toContain('𓎆');
    expect(result).toContain('𓏺');
  });

  test('returns steps with explanations', () => {
    const { steps } = convertToEgyptian(1234);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].explanation).toBeDefined();
  });

  test('rejects 0', () => {
    const { result } = convertToEgyptian(0);
    expect(result).toEqual(['Invalid input']);
  });
});

describe('Babylonian converter', () => {
  test('converts 1', () => {
    const { result } = convertToBabylonian(1);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(['𒁹']);
  });

  test('converts 61', () => {
    const { result } = convertToBabylonian(61);
    expect(result.length).toBe(2);
  });

  test('returns steps', () => {
    const { steps } = convertToBabylonian(61);
    expect(steps.length).toBeGreaterThan(0);
  });

  test('rejects 0', () => {
    const { result } = convertToBabylonian(0);
    expect(result).toEqual(['Invalid input']);
  });
});

describe('Roman converter', () => {
  test('converts 1 to I', () => {
    const { result } = convertToRoman(1);
    expect(result).toEqual(['I']);
  });

  test('converts 42 to XLII', () => {
    const { result } = convertToRoman(42);
    expect(result).toEqual(['XLII']);
  });

  test('converts 1999 to MCMXCIX', () => {
    const { result } = convertToRoman(1999);
    expect(result).toEqual(['MCMXCIX']);
  });

  test('returns steps', () => {
    const { steps } = convertToRoman(42);
    expect(steps.length).toBe(2); // XL + II
  });

  test('rejects 4000', () => {
    const { result } = convertToRoman(4000);
    expect(result).toEqual(['Invalid input']);
  });
});

describe('Chinese Rod converter', () => {
  test('converts 1', () => {
    const { result } = convertToChineseRod(1);
    expect(result.length).toBe(1);
  });

  test('converts 42', () => {
    const { result } = convertToChineseRod(42);
    expect(result.length).toBe(2);
  });

  test('returns steps with orientation info', () => {
    const { steps } = convertToChineseRod(42);
    expect(steps.length).toBe(2);
    expect(steps[0].explanation).toContain('horizontal'); // tens place
    expect(steps[1].explanation).toContain('vertical'); // ones place
  });

  test('rejects 0', () => {
    const { result } = convertToChineseRod(0);
    expect(result).toEqual(['Invalid input']);
  });
});

describe('Greek Attic converter', () => {
  test('converts 1 to Ι', () => {
    const { result } = convertToGreekAttic(1);
    expect(result).toEqual(['Ι']);
  });

  test('converts 42', () => {
    const { result } = convertToGreekAttic(42);
    expect(result[0]).toContain('Δ');
    expect(result[0]).toContain('Ι');
  });

  test('returns steps', () => {
    const { steps } = convertToGreekAttic(42);
    expect(steps.length).toBeGreaterThan(0);
  });

  test('rejects 0', () => {
    const { result } = convertToGreekAttic(0);
    expect(result).toEqual(['Invalid input']);
  });
});
