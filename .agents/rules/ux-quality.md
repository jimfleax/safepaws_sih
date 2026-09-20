# Rule: UX Quality

Applies to: any task creating or reviewing user-facing interaction.

**Always**:
- Verify a realistic first-time user could complete the primary task without external instruction —
  count actual steps/decisions, don't estimate from familiarity with the design.
- Give every interactive element a visible affordance AND a visible response
  (`design-intelligence/principles/09-interaction.md`). A "dead interaction" (no perceptible response)
  is a BLOCKER per `design-intelligence/scoring/quality-gate.md`.
- Design real empty, loading, and error states — not just the happy path.
- Match navigation/IA depth to actual audience heterogeneity and content volume
  (`design-intelligence/principles/16-information-architecture.md`), not to convention alone.

**Never**:
- Rely on hover-only affordances for anything necessary to complete a task (no hover on touch).
- Ship a form/checkout/settings flow with novel, unconventional interaction patterns where established
  convention would serve users better (`design-intelligence/principles/17-form-design.md`) — this is the
  one category where brand novelty should almost always lose to learnability.
- Praise or approve UI that "basically works" without checking it against the actual quality tiers in
  `design-intelligence/scoring/scoring-rubric.md` — "functional but poor" is a real, named, below-target
  outcome, not a pass.

Full role detail: `.agents/agents/ux-reviewer.md`.
