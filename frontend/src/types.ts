export interface Pet {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'other';
  breed: string;
  color: string;
  age: string;
  weight?: string;
  photoUrl: string;
  microchipId?: string;
  status: 'safe' | 'lost' | 'sightings_reported';
  userId?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerAddress?: string;
  neighborhood?: string;
  consentGiven?: boolean;
  medicalNotes?: string;
  shareMedicalNotes?: boolean;
  dietNotes?: string;
  reward?: string;
  distinctiveFeatures: string[];
  qrTagId: string;
  lastSeenLocation?: {
    lat: number;
    lng: number;
    address: string;
    time: string;
  };
}

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
  species?: 'dog' | 'cat' | 'other' | 'unknown';
}

export interface CommunitySighting {
  id: string;
  alertId: string;
  reporterName: string;
  location: string;
  time: string;
  notes: string;
  confirmed: boolean;
}

export interface SearchResultMatch {
  pet_id: string;
  qr_tag_id?: string;
  name?: string;
  breed?: string;
  photo_url?: string;
  confidence: number;
}

export interface SearchResponse {
  status: string;
  matches: SearchResultMatch[];
  message: string;
}