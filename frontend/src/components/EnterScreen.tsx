import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface EnterScreenProps {
  onEnter: () => void;
}

export const NoseIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C8 2 4 5 4 10c0 3 2 5 3.5 6.5C8.5 17.5 10 20 12 21c2-1 3.5-3.5 4.5-4.5C18 15 20 13 20 10c0-5-4-8-8-8zm0 15c-1.5-1.5-2-2.5-2.5-3.5C9 12.5 10 11 12 11s3 1.5 2.5 2.5C14 14.5 13.5 15.5 12 17z" />
  </svg>
);

export const EnterScreen: React.FC<EnterScreenProps> = ({ onEnter }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hasEntered = sessionStorage.getItem('hasEntered');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hasEntered || prefersReducedMotion) {
      onEnter();
      return;
    }

    const timer = setTimeout(() => {
      finishEntry();
    }, 2500);

    const handleInteraction = () => finishEntry();
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  const finishEntry = () => {
    setVisible(false);
    sessionStorage.setItem('hasEntered', 'true');
    setTimeout(() => onEnter(), 400); // Wait for exit animation
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF3EA] overflow-hidden"
        >
          {/* AURA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 0.5, 0.8], scale: [0.5, 1.2, 1.5] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-[300px] h-[300px] bg-[#DE6828] rounded-full blur-[100px] opacity-20 pointer-events-none"
          />

          <div className="relative z-10 flex flex-col items-center justify-center text-[#DE6828]">
            {/* NOSE PRINT */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            >
              <NoseIcon className="w-20 h-20 drop-shadow-lg" />
            </motion.div>
            
            {/* WORDMARK */}
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6, ease: 'easeOut' }}
              className="mt-6 font-serif text-4xl font-bold tracking-tight text-[#2E2018]"
            >
              SafePaws
            </motion.h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
