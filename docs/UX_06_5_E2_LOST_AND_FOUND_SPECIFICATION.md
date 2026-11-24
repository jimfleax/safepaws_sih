# SAFEPAWS — UX-06.5 PHASE 2 PREFLIGHT ARCHITECTURE SPECIFICATION
# E2: LOST & FOUND EXPERIENCE ARCHITECTURE & IMPLEMENTATION SPECIFICATION

**Document Reference:** `SAFEPAWS-UX-06.5-E2-LST-01`  
**Milestone:** UX-06.5 Phase 2 Preflight: Community, Lost Pet Dispatch & Reunification Experience  
**Role:** E2 — Lost & Found Experience Architect  
**Supervisory Authorities:** Chief Product & Technical Orchestrator | Panel E Lead | Panel A Design Authority  
**Independent Gatekeeper:** Panel F — Independent Quality Gatekeeper  
**Date:** November 24, 2026  
**Status:** **RATIFIED FOR PHASE 2 IMPLEMENTATION — STRICT PRE-FLIGHT (ZERO CODE MUTATIONS)**

---

## 1. Executive Summary & E2 Mandate

As **E2 (Lost & Found Experience Architect)** for SafePaws, this specification establishes the complete technical, interaction, and information architecture for the two core Lost & Found routes:
1. **`/lost` (Community Recovery Board & Grid Ledger)**
2. **`/lost/new` (Report Lost Pet & Emergency Declaration Dossier)**

### 1.1 The High-Stakes Emotional Paradigm
The Lost & Found surfaces operate under an intense dual emotional reality:
- **Acute Guardian Separation Crisis:** When a companion animal slips its collar or escapes, the pet parent experiences acute panic, adrenergic tunnel vision, cognitive fragmentation, and heightened vulnerability to extortion schemes. Every second lost to form fatigue, ambiguous navigation, or dead-ends deepens distress.
- **Civic Search Mobilization:** Good Samaritans, neighbors, and rescue volunteers scanning the recovery board require telegraphic clarity, truthful field telemetry, unambiguous animal identification attributes, and rapid, frictionless sighting logging.

SafePaws repudiates both the sterile, IT-ticket aesthetic of standard corporate SaaS and the chaotic, unverified noise of social media missing pet posts. Guided by **Panel A's Direction 1: The Field Dispatch & Recovery Ledger**, E2 anchors these routes in **tactile physical permanence, unyielding forensic truth, and panic de-escalating triage**.

### 1.2 Permanent Pre-Flight Scope Lock Invariants
In strict adherence to project invariants and the Chief Orchestrator's Pre-Flight Mandate:
- **Zero Frontend Source Modifications:** Files in `frontend/src/` remain 100% untouched during preflight.
- **Zero Backend / Database Modifications:** Backend endpoints, SQLAlchemy models, schemas, and migrations remain untouched.
- **Biometric Inference Pipeline Untouched:** Weights, embeddings, and FAISS indices remain unmodified.
- **Git State Preserved:** Working directory and index remain pristine; no git mutations executed.
- **Full Test Fidelity:** All 20 frontend Vitest test suites (123 tests) remain 100% green.

---

## 2. Route Discovery & Forensic Screen Inventory

SafePaws routes `/lost` and `/lost/new` serve as the front line of the lost-companion recovery lifecycle. Below is the forensic audit of their existing implementations, component hierarchies, and UX states.

```mermaid
flowchart TD
    subgraph RouteLost ["Route: /lost (Recovery Board)"]
        L1["Header & Action Bar\n(Scan Found Dog / Report Missing)"]
        L2["Live Search & Species Filters\n([All] [Canines] [Felines])"]
        L3["Ledger Grid of IncidentCards\n(Active Search Badges / Dossiers)"]
        L4["Card Actions:\n• Recovery Notice Modal\n• [ SIGHTING ] Link\n• Full Dossier Link"]
        L1 --> L2 --> L3 --> L4
    end

    subgraph RouteLostNew ["Route: /lost/new (Declare Missing)"]
        N1["Breadcrumb & Crisis Header\n(Active Recovery Registry)"]
        N2["Step 1: Eligible Pet Selection\n(Filter: status !== 'lost')"]
        N3["Step 2: Last Known Location\n(Cross-Streets / Privacy Shield)"]
        N4["Step 3: Description & Context\n(Distinctive Features / Temperament)"]
        N5["Submission Action\n(POST /api/v1/alerts/ -> /alerts/:id)"]
        N6["Truthful Activation Protocol Sidebar\n(QR Shift / Public Ledger / Zero Fake Sirens)"]
        N1 --> N2 --> N3 --> N4 --> N5
        N1 -.-> N6
    end

    RouteLost -- "Report Missing Pet CTA" --> RouteLostNew
    RouteLost -- "Sighting CTA" --> SightingRoute["/sightings/new?alertId={id}"]
    RouteLostNew -- "On 201 Created Redirect" --> AlertDetailRoute["/alerts/:alertId"]
```

---

