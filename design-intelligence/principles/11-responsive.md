# Responsive Design

## What it is
Designing genuinely different experiences per context (device, viewport, input method, connection
quality) — not just reflowing one desktop layout into a narrower column. Note: this is the
weakest-evidenced dimension in this system's own research (see `research/synthesis/08-responsive-
patterns.md`); this file leans more on general, well-established principle than on the 25-site set.

## Core rule
Mobile is not "desktop, but smaller" — it is frequently a different primary use context (shorter
sessions, one-handed use, variable connection quality, no hover) that warrants different information
priority, not just different column widths.

## Implementation guidance
- Redesign navigation for touch/mobile explicitly rather than defaulting to a hamburger menu that hides
  everything — even Stripe, at its scale, still actively A/B-tests its mobile nav pattern
  (`research/awwwards/01-stripe.md` §9) rather than treating it as solved; treat mobile IA as a real
  design problem, not an afterthought.
- Never disable pinch-zoom (`user-scalable=no`) — a real, observed accessibility failure even in
  otherwise well-regarded work (`research/awwwards/04-uncommon-studio.md` §11); there is no legitimate
  design reason to disable it.
- Interaction patterns that depend on precision input (small click targets, hover-revealed content,
  keyboard-driven navigation) need a genuinely redesigned touch equivalent, not a smaller version of the
  same target.
- Test and design for real content volume at each breakpoint, not just the hero — a composition that
  works with three demo items often breaks with fifty real ones.

## Failure mode
A layout that "works" only because it was tested with placeholder content, or a mobile experience that
is simply a compressed desktop layout with nothing removed, reordered, or redesigned. See
`anti-generic-ai/mobile-failures.md`.

## When NOT to fully redesign per-device
Content-parity-critical contexts (legal documents, data tables that must show the same columns
everywhere) may need consistent structure across devices even at some density cost — but this should be
a deliberate choice, stated as such, not a default.
