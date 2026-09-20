# Grid Layouts Pattern
**What it is**: Multi-item layout arrangement — distinct from the structural grid system in
`principles/04-grid.md`, this is specifically about arranging a *collection* of items (products,
articles, team members).
**When to use uniform grids**: Genuinely equal-weight peer items (a product catalog).
**When to use bento/mixed-size grids**: Items with different real importance (Stripe's capability
showcase, `research/awwwards/01-stripe.md` §3) — size should reflect actual importance, not be varied
arbitrarily for visual interest.
**Layout anatomy**: Consistent gutter and alignment (`principles/04-grid.md`) with either uniform or
deliberately-weighted cell sizes.
**UX rationale**: Grid regularity signals comparability; deliberate irregularity signals hierarchy among
the items — mixing these signals without intent confuses both.
**Visual variants**: Strict uniform grid; masonry/variable-height grid (good for genuinely variable-
aspect-ratio content like photography); bento (mixed cell sizes reflecting real importance).
**Responsive strategy**: Column count should reduce predictably (e.g., 4→2→1) rather than producing
awkward orphaned items at intermediate widths — test real content counts, not just round numbers.
**Accessibility requirements**: Logical reading/tab order matching visual order, especially important
for masonry/bento layouts where DOM order and visual order can diverge.
**Performance considerations**: Masonry layouts historically cause layout shift if item dimensions
aren't known ahead of render — reserve space or use modern CSS grid/masonry support deliberately.
**Anti-patterns**: Bento/variable sizing applied decoratively with no real underlying importance
difference between items.
**Implementation notes**: Decide item importance/weighting before choosing cell sizes, not after.
