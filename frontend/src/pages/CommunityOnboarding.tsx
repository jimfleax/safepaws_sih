import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { Check } from 'lucide-react';

const INTERESTS = [
  "Lost & Found",
  "Sightings",
  "Pet Care",
  "Rescue",
  "Adoption",
  "Local Alerts"
];

export default function CommunityOnboarding() {
  const [selected, setSelected] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    if (selected.includes(interest)) {
      setSelected(selected.filter(i => i !== interest));
    } else {
      setSelected([...selected, interest]);
    }
  };

  const handleComplete = () => {
    // In a full implementation, call apiClient.updatePreferences({ interests: selected })
    navigate('/community');
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12 md:py-20 flex flex-col justify-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Welcome to Community</h1>
        <p className="text-xl text-[var(--color-ink-soft)] leading-relaxed mb-12">
          Select your interests so we can prioritize the most relevant alerts and topics for your neighborhood.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
          {INTERESTS.map(interest => {
            const isSelected = selected.includes(interest);
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`p-6 text-left border flex items-center justify-between transition-colors ${
                  isSelected 
                    ? 'border-[var(--color-ink)] bg-[var(--color-ink)]/5' 
                    : 'border-[var(--color-ink)]/20 hover:border-[var(--color-ink)]/50'
                }`}
              >
                <span className="font-bold uppercase tracking-widest text-sm">{interest}</span>
                <div className={`w-6 h-6 border flex items-center justify-center ${
                  isSelected ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-bone)]' : 'border-[var(--color-ink)]/30'
                }`}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </button>
            )
          })}
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleComplete}
            className="px-8 py-4 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity"
          >
            Continue to Community
          </button>
        </div>
      </main>
    </div>
  );
}
