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
import { HowItWorksSection } from '../components/HowItWorksSection';
import { TrustSection } from '../components/TrustSection';
import { CommunitySection } from '../components/CommunitySection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';

import { InfoModal } from '../components/modals/InfoModal';

import { useAuthStore } from '../store/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import { usePetStore } from '../store/petStore';

export default function LandingPage() {
  const navigate = useNavigate();
  // Always show the starting portal animation on every page refresh / load
  const [hasEntered, setHasEntered] = useState<boolean>(false);
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
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setAuth({
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            picture: data.user.picture,
            profileCompleted: data.user.profileCompleted
          });
          
          if (!data.user.profileCompleted) {
            navigate('/setup-profile');
          } else {
            navigate('/pets/new');
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
        navigate('/pets/new');
      } else {
        navigate('/setup-profile');
      }
    } else {
      googleLogin();
    }
  };

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

      // Synchronize Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
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
        onOpenCommunity={() => navigate('/community')}
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
          onJoinClick={handleJoinClick}
          onIdentifyClick={() => navigate('/scan')}
        />

        {/* 3. How It Works */}
        <HowItWorksSection />

        {/* 4. Trust + Nose Print */}
        <TrustSection />

        {/* 5. Community + Recovery */}
        <CommunitySection />

        {/* 6. Bottom Call to Action */}
        <CtaSection onStartClick={handleJoinClick} />
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
