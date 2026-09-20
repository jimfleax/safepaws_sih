# Rule: Final Quality Gate

Applies to: the moment any agent is about to declare a UI task "done." This is the single most
important rule in this system. Its entire purpose is to prevent the failure the source brief calls out
explicitly: **an agent must never declare success solely because code compiles or renders without
error.** Compiling means the code is syntactically valid. It says nothing about whether the result is
good.

## The gate: answer every question below honestly before declaring completion

**A. Does the page actually solve the user's problem?** Not "does it look like a page that would" —
trace the primary task from entry to completion and confirm it works.

**B. Is hierarchy obvious?** One loudest element per view, not several competing
(`design-intelligence/principles/01-hierarchy.md`).

**C. Does typography feel intentional?** Real scale, real line-length, one reserved display voice per
view — not framework defaults left untouched (`design-intelligence/typography/`).

**D. Is spacing consistent?** Derived from content relationships via a defined scale, not mechanically
uniform or arbitrarily per-instance (`design-intelligence/principles/03-spacing.md`).

**E. Is composition appropriate to this specific product?** Not copied wholesale from a reference
(`design-intelligence/retrieval/chain.md`).

**F. Are interactions clear?** Every interactive element has a visible affordance and a visible
response. No dead interactions.

**G. Is motion meaningful?** Every significant motion pattern completes TRIGGER → MOTION → PURPOSE →
USER VALUE (`design-intelligence/motion/principles.md`). If a pattern can't, it's been cut or replaced
before this gate is reached.

**H. Is mobile actually designed?** Not merely reflowed — information priority and navigation
reconsidered for the mobile context (`design-intelligence/principles/24-mobile-web.md`).

**I. Is accessibility acceptable?** Full `design-intelligence/principles/12-accessibility.md` baseline
met: semantics, contrast, keyboard operability, reduced-motion, zoom never disabled.

**J. Is performance acceptable?** Images optimized, heavy techniques have a stated fallback, no
avoidable layout shift.

**K. Does the page feel generic?** Run `design-intelligence/anti-generic-ai/generic-ui-signatures.md`'s
full ten-signature checklist and the one-sentence test on every distinguishing decision.

**L. Does the visual identity match the product?** `design-intelligence/principles/08-brand.md`'s
one-sentence test — can you state what real, specific thing about this product each notable visual
choice expresses?

**M. Are states complete?** Loading, empty, error, and success states designed for every relevant
surface — not just the happy path.

**N. Has the rendered result actually been inspected?** Where the environment has real browser/preview
tooling, it must have actually been used (`design-intelligence/retrieval/` and
`.agents/workflows/visual-review.md` define the procedure) — desktop and mobile, not source code alone.
If no such tooling is available in the current environment, that limitation must be stated explicitly,
not silently assumed away.

**O. Has the page been refined after critique?** At least one real iteration following a critical
review (`.agents/agents/ux-reviewer.md`, `visual-art-director.md`) — not just the first pass declared
finished because it was the first pass that ran without errors.

## Severity and blocking

A page cannot be called finished if any of these are present (full list and definitions in
`design-intelligence/scoring/quality-gate.md`): horizontal overflow, broken mobile layout, unreadable
text, inaccessible interaction, broken navigation, missing required loading state, severe contrast
failure, obviously generic composition, inconsistent design tokens, dead interactions, major visual
misalignment, avoidable layout shift, or motion causing genuine usability harm. Any one of these is a
**BLOCKER** and overrides an otherwise-passing numeric score from `design-intelligence/scoring/
scoring-rubric.md`.

## What "done" actually requires

All fifteen questions (A-O) answered honestly, no BLOCKER present, and the numeric score from
`design-intelligence/scoring/scoring-rubric.md` (using the context-appropriate weighting for this
surface type) at or above the tier stated as the target in the original design brief
(`design-intelligence/templates/design-brief.md`). Anything short of that is reported as such, with the
specific gap named — never rounded up to "done" for convenience.
