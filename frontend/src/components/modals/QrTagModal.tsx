import React, { useState, useEffect } from 'react';
import { QrCode, Share2, Check, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '../ui/Dialog';
import QRCode from 'qrcode';
import { Pet } from '../../types';
import { PawIcon } from '../Header';

interface QrTagModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet;
}

export const QrTagModal: React.FC<QrTagModalProps> = ({
  isOpen,
  onClose,
  pet,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const tagUrl = `https://safepaws.app/p/${pet.qrTagId}`;

  useEffect(() => {
    let isMounted = true;
    QRCode.toDataURL(tagUrl, {
      width: 260,
      margin: 1,
      color: {
        dark: '#1C120C',
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
    navigator.clipboard.writeText(tagUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#E8DCce] flex items-center justify-between bg-[#F4EDE2]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#D7ECEB] flex items-center justify-center text-[#1E3B3A]">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle>Smart QR Collar Tag</DialogTitle>
              <p className="text-xs text-[#6F5D52]">
                Instant contact with no app download required for rescuers
              </p>
            </div>
          </div>

          <DialogClose id="close-qrtag-modal-btn" />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {/* Collar Tag Print / Preview */}
          <div className="flex flex-col items-center text-center space-y-6">
            {/* The Physical Tag Replica */}
            <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#F5E6D3] via-[#E8D4BE] to-[#D7BFA5] p-2.5 shadow-xl border-4 border-white/80 flex items-center justify-center">
              {/* Hole punch for collar ring */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#34241B] shadow-inner border border-[#ECCEB1]" />

              {/* Inner Tag Disc */}
              <div className="w-full h-full rounded-full bg-[#FAF6F0] p-4 flex flex-col items-center justify-center border border-[#E3D1BE]">
                <div className="flex items-center gap-1 text-[#241812] mb-1">
                  <PawIcon className="w-4 h-4 text-[#DE6828]" />
                  <span className="font-bold text-xs tracking-tight">SafePaws</span>
                </div>

                {/* Real Scannable QR Code */}
                <div
                  data-cursor="default"
                  data-qr-tag="true"
                  data-no-photo-hover="true"
                  className="relative p-2 bg-white rounded-2xl shadow-xs border border-[#E0D0BD] my-1"
                >
                  {qrDataUrl ? (
                    <div className="relative w-24 h-24" data-cursor="default" data-qr-tag="true">
                      <img
                        src={qrDataUrl}
                        alt={`Scannable QR tag for ${pet.name}`}
                        data-cursor="default"
                        data-qr-tag="true"
                        className="w-24 h-24 rounded-lg block"
                      />
                      {/* Elegant micro paw badge in center of QR code */}
                      <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-white shadow-xs border border-[#E8DAC8] flex items-center justify-center pointer-events-none">
                        <PawIcon className="w-3 h-3 text-[#DE6828]" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-[#F8F2EA] rounded-lg animate-pulse" />
                  )}
                </div>

                <div className="font-bold text-sm text-[#241812] tracking-tight">{pet.name}</div>
                <div className="text-[10px] font-mono text-[#8C7B70] tracking-wider">{pet.qrTagId}</div>
                <div className="text-[9px] text-[#DE6828] font-bold uppercase mt-0.5">Scan to help me home</div>
              </div>
            </div>

            <div className="max-w-md">
              <h3 className="font-semibold text-lg text-[#241812]">
                Tag Linked to {pet.name} ({pet.breed})
              </h3>
              <p className="text-sm text-[#6E5A4D] mt-1">
                When scanned with any smartphone camera, the finder instantly sees your emergency contact number and can send you their exact location.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full pt-4">
              <button
                onClick={handleCopyLink}
                className="px-5 py-2.5 rounded-full bg-white hover:bg-[#F0E6D8] border border-[#DECFBD] text-sm font-semibold text-[#241812] inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                {copiedLink ? <Check className="w-4 h-4 text-[#34A853]" /> : <Share2 className="w-4 h-4 text-[#DE6828]" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Web Tag URL'}</span>
              </button>

              <a
                href={`/p/${pet.qrTagId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-full bg-[#DE6828] hover:bg-[#C9581B] text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer shadow-md"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Test Finder Scan View</span>
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
