import { create } from 'zustand';
import { Pet, NeighborhoodAlert, CommunitySighting } from '../types';
import { ApiClient } from '../utils/apiClient';

interface PetState {
  pets: Pet[];
  selectedPetId: string;
  alerts: NeighborhoodAlert[];
  sightings: CommunitySighting[];
  hydrated: boolean;
  
  // Actions
  hydrate: () => Promise<void>;
  addPet: (pet: Pet) => void;
  removePet: (petId: string) => void;
  setSelectedPetId: (petId: string) => void;
  triggerLostAlert: (pet: Pet, alert: NeighborhoodAlert) => void;
  addSighting: (sighting: CommunitySighting) => void;
  resolveAlert: (alertId: string) => void;
}

const getInitialSelectedPetId = () => {
  try {
    const savedId = localStorage.getItem('safepaws_selected_pet_id');
    if (savedId) return savedId;
  } catch {}
  return '';
};

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  selectedPetId: getInitialSelectedPetId(),
  alerts: [],
  sightings: [],
  hydrated: false,

  hydrate: async () => {
    try {
      let pets: Pet[] = [];
      try {
        pets = await ApiClient.getAllPets();
      } catch (e) {
        // May fail if not authenticated
      }
      
      const [alerts, sightings] = await Promise.all([
        ApiClient.getAllAlerts(),
        ApiClient.getAllSightings()
      ]);
      set({ 
        pets, 
        alerts: alerts.map(a => ({
          id: a.id,
          petId: a.pet_id,
          petName: a.pet_name || 'Unknown',
          breed: a.breed || 'Unknown',
          photoUrl: a.photo_url || '',
          status: a.status as 'active' | 'resolved',
          broadcastRadiusKm: 5,
          notifiedNeighborsCount: 0,
          timeAgo: a.created_at || 'Recently',
          lastSeenAddress: a.last_seen_address || '',
          description: a.description || '',
          sightingsCount: 0
        })), 
        sightings: sightings.map(s => ({
          id: s.id,
          reporterName: s.reporter_name,
          location: s.location,
          notes: s.notes,
          time: s.time || 'Recently',
          alertId: s.alert_id,
          confirmed: false
        })),
        hydrated: true
      });
    } catch (e) {
      console.error('Failed to hydrate store from API', e);
      set({ hydrated: true });
    }
  },

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
  if (state.selectedPetId !== prevState.selectedPetId) {
    try {
      localStorage.setItem('safepaws_selected_pet_id', state.selectedPetId);
    } catch {}
  }
});
