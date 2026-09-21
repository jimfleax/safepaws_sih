import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Scan from '../../pages/Scan';
import { BrowserRouter } from 'react-router-dom';
import { ApiClient } from '../../utils/apiClient';

// ── Routing spy ──────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

// ── ApiClient mock ───────────────────────────────────────────────────────────
vi.mock('../../utils/apiClient', () => ({
  ApiClient: {
    identifyPet: vi.fn(),
  }
}));

// ── Auth store mock (default: unauthenticated) ───────────────────────────────
// Use vi.fn() so individual tests can call .mockImplementation() to override.
vi.mock('../../store/authStore', () => ({
  useAuthStore: vi.fn((sel: any) => sel({ isAuthenticated: false })),
}));

// ── Pet store mock (default: no owned pets) ──────────────────────────────────
vi.mock('../../store/petStore', () => ({
  usePetStore: vi.fn((sel: any) => sel({ pets: [], hydrate: vi.fn() })),
}));

// Mock MediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    }),
  },
});

// Mock Canvas for capture
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  drawImage: vi.fn(),
}) as any;

HTMLCanvasElement.prototype.toBlob = function (callback) {
  callback(new Blob(['mock_image'], { type: 'image/jpeg' }));
};

const renderWithRouter = (component: React.ReactNode) =>
  render(<BrowserRouter>{component}</BrowserRouter>);

const capturePhoto = async () => {
  fireEvent.click(screen.getByLabelText(/Capture photo/i));
};

// ── Scan state tests ─────────────────────────────────────────────────────────
describe('Scan Page - States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('renders CameraView initially', async () => {
    renderWithRouter(<Scan />);
    expect(screen.getAllByText(/Position nose within the frame/i)[0]).toBeInTheDocument();
    expect(screen.getByLabelText(/Capture photo/i)).toBeInTheDocument();
  });

  it('handles MATCH state correctly', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      matches: [{ pet_id: 'pet-123', confidence: 0.95, qr_tag_id: 'tag-123' }]
    });

    renderWithRouter(<Scan />);
    await capturePhoto();

    expect(screen.getByText('Reading the nose pattern...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Match Found!')).toBeInTheDocument();
    });
    expect(screen.getByText(/View Pet Profile/i)).toBeInTheDocument();
  });

  it('handles AMBIGUOUS state correctly', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      matches: [
        { pet_id: 'pet-1', confidence: 0.8 },
        { pet_id: 'pet-2', confidence: 0.75 }
      ]
    });

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Multiple Similar Profiles')).toBeInTheDocument();
    });
    expect(screen.getByText(/carefully review the candidates/i)).toBeInTheDocument();
  });

  it('handles UNKNOWN state correctly', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({ matches: [] });

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('No Match Found')).toBeInTheDocument();
    });
    expect(screen.getByText(/This nose isn't registered/i)).toBeInTheDocument();
    expect(screen.getByText(/Register this pet/i)).toBeInTheDocument();
  });

  it('handles QUALITY_FAILURE state correctly', async () => {
    (ApiClient.identifyPet as any).mockRejectedValueOnce(new Error('Quality check failed: image blurry'));

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Scan Unclear')).toBeInTheDocument();
    });
    expect(screen.getByText(/couldn't get a clear read/i)).toBeInTheDocument();
    expect(screen.getByText(/image blurry/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan Again/i)).toBeInTheDocument();
  });

  it('handles SYSTEM_FAILURE state correctly', async () => {
    (ApiClient.identifyPet as any).mockRejectedValueOnce(new Error('503 Service Unavailable'));

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    });
    expect(screen.getByText(/system issue, not a problem with your scan/i)).toBeInTheDocument();
    expect(screen.getByText(/503 Service Unavailable/i)).toBeInTheDocument();
  });

  it('validates reduced motion classes are present for a11y', async () => {
    let resolveApi: any;
    (ApiClient.identifyPet as any).mockImplementationOnce(() => {
      return new Promise((resolve) => {
        resolveApi = resolve;
      });
    });

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Reading the nose pattern...')).toBeInTheDocument();
    });

    const processingContainer = screen.getByText('Reading the nose pattern...').parentElement;
    expect(processingContainer?.innerHTML).toContain('motion-reduce:hidden');
    resolveApi({ matches: [] });
  });
});

