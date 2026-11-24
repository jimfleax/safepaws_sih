import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LostDogs from './LostDogs';
import { usePetStore } from '../store/petStore';
import { NeighborhoodAlert } from '../types';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockAlerts: NeighborhoodAlert[] = [
  {
    id: 'alt-1',
    petId: 'pet-1',
    petName: 'Barnaby',
    breed: 'Golden Retriever',
    photoUrl: 'https://example.com/dog.jpg',
    status: 'active',
    timeAgo: '15 mins ago',
    lastSeenAddress: '742 Evergreen Terrace, Sector 4',
    description: 'Friendly golden dog with red collar.',
    sightingsCount: 1,
    species: 'dog',
  },
  {
    id: 'alt-2',
    petId: 'pet-2',
    petName: 'Whiskers',
    breed: 'Siamese',
    photoUrl: '',
    status: 'active',
    timeAgo: '45 mins ago',
    lastSeenAddress: 'Oakridge Park near playground',
    description: 'Very skittish cat, responds to tuna.',
    sightingsCount: 0,
    species: 'cat',
  },
  {
    id: 'alt-3',
    petId: 'pet-3',
    petName: 'Pip',
    breed: 'Parakeet',
    photoUrl: '',
    status: 'active',
    timeAgo: '2 hours ago',
    lastSeenAddress: 'Civic Botanical Garden',
    description: 'Green parakeet with yellow crest.',
    sightingsCount: 0,
    species: 'other',
  },
  {
    id: 'alt-4',
    petId: 'pet-4',
    petName: 'Rusty',
    breed: 'Mixed Hound',
    photoUrl: '',
    status: 'resolved',
    timeAgo: '1 day ago',
    lastSeenAddress: 'Market Street',
    description: 'Reunited safely.',
    sightingsCount: 3,
    species: 'dog',
  },
];

describe('LostDogs Recovery Board (Route /lost)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    usePetStore.setState({
      alerts: mockAlerts,
      isLoading: false,
      hydrated: true,
      error: null,
      hydrate: vi.fn(),
    });
  });

  it('renders editorial header, active counts, and incident cards', () => {
    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { level: 1, name: /recovery board/i })).toBeInTheDocument();
    expect(screen.getByText(/active recovery network/i)).toBeInTheDocument();
    // 3 active alerts (Barnaby, Whiskers, Pip; Rusty is resolved)
    expect(screen.getByText(/3 active incidents/i)).toBeInTheDocument();
    expect(screen.getByText('Barnaby')).toBeInTheDocument();
    expect(screen.getByText('Whiskers')).toBeInTheDocument();
    expect(screen.getByText('Pip')).toBeInTheDocument();
  });

  it('filters by species tabs strictly without breed guessing (Contract C2)', () => {
    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    // Canines tab
    const canineTab = screen.getByRole('tab', { name: /canines/i });
    fireEvent.click(canineTab);

    expect(screen.getByText('Barnaby')).toBeInTheDocument();
    expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();
    expect(screen.queryByText('Pip')).not.toBeInTheDocument();

    // Felines tab
    const felineTab = screen.getByRole('tab', { name: /felines/i });
    fireEvent.click(felineTab);

    expect(screen.getByText('Whiskers')).toBeInTheDocument();
    expect(screen.queryByText('Barnaby')).not.toBeInTheDocument();
    expect(screen.queryByText('Pip')).not.toBeInTheDocument();

    // Other / Unconfirmed tab
    const otherTab = screen.getByRole('tab', { name: /other/i });
    fireEvent.click(otherTab);

    expect(screen.getByText('Pip')).toBeInTheDocument();
    expect(screen.queryByText('Barnaby')).not.toBeInTheDocument();
    expect(screen.queryByText('Whiskers')).not.toBeInTheDocument();

    // Back to All
    const allTab = screen.getByRole('tab', { name: /all alerts/i });
    fireEvent.click(allTab);

    expect(screen.getByText('Barnaby')).toBeInTheDocument();
    expect(screen.getByText('Whiskers')).toBeInTheDocument();
  });

  it('searches across name, breed, and description and allows clearing search', () => {
    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search by name, breed, or location/i);
    fireEvent.change(searchInput, { target: { value: 'Siamese' } });

    expect(screen.getByText('Whiskers')).toBeInTheDocument();
    expect(screen.queryByText('Barnaby')).not.toBeInTheDocument();

    // Clear search button
    const clearBtn = screen.getByRole('button', { name: /clear search/i });
    fireEvent.click(clearBtn);

    expect(screen.getByText('Barnaby')).toBeInTheDocument();
    expect(screen.getByText('Whiskers')).toBeInTheDocument();
  });

  it('renders search empty state with reset filters button when query matches zero records', () => {
    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText(/search by name, breed, or location/i);
    fireEvent.change(searchInput, { target: { value: 'NonexistentPet12345' } });

    expect(screen.getByText(/no matching alerts found/i)).toBeInTheDocument();
    
    const resetBtn = screen.getByRole('button', { name: /reset filters/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText('Barnaby')).toBeInTheDocument();
  });

  it('renders zero-incident empty state when active alerts array is empty', () => {
    usePetStore.setState({
      alerts: [],
      isLoading: false,
      hydrated: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    expect(screen.getByText(/no active recovery incidents/i)).toBeInTheDocument();
    expect(screen.getByText(/zero missing companion declarations are active on record/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /report missing pet/i })).toHaveAttribute('href', '/lost/new');
  });

  it('renders animated loading skeleton state when loading', () => {
    usePetStore.setState({
      alerts: [],
      isLoading: true,
      hydrated: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    const skeleton = screen.getByLabelText(/loading active recovery alerts/i);
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
  });

  it('renders error state with retry connection button calling hydrate', () => {
    const mockHydrate = vi.fn();
    usePetStore.setState({
      alerts: [],
      isLoading: false,
      hydrated: false,
      error: 'Network connection timeout',
      hydrate: mockHydrate,
    });

    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/network synchronization unavailable/i)).toBeInTheDocument();
    expect(screen.getByText('Network connection timeout')).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry connection/i });
    fireEvent.click(retryBtn);
    expect(mockHydrate).toHaveBeenCalledTimes(1);
  });

  it('provides accessible >= 44x44px touch targets on all key action buttons', () => {
    render(
      <MemoryRouter>
        <LostDogs />
      </MemoryRouter>
    );

    const scanBtn = screen.getByRole('link', { name: /scan found dog/i });
    expect(scanBtn.className).toContain('min-h-[48px]');

    const reportBtn = screen.getByRole('link', { name: /report missing pet/i });
    expect(reportBtn.className).toContain('min-h-[48px]');

    const tabs = screen.getAllByRole('tab');
    tabs.forEach(tab => {
      expect(tab.className).toContain('min-h-[44px]');
    });
  });
});
