# Responsive Patterns Synthesis

## Honest state of evidence
This is the thinnest-evidenced synthesis file in the set. No live-rendered/resizable inspection was
possible for any of the 25 references (see `MASTER_PLAN.md` §1), so almost all responsive-specific
claims across the dossiers are UNKNOWN or based only on metadata signals, not measured breakpoint
behavior. This is stated plainly rather than backfilled with plausible-sounding invented values.

## What real signals exist
- **Distinct desktop/mobile assets independently catalogued** (Cowboy 13, Zajno 09): Awwwards itself
  tags "Desktop thumbnail" and "Mobile thumbnail" as separate award elements for both — real evidence
  that deliberate, separate mobile design was part of the awarded submission, without revealing the
  specific breakpoint decisions made.
- **Active A/B experimentation on mobile nav pattern, even at scale** (Stripe 01): a live experiment
  flag confirms that even a mature, high-traffic product treats mobile navigation pattern as an
  unresolved, testable question rather than a solved default — a useful humility signal for this system
  to carry forward.
- **A known, real accessibility failure that specifically affects mobile** (Uncommon Studio 04):
  `user-scalable=no` disables pinch-zoom, directly relevant to responsive/mobile accessibility, real and
  unambiguous.
- **A format whose entire interaction model has an unresolved mobile question** (Bruno Simon 07):
  a keyboard-driving-based interaction mechanic on a touchscreen device is a genuinely open design
  question this research could not resolve from available evidence.

## Implication for this system
`design-intelligence/principles/11-responsive.md` and `playbooks/mobile-web.md` are built primarily
from general, well-established responsive-design principle rather than from this reference set's own
measured data, with the above four data points cited as the specific, real evidence that does exist.
Future maintenance (`maintenance/UPDATE_SYSTEM.md`) should prioritize direct mobile-viewport testing of
these references if/when browser tooling becomes available, since this is the weakest-evidenced
dimension across the entire research phase.
