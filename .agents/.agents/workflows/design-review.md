# Workflow: /design-review

Full multi-role review of existing work — invokes `agents/design-review-orchestrator.md`'s complete
pipeline against an already-built UI (as opposed to `/premium-ui`, which builds new work).

## Steps
1. **Establish what's being reviewed against** — locate or reconstruct the original design brief; if
   none exists, state that explicitly and infer intent from the implementation as the baseline to
   evaluate against.
2. Run the full pipeline from `agents/design-review-orchestrator.md`: Visual Art Director → UX Reviewer
   → Motion Director → Frontend Quality → Design System Architect.
3. Where real browser/preview tooling is available, use it (`.agents/workflows/visual-review.md`) —
   don't review from source code alone if rendered inspection is possible.
4. Aggregate findings into `design-intelligence/scoring/scoring-rubric.md`'s dimensions with the
   context-appropriate weighting for this surface type.
5. Apply `design-intelligence/scoring/quality-gate.md`'s severity system — flag any BLOCKER prominently,
   separate from the numeric score.
6. Produce a prioritized fix list: BLOCKER first, then HIGH, then MEDIUM/LOW.

## Output
A structured review report (dimension scores + severity-tagged findings + prioritized fix list) — this
workflow does not fix issues itself; pair with `/refactor-ui` or `/upgrade-generic-ui` for that.
