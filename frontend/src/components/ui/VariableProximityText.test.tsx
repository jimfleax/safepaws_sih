import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VariableProximityText } from './VariableProximityText';

describe('VariableProximityText component', () => {
  beforeEach(() => {
    // Default matchMedia mock
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it('renders text with clean semantic aria-label and heading role', () => {
    render(<VariableProximityText text="Recovery Ledger" as="h1" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('aria-label', 'Recovery Ledger');
  });

  it('splits words into spans by default', () => {
    const { container } = render(<VariableProximityText text="Field Dispatch" as="h2" />);
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(2);
    expect(spans[0].textContent).toContain('Field');
    expect(spans[1].textContent).toContain('Dispatch');
  });

  it('splits characters when granularity="char"', () => {
    const { container } = render(
      <VariableProximityText text="ALERT" as="h3" granularity="char" />
    );
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(5);
    expect(spans[0].textContent).toBe('A');
    expect(spans[4].textContent).toBe('T');
  });

  it('respects prefers-reduced-motion by rendering static fallback weight', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <VariableProximityText text="Static Heading" fallbackWeight={700} />
    );
    const spans = container.querySelectorAll('span');
    expect(spans[0].style.fontVariationSettings).toContain("'wght' 700");
  });

  it('deactivates continuous pointer tracking on coarse touchscreens', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('pointer: coarse'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(
      <VariableProximityText text="Mobile Header" fallbackWeight={700} />
    );
    const spans = container.querySelectorAll('span');
    expect(spans[0].style.fontVariationSettings).toContain("'wght' 700");
  });
});
