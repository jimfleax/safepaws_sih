# SAFEPAWS — UX-06.2: MOTION & INTERACTION REPORT
## GSAP Choreography, Scroll Physics, Lenis Teardown & Reduced-Motion Defenses

**Document ID:** `SP-UX-06.2-MOTION-001`  
**Phase:** UX-06.2 Cinematic Landing, Brand Storytelling & Public Finder Transformation  
**Workstream:** Panel B (Creative Technology & Motion Lead: B3) with Panel A (Motion Systems: A3)  
**Authority:** Chief Product & Technical Orchestrator  
**Baseline Reference:** `bcdb3cc1f2b3ab79942b211c9c0892ceeb1ae5e1`  
**Branch:** `frontend`  
**Scope:** FRONTEND ONLY

---

## 1. MOTION ARCHITECTURE PRINCIPLES

SafePaws' motion system is designed around the concept of **Tactile Editorial Precision**:
- Motion must communicate certainty, security, and warmth during high-stress rescue events.
- Never use gratuitous spinning, bouncy cartoon elasticities, or unmotivated transitions.
- Every animation must respect device constraints (touch screens vs. precision cursors) and accessibility preferences (`prefers-reduced-motion`).

```
                    ┌─────────────────────────┐
                    │ User / System Request   │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
     (prefers-reduced-motion)          (standard motion)
                 │                               │
                 ▼                               ▼
       Immediate Opacity: 1           GSAP Context Animation
       Transforms: none (0px)         Timeline Entrance
       Lenis Scroll: DISABLED         Lenis Scroll: ENABLED (>=768px)
       Parallax: DISABLED             ScrollTrigger Parallax
       Cursor: System Default         Custom Cursor Track
```

---

## 2. CHOREOGRAPHED HERO ENTRANCE TIMELINE

In `Hero.tsx`, the entrance timeline coordinates the visual frame, tactile metadata badge, editorial headline, body copy, and primary action cluster into a unified cinematic sequence.

### 2.1 Easing & Timing Specifications

| Sequence Item | Target Element | Property | Start Delay | Duration | Easing Curve |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1** | `imageCardRef` | `opacity: 0 -> 1`<br>`clipPath: inset(8% round 24px) -> inset(0% round 24px)` | `0.00s` | `1.40s` | `power4.inOut` |
| **Stage 2** | `hudOverlayRef` | `opacity: 0 -> 1` | `0.80s` | `0.80s` | `power2.out` |
| **Stage 3** | `floatingBadgeRef` | `opacity: 0 -> 1`<br>`y: 20px -> 0px`<br>`scale: 0.90 -> 1.00` | `1.00s` | `0.70s` | `back.out(1.4)` |
| **Stage 4** | `eyebrowRef` | `opacity: 0 -> 1`<br>`y: 28px -> 0px` | `0.30s` | `0.70s` | `power3.out` |
| **Stage 5** | `headlineRef` | `opacity: 0 -> 1`<br>`y: 28px -> 0px` | `0.60s` | `0.80s` | `power3.out` |
| **Stage 6** | `bodyRef` | `opacity: 0 -> 1`<br>`y: 28px -> 0px` | `0.80s` | `0.70s` | `power3.out` |
| **Stage 7** | `ctaGroupRef` | `opacity: 0 -> 1`<br>`y: 28px -> 0px` | `0.90s` | `0.70s` | `power3.out` |
| **Stage 8** | `trustPillsRef` | `opacity: 0 -> 1`<br>`y: 28px -> 0px` | `1.00s` | `0.60s` | `power3.out` |

### 2.2 Clean GSAP Context Reversion
All GSAP tweens and timelines within React components are strictly bounded by `gsap.context()`:
```typescript
useEffect(() => {
  if (prefersReducedMotion) return;

  const ctx = gsap.context(() => {
    // Registered timelines and ScrollTriggers
  }, containerRef);

  return () => ctx.revert(); // 100% complete cleanup, removes all inline styles and listeners
}, []);
```

---

## 3. LENIS SMOOTH SCROLL INTEGRATION & TEARDOWN

Smooth inertial scrolling enhances editorial pacing on high-resolution desktop viewports, but introduces significant battery drain, touch stutter, and input delay on mobile viewports.

### 3.1 Strict Viewport Gate & Mobile Bypass
Lenis is dynamically imported and initialized **exclusively** when both of the following conditions hold:
1. `window.matchMedia('(prefers-reduced-motion: reduce)').matches === false`
2. `window.innerWidth >= 768` (Desktop and large tablet landscape only).

On mobile viewports ($< 768\text{px}$), native touch scrolling operates with zero JavaScript interception, providing native momentum and 60–120 FPS hardware compositing.

### 3.2 Ticker Synchronization & Lag Smoothing Recovery
When Lenis operates, it synchronizes with GSAP's internal ticker to avoid frame collision:
```typescript
tickerCallback = (time: number) => {
  if (lenis) {
    lenis.raf(time * 1000);
  }
};
gsap.ticker.add(tickerCallback);
gsap.ticker.lagSmoothing(0); // Prevents jumps during Lenis initialization
```

### 3.3 Teardown Invariant
Upon component unmount or route transition (e.g. navigating from `/` to `/scan`), the cleanup function:
1. Sets `isDisposed = true` to guard against pending asynchronous module imports.
2. Invokes `lenis.destroy()` to detach scroll event listeners and cancel animation frames.
3. Removes `tickerCallback` from `gsap.ticker`.
4. Resets `gsap.ticker.lagSmoothing(500, 33)` to restore default GSAP frame handling for subsequent routes.

---

## 4. CUSTOM CURSOR & TOUCH-SCREEN DEFENSES

The custom cursor in `CustomCursor.tsx` provides magnetic tactile feedback on desktop:
1. **Pointer Device Gate:** Checked via `window.matchMedia('(pointer: fine)').matches`. If false (e.g., touch screen phones or tablets), the component immediately renders `null` and registers zero event listeners.
2. **Reduced Motion Gate:** If user prefers reduced motion, the component immediately returns `null`.
3. **Cursor Physics:** Uses smoothed linear interpolation (`lerp = 0.20`) between mouse events and the cursor trailing ring, with a hardware-accelerated `transform: translate3d(x, y, 0)`.
4. **Interactive Target Expansion:** When hovering over interactive elements (`button`, `a`, `[role="button"]`), the trailing ring expands smoothly from $32\text{px}$ to $48\text{px}$ with a subtle marigold tint.

---

## 5. ACCESSIBILITY COMPLIANCE & REDUCED-MOTION VERIFICATION

In accordance with WCAG 2.2 Success Criterion 2.3.3 (Animation from Interactions - Level AAA):
- Automated unit test suite `motion-system.test.tsx` validates that under `(prefers-reduced-motion: reduce)`:
  - GSAP timelines do not set initial hidden states (`opacity: 0`, `y: 28`).
  - All content remains immediately legible and interactable in the DOM.
  - Zero scroll hijacking or parallax displacement occurs.
