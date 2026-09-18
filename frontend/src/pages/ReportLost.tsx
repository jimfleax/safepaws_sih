import React, { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export default function ReportLost() {
  const { pets, triggerLostAlert } = usePetStore();
  const navigate = useNavigate();
  
  const safePets = pets.filter(p => p.status !== 'lost');
  const [selectedPet, setSelectedPet] = useState(safePets.length > 0 ? safePets[0].id : '');
  const [lastSeen, setLastSeen] = useState('');
  const [description, setDescription] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    
    const pet = pets.find(p => p.id === selectedPet);
    if (!pet) return;
    
    try {
      const { ApiClient } = await import('../utils/apiClient');
      const res = await ApiClient.createAlert({
        petId: pet.id,
        lastSeenAddress: lastSeen,
        description: description
      });
      
      await usePetStore.getState().hydrate();
      navigate(`/alerts/${res.id}`);
    } catch (err) {
      console.error('Failed to create alert:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 md:pb-8 pb-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A0A0A]">Report Lost Pet</h1>
          <p className="text-[#8A8175] mt-2">Trigger a community alert for your missing pet.</p>
        </div>
        
        <div 
          className="p-6 rounded-2xl mb-8 flex gap-4" 
          style={{ 
            backgroundColor: 'color-mix(in srgb, var(--color-alert-clay) 10%, transparent)',
            border: '2px solid var(--color-alert-clay)'
          }}
        >
          <AlertTriangle size={24} style={{ color: 'var(--color-alert-clay)' }} className="shrink-0" />
          <div>
            <h3 className="font-bold" style={{ color: 'var(--color-alert-clay)' }}>Emergency Alert</h3>
            <p className="text-sm mt-1 text-[#0A0A0A]">This will immediately notify the community and display your pet on the lost pets board.</p>
          </div>
        </div>

        {safePets.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-[#E5E0D8] text-center">
            <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">No Safe Pets Available</h3>
            <p className="text-[#8A8175]">You don't have any pets registered, or all your pets are already reported lost.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E0D8] p-6 space-y-6">
            <div>
              <label htmlFor="pet-select" className="block text-sm font-semibold text-[#0A0A0A] mb-2">Select Pet</label>
              <select 
                id="pet-select"
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--color-alert-clay)' } as React.CSSProperties}
                required
              >
                {safePets.map(pet => (
                  <option key={pet.id} value={pet.id}>{pet.name} ({pet.breed})</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="last-seen" className="block text-sm font-semibold text-[#0A0A0A] mb-2">Last Seen Location</label>
              <input
                type="text"
                id="last-seen"
                value={lastSeen}
                onChange={(e) => setLastSeen(e.target.value)}
                placeholder="e.g. Central Park near 72nd St entrance"
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': 'var(--color-alert-clay)' } as React.CSSProperties}
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-[#0A0A0A] mb-2">Additional Details</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Was wearing a red collar, gets scared easily by loud noises..."
                rows={4}
                className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 resize-none"
                style={{ '--tw-ring-color': 'var(--color-alert-clay)' } as React.CSSProperties}
                required
              ></textarea>
            </div>
            
            <div className="pt-4">
              <button 
                type="submit"
                className="w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{ backgroundColor: 'var(--color-alert-clay)', '--tw-ring-color': 'var(--color-alert-clay)' } as React.CSSProperties}
              >
                <ShieldAlert size={20} />
                Trigger Alert Now
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
