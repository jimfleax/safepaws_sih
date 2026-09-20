# Workflow: /performance-review

Focused review using `agents/frontend-quality.md`'s performance dimension.

## Steps
1. Check image optimization: correct format, responsive sizing, lazy-loading below the fold.
2. Check for any heavy technique (3D/WebGL, large scroll-linked timelines, autoplay video) and confirm
   a stated fallback exists for constrained devices/connections (`design-intelligence/
   principles/13-performance.md`).
3. Check animated properties for compositor-friendliness (transform/opacity vs. layout-triggering).
4. Check for cumulative layout shift — is space reserved for async content (images, embeds, ads) before
   it loads?
5. Check large lists/tables for virtualization/pagination rather than full unbounded rendering.
6. Check loading-state design: is there a considered skeleton/progress treatment for anything taking
   over ~1s, rather than a blank screen?
7. Where real measurement tooling is available in the current environment, use it; otherwise state
   plainly that performance was reviewed structurally (code/asset inspection) rather than measured, per
   this system's evidence-honesty discipline.

## Output
Severity-tagged findings feeding `/design-review`'s aggregate report or usable standalone.
