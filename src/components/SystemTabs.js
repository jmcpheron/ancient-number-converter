import { systemList } from '../data/numberSystems.js';

const colorMap = {
  jungle: 'border-jungle bg-jungle/10 text-green-900',
  amber: 'border-amber bg-amber/10 text-amber-900',
  clay: 'border-clay bg-clay/10 text-yellow-900',
  imperial: 'border-imperial bg-imperial/10 text-purple-900',
  vermilion: 'border-vermilion bg-vermilion/10 text-red-900',
  mediterranean: 'border-mediterranean bg-mediterranean/10 text-blue-900',
  inca: 'border-inca bg-inca/10 text-orange-900',
};

const inactiveColor = 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300';

export function renderSystemTabs(activeTab, showCompare) {
  const tabs = systemList.map((system) => {
    const active = activeTab === system.id && !showCompare;
    const cls = active ? colorMap[system.color] : inactiveColor;
    return `<button data-tab="${system.id}"
      class="px-3 py-2 font-cinzel text-sm md:text-base border-b-3 transition-all duration-200 ${cls}">
      ${system.name}
    </button>`;
  }).join('');

  const compareCls = showCompare ? 'border-stone-700 bg-stone-100 text-stone-900' : inactiveColor;

  return `
    <div class="space-y-2">
      <div class="flex flex-wrap gap-1 border-b-2 border-stone-200">
        ${tabs}
        <button data-action="toggle-compare"
          class="px-3 py-2 font-cinzel text-sm md:text-base border-b-3 transition-all duration-200 ml-auto ${compareCls}">
          Compare All
        </button>
      </div>
    </div>`;
}
