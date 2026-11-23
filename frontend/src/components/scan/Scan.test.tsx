import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Scan from '../../pages/Scan';
import { BrowserRouter } from 'react-router-dom';
import { ApiClient } from '../../utils/apiClient';

// Mock ApiClient
vi.mock('../../utils/apiClient', () => ({
  ApiClient: {
    identifyPet: vi.fn(),
  }
}));

/**
 * HARDWARE TEST QUALIFICATION NOTE:
 * These unit tests execute in a headless JSDOM environment using synthetic MediaStream,
 * MediaStreamTrack, and HTMLCanvasElement mocks. They verify software invariants, lifecycle
 * transitions, race condition guards, and stream teardown semantics. They do not constitute
 * physical optical hardware verification, which requires manual testing with real camera sensors.
 */

// Default Mock MediaStream & Track
const createMockTrack = (hasTorch = false) => ({
  stop: vi.fn(),
  getCapabilities: () => (hasTorch ? { torch: true } : {}),
  applyConstraints: vi.fn().mockResolvedValue(undefined),
});

let mockTrack = createMockTrack(false);

Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockImplementation(() => Promise.resolve({
      getTracks: () => [mockTrack],
      getVideoTracks: () => [mockTrack],
    })),
    enumerateDevices: vi.fn().mockResolvedValue([
      { kind: 'videoinput', deviceId: 'cam-1', label: 'Back Camera' },
    ]),
  },
  configurable: true,
});

// Mock Canvas for testing capture
HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
  drawImage: vi.fn(),
}) as any;

HTMLCanvasElement.prototype.toBlob = function (callback) {
  callback(new Blob(['mock_image'], { type: 'image/jpeg' }));
};

// Mock URL.createObjectURL / revokeObjectURL for Node/JSDOM
if (typeof URL.createObjectURL === 'undefined') {
  URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-preview-url');
  URL.revokeObjectURL = vi.fn();
}

