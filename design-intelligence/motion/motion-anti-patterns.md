# Motion Anti-Patterns

Consolidated, operational version of the motion-specific findings in `research/synthesis/04-motion-
patterns.md` and `10-anti-patterns.md`.

1. **Motion with no PURPOSE that survives being said out loud.** If completing the TRIGGER → MOTION →
   PURPOSE → USER VALUE chain (`principles.md`) produces "it looks cool" as the honest purpose, cut it
   or find a real one.
2. **Motion compensating for a weak underlying design.** Named directly by a practitioner in this
   system's own research about his own risk of doing it (`research/awwwards/19-minh-pham.md` §8). Test:
   would the design hold up with the animation removed?
3. **Untuned default easing/timing.** Shipping a framework's default spring/ease values everywhere
   without adjusting per context (`timing.md`, `easing.md`) is a common, visible "unfinished" signal.
4. **Scroll-jacking that overrides user scroll input** rather than augmenting it — actively frustrating
   regardless of how polished the choreography looks.
5. **No reduced-motion fallback**, or a fallback that's only technically triggered but not actually
   tested/considered (`reduced-motion.md`).
6. **Coupling multiple animation systems without the architectural discipline to support it** — Zajno's
   own case study (`research/awwwards/09-zajno.md`) shows this pattern working specifically because of
   deliberate per-section lazy-render discipline; without that discipline, the same coupling is a common,
   real cause of jank.
7. **Animating layout-triggering CSS properties** (width, top, left, margin) instead of compositor-
   friendly ones (transform, opacity) at scale — a specific, checkable performance anti-pattern.
8. **Inconsistent motion "voice" across a product** (see `choreography.md`) — each animation
   individually fine, the aggregate feeling assembled rather than designed.
9. **Autoplaying motion/video with sound, or with no visible user control** — contrast with the correct
   pattern in `research/awwwards/04-uncommon-studio.md` §7.
10. **Applying immersive/rich motion choreography to task-focused, high-frequency-use interfaces**
    (`principles/18-dashboard-design.md`) where users pay the motion's time cost repeatedly.

## The meta-rule
None of these are "never animate X" — every technique named above appears, used well, somewhere in this
system's actual research. The anti-pattern is always the unmatched, unpurposed, or untuned version.
