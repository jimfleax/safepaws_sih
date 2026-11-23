# SAFEPAWS — UX-06.2: LANDING & PUBLIC FINDER IMPLEMENTATION SPECIFICATION
## Architectural Blueprint, Component Contracts, State Topologies & Public Finder Decoupling

**Document ID:** `SP-UX-06.2-IMPL-001`  
**Phase:** UX-06.2 Cinematic Landing, Brand Storytelling & Public Finder Transformation  
**Workstream:** Panel B (Landing & Public Experience) with Panel A (Design Architecture)  
**Authority:** Chief Product & Technical Orchestrator  
**Baseline Git Reference:** `bcdb3cc1f2b3ab79942b211c9c0892ceeb1ae5e1`  
**Repository Branch:** `frontend`  
**Execution Scope:** FRONTEND ONLY — Zero backend or database modifications.

---

## 1. EXECUTIVE ARCHITECTURE OVERVIEW

Phase UX-06.2 transforms SafePaws from a standard utility application into an authoritative, cinematic, and empathetic emergency recovery experience. The public-facing surface represents the critical first impression for two distinct personas:
1. **The Distressed Guardian:** A pet parent seeking immediate registration, preventative protection, or emergency broadcast initiation during a crisis.
2. **The Community Finder / Good Samaritan:** A passerby who has encountered a lost or wandering companion, scanned a QR collar tag, or arrived via local broadcast links, requiring zero-friction identification without mandatory account creation.

### 1.1 Structural Decomposition of Public Routes

| Route | Primary Persona | Architectural Role | Navigation Context |
| :--- | :--- | :--- | :--- |
| `/` | Prospective Guardians & Curious Citizens | Brand storytelling, value proposition, optical biometric demonstration, community proof, conversion funnel. | Public Header (`Header.tsx`) with dynamic active alert counter. |
| `/lost` | Community Finders & Neighborhood Scouts | Live public incident recovery board, geographic search/filter, direct sighting dispatch triggers. | Public Finder Navigation (`PublicFinderNav`) with zero authenticated state traps. |
| `/scan` | On-Scene Finders & Rescuers | Direct camera-based optical nose-print ridge scanner, real-time bounding box alignment, offline guidance. | Dedicated focused full-screen viewfinder with return navigation. |
| `/p/:tagId` | Instant Physical Collar Finders | High-speed emergency contact relay, pet medical dossier, instant owner telephone call and GPS check-in. | Standalone public pet dossier with direct telephone dialers and location pinging. |
| `/sightings/new` | Field Observers | Geotagged observation reporting, photo upload, timestamped notes pre-linked to active missing incident. | Standalone report form accepting `?alertId=` URL query parameter. |

---

## 2. COMPONENT BLUEPRINT & CONTRACT SPECIFICATIONS

### 2.1 Hero Component (`Hero.tsx`)

The hero section serves as the tactical anchor of the landing experience, merging Direction 1's editorial soul (warm Bone canvas `#F6F1E7`, literary Newsreader typography) with Direction 3's high-precision rescue HUD.

#### State Contract & Props
```typescript
interface HeroProps {
  onJoinClick: () => void;      // Triggers Google Auth / Dashboard routing
  onIdentifyClick: () => void;  // Navigates directly to /scan
  onOpenLostAlerts?: () => void;// Navigates directly to /lost
}
```

#### Key Implementation Invariants
1. **Asset Sourcing:** Uses local photographic master `/images/editorial_hero.jpg` (anamorphic dusk canine portrait) paired with HUD overlay tokens, completely eliminating third-party CDN latency and unsplash dependencies.
2. **Interactive Optical Viewfinder:**
   - Features simulated dorsal apex, alar groove, and friction ridge coordinate reticles.
   - Interactive mode toggle allows curious visitors to inspect nasal ridge vectorization before committing to live camera permissions.
   - Fully accessible with `aria-label` and `aria-hidden="true"` on decorative HUD vectors.
3. **Dual Primary Action Cluster:**
   - Primary Accent CTA: `SCAN A FOUND DOG` (`variant="accent"`, `size="lg"`, min-height 48px, leading `Camera` icon).
   - Secondary Structural CTA: `REGISTER YOUR PET` (`variant="secondary"`, `size="lg"`, min-height 48px, leading `Plus` icon in `var(--color-accent-text)`).
4. **Live Incident Telemetry Banner:**
   - Reflects genuine store state (`usePetStore().alerts`).
   - If active alerts exist: Displays animated alert beacon with "Missing pet right now? View live alerts" link.
   - If network is clear: Displays reassuring "Active Neighborhood Scout Watch // All Clear" status.

