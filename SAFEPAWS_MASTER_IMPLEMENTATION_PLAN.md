# SafePaws Master Implementation Plan

This document serves as the authoritative implementation map and dependency graph for the SafePaws frontend reconstruction.

## Phase 0: Audit & Internal State Map

### Current Repository State (Audited)
The backend ML components (`NoseDetector`, `BiometricEmbeddingModel`) are mocked/scaffolded, but the FAISS integration and PostgreSQL relational structures are functional. The frontend has been partially decoupled from its legacy modal-heavy architecture, but it does not fully reflect the final design specification.

### State Map
*   **KEEP**: `zustand` state logic (`petStore`, `authStore`), isolated Scan components (`CameraView`, `ResultView`), existing backend API contracts (`apiClient.ts`), frontend build configuration.
*   **ADAPT**: `App.tsx` (must be updated to exact new route topology), `LandingPage.tsx` (update to use premium storytelling and core design tokens), `DashboardNav.tsx` (bottom bar for mobile), Typography and color tokens.
*   **REPLACE**: `Alerts.tsx` must be split/refactored into `/lost`, `/lost/new`, and `/alerts/:alertId`. `PublicPetProfile.tsx` must be mapped to `/p/:tagId`.
*   **REMOVE**: Dead components, unused imports, or leftover legacy modals (e.g. `HowItWorksModal`, `InfoModal`, `QrTagModal` if they duplicate route logic).
*   **MISSING**: `/lost/new`, `/alerts/:alertId`, `/sightings/new`, `/p/:tagId`.

---

## Phase 1: Lock the Architecture (Route Topology)

The `App.tsx` must be updated to strictly contain:
1.  `/` (Visitor Landing)
2.  `/setup-profile` (Owner onboarding)
3.  `/dashboard` (Authenticated home)
4.  `/pets/new` (Add pet)
5.  `/pets/:petId` (Pet detail)
6.  `/p/:tagId` (Public pet profile for finders)
7.  `/scan` (Scan capture + match flow)
8.  `/lost` (List of active lost pets/alerts)
9.  `/lost/new` (Report a lost pet)
10. `/alerts/:alertId` (Alert detail)
11. `/community` (Community feed)
12. `/sightings/new` (Report a sighting)
13. `*` (Not Found 404)

---

## Phase 2: Design Foundation

**Visual Language & Tokens:**
*   **INK**: Deep dark (#0A0A0A) - Primary text, dark backgrounds.
*   **BONE**: Warm off-white (#FAF6F0) - Primary app background.
*   **MARIGOLD**: Warm yellow (#F5A623) - Accents, secondary actions.
*   **TRAIL**: Soft earthy gray/brown (#8C857B) - Borders, secondary text.
*   **ALERT-CLAY**: Terracotta red (#B3452F) - Crisis states, lost alerts.

**Motion & UI Rules:**
*   Scan Capture: Light, functional, NO heavy motion.
*   Scan → Match: Dark, premium biometric material motion.
*   Nose-print: Used structurally (depth, material), NOT as a generic icon. Max one per screen.

---

## Phase 3: Product Completion (User Journeys)

1.  **Visitor**: `Landing` → `/scan` → `Result` → Contact Owner.
2.  **Owner**: `Setup` → `Register Pet` → `Dashboard` → `Pet Profile`.
3.  **Finder**: `Scan` → `Match` → `/p/:tagId`.
4.  **Lost Pet**: `/lost/new` → `/alerts/:alertId` → `/sightings/new`.
5.  **Community**: `/community` → View network.

---

## Phase 4: Parallelization & Subagent Scopes

As Commander, I am allocating the following subagent panels to execute the implementation safely and concurrently.

### Panel 2 (P2): Foundation + Shared UI
*   **Scope**: Configure Tailwind tokens (INK, BONE, MARIGOLD, TRAIL, ALERT-CLAY) in `index.css`. Build shared UI primitives (Buttons, Cards, standard Layout shells, Mobile Bottom Nav). Update `App.tsx` to mount the exact route topology (using placeholder components for missing routes).
*   **Files**: `frontend/src/index.css`, `frontend/src/App.tsx`, `frontend/src/components/ui/*`, `frontend/src/components/DashboardNav.tsx`.

### Panel 3 (P3): Home / Marketing
*   **Scope**: Implement `/` (Landing Page). Premium scroll storytelling, nose-print material integration, Hero section, and precise CTA routing to `/scan` and `/setup-profile`.
*   **Files**: `frontend/src/pages/LandingPage.tsx`, `frontend/src/components/Hero.tsx`, `frontend/src/components/*Section.tsx`.

### Panel 4 (P4): Registration & Profiles
*   **Scope**: Implement `/pets/new`, `/pets/:petId`, `/p/:tagId`, and `/setup-profile`. Ensure form logic bounds to the existing API contract (`apiClient.ts`). Clean up old `PublicPetProfile.tsx`.
*   **Files**: `frontend/src/pages/SetupProfile.tsx`, `frontend/src/pages/pets/*`.

### Panel 5 (P5): Dashboard, Lost, Alerts & Community
*   **Scope**: Implement `/dashboard`, `/lost`, `/lost/new`, `/alerts/:alertId`, `/community`, and `/sightings/new`. Must use `ALERT-CLAY` visual semantics for crisis states.
*   **Files**: `frontend/src/pages/Dashboard.tsx`, `frontend/src/pages/Alerts.tsx` (refactor to `/lost/*`), `frontend/src/pages/Community.tsx`, and new route files in `frontend/src/pages/`.

### Panel 6 (P6): Scan & Match Experience
*   **Scope**: Implement `/scan` flow. Camera (minimal/light), Scan → Match (dark/premium biometric motion), Result (calm). Ensure API connection to `ApiClient.identifyPet`.
*   **Files**: `frontend/src/pages/Scan.tsx`, `frontend/src/components/scan/*`.

**Rules for all Panels:**
*   NO backend modifications.
*   NO overwriting other panel's files.
*   NO git automation.
*   Must rely on existing API client logic.
