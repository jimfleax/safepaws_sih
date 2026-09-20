# Workflow: /premium-ui

Full pipeline for building a new, high-quality UI surface from scratch. Invokes the agent roles in
`.agents/agents/` in sequence (see `design-review-orchestrator.md` for the coordination logic) and the
rules in `.agents/rules/` throughout.

## Steps

**1. UNDERSTAND** — Establish product, user, primary action, realistic usage context. If unclear, ask
one clarifying question or state the most reasonable assumption explicitly and proceed
(`design-intelligence/MASTER_PLAN.md` operating philosophy).

**2. DESIGN** — Adopt `agents/design-director.md`. Produce a design brief
(`design-intelligence/templates/design-brief.md`): direction, principles, references (for principle
extraction, never composition-copying — `design-intelligence/retrieval/chain.md`), hierarchy,
interaction model, responsive strategy, motion philosophy, explicit anti-patterns to avoid.

**3. BUILD** — Implement per the brief. Reference `design-intelligence/tokens/` for all values.
Consult the relevant `design-intelligence/patterns/*.md` and `design-intelligence/playbooks/*.md` for
the specific surface type.

**4. BROWSER REVIEW** — Where real browser/preview tooling is available in the current environment,
use it: open the rendered result, capture/inspect desktop and mobile views, check interactions, check
console/errors, check overflow (`.agents/workflows/visual-review.md` defines the full procedure). If no
such tooling is available, state that explicitly rather than proceeding as if inspection occurred.

**5. CRITIQUE** — Run the full orchestrator pipeline: `agents/visual-art-director.md` →
`agents/ux-reviewer.md` → `agents/motion-director.md` → `agents/frontend-quality.md` →
`agents/design-system-architect.md`.

**6. ITERATE** — Fix findings from step 5, prioritizing any BLOCKER first
(`design-intelligence/scoring/quality-gate.md`), then HIGH severity, then MEDIUM/LOW as time allows.

**7. FINAL QUALITY GATE** — Run `.agents/rules/final-quality-gate.md`'s full A-O checklist. Do not
declare done until every question is honestly answered and no BLOCKER remains.

## When to stop iterating
When the quality gate passes at or above the target tier stated in the design brief — not after a fixed
number of iterations, and not merely because the code compiles.
