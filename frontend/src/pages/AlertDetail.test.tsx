import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AlertDetail from './AlertDetail';
import { ApiClient } from '../utils/apiClient';
import { usePetStore } from '../store/petStore';

vi.mock('../utils/apiClient', () => ({
  ApiClient: {
    getAlert: vi.fn(),
    resolveAlert: vi.fn(),
    getAllAlerts: vi.fn().mockResolvedValue([]),
    getAllPets: vi.fn().mockResolvedValue([]),
    getAllSightings: vi.fn().mockResolvedValue([]),
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

    // Invariant: no operational radius, unverified broadcast claims, or fake dispatch labels
    expect(screen.queryByText(/operational radius/i)).toBeNull();
    expect(screen.queryByText(/5km/i)).toBeNull();
    expect(screen.queryByText(/ACTIVE DISPATCH/i)).toBeNull();
    expect(screen.getByText(/ACTIVE INCIDENT/i)).toBeInTheDocument();
    expect(screen.getByText(/Active missing pet incident record. Observational sightings submitted by the community are logged to the timeline below./i)).toBeInTheDocument();
  });

  // 9. Contract C4: Sighting status differentiation (Verified vs Unverified)
  it('enforces Contract C4: visually differentiates verified sightings from unverified community observations', async () => {
    const alertWithMixedSightings = {
      id: 'alert-mixed-sightings',
      pet_id: 'pet-mixed',
      status: 'active',
      last_seen_address: 'Central Park West',
      description: 'Lost during morning jog.',
      created_at: '2026-11-23T10:00:00Z',
      pet_name: 'Sadie',
      breed: 'Collie',
      photo_url: '',
      sightings: [
        {
          id: 'sighting-unverified',
          alert_id: 'alert-mixed-sightings',
          reporter_name: 'Citizen Observer',
          location: '72nd St Entrance',
          notes: 'Saw dog running past benches',
          time: '2026-11-23T10:30:00Z',
          confirmed: false,
        },
        {
          id: 'sighting-confirmed',
          alert_id: 'alert-mixed-sightings',
          reporter_name: 'Park Ranger Davis',
          location: 'Reservoir South Gate',
          notes: 'Direct physical confirmation by field team',
          time: '2026-11-23T11:00:00Z',
          confirmed: true,
        },
      ],
    };

    (ApiClient.getAlert as any).mockResolvedValueOnce(alertWithMixedSightings);

    render(
      <MemoryRouter initialEntries={['/alerts/alert-mixed-sightings']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Sadie')).toBeInTheDocument();
    });

    // Invariant C4: Unverified badge for confirmed === false
    expect(screen.getByText(/COMMUNITY OBSERVATION \/\/ UNVERIFIED/i)).toBeInTheDocument();

    // Invariant C4: Confirmed badge for confirmed === true
    expect(screen.getByText(/VERIFIED OBSERVATION \/\/ CONFIRMED/i)).toBeInTheDocument();
  });

  // 10. Contract C6: Owner-controlled resolution workflow with confirmation dialog
  it('enforces Contract C6: provides verified pet guardian with resolution flow that calls ApiClient.resolveAlert', async () => {
    // Authenticated store has pet owned by user
    usePetStore.setState({
      pets: [
        {
          id: 'pet-owned-by-user',
          name: 'Sadie',
          species: 'dog',
          breed: 'Collie',
          color: 'Sable',
          age: '3',
          photoUrl: '',
          status: 'lost',
          distinctiveFeatures: [],
          qrTagId: 'SP-SADIE-01',
        },
      ],
      alerts: [],
    });

    const activeAlert = {
      id: 'alert-owner-case',
      pet_id: 'pet-owned-by-user',
      status: 'active',
      last_seen_address: '123 Main Street',
      description: 'Lost pet.',
      created_at: '2026-11-23T10:00:00Z',
      pet_name: 'Sadie',
      breed: 'Collie',
      photoUrl: '',
      sightings: [],
    };

    (ApiClient.getAlert as any).mockResolvedValue(activeAlert);
    (ApiClient.resolveAlert as any).mockResolvedValue({
      ...activeAlert,
      status: 'resolved',
    });

    render(
      <MemoryRouter initialEntries={['/alerts/alert-owner-case']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Sadie')).toBeInTheDocument();
    });

    // Owner sees "Mark Safe & Resolve" action button
    const resolveBtn = screen.getByRole('button', { name: /mark safe & resolve/i });
    expect(resolveBtn).toBeInTheDocument();

    // Clicking button opens accessible confirmation modal (Contract C6)
    fireEvent.click(resolveBtn);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /confirm case resolution/i })).toBeInTheDocument();
    expect(screen.getByText(/conclude active community search efforts/i)).toBeInTheDocument();

    // Confirm resolution
    const confirmBtn = screen.getByRole('button', { name: /yes, mark companion safe/i });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(ApiClient.resolveAlert).toHaveBeenCalledWith('alert-owner-case');
    });

    // Status is updated to resolved and case concluded
    await waitFor(() => {
      expect(screen.getByText(/STATUS: RESOLVED/i)).toBeInTheDocument();
      expect(screen.getByText(/CASE CONCLUDED \/\/ COMPANION SAFE/i)).toBeInTheDocument();
    });
  });

  // 11. Contract C6: Non-owner does NOT see resolution action
  it('enforces Contract C6: non-owner cannot resolve alert and sees no resolve button', async () => {
    // Authenticated store has no pets or different pets
    usePetStore.setState({ pets: [] });

    const publicAlert = {
      id: 'alert-other-user',
      pet_id: 'pet-other-user',
      status: 'active',
      last_seen_address: 'Broadway',
      description: 'Other pet',
      created_at: '2026-11-23T10:00:00Z',
      pet_name: 'Rover',
      breed: 'Labrador',
      photoUrl: '',
      sightings: [],
    };

    (ApiClient.getAlert as any).mockResolvedValue(publicAlert);

    render(
      <MemoryRouter initialEntries={['/alerts/alert-other-user']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Rover')).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /mark safe & resolve/i })).toBeNull();
  });

  // 12. Resolution failure error display in role="alert"
  it('renders accessible error banner when resolution API fails', async () => {
    usePetStore.setState({
      pets: [
        {
          id: 'pet-fail-case',
          name: 'Rover',
          species: 'dog',
          breed: 'Labrador',
          color: 'Black',
          age: '4',
          photoUrl: '',
          status: 'lost',
          distinctiveFeatures: [],
          qrTagId: 'SP-ROV-01',
        },
      ],
    });

    const activeAlert = {
      id: 'alert-fail-case',
      pet_id: 'pet-fail-case',
      status: 'active',
      last_seen_address: 'Broadway',
      description: 'Other pet',
      created_at: '2026-11-23T10:00:00Z',
      pet_name: 'Rover',
      breed: 'Labrador',
      photoUrl: '',
      sightings: [],
    };

    (ApiClient.getAlert as any).mockResolvedValue(activeAlert);
    (ApiClient.resolveAlert as any).mockRejectedValue(new Error('Permission denied: not owner'));

    render(
      <MemoryRouter initialEntries={['/alerts/alert-fail-case']}>
        <Routes>
          <Route path="/alerts/:alertId" element={<AlertDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Missing: Rover')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /mark safe & resolve/i }));
    fireEvent.click(screen.getByRole('button', { name: /yes, mark companion safe/i }));

    await waitFor(() => {
      const alertBanner = screen.getByRole('alert');
      expect(alertBanner).toBeInTheDocument();
      expect(alertBanner).toHaveTextContent(/Permission denied: not owner/i);
    });
  });
});
