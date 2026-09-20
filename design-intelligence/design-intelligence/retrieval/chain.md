# The Reference → Principle → Implementation Chain

The single most important process discipline in this system. Every agent role and workflow references
this file because it is the mechanism that prevents copying.

## The required chain

**REFERENCE** → **OBSERVATION** → **PRINCIPLE** → **CONTEXT** → **PATTERN** → **IMPLEMENTATION** →
**REVIEW**

Never skip directly from REFERENCE to IMPLEMENTATION — that is copying, and it produces work that fits
the reference's original product/audience/brand, not this one.

## What each step means

- **REFERENCE**: a specific site in `research/awwwards/` (or a pattern from `patterns/`) that
  demonstrates something relevant.
- **OBSERVATION**: what the reference dossier actually documents (§1-§12 of the relevant dossier) —
  stay precise about what's OBSERVED vs. INFERRED vs. UNKNOWN per that dossier's own labeling.
- **PRINCIPLE**: the reusable rule the observation demonstrates (§13 of the dossier, or the matching
  `principles/*.md` file) — stated with its "when to use" and "when NOT to use."
- **CONTEXT**: does the principle's "when to use" condition actually hold for the current product?
  Check the relevant tension in `research/synthesis/12-design-tensions.md` if one applies.
- **PATTERN**: the named, reusable structural pattern from `patterns/*.md` that implements the
  principle generically.
- **IMPLEMENTATION**: the actual, original build for this specific product — new copy, new visual
  treatment, new composition, informed by but not copied from the reference.
- **REVIEW**: run the implementation back through `.agents/agents/` review roles and
  `anti-generic-ai/generic-ui-signatures.md`'s one-sentence test.

## Worked example
REFERENCE: Stripe (`research/awwwards/01-stripe.md`). OBSERVATION: segments proof by buyer persona
(§2). PRINCIPLE: "segment proof by buyer type when personas genuinely differ" (§13,
`principles/15-conversion.md`). CONTEXT: does this product have 2+ genuinely distinct buyer personas?
If yes, proceed; if no (single clear audience), this principle doesn't apply here — don't force it.
PATTERN: segmented-proof-sections (`patterns/hero.md`, `patterns/cards.md`). IMPLEMENTATION: write this
specific product's actual persona segments with its own real proof points — never Stripe's copy or
layout. REVIEW: confirm the result doesn't read as "a Stripe clone," and that the segmentation is
genuinely useful for this product's actual audience.

## Enforcement
`.agents/rules/design-director.md` and `.agents/agents/design-director.md` both state this chain as a
"never" rule. `retrieval/reference-index.json` is structured around tags/principles specifically so
retrieval naturally surfaces the PRINCIPLE, not just "here's a similar-looking site."
