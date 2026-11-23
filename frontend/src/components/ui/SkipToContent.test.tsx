import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipToContent } from './SkipToContent';

describe('SkipToContent primitive', () => {
  it('renders skip link targeting main-content with sr-only class by default', () => {
    render(<SkipToContent />);
    const link = screen.getByRole('link', { name: /skip to main content/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#main-content');
    expect(link.className).toContain('sr-only');
    expect(link.className).toContain('focus:not-sr-only');
    expect(link.className).toContain('min-h-[44px]');
  });

  it('accepts custom targetId and custom label', () => {
    render(<SkipToContent targetId="custom-anchor" label="Jump to content" />);
    const link = screen.getByRole('link', { name: /jump to content/i });
    expect(link).toHaveAttribute('href', '#custom-anchor');
    expect(link).toHaveTextContent('Jump to content');
  });
});
