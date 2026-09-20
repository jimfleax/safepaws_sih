# Accessibility

## What it is
Ensuring the interface is usable by people with visual, motor, auditory, or cognitive differences, and
across assistive technologies — a floor, not a design preference, per `MASTER_PLAN.md`'s engineering
philosophy. This is the one principle file with the least tolerance for contextual exception.

## Non-negotiable baseline
- Semantic HTML first — real headings, real buttons, real form labels, real landmarks. ARIA
  supplements semantic HTML; it does not replace it.
- Color contrast: minimum WCAG AA (4.5:1 body text, 3:1 large text/UI components) — verify actual
  values, don't estimate by eye, especially in dark mode where contrast often silently degrades.
- Every interactive element reachable and operable by keyboard alone, with a visible focus state.
- Never disable pinch-zoom or user-controlled text scaling — see the real, observed failure in
  `research/awwwards/04-uncommon-studio.md` §11: an otherwise excellent, awarded site with this exact
  defect, kept in this research specifically to prevent this system from treating award recognition as
  an accessibility proxy.
- Respect `prefers-reduced-motion` with a genuine alternative, not a cosmetically-adjusted animation.
- Autoplaying audio/video defaults to muted with visible, easy user control — see
  `research/awwwards/04-uncommon-studio.md` §7 for the correct pattern.

## Implementation guidance
- Alt text describes function/content, not "image of X" — decorative images get empty alt attributes,
  not missing ones.
- Form errors are announced to assistive tech, associated with their field programmatically, and
  described in text (not color alone).
- Don't rely on hover-only affordances for anything necessary to complete a task — no hover on touch
  devices.

## Failure mode
Treating accessibility as a final pass/checklist after visual design is "done," rather than a constraint
present from the first design decision — retrofitting is where real, expensive accessibility debt comes
from. See `.agents/rules/accessibility-quality.md` and the BLOCKER severity tier in
`scoring/quality-gate.md`.

## When context changes implementation, not the requirement
Different products have different realistic assistive-tech usage profiles (a B2B internal tool vs. a
public government service), which can affect *priority/depth* of testing, but never removes the
baseline above.
