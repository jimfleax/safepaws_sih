/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { CustomCursor } from './components/CustomCursor';
import { EnterScreen } from './components/EnterScreen';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturesSection } from './components/FeaturesSection';
import { StepsDarkSection } from './components/StepsDarkSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';

// Modals
import { PetProfileModal } from './components/modals/PetProfileModal';
import { QrTagModal } from './components/modals/QrTagModal';
import { LostAlertModal } from './components/modals/LostAlertModal';
import { BiometricModal } from './components/modals/BiometricModal';
import { CommunityModal } from './components/modals/CommunityModal';
import { HowItWorksModal } from './components/modals/HowItWorksModal';
import { InfoModal } from './components/modals/InfoModal';
import { IdentifyModal } from './components/modals/IdentifyModal';
import { ApiClient } from './utils/apiClient';

import { Pet, NeighborhoodAlert, CommunitySighting } from './types';

export default function App() {
  // Always show the starting portal animation on every page refresh / load
  const [hasEntered, setHasEntered] = useState<boolean>(false);

  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [alerts, setAlerts] = useState<NeighborhoodAlert[]>([]);
  const [sightings, setSightings] = useState<CommunitySighting[]>([]);
  const [pipelineMode, setPipelineMode] = useState<string>('PRODUCTION');

  useEffect(() => {
    ApiClient.getHealth()
      .then(res => setPipelineMode(res.pipeline_mode))
      .catch(err => console.error("Could not fetch pipeline mode", err));
  }, []);

  // Modal Visibility States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isLostAlertModalOpen, setIsLostAlertModalOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isIdentifyModalOpen, setIsIdentifyModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'guidelines' | 'contact' | null>(null);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const activeAlert = alerts[0] || (activePet ? {
    id: 'alert-default',
    petId: activePet.id,
    petName: activePet.name,
    breed: activePet.breed,
    photoUrl: activePet.photoUrl,
    status: 'active',
    broadcastRadiusKm: 2.5,
    notifiedNeighborsCount: 138,
    timeAgo: 'Just now',
    lastSeenAddress: 'Oakridge Park near Elm St',
    description: 'Slipped out the back gate.',
    sightingsCount: sightings.length,
  } : undefined);

  const handleSavePet = (newPet: Pet) => {
    setPets((prev) => [newPet, ...prev]);
    setSelectedPetId(newPet.id);
  };

  const handleRemovePet = (petIdToRemove: string) => {
    setPets((prev) => {
      const remaining = prev.filter((p) => p.id !== petIdToRemove);
      if (remaining.length > 0 && selectedPetId === petIdToRemove) {
        setSelectedPetId(remaining[0].id);
      }
      return remaining;
    });
  };

  const handleOpenQrForPet = (pet: Pet) => {
    setSelectedPetId(pet.id);
    setIsProfileModalOpen(false);
    setIsQrModalOpen(true);
  };

  const handleTriggerLostAlertForPet = (pet: Pet) => {
    setSelectedPetId(pet.id);
    // update pet status to lost
    setPets((prev) =>
      prev.map((p) => (p.id === pet.id ? { ...p, status: 'lost' } : p))
    );
    // add or update alert
    const newAlert: NeighborhoodAlert = {
      id: `alert-${Date.now()}`,
      petId: pet.id,
      petName: pet.name,
      breed: pet.breed,
      photoUrl: pet.photoUrl,
      status: 'active',
      broadcastRadiusKm: 2.5,
      notifiedNeighborsCount: 138,
      timeAgo: 'Just now',
      lastSeenAddress: pet.neighborhood || 'Oakridge & Elm Hills',
      description: `${pet.name} was marked missing. Broadcast activated to neighborhood radar.`,
      sightingsCount: 0,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setIsProfileModalOpen(false);
    setIsLostAlertModalOpen(true);
  };

  const handleAddSighting = async (newSighting: CommunitySighting) => {
    try {
      await ApiClient.reportSighting(newSighting);
    } catch (e) {
      console.error('Failed to report sighting to API', e);
    }
    setSightings((prev) => [newSighting, ...prev]);
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
    setPets((prev) =>
      prev.map((p) => ({ ...p, status: 'safe' }))
    );
  };

  const isAnyModalOpen =
    isProfileModalOpen ||
    isQrModalOpen ||
    isLostAlertModalOpen ||
    isBiometricModalOpen ||
    isCommunityModalOpen ||
    isIdentifyModalOpen ||
    isHowItWorksOpen ||
    infoModalType !== null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#241812] selection:bg-[#DE6828]/20 selection:text-[#B54C14]">
      {/* Prototype Indicator */}
      {pipelineMode === 'DEMONSTRATOR' && (
        <div className="fixed bottom-4 right-4 z-[999] bg-[#DE6828] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg opacity-80 pointer-events-none flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Prototype Mode
        </div>
      )}

      {/* Clean Custom Cursor: inner dot follows immediately, outer circle lags smoothly with no blur */}
      <CustomCursor isModalOpen={isAnyModalOpen} />

      {/* Entry Screen Overlay */}
      <AnimatePresence>
        {!hasEntered && (
          <EnterScreen onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      {/* 1. Header Navigation */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenCommunity={() => setIsCommunityModalOpen(true)}
        onOpenFeatures={() => {
          const el = document.getElementById('feature-card-biometric');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenAlerts={() => activePet ? setIsLostAlertModalOpen(true) : setIsProfileModalOpen(true)}
        onOpenIdentify={() => setIsIdentifyModalOpen(true)}
        activeAlertCount={alerts.filter((a) => a.status === 'active').length}
      />

      {/* 2. Hero Section matching screenshot */}
      <main className="relative z-10 flex-1">
        <Hero
          onJoinClick={() => setIsProfileModalOpen(true)}
          onOpenOliveProfile={() => {
            if (pets.length > 0) {
              setSelectedPetId(pets[0].id);
            }
            setIsProfileModalOpen(true);
          }}
          onOpenLostAlert={() => activePet ? setIsLostAlertModalOpen(true) : setIsProfileModalOpen(true)}
          onIdentifyClick={() => setIsIdentifyModalOpen(true)}
        />

        {/* 3. Feature Bento Cards: "ONE PLACE TO KEEP THEM SAFE" */}
        <FeaturesSection
          onOpenBiometric={() => activePet ? setIsBiometricModalOpen(true) : setIsProfileModalOpen(true)}
          onOpenNetwork={() => setIsCommunityModalOpen(true)}
          onOpenQrTags={() => activePet ? setIsQrModalOpen(true) : setIsProfileModalOpen(true)}
        />

        {/* 4. Espresso Dark Section: "SIMPLE FROM DAY ONE" */}
        <StepsDarkSection
          onStep1Click={() => setIsProfileModalOpen(true)}
          onStep2Click={() => setIsCommunityModalOpen(true)}
          onStep3Click={() => activePet ? setIsLostAlertModalOpen(true) : setIsProfileModalOpen(true)}
        />

        {/* 5. Bottom Call to Action: "YOUR NEIGHBORHOOD, CONNECTED" */}
        <CtaSection onStartClick={() => setIsProfileModalOpen(true)} />
      </main>

      {/* 6. Footer matching screenshot */}
      <div className="relative z-10">
        <Footer
          onOpenPrivacy={() => setInfoModalType('privacy')}
          onOpenGuidelines={() => setInfoModalType('guidelines')}
          onOpenContact={() => setInfoModalType('contact')}
        />
      </div>

      {/* Interactive Modals */}
      <PetProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        pets={pets}
        selectedPetId={selectedPetId}
        onSelectPet={(id) => setSelectedPetId(id)}
        onSavePet={handleSavePet}
        onRemovePet={handleRemovePet}
        onOpenQrTag={handleOpenQrForPet}
        onTriggerLostAlert={handleTriggerLostAlertForPet}
      />

      {activePet && (
        <QrTagModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          pet={activePet}
          onReportSighting={(loc, note) => {
            handleAddSighting({
              id: `sight-${Date.now()}`,
              alertId: activeAlert?.id || 'alert-default',
              reporterName: 'Good Samaritan (QR Tag Scan)',
              location: loc,
              time: 'Just now',
              notes: note,
              confirmed: true,
            });
          }}
        />
      )}

      {activePet && activeAlert && (
        <LostAlertModal
          isOpen={isLostAlertModalOpen}
          onClose={() => setIsLostAlertModalOpen(false)}
          pet={activePet}
          alert={activeAlert}
          sightings={sightings}
          onAddSighting={handleAddSighting}
          onResolveAlert={handleResolveAlert}
        />
      )}

      {activePet && (
        <BiometricModal
          isOpen={isBiometricModalOpen}
          onClose={() => setIsBiometricModalOpen(false)}
          pet={activePet}
        />
      )}

      <CommunityModal
        isOpen={isCommunityModalOpen}
        onClose={() => setIsCommunityModalOpen(false)}
        alerts={alerts}
        pets={pets}
        onOpenAlert={(al) => {
          setSelectedPetId(al.petId);
          setIsCommunityModalOpen(false);
          setIsLostAlertModalOpen(true);
        }}
      />

      <IdentifyModal
        isOpen={isIdentifyModalOpen}
        onClose={() => setIsIdentifyModalOpen(false)}
        pipelineMode={pipelineMode}
        onIdentifySuccess={async (res) => {
          if (res.status === 'MATCH' && res.matches.length > 0) {
             const matchedId = res.matches[0].pet_id;
             let petExists = pets.some(p => p.id === matchedId);
             if (!petExists) {
               try {
                 const fetchedPet = await ApiClient.getPet(matchedId);
                 setPets(prev => [fetchedPet, ...prev]);
               } catch (e) {
                 console.error("Failed to fetch identified pet details", e);
               }
             }
             setSelectedPetId(matchedId);
             setTimeout(() => {
                setIsIdentifyModalOpen(false);
                setIsProfileModalOpen(true);
             }, 1500);
          }
        }}
      />

      <HowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
        onGetStarted={() => setIsProfileModalOpen(true)}
      />

      <InfoModal
        isOpen={infoModalType !== null}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />
    </div>
  );
}
