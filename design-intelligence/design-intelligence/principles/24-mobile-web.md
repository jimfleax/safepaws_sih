# Mobile Web Design

## What it is
Web experiences designed specifically for phone-class viewports and touch/on-the-go usage contexts —
distinct from merely reflowing a desktop design (`11-responsive.md` covers the broader responsive
discipline; this file is mobile-specific).

## Honest evidence state
This is a thin-evidence area in this research set (see `research/synthesis/08-responsive-patterns.md`)
— no live mobile-viewport testing was possible for any of the 25 references. Guidance here leans on
general, well-established mobile-UX principle plus the few real signals that did surface.

## Real signals from this research
- Even mature products treat mobile nav pattern as unsolved and worth active testing (Stripe's live
  experiment flag, `research/awwwards/01-stripe.md` §9) — don't treat a single "obvious" mobile nav
  pattern as beyond scrutiny.
- Never disable pinch-zoom — a real, observed failure even in well-regarded work
  (`research/awwwards/04-uncommon-studio.md` §11).
- Formats built around precision, non-touch input (Bruno Simon's keyboard-driving mechanic) have a real,
  frequently unresolved mobile adaptation question — don't assume a novel desktop interaction
  automatically has a good touch equivalent; design it explicitly or provide a genuinely different
  mobile experience.

## Implementation guidance
- Design for one-handed, thumb-reachable interaction — primary actions within easy thumb range, not
  requiring a stretch to a far corner.
- Assume variable, sometimes poor connection quality — this raises the real stakes of the performance
  discipline in `13-performance.md` specifically for mobile.
- Touch targets minimum ~44×44px with adequate spacing — small, closely-packed targets are a common,
  measurable mobile usability failure.
- Reconsider information priority, not just layout — what's most important on a 6-inch screen in a
  short session may differ from what's most important on desktop in a longer session.

## Failure mode
A "responsive" site that is technically usable on mobile but was never actually designed for it — content
priority, navigation, and interaction all inherited unchanged from desktop. See
`anti-generic-ai/mobile-failures.md`.
