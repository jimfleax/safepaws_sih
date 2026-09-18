import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ApiClient } from '../utils/apiClient';
import { Eye, MapPin } from 'lucide-react';

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
      // Connect to API Client
      await ApiClient.reportSighting({
        reporterName,
        location: sightingLocation,
        notes,
        alertId: alertId || undefined
      });
      
      // Also update local store
      await usePetStore.getState().hydrate();
      
      if (alertId) {
        navigate(`/alerts/${alertId}`);
      } else {
        navigate('/community');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit sighting');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-8 md:pb-8 pb-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A0A0A]">Report a Sighting</h1>
          <p className="text-[#8A8175] mt-2">Have you seen a lost pet? Let the community know immediately.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl text-white font-medium" style={{ backgroundColor: 'var(--color-alert-clay)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E0D8] p-6 space-y-6">
          <div>
            <label htmlFor="alertId" className="block text-sm font-semibold text-[#0A0A0A] mb-2">Related Alert (Optional)</label>
            <select
              id="alertId"
              value={alertId}
              onChange={(e) => setAlertId(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
            >
              <option value="">-- No specific alert / I'm not sure --</option>
              {activeAlerts.map(alert => (
                <option key={alert.id} value={alert.id}>{alert.petName} ({alert.breed})</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="reporterName" className="block text-sm font-semibold text-[#0A0A0A] mb-2">Your Name</label>
            <input
              type="text"
              id="reporterName"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="sightingLocation" className="block text-sm font-semibold text-[#0A0A0A] mb-2">Location Seen</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A8175]" size={20} />
              <input
                type="text"
                id="sightingLocation"
                value={sightingLocation}
                onChange={(e) => setSightingLocation(e.target.value)}
                placeholder="Where did you see the pet?"
                className="w-full pl-12 pr-4 py-3 bg-[#FAF6F0] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE6828]"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-semibold text-[#0A0A0A] mb-2">Details / Notes</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe what you saw. Direction they were heading, behavior, collar color, etc."
              rows={5}
              className="w-full px-4 py-3 bg-[#FAF6F0] border border-[#E5E0D8] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#DE6828] resize-none"
              required
            ></textarea>
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#DE6828] text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-[#C55A1F] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DE6828] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Eye size={20} />
              {isSubmitting ? 'Submitting...' : 'Submit Sighting'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
