# Quality Gate: Tiers & Blockers

## Quality tiers (0-100, from `scoring-rubric.md`'s weighted total)

| Range | Tier | Meaning |
|---|---|---|
| 0-39 | **Broken / unacceptable** | Core functionality fails, or accessibility/usability is severely compromised. Not shippable in any context. |
| 40-54 | **Functional but poor** | Works, but generic, awkward, or has multiple real usability problems. Shippable only under extreme time constraint, with the debt explicitly acknowledged. |
| 55-69 | **Decent** | Solid, unremarkable execution. No major failures, but no real point of view either — likely still shows several `anti-generic-ai/` signatures. Acceptable baseline, not a target. |
| 70-79 | **Strong** | Clear intentionality, few if any generic signatures, good execution across most dimensions. A reasonable target for most production work under normal constraints. |
| 80-89 | **Premium** | Distinctive, well-crafted, purpose-matched decisions throughout; the target tier for anything representing the product's brand quality. |
| 90-94 | **Exceptional** | Would hold up next to genuinely excellent independent work; every dimension shows real craft, not just the absence of failure. |
| 95-100 | **Reference-quality** | Comparable to the strongest entries in this system's own research set (`research/RESEARCH_LOG.md`'s VERY HIGH confidence tier). Rare; not a realistic target for routine work. |

Tiers are named, not just numbered, because a bare "72/100" is less actionable than "Strong — held back
from Premium specifically by X" — always report the tier name and the specific gap to the next tier up.

## Severity system for blockers

**BLOCKER** — the page cannot be called finished regardless of numeric score. Includes:
- Horizontal overflow (content wider than viewport, forcing unwanted scroll)
- Broken mobile layout (not just suboptimal — actually broken: overlapping, unreadable, or unusable)
- Unreadable text (contrast failure, or text rendered illegibly small)
- Inaccessible interaction (keyboard-untrappable, no focus state, or functionality with no non-hover/
  non-mouse path)
- Broken navigation (a nav item that doesn't go anywhere, or navigation that traps the user)
- Missing required loading state (content appears to have failed when it's actually just loading)
- Severe contrast issues (below WCAG AA on primary content)
- Obviously generic composition (fails `anti-generic-ai/generic-ui-signatures.md`'s one-sentence test
  on multiple major decisions)
- Inconsistent design tokens (values that should reference a shared token diverge arbitrarily across
  the same surface)
- Dead interactions (an element that looks interactive but produces no perceptible response)
- Major visual misalignment (elements clearly not aligned to any coherent grid)
- Avoidable layout shift (content jumping as assets load, with no reserved space)
- Excessive animation causing poor UX (motion that delays task completion, ignores
  `prefers-reduced-motion`, or is disorienting)

**HIGH** — a significant, real quality problem that should block a "Premium" or higher tier claim but
doesn't necessarily make the page unshippable at a "Strong" or "Decent" tier: e.g., a single generic-AI
signature present in an otherwise solid page; a motion pattern with no stated purpose but that doesn't
actively harm usability; a moderate (not severe) contrast issue on secondary content.

**MEDIUM** — a real improvement opportunity that doesn't block any tier claim on its own but should be
fixed with normal iteration: inconsistent spacing in a minor section; a missed opportunity for a more
specific brand-expression device; a suboptimal but not broken empty state.

**LOW** — a polish-level note: a slightly better word choice, a marginally improved easing curve, a
token value that could be more precisely tuned.

## How severity interacts with the numeric score

A single BLOCKER caps the reported tier at "Functional but poor" (0-54) regardless of the weighted
numeric total — a page can score 85/100 on every dimension except one BLOCKER-level accessibility
failure and must still be reported at the capped tier, not the numeric one. This is the mechanism that
prevents `final-quality-gate.md`'s core purpose (stopping "it compiles" from counting as done) from
being defeated by a high score elsewhere compensating for one serious failure.

HIGH-severity findings don't cap the tier outright but should be weighed against a "Premium" or higher
claim specifically — report both the raw numeric tier and a note like "capped at Strong pending 2 HIGH
findings" where relevant.
