import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PawIcon } from '../components/Header';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-[var(--color-border)] flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-bone)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-[var(--color-ink)]">
          <PawIcon className="w-8 h-8 opacity-50" />
        </div>
        
        <h1 className="font-serif text-4xl font-bold text-[var(--color-ink)] mb-3">Lost the scent?</h1>
        <p className="text-[var(--color-ink-soft)] text-sm mb-8 leading-relaxed max-w-[280px]">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <div className="space-y-3 w-full">
          <button 
            onClick={() => navigate(-1)}
            className="w-full py-3.5 px-6 rounded-xl border-2 border-[var(--color-border)] font-bold text-sm text-[var(--color-ink)] flex items-center justify-center gap-2 hover:bg-[var(--color-bone)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-3.5 px-6 rounded-xl bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
