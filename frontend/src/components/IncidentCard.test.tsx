import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { IncidentCard } from './IncidentCard';
import { NeighborhoodAlert } from '../types';

const baseAlert: NeighborhoodAlert = {
  id: 'alert-sp-101',
  petId: 'pet-1',
  petName: 'Cooper',
  breed: 'Golden Retriever',
  photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
  status: 'active',
  notifiedNeighborsCount: 84,
  timeAgo: '24 mins ago',
  lastSeenAddress: '742 Evergreen Terrace, Sector 4 PRIVATE RESIDENCE',
  description: 'Very friendly, responds to his name and whistles.',
  sightingsCount: 2,
  species: 'dog',
};

// Fixtures without explicit species (MUST NOT guess from breed names)
const catahoulaNoSpecies: NeighborhoodAlert = {
  ...baseAlert,
  id: 'alert-sp-102',
  petName: 'Rex',
  breed: 'Catahoula Leopard Dog',
  species: undefined,
};

const cattleDogNoSpecies: NeighborhoodAlert = {
  ...baseAlert,
  id: 'alert-sp-103',
  petName: 'Bluey',
  breed: 'Australian Cattle Dog',
  species: undefined,
};

const siameseNoSpecies: NeighborhoodAlert = {
  ...baseAlert,
  id: 'alert-sp-104',
  petName: 'Cleo',
  breed: 'Siamese',
  species: undefined,
};

const maineCoonNoSpecies: NeighborhoodAlert = {
  ...baseAlert,
  id: 'alert-sp-105',
  petName: 'Thor',
  breed: 'Maine Coon',
  species: undefined,
};

// Same breed fixtures WITH explicit API species
const catahoulaWithSpecies: NeighborhoodAlert = {
  ...catahoulaNoSpecies,
  species: 'dog',
};

const siameseWithSpecies: NeighborhoodAlert = {
  ...siameseNoSpecies,
  species: 'cat',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('IncidentCard Component (Reconciled Contracts C2, C3, C4, C6)', () => {
  it('renders pet name, breed, truthful location status, and status tags when valid alert is supplied', () => {
    renderWithRouter(<IncidentCard alert={baseAlert} />);

    expect(screen.getByText('Cooper')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText('LOCATION REPORTED')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE SEARCH')).toBeInTheDocument();
    expect(screen.getByText('CANINE COMPANION')).toBeInTheDocument();
  });

  it('enforces C2: classifies breeds without explicit species strictly as "SPECIES UNCONFIRMED" (no guessing)', () => {
    const { unmount: u1 } = renderWithRouter(<IncidentCard alert={catahoulaNoSpecies} />);
    expect(screen.getByText('SPECIES UNCONFIRMED')).toBeInTheDocument();
    u1();

    const { unmount: u2 } = renderWithRouter(<IncidentCard alert={cattleDogNoSpecies} />);
    expect(screen.getByText('SPECIES UNCONFIRMED')).toBeInTheDocument();
    u2();

    const { unmount: u3 } = renderWithRouter(<IncidentCard alert={siameseNoSpecies} />);
    expect(screen.getByText('SPECIES UNCONFIRMED')).toBeInTheDocument();
    u3();

    const { unmount: u4 } = renderWithRouter(<IncidentCard alert={maineCoonNoSpecies} />);
    expect(screen.getByText('SPECIES UNCONFIRMED')).toBeInTheDocument();
    u4();
  });

  it('enforces C2: correctly classifies fixtures when explicit API species is provided', () => {
    const { unmount: u1 } = renderWithRouter(<IncidentCard alert={catahoulaWithSpecies} />);
    expect(screen.getByText('CANINE COMPANION')).toBeInTheDocument();
    u1();

    const { unmount: u2 } = renderWithRouter(<IncidentCard alert={siameseWithSpecies} />);
    expect(screen.getByText('FELINE COMPANION')).toBeInTheDocument();
    u2();
  });

  it('enforces C3: renders truthful "LOCATION REPORTED" when last seen address is available', () => {
    renderWithRouter(<IncidentCard alert={baseAlert} />);

    // Invariant: MUST NOT invent a radius or synthetic bearing/vector
    expect(screen.queryByText(/RADIUS/i)).toBeNull();
    expect(screen.queryByText(/VECTOR/i)).toBeNull();
    expect(screen.queryByText(/NE 42°/i)).toBeNull();
    expect(screen.getByText('LOCATION REPORTED')).toBeInTheDocument();
  });

  it('enforces C3: renders "LOCATION DETAILS UNAVAILABLE" when location address is missing', () => {
    const alertNoAddress: NeighborhoodAlert = {
      ...baseAlert,
      lastSeenAddress: '',
    };
    renderWithRouter(<IncidentCard alert={alertNoAddress} />);

    expect(screen.getByText('LOCATION DETAILS UNAVAILABLE')).toBeInTheDocument();
  });

  it('enforces C6: suppresses raw street addresses on public card', () => {
    renderWithRouter(<IncidentCard alert={baseAlert} />);

    expect(screen.queryByText(/742 Evergreen Terrace/i)).toBeNull();
    expect(screen.getByText('Area details restricted for owner privacy')).toBeInTheDocument();
  });

  it('enforces C4: provides accessible >= 44x44px touch targets on all actionable buttons', () => {
    renderWithRouter(<IncidentCard alert={baseAlert} />);

    const shareButton = screen.getByRole('button', { name: /share alert for cooper/i });
    expect(shareButton.className).toContain('min-h-[44px]');
    expect(shareButton.className).toContain('min-w-[44px]');

    const recoveryNoticeButton = screen.getByRole('button', { name: /recovery notice/i });
    expect(recoveryNoticeButton.className).toContain('min-h-[44px]');

    const sightingLink = screen.getByRole('link', { name: /sighting/i });
    expect(sightingLink.className).toContain('min-h-[44px]');
  });

  it('enforces C3: Guardian Recovery Protocol modal does not imply functioning masked contact mechanism or broadcast claims', async () => {
    const user = userEvent.setup();
    renderWithRouter(<IncidentCard alert={baseAlert} />);

    const recoveryButton = screen.getByRole('button', { name: /recovery notice/i });
    await user.click(recoveryButton);

    expect(screen.getByText('Guardian Recovery Protocol')).toBeInTheDocument();
    expect(screen.getByText(/Anti-Extortion & Safety Invariant/i)).toBeInTheDocument();
    expect(screen.getByText(/Community-submitted observational sightings appear in the incident timeline/i)).toBeInTheDocument();
    expect(screen.getByText(/SafePaws does not currently provide a masked call relay or automated voice proxy/i)).toBeInTheDocument();

    // Invariant: Fictional relay telephone links and broadcast numbers MUST NOT exist
    expect(screen.queryByText(/1-800-555/i)).toBeNull();
    expect(screen.queryByRole('link', { name: /call guardian now/i })).toBeNull();
  });

  it('calls onReportSighting handler when action button is triggered', async () => {
    const user = userEvent.setup();
    const handleSighting = vi.fn();
    renderWithRouter(<IncidentCard alert={baseAlert} onReportSighting={handleSighting} />);

    const sightingButton = screen.getByRole('button', { name: /sighting/i });
    await user.click(sightingButton);

    expect(handleSighting).toHaveBeenCalledWith(baseAlert);
  });
});
