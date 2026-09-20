# Common AI-Generated Layouts

The specific, recognizable page-level structures that recur across AI-generated marketing sites
regardless of the underlying product — distinct from individual component-level signatures
(`generic-ui-signatures.md`), this file is about the *sequence* of sections.

## The default sequence to recognize and challenge
Hero (headline + subhead + two CTAs) → logo strip → three-column "features" → alternating image/text
"how it works" (2-3 repeats) → testimonial carousel → pricing cards → FAQ accordion → final CTA →
footer. This sequence isn't wrong because any individual section is bad — it's generic specifically
because it's applied without asking whether *this* product's actual audience/goal needs this exact
sequence, in this exact order, with nothing removed or reordered.

## What excellent references in this research actually do instead
- Stripe reorders around buyer-segment proof, not a fixed feature/testimonial/pricing sequence
  (`research/awwwards/01-stripe.md` §2).
- Framer replaces the "features" section with embedded working demos (`research/awwwards/02-
  framer.md` §6).
- Mat Voyce restructures entirely around content-type differences, not a marketing funnel at all
  (`research/awwwards/11-mat-voyce.md` §2).

## The repair question
For each section in the default sequence, ask: does *this specific product* actually need this section,
in this position? A a well-known, already-trusted product doesn't need the same proof-building
sequence a first-time, skeptical visitor requires (`principles/23-saas-product.md`). Cut or reorder
accordingly — don't include a section because "landing pages have one."

## Failure mode
Defending the default sequence with "it's a proven pattern" — proven for *average* conversion across
many unrelated products is not the same as correct for this specific one; see tension framework in
`research/synthesis/12-design-tensions.md`.
