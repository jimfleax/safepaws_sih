import React, { useMemo } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { PetCard } from '../components/PetCard';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { Plus, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { pets, alerts } = usePetStore();

  const lostPets = useMemo(() => pets.filter(p => p.status === 'lost'), [pets]);
  const safePets = useMemo(() => pets.filter(p => p.status !== 'lost'), [pets]);
  const activeAlerts = useMemo(() => alerts.filter(a => a.status === 'active'), [alerts]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:pb-8 pb-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-brand-dark">Your Pets</h1>
            <p className="text-[#8B847B] mt-2">Manage your furry friends and their safety.</p>
          </div>
          <Link 
            to="/pets/new" 
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-orange text-white rounded-xl font-semibold hover:bg-[#C55A1F] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
          >
            <Plus size={20} />
            Register Pet
          </Link>
        </div>

        {activeAlerts.length > 0 && (
          <div className="mb-8 p-6 bg-alert-clay/10 border-2 border-alert-clay rounded-2xl" role="alert" aria-live="polite">
            <div className="flex items-start gap-4">
              <ShieldAlert className="text-alert-clay shrink-0 mt-1" size={28} />
              <div>
                <h2 className="text-xl font-bold text-alert-clay">Active Lost Pet Alerts</h2>
                <p className="text-brand-dark mt-1">
                  You have active alerts. The community is looking for your pet.
                </p>
              </div>
            </div>
          </div>
        )}

        {pets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E8E0D5] flex flex-col items-center">
            <div className="w-24 h-24 bg-safe-neutral rounded-full flex items-center justify-center mb-6">
              <Plus className="text-brand-orange" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-brand-dark mb-2">No pets yet</h2>
            <p className="text-[#8B847B] mb-8 max-w-md mx-auto">
              Register your first pet to generate their biometric profile and secure them with SafePaws.
            </p>
            <Link 
              to="/pets/new" 
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-orange text-white rounded-xl font-semibold hover:bg-[#C55A1F] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-orange"
            >
              Register your first pet
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {lostPets.length > 0 && (
              <section aria-labelledby="lost-pets-heading">
                <h2 id="lost-pets-heading" className="text-xl font-bold text-alert-clay mb-4 flex items-center gap-2">
                  <ShieldAlert size={20} />
                  Lost Pets
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lostPets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
              </section>
            )}

            {safePets.length > 0 && (
              <section aria-labelledby="safe-pets-heading">
                <h2 id="safe-pets-heading" className="text-xl font-bold text-brand-dark mb-4">Safe at Home</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
