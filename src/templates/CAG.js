// ============================================================
// Template: Coronary Angiography (CAG)
// ============================================================

import { renderPatientDetails } from '../components/PatientDetails.js';
import { renderComplications } from '../components/Complications.js';
import { renderSignaturePad } from '../components/SignaturePad.js';
import { stenosisSeverity, generateCAGImpression, isAbnormalValue } from '../core/smartFeatures.js';

export function renderCAG(data = {}) {
    return `
    ${renderPatientDetails(data)}

    <!-- Clinical Indication -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📋</div>
        <div>
          <div class="section-card-title">Clinical Indication</div>
          <div class="section-card-subtitle">Reason for performing coronary angiography</div>
        </div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group" data-field="clinicalIndication">
          <label class="form-label">Indication <span class="required">*</span></label>
          <select class="form-select" name="clinicalIndication">
            <option value="">Select indication</option>
            <option value="Chest Pain" ${data.clinicalIndication === 'Chest Pain' ? 'selected' : ''}>Chest Pain</option>
            <option value="ACS" ${data.clinicalIndication === 'ACS' ? 'selected' : ''}>ACS</option>
            <option value="Positive TMT" ${data.clinicalIndication === 'Positive TMT' ? 'selected' : ''}>Positive TMT</option>
            <option value="Post MI Evaluation" ${data.clinicalIndication === 'Post MI Evaluation' ? 'selected' : ''}>Post MI Evaluation</option>
            <option value="Pre-operative" ${data.clinicalIndication === 'Pre-operative' ? 'selected' : ''}>Pre-operative</option>
            <option value="Cardiomyopathy Workup" ${data.clinicalIndication === 'Cardiomyopathy Workup' ? 'selected' : ''}>Cardiomyopathy Workup</option>
            <option value="Others" ${data.clinicalIndication === 'Others' ? 'selected' : ''}>Others</option>
          </select>
        </div>
        <div class="form-group" data-field="indicationDetails">
          <label class="form-label">Additional Details</label>
          <input type="text" class="form-input" name="indicationDetails" placeholder="Specify details..." value="${esc(data.indicationDetails)}" />
        </div>
      </div>
    </div>

    <!-- Procedure Details -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">🔬</div>
        <div>
          <div class="section-card-title">Procedure Details</div>
          <div class="section-card-subtitle">Access, equipment, and radiation data</div>
        </div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group" data-field="accessSite">
          <label class="form-label">Access Site <span class="required">*</span></label>
          <select class="form-select" name="accessSite">
            <option value="">Select</option>
            <option value="Right Radial" ${data.accessSite === 'Right Radial' ? 'selected' : ''}>Right Radial</option>
            <option value="Left Radial" ${data.accessSite === 'Left Radial' ? 'selected' : ''}>Left Radial</option>
            <option value="Right Femoral" ${data.accessSite === 'Right Femoral' ? 'selected' : ''}>Right Femoral</option>
            <option value="Left Femoral" ${data.accessSite === 'Left Femoral' ? 'selected' : ''}>Left Femoral</option>
          </select>
        </div>
        <div class="form-group" data-field="sheathSize">
          <label class="form-label">Sheath Size</label>
          <select class="form-select" name="sheathSize">
            <option value="">Select</option>
            <option value="5F" ${data.sheathSize === '5F' ? 'selected' : ''}>5F</option>
            <option value="6F" ${data.sheathSize === '6F' ? 'selected' : ''}>6F</option>
            <option value="7F" ${data.sheathSize === '7F' ? 'selected' : ''}>7F</option>
          </select>
        </div>
        <div class="form-group" data-field="cathetersUsed">
          <label class="form-label">Catheters Used</label>
          <input type="text" class="form-input" name="cathetersUsed" placeholder="e.g., JL 3.5, JR 3.5" value="${esc(data.cathetersUsed)}" />
        </div>
        <div class="form-group" data-field="contrastVolume">
          <label class="form-label">Contrast Volume (ml) <span class="required">*</span></label>
          <input type="number" class="form-input" name="contrastVolume" placeholder="ml" min="0" value="${esc(data.contrastVolume)}" />
        </div>
        <div class="form-group" data-field="fluoroTime">
          <label class="form-label">Fluoroscopy Time <span class="required">*</span></label>
          <input type="text" class="form-input" name="fluoroTime" placeholder="e.g., 5 min 30 sec" value="${esc(data.fluoroTime)}" />
        </div>
        <div class="form-group" data-field="radiationDose">
          <label class="form-label">Radiation Dose (DAP/Air Kerma) <span class="required">*</span></label>
          <input type="text" class="form-input" name="radiationDose" placeholder="e.g., 2500 cGy·cm²" value="${esc(data.radiationDose)}" />
        </div>
      </div>
    </div>

    <!-- Coronary Anatomy -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">🫀</div>
        <div>
          <div class="section-card-title">Coronary Anatomy</div>
          <div class="section-card-subtitle">Enter stenosis percentages per segment</div>
        </div>
      </div>
      <div class="anatomy-grid" id="anatomyGrid">
        <div class="anatomy-header">Vessel</div>
        <div class="anatomy-header">Proximal</div>
        <div class="anatomy-header">Mid</div>
        <div class="anatomy-header">Distal / Branch</div>

        <div class="anatomy-label">Left Main (LM)</div>
        <div class="anatomy-cell" style="grid-column: span 3;">
          <input type="number" name="lm_stenosis" placeholder="% stenosis" min="0" max="100" value="${esc(data.lm_stenosis)}" data-anatomy="true" />
        </div>

        <div class="anatomy-label">LAD</div>
        <div class="anatomy-cell"><input type="number" name="lad_proximal" placeholder="%" min="0" max="100" value="${esc(data.lad_proximal)}" data-anatomy="true" /></div>
        <div class="anatomy-cell"><input type="number" name="lad_mid" placeholder="%" min="0" max="100" value="${esc(data.lad_mid)}" data-anatomy="true" /></div>
        <div class="anatomy-cell"><input type="number" name="lad_distal" placeholder="%" min="0" max="100" value="${esc(data.lad_distal)}" data-anatomy="true" /></div>

        <div class="anatomy-label">LCX</div>
        <div class="anatomy-cell"><input type="number" name="lcx_proximal" placeholder="%" min="0" max="100" value="${esc(data.lcx_proximal)}" data-anatomy="true" /></div>
        <div class="anatomy-cell" style="grid-column: span 2;"><input type="number" name="lcx_om" placeholder="OM branches %" min="0" max="100" value="${esc(data.lcx_om)}" data-anatomy="true" /></div>

        <div class="anatomy-label">RCA</div>
        <div class="anatomy-cell"><input type="number" name="rca_proximal" placeholder="%" min="0" max="100" value="${esc(data.rca_proximal)}" data-anatomy="true" /></div>
        <div class="anatomy-cell"><input type="number" name="rca_mid" placeholder="%" min="0" max="100" value="${esc(data.rca_mid)}" data-anatomy="true" /></div>
        <div class="anatomy-cell"><input type="number" name="rca_distal" placeholder="%" min="0" max="100" value="${esc(data.rca_distal)}" data-anatomy="true" /></div>
      </div>

      <div class="form-grid form-grid-2 mt-4">
        <div class="form-group" data-field="dominance">
          <label class="form-label">Dominance</label>
          <select class="form-select" name="dominance">
            <option value="">Select</option>
            <option value="Right" ${data.dominance === 'Right' ? 'selected' : ''}>Right</option>
            <option value="Left" ${data.dominance === 'Left' ? 'selected' : ''}>Left</option>
            <option value="Codominant" ${data.dominance === 'Codominant' ? 'selected' : ''}>Codominant</option>
          </select>
        </div>
      </div>

      <!-- Smart suggestions appear here -->
      <div id="anatomySuggestions"></div>
    </div>

    <!-- LV Function -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">💓</div>
        <div>
          <div class="section-card-title">LV Function</div>
          <div class="section-card-subtitle">Left ventricular assessment</div>
        </div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group" data-field="lvef">
          <label class="form-label">LVEF %</label>
          <input type="number" class="form-input" name="lvef" placeholder="e.g., 55" min="0" max="100" value="${esc(data.lvef)}" />
        </div>
        <div class="form-group" data-field="rwma">
          <label class="form-label">RWMA Notes</label>
          <input type="text" class="form-input" name="rwma" placeholder="Regional wall motion abnormalities" value="${esc(data.rwma)}" />
        </div>
      </div>
    </div>

    <!-- Impression & Recommendations -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📝</div>
        <div>
          <div class="section-card-title">Impression & Recommendations</div>
          <div class="section-card-subtitle">Auto-generated based on findings – editable</div>
        </div>
      </div>
      <div class="form-group mb-4" data-field="impression">
        <label class="form-label">Impression</label>
        <textarea class="form-textarea" name="impression" rows="4" placeholder="Auto-generated impression...">${esc(data.impression)}</textarea>
      </div>
      <div class="form-group" data-field="recommendations">
        <label class="form-label">Recommendations</label>
        <div class="checkbox-group mb-4">
          <label class="radio-item">
            <input type="radio" name="recOption" value="Medical Management" ${data.recOption === 'Medical Management' ? 'checked' : ''} />
            Medical Management
          </label>
          <label class="radio-item">
            <input type="radio" name="recOption" value="PCI" ${data.recOption === 'PCI' ? 'checked' : ''} />
            PCI
          </label>
          <label class="radio-item">
            <input type="radio" name="recOption" value="CABG" ${data.recOption === 'CABG' ? 'checked' : ''} />
            CABG
          </label>
        </div>
        <textarea class="form-textarea" name="recommendations" rows="3" placeholder="Additional recommendations...">${esc(data.recommendations)}</textarea>
      </div>
    </div>

    ${renderComplications(data)}
    ${renderSignaturePad(data.signature)}
  `;
}

