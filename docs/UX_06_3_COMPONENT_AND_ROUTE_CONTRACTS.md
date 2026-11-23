# SAFEPAWS — UX-06.3 COMPONENT AND ROUTE CONTRACTS
## TypeScript Schemas, Formal Prop Contracts, Component Hierarchies & Store Specifications

**Document Status:** Official Technical Specification  
**Milestone:** Phase UX-06.3 Owner & Pet Experience Transformation  
**Lead Authority:** Panel C Lead (Owner & Pet Experience Transformation Lead)  
**Coordinating Specialists:**
- **C3:** Frontend Architecture & State Lifecycle Specialist
- **C4:** Visual Implementation & Design Systems Engineer
- **C1:** User Journey & Information Architecture Specialist
- **C5:** Accessibility & Motion Choreography Specialist
**Collaborating Panels:**
- **Panel A Lead:** Design System Primitives & Token Parity
- **Panel F Lead:** Independent Adversarial Quality Assurance
**Repository Scope:** `frontend/` only (Strict Frontend Lock: Zero backend, DB, or auth modifications)

---

## 1. Domain Types & Shared Schemas

SafePaws maintains a strictly typed domain layer located in `frontend/src/types.ts`. All Panel C components and stores must strictly conform to these canonical types without local ad-hoc type casts or `any` escapes.

### 1.1 Canonical TypeScript Schemas

```typescript
/**
 * Rigorous 3-tier pet safety status.
 * 'safe': Companion is secure under owner supervision.
 * 'lost': Missing pet alert broadcasted; active emergency incident open.
 * 'sightings_reported': Community sighting has occurred for a lost pet; radar active.
 */
export type PetStatus = 'safe' | 'lost' | 'sightings_reported';

/**
 * Supported species classifications.
 */
export type SpeciesType = 'dog' | 'cat' | 'other';

/**
 * Core Pet Domain Model.
 * Represents a registered companion within the SafePaws network.
 */
export interface Pet {
  id: string;
  name: string;
  species: SpeciesType;
  breed: string;
  color?: string;
  age?: string;
  weight?: string;
  ownerName?: string;
  ownerPhone?: string;
  neighborhood?: string;
  medicalNotes?: string;
  shareMedicalNotes?: boolean;
  distinctiveFeatures?: string[];
  microchipId?: string;
  photoUrl: string;
  status: PetStatus;
  qrTagId?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Active or historical neighborhood lost-pet broadcast alert.
 */
export interface NeighborhoodAlert {
  id: string;
  petId: string;
  petName: string;
  breed: string;
  photoUrl: string;
  status: 'active' | 'resolved';
  broadcastRadiusKm: number;
  notifiedNeighborsCount: number;
  timeAgo: string;
  lastSeenAddress: string;
  description: string;
  sightingsCount: number;
  createdAt?: string;
}

/**
 * Community sighting record submitted by a finder or field observer.
 */
export interface Sighting {
  id: string;
  petId?: string;
  alertId?: string;
  reporterName?: string;
  location: string;
  notes?: string;
  photoUrl?: string;
  createdAt: string;
}

/**
 * Authenticated guardian user record.
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  neighborhood?: string;
  profileCompleted: boolean;
  picture?: string;
}
```

---

## 2. Complete Component Hierarchy & Roster

The Panel C component architecture eliminates orphaned implementations, inlined cards, and custom modal wrappers, organizing all surfaces cleanly:

```
frontend/src/
├── components/
│   ├── DashboardNav.tsx                # Subroute-aware navigation rail (desktop) & mobile bottom dock
│   ├── PetCard.tsx                     # Polymorphic pet card primitive (grid, row, crisis modes)
│   ├── modals/
│   │   ├── QrTagModal.tsx              # Smart QR collar tag preview, copyable URL & download modal
│   │   ├── EditPetModal.tsx            # Accessible Radix modal for editing companion vitals & notes
│   │   └── DeletePetModal.tsx          # High-contrast danger dialog for purging pet identity records
│   └── ui/                             # Panel A Primitives (Card, Badge, Button, FormField, Dialog)
├── pages/
│   ├── SetupProfile.tsx                # First-time guardian onboarding (Zone detection & phone)
│   ├── Dashboard.tsx                   # Central console (Calm guardianship vs Crisis recovery HUD)
│   ├── PublicTagProfile.tsx            # Rescuer collar tag page with SD-01 privacy withholding
│   └── pets/
│       ├── NewPet.tsx                  # 3-step atomic biometric registration wizard
│       └── PetDetail.tsx               # Master companion identity dossier & collar hub
├── store/
│   ├── petStore.ts                     # Pet, alert, sighting, and hydration state store
│   └── authStore.ts                    # Authentication session and profile completion store
└── utils/
    └── apiClient.ts                    # Strongly typed HTTP client communicating with backend
```

---

