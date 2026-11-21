export type ScanPhase = 'SCAN' | 'ALIGN' | 'CAPTURE' | 'ANALYZE' | 'COMPARE' | 'RESULT';

export type ScanResultState = 'MATCH' | 'AMBIGUOUS' | 'UNKNOWN' | 'QUALITY_FAILURE' | 'SYSTEM_FAILURE' | 'CANDIDATE_SELECTED';

export interface ScanResult {
  state: ScanResultState;
  petId?: string; // For MATCH or CANDIDATE_SELECTED
  petName?: string;
  qrTagId?: string; // For MATCH or CANDIDATE_SELECTED public routing
  candidates?: Array<{pet_id: string, qr_tag_id?: string, name?: string, breed?: string, photo_url?: string}>; // For AMBIGUOUS
  errorDetails?: string; // For failures
}