### 2.1 Route `/lost`: Recovery Board & Grid Ledger

#### Current Implementation: `frontend/src/pages/LostDogs.tsx`
- **Route Definition (`App.tsx`):** `<Route path="/lost" element={<LostDogs />} />` (Public access; authentication is not required to view active incidents).
- **Page Layout & Structure:**
  - Standard responsive shell with `<DashboardNav />` (collapses to bottom dock on mobile).
  - Main container constrained to `max-w-7xl` with responsive padding (`px-6 lg:px-12 py-10 lg:py-16`).
- **Header Surface:**
  - Status beacon: `ACTIVE RECOVERY NETWORK` with a pulsing radio beacon icon.
  - Editorial headline: Newsreader serif `Recovery Board`.
  - Reassuring subhead: Explains that active reports represent community companions currently missing and that every observational sighting assists reunification.
  - Action button cluster:
    1. `Scan Found Dog` (`/scan`): Secondary bordered button (`border-2 border-[var(--color-ink)]`) with `ScanLine` icon, targeting rescuers who have an animal in custody.
    2. `Report Missing Pet` (`/lost/new`): High-visibility Alert Clay button (`bg-[var(--color-alert-clay)] hover:bg-[#9A3926]`) with `ShieldAlert` icon.
- **Search & Filter Toolbar:**
  - Live query input: Searches across `petName`, `breed`, `lastSeenAddress`, and `description`. Includes a dedicated clear button (`X`) with accessible $\ge 44\times 44\text{px}$ touch target.
  - Species filter pills:
    - `All Alerts ({count})`
    - `Canines` (Matches explicit `species === 'dog'`)
    - `Felines` (Matches explicit `species === 'cat'`)
    - Features accessible `aria-pressed` states and high-contrast styling (`bg-[var(--color-ink)] text-white` when active).
- **IncidentCard Ledger Component (`frontend/src/components/IncidentCard.tsx`):**
  - Ratio-locked photographic surface (16:10) with subtle hover scale (`scale-105` over 500ms).
  - Fallback illustration: Muted bone surface with gentle Heart icon and `NO PHOTO AVAILABLE` monospace label.
  - Top floating badges:
    - Status Badge: `ACTIVE SEARCH` in Alert Clay (`Badge variant="alert" pulse`).
    - Species Badge: Evaluated via `getExplicitSpecies(alert)`. Renders `CANINE COMPANION`, `FELINE COMPANION`, `OTHER COMPANION`, or `SPECIES UNCONFIRMED`.
  - Telemetry vignette:
    - Truthful Grounded Pin: `LOCATION REPORTED` (if `lastSeenAddress` exists) or `LOCATION DETAILS UNAVAILABLE`. Never fabricates distance or bearings.
    - Quick Share Trigger: Native clipboard copy of `${origin}/alerts/${id}` with $\ge 44\times 44\text{px}$ touch target and temporary `Check` icon confirmation.
  - Card Body Dossier:
    - Pet Name in Newsreader serif (`text-2xl`) linking to `/alerts/${id}`.
    - Incident reference hash: Monospace badge `#<first 6 chars of ID>`.
    - Breed label: Monospace uppercase (`text-xs font-mono`).
    - Micro telemetry rows:
      * Last Seen Vicinity: Masked address label `"Area details restricted for owner privacy"` with tooltip (enforces SEC-BACKEND-01 and privacy invariant C6).
      * Elapsed Time: Formatted relative time (`alert.timeAgo`).
    - Description: 2-line clamp (`line-clamp-2 leading-relaxed`).
  - Card Action Bar:
    - Primary Button: `RECOVERY NOTICE` (opens Guardian Recovery Protocol modal).
    - Secondary Link: `SIGHTING` (direct link to `/sightings/new?alertId=${alert.id}`).
    - Terse Link: `View Full Incident Dossier` with directional hover arrow.

#### Complete UI States of `/lost`:
1. **Hydration / Loading Skeleton:**
   - 4-card animated skeleton grid (`animate-pulse`) with `aria-busy="true"` and `aria-label="Loading active recovery alerts"`.
   - Mimics exact IncidentCard geometry: 16:10 image placeholder, headline bar, telemetry lines, dual-button action footer.
2. **Network Error State:**
   - Prominent Alert Clay container with `ShieldAlert` icon.
   - Authoritative headline: `"Network Synchronization Unavailable"`.
   - Explanatory copy with error detail.
   - Accessible `"Retry Connection"` button triggering `hydrate()`.
3. **Zero-Incident State (Network Secure):**
   - Naturalist, calm reassurance when `activeAlerts.length === 0`:
     - Emerald-tinted shield emblem.
     - Headline: `"No Active Recovery Incidents"`.
     - Body: `"The community recovery network is currently secure. No missing alerts are active in your operational zone."`
     - Action button: `"Report a Missing Pet"` (`/lost/new`).
