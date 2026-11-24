import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { Check, MapPin, Bell, Eye, Sparkles, MessageSquare, Shield } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const PREFERENCES = [
  { 
    id: 'lost-found', 
    label: 'Lost & Found Alerts', 
    icon: <Bell className="w-5 h-5 shrink-0" />, 
    desc: 'Emergency declarations, missing pet search corridors, and beacon dispatches.' 
  },
  { 
    id: 'sightings', 
    label: 'Field Observations & Sightings', 
    icon: <Eye className="w-5 h-5 shrink-0" />, 
    desc: 'Timestamped citizen reports of wandering companions and roaming animals.' 
  },
  { 
    id: 'general', 
    label: 'General Neighborhood Network', 
    icon: <MessageSquare className="w-5 h-5 shrink-0" />, 
    desc: 'Local pet care advice, clinic recommendations, foster coordination, and community notes.' 
  },
  { 
    id: 'reunion-stories', 
    label: 'Reunion Stories & Case Archives', 
    icon: <Sparkles className="w-5 h-5 shrink-0" />, 
    desc: 'Confirmed recoveries, closed incident chronicles, and civic guardian milestones.' 
  }
];

export default function CommunityOnboarding() {
  const [selected, setSelected] = useState<string[]>(['lost-found', 'sightings']);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetch('/api/v1/community/preferences', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data.interests) && data.interests.length > 0) {
          // Filter out legacy channels like 'urgent' to match canonical 4
          const valid = data.interests.filter((i: string) => 
            PREFERENCES.some(p => p.id === i)
          );
          if (valid.length > 0) setSelected(valid);
        }
      })
      .catch(() => {});
  }, []);

  const toggleInterest = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleInterest(id);
    }
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
      navigate('/community?channel=lost-found');
    }
  };

  // Truth in engineering: Dynamic neighborhood with neutral fallback (eliminating hardcoded Connaught Place)
  const neighborhoodDisplay = user?.neighborhood 
    ? `${user.neighborhood} recovery corridor` 
    : 'local neighborhood safety network';

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col font-sans">
      <DashboardNav />
      
      <main id="main-content" tabIndex={-1} className="outline-none flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:py-16 flex flex-col">
        <div className="bg-white border border-[var(--color-border)] rounded-sm p-6 sm:p-10 shadow-xs relative">
          
          {/* Municipal Field Header */}
          <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[var(--color-bone)] border border-[var(--color-border)] text-[var(--color-ink-soft)] text-[10px] font-mono font-bold tracking-widest uppercase rounded-sm">
                  <Shield className="w-3 h-3 text-[var(--color-trail)]" />
                  MUNICIPAL GUILD ENLISTMENT
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--color-ink)] tracking-tight">
                Neighborhood Dispatch Channels
              </h1>
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed mt-2 max-w-xl">
                Welcome, {user?.name || 'Guardian'}. Select which telemetry channels to track in the {neighborhoodDisplay}. You can adjust these preferences at any time.
              </p>
            </div>
          </div>

          {/* Preference Cards — 4 Canonical Channels */}
          <div className="space-y-3 mb-8" role="group" aria-label="Community Channel Preferences">
            {PREFERENCES.map(pref => {
              const isSelected = selected.includes(pref.id);
              return (
                <div
                  key={pref.id}
                  role="checkbox"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onClick={() => toggleInterest(pref.id)}
                  onKeyDown={(e) => handleKeyDown(e, pref.id)}
                  className={`w-full flex items-start p-4 sm:p-5 rounded-sm border text-left transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bone)] ${
                    isSelected 
                      ? 'border-[var(--color-accent-text)] bg-[var(--color-marigold)]/5 shadow-xs' 
                      : 'border-[var(--color-border)] hover:bg-[var(--color-bone)]/50'
                  }`}
                >
                  {/* Icon Badge: ERR-C-01 REMEDIATION — Carbon Ink on Marigold yields 6.11:1 PASS */}
                  <div className={`mt-0.5 mr-4 p-2.5 rounded-sm transition-colors ${
                    isSelected 
                      ? 'bg-[var(--color-marigold)] text-[#1C1A17]' 
                      : 'bg-[var(--color-bone)] text-[var(--color-ink-soft)]'
                  }`}>
                    {pref.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0 pr-2">
                    <h2 className="font-bold text-sm sm:text-base text-[var(--color-ink)] mb-1 flex items-center gap-2">
                      <span>{pref.label}</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[var(--color-ink-soft)] leading-relaxed">
                      {pref.desc}
                    </p>
                  </div>
                  
                  {/* Checkbox Indicator: ERR-C-01 REMEDIATION — Carbon Ink on Marigold yields 6.11:1 PASS */}
                  <div className={`w-6 h-6 rounded-sm border-2 flex items-center justify-center shrink-0 ml-2 mt-1 transition-colors ${
                    isSelected 
                      ? 'border-[#1C1A17] bg-[var(--color-marigold)] text-[#1C1A17]' 
                      : 'border-[var(--color-border)] bg-white'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Row — Standardized Touch Targets >= 44px (48px mobile) */}
          <div className="flex items-center justify-between pt-6 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => navigate('/community')}
              className="min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] px-4 inline-flex items-center justify-center text-xs font-mono font-bold tracking-wider uppercase text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
            >
              Skip for now
            </button>
            
            {/* Primary Action Button: ERR-C-01 REMEDIATION — Carbon Ink on Marigold yields 6.11:1 PASS */}
            <button
              type="button"
              onClick={handleComplete}
              disabled={submitting}
              className="min-h-[48px] min-w-[48px] sm:min-h-[44px] px-8 py-3 bg-[var(--color-marigold)] text-[#1C1A17] text-xs font-mono font-bold tracking-wider uppercase rounded-sm hover:bg-[var(--color-accent-hover)] active:translate-y-[1px] transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>{submitting ? 'Enlisting...' : 'Enlist In Guild'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
