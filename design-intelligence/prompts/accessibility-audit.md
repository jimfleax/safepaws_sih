# Prompt Template: Accessibility Audit

Use when: the specific task is a dedicated accessibility review.

**Route to**: `/accessibility-review` directly — its 9-step checklist is the full procedure.

**Reminder before starting**: award-winning or visually excellent work has never been shown in this
system's own research to imply accessibility (`research/awwwards/04-uncommon-studio.md` §11 is direct
evidence against that assumption) — audit the actual implementation, not the design's apparent polish.

**Non-negotiable checks, always run regardless of scope**: contrast ratios measured (not estimated),
full keyboard operability, zoom never disabled, dynamic content announced via `aria-live`, no
color-only state signaling, `prefers-reduced-motion` genuinely honored.

**Severity**: failures in the semantic/contrast/keyboard/zoom category are BLOCKERs
(`scoring/quality-gate.md`) regardless of how the rest of the interface scores — report them as such,
not folded into a general score that could mask them.
