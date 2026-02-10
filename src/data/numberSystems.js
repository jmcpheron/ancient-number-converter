import { convertToMayan, mayanSymbols } from '../converters/mayan';
import { convertToEgyptian, egyptianSymbols, egyptianNames } from '../converters/egyptian';
import { convertToBabylonian, babylonianSymbols } from '../converters/babylonian';
import { convertToRoman, romanSymbols } from '../converters/roman';
import { convertToChineseRod, verticalDigits, horizontalDigits } from '../converters/chineseRod';
import { convertToGreekAttic, atticSymbols } from '../converters/greekAttic';
import { convertToQuipu, quipuSymbols } from '../converters/quipu';

const numberSystems = {
  mayan: {
    id: 'mayan',
    name: 'Mayan',
    convert: convertToMayan,
    symbols: mayanSymbols,
    range: [0, 7999999],
    base: 20,
    color: 'jungle',
    era: '~400 BC – 1500 AD',
    region: 'Mesoamerica',
    description: 'Vigesimal (base-20) positional system with zero',
    renderMode: 'vertical',
  },
  egyptian: {
    id: 'egyptian',
    name: 'Egyptian',
    convert: convertToEgyptian,
    symbols: egyptianSymbols,
    symbolNames: egyptianNames,
    range: [1, 9999999],
    base: 10,
    color: 'amber',
    era: '~3000 BC – 300 AD',
    region: 'Nile Valley',
    description: 'Additive hieroglyphic system',
    renderMode: 'horizontal',
  },
  babylonian: {
    id: 'babylonian',
    name: 'Babylonian',
    convert: convertToBabylonian,
    symbols: babylonianSymbols,
    range: [1, 12959999],
    base: 60,
    color: 'clay',
    era: '~2000 BC – 100 AD',
    region: 'Mesopotamia',
    description: 'Sexagesimal (base-60) cuneiform system',
    renderMode: 'grouped',
  },
  roman: {
    id: 'roman',
    name: 'Roman',
    convert: convertToRoman,
    symbols: romanSymbols,
    range: [1, 3999],
    base: 10,
    color: 'imperial',
    era: '~500 BC – 1500 AD',
    region: 'Roman Empire',
    description: 'Subtractive notation with letter symbols',
    renderMode: 'text',
  },
  chineseRod: {
    id: 'chineseRod',
    name: 'Chinese Rod',
    convert: convertToChineseRod,
    symbols: { vertical: verticalDigits, horizontal: horizontalDigits },
    range: [1, 99999],
    base: 10,
    color: 'vermilion',
    era: '~300 BC – 1600 AD',
    region: 'China',
    description: 'Decimal positional system using counting rods',
    renderMode: 'horizontal',
  },
  greekAttic: {
    id: 'greekAttic',
    name: 'Greek Attic',
    convert: convertToGreekAttic,
    symbols: atticSymbols,
    range: [1, 99999],
    base: 10,
    color: 'mediterranean',
    era: '~500 BC – 100 BC',
    region: 'Ancient Greece',
    description: 'Acrophonic additive system using initial letters',
    renderMode: 'text',
  },
  quipu: {
    id: 'quipu',
    name: 'Quipu',
    convert: convertToQuipu,
    symbols: quipuSymbols,
    range: [1, 99999],
    base: 10,
    color: 'inca',
    era: '~2600 BC – 1532 AD',
    region: 'Andes (Inca Empire)',
    description: 'Base-10 knotted-string recording system',
    renderMode: 'vertical',
  }
};

export const systemIds = Object.keys(numberSystems);
export const systemList = Object.values(numberSystems);
export default numberSystems;
