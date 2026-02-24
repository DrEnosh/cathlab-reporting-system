// ============================================================
// View: New Report
// ============================================================

import { renderProgressBar, updateProgressBar } from '../components/ProgressBar.js';
import { initSignaturePad, getSignatureData } from '../components/SignaturePad.js';
import { renderCAG, attachCAGEvents } from '../templates/CAG.js';
import { renderPCI, attachPCIEvents } from '../templates/PCI.js';
import { renderRHC, attachRHCEvents } from '../templates/RHC.js';
import { renderTPM, attachTPMEvents } from '../templates/TPM.js';
import { validateReport, applyValidationErrors, clearValidationErrors } from '../core/validation.js';
import { saveReport, saveDraft, loadDraft, clearDraft, getReport } from '../core/store.js';
import { downloadPDF } from '../core/pdf.js';
import { showToast, collectFormData } from '../core/utils.js';

const PROCEDURES = [
    { code: 'CAG', name: 'Coronary Angiography', icon: '🫀', desc: 'Diagnostic coronary imaging', color: '#0D6EBF' },
    { code: 'PCI', name: 'PCI / Angioplasty', icon: '💉', desc: 'Percutaneous coronary intervention', color: '#0A9396' },
    { code: 'RHC', name: 'Right Heart Catheterization', icon: '🫁', desc: 'Hemodynamic assessment', color: '#6A4C93' },
    { code: 'TPM', name: 'Temporary Pacemaker', icon: '⚡', desc: 'Temporary pacing insertion', color: '#C07A00' },
];

let currentProcedure = null;
let editingReportId = null;
let autoSaveInterval = null;

export function renderNewReport(params = {}) {
    const container = document.getElementById('appMain');
    editingReportId = params.id || null;

    // Load existing report if editing
    let existingData = null;
    if (editingReportId) {
        existingData = getReport(editingReportId);
        if (existingData) {
            currentProcedure = existingData.procedure;
        }
    }

    // Check for draft
    if (!existingData) {
        const draft = loadDraft();
        if (draft && draft.procedure) {
            existingData = draft;
            currentProcedure = draft.procedure;
        }
    }

    if (currentProcedure && existingData) {
        renderTemplate(container, existingData);
    } else {
        renderProcedureSelector(container);
    }
}

function renderProcedureSelector(container) {
    currentProcedure = null;
    container.innerHTML = `
    <div class="procedure-selector">
      <h2>New Procedure Report</h2>
      <p>Select a procedure to begin the structured report</p>
      
      <!-- New OCR Upload Feature -->
      <div style="margin-bottom: var(--space-8); padding: var(--space-6); background: var(--color-surface-alt); border-radius: var(--radius-lg); border: 2px dashed var(--color-border); max-width: 600px; margin-left: auto; margin-right: auto;">
        <h3 style="margin-bottom: var(--space-2);"><span style="font-size:1.2rem;">✨</span> Auto-fill with OCR</h3>
        <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-4);">Upload a scanned paper report. CathAI will extract the text and fill the digital form for you.</p>
        <input type="file" id="ocrUploadInput" accept=".pdf,image/*" style="display:none;" />
        <button class="btn btn-accent" id="ocrUploadBtn">📄 Upload Written Report</button>
        <div id="ocrLoading" class="hidden" style="margin-top: var(--space-4); color: var(--color-primary); font-size: var(--font-size-sm); font-style: italic;">
          Scanning document and extracting medical data... ⏳
        </div>
      </div>

      <div class="procedure-cards">
        ${PROCEDURES.map(p => `
          <div class="procedure-card" data-procedure="${p.code}" id="proc-${p.code}">
            <div class="card-icon" style="background: ${p.color}15; color: ${p.color};">${p.icon}</div>
            <div class="card-title">${p.name}</div>
            <div class="card-desc">${p.desc}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

    container.querySelectorAll('.procedure-card').forEach(card => {
        card.addEventListener('click', () => {
            currentProcedure = card.dataset.procedure;
            renderTemplate(container, { procedure: currentProcedure });
        });
    });

    // Simulate OCR Upload
    const ocrBtn = container.querySelector('#ocrUploadBtn');
    const ocrInput = container.querySelector('#ocrUploadInput');
    const ocrLoading = container.querySelector('#ocrLoading');

    ocrBtn.addEventListener('click', () => ocrInput.click());

    ocrInput.addEventListener('change', (e) => {
        if (!e.target.files.length) return;

        ocrBtn.style.display = 'none';
        ocrLoading.classList.remove('hidden');

        // Simulate a 2-second AI processing delay
        setTimeout(() => {
            const simulatedScannedData = {
                procedure: 'CAG',
                patientName: 'John Doe (OCR Extracted)',
                uhid: 'UHID-992837',
                age: '65',
                sex: 'Male',
                indication: 'Stable Angina, abnormal stress test',
                lm_stenosis: '0',
                lad_stenosis: '85',
                lcx_stenosis: '20',
                rca_stenosis: '95',
                dominance: 'Right'
            };

            showToast('OCR Extraction Successful', 'success');
            currentProcedure = 'CAG';
            renderTemplate(container, simulatedScannedData);
        }, 2000);
    });
}

