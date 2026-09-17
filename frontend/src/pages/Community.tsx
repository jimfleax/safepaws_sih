import React, { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Users, Heart, MapPin, Eye, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlertCard } from '../components/AlertCard';

export default function Community() {
  const { alerts, sightings } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const [activeTab, setActiveTab] = useState<'alerts' | 'sightings'>('alerts');

  return (
    <div className="min-h-screen bg-[#F6F1E7] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-12 md:pb-12 pb-32">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-[36px] sm:text-[44px] text-[#1C1A17] leading-tight tracking-tight mb-2">
            Recovery Network
          </h1>
          <p className="text-[#63684B] text-[16px]">Coordinate with neighbors and track community sightings.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-[1.5rem] p-8 border border-[#E5E0D8] shadow-sm flex flex-col items-start gap-4 transition-transform hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-full bg-[#E2811F]/10 flex items-center justify-center shrink-0">
              <Users className="text-[#E2811F]" size={22} />
            </div>
            <div>
              <p className="font-serif text-[32px] text-[#1C1A17] leading-none mb-1">1,248</p>
              <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#63684B]">Local Members</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-8 border border-[#E5E0D8] shadow-sm flex flex-col items-start gap-4 transition-transform hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-full bg-[#4C7A52]/10 flex items-center justify-center shrink-0">
              <Heart className="text-[#4C7A52]" size={22} />
            </div>
            <div>
              <p className="font-serif text-[32px] text-[#1C1A17] leading-none mb-1">142</p>
              <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#63684B]">Pets Reunited</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-8 border border-[#B3452F]/30 shadow-[0_4px_16px_rgba(179,69,47,0.06)] flex flex-col items-start gap-4 transition-transform hover:-translate-y-0.5">
            <div className="w-12 h-12 rounded-full bg-[#B3452F]/10 flex items-center justify-center shrink-0">
              <Eye size={22} className="text-[#B3452F]" />
            </div>
            <div>
              <p className="font-serif text-[32px] text-[#B3452F] leading-none mb-1">{activeAlerts.length}</p>
              <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#B3452F]">Active Alerts</p>
            </div>
          </div>
        </div>

        {/* Filters / Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-[#E5E0D8] gap-4">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('alerts')} 
              className={`pb-4 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors relative ${
                activeTab === 'alerts' ? 'text-[#B3452F]' : 'text-[#63684B] hover:text-[#1C1A17]'
              }`}
            >
              Missing Pets
              {activeTab === 'alerts' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#B3452F]" />}
            </button>
            <button 
              onClick={() => setActiveTab('sightings')} 
              className={`pb-4 text-[13px] font-bold uppercase tracking-[0.12em] transition-colors relative ${
                activeTab === 'sightings' ? 'text-[#E2811F]' : 'text-[#63684B] hover:text-[#1C1A17]'
              }`}
            >
              Community Sightings
              {activeTab === 'sightings' && <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#E2811F]" />}
            </button>
          </div>
          
          <div className="pb-4">
            <Link to="/sightings/new" className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#1C1A17] hover:text-[#E2811F] transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-[#E5E0D8]">
              <Filter size={14} />
              Report Sighting
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[400px]">
          
          {/* Active Alerts View */}
          {activeTab === 'alerts' && (
            <>
              {activeAlerts.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-[#E5E0D8] shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F6F1E7] rounded-full flex items-center justify-center mb-4">
                    <Heart className="text-[#4C7A52]" size={32} />
                  </div>
                  <h3 className="font-serif text-[28px] text-[#1C1A17] mb-2">No active alerts</h3>
                  <p className="text-[#63684B] text-[15px]">The neighborhood is currently safe. No pets are reported missing.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {activeAlerts.map(alert => (
                    <AlertCard key={alert.id} alert={alert} />
                  ))}
                </div>
              )}
            </>
          )}

          {/* Sightings View */}
          {activeTab === 'sightings' && (
            <>
              {sightings.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-16 text-center border border-[#E5E0D8] shadow-sm flex flex-col items-center">
                  <div className="w-20 h-20 bg-[#F6F1E7] rounded-full flex items-center justify-center mb-4">
                    <MapPin className="text-[#63684B]" size={32} />
                  </div>
                  <h3 className="font-serif text-[28px] text-[#1C1A17] mb-2">No recent sightings</h3>
                  <p className="text-[#63684B] text-[15px]">Community members haven't reported any stray sightings recently.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sightings.map(sighting => (
                    <div key={sighting.id} className="bg-white p-6 sm:p-8 rounded-[1.5rem] border border-[#E5E0D8] shadow-sm transition-shadow hover:shadow-md flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div className="font-bold text-[#1C1A17] text-[16px]">{sighting.reporterName}</div>
                          <div className="text-[13px] font-medium text-[#63684B] bg-[#F6F1E7] px-3 py-1.5 rounded-full whitespace-nowrap ml-4">
                            {sighting.time}
                          </div>
                        </div>
                        <div className="flex items-start gap-2 mb-5 text-[15px] text-[#1C1A17]">
                          <MapPin size={18} className="text-[#E2811F] mt-0.5 shrink-0" />
                          <span className="leading-tight">{sighting.location}</span>
                        </div>
                        <div className="bg-[#F6F1E7]/50 p-5 rounded-xl border border-[#E5E0D8]/50 mb-5">
                          <p className="text-[#63684B] text-[15px] leading-relaxed italic">"{sighting.notes}"</p>
                        </div>
                      </div>
                      
                      {sighting.alertId ? (
                        <Link 
                          to={`/alerts/${sighting.alertId}`} 
                          className="inline-flex items-center justify-center w-full py-3 gap-1.5 text-[13px] font-bold tracking-wider uppercase text-[#B3452F] bg-[#B3452F]/10 hover:bg-[#B3452F] hover:text-white rounded-xl transition-colors"
                        >
                          View Related Missing Alert 
                          <span aria-hidden="true">→</span>
                        </Link>
                      ) : (
                        <div className="w-full py-3 text-center text-[13px] font-bold tracking-wider uppercase text-[#63684B] bg-[#F6F1E7] rounded-xl">
                          Unmatched Sighting
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}
