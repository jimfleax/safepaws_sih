# Font Pairing

## The governing rule
Every pairing decision should be traceable to a stated communicative job for each typeface — "serif for
editorial authority, sans for functional UI," for example — not aesthetic instinct alone
(`principles/05-typography.md`).

## Practical pairing strategies
- **Single family, multiple weights/optical sizes**: the safest, most consistent option — many modern
  variable fonts cover display through UI needs within one family, avoiding pairing risk entirely.
- **Two families, clear role separation**: a display/headline face distinct from a body/UI face, with
  enough contrast between them (serif+sans, or geometric+humanist sans) that the pairing reads as
  intentional rather than accidental — too-similar pairings (two similar grotesks) can look like a
  mistake rather than a considered choice.
- **A third, separate "voice" for a specific, rare purpose** (Stripe's italic display treatment used only
  for the hero claim) — this is a controlled exception to the two-family rule, used exactly once per
  page, not a third general-purpose family.

## Failure mode
Arbitrary combination of fonts because each looks appealing in isolation, with no stated role
differentiation or contrast logic — a common, checkable generic-AI signature
(`anti-generic-ai/typography-failures.md`).

## Implementation note
Limit to 2 families (occasionally a controlled third for a single reserved purpose) — more than that
in one interface is very rarely justified and usually indicates the pairing decision wasn't disciplined.
