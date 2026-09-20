# Scoring Rubric

100-point scale across 12 dimensions. The default weights below are a starting point, not a law —
`scoring-schema.json` defines per-surface-type weight profiles, and this file explains why they differ.
Full quality-tier definitions and blockers are in `quality-gate.md`.

## Default weights (general-purpose page, no strong surface-type signal)

| Dimension | Points | What it measures |
|---|---|---|
| Visual hierarchy | 10 | One clear loudest element per view (`principles/01-hierarchy.md`) |
| Composition | 10 | Balance, focal points, intentional (a)symmetry (`principles/02-composition.md`) |
| Typography | 10 | Real scale, line-length, reserved display voice (`typography/`) |
| Spacing/rhythm | 10 | Derived from content relationships, not mechanical uniformity (`principles/03-spacing.md`) |
| UX/usability | 10 | Task completable without external help; low friction (`agents/ux-reviewer.md`) |
| Interaction | 10 | Every interactive element has affordance + response (`principles/09-interaction.md`) |
| Motion | 5 | Every pattern completes TRIGGER→MOTION→PURPOSE→USER VALUE (`motion/principles.md`) |
| Responsive design | 10 | Mobile genuinely redesigned, not reflowed (`principles/24-mobile-web.md`) |
| Accessibility | 10 | Full baseline met (`principles/12-accessibility.md`) |
| Performance | 5 | Optimized assets, stated fallbacks for heavy techniques (`principles/13-performance.md`) |
| Brand expression | 5 | Distinguishing choices traceable to something real about this product (`principles/08-brand.md`) |
| Content clarity | 5 | Copy is specific to this product, not generic/interchangeable (`principles/14-content-design.md`) |
| **Total** | **100** | |

## Context-sensitive reweighting

The source brief is explicit that these weights must not be applied blindly. Reweight per surface type
using the playbook that matches (`design-intelligence/playbooks/`):

**Dashboard / data-heavy tool** (`playbooks/dashboard.md`): UX/usability and a folded-in "information
density appropriateness" concern rise to ~15 each; Motion and Brand Expression drop to ~3 each; Visual
Hierarchy stays high (urgency signaling is central to dashboard success).

**Portfolio / creative showcase** (`playbooks/portfolio.md`, `agency.md`): Composition, Typography, and
Brand Expression rise to ~15 each; Accessibility and Performance stay at their floor values (never
reduced below what `principles/12-accessibility.md` and `13-performance.md` require) but Motion may
rise to ~10 since purposeful richness is more often appropriate here (`principles/22-creative-web.md`).

**E-commerce** (`playbooks/ecommerce.md`): UX/usability rises toward ~15, folding in product-discovery
and trust-content specificity; Content Clarity rises to ~10 (trust copy must be concrete, not vague,
per `research/awwwards/13-cowboy.md`); Motion drops to ~3.

**Editorial** (`playbooks/editorial.md`): Typography rises to ~15; Motion drops to ~3 and is evaluated
specifically against "does it help or interrupt reading" rather than general purposefulness; Spacing/
rhythm (line-length specifically) rises in importance within its existing point allocation.

**Fintech / high-trust transactional** (`playbooks/fintech.md`): Accessibility and UX/usability both
rise toward ~15; Motion drops toward ~2-3; Content Clarity rises (unambiguous numeric/status
communication is safety-relevant here, not just polish).

## Non-negotiable floor
Accessibility and Performance point allocations may be reweighted **upward** for a given surface type
but never meaningfully downward below their default — and regardless of numeric score, BLOCKER-severity
failures in either dimension override the total per `quality-gate.md`. Context sensitivity changes how
much a dimension is *rewarded*; it never changes whether a floor requirement must be *met*.

## How to use this rubric
1. Identify the surface type via the matching playbook.
2. Apply that playbook's reweighting (or the default table if no strong signal exists).
3. Score each dimension using the relevant agent role's checklist (`.agents/agents/`).
4. Check `quality-gate.md`'s blocker list before finalizing — a BLOCKER caps the tier regardless of the
   numeric total.
5. Report both the numeric score and the tier name (`quality-gate.md` §Tiers) — a number alone is
   less actionable than "72/100 — Strong, blocked from Premium by two HIGH-severity mobile issues."