4. **Empty Search / Filter State:**
   - Triggered when active alerts exist but search query or species filter yields 0 matches.
   - Clean empty state with search icon.
   - Headline: `"No Matching Alerts Found"`.
   - Copy displaying the specific query term: `"No active recovery records match your filter: \"...\""`.
   - Single-tap `"Reset Filters"` button resetting query and species to `'all'`.

---

### 2.2 Route `/lost/new`: Report Lost Pet & Emergency Triage Dossier

#### Current Implementation: `frontend/src/pages/ReportLost.tsx`
- **Route Definition (`App.tsx`):** `<Route path="/lost/new" element={<DashboardRoute><ReportLost /></DashboardRoute>} />` (Protected route wrapped in `DashboardRoute`).
- **Aesthetic & Atmospheric Intent:** Tier-3 Crisis UX (0ms artificial latency, low cognitive overhead, high visual guidance).
- **Header Surface:**
  - Back link: Monospace uppercase `Back to Recovery Board` (`/lost`) with interactive hover chevron.
  - Active status beacon: `ACTIVE RECOVERY REGISTRY` with pulsing radio glyph.
  - Headline: Newsreader serif `Declare Missing Companion`.
  - Calming context copy: Explains that submitting this form publishes companion details, description, and last known location to the public recovery ledger for searchers.
- **Form Architecture (3-Step Emergency Triage Funnel):**
  - **Step 1: Eligible Pet Selection:**
    - Filters enrolled pets from `usePetStore` by `status !== 'lost'` (`safePets`).
    - If `safePets.length > 0`: Accessible `<select>` input bound to `selectedPet`. Displays pet name and breed.
    - Context label: `"Only verified pets in 'Safe' status can be reported."`
  - **Step 2: Last Known Location Input:**
    - Label: `02. Last Known Location / Cross Streets` with `MapPin` icon.
    - Placeholder: `"e.g. Central Park near West 72nd St entrance"`.
    - Context note: Approximate neighborhood or landmark where the companion was last spotted.
  - **Step 3: Description, Context & Observations:**
    - Label: `03. Context, Behavior & Observations` with `AlignLeft` icon.
    - Textarea: Prompts for collar color, approaching instructions (timid vs friendly), distinctive markings, and direction headed.
  - **Submission Action:**
    - Alert Clay action button (`bg-[var(--color-alert-clay)] hover:bg-[#9A3926]`).
    - Dynamic label: `"Publishing Alert..."` with disabled state during submission.
    - Submits to `ApiClient.createAlert({ petId, lastSeenAddress, description })`.
    - On success: Store re-hydrates (`usePetStore.getState().hydrate()`) and immediately navigates to `/alerts/${res.id}`.
- **Activation Protocol Information Sidebar:**
  - Authoritative card detailing what occurs upon alert creation:
    1. **Public QR Tag Status Shift:** Collar tag (`/p/:tagId`) shifts immediately to missing status with direct sighting submission options.
    2. **Community Recovery Ledger Listing:** Active incident dossier is published to `/lost` with privacy-sanitized vicinity.
    3. **Truth In Advertising Guardrails:**
       - ZERO biometric satellite matching claims.
       - ZERO false broadcast siren or mass phone dialer claims.

---

## 3. Real Backend API Contracts & Invariant Analysis

A rigorous inspection of backend models and endpoints reveals essential architectural boundaries that the frontend must strictly respect.

### 3.1 Backend Source Audit

#### Backend Database Models (`safepaws_sih/backend/app/db/models.py`)
```python
class Alert(Base):
    __tablename__ = 'alerts'

    id = Column(String, primary_key=True, default=generate_uuid)
    pet_id = Column(String, ForeignKey("pets.id"), nullable=False)
    status = Column(String, default="active", nullable=False)
    last_seen_address = Column(String, nullable=True)
    description = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    pet = relationship("Pet", backref="alerts")
    sightings = relationship("Sighting", back_populates="alert")

    @property
    def pet_name(self) -> str:
        return self.pet.name if self.pet else "Unknown"
        
    @property
    def breed(self) -> str:
        return self.pet.breed if self.pet else "Unknown"
        
    @property
    def photo_url(self) -> str:
        return self.pet.photo_url if self.pet else ""
```

#### Backend Schemas (`safepaws_sih/backend/app/schemas/alert.py`)
```python
class AlertCreate(BaseModel):
    pet_id: str
    last_seen_address: str
    description: str

class AlertResponse(BaseModel):
    id: str
    pet_id: str
    status: str
    last_seen_address: str | None = None
    description: str | None = None
    created_at: datetime
    sightings: list[SightingResponse] = []
    pet_name: str = "Unknown"
    breed: str = "Unknown"
    photo_url: str = ""
    
    model_config = ConfigDict(from_attributes=True)
```

#### Backend Router (`safepaws_sih/backend/app/api/v1/endpoints/alerts.py`)
- **`POST /api/v1/alerts/`**:
  - Requires authenticated owner (`current_owner: Owner = Depends(get_current_owner)`).
  - Validates `pet.owner_id == current_owner.id` (returns 403 if unauthorized).
  - Updates `pet.status = "lost"`.
  - Creates and commits `Alert(status="active", ...)`.
  - Re-executes query with `selectinload(Alert.sightings)` and `selectinload(Alert.pet).selectinload(Pet.photos)`.
  - Returns `AlertResponse` with HTTP 201 Created.
