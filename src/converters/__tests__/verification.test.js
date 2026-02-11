import { describe, it, expect } from 'vitest';
import { verifyRoundTrip } from '../../utils/verification.js';
import showcaseExamples from '../../data/showcaseExamples.js';

describe('Round-trip verification', () => {
  for (const [systemId, examples] of Object.entries(showcaseExamples)) {
    describe(systemId, () => {
      for (const { number } of examples) {
        it(`verifies ${number}`, () => {
          const result = verifyRoundTrip(systemId, number);
          expect(result.passed).toBe(true);
          expect(result.parsed).toBe(number);
        });
      }
    });
  }
});

describe('verifyRoundTrip edge cases', () => {
  it('returns error for unknown system', () => {
    const result = verifyRoundTrip('unknown', 42);
    expect(result.passed).toBe(false);
    expect(result.error).toBe('Unknown system');
  });

  it('returns error for out-of-range number', () => {
    const result = verifyRoundTrip('roman', 5000);
    expect(result.passed).toBe(false);
    expect(result.error).toBe('Out of range');
  });
});
