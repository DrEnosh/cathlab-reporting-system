// ============================================================
// PDF Generator – using jsPDF
// ============================================================

import { jsPDF } from 'jspdf';

const MARGIN_LEFT = 20;
const MARGIN_RIGHT = 20;
const PAGE_WIDTH = 210;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

export function generatePDF(report) {
    const doc = new jsPDF();
    let y = 20;

    // Header
    doc.setFillColor(13, 110, 191);
    doc.rect(0, 0, 210, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CathLab Pro – Digital Reporting System', MARGIN_LEFT, 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(getProcedureTitle(report.procedure), MARGIN_LEFT, 23);
    doc.text(`Generated: ${new Date().toLocaleString()}`, MARGIN_LEFT, 29);

    y = 45;
    doc.setTextColor(0, 0, 0);

    // Patient Details
    y = addSection(doc, y, 'Patient Details', [
        ['Name', report.patientName],
        ['UHID', report.uhid],
        ['Age / Sex', `${report.age || ''} / ${report.sex || ''}`],
        ['Date', report.date],
        ['Referring Doctor', report.referringDoctor],
    ]);

    // Procedure-specific sections
    switch (report.procedure) {
        case 'CAG':
            y = addCAGSections(doc, y, report);
            break;
        case 'PCI':
            y = addPCISections(doc, y, report);
            break;
        case 'RHC':
            y = addRHCSections(doc, y, report);
            break;
        case 'TPM':
            y = addTPMSections(doc, y, report);
            break;
    }

    // Signature
    if (report.signature) {
        y = checkPage(doc, y, 50);
        doc.setFontSize(10);
        doc.text('Digital Signature:', MARGIN_LEFT, y);
        y += 5;
        try {
            doc.addImage(report.signature, 'PNG', MARGIN_LEFT, y, 60, 25);
        } catch (e) { /* signature image error */ }
        y += 30;
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
        doc.text('CathLab Pro – Confidential Medical Document', 105, 295, { align: 'center' });
    }

    return doc;
}

export function downloadPDF(report) {
    const doc = generatePDF(report);
    const filename = `${report.procedure}_${report.patientName || 'Report'}_${report.uhid || ''}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename.replace(/\s+/g, '_'));
}

// --- Helpers ---

function checkPage(doc, y, needed) {
    if (y + needed > 275) {
        doc.addPage();
        return 20;
    }
    return y;
}

function addSection(doc, y, title, rows) {
    y = checkPage(doc, y, 10 + rows.length * 7);

    doc.setFillColor(232, 242, 252);
    doc.rect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, 9, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 110, 191);
    doc.text(title, MARGIN_LEFT + 3, y + 1);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);

    rows.forEach(([label, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            y = checkPage(doc, y, 7);
            doc.setFont('helvetica', 'bold');
            doc.text(`${label}:`, MARGIN_LEFT + 3, y);
            doc.setFont('helvetica', 'normal');
            const text = String(value);
            const lines = doc.splitTextToSize(text, CONTENT_WIDTH - 55);
            doc.text(lines, MARGIN_LEFT + 55, y);
            y += lines.length * 5 + 2;
        }
    });

    return y + 5;
}

function addTextSection(doc, y, title, text) {
    if (!text) return y;
    y = checkPage(doc, y, 20);

    doc.setFillColor(232, 242, 252);
    doc.rect(MARGIN_LEFT, y - 5, CONTENT_WIDTH, 9, 'F');
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 110, 191);
    doc.text(title, MARGIN_LEFT + 3, y + 1);
    y += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const lines = doc.splitTextToSize(String(text), CONTENT_WIDTH - 6);
    lines.forEach(line => {
        y = checkPage(doc, y, 6);
        doc.text(line, MARGIN_LEFT + 3, y);
        y += 5;
    });

    return y + 5;
}

function getProcedureTitle(code) {
    const titles = {
        CAG: 'Coronary Angiography Report',
        PCI: 'PCI / Angioplasty Report',
        RHC: 'Right Heart Catheterization Report',
        TPM: 'Temporary Pacemaker Insertion Report',
    };
    return titles[code] || 'Procedure Report';
}

function addCAGSections(doc, y, r) {
    y = addSection(doc, y, 'Clinical Indication', [
        ['Indication', r.clinicalIndication],
        ['Details', r.indicationDetails],
    ]);

    y = addSection(doc, y, 'Procedure Details', [
        ['Access Site', r.accessSite],
        ['Sheath Size', r.sheathSize],
        ['Catheters Used', r.cathetersUsed],
        ['Contrast Volume (ml)', r.contrastVolume],
        ['Fluoroscopy Time', r.fluoroTime],
        ['Radiation Dose (DAP)', r.radiationDose],
    ]);

    // Anatomy
    y = addSection(doc, y, 'Coronary Anatomy', [
        ['Left Main (LM)', r.lm_stenosis ? `${r.lm_stenosis}% stenosis` : 'Normal'],
        ['LAD Proximal', r.lad_proximal ? `${r.lad_proximal}%` : '-'],
        ['LAD Mid', r.lad_mid ? `${r.lad_mid}%` : '-'],
        ['LAD Distal', r.lad_distal ? `${r.lad_distal}%` : '-'],
        ['LCX Proximal', r.lcx_proximal ? `${r.lcx_proximal}%` : '-'],
        ['LCX OM', r.lcx_om ? `${r.lcx_om}%` : '-'],
        ['RCA Proximal', r.rca_proximal ? `${r.rca_proximal}%` : '-'],
        ['RCA Mid', r.rca_mid ? `${r.rca_mid}%` : '-'],
        ['RCA Distal', r.rca_distal ? `${r.rca_distal}%` : '-'],
        ['Dominance', r.dominance],
    ]);

    y = addSection(doc, y, 'LV Function', [
        ['LVEF %', r.lvef],
        ['RWMA', r.rwma],
    ]);

    y = addTextSection(doc, y, 'Impression', r.impression);
    y = addTextSection(doc, y, 'Recommendations', r.recommendations);
    y = addTextSection(doc, y, 'Complications', r.complicationsText);

    return y;
}

function addPCISections(doc, y, r) {
    y = addSection(doc, y, 'Indication', [['Indication', r.pciIndication]]);

    y = addSection(doc, y, 'Lesion Characteristics', [
        ['Target Vessel', r.targetVessel],
        ['Lesion Location', r.lesionLocation],
        ['Lesion Type', r.lesionType],
        ['Pre-procedure Stenosis %', r.preStenosis],
        ['Pre TIMI Flow', r.preTIMI],
    ]);

    y = addSection(doc, y, 'Intervention Details', [
        ['Guiding Catheter', r.guidingCatheter],
        ['Guidewire', r.guidewire],
        ['Balloon Size', r.balloonSize],
        ['Stent Type', r.stentType],
        ['Stent Size', r.stentSize],
        ['Stent Length', r.stentLength],
        ['Number of Stents', r.numStents],
        ['Post Dilatation', r.postDilatation],
        ['Contrast Volume (ml)', r.contrastVolume],
        ['Fluoroscopy Time', r.fluoroTime],
        ['Radiation Dose', r.radiationDose],
    ]);

    y = addSection(doc, y, 'Final Result', [
        ['Post TIMI Flow', r.postTIMI],
        ['Residual Stenosis %', r.residualStenosis],
    ]);

    y = addSection(doc, y, 'Medications', [
        ['Heparin Dose', r.heparinDose],
        ['ACT', r.act],
        ['Antiplatelet Loading', r.antiplateletLoading],
        ['GP IIb/IIIa', r.gpInhibitor],
    ]);

    y = addTextSection(doc, y, 'Final Impression', r.impression);
    y = addTextSection(doc, y, 'Complications', r.complicationsText);

    return y;
}

function addRHCSections(doc, y, r) {
    y = addSection(doc, y, 'Access & Procedure', [
        ['Access Site', r.accessSite],
        ['Contrast Volume (ml)', r.contrastVolume],
        ['Fluoroscopy Time', r.fluoroTime],
        ['Radiation Dose', r.radiationDose],
    ]);

    y = addSection(doc, y, 'Hemodynamic Data', [
        ['RA Pressure', r.ra_pressure],
        ['RV Pressure', r.rv_pressure],
        ['PA Systolic', r.pa_systolic],
        ['PA Diastolic', r.pa_diastolic],
        ['PA Mean', r.pa_mean],
        ['PCWP', r.pcwp],
        ['Cardiac Output', r.cardiac_output],
        ['Cardiac Index', r.cardiac_index],
        ['PVR (Wood Units)', r.pvr],
    ]);

    y = addSection(doc, y, 'Oxygen Saturation Run', [
        ['SVC', r.sat_svc],
        ['RA', r.sat_ra],
        ['RV', r.sat_rv],
        ['PA', r.sat_pa],
    ]);

    y = addTextSection(doc, y, 'Impression', r.impression);
    y = addTextSection(doc, y, 'Complications', r.complicationsText);

    return y;
}

function addTPMSections(doc, y, r) {
    y = addSection(doc, y, 'Indication & Access', [
        ['Indication', r.tpmIndication],
        ['Access Site', r.accessSite],
    ]);

    y = addSection(doc, y, 'Lead Details', [
        ['Lead Type', r.leadType],
        ['Position', r.leadPosition],
        ['Capture Threshold (V)', r.captureThreshold],
        ['Sensitivity (mV)', r.sensitivity],
        ['Output (V)', r.outputSetting],
        ['Mode', r.pacingMode],
    ]);

    y = addSection(doc, y, 'Final Pacemaker Settings', [
        ['Rate (bpm)', r.finalRate],
        ['Output (V)', r.finalOutput],
        ['Sensitivity (mV)', r.finalSensitivity],
    ]);

    y = addSection(doc, y, 'Procedure Details', [
        ['Fluoroscopy Time', r.fluoroTime],
        ['Radiation Dose', r.radiationDose],
    ]);

    y = addTextSection(doc, y, 'Final Impression', r.impression);
    y = addTextSection(doc, y, 'Complications', r.complicationsText);

    return y;
}
