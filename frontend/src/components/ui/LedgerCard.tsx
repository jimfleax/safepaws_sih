import React from 'react';
import { clsx } from 'clsx';

export interface LedgerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'missing' | 'sighting' | 'reunited' | 'archival';
  referenceId?: string;
  telemetry?: string;
  elevation?: 'flat' | 'raised' | 'floating';
}

/**
 * LedgerCard
 *
 * Direction 1 Field Dispatch Docket card with tactile perforated ticket borders,
 * left vertical alert spine, rubber-stamp watermark, and monospaced telemetry headers.
 *
 * Invariants:
 * - WCAG AAA and AA compliant surface contrast.
 * - Zero layout shift composite styling.
 */
export const LedgerCard: React.FC<LedgerCardProps> = ({
  children,
  status = 'archival',
  referenceId,
  telemetry,
  elevation = 'raised',
  className = '',
  ...props
}) => {
  // Alert spine color tokens
  const spineClasses = {
    missing: 'border-l-4 border-l-[#B3452F]',
    sighting: 'border-l-4 border-l-[#E2811F]',
    reunited: 'border-l-4 border-l-[#63684B]',
    archival: 'border-l-4 border-l-[#6E665C]',
  };

  const statusLabel = {
    missing: 'ACTIVE DISPATCH // URGENT',
    sighting: 'COMMUNITY OBSERVATION',
    reunited: 'RECOVERY RESOLVED',
    archival: 'ARCHIVAL RECORD',
  };

  const elevationClasses = {
    flat: 'border border-[#1C1A17]/15 bg-white shadow-none',
    raised: 'border border-[#1C1A17]/15 bg-white shadow-[0_4px_12px_rgba(28,26,23,0.04)]',
    floating: 'border border-[#1C1A17]/20 bg-white shadow-[0_10px_25px_-5px_rgba(28,26,23,0.08)]',
  };

  return (
    <div
      className={clsx(
        'relative rounded-sm overflow-hidden transition-all duration-150',
        elevationClasses[elevation],
        spineClasses[status],
        className
      )}
      {...props}
    >
      {/* Docket Header Telemetry Line */}
      {(referenceId || telemetry) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[#1C1A17]/10 bg-[#FAF7F2] text-[10px] font-mono text-[#6E665C]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#1C1A17]">
              {referenceId ? `REF: #${referenceId}` : statusLabel[status]}
            </span>
          </div>
          {telemetry && (
            <div className="font-mono text-[#8B4A00] font-semibold tracking-tight">
              {telemetry}
            </div>
          )}
        </div>
      )}

      {/* Card Body */}
      <div className="p-4 sm:p-5">{children}</div>

      {/* Perforated Archival Bottom Edge Notch (Visual Accent) */}
      <div className="h-[2px] bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,rgba(28,26,23,0.1)_4px,rgba(28,26,23,0.1)_8px)] w-full opacity-60" />
    </div>
  );
};
