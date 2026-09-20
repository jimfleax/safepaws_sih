# Letter Spacing (Tracking) & Text Density

## Tracking
- **Large display type**: slightly negative tracking (tighter) often improves cohesion at large sizes,
  where default tracking can look loose.
- **Small UI/label text, especially all-caps labels**: slightly positive tracking (looser) improves
  legibility — all-caps text at default or negative tracking is a common, checkable legibility failure.
- **Body text**: default/native tracking is almost always correct — body copy is the context most
  sensitive to tracking manipulation, and adjustments here are rarely necessary or beneficial.

## Text density
The relationship between type size, line-height, and surrounding whitespace that determines how much a
block of text "asks" of the reader per screen.
- Dense (smaller size, tighter line-height, less surrounding whitespace): appropriate for
  reference/scanning contexts and expert/frequent-use UI (`principles/18-dashboard-design.md`).
- Loose (larger size, generous line-height, more whitespace): appropriate for sustained reading and
  brand/editorial moments where the reading experience itself is part of the value (`editorial-
  typography.md`).

## Failure mode
Uniform density applied everywhere regardless of context — the same tight, dense treatment used for both
a data table (appropriate) and an editorial feature article (inappropriate, fatiguing) signals the
density choice wasn't actually considered per context.

## Implementation note
Treat tracking and density as tokens tied to type-scale tier (`tokens/typography.md`), not manual
per-instance tuning, so the relationship stays consistent as the system grows.
