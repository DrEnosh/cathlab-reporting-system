// ============================================================
// ProgressBar – Step indicator component
// ============================================================

export function renderProgressBar(currentStep = 1) {
    const steps = [
        { num: 1, label: 'Patient Details' },
        { num: 2, label: 'Procedure Data' },
        { num: 3, label: 'Finalize & Sign' },
    ];

    return `
    <div class="progress-bar" id="progressBar">
      ${steps.map((step, i) => `
        <div class="progress-step ${step.num < currentStep ? 'completed' : ''} ${step.num === currentStep ? 'active' : ''}">
          <span class="step-number">${step.num < currentStep ? '✓' : step.num}</span>
          <span>${step.label}</span>
        </div>
        ${i < steps.length - 1 ? `<div class="progress-connector ${step.num < currentStep ? 'completed' : ''}"></div>` : ''}
      `).join('')}
    </div>
  `;
}

export function updateProgressBar(currentStep) {
    const bar = document.getElementById('progressBar');
    if (bar) {
        bar.outerHTML = renderProgressBar(currentStep);
    }
}
