# E-commerce Design

## What it is
Interfaces whose job is product discovery, evaluation, and purchase — scored (per
`scoring/scoring-rubric.md`'s context weighting) with product discovery, trust, conversion, and
usability weighted above pure visual spectacle.

## Core pattern from this research
**Pair desire-building presentation with concrete, specific trust content**, especially for considered/
higher-cost purchases — Cowboy's structure (`research/awwwards/13-cowboy.md`): premium product
photography plus specific, checkable reassurance (service network size, at-home trial offer) rather than
photography alone or generic trust badges.

## Implementation guidance
- Product photography consistency (angle, background, lighting) across a catalog signals quality control
  more than any individual hero shot's polish.
- Achromatic/restrained UI chrome is a strong choice specifically when product photography itself
  carries color and visual interest (`06-color.md`) — don't default to it if products are visually
  unremarkable (e.g., plain packaging), where it leaves nothing to showcase.
- Search and filter must handle real catalog scale and real query variance (typos, synonyms), not just
  the demo dataset — see Muji's "restraint must survive catalog scale" lesson
  (`research/awwwards/25-muji.md` §13).
- Reviews/social proof should be genuine and specific — vague five-star badges without visible review
  content read as less trustworthy than a smaller number of detailed, specific reviews.
- Checkout follows form-design convention strictly (`17-form-design.md`) — this is the worst possible
  place for novel interaction patterns.

## Failure mode
Trust signals that are vague or unverifiable ("Trusted by thousands!") rather than specific, and
achromatic/minimal styling applied as a generic "premium" shortcut disconnected from whether the actual
product photography can carry that restraint.

## When to allow more visual richness/brand personality
Brand-driven, discovery-oriented shopping (fashion, lifestyle, gifting) can afford more editorial,
story-driven presentation than purely functional/replenishment shopping (e.g., commodity restocking),
where speed and predictability should dominate instead.
