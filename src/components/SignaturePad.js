// ============================================================
// SignaturePad – Digital signature component
// ============================================================

import SignaturePadLib from 'signature_pad';

let padInstance = null;

export function renderSignaturePad(existingSignature = null) {
    return `
    <div class="section-card" id="signatureSection">
      <div class="section-card-header">
        <div class="section-card-icon">✍️</div>
        <div>
          <div class="section-card-title">Digital Signature</div>
          <div class="section-card-subtitle">Sign to authenticate this report</div>
        </div>
      </div>
      <div class="signature-container">
        <canvas id="signatureCanvas" width="500" height="180"></canvas>
        <div class="signature-actions">
          <button type="button" class="btn btn-ghost btn-sm" id="clearSignature">Clear</button>
          ${existingSignature ? '<p style="font-size:0.75rem;color:var(--color-text-muted);margin-left:0.5rem;">Previous signature loaded</p>' : ''}
        </div>
      </div>
    </div>
  `;
}

export function initSignaturePad(existingSignature = null) {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;

    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    canvas.getContext('2d').scale(ratio, ratio);

    padInstance = new SignaturePadLib(canvas, {
        backgroundColor: 'rgb(255, 255, 255)',
        penColor: 'rgb(20, 40, 80)',
    });

    if (existingSignature) {
        padInstance.fromDataURL(existingSignature);
    }

    document.getElementById('clearSignature')?.addEventListener('click', () => {
        padInstance.clear();
    });
}

export function getSignatureData() {
    if (!padInstance || padInstance.isEmpty()) return null;
    return padInstance.toDataURL('image/png');
}
