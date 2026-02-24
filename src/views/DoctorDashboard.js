// ============================================================
// View: Doctor Dashboard
// ============================================================

import { getAllReports } from '../core/store.js';

export function renderDoctorDashboard() {
    const container = document.getElementById('appMain');
    const reports = getAllReports();

    // For the presentation, let's assume the current doctor is "Dr. Smith"
    const doctorName = "Dr. Smith";
    const myReports = reports.filter(r => r.operator === doctorName || !r.operator); // fallback to all for demo if operator not set

    const pendingSignatures = myReports.filter(r => r.status === 'draft');
    const completedReports = myReports.filter(r => r.status === 'submitted');

    container.innerHTML = `
    <div style="margin-bottom:var(--space-6);">
      <h2 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);">Welcome back, ${doctorName}</h2>
      <p style="font-size:var(--font-size-sm);color:var(--color-text-muted);">Here is your clinical overview for today.</p>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card" style="border-left: 4px solid var(--color-primary);">
        <div class="stat-icon">🕒</div>
        <div class="stat-value" style="color:var(--color-primary);">${pendingSignatures.length}</div>
        <div class="stat-label">Pending Signatures & Drafts</div>
      </div>
      <div class="stat-card" style="border-left: 4px solid var(--color-success);">
        <div class="stat-icon">✅</div>
        <div class="stat-value" style="color:var(--color-success);">${completedReports.length}</div>
        <div class="stat-label">Reports Finalized</div>
      </div>
      <div class="stat-card" style="border-left: 4px solid var(--color-accent);">
        <div class="stat-icon">📋</div>
        <div class="stat-value">${myReports.length}</div>
        <div class="stat-label">Total Procedures</div>
      </div>
    </div>

    <!-- Action Required Section -->
    ${pendingSignatures.length > 0 ? `
    <div class="section-card" style="margin-top:var(--space-6); border: 1px solid var(--color-warning);">
      <div class="section-card-header">
        <div class="section-card-icon">⚠️</div>
        <div>
          <div class="section-card-title">Action Required</div>
          <div class="section-card-subtitle">Reports waiting for your final signature</div>
        </div>
      </div>
      <div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Procedure</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${pendingSignatures.map(r => `
              <tr>
                <td>${r.patientName || 'Unknown Patient'}</td>
                <td>${r.procedure || '–'}</td>
                <td>${r.date || '–'}</td>
                <td>
                  <button class="btn btn-primary btn-sm finish-draft-btn" data-id="${r.id}">Review & Sign</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
    ` : ''}

    <!-- Recent Cases -->
    <div class="section-card" style="margin-top:var(--space-6);">
      <div class="section-card-header">
        <div class="section-card-icon">🫀</div>
        <div>
          <div class="section-card-title">My Recent Cases</div>
          <div class="section-card-subtitle">Last 5 finalized reports</div>
        </div>
      </div>
      <div>
        <table class="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>UHID</th>
              <th>Procedure</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${completedReports.slice(0, 5).map(r => `
              <tr>
                <td>${r.patientName || '–'}</td>
                <td>${r.uhid || '–'}</td>
                <td>${r.procedure || '–'}</td>
                <td>${r.date || '–'}</td>
              </tr>
            `).join('')}
            ${completedReports.length === 0 ? `<tr><td colspan="4" style="text-align:center; color:var(--color-text-muted);">No finalized reports found.</td></tr>` : ''}
          </tbody>
        </table>
      </div>
    </div>
  `;

    // Attach events
    container.querySelectorAll('.finish-draft-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.hash = `#/report/${btn.dataset.id}`;
        });
    });
}
