# SafePaws Scanner Camera & State Contracts (UX-06.4)
**Direction:** Atelier Biometrics  
**Authority:** Chief Product & Technical Orchestrator  
**Document Ref:** `SAFEPAWS-UX-06.4-STATE-CONTRACTS`  
**Scope Lock:** Frontend Only | Gate 4 on HOLD

---

## 1. Scanner Phase & State Enumeration

The state architecture expands the legacy 6-state scanner into a robust 20-state finite state machine guaranteeing complete lifecycle coverage, honest error diagnostics, and explicit simulation demarcation:

```typescript
export type ScannerOperationalState =
  | 'IDLE'                      // Standby before permission or hardware engagement
  | 'PERMISSION_REQUIRED'      // First-time or unprompted camera permission request
  | 'INITIALIZING'             // Hardware stream spin-up and capability probing
  | 'CAMERA_READY'             // Video stream live, optical reticle displayed
  | 'PERMISSION_DENIED'        // User or browser disallowed camera access
  | 'CAMERA_UNAVAILABLE'       // Camera in use by another app or missing hardware
  | 'CAMERA_ERROR'             // Generic hardware failure / stream drop
  | 'CAPTURE_GUIDANCE'         // Active alignment interaction with nares focal lock
  | 'CAPTURED'                 // Transient 60ms shutter bloom / video frame freeze
  | 'REVIEW'                   // Still-frame review with framing quality check
  | 'RETAKE'                   // User dismissed frame and returned to live viewfinder
  | 'PROCESSING_TOPOLOGY'      // Phase 01: Extracting 2D rhinarium surface ridges
  | 'PROCESSING_VECTOR'        // Phase 02: High-dimensional neural vector matching
  | 'MATCH'                    // Backend returned MATCH (potential match verified)
  | 'AMBIGUOUS'                // Backend returned AMBIGUOUS (multiple candidates)
  | 'UNKNOWN'                  // Backend returned UNKNOWN (unregistered companion)
  | 'QUALITY_FAILURE'          // 422 / Blur / Poor lighting / Bad bounding box
  | 'SYSTEM_FAILURE'           // 503 / Network offline / Checkpoint missing
  | 'CANDIDATE_SELECTED'       // Finder visually selected candidate from ambiguous pool
  | 'IDENTIFICATION_UNAVAILABLE' // Service offline or demo fallback
  | 'DEMO_MODE';               // Explicit synthetic mock mode
```

---

## 2. Invariant Contracts

### Invariant SC-01: No Auto-Promotion to Biometric Match
- Under no circumstance may an `AMBIGUOUS` response (even if only 1 candidate remains) be promoted automatically into a `MATCH`.
- When a user clicks a candidate card from an ambiguous pool, the system must set state to `CANDIDATE_SELECTED` and present the mandatory disclaimer:
  > *"Note: This identity was visually selected by the finder, not verified by an automated biometric confidence threshold."*

### Invariant SC-02: Prominent Simulation Marking
- Any synthetic, mock, or placeholder match (such as demo mode or local mock fixtures) must prominently and permanently display:
  > `SIMULATION MODE — NOT A VERIFIED BIOMETRIC RESULT`
- Fake confidence scores (e.g. 99.8%) must never be presented as live model inference.

### Invariant SC-03: Zero Camera Stream Leaks
- Every `MediaStream` allocated via `getUserMedia` must be stopped across all audio and video tracks:
  1. On component unmount (`useEffect` cleanup).
  2. When navigating away (back button or close button).
  3. When switching from Camera View to File Upload mode.
  4. When switching between camera devices (stop device A before acquiring device B).
  5. In race conditions where the user navigates before the camera promise resolves.

### Invariant SC-04: Grounded Error Distinction
- **422 / 400 / 413 / 415 / Error code `LOW_QUALITY_IMAGE`**: Classified as `QUALITY_FAILURE`. Informs the user of environmental factors (lighting, blur, distance) and offers a checklist and retry button.
- **503 / Network Drop / `CHECKPOINT_MISSING`**: Classified as `SYSTEM_FAILURE`. Transparently informs the user that SafePaws servers are unreachable without blaming their scan.

---

## 3. Data Interface Specifications

```typescript
export interface CandidatePet {
  pet_id: string;
  qr_tag_id?: string;
  name?: string;
  breed?: string;
  photo_url?: string;
  confidence?: number;
}

export interface ScannerResultPayload {
  state: ScannerOperationalState;
  petId?: string;
  petName?: string;
  qrTagId?: string;
  candidates?: CandidatePet[];
  errorDetails?: string;
  isSimulated?: boolean;
}
```

---

*Certified by Panel D — Scanner & Identity Transformation.*
