import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CardContainer, CardBody, CardItem } from './3d-card';
import { NumberTicker } from './number-ticker';
import { CustomCursor } from '../CustomCursor';
import { MemoryRouter } from 'react-router-dom';
import gsap from 'gsap';

vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn(() => vi.fn()),
}));

describe('SafePaws Motion Architecture & Vestibular Safety Audit', () => {
  let mediaQueryLists: Record<string, { matches: boolean; listeners: ((e: any) => void)[] }> = {};

  beforeEach(() => {
    mediaQueryLists = {};

    // Mock IntersectionObserver for Motion useInView
    class MockIntersectionObserver {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    window.IntersectionObserver = MockIntersectionObserver as any;

    window.matchMedia = vi.fn().mockImplementation((query: string) => {
      if (!mediaQueryLists[query]) {
        mediaQueryLists[query] = {
          matches: false,
          listeners: [],
        };
      }
      return {
        get matches() {
          return mediaQueryLists[query].matches;
        },
        media: query,
        onchange: null,
        addListener: vi.fn((listener) => {
          mediaQueryLists[query].listeners.push(listener);
        }),
        removeListener: vi.fn((listener) => {
          mediaQueryLists[query].listeners = mediaQueryLists[query].listeners.filter(l => l !== listener);
        }),
        addEventListener: vi.fn((event, listener) => {
          if (event === 'change') mediaQueryLists[query].listeners.push(listener);
        }),
        removeEventListener: vi.fn((event, listener) => {
          if (event === 'change') {
            mediaQueryLists[query].listeners = mediaQueryLists[query].listeners.filter(l => l !== listener);
          }
        }),
        dispatchEvent: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.className = '';
  });

  describe('1. 3D-Card Tilt & Reduced-Motion Bypass', () => {
    it('applies 3D perspective rotation on mouse move under standard motion preference', () => {
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };

      const { container } = render(
        <CardContainer className="test-card">
          <CardBody>
            <CardItem>Content</CardItem>
          </CardBody>
        </CardContainer>
      );

      const card = container.querySelector('.test-card') as HTMLDivElement;
      expect(card).toBeTruthy();

      // Mock getBoundingClientRect
      vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        bottom: 200,
        right: 200,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      fireEvent.mouseEnter(card);
      fireEvent.mouseMove(card, { clientX: 150, clientY: 150 });

      // In standard motion, transform is calculated based on mouse coordinates
      expect(card.style.transform).toContain('rotateY(');
      expect(card.style.transform).toContain('rotateX(');
      expect(card.style.transform).not.toBe('rotateY(0deg) rotateX(0deg)');
    });

    it('strictly clamps transform to rotateY(0deg) rotateX(0deg) and bypasses tilt when prefers-reduced-motion: reduce matches', () => {
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: true, listeners: [] };

      const { container } = render(
        <CardContainer className="test-card">
          <CardBody>
            <CardItem>Content</CardItem>
          </CardBody>
        </CardContainer>
      );

      const card = container.querySelector('.test-card') as HTMLDivElement;
      expect(card).toBeTruthy();

      vi.spyOn(card, 'getBoundingClientRect').mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        bottom: 200,
        right: 200,
        x: 0,
        y: 0,
        toJSON: () => {},
      });

      fireEvent.mouseEnter(card);
      fireEvent.mouseMove(card, { clientX: 150, clientY: 150 });

      // Transform must NOT be modified by mouse move when reduced motion is requested
      expect(card.style.transform).toBe('');
    });

    it('resets transform on mouse leave', () => {
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };

      const { container } = render(
        <CardContainer className="test-card">
          <CardBody>
            <CardItem>Content</CardItem>
          </CardBody>
        </CardContainer>
      );

      const card = container.querySelector('.test-card') as HTMLDivElement;
      fireEvent.mouseLeave(card);

      expect(card.style.transform).toBe('rotateY(0deg) rotateX(0deg)');
    });
  });

  describe('2. NumberTicker Vestibular Safety & A11y Contract', () => {
    it('immediately renders target value and bypasses spring interpolation when prefers-reduced-motion: reduce matches', () => {
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: true, listeners: [] };

      const { container } = render(<NumberTicker value={1250} prefix="$" suffix="+" />);

      const visibleValue = container.querySelector('[aria-hidden="true"]');
      const srValue = container.querySelector('.sr-only');

      expect(visibleValue).toBeTruthy();
      expect(srValue).toBeTruthy();
      expect(visibleValue?.textContent).toBe('$1,250+');
      expect(srValue?.textContent).toBe('$1,250+');
    });

    it('provides accessible sr-only text while hiding kinetic ticking element from assistive technologies', () => {
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };

      const { container } = render(<NumberTicker value={85} suffix="%" />);

      const srValue = container.querySelector('.sr-only');
      const visualCounter = container.querySelector('[aria-hidden="true"]');

      expect(srValue?.textContent).toBe('85%');
      expect(visualCounter?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('3. CustomCursor Lifecycle, Teardown & Route Guards', () => {
    it('unmounts and adds no-custom-cursor class to document.body when prefers-reduced-motion: reduce matches', () => {
      mediaQueryLists['(pointer: fine)'] = { matches: true, listeners: [] };
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: true, listeners: [] };

      const { container } = render(
        <MemoryRouter initialEntries={['/']}>
          <CustomCursor />
        </MemoryRouter>
      );

      expect(container.firstChild).toBeNull();
      expect(document.body.classList.contains('no-custom-cursor')).toBe(true);
    });

    it('unmounts and restores system cursor when pointer is coarse (touch devices)', () => {
      mediaQueryLists['(pointer: fine)'] = { matches: false, listeners: [] };
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };

      const { container } = render(
        <MemoryRouter initialEntries={['/']}>
          <CustomCursor />
        </MemoryRouter>
      );

      expect(container.firstChild).toBeNull();
      expect(document.body.classList.contains('no-custom-cursor')).toBe(true);
    });

    it('unmounts and adds no-custom-cursor class on Biometric Scanner route (/scan)', () => {
      mediaQueryLists['(pointer: fine)'] = { matches: true, listeners: [] };
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };

      const { container } = render(
        <MemoryRouter initialEntries={['/scan']}>
          <CustomCursor />
        </MemoryRouter>
      );

      expect(container.firstChild).toBeNull();
      expect(document.body.classList.contains('no-custom-cursor')).toBe(true);
    });

    it('renders custom cursor dot and follower ring on desktop narrative route under standard motion preference', () => {
      mediaQueryLists['(pointer: fine)'] = { matches: true, listeners: [] };
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };

      const { container } = render(
        <MemoryRouter initialEntries={['/']}>
          <CustomCursor />
        </MemoryRouter>
      );

      expect(container.firstChild).not.toBeNull();
      expect(document.body.classList.contains('no-custom-cursor')).toBe(false);
    });

    it('cleans up event listeners, GSAP tweens, and removes body class upon unmount', () => {
      mediaQueryLists['(pointer: fine)'] = { matches: true, listeners: [] };
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };

      const killTweensSpy = vi.spyOn(gsap, 'killTweensOf');
      const removeEventSpy = vi.spyOn(window, 'removeEventListener');

      const { unmount } = render(
        <MemoryRouter initialEntries={['/']}>
          <CustomCursor />
        </MemoryRouter>
      );

      unmount();

      expect(removeEventSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(removeEventSpy).toHaveBeenCalledWith('mouseover', expect.any(Function));
      expect(removeEventSpy).toHaveBeenCalledWith('mouseout', expect.any(Function));
      expect(killTweensSpy).toHaveBeenCalled();
      expect(document.body.classList.contains('no-custom-cursor')).toBe(false);
    });
  });

  describe('4. Lenis Smooth Scroll Lifecycle & Viewport Guards', () => {
    it('bypasses Lenis initialization on mobile viewports (< 768px)', async () => {
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: false, listeners: [] };
      window.innerWidth = 500; // Mobile viewport

      const lenisMock = vi.fn();
      vi.doMock('lenis', () => ({
        default: lenisMock,
      }));

      // Render LandingPage in mobile viewport
      const LandingPageModule = await import('../../pages/LandingPage');
      const LandingPage = LandingPageModule.default;

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      // Verify lenis was not constructed
      expect(lenisMock).not.toHaveBeenCalled();
    });

    it('bypasses Lenis initialization when prefers-reduced-motion: reduce is true', async () => {
      mediaQueryLists['(prefers-reduced-motion: reduce)'] = { matches: true, listeners: [] };
      window.innerWidth = 1200; // Desktop viewport

      const lenisMock = vi.fn();
      vi.doMock('lenis', () => ({
        default: lenisMock,
      }));

      const LandingPageModule = await import('../../pages/LandingPage');
      const LandingPage = LandingPageModule.default;

      render(
        <MemoryRouter initialEntries={['/']}>
          <LandingPage />
        </MemoryRouter>
      );

      expect(lenisMock).not.toHaveBeenCalled();
    });
  });

  describe('5. Micro-Interaction Physics & Tactile Feedback Specification', () => {
    it('applies active:scale-[0.98] tactile depression and motion-reduce bypass on Button primitives', async () => {
      const { Button } = await import('./Button');
      render(<Button>Confirm Broadcast</Button>);
      const btn = screen.getByRole('button', { name: /confirm broadcast/i });
      expect(btn.className).toContain('active:scale-[0.98]');
      expect(btn.className).toContain('motion-reduce:active:scale-100');
    });

    it('enforces specular light sweep shimmer with motion-reduction hidden guard on ShimmerButton', async () => {
      const { ShimmerButton } = await import('./shimmer-button');
      const { container } = render(<ShimmerButton>Active Scanner</ShimmerButton>);
      const shimmerLayer = container.querySelector('.animate-shimmer-slide');
      expect(shimmerLayer).toBeTruthy();
      expect(shimmerLayer?.className).toContain('motion-reduce:hidden');
    });

    it('provides subtle card hover elevation and structured border tokens on Card primitives', async () => {
      const { Card } = await import('./Card');
      const { container } = render(<Card variant="interactive">Pet Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('hover:shadow-[var(--shadow-card-hover)]');
      expect(card.className).toContain('hover:border-[var(--color-ink-soft)]');
    });
  });
});