## 3. Formal TypeScript Component Prop Contracts

### 3.1 `<PetCard />` (Polymorphic Companion Card Primitive)
Consolidates all previous inline implementations across `Dashboard.tsx` and detail views into a polymorphic, accessible primitive backed by Panel A’s `Card` and `Badge`.

```typescript
export interface PetCardProps {
  /** The full companion identity entity to render. */
  pet: Pet;
  
  /**
   * Display mode for the polymorphic card:
   * - 'grid': Default responsive bento-grid card with 4:3 photo and vital chips.
   * - 'row': Condensed horizontal list row for dense collections (4+ pets).
   * - 'crisis': High-contrast Alert-Clay banner card featuring active radar telemetry.
   * @default 'grid'
   */
  viewMode?: 'grid' | 'row' | 'crisis';
  
  /** Associated active alert record (required when viewMode === 'crisis'). */
  activeAlert?: NeighborhoodAlert;
  
  /** Optional click handler when card is selected. Defaults to navigating to /pets/:id. */
  onSelect?: (pet: Pet) => void;
  
  /** Additional styling utility classes. */
  className?: string;
}
```

### 3.2 `<DashboardNav />` (Subroute-Aware Shell Navigation)
Provides accessible navigation across authenticated routes, supporting subroute prefix matching (`/pets/*` maps to `/dashboard`, `/alerts/*` maps to `/lost`, `/community/*` maps to `/community`).

```typescript
export interface DashboardNavProps {
  /** Optional additional CSS classes for outer container. */
  className?: string;
}
```

**Key Internal Subroute Match Contract:**
```typescript
const isCurrent = (path: string): boolean => {
  if (path === '/dashboard') {
    return location.pathname === '/dashboard' || location.pathname.startsWith('/pets');
  }
  if (path === '/lost') {
    return location.pathname === '/lost' || location.pathname.startsWith('/alerts');
  }
  if (path === '/community') {
    return location.pathname === '/community' || location.pathname.startsWith('/community');
  }
  return location.pathname === path;
};
```

### 3.3 `<QrTagModal />` (Smart QR Collar Tag Hub)
Generates physical collar QR tags, formats canonical URLs, enforces SD-01 privacy disclosures, and provides vector asset export.

```typescript
export interface QrTagModalProps {
  /** Controls modal visibility. */
  isOpen: boolean;
  
  /** Invoked when modal is dismissed via ESC key, backdrop click, or close button. */
  onClose: () => void;
  
  /** The companion record whose QR tag is being inspected. */
  pet: Pet;
}
```

### 3.4 `<EditPetModal />` (Accessible Companion Editor)
Accessible Radix dialog providing form controls to update non-biometric attributes (age, weight, microchip, distinctive features, medical advisories, and the `shareMedicalNotes` toggle).

```typescript
export interface EditPetModalProps {
  /** Controls modal visibility. */
  isOpen: boolean;
  
  /** Invoked when dismissed without saving. */
  onClose: () => void;
  
  /** The pet record being edited. */
  pet: Pet;
  
  /** Invoked upon successful API update. */
  onUpdateSuccess: (updatedPet: Pet) => void;
}
```

### 3.5 `<DeletePetModal />` (Destructive Purge Confirmation)
Accessible Radix confirmation dialog requiring intentional confirmation to purge a pet's biometric signature and collar tag from the registry.

```typescript
export interface DeletePetModalProps {
  /** Controls modal visibility. */
  isOpen: boolean;
  
  /** Invoked when dismissed. */
  onClose: () => void;
  
  /** The pet record pending deletion. */
  pet: Pet;
  
  /** Invoked upon successful deletion. */
  onDeleteSuccess: () => void;
}
```

---

## 4. State Store Contracts & Lifecycles

SafePaws uses Zustand stores for lightweight, robust reactive state management without complex middleware boilerplate.

### 4.1 Pet Store Contract (`frontend/src/store/petStore.ts`)

```typescript
export interface PetState {
  // Domain Collections
  pets: Pet[];
  alerts: NeighborhoodAlert[];
  sightings: Sighting[];
  selectedPetId: string | null;

  // Hydration & Network Lifecycle
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  hydrate: () => Promise<void>;
  selectPet: (id: string | null) => void;
  addPet: (pet: Pet) => void;
  updatePetInStore: (id: string, updates: Partial<Pet>) => void;
  removePet: (id: string) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}
```

#### Lifecycle & Synchronization Rules:
1. **Hydration Integrity:** `hydrate()` performs concurrent data retrieval (`ApiClient.getPets()`, `ApiClient.getAlerts()`, `ApiClient.getSightings()`).
   - Sets `isLoading = true` and `error = null`.
   - On success: commits collections, sets `hydrated = true`, `isLoading = false`.
   - On failure: preserves cached records if available, records human-readable `error` string, sets `isLoading = false`.
