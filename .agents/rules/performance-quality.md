# Rule: Performance Quality

Applies to: any task adding images, video, animation, 3D/WebGL, or large data rendering.

**Always**:
- State a performance budget for any costly technique (large hero media, 3D/WebGL, heavy animation) and
  provide a fallback for when it can't be met (`design-intelligence/principles/13-performance.md`) —
  Stripe's documented static-fallback image for its animated hero
  (`design-intelligence/research/awwwards/01-stripe.md` §8) is this system's concrete model.
- Optimize images by default (correct format, responsive sizing, lazy-load below the fold).
- Reserve layout space for async content to prevent cumulative layout shift.
- Virtualize/paginate large lists and tables (`design-intelligence/patterns/tables.md`) rather than
  rendering everything at once.
- Design a real loading state (skeleton preferred over spinner for anything over ~1s) rather than a
  blank screen.

**Never**:
- Ship heavy 3D/WebGL/real-time rendering with no lower-power/mobile fallback path
  (`design-intelligence/patterns/3d.md`, `patterns/immersive.md`).
- Animate layout-triggering CSS properties (width, top, left) at scale when a compositor-friendly
  alternative (transform, opacity) exists.
- Assume ideal connection/device conditions as the default case rather than the best case.

Full role detail: `.agents/agents/frontend-quality.md`.
