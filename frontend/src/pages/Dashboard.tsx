import React, { useMemo } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert, ArrowRight, Activity, MapPin, Search } from 'lucide-react';

export default function Dashboard() {
  const { pets, alerts } = usePetStore();

  const lostPets = useMemo(() => pets.filter(p => p.status === 'lost'), [pets]);
  const safePets = useMemo(() => pets.filter(p => p.status !== 'lost'), [pets]);
  const hasLostPet = lostPets.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans selection:bg-[var(--color-ink)] selection:text-white">
      <DashboardNav />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 md:py-16 md:pb-16 pb-32">
        {/* 1. CURRENT SITUATION */}
        <header className="mb-16">
          <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Console
          </h1>
          <div className="flex items-center gap-3">
            {hasLostPet ? (
              <>
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-alert)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[var(--color-alert)]"></span>
                </span>
                <span className="text-sm font-bold text-[var(--color-alert)] uppercase tracking-[0.2em]">Active Recovery Protocol</span>
              </>
            ) : (
              <>
                <span className="h-3 w-3 rounded-full bg-[var(--color-success)]"></span>
                <span className="text-sm font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.2em]">Network Secure</span>
              </>
            )}
          </div>
        </header>

        {/* Empty State */}
        {pets.length === 0 && (
          <div className="py-24 px-6 border-y border-[var(--color-ink)]/10 text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold mb-4">No Biometric Profiles Found</h2>
            <p className="text-[var(--color-ink-soft)] mb-10 text-lg">
              Register your first pet to generate their ML nose-print. This allows the SafePaws network to identify them immediately if they ever go missing.
            </p>
            <Link 
              to="/pets/new"
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-ink)] text-white rounded-full font-bold text-sm uppercase tracking-wider hover:bg-[#2A2723] hover:-translate-y-0.5 transition-all"
            >
              Start Enrollment
            </Link>
          </div>
        )}

        {/* 3. ACTIVE LOST ALERT (Priority if exists) */}
        {hasLostPet && (
          <section className="mb-20">
            <div className="flex items-center justify-between mb-8 border-b border-[var(--color-alert)]/20 pb-4">
              <h2 className="text-xs font-bold text-[var(--color-alert)] uppercase tracking-[0.15em] flex items-center gap-2">
                <ShieldAlert size={16} /> Urgent Alerts
              </h2>
            </div>
            
            <div className="flex flex-col gap-6">
              {lostPets.map((pet) => {
                const activeAlert = alerts.find(a => a.petId === pet.id);
                return (
                  <div key={pet.id} className="group flex flex-col md:flex-row bg-white border border-[var(--color-alert)]/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                    {/* Pet Image block */}
                    <div className="md:w-64 h-64 md:h-auto shrink-0 bg-[#F4EDE4] relative border-b md:border-b-0 md:border-r border-[var(--color-alert)]/20">
                      {pet.photoUrl ? (
                         <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover mix-blend-multiply" />
                      ) : (
                         <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink)]/30">
                           <Search size={48} strokeWidth={1} />
                           <span className="text-xs uppercase tracking-widest mt-2 font-bold">No Photo</span>
                         </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <h3 className="font-serif text-3xl text-white font-bold">{pet.name}</h3>
                      </div>
                    </div>
                    
                    {/* Alert Data block */}
                    <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                      <div>
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-alert)] uppercase tracking-wider mb-4">
                          <Activity size={16} className="animate-pulse" />
                          Scanning Network
                        </div>
                        <p className="text-lg text-[var(--color-ink)] mb-2 font-medium">
                          {activeAlert ? activeAlert.description : "Community members and shelters have been notified."}
                        </p>
                        <p className="text-sm text-[var(--color-ink-soft)] flex items-center gap-1.5 mb-8">
                          <MapPin size={14} /> Last seen: {activeAlert?.lastSeenAddress || "Unknown location"}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                        <Link 
                          to={activeAlert ? `/alerts/${activeAlert.id}` : '/lost'}
                          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-alert)] hover:bg-[#A93F2B] text-white font-bold text-xs uppercase tracking-widest transition-colors rounded-full"
                        >
                          Manage Recovery
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. PET IDENTITY (Calm list) */}
        {safePets.length > 0 && (
          <section className={`transition-opacity duration-500 ${hasLostPet ? 'opacity-40 hover:opacity-100' : ''}`}>
            <div className="flex items-center justify-between mb-8 border-b border-[var(--color-ink)]/10 pb-4">
              <h2 className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-[0.15em]">
                Secured Identities
              </h2>
              {!hasLostPet && (
                <Link to="/pets/new" className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider hover:text-[var(--color-accent)] flex items-center gap-1 transition-colors">
                  <Plus size={14} /> Add
                </Link>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              {safePets.map((pet) => (
                <Link 
                  key={pet.id} 
                  to={`/pets/${pet.id}`}
                  className="group flex items-center gap-6 p-4 md:p-5 bg-white/50 hover:bg-white border border-[var(--color-ink)]/10 hover:border-[var(--color-ink)]/20 rounded-2xl transition-all"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-[#F4EDE4] shrink-0 border border-[var(--color-ink)]/5">
                    {pet.photoUrl ? (
                      <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[var(--color-ink)]/30 text-2xl font-serif">
                        {pet.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-2xl font-medium text-[var(--color-ink)] truncate leading-tight">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-soft)] truncate mt-1">
                      {pet.breed} • {pet.color}
                    </p>
                  </div>
                  
                  <div className="hidden md:flex flex-col items-end mr-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ink-soft)] mb-1">Status</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-success)] flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]"></span>
                      Safe
                    </span>
                  </div>
                  
                  <div className="shrink-0 w-10 h-10 rounded-full border border-[var(--color-ink)]/10 flex items-center justify-center group-hover:bg-[var(--color-ink)] group-hover:text-white transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </Link>
              ))}
            </div>
            
            {hasLostPet && (
               <div className="mt-8 text-center">
                 <Link to="/pets/new" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider hover:text-[var(--color-accent)] transition-colors">
                   <Plus size={14} /> Register another pet
                 </Link>
               </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