2. **Selected Pet Synchronization:** When `selectPet(id)` is called, the value is synchronized to `localStorage.setItem('safepaws_selected_pet_id', id)`.
3. **Boundary Deletion Reset:** When `removePet(id)` is executed:
   - Removes the pet from `pets[]`.
   - If `selectedPetId === id`, resets `selectedPetId = null` and removes the key from `localStorage`.
   - If remaining pets exist, updates `selectedPetId = pets[0].id` to prevent undefined store references.

### 4.2 Auth Store Contract (`frontend/src/store/authStore.ts`)

```typescript
export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  setProfileCompleted: (completed: boolean) => void;
}
```

#### Route Protection Guards:
- **`DashboardRoute`:** Checks `isAuthenticated`. If false, redirects to `/`. If `user?.profileCompleted === false`, redirects to `/setup-profile`.
- **`SetupProfileRoute`:** Checks `isAuthenticated`. If false, redirects to `/`. If `user?.profileCompleted === true`, bounces directly to `/dashboard`.

---

## 5. API Client Contracts & Wire Schema Alignment

The frontend communicates with FastAPI backend services via `frontend/src/utils/apiClient.ts`. All methods are strictly typed and handle HTTP exceptions uniformly:

```typescript
export interface RegisterPetPayload {
  name: string;
  species: SpeciesType;
  breed: string;
  color?: string;
  age?: string;
  weight?: string;
  microchipId?: string;
  distinctiveFeatures?: string[];
  medicalNotes?: string;
  shareMedicalNotes?: boolean;
  ownerName?: string;
  ownerPhone?: string;
  neighborhood?: string;
  consentGiven: boolean;
}

export interface UpdatePetPayload {
  name?: string;
  species?: SpeciesType;
  breed?: string;
  color?: string;
  age?: string;
  weight?: string;
  microchipId?: string;
  distinctiveFeatures?: string[];
  medicalNotes?: string;
  shareMedicalNotes?: boolean;
}

export interface BiometricEnrollmentResponse {
  status: 'success' | 'failed';
  message: string;
  vectorId?: string;
  dimensions?: number;
}

export interface CreateAlertPayload {
  petId: string;
  lastSeenAddress: string;
  description: string;
  broadcastRadiusKm?: number;
}

export interface ReportSightingPayload {
  petId?: string;
  alertId?: string;
  reporterName?: string;
  reporterContact?: string;
  location: string;
  notes?: string;
  image?: File;
}
```

### 5.1 ApiClient Method Signatures

```typescript
export class ApiClient {
  // Pet Management
  static async getPets(): Promise<Pet[]>;
  static async getPet(petId: string): Promise<Pet>;
  static async registerPet(payload: RegisterPetPayload): Promise<Pet>;
  static async enrollImage(petId: string, imageFile: File): Promise<BiometricEnrollmentResponse>;
  static async updatePet(petId: string, payload: UpdatePetPayload): Promise<Pet>;
  static async deletePet(petId: string): Promise<void>;
  
  // Public Tag Resolution (Sanitized SD-01 Output)
  static async getPetByTag(tagId: string): Promise<Pet>;
  
  // Recovery Alerts & Sightings
  static async getAlerts(): Promise<NeighborhoodAlert[]>;
  static async createAlert(payload: CreateAlertPayload): Promise<NeighborhoodAlert>;
  static async getSightings(): Promise<Sighting[]>;
  static async reportSighting(payload: ReportSightingPayload): Promise<Sighting>;
  
  // User Profile
  static async updateUserProfile(payload: { phone: string; neighborhood: string }): Promise<UserProfile>;
}
```

---

## 6. Contract Verification Checklist & Quality Hard Gates

Every Panel C deliverable is evaluated against this explicit verification checklist before handoff to Panel F QA:

- [ ] **Type Integrity:** `npm run lint` (`tsc --noEmit`) passes with exactly 0 errors and 0 warnings.
- [ ] **Prop Contract Safety:** Zero `any` types used across `PetCardProps`, `QrTagModalProps`, `EditPetModalProps`, and `DeletePetModalProps`.
- [ ] **Null-Safety Guarding:** If `pet.qrTagId` is null/empty, fallback to `pet.id` is strictly avoided to prevent 404 URL loops (`/p/${pet.id}`); modal displays "Tag Pending Provisioning" container instead.
- [ ] **SD-01 Compliance:** Wire response for `ApiClient.getPetByTag()` asserts `owner_name === null`, `owner_phone === null`, and `microchip_id === null`.
- [ ] **Touch Target Sizing:** All buttons and inputs across all 5 surfaces enforce `min-h-[44px] min-w-[44px]`.
- [ ] **Accessible Labels:** Every `<input>`, `<select>`, and `<textarea>` is linked to its label via matching `id` and `htmlFor`.

*Contracts approved. Proceeding to Motion and Interaction Choreography specification.*