# Metadata & Label Typography

## What it covers
The smallest, most utilitarian typographic tier — timestamps, byline attributions, tag/category labels,
form field helper text — easy to under-design because it's individually low-stakes, but collectively a
real craft signal (an interface with careless metadata typography reads as unfinished even with
excellent headline/body type).

## Implementation guidance
- Maintain a real minimum size even for the smallest tier — never below what `principles/12-
  accessibility.md` and body-type minimums allow for anything a user needs to actually read (as opposed
  to purely decorative micro-text).
- Use color/weight (not just size) to visually subordinate metadata to primary content — a lighter or
  more muted color at a legible size is usually better than pushing size down to the accessibility floor.
- Keep metadata typographic treatment consistent across an entire product — inconsistent timestamp/tag
  styling between different sections is a subtle but checkable "assembled, not designed" signal.

## Failure mode
Metadata text so small or low-contrast it fails accessibility minimums, treated as acceptable because
"it's just a timestamp" — every piece of text a user might need to read is subject to the same
accessibility floor regardless of perceived importance.

## When metadata typography can carry more visual weight
Contexts where metadata IS the primary content a user scans for (e.g., a table of dates/statuses) — there
it should be promoted to body/UI-tier treatment, not left in the smallest tier by default.
