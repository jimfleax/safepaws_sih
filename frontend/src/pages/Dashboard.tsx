import React, { useMemo } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { PetCard } from '../components/PetCard';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const { pets, alerts } = usePetStore();

  const lostPets = useMemo(() => pets.filter(p => p.status === 'lost'), [pets]);
  const safePets = useMemo(() => pets.filter(p => p.status !== 'lost'), [pets]);
  const activeAlerts = useMemo(() => alerts.filter(a => a.status === 'active'), [alerts]);

  return (
    <div className="min-h-screen bg-[#F6F1E7] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-12 md:pb-12 pb-32">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="font-serif text-[36px] sm:text-[44px] text-[#1C1A17] leading-tight tracking-tight mb-2">
              Your Pets
            </h1>
            <p className="text-[#63684B] text-[16px]">Manage your companions and their safety profiles.</p>
          </div>
          <Link 
            to="/pets/new" 
            className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1C1A17] hover:bg-[#2A2723] text-white rounded-full font-semibold text-[14px] shadow-sm transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#F6F1E7] focus:ring-[#1C1A17]"
          >
            <Plus size={18} />
            Register Pet
          </Link>
        </div>

        {/* Active Alerts Banner */}
        {activeAlerts.length > 0 && (
          <div 
            className="mb-12 p-6 sm:p-8 rounded-[1.5rem] bg-[#B3452F]/10 border border-[#B3452F]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            role="alert" 
            aria-live="polite"
          >
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-full bg-[#B3452F]/20 flex items-center justify-center shrink-0 mt-1 sm:mt-0">
                <ShieldAlert className="text-[#B3452F]" size={24} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#B3452F] mb-1">Active Lost Pet Alerts</h2>
                <p className="text-[#1C1A17] text-[15px] max-w-md">
                  You have active alerts. The local SafePaws community is actively looking for your pet.
                </p>
              </div>
            </div>
            <Link 
              to="/lost" 
              className="group flex-shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-[#B3452F] hover:bg-[#9A3926] text-white font-semibold text-[14px] rounded-full transition-colors"
            >
              View Alerts
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {pets.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-12 sm:p-16 text-center border border-[#E5E0D8] shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-[#F6F1E7] rounded-full flex items-center justify-center mb-6">
              <Plus className="text-[#E2811F]" size={40} />
            </div>
            <h2 className="font-serif text-[28px] text-[#1C1A17] mb-3">No pets registered yet</h2>
            <p className="text-[#63684B] mb-8 max-w-md mx-auto text-[15px] leading-relaxed">
              Register your first pet to generate their biometric profile and secure them within the SafePaws network.
            </p>
            <Link 
              to="/pets/new" 
              className="inline-flex items-center justify-center px-8 py-4 bg-[#E2811F] text-white rounded-full font-semibold hover:bg-[#CA721A] hover:-translate-y-0.5 transition-all shadow-[0_4px_14px_rgba(226,129,31,0.25)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#E2811F]"
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
