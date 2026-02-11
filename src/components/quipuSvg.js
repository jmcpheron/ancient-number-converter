// SVG rendering for Quipu knotted-cord display.
// Replaces all three CSS/Unicode cord renderers with a single module.
// Data layer (converter, parser, tests) is completely untouched.

let _id = 0;
function uid() { return 'qp' + (_id++); }

// ── colour palettes ──────────────────────────────────────────────

const PAL = {
  normal: {
    cordLight: '#A0724A', cordMid: '#8B5E3C', cordDark: '#6B4226',
    knotFill: '#5C3A1E', knotStroke: '#3D2510', wrapLine: '#C4956A',
    label: '#78716C',
  },
  neutral: {
    cordLight: '#9CA3AF', cordMid: '#6B7280', cordDark: '#4B5563',
    knotFill: '#6B7280', knotStroke: '#4B5563', wrapLine: '#9CA3AF',
    label: '#9CA3AF',
  },
};

// ── knot cluster height (native px) ─────────────────────────────

function clusterH(sym) {
  if (sym === '\u2014') return 8;                          // zero
  if (sym === '\u221E') return 22;                         // figure-eight
  if (sym[0] === '\u25CE') return 14 + sym.length * 5;    // long knot
  if (sym[0] === '\u25CF') {                               // simple knots
    const n = sym.length;
    return n * 8 + (n - 1) * 3;
  }
  return 10;
}

// ── individual knot drawers ─────────────────────────────────────

function drawSimpleKnots(cx, y0, count, c) {
  let s = '';
  for (let i = 0; i < count; i++) {
    const cy = y0 + i * 11 + 4;
    s += `<ellipse cx="${cx}" cy="${cy}" rx="7" ry="4" fill="${c.knotFill}" stroke="${c.knotStroke}" stroke-width="1"/>`;
  }
  return s;
}

function drawLongKnot(cx, y0, turns, c) {
  const w = 14, rx = 7;
  const h = 14 + turns * 5;
  const x = cx - w / 2;
  let s = `<rect x="${x}" y="${y0}" width="${w}" height="${h}" rx="${rx}" fill="${c.knotFill}" stroke="${c.knotStroke}" stroke-width="1"/>`;
  // countable wrap lines
  const spacing = (h - 6) / (turns + 1);
  for (let i = 1; i <= turns; i++) {
    const ly = y0 + i * spacing + 3;
    s += `<line x1="${x + 3}" y1="${ly}" x2="${x + w - 3}" y2="${ly}" stroke="${c.wrapLine}" stroke-width="0.8" opacity="0.8"/>`;
  }
  return s;
}

function drawFigureEight(cx, y0, c) {
  const r = 5.5;
  const cy1 = y0 + r;
  const cy2 = y0 + 22 - r;
  return `<ellipse cx="${cx}" cy="${cy1}" rx="${r}" ry="${r}" fill="none" stroke="${c.knotStroke}" stroke-width="1.5"/>` +
         `<ellipse cx="${cx}" cy="${cy2}" rx="${r}" ry="${r}" fill="none" stroke="${c.knotStroke}" stroke-width="1.5"/>`;
}

function drawZero(cx, y0, c) {
  const cy = y0 + 4;
  return `<line x1="${cx - 5}" y1="${cy}" x2="${cx + 5}" y2="${cy}" stroke="${c.knotStroke}" stroke-width="1" stroke-dasharray="2,2" opacity="0.25"/>`;
}

function drawCluster(cx, y0, sym, c) {
  if (sym === '\u2014') return drawZero(cx, y0, c);
  if (sym === '\u221E') return drawFigureEight(cx, y0, c);
  if (sym[0] === '\u25CE') return drawLongKnot(cx, y0, sym.length, c);
  if (sym[0] === '\u25CF') return drawSimpleKnots(cx, y0, sym.length, c);
  return '';
}

// ── standalone knot SVG (for Legend cells) ──────────────────────

/**
 * Render a standalone SVG showing a knot cluster on a faint mini-cord.
 * Used in Legend.js for knot-type illustrations.
 */
