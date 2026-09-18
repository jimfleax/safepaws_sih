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
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Registration failed: ${res.statusText}`);
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
      photoUrl: data.photo_url || "",
      status: data.status,
      qrTagId: data.qr_tag_id
    };
  }

  static async getPet(petId: string): Promise<Pet> {
    const res = await fetch(`/api/v1/pets/${petId}`, { credentials: 'include' });
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
      photoUrl: data.photo_url || "",
      status: data.status,
      qrTagId: data.qr_tag_id
    };
  }

  static async getPetByTag(tagId: string): Promise<Pet> {
    const res = await fetch(`/api/v1/pets/tag/${tagId}`, { credentials: 'include' });
    if (!res.ok) throw new Error(`Failed to fetch pet by tag: ${res.statusText}`);
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
      photoUrl: data.photo_url || "",
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
      credentials: 'include'
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
      credentials: 'include'
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
      alert_id: sighting.alertId,
    };
    const res = await fetch('/api/v1/sightings/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Sighting failed: ${res.statusText}`);
    return res.json();
  }

  static async createAlert(alertData: any): Promise<any> {
    const payload = {
      pet_id: alertData.petId,
      last_seen_address: alertData.lastSeenAddress,
      description: alertData.description
    };
    const res = await fetch('/api/v1/alerts/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Alert creation failed: ${res.statusText}`);
    return res.json();
  }

  static async resolveAlert(alertId: string): Promise<any> {
    const res = await fetch(`/api/v1/alerts/${alertId}/resolve`, {
      method: 'PUT',
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Alert resolution failed: ${res.statusText}`);
    return res.json();
  }

  
  static async getAllPets(): Promise<Pet[]> {
    const res = await fetch('/api/v1/pets/', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch pets');
    const data = await res.json();
    return data.map((d: any) => ({
      id: d.id,
      name: d.name,
      species: d.species,
      breed: d.breed,
      color: d.color,
      age: d.age,
      weight: d.weight,
      ownerName: d.owner_name,
      ownerPhone: d.owner_phone,
      neighborhood: d.neighborhood,
      medicalNotes: d.medical_notes,
      distinctiveFeatures: d.distinctive_features,
      microchipId: d.microchip_id,
      photoUrl: d.photo_url || "",
      status: d.status,
      qrTagId: d.qr_tag_id
    }));
  }

  static async getAllAlerts(): Promise<any[]> {
    const res = await fetch('/api/v1/alerts/', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  }

  static async getAllSightings(): Promise<any[]> {
    const res = await fetch('/api/v1/sightings/', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to fetch sightings');
    return res.json();
  }

  static async deletePet(petId: string): Promise<void> {
    const res = await fetch(`/api/v1/pets/${petId}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) throw new Error(`Failed to delete pet: ${res.statusText}`);
  }

  static async getHealth(): Promise<{status: string, pipeline_mode: string}> {
    const res = await fetch('/api/v1/health/');
    if (!res.ok) throw new Error('Health check failed');
    return res.json();
  }
}