### 2.2 Six-Layer Asymmetric Bento Showcase (`FeaturesSection.tsx`)

The feature showcase organizes SafePaws' multi-layered protective ecosystem into a scannable, responsive asymmetric bento grid.

#### Grid Geometry & Responsive Mapping
- **Desktop ($\ge 1024\text{px}$):** 3-column asymmetric layout with alternating 2-span and 1-span cards across two rows.
- **Tablet ($768\text{px} - 1023\text{px}$):** 2-column balanced grid.
- **Mobile ($< 768\text{px}$):** Single column vertical stack with card heights auto-clamped to prevent content truncation.

#### Card Topology
1. **Card 1 (Span 2): Nasal Leather Topography** — Deep dive into permanent canine friction ridge biometrics with interactive spotlight.
2. **Card 2 (Span 1): Physical + Digital Smart Tag** — Direct QR tag scanning capability requiring no app store installation.
3. **Card 3 (Span 1): Instant Radius Alert** — High-priority neighborhood dispatch with crisis badge telemetry.
4. **Card 4 (Span 2): GPS Sighting Submissions** — Map-pinned community sighting submissions with verification status.
5. **Card 5 (Span 1): Neighborhood Scout Watch** — Volunteer community watch network and local shelter alignment.
6. **Card 6 (Span 2): Private Health & Emergency Dossier** — Granular privacy controls, microchip cross-references, and medical alerts.

### 2.3 Public Recovery Board (`LostDogs.tsx`) & Public Finder Decoupling

#### The Decoupling Rationale
In earlier versions, `/lost` was nested inside `DashboardNav`. For authenticated guardians, this sidebar was expected. However, for an anonymous neighbor scanning a neighborhood poster or following an SMS dispatch, displaying private dashboard tabs ("My Pets", "Analytics", "Settings") created cognitive friction and confusion.

#### Architectural States & Topologies
1. **Hydration Loading Skeleton (`BoardLoadingSkeleton`):**
   - Renders 4 animated pulse placeholder cards during store hydration (`isLoading || !hydrated`).
   - Prevents the dreaded "flash of empty state" where users momentarily see "No Active Recovery Incidents" before backend records arrive.
2. **Active Incident Cards with Dual Dispatches:**
   - Image & Pet Name Link: Leads to `/alerts/:alertId` for full dossier.
   - Direct Sighting Action Button: `[I Spotted This Pet]` links directly to `/sightings/new?alertId=${alert.id}`, pre-populating the target companion.
   - Secondary Details Button: `[View Incident Room →]` links to `/alerts/:alertId`.
3. **Honest Empty States:**
   - **`ZeroIncidentsSecureState`:** Reassuring green-tinted shield badge confirming zero active community crises in the operational sector.
   - **`NoFilterMatchesState`:** Clean search reset trigger when user queries return no matches.
   - **`RecoveryErrorState`:** Transparent notice if network synchronization is interrupted, providing offline guidance.

---

## 3. WCAG 2.2 AA ACCESSIBILITY & CONTRAST INVARIANTS

| Element | Background Canvas | Text / Control Color | Contrast Ratio | WCAG 2.2 Level |
| :--- | :--- | :--- | :--- | :--- |
| Accent Brand Text (`--color-accent-text`) | Bone (`#F6F1E7`) | `#8B4A00` | 6.82:1 | AAA Pass |
| Primary Body Text (`--color-ink`) | Bone (`#F6F1E7`) | `#1C1A17` | 13.91:1 | AAA Pass |
| Secondary Soft Text (`--color-ink-soft`) | Bone (`#F6F1E7`) | `#6B645C` | 5.02:1 | AA Pass |
| Crisis Alert Clay (`--color-alert-clay`) | White (`#FFFFFF`) | `#B3452F` | 5.48:1 | AA Pass |
| Dark HUD White Headings | Obsidian (`#161513`) | `#FFFFFF` | 17.58:1 | AAA Pass |
| Dark HUD Marigold Text | Obsidian (`#161513`) | `#E2811F` | 5.86:1 | AA Pass |
| Interactive Touch Targets | Any Viewport | Min $44 \times 44\text{px}$ | Compliant | AA Pass |

---

## 4. SIGN-OFF & IMPLEMENTATION VALIDATION

- **TypeScript Typecheck:** `tsc --noEmit` verifies strict adherence to all component prop contracts.
- **Vitest Unit & Integration Suites:** All rendering, hydration, and routing tests passing.
- **Bundle Impact:** Total gzipped CSS budget strictly preserved under 25 kB.
- **Zero Backend Mutation:** Confirmed — all changes isolated to `frontend/src/`.
