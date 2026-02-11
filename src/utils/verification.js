import numberSystems from '../data/numberSystems.js';
import { parseRoman } from '../converters/parsers/roman.js';
import { parseEgyptian } from '../converters/parsers/egyptian.js';
import { parseBabylonian } from '../converters/parsers/babylonian.js';
import { parseMayan } from '../converters/parsers/mayan.js';
import { parseChineseRod } from '../converters/parsers/chineseRod.js';
import { parseGreekAttic } from '../converters/parsers/greekAttic.js';
import { parseQuipu } from '../converters/parsers/quipu.js';

const parsers = {
  roman: { parse: parseRoman, inputType: 'text' },
  greekAttic: { parse: parseGreekAttic, inputType: 'text' },
  egyptian: { parse: parseEgyptian, inputType: 'symbols' },
  babylonian: { parse: parseBabylonian, inputType: 'groups' },
  mayan: { parse: parseMayan, inputType: 'symbols' },
  chineseRod: { parse: parseChineseRod, inputType: 'symbols' },
  quipu: { parse: parseQuipu, inputType: 'symbols' },
};

/**
 * Verify a round-trip conversion: decimal → ancient → parse back → compare.
 * Returns { passed, original, parsed, error }
 */
export function verifyRoundTrip(systemId, number) {
  const system = numberSystems[systemId];
  const parser = parsers[systemId];
  if (!system || !parser) {
    return { passed: false, original: number, parsed: null, error: 'Unknown system' };
  }

  const { result } = system.convert(number);
  if (result[0] === 'Invalid input') {
    return { passed: false, original: number, parsed: null, error: 'Out of range' };
  }

  let parseResult;
  if (parser.inputType === 'text') {
    // Roman and Greek Attic wrap result in a single-element array
    parseResult = parser.parse(result[0]);
  } else if (parser.inputType === 'groups') {
    parseResult = parser.parse(result);
  } else {
    // Mayan and Quipu converters store bottom-to-top (ones first); parsers expect top-to-bottom
    const input = (system.renderMode === 'vertical' || system.renderMode === 'cord')
      ? [...result].reverse() : result;
    parseResult = parser.parse(input);
  }

  if (parseResult.error) {
    return { passed: false, original: number, parsed: null, error: parseResult.error };
  }

  const passed = parseResult.value === number;
  return { passed, original: number, parsed: parseResult.value, error: passed ? null : 'Mismatch' };
}
