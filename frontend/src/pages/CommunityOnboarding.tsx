import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { Check, MapPin, Bell, Shield, Heart } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const PREFERENCES = [
  { id: 'lost-found', label: 'Lost & Found Alerts', icon: <Bell size={20} />, desc: 'Get notified when a pet goes missing nearby.' },
  { id: 'sightings', label: 'Local Sightings', icon: <MapPin size={20} />, desc: 'Updates on wandering pets in your area.' },
  { id: 'urgent', label: 'Urgent Recovery', icon: <Shield size={20} />, desc: 'High-priority coordination for critical cases.' },
  { id: 'general', label: 'General Community', icon: <Heart size={20} />, desc: 'Local advice, vet recommendations, and chat.' }
];

export default function CommunityOnboarding() {
  const [selected, setSelected] = useState<string[]>(['lost-found', 'urgent']);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  React.useEffect(() => {
    fetch('/api/v1/community/preferences', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.interests) && data.interests.length > 0) {
          setSelected(data.interests);
        }
      })
      .catch(() => {});
  }, []);

  const toggleInterest = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/v1/community/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          interests: selected
        })
      });
    } catch (e) {
      console.error("Preferences error:", e);
    } finally {
      navigate('/community');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col font-sans">
      <DashboardNav />
      
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-12 md:py-20 flex flex-col">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 shadow-sm">
          
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <MapPin size={32} />
          </div>

          <h1 className="text-3xl font-black text-[var(--color-ink)] mb-3">Join Your Local Network</h1>
          <p className="text-lg text-[var(--color-ink-soft)] leading-relaxed mb-10">
            Welcome, {user?.name || 'Neighbor'}. How would you like to participate in the local Connaught Place recovery network? You can change this later.
          </p>

          <div className="space-y-3 mb-10">
            {PREFERENCES.map(pref => {
              const isSelected = selected.includes(pref.id);
              return (
                <button
                  key={pref.id}
                  onClick={() => toggleInterest(pref.id)}
                  className={`w-full flex items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected 
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' 
                      : 'border-[var(--color-border)] hover:border-gray-300'
                  }`}
                >
                  <div className={`mt-0.5 mr-4 p-2 rounded-lg ${isSelected ? 'bg-[var(--color-accent)] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {pref.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-base mb-1 ${isSelected ? 'text-[var(--color-ink)]' : 'text-[var(--color-ink)]'}`}>
                      {pref.label}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-soft)]">{pref.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-4 mt-2 transition-colors ${
                    isSelected ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && <Check size={14} strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
            <button
              onClick={() => navigate('/community')}
              className="text-sm font-bold text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors"
            >
              Skip for now
            </button>
            <button
              onClick={handleComplete}
              disabled={submitting}
              className="px-8 py-3 bg-[var(--color-accent)] text-white font-bold rounded-xl hover:bg-[var(--color-accent-hover)] transition-colors shadow-sm disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Join Network'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
