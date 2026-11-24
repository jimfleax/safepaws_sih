import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LedgerStatusStamp, LedgerStampState } from './LedgerStatusStamp';

describe('LedgerStatusStamp Component', () => {
  const states: LedgerStampState[] = [
    'ACTIVE_SEARCH',
    'UNVERIFIED_SIGHTING',
    'CONFIRMED_SIGHTING',
    'REUNITED_CLOSED',
    'COMMUNITY_NOTE',
  ];

  it.each(states)('renders state "%s" with role="status" and accessible label', (state) => {
    const { container } = render(<LedgerStatusStamp state={state} jitter={0} />);
    const stamp = screen.getByRole('status');
    expect(stamp).toBeInTheDocument();
    expect(stamp).toHaveAttribute('aria-label');
  });

  it('renders ACTIVE_SEARCH with alert clay colors and uppercase tracking', () => {
    render(<LedgerStatusStamp state="ACTIVE_SEARCH" jitter={-1.5} />);
    const stamp = screen.getByRole('status');
    expect(stamp.textContent).toContain('STATUS: ACTIVE SEARCH');
    expect(stamp.className).toContain('border-[#B3452F]');
    expect(stamp.className).toContain('text-[#B3452F]');
  });

  it('renders UNVERIFIED_SIGHTING with accessible accent text color', () => {
    render(<LedgerStatusStamp state="UNVERIFIED_SIGHTING" jitter={1.2} />);
    const stamp = screen.getByRole('status');
    expect(stamp.textContent).toContain('FIELD REPORT // UNVERIFIED');
    expect(stamp.className).toContain('text-[#8B4A00]');
  });
});
