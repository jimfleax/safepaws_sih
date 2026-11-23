/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { EnterScreen } from '../components/EnterScreen';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FeaturesSection } from '../components/FeaturesSection';
import { ScannerTeaserSection } from '../components/ScannerTeaserSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { PrivacySection } from '../components/PrivacySection';
import { CommunitySection } from '../components/CommunitySection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';
import { InfoModal } from '../components/modals/InfoModal';

import { useAuthStore } from '../store/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import { usePetStore } from '../store/petStore';

export default function LandingPage() {
  const navigate = useNavigate();
  const [hasEntered, setHasEntered] = useState<boolean>(() => sessionStorage.getItem('hasEntered') === 'true');
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'guidelines' | 'contact' | null>(null);

  const { alerts } = usePetStore();
  const { isAuthenticated, user, setAuth } = useAuthStore();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAuth({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture,
            profileCompleted: data.user.profileCompleted,
          });

          if (!data.user.profileCompleted) {
            navigate('/setup-profile');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to authenticate with backend', err);
      }
    },
    onError: (error) => console.error('Login Failed', error),
  });

  const handleJoinClick = () => {
    if (isAuthenticated) {
      if (user?.profileCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/setup-profile');
      }
    } else {
      googleLogin();
    }
  };

  useEffect(() => {
    // Lenis smooth scroll is authorized exclusively on desktop viewports (>= 768px)
    // and when user hasn't requested reduced motion (UX-06.1 Section 4.1)
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobileViewport =
      typeof window !== 'undefined' && window.innerWidth < 768;

    if (prefersReducedMotion || isMobileViewport) return;

    let lenis: any = null;
    let tickerCallback: ((time: number) => void) | null = null;
    let isDisposed = false;

    import('lenis').then((LenisModule) => {
      if (isDisposed) return;
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

      // Synchronize Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      tickerCallback = (time: number) => {
        if (lenis) {
          lenis.raf(time * 1000);
        }
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      isDisposed = true;
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      if (tickerCallback) {
        gsap.ticker.remove(tickerCallback);
        tickerCallback = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-ink)] selection:bg-[var(--color-accent)]/20 selection:text-[var(--color-ink)] transition-colors duration-[var(--animate-duration-page)] overflow-x-hidden max-w-full">
      {/* Entry Screen Overlay */}
      <AnimatePresence>
        {!hasEntered && <EnterScreen onEnter={() => setHasEntered(true)} />}
      </AnimatePresence>

      {/* 1. Header Navigation */}
      <Header
        onOpenHowItWorks={() => {
          const el = document.getElementById('how-it-works');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCommunity={() => navigate('/community')}
        onOpenFeatures={() => {
          const el = document.getElementById('features');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenProfile={() => navigate('/dashboard')}
        onOpenAlerts={() => navigate('/lost')}
        onOpenIdentify={() => navigate('/scan')}
        activeAlertCount={alerts?.length || 0}
      />

      {/* Main Landing Flow */}
      <main id="main-content" tabIndex={-1} className="outline-none relative z-10 flex-1">
        {/* Section A: Signature Hero */}
        <Hero
          onJoinClick={handleJoinClick}
          onIdentifyClick={() => navigate('/scan')}
          onOpenLostAlerts={() => navigate('/lost')}
          activeAlertCount={alerts?.filter(a => a.status === 'active')?.length || 0}
        />

        {/* Section B: Feature Showcase / Interactive Bento */}
        <FeaturesSection
          onOpenBiometric={() => navigate('/scan')}
          onOpenNetwork={() => navigate('/community')}
          onOpenQrTags={handleJoinClick}
          onOpenAlerts={() => navigate('/lost')}
          onOpenSightings={() => navigate('/sightings/new')}
          onOpenManagement={() => navigate('/dashboard')}
        />

        {/* Section C: Biometric Scanner Teaser */}
        <ScannerTeaserSection onOpenScan={() => navigate('/scan')} />

        {/* Section D: How SafePaws Works (5-Step Reunion Cycle) */}
        <HowItWorksSection
          onStep1Click={handleJoinClick}
          onStep2Click={handleJoinClick}
          onStep3Click={handleJoinClick}
          onStep4Click={() => navigate('/community')}
          onStep5Click={() => navigate('/community')}
        />

        {/* Section E: Privacy and Consent Transparency */}
        <PrivacySection onOpenPrivacy={() => setInfoModalType('privacy')} />

        {/* Section F: Community Recovery Preview & Metrics */}
        <CommunitySection
          onOpenCommunity={() => navigate('/community')}
          onOpenAlerts={() => navigate('/lost')}
          onOpenReportSighting={() => navigate('/sightings/new')}
        />

        {/* Section G: Closing Signature Call to Action */}
        <CtaSection
          onStartClick={handleJoinClick}
          onScanClick={() => navigate('/scan')}
        />
      </main>

      {/* Section H: Refined Footer */}
      <div className="relative z-10">
        <Footer
          onOpenPrivacy={() => setInfoModalType('privacy')}
          onOpenGuidelines={() => setInfoModalType('guidelines')}
          onOpenContact={() => setInfoModalType('contact')}
        />
      </div>

      {/* Info Modals for Governance & Privacy */}
      <InfoModal
        isOpen={infoModalType !== null}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </div>
  );
}
