# Design Brief Template

Every meaningful UI task should produce a filled version of this brief before implementation begins
(`.agents/workflows/design-first.md`). This is the artifact `agents/design-director.md` produces and
every review role checks work against.

---

## Product
[One or two sentences. Specific — what does this actually do, concretely, not a category label.]

## Users
[Who, specifically. If there are genuinely distinct personas, name them — this affects segmentation
decisions per `principles/15-conversion.md` and `research/awwwards/01-stripe.md`.]

## Goal
[What should happen as a result of this page/flow existing. Business or user outcome, stated plainly.]

## Primary action
[The single most important thing a user should do here. If there are multiple candidates, pick one —
per `principles/01-hierarchy.md`, multiple equal-weight primary actions is itself a design failure.]

## Brand personality
[3-5 words maximum, each traceable to something real about this product per `principles/08-brand.md`'s
one-sentence test — not generic adjectives like "modern" or "innovative" with no specific referent.]

## Visual direction
[Which `tokens/themes/*.tokens.json` direction fits, or a stated custom blend, with the one-sentence
reason. Reference `research/synthesis/12-design-tensions.md` tension #1 (minimalism vs. richness)
explicitly if this decision was non-obvious.]

## Reference families
[1-3 entries from `retrieval/reference-index.json`, each cited for a specific PRINCIPLE
(`retrieval/chain.md`) — never "make it look like X." Format: "[Reference] demonstrates [principle] —
relevant here because [context reason]."]

## Typography direction
[Reference family choice and role differentiation per `typography/font-pairing.md` — which face for
display, which for body/UI, and why.]

## Color direction
[Role-based, not a hex list — background/surface/text/accent roles and the reasoning per
`principles/06-color.md`. State whether this is an achromatic-chrome approach (content carries color)
or a disciplined-accent approach.]

## Layout strategy
[Grid/container approach, section rhythm logic (`principles/03-spacing.md`, `04-grid.md`) — does
container width vary by content type per Stripe's two-track pattern, or is one consistent width
appropriate here?]

## Interaction strategy
[What's genuinely interactive and why (`principles/09-interaction.md`) — not an exhaustive list of
every hover state, but the meaningful interaction decisions.]

## Motion strategy
[Which of the five legitimate purposes (`motion/principles.md`) motion serves here, if any. It is
acceptable and often correct for this section to say "minimal to no decorative motion" for task-focused
surfaces.]

## Responsive strategy
[Is this mobile-primary or desktop-primary? What changes structurally (not just proportionally) at
mobile width, per `principles/24-mobile-web.md`?]

## Accessibility strategy
[Any accessibility considerations beyond the universal baseline (`principles/12-accessibility.md`,
always assumed) that are specifically elevated for this product — e.g., health/education contexts per
`playbooks/health.md`/`education.md`.]

## Performance strategy
[Any heavy techniques planned (3D, video, large data) and their stated fallback, per
`principles/13-performance.md`.]

## Anti-patterns to avoid
[Specific to this project — pull from `anti-generic-ai/generic-ui-signatures.md` the ones most tempting
for this specific surface type, not the full generic list.]

## Quality target
[Tier from `scoring/quality-gate.md` (Strong/Premium/Exceptional) and the `scoring-schema.json` context
profile that applies — e.g., "Premium tier, `ecommerce` weighting profile."]

---

*Once filled, this brief is the baseline every review role (`agents/visual-art-director.md`,
`ux-reviewer.md`, `motion-director.md`, `frontend-quality.md`, `design-system-architect.md`) checks
implementation against, and `.agents/rules/final-quality-gate.md` question O ("has the page been
refined after critique") is measured relative to this stated intent, not a generic standard.*
