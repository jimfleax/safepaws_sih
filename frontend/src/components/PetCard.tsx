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
      className={`group bg-[var(--color-surface)] rounded-[var(--radius-28)] p-3 border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(28,26,23,0.08)] flex flex-col gap-4 cursor-pointer focus-within:ring-2 focus-within:ring-[var(--color-focus)] ${
        isLost
          ? 'border-[var(--color-alert)]/40 shadow-[0_4px_16px_rgba(179,69,47,0.1)] ring-1 ring-[var(--color-alert)]/20'
          : 'border-[var(--color-border)]'
      }`}
    >
      <div className="relative h-56 w-full rounded-[var(--radius-24)] overflow-hidden bg-[var(--color-background)]">
        <img
          src={pet.photoUrl}
          alt={pet.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:scale-[1.03]"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] shadow-sm backdrop-blur-md border ${
            isLost 
              ? 'bg-[var(--color-alert)]/95 text-white border-[var(--color-alert)]/20' 
              : isSighted 
                ? 'bg-[var(--color-trail)]/95 text-white border-[var(--color-trail)]/20' 
                : 'bg-white/95 text-[var(--color-ink)] border-[var(--color-border)]/50'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isLost ? 'bg-white/90 animate-pulse' : isSighted ? 'bg-white/90 animate-pulse' : 'bg-[var(--color-success)]'
            }`} />
            {isLost ? 'Lost' : isSighted ? 'Sighted' : 'Safe'}
          </span>
        </div>
      </div>
      
      <div className="px-3">
        <h3 className="font-serif text-[26px] text-[var(--color-ink)] leading-tight mb-1">{pet.name}</h3>
        <p className="text-[14px] text-[var(--color-ink-soft)] truncate font-medium">{pet.breed}</p>
      </div>
      
      <Link 
        to={`/pets/${pet.id}`} 
        className={`w-full py-3.5 mt-1 font-bold tracking-wide rounded-[var(--radius-24)] transition-all text-center text-[13px] uppercase ${
          isLost 
            ? 'bg-[var(--color-alert)]/10 text-[var(--color-alert)] hover:bg-[var(--color-alert)] hover:text-white' 
            : 'bg-[var(--color-background)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white'
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