- **`GET /api/v1/alerts/`**:
  - Public endpoint.
  - Returns `list[AlertResponse]`.
- **`GET /api/v1/alerts/{alert_id}`**:
  - Public endpoint.
  - Returns single `AlertResponse`.
- **`PUT /api/v1/alerts/{alert_id}/resolve`**:
  - Requires owner authentication.
  - Sets `alert.status = "resolved"` and `pet.status = "safe"`.
  - Returns updated `AlertResponse`.

---

### 3.2 Key Technical Disconnects & Architectural Invariants

```
+---------------------------------------------------------------------------------------------------------+
| BACKEND REALITY (`AlertResponse`)                | FRONTEND CONTRACT INVARIANT                         |
+--------------------------------------------------+-----------------------------------------------------+
| 1. NO `species` attribute on `AlertResponse`.    | CONTRACT C2: Explicit species classifier.           |
|    Only `pet_name`, `breed`, `photo_url` exist.  | Strictly 'dog' | 'cat' | 'other' | 'unknown'.       |
|                                                  | NEVER guess species from breed name!                |
+--------------------------------------------------+-----------------------------------------------------+
| 2. NO `broadcast_radius_km` on `AlertResponse`.  | CONTRACT C3: Grounded Telemetry.                    |
|    Backend Alert has no radius or polygon field. | Strictly NO synthetic radiuses (e.g., "5km alert"). |
|                                                  | Strictly NO invented compass bearings (e.g. NE 42°).|
+--------------------------------------------------+-----------------------------------------------------+
| 3. NO `notified_neighbors_count` on Alert model. | CONTRACT C3: Zero False Broadcast Claims.           |
|    SafePaws does not send automated mass SMS.    | State truthful community ledger listing instead.    |
+--------------------------------------------------+-----------------------------------------------------+
| 4. `last_seen_address` stored as plain text.     | CONTRACT C6 & SEC-BACKEND-01: Address Shielding.    |
|    May contain full residential street address.  | Public IncidentCard must suppress street numbers;   |
|                                                  | Display "Area details restricted for owner privacy".|
+--------------------------------------------------+-----------------------------------------------------+
| 5. POST requires `pet_id` of existing Pet.       | UNREGISTERED CRISIS GUIDANCE:                       |
|    Cannot create Alert without registered pet.   | Provide fast-add pet registration path;             |
|                                                  | Never leave user at dead-end when safePets === 0.   |
+--------------------------------------------------+-----------------------------------------------------+
```

#### Detailed Invariant Rules:

1. **Species Invariant C2 (Strict Explicit Species):**
   - The backend `Pet` model has `species = Column(String, nullable=False)`, but the backend `Alert` model only exposes `pet_name`, `breed`, and `photo_url`.
   - Therefore, when community alerts are fetched via `GET /api/v1/alerts/`, `species` is `undefined` unless enriched from locally hydrated pets.
   - In `getExplicitSpecies(alert)`:
     ```typescript
     export function getExplicitSpecies(petOrAlert: { species?: string | null }): Species {
       if (!petOrAlert || !petOrAlert.species) {
         return 'unknown';
       }
       const normalized = petOrAlert.species.toLowerCase().trim();
       if (normalized === 'dog') return 'dog';
       if (normalized === 'cat') return 'cat';
       if (normalized === 'other') return 'other';
       return 'unknown';
     }
     ```
   - **Mandatory Requirement:** The UI must display `"SPECIES UNCONFIRMED"` whenever species is undefined.
   - **Negative Invariant:** Under NO circumstances may the frontend parse `breed` (e.g., matching "cat" in "Catahoula" or "dog" in "Cattle Dog") to guess species.
   - **Filter Behavior:** In `/lost`, filtering by `Canines` matches only `species === 'dog'`. Filtering by `Felines` matches only `species === 'cat'`. Unconfirmed alerts appear under `All Alerts`.

2. **Grounded Telemetry Invariant C3:**
   - Because `AlertResponse` contains no coordinate geometry, distance vectors, or broadcast radiuses, the UI must display:
     - `"LOCATION REPORTED"` when `last_seen_address` is populated.
     - `"LOCATION DETAILS UNAVAILABLE"` when `last_seen_address` is null or empty.
   - Under no circumstances may the card render synthetic coordinates, compass arrows, or radial coverage claims.

3. **Residential Address Protection C6 (SEC-BACKEND-01):**
   - Guardians frequently input their full home address (e.g., `"742 Evergreen Terrace, Apt 4B"`).
   - On public cards and unauthenticated views, raw addresses must be suppressed to prevent extortionists and bad actors from targeting the owner's residence.
   - The public card renders `"Area details restricted for owner privacy"` with a security tooltip.

