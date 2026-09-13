import { Pet, SearchResponse } from '../types';

export class ApiClient {
  static async registerPet(petData: Partial<Pet>): Promise<Pet> {
    const payload = {
      name: petData.name,
      species: petData.species,
      breed: petData.breed,
      color: petData.color,
      age: petData.age,
      weight: petData.weight,
      owner_name: petData.ownerName,
      owner_phone: petData.ownerPhone,
      neighborhood: petData.neighborhood,
      medical_notes: petData.medicalNotes,
      distinctive_features: petData.distinctiveFeatures || [],
      microchip_id: petData.microchipId,
      consent_given: true,
    };
    const res = await fetch('/api/v1/pets/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Registration failed: ${res.statusText}`);
    return res.json();
  }

  static async getPet(petId: string): Promise<Pet> {
    const res = await fetch(`/api/v1/pets/${petId}`);
    if (!res.ok) throw new Error(`Failed to fetch pet: ${res.statusText}`);
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      species: data.species,
      breed: data.breed,
      color: data.color,
      age: data.age,
      weight: data.weight,
      ownerName: data.owner_name,
      ownerPhone: data.owner_phone,
      neighborhood: data.neighborhood,
      medicalNotes: data.medical_notes,
      distinctiveFeatures: data.distinctive_features,
      microchipId: data.microchip_id,
      photoUrl: data.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      status: data.status,
      qrTagId: data.qr_tag_id
    };
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
    const res = await fetch('/api/v1/pets/identify', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      let msg = res.statusText;
      try {
        const errData = await res.json();
        msg = errData.message || errData.detail || msg;
      } catch (e) {}
      throw new Error(`Identification failed: ${msg}`);
    }
    return res.json();
  }

  static async reportSighting(sighting: any): Promise<any> {
    const payload = {
      reporter_name: sighting.reporterName,
      location: sighting.location,
      notes: sighting.notes,
    };
    const res = await fetch('/api/v1/sightings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Sighting failed: ${res.statusText}`);
    return res.json();
  }

  static async getHealth(): Promise<{status: string, pipeline_mode: string}> {
    const res = await fetch('/api/v1/health/');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }
}