# Conversion Design

## What it is
Structuring a page/flow to move a qualified user toward a specific action, without resorting to
manipulative dark patterns — evaluated against tension #10 (conversion vs. artistic expression) in
`research/synthesis/12-design-tensions.md`.

## Core pattern from this research
**Pair desire-building content with concrete, specific trust content** — Cowboy's structure
(`research/awwwards/13-cowboy.md` §13): premium photography and a named proprietary feature, positioned
alongside specific, checkable reassurance (service center count, an at-home trial offer). Vague
reassurance ("great support!") converts worse than specific reassurance for any considered purchase.

## Implementation guidance
- Match CTA prominence to actual decision stage — a first-time visitor evaluating a considered purchase
  needs information before a hard sell; a returning, qualified visitor needs a fast, low-friction path.
- Segment content by buyer type when buyer types are genuinely different (Stripe's audience-segmented
  proof, `research/awwwards/01-stripe.md` §13) rather than showing one generic pitch to everyone.
- Reduce the *number* of decisions, not just the number of *fields* — a single clear next action beats
  three equally-weighted competing CTAs.
- Every claim of trust/quality should be as specific and checkable as possible (named metrics, named
  technology, named service commitments) rather than generic superlatives.

## Failure mode: dark patterns
Countdown timers with no real deadline, pre-checked opt-ins, confirm-shaming ("No thanks, I don't want
to save money") — never used in this system's guidance regardless of conversion lift, on both ethical
grounds and because they erode the exact trust that considered-purchase conversion depends on long-term.

## When to deprioritize conversion entirely
Reference/documentation, internal tools, and purely expressive/artistic pages have no conversion goal
and forcing CTA-style structure onto them (see tension #10) misrepresents what the page actually is.
