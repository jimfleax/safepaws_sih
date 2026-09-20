import React, { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { usePetStore } from '../store/petStore';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, AlertCircle, ArrowLeft, Info } from 'lucide-react';

export default function ReportLost() {
  const { pets } = usePetStore();
  const navigate = useNavigate();

  const safePets = pets.filter(p => p.status !== 'lost');
  const [selectedPet, setSelectedPet] = useState(safePets.length > 0 ? safePets[0].id : '');
  const [lastSeen, setLastSeen] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;

    const pet = pets.find(p => p.id === selectedPet);
    if (!pet) return;

    setIsSubmitting(true);
    setError('');

    try {
      const { ApiClient } = await import('../utils/apiClient');
      const res = await ApiClient.createAlert({
        petId: pet.id,
        lastSeenAddress: lastSeen,
        description: description
      });

      await usePetStore.getState().hydrate();
      navigate(`/alerts/${res.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to trigger alert. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bone)] flex flex-col md:flex-row text-[var(--color-ink)] font-sans">
      <DashboardNav />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 py-10 md:py-14 md:pb-12 pb-28">

        {/* Back */}
        <Link
          to="/lost"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[var(--color-ink-soft)] hover:text-[var(--color-ink)] transition-colors mb-8"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Recovery Board
        </Link>

        {/* Header */}
        <header className="mb-8 border-b border-[var(--color-ink)]/10 pb-6">
          <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mb-2 text-[var(--color-ink)]">
            Report a Missing Pet
          </h1>
          <p className="text-base text-[var(--color-ink-soft)] leading-relaxed">
            Triggers a community-wide alert and notifies neighbors in your area immediately.
          </p>
        </header>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-[var(--color-alert-clay)]/10 border-l-4 border-[var(--color-alert-clay)] text-[var(--color-alert-clay)] flex gap-3 items-start">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="font-medium text-sm">{error}</p>
          </div>
        )}

        {safePets.length === 0 ? (
          <div className="py-12 text-center border border-[var(--color-ink)]/10">
            <h3 className="text-xl font-serif font-bold text-[var(--color-ink)] mb-2">No Registered Pets</h3>
            <p className="text-[var(--color-ink-soft)] text-sm mb-6 max-w-sm mx-auto leading-relaxed">
              You don't have any pets registered, or all your pets are already reported as lost.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 bg-[var(--color-ink)] text-[var(--color-bone)] font-bold text-sm uppercase tracking-wider hover:opacity-90"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Broadcast notice */}
            <div className="flex gap-3 p-4 border border-[var(--color-alert-clay)]/25 bg-[var(--color-alert-clay)]/5">
              <Info size={16} className="text-[var(--color-alert-clay)] shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--color-ink-soft)] leading-relaxed">
                Your pet's profile and biometric nose print will be distributed to the local recovery network upon submission.
              </p>
            </div>

            {/* Pet select */}
            <div className="space-y-2">
              <label htmlFor="pet-select" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Which pet is missing?
              </label>
              <select
                id="pet-select"
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-[var(--color-ink)]/20 text-base focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors appearance-none cursor-pointer disabled:opacity-50"
                required
                disabled={isSubmitting}
              >
                {safePets.map(pet => (
                  <option key={pet.id} value={pet.id}>{pet.name} — {pet.breed}</option>
                ))}
              </select>
            </div>

            {/* Last seen */}
            <div className="space-y-2">
              <label htmlFor="last-seen" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Last Known Location
                <span className="text-[var(--color-alert-clay)] ml-1">*</span>
              </label>
              <input
                type="text"
                id="last-seen"
                value={lastSeen}
                onChange={(e) => setLastSeen(e.target.value)}
                placeholder="e.g. Riverside Park near the north gate"
                className="w-full px-4 py-3.5 bg-white border border-[var(--color-ink)]/20 text-base focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30 disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-[var(--color-ink-soft)]">Be as specific as possible — street names, landmarks, intersections</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-ink)]">
                Details
                <span className="text-[var(--color-alert-clay)] ml-1">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Collar color, behavior when approached, direction heading, any unusual circumstances..."
                rows={4}
                className="w-full px-4 py-3.5 bg-white border border-[var(--color-ink)]/20 text-base focus:outline-none focus:border-[var(--color-alert-clay)] transition-colors placeholder:text-[var(--color-ink)]/30 resize-none disabled:opacity-50"
                required
                disabled={isSubmitting}
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[var(--color-alert-clay)] text-white font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-opacity focus:outline-none focus:ring-4 focus:ring-[var(--color-alert-clay)]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShieldAlert size={18} />
                {isSubmitting ? 'Broadcasting…' : 'Trigger Community Alert'}
              </button>
              <p className="text-xs text-center text-[var(--color-ink-soft)] mt-3">
                This action notifies neighbors and logs to the public recovery board.
              </p>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
