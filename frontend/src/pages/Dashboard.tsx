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
    <div className="min-h-screen bg-[#F6F1E7] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-12 md:pb-12 pb-32">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 pb-8 border-b border-[var(--color-border)]">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <span className="text-[11px] font-bold text-[var(--color-ink-soft)] uppercase tracking-widest">Network Active</span>
            </div>
            <h1 className="font-serif text-[42px] sm:text-[52px] text-[var(--color-ink)] leading-none tracking-tight">
              Dashboard
            </h1>
            <p className="text-[var(--color-ink-soft)] text-[16px] sm:text-[18px] max-w-lg leading-relaxed">
              Manage your companions and their biometric safety profiles.
            </p>
          </div>
          <Link 
            to="/pets/new" 
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[var(--color-ink)] hover:bg-[#2A2723] text-white rounded-full font-bold text-[14px] uppercase tracking-wide shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-background)] focus:ring-[var(--color-ink)]"
          >
            <Plus size={18} />
            Register Pet
          </Link>
        </header>

        {/* Active Alerts Banner */}
        {lostPets.length > 0 && (
          <div 
            className="mb-16 p-6 sm:p-8 rounded-[var(--radius-24)] bg-[var(--color-alert)]/10 border border-[var(--color-alert)]/20 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden"
            role="alert" 
            aria-live="polite"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-alert)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-14 h-14 rounded-full bg-[var(--color-alert)]/20 border border-[var(--color-alert)]/10 flex items-center justify-center shrink-0 mt-1 sm:mt-0 shadow-inner">
                <ShieldAlert className="text-[var(--color-alert)]" size={26} />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-[18px] font-bold text-[var(--color-alert)]">Active Missing Alert</h2>
                <p className="text-[var(--color-ink)] text-[15px] max-w-md leading-relaxed">
                  Your pet is currently reported as lost. The local SafePaws network has been notified.
                </p>
              </div>
            </div>
            <Link 
              to="/lost" 
              className="relative z-10 group flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 bg-[var(--color-alert)] hover:bg-[#9A3926] text-white font-bold text-[14px] uppercase tracking-wide rounded-full transition-all hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-alert)]"
            >
              Manage Alert
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="bg-[var(--color-surface)] rounded-[var(--radius-28)] p-12 sm:p-20 text-center border border-[var(--color-border)] shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-24)] flex items-center justify-center mb-8 shadow-inner shadow-[var(--color-ink)]/5">
              <Plus className="text-[var(--color-accent)]" size={40} />
            </div>
            <h2 className="font-serif text-[32px] text-[var(--color-ink)] mb-4">No pets registered yet</h2>
            <p className="text-[var(--color-ink-soft)] mb-10 max-w-md mx-auto text-[16px] leading-relaxed">
              Register your first pet to generate their biometric profile and secure them within the SafePaws network.
            </p>
            <Link 
              to="/pets/new" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[var(--color-accent)] text-white rounded-full font-bold text-[14px] uppercase tracking-wide hover:bg-[var(--color-accent-hover)] hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(226,129,31,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-surface)] focus:ring-[var(--color-accent)]"
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
                  <span className="w-3 h-px bg-[#B3452F]" />
                  <h2 id="lost-pets-heading" className="text-[13px] font-bold text-[#B3452F] uppercase tracking-[0.12em]">
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
                  <span className="w-3 h-px bg-[#63684B]" />
                  <h2 id="safe-pets-heading" className="text-[13px] font-bold text-[#63684B] uppercase tracking-[0.12em]">
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
