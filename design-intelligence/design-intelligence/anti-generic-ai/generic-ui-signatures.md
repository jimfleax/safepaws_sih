# Generic UI Signatures — The Master Checklist

The operational core of this subsystem. Before declaring any UI complete, run this checklist. Full
reasoning behind why AI defaults toward these patterns is in `principles/26-ai-ui-anti-patterns.md`.

## The ten signatures
1. **Three/four-column feature-card grid** as the default way to present any list of things, regardless
   of whether the items are actually comparable peers (`patterns/cards.md`).
2. **Giant heading + subheading + centered CTA + logo strip**, repeated as the section template
   throughout the page instead of varying structure (`research/synthesis/06-layout-patterns.md`).
3. **Meaningless decorative gradients** (see `bad-gradient-patterns.md`) with no connection to brand or
   content.
4. **Everything wrapped in a rounded card with a soft shadow** (see `card-overuse.md`), including
   content that isn't a discrete, comparable unit.
5. **Glassmorphism/blur for "sophistication"** with no functional layering reason (see
   `glassmorphism-overuse.md`).
6. **Identical section spacing everywhere** regardless of content weight or relationship (see
   `spacing-failures.md`).
7. **Icon-plus-three-words feature blurbs**, repeated many times, none differentiated (see
   `icon-overuse.md`).
8. **Badges/pills/"NEW" tags on nearly everything**, diluting their own signal value to zero.
9. **Motion applied because the framework makes it easy**, with no TRIGGER→MOTION→PURPOSE chain (see
   `motion-failures.md`).
10. **A visual identity swappable onto a competitor's product** with nobody noticing the mismatch.

## The one-sentence test (use this, not just the list)
For any decision: "Could I state, in one sentence, the specific reason this serves *this* product/
brand/audience?" If the honest answer is "it's what these kinds of pages look like," the decision fails
the test regardless of which specific signature it maps to. See `principles/00-master-principles.md`.

## How this feeds the rest of the system
- `.agents/rules/anti-generic-ui.md` — the always-on rule version of this checklist.
- `.agents/agents/visual-art-director.md` — the agent role specifically responsible for catching
  "technically correct but visually generic" output.
- `scoring/quality-gate.md` — "obviously generic composition" is a named BLOCKER-severity failure.
- `quality-repair-strategies.md` — what to actually do once a signature is detected.