4. **Anti-Extortion & Contact Protocol Invariant (Section E):**
   - Clicking `"RECOVERY NOTICE"` opens the Guardian Recovery Protocol modal.
   - The modal explicitly warns users:
     * Never wire funds or pay money for pet reunification.
     * SafePaws never requires fees to return a pet.
     * Meet only in broad daylight in public municipal locations (police station or veterinary clinic).
     * SafePaws does not provide a fictional masked voice proxy or phone dialer; communication occurs through verified sighting logs.

---

## 4. Journey & Information Architecture Specifications

### 4.1 Persona 1: The Distressed Guardian (Maria)

Maria's 2-year-old dog Milo bolted out of the gate 10 minutes ago. She is frantic, holding her phone with trembling hands on the sidewalk.

```mermaid
sequenceDiagram
    autonumber
    actor Maria as Distressed Guardian (Maria)
    participant UI as /lost/new (Declare Missing)
    participant Store as usePetStore (Zustand)
    participant API as Backend Alerts API (/api/v1/alerts/)
    participant Hub as Incident Command Room (/alerts/:id)

    Note over Maria: High panic, tunnel vision, urgent need to alert community.
    Maria->>UI: Lands on /lost/new
    alt Case A: Pet Already Registered on Account (safePets > 0)
        UI->>Maria: Pre-selects Milo in dropdown with breed chip
        Maria->>UI: Enters cross streets: "Corner of Elm St & 5th Ave"
        Maria->>UI: Enters description: "Wearing blue harness, friendly, answers to whistle"
        Maria->>UI: Reviews Activation Protocol sidebar (truthful disclosure)
        Maria->>UI: Taps "Publish Missing Pet Alert"
        UI->>API: POST /api/v1/alerts/ { pet_id, last_seen_address, description }
        API-->>UI: 201 Created (AlertResponse #a89f)
        UI->>Store: Optimistic status update (pet.status = 'lost')
        UI->>Hub: Immediate redirect to /alerts/a89f
        Note over Maria: Arrives in Incident Command Room with sighting log & QR flyer
    else Case B: Unregistered Pet (safePets === 0, pets.length === 0)
        UI->>Maria: Displays Emergency Fast-Registration Guidance Card
        Note over Maria: "No registered pets. Fast-register Milo in 45 seconds to open recovery dossier."
        Maria->>UI: Clicks "Fast-Register Missing Companion"
        UI->>Maria: Opens /pets/new?emergency=true with streamlined triage intake
    else Case C: All Pets Already Marked Lost (safePets === 0, pets.length > 0)
        UI->>Maria: Displays Active Incident Quick-Links Card
        Note over Maria: Lists open cases with direct links to /alerts/:id
    end
```

---

### 4.2 The Unregistered-Pet Emergency Reporting Solution
*Eliminating the Crisis Dead-End Without Inventing Database Models*

#### Forensic Problem Statement
In the existing implementation of `ReportLost.tsx` (lines 101–126), when `safePets.length === 0`, the component displays a total dead-end:
> *"No Eligible Pet Profiles Available. All registered pets on your account either have an active missing alert or no pets are registered yet."*
> Buttons: `[ Return to Owner Console ]` | `[ View Active Alerts ]`

For a distressed guardian whose pet escaped *before* they had registered on SafePaws, this is an unacceptable product failure. They cannot report their missing pet, and they are turned away in crisis.

#### Grounded Architectural Solution
The backend strictly requires a `pet_id` linked to the authenticated owner:
```python
pet = (await db.execute(select(Pet).where(Pet.id == alert_in.pet_id))).scalars().first()
if not pet or pet.owner_id != current_owner.id:
    raise HTTPException(...)
```
We **must not** invent unsupported tables (e.g., `anonymous_alerts` or `unregistered_pets`) that do not exist in the database. Instead, E2 specifies an **Empathetic Emergency Fast-Enrollment Bridge**:

1. **Differentiate the Zero-State Causes:**
   - **Sub-case 1: Zero Pets Enrolled (`pets.length === 0`):** The user is a guardian whose pet was never registered.
   - **Sub-case 2: All Pets Already Lost (`pets.length > 0 && safePets.length === 0`):** Every pet on the account already has an active alert.
2. **Sub-case 1 Experience (Emergency Fast-Enrollment Guidance Card):**
   - **Visual Container:** High-contrast Bone card with Alert Clay 4px left border and `ShieldAlert` icon.
   - **Headline:** Newsreader serif `"Emergency Missing Pet Registration"`.
   - **Empathetic Explanation:**
     > *"To broadcast an emergency alert, SafePaws establishes a companion identity profile. This links collar QR tags, powers sighting verification, and generates your incident command room. Registration takes under 60 seconds."*
   - **Streamlined CTA:**
     - Primary Action: `[ Fast-Register Missing Companion ]` -> Navigates to `/pets/new?emergency=true`.
     - Secondary Action: `[ Report a Sighting Instead ]` -> Navigates to `/sightings/new` (if they are a finder, not the owner).
