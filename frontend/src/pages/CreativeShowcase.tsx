import React, { useState } from 'react';
import {
  VariableProximityText,
  InteractiveSticker,
  FieldButton,
  LedgerCard,
  AtmosphericBackground,
} from '../components/ui';
import { ShieldAlert, Compass, Search, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function CreativeShowcase() {
  const [lastPeelEvent, setLastPeelEvent] = useState<string>('None (Sealed)');
  const [detailedPeelState, setDetailedPeelState] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen bg-[#F6F1E7] text-[#1C1A17] font-sans selection:bg-[#E2811F]/20 selection:text-[#8B4A00]">
      {/* 1. Cinematic Atmospheric Background (Grain + Floating Motes) */}
      <AtmosphericBackground showGrain showMotes moteCount={24} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        {/* Internal Dev Harness Quarantine Banner */}
        <div className="mb-8 p-3.5 bg-[#FAF7F2] border border-[#1C1A17]/20 rounded-xs flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#8B4A00]" />
            <span className="font-mono font-bold uppercase tracking-wider text-[#1C1A17]">
              INTERNAL CREATIVE REVIEW HARNESS ONLY
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#6E665C] tracking-tight">
            QUARANTINED FROM 13 PUBLIC PRODUCTION ROUTES // DEV PARAM ACTIVE
          </span>
        </div>

        {/* Header Telemetry */}
        <div className="flex flex-wrap items-center justify-between border-b border-[#1C1A17]/15 pb-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E2811F] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#1C1A17]">
              SAFEPAWS ATELIER // INCREMENT 1R CRAFT AUDIT
            </span>
          </div>
          <div className="font-mono text-xs text-[#6E665C]">
            FIELD DISPATCH & RECOVERY LEDGER // TACTILE EDITORIAL PRECISION
          </div>
        </div>

        {/* Section 1: Signature Variable Typography */}
        <section className="mb-14">
          <div className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B4A00] font-bold">
              01 // SIGNATURE VARIABLE TYPOGRAPHY (NEWSREADER AXIS MODULATION)
            </span>
          </div>
          <div className="p-6 sm:p-8 bg-white/75 backdrop-blur-md rounded-sm border border-[#1C1A17]/15 shadow-sm">
            <VariableProximityText
              text="The Field Dispatch & Recovery Ledger"
              as="h1"
              className="text-3xl sm:text-5xl lg:text-6xl text-[#1C1A17] font-bold mb-4"
              radius={260}
              minWeight={600}
              maxWeight={800}
            />
            <p className="font-sans text-sm sm:text-base text-[#6E665C] max-w-2xl leading-relaxed">
              Hover pointer across the heading above to observe the Gaussian elastic weight (wght: 600..800)
              and optical size (opsz: 14..72) modulation. Automatically deactivates on touchscreens to preserve 60 FPS
              and bypasses instantly under reduced-motion settings.
            </p>
          </div>
        </section>

        {/* Section 2: Physical Interactive Stickers */}
        <section className="mb-14">
          <div className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B4A00] font-bold">
              02 // PHYSICAL TACTILE PEELABLE STICKERS (3D CURLING & FOIL REVERSE)
            </span>
          </div>
          <div className="p-6 sm:p-8 bg-white/75 backdrop-blur-md rounded-sm border border-[#1C1A17]/15 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="font-sans text-sm text-[#6E665C]">
                Drag the top-right corner or press <kbd className="px-1.5 py-0.5 bg-[#EFE9DD] border border-[#1C1A17]/20 rounded text-xs font-mono">Enter</kbd> to inspect the metallic foil reverse side and archival registry seal:
              </p>
              <span className="font-mono text-xs text-[#8B4A00] font-semibold">
                Status: {lastPeelEvent}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 justify-items-center py-4">
              <div className="flex flex-col items-center">
                <InteractiveSticker
                  title="VERIFIED IDENTITY"
                  serialNumber="REG-2026-SP-8941"
                  subtitle="CANINE BIOMETRIC HASH"
                  variant="gold"
                  size="md"
                  onPeelStateChange={(peeled) =>
                    setLastPeelEvent(peeled ? 'Gold Seal Inspected' : 'Gold Seal Resealed')
                  }
                />
                <p className="text-center font-mono text-[10px] text-[#6E665C] mt-3">
                  VARIANT: GOLD LEAF FOIL
                </p>
              </div>

              <div className="flex flex-col items-center">
                <InteractiveSticker
                  title="EMERGENCY DISPATCH"
                  serialNumber="ALERT-2026-ACT-102"
                  subtitle="ACTIVE MISSING BROADCAST"
                  variant="clay"
                  size="md"
                  onPeelStateChange={(peeled) =>
                    setLastPeelEvent(peeled ? 'Clay Seal Inspected' : 'Clay Seal Resealed')
                  }
                />
                <p className="text-center font-mono text-[10px] text-[#6E665C] mt-3">
                  VARIANT: ALERT CLAY
                </p>
              </div>

              <div className="flex flex-col items-center">
                <InteractiveSticker
                  title="OFFICIAL REGISTRY"
                  serialNumber="CAN-VET-9800-44"
                  subtitle="TAMPER EVIDENT DOCKET"
                  variant="obsidian"
                  size="md"
                  onPeelStateChange={(peeled) =>
                    setLastPeelEvent(peeled ? 'Obsidian Seal Inspected' : 'Obsidian Seal Resealed')
                  }
                />
                <p className="text-center font-mono text-[10px] text-[#6E665C] mt-3">
                  VARIANT: OBSIDIAN INK
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2B: High-Resolution Dedicated Sticker Close-Up Inspection Canvas */}
        <section className="mb-14">
          <div className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B4A00] font-bold">
              02B // HIGH-RESOLUTION STICKER FORENSIC CLOSE-UP
            </span>
          </div>
          <div className="p-8 sm:p-12 bg-white/80 backdrop-blur-md rounded-sm border border-[#1C1A17]/15 shadow-sm flex flex-col items-center text-center">
            <div id="high-res-sticker-inspection" className="py-4">
              <InteractiveSticker
                title="ARCHIVAL CERTIFICATE SEAL"
                serialNumber="CERT-9082-SP-HQ"
                subtitle="CRYPTOGRAPHIC BIOMETRIC PROVENANCE"
                variant="gold"
                size="lg"
                onPeelStateChange={(peeled) => setDetailedPeelState(peeled)}
              />
            </div>
            <div className="mt-4 font-mono text-xs text-[#6E665C]">
              LARGE-SCALE SPECIMEN (60x60) // INSPECT METALLIC REVERSE FOIL & ARCHIVAL SEAL: {detailedPeelState ? 'PEELED / INSPECTED' : 'SEALED'}
            </div>
          </div>
        </section>

        {/* Section 3: Distinctive Field Buttons */}
        <section className="mb-14">
          <div className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B4A00] font-bold">
              03 // TACTILE FIELD DISPATCH BUTTONS
            </span>
          </div>
          <div className="p-6 sm:p-8 bg-white/75 backdrop-blur-md rounded-sm border border-[#1C1A17]/15 shadow-sm">
            <p className="font-sans text-sm text-[#6E665C] mb-6">
              Precision mechanical press physics, 1px ruled borders, monospaced metadata sub-tags, and strict &ge; 48px touch targets:
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <FieldButton
                variant="primary"
                metadata="TACTICAL ACTION"
                icon={<Search className="w-4 h-4 text-[#E2811F]" />}
              >
                Initiate Grid Search
              </FieldButton>

              <FieldButton
                variant="secondary"
                metadata="ARCHIVAL DOSSIER"
                icon={<Compass className="w-4 h-4 text-[#1C1A17]" />}
              >
                View Coordinates
              </FieldButton>

              <FieldButton
                variant="alert"
                metadata="IMMEDIATE BROADCAST"
                icon={<ShieldAlert className="w-4 h-4 text-white" />}
              >
                Declare Emergency
              </FieldButton>

              <FieldButton
                variant="outline"
                metadata="SECURITY SEAL"
                icon={<Award className="w-4 h-4 text-[#8B4A00]" />}
              >
                Inspect Seal
              </FieldButton>
            </div>
          </div>
        </section>

        {/* Section 4: Recovery Ledger Cards */}
        <section className="mb-14">
          <div className="mb-3">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8B4A00] font-bold">
              04 // RECOVERY LEDGER DOCKET CARDS
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <LedgerCard
              status="missing"
              referenceId="ALERT-8941"
              telemetry="37.7749° N, 122.4194° W // LAST SEEN 14:20 PST"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1A17] mb-1">
                    Barnaby — Golden Retriever
                  </h3>
                  <p className="font-sans text-xs text-[#6E665C] leading-relaxed">
                    Wearing red reflective collar with SafePaws aluminum QR tag #TAG-8941. Microchip verified on record.
                  </p>
                </div>
                <div className="shrink-0 px-2 py-1 bg-[#B3452F]/10 text-[#B3452F] font-mono text-[9px] font-bold rounded-xs">
                  PRIORITY: CRITICAL
                </div>
              </div>
            </LedgerCard>

            <LedgerCard
              status="sighting"
              referenceId="SGT-2026-092"
              telemetry="37.7792° N, 122.4210° W // REC: 22 MIN AGO"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#1C1A17] mb-1">
                    Community Field Sighting
                  </h3>
                  <p className="font-sans text-xs text-[#6E665C] leading-relaxed">
                    Golden Retriever observed resting near Conservatory of Flowers trailhead. Unverified citizen report.
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1 px-2 py-1 bg-[#E2811F]/15 text-[#8B4A00] font-mono text-[9px] font-bold rounded-xs">
                  <CheckCircle2 className="w-3 h-3 text-[#E2811F]" />
                  UNVERIFIED
                </div>
              </div>
            </LedgerCard>
          </div>
          <p className="font-mono text-[10px] text-[#6E665C] mt-2">
            * NOTE: Telemetry coordinates above are archival formatting specimens for testing layout overflow; live coordinates are provided by authenticated field dispatches only.
          </p>
        </section>

        {/* Footer */}
        <div className="border-t border-[#1C1A17]/15 pt-6 text-center">
          <p className="font-mono text-xs text-[#6E665C]">
            SAFEPAWS DIRECTION 1: THE FIELD DISPATCH & RECOVERY LEDGER // CRAFT RATIFIED
          </p>
        </div>
      </div>
    </div>
  );
}
