import React from 'react';
import { motion } from 'motion/react';
import { Fingerprint, Share2, Scan } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="w-full bg-white text-[#241812] py-16 sm:py-20 lg:py-24" id="how-it-works">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-serif text-[32px] sm:text-[40px] text-[#241812] tracking-tight">
            How SafePaws Works
          </h2>
          <p className="mt-4 text-[16px] sm:text-[18px] text-[#55463D] max-w-2xl">
            A cohesive safety system starting from the tip of their nose to the community around you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center text-center p-6 bg-[#FAF6F0] rounded-3xl border border-[#EDE4D8]">
            <div className="w-14 h-14 rounded-2xl bg-[#DE6828]/10 text-[#DE6828] flex items-center justify-center mb-6">
              <Fingerprint className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-sans font-semibold text-[20px] mb-3">Biometric Identification</h3>
            <p className="text-[#55463D] leading-relaxed">
              Scan your pet's nose print to create a secure identity that cannot be lost or removed.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center text-center p-6 bg-[#FAF6F0] rounded-3xl border border-[#EDE4D8]">
            <div className="w-14 h-14 rounded-2xl bg-[#DE6828]/10 text-[#DE6828] flex items-center justify-center mb-6">
              <Scan className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-sans font-semibold text-[20px] mb-3">Smart Tag Support</h3>
            <p className="text-[#55463D] leading-relaxed">
              Pair with a smart QR tag for quick scanning, giving anyone the ability to securely help your pet.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="flex flex-col items-center text-center p-6 bg-[#FAF6F0] rounded-3xl border border-[#EDE4D8]">
            <div className="w-14 h-14 rounded-2xl bg-[#DE6828]/10 text-[#DE6828] flex items-center justify-center mb-6">
              <Share2 className="w-7 h-7 stroke-[1.5]" />
            </div>
            <h3 className="font-sans font-semibold text-[20px] mb-3">Community Recovery</h3>
            <p className="text-[#55463D] leading-relaxed">
              Instantly share verified alerts with neighbors to organize a coordinated search when every second counts.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
