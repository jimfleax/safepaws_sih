import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportLost from './ReportLost';
import { usePetStore } from '../store/petStore';
import { ApiClient } from '../utils/apiClient';
import { Pet } from '../types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockSafePets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Apollo',
    species: 'dog',
    breed: 'German Shepherd',
    color: 'Black and Tan',
    age: '4 years',
    photoUrl: 'https://example.com/apollo.jpg',
    status: 'safe',
    qrTagId: 'SP-APO-01',
    distinctiveFeatures: ['Notched left ear'],
  },
  {
    id: 'pet-2',
    name: 'Luna',
    species: 'cat',
    breed: 'Domestic Shorthair',
    color: 'Calico',
    age: '2 years',
    photoUrl: '',
    status: 'safe',
    qrTagId: 'SP-LUN-02',
    distinctiveFeatures: ['White paws'],
  },
];

describe('ReportLost Emergency Declaration Dossier (Route /lost/new)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePetStore.setState({
      pets: mockSafePets,
      isLoading: false,
      hydrated: true,
      error: null,
      hydrate: vi.fn(),
    });
  });

  it('renders crisis triage header, pet selection, and form fields when safe pets exist', () => {
    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /declare missing companion/i })).toBeInTheDocument();
    expect(screen.getByText(/active recovery registry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select enrolled companion/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last known vicinity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/context, behavior & distinctive traits/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish missing pet alert/i })).toBeInTheDocument();
  });

  it('enforces Contract C5: renders empathetic registration prerequisite when no pets are enrolled', () => {
    usePetStore.setState({
      pets: [],
      isLoading: false,
      hydrated: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    expect(screen.getByText(/no enrolled companion profiles on record/i)).toBeInTheDocument();
    expect(screen.getByText(/registration prerequisite/i)).toBeInTheDocument();
    expect(screen.getByText(/registration takes approximately 60 seconds/i)).toBeInTheDocument();
    
    // Direct link to /pets/new
    const enrollLink = screen.getByRole('link', { name: /enroll companion profile/i });
    expect(enrollLink).toHaveAttribute('href', '/pets/new');

    // Link to search existing alerts /lost
    const searchLink = screen.getByRole('link', { name: /search existing alerts/i });
    expect(searchLink).toHaveAttribute('href', '/lost');
  });

  it('enforces Contract C6: renders network error retry state when registry sync fails', () => {
    const mockHydrate = vi.fn();
    usePetStore.setState({
      pets: [],
      isLoading: false,
      hydrated: false,
      error: 'Backend gateway timeout',
      hydrate: mockHydrate,
    });

    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/unable to synchronize pet registry/i)).toBeInTheDocument();
    expect(screen.getByText('Backend gateway timeout')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry registry connection/i });
    fireEvent.click(retryBtn);
    expect(mockHydrate).toHaveBeenCalledTimes(1);
  });

  it('renders loading state when registry data is being retrieved', () => {
    usePetStore.setState({
      pets: [],
      isLoading: true,
      hydrated: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/accessing safepaws registry/i)).toBeInTheDocument();
  });

  it('renders message when all registered pets are already marked lost', () => {
    usePetStore.setState({
      pets: [
        { ...mockSafePets[0], status: 'lost' },
        { ...mockSafePets[1], status: 'lost' },
      ],
      isLoading: false,
      hydrated: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    expect(screen.getByText(/all enrolled companions currently have active missing declarations/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /return to owner console/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /view active recovery board/i })).toHaveAttribute('href', '/lost');
  });

  it('submits valid alert payload to ApiClient.createAlert and navigates to alert detail on 201 Created (Contract C1)', async () => {
    const mockCreateAlert = vi.spyOn(ApiClient, 'createAlert').mockResolvedValueOnce({
      id: 'alert-new-999',
      pet_id: 'pet-1',
      status: 'active',
      last_seen_address: 'Central Park West',
      description: 'Wearing red collar with bell.',
      created_at: new Date().toISOString(),
      sightings: [],
    });

    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    // Fill form
    const locationInput = screen.getByLabelText(/last known vicinity/i);
    fireEvent.change(locationInput, { target: { value: 'Central Park West entrance' } });

    const descInput = screen.getByLabelText(/context, behavior & distinctive traits/i);
    fireEvent.change(descInput, { target: { value: 'Wearing red collar with bell. Very friendly.' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /publish missing pet alert/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockCreateAlert).toHaveBeenCalledWith({
        petId: 'pet-1',
        lastSeenAddress: 'Central Park West entrance',
        description: 'Wearing red collar with bell. Very friendly.',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/alerts/alert-new-999');
    });
  });

  it('displays accessible error alert when ApiClient.createAlert throws an error', async () => {
    vi.spyOn(ApiClient, 'createAlert').mockRejectedValueOnce(
      new Error('Failed to authorize emergency broadcast docket')
    );

    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    // Fill form
    const locationInput = screen.getByLabelText(/last known vicinity/i);
    fireEvent.change(locationInput, { target: { value: 'Market Street' } });

    const descInput = screen.getByLabelText(/context, behavior & distinctive traits/i);
    fireEvent.change(descInput, { target: { value: 'Timid dog.' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /publish missing pet alert/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/failed to authorize emergency broadcast docket/i);
    });
  });

  it('enforces Contract C4: displays privacy masking notice regarding residential addresses', () => {
    render(
      <MemoryRouter>
        <ReportLost />
      </MemoryRouter>
    );

    expect(screen.getByText(/privacy notice \(sec-backend-01\)/i)).toBeInTheDocument();
    expect(screen.getByText(/exact house numbers are automatically masked on the public recovery board/i)).toBeInTheDocument();
  });
});
