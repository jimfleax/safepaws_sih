import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { ShieldAlert, MapPin, Clock, Users, ArrowLeft, CheckCircle } from 'lucide-react';

export default function AlertDetail() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { alerts, sightings, resolveAlert } = usePetStore();
  
  const alert = alerts.find(a => a.id === alertId);
  const alertSightings = sightings.filter(s => s.alertId === alertId);
  
  if (!alert) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
        <DashboardNav />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0A0A0A]">Alert not found</h2>
            <button onClick={() => navigate('/lost')} className="mt-4 text-[#DE6828] font-semibold underline">Back to Lost Dogs</button>
          </div>
        </main>
      </div>
    );
  }

  const handleResolve = async () => {
    try {
      const { ApiClient } = await import('../utils/apiClient');
      await ApiClient.resolveAlert(alert.id);
      await usePetStore.getState().hydrate();
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to resolve alert', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8 md:pb-8 pb-28">
        <Link to="/lost" className="inline-flex items-center gap-2 text-[#8A8175] hover:text-[#0A0A0A] transition-colors mb-6 font-medium">
          <ArrowLeft size={20} />
          Back to Alerts
        </Link>
        
        {alert.status === 'active' && (
          <div 
            className="p-6 rounded-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4" 
            style={{ 
              backgroundColor: 'color-mix(in srgb, var(--color-alert-clay) 10%, transparent)',
              border: '2px solid var(--color-alert-clay)'
            }}
          >
            <div className="flex items-center gap-4">
              <ShieldAlert size={32} style={{ color: 'var(--color-alert-clay)' }} className="shrink-0" />
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--color-alert-clay)' }}>Active Alert: {alert.petName}</h1>
                <p className="text-[#0A0A0A] mt-1">{alert.notifiedNeighborsCount} neighbors notified within {alert.broadcastRadiusKm}km radius</p>
              </div>
            </div>
            <button 
              onClick={handleResolve}
              className="px-6 py-3 bg-white font-bold rounded-xl whitespace-nowrap hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center gap-2"
              style={{ color: 'var(--color-alert-clay)' }}
            >
              <CheckCircle size={20} />
              Mark as Found
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-[#E5E0D8] overflow-hidden">
              <div className="h-80 relative">
                <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-[#E5E0D8]">
                  <div className="flex items-center gap-2">
                    <Clock className="text-[#8A8175]" size={20} />
                    <div>
                      <p className="text-sm text-[#8A8175] font-medium">Lost</p>
                      <p className="font-semibold text-[#0A0A0A]">{alert.timeAgo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#8A8175]" size={20} />
                    <div>
                      <p className="text-sm text-[#8A8175] font-medium">Last Seen</p>
                      <p className="font-semibold text-[#0A0A0A]">{alert.lastSeenAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="text-[#8A8175]" size={20} />
                    <div>
                      <p className="text-sm text-[#8A8175] font-medium">Breed</p>
                      <p className="font-semibold text-[#0A0A0A]">{alert.breed}</p>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#0A0A0A] mb-3">Description & Additional Details</h3>
                <p className="text-[#0A0A0A] leading-relaxed whitespace-pre-wrap">{alert.description}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#0A0A0A]">Sightings ({alertSightings.length})</h3>
                <Link to="/sightings/new" className="text-sm font-semibold text-[#DE6828] hover:underline">
                  Report Sighting
                </Link>
              </div>
              
              {alertSightings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[#8A8175]">No sightings reported yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {alertSightings.map(sighting => (
                    <div key={sighting.id} className="p-4 border border-[#E5E0D8] rounded-xl bg-[#FAF6F0]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-[#0A0A0A]">{sighting.reporterName}</span>
                        <span className="text-xs text-[#8A8175] font-medium">{sighting.time}</span>
                      </div>
                      <div className="flex items-start gap-2 mb-2 text-sm text-[#0A0A0A] font-medium">
                        <MapPin size={16} className="text-[#DE6828] shrink-0 mt-0.5" />
                        <span>{sighting.location}</span>
                      </div>
                      <p className="text-sm text-[#8A8175] italic">"{sighting.notes}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {alert.status === 'active' && (
              <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 text-center">
                <h3 className="font-bold text-[#0A0A0A] mb-2">Have information?</h3>
                <p className="text-sm text-[#8A8175] mb-4">If you have seen this pet, please report a sighting immediately.</p>
                <Link 
                  to="/sightings/new" 
                  className="block w-full py-3 rounded-xl font-bold text-white text-center hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--color-alert-clay)' }}
                >
                  Report Sighting
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
