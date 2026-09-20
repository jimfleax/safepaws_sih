# Rule: Interaction & Motion Quality

Applies to: any task involving hover states, transitions, animation, scroll behavior, or cursor
behavior.

**Always**:
- Complete the chain for every significant motion pattern before implementing it: TRIGGER → MOTION →
  PURPOSE → USER VALUE (`design-intelligence/motion/principles.md`). If PURPOSE is honestly "looks
  nice," cut it or find a real purpose.
- Use token-defined duration/easing (`design-intelligence/tokens/motion.md`), not ad hoc per-component
  values — untuned defaults are a checkable, common "unfinished" signal.
- Animate compositor-friendly properties (transform, opacity) over layout-triggering ones
  (`design-intelligence/principles/13-performance.md`).
- Implement a genuine `prefers-reduced-motion` alternative — not merely a technically-present media
  query (`design-intelligence/motion/reduced-motion.md`).

**Never**:
- Add motion because a library/framework makes it trivial, with no stated purpose
  (`design-intelligence/anti-generic-ai/motion-failures.md`).
- Let decorative motion delay a user's ability to act on the result.
- Use scroll-jacking that overrides the user's own scroll input rather than augmenting it.
- Apply desktop-tuned motion volume unchanged to a high-frequency, repeated-use interface
  (`design-intelligence/principles/18-dashboard-design.md`) — motion cost compounds with frequency.

Full role detail: `.agents/agents/motion-director.md`.
