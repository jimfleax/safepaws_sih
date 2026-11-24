import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ReportSighting from './ReportSighting';
import { ApiClient } from '../utils/apiClient';
import { usePetStore } from '../store/petStore';
import { useAuthStore } from '../store/authStore';

vi.mock('../utils/apiClient', () => ({
  ApiClient: {
    reportSighting: vi.fn(),
    getAlert: vi.fn().mockResolvedValue({}),
    getAllAlerts: vi.fn().mockResolvedValue([]),
    getAllPets: vi.fn().mockResolvedValue([]),
    getAllSightings: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock('../components/DashboardNav', () => ({
  DashboardNav: () => <nav data-testid="dashboard-nav" />,
}));

describe('ReportSighting — Sighting Submission, Receipt & Verification Truth (Phase 2C: C1–C4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePetStore.setState({
      alerts: [
        {
          id: 'alert-barnaby-01',
          petId: 'pet-barnaby-01',
          petName: 'Barnaby',
          breed: 'Golden Retriever',
          photoUrl: 'https://images.example.com/barnaby.jpg',
          status: 'active',
          timeAgo: '2 hours ago',
          lastSeenAddress: '742 Evergreen Terrace',
          description: 'Wearing red collar',
          sightingsCount: 1,
          species: 'dog',
        },
      ],
      pets: [],
      sightings: [],
      hydrated: true,
    });
    useAuthStore.setState({
      user: {
        id: 'user-scout-01',
        name: 'Eleanor Vance',
        email: 'eleanor@example.com',
        picture: '',
        profileCompleted: true,
      },
      isAuthenticated: true,
      isInitializing: false,
    });
  });

  // 1. Initial form rendering
  it('renders field observation log form with required input controls', () => {
    render(
      <MemoryRouter initialEntries={['/sightings/new']}>
        <Routes>
          <Route path="/sightings/new" element={<ReportSighting />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /log a field observation/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your name \/ field identifier/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observation vicinity \/ cross streets/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/observation narrative & appearance/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /transmit field sighting/i })).toBeInTheDocument();
  });

  // 2. Pre-selected subject alert via query param
  it('resolves subject companion context banner when alertId is in search params', async () => {
    render(
      <MemoryRouter initialEntries={['/sightings/new?alertId=alert-barnaby-01']}>
        <Routes>
          <Route path="/sightings/new" element={<ReportSighting />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Subject: Barnaby/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/LINKED INCIDENT DOCKET #ALERT-/i)).toBeInTheDocument();
  });

  // 3. Contract C1: Direct real API POST /api/v1/sightings/
  it('submits sighting payload matching SightingCreate schema via ApiClient.reportSighting', async () => {
    const mockReceiptResponse = {
      id: 'sgt-server-uuid-001',
      reporter_name: 'Eleanor Vance',
      location: 'Near Pine Forest Trailhead',
      notes: 'Spotted wandering near pines. Red collar visible.',
      time: '2026-11-24T17:15:00Z',
      confirmed: false,
      alert_id: 'alert-barnaby-01',
    };

    (ApiClient.reportSighting as any).mockResolvedValueOnce(mockReceiptResponse);

    render(
      <MemoryRouter initialEntries={['/sightings/new?alertId=alert-barnaby-01']}>
        <Routes>
          <Route path="/sightings/new" element={<ReportSighting />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/observation vicinity \/ cross streets/i), {
      target: { value: 'Near Pine Forest Trailhead' },
    });
    fireEvent.change(screen.getByLabelText(/observation narrative & appearance/i), {
      target: { value: 'Spotted wandering near pines. Red collar visible.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /transmit field sighting/i }));

    await waitFor(() => {
      expect(ApiClient.reportSighting).toHaveBeenCalledWith({
        reporterName: 'Eleanor Vance',
        location: 'Near Pine Forest Trailhead',
        notes: 'Spotted wandering near pines. Red collar visible.',
        alertId: 'alert-barnaby-01',
      });
    });
  });

  // 4. Contract C2 & C4: In-situ Archival Receipt & Unverified Status Badge
  it('transitions in-situ to official archival receipt displaying server ref, timestamp, and unverified status badge', async () => {
    const mockReceiptResponse = {
      id: 'sgt-server-uuid-001',
      reporter_name: 'Eleanor Vance',
      location: 'Near Pine Forest Trailhead',
      notes: 'Spotted wandering near pines. Red collar visible.',
      time: '2026-11-24T17:15:00Z',
      confirmed: false,
      alert_id: 'alert-barnaby-01',
    };

    (ApiClient.reportSighting as any).mockResolvedValueOnce(mockReceiptResponse);

    render(
      <MemoryRouter initialEntries={['/sightings/new?alertId=alert-barnaby-01']}>
        <Routes>
          <Route path="/sightings/new" element={<ReportSighting />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/observation vicinity \/ cross streets/i), {
      target: { value: 'Near Pine Forest Trailhead' },
    });
    fireEvent.change(screen.getByLabelText(/observation narrative & appearance/i), {
      target: { value: 'Spotted wandering near pines. Red collar visible.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /transmit field sighting/i }));

    // Invariant C2: In-situ receipt with server-generated ID
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /observation logged to ledger/i })).toBeInTheDocument();
    });
    expect(screen.getByText('REF: #SGT-SGT-SERV')).toBeInTheDocument();

    // Invariant C4: Unverified status banner with zero fake AI matching claims
    expect(screen.getByText(/STATUS: COMMUNITY REPORT \/\/ UNVERIFIED/i)).toBeInTheDocument();
    expect(screen.getByText(/reports remain unverified until corroborated/i)).toBeInTheDocument();

    // Navigation action to view incident dossier
    expect(screen.getByRole('link', { name: /view incident dossier/i })).toHaveAttribute('href', '/alerts/alert-barnaby-01');
  });

  // 5. Contract C3: Absence of fake photo upload controls
  it('enforces Contract C3: does not render fake photo upload controls or claim photos are saved', () => {
    render(
      <MemoryRouter initialEntries={['/sightings/new']}>
        <Routes>
          <Route path="/sightings/new" element={<ReportSighting />} />
        </Routes>
      </MemoryRouter>
    );

    // Invariant C3: No file input element
    const fileInputs = document.querySelectorAll('input[type="file"]');
    expect(fileInputs.length).toBe(0);

    // Explicit deferral notice
    expect(screen.getByText(/NOTE ON PHOTOGRAPHIC ATTACHMENTS \(CONTRACT C3\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Sighting photo persistence is deferred on the municipal backend/i)).toBeInTheDocument();
  });

  // 6. Submission error handling in role="alert"
  it('renders accessible error banner when ApiClient.reportSighting fails', async () => {
    (ApiClient.reportSighting as any).mockRejectedValueOnce(new Error('Network connection interrupted'));

    render(
      <MemoryRouter initialEntries={['/sightings/new']}>
        <Routes>
          <Route path="/sightings/new" element={<ReportSighting />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/observation vicinity \/ cross streets/i), {
      target: { value: 'Sector 5 Bridge' },
    });
    fireEvent.change(screen.getByLabelText(/observation narrative & appearance/i), {
      target: { value: 'Walking east' },
    });
    fireEvent.click(screen.getByRole('button', { name: /transmit field sighting/i }));

    await waitFor(() => {
      const alertBanner = screen.getByRole('alert');
      expect(alertBanner).toBeInTheDocument();
      expect(alertBanner).toHaveTextContent(/Network connection interrupted/i);
    });
  });

  // 7. Reset action from receipt state
  it('resets form back to draft state when user clicks "Log Another Sighting"', async () => {
    const mockReceipt = {
      id: 'sgt-reset-01',
      reporter_name: 'Eleanor Vance',
      location: 'Sector 1',
      notes: 'Spotted',
      time: '2026-11-24T17:15:00Z',
      confirmed: false,
    };

    (ApiClient.reportSighting as any).mockResolvedValueOnce(mockReceipt);

    render(
      <MemoryRouter initialEntries={['/sightings/new']}>
        <Routes>
          <Route path="/sightings/new" element={<ReportSighting />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/observation vicinity \/ cross streets/i), {
      target: { value: 'Sector 1' },
    });
    fireEvent.change(screen.getByLabelText(/observation narrative & appearance/i), {
      target: { value: 'Spotted' },
    });
    fireEvent.click(screen.getByRole('button', { name: /transmit field sighting/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /log another sighting/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /log another sighting/i }));

    // Form is restored to draft state
    expect(screen.getByRole('button', { name: /transmit field sighting/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/observation vicinity \/ cross streets/i)).toHaveValue('');
  });
});