// ── MATCH routing regression ──────────────────────────────────────────────────
//
// These tests verify the routing decision in ResultView.handleViewProfile():
//
//  Case 1: Unauthenticated finder + valid qrTagId   → /p/:qrTagId   (PUBLIC)
//  Case 2: Authenticated owner + own pet            → /pets/:petId  (PRIVATE)
//  Case 3: Authenticated user + another person's pet → /p/:qrTagId  (PUBLIC)
//  Case 4: MATCH without qrTagId                    → error shown, never navigate to /pets/
//
describe('Scan MATCH → View Pet Profile routing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  // Case 1: Unauthenticated finder + qrTagId present → /p/:qrTagId
  it('Case 1 — unauthenticated finder + qrTagId: navigates to /p/:qrTagId', async () => {
    // Default mocks: isAuthenticated=false, pets=[]
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      matches: [{ pet_id: 'pet-abc', confidence: 0.95, qr_tag_id: 'tag-xyz' }],
    });

    renderWithRouter(<Scan />);
    await capturePhoto();
    await waitFor(() => expect(screen.getByText('Match Found!')).toBeInTheDocument());

    fireEvent.click(screen.getByText(/View Pet Profile/i));

    expect(mockNavigate).toHaveBeenCalledWith('/p/tag-xyz');
    expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining('/pets/'));
  });

  // Case 2: Authenticated owner + matched pet is theirs → /pets/:petId
  it('Case 2 — authenticated owner + own pet: navigates to /pets/:petId', async () => {
    const { useAuthStore } = await import('../../store/authStore');
    const { usePetStore } = await import('../../store/petStore');

    (useAuthStore as any).mockImplementation((sel: any) =>
      sel({ isAuthenticated: true })
    );
    (usePetStore as any).mockImplementation((sel: any) =>
      sel({ pets: [{ id: 'pet-mine', name: 'Buddy' }], hydrate: vi.fn() })
    );

    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      matches: [{ pet_id: 'pet-mine', confidence: 0.95, qr_tag_id: 'tag-mine' }],
    });

    renderWithRouter(<Scan />);
    await capturePhoto();
    await waitFor(() => expect(screen.getByText('Match Found!')).toBeInTheDocument());

    fireEvent.click(screen.getByText(/View Pet Profile/i));

    expect(mockNavigate).toHaveBeenCalledWith('/pets/pet-mine');
    expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining('/p/'));
  });

  // Case 3: Authenticated user + another person's pet → /p/:qrTagId (public, not /pets/)
  it('Case 3 — authenticated user + another person\'s pet: navigates to /p/:qrTagId', async () => {
    const { useAuthStore } = await import('../../store/authStore');
    const { usePetStore } = await import('../../store/petStore');

    // Authenticated but owns different pet
    (useAuthStore as any).mockImplementation((sel: any) =>
      sel({ isAuthenticated: true })
    );
    (usePetStore as any).mockImplementation((sel: any) =>
      sel({ pets: [{ id: 'my-other-pet', name: 'Rex' }], hydrate: vi.fn() })
    );

    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      // Matched pet does NOT belong to current user
      matches: [{ pet_id: 'someone-elses-pet', confidence: 0.95, qr_tag_id: 'tag-stranger' }],
    });

    renderWithRouter(<Scan />);
    await capturePhoto();
    await waitFor(() => expect(screen.getByText('Match Found!')).toBeInTheDocument());

    fireEvent.click(screen.getByText(/View Pet Profile/i));

    // Must route to PUBLIC profile — not the private /pets/ route
    expect(mockNavigate).toHaveBeenCalledWith('/p/tag-stranger');
    expect(mockNavigate).not.toHaveBeenCalledWith(expect.stringContaining('/pets/'));
  });

  // Case 4: MATCH without qrTagId — controlled error, no navigation to /pets/
  it('Case 4 — MATCH without qrTagId: shows error message, never navigates to /pets/', async () => {
    // Default: unauthenticated, no owned pets
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      matches: [{ pet_id: 'pet-abc', confidence: 0.95 }], // no qr_tag_id field
    });

    renderWithRouter(<Scan />);
    await capturePhoto();
    await waitFor(() => expect(screen.getByText('Match Found!')).toBeInTheDocument());

    fireEvent.click(screen.getByText(/View Pet Profile/i));

    // Error message must appear
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByRole('alert').textContent).toMatch(/tag ID was returned|unavailable/i);

    // Must NOT have navigated anywhere
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