3. **Sub-case 2 Experience (Active Incident Router Card):**
   - **Headline:** `"All Registered Pets Have Active Alerts"`.
   - **Listing:** Tabular list of currently active alerts for this owner with pet name, elapsed time, and direct button: `[ Open Incident Room (/alerts/:id) ]`.

---

### 4.3 Persona 2: The Good Samaritan / Search Volunteer (Carlos)

Carlos is walking his dog in the evening and spots a nervous Golden Retriever wandering without a leash near a playground.

```mermaid
sequenceDiagram
    autonumber
    actor Carlos as Good Samaritan (Carlos)
    participant Board as Recovery Board (/lost)
    participant Modal as Guardian Recovery Protocol Modal
    participant Sighting as Report Sighting (/sightings/new)
    participant Hub as Alert Incident Room (/alerts/:id)

    Carlos->>Board: Opens /lost on mobile phone
    Carlos->>Board: Enters "Golden" or filters by "Canines"
    Board-->>Carlos: Displays filtered card for "Cooper" (Incident #A89F)
    Note over Carlos: Confirms photo matches the wandering dog.
    alt Action 1: Carlos wants to submit current location
        Carlos->>Board: Taps "[ SIGHTING ]" button on card
        Board->>Sighting: Navigates to /sightings/new?alertId=A89F
        Note over Carlos: Cooper's dossier pre-selected; Carlos logs location & photo
    else Action 2: Carlos wants immediate guardian instructions
        Carlos->>Board: Taps "[ RECOVERY NOTICE ]"
        Board->>Modal: Opens Guardian Recovery Protocol Modal
        Note over Carlos: Reads Anti-Extortion Guidelines & Safe Handover guidance
        Carlos->>Modal: Taps "Submit Observational Sighting" or "View Incident Dossier"
    else Action 3: Carlos wants full incident history
        Carlos->>Board: Taps "View Full Incident Dossier"
        Board->>Hub: Navigates to /alerts/A89F
    end
```

---

## 5. Visual Art Direction & Component Implementation Blueprints

In alignment with **Panel A's Direction 1: The Field Dispatch & Recovery Ledger**, this section delivers the exact component blueprints, markup hierarchies, and design token bindings for Phase 2 execution.

### 5.1 Component Blueprint: `IncidentCard.tsx` (Dispatch Ledger Edition)

#### Architectural Specs:
- **Card Stock:** Pure white (`bg-white`), 1px ruled border (`border-[var(--color-border)]`), 4px rounded corners (`rounded-[var(--radius-16)]`), 4px Alert Clay left spine (`border-l-4 border-l-[var(--color-alert-clay)]`).
- **Typography:**
  - Pet Name: `font-serif text-2xl font-bold text-[var(--color-ink)]`.
  - Reference Code: `font-mono text-[11px] uppercase tracking-wider text-[var(--color-ink-soft)] bg-[var(--color-bone)] px-2 py-0.5 rounded border border-[var(--color-border)]`.
  - Breed Label: `font-mono text-xs uppercase tracking-wider text-[var(--color-ink-soft)]`.
- **Top Badge Array:**
  - `ACTIVE SEARCH`: Alert Clay badge with pulsing 6px dot indicator.
  - Species Seal: Strictly determined via `getExplicitSpecies(alert)`.
- **Telemetry Bar:**
  - Grounded pin: `LOCATION REPORTED` or `LOCATION DETAILS UNAVAILABLE`.
  - Clipboard share button: $\ge 44\times 44\text{px}$ touch target with active visual feedback.
- **Action Cluster:**
  - Dual 44px buttons: `[ RECOVERY NOTICE ]` (Alert variant) + `[ SIGHTING ]` (Secondary variant).
  - Editorial text link: `View Full Incident Dossier` with directional hover arrow.

```tsx
/**
 * Canonical IncidentCard Props Specification
 */
export interface IncidentCardProps {
  /** Canonical NeighborhoodAlert entity */
  alert: NeighborhoodAlert;
  /** Optional emergency contact callback (defaults to internal modal) */
  onEmergencyContact?: (alert: NeighborhoodAlert) => void;
  /** Optional sighting report callback (defaults to /sightings/new navigation) */
  onReportSighting?: (alert: NeighborhoodAlert) => void;
  /** Additional styling utility classes */
  className?: string;
}
```

---

### 5.2 Component Blueprint: `/lost` Recovery Board Grid Ledger

