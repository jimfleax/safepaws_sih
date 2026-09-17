import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { Users, Heart, MapPin, Eye, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Community() {
  const { alerts, sightings } = usePetStore();
  const activeAlerts = alerts.filter(a => a.status === 'active');
  const recentSightings = sightings.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F6F1E7] flex flex-col md:flex-row">
      <DashboardNav />
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 md:py-12 md:pb-12 pb-32">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-[36px] sm:text-[44px] text-[#1C1A17] leading-tight tracking-tight mb-2">
            Community
          </h1>
          <p className="text-[#63684B] text-[16px]">Connect with neighbors and help keep local pets safe.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-[1.5rem] p-8 border border-[#E5E0D8] shadow-sm flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E2811F]/10 flex items-center justify-center shrink-0">
              <Users className="text-[#E2811F]" size={22} />
            </div>
            <div>
              <p className="font-serif text-[32px] text-[#1C1A17] leading-none mb-1">1,248</p>
              <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#63684B]">Local Members</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-8 border border-[#E5E0D8] shadow-sm flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4C7A52]/10 flex items-center justify-center shrink-0">
              <Heart className="text-[#4C7A52]" size={22} />
            </div>
            <div>
              <p className="font-serif text-[32px] text-[#1C1A17] leading-none mb-1">142</p>
              <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#63684B]">Pets Reunited</p>
            </div>
          </div>
          
          <div className="bg-white rounded-[1.5rem] p-8 border border-[#E5E0D8] shadow-sm flex flex-col items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#B3452F]/10 flex items-center justify-center shrink-0">
              <Eye size={22} className="text-[#B3452F]" />
            </div>
            <div>
              <p className="font-serif text-[32px] text-[#1C1A17] leading-none mb-1">{activeAlerts.length}</p>
              <p className="text-[13px] font-bold tracking-[0.08em] uppercase text-[#B3452F]">Active Alerts</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Sightings Feed */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-8 border-b border-[#E5E0D8] pb-4">
              <div className="flex items-center gap-3">
                <span className="w-3 h-px bg-[#63684B]" />
                <h2 className="text-[13px] font-bold text-[#63684B] uppercase tracking-[0.12em]">Recent Sightings</h2>
              </div>
              <Link to="/sightings/new" className="text-[14px] font-semibold text-[#E2811F] hover:text-[#C9721B] transition-colors">
                Report Sighting
              </Link>
            </div>
            
            {recentSightings.length === 0 ? (
              <div className="bg-white p-10 rounded-[1.5rem] border border-[#E5E0D8] text-center shadow-sm">
                <p className="text-[#63684B] text-[15px]">No recent sightings in your area.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {recentSightings.map(sighting => (
                  <div key={sighting.id} className="bg-white p-6 rounded-[1.5rem] border border-[#E5E0D8] shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex justify-between items-start mb-3">
                      <div className="font-bold text-[#1C1A17] text-[16px]">{sighting.reporterName}</div>
                      <div className="text-[13px] font-medium text-[#63684B] bg-[#F6F1E7] px-3 py-1 rounded-full">{sighting.time}</div>
                    </div>
                    <div className="flex items-start gap-2 mb-4 text-[14px] text-[#1C1A17]">
                      <MapPin size={16} className="text-[#E2811F] mt-0.5 shrink-0" />
                      <span>{sighting.location}</span>
                    </div>
                    <div className="bg-[#F6F1E7]/50 p-4 rounded-xl border border-[#E5E0D8]/50">
                      <p className="text-[#63684B] text-[14px] leading-relaxed italic">"{sighting.notes}"</p>
                    </div>
                    {sighting.alertId && (
                      <Link to={`/alerts/${sighting.alertId}`} className="inline-flex items-center gap-1.5 mt-4 text-[13px] font-bold tracking-wide uppercase text-[#B3452F] hover:text-[#9A3926] transition-colors">
                        View Related Alert 
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Community Board Promo */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-8 border-b border-[#E5E0D8] pb-4">
              <span className="w-3 h-px bg-[#63684B]" />
              <h2 className="text-[13px] font-bold text-[#63684B] uppercase tracking-[0.12em]">Community Board</h2>
            </div>
            
            <div className="bg-white rounded-[1.5rem] border border-[#E5E0D8] shadow-sm p-10 text-center flex flex-col items-center justify-center min-h-[340px]">
              <div className="w-20 h-20 bg-[#F6F1E7] rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="text-[#E2811F]" size={32} />
              </div>
              <h3 className="font-serif text-[24px] text-[#1C1A17] mb-3">Join the conversation</h3>
              <p className="text-[#63684B] text-[15px] leading-relaxed max-w-sm mx-auto mb-6">
                Share tips, ask for recommendations, or organize local dog walking groups.
              </p>
              <div className="px-4 py-2 bg-[#F6F1E7] text-[#63684B] text-[12px] font-bold uppercase tracking-wider rounded-full border border-[#E5E0D8]">
                Coming Soon
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
