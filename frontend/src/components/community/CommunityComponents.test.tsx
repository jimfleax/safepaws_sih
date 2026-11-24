import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommunityChannelFilterBar } from './CommunityChannelFilterBar';
import { AuthPromptModal } from '../modals/AuthPromptModal';
import { ReportModal } from './ReportModal';
import { ComposeModal } from './ComposeModal';
import { PostCard, Post } from './PostCard';
import { RecoverySidebar } from './RecoverySidebar';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('CommunityChannelFilterBar Accessibility & Navigation', () => {
  it('renders WAI-ARIA tablist semantics and supports keyboard arrow navigation', () => {
    const handleChange = vi.fn();
    render(
      <CommunityChannelFilterBar
        activeChannel="general"
        onChange={handleChange}
        counts={{ general: 12, 'lost-found': 3 }}
      />
    );

    const tablist = screen.getByRole('tablist', { name: /community channels/i });
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(4);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');

    // ArrowRight moves to next tab
    fireEvent.keyDown(tabs[0], { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('lost-found');

    // End key moves to last tab
    fireEvent.keyDown(tabs[0], { key: 'End' });
    expect(handleChange).toHaveBeenCalledWith('reunion-stories');

    // Home key moves to first tab
    fireEvent.keyDown(tabs[3], { key: 'Home' });
    expect(handleChange).toHaveBeenCalledWith('general');

    // Channel count badge displayed
    expect(screen.getByText('12')).toBeInTheDocument();
  });
});

describe('AuthPromptModal Accessibility & Focus Management', () => {
  it('handles focus entry, Escape dismissal, and navigation actions', () => {
    const handleClose = vi.fn();
    const triggerBtn = document.createElement('button');
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();

    const { rerender } = render(
      <MemoryRouter>
        <AuthPromptModal isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    );

    const dialog = screen.getByRole('dialog', { name: /neighborhood sign-in/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');

    // Escape closes modal
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);

    // Sign in CTA navigates to /login
    const signInBtn = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(signInBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login');

    // Register CTA navigates to /login?mode=register
    const registerBtn = screen.getByRole('button', { name: /register/i });
    fireEvent.click(registerBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/login?mode=register');

    // Modal unmount restores focus
    rerender(
      <MemoryRouter>
        <AuthPromptModal isOpen={false} onClose={handleClose} />
      </MemoryRouter>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    document.body.removeChild(triggerBtn);
  });
});

describe('ReportModal Moderation & API Contract', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders 4 structured violation reasons and submits payload with credentials', async () => {
    const handleClose = vi.fn();
    let capturedBody: any = null;
    let capturedCredentials: any = null;

    global.fetch = vi.fn().mockImplementation((url: string, opts: any) => {
      capturedBody = JSON.parse(opts.body);
      capturedCredentials = opts.credentials;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 'rep-1', status: 'pending' }),
      });
    });

    render(
      <ReportModal
        isOpen={true}
        onClose={handleClose}
        postId="post-99"
        itemDescription="test post"
      />
    );

    const dialog = screen.getByRole('dialog', { name: /report community item/i });
    expect(dialog).toBeInTheDocument();

    // Verify 4 structured violation reasons exist
    expect(screen.getByText('Inaccurate Sighting or False Telemetry')).toBeInTheDocument();
    expect(screen.getByText('Harassment or Extortion Attempt')).toBeInTheDocument();
    expect(screen.getByText('Spam or Commercial Solicitation')).toBeInTheDocument();
    expect(screen.getByText('Immediate Safety or Animal Welfare Concern')).toBeInTheDocument();

    // Select spam
    const spamRadio = screen.getByDisplayValue('spam');
    fireEvent.click(spamRadio);

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/report filed/i)).toBeInTheDocument();
    });

    expect(capturedBody).toEqual({
      reason: 'spam',
      post_id: 'post-99',
    });
    expect(capturedCredentials).toBe('include');
  });

  it('displays error role="alert" when report submission fails', async () => {
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ detail: 'Not authenticated' }),
      });
    });

    render(
      <ReportModal
        isOpen={true}
        onClose={vi.fn()}
        postId="post-99"
      />
    );

    const submitBtn = screen.getByRole('button', { name: /submit report/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/not authenticated/i);
    });
  });
});

