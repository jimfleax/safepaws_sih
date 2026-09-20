import React from 'react';
import { motion } from 'motion/react';
import {  Shield, Users, Mail, Check  } from 'lucide-react';
import { Dialog, DialogContent, DialogClose, DialogTitle } from '../ui/Dialog';

interface InfoModalProps {
  isOpen: boolean;
  type: 'privacy' | 'guidelines' | 'contact' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  type,
  onClose,
}) => {
  if (!type) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#E8DCce] flex items-center justify-between bg-[#F4EDE2]/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5D5C2] flex items-center justify-center text-[#241812]">
              {type === 'privacy' && <Shield className="w-5 h-5 text-[#DE6828]" />}
              {type === 'guidelines' && <Users className="w-5 h-5 text-[#DE6828]" />}
              {type === 'contact' && <Mail className="w-5 h-5 text-[#DE6828]" />}
            </div>
            <div>
              <DialogTitle>
                {type === 'privacy' && 'Privacy & Data Protection'}
                {type === 'guidelines' && 'SafePaws Community Guidelines'}
                {type === 'contact' && 'Contact SafePaws Team'}
              </DialogTitle>
              <p className="text-xs text-[#6F5D52]">
                SafePaws Neighborhood Safety Standards
              </p>
            </div>
          </div>

          <DialogClose id="close-info-modal-btn" />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto text-sm text-[#4E3D32] space-y-4 leading-relaxed">
          {type === 'privacy' && (
            <>
              <p>
                At SafePaws, we believe your personal information should stay strictly private while keeping your pets completely safe.
              </p>
              <h4 className="font-bold text-[#241812] text-base">Key Privacy Principles</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                  <span><strong>Owner Phone Masking:</strong> When a QR code is scanned, you can choose direct forwarding or private relay.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                  <span><strong>No Geofencing Tracking:</strong> SafePaws does NOT track your pet continuously. GPS coordinates are only shared when a finder scans the tag or a volunteer logs a sighting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#34A853] shrink-0 mt-0.5" />
                  <span><strong>End-to-End Cryptography:</strong> All biometric and identity hashes are encrypted using modern web cryptographic standards.</span>
                </li>
              </ul>
            </>
          )}

          {type === 'guidelines' && (
            <>
              <p>
                Our community is built on neighborly kindness and mutual responsibility.
              </p>
              <h4 className="font-bold text-[#241812] text-base">Community Standards</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#DE6828] shrink-0 mt-0.5" />
                  <span><strong>Kindness First:</strong> Treat all lost pets with gentle care and never attempt to handle an aggressive animal alone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#DE6828] shrink-0 mt-0.5" />
                  <span><strong>Accurate Sightings:</strong> Only submit verified sightings to keep search party efforts accurate and efficient.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#DE6828] shrink-0 mt-0.5" />
                  <span><strong>Prompt Updates:</strong> When your pet is safely reunited, immediately mark the broadcast as resolved so neighbors know they can rest easy.</span>
                </li>
              </ul>
            </>
          )}

          {type === 'contact' && (
            <div className="space-y-4">
              <p>
                Have questions about SafePaws, need support with your Smart QR Tag, or want to launch SafePaws in your city?
              </p>
              <div className="bg-white p-4 rounded-2xl border border-[#E9DCcb] space-y-2">
                <div>
                  <span className="text-xs font-bold text-[#7E6D62] uppercase">Support Email</span>
                  <div className="font-medium text-[#241812]">support@safepaws.app</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#7E6D62] uppercase">Emergency Pet Hotline</span>
                  <div className="font-medium text-[#241812]">1-800-SAFE-PAW (24/7 Response)</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#7E6D62] uppercase">Community Partnerships</span>
                  <div className="font-medium text-[#241812]">neighborhoods@safepaws.app</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
