# E-commerce (Component-Level) Pattern
Full principle detail in `principles/20-ecommerce.md`; this file covers the specific recurring
components.
**What it is**: Product listing pages, product detail pages, cart, and checkout — the conversion-
critical component chain.
**Layout anatomy — PLP**: Filterable/sortable grid (`filters.md`) + consistent product-card treatment
(`cards.md`) + clear price/availability at a glance. **PDP**: Image gallery (multiple angles) +
price + specific trust content (`principles/15-conversion.md`) + clear primary CTA + secondary details
(specs, reviews) below the fold. **Cart/checkout**: Strict `forms.md` convention-following, minimal
distraction, visible order summary throughout.
**UX rationale**: Every step of the purchase funnel should reduce, not add, uncertainty — a PDP that
raises new questions (unclear shipping cost, ambiguous sizing) without answering them loses conversions
regardless of visual polish.
**Visual variants**: Achromatic UI with color-carrying product photography (Cowboy,
`research/awwwards/13-cowboy.md` §5); restrained/apothecary style (Aesop, general reputation); densely
merchandised (large catalog, discovery-oriented).
**Responsive strategy**: Checkout especially must be flawless on mobile — a large share of abandonment
happens exactly there; test the real flow on a real small viewport, not just the PDP.
**Accessibility requirements**: Price, availability, and shipping information available as real text
(not embedded in an image); size/variant selectors keyboard-operable with clear selected state.
**Performance considerations**: Product images are usually the largest asset weight on a commerce site —
prioritize responsive image sizing and lazy-loading below the fold rigorously.
**Anti-patterns**: Hidden costs revealed only at the final checkout step; auto-added items/insurance
upsells requiring active opt-out (dark pattern).
**Implementation notes**: Concrete, specific trust content near the CTA outperforms generic trust badges
(`research/awwwards/13-cowboy.md`).
