# SAFEPAWS — UX-06 DEPENDENCY GRAPH
## Sequential & Parallel Execution Topologies, Critical Paths & Cross-Panel Handoffs

**Document Status:** Final Official Architecture Specification  
**Milestone:** Phase UX-06.0 Initial Discovery & Architecture Lock  
**Command Authority:** Master Orchestrator  
**Repository:** `/home/samudra/Projects/VisualSCode/VisualCode/Vscoding/Projects/SAFEPAWS/safepaws_sih`  

---

## 1. Master Program Dependency Topology

The UX-06 transformation program is structured into clear phases governed by strict prerequisites. No dependent implementation may begin until its parent contract is locked:

```mermaid
flowchart TD
    %% Phase 0
    P0["UX-06.0: Architecture Discovery & Contract Lock\n(CURRENT MILESTONE — FOUNDATIONAL)"]

    %% Phase 1
    P1["UX-06.1: Foundation & Shared Component Contracts\n(PANEL A LEAD)"]
    
    %% Phase 2 & 3 & 4 & 5 (Parallel Execution under Panel Ownership)
    subgraph ParallelTracks ["Parallel Domain Execution Tracks"]
        P2["UX-06.2: Landing & Public Finder Experience\n(PANEL B LEAD)"]
        P3["UX-06.3: Owner Console & Medical Privacy\n(PANEL C LEAD)"]
        P4["UX-06.4: Biometric Scanner HUD & Safe Pipeline\n(PANEL D LEAD)"]
        P5["UX-06.5: Community Board, Incident Room & Reunification\n(PANEL E LEAD)"]
    end

    %% Phase 6
    P6["UX-06.6: Multi-Viewport Regression, A11y & Production Release Gate\n(PANEL F LEAD & INDEPENDENT GATEKEEPER)"]

    %% Dependencies
    P0 --> P1
    P1 --> P2
    P1 --> P3
    P1 --> P4
    P1 --> P5

    P2 --> P6
    P3 --> P6
    P4 --> P6
    P5 --> P6
```

---

## 2. Cross-Panel Contract Mappings

Each panel requires explicit data, UI, or service contracts from other panels before its implementation can be certified:

```mermaid
flowchart LR
    subgraph PanelA_Outputs ["Panel A Primitives"]
        A_Tokens["Accessible Tokens (#8B4A00, #F6F1E7, #1C1A17)"]
        A_UI["UI Primitives (Button, Dialog, FormField, EmptyState)"]
        A_Nav["Responsive Nav Dock & Layout Shell"]
    end

    subgraph PanelD_Outputs ["Panel D Biometrics"]
        D_Model["Safe Loader (weights_only=True)"]
        D_API["POST /api/v1/search/identify (5-State Contract)"]
        D_HUD["Spatial Reticle Camera HUD"]
    end

    subgraph PanelC_Outputs ["Panel C Owner"]
        C_Auth["Auth State & Protected DashboardRoute"]
        C_Priv["Medical Privacy Invariants & PATCH Endpoint"]
    end

    subgraph PanelE_Outputs ["Panel E Community"]
        E_Board["Recovery Board (/lost)"]
        E_Room["Incident Room (/alerts/:id)"]
        E_Sight["Sighting Flow (/sightings/new)"]
    end

    A_Tokens --> PanelB_Landing["Panel B Landing Page"]
    A_UI --> PanelB_Landing
    A_UI --> PanelC_Owner["Panel C Owner Console"]
    A_UI --> PanelE_Comm["Panel E Recovery & Feed"]
    
    D_API --> PanelD_Scan["Panel D Scanner Page (/scan)"]
    D_HUD --> PanelD_Scan
    
    C_Priv --> PanelB_Tag["Public Tag Profile (/p/:tagId)"]
    C_Auth --> PanelC_Owner
    
    E_Sight --> PanelE_Comm
    E_Board --> PanelE_Comm
```

---

## 3. Critical Path & Blocker Topology

The path to production release is governed by three critical paths that cannot be bypassed:

```
[ CRITICAL PATH 1: UI & ACCESSIBILITY ]
UX-06.0 (Inventory) -> UX-06.1 (Primitives) -> UX-06.2..06.5 (Page Refinements) -> UX-06.6 (Playwright 10 Viewports & WCAG 2.2 AA)

[ CRITICAL PATH 2: BIOMETRIC IDENTITY INTEGRITY ]
UX-06.0 (Weights Audit) -> Safe State-Dict Checkpoint (weights_only=True) -> Multi-Identity Gallery Discrimination -> 5-State Result HUD

[ CRITICAL PATH 3: MANDATORY PRODUCTION INFRASTRUCTURE (GATE 4) ]
Linux Host Binaries Check -> Containerized PostgreSQL 16 + PostGIS Setup -> Alembic Migration Upgrade/Downgrade -> 4 Live Integration Tests Passing
```

### Mandatory Infrastructure Invariant
Critical Path 3 (Gate 4: Live PostgreSQL / PostGIS Integration) is a hard blocker. If an external or containerized Linux PostgreSQL database is unavailable in the execution environment:
- SQLite runs will be cleanly reported as SQLite developer testing.
- The 4 skipped PostgreSQL integration tests will remain honestly reported as SKIPPED.
- The production gate will remain on **`HOLD — PRODUCTION RELEASE NOT APPROVED`**.
- Under no circumstances will mock databases be claimed as live PostgreSQL verification.
