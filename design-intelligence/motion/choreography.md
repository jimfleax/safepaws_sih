# Motion Choreography

## What it is
The orchestration of multiple motion patterns across a page or flow so they read as one authored
sequence rather than a collection of independently-triggered animations — the difference between
Zajno's published, deliberately-sequenced architecture (`research/awwwards/09-zajno.md` §8) and a page
where every component animates on its own schedule with no relationship to the others.

## Core rules
- **Stagger with intent, not by default**: when multiple elements enter together (a list, a grid), a
  small stagger (30-80ms between items) can guide the eye in reading order — but stagger delay should
  scale down or disappear for long lists, where a large total stagger delay becomes its own source of
  friction.
- **One motion "voice" per experience**: easing curves, typical durations, and the overall "physicality"
  of motion (snappy vs. weighted/springy) should feel consistent across a single product, the same way a
  typographic voice should — inconsistent motion character across a page is as visible a craft signal as
  inconsistent typography.
- **Sequence dependent animations explicitly**: if animation B should only begin after animation A
  completes (or reaches a specific point), wire that dependency directly rather than approximating it
  with matched fixed durations, which drifts out of sync as either animation is later adjusted.

## Implementation guidance
Use a single animation-timeline/orchestration approach per page for complex sequences (as Zajno's
published GSAP+Theatre.js coupling demonstrates) rather than many independent, uncoordinated animation
triggers — this is what makes a long, motion-rich experience feel authored rather than assembled.

## Failure mode
Each component animates well in isolation (in a Storybook/demo view) but the aggregate page feels
chaotic because durations, easings, and triggers were tuned independently with no shared choreography
plan.

## When to keep choreography minimal
Utility/task-focused interfaces (`principles/18-dashboard-design.md`) — orchestrated, multi-element
choreography is a cost users pay repeatedly; reserve it for marketing/storytelling contexts experienced
less frequently per user.
