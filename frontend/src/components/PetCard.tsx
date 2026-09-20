import React from 'react';
import { Pet } from '../types';
import { Link } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
  onClick?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, onClick }) => {
  const isLost = pet.status === 'lost';
  const isSighted = pet.status === 'sighted';

  return (
    <div
      onClick={onClick}
      className={`group bg-white rounded-[1.5rem] p-4 border transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(28,26,23,0.06)] flex flex-col gap-4 cursor-pointer focus-within:ring-2 focus-within:ring-[#E2811F] ${
        isLost
          ? 'border-[#B3452F]/40 shadow-[0_4px_16px_rgba(179,69,47,0.1)] ring-1 ring-[#B3452F]/20'
          : 'border-[#E5E0D8]'
      }`}
    >
      <div className="relative h-56 w-full rounded-[1rem] overflow-hidden bg-[#F6F1E7]">
        <img
          src={pet.photoUrl}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.08em] shadow-sm backdrop-blur-md ${
            isLost 
              ? 'bg-[#B3452F]/90 text-white' 
              : isSighted 
                ? 'bg-[#63684B]/90 text-white' 
                : 'bg-white/90 text-[#1C1A17] border border-[#E5E0D8]/50'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isLost ? 'bg-[#FFB4A3]' : isSighted ? 'bg-[#D8DACC]' : 'bg-[#4C7A52]'
            }`} />
            {isLost ? 'Lost' : isSighted ? 'Sighted' : 'Safe'}
          </span>
        </div>
      </div>
      
      <div className="px-2">
        <h3 className="font-serif text-[24px] text-[#1C1A17] leading-tight mb-1">{pet.name}</h3>
        <p className="text-[14px] text-[#63684B] truncate">{pet.breed}</p>
      </div>
      
      <Link 
        to={`/pets/${pet.id}`} 
        className={`w-full py-3 mt-1 font-semibold rounded-[1rem] transition-colors text-center text-[14px] ${
          isLost 
            ? 'bg-[#B3452F]/10 text-[#B3452F] hover:bg-[#B3452F] hover:text-white' 
            : 'bg-[#F6F1E7] text-[#1C1A17] hover:bg-[#E5E0D8]'
        }`}
        onClick={(e) => {
          if (onClick) onClick();
        }}
      >
        View Profile
      </Link>
    </div>
  );
};
