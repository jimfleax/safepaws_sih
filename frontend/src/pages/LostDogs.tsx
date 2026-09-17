import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Link } from 'react-router-dom';
import { ShieldAlert, MapPin, Search } from 'lucide-react';

export default function LostDogs() {
  const { alerts } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:pb-8 pb-28">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A0A0A]">Lost Pets</h1>
            <p className="text-[#8A8175] mt-2">Active alerts in your neighborhood.</p>
          </div>
          <Link 
            to="/lost/new" 
            style={{ backgroundColor: 'var(--color-alert-clay)' }}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-alert-clay"
          >
            <ShieldAlert size={20} />
            Report Lost Pet
          </Link>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#E5E0D8] flex flex-col items-center">
            <div className="w-24 h-24 bg-[#FAF6F0] rounded-full flex items-center justify-center mb-6">
              <Search className="text-[#DE6828]" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">No active alerts</h2>
            <p className="text-[#8A8175] mb-8 max-w-md mx-auto">
              There are currently no reported lost pets in your area. Keep your eyes peeled just in case!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAlerts.map(alert => (
              <Link 
                key={alert.id} 
                to={`/alerts/${alert.id}`}
                className="bg-white border rounded-2xl overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2"
                style={{ borderColor: 'var(--color-alert-clay)' }}
              >
                <div className="h-48 relative">
                  <img src={alert.photoUrl} alt={alert.petName} className="w-full h-full object-cover" />
                  <div 
                    className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold text-white flex items-center gap-1"
                    style={{ backgroundColor: 'var(--color-alert-clay)' }}
                  >
                    <ShieldAlert size={14} />
                    LOST
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[#0A0A0A] mb-1">{alert.petName}</h3>
                  <p className="text-sm text-[#8A8175] mb-4">{alert.breed}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#8A8175]">
                      <MapPin size={16} />
                      <span className="truncate">{alert.lastSeenAddress}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[#0A0A0A] line-clamp-2 mb-4">{alert.description}</p>
                  
                  <div className="pt-4 border-t border-[#E5E0D8] flex justify-between items-center text-sm">
                    <span className="text-[#8A8175] font-medium">{alert.timeAgo}</span>
                    <span className="font-semibold" style={{ color: 'var(--color-alert-clay)' }}>View Alert →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
