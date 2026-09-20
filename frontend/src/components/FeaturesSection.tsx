import React from 'react';
import { Fingerprint, Share2, Scan, ArrowUpRight } from 'lucide-react';

interface FeaturesSectionProps {
  onOpenBiometric: () => void;
  onOpenNetwork: () => void;
  onOpenQrTags: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onOpenBiometric,
  onOpenNetwork,
  onOpenQrTags,
}) => {
  return (
    <section className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-12 sm:py-16">
      {/* Section Eyebrow */}
      <div className="flex items-center gap-2 mb-8 sm:mb-10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#DE6828] inline-block" />
        <span className="text-[12px] sm:text-[13px] font-bold tracking-[0.12em] text-[#3F3127] uppercase">
          ONE PLACE TO KEEP THEM SAFE
        </span>
      </div>

      {/* Asymmetrical Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Primary Feature: Biometric AI */}
        <div
          id="feature-card-biometric"
          onClick={onOpenBiometric}
          className="group relative bg-[#FDE8DC] rounded-none sm:rounded-[24px] p-8 sm:p-12 lg:col-span-12 flex flex-col md:flex-row justify-between cursor-pointer border-t border-b sm:border border-[#F4D3C2] transition-colors hover:bg-[#FBE0D0] min-h-[320px]"
        >
          <div className="md:w-1/2 flex flex-col justify-between">
            <div className="w-16 h-16 rounded-full bg-[#F8D4C1] text-[#422B1F] flex items-center justify-center mb-8">
              <Fingerprint className="w-8 h-8 stroke-[1.5]" />
            </div>
            
            <div className="mt-auto">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="font-serif text-[32px] sm:text-[40px] text-[#241812] leading-none">
                  Nose-print Biometrics
                </h3>
                <ArrowUpRight className="w-6 h-6 text-[#7A6458] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[16px] sm:text-[18px] leading-[1.6] text-[#5C4A3F] max-w-md">
                We turn your dog's unique nose pattern into an un-losable identity record. It's like a fingerprint, but for your best friend.
              </p>
              <span className="inline-block mt-6 text-[13px] font-semibold tracking-wider uppercase text-[#DE6828]">
                Identity Verification Rolling Out Soon
              </span>
            </div>
          </div>
          <div className="hidden md:block md:w-5/12 rounded-[16px] overflow-hidden bg-[#F4D3C2]/50 relative">
             <div className="absolute inset-0 flex items-center justify-center text-[#DE6828]/30 font-serif text-9xl italic select-none">ID</div>
          </div>
        </div>

        {/* Secondary Feature 1: Sensor Network */}
        <div
          id="feature-card-sensor-network"
          onClick={onOpenNetwork}
          className="group relative bg-[#ECE0D2] rounded-none sm:rounded-[24px] p-8 lg:col-span-6 flex flex-col justify-between cursor-pointer border-t border-b sm:border border-[#E0D0BF] transition-colors hover:bg-[#E4D5C5] min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#DFCDBD] text-[#3D291E] flex items-center justify-center mb-8">
            <Share2 className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-semibold text-[24px] text-[#241812]">
                Neighborhood Network
              </h3>
              <ArrowUpRight className="w-5 h-5 text-[#7A6458] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#5C4A3F]">
              Activate a local search instantly. Our system alerts nearby SafePaws members so your community becomes an active recovery team.
            </p>
          </div>
        </div>

        {/* Secondary Feature 2: Smart QR Tags */}
        <div
          id="feature-card-smart-qr"
          onClick={onOpenQrTags}
          className="group relative bg-[#D7ECEB] rounded-none sm:rounded-[24px] p-8 lg:col-span-6 flex flex-col justify-between cursor-pointer border-t border-b sm:border border-[#C5E1DF] transition-colors hover:bg-[#CDE6E5] min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-[#C1E2E0] text-[#1E3B3A] flex items-center justify-center mb-8">
            <Scan className="w-6 h-6 stroke-[1.5]" />
          </div>

          <div className="mt-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-sans font-semibold text-[24px] text-[#1E3B3A]">
                Smart QR Tags
              </h3>
              <ArrowUpRight className="w-5 h-5 text-[#356361] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p className="text-[15px] sm:text-[16px] leading-[1.6] text-[#3D5B59]">
              Every pet profile generates a unique QR code. Print it, tag it, and let anyone who finds your dog instantly pull up their critical details.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
