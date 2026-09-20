# Prompt Template: New E-commerce Site

Use when: building a product-selling site (PLP/PDP/cart/checkout).

**Route to**: `/design-first` then `/premium-ui`, using `playbooks/ecommerce.md` and
`principles/20-ecommerce.md`.

**Fill in before starting**:
- Is this a considered/high-cost purchase (needs concrete trust content, per Cowboy's pattern,
  `research/awwwards/13-cowboy.md`) or a low-consideration/replenishment purchase (needs speed over
  persuasion)?
- Can product photography carry visual interest, or is the UI chrome doing more of the work (affects
  the achromatic-vs-richer color decision, `principles/06-color.md`)?
- Real catalog scale (affects search/filter design, `research/awwwards/25-muji.md`'s "restraint must
  survive catalog scale" lesson).

**Non-negotiable**: checkout follows strict form-design convention (`patterns/forms.md`) regardless of
how expressive the rest of the site is — this is the one place novelty should almost always lose.

**Then execute `/premium-ui`**, with `scoring-schema.json`'s `ecommerce` profile for review.
