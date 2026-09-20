# Type Hierarchy & Scale Systems

## Scale systems
Use a defined ratio-based scale (e.g., a modular scale around 1.25-1.333x per step, or a curated set of
stops like 12/14/16/18/24/32/48/64/96px) rather than arbitrary per-instance sizing. This is the
foundational discipline behind `principles/05-typography.md` and is what lets `tokens/typography.md`
exist as a real, reusable system rather than a list of one-off values.

## Hierarchy levels and their jobs
- **Display** (largest): the single reserved "voice" for the one most important statement per view
  (Stripe's italic headline device, `research/awwwards/01-stripe.md` §13) — used once, not repeated.
- **Headline/H1-H3**: section and page structure — must map to real semantic heading levels, not just
  visual size.
- **Body**: sustained reading content — governed by `line-length-and-rhythm.md`, never below ~16px.
- **UI/label**: functional interface text (buttons, form labels, metadata) — can be smaller and denser
  than body copy since it's scanned, not read continuously, but must still clear accessibility minimums.
- **Caption/meta**: the smallest tier — timestamps, attributions — used sparingly since it's the easiest
  tier to make illegible.

## Optical sizing
Large display type and small UI text are not just scaled versions of the same letterforms — variable
fonts with optical size axes (or separate display/text cuts of a typeface) adjust stroke contrast and
spacing so each size range stays legible and doesn't look either bloated (small size, unadjusted heavy
strokes) or thin/fragile (huge size, unadjusted fine strokes). Use this where the font family supports
it; where it doesn't, compensate with tracking/weight adjustments per tier.

## Failure mode
A single font-size variable scaled linearly across every use case (a "clamp() everything by the same
formula" approach) — produces technically responsive but optically inconsistent type at the extremes.
