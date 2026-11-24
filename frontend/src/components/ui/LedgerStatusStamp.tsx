import React from 'react';

export type LedgerStampState = 
  | 'ACTIVE_SEARCH' 
  | 'UNVERIFIED_SIGHTING' 
  | 'CONFIRMED_SIGHTING' 
  | 'REUNITED_CLOSED'
  | 'COMMUNITY_NOTE';

export interface LedgerStatusStampProps {
  state: LedgerStampState;
  jitter?: number; // degrees, e.g. -1.5 to 1.5
  className?: string;
  size?: 'sm' | 'md';
}

export const LedgerStatusStamp: React.FC<LedgerStatusStampProps> = ({
  state,
  jitter = -1.2,
  className = '',
  size = 'md',
}) => {
  const configs: Record<LedgerStampState, { label: string; sub: string; border: string; text: string; bg: string }> = {
    ACTIVE_SEARCH: {
      label: 'STATUS: ACTIVE SEARCH',
      sub: 'CIVIC DISPATCH DECLARED',
      border: 'border-[#B3452F]',
      text: 'text-[#B3452F]',
      bg: 'bg-[#B3452F]/10',
    },
    UNVERIFIED_SIGHTING: {
      label: 'FIELD REPORT // UNVERIFIED',
      sub: 'CITIZEN LOG ENTRY',
      border: 'border-[#8B4A00]',
      text: 'text-[#8B4A00]',
      bg: 'bg-[#E2811F]/10',
    },
    CONFIRMED_SIGHTING: {
      label: 'SIGHTING // VERIFIED',
      sub: 'PHYSICAL CONFIRMATION',
      border: 'border-[#4C7A52]',
      text: 'text-[#4C7A52]',
      bg: 'bg-[#4C7A52]/10',
    },
    REUNITED_CLOSED: {
      label: 'STATUS: REUNITED & CLOSED',
      sub: 'ARCHIVED RECOVERY CASE',
      border: 'border-[#63684B]',
      text: 'text-[#63684B]',
      bg: 'bg-[#63684B]/10',
    },
    COMMUNITY_NOTE: {
      label: 'COMMUNITY DISPATCH',
      sub: 'CIVIC NETWORK RECORD',
      border: 'border-[#6E665C]',
      text: 'text-[#1C1A17]',
      bg: 'bg-[#F6F1E7]',
    },
  };

  const c = configs[state] || configs.COMMUNITY_NOTE;
  const isSm = size === 'sm';

  return (
    <div 
      className={`inline-block border-2 border-dashed ${c.border} ${c.text} ${c.bg} font-mono tracking-widest uppercase select-none rounded-[1px] transition-transform duration-150 ${
        isSm ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'
      } ${className}`}
      style={{ transform: `rotate(${jitter}deg)` }}
      role="status"
      aria-label={`${c.label} - ${c.sub}`}
    >
      <div className="font-bold leading-none">{c.label}</div>
      <div className="text-[9px] tracking-wider opacity-85 mt-0.5 leading-none">{c.sub}</div>
    </div>
  );
};
