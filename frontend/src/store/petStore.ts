import { create } from 'zustand';
import { initialPets, sampleAlerts, sampleSightings } from '../data/mockData';
import { Pet, NeighborhoodAlert, CommunitySighting } from '../types';

interface PetState {
  pets: Pet[];
  selectedPetId: string;
  alerts: NeighborhoodAlert[];
  sightings: CommunitySighting[];
  
  // Actions
  addPet: (pet: Pet) => void;
  removePet: (petId: string) => void;
  setSelectedPetId: (petId: string) => void;
  triggerLostAlert: (pet: Pet, alert: NeighborhoodAlert) => void;
  addSighting: (sighting: CommunitySighting) => void;
  resolveAlert: (alertId: string) => void;
}

const getInitialPets = () => {
  try {
    const saved = localStorage.getItem('safepaws_pets');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse saved pets from localStorage', e);
  }
  return initialPets;
};

const getInitialSelectedPetId = () => {
  try {
    const savedId = localStorage.getItem('safepaws_selected_pet_id');
    if (savedId) return savedId;
  } catch {}
  return 'pet-olive';
};

const getInitialAlerts = () => {
  try {
    const saved = localStorage.getItem('safepaws_alerts');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse saved alerts from localStorage', e);
  }
  return sampleAlerts;
};

const getInitialSightings = () => {
  try {
    const saved = localStorage.getItem('safepaws_sightings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse saved sightings from localStorage', e);
  }
  return sampleSightings;
};

export const usePetStore = create<PetState>((set) => ({
  pets: getInitialPets(),
  selectedPetId: getInitialSelectedPetId(),
  alerts: getInitialAlerts(),
  sightings: getInitialSightings(),

  addPet: (pet) => {
    set((state) => ({ 
      pets: [pet, ...state.pets], 
      selectedPetId: pet.id 
    }));
  },

  removePet: (petId) => {
    set((state) => {
      const remaining = state.pets.filter((p) => p.id !== petId);
      let newSelectedId = state.selectedPetId;
      if (remaining.length > 0 && state.selectedPetId === petId) {
        newSelectedId = remaining[0].id;
      }
      return { pets: remaining, selectedPetId: newSelectedId };
    });
  },

  setSelectedPetId: (petId) => {
    set({ selectedPetId: petId });
  },

  triggerLostAlert: (pet, alert) => {
    set((state) => {
      const newPets = state.pets.map((p) => (p.id === pet.id ? { ...p, status: 'lost' as const } : p));
      const newAlerts = [alert, ...state.alerts];
      return { pets: newPets, alerts: newAlerts, selectedPetId: pet.id };
    });
  },

  addSighting: (sighting) => {
    set((state) => ({ sightings: [sighting, ...state.sightings] }));
  },

  resolveAlert: (alertId) => {
    set((state) => {
      const newAlerts = state.alerts.map((a) => (a.id === alertId ? { ...a, status: 'resolved' as const } : a));
      const newPets = state.pets.map((p) => ({ ...p, status: 'safe' as const })); // Exact current behavior
      return { alerts: newAlerts, pets: newPets };
    });
  },
}));

usePetStore.subscribe((state, prevState) => {
  if (state.pets !== prevState.pets) {
    try {
      localStorage.setItem('safepaws_pets', JSON.stringify(state.pets));
    } catch (e) {
      console.error('Failed to save pets to localStorage', e);
    }
  }
  if (state.selectedPetId !== prevState.selectedPetId) {
    try {
      localStorage.setItem('safepaws_selected_pet_id', state.selectedPetId);
    } catch {}
  }
  if (state.alerts !== prevState.alerts) {
    try {
      localStorage.setItem('safepaws_alerts', JSON.stringify(state.alerts));
    } catch (e) {
      console.error('Failed to save alerts to localStorage', e);
    }
  }
  if (state.sightings !== prevState.sightings) {
    try {
      localStorage.setItem('safepaws_sightings', JSON.stringify(state.sightings));
    } catch (e) {
      console.error('Failed to save sightings to localStorage', e);
    }
  }
});
