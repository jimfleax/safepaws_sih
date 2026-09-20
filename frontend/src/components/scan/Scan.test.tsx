import React from 'react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Scan from '../../pages/Scan';
import { BrowserRouter } from 'react-router-dom';
import { usePetStore } from '../../store/petStore';

// Mock MediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    }),
  },
});

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

  const advanceToCompare = () => {
    fireEvent.click(screen.getByText('Simulate Align'));
    fireEvent.click(screen.getByText('Simulate Capture Click'));
    fireEvent.click(screen.getByText('Backend: Start Analyze'));
    fireEvent.click(screen.getByText('Backend: Start Compare'));
  };

  it('handles MATCH state correctly', async () => {
    renderWithRouter(<Scan />);
    
    fireEvent.click(screen.getByText('Simulate Align'));
    fireEvent.click(screen.getByText('Simulate Capture Click'));
    
    const analyzeBtn = screen.getByText('Backend: Start Analyze');
    fireEvent.click(analyzeBtn);
    expect(screen.getByText('Reading the nose pattern...')).toBeInTheDocument();
    
    const compareBtn = screen.getByText('Backend: Start Compare');
    fireEvent.click(compareBtn);
    expect(screen.getByText('Comparing against registered pets…')).toBeInTheDocument();
    
    const matchBtn = screen.getByText('MATCH');
    fireEvent.click(matchBtn);
    
    expect(screen.getByText('Match Found!')).toBeInTheDocument();
    expect(screen.getByText(/View Pet Profile/i)).toBeInTheDocument();
  });

  it('handles AMBIGUOUS state correctly', async () => {
    renderWithRouter(<Scan />);
    advanceToCompare();
    
    const ambiguousBtn = screen.getByText('AMBIGUOUS');
    fireEvent.click(ambiguousBtn);
    
    expect(screen.getByText('Multiple Similar Profiles')).toBeInTheDocument();
    expect(screen.getByText(/carefully review the candidates/i)).toBeInTheDocument();
  });

  it('handles UNKNOWN state correctly', async () => {
    renderWithRouter(<Scan />);
    advanceToCompare();
    
    const unknownBtn = screen.getByText('UNKNOWN');
    fireEvent.click(unknownBtn);
    
    expect(screen.getByText('No Match Found')).toBeInTheDocument();
    expect(screen.getByText(/This nose isn't registered/i)).toBeInTheDocument();
    expect(screen.getByText(/Register this pet/i)).toBeInTheDocument();
  });

  it('handles QUALITY_FAILURE state correctly', async () => {
    renderWithRouter(<Scan />);
    advanceToCompare();
    
    const qualityBtn = screen.getByText('QUALITY FAIL');
    fireEvent.click(qualityBtn);
    
    expect(screen.getByText('Scan Unclear')).toBeInTheDocument();
    expect(screen.getByText(/couldn't get a clear read/i)).toBeInTheDocument();
    expect(screen.getByText(/Blurry image/i)).toBeInTheDocument();
    expect(screen.getByText(/Scan Again/i)).toBeInTheDocument();
  });

  it('handles SYSTEM_FAILURE state correctly', async () => {
    renderWithRouter(<Scan />);
    advanceToCompare();
    
    const sysBtn = screen.getByText('SYS FAIL');
    fireEvent.click(sysBtn);
    
    expect(screen.getByText('Service Unavailable')).toBeInTheDocument();
    expect(screen.getByText(/system issue, not a problem with your scan/i)).toBeInTheDocument();
    expect(screen.getByText(/503 Service Unavailable/i)).toBeInTheDocument();
  });

  it('validates reduced motion classes are present for a11y', async () => {
    renderWithRouter(<Scan />);
    
    fireEvent.click(screen.getByText('Simulate Align'));
    fireEvent.click(screen.getByText('Simulate Capture Click'));
    const analyzeBtn = screen.getByText('Backend: Start Analyze');
    fireEvent.click(analyzeBtn);
    
    const processingContainer = screen.getByText('Reading the nose pattern...').parentElement;
    expect(processingContainer?.innerHTML).toContain('motion-reduce:hidden');
    expect(processingContainer?.innerHTML).toContain('motion-reduce:animate-none');
  });
});
