# Spacing and Rhythm

## What it is
The systematic use of consistent spacing values (a spacing scale) to create rhythm, group related
content, and separate unrelated content — arguably the single highest-leverage, lowest-glamour
craft signal in any interface.

## Core rule
Related items get less space between them than unrelated items — proximity is a grouping signal users
read unconsciously. A form label 24px from its input but 48px from the next field group communicates
structure without any additional visual device.

## Implementation guidance
- Use a defined scale (see `tokens/spacing.md`), not arbitrary pixel values chosen per-instance — this
  is what makes a page feel "considered" versus "assembled." Stripe's own section rhythm
  (`research/awwwards/01-stripe.md` §3) alternates block types but stays internally consistent in
  spacing logic within each type.
- Section-level rhythm (padding between major sections) should be consistent enough to feel intentional
  but can vary by content weight — a dense data section and a sparse hero section legitimately need
  different padding, but the *system* generating those values should still be traceable to the same
  scale, not ad hoc per section.
- Whitespace is not "empty" — it is an active design element carrying meaning (emphasis, luxury,
  breathing room for reading). Removing it to "fit more in" without reconsidering hierarchy is a common,
  visible failure.

## Failure mode
Identical spacing applied uniformly everywhere regardless of content relationship — this is a specific,
common generic-AI signature (see `anti-generic-ai/spacing-failures.md`): every section gets the same
96px padding whether it's a hero or a tight utility bar, and every element gets the same 16px gap
whether related or not.

## When density is correct instead
Dashboards, tables, and power-user tools where screen real estate directly trades against task
efficiency — see `18-dashboard-design.md`. Generous spacing there can be a genuine usability regression,
not a polish upgrade.
