import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { PetCard } from '../components/PetCard';
import { initialPets } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <DashboardNav />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#241812]">Your Pets</h1>
          <p className="text-[#8B847B] mt-2">Manage your furry friends and their safety.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      </main>
    </div>
  );
}
