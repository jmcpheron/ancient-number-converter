import numberSystems from '../data/numberSystems.js';

export function renderNumberInput(value, activeSystem) {
  const system = numberSystems[activeSystem];
  const [min, max] = system ? system.range : [0, 9999999];

  const num = parseInt(value, 10);
  const sliderVal = isNaN(num) ? min : Math.max(min, Math.min(num, Math.min(max, 9999)));
  const isOutOfRange = !isNaN(num) && (num < min || num > max);

  const rangeInfo = system
    ? `<span class="text-stone-400">Valid range: ${min.toLocaleString()} – ${max.toLocaleString()}</span>`
    : '';

  const errorMsg = isOutOfRange
    ? `<p class="text-red-700 text-sm font-crimson bg-red-50 px-3 py-2 rounded-lg border border-red-200">
        ${system.name} numerals only support ${min.toLocaleString()} – ${max.toLocaleString()}
      </p>`
    : '';

  return `
    <div class="space-y-3">
      <div class="flex gap-3">
        <input
          type="number"
          inputmode="numeric"
          pattern="[0-9]*"
          id="number-input"
          value="${value}"
          placeholder="Enter a number..."
          class="flex-1 px-4 py-3 bg-parchment-light/50 border-2 border-stone-300 rounded-lg
            font-crimson text-lg text-stone-800 placeholder-stone-400
            focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400
            transition-colors"
        />
        <button
          data-action="random"
          class="px-4 py-3 bg-stone-700 text-parchment-light font-cinzel text-sm
            rounded-lg hover:bg-stone-600 transition-colors shadow-md"
          title="Random number"
        >
          Random
        </button>
      </div>

      <input
        type="range"
        id="number-slider"
        min="${min}"
        max="${Math.min(max, 9999)}"
        value="${sliderVal}"
        class="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-stone-600"
      />

      <div class="flex justify-between text-xs font-crimson text-stone-500">
        <span>${min.toLocaleString()}</span>
        <span>${rangeInfo}</span>
        <span>${Math.min(max, 9999).toLocaleString()}</span>
      </div>

      ${errorMsg}
    </div>`;
}
