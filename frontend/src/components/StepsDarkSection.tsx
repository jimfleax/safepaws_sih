import React from 'react';

interface StepsDarkSectionProps {
  onStep1Click: () => void;
  onStep2Click: () => void;
  onStep3Click: () => void;
}

export const StepsDarkSection: React.FC<StepsDarkSectionProps> = ({
  onStep1Click,
  onStep2Click,
  onStep3Click,
}) => {
  return (
    <section className="w-full bg-[var(--color-ink)] text-[var(--color-bone)] py-20 sm:py-28 lg:py-32 my-8 relative overflow-hidden">
      {/* Background Noise */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />
      
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 lg:mb-32">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-[var(--color-bone)]/30" />
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[var(--color-bone)]/60 uppercase">
                Simple From Day One
              </span>
            </div>
            <h2 className="font-serif text-[40px] sm:text-[52px] text-[var(--color-bone)] leading-tight max-w-lg">
              The fastest path to<br/>peace of mind.
            </h2>
          </div>
          <p className="text-[16px] text-[var(--color-bone)]/60 max-w-sm md:pb-3">
            A seamless three-step process designed to remove friction when every second counts.
          </p>
        </div>

        {/* Progression Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8">
          
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[15%] right-[25%] h-[1px] bg-gradient-to-r from-[var(--color-bone)]/20 via-[var(--color-bone)]/20 to-transparent" />

          {/* Step 01 */}
          <div
            onClick={onStep1Click}
            className="group relative flex flex-col items-start cursor-pointer transition-transform hover:-translate-y-2 md:pt-0"
          >
            <div className="flex flex-col gap-6 mb-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface)]/10 border border-[var(--color-bone)]/20 flex items-center justify-center font-serif text-[22px] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-bone)] transition-colors relative z-10">
                1
              </div>
              <h3 className="font-serif text-[28px] sm:text-[32px] text-[var(--color-bone)] tracking-tight">
                Create a profile
              </h3>
            </div>
            <p className="text-[16px] leading-[1.6] text-[var(--color-bone)]/60 max-w-[280px]">
              Add your pet's connection and a few identifying details to establish their baseline identity.
            </p>
          </div>

          {/* Step 02 */}
          <div
            onClick={onStep2Click}
            className="group relative flex flex-col items-start cursor-pointer transition-transform hover:-translate-y-2 md:pt-16"
          >
            <div className="flex flex-col gap-6 mb-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface)]/10 border border-[var(--color-bone)]/20 flex items-center justify-center font-serif text-[22px] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-bone)] transition-colors relative z-10">
                2
              </div>
              <h3 className="font-serif text-[28px] sm:text-[32px] text-[var(--color-bone)] tracking-tight">
                Stay connected
              </h3>
            </div>
            <p className="text-[16px] leading-[1.6] text-[var(--color-bone)]/60 max-w-[280px]">
              Join nearby neighbors who look out for pets together. Build a hyper-local safety net.
            </p>
          </div>

          {/* Step 03 */}
          <div
            onClick={onStep3Click}
            className="group relative flex flex-col items-start cursor-pointer transition-transform hover:-translate-y-2 md:pt-32"
          >
            <div className="flex flex-col gap-6 mb-6">
              <div className="w-14 h-14 rounded-full bg-[var(--color-surface)]/10 border border-[var(--color-bone)]/20 flex items-center justify-center font-serif text-[22px] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-[var(--color-bone)] transition-colors relative z-10">
                3
              </div>
              <h3 className="font-serif text-[28px] sm:text-[32px] text-[var(--color-bone)] tracking-tight">
                Bring them home
              </h3>
            </div>
            <p className="text-[16px] leading-[1.6] text-[var(--color-bone)]/60 max-w-[280px]">
              Share a clear alert when it matters most, instantly activating your community's response.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
