import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { AtmosphericBackground } from './AtmosphericBackground';

describe('AtmosphericBackground component', () => {
  beforeEach(() => {
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

  it('renders paper grain filter SVG with aria-hidden="true"', () => {
    const { container } = render(<AtmosphericBackground showGrain showMotes={false} />);
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('filter#canvas-paper-grain')).toBeInTheDocument();
  });

  it('renders canvas element when showMotes=true', () => {
    const { container } = render(<AtmosphericBackground showMotes />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });
});
