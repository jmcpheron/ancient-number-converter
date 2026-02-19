import { describe, it, expect } from 'vitest';
import { computeDecimal, computeVolume, addToLevel } from '../volume-app.js';
import { decompose } from '../volume-render.js';
import { getDangerLevel } from '../volume-effects.js';

describe('computeDecimal', () => {
  it('returns 0 for [0, 0]', () => {
    expect(computeDecimal([0, 0])).toBe(0);
  });

  it('computes ones only', () => {
    expect(computeDecimal([0, 7])).toBe(7);
  });

  it('computes twenties only', () => {
    expect(computeDecimal([3, 0])).toBe(60);
  });

  it('computes combined value', () => {
    expect(computeDecimal([2, 15])).toBe(55);
  });

  it('handles max single-digit levels [19, 19]', () => {
    expect(computeDecimal([19, 19])).toBe(399);
  });
});

describe('computeVolume', () => {
  it('returns decimal when under 100', () => {
    expect(computeVolume([2, 5])).toBe(45);
  });

  it('caps at 100', () => {
    expect(computeVolume([5, 5])).toBe(100);
  });

  it('caps large values at 100', () => {
    expect(computeVolume([19, 19])).toBe(100);
  });

  it('returns 0 for zeros', () => {
    expect(computeVolume([0, 0])).toBe(0);
  });
});

describe('addToLevel', () => {
  it('adds a dot to 0', () => {
    expect(addToLevel(0, 'dot')).toEqual({ value: 1, rejected: false });
  });

  it('adds a dot to 18', () => {
    expect(addToLevel(18, 'dot')).toEqual({ value: 19, rejected: false });
  });

  it('rejects dot at 19', () => {
    expect(addToLevel(19, 'dot')).toEqual({ value: 19, rejected: true });
  });

  it('adds a bar to 0', () => {
    expect(addToLevel(0, 'bar')).toEqual({ value: 5, rejected: false });
  });

  it('adds a bar to 14', () => {
    expect(addToLevel(14, 'bar')).toEqual({ value: 19, rejected: false });
  });

  it('rejects bar at 15', () => {
    expect(addToLevel(15, 'bar')).toEqual({ value: 15, rejected: true });
  });

  it('rejects bar at 19', () => {
    expect(addToLevel(19, 'bar')).toEqual({ value: 19, rejected: true });
  });

  it('shell resets to 0', () => {
    expect(addToLevel(15, 'shell')).toEqual({ value: 0, rejected: false });
  });

  it('shell on 0 stays 0', () => {
    expect(addToLevel(0, 'shell')).toEqual({ value: 0, rejected: false });
  });

  it('rejects unknown piece', () => {
    expect(addToLevel(5, 'unknown')).toEqual({ value: 5, rejected: true });
  });
});

describe('decompose', () => {
  it('returns isZero for 0', () => {
    expect(decompose(0)).toEqual({ bars: 0, dots: 0, isZero: true });
  });

  it('returns dots only for 1-4', () => {
    expect(decompose(3)).toEqual({ bars: 0, dots: 3, isZero: false });
  });

  it('returns one bar for 5', () => {
    expect(decompose(5)).toEqual({ bars: 1, dots: 0, isZero: false });
  });

  it('returns bars and dots for 7', () => {
    expect(decompose(7)).toEqual({ bars: 1, dots: 2, isZero: false });
  });

  it('returns 3 bars and 4 dots for 19', () => {
    expect(decompose(19)).toEqual({ bars: 3, dots: 4, isZero: false });
  });

  it('returns 2 bars for 10', () => {
    expect(decompose(10)).toEqual({ bars: 2, dots: 0, isZero: false });
  });
});

describe('getDangerLevel', () => {
  it('returns safe for 0', () => {
    expect(getDangerLevel(0)).toBe('safe');
  });

  it('returns safe for 50', () => {
    expect(getDangerLevel(50)).toBe('safe');
  });

  it('returns warm for 51', () => {
    expect(getDangerLevel(51)).toBe('warm');
  });

  it('returns warm for 75', () => {
    expect(getDangerLevel(75)).toBe('warm');
  });

  it('returns hot for 76', () => {
    expect(getDangerLevel(76)).toBe('hot');
  });

  it('returns hot for 99', () => {
    expect(getDangerLevel(99)).toBe('hot');
  });

  it('returns danger for exactly 100', () => {
    expect(getDangerLevel(100)).toBe('danger');
  });

  it('returns overload for 101', () => {
    expect(getDangerLevel(101)).toBe('overload');
  });
});
