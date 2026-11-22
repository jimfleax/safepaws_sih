# SAFEPAWS — UX-05.2 PRODUCTION READINESS HARD-GATE PLAN
## Master Architecture, Fail-Closed Security Invariants, Real Biometric Verification & Release Reassessment

**Role:** Principal Software Architect, Production Readiness Engineer, Backend Security Auditor, ML Systems Engineer, and Independent Release Gatekeeper  
**Repository:** `/home/samudra/Projects/VisualSCode/VisualCode/Vscoding/Projects/SAFEPAWS/safepaws_sih`  
**Branch:** `frontend`  
**Committed Baseline HEAD:** `f51ee728377358dd9d4e6314770d03185bfb6a88`  
**Phase:** UX-05.2 Production Readiness Hard-Gate Closure  
**Current Gate Status:** `HOLD — PRODUCTION RELEASE NOT APPROVED` (Pending real biometric verification, PostgreSQL verification, database migration, and comprehensive E2E evidence)

---

## 1. Executive Summary & Problem Formulation

In Phase UX-05 and UX-05.1, the frontend UI/UX transformation and code-level fixes achieved impressive results. However, independent forensic scrutiny revealed that the reported "Production Ready" status was premature:
1. **Biometric Engine Silent Fallbacks:** In `backend/app/api/dependencies.py`, when ML dependencies or weights were missing, the backend silently fell back to `FallbackNoseDetector` (returning fixed bounding box `[10, 10, 50, 50]` with confidence `0.95`) and `BiometricEmbeddingModel` in `scaffold_mode=True` (generating deterministic synthetic vectors). In a production environment, this could lead to catastrophic identity spoofing or false pet matches.
2. **PostgreSQL vs SQLite Gap:** Backend tests were validated predominantly in SQLite development mode (`USE_SQLITE_DEV=True`). The PostgreSQL test environment was not validated against live Postgres, and `share_medical_notes` was added directly to SQLAlchemy without an Alembic migration script.
3. **Medical Privacy & Information Separation:** Medical notes need a strict boundary between private clinical notes (visible only to the authenticated owner) and emergency public notes (opt-in by owner, redacted of PII, and immediately revocable).
4. **Test Discovery Narrowing:** In `frontend/playwright.config.ts`, test discovery was restricted to `['audit.spec.ts']`, excluding `frontend/e2e/` suites.
5. **CORS & Validation Reflection Security:** Validation errors must sanitize input data to prevent reflection of sensitive credentials, and production CORS must fail closed if allowed origins are not explicitly defined.

Phase UX-05.2 systematically remediates each of these hard gates and provides an uncompromising, evidence-based assessment.

---

## 2. Absolute Repository Preservation Rules

- **Branch:** `frontend`
- **Committed HEAD:** `f51ee728377358dd9d4e6314770d03185bfb6a88`
- **Prohibited Operations:** `git reset`, `git clean`, `git restore`, `git checkout --`, `git stash`, `git rebase`, `git commit`, `git add`, `git push`, or any history modification.
- **Diff Invariant:** All intentional changes made during UX-05 and UX-05.1 are preserved. Every new modification is strictly minimal, documented, and tested.

---

## 3. Workstream Execution Matrix

### Workstream A: Real Biometric Engine & Production Fail-Closed Behavior
- **Objectives:**
  1. Eliminate silent fallback to synthetic bounding boxes or scaffold embeddings in production mode.
  2. Implement an explicit environment distinction:
     - `ENVIRONMENT == "production"` or `DEBUG == False`: Fail-closed. If PyTorch, Ultralytics, or model weights are missing or invalid, fail startup or return HTTP 503 on biometric endpoints with clear error code `BIOMETRIC_SUBSYSTEM_UNAVAILABLE`.
     - `ENVIRONMENT == "development"` or `SCAFFOLD_MODE == True`: Explicitly flagged demonstrator/scaffold mode with prominent warnings.
  3. Verify physical weight files:
     - `backend/model_weights/yolov8n.pt` (YOLOv8 nano dog detector)
     - `backend/model_weights/embedding_v1.pt` (MobileNetV2 feature extractor)
     - `backend/model_weights/checkpoint.json` (Model metadata)
     - `backend/faiss_index.bin` (FAISS vector database)
  4. Implement an internal readiness check `/api/v1/health/readiness` returning granular status for:
     - Database connectivity
     - Detector model status
     - Embedder model status
     - Vector store status
  5. Execute real inference smoke test against `backend/dummy.jpg`.
- **Files Modified / Added:**
  - `backend/app/api/dependencies.py`
  - `backend/app/api/v1/endpoints/health.py`
  - `backend/tests/ml/test_biometric_fail_closed.py`
  - `backend/tests/ml/test_real_inference_smoke.py`