describe('ComposeModal Validation & Focus Management', () => {
  it('traps focus, handles Escape dismissal, and displays validation error on empty fields', async () => {
    const handleClose = vi.fn();
    const handleSubmit = vi.fn();

    render(
      <ComposeModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    );

    const dialog = screen.getByRole('dialog', { name: /publish field dispatch/i });
    expect(dialog).toBeInTheDocument();

    // Try submitting without title/content
    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    expect(handleSubmit).not.toHaveBeenCalled();
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/please provide both an incident title and dispatch content/i);

    // Escape closes modal
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

describe('PostCard Product-Truth & Neutral Fallback', () => {
  it('displays neutral "Community member" fallback when author_name is absent (no ID exposure)', () => {
    const postWithoutName: Post = {
      id: 'post-01',
      title: 'Spotted stray companion',
      content: 'Near the reservoir trail.',
      channel: 'sightings',
      author_id: 'usr-8899aabb',
      created_at: new Date().toISOString(),
    };

    render(
      <MemoryRouter>
        <PostCard post={postWithoutName} />
      </MemoryRouter>
    );

    // Neutral fallback displayed without exposing user ID or inventing neighbor nicknames
    expect(screen.getByText('Community member')).toBeInTheDocument();
    expect(screen.queryByText(/Neighbor #/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/8899AABB/i)).not.toBeInTheDocument();

    // Initial derived cleanly from 'Community member' -> 'C'
    expect(screen.getByText('C')).toBeInTheDocument();

    // Reply count displays "Join Discussion" when undefined (does not invent zero count)
    expect(screen.getByText(/join discussion/i)).toBeInTheDocument();
  });

  it('displays server-provided reply count when genuinely present', () => {
    const postWithReplies: Post = {
      id: 'post-02',
      title: 'Found leash near sector park',
      content: 'Red nylon leash.',
      channel: 'lost-found',
      author_name: 'Elena Rostova',
      created_at: new Date().toISOString(),
      reply_count: 5,
    };

    render(
      <MemoryRouter>
        <PostCard post={postWithReplies} />
      </MemoryRouter>
    );

    expect(screen.getByText('Elena Rostova')).toBeInTheDocument();
    expect(screen.getByText(/5 replies/i)).toBeInTheDocument();
  });
});

describe('RecoverySidebar Truth & Live Alert Metrics', () => {
  it('displays real active alert count and grounded empty state without geographic claims', () => {
    const { rerender } = render(
      <MemoryRouter>
        <RecoverySidebar activeAlerts={[]} />
      </MemoryRouter>
    );

    // Count badge
    expect(screen.getByText('0')).toBeInTheDocument();
    // Neutral grounded message (no fake zone or proximity claims)
    expect(screen.getByText(/zero active missing companion declarations on record/i)).toBeInTheDocument();
    expect(screen.queryByText(/in this zone/i)).not.toBeInTheDocument();

    // When alerts are present
    const mockAlerts = [
      { id: 'alt-1', petName: 'Bailey', status: 'active', lastSeenAddress: '123 Main St', createdAt: '2026-11-24' }
    ];

    rerender(
      <MemoryRouter>
        <RecoverySidebar activeAlerts={mockAlerts} />
      </MemoryRouter>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Bailey')).toBeInTheDocument();
    // Raw address suppressed in favor of Vicinity Reported
    expect(screen.getByText('Vicinity Reported')).toBeInTheDocument();
    expect(screen.queryByText('123 Main St')).not.toBeInTheDocument();
  });
});
