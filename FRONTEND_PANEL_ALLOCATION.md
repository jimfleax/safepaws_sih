# SafePaws Frontend Panel Allocation

This document strictly defines the file ownership and activation boundaries for the frontend panels (P2-P6) ensuring no cross-contamination or git collisions.

## 1. Current Frontend State Audit
- **Routing:** Handled in `App.tsx` matching the final routes (`/`, `/setup-profile`, `/dashboard`, `/pets/new`, `/pets/:petId`, `/p/:tagId`, `/scan`, `/lost`, `/lost/new`, `/alerts/:alertId`, `/community`, `/sightings/new`, `*`).
- **Modals:** Legacy modals (`HowItWorksModal`, `InfoModal`, `QrTagModal`) still exist in the `components/modals` folder, but most structural modals have successfully been replaced by real routes.
- **Design Tokens:** `index.css` holds base tokens.
- **API Boundary:** `utils/apiClient.ts` handles the backend requests.

## 2. Dependencies & Activation Order
- **Phase A (Foundation):** P2 must be activated *first* and execute *alone*. It owns the structural shell (`App.tsx`, `index.css`, layout components). Other panels depend on P2 completing the shell.
- **Phase B (Feature Implementation):** P3, P4, P5, and P6 can be activated *concurrently* only after P2 completes, because they own strictly disjoint feature sets.

## 3. Shared Files & Single Ownership
- `frontend/src/App.tsx` (Owned exclusively by **P2**)
- `frontend/src/index.css` (Owned exclusively by **P2**)
- `frontend/src/components/DashboardNav.tsx` (Owned exclusively by **P2**)
- `frontend/src/utils/apiClient.ts` (Owned exclusively by **P1 Commander** - Panels must consume, not modify).

## 4. Exact Ownership Boundaries

### Panel 2: Design System + App Shell
**Scope:** Core routing layout, navigation primitives, and CSS variable system.
**Owned Files:**
- `frontend/src/App.tsx`
- `frontend/src/index.css`
- `frontend/src/components/DashboardNav.tsx`
- `frontend/src/components/Header.tsx`
- `frontend/src/components/Footer.tsx`
- `frontend/src/components/ui/*`

### Panel 3: Home / Landing
**Scope:** The unauthenticated premium storytelling flow. 
**Owned Files:**
- `frontend/src/pages/LandingPage.tsx`
- `frontend/src/components/Hero.tsx`
- `frontend/src/components/*Section.tsx` (e.g., `FeaturesSection.tsx`, `HowItWorksSection.tsx`, `TrustSection.tsx`, `CtaSection.tsx`, `CommunitySection.tsx`, `StepsDarkSection.tsx`)
- `frontend/src/components/EnterScreen.tsx`

### Panel 4: Pet + Identity
**Scope:** Pet registration, owner onboarding, and identity profiles (both owner view and public finder view).
**Owned Files:**
- `frontend/src/pages/SetupProfile.tsx`
- `frontend/src/pages/pets/NewPet.tsx`
- `frontend/src/pages/pets/PetDetail.tsx`
- `frontend/src/pages/PublicTagProfile.tsx`

### Panel 5: Recovery + Community
**Scope:** The authenticated dashboard, community feed, and crisis/lost pet alerts.
**Owned Files:**
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/pages/LostDogs.tsx`
- `frontend/src/pages/ReportLost.tsx`
- `frontend/src/pages/AlertDetail.tsx`
- `frontend/src/pages/Community.tsx`
- `frontend/src/pages/ReportSighting.tsx`
- `frontend/src/components/PetCard.tsx`

### Panel 6: Scan + Scan→Match
**Scope:** The biometric scanning pipeline (Capture, Match, Result).
**Owned Files:**
- `frontend/src/pages/Scan.tsx`
- `frontend/src/components/scan/*`

## 5. Strict Constraints for All Panels
- **DO NOT** edit files outside your assigned `Owned Files` list.
- **DO NOT** modify the `backend/` directory or ML configurations under any circumstances.
- **DO NOT** perform Git operations (commits, pushes, rebases).
