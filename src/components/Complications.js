// ============================================================
// Complications – Shared component
// ============================================================

const COMMON_COMPLICATIONS = [
    'None',
    'Hematoma',
    'Vasovagal reaction',
    'Access site bleeding',
    'Arrhythmia',
    'Coronary dissection',
    'Perforation',
    'No reflow',
    'Contrast reaction',
    'Stroke / TIA',
    'Air embolism',
    'AV fistula',
    'Death',
];

export function renderComplications(data = {}) {
    const selected = data.complications || [];
    const text = data.complicationsText || '';

    return `
    <div class="section-card" id="complicationsSection">
      <div class="section-card-header">
        <div class="section-card-icon">⚠️</div>
        <div>
          <div class="section-card-title">Complications</div>
          <div class="section-card-subtitle">Document any complications during the procedure</div>
        </div>
      </div>
      <div class="checkbox-group" id="complicationsCheckboxes">
        ${COMMON_COMPLICATIONS.map(c => `
          <label class="checkbox-item">
            <input type="checkbox" name="complications" value="${c}" ${selected.includes(c) ? 'checked' : ''} />
            ${c}
          </label>
        `).join('')}
      </div>
      <div class="form-group full-width mt-4">
        <label class="form-label">Additional Details</label>
        <textarea class="form-textarea" name="complicationsText" placeholder="Describe any complications in detail...">${esc(text)}</textarea>
      </div>
    </div>
  `;
}

function esc(val) {
    if (val === undefined || val === null) return '';
    return String(val).replace(/</g, '&lt;');
}
