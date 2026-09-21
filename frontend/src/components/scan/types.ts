export type ScanPhase = 'SCAN' | 'ALIGN' | 'CAPTURE' | 'ANALYZE' | 'COMPARE' | 'RESULT';

export type ScanResultState = 'MATCH' | 'AMBIGUOUS' | 'UNKNOWN' | 'QUALITY_FAILURE' | 'SYSTEM_FAILURE';

export interface ScanResult {
  state: ScanResultState;
  petId?: string;     // For MATCH
  qrTagId?: string;   // For MATCH — used to route finder to public profile
  candidates?: string[]; // For AMBIGUOUS (array of petIds)
  errorDetails?: string; // For failures
}
