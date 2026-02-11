const STORAGE_KEY = 'ancient-number-converter-reports';

function esc(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function getReports() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveReport(report) {
  const reports = getReports();
  reports.push({ ...report, id: Date.now(), timestamp: new Date().toISOString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function deleteReport(id) {
  const reports = getReports().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

export function exportReports() {
  const reports = getReports();
  if (reports.length === 0) return '';

  const lines = ['Ancient Number Converter — Issue Reports', '='.repeat(45), ''];
  for (const r of reports) {
    lines.push(`[${r.timestamp}] ${r.systemName} — ${r.number}`);
    lines.push(`  Type: ${r.type}`);
    lines.push(`  Result: ${r.result}`);
    if (r.details) lines.push(`  Details: ${r.details}`);
    lines.push('');
  }
  return lines.join('\n');
}

const typeLabels = {
  'incorrect-result': 'Incorrect result',
  'wrong-explanation': 'Wrong explanation',
  'rendering-issue': 'Rendering issue',
  'other': 'Other',
};

export function renderReportsPanel() {
  const reports = getReports();

  const listHtml = reports.length === 0
    ? '<p class="font-crimson text-stone-400 italic text-center py-6">No reports submitted yet.</p>'
    : reports.map(r => `
        <div class="flex items-start gap-3 p-3 bg-white/50 rounded-lg border border-stone-200">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-cinzel text-sm text-stone-800">${esc(r.systemName)}</span>
              <span class="font-crimson text-xs text-stone-400">#${esc(String(r.number))}</span>
              <span class="px-1.5 py-0.5 text-xs font-crimson bg-stone-100 text-stone-500 rounded">${esc(typeLabels[r.type] || r.type)}</span>
            </div>
            ${r.details ? `<p class="font-crimson text-sm text-stone-600 mt-1 truncate">${esc(r.details)}</p>` : ''}
            <p class="font-crimson text-xs text-stone-400 mt-1">${new Date(r.timestamp).toLocaleString()}</p>
          </div>
          <button data-action="report-delete" data-report-id="${r.id}"
            class="text-stone-400 hover:text-red-500 transition-colors text-lg leading-none shrink-0"
            title="Delete report">&times;</button>
        </div>`).join('');

  return `
    <div class="space-y-4" id="reports-panel">
      <div class="flex items-center justify-between">
        <h3 class="font-cinzel text-sm text-stone-600 uppercase tracking-wider">Submitted Reports (${reports.length})</h3>
        ${reports.length > 0 ? `
          <button data-action="reports-export"
            class="px-3 py-1 text-xs font-crimson text-stone-500 border border-stone-300 rounded-lg
              hover:bg-stone-100 transition-colors">Export All</button>` : ''}
      </div>
      <div class="space-y-2">${listHtml}</div>
    </div>`;
}
