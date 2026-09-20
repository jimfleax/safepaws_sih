# Display Typography

## What it's for
The largest, most attention-commanding type on a page — reserved for the single most important
statement, per the "one reserved voice" principle (`principles/05-typography.md`, Stripe's italic-
headline device).

## When to use it
Exactly one moment per view: a hero claim, a section's primary statement, a specialist portfolio's
core content (Mat Voyce's kinetic type as the actual content, not a caption — `research/awwwards/11-
mat-voyce.md`).

## When NOT to use it
Repeated on every section heading down a page — the most common, most visible generic-AI typography
failure (`anti-generic-ai/typography-failures.md`); if every heading is "loud," none of them are.

## Implementation guidance
- Pair with tighter tracking and line-height than body type (`line-length-and-rhythm.md`).
- Verify legibility and layout integrity with the actual longest realistic headline this component will
  need to display, not just the demo copy — display type breaks visibly with unexpectedly long real
  content.
- Scale non-linearly for mobile — a naive proportional shrink of a 96px desktop headline to a
  viewport-relative unit can still overwhelm a small screen; retune the actual mobile-specific size.

## Failure mode
Oversized type used as a default aesthetic signature rather than a hierarchy device — see
`anti-generic-ai/typography-failures.md` for the specific checklist this produces.
