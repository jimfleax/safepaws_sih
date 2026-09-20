# SaaS Product Design

## What it is
Marketing sites and in-product interfaces for software sold as a subscription service — the category
with the most direct evidence in this research set (Stripe, Framer, Linear, all Category A).

## Core patterns from this research
- **Credibility staircase**: bold claim → recognizable social proof → capability demonstration →
  quantified proof → CTA (Stripe, `research/awwwards/01-stripe.md` §2) — appropriate when the product/
  ask is unfamiliar or high-trust.
- **Prove features by embedding a working demo, not describing them** (Framer,
  `research/awwwards/02-framer.md` §13) — a real or realistic interactive artifact beats a screenshot or
  bullet list whenever the product's craft is itself visible in its UI.
- **A small, opinionated core object model beats a large configurable one** for a focused audience
  (Linear, `research/awwwards/03-linear.md` §13) — resist feature/field sprawl just to match competitors.
- **Segment marketing content by buyer persona** when personas genuinely differ (Stripe) — don't force
  one generic pitch onto both a solo founder and an enterprise buyer.

## Implementation guidance
- Always offer a non-flagship path when marketing a new primary capability (Framer's explicit "start
  without AI" option) — don't force every visitor through the newest, most-hyped flow.
- In-product UI should default toward `18-dashboard-design.md` principles once past the marketing site
  boundary — density/efficiency over marketing-style visual spectacle.
- Self-referential proof (showing your own real usage/performance numbers, as Framer does) is a strong,
  specific trust device — but only when the numbers are genuinely real and checkable.

## Failure mode
The generic SaaS template this system exists to counteract: hero + subhead + three feature cards +
logo strip + generic CTA, with no persona segmentation, no embedded proof, and a bloated, unopinionated
feature set trying to match every competitor. See `anti-generic-ai/generic-ui-signatures.md`.

## When simplicity beats the credibility staircase
Well-known, already-trusted products (returning users, high brand recognition) don't need the same
extensive proof-building structure a first-time, skeptical visitor does — match structure to actual
visitor familiarity, not a fixed template.
