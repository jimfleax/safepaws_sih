import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="w-full bg-[#FAF3EA] text-[#241812] py-16 sm:py-20 lg:py-24" id="trust-section">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Column: Visual Material */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-[#DE6828]/10 to-[#F59E0B]/5 flex items-center justify-center relative overflow-hidden"
          >
            {/* Exactly ONE nose-print treatment */}
            <div className="text-[#DE6828] opacity-80 mix-blend-multiply">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-32 h-32" aria-hidden="true">
                <path d="M12 2C8 2 4 5 4 10c0 3 2 5 3.5 6.5C8.5 17.5 10 20 12 21c2-1 3.5-3.5 4.5-4.5C18 15 20 13 20 10c0-5-4-8-8-8zm0 15c-1.5-1.5-2-2.5-2.5-3.5C9 12.5 10 11 12 11s3 1.5 2.5 2.5C14 14.5 13.5 15.5 12 17z" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Copy */}
        <div className="w-full lg:w-1/2 flex flex-col items-start">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-[#DE6828]" />
            <span className="text-[13px] font-bold tracking-widest text-[#DE6828] uppercase">
              Verifiable Identity
            </span>
          </div>
          <h2 className="font-serif text-[32px] sm:text-[42px] leading-tight text-[#241812] tracking-tight mb-6">
            Their nose print is as unique as a fingerprint.
          </h2>
          <p className="text-[16px] sm:text-[18px] leading-relaxed text-[#55463D] mb-8">
            Collar tags get lost. Microchips require special scanners. But every dog's nose print is a unique, unalterable identifier. We use it as the foundational material for their security, ensuring you can always prove they belong with you.
          </p>
        </div>

      </div>
    </section>
  );
};