function renderTemplate(container, data = {}) {
    let templateHTML = '';
    switch (data.procedure || currentProcedure) {
        case 'CAG': templateHTML = renderCAG(data); break;
        case 'PCI': templateHTML = renderPCI(data); break;
        case 'RHC': templateHTML = renderRHC(data); break;
        case 'TPM': templateHTML = renderTPM(data); break;
    }

    const procedureInfo = PROCEDURES.find(p => p.code === (data.procedure || currentProcedure));

    container.innerHTML = `
    ${renderProgressBar(1)}

    <div class="report-header-bar" style="display:flex;align-items:center;gap:var(--space-4);margin-bottom:var(--space-6);">
      <button class="btn btn-ghost" id="backToSelector" title="Back to procedure selection">
        ← Back
      </button>
      <div style="flex:1;">
        <h2 style="font-size:var(--font-size-xl);font-weight:var(--font-weight-bold);color:var(--color-text);">
          ${procedureInfo ? procedureInfo.icon : ''} ${procedureInfo ? procedureInfo.name : 'Report'}
        </h2>
        <p style="font-size:var(--font-size-sm);color:var(--color-text-muted);">${editingReportId ? 'Editing Report: ' + editingReportId : 'New Report'}</p>
      </div>
    </div>

    <form id="reportForm" autocomplete="off" novalidate>
      ${templateHTML}
    </form>

    <div class="sticky-action-bar" id="actionBar">
      <div class="action-bar-left">
        <button type="button" class="btn btn-ghost" id="saveDraftBtn">
          💾 Save Draft
        </button>
        <span style="font-size:var(--font-size-xs);color:var(--color-text-muted);" id="lastSavedTime">Auto-saves every 30 seconds</span>
      </div>
      <div class="action-bar-right">
        <button type="button" class="btn btn-outline" id="downloadPDFBtn">
          📄 Download PDF
        </button>
        <button type="button" class="btn btn-primary btn-lg" id="submitReportBtn">
          ✅ Submit Report
        </button>
      </div>
    </div>
  `;

    // Initialize signature pad
    setTimeout(() => initSignaturePad(data.signature), 100);

    // Attach template-specific events
    const form = container.querySelector('#reportForm');
    switch (data.procedure || currentProcedure) {
        case 'CAG': attachCAGEvents(form); break;
        case 'PCI': attachPCIEvents(form); break;
        case 'RHC': attachRHCEvents(form); break;
        case 'TPM': attachTPMEvents(form); break;
    }

    // Update progress as user fills data
    attachProgressTracking(form);

    // Event listeners
    container.querySelector('#backToSelector')?.addEventListener('click', () => {
        if (confirm('Go back to procedure selection? Unsaved data will be lost.')) {
            currentProcedure = null;
            editingReportId = null;
            clearDraft();
            stopAutoSave();
            renderProcedureSelector(container);
        }
    });

    container.querySelector('#saveDraftBtn')?.addEventListener('click', () => {
        doSaveDraft(form);
        showToast('Draft saved successfully', 'success');
    });

    container.querySelector('#downloadPDFBtn')?.addEventListener('click', () => {
        const reportData = gatherReportData(form);
        downloadPDF(reportData);
        showToast('PDF downloaded', 'success');
    });

    container.querySelector('#submitReportBtn')?.addEventListener('click', () => {
        submitReport(form, container);
    });

    // Track user edits on impression/recommendation textareas
    form.querySelectorAll('textarea[name="impression"], textarea[name="recommendations"]').forEach(ta => {
        ta.addEventListener('input', () => { ta._userEdited = true; });
    });

    // Start auto-save
    startAutoSave(form);
}

function gatherReportData(form) {
    const data = collectFormData(form);
    data.procedure = currentProcedure;
    data.id = editingReportId || undefined;
    data.signature = getSignatureData();

    // Collect complications checkboxes
    const complications = [];
    form.querySelectorAll('input[name="complications"]:checked').forEach(cb => {
        complications.push(cb.value);
    });
    data.complications = complications;

    return data;
}

function submitReport(form, container) {
    const data = gatherReportData(form);
    const { valid, errors } = validateReport(data);

    if (!valid) {
        applyValidationErrors(form, errors);
        showToast('Please fill all mandatory fields', 'error');
        return;
    }

    clearValidationErrors(form);
    data.status = 'pending_approval';
    const saved = saveReport(data);
    clearDraft();
    stopAutoSave();

    showToast('Report submitted successfully!', 'success');

    // Reset
    editingReportId = null;
    currentProcedure = null;
    setTimeout(() => {
        window.location.hash = '#/reports';
    }, 500);
}

function doSaveDraft(form) {
    const data = gatherReportData(form);
    data.status = 'draft';
    saveDraft(data);

    const timeEl = document.querySelector('#lastSavedTime');
    if (timeEl) {
        timeEl.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
    }

    // Update save indicator
    const indicator = document.querySelector('.save-dot');
    if (indicator) {
        indicator.classList.add('saving');
        setTimeout(() => indicator.classList.remove('saving'), 1000);
    }
}

function startAutoSave(form) {
    stopAutoSave();
    autoSaveInterval = setInterval(() => {
        doSaveDraft(form);
    }, 30000);
}

function stopAutoSave() {
    if (autoSaveInterval) {
        clearInterval(autoSaveInterval);
        autoSaveInterval = null;
    }
}

function attachProgressTracking(form) {
    const patientFields = ['patientName', 'uhid', 'age', 'sex'];
    const checkProgress = () => {
        const data = collectFormData(form);
        const patientComplete = patientFields.every(f => data[f]);

        // Simple heuristic: check how many fields are filled
        const allInputs = form.querySelectorAll('input, select, textarea');
        let filled = 0;
        allInputs.forEach(inp => {
            if (inp.value && inp.value.trim()) filled++;
        });

        const fillPercent = allInputs.length ? filled / allInputs.length : 0;

        let step = 1;
        if (patientComplete && fillPercent > 0.3) step = 2;
        if (fillPercent > 0.6) step = 3;

        updateProgressBar(step);
    };

    form.addEventListener('input', checkProgress);
    form.addEventListener('change', checkProgress);
}