export function svgKnotCluster(sym) {
  const c = PAL.normal;
  const h = clusterH(sym);
  const nativeW = 24;
  const cx = 12;

  let inner = `<rect x="${cx - 2}" y="0" width="4" height="${h}" rx="2" fill="${c.cordMid}" opacity="0.35"/>`;
  inner += drawCluster(cx, 0, sym, c);

  // cap display height at 48px for large clusters, scale to fit
  const maxH = 48;
  if (h <= maxH) {
    return `<svg width="${nativeW}" height="${h}" viewBox="0 0 ${nativeW} ${h}">${inner}</svg>`;
  }
  const scale = maxH / h;
  return `<svg width="${Math.round(nativeW * scale)}" height="${maxH}" viewBox="0 0 ${nativeW} ${h}">${inner}</svg>`;
}

// ── full cord renderer ──────────────────────────────────────────

/**
 * Render a complete Quipu cord as an inline SVG.
 * Replaces renderCord(), renderQuizCord(), and renderCordCompact().
 *
 * @param {string[]} result  converter output (ones at index 0, ascending)
 * @param {{ compact?: boolean, neutral?: boolean }} options
 */
export function renderSvgCord(result, options = {}) {
  const { compact = false, neutral = false } = options;
  const id = uid();
  const c = neutral ? PAL.neutral : PAL.normal;
  const showLabels = !neutral;

  const placeLabels = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];
  const displayed = [...result].reverse(); // highest place first (top of cord)

  // layout constants (native px, compact scales via viewBox)
  const cordW = 6;
  const cordX = 40;                       // x-center of cord
  const svgW = showLabels ? 140 : 80;
  const topH = 18;
  const gapH = 14;
  const bottomH = 14;
  const taperH = 8;
  const topBarW = 22;
  const topBarH = 4;

  // first pass — compute y positions
  const positions = [];
  let y = topH;
  for (let i = 0; i < displayed.length; i++) {
    y += gapH;
    const sym = displayed[i];
    const posIdx = displayed.length - 1 - i;
    const label = placeLabels[posIdx] || '';
    const h = clusterH(sym);
    positions.push({ y, h, sym, label });
    y += h;
  }
  const cordBot = y + bottomH;
  const totalH = cordBot + taperH;

  // compact: draw at native coords, shrink display size
  const scale = compact ? 0.65 : 1;
  const dispW = Math.round(svgW * scale);
  const dispH = Math.round(totalH * scale);

  // ── build SVG ──
  let svg = `<svg width="${dispW}" height="${dispH}" viewBox="0 0 ${svgW} ${totalH}" xmlns="http://www.w3.org/2000/svg" class="block mx-auto" role="img" aria-label="Quipu cord">`;

  // gradient for cord
  svg += `<defs><linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0">`;
  svg += `<stop offset="0%" stop-color="${c.cordLight}"/>`;
  svg += `<stop offset="50%" stop-color="${c.cordMid}"/>`;
  svg += `<stop offset="100%" stop-color="${c.cordDark}"/>`;
  svg += `</linearGradient></defs>`;

  // main cord body
  const cX = cordX - cordW / 2;
  svg += `<rect x="${cX}" y="${topH}" width="${cordW}" height="${cordBot - topH}" rx="${cordW / 2}" fill="url(#${id}g)"/>`;

  // bottom taper
  const tw = 2;
  svg += `<polygon points="${cordX - tw},${cordBot} ${cordX + tw},${cordBot} ${cordX},${totalH}" fill="${c.cordDark}" opacity="0.35"/>`;

  // top attachment bar
  svg += `<rect x="${cordX - topBarW / 2}" y="${topH - topBarH}" width="${topBarW}" height="${topBarH}" rx="2" fill="url(#${id}g)" opacity="0.75"/>`;

  // knot clusters + labels
  for (const pos of positions) {
    svg += drawCluster(cordX, pos.y, pos.sym, c);

    if (showLabels) {
      const labelX = cordX + 18;
      const labelY = pos.y + pos.h / 2;
      svg += `<text x="${labelX}" y="${labelY}" font-family="'Crimson Text',Georgia,serif" font-size="11" fill="${c.label}" dominant-baseline="central">${pos.label}</text>`;
    }
  }

  svg += '</svg>';
  return `<div class="flex justify-center">${svg}</div>`;
}
