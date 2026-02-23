// ============================================================
// Template: Right Heart Catheterization (RHC)
// ============================================================

import { renderPatientDetails } from '../components/PatientDetails.js';
import { renderComplications } from '../components/Complications.js';
import { renderSignaturePad } from '../components/SignaturePad.js';
import { calculatePVR, generateRHCImpression, isAbnormalValue, checkPulmonaryHypertension } from '../core/smartFeatures.js';

export function renderRHC(data = {}) {
    return `
    ${renderPatientDetails(data)}

    <!-- Access & Procedure -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">🫁</div>
        <div>
          <div class="section-card-title">Access Site & Procedure Details</div>
          <div class="section-card-subtitle">Vascular access and radiation data</div>
        </div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group" data-field="accessSite">
          <label class="form-label">Access Site <span class="required">*</span></label>
          <select class="form-select" name="accessSite">
            <option value="">Select</option>
            <option value="Right Internal Jugular" ${data.accessSite === 'Right Internal Jugular' ? 'selected' : ''}>Right Internal Jugular</option>
            <option value="Left Internal Jugular" ${data.accessSite === 'Left Internal Jugular' ? 'selected' : ''}>Left Internal Jugular</option>
            <option value="Right Femoral Vein" ${data.accessSite === 'Right Femoral Vein' ? 'selected' : ''}>Right Femoral Vein</option>
            <option value="Left Femoral Vein" ${data.accessSite === 'Left Femoral Vein' ? 'selected' : ''}>Left Femoral Vein</option>
            <option value="Right Subclavian" ${data.accessSite === 'Right Subclavian' ? 'selected' : ''}>Right Subclavian</option>
          </select>
        </div>
        <div class="form-group" data-field="contrastVolume">
          <label class="form-label">Contrast Volume (ml) <span class="required">*</span></label>
          <input type="number" class="form-input" name="contrastVolume" placeholder="ml" min="0" value="${esc(data.contrastVolume)}" />
        </div>
        <div class="form-group" data-field="fluoroTime">
          <label class="form-label">Fluoroscopy Time <span class="required">*</span></label>
          <input type="text" class="form-input" name="fluoroTime" placeholder="e.g., 3 min" value="${esc(data.fluoroTime)}" />
        </div>
        <div class="form-group" data-field="radiationDose">
          <label class="form-label">Radiation Dose <span class="required">*</span></label>
          <input type="text" class="form-input" name="radiationDose" placeholder="DAP / Air Kerma" value="${esc(data.radiationDose)}" />
        </div>
      </div>
    </div>

    <!-- Hemodynamic Data -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📊</div>
        <div>
          <div class="section-card-title">Hemodynamic Data</div>
          <div class="section-card-subtitle">Pressure measurements – PVR auto-calculated</div>
        </div>
      </div>
      <table class="data-table" id="hemoTable">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Value</th>
            <th>Unit</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>RA Pressure</strong></td>
            <td><input type="text" name="ra_pressure" value="${esc(data.ra_pressure)}" placeholder="e.g., 5" data-hemo="true" /></td>
            <td>mmHg</td>
            <td class="hemo-status" data-for="ra_pressure"></td>
          </tr>
          <tr>
            <td><strong>RV Pressure</strong></td>
            <td><input type="text" name="rv_pressure" value="${esc(data.rv_pressure)}" placeholder="e.g., 25/5" data-hemo="true" /></td>
            <td>mmHg</td>
            <td class="hemo-status" data-for="rv_pressure"></td>
          </tr>
          <tr>
            <td><strong>PA Systolic</strong></td>
            <td><input type="number" name="pa_systolic" value="${esc(data.pa_systolic)}" placeholder="e.g., 25" data-hemo="true" /></td>
            <td>mmHg</td>
            <td class="hemo-status" data-for="pa_systolic"></td>
          </tr>
          <tr>
            <td><strong>PA Diastolic</strong></td>
            <td><input type="number" name="pa_diastolic" value="${esc(data.pa_diastolic)}" placeholder="e.g., 10" data-hemo="true" /></td>
            <td>mmHg</td>
            <td class="hemo-status" data-for="pa_diastolic"></td>
          </tr>
          <tr>
            <td><strong>PA Mean</strong></td>
            <td><input type="number" name="pa_mean" value="${esc(data.pa_mean)}" placeholder="e.g., 15" data-hemo="true" data-smart="pa_mean" /></td>
            <td>mmHg</td>
            <td class="hemo-status" data-for="pa_mean"></td>
          </tr>
          <tr>
            <td><strong>PCWP</strong></td>
            <td><input type="number" name="pcwp" value="${esc(data.pcwp)}" placeholder="e.g., 12" data-hemo="true" data-smart="pcwp" /></td>
            <td>mmHg</td>
            <td class="hemo-status" data-for="pcwp"></td>
          </tr>
          <tr>
            <td><strong>Cardiac Output</strong></td>
            <td><input type="number" name="cardiac_output" value="${esc(data.cardiac_output)}" placeholder="e.g., 5.0" step="0.1" data-hemo="true" /></td>
            <td>L/min</td>
            <td class="hemo-status" data-for="cardiac_output"></td>
          </tr>
          <tr>
            <td><strong>Cardiac Index</strong></td>
            <td><input type="number" name="cardiac_index" value="${esc(data.cardiac_index)}" placeholder="e.g., 2.8" step="0.1" data-hemo="true" data-smart="cardiac_index" /></td>
            <td>L/min/m²</td>
            <td class="hemo-status" data-for="cardiac_index"></td>
          </tr>
          <tr style="background: var(--color-accent-bg);">
            <td><strong>PVR (auto-calc)</strong></td>
            <td><input type="text" name="pvr" id="pvrField" value="${esc(data.pvr)}" placeholder="Auto-calculated" data-hemo="true" data-smart="pvr" readonly style="background:var(--color-surface-alt);" /></td>
            <td>Wood Units</td>
            <td class="hemo-status" data-for="pvr"></td>
          </tr>
        </tbody>
      </table>
      <div id="paSuggestion" class="mt-4"></div>
    </div>

    <!-- Oxygen Saturation Run -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">🩸</div>
        <div>
          <div class="section-card-title">Oxygen Saturation Run</div>
          <div class="section-card-subtitle">Oxygen saturation at different chambers</div>
        </div>
      </div>
      <div class="form-grid form-grid-4">
        <div class="form-group" data-field="sat_svc">
          <label class="form-label">SVC (%)</label>
          <input type="number" class="form-input" name="sat_svc" placeholder="%" min="0" max="100" value="${esc(data.sat_svc)}" />
        </div>
        <div class="form-group" data-field="sat_ra">
          <label class="form-label">RA (%)</label>
          <input type="number" class="form-input" name="sat_ra" placeholder="%" min="0" max="100" value="${esc(data.sat_ra)}" />
        </div>
        <div class="form-group" data-field="sat_rv">
          <label class="form-label">RV (%)</label>
          <input type="number" class="form-input" name="sat_rv" placeholder="%" min="0" max="100" value="${esc(data.sat_rv)}" />
        </div>
        <div class="form-group" data-field="sat_pa">
          <label class="form-label">PA (%)</label>
          <input type="number" class="form-input" name="sat_pa" placeholder="%" min="0" max="100" value="${esc(data.sat_pa)}" />
        </div>
      </div>
    </div>

    <!-- Impression -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📝</div>
        <div>
          <div class="section-card-title">Impression</div>
          <div class="section-card-subtitle">Auto-generated based on hemodynamic data – editable</div>
        </div>
      </div>
      <div class="form-group" data-field="impression">
        <textarea class="form-textarea" name="impression" rows="5" placeholder="Auto-generated impression...">${esc(data.impression)}</textarea>
      </div>
    </div>

    ${renderComplications(data)}
    ${renderSignaturePad(data.signature)}
  `;
}

