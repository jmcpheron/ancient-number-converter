const historicalContent = {
  mayan: {
    overview: 'The Maya civilization developed one of the most sophisticated numeral systems in the ancient world. Their vigesimal (base-20) system was one of the first to include a true zero — centuries before the concept appeared in Old World mathematics.',
    facts: [
      'The Mayan zero (represented by a shell glyph) predates the Indian zero by several centuries',
      'Used primarily for astronomical calculations and the famous Long Count calendar',
      'Numbers were written vertically, with the lowest values at the bottom',
      'The system used only three symbols: a dot (1), a bar (5), and a shell (0)',
      'Mayan astronomers calculated the length of the solar year to within seconds of modern measurements'
    ],
    usage: 'The system was integral to Mayan astronomy, architecture, and their complex calendar systems including the Tzolkin (260-day) and Haab (365-day) cycles.'
  },
  egyptian: {
    overview: 'Ancient Egyptian hieroglyphic numerals were a purely additive decimal system. Each power of 10 had its own distinct symbol drawn from nature and daily life — strokes, coils of rope, lotus flowers, and even a figure of a god for one million.',
    facts: [
      'Hieroglyphic numbers could be written left-to-right, right-to-left, or top-to-bottom',
      'The symbol for 1,000,000 depicts a man kneeling with raised arms — the god Heh',
      'Fractions used the Eye of Horus, with each piece representing a power of 1/2',
      'Scribes used a shorthand hieratic script for everyday calculations',
      'The Rhind Mathematical Papyrus (c. 1550 BC) shows sophisticated use of fractions and algebra'
    ],
    usage: 'Used extensively in record-keeping, taxation, construction planning (including the pyramids), and religious texts carved into temple walls.'
  },
  babylonian: {
    overview: 'The Babylonian number system was sexagesimal (base-60) — an influence that persists today in our 60-second minutes and 360-degree circles. Written on clay tablets using a wedge-shaped stylus, it was one of the earliest positional number systems.',
    facts: [
      'Our modern timekeeping (60 seconds, 60 minutes) directly derives from this system',
      'Babylonians had no true zero initially — they used a space, which sometimes caused ambiguity',
      'They compiled multiplication tables, square root tables, and even tables of Pythagorean triples',
      'The famous tablet Plimpton 322 (c. 1800 BC) contains a list of Pythagorean triples',
      'Base-60 was likely chosen because 60 has many divisors (1,2,3,4,5,6,10,12,15,20,30,60)'
    ],
    usage: 'Used for astronomy, land surveying, trade calculations, and architectural planning throughout the Mesopotamian empires.'
  },
  roman: {
    overview: 'Roman numerals evolved from Etruscan number symbols and became the standard numbering system across the Roman Empire. While not positional, the subtractive principle (IV instead of IIII) made them more compact than purely additive systems.',
    facts: [
      'Subtractive notation (e.g., IV for 4) was not consistently used until the Middle Ages',
      'Romans had no symbol for zero — the concept was foreign to their mathematics',
      'Larger numbers sometimes used a vinculum (bar above) to multiply by 1,000',
      'Roman numerals are still used today for clock faces, movie sequels, and Super Bowl numbering',
      'The longest Roman numeral year in modern times is MDCCCLXXXVIII (1888)'
    ],
    usage: 'Used for commerce, military record-keeping, monumental inscriptions, and dating throughout the Roman Empire and medieval Europe.'
  },
  chineseRod: {
    overview: 'Chinese counting rods (算筹, suàn chóu) were physical sticks arranged on a counting board. Vertical and horizontal orientations alternated by place value to avoid confusion — a clever solution to prevent adjacent digits from blurring together.',
    facts: [
      'Rod numerals are arguably the first true decimal positional system',
      'Negative numbers were represented using red rods (positive) and black rods (negative)',
      'The alternating vertical/horizontal pattern prevented misreading adjacent digits',
      'Chinese mathematicians used rod numerals to solve systems of linear equations',
      'The Sunzi Suanjing (3rd–5th century AD) contains the earliest known Chinese remainder theorem'
    ],
    usage: 'Used by Chinese scholars, merchants, and government officials for calculations on counting boards for over 1,500 years before the abacus became dominant.'
  },
  greekAttic: {
    overview: 'Greek Attic (or Acrophonic) numerals used the initial letters of Greek number words: Π for pente (5), Δ for deka (10), Η for hekaton (100). This mnemonic system preceded the more famous alphabetic Greek numerals.',
    facts: [
      'Called "acrophonic" because symbols are the first letters of the Greek words for each number',
      'Compound symbols like 𐅂 (50) combine the base letter with Π for "five times"',
      'Used widely in Athenian inscriptions, especially for financial records',
      'Replaced by the Greek alphabetic system (α=1, β=2, γ=3...) around 100 BC',
      'The system was purely additive — no subtractive principle like Roman numerals'
    ],
    usage: 'Primarily used in Athens and surrounding regions for public inscriptions, financial accounts, and official documents from the 5th century BC onward.'
  }
};

export default historicalContent;
