export type ScanPhase = 
  | 'SCAN' 
  | 'ALIGN' 
  | 'CAPTURE' 
  | 'REVIEW' 
  | 'ANALYZE' 
  | 'COMPARE' 
  | 'RESULT';

export type ScanResultState = 
  | 'MATCH' 
  | 'AMBIGUOUS' 
  | 'UNKNOWN' 
  | 'QUALITY_FAILURE' 
  | 'SYSTEM_FAILURE' 
  | 'CANDIDATE_SELECTED'
  | 'IDENTIFICATION_UNAVAILABLE'
  | 'DEMO_MODE';

export type CameraLifecycleState =
  | 'IDLE'
  | 'PERMISSION_REQUIRED'
  | 'INITIALIZING'
  | 'READY'
  | 'PERMISSION_DENIED'
  | 'UNAVAILABLE'
  | 'ERROR';

export interface ScanCandidate {
  pet_id: string;
  qr_tag_id?: string;
  name?: string;
  breed?: string;
  photo_url?: string;
  confidence?: number;
}

export interface ScanResult {
  state: ScanResultState;
  petId?: string; // For MATCH or CANDIDATE_SELECTED
  petName?: string;
  qrTagId?: string; // For MATCH or CANDIDATE_SELECTED public routing
  candidates?: ScanCandidate[]; // For AMBIGUOUS
  errorDetails?: string; // For failures
  isSimulated?: boolean; // When displaying simulated mock results
  capturedImageUrl?: string; // Preview image
}
