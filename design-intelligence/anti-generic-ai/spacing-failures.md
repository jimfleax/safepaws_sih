# Spacing Failures

## The specific signature
Identical padding/margin values applied to every section regardless of content weight or relationship
— a page that is technically "consistent" but not actually rhythmic, because consistency was applied
mechanically rather than derived from content structure (`principles/03-spacing.md`).

## The two opposite failure modes
1. **Uniform-everywhere**: every section gets the same 96px top/bottom padding whether it's a dense
   utility bar or a spacious hero — produces a page that feels flat/monotonous despite "consistent"
   spacing.
2. **Arbitrary-everywhere**: spacing tuned per-instance by eye with no underlying scale
   (`tokens/spacing.md`) — produces a page that feels randomly assembled even if individual sections look
   fine in isolation.

## The correct pattern (from this research)
Stripe's section rhythm (`research/awwwards/01-stripe.md` §3) varies by content type (narrow prose
blocks vs. full-bleed proof blocks) while staying internally consistent within each type — spacing
derived from a shared scale, applied with judgment about content relationship, not applied identically
everywhere out of mechanical consistency.

## The repair
1. Audit actual proximity relationships: do visually-related elements sit closer together than
   unrelated ones? If everything is equidistant, that's the failure.
2. Verify all spacing values map to the defined scale (`tokens/spacing.md`) — no ad hoc pixel values.
3. Re-examine section-level padding specifically for whether dense/light sections are differentiated
   appropriately, not forced into one padding value.

## When strict uniformity IS correct
Repeated list items within a single collection (table rows, a grid of peer cards) should have
genuinely uniform internal spacing — the failure is uniform spacing applied *across* structurally
different content types, not within one.
