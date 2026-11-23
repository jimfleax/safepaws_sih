import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AlertDetail from './AlertDetail';
import { ApiClient } from '../utils/apiClient';
import { usePetStore } from '../store/petStore';

vi.mock('../utils/apiClient', () => ({
  ApiClient: {
    getAlert: vi.fn(),
    resolveAlert: vi.fn(),
  },
}));

vi.mock('../components/DashboardNav', () => ({
  DashboardNav: () => <nav data-testid="dashboard-nav" />,
}));

describe('AlertDetail — Real API Response Contract & Direct Hydration (Contract C1 & C3)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePetStore.setState({
      alerts: [],
      sightings: [],
      pets: [],
      hydrated: false,
    });
  });

  // 1. Direct navigation with no pre-hydrated store & 3. Correct flattened mapping
  it('hydrates alert directly from unhydrated store and correctly maps flattened pet_name, breed, and photo_url', async () => {
    const genuineAlertResponse = {
      id: 'alert-direct-101',
      pet_id: 'pet-direct-202',
      status: 'active',
      last_seen_address: '742 Evergreen Terrace, Springfield',
      description: 'Spotted heading toward municipal park.',
      created_at: '2026-11-23T12:00:00Z',
      pet_name: 'Barnaby',
      breed: 'Catahoula Leopard Dog',
      photo_url: 'https://images.example.com/barnaby.jpg',
      sightings: [
        {
          id: 'sighting-1',
          alert_id: 'alert-direct-101',
          reporter_name: 'Officer Higgins',
          location: 'Oak & 5th Avenue',
          notes: 'Seen resting near fountain',
          time: '2026-11-23T12:30:00Z',
          confirmed: true,
        },
      ],
    };

    (ApiClient.getAlert as any).mockResolvedValueOnce(genuineAlertResponse);

    render(
      <MemoryRouter initialEntries={['/alerts/alert-direct-101']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Hydrating Incident Dossier/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Missing: Barnaby')).toBeInTheDocument();
    });

    expect(ApiClient.getAlert).toHaveBeenCalledWith('alert-direct-101');
    expect(screen.getByText('Catahoula Leopard Dog')).toBeInTheDocument();
    expect(screen.getByText(/Spotted heading toward municipal park/i)).toBeInTheDocument();

    // 4. Actual response sightings consumed
    expect(screen.getByText('Officer Higgins')).toBeInTheDocument();
    expect(screen.getByText('Oak & 5th Avenue')).toBeInTheDocument();
    expect(screen.getByText('"Seen resting near fountain"')).toBeInTheDocument();
    expect(screen.getByText(/1 Report/i)).toBeInTheDocument();
  });

  // 2. Browser refresh / re-hydration simulation
  it('handles simulated browser refresh when store has been wiped clean', async () => {
    const refreshedAlertResponse = {
      id: 'alert-refresh-202',
      pet_id: 'pet-refresh-303',
      status: 'active',
      last_seen_address: '100 North Blvd',
      description: 'Frightened by fireworks.',
      created_at: '2026-11-23T14:00:00Z',
      pet_name: 'Luna',
      breed: 'Husky',
      photo_url: '',
      sightings: [],
    };

    // Store is empty on browser refresh
    usePetStore.setState({ alerts: [], sightings: [], hydrated: false });
    (ApiClient.getAlert as any).mockResolvedValueOnce(refreshedAlertResponse);

    render(
      <MemoryRouter initialEntries={['/alerts/alert-refresh-202']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Luna')).toBeInTheDocument();
    });
    expect(screen.getByText('Husky')).toBeInTheDocument();
  });

  // 5. Empty sightings handling
  it('renders honest empty timeline ledger when response contains empty sightings array', async () => {
    const alertWithNoSightings = {
      id: 'alert-empty-sightings',
      pet_id: 'pet-404',
      status: 'active',
      last_seen_address: 'Elm Street',
      description: 'No collar.',
      created_at: '2026-11-23T15:00:00Z',
      pet_name: 'Buster',
      breed: 'Beagle',
      photo_url: '',
      sightings: [],
    };

    (ApiClient.getAlert as any).mockResolvedValueOnce(alertWithNoSightings);

    render(
      <MemoryRouter initialEntries={['/alerts/alert-empty-sightings']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Buster')).toBeInTheDocument();
    });

    expect(screen.getByText(/No observational sightings logged yet/i)).toBeInTheDocument();
    expect(screen.getByText('0 Reports')).toBeInTheDocument();
  });

  // 6. API error and not-found states
  it('renders honest error state and return button when API returns not found', async () => {
    (ApiClient.getAlert as any).mockRejectedValueOnce(new Error('Alert not found'));

    render(
      <MemoryRouter initialEntries={['/alerts/non-existent-id']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alert not found')).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /return to recovery board/i })).toBeInTheDocument();
  });

  // 7. Public residential-address suppression (SEC-BACKEND-01)
  it('suppresses raw residential street address on public view (SEC-BACKEND-01)', async () => {
    const privateAddressAlert = {
      id: 'alert-sec-01',
      pet_id: 'pet-someone-else',
      status: 'active',
      last_seen_address: '742 Evergreen Terrace, Sector 4 — PRIVATE RESIDENCE',
      description: 'Lost near the courtyard.',
      created_at: '2026-11-23T12:00:00Z',
      pet_name: 'Milo',
      breed: 'Maine Coon',
      photo_url: '',
      sightings: [],
    };

    (ApiClient.getAlert as any).mockResolvedValueOnce(privateAddressAlert);

    render(
      <MemoryRouter initialEntries={['/alerts/alert-sec-01']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Milo')).toBeInTheDocument();
    });

    // Invariant: Raw residential street address MUST NOT appear in the public DOM
    expect(screen.queryByText(/742 Evergreen Terrace/i)).toBeNull();
    expect(screen.getByText('Vicinity details restricted for privacy')).toBeInTheDocument();
    expect(screen.getByText(/SEC-BACKEND-01: Address suppressed on public view/i)).toBeInTheDocument();
  });

  // 8. C3 Invariant: No fabricated broadcast radius or operational coverage claims
  it('enforces C3: does not fabricate broadcast radius or operational coverage claims', async () => {
    const alertWithoutRadius = {
      id: 'alert-no-radius',
      pet_id: 'pet-no-radius',
      status: 'active',
      last_seen_address: 'Main Street',
      description: 'Golden fur.',
      created_at: '2026-11-23T12:00:00Z',
      pet_name: 'Max',
      breed: 'Retriever',
      photo_url: '',
      sightings: [],
    };

    (ApiClient.getAlert as any).mockResolvedValueOnce(alertWithoutRadius);

    render(
      <MemoryRouter initialEntries={['/alerts/alert-no-radius']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Max')).toBeInTheDocument();
    });

    // Invariant: no operational radius or unverified broadcast claims
    expect(screen.queryByText(/operational radius/i)).toBeNull();
    expect(screen.queryByText(/5km/i)).toBeNull();
    expect(screen.getByText(/Active missing pet incident record. Observational sightings submitted by the community are logged to the timeline below./i)).toBeInTheDocument();
  });
});
