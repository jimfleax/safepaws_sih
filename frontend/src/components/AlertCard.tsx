import React from 'react';
import { NeighborhoodAlert } from '../types';
import { Link } from 'react-router-dom';
import { MapPin, Users, Clock } from 'lucide-react';

interface AlertCardProps {
  alert: NeighborhoodAlert;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert }) => {
  return (
    <div className="group bg-white rounded-[1.5rem] p-4 border border-[#B3452F]/40 shadow-[0_4px_16px_rgba(179,69,47,0.08)] ring-1 ring-[#B3452F]/20 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(179,69,47,0.12)] flex flex-col gap-4">
      <div className="relative h-56 w-full rounded-[1rem] overflow-hidden bg-[#F6F1E7]">
        {alert.photoUrl ? (
          <img
            src={alert.photoUrl}
            alt={alert.petName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#63684B]/50">
            No Photo
          </div>
        )}
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm backdrop-blur-md bg-[#B3452F]/90 text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFB4A3]" />
            Missing
          </span>
        </div>
      </div>
      
      <div className="px-2">
        <h3 className="font-serif text-[24px] text-[#1C1A17] leading-tight mb-1">{alert.petName}</h3>
        <p className="text-[14px] text-[#63684B] truncate">{alert.breed}</p>
        
        <div className="mt-4 space-y-2 border-t border-[#E5E0D8] pt-3">
          <div className="flex items-center gap-2 text-[13px] text-[#1C1A17]">
            <MapPin size={14} className="text-[#E2811F]" />
            <span className="truncate">{alert.lastSeenAddress}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#1C1A17]">
            <Clock size={14} className="text-[#63684B]" />
            <span>{alert.timeAgo}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#1C1A17]">
            <Users size={14} className="text-[#4C7A52]" />
            <span>{alert.notifiedNeighborsCount} neighbors notified</span>
          </div>
        </div>
      </div>
      
      <Link 
        to={`/alerts/${alert.id}`} 
        className="w-full py-3 mt-1 font-semibold rounded-[1rem] transition-colors text-center text-[14px] bg-[#B3452F]/10 text-[#B3452F] hover:bg-[#B3452F] hover:text-white"
      >
        View Alert Details
      </Link>
    </div>
  );
};
