import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Users, Heart, MapPin, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Community() {
  const { alerts, sightings } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const recentSightings = sightings.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 md:pb-8 pb-28">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0A0A0A]">Community</h1>
          <p className="text-[#8A8175] mt-2">Connect with neighbors and help keep local pets safe.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <Users className="text-[#DE6828]" size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0A0A0A]">1,248</p>
              <p className="text-sm font-medium text-[#8A8175]">Local Members</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <Heart className="text-[#3A6D4F]" size={28} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0A0A0A]">142</p>
              <p className="text-sm font-medium text-[#8A8175]">Pets Reunited</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-[#E5E0D8] flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'color-mix(in srgb, var(--color-alert-clay) 10%, transparent)' }}>
              <Eye size={28} style={{ color: 'var(--color-alert-clay)' }} />
            </div>
            <div>
              <p className="text-3xl font-bold text-[#0A0A0A]">{activeAlerts.length}</p>
              <p className="text-sm font-medium text-[#8A8175]">Active Alerts</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0A0A0A]">Recent Sightings</h2>
              <Link to="/sightings/new" className="text-sm font-bold text-[#DE6828] hover:underline">Report Sighting</Link>
            </div>
            
            {recentSightings.length === 0 ? (
              <div className="bg-white p-8 rounded-2xl border border-[#E5E0D8] text-center">
                <p className="text-[#8A8175]">No recent sightings in your area.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSightings.map(sighting => (
                  <div key={sighting.id} className="bg-white p-5 rounded-2xl border border-[#E5E0D8]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-[#0A0A0A]">{sighting.reporterName}</div>
                      <div className="text-xs font-medium text-[#8A8175]">{sighting.time}</div>
                    </div>
                    <div className="flex items-start gap-2 mb-3 text-sm font-medium text-[#0A0A0A]">
                      <MapPin size={16} className="text-[#DE6828] mt-0.5 shrink-0" />
                      <span>{sighting.location}</span>
                    </div>
                    <p className="text-[#8A8175] text-sm italic">"{sighting.notes}"</p>
                    {sighting.alertId && (
                      <Link to={`/alerts/${sighting.alertId}`} className="inline-block mt-3 text-xs font-bold text-[#DE6828] hover:underline">
                        View Related Alert →
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-6">Community Board</h2>
            <div className="bg-white rounded-2xl border border-[#E5E0D8] p-8 text-center h-[300px] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-[#FAF6F0] rounded-full flex items-center justify-center mb-4">
                <Users className="text-[#DE6828]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0A0A0A] mb-2">Join the conversation</h3>
              <p className="text-[#8A8175] max-w-sm mx-auto">
                Share tips, ask for recommendations, or organize local dog walking groups. Coming soon!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