### Workstream B: PostgreSQL, Database Migrations and Test Integrity
- **Objectives:**
  1. Create explicit Alembic migration `backend/alembic/versions/b2f1a8e9c0d3_add_share_medical_notes_to_pets.py` branching from head `ae440fbabbfa`.
  2. Enforce `server_default=sa.text('false')`, `nullable=False` to ensure existing and future rows default to private.
  3. Implement both safe `upgrade()` and `downgrade()`.
  4. Perform test suite integrity review: audit tests altered in UX-05.1 (`test_alert_lazy_load.py`, `test_pet_lazy_load.py`, `test_postgres_alert_resolve.py`, `test_postgres_identity.py`) to verify no assertions were weakened.
  5. Audit local PostgreSQL availability: if PostgreSQL is not active or accessible on this host, record the gap truthfully as `NOT VERIFIED (POSTGRESQL SERVICE NOT CONFIGURED)`.
- **Files Modified / Added:**
  - `backend/alembic/versions/b2f1a8e9c0d3_add_share_medical_notes_to_pets.py`
  - `backend/tests/db/test_migrations.py`

### Workstream C: Medical Privacy, Consent and Public QR-Tag Data
- **Objectives:**
  1. Enforce strict server-side serialization in `backend/app/api/v1/endpoints/pets.py`:
     - When `share_medical_notes == False`: `medical_notes` is strictly `None` in `/api/v1/pets/tag/{qr_tag_id}`.
     - When `share_medical_notes == True`: `medical_notes` is returned with regex PII scrubbing applied.
     - `microchip_id`, `owner_phone`, `owner_email`, `owner_name` are never exposed in public tag response.
  2. Owner-only endpoint `/api/v1/pets/{pet_id}` returns full unredacted medical notes to the authenticated owner.
  3. Non-owner cannot access `/api/v1/pets/{pet_id}` (403/404).
  4. Revocation invariant: When an owner updates `share_medical_notes` to `False`, public endpoints immediately redact the data.
  5. Verify frontend consent UI in `NewPet.tsx` and `PetDetail.tsx` with unambiguous advisory text.
  6. Implement comprehensive backend test suite `backend/tests/api/test_medical_privacy.py` covering all 12 mandatory scenarios.
- **Files Modified / Added:**
  - `backend/app/api/v1/endpoints/pets.py`
  - `backend/tests/api/test_medical_privacy.py`
  - `frontend/src/pages/pets/NewPet.tsx`
  - `frontend/src/pages/pets/PetDetail.tsx`

### Workstream D: Validation Error Security and Production CORS
- **Objectives:**
  1. Sanitize FastAPI `RequestValidationError` handler in `backend/app/main.py`:
     - Exclude raw `input`, `ctx`, and submitted values from 422 JSON response body.
     - Return only safe schema diagnostics (`loc`, `msg`, `type`).
  2. Harden CORS policy in `backend/app/main.py`:
     - Fail closed if `ALLOWED_ORIGINS` is missing or empty in production mode.
     - Disallow wildcard `*` when `allow_credentials=True`.
     - Restrict localhost defaults strictly to `DEBUG=True` / development mode.
  3. Add regression tests in `backend/tests/api/test_security_cors_validation.py`.
- **Files Modified / Added:**
  - `backend/app/main.py`
  - `backend/tests/api/test_security_cors_validation.py`

### Workstream E: Restore Complete Playwright Coverage & E2E Validation
- **Objectives:**
  1. Restore test discovery in `frontend/playwright.config.ts` to include `['audit.spec.ts', 'e2e/**/*.spec.ts']`.
  2. Configure failure artifact retention (`screenshot: 'only-on-failure'`, `trace: 'retain-on-failure'`).
  3. Run the full browser suite using Google Chrome (`/usr/bin/google-chrome-stable`).
  4. Verify critical user journeys: Anonymous Finder, Owner Onboarding, Pet Registration, Tag Verification, Alert Details, and Sighting Submission.
- **Files Modified / Added:**
  - `frontend/playwright.config.ts`

---

## 4. Verification & Quality Gates

| Gate ID | Target Component | Acceptance Criteria | Fallback / Rollback Contingency |
|---|---|---|---|
| **GATE-A** | Biometric Engine | Production fail-closed when weights or libs absent. Real inference succeeds on sample image. | If weights fail, mark Workstream A as BLOCKED; do not fabricate synthetic results. |
| **GATE-B** | DB Schema & Migrations | Alembic migration script exists from `ae440fbabbfa`, valid syntax, non-null default. | Test on SQLite dev DB; record PostgreSQL status honestly. |
| **GATE-C** | Medical Privacy | All 12 privacy tests pass. Tag view exposes zero private PII. | Revert to strict default `share_medical_notes=False`. |
| **GATE-D** | Validation & CORS | 422 errors do not reflect user credentials. Wildcard CORS rejected with credentials. | Strict allowlist on origins; safe dictionary projection on errors. |
| **GATE-E** | Playwright E2E | Discovery restored across audit + e2e specs. Artifacts captured on failure. | Fix broken selector references while preserving test invariants. |

---

## 5. Scoring & Release Decision Criteria

The eight-dimensional release scorecard retains the standard UX-05 weighting (100 points total).  
Any failure of a mandatory gate (such as unverified PostgreSQL or missing real biometrics) requires an uncompromising **`HOLD — PRODUCTION RELEASE NOT APPROVED`** verdict.
