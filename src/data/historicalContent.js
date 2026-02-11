const historicalContent = {
  mayan: {
    overview: 'Maya scribes built a vigesimal positional numeral system that combines dots, bars, and a dedicated shell glyph for zero — one of the earliest explicit zero symbols.',
    facts: [
      'Digits 0–19 stack up to four dots (ones) over up to three bars (fives) plus the shell glyph for zero, so every higher position is a multiple of 20.',
      'Numbers are written vertically with the lowest place at the bottom; Long Count dates modify the third position to 18×20 (360) to match the tun calendar cycle.',
      'Stelae and codices rely on these numerals for precise calendar counts and astronomical tables, which is why the converter stacks place values.'
    ],
    usage: 'Base-20 arithmetic powered the Tzolk’in, Haab, and Long Count calendars and let astronomer-priests track solar and Venus cycles.',
    sources: [
      { title: 'Maya numerals (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Maya_numerals' },
      { title: 'MAA Convergence – The Mayan Number System', url: 'https://old.maa.org/press/periodicals/convergence/when-a-number-system-loses-uniqueness-the-case-of-the-maya-the-mayan-number-system' }
    ]
  },
  egyptian: {
    overview: 'Ancient Egyptian hieroglyphic numerals form an additive decimal scheme with distinct glyphs for each power of ten from a single stroke (1) up to the kneeling god Heh (1,000,000).',
    facts: [
      'Scribes repeat each power-of-ten glyph up to nine times, so quantities are read by adding repeated symbols with no positional weight or zero.',
      'The same glyph set inspired cursive hieratic writing seen in the Rhind Mathematical Papyrus, which tabulates fractions and practical problems for royal scribes.',
      'Iconic glyph names — stroke, heel bone, coil of rope, lotus, pointing finger, tadpole, and god Heh — tie arithmetic to objects from daily life and cosmology.'
    ],
    usage: 'Tax rolls, architectural tallies, and funerary inscriptions all used these additive numerals, so the converter mirrors that behavior by repeating symbols for every unit of a power of ten.',
    sources: [
      { title: 'Encyclopaedia Britannica – Egyptian numerals', url: 'https://www.britannica.com/science/numeral/Egyptian-numerals' },
      { title: 'MAA Convergence – The Rhind and Moscow Mathematical Papyri', url: 'https://old.maa.org/press/periodicals/convergence/mathematical-treasure-the-rhind-and-moscow-mathematical-papyri' }
    ]
  },
  babylonian: {
    overview: 'The Babylonian sexagesimal system represents digits 0–59 with just two cuneiform wedges (a unit wedge and a ten wedge) and assigns positional weight by powers of 60.',
    facts: [
      'Each place represents 1, 60, 3,600, 216,000, and so on, so clay tablets group wedge clusters for each base-60 digit.',
      'Digits 1–9 repeat the unit wedge while 10, 20, 30, 40, and 50 repeat the corner wedge; combinations fill out all values through 59.',
      'Early scribes left blank gaps for zero and later added a double-wedge placeholder between non-zero digits, though trailing zeros stayed implicit.'
    ],
    usage: 'Astronomers, surveyors, and merchants relied on sexagesimal place value for ephemerides, land measures, and interest tables — the converter therefore outputs four base-60 groups up to 12,959,999.',
    sources: [
      { title: 'Encyclopaedia Britannica – Babylonian numerals', url: 'https://www.britannica.com/science/numeral/Babylonian-numerals' },
      { title: 'Sexagesimal (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Sexagesimal' }
    ]
  },
  roman: {
    overview: 'Roman numerals descend from Etruscan tally marks and use seven Latin letters (I, V, X, L, C, D, M) to encode values without positional notation or zero.',
    facts: [
      'Numbers accumulate symbols in descending order; to avoid four repeats, later conventions introduced subtractive pairs such as IV, IX, XL, XC, CD, and CM.',
      'A horizontal vinculum drawn above a numeral multiplies it by 1,000 when inscriptions need values above 3,999.',
      'Because no symbol for zero exists, blank spaces or words had to convey nothingness, so everyday usage stayed within a few thousand.'
    ],
    usage: 'Merchants, legionaries, and stonecutters throughout the Roman world used this additive/subtractive system for ledgers and monuments, so the converter enforces the classical 1–3,999 range.',
    sources: [
      { title: 'Encyclopaedia Britannica – Roman numerals', url: 'https://www.britannica.com/topic/Roman-numeral' },
      { title: 'Story of Mathematics – Roman Numerals', url: 'https://www.storyofmathematics.com/roman.html/' }
    ]
  },
  chineseRod: {
    overview: 'Chinese counting rod numerals implement a decimal positional system by laying bamboo rods on a counting board with alternating orientations for adjacent places.',
    facts: [
      'Ones, hundreds, and ten-thousands use vertical rods while tens and thousands lie horizontally to stop digits from blending.',
      'A blank cell indicates zero; mathematical texts later mention using a small circle symbol to keep the board aligned when no rods occupy a place.',
      'Red rods denoted positive quantities and black rods denoted negative, enabling signed arithmetic and linear-equation solving in works such as The Nine Chapters.'
    ],
    usage: 'Counting boards supported imperial administration, taxation, and astronomy until the abacus spread, which is why the converter alternates vertical and horizontal glyphs and shows a visible zero placeholder for clarity.',
    sources: [
      { title: 'Counting rod numerals (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Counting_rods' },
      { title: 'MAA Convergence – The Nine Chapters: Numbers and Units', url: 'https://old.maa.org/press/periodicals/convergence/a-classic-from-china-the-nine-chapters-numbers-and-units' }
    ]
  },
  greekAttic: {
    overview: 'Greek Attic (acrophonic) numerals spell numbers with the first letters of number words — Ι (1), Π (5), Δ (10), Η (100), Χ (1,000), Μ (10,000) — plus ligatures for multiples of five.',
    facts: [
      'Values add together without subtraction or zero, so numerals concatenate descending glyphs much like Roman numerals.',
      'Ligatures such as ΠΔ (50), ΠΗ (500), ΠΧ (5,000), and ΜΠ (50,000) mark “five times” a base power of ten.',
      'The system dominated Athenian decrees and financial inscriptions from roughly the 7th to 3rd centuries BCE before the Ionian alphabetic numerals replaced it.'
    ],
    usage: 'Because totals were tracked in stone account boards and tribute records, the converter repeats the Attic glyphs exactly as ancient clerks would have carved them.',
    sources: [
      { title: 'MacTutor – Greek Numbers', url: 'https://mathshistory.st-andrews.ac.uk/HistTopics/Greek_numbers/' },
      { title: 'EpiDoc Guidelines – Acrophonic Numbers', url: 'https://epidoc.stoa.org/gl/latest/trans-numacrophonic.html' }
    ]
  },
  quipu: {
    overview: 'Quipu (khipu) are knotted-string devices used across the Andes for centuries before and throughout the Inca Empire to record numerical and possibly narrative information using a base-10 positional system.',
    facts: [
      'Turns within a long knot indicate digits 2–9 in the ones place; a figure-eight knot marks a fixed value of 1; simple overhead (granny) knots in clusters mark tens, hundreds, and thousands; and a missing knot at any position equals zero.',
      'Secondary pendant strings could hang from any cord to flag exceptions or subordinate data — for instance, a sub-pendant might note damaged goods within a storehouse tally.',
      'Individual quipu could be joined together into meaningful sequences: a master cord might bind dozens of pendant cords, each representing a different village or commodity in a provincial census.'
    ],
    usage: 'Inca administrators (quipucamayocs) used quipu for census tallies, tribute records, and storehouse inventories across the empire\'s road network — the converter maps each decimal digit to its corresponding knot type and position.',
    sources: [
      { title: 'Quipu (Wikipedia)', url: 'https://en.wikipedia.org/wiki/Quipu' },
      { title: 'Quipu – World History Encyclopedia', url: 'https://www.worldhistory.org/Quipu/' }
    ]
  }
};

export default historicalContent;
