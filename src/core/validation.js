// ============================================================
// Validation Engine
// ============================================================

/**
 * Validate a report based on its procedure type.
 * Returns { valid: boolean, errors: { fieldName: message } }
 */
export function validateReport(data) {
    const errors = {};

    // Common: Patient Details
    if (!data.patientName?.trim()) errors.patientName = 'Patient name is required';
    if (!data.uhid?.trim()) errors.uhid = 'UHID is required';
    if (!data.age) errors.age = 'Age is required';
    if (!data.sex) errors.sex = 'Sex is required';
    if (!data.referringDoctor?.trim()) errors.referringDoctor = 'Referring doctor is required';

    // Per-procedure validation
    switch (data.procedure) {
        case 'CAG':
            validateCAG(data, errors);
            break;
        case 'PCI':
            validatePCI(data, errors);
            break;
        case 'RHC':
            validateRHC(data, errors);
            break;
        case 'TPM':
            validateTPM(data, errors);
            break;
    }

    return { valid: Object.keys(errors).length === 0, errors };
}

function validateCAG(data, errors) {
    if (!data.contrastVolume) errors.contrastVolume = 'Contrast volume is mandatory';
    if (!data.fluoroTime) errors.fluoroTime = 'Fluoroscopy time is mandatory';
    if (!data.radiationDose) errors.radiationDose = 'Radiation dose (DAP/Air Kerma) is mandatory';
    if (!data.accessSite) errors.accessSite = 'Access site is required';
}

function validatePCI(data, errors) {
    if (!data.contrastVolume) errors.contrastVolume = 'Contrast volume is mandatory';
    if (!data.fluoroTime) errors.fluoroTime = 'Fluoroscopy time is mandatory';
    if (!data.preTIMI) errors.preTIMI = 'Pre TIMI flow is mandatory';
    if (!data.postTIMI) errors.postTIMI = 'Post TIMI flow is mandatory';
    if (!data.radiationDose) errors.radiationDose = 'Radiation dose is mandatory';
}

function validateRHC(data, errors) {
    if (!data.accessSite) errors.accessSite = 'Access site is required';
    if (!data.contrastVolume) errors.contrastVolume = 'Contrast volume is mandatory';
    if (!data.fluoroTime) errors.fluoroTime = 'Fluoroscopy time is mandatory';
    if (!data.radiationDose) errors.radiationDose = 'Radiation dose is mandatory';
}

function validateTPM(data, errors) {
    if (!data.fluoroTime) errors.fluoroTime = 'Fluoroscopy time is mandatory';
    if (!data.radiationDose) errors.radiationDose = 'Radiation dose is mandatory';
}

/**
 * Apply validation errors to the DOM.
 * Each field should have a parent .form-group with data-field attribute.
 */
export function applyValidationErrors(container, errors) {
    // Clear previous errors
    container.querySelectorAll('.form-group.field-error').forEach(g => {
        g.classList.remove('field-error');
        const msg = g.querySelector('.field-error-msg');
        if (msg) msg.remove();
    });

    // Apply new errors
    for (const [field, message] of Object.entries(errors)) {
        const group = container.querySelector(`.form-group[data-field="${field}"]`);
        if (group) {
            group.classList.add('field-error');
            const errEl = document.createElement('span');
            errEl.className = 'field-error-msg';
            errEl.textContent = message;
            group.appendChild(errEl);
        }
    }

    // Scroll to first error
    const firstError = container.querySelector('.form-group.field-error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Clear all validation errors in a container.
 */
export function clearValidationErrors(container) {
    container.querySelectorAll('.form-group.field-error').forEach(g => {
        g.classList.remove('field-error');
        const msg = g.querySelector('.field-error-msg');
        if (msg) msg.remove();
    });
}
