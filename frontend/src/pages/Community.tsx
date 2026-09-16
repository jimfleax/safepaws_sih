import React from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { MapPin, Clock, Camera } from 'lucide-react';

export default function Community() {
  const { sightings } = usePetStore();

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col md:flex-row pb-20 md:pb-0">
      <DashboardNav />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-[var(--color-ink)] flex items-center gap-3">
            <Camera className="w-8 h-8 text-[var(--color-accent)]" />
            Community Sightings
          </h1>
          <p className="text-[var(--color-ink-soft)] mt-2">
            Recent activity and reports from the neighborhood network.
          </p>
        </div>

        {sightings.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[var(--color-border)]">
            <p className="text-[var(--color-ink-soft)]">No recent sightings in your area.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sightings.map(sighting => (
              <div key={sighting.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[var(--color-border)] hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 bg-[var(--color-bone)] relative flex items-center justify-center">
                  {/* Real photos would go here. For now, a placeholder or map pin if no photo is attached to sighting */}
                  <MapPin className="w-8 h-8 text-[var(--color-ink-soft)]/30" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-[var(--color-ink)] shadow-sm">
                    {sighting.reporterName}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm text-[var(--color-ink)] font-medium">
                        <MapPin className="w-4 h-4 text-[var(--color-accent)]" />
                        {sighting.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[var(--color-ink-soft)]">
                        <Clock className="w-3.5 h-3.5" />
                        {sighting.time}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--color-ink)] mt-auto leading-relaxed border-t border-[var(--color-border)] pt-3">
                    "{sighting.notes}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