/**
 * Attach smart features after DOM render.
 */
export function attachCAGEvents(container) {
    const anatomyInputs = container.querySelectorAll('[data-anatomy="true"]');
    anatomyInputs.forEach(input => {
        input.addEventListener('input', () => {
            // Highlight abnormal stenosis
            const val = parseFloat(input.value);
            input.classList.toggle('abnormal-value', !isNaN(val) && val >= 70);

            // Generate auto-impression
            updateCAGSuggestions(container);
        });
    });

    const lvefInput = container.querySelector('[name="lvef"]');
    if (lvefInput) {
        lvefInput.addEventListener('input', () => {
            lvefInput.classList.toggle('abnormal-value', isAbnormalValue('lvef', lvefInput.value));
        });
    }
}

function updateCAGSuggestions(container) {
    const data = {};
    container.querySelectorAll('[data-anatomy="true"]').forEach(inp => {
        data[inp.name] = inp.value;
    });

    const result = generateCAGImpression(data);
    const sugBox = container.querySelector('#anatomySuggestions');

    if (result.findings && result.severeCount > 0) {
        sugBox.innerHTML = `
      <div class="suggestion-box ${result.severeCount >= 3 ? 'danger' : 'warning'}">
        <span class="suggestion-icon">${result.severeCount >= 3 ? '🔴' : '🟡'}</span>
        <div class="suggestion-text">
          <strong>Auto-Analysis:</strong><br/>
          ${result.findings.replace(/\n/g, '<br/>')}<br/><br/>
          <strong>Suggested:</strong> ${result.recommendations.replace(/\n/g, '<br/>')}
        </div>
      </div>
    `;

        // Auto-fill impression
        const impField = container.querySelector('[name="impression"]');
        if (impField && !impField._userEdited) {
            impField.value = result.findings;
        }
        const recField = container.querySelector('[name="recommendations"]');
        if (recField && !recField._userEdited) {
            recField.value = result.recommendations;
        }
    } else {
        sugBox.innerHTML = '';
    }
}

function esc(val) {
    if (val === undefined || val === null) return '';
    return String(val).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
