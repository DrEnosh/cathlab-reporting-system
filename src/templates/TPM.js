// ============================================================
// Template: Temporary Pacemaker (TPM) Insertion
// ============================================================

import { renderPatientDetails } from '../components/PatientDetails.js';
import { renderComplications } from '../components/Complications.js';
import { renderSignaturePad } from '../components/SignaturePad.js';
import { isAbnormalValue } from '../core/smartFeatures.js';

export function renderTPM(data = {}) {
    return `
    ${renderPatientDetails(data)}

    <!-- Indication -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">⚡</div>
        <div>
          <div class="section-card-title">Indication</div>
          <div class="section-card-subtitle">Reason for temporary pacemaker insertion</div>
        </div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group" data-field="tpmIndication">
          <label class="form-label">Indication <span class="required">*</span></label>
          <select class="form-select" name="tpmIndication">
            <option value="">Select indication</option>
            <option value="Complete Heart Block" ${data.tpmIndication === 'Complete Heart Block' ? 'selected' : ''}>Complete Heart Block</option>
            <option value="High-grade AV Block" ${data.tpmIndication === 'High-grade AV Block' ? 'selected' : ''}>High-grade AV Block</option>
            <option value="Symptomatic Bradycardia" ${data.tpmIndication === 'Symptomatic Bradycardia' ? 'selected' : ''}>Symptomatic Bradycardia</option>
            <option value="Post-cardiac Surgery" ${data.tpmIndication === 'Post-cardiac Surgery' ? 'selected' : ''}>Post-cardiac Surgery</option>
            <option value="Prophylactic" ${data.tpmIndication === 'Prophylactic' ? 'selected' : ''}>Prophylactic</option>
            <option value="Others" ${data.tpmIndication === 'Others' ? 'selected' : ''}>Others</option>
          </select>
        </div>
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
      </div>
    </div>

    <!-- Lead Details -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">🔌</div>
        <div>
          <div class="section-card-title">Lead Details</div>
          <div class="section-card-subtitle">Pacing lead configuration and testing</div>
        </div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group" data-field="leadType">
          <label class="form-label">Lead Type</label>
          <select class="form-select" name="leadType">
            <option value="">Select</option>
            <option value="Bipolar" ${data.leadType === 'Bipolar' ? 'selected' : ''}>Bipolar</option>
            <option value="Unipolar" ${data.leadType === 'Unipolar' ? 'selected' : ''}>Unipolar</option>
            <option value="Semi-floating" ${data.leadType === 'Semi-floating' ? 'selected' : ''}>Semi-floating</option>
          </select>
        </div>
        <div class="form-group" data-field="leadPosition">
          <label class="form-label">Position</label>
          <select class="form-select" name="leadPosition">
            <option value="">Select</option>
            <option value="RV Apex" ${data.leadPosition === 'RV Apex' ? 'selected' : ''}>RV Apex</option>
            <option value="RV Septum" ${data.leadPosition === 'RV Septum' ? 'selected' : ''}>RV Septum</option>
            <option value="RVOT" ${data.leadPosition === 'RVOT' ? 'selected' : ''}>RVOT</option>
          </select>
        </div>
        <div class="form-group" data-field="captureThreshold">
          <label class="form-label">Capture Threshold (V)</label>
          <input type="number" class="form-input" name="captureThreshold" placeholder="e.g., 0.5" step="0.1" min="0" value="${esc(data.captureThreshold)}" data-smart="capture_threshold" />
        </div>
        <div class="form-group" data-field="sensitivity">
          <label class="form-label">Sensitivity (mV)</label>
          <input type="number" class="form-input" name="sensitivity" placeholder="e.g., 5.0" step="0.1" min="0" value="${esc(data.sensitivity)}" />
        </div>
        <div class="form-group" data-field="outputSetting">
          <label class="form-label">Output Setting (V)</label>
          <input type="number" class="form-input" name="outputSetting" placeholder="e.g., 3.0" step="0.1" min="0" value="${esc(data.outputSetting)}" />
        </div>
        <div class="form-group" data-field="pacingMode">
          <label class="form-label">Pacing Mode</label>
          <select class="form-select" name="pacingMode">
            <option value="">Select</option>
            <option value="VVI" ${data.pacingMode === 'VVI' ? 'selected' : ''}>VVI</option>
            <option value="VOO" ${data.pacingMode === 'VOO' ? 'selected' : ''}>VOO</option>
            <option value="AAI" ${data.pacingMode === 'AAI' ? 'selected' : ''}>AAI</option>
            <option value="DDD" ${data.pacingMode === 'DDD' ? 'selected' : ''}>DDD</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Final Pacemaker Settings -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">⚙️</div>
        <div>
          <div class="section-card-title">Final Pacemaker Settings</div>
          <div class="section-card-subtitle">Settings programmed at the end of the procedure</div>
        </div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group" data-field="finalRate">
          <label class="form-label">Rate (bpm)</label>
          <input type="number" class="form-input" name="finalRate" placeholder="e.g., 60" min="0" max="200" value="${esc(data.finalRate)}" />
        </div>
        <div class="form-group" data-field="finalOutput">
          <label class="form-label">Output (V)</label>
          <input type="number" class="form-input" name="finalOutput" placeholder="e.g., 3.0" step="0.1" min="0" value="${esc(data.finalOutput)}" />
        </div>
        <div class="form-group" data-field="finalSensitivity">
          <label class="form-label">Sensitivity (mV)</label>
          <input type="number" class="form-input" name="finalSensitivity" placeholder="e.g., 5.0" step="0.1" min="0" value="${esc(data.finalSensitivity)}" />
        </div>
      </div>
    </div>

    <!-- Fluoro & Radiation -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">☢️</div>
        <div>
          <div class="section-card-title">Fluoroscopy & Radiation</div>
          <div class="section-card-subtitle">Mandatory radiation documentation</div>
        </div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group" data-field="fluoroTime">
          <label class="form-label">Fluoroscopy Time <span class="required">*</span></label>
          <input type="text" class="form-input" name="fluoroTime" placeholder="e.g., 5 min" value="${esc(data.fluoroTime)}" />
        </div>
        <div class="form-group" data-field="radiationDose">
          <label class="form-label">Radiation Dose <span class="required">*</span></label>
          <input type="text" class="form-input" name="radiationDose" placeholder="DAP / Air Kerma" value="${esc(data.radiationDose)}" />
        </div>
      </div>
    </div>

    <!-- Final Impression -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📝</div>
        <div>
          <div class="section-card-title">Final Impression</div>
          <div class="section-card-subtitle">Summary and outcome</div>
        </div>
      </div>
      <div class="form-group" data-field="impression">
        <textarea class="form-textarea" name="impression" rows="4" placeholder="Describe procedure outcome...">${esc(data.impression)}</textarea>
      </div>
    </div>

    ${renderComplications(data)}
    ${renderSignaturePad(data.signature)}
  `;
}

export function attachTPMEvents(container) {
    const threshold = container.querySelector('[data-smart="capture_threshold"]');
    if (threshold) {
        threshold.addEventListener('input', () => {
            threshold.classList.toggle('abnormal-value', isAbnormalValue('capture_threshold', threshold.value));
        });
    }
}

function esc(val) {
    if (val === undefined || val === null) return '';
    return String(val).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
