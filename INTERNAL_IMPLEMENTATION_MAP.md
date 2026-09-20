# SafePaws Frontend Implementation Map

## Phase 0: Repository Audit
- **Git State**: Clean working tree on branch `Integrated`. Previous panels have merged their work successfully.
- **Current Routes**: `/` (Landing), `/setup-profile`, `/dashboard`, `/pets/new`, `/pets/:petId`, `/public/pets/:petId`, `/scan`.
- **Frontend Architecture**: App shell splits marketing (`/`) from authenticated (`/dashboard`, etc.) and public finders (`/scan`, `/public`). State managed via `zustand` (`petStore`, `authStore`).
- **Current Scan**: Successfully isolated to `src/components/scan/` (`CameraView`, `ProcessingView`, `ResultView`) with no scroll/GSAP libraries.
- **Current Registration**: Implemented as a 3-step route in `NewPet.tsx`.
- **Current Profiles**: Implemented in `PetDetail.tsx` (Owner) and `PublicPetProfile.tsx` (Stranger/Finder).
- **Duplication/Dead Code**: `LandingPage.tsx` still imports legacy modals (`PetProfileModal`, `BiometricModal`, `IdentifyModal` - not imported anywhere) which duplicate the newly built routes.
- **Missing Flows**: Dedicated pages for Lost/Recovery, Community/Sightings, and a proper Not Found (404) page.

---

## Phase 1: Reconciliation (KEEP, ADAPT, REPLACE, REMOVE, MISSING)

### 1. Foundation & Layout
- **Design Tokens & Typography**: **KEEP/ADAPT**.
- **Navigation (`Header.tsx`, `DashboardNav.tsx`)**: **ADAPT**. Need to ensure mobile bottom-nav for authenticated shell as per spec.

### 2. Marketing / Home
- **Home (`LandingPage.tsx`, `Hero.tsx`)**: **ADAPT**. Layouts are correct, but we must **REMOVE** the old modal triggers (Identify, Join) and point them to the real routes (`/scan`, `/pets/new`).

### 3. Core App (Pets & Profiles)
- **Registration (`/pets/new`)**: **KEEP**. 3-stage flow correctly implemented.
- **Owner Profile (`/pets/:petId`)**: **KEEP**.
- **Public Profile (`/public/pets/:petId`)**: **KEEP**. Stranger-first UI with GPS/Call actions is present.
- **Dashboard (`/dashboard`)**: **KEEP**.

### 4. Scan & Identify
- **Scan Capture & Match (`/scan`)**: **KEEP/ADAPT**. Implementation is isolated. Needs verification that all 5 result states are implemented in `ResultView.tsx`.

### 5. Crisis & Community
- **Lost / Recovery**: **MISSING / REPLACE**. `LostAlertModal` exists but we need a dedicated flow: Alert List, Report Lost, Alert Detail, Sighting Submission, Resolve/Found state using "Alert-Clay" semantics.
- **Community / Sightings**: **MISSING / REPLACE**. Needs real photo/location/timestamp UI, minimal decoration.

### 6. Technical / Cleanup
- **Old Modals (`PetProfileModal`, `IdentifyModal`, `BiometricModal`, etc.)**: **REMOVE**. These duplicate the new route architecture and bloat the bundle.
- **Not Found (404)**: **MISSING**. Currently redirects to `/`, need a proper 404 screen.

---

## Phase 2: Next Steps (Architecture & Build Order)
1. **Clean up LandingPage**: Remove legacy modals, route buttons to actual pages (`/scan`, `/pets/new`). Delete dead modal files.
2. **Implement Missing Routes**: `/lost` or `/alerts`, `/community`, and a `NotFound` component.
3. **Verify Scan Result States**: Audit `ResultView.tsx` to ensure all 5 states are explicitly handled.
4. **Final Polish**: Responsive nav (bottom bar for mobile), accessibility passes.