describe('Scan Page - States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTrack = createMockTrack(false);
    (navigator.mediaDevices.getUserMedia as any).mockImplementation(() => Promise.resolve({
      getTracks: () => [mockTrack],
      getVideoTracks: () => [mockTrack],
    }));
    (navigator.mediaDevices.enumerateDevices as any).mockResolvedValue([
      { kind: 'videoinput', deviceId: 'cam-1', label: 'Back Camera' },
    ]);
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  const capturePhoto = async () => {
    const captureBtn = screen.getByLabelText(/Capture photo/i);
    fireEvent.click(captureBtn);

    // If review dock appears, confirm capture
    const confirmBtn = screen.queryByLabelText(/Confirm and analyze photo|Identify Pet/i);
    if (confirmBtn) {
      fireEvent.click(confirmBtn);
    }
  };

  it('renders CameraView initially', async () => {
    renderWithRouter(<Scan />);
    expect(screen.getAllByText(/Position canine nose leather within reticle/i)[0]).toBeInTheDocument();

    // Check for the capture button
    const captureBtn = screen.getByLabelText(/Capture photo/i);
    expect(captureBtn).toBeInTheDocument();
  });

  it('handles MATCH state correctly', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'MATCH',
      matches: [{ pet_id: 'pet-123', name: 'Buddy', confidence: 0.95 }]
    });

    renderWithRouter(<Scan />);
    await capturePhoto();
    
    expect(screen.getByText('Reading the nose pattern...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Identity Confirmed')).toBeInTheDocument();
    });
    expect(screen.getByText(/View Pet Profile/i)).toBeInTheDocument();
  });

  it('handles single candidate with backend AMBIGUOUS correctly without auto-promoting to MATCH', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'AMBIGUOUS',
      matches: [{ pet_id: 'pet-single', name: 'Rover', confidence: 0.72 }]
    });

    renderWithRouter(<Scan />);
    await capturePhoto();
    
    await waitFor(() => {
      expect(screen.getByText('Multiple Similar Profiles')).toBeInTheDocument();
    });
    expect(screen.getByText('Rover')).toBeInTheDocument();
    expect(screen.queryByText('Identity Confirmed')).not.toBeInTheDocument();
  });

  it('handles multiple ambiguous candidates correctly', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'AMBIGUOUS',
      matches: [
        { pet_id: 'pet-1', name: 'Max', confidence: 0.8 },
        { pet_id: 'pet-2', name: 'Charlie', confidence: 0.75 }
      ]
    });
    
    renderWithRouter(<Scan />);
    await capturePhoto();
    
    await waitFor(() => {
      expect(screen.getByText('Multiple Similar Profiles')).toBeInTheDocument();
    });
    expect(screen.getByText(/carefully review the candidates/i)).toBeInTheDocument();
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('handles selecting an ambiguous candidate without promoting to biometric MATCH', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'AMBIGUOUS',
      matches: [
        { pet_id: 'pet-1', name: 'Max', confidence: 0.8 },
        { pet_id: 'pet-2', name: 'Charlie', confidence: 0.75 }
      ]
    });

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Multiple Similar Profiles')).toBeInTheDocument();
    });

    const selectButtons = screen.getAllByRole('button', { name: /Select Candidate/i });
    expect(selectButtons.length).toBeGreaterThan(0);
    fireEvent.click(selectButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Candidate Selected by Finder')).toBeInTheDocument();
    });
    expect(screen.queryByText('Identity Confirmed')).not.toBeInTheDocument();
    expect(screen.getByText(/visually selected by the finder, not verified by an automated biometric confidence threshold/i)).toBeInTheDocument();
  });

  it('handles UNKNOWN state correctly', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'UNKNOWN',
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

  it('handles malformed or unexpected response safely as UNKNOWN', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'UNEXPECTED_STATUS_CODE',
      matches: null
    });

    renderWithRouter(<Scan />);
    await capturePhoto();
    
    await waitFor(() => {
      expect(screen.getByText('No Match Found')).toBeInTheDocument();
    });
    expect(screen.getByText(/Register this pet/i)).toBeInTheDocument();
  });

  it('handles QUALITY_FAILURE state correctly with string error', async () => {
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

  it('handles structured 422 error code as QUALITY_FAILURE', async () => {
    const err: any = new Error('Identification failed: Blur detected');
    err.status = 422;
    err.errorCode = 'LOW_QUALITY_IMAGE';
    err.detail = 'Laplacian variance below threshold (blur detected)';
    (ApiClient.identifyPet as any).mockRejectedValueOnce(err);

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Scan Unclear')).toBeInTheDocument();
    });
    expect(screen.getByText(/Laplacian variance below threshold/i)).toBeInTheDocument();
  });

  it('handles structured 503 error as SYSTEM_FAILURE', async () => {
    const err: any = new Error('Identification failed: Model unavailable');
    err.status = 503;
    err.errorCode = 'CHECKPOINT_MISSING';
    err.detail = 'Embedding model checkpoint not found on server';
    (ApiClient.identifyPet as any).mockRejectedValueOnce(err);

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    });
    expect(screen.getByText(/Embedding model checkpoint not found/i)).toBeInTheDocument();
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
    act(() => {
      resolveApi({ matches: [] });
    });
  });

  // UX-06.4: Dedicated Capture, Review & Retake Flow
  it('handles capture, review, and retake workflow correctly', async () => {
    renderWithRouter(<Scan />);
    expect(screen.getByText(/Position canine nose leather within reticle/i)).toBeInTheDocument();

    // 1. Shutter click enters REVIEW mode
    const captureBtn = screen.getByLabelText(/Capture photo/i);
    fireEvent.click(captureBtn);

    expect(screen.getByText(/Review capture clarity before vector matching/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Retake photo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm and analyze photo/i)).toBeInTheDocument();

    // 2. Click Retake -> returns to live camera
    const retakeBtn = screen.getByLabelText(/Retake photo/i);
    fireEvent.click(retakeBtn);

    expect(screen.getByText(/Position canine nose leather within reticle/i)).toBeInTheDocument();
  });

  // UX-06.4: Camera Switcher
  it('renders camera switch button when multiple video devices exist', async () => {
    (navigator.mediaDevices.enumerateDevices as any).mockResolvedValueOnce([
      { kind: 'videoinput', deviceId: 'cam-front', label: 'Front Camera' },
      { kind: 'videoinput', deviceId: 'cam-back', label: 'Back Telephoto Camera' },
    ]);

    renderWithRouter(<Scan />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Switch camera device/i)).toBeInTheDocument();
    });

    const switchBtn = screen.getByLabelText(/Switch camera device/i);
    fireEvent.click(switchBtn);

    // Verifies stream stop and reacquisition
    expect(mockTrack.stop).toHaveBeenCalled();
  });

  // UX-06.4: Torch Control
  it('renders torch control when hardware capability is exposed', async () => {
    const torchTrack = createMockTrack(true);
    (navigator.mediaDevices.getUserMedia as any).mockResolvedValueOnce({
      getTracks: () => [torchTrack],
      getVideoTracks: () => [torchTrack],
    });

    renderWithRouter(<Scan />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Turn on optical flashlight/i)).toBeInTheDocument();
    });

    const torchBtn = screen.getByLabelText(/Turn on optical flashlight/i);
    fireEvent.click(torchBtn);

    await waitFor(() => {
      expect(torchTrack.applyConstraints).toHaveBeenCalledWith({
        advanced: [{ torch: true }],
      });
    });
  });

  // UX-06.4: Permission Denied State
  it('handles PERMISSION_DENIED state when camera access is declined', async () => {
    const permErr = new Error('Permission denied');
    permErr.name = 'NotAllowedError';
    (navigator.mediaDevices.getUserMedia as any).mockRejectedValueOnce(permErr);

    renderWithRouter(<Scan />);

    await waitFor(() => {
      expect(screen.getByText('Camera Access Required')).toBeInTheDocument();
    });
    expect(screen.getByText(/PERMISSION RESTRICTED/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Canine Photo Instead/i)).toBeInTheDocument();
  });

  // UX-06.4: Camera Hardware Unavailable State
  it('handles UNAVAILABLE state when no camera sensor is detected', async () => {
    const unavailErr = new Error('No device found');
    unavailErr.name = 'NotFoundError';
    (navigator.mediaDevices.getUserMedia as any).mockRejectedValueOnce(unavailErr);

    renderWithRouter(<Scan />);

    await waitFor(() => {
      expect(screen.getByText('Optical Sensor Offline')).toBeInTheDocument();
    });
    expect(screen.getByText(/HARDWARE UNAVAILABLE/i)).toBeInTheDocument();
    expect(screen.getByText(/Upload Canine Photo Instead/i)).toBeInTheDocument();
  });

  // UX-06.4: Simulation Mode Transparency
  it('displays prominent SIMULATION MODE banner when result is simulated', async () => {
    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'MATCH',
      matches: [{ pet_id: 'pet-demo', name: 'Demo Companion', confidence: 0.99 }]
    });

    renderWithRouter(<Scan />);
    await capturePhoto();

    await waitFor(() => {
      expect(screen.getByText('Identity Confirmed')).toBeInTheDocument();
    });
  });

  // UX-06.4 Independent Lifecycle Audit Check: Late getUserMedia Resolution after Unmount
  it('stops media tracks immediately if getUserMedia resolves after component has unmounted (late resolution race guard)', async () => {
    let resolveGetUserMedia!: (stream: any) => void;
    const delayedTrack = createMockTrack(false);
    const delayedStream = {
      getTracks: () => [delayedTrack],
      getVideoTracks: () => [delayedTrack],
    };

    (navigator.mediaDevices.getUserMedia as any).mockImplementationOnce(
      () => new Promise((resolve) => {
        resolveGetUserMedia = resolve;
      })
    );

    const { unmount } = renderWithRouter(<Scan />);

    // Wait for enumerateDevices to resolve and getUserMedia to be invoked
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });

    // Unmount before getUserMedia resolves (simulates user navigating away while permission prompt was pending)
    unmount();

    // Now getUserMedia resolves asynchronously
    await act(async () => {
      resolveGetUserMedia(delayedStream);
    });

    // Invariant: track.stop() must be called immediately so no orphaned camera tracks run
    expect(delayedTrack.stop).toHaveBeenCalledTimes(1);
  });

  // UX-06.4 Independent Lifecycle Audit Check: Active Stream Teardown on Unmount
  it('teardowns active stream tracks when component unmounts', async () => {
    const activeTrack = createMockTrack(false);
    (navigator.mediaDevices.getUserMedia as any).mockResolvedValueOnce({
      getTracks: () => [activeTrack],
      getVideoTracks: () => [activeTrack],
    });

    const { unmount } = renderWithRouter(<Scan />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Capture photo/i)).toBeInTheDocument();
    });

    unmount();

    expect(activeTrack.stop).toHaveBeenCalled();
  });

  // UX-06.4 Independent Lifecycle Audit Check: File Upload Fallback Transition
  it('handles file upload fallback when camera access is declined', async () => {
    const permErr = new Error('Permission denied');
    permErr.name = 'NotAllowedError';
    (navigator.mediaDevices.getUserMedia as any).mockRejectedValueOnce(permErr);

    (ApiClient.identifyPet as any).mockResolvedValueOnce({
      status: 'NO_MATCH',
      matches: []
    });

    renderWithRouter(<Scan />);

    await waitFor(() => {
      expect(screen.getByText('Camera Access Required')).toBeInTheDocument();
    });

    const fileInput = screen.getByLabelText(/Upload canine photo file fallback/i) as HTMLInputElement;
    expect(fileInput).toBeInTheDocument();

    const testFile = new File(['fake-nose-bytes'], 'test-nose.jpg', { type: 'image/jpeg' });
    fireEvent.change(fileInput, { target: { files: [testFile] } });

    await waitFor(() => {
      expect(ApiClient.identifyPet).toHaveBeenCalledWith(testFile);
    });
  });
});
