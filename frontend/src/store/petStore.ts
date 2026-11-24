import { create } from 'zustand';
import { Pet, NeighborhoodAlert, CommunitySighting } from '../types';
import { ApiClient } from '../utils/apiClient';

interface PetState {
  pets: Pet[];
  selectedPetId: string;
  alerts: NeighborhoodAlert[];
  sightings: CommunitySighting[];
  hydrated: boolean;
  isLoading: boolean;
  error: string | null;
  
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
  isLoading: false,
  error: null,

  hydrate: async () => {
    set({ isLoading: true, error: null });
    try {
      const [pets, alerts, sightings] = await Promise.all([
        ApiClient.getAllPets(),
        ApiClient.getAllAlerts().catch(() => []),
        ApiClient.getAllSightings().catch(() => [])
      ]);

      set((state) => {
        // Reconcile selectedPetId with fetched pets
        let activeSelectedId = state.selectedPetId;
        if (pets.length > 0) {
          const exists = pets.some(p => p.id === activeSelectedId);
          if (!exists) {
            activeSelectedId = pets[0].id;
          }
        } else {
          activeSelectedId = '';
        }

        return {
          pets,
          selectedPetId: activeSelectedId,
          alerts: alerts.map((a: any) => ({
            id: a.id,
            petId: a.pet_id,
            petName: a.pet_name || 'Unknown',
            breed: a.breed || 'Unknown',
            photoUrl: a.photo_url || '',
            status: a.status as 'active' | 'resolved',
            timeAgo: a.created_at || 'Recently',
            lastSeenAddress: a.last_seen_address || '',
            description: a.description || '',
            sightingsCount: 0
          })), 
          sightings: sightings.map((s: any) => ({
            id: s.id,
            reporterName: s.reporter_name,
            location: s.location,
            notes: s.notes,
            time: s.time || 'Recently',
            alertId: s.alert_id,
            confirmed: false
          })),
          hydrated: true,
          isLoading: false,
          error: null
        };
      });
    } catch (e: any) {
      console.error('Failed to sync pets with SafePaws network:', e);
      set((state) => ({ 
        // Preserve previously loaded valid records rather than wiping them on network failure
        pets: state.pets,
        hydrated: true, 
        isLoading: false, 
        error: e?.message || 'Unable to sync with SafePaws network. Please check your connection.' 
      }));
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
      let newSelectedId = '';
      if (remaining.length > 0) {
        newSelectedId = state.selectedPetId === petId ? remaining[0].id : state.selectedPetId;
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
      const targetAlert = state.alerts.find(a => a.id === alertId);
      const newAlerts = state.alerts.map((a) => (a.id === alertId ? { ...a, status: 'resolved' as const } : a));
      const newPets = state.pets.map((p) => {
        if (targetAlert && p.id === targetAlert.petId) {
          return { ...p, status: 'safe' as const };
        }
        return p;
      });
      return { alerts: newAlerts, pets: newPets };
    });
  },
}));

usePetStore.subscribe((state, prevState) => {
  if (state.selectedPetId !== prevState.selectedPetId) {
    try {
      if (state.selectedPetId) {
        localStorage.setItem('safepaws_selected_pet_id', state.selectedPetId);
      } else {
        localStorage.removeItem('safepaws_selected_pet_id');
      }
    } catch {}
  }
});
