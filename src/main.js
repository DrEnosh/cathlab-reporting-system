// ============================================================
// CathLab Pro – Main Entry Point
// ============================================================

import './styles/main.css';
import { initRouter, registerRoute } from './core/router.js';
import { getSettings, saveSetting } from './core/store.js';
import { renderNewReport } from './views/NewReport.js';
import { renderReportList } from './views/ReportList.js';
import { renderAdminDashboard } from './views/AdminDashboard.js';

// --- Routes ---
registerRoute('/new', () => renderNewReport());
registerRoute('/reports', () => renderReportList());
registerRoute('/admin', () => renderAdminDashboard());
registerRoute('/report/:id', (params) => renderNewReport(params));

// --- Dark Mode ---
function initDarkMode() {
    const settings = getSettings();
    const theme = settings.theme || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    const toggle = document.getElementById('darkModeToggle');
    toggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        saveSetting('theme', next);
    });
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initRouter();
});
