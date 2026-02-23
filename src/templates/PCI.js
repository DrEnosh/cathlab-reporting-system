// ============================================================
// Template: PCI / Angioplasty
// ============================================================

import { renderPatientDetails } from '../components/PatientDetails.js';
import { renderComplications } from '../components/Complications.js';
import { renderSignaturePad } from '../components/SignaturePad.js';

export function renderPCI(data = {}) {
    return `
    ${renderPatientDetails(data)}

    <!-- Indication -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">💉</div>
        <div>
          <div class="section-card-title">Indication</div>
          <div class="section-card-subtitle">Clinical reason for intervention</div>
        </div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group" data-field="pciIndication">
          <label class="form-label">Indication <span class="required">*</span></label>
          <select class="form-select" name="pciIndication">
            <option value="">Select indication</option>
            <option value="STEMI" ${data.pciIndication === 'STEMI' ? 'selected' : ''}>STEMI</option>
            <option value="NSTEMI" ${data.pciIndication === 'NSTEMI' ? 'selected' : ''}>NSTEMI</option>
            <option value="Unstable Angina" ${data.pciIndication === 'Unstable Angina' ? 'selected' : ''}>Unstable Angina</option>
            <option value="Stable Angina" ${data.pciIndication === 'Stable Angina' ? 'selected' : ''}>Stable Angina</option>
          </select>
        </div>
        <div class="form-group" data-field="targetVessel">
          <label class="form-label">Target Vessel <span class="required">*</span></label>
          <select class="form-select" name="targetVessel">
            <option value="">Select vessel</option>
            <option value="LAD" ${data.targetVessel === 'LAD' ? 'selected' : ''}>LAD</option>
            <option value="LCX" ${data.targetVessel === 'LCX' ? 'selected' : ''}>LCX</option>
            <option value="RCA" ${data.targetVessel === 'RCA' ? 'selected' : ''}>RCA</option>
            <option value="Left Main" ${data.targetVessel === 'Left Main' ? 'selected' : ''}>Left Main</option>
            <option value="Diagonal" ${data.targetVessel === 'Diagonal' ? 'selected' : ''}>Diagonal</option>
            <option value="OM" ${data.targetVessel === 'OM' ? 'selected' : ''}>OM</option>
            <option value="RAMUS" ${data.targetVessel === 'RAMUS' ? 'selected' : ''}>RAMUS</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lesion Characteristics -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">🔍</div>
        <div>
          <div class="section-card-title">Lesion Characteristics</div>
          <div class="section-card-subtitle">Describe the target lesion</div>
        </div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group" data-field="lesionLocation">
          <label class="form-label">Lesion Location</label>
          <select class="form-select" name="lesionLocation">
            <option value="">Select</option>
            <option value="Proximal" ${data.lesionLocation === 'Proximal' ? 'selected' : ''}>Proximal</option>
            <option value="Mid" ${data.lesionLocation === 'Mid' ? 'selected' : ''}>Mid</option>
            <option value="Distal" ${data.lesionLocation === 'Distal' ? 'selected' : ''}>Distal</option>
            <option value="Ostial" ${data.lesionLocation === 'Ostial' ? 'selected' : ''}>Ostial</option>
            <option value="Bifurcation" ${data.lesionLocation === 'Bifurcation' ? 'selected' : ''}>Bifurcation</option>
          </select>
        </div>
        <div class="form-group" data-field="lesionType">
          <label class="form-label">Lesion Type (ACC/AHA)</label>
          <select class="form-select" name="lesionType">
            <option value="">Select</option>
            <option value="A" ${data.lesionType === 'A' ? 'selected' : ''}>Type A</option>
            <option value="B1" ${data.lesionType === 'B1' ? 'selected' : ''}>Type B1</option>
            <option value="B2" ${data.lesionType === 'B2' ? 'selected' : ''}>Type B2</option>
            <option value="C" ${data.lesionType === 'C' ? 'selected' : ''}>Type C</option>
          </select>
        </div>
        <div class="form-group" data-field="preStenosis">
          <label class="form-label">Pre-procedure Stenosis %</label>
          <input type="number" class="form-input" name="preStenosis" placeholder="%" min="0" max="100" value="${esc(data.preStenosis)}" />
        </div>
        <div class="form-group" data-field="preTIMI">
          <label class="form-label">Pre TIMI Flow <span class="required">*</span></label>
          <select class="form-select" name="preTIMI">
            <option value="">Select</option>
            <option value="0" ${data.preTIMI === '0' ? 'selected' : ''}>TIMI 0</option>
            <option value="1" ${data.preTIMI === '1' ? 'selected' : ''}>TIMI 1</option>
            <option value="2" ${data.preTIMI === '2' ? 'selected' : ''}>TIMI 2</option>
            <option value="3" ${data.preTIMI === '3' ? 'selected' : ''}>TIMI 3</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Intervention Details -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">🛠️</div>
        <div>
          <div class="section-card-title">Intervention Details</div>
          <div class="section-card-subtitle">Equipment and technique used</div>
        </div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group" data-field="guidingCatheter">
          <label class="form-label">Guiding Catheter</label>
          <input type="text" class="form-input" name="guidingCatheter" placeholder="e.g., EBU 3.5" value="${esc(data.guidingCatheter)}" />
        </div>
        <div class="form-group" data-field="guidewire">
          <label class="form-label">Guidewire Used</label>
          <input type="text" class="form-input" name="guidewire" placeholder="e.g., Runthrough NS" value="${esc(data.guidewire)}" />
        </div>
        <div class="form-group" data-field="balloonSize">
          <label class="form-label">Balloon Size</label>
          <input type="text" class="form-input" name="balloonSize" placeholder="e.g., 2.0 x 15 mm" value="${esc(data.balloonSize)}" />
        </div>
        <div class="form-group" data-field="stentType">
          <label class="form-label">Stent Type</label>
          <select class="form-select" name="stentType">
            <option value="">Select</option>
            <option value="DES" ${data.stentType === 'DES' ? 'selected' : ''}>Drug Eluting Stent (DES)</option>
            <option value="BMS" ${data.stentType === 'BMS' ? 'selected' : ''}>Bare Metal Stent (BMS)</option>
            <option value="BVS" ${data.stentType === 'BVS' ? 'selected' : ''}>Bioresorbable Scaffold (BVS)</option>
            <option value="DCB" ${data.stentType === 'DCB' ? 'selected' : ''}>Drug Coated Balloon (DCB)</option>
          </select>
        </div>
        <div class="form-group" data-field="stentSize">
          <label class="form-label">Stent Size (mm)</label>
          <input type="text" class="form-input" name="stentSize" placeholder="e.g., 3.0" value="${esc(data.stentSize)}" />
        </div>
        <div class="form-group" data-field="stentLength">
          <label class="form-label">Stent Length (mm)</label>
          <input type="text" class="form-input" name="stentLength" placeholder="e.g., 28" value="${esc(data.stentLength)}" />
        </div>
        <div class="form-group" data-field="numStents">
          <label class="form-label">Number of Stents</label>
          <input type="number" class="form-input" name="numStents" placeholder="1" min="0" value="${esc(data.numStents)}" />
        </div>
        <div class="form-group" data-field="postDilatation">
          <label class="form-label">Post Dilatation</label>
          <select class="form-select" name="postDilatation">
            <option value="">Select</option>
            <option value="Yes" ${data.postDilatation === 'Yes' ? 'selected' : ''}>Yes</option>
            <option value="No" ${data.postDilatation === 'No' ? 'selected' : ''}>No</option>
          </select>
        </div>
      </div>
      <div class="form-grid form-grid-3 mt-4">
        <div class="form-group" data-field="contrastVolume">
          <label class="form-label">Contrast Volume (ml) <span class="required">*</span></label>
          <input type="number" class="form-input" name="contrastVolume" placeholder="ml" min="0" value="${esc(data.contrastVolume)}" />
        </div>
        <div class="form-group" data-field="fluoroTime">
          <label class="form-label">Fluoroscopy Time <span class="required">*</span></label>
          <input type="text" class="form-input" name="fluoroTime" placeholder="e.g., 12 min" value="${esc(data.fluoroTime)}" />
        </div>
        <div class="form-group" data-field="radiationDose">
          <label class="form-label">Radiation Dose <span class="required">*</span></label>
          <input type="text" class="form-input" name="radiationDose" placeholder="DAP / Air Kerma" value="${esc(data.radiationDose)}" />
        </div>
      </div>
    </div>

    <!-- Final Result -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">✅</div>
        <div>
          <div class="section-card-title">Final Result</div>
          <div class="section-card-subtitle">Post-procedure assessment</div>
        </div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group" data-field="postTIMI">
          <label class="form-label">Post TIMI Flow <span class="required">*</span></label>
          <select class="form-select" name="postTIMI">
            <option value="">Select</option>
            <option value="0" ${data.postTIMI === '0' ? 'selected' : ''}>TIMI 0</option>
            <option value="1" ${data.postTIMI === '1' ? 'selected' : ''}>TIMI 1</option>
            <option value="2" ${data.postTIMI === '2' ? 'selected' : ''}>TIMI 2</option>
            <option value="3" ${data.postTIMI === '3' ? 'selected' : ''}>TIMI 3</option>
          </select>
        </div>
        <div class="form-group" data-field="residualStenosis">
          <label class="form-label">Residual Stenosis %</label>
          <input type="number" class="form-input" name="residualStenosis" placeholder="%" min="0" max="100" value="${esc(data.residualStenosis)}" />
        </div>
      </div>
    </div>

    <!-- Medications -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">💊</div>
        <div>
          <div class="section-card-title">Medications</div>
          <div class="section-card-subtitle">Procedural medications administered</div>
        </div>
      </div>
      <div class="form-grid form-grid-2">
        <div class="form-group" data-field="heparinDose">
          <label class="form-label">Heparin Dose (units)</label>
          <input type="text" class="form-input" name="heparinDose" placeholder="e.g., 5000 IU" value="${esc(data.heparinDose)}" />
        </div>
        <div class="form-group" data-field="act">
          <label class="form-label">ACT (seconds)</label>
          <input type="text" class="form-input" name="act" placeholder="e.g., 280 sec" value="${esc(data.act)}" />
        </div>
        <div class="form-group" data-field="antiplateletLoading">
          <label class="form-label">Antiplatelet Loading</label>
          <input type="text" class="form-input" name="antiplateletLoading" placeholder="e.g., Ticagrelor 180mg" value="${esc(data.antiplateletLoading)}" />
        </div>
        <div class="form-group" data-field="gpInhibitor">
          <label class="form-label">GP IIb/IIIa Inhibitor</label>
          <input type="text" class="form-input" name="gpInhibitor" placeholder="e.g., Eptifibatide" value="${esc(data.gpInhibitor)}" />
        </div>
      </div>
    </div>

    <!-- Final Impression -->
    <div class="section-card">
      <div class="section-card-header">
        <div class="section-card-icon">📝</div>
        <div>
          <div class="section-card-title">Final Impression</div>
          <div class="section-card-subtitle">Summary of the PCI procedure</div>
        </div>
      </div>
      <div class="form-group" data-field="impression">
        <label class="form-label">Impression</label>
        <textarea class="form-textarea" name="impression" rows="4" placeholder="Describe procedural outcome...">${esc(data.impression)}</textarea>
      </div>
    </div>

    ${renderComplications(data)}
    ${renderSignaturePad(data.signature)}
  `;
}

export function attachPCIEvents(container) {
    // Auto-highlight if post TIMI < 3
    const postTIMI = container.querySelector('[name="postTIMI"]');
    if (postTIMI) {
        postTIMI.addEventListener('change', () => {
            postTIMI.classList.toggle('abnormal-value', postTIMI.value && postTIMI.value !== '3');
        });
    }
}

function esc(val) {
    if (val === undefined || val === null) return '';
    return String(val).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