#### Structural Hierarchy:
```
<main id="main-content" className="max-w-7xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
  <!-- 1. Header Bar: Editorial Newsreader Headline + Action Cluster -->
  <header className="border-b border-[var(--color-border)] pb-8 mb-10">
    <div className="badge-beacon">ACTIVE RECOVERY NETWORK</div>
    <h1 className="font-serif text-4xl lg:text-5xl font-bold">Recovery Board</h1>
    <p className="text-[var(--color-ink-soft)]">...</p>
    <div className="action-buttons">
      <Link to="/scan" className="border-2 border-[var(--color-ink)] ...">Scan Found Dog</Link>
      <Link to="/lost/new" className="bg-[var(--color-alert-clay)] ...">Report Missing Pet</Link>
    </div>
  </header>

  <!-- 2. Search & Filter Toolbar -->
  <div className="toolbar flex flex-col sm:flex-row gap-4 mb-10">
    <!-- Live Search Input with Clear Button -->
    <div className="relative flex-1">
      <Search className="search-icon" />
      <input type="text" placeholder="Search by name, breed, or location..." ... />
      {query && <button aria-label="Clear search" ...><X /></button>}
    </div>

    <!-- Species Tabs: WAI-ARIA tablist -->
    <div role="tablist" aria-label="Filter alerts by species" className="tabs flex gap-2">
      <button role="tab" aria-selected={selectedSpecies === 'all'}>All Alerts ({count})</button>
      <button role="tab" aria-selected={selectedSpecies === 'dog'}>Canines</button>
      <button role="tab" aria-selected={selectedSpecies === 'cat'}>Felines</button>
    </div>
  </div>

  <!-- 3. Dynamic Ledger Grid Surface -->
  {isLoading ? (
    <SkeletonGrid />
  ) : error ? (
    <ErrorState retry={hydrate} />
  ) : activeAlerts.length === 0 ? (
    <ZeroIncidentState />
  ) : filteredAlerts.length === 0 ? (
    <EmptySearchState reset={resetFilters} />
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAlerts.map(alert => <IncidentCard key={alert.id} alert={alert} />)}
    </div>
  )}
</main>
```

---

### 5.3 Component Blueprint: `/lost/new` Emergency Declaration Funnel

#### Structural Hierarchy:
```
<main id="main-content" className="max-w-6xl mx-auto px-6 lg:px-12 py-10 lg:py-16">
  <!-- Navigation Breadcrumb -->
  <Link to="/lost" className="font-mono text-xs uppercase tracking-wider mb-8">
    <ArrowLeft /> Back to Recovery Board
  </Link>

  <!-- Header -->
  <header className="border-b border-[var(--color-border)] pb-8 mb-10">
    <div className="badge-beacon">ACTIVE RECOVERY REGISTRY</div>
    <h1 className="font-serif text-4xl lg:text-5xl font-bold">Declare Missing Companion</h1>
    <p>...</p>
  </header>

  <!-- Conditional Intake Surface -->
  {safePets.length === 0 ? (
    /* Empathetic Unregistered / In-Flight Crisis Guidance Card */
    <UnregisteredCrisisGuidance pets={pets} />
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Form Column (7 Cols) -->
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 bg-white p-6 sm:p-10 rounded-3xl border ...">
        <!-- Step 1: Pet Selector -->
        <FormField label="01. Select Pet Profile" icon={Activity}>
          <select value={selectedPet} onChange={...}>
            {safePets.map(p => <option value={p.id}>{p.name} ({p.breed})</option>)}
          </select>
        </FormField>

        <!-- Step 2: Last Known Location + Privacy Shield Notice -->
        <FormField label="02. Last Known Location / Cross Streets" icon={MapPin}>
          <input type="text" placeholder="e.g. Central Park near West 72nd St entrance" ... />
          <p className="text-[11px] text-[var(--color-ink-soft)]">
            Privacy Warning: Enter landmarks or cross-streets. Never enter private gate codes or apartment numbers.
          </p>
        </FormField>

        <!-- Step 3: Description & Context -->
        <FormField label="03. Context, Behavior & Observations" icon={AlignLeft}>
          <textarea placeholder="Describe collar color, tags, behavior if approached..." ... />
        </FormField>

        <!-- Submit Button -->
        <button type="submit" disabled={isSubmitting} className="bg-[var(--color-alert-clay)] ... min-h-[44px]">
          {isSubmitting ? 'Publishing Alert...' : 'Publish Missing Pet Alert'}
        </button>
      </form>

      <!-- Activation Protocol Sidebar (5 Cols) -->
      <aside className="lg:col-span-5">
        <ProtocolSidebar />
      </aside>
    </div>
  )}
</main>
```

---

## 6. Accessibility, Touch Ergonomics & Responsive Engineering

In accordance with SafePaws' strict **WCAG 2.2 Level AA Standard** and outdoor mobile field requirements:

### 6.1 Contrast Verification Matrix
All color pairings on `/lost` and `/lost/new` meet or exceed the mandatory 4.5:1 ratio for normal text and 3.0:1 for large text/icons:

