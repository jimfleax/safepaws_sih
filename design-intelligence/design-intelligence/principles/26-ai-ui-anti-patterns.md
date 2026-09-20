# AI UI Anti-Patterns

The capstone principles file. Everything above this file describes what to do; this file, and the
fuller `design-intelligence/anti-generic-ai/` library it summarizes, names what an AI coding agent
specifically, predictably tends to default to, and why each default fails.

## Why AI-generated UI has a recognizable "look"
Language models generate the statistically likely continuation of a pattern. For UI, the statistically
likely pattern is the *average* of a huge number of existing SaaS/marketing sites — which produces
competent, inoffensive, and completely undifferentiated output, because averaging away the ANOMALIES
across a training set is exactly how the average look was formed. Every strongly-evidenced reference in
this system's research (`research/synthesis/01-common-principles.md`) is strong specifically because of
a deliberate anomaly (a reserved device, a non-default composition) tied to a real reason. An agent that
defaults to the statistical average by construction will not produce those anomalies unless explicitly
pushed to find and justify one.

## The ten signatures to check for (full detail in `anti-generic-ai/generic-ui-signatures.md`)
1. Three/four-column feature-card grid as the default way to present any list of things.
2. Giant heading + subheading + centered CTA + logo strip, repeated as the template for every section.
3. Meaningless decorative gradients (usually purple-to-blue) with no connection to brand or content.
4. Everything wrapped in a rounded card with a soft shadow, including things that aren't cards.
5. Glassmorphism/blur applied for "sophistication" with no functional reason (e.g., no real layering).
6. Identical padding/spacing rhythm on every section regardless of content weight or relationship.
7. Icon-plus-three-words feature blurbs, repeated many times, none differentiated from the others.
8. Badges, pills, and "NEW" tags applied to nearly everything, diluting their signal value to zero.
9. Motion/animation applied because the framework makes it easy, with no TRIGGER→MOTION→PURPOSE chain.
10. A visual identity that could be swapped onto an unrelated competitor's product without anyone
    noticing the mismatch.

## The test this system uses instead of a checklist alone
For any design decision, ask: **"Could I state, in one sentence, the specific reason this choice serves
this specific product/brand/audience?"** Every strongly-evidenced reference in this research passes that
test (see `research/synthesis/01-common-principles.md` and `09-brand-expression.md`). A decision that
only passes "it looks nice" or "this is what SaaS sites look like" fails it, and should be revisited
before a UI is called finished — see `.agents/rules/anti-generic-ui.md` and the BLOCKER-tier "obviously
generic composition" failure in `scoring/quality-gate.md`.

## What this file does not argue
It does not argue that card grids, gradients, or rounded corners are inherently bad — every one of those
techniques appears, used well, somewhere in this system's research (Stripe's restrained gradient use,
`research/awwwards/01-stripe.md` §5; Cowboy's disciplined UI structure, `13-cowboy.md`). The failure is
never the technique; it's the technique applied by default, at the statistical average intensity, with
no traceable reason — exactly the distinction `research/synthesis/10-anti-patterns.md` makes explicit.

## Operational consequence for this system
Every agent role in `.agents/agents/` and every rule in `.agents/rules/` is required to run this file's
one-sentence test before finalizing a visual decision, and `.agents/agents/visual-art-director.md` is
specifically responsible for catching "technically correct but visually generic" output that a purely
functional review would pass.
