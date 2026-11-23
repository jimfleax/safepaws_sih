import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroMicroPreview } from './HeroMicroPreview';

describe('HeroMicroPreview Component', () => {
  it('renders biometric interactive canvas with mode switcher and initial reticle mode', () => {
    render(<HeroMicroPreview />);

    expect(screen.getByRole('region', { name: /interactive biometric scanner micro-preview/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /reticle/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /128-d mesh/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /density/i })).toBeInTheDocument();
    expect(screen.getByText(/OPTICAL ENROLLMENT READY/i)).toBeInTheDocument();
  });

  it('switches between preview modes when tabs are clicked', async () => {
    const user = userEvent.setup();
    render(<HeroMicroPreview />);

    const meshTab = screen.getByRole('tab', { name: /128-d mesh/i });
    await user.click(meshTab);

    expect(meshTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: /reticle/i })).toHaveAttribute('aria-selected', 'false');
  });

  it('triggers simulated biometric match and displays confirmed companion dossier', async () => {
    vi.useFakeTimers();
    render(<HeroMicroPreview />);

    const scanButton = screen.getByRole('button', { name: /test scan/i });
    act(() => {
      scanButton.click();
    });

    expect(screen.getByText(/CALIBRATING RETICLE/i)).toBeInTheDocument();

    // Advance past calibrating and extracting
    act(() => {
      vi.advanceTimersByTime(750);
    });

    expect(screen.getByText(/EXTRACTING 128-D EMBEDDING/i)).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(950);
    });

    // Verified match state
    expect(screen.getByText('Cooper')).toBeInTheDocument();
    expect(screen.getByText('GOLDEN RETRIEVER')).toBeInTheDocument();
    expect(screen.getByText(/CONFIDENCE: 99.84%/i)).toBeInTheDocument();
    expect(screen.getByText(/SECURE GUARDIAN RELAY READY/i)).toBeInTheDocument();

    // Reset scan
    const resetButton = screen.getByRole('button', { name: /reset biometric scanner preview/i });
    act(() => {
      resetButton.click();
    });

    expect(screen.getByText(/OPTICAL ENROLLMENT READY/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
