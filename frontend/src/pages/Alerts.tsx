import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ShieldAlert, MapPin, Clock, Search, Heart, User, Plus, X } from 'lucide-react';
import { CommunitySighting } from '../types';

export default function Alerts() {
  const navigate = useNavigate();
  const { alerts, sightings, resolveAlert, addSighting } = usePetStore();
  
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [showSightingForm, setShowSightingForm] = useState(false);
  const [sightingText, setSightingText] = useState('');
  const [sightingLocation, setSightingLocation] = useState('');

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const resolvedAlerts = alerts.filter(a => a.status === 'resolved');

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);
  const alertSightings = sightings.filter(s => s.alertId === selectedAlertId);

  const handleSightingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertId || !sightingText || !sightingLocation) return;
    
    const newSighting: CommunitySighting = {
      id: `sight-${Date.now()}`,
      alertId: selectedAlertId,
      reporterName: 'Good Samaritan',
      location: sightingLocation,
      time: 'Just now',
      notes: sightingText,
      confirmed: true,
    };
    addSighting(newSighting);
    setSightingText('');
    setSightingLocation('');
    setShowSightingForm(false);
  };

  const handleResolve = () => {
    if (!selectedAlertId) return;
    resolveAlert(selectedAlertId);
    setSelectedAlertId(null);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row pb-20 md:pb-0">
      <DashboardNav />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[var(--color-ink)] flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-[var(--color-alert-clay)]" />
            Neighborhood Radar
          </h1>
          <p className="text-[var(--color-ink-soft)] mt-2">
            Active lost pet alerts in your community. Every pair of eyes helps.
          </p>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[var(--color-border)] flex flex-col items-center">
            <div className="w-20 h-20 bg-[var(--color-bone)] rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-[var(--color-success)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--color-ink)] mb-2">No Active Alerts</h2>
            <p className="text-[var(--color-ink-soft)]">The neighborhood is safe. All known pets are home.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* List View */}
            <div className="space-y-4">
              {activeAlerts.map(alert => (
                <button
                  key={alert.id}
                  onClick={() => setSelectedAlertId(alert.id)}
                  className={`w-full text-left bg-white rounded-2xl p-5 transition-all border ${
                    selectedAlertId === alert.id 
                      ? 'border-[var(--color-alert-clay)] shadow-[0_4px_20px_rgba(179,69,47,0.15)] ring-2 ring-[var(--color-alert-clay)]/20' 
                      : 'border-[var(--color-border)] shadow-sm hover:border-[var(--color-alert-clay)]/50'
                  }`}
                >
                  <div className="flex gap-4">
                    <img 
                      src={alert.photoUrl} 
                      alt={alert.petName} 
                      className="w-20 h-20 rounded-xl object-cover border border-[var(--color-alert-clay)]/20" 
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-[var(--color-ink)]">{alert.petName}</h3>
                          <span className="text-xs font-medium text-[var(--color-ink-soft)]">{alert.breed}</span>
                        </div>
                        <span className="px-2 py-1 bg-[var(--color-alert-clay)]/10 text-[var(--color-alert-clay)] text-[10px] font-bold uppercase tracking-wider rounded-full">
                          Missing
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-[var(--color-ink-soft)]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="truncate">{alert.lastSeenAddress}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{alert.timeAgo}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Detail View */}
            <div className="hidden lg:block relative">
              <AnimatePresence mode="wait">
                {selectedAlert ? (
                  <motion.div
                    key={selectedAlert.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="sticky top-10 bg-white rounded-3xl border-2 border-[var(--color-alert-clay)] overflow-hidden shadow-lg"
                  >
                    <div className="relative h-64 bg-black">
                      <img src={selectedAlert.photoUrl} alt={selectedAlert.petName} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-alert-clay)]/90 via-[var(--color-alert-clay)]/20 to-transparent" />
                      <div className="absolute bottom-6 left-6 text-white">
                        <h2 className="font-serif text-4xl font-bold">{selectedAlert.petName}</h2>
                        <div className="flex items-center gap-2 mt-2 text-sm font-medium">
                          <Search className="w-4 h-4" />
                          Active Search in Progress
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <p className="text-sm text-[var(--color-ink)] leading-relaxed bg-[var(--color-bone)] p-4 rounded-xl border border-[var(--color-border)]">
                        "{selectedAlert.description}"
                      </p>

                      <div>
                        <h4 className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-3">Community Sightings</h4>
                        <div className="space-y-3">
                          {alertSightings.length === 0 ? (
                            <p className="text-sm text-[var(--color-ink-soft)] italic">No sightings reported yet.</p>
                          ) : (
                            alertSightings.map(s => (
                              <div key={s.id} className="flex gap-3 bg-[var(--color-bone)]/50 p-3 rounded-xl border border-[var(--color-border)]">
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-[var(--color-border)]">
                                  <User className="w-4 h-4 text-[var(--color-ink-soft)]" />
                                </div>
                                <div className="text-sm">
                                  <div className="font-bold text-[var(--color-ink)]">{s.reporterName}</div>
                                  <div className="text-[var(--color-ink-soft)] text-xs mt-0.5">{s.location} · {s.time}</div>
                                  <div className="mt-1">{s.notes}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      <div className="pt-4 space-y-3">
                        {!showSightingForm ? (
                          <button
                            onClick={() => setShowSightingForm(true)}
                            className="w-full py-3.5 rounded-xl border-2 border-[var(--color-alert-clay)] text-[var(--color-alert-clay)] font-bold flex items-center justify-center gap-2 hover:bg-[var(--color-alert-clay)] hover:text-white transition-colors cursor-pointer"
                          >
                            <MapPin className="w-5 h-5" />
                            Report Sighting
                          </button>
                        ) : (
                          <form onSubmit={handleSightingSubmit} className="space-y-3 bg-[var(--color-bone)] p-4 rounded-xl border border-[var(--color-border)]">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-bold text-sm text-[var(--color-ink)]">Submit Details</h4>
                              <button type="button" onClick={() => setShowSightingForm(false)} className="text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] cursor-pointer"><X className="w-4 h-4" /></button>
                            </div>
                            <input 
                              type="text" 
                              required
                              placeholder="Where did you see them?" 
                              className="w-full p-2.5 rounded-lg border border-[var(--color-border)] text-sm"
                              value={sightingLocation}
                              onChange={e => setSightingLocation(e.target.value)}
                            />
                            <textarea 
                              required
                              placeholder="Any additional details?" 
                              className="w-full p-2.5 rounded-lg border border-[var(--color-border)] text-sm h-20 resize-none"
                              value={sightingText}
                              onChange={e => setSightingText(e.target.value)}
                            />
                            <button type="submit" className="w-full py-2.5 bg-[var(--color-alert-clay)] text-white font-bold rounded-lg text-sm cursor-pointer">
                              Submit Sighting
                            </button>
                          </form>
                        )}
                        <button
                          onClick={handleResolve}
                          className="w-full py-3.5 rounded-xl bg-[var(--color-success)] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#2E9447] transition-colors cursor-pointer"
                        >
                          <Heart className="w-5 h-5" />
                          Mark as Found / Resolve
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center text-[var(--color-ink-soft)] border-2 border-dashed border-[var(--color-border)] rounded-3xl">
                    <ShieldAlert className="w-12 h-12 mb-4 opacity-20" />
                    <p className="font-medium">Select an alert to view details</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

      </main>

      {/* Mobile Modal for selected alert details */}
      <AnimatePresence>
        {selectedAlertId && selectedAlert && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              <div className="relative h-48 bg-black shrink-0">
                <img src={selectedAlert.photoUrl} alt={selectedAlert.petName} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-alert-clay)]/90 via-[var(--color-alert-clay)]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="font-serif text-3xl font-bold">{selectedAlert.petName}</h2>
                </div>
                <button 
                  onClick={() => setSelectedAlertId(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-5 space-y-5 flex-1">
                <p className="text-sm text-[var(--color-ink)] bg-[var(--color-bone)] p-4 rounded-xl">
                  "{selectedAlert.description}"
                </p>

                <div>
                  <h4 className="text-xs font-bold text-[var(--color-ink-soft)] uppercase tracking-wider mb-3">Community Sightings</h4>
                  <div className="space-y-3">
                    {alertSightings.length === 0 ? (
                      <p className="text-sm text-[var(--color-ink-soft)] italic">No sightings reported yet.</p>
                    ) : (
                      alertSightings.map(s => (
                        <div key={s.id} className="flex gap-3 bg-[var(--color-bone)]/50 p-3 rounded-xl">
                          <div className="text-sm">
                            <div className="font-bold">{s.reporterName}</div>
                            <div className="text-[var(--color-ink-soft)] text-xs mt-0.5">{s.location} · {s.time}</div>
                            <div className="mt-1">{s.notes}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  {!showSightingForm ? (
                    <button
                      onClick={() => setShowSightingForm(true)}
                      className="w-full py-3 rounded-xl border-2 border-[var(--color-alert-clay)] text-[var(--color-alert-clay)] font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      Report Sighting
                    </button>
                  ) : (
                    <form onSubmit={handleSightingSubmit} className="space-y-3 bg-[var(--color-bone)] p-4 rounded-xl">
                      <input 
                        type="text" 
                        required
                        placeholder="Where did you see them?" 
                        className="w-full p-2.5 rounded-lg border border-[var(--color-border)] text-sm"
                        value={sightingLocation}
                        onChange={e => setSightingLocation(e.target.value)}
                      />
                      <textarea 
                        required
                        placeholder="Additional details?" 
                        className="w-full p-2.5 rounded-lg border border-[var(--color-border)] text-sm h-16 resize-none"
                        value={sightingText}
                        onChange={e => setSightingText(e.target.value)}
                      />
                      <button type="submit" className="w-full py-2.5 bg-[var(--color-alert-clay)] text-white font-bold rounded-lg text-sm cursor-pointer">Submit Sighting</button>
                    </form>
                  )}
                  <button
                    onClick={handleResolve}
                    className="w-full py-3 rounded-xl bg-[var(--color-success)] text-white font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Heart className="w-4 h-4" />
                    Mark Found
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
