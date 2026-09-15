/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { EnterScreen } from '../components/EnterScreen';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { FeaturesSection } from '../components/FeaturesSection';
import { StepsDarkSection } from '../components/StepsDarkSection';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';

// Modals
import { PetProfileModal } from '../components/modals/PetProfileModal';
import { QrTagModal } from '../components/modals/QrTagModal';
import { LostAlertModal } from '../components/modals/LostAlertModal';
import { BiometricModal } from '../components/modals/BiometricModal';
import { CommunityModal } from '../components/modals/CommunityModal';
import { HowItWorksModal } from '../components/modals/HowItWorksModal';
import { InfoModal } from '../components/modals/InfoModal';

// Mock Data
import { initialPets, sampleAlerts, sampleSightings } from '../data/mockData';
import { Pet, NeighborhoodAlert, CommunitySighting } from '../types';

import { usePetStore } from '../store/petStore';

export default function LandingPage() {
  // Always show the starting portal animation on every page refresh / load
  const [hasEntered, setHasEntered] = useState<boolean>(false);

  const { 
    pets, 
    selectedPetId, 
    alerts, 
    sightings,
    addPet: handleSavePet,
    removePet: handleRemovePet,
    setSelectedPetId,
    triggerLostAlert,
    addSighting: handleAddSighting,
    resolveAlert: handleResolveAlert
  } = usePetStore();

  // Modal Visibility States
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isLostAlertModalOpen, setIsLostAlertModalOpen] = useState(false);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isCommunityModalOpen, setIsCommunityModalOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'privacy' | 'guidelines' | 'contact' | null>(null);

  const activePet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const activeAlert = alerts[0] || {
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
  };

  const handleOpenQrForPet = (pet: Pet) => {
    setSelectedPetId(pet.id);
    setIsProfileModalOpen(false);
    setIsQrModalOpen(true);
  };

  const handleTriggerLostAlertForPet = (pet: Pet) => {
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
      lastSeenAddress: 'Oakridge & Elm Hills',
      description: `${pet.name} was marked missing. Broadcast activated to neighborhood radar.`,
      sightingsCount: 0,
    };
    triggerLostAlert(pet, newAlert);
    setIsProfileModalOpen(false);
    setIsLostAlertModalOpen(true);
  };

  const isAnyModalOpen =
    isProfileModalOpen ||
    isQrModalOpen ||
    isLostAlertModalOpen ||
    isBiometricModalOpen ||
    isCommunityModalOpen ||
    isHowItWorksOpen ||
    infoModalType !== null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] text-[#241812] selection:bg-[#DE6828]/20 selection:text-[#B54C14]">
      {/* Clean Custom Cursor: inner dot follows immediately, outer circle lags smoothly with no blur */}

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
        onOpenAlerts={() => setIsLostAlertModalOpen(true)}
        activeAlertCount={alerts.filter((a) => a.status === 'active').length}
      />

      {/* 2. Hero Section matching screenshot */}
      <main className="relative z-10 flex-1">
        <Hero
          onJoinClick={() => setIsProfileModalOpen(true)}
          onOpenOliveProfile={() => {
            setSelectedPetId('pet-olive');
            setIsProfileModalOpen(true);
          }}
          onOpenLostAlert={() => setIsLostAlertModalOpen(true)}
        />

        {/* 3. Feature Bento Cards: "ONE PLACE TO KEEP THEM SAFE" */}
        <FeaturesSection
          onOpenBiometric={() => setIsBiometricModalOpen(true)}
          onOpenNetwork={() => setIsCommunityModalOpen(true)}
          onOpenQrTags={() => setIsQrModalOpen(true)}
        />

        {/* 4. Espresso Dark Section: "SIMPLE FROM DAY ONE" */}
        <StepsDarkSection
          onStep1Click={() => setIsProfileModalOpen(true)}
          onStep2Click={() => setIsCommunityModalOpen(true)}
          onStep3Click={() => setIsLostAlertModalOpen(true)}
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

      <QrTagModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        pet={activePet}
        onReportSighting={(loc, note) => {
          handleAddSighting({
            id: `sight-${Date.now()}`,
            alertId: activeAlert.id,
            reporterName: 'Good Samaritan (QR Tag Scan)',
            location: loc,
            time: 'Just now',
            notes: note,
            confirmed: true,
          });
        }}
      />

      <LostAlertModal
        isOpen={isLostAlertModalOpen}
        onClose={() => setIsLostAlertModalOpen(false)}
        pet={activePet}
        alert={activeAlert}
        sightings={sightings}
        onAddSighting={handleAddSighting}
        onResolveAlert={handleResolveAlert}
      />

      <BiometricModal
        isOpen={isBiometricModalOpen}
        onClose={() => setIsBiometricModalOpen(false)}
        pet={activePet}
      />

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
