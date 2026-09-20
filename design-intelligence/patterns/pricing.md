# Pricing Pattern
**What it is**: The page/section where a user evaluates cost against value and decides to convert —
among the highest-stakes, most scrutinized UI in any commercial product.
**When to use tiered cards**: 2-4 genuinely distinct plans aimed at different buyer segments.
**When to use a single price or custom-quote pattern**: Single-product or enterprise-only sales motions
where tiered cards would misrepresent the actual sales process.
**Layout anatomy**: Plan name + price + billing-cycle toggle + feature list (differentiated, not just
repeated with checkmarks) + CTA per plan, with one plan visually emphasized only if there's a genuine
"most popular/recommended" reason, not an arbitrary default.
**UX rationale**: Users compare plans primarily by *difference*, not by absolute feature count — lead
with what's different between tiers, not an exhaustive repeated list.
**Visual variants**: Card-based tiered comparison; single-column with toggle; comparison table for many
features across many tiers (`principles/19-data-visualization.md` table conventions apply).
**Responsive strategy**: On mobile, stack tiers in a meaningful order (usually recommended-first, not
just left-to-right desktop order preserved) since side-by-side comparison is lost when stacked.
**Accessibility requirements**: Price and billing-cycle changes must be announced to assistive tech
(a toggle changing displayed price needs an `aria-live` region or equivalent).
**Performance considerations**: Not typically performance-sensitive; prioritize clarity over any motion
effect here.
**Anti-patterns**: Hidden/surprise costs revealed only at checkout; a "most popular" badge with no real
basis, used purely to nudge the more expensive tier (a dark pattern, see `principles/15-conversion.md`).
**Implementation notes**: Confirm every feature-list difference between tiers is accurate and current —
pricing pages are disproportionately checked against reality by skeptical buyers.
