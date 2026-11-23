import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CommunityPostDetail from './CommunityPostDetail';

// Mock DashboardNav
vi.mock('../components/DashboardNav', () => ({
  DashboardNav: () => <nav data-testid="dashboard-nav" />,
}));

describe('CommunityPostDetail Component (Contract C4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders post and provides accessible >= 44x44px touch target on report button', async () => {
    const mockPost = {
      id: 'post-123',
      title: 'Spotted stray companion near South Park',
      content: 'Small tan dog wandering near park entrance. Very calm.',
      post_type: 'general',
      channel: 'general',
      author_name: 'Elena Rostova',
      created_at: '2026-11-23T10:00:00Z',
      author: {
        id: 'user-1',
        full_name: 'Elena Rostova',
      },
    };

    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/replies')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPost),
      });
    });

    render(
      <MemoryRouter initialEntries={['/community/post/post-123']}>
        <Routes>
          <Route path="/community/post/:postId" element={<CommunityPostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Spotted stray companion near South Park')).toBeInTheDocument();
    });

    const reportButton = screen.getByRole('button', { name: /report post/i });
    expect(reportButton).toBeInTheDocument();

    // Invariant Contract C4: touch target must be at least 44x44px
    expect(reportButton.className).toContain('min-h-[44px]');
    expect(reportButton.className).toContain('min-w-[44px]');
  });
});
