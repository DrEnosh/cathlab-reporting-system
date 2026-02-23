// ============================================================
// View: Report List
// ============================================================

import { getAllReports, searchReports, deleteReport } from '../core/store.js';
import { downloadPDF } from '../core/pdf.js';
import { showToast } from '../core/utils.js';

const PROCEDURE_LABELS = {
    CAG: 'Coronary Angiography',
    PCI: 'PCI / Angioplasty',
    RHC: 'Right Heart Catheterization',
    TPM: 'Temporary Pacemaker',
};

const PROCEDURE_ICONS = {
    CAG: '🫀',
    PCI: '💉',
    RHC: '🫁',
    TPM: '⚡',
};

export function renderReportList() {
    const container = document.getElementById('appMain');
    const reports = getAllReports();

    container.innerHTML = `
    <div class="report-list-header">
      <div>
        <h2 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);">Saved Reports</h2>
        <p style="font-size:var(--font-size-sm);color:var(--color-text-muted);">${reports.length} report${reports.length !== 1 ? 's' : ''} found</p>
      </div>
      <div class="search-bar" id="searchBar">
        <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        <input type="text" id="searchInput" placeholder="Search by UHID or Patient Name..." />
      </div>
    </div>

    <div id="reportsList">
      ${renderReportItems(reports)}
    </div>
  `;

    // Search
    const searchInput = container.querySelector('#searchInput');
    searchInput?.addEventListener('input', () => {
        const query = searchInput.value;
        const results = searchReports(query);
        container.querySelector('#reportsList').innerHTML = renderReportItems(results);
        attachReportActions(container);
    });

    attachReportActions(container);
}

function renderReportItems(reports) {
    if (reports.length === 0) {
        return `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <h3>No Reports Found</h3>
        <p>Create your first report by clicking "New Report" in the navigation.</p>
      </div>
    `;
    }

    return reports.map(r => `
    <div class="report-item" data-id="${r.id}">
      <div class="report-item-info">
        <div class="patient-name">
          ${PROCEDURE_ICONS[r.procedure] || '📄'} ${r.patientName || 'Unnamed Patient'}
        </div>
        <div class="meta">
          <span class="alert-badge ${r.status === 'submitted' ? 'normal' : 'info'}">${r.status === 'submitted' ? 'Submitted' : 'Draft'}</span>
          <span>${PROCEDURE_LABELS[r.procedure] || r.procedure}</span>
          <span>UHID: ${r.uhid || '–'}</span>
          <span>${r.date || ''}</span>
          <span style="font-size:0.7rem;color:var(--color-text-muted);">${r.id}</span>
        </div>
      </div>
      <div class="report-item-actions">
        <button class="btn btn-ghost btn-sm edit-report-btn" data-id="${r.id}" title="Edit Report">✏️ Edit</button>
        <button class="btn btn-ghost btn-sm pdf-report-btn" data-id="${r.id}" title="Download PDF">📄 PDF</button>
        <button class="btn btn-ghost btn-sm delete-report-btn" data-id="${r.id}" title="Delete Report" style="color:var(--color-danger);">🗑️</button>
      </div>
    </div>
  `).join('');
}

function attachReportActions(container) {
    container.querySelectorAll('.edit-report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = `#/report/${btn.dataset.id}`;
        });
    });

    container.querySelectorAll('.pdf-report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const reports = getAllReports();
            const report = reports.find(r => r.id === btn.dataset.id);
            if (report) {
                downloadPDF(report);
                showToast('PDF downloaded', 'success');
            }
        });
    });

    container.querySelectorAll('.delete-report-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
                deleteReport(btn.dataset.id);
                showToast('Report deleted', 'warning');
                renderReportList();
            }
        });
    });
}
