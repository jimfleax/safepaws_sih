# Rule: Accessibility Quality

Applies to: every UI task, without exception. This is a floor, not a contextual judgment call
(`design-intelligence/principles/12-accessibility.md`).

**Always**:
- Use real semantic HTML first (headings, buttons, form labels, landmarks) — ARIA supplements semantics,
  it never replaces them.
- Verify color contrast meets WCAG AA (4.5:1 body text, 3:1 large text/UI components) — check actual
  values, don't estimate by eye, and re-verify independently for dark-mode values.
- Make every interactive element keyboard-reachable and operable, with a visible focus state.
- Announce dynamic content changes to assistive tech (`aria-live`) — loading states, form errors, toast
  notifications, real-time data updates.
- Provide captions/alt text with real informational content, not filler ("image of...").

**Never**:
- Disable pinch-zoom or user-controlled text scaling.
- Rely on color alone to convey state (error, success, required field, active nav item).
- Ship autoplaying audio/video without a default-muted state and a visible, easy user control.
- Treat accessibility as a final pass after visual design is "done" — it is a constraint from the first
  decision, and retrofitting is where expensive, avoidable debt comes from.

A failure here is a BLOCKER per `design-intelligence/scoring/quality-gate.md` regardless of how strong
the rest of the work scores. Full detail: `.agents/agents/ux-reviewer.md`,
`.agents/agents/frontend-quality.md`.
