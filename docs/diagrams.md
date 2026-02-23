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
    %% Define Goal (The Problem or Effect)
    Goal(Problem or EFFECT)
    class Goal effect

    %% The Main Spine
    Goal --- Spine1(( ))
    Spine1 --- Spine2(( ))
    
    style Spine1 fill:none,stroke:none
    style Spine2 fill:none,stroke:none

    %% Top Categories (MAN, MACHINE)
    Man[MAN] --> Spine1
    Machine[MACHINE] --> Spine2

    %% Bottom Categories (MATERIAL, METHOD)
    Material[MATERIAL] --> Spine1
    Method[METHOD] --> Spine2

    %% Sub-causes for MAN
    CauseMan1(Cause) -.-> Man
    CauseMan2(Cause) -.-> Man
    CauseMan3(Cause) -.-> Man
    SubCauseMan1(Sub-Cause) -.-> CauseMan2

    %% Sub-causes for MACHINE
    CauseMach1(Cause) -.-> Machine
    CauseMach2(Cause) -.-> Machine
    CauseMach3(Cause) -.-> Machine
    SubCauseMach1(Sub-Cause) -.-> CauseMach2

    %% Sub-causes for MATERIAL
    CauseMat1(Cause) -.-> Material
    CauseMat2(Cause) -.-> Material
    CauseMat3(Cause) -.-> Material
    SubCauseMat1(Sub-Cause) -.-> CauseMat2

    %% Sub-causes for METHOD
    CauseMeth1(Cause) -.-> Method
    CauseMeth2(Cause) -.-> Method
    CauseMeth3(Cause) -.-> Method
    SubCauseMeth1(Sub-Cause) -.-> CauseMeth2

    %% Styles
    classDef effect fill:#FFFF99,stroke:#FF0000,stroke-width:3px,color:#FF0000,font-weight:bold
    style Man fill:#FFFF99,stroke:#000080,stroke-width:2px,color:#000080,font-weight:bold
    style Machine fill:#FFFF99,stroke:#000080,stroke-width:2px,color:#000080,font-weight:bold
    style Material fill:#FFFF99,stroke:#000080,stroke-width:2px,color:#000080,font-weight:bold
    style Method fill:#FFFF99,stroke:#000080,stroke-width:2px,color:#000080,font-weight:bold
```

---

*Note: You can view these diagrams natively if you push to GitHub, as GitHub natively renders `mermaid` code blocks in Markdown files.*
