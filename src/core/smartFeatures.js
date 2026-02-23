// ============================================================
// Smart Features – Auto-suggestions, abnormal value detection
// ============================================================

/**
 * Evaluate stenosis severity based on percentage.
 */
export function stenosisSeverity(percent) {
    const val = parseFloat(percent);
    if (isNaN(val) || val === 0) return null;
    if (val >= 90) return { level: 'critical', label: 'Critical Stenosis', className: 'severe' };
    if (val >= 70) return { level: 'severe', label: 'Severe Stenosis', className: 'severe' };
    if (val >= 50) return { level: 'moderate', label: 'Moderate Stenosis', className: 'moderate' };
    if (val >= 25) return { level: 'mild', label: 'Mild Stenosis', className: 'normal' };
    return { level: 'minimal', label: 'Minimal Disease', className: 'normal' };
}

/**
 * Check if PA mean pressure indicates pulmonary hypertension.
 */
export function checkPulmonaryHypertension(paMean) {
    const val = parseFloat(paMean);
    if (isNaN(val)) return null;
    if (val > 25) return { flag: true, label: 'Pulmonary Hypertension', severity: val > 40 ? 'severe' : 'moderate' };
    return { flag: false };
}

/**
 * Generate auto-impression for CAG based on stenosis data.
 */
export function generateCAGImpression(anatomyData) {
    const findings = [];
    const recommendations = [];

    const vessels = [
        { name: 'Left Main (LM)', key: 'lm_stenosis' },
        { name: 'LAD Proximal', key: 'lad_proximal' },
        { name: 'LAD Mid', key: 'lad_mid' },
        { name: 'LAD Distal', key: 'lad_distal' },
        { name: 'LCX Proximal', key: 'lcx_proximal' },
        { name: 'LCX OM', key: 'lcx_om' },
        { name: 'RCA Proximal', key: 'rca_proximal' },
        { name: 'RCA Mid', key: 'rca_mid' },
        { name: 'RCA Distal', key: 'rca_distal' },
    ];

    let severeCount = 0;
    let significantVessels = [];

    vessels.forEach(v => {
        const val = parseFloat(anatomyData[v.key]);
        if (isNaN(val) || val === 0) return;
        const severity = stenosisSeverity(val);
        if (severity) {
            findings.push(`${v.name}: ${val}% stenosis (${severity.label})`);
            if (val >= 70) {
                severeCount++;
                significantVessels.push(v.name);
            }
        }
    });

    if (findings.length === 0) {
        findings.push('Normal coronary arteries');
        recommendations.push('Medical management');
    } else if (severeCount === 0) {
        recommendations.push('Medical management advised');
    } else if (severeCount === 1) {
        recommendations.push('Single vessel disease – PCI may be considered');
    } else if (severeCount === 2) {
        recommendations.push('Double vessel disease – PCI or CABG may be considered');
    } else {
        recommendations.push('Multi-vessel disease / Triple vessel disease – CABG recommended');
    }

    // LM disease
    const lmStenosis = parseFloat(anatomyData.lm_stenosis);
    if (!isNaN(lmStenosis) && lmStenosis >= 50) {
        recommendations.unshift('⚠️ Significant Left Main disease – Urgent surgical consult recommended');
    }

    return {
        findings: findings.join('\n'),
        recommendations: recommendations.join('\n'),
        severeCount,
        significantVessels,
    };
}

/**
 * Generate auto-impression for RHC based on pressures.
 */
export function generateRHCImpression(hemoData) {
    const impressions = [];

    const paSystolic = parseFloat(hemoData.pa_systolic);
    const paDiastolic = parseFloat(hemoData.pa_diastolic);
    const paMean = parseFloat(hemoData.pa_mean);
    const pcwp = parseFloat(hemoData.pcwp);
    const ci = parseFloat(hemoData.cardiac_index);
    const pvr = parseFloat(hemoData.pvr);

    // PA pressure
    if (!isNaN(paMean)) {
        if (paMean > 25) {
            impressions.push(`Pulmonary hypertension detected (PA mean: ${paMean} mmHg)`);
            if (!isNaN(pcwp) && pcwp > 15) {
                impressions.push('Post-capillary component present (elevated PCWP)');
            } else if (!isNaN(pcwp) && pcwp <= 15) {
                impressions.push('Pre-capillary pulmonary hypertension (normal PCWP)');
            }
        } else {
            impressions.push('Normal pulmonary artery pressures');
        }
    }

    // Cardiac output
    if (!isNaN(ci)) {
        if (ci < 2.2) impressions.push('Low cardiac index – suggests poor cardiac function');
        else if (ci > 4.0) impressions.push('High cardiac index');
        else impressions.push('Normal cardiac index');
    }

    // PVR
    if (!isNaN(pvr)) {
        if (pvr > 3) impressions.push('Elevated pulmonary vascular resistance');
        else impressions.push('Normal pulmonary vascular resistance');
    }

    return impressions.join('\n') || 'Insufficient data for auto-impression';
}

/**
 * Calculate PVR from given hemodynamic data.
 * PVR = (mean PAP - PCWP) / CO (in Wood Units)
 */
export function calculatePVR(paMean, pcwp, co) {
    const p = parseFloat(paMean);
    const w = parseFloat(pcwp);
    const c = parseFloat(co);
    if (isNaN(p) || isNaN(w) || isNaN(c) || c === 0) return null;
    return ((p - w) / c).toFixed(2);
}

/**
 * Check if a value is abnormal and should be highlighted.
 */
export function isAbnormalValue(field, value) {
    const val = parseFloat(value);
    if (isNaN(val)) return false;

    const thresholds = {
        lvef: { low: 40, high: null, abnormalWhen: 'below' },
        pa_mean: { low: null, high: 25, abnormalWhen: 'above' },
        pvr: { low: null, high: 3, abnormalWhen: 'above' },
        cardiac_index: { low: 2.2, high: 4.0, abnormalWhen: 'outside' },
        pcwp: { low: null, high: 15, abnormalWhen: 'above' },
        capture_threshold: { low: null, high: 2, abnormalWhen: 'above' },
    };

    const t = thresholds[field];
    if (!t) return false;

    if (t.abnormalWhen === 'below') return val < t.low;
    if (t.abnormalWhen === 'above') return val > t.high;
    if (t.abnormalWhen === 'outside') return val < t.low || val > t.high;
    return false;
}
