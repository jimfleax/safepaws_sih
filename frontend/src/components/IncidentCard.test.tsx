import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { IncidentCard } from './IncidentCard';
import { NeighborhoodAlert } from '../types';

const mockAlert: NeighborhoodAlert = {
  id: 'alert-sp-101',
  petId: 'pet-1',
  petName: 'Cooper',
  breed: 'Golden Retriever',
  photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d',
  status: 'active',
  broadcastRadiusKm: 2.5,
  notifiedNeighborsCount: 84,
  timeAgo: '24 mins ago',
  lastSeenAddress: '742 Evergreen Terrace, Sector 4',
  description: 'Very friendly, responds to his name and whistles. Wearing red collar.',
  sightingsCount: 2,
};

const mockCatAlert: NeighborhoodAlert = {
  ...mockAlert,
  id: 'alert-sp-102',
  petName: 'Luna',
  breed: 'Siamese Feline Cat',
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('IncidentCard Component', () => {
  it('renders pet name, breed, distance vector, and status tags', () => {
    renderWithRouter(<IncidentCard alert={mockAlert} distanceKm={0.8} bearing="NE 42°" />);

    expect(screen.getByText('Cooper')).toBeInTheDocument();
    expect(screen.getByText('Golden Retriever')).toBeInTheDocument();
    expect(screen.getByText(/0.8 KM • VECTOR NE 42°/i)).toBeInTheDocument();
    expect(screen.getByText('ACTIVE SEARCH')).toBeInTheDocument();
    expect(screen.getByText('CANINE COMPANION')).toBeInTheDocument();
    expect(screen.getByText('742 Evergreen Terrace, Sector 4')).toBeInTheDocument();
  });

  it('correctly categorizes feline companions based on breed heuristics', () => {
    renderWithRouter(<IncidentCard alert={mockCatAlert} />);

    expect(screen.getByText('Luna')).toBeInTheDocument();
    expect(screen.getByText('FELINE COMPANION')).toBeInTheDocument();
  });

  it('provides accessible >= 44x44px touch targets on immediate emergency action buttons', () => {
    renderWithRouter(<IncidentCard alert={mockAlert} />);

    const callButton = screen.getByRole('button', { name: /call relay/i });
    expect(callButton.className).toContain('min-h-[44px]');

    const sightingLink = screen.getByRole('link', { name: /sighting/i });
    expect(sightingLink.className).toContain('min-h-[44px]');
  });

  it('opens zero-leak emergency relay modal upon clicking CALL RELAY', async () => {
    const user = userEvent.setup();
    renderWithRouter(<IncidentCard alert={mockAlert} />);

    const callButton = screen.getByRole('button', { name: /call relay/i });
    await user.click(callButton);

    expect(screen.getByText('Direct Emergency Relay')).toBeInTheDocument();
    expect(screen.getByText(/Zero-Leak Voice Proxy Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Call Guardian Now/i)).toBeInTheDocument();
  });

  it('calls onReportSighting handler when action button is triggered', async () => {
    const user = userEvent.setup();
    const handleSighting = vi.fn();
    renderWithRouter(<IncidentCard alert={mockAlert} onReportSighting={handleSighting} />);

    const sightingButton = screen.getByRole('button', { name: /sighting/i });
    await user.click(sightingButton);

    expect(handleSighting).toHaveBeenCalledWith(mockAlert);
  });
});
