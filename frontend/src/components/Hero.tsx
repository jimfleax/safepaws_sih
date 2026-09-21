import React from 'react';
import { motion } from 'motion/react';
import { Camera, Plus } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
  onOpenOliveProfile?: () => void;
  onOpenLostAlert?: () => void;
  onIdentifyClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onJoinClick,
  onIdentifyClick,
}) => {
  return (
    <section className="relative w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* 
        Mobile: Photo first, then text (flex-col-reverse with the image physically first in DOM but visually ordered by flex-col)
        Desktop: Asymmetric composition (image right, text left)
      */}
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-14">
        
        {/* Image Column - Visual First on Mobile */}
        <div className="w-full lg:w-5/12 order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-[#E8D5BF]"
          >
            <img 
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop" 
              alt="Close up of a dog's nose"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </motion.div>
        </div>

        {/* Text and Actions Column */}
        <div className="w-full lg:w-7/12 order-2 lg:order-1 flex flex-col items-start text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[42px] sm:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.02em] text-[#241812] font-normal"
          >
            A community safety net for your pet.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-7 text-[16px] sm:text-[18px] leading-[1.65] text-[#55463D] max-w-[480px]"
          >
            Every dog’s nose print is unique. Use it to protect them. Join our neighborhood-powered recovery network to ensure every lost companion finds their way home.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={onIdentifyClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#DE6828] hover:bg-[#CA581B] active:bg-[#B54C14] text-white font-medium text-[15px] shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>SCAN A DOG</span>
            </button>
            <button
              onClick={onJoinClick}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-white hover:bg-[#FDF9F5] active:bg-[#F2EAE1] text-[#241812] font-medium text-[15px] shadow-sm border border-[#E4D5C5] transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              <span>REGISTER YOUR PET</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
