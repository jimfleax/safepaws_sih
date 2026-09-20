# Dashboard Design

## What it is
Interfaces whose primary job is letting a user monitor, compare, and act on data efficiently —
evaluated by information density and task efficiency more than by visual spectacle. Note: this research
set is skewed toward creative/marketing web design, so this file leans more on general product-design
principle than on the 25-site set — flagged in `research/synthesis/12-design-tensions.md` tension #6.

## Context-specific scoring emphasis
Per `MASTER_PLAN.md` §I and `scoring/scoring-rubric.md`: for dashboards, UX/information-architecture and
appropriate density matter more than motion or decorative brand expression — the context-weighted
rubric reflects this explicitly.

## Implementation guidance
- Establish clear visual hierarchy of urgency: what needs attention now vs. what's reference
  information — don't give every metric equal visual weight.
- Default to showing trends/context (change over time, comparison to target) rather than bare current
  numbers wherever the underlying data supports it — a number alone rarely answers "is this good."
- Use density deliberately, not by default — dense is correct for expert/frequent users monitoring many
  signals; more generous spacing is correct for occasional/exploratory dashboard use. Ask which this is.
- Consistent, predictable placement of navigation/filters across all dashboard views — dashboards are
  used repeatedly by the same people; consistency compounds efficiency over time far more than for a
  marketing page seen once.
- Loading and empty states matter disproportionately here — a dashboard with no data yet or a failed
  query needs to communicate that clearly, not show a blank or frozen chart.

## Failure mode
Applying marketing-site visual patterns (large decorative imagery, heavy motion, oversized typography)
to a tool meant for repeated, efficient use — see `anti-generic-ai/dashboard-failures.md`.

## When to allow more visual richness
Executive-summary or presentation-mode dashboard views (as opposed to working/monitoring views) can
reasonably prioritize visual impact over density, since their job is communication to a less frequent,
less expert audience.
