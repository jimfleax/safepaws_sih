import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CommunityOnboarding from './CommunityOnboarding';

// Mock DashboardNav
vi.mock('../components/DashboardNav', () => ({
  DashboardNav: () => <nav data-testid="dashboard-nav" />,
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock AuthStore
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    user: { id: 'user-test', name: 'Dr. Sarah', neighborhood: 'Greenwood Sector' },
    isAuthenticated: true,
  }),
}));

describe('CommunityOnboarding Component (Phase 2A & ERR-C-01)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockImplementation((url: string, opts?: any) => {
      if (url.includes('/api/v1/community/preferences') && opts?.method === 'POST') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ interests: ['lost-found', 'sightings'] }) });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ interests: ['lost-found', 'sightings'] }),
      });
    });
  });

  it('renders dynamic neighborhood and strictly 4 canonical channels', async () => {
    render(
      <MemoryRouter>
        <CommunityOnboarding />
      </MemoryRouter>
    );

    // Verify dynamic neighborhood is used instead of hardcoded Connaught Place
    expect(screen.getByText(/Greenwood Sector recovery corridor/i)).toBeInTheDocument();
    expect(screen.queryByText(/Connaught Place/i)).not.toBeInTheDocument();

    // Verify strictly 4 canonical channels
    expect(screen.getByText('Lost & Found Alerts')).toBeInTheDocument();
    expect(screen.getByText('Field Observations & Sightings')).toBeInTheDocument();
    expect(screen.getByText('General Neighborhood Network')).toBeInTheDocument();
    expect(screen.getByText('Reunion Stories & Case Archives')).toBeInTheDocument();

    // Verify legacy/fictional channels are absent
    expect(screen.queryByText('Urgent Recovery')).not.toBeInTheDocument();
    expect(screen.queryByText('Adoption Desk')).not.toBeInTheDocument();
  });

  it('verifies ERR-C-01 contrast remediation: Carbon Ink text on Marigold', async () => {
    render(
      <MemoryRouter>
        <CommunityOnboarding />
      </MemoryRouter>
    );

    // Primary action button must use text-[#1C1A17] on bg-[var(--color-marigold)]
    const submitBtn = screen.getByRole('button', { name: /enlist in guild/i });
    expect(submitBtn).toBeInTheDocument();
    expect(submitBtn.className).toContain('text-[#1C1A17]');
    expect(submitBtn.className).not.toContain('text-white');

    // Touch target minimum: min-h-[48px] (mobile) or sm:min-h-[44px]
    expect(submitBtn.className).toContain('min-h-[48px]');

    // "Skip for now" link must also meet minimum touch target
    const skipBtn = screen.getByRole('button', { name: /skip for now/i });
    expect(skipBtn.className).toContain('min-h-[48px]');
  });

  it('handles preference toggle and submission', async () => {
    render(
      <MemoryRouter>
        <CommunityOnboarding />
      </MemoryRouter>
    );

    const generalTile = screen.getByText('General Neighborhood Network').closest('[role="checkbox"]');
    expect(generalTile).toBeInTheDocument();
    
    // Toggle General channel
    fireEvent.click(generalTile!);

    // Submit
    const submitBtn = screen.getByRole('button', { name: /enlist in guild/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/v1/community/preferences',
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(mockNavigate).toHaveBeenCalledWith('/community?channel=lost-found');
    });
  });
});
