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

    if (hasEntered) {
      onEnter();
      return;
    }

    const timer = setTimeout(() => {
      finishEntry();
    }, prefersReducedMotion ? 0 : 2500);

    const handleInteraction = () => finishEntry();
    window.addEventListener('keydown', handleInteraction);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  const finishEntry = () => {
    setVisible(false);
    sessionStorage.setItem('hasEntered', 'true');
    setTimeout(() => onEnter(), 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#FAF3EA]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center text-[#DE6828]"
          >
            <NoseIcon className="w-16 h-16 drop-shadow-md" />
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-4 font-serif text-2xl font-bold tracking-tight text-[#2E2018]"
            >
              SafePaws
            </motion.h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
