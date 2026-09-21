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
vi.mock('../../store/authStore', () => ({
  useAuthStore: (sel: any) => sel({ isAuthenticated: false }),
}));

// ── Pet store mock (default: no pets owned) ──────────────────────────────────
vi.mock('../../store/petStore', () => ({
  usePetStore: (sel: any) => sel({ pets: [] }),
}));

// Mock MediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    }),
  },
});

// Mock Canvas for testing capture
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  drawImage: vi.fn(),
}) as any;

HTMLCanvasElement.prototype.toBlob = function (callback) {
  callback(new Blob(['mock_image'], { type: 'image/jpeg' }));
};

describe('Scan Page - States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders CameraView initially', async () => {
    renderWithRouter(<Scan />);
    expect(screen.getAllByText(/Position nose within the frame/i)[0]).toBeInTheDocument();

    // Check for the capture button
    const captureBtn = screen.getByLabelText(/Capture photo/i);
    expect(captureBtn).toBeInTheDocument();
  });

  const capturePhoto = async () => {
    const captureBtn = screen.getByLabelText(/Capture photo/i);
    fireEvent.click(captureBtn);
  };

  it('handles MATCH state correctly', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      matches: [{ pet_id: 'pet-123', confidence: 0.95 }]
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
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      matches: []
    });

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
    // Keep it pending to inspect processing screen
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
    act(() => {
      resolveApi({ matches: [] });
    });
  });
});
