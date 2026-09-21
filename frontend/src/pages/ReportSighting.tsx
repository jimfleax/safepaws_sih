import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ApiClient } from '../utils/apiClient';
import { Eye, MapPin, ArrowLeft, AlertTriangle } from 'lucide-react';

export default function ReportSighting() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const defaultAlertId = searchParams.get('alertId') || '';
  
  const { alerts, addSighting } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  
  const [alertId, setAlertId] = useState(defaultAlertId);
  const [reporterName, setReporterName] = useState('');
  const [sightingLocation, setSightingLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const serverSighting = await ApiClient.reportSighting({
        reporterName,
        location: sightingLocation,
        notes,
        alertId: alertId || undefined
      });
      
      // Hydrate the store so it has the latest sightings from the server
      await usePetStore.getState().hydrate();
      
      if (serverSighting.alert_id) {
        navigate(`/alerts/${serverSighting.alert_id}`);
      } else {
        navigate('/community');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit sighting');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 md:py-20 md:pb-12 pb-28">
        <Link to={defaultAlertId ? `/alerts/${defaultAlertId}` : "/community"} className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-12">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
          Back
        </Link>

        <header className="mb-12 border-b border-[var(--color-ink)]/10 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-[var(--color-ink)]">
            Report a Sighting
          </h1>
          <p className="text-xl text-[var(--color-ink-soft)] leading-relaxed max-w-2xl">
            Your observation could be the missing piece in a family's search. Please provide clear, actionable details.
          </p>
        </header>
        
        {error && (
          <div className="mb-8 p-6 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-ink)] flex gap-4 animate-in fade-in">
            <AlertTriangle size={24} className="text-[var(--color-alert-clay)] shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in duration-700 delay-150 fill-mode-both ease-out max-w-3xl">
          <div className="space-y-3">
            <label htmlFor="alertId" className="block text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
              Subject Alert (Optional)
            </label>
            <div className="relative">
              <select
                id="alertId"
                value={alertId}
                onChange={(e) => setAlertId(e.target.value)}
                className="w-full px-5 py-4 bg-transparent border-2 border-[var(--color-ink)]/20 text-lg focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                disabled={isSubmitting}
              >
                <option value="">-- General / Unknown Pet --</option>
                {activeAlerts.map(alert => (
                  <option key={alert.id} value={alert.id}>{alert.petName} ({alert.breed})</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="reporterName" className="block text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
              Your Name
            </label>
            <input
              type="text"
              id="reporterName"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-5 py-4 bg-transparent border-2 border-[var(--color-ink)]/20 text-lg focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30"
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-3">
            <label htmlFor="sightingLocation" className="block text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
              Location Seen
            </label>
            <div className="relative">
              <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--color-alert-clay)]" size={24} />
              <input
                type="text"
                id="sightingLocation"
                value={sightingLocation}
                onChange={(e) => setSightingLocation(e.target.value)}
                placeholder="Where exactly did you see the pet?"
                className="w-full pl-16 pr-5 py-4 bg-transparent border-2 border-[var(--color-ink)]/20 text-lg focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30"
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <label htmlFor="notes" className="block text-sm font-bold uppercase tracking-widest text-[var(--color-ink)]">
              Observation Details
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe direction, behavior, collar color, or any distinctive marks..."
              rows={5}
              className="w-full px-5 py-4 bg-transparent border-2 border-[var(--color-ink)]/20 text-lg focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30 resize-none"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          
          <div className="pt-6 border-t border-[var(--color-ink)]/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-10 py-5 bg-[var(--color-alert-clay)] text-white font-bold text-[15px] uppercase tracking-wide rounded-full flex items-center justify-center gap-3 hover:bg-[#9A3926] transition-all hover:-translate-y-0.5 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bone)] focus:ring-[var(--color-alert-clay)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Eye size={22} />
              {isSubmitting ? 'Recording Sighting...' : 'Submit Sighting'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
