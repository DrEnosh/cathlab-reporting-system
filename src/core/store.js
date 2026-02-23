// ============================================================
// Store – LocalStorage-backed data store
// ============================================================

const STORAGE_KEY = 'cathlab_pro_data';
const DRAFT_KEY = 'cathlab_pro_draft';
const SETTINGS_KEY = 'cathlab_pro_settings';

function loadData() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { reports: [] };
    } catch {
        return { reports: [] };
    }
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Reports ---

export function getAllReports() {
    return loadData().reports;
}

export function getReport(id) {
    return loadData().reports.find(r => r.id === id) || null;
}

export function saveReport(report) {
    const data = loadData();
    const idx = data.reports.findIndex(r => r.id === report.id);
    report.updatedAt = new Date().toISOString();

    if (idx >= 0) {
        data.reports[idx] = { ...data.reports[idx], ...report };
    } else {
        report.id = report.id || generateId();
        report.createdAt = report.createdAt || new Date().toISOString();
        data.reports.unshift(report);
    }

    saveData(data);
    return report;
}

export function deleteReport(id) {
    const data = loadData();
    data.reports = data.reports.filter(r => r.id !== id);
    saveData(data);
}

export function searchReports(query) {
    const q = query.toLowerCase().trim();
    if (!q) return getAllReports();
    return getAllReports().filter(r =>
        (r.patientName || '').toLowerCase().includes(q) ||
        (r.uhid || '').toLowerCase().includes(q) ||
        (r.procedure || '').toLowerCase().includes(q)
    );
}

// --- Draft ---

export function saveDraft(draft) {
    draft._draftSavedAt = new Date().toISOString();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadDraft() {
    try {
        return JSON.parse(localStorage.getItem(DRAFT_KEY));
    } catch {
        return null;
    }
}

export function clearDraft() {
    localStorage.removeItem(DRAFT_KEY);
}

// --- Settings ---

export function getSettings() {
    try {
        return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || { theme: 'light' };
    } catch {
        return { theme: 'light' };
    }
}

export function saveSetting(key, value) {
    const settings = getSettings();
    settings[key] = value;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// --- Helpers ---

function generateId() {
    return 'RPT-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

// --- Dashboard Stats ---

export function getDashboardStats(dateFrom, dateTo) {
    let reports = getAllReports();

    if (dateFrom) {
        reports = reports.filter(r => new Date(r.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
        reports = reports.filter(r => new Date(r.createdAt) <= new Date(dateTo + 'T23:59:59'));
    }

    const total = reports.length;
    const byProcedure = {};
    let totalContrast = 0;
    let contrastCount = 0;
    let totalComplications = 0;
    let totalRadiation = 0;
    let radiationCount = 0;

    reports.forEach(r => {
        byProcedure[r.procedure] = (byProcedure[r.procedure] || 0) + 1;

        const contrast = parseFloat(r.contrastVolume);
        if (!isNaN(contrast)) {
            totalContrast += contrast;
            contrastCount++;
        }

        const rad = parseFloat(r.radiationDose);
        if (!isNaN(rad)) {
            totalRadiation += rad;
            radiationCount++;
        }

        if (r.complications && r.complications.length > 0) {
            totalComplications++;
        }
    });

    return {
        total,
        byProcedure,
        avgContrast: contrastCount ? (totalContrast / contrastCount).toFixed(1) : '0',
        avgRadiation: radiationCount ? (totalRadiation / radiationCount).toFixed(1) : '0',
        complicationRate: total ? ((totalComplications / total) * 100).toFixed(1) : '0',
    };
}
