import React, { useMemo } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { PetCard } from '../components/PetCard';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { pets } = usePetStore();

  const lostPets = useMemo(() => pets.filter(p => p.status === 'lost'), [pets]);
  const safePets = useMemo(() => pets.filter(p => p.status !== 'lost'), [pets]);

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-12 md:pb-12 pb-32">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="font-serif text-[36px] sm:text-[44px] text-[var(--color-ink)] leading-tight tracking-tight mb-2">
              Your Pets
            </h1>
            <p className="text-[var(--color-trail)] text-[16px]">Manage your companions and their safety profiles.</p>
          </div>
          <Link 
            to="/pets/new" 
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[var(--color-ink)] hover:bg-[var(--color-ink-soft)] text-white rounded-full font-semibold text-[14px] shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bone)] focus:ring-[var(--color-ink)]"
          >
            <Plus size={18} />
            Register Pet
          </Link>
        </div>

        {/* Active Alerts Banner */}
        {lostPets.length > 0 && (
          <div 
            className="mb-12 p-6 sm:p-8 rounded-[1.5rem] bg-[var(--color-alert-clay)]/10 border border-[var(--color-alert-clay)]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            role="alert" 
            aria-live="polite"
          >
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-[var(--color-alert-clay)]/20 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
                <ShieldAlert className="text-[var(--color-alert-clay)]" size={24} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[var(--color-alert-clay)] mb-1">Active Missing Alert</h2>
                <p className="text-[var(--color-ink)] text-[15px] max-w-md">
                  Your pet is currently reported as lost. The local SafePaws network has been notified.
                </p>
              </div>
            </div>
            <Link 
              to="/lost" 
              className="group flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-alert-clay)] hover:bg-[var(--color-alert-clay)] text-white font-semibold text-[14px] rounded-full transition-colors"
            >
              Manage Alert
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 sm:p-16 text-center border border-[var(--color-border)] shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-[var(--color-bone)] rounded-full flex items-center justify-center mb-6">
              <Plus className="text-[var(--color-marigold)]" size={40} />
            </div>
            <h2 className="font-serif text-[28px] text-[var(--color-ink)] mb-3">No pets registered yet</h2>
            <p className="text-[var(--color-trail)] mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
              Register your first pet to generate their biometric profile and secure them within the SafePaws network.
            </p>
            <Link 
              to="/pets/new" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-marigold)] text-white rounded-full font-semibold hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[var(--color-marigold)]"
            >
              Register your first pet
            </Link>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Lost Pets Grid */}
            {lostPets.length > 0 && (
              <section aria-labelledby="lost-pets-heading">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-3 h-px bg-[var(--color-alert-clay)]" />
                  <h2 id="lost-pets-heading" className="text-[13px] font-bold text-[var(--color-alert-clay)] uppercase tracking-[0.12em]">
                    Missing
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {lostPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              </section>
            )}

            {/* Safe Pets Grid */}
            {safePets.length > 0 && (
              <section aria-labelledby="safe-pets-heading">
                <div className="flex items-center gap-3 mb-6">
                  <span className="w-3 h-px bg-[var(--color-trail)]" />
                  <h2 id="safe-pets-heading" className="text-[13px] font-bold text-[var(--color-trail)] uppercase tracking-[0.12em]">
                    Safe at home
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {safePets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </main>
    </div>
  );
}
