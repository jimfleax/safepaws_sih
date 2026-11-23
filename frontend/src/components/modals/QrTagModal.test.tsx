import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QrTagModal } from './QrTagModal';
import { Pet } from '../../types';

describe('QrTagModal Contract and Interaction Verification', () => {
  const basePet: Pet = {
    id: 'pet-test-1',
    name: 'Buddy',
    species: 'dog',
    breed: 'Golden Retriever',
    color: 'Honey',
    age: '3',
    photoUrl: '',
    status: 'safe',
    qrTagId: 'TAG-BUDDY-01',
    distinctiveFeatures: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('acts as an accessible dialog and supports escape key to close', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <QrTagModal 
        isOpen={true} 
        onClose={handleClose} 
        pet={basePet}
      />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/Smart Collar QR Tag/i)).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('displays canonical pet name and QR tag identifier accurately', () => {
    render(
      <QrTagModal 
        isOpen={true} 
        onClose={vi.fn()} 
        pet={basePet}
      />
    );

    const nameElements = screen.getAllByText('Buddy');
    expect(nameElements.length).toBeGreaterThanOrEqual(1);
    expect(nameElements[0]).toBeInTheDocument();

    const tagElements = screen.getAllByText('TAG-BUDDY-01');
    expect(tagElements.length).toBeGreaterThanOrEqual(1);
    expect(tagElements[0]).toBeInTheDocument();

    expect(screen.getByText(/Guardian Privacy Shield Active/i)).toBeInTheDocument();
  });

  it('flips between front QR and reverse medal upon user click', async () => {
    const user = userEvent.setup();

    render(
      <QrTagModal 
        isOpen={true} 
        onClose={vi.fn()} 
        pet={basePet}
      />
    );

    // Initial state: front view button indicates medal flip available
    const flipButton = screen.getByRole('button', { name: /Flip to View Engraved Medal/i });
    expect(flipButton).toBeInTheDocument();

    await user.click(flipButton);

    // Reverse state: engraved medal details rendered
    expect(screen.getByRole('button', { name: /Show Scannable QR Code/i })).toBeInTheDocument();
    expect(screen.getByText(/GUARDIAN MEDIATED RELAY/i)).toBeInTheDocument();
    expect(screen.getByText(/SERIAL: TAG-BUDDY-01/i)).toBeInTheDocument();
  });

  it('handles copy tag URL and download actions cleanly', async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
      configurable: true,
    });

    render(
      <QrTagModal 
        isOpen={true} 
        onClose={vi.fn()} 
        pet={basePet}
      />
    );

    const copyBtn = screen.getByRole('button', { name: /Copy Tag URL/i });
    expect(copyBtn).toBeInTheDocument();
    await user.click(copyBtn);
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('/p/TAG-BUDDY-01'));

    const downloadBtn = screen.getByRole('button', { name: /Download PNG/i });
    expect(downloadBtn).toBeInTheDocument();
  });
});
