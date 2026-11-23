import React, { useState, useEffect } from 'react';
import { QrCode, Share2, Check, ExternalLink, ShieldCheck, AlertCircle, RotateCw, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/Dialog';
import QRCode from 'qrcode';
import { Pet } from '../../types';

interface QrTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
}

const TagPawIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 13.5c-1.8 0-3.5 1.2-3.5 3 0 1.5 1.2 2.5 3.5 2.5s3.5-1 3.5-2.5c0-1.8-1.7-3-3.5-3zm-5-3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7.5-4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm5 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

export const QrTagModal: React.FC<QrTagModalProps> = ({
  isOpen,
  onClose,
  pet,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFlipped, setIsFlipped] = useState(false);

  const baseUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://safepaws.app';
  const hasValidQrTag = Boolean(pet.qrTagId && pet.qrTagId.trim());
  const tagIdentifier = hasValidQrTag ? pet.qrTagId.trim() : '';
  const tagUrl = hasValidQrTag ? `${baseUrl}/p/${tagIdentifier}` : '';

  useEffect(() => {
    let isMounted = true;
    if (!tagUrl) {
      setQrDataUrl('');
      return;
    }

    QRCode.toDataURL(tagUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#1C1A17',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isMounted) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('Error generating QR code:', err);
      });

    return () => {
      isMounted = false;
    };
  }, [tagUrl]);

  const handleCopyLink = () => {
    if (!tagUrl) return;
    navigator.clipboard.writeText(tagUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-[var(--color-bone)] border border-[var(--color-border)] rounded-[var(--radius-28)] shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[var(--color-border)] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-marigold)]/10 text-[var(--color-accent-text)] flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="font-serif text-xl sm:text-2xl font-bold text-[var(--color-ink)]">
                Smart Collar QR Tag
              </DialogTitle>
              <DialogDescription className="text-xs text-[var(--color-ink-soft)] mt-0.5">
                Instant mediated contact with zero app installation required for finders
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="flex flex-col items-center text-center space-y-6">
            
            {/* The Physical Tag Replica with 3D Flip */}
            <button 
              type="button"
              className="relative w-64 h-64 [perspective:1000px] cursor-pointer group bg-transparent border-0 p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-full"
              onClick={() => setIsFlipped(!isFlipped)}
              aria-pressed={isFlipped}
              aria-label={`Smart Collar Tag for ${pet.name}. Currently showing ${isFlipped ? 'reverse engraved side' : 'front QR code'}. Click to flip.`}
            >
              <div 
                className={`w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d] motion-reduce:transition-none ${
                  isFlipped ? '[transform:rotateY(180deg)]' : ''
                }`}
              >
                {/* FRONT: QR Code Disc */}
                <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-[#F5E6D3] via-[#E8D4BE] to-[#D7BFA5] p-2.5 shadow-xl border-4 border-white/90 flex items-center justify-center [backface-visibility:hidden]">
                  {/* Hole punch for collar ring */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-ink)] shadow-inner border border-[#ECCEB1]" />

                  {/* Inner Tag Disc */}
                  <div className="w-full h-full rounded-full bg-white p-4 flex flex-col items-center justify-center border border-[var(--color-border)]">
                    <div className="flex items-center gap-1.5 text-[var(--color-ink)] mb-1">
                      <TagPawIcon className="w-4 h-4 text-[var(--color-marigold)]" />
                      <span className="font-bold text-xs tracking-tight font-serif">SafePaws</span>
                    </div>

                    {/* Scannable QR Code */}
                    <div className="relative p-2 bg-white rounded-2xl shadow-xs border border-[var(--color-border)] my-1">
                      {hasValidQrTag ? (
                        qrDataUrl ? (
                          <div className="relative w-24 h-24">
                            <img
                              src={qrDataUrl}
                              alt={`Scannable QR collar tag for ${pet.name}`}
                              className="w-24 h-24 rounded-lg block"
                            />
                            {/* Elegant micro paw badge in center of QR code */}
                            <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-white shadow-xs border border-[var(--color-border)] flex items-center justify-center pointer-events-none">
                              <TagPawIcon className="w-3 h-3 text-[var(--color-marigold)]" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-[var(--color-bone)] rounded-lg animate-pulse" />
                        )
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-[var(--color-bone)] border border-dashed border-[var(--color-border)] flex flex-col items-center justify-center p-2 text-center">
                          <AlertCircle className="w-6 h-6 text-[var(--color-marigold)] mb-1" />
                          <span className="text-[9px] font-bold text-[var(--color-ink-soft)] uppercase tracking-wider leading-tight">
                            Tag Pending
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="font-bold text-sm text-[var(--color-ink)] tracking-tight font-serif">
                      {pet.name}
                    </div>
                    <div className="text-[10px] font-mono text-[var(--color-ink-soft)] tracking-wider">
                      {hasValidQrTag ? tagIdentifier : 'PROVISIONING'}
                    </div>
                    <div className="text-[9px] text-[var(--color-accent-text)] font-bold uppercase tracking-wider mt-0.5">
                      {hasValidQrTag ? 'Scan to help me home' : 'Collar Tag In Preparation'}
                    </div>
                  </div>
                </div>

                {/* BACK: Engraved Brass Medal */}
                <div className="absolute inset-0 w-full h-full rounded-full bg-gradient-to-br from-[#D7BFA5] via-[#C5A88B] to-[#9E8268] p-2.5 shadow-xl border-4 border-[#ECCEB1] flex items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
                  {/* Hole punch for collar ring */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[var(--color-ink)] shadow-inner border border-[#D7BFA5]" />

                  {/* Inner Brass Disc */}
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#EFE3D5] to-[#D5C2AF] p-4 flex flex-col items-center justify-center border border-[#B99A7D] text-[#4A3B2C] shadow-inner">
                    <div className="w-10 h-10 rounded-full border border-[#9E8268]/40 flex items-center justify-center mb-2">
                      <TagPawIcon className="w-6 h-6 text-[#735238]" />
                    </div>
                    <div className="font-serif font-bold text-base tracking-wider uppercase text-[#3A2D20]">
                      {pet.name}
                    </div>
                    <div className="text-[10px] font-mono tracking-widest text-[#5A4838] uppercase mt-0.5">
                      {pet.breed || 'COMPANION'}
                    </div>
                    <div className="h-px w-16 bg-[#B99A7D] my-2" />
                    <div className="text-[9px] font-mono tracking-widest text-[#5A4838]">
                      SERIAL: {hasValidQrTag ? tagIdentifier : 'SAFEPAWS-SEC'}
                    </div>
                    <div className="text-[8px] font-bold tracking-widest text-[#735238] uppercase mt-1">
                      GUARDIAN MEDIATED RELAY
                    </div>
                  </div>
                </div>

              </div>
            </button>

            {/* Flip Hint Button */}
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-accent-text)] hover:underline min-h-[44px] px-3 py-2 rounded-lg cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Show Scannable QR Code' : 'Flip to View Engraved Medal'}</span>
            </button>

            {/* Description & Privacy Notice */}
            <div className="max-w-md space-y-2">
              <h3 className="font-serif font-bold text-lg text-[var(--color-ink)]">
                {hasValidQrTag ? `Tag Linked to ${pet.name} (${pet.breed})` : `Tag In Preparation for ${pet.name}`}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--color-ink-soft)] leading-relaxed">
                {hasValidQrTag 
                  ? "When scanned by a rescuer or neighbor, your private phone number remains protected by default. Finders can instantly send a verified GPS location ping or file an emergency sighting directly into the SafePaws recovery network."
                  : "A verifiable smart collar tag identifier has not been assigned to this companion yet. Once finalized by the network, rescuers and neighbors can scan this tag to initiate mediated contact without exposing your private phone number."
                }
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-success)]/10 text-[var(--color-success)] text-xs font-bold uppercase tracking-wider mt-2">
                <ShieldCheck size={14} /> Guardian Privacy Shield Active
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-4 border-t border-[var(--color-border)]">
              {hasValidQrTag ? (
                <>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-[var(--color-bone)] border border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] inline-flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : <Share2 className="w-4 h-4 text-[var(--color-marigold)]" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Tag URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!qrDataUrl) return;
                      const a = document.createElement('a');
                      a.href = qrDataUrl;
                      a.download = `${pet.name || 'companion'}-safepaws-tag.png`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-white hover:bg-[var(--color-bone)] border border-[var(--color-border)] text-xs font-bold uppercase tracking-wider text-[var(--color-ink)] inline-flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <Download className="w-4 h-4 text-[var(--color-ink-soft)]" />
                    <span>Download PNG</span>
                  </button>

                  <a
                    href={`/p/${tagIdentifier}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-[var(--color-ink)] hover:bg-[var(--color-surface-dark-raised)] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Test Scan</span>
                  </a>
                </>
              ) : (
                <div className="text-xs text-[var(--color-ink-soft)] font-medium py-2 px-4 bg-[var(--color-bone)] rounded-full border border-[var(--color-border)]">
                  Actions disabled until collar tag is assigned
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
