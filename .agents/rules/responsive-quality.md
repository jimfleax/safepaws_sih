# Rule: Responsive Quality

Applies to: any task producing UI intended to render across device sizes (nearly all UI tasks).

**Always**:
- Treat mobile as a genuinely different use context (shorter sessions, one-handed, variable connection,
  no hover) — redesign information priority and navigation explicitly, don't just reflow
  (`design-intelligence/principles/11-responsive.md`, `24-mobile-web.md`).
- Verify actual rendered behavior (line length, touch target size, overflow) at real breakpoints — don't
  assume responsive syntax being present means the result is correct.
- Keep touch targets at minimum ~44×44px with adequate spacing.
- Test layouts against realistic content volume (long names, many items, empty states) at every
  breakpoint, not just demo content.

**Never**:
- Disable pinch-zoom (`user-scalable=no`) or any other zoom-restricting code, under any design
  rationale — a real, observed failure even in otherwise excellent, awarded work
  (`design-intelligence/research/awwwards/04-uncommon-studio.md` §11). This is a hard, non-negotiable
  prohibition, not a judgment call.
- Make necessary functionality hover-dependent with no touch equivalent.
- Assume a novel desktop interaction pattern (spatial navigation, keyboard-driven controls) "just
  works" on touch without an explicit, tested mobile answer.

Full role detail: `.agents/agents/ux-reviewer.md`, `.agents/agents/frontend-quality.md`.
