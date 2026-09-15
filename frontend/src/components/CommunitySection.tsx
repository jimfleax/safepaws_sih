import React from 'react';
import { motion } from 'motion/react';
import { Users, BellRing, MapPin } from 'lucide-react';

export const CommunitySection: React.FC = () => {
  return (
    <section className="w-full bg-[#27170E] text-[#FAF6F0] py-16 sm:py-20 lg:py-24 my-8" id="community-section">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex items-center justify-between mb-12 flex-col md:flex-row gap-6">
          <div className="flex flex-col max-w-xl">
            <span className="text-[12px] font-bold tracking-[0.12em] text-[#D8C7B8] uppercase mb-3 block">
              COMMUNITY & RECOVERY
            </span>
            <h2 className="font-serif text-[32px] sm:text-[40px] leading-tight text-white mb-4">
              A neighborhood that looks out for each other.
            </h2>
            <p className="text-[16px] text-[#B8A498] leading-relaxed">
              When a pet goes missing, a fast response is everything. SafePaws connects you instantly to people nearby who can help. No exaggerated claims—just real people working together.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <motion.div whileHover={{ y: -4 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-[#DE6828]/20 flex items-center justify-center mb-6">
              <BellRing className="w-5 h-5 text-[#DE6828]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Instant Local Alerts</h3>
            <p className="text-[#B8A498] text-[15px] leading-relaxed">
              Notify the network immediately. Alerts reach active community members in your immediate area to expand your search instantly.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-[#DE6828]/20 flex items-center justify-center mb-6">
              <MapPin className="w-5 h-5 text-[#DE6828]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Verified Sightings</h3>
            <p className="text-[#B8A498] text-[15px] leading-relaxed">
              Track reported sightings on a live map. All updates are logged so you can focus your search exactly where they were last seen.
            </p>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-start">
            <div className="w-12 h-12 rounded-full bg-[#DE6828]/20 flex items-center justify-center mb-6">
              <Users className="w-5 h-5 text-[#DE6828]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Community Support</h3>
            <p className="text-[#B8A498] text-[15px] leading-relaxed">
              Work alongside neighbors and local volunteers who are genuinely invested in bringing every lost companion home safely.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
