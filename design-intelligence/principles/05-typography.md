# Typography

## What it is
The system of typefaces, scale, weight, and spacing that carries most of an interface's actual
communication load and a large share of its perceived craft.

## Core rules
- **Scale ratio, not arbitrary sizes**: establish a type scale (see `tokens/typography.md`) rather than
  picking font-sizes per component. This is what makes hierarchy feel systematic rather than tuned by
  eye per instance.
- **Line length**: body text should sit roughly 45–75 characters per line for sustained readability —
  narrower for dense UI labels, this range for prose. A full-bleed paragraph on a wide desktop viewport
  with no max-width is a common, easily-fixed readability failure.
- **Line-height inversely tracks size**: large display type needs tighter line-height (often 1.0–1.15)
  than body text (1.4–1.6) — applying one line-height value system-wide produces either cramped body
  text or bloated headlines.
- **One reserved "voice" per page for the single most important sentence** — see Stripe's italic-
  headline device (`research/awwwards/01-stripe.md` §13), used nowhere else on the page.

## When to use oversized display type
When the brand/communication goal genuinely is impact-first (a hero claim, a single powerful statement)
and there's exactly one such moment per view. See `typography/display-typography.md`.

## When NOT to use oversized display type
Everywhere else — repeating a huge-headline treatment on every section is the single most common,
most visible generic-AI typography failure (see `anti-generic-ai/typography-failures.md`) and it
directly undermines hierarchy (§01) by making everything "loud."

## Failure mode: font pairing without a reason
Combining a display serif and a UI sans without a stated communicative reason (e.g., "serif = editorial
authority, sans = functional UI") produces an arbitrary-feeling result. By-Kin and Mat Voyce's strongest
evidence (`research/awwwards/10-by-kin.md`, `11-mat-voyce.md`) both tie typographic choice to a specific
job the type is doing, not aesthetic preference alone.

## Body text minimums
Never ship body text below ~16px for primary reading content on any device — this is a hard usability
and accessibility floor, not a stylistic judgment call, regardless of how a reference composition looks
at a glance.
