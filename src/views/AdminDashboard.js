// ============================================================
// View: Admin Dashboard
// ============================================================

import { getDashboardStats, getAllReports } from '../core/store.js';

export function renderAdminDashboard() {
    const container = document.getElementById('appMain');
    const stats = getDashboardStats();
    const reports = getAllReports();

    container.innerHTML = `
    <div style="margin-bottom:var(--space-6);">
      <h2 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);">Admin Dashboard</h2>
      <p style="font-size:var(--font-size-sm);color:var(--color-text-muted);">Procedure analytics and audit data</p>
    </div>

    <!-- Filters -->
    <div class="filter-bar">
      <div class="form-group">
        <label class="form-label">From Date</label>
        <input type="date" class="form-input" id="filterFrom" />
      </div>
      <div class="form-group">
        <label class="form-label">To Date</label>
        <input type="date" class="form-input" id="filterTo" />
      </div>
      <button class="btn btn-outline btn-sm" id="applyFilter" style="align-self:flex-end;">Apply Filter</button>
      <button class="btn btn-ghost btn-sm" id="clearFilter" style="align-self:flex-end;">Clear</button>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid" id="statsGrid">
      ${renderStatCards(stats)}
    </div>

    <!-- Procedure Breakdown -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📊</div>
        <div>
          <div class="section-card-title">Procedure Breakdown</div>
          <div class="section-card-subtitle">Distribution of procedures by type</div>
        </div>
      </div>
      <div id="procedureBreakdown">
        ${renderProcedureBreakdown(stats)}
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📋</div>
        <div>
          <div class="section-card-title">Recent Activity</div>
          <div class="section-card-subtitle">Last 10 reports</div>
        </div>
      </div>
      <div id="recentReports">
        ${renderRecentTable(reports.slice(0, 10))}
      </div>
    </div>
  `;

    // Filter events
    container.querySelector('#applyFilter')?.addEventListener('click', () => {
        const from = container.querySelector('#filterFrom')?.value;
        const to = container.querySelector('#filterTo')?.value;
        const filtered = getDashboardStats(from, to);
        container.querySelector('#statsGrid').innerHTML = renderStatCards(filtered);
        container.querySelector('#procedureBreakdown').innerHTML = renderProcedureBreakdown(filtered);
    });

    container.querySelector('#clearFilter')?.addEventListener('click', () => {
        container.querySelector('#filterFrom').value = '';
        container.querySelector('#filterTo').value = '';
        const all = getDashboardStats();
        container.querySelector('#statsGrid').innerHTML = renderStatCards(all);
        container.querySelector('#procedureBreakdown').innerHTML = renderProcedureBreakdown(all);
    });
}

function renderStatCards(stats) {
    return `
    <div class="stat-card">
      <div class="stat-icon">📋</div>
      <div class="stat-value">${stats.total}</div>
      <div class="stat-label">Total Procedures</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color:var(--color-accent);">${stats.avgContrast}</div>
      <div class="stat-label">Avg Contrast (ml)</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color:var(--color-warning);">${stats.avgRadiation}</div>
      <div class="stat-label">Avg Radiation Dose</div>
    </div>
    <div class="stat-card">
      <div class="stat-value" style="color:${parseFloat(stats.complicationRate) > 5 ? 'var(--color-danger)' : 'var(--color-success)'};">${stats.complicationRate}%</div>
      <div class="stat-label">Complication Rate</div>
    </div>
  `;
}

function renderProcedureBreakdown(stats) {
    const labels = {
        CAG: 'Coronary Angiography',
        PCI: 'PCI / Angioplasty',
        RHC: 'Right Heart Catheterization',
        TPM: 'Temporary Pacemaker',
    };

    const colors = {
        CAG: '#0D6EBF',
        PCI: '#0A9396',
        RHC: '#6A4C93',
        TPM: '#C07A00',
    };

    const total = stats.total || 1;
    const entries = Object.entries(stats.byProcedure);

    if (entries.length === 0) {
        return '<p style="color:var(--color-text-muted);padding:var(--space-4);">No data available</p>';
    }

    return `
    <div style="display:flex;flex-direction:column;gap:var(--space-4);padding:var(--space-2) 0;">
      ${entries.map(([code, count]) => {
        const pct = ((count / total) * 100).toFixed(0);
        return `
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1);">
              <span style="font-size:var(--font-size-sm);font-weight:var(--font-weight-medium);">${labels[code] || code}</span>
              <span style="font-size:var(--font-size-sm);color:var(--color-text-muted);">${count} (${pct}%)</span>
            </div>
            <div style="height:8px;background:var(--color-surface-alt);border-radius:4px;overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:${colors[code] || '#888'};border-radius:4px;transition:width 0.5s ease;"></div>
            </div>
          </div>
        `;
    }).join('')}
    </div>
  `;
}

function renderRecentTable(reports) {
    if (reports.length === 0) {
        return '<p style="color:var(--color-text-muted);padding:var(--space-4);">No recent reports</p>';
    }

    return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Patient</th>
          <th>UHID</th>
          <th>Procedure</th>
          <th>Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${reports.map(r => `
          <tr>
            <td>${r.patientName || '–'}</td>
            <td>${r.uhid || '–'}</td>
            <td>${r.procedure || '–'}</td>
            <td>${r.date || '–'}</td>
            <td><span class="alert-badge ${r.status === 'submitted' ? 'normal' : 'info'}">${r.status || 'draft'}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
