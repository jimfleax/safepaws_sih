# SAFEPAWS — UX-06 ACCEPTANCE CRITERIA
## Quality Standards, Verification Taxonomies & Hard-Gate Sign-Off Rules

**Document Status:** Final Official Quality Specification  
**Milestone:** Phase UX-06.0 Initial Discovery & Architecture Lock  
**Auditing Authority:** Independent Release Gatekeeper (Panel F Lead) & Master Orchestrator  
**Repository:** `/home/samudra/Projects/VisualSCode/VisualCode/Vscoding/Projects/SAFEPAWS/safepaws_sih`  

---

## 1. Ten Dimensional Evaluation Framework

Every workstream deliverable and phase milestone is evaluated across ten standardized dimensions:

| Dimension ID | Dimension Title | Standard Weight | Evaluation Mandate |
|:---:|:---|:---:|:---|
| **DIM-01** | **Product Functionality & Route Integrity** | 20% | All 15 routes must resolve cleanly with 0 broken links, 0 console errors, real state transitions, and no dead placeholder actions. |
| **DIM-02** | **Backend, API & Data Integrity** | 15% | All API endpoints return typed Pydantic responses; database migrations are reversible; foreign keys and constraints enforced. |
| **DIM-03** | **Security, Privacy & Consent Invariants** | 20% | Safe PyTorch loading (`weights_only=True`); 12 medical privacy invariants pass; PII stripped from public views; 422 errors sanitized; CORS fails closed. |
| **DIM-04** | **Accessibility (WCAG 2.2 AA)** | 15% | Automated axe-core clean audit; $\ge 4.5:1$ text contrast; $\ge 44\times 44\text{px}$ touch targets; visible focus rings; reduced-motion respected. |
| **DIM-05** | **End-to-End Journeys & Regression Suite** | 10% | All Playwright tests assert real DOM states; core journeys (finder, owner, scanner, community) execute green in real Chromium browser. |
| **DIM-06** | **Responsive Multi-Viewport Experience** | 5% | 10-viewport responsive verification (320px, 360px, 375px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px) with 0 layout shift or overflow. |
| **DIM-07** | **Performance & Bundle Economics** | 5% | Production bundle JS $\le 150\text{ kB}$ gzip; initial CSS $\le 25\text{ kB}$ gzip; Vite build $\le 5.0\text{s}$; 60 FPS composite animations. |
| **DIM-08** | **Build & Release Engineering Hygiene** | 5% | `npx tsc --noEmit` 0 errors; 100% green Vitest unit tests; strict Git working-tree preservation (0 unauthorized commits). |
| **DIM-09** | **ML & Biometric Identity Integrity** | 5% | YOLOv8 nano CPU detection; MobileNetV2 1280-d unit vector extraction; multi-identity gallery discrimination tested across MATCH, AMBIGUOUS, UNKNOWN. |
| **DIM-10** | **Operational Readiness & Observability** | 0% (Gate) | `/health/readiness` accurately checks DB, model weights, and FAISS index; honest status reporting without mock masking. |

---

## 2. Standardized Evidence Taxonomies

To eliminate ambiguous or subjective reporting, every auditor must categorize claims using five strict labels:

- **`VERIFIED`:** Supported by direct, reproducible test execution logs, terminal output, cryptographic hashes, or captured test artifacts generated in the current environment.
- **`PARTIALLY VERIFIED`:** Verified under restricted conditions (e.g. SQLite local mode, mock quality gate, or desktop viewport only), with specific limitations explicitly noted.
- **`FAILED`:** Explicit test failure, regression, assertion mismatch, or unhandled exception during test execution.
- **`BLOCKED`:** Execution could not proceed due to missing host binaries, restricted OS permissions, or absent external infrastructure.
- **`NOT VERIFIED`:** Capability or test was skipped, not executed, or remains pending future milestone authorization.

> [!WARNING]
> Under no circumstances may a test labeled `SKIPPED` be reported as `VERIFIED` or `PASSED`.

---

## 3. Panel-by-Panel Acceptance Criteria

### Panel A: Design System & Shared Primitives
- [ ] Accessible Marigold text token (`--color-accent-text: #8B4A00`) yields $\ge 6.0:1$ contrast against Bone canvas.
- [ ] All interactive buttons meet minimum $44\times 44\text{px}$ touch bounding boxes.
- [ ] FormField primitives auto-generate unique IDs via `useId()` and link `aria-describedby` to error messages.
- [ ] Shared dialogs implement explicit focus trapping and return focus to triggering element upon escape or close.

### Panel B: Landing & Public Experience
- [ ] Landing page (`/`) loads with 0 console errors and 0 layout shifts.
- [ ] First-time visitor can launch biometric scan or pet registration with a single click.
- [ ] Lenis smooth scroll active on desktop; completely disabled when `prefers-reduced-motion` is enabled or viewport $< 768\text{px}$.
- [ ] Public Tag Profile (`/p/:tagId`) masks owner veterinary notes by default.

### Panel C: Owner & Pet Ecosystem
- [ ] Unauthenticated users attempting to access `/dashboard` or `/pets/*` are cleanly redirected to `/`.
- [ ] Pet registration wizard validates image input before initiating backend enrollment.
- [ ] `MedicalPrivacyToggle` sends instantaneous PATCH request to update `share_medical_notes` with optimistic UI feedback.
- [ ] Sensitive owner PII (phone number, home address) is completely excluded from public tag API wire responses.

### Panel D: Scanner & Identity Engine
- [ ] Model weights load exclusively with `torch.load(..., weights_only=True)`. Unsafe `weights_only=False` fallback is eliminated.
- [ ] Missing or corrupted checkpoint files trigger HTTP 503 `DomainException` without crashing the FastAPI process.
- [ ] Real YOLOv8 detector rejects non-dog images with `NoDogDetectedError` (HTTP 422).
- [ ] Biometric matching against an enrolled multi-identity gallery cleanly distinguishes same-dog ($\ge 0.85$, `MATCH`), ambiguous ($0.70-0.85$, `AMBIGUOUS`), and different dog ($< 0.70$, `UNKNOWN`).

### Panel E: Community & Reunification
- [ ] Missing pet broadcast form (`/lost/new`) submits valid coordinates and creates an active incident room (`/alerts/:id`).
- [ ] Anonymous sighting submission (`/sightings/new`) succeeds without requiring authentication cookies.
- [ ] Recovery board (`/lost`) filters alerts by species and proximity radius without page reload.
- [ ] Owner can resolve active alerts, immediately updating the status badge to "Reunited".

### Panel F: Independent Quality & Release
- [ ] 100% green execution across all targeted Playwright release specs.
- [ ] Multi-viewport responsive tests pass without horizontal scrollbars across 10 viewports.
- [ ] Production Vite build compiles in $\le 5.0\text{s}$ with 0 TypeScript compiler errors.
- [ ] Gate 4 (Live PostgreSQL / PostGIS) independently audited. If blocked, verdict remains strictly on `HOLD`.