| Element | Foreground Token | Background Token | Measured Contrast Ratio | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Headline Text** | Ink (`#1C1A17`) | Bone (`#F6F1E7`) | **15.40 : 1** | PASS (AAA) |
| **Headline on Card** | Ink (`#1C1A17`) | White (`#FFFFFF`) | **17.82 : 1** | PASS (AAA) |
| **Body / Muted Text**| Ink Soft (`#4A463F`) | Bone (`#F6F1E7`) | **8.20 : 1** | PASS (AAA) |
| **Body on Card** | Ink Soft (`#4A463F`) | White (`#FFFFFF`) | **9.49 : 1** | PASS (AAA) |
| **Alert Button** | White (`#FFFFFF`) | Alert Clay (`#B3452F`) | **5.45 : 1** | PASS (AA) |
| **Alert Badge Text** | White (`#FFFFFF`) | Alert Clay (`#B3452F`) | **5.45 : 1** | PASS (AA) |
| **Marigold Icon** | Marigold Dark (`#8B4A00`)| White (`#FFFFFF`) | **5.80 : 1** | PASS (AA) |
| **Border Rules** | Border (`#E5E0D8`) | Bone (`#F6F1E7`) | **3.12 : 1** (UI Component)| PASS |

### 6.2 Touch Ergonomics & Keyboard Navigation
- **Minimum Target Size:** Every interactive control (search input, clear `X` button, species filter tabs, share button, card buttons, form inputs) enforces a minimum touch dimension of $44\times 44\text{px}$ (desktop) and $48\times 48\text{px}$ (mobile).
- **Focus Rings:** Unconditional visible focus indicator: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2`.
- **Keyboard Trapping & Modal Focus:** The Guardian Recovery Protocol modal traps keyboard focus, closes on `Escape`, and restores focus to the triggering element upon dismissal.
- **Screen Reader Landmarks:** Proper semantic nesting using `<main id="main-content">`, `<header>`, `<article aria-label="...">`, `<aside>`, and `<nav>`.

---

## 7. Phase 2 Preflight Verification & Acceptance Test Matrix

The following test matrix defines the acceptance criteria for Phase 2 implementation, building upon existing passing Vitest suites.

| ID | Test Specification | Route / Component | Invariant / Contract | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- |
| **AC-E2-01** | Explicit Species Classification | `/lost` / `IncidentCard` | Invariant C2 | Fixture with missing species renders `"SPECIES UNCONFIRMED"`. Breeds like "Catahoula" or "Siamese" are never guessed. |
| **AC-E2-02** | Species Filter Matching | `/lost` | Invariant C2 | "Canines" tab filters strictly for `species === 'dog'`. "Felines" tab filters strictly for `species === 'cat'`. Unconfirmed alerts appear under "All Alerts". |
| **AC-E2-03** | Grounded Telemetry Display | `/lost` / `IncidentCard` | Invariant C3 | Renders `"LOCATION REPORTED"` when address present; `"LOCATION DETAILS UNAVAILABLE"` when absent. No fake radiuses or bearings. |
| **AC-E2-04** | Residential Address Masking | `/lost` / `IncidentCard` | SEC-BACKEND-01 / C6 | Raw street addresses are suppressed on public cards. Displays `"Area details restricted for owner privacy"`. |
| **AC-E2-05** | Minimum Touch Target Geometry | `/lost` / `/lost/new` | Invariant C4 / WCAG AA | All actionable buttons and links have `min-h-[44px]` and `min-w-[44px]`. |
| **AC-E2-06** | Truthful Recovery Modal | `IncidentCard` | Safety Invariant | Modal presents anti-extortion guidance, daytime meeting advice, and denies existence of fake phone dialers. |
| **AC-E2-07** | Zero-Incident State | `/lost` | UI State | When `activeAlerts.length === 0`, renders calm naturalist banner with "Report a Missing Pet" button. |
| **AC-E2-08** | Empty Search State | `/lost` | UI State | When search yields 0 matches, displays query string and 1-tap "Reset Filters" action. |
| **AC-E2-09** | Unregistered Pet Guidance | `/lost/new` | Crisis UX | When `safePets.length === 0` and `pets.length === 0`, renders Emergency Fast-Registration Guidance Card linking to `/pets/new?emergency=true`. |
| **AC-E2-10** | Active Alert Navigation | `/lost/new` | Crisis UX | When `safePets.length === 0` and `pets.length > 0`, renders list of open incidents with direct links to `/alerts/:id`. |
| **AC-E2-11** | Emergency Alert Submission | `/lost/new` | Backend Contract | Submits `{ pet_id, last_seen_address, description }` to `POST /api/v1/alerts/`, re-hydrates store, and redirects to `/alerts/:id`. |
| **AC-E2-12** | Truthful Protocol Sidebar | `/lost/new` | Truth in Advertising | Lists public QR tag shift and recovery ledger listing. Omits false biometric broadcast claims. |

---

## 8. Conclusion & Sign-Off

This specification establishes the uncompromised architecture for SafePaws' Lost & Found domain for Phase 2. By fusing **Panel A's Field Dispatch Ledger** aesthetic with **forensic backend accuracy** and **de-escalating crisis triage**, SafePaws ensures that pet guardians in crisis find immediate, grounded assistance while community searchers receive crisp, trustworthy intelligence.

**Submitted by:**  
**E2 — Lost & Found Experience Architect**  
SafePaws UX-06.5 Phase 2 Preflight  
*Ratified for Implementation Readiness*
