# Workflow: /accessibility-review

Focused review against `design-intelligence/principles/12-accessibility.md`'s full baseline, using
`agents/ux-reviewer.md` and `agents/frontend-quality.md`.

## Steps
1. Verify semantic HTML structure: real headings in order, real interactive elements
   (`<button>`/`<a>`), real form labels, real landmarks.
2. Measure actual color contrast ratios (not estimated by eye) against WCAG AA minimums, including
   independently for dark-mode values if present.
3. Verify full keyboard operability: tab order, visible focus states, no keyboard traps, all
   functionality reachable without a mouse.
4. Verify dynamic content changes are announced to assistive tech (`aria-live` for toasts, form errors,
   loading states, real-time updates).
5. Verify no state (error, success, required, active) relies on color alone.
6. Verify zoom/pinch is never disabled and text can be resized by the user.
7. Verify `prefers-reduced-motion` produces a genuine alternative experience, not just a technically
   present media query.
8. Verify autoplaying media defaults to muted with a visible, easy control.
9. Verify alt text is informational, not filler, and decorative images use empty alt attributes.

## Severity
Any failure in steps 1-6 is treated as a BLOCKER per `design-intelligence/scoring/quality-gate.md`,
regardless of how the rest of the interface scores.

## Output
A pass/fail per checklist item with specifics (not a vague "improve accessibility" note), feeding into
`/design-review`'s aggregate report or usable standalone.
