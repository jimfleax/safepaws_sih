import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PublicTagProfile from '../PublicTagProfile';
import { PetCard } from '../../components/PetCard';
import { QrTagModal } from '../../components/modals/QrTagModal';
import { ApiClient } from '../../utils/apiClient';
import { Pet } from '../../types';

vi.mock('../../utils/apiClient', () => ({
  ApiClient: {
    getPetByTag: vi.fn(),
    reportSighting: vi.fn(),
  },
}));

describe('Owner & Pet Experience Verification (UX-06.3 Closeout)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PublicTagProfile & Privacy Invariant SD-01 (Actual React Component Rendering)', () => {
    // Case 1: Medical notes populated; shareMedicalNotes=false
    it('Case 1: withholds medical notes when shareMedicalNotes is false', async () => {
      const mockPet: Pet = {
        id: 'pet-123',
        name: 'Barnaby',
        species: 'dog',
        breed: 'Golden Retriever',
        color: 'Honey Gold',
        age: '4',
        photoUrl: '',
        status: 'safe',
        qrTagId: 'TAG-BARNABY-01',
        distinctiveFeatures: ['White chest patch'],
        medicalNotes: 'ADVERSARIAL_LEAK: Requires daily insulin injection at 8am',
        shareMedicalNotes: false,
      };

      vi.mocked(ApiClient.getPetByTag).mockResolvedValueOnce(mockPet);

      render(
        <MemoryRouter initialEntries={['/p/TAG-BARNABY-01']}>
          <Routes>
            <Route path="/p/:tagId" element={<PublicTagProfile />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('I am Barnaby')).toBeInTheDocument();
      // SD-01: Must NOT render medical notes or container
      expect(screen.queryByText(/ADVERSARIAL_LEAK/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Critical Care & Medical Notes/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Guardian Contact Protected/i)).toBeInTheDocument();
    });

    // Case 2: Medical notes populated; shareMedicalNotes=true
    it('Case 2: displays medical notes when shareMedicalNotes is explicitly true', async () => {
      const mockPet: Pet = {
        id: 'pet-456',
        name: 'Luna',
        species: 'cat',
        breed: 'Siamese',
        color: 'Seal Point',
        age: '2',
        photoUrl: '',
        status: 'safe',
        qrTagId: 'TAG-LUNA-02',
        distinctiveFeatures: ['Blue eyes'],
        medicalNotes: 'Severe nut allergy - do not feed peanut butter',
        shareMedicalNotes: true,
      };

      vi.mocked(ApiClient.getPetByTag).mockResolvedValueOnce(mockPet);

      render(
        <MemoryRouter initialEntries={['/p/TAG-LUNA-02']}>
          <Routes>
            <Route path="/p/:tagId" element={<PublicTagProfile />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('I am Luna')).toBeInTheDocument();
      expect(screen.getByText(/Critical Care & Medical Notes/i)).toBeInTheDocument();
      expect(screen.getByText(/Severe nut allergy - do not feed peanut butter/i)).toBeInTheDocument();
    });

    // Case 3: Medical notes absent
    it('Case 3: does not render medical notes section when notes are absent or empty', async () => {
      const mockPet: Pet = {
        id: 'pet-789',
        name: 'Zeus',
        species: 'dog',
        breed: 'German Shepherd',
        color: 'Black and Tan',
        age: '5',
        photoUrl: '',
        status: 'safe',
        qrTagId: 'TAG-ZEUS-03',
        distinctiveFeatures: [],
        medicalNotes: '',
        shareMedicalNotes: true,
      };

      vi.mocked(ApiClient.getPetByTag).mockResolvedValueOnce(mockPet);

      render(
        <MemoryRouter initialEntries={['/p/TAG-ZEUS-03']}>
          <Routes>
            <Route path="/p/:tagId" element={<PublicTagProfile />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('I am Zeus')).toBeInTheDocument();
      expect(screen.queryByText(/Critical Care & Medical Notes/i)).not.toBeInTheDocument();
    });

    // Case 4: shareMedicalNotes undefined or missing: defaults to private
    it('Case 4: defaults to private when shareMedicalNotes is undefined or omitted', async () => {
      const mockPet: Pet = {
        id: 'pet-999',
        name: 'Milo',
        species: 'dog',
        breed: 'Beagle',
        color: 'Tricolor',
        age: '3',
        photoUrl: '',
        status: 'safe',
        qrTagId: 'TAG-MILO-04',
        distinctiveFeatures: [],
        medicalNotes: 'CONFIDENTIAL_MEDICAL: Heart murmur medication',
        shareMedicalNotes: undefined,
      };

      vi.mocked(ApiClient.getPetByTag).mockResolvedValueOnce(mockPet);

      render(
        <MemoryRouter initialEntries={['/p/TAG-MILO-04']}>
          <Routes>
            <Route path="/p/:tagId" element={<PublicTagProfile />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('I am Milo')).toBeInTheDocument();
      // SD-01: undefined must default to private
      expect(screen.queryByText(/CONFIDENTIAL_MEDICAL/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Critical Care & Medical Notes/i)).not.toBeInTheDocument();
    });

    // Case 5: Owner phone number, email and street address never rendered publicly
    it('Case 5: strictly withholds owner phone number, email and street address from rendered DOM', async () => {
      const mockPet: Pet = {
        id: 'pet-sec-01',
        name: 'Bella',
        species: 'cat',
        breed: 'Persian',
        color: 'White',
        age: '4',
        photoUrl: '',
        status: 'safe',
        qrTagId: 'TAG-BELLA-05',
        distinctiveFeatures: [],
        ownerPhone: '+1-555-ADVERSARIAL-LEAK-PHONE',
        ownerEmail: 'adversarial-leak@private-domain.org',
        ownerAddress: '742 Evergreen Terrace — PRIVATE ADDRESS',
        neighborhood: 'Oakridge Community',
      };

      vi.mocked(ApiClient.getPetByTag).mockResolvedValueOnce(mockPet);

      render(
        <MemoryRouter initialEntries={['/p/TAG-BELLA-05']}>
          <Routes>
            <Route path="/p/:tagId" element={<PublicTagProfile />} />
          </Routes>
        </MemoryRouter>
      );

      expect(await screen.findByText('I am Bella')).toBeInTheDocument();
      // SD-01: Neither phone, email, nor private street address must appear in public DOM
      expect(screen.queryByText(/555-ADVERSARIAL-LEAK-PHONE/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/adversarial-leak@private-domain.org/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/742 Evergreen Terrace/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/PRIVATE ADDRESS/i)).not.toBeInTheDocument();
      // Privacy notice must be prominent
      expect(screen.getByText(/Guardian Contact Protected/i)).toBeInTheDocument();
      expect(screen.getByText(/Personal phone numbers and contact details are withheld/i)).toBeInTheDocument();
    });
  });

  describe('Condition C-04: PetCard Canonical Identity Preservation & Copy Affordance', () => {
    const canonicalPet: Pet = {
      id: 'pet-001',
      name: 'Oliver',
      species: 'dog',
      breed: 'Labrador',
      color: 'Chocolate',
      age: '3',
      photoUrl: '',
      status: 'safe',
      qrTagId: 'TAG-OLIVER-01',
      distinctiveFeatures: [],
    };

    it('renders row view preserving exact canonical qrTagId with responsive wrapping and copy affordance', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      render(
        <MemoryRouter>
          <PetCard pet={canonicalPet} viewMode="row" />
        </MemoryRouter>
      );

      expect(screen.getByText('Oliver')).toBeInTheDocument();
      expect(screen.getByText(/Labrador • Chocolate/i)).toBeInTheDocument();
      // Condition C-04: Must render exact canonical 'TAG-OLIVER-01', NEVER 'TAG-OLIV-TAG'
      const tagLabel = screen.getByText('TAG-OLIVER-01');
      expect(tagLabel).toBeInTheDocument();
      expect(tagLabel).toHaveClass('break-all');
      expect(screen.queryByText(/TAG-OLIV-TAG/i)).not.toBeInTheDocument();

      // Accessible copy button for canonical identifier
      const copyBtn = screen.getByRole('button', { name: /Copy identifier TAG-OLIVER-01/i });
      expect(copyBtn).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();

      // Click copy button triggers clipboard write without page navigation
      fireEvent.click(copyBtn);
      expect(mockWriteText).toHaveBeenCalledWith('TAG-OLIVER-01');
      expect(await screen.findByText('Copied')).toBeInTheDocument();
    });

    it('renders grid card preserving canonical qrTagId in biometric indicator with copy action', async () => {
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
        configurable: true,
      });

      render(
        <MemoryRouter>
          <PetCard pet={canonicalPet} viewMode="grid" />
        </MemoryRouter>
      );

      expect(screen.getByText('Oliver')).toBeInTheDocument();
      expect(screen.getByText('Safe')).toBeInTheDocument();
      // Condition C-04: Biometric chip indicator displays canonical tag ID with break-all
      const tagSpan = screen.getByText('TAG-OLIVER-01');
      expect(tagSpan).toBeInTheDocument();
      expect(tagSpan).toHaveClass('break-all');

      // Grid copy button
      const copyBtn = screen.getByRole('button', { name: /Copy identifier TAG-OLIVER-01/i });
      expect(copyBtn).toBeInTheDocument();
      fireEvent.click(copyBtn);
      expect(mockWriteText).toHaveBeenCalledWith('TAG-OLIVER-01');
    });

    it('renders crisis mode when companion is lost', () => {
      const lostPet: Pet = { ...canonicalPet, status: 'lost' };
      render(
        <MemoryRouter>
          <PetCard pet={lostPet} viewMode="crisis" />
        </MemoryRouter>
      );

      expect(screen.getByText('Oliver')).toBeInTheDocument();
      expect(screen.getByText(/Active Recovery Radar/i)).toBeInTheDocument();
      expect(screen.getByText(/Manage Recovery Incident/i)).toBeInTheDocument();
    });
  });
});
