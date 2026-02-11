function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderReportModal(context) {
  const { systemName, number, result } = context;

  return `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4" id="report-overlay">
      <div class="absolute inset-0 bg-black/40" data-action="report-close"></div>
      <div class="relative bg-parchment rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 animate-modalIn">
        <div class="flex items-center justify-between">
          <h3 class="font-cinzel text-lg text-stone-800">Report an Issue</h3>
          <button data-action="report-close" class="text-stone-400 hover:text-stone-600 text-xl leading-none">&times;</button>
        </div>

        <div class="text-sm font-crimson text-stone-500 space-y-1">
          <p>System: <strong class="text-stone-700">${esc(systemName)}</strong></p>
          <p>Number: <strong class="text-stone-700">${esc(String(number))}</strong></p>
          <p>Result: <strong class="text-stone-700">${esc(result)}</strong></p>
        </div>

        <div class="space-y-3">
          <label class="block">
            <span class="font-crimson text-sm text-stone-600">Issue type</span>
            <select id="report-type"
              class="mt-1 w-full px-3 py-2 bg-white border border-stone-300 rounded-lg
                font-crimson text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400">
              <option value="incorrect-result">Incorrect conversion result</option>
              <option value="wrong-explanation">Wrong step explanation</option>
              <option value="rendering-issue">Rendering / display issue</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label class="block">
            <span class="font-crimson text-sm text-stone-600">Details (optional)</span>
            <textarea id="report-details" rows="3" placeholder="Describe the issue..."
              class="mt-1 w-full px-3 py-2 bg-white border border-stone-300 rounded-lg
                font-crimson text-stone-800 placeholder-stone-400 resize-none
                focus:outline-none focus:ring-2 focus:ring-stone-400"></textarea>
          </label>
        </div>

        <div class="flex justify-end gap-3">
          <button data-action="report-close"
            class="px-4 py-2 font-cinzel text-sm text-stone-600 hover:text-stone-800 transition-colors">Cancel</button>
          <button data-action="report-submit"
            class="px-5 py-2 bg-stone-700 text-parchment-light font-cinzel text-sm
              rounded-lg hover:bg-stone-600 transition-colors shadow-md">Submit Report</button>
        </div>
      </div>
    </div>`;
}
