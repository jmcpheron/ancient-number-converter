import { systemList } from '../data/numberSystems.js';
import { renderConversionDisplay } from './ConversionDisplay.js';

export function renderComparisonView(number) {
  const cards = systemList.map(system =>
    `<div class="transition-all duration-300 animate-fadeIn">
      ${renderConversionDisplay(system.id, number)}
    </div>`
  ).join('');

  return `<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">${cards}</div>`;
}
