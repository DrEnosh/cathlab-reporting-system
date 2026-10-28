# CathLab Pro

A browser app for writing cardiac catheterization lab procedure reports. A technologist picks the procedure, fills in a structured form, and exports a signed PDF.

> **Prototype.** Everything runs in the browser and reports are saved to the browser's local storage on this device only. There is no server, login or patient database. Do not enter real patient data.

## Procedure templates

- **CAG**: Coronary angiography
- **PCI**: PCI / angioplasty
- **RHC**: Right heart catheterization
- **TPM**: Temporary pacemaker insertion

## Features

- Structured forms per procedure with patient details, findings, complications and a progress bar
- Field validation before a report can be finalized
- Smart helpers: stenosis severity grading, pulmonary hypertension check, pulmonary vascular resistance (PVR) calculation, flags for abnormal values, and an auto-drafted impression for CAG and RHC reports
- On-screen signature pad
- PDF export (jsPDF)
- Report list, plus admin and doctor dashboards
- Light and dark mode
- **CathAI** chat widget. It is a *simulated* assistant with scripted replies, not a connected language model.

The user flow and architecture diagrams are in [`docs/diagrams.md`](docs/diagrams.md).

## Run it

You need a current Node.js (Vite 7 needs 20.19 or newer).

```bash
npm install
npm run dev        # development server
npm run build      # production build in dist/
npm run preview    # serve the production build
```

## Project structure

```
index.html
src/
  main.js              Entry point, routes, dark mode
  core/                Router, local-storage store, validation, PDF, smart helpers
  components/          Patient details, complications, signature pad, progress bar, CathAI widget
  templates/           CAG, PCI, RHC and TPM report forms
  views/               New report, report list, admin and doctor dashboards
  styles/main.css
docs/diagrams.md       Mermaid diagrams
```

## Tech

Vanilla JavaScript (ES modules), Vite, [jsPDF](https://github.com/parallax/jsPDF) and [signature_pad](https://github.com/szimek/signature_pad).

## Author

Dr. Enosh A Paulson. [LinkedIn](https://linkedin.com/in/dr-enosh) · [GitHub](https://github.com/DrEnosh)
