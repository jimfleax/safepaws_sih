/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { EnterScreen } from '../components/EnterScreen';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FeaturesSection } from '../components/FeaturesSection';
import { StepsDarkSection } from '../components/StepsDarkSection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';

// Modals
import { InfoModal } from '../components/modals/InfoModal';

// Mock Data
import { usePetStore } from '../store/petStore';

export default function LandingPage() {
  // Always show the starting portal animation on every page refresh / load
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const navigate = useNavigate();
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'guidelines' | 'contact' | null>(null);
  const { alerts } = usePetStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#241812] selection:bg-[#DE6828]/20 selection:text-[#B54C14]">
      {/* Entry Screen Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <EnterScreen onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      {/* 1. Header Navigation */}
      <Header
        onOpenHowItWorks={() => {
          const el = document.getElementById('feature-card-biometric');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCommunity={() => navigate('/community')}
        onOpenFeatures={() => {
          const el = document.getElementById('feature-card-biometric');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenProfile={() => navigate('/dashboard')}
        onOpenAlerts={() => navigate('/lost')}
        activeAlertCount={alerts.filter((a) => a.status === 'active').length}
      />

      {/* 2. Hero Section matching screenshot */}
      <main className="relative z-10 flex-1">
        <Hero
          onJoinClick={() => navigate('/setup-profile')}
          onOpenOliveProfile={() => navigate('/pets/pet-olive')}
          onOpenLostAlert={() => navigate('/lost')}
        />

        {/* 3. Feature Bento Cards: "ONE PLACE TO KEEP THEM SAFE" */}
        <FeaturesSection
          onOpenBiometric={() => navigate('/scan')}
          onOpenNetwork={() => navigate('/community')}
          onOpenQrTags={() => navigate('/scan')}
        />

        {/* 4. Espresso Dark Section: "SIMPLE FROM DAY ONE" */}
        <StepsDarkSection
          onStep1Click={() => navigate('/setup-profile')}
          onStep2Click={() => navigate('/community')}
          onStep3Click={() => navigate('/lost')}
        />

        {/* 5. Bottom Call to Action: "YOUR NEIGHBORHOOD, CONNECTED" */}
        <CtaSection onStartClick={() => navigate('/setup-profile')} />
      </main>

      {/* 6. Footer matching screenshot */}
      <div className="relative z-10">
        <Footer
          onOpenPrivacy={() => setInfoModalType('privacy')}
          onOpenGuidelines={() => setInfoModalType('guidelines')}
          onOpenContact={() => setInfoModalType('contact')}
        />
      </div>

      <InfoModal
        isOpen={infoModalType !== null}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </div>
  );
}
