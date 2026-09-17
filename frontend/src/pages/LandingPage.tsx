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
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TrustSection } from '../components/TrustSection';
import { CommunitySection } from '../components/CommunitySection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';

import { InfoModal } from '../components/modals/InfoModal';

import { usePetStore } from '../store/petStore';

export default function LandingPage() {
  const navigate = useNavigate();
  // Always show the starting portal animation on every page refresh / load
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'guidelines' | 'contact' | null>(null);

  const { alerts } = usePetStore();

  useEffect(() => {
    // Only initialize smooth scrolling and parallax if user hasn't requested reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Dynamic import to avoid SSR/build issues with Lenis
    let lenis: any;
    let requestAnimationFrameId: number;

    import('lenis').then((LenisModule) => {
      const Lenis = LenisModule.default;
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrameId = requestAnimationFrame(raf);
      }
      requestAnimationFrameId = requestAnimationFrame(raf);
    });

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      if (requestAnimationFrameId) {
        cancelAnimationFrame(requestAnimationFrameId);
      }
    };
  }, []);

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
          const el = document.getElementById('how-it-works');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCommunity={() => {
          const el = document.getElementById('community-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFeatures={() => {
          const el = document.getElementById('how-it-works');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenProfile={() => navigate('/dashboard')}
        onOpenAlerts={() => navigate('/dashboard')}
        onOpenIdentify={() => navigate('/scan')}
        activeAlertCount={alerts.filter((a) => a.status === 'active').length}
      />

      {/* 2. Hero Section */}
      <main className="relative z-10 flex-1">
        <Hero
          onJoinClick={() => navigate('/setup-profile')}
          onIdentifyClick={() => navigate('/scan')}
        />

        {/* 3. How It Works */}
        <HowItWorksSection />

        {/* 4. Trust + Nose Print */}
        <TrustSection />

        {/* 5. Community + Recovery */}
        <CommunitySection />

        {/* 6. Bottom Call to Action */}
        <CtaSection onStartClick={() => navigate('/setup-profile')} />
      </main>

      {/* 6. Footer */}
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
