import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePetStore } from './petStore';
import { initialPets, sampleAlerts, sampleSightings } from '../data/mockData';
import { Pet, NeighborhoodAlert, CommunitySighting } from '../types';

describe('petStore', () => {
  beforeEach(() => {
    // Clear localStorage and reset store before each test
    localStorage.clear();
    usePetStore.setState({
      pets: initialPets,
      selectedPetId: 'pet-olive',
      alerts: sampleAlerts,
      sightings: sampleSightings
    });
  });

  it('1. initial pets exist as before', () => {
    const state = usePetStore.getState();
    expect(state.pets).toEqual(initialPets);
  });

  it('2. selectedPetId behavior remains intact', () => {
    const state = usePetStore.getState();
    expect(state.selectedPetId).toBe('pet-olive');
    
    usePetStore.getState().setSelectedPetId('pet-max');
    expect(usePetStore.getState().selectedPetId).toBe('pet-max');
  });

  it('3. localStorage persistence remains intact', async () => {
    // Simulate setting a new pet to trigger the subscribe listener
    const newPet = { ...initialPets[0], id: 'new-pet-123' };
    usePetStore.getState().addPet(newPet);
    
    // Zustand subscribe is synchronous in our setup
    const savedPets = JSON.parse(localStorage.getItem('safepaws_pets') || '[]');
    expect(savedPets.length).toBe(initialPets.length + 1);
    expect(savedPets[0].id).toBe('new-pet-123');
    
    const savedId = localStorage.getItem('safepaws_selected_pet_id');
    expect(savedId).toBe('new-pet-123');
  });

  it('4. add/remove behavior remains intact', () => {
    const newPet = { ...initialPets[0], id: 'new-pet-123' };
    
    // Add Pet
    usePetStore.getState().addPet(newPet);
    expect(usePetStore.getState().pets[0].id).toBe('new-pet-123');
    expect(usePetStore.getState().selectedPetId).toBe('new-pet-123');
    
    // Remove Pet
    usePetStore.getState().removePet('new-pet-123');
    // It should fallback to the next available pet for selection
    expect(usePetStore.getState().pets.find(p => p.id === 'new-pet-123')).toBeUndefined();
    expect(usePetStore.getState().selectedPetId).toBe(initialPets[0].id);
  });

  it('5. alert creation/resolution remains intact', () => {
    const pet = initialPets[0];
    const alert: NeighborhoodAlert = { ...sampleAlerts[0], id: 'new-alert' };
    
    // Trigger Lost Alert
    usePetStore.getState().triggerLostAlert(pet, alert);
    expect(usePetStore.getState().alerts[0].id).toBe('new-alert');
    expect(usePetStore.getState().pets.find(p => p.id === pet.id)?.status).toBe('lost');
    
    // Resolve Alert
    usePetStore.getState().resolveAlert('new-alert');
    expect(usePetStore.getState().alerts[0].status).toBe('resolved');
    expect(usePetStore.getState().pets.find(p => p.id === pet.id)?.status).toBe('safe');
  });

  it('6. sightings remain intact', () => {
    const sighting: CommunitySighting = { ...sampleSightings[0], id: 'new-sighting' };
    usePetStore.getState().addSighting(sighting);
    expect(usePetStore.getState().sightings[0].id).toBe('new-sighting');
  });
});
