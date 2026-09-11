import { Pet, SearchResponse } from '../types';

export class ApiClient {
  static async registerPet(petData: Partial<Pet>): Promise<Pet> {
    const res = await fetch('/api/v1/pets/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...petData, consent_given: true }),
    });
    if (!res.ok) throw new Error(`Registration failed: ${res.statusText}`);
    return res.json();
  }

  static async enrollImage(petId: string, file: File): Promise<{status: string, message: string}> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`/api/v1/pets/${petId}/enroll-image`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Enrollment failed: ${res.statusText}`);
    return res.json();
  }

  static async identifyPet(file: File): Promise<SearchResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/v1/search/identify', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Identification failed: ${res.status}`);
    return res.json();
  }

  static async reportSighting(sighting: any): Promise<any> {
    const res = await fetch('/api/v1/sightings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sighting),
    });
    if (!res.ok) throw new Error(`Sighting failed: ${res.statusText}`);
    return res.json();
  }
}