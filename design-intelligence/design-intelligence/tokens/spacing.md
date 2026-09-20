# Spacing Tokens

## Structure
A single base unit with a defined scale (linear or geometric) that every spacing decision in a project
references — never an arbitrary per-instance pixel value (`principles/03-spacing.md`).

## Recommended structure (values are illustrative defaults, adjust per theme)
```
space-0: 0
space-1: 4px    (base unit)
space-2: 8px
space-3: 12px
space-4: 16px
space-5: 24px
space-6: 32px
space-7: 48px
space-8: 64px
space-9: 96px
space-10: 128px
```
## Usage guidance
- Component-internal spacing (padding within a button, gap within a card): typically `space-2`
  through `space-4`.
- Related-element spacing (between a label and its input, between a heading and its immediate body):
  typically `space-3` through `space-5`.
- Section-level spacing (padding between major page sections): typically `space-7` through `space-9`,
  adjusted per theme density (a dashboard theme uses smaller section spacing than an editorial theme).
- Never introduce a spacing value outside the defined scale for a one-off — if the scale doesn't have
  the right value, that's a signal to reconsider the scale, not to break it once.

## Theme variation
A "brutalist" or "technical" theme might use a tighter, denser scale overall; a "luxury" or "editorial"
theme might shift the whole scale larger, particularly at the section-level tier — see
`themes/` for worked examples.
