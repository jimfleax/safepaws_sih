import React from 'react';
import { Pet, NeighborhoodAlert } from '../types';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { ArrowRight, ScanFace, MapPin, Activity, ShieldAlert, Sparkles } from 'lucide-react';

export interface PetCardProps {
  pet: Pet;
  viewMode?: 'grid' | 'row' | 'crisis';
  activeAlert?: NeighborhoodAlert;
  onClick?: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ 
  pet, 
  viewMode = 'grid', 
  activeAlert,
  onClick 
}) => {
  const isLost = pet.status === 'lost';
  const isSighted = pet.status === 'sightings_reported';

  const renderBadge = () => {
    if (isLost) {
      return (
        <Badge variant="alert" pulse size="sm">
          Lost
        </Badge>
      );
    }
    if (isSighted) {
      return (
        <Badge variant="scout" pulse size="sm">
          Sightings Reported
        </Badge>
      );
    }
    return (
      <Badge variant="success" size="sm">
        Safe
      </Badge>
    );
  };

  // CRISIS BANNER VIEW MODE (Full-width urgent recovery block)
  if (viewMode === 'crisis') {
    return (
      <Card 
        variant="crisis" 
        className="group flex flex-col md:flex-row overflow-hidden shadow-sm hover:shadow-md transition-all border border-[var(--color-alert-clay)]/30 rounded-[var(--radius-24)]"
      >
        {/* Pet Image Block */}
        <div className="md:w-64 h-64 md:h-auto shrink-0 bg-[var(--color-bone)] relative border-b md:border-b-0 md:border-r border-[var(--color-alert-clay)]/20">
          {pet.photoUrl ? (
            <img 
              src={pet.photoUrl} 
              alt={pet.name} 
              className="w-full h-full object-cover mix-blend-multiply" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink-soft)]">
              <ScanFace size={48} strokeWidth={1.5} />
              <span className="text-xs uppercase tracking-widest mt-2 font-semibold">No Photo</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
            <h3 className="font-serif text-3xl text-white font-bold tracking-tight">{pet.name}</h3>
          </div>
        </div>
        
        {/* Alert Information Block */}
        <div className="p-6 md:p-8 flex flex-col justify-between flex-1 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-alert-clay)] uppercase tracking-wider">
                <Activity size={16} className="animate-pulse motion-reduce:animate-none" />
                Active Recovery Radar
              </span>
              {renderBadge()}
            </div>
            
            <p className="text-lg text-[var(--color-ink)] mb-2 font-medium">
              {activeAlert ? activeAlert.description : "Community watch and local shelters have been notified."}
            </p>
            
            <p className="text-sm text-[var(--color-ink-soft)] flex items-center gap-2 mb-8 font-medium">
              <MapPin size={15} className="text-[var(--color-alert-clay)] shrink-0" />
              <span>Last seen: {activeAlert?.lastSeenAddress || pet.neighborhood || "Location on record"}</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-auto pt-4 border-t border-[var(--color-border)]">
            <Link 
              to={activeAlert ? `/alerts/${activeAlert.id}` : '/lost'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[var(--color-alert-clay)] hover:bg-[#9A3926] text-white font-bold text-xs uppercase tracking-widest transition-all rounded-full min-h-[44px] shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>Manage Recovery Incident</span>
              <ArrowRight size={16} />
            </Link>

            <Link 
              to={`/pets/${pet.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-black/5 text-[var(--color-ink)] font-bold text-xs uppercase tracking-widest transition-colors rounded-full min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <span>View Profile Record</span>
            </Link>
          </div>
        </div>
      </Card>
    );
  }

  // DENSE LIST ROW VIEW MODE (For high-volume multi-pet layouts)
  if (viewMode === 'row') {
    return (
      <Link 
        to={`/pets/${pet.id}`}
        onClick={onClick}
        className={`group flex items-center gap-4 md:gap-6 p-4 md:p-5 rounded-[var(--radius-24)] border transition-all duration-300 min-h-[72px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)] ${
          isLost 
            ? 'bg-white border-[var(--color-alert-clay)]/40 shadow-sm hover:shadow-md' 
            : isSighted 
              ? 'bg-white border-[var(--color-trail)]/40 shadow-sm hover:shadow-md'
              : 'bg-white/80 hover:bg-white border-[var(--color-border)] hover:border-[var(--color-ink)]/20 shadow-sm hover:shadow-md'
        }`}
      >
        {/* Avatar */}
        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden bg-[var(--color-bone)] shrink-0 border border-[var(--color-border)] relative">
          {pet.photoUrl ? (
            <img 
              src={pet.photoUrl} 
              alt={pet.name} 
              className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[var(--color-ink-soft)] text-xl font-serif">
              {pet.name.charAt(0)}
            </div>
          )}
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-xl md:text-2xl font-bold text-[var(--color-ink)] truncate leading-tight">
              {pet.name}
            </h3>
            {/* Mobile badge visible! */}
            <div className="md:hidden">
              {renderBadge()}
            </div>
          </div>
          <p className="text-xs md:text-sm text-[var(--color-ink-soft)] truncate mt-0.5 font-medium">
            {pet.breed} {pet.color ? `• ${pet.color}` : ''}
          </p>
        </div>
        
        {/* Desktop Status Badge */}
        <div className="hidden md:flex flex-col items-end shrink-0 mr-2">
          {renderBadge()}
          <span className="text-[10px] text-[var(--color-ink-soft)] font-mono tracking-wider mt-1">
            {pet.qrTagId ? `${pet.qrTagId.slice(0, 8)}-TAG` : 'SECURED'}
          </span>
        </div>
        
        {/* Arrow Action */}
        <div className="shrink-0 w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-ink-soft)] group-hover:bg-[var(--color-ink)] group-hover:text-white group-hover:border-[var(--color-ink)] transition-colors">
          <ArrowRight size={18} />
        </div>
      </Link>
    );
  }

  // EDITORIAL GRID CARD VIEW MODE (Default presentation)
  return (
    <Card
      variant={isLost ? 'crisis' : 'interactive'}
      className={`group overflow-hidden rounded-[var(--radius-28)] border transition-all duration-300 flex flex-col p-4 shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--color-focus)] ${
        isLost 
          ? 'border-[var(--color-alert-clay)]/40' 
          : isSighted 
            ? 'border-[var(--color-trail)]/40' 
            : 'border-[var(--color-border)]'
      }`}
    >
      {/* Media Image Container */}
      <div className="relative h-56 w-full rounded-[var(--radius-24)] overflow-hidden bg-[var(--color-bone)] border border-[var(--color-border)]/40">
        {pet.photoUrl ? (
          <img
            src={pet.photoUrl}
            alt={pet.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--color-ink-soft)] bg-[var(--color-bone)]">
            <span className="text-5xl font-serif text-[var(--color-ink)]/30 mb-2">{pet.name.charAt(0)}</span>
            <span className="text-xs uppercase tracking-widest font-semibold text-[var(--color-ink-soft)]">No Photo</span>
          </div>
        )}
        
        {/* Top-Right Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {renderBadge()}
        </div>

        {/* Biometric Chip Indicator */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-[var(--color-ink)] border border-white/60 shadow-xs">
            <ScanFace size={12} className="text-[var(--color-accent-text)]" />
            <span className="font-mono">{pet.qrTagId?.slice(0, 6) || pet.id.slice(0, 6).toUpperCase()}</span>
          </div>
        </div>
      </div>
      
      {/* Typography & Identity Info */}
      <div className="px-2 pt-4 pb-2 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-2xl text-[var(--color-ink)] leading-tight mb-1 font-bold tracking-tight">
            {pet.name}
          </h3>
          <p className="text-sm text-[var(--color-ink-soft)] truncate font-medium">
            {pet.breed} {pet.color ? `· ${pet.color}` : ''}
          </p>
          {(pet.age || pet.weight) && (
            <p className="text-xs text-[var(--color-ink-soft)] mt-1">
              {pet.age ? `${pet.age} yrs` : ''} {pet.age && pet.weight ? '•' : ''} {pet.weight ? `${pet.weight} kg` : ''}
            </p>
          )}
        </div>
        
        {/* Action Link CTA */}
        <Link
          to={`/pets/${pet.id}`}
          onClick={onClick}
          className={`w-full py-3 mt-4 font-bold tracking-wider rounded-[var(--radius-16)] transition-all text-center text-xs uppercase min-h-[44px] flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] ${
            isLost 
              ? 'bg-[var(--color-alert-clay)] text-white hover:bg-[#9A3926] shadow-sm' 
              : 'bg-[var(--color-bone)] text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-white'
          }`}
        >
          <span>View Identity Record</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </Card>
  );
};
