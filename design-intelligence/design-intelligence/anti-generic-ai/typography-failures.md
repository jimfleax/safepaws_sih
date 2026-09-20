# Typography Failures

## The specific signatures
1. **Oversized headings on every section** — if every heading uses the same huge display treatment, none
   of them signal importance anymore (`typography/display-typography.md`).
2. **Poor line length** — body text with no max-width, producing uncomfortably long lines on wide
   viewports (`typography/line-length-and-rhythm.md`).
3. **Tiny body text** — reading content below ~16px, often paired with low contrast, failing
   accessibility minimums (`principles/12-accessibility.md`).
4. **Inconsistent weights** — bold used inconsistently for similar-importance content across a page, with
   no systemized rule for when it triggers.
5. **Arbitrary font combinations** — two or more typefaces combined with no stated role differentiation
   (`typography/font-pairing.md`).

## Why these happen together
All five stem from the same root cause: type decisions made per-instance rather than from a defined
scale and role system (`tokens/typography.md`) — each individual choice might look fine in isolation,
but the aggregate reads as unconsidered.

## The repair
1. Establish (or verify) a real type scale with named tiers (`typography/type-hierarchy-and-scale.md`)
   and map every text element to one tier — no bespoke sizes.
2. Verify line-length at actual rendered container widths, not just in a narrow design-tool preview.
3. Confirm body text meets the 16px+ floor and passes contrast minimums.
4. Reserve the largest/boldest treatment for exactly one element per view
   (`typography/display-typography.md`).

## When large type IS correct everywhere on a page
Genuinely typography-led content (a kinetic-type portfolio, an editorial feature where type IS the
content, `typography/editorial-typography.md`) may legitimately use large type throughout — the failure
is defaulting to it without that being the actual communicative point.