export function attachRHCEvents(container) {
    const hemoInputs = container.querySelectorAll('[data-hemo="true"]');

    hemoInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Auto-calculate PVR
            const paMean = container.querySelector('[name="pa_mean"]')?.value;
            const pcwp = container.querySelector('[name="pcwp"]')?.value;
            const co = container.querySelector('[name="cardiac_output"]')?.value;
            const pvr = calculatePVR(paMean, pcwp, co);
            const pvrField = container.querySelector('#pvrField');
            if (pvrField && pvr !== null) {
                pvrField.value = pvr;
            }

            // Highlight abnormal values
            const smartFields = container.querySelectorAll('[data-smart]');
            smartFields.forEach(field => {
                const key = field.dataset.smart;
                const abnormal = isAbnormalValue(key, field.value);
                field.classList.toggle('abnormal-value', abnormal);
                const statusCell = container.querySelector(`.hemo-status[data-for="${field.name}"]`);
                if (statusCell) {
                    if (abnormal) {
                        statusCell.innerHTML = '<span class="alert-badge severe">Abnormal</span>';
                    } else if (field.value) {
                        statusCell.innerHTML = '<span class="alert-badge normal">Normal</span>';
                    } else {
                        statusCell.innerHTML = '';
                    }
                }
            });

            // PA mean suggestion
            const paMeanVal = container.querySelector('[name="pa_mean"]')?.value;
            const phCheck = checkPulmonaryHypertension(paMeanVal);
            const sugBox = container.querySelector('#paSuggestion');
            if (phCheck && phCheck.flag) {
                sugBox.innerHTML = `
          <div class="suggestion-box danger">
            <span class="suggestion-icon">🔴</span>
            <div class="suggestion-text">
              <strong>⚠️ Pulmonary Hypertension Detected</strong><br/>
              PA Mean: ${paMeanVal} mmHg (>25 mmHg threshold)<br/>
              Severity: ${phCheck.severity === 'severe' ? 'Severe (>40 mmHg)' : 'Moderate'}
            </div>
          </div>
        `;
            } else {
                sugBox.innerHTML = '';
            }

            // Auto-impression
            const hemoData = {};
            hemoInputs.forEach(inp => {
                hemoData[inp.name] = inp.value;
            });
            const impField = container.querySelector('[name="impression"]');
            if (impField && !impField._userEdited) {
                const impression = generateRHCImpression(hemoData);
                impField.value = impression;
            }
        });
    });

    // Mark impression as user-edited if they type in it
    const impField = container.querySelector('[name="impression"]');
    if (impField) {
        impField.addEventListener('focus', () => { impField._userEdited = true; });
    }
}

function esc(val) {
    if (val === undefined || val === null) return '';
    return String(val).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
