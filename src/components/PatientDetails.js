// ============================================================
// PatientDetails – Shared component
// ============================================================

export function renderPatientDetails(data = {}) {
    const today = data.date || new Date().toISOString().slice(0, 10);

    return `
    <div class="section-card" id="patientDetailsSection">
      <div class="section-card-header">
        <div class="section-card-icon">👤</div>
        <div>
          <div class="section-card-title">Patient Details</div>
          <div class="section-card-subtitle">Enter patient identification and demographics</div>
        </div>
      </div>
      <div class="form-grid form-grid-3">
        <div class="form-group" data-field="patientName">
          <label class="form-label">Patient Name <span class="required">*</span></label>
          <input type="text" class="form-input" name="patientName" placeholder="Full name" value="${esc(data.patientName)}" autocomplete="off" />
        </div>
        <div class="form-group" data-field="uhid">
          <label class="form-label">UHID <span class="required">*</span></label>
          <input type="text" class="form-input" name="uhid" placeholder="Unique Health ID" value="${esc(data.uhid)}" autocomplete="off" />
        </div>
        <div class="form-group" data-field="age">
          <label class="form-label">Age <span class="required">*</span></label>
          <input type="number" class="form-input" name="age" placeholder="Years" min="0" max="150" value="${esc(data.age)}" />
        </div>
        <div class="form-group" data-field="sex">
          <label class="form-label">Sex <span class="required">*</span></label>
          <select class="form-select" name="sex">
            <option value="">Select</option>
            <option value="Male" ${data.sex === 'Male' ? 'selected' : ''}>Male</option>
            <option value="Female" ${data.sex === 'Female' ? 'selected' : ''}>Female</option>
            <option value="Other" ${data.sex === 'Other' ? 'selected' : ''}>Other</option>
          </select>
        </div>
        <div class="form-group" data-field="date">
          <label class="form-label">Date</label>
          <input type="date" class="form-input" name="date" value="${today}" />
        </div>
        <div class="form-group" data-field="referringDoctor">
          <label class="form-label">Referring Doctor <span class="required">*</span></label>
          <input type="text" class="form-input" name="referringDoctor" placeholder="Dr. Name" value="${esc(data.referringDoctor)}" />
        </div>
        <div class="form-group" data-field="time">
          <label class="form-label">Time</label>
          <input type="time" class="form-input" name="time" value="${data.time || new Date().toTimeString().slice(0, 5)}" />
        </div>
      </div>
    </div>
  `;
}

function esc(val) {
    if (val === undefined || val === null) return '';
    return String(val).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
