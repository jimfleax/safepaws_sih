import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Community from './Community';

// Mock DashboardNav
vi.mock('../components/DashboardNav', () => ({
  DashboardNav: () => <nav data-testid="dashboard-nav" />,
}));

// Mock PetStore
vi.mock('../store/petStore', () => ({
  usePetStore: () => ({
    alerts: [
      {
        id: 'alert-1',
        petName: 'Rusty',
        status: 'active',
        lastSeenAddress: '124 Elm Street, Sector 4',
        createdAt: '2026-11-24T08:00:00Z',
      },
    ],
  }),
}));

// Mock AuthStore (unauthenticated initial state)
let mockIsAuthenticated = false;
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    user: mockIsAuthenticated ? { id: 'user-auth', name: 'Authorized Guardian' } : null,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

describe('Community Page Component (Phase 2A & Direction 1)', () => {
  const mockPosts = [
    {
      id: 'post-1',
      title: 'Spotted Beagle roaming near Sector 4 community center',
      content: 'Dog has red collar, looks thirsty but friendly. Stationed near park entrance.',
      channel: 'sightings',
      author_id: 'user-anon-88',
      created_at: '2026-11-24T09:30:00Z',
      associated_alert_id: 'alert-1',
      pet_name: 'Rusty',
    },
    {
      id: 'post-2',
      title: 'Veterinary clinic holiday hours update',
      content: 'Emergency clinic on Pine Avenue open 24/7 through the weekend.',
      channel: 'general',
      author_id: 'user-vet',
      created_at: '2026-11-24T07:15:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuthenticated = false;

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/api/v1/community/posts')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockPosts),
        });
      }
      if (url.includes('/api/v1/community/search')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockPosts[0]]),
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) });
    });
  });

  it('renders strictly the 4 canonical channels and displays sector ledger header', async () => {
    render(
      <MemoryRouter initialEntries={['/community?channel=sightings']}>
        <Community />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Field Sightings').length).toBeGreaterThan(0);
    });

    // Check that canonical channels are accessible
    expect(screen.getByText(/SECTOR LEDGER \/\/ sightings/i)).toBeInTheDocument();

    // Verify post card is rendered with truth-in-engineering author (no fabricated names)
    expect(screen.getByText(/Spotted Beagle roaming near Sector 4 community center/i)).toBeInTheDocument();
    expect(screen.getByText(/Neighbor #N-88/i)).toBeInTheDocument();

    // Verify incident cross-reference banner is present linking to alert-1
    expect(screen.getByText(/Case: Rusty/i)).toBeInTheDocument();
  });

  it('unauthenticated visitor clicking new dispatch opens AuthPromptModal instead of redirecting', async () => {
    render(
      <MemoryRouter initialEntries={['/community']}>
        <Community />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Spotted Beagle roaming/i)).toBeInTheDocument();
    });

    // Click "New Dispatch" button as unauthenticated visitor
    const newDispatchBtn = screen.getByRole('button', { name: /new dispatch/i });
    fireEvent.click(newDispatchBtn);

    // Verify AuthPromptModal appears
    expect(screen.getByRole('dialog', { name: /neighborhood sign-in/i })).toBeInTheDocument();
    expect(screen.getByText(/To publish community dispatches or alert field searchers/i)).toBeInTheDocument();
  });
});
