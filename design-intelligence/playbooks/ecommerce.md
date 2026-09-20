# Playbook: E-commerce

Full principle/pattern detail: `principles/20-ecommerce.md`, `patterns/ecommerce.md`.
**UX priorities**: product discovery, trust, and conversion weighted above visual spectacle per
`scoring/scoring-rubric.md`'s context reweighting.
**Visual priorities**: match UI restraint to whether product photography can carry visual interest
(achromatic chrome, `research/awwwards/13-cowboy.md`) — don't default to minimal styling if products are
visually unremarkable.
**Information architecture**: search/filter must handle real catalog scale (`research/awwwards/
25-muji.md`); category structure matches how customers actually think about products, not internal
merchandising structure.
**Typical patterns**: `patterns/cards.md` for PLP, `patterns/forms.md` strictly for checkout.
**Appropriate motion**: minimal on checkout (convention beats novelty here, tension #2); can be richer
on discovery/browse pages for brand expression.
**Accessibility considerations**: price/availability as real text, not embedded in images; keyboard-
operable variant/size selectors.
**Responsive priorities**: checkout flawless on mobile specifically — a major share of abandonment
happens there; test the real flow, not just the PDP.
**Common mistakes**: hidden costs revealed only at final checkout; vague trust badges instead of
specific, checkable reassurance (`research/awwwards/13-cowboy.md`); novel checkout interactions.
**Quality checklist**: Concrete (not vague) trust content near primary CTA? Checkout follows form
convention strictly? Real catalog-scale search/filter tested, not just demo data?
