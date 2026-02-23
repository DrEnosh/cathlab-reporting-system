// ============================================================
// Utility Functions
// ============================================================

/**
 * Show a toast notification.
 */
export function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <span>${icons[type] || ''}</span>
    <span>${message}</span>
  `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Collect all form data from a container.
 */
export function collectFormData(form) {
    const data = {};
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        const name = input.name;
        if (!name) return;

        // Skip checkboxes (handled separately)
        if (input.type === 'checkbox') return;
        if (input.type === 'radio') {
            if (input.checked) data[name] = input.value;
            return;
        }

        data[name] = input.value;
    });

    return data;
}

/**
 * Format a date string.
 */
export function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
