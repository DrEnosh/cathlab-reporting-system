# CathLab Pro – Architecture & Workflow Diagrams

This document contains visual representations of the system architecture and user workflows for the **CathLab Pro** application, generated using Mermaid diagrams.

---

## 1. Application Flow Diagram
This flowchart describes the end-to-end journey of a cardiovascular technologist using the application to record and finalize a reporting procedure.

```mermaid
flowchart TD
    %% Define styles
    classDef primary fill:#0D6EBF,stroke:#094D87,color:#fff
    classDef secondary fill:#0A9396,stroke:#076E70,color:#fff
    classDef highlight fill:#C07A00,stroke:#8B5A00,color:#fff
    classDef success fill:#0F8A5F,stroke:#0A6042,color:#fff

    Start([Technologist Logs In]):::primary
    Home[Dashboard / Home Screen]
    Action{Choose Action}
    
    %% Main paths
    Start --> Home
    Home --> Action
    
    %% New Report Path
    Action -->|Create New| SelectProc[Select Procedure Type]:::secondary
    SelectProc -->|CAG / PCI / RHC / TPM| LoadTemp[Dynamic Template Loads]
    LoadTemp --> FillData[Enter Patient & Procedural Data]
    
    %% Validation Loop
    FillData --> Validate{Form Validation Engine}
    Validate -->|Missing Fields / Errors| ErrorState[Highlight Errors & Warning Toasts]:::highlight
    ErrorState --> FillData
    
    Validate -->|All Mandatory Fields Filled| SmartAnalysis[Smart Feature Auto-Analysis]
    SmartAnalysis -->|Suggestions Generated| SuggestionReview[Review Auto-Suggestions]
    SuggestionReview --> Signature[Capture Digital Signature]
    
    %% Finalization
    Signature --> Submit[Submit Final Report]
    Submit --> Store[(Saved to LocalStore)]:::success
    Store --> PDF[Generate Printable PDF]
    
    %% Other Paths
    Action -->|Search Past| SearchMode[Search by UHID / Patient Name]
    SearchMode --> EditMode[Edit Draft or View Completed]
    EditMode --> FillData
    
    Action -->|View Data| Dashboard[Admin Analytics Dashboard]
    Dashboard --> Filters[Apply Date/Procedure Filters]
```

---

## 2. System "Fishbone" Diagram (Ishikawa)
This fishbone diagram illustrates the contributing components that enable the core goal of **CathLab Pro**: Generating standardized, accurate, and medical-grade digital reports.

```mermaid
flowchart RL
    %% Define Goal
    Goal(Standardized Digital<br/>Procedure Report)
    class Goal primary
    
    %% The main spine
    Goal --- Spine1(( ))
    Spine1 --- Spine2(( ))
    Spine2 --- Spine3(( ))
    
    style Spine1 fill:none,stroke:none
    style Spine2 fill:none,stroke:none
    style Spine3 fill:none,stroke:none

    %% Categories (Ribs)
    Templates[Dynamic Templates] --> Spine1
    SmartFeatures[Smart Intelligence] --> Spine2
    UX[User Experience] --> Spine3
    
    DataStore[Data & Export] --> Spine1
    Validation[Clinical Validation] --> Spine2
    Security[Identity / Security] --> Spine3

    %% Detailed Bones (Sub-causes)
    CAG(CAG Cor. Anatomy) -.-> Templates
    PCI(PCI Lesion Data) -.-> Templates
    RHC(RHC Hemodynamics) -.-> Templates
    
    AutoSug(Auto-Impressions) -.-> SmartFeatures
    PVRCalc(Auto PVR Calculator) -.-> SmartFeatures
    
    DarkMode(Dark/Light Modes) -.-> UX
    Responsive(Tablet/Desktop Ready) -.-> UX
    
    PDF(jsPDF Integration) -.-> DataStore
    Local(LocalStorage DB) -.-> DataStore
    
    Mandatory(Mandatory Radiation) -.-> Validation
    Abnormal(Abnormal Value Flags) -.-> Validation
    
    Sig(Digital Signature Pad) -.-> Security
    Draft(Auto-save Drafts) -.-> Security

    classDef primary fill:#0D6EBF,stroke:#094D87,color:#fff,font-weight:bold
```

---

*Note: You can view these diagrams natively if you push to GitHub, as GitHub natively renders `mermaid` code blocks in Markdown files.*
