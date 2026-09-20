# Elite Design Intelligence System — README

## What this is
A permanent, file-system-resident knowledge base and agent/rule/workflow layer for Antigravity that
changes what an AI coding agent reaches for by default when building UI. It combines 25 rigorously
researched Awwwards-recognized sites, synthesized design principles, a pattern library, a motion/
typography/token system, a dedicated anti-generic-AI detector, industry playbooks, context-sensitive
scoring, and six specialist review roles coordinated by an orchestrator.

## Why it exists
Generic AI-generated UI has a recognizable "look" because language models default to the statistical
average of their training distribution — competent, inoffensive, and undifferentiated. This system
exists to make "what would a truly excellent senior design team do here" an answerable, checkable
question instead of an aspiration, per `MASTER_PLAN.md`'s Prime Objective.

## Architecture
```
design-intelligence/
├── MASTER_PLAN.md (root)      Full architecture and decisions
├── START_HERE.md               Navigation router — read this first for any specific task
├── SELF_CRITIQUE.md            Honest self-review and the revisions it produced
├── research/                    25 Awwwards dossiers + cross-reference synthesis
├── principles/                  27 files: durable, context-conditioned design rules
├── patterns/                    24 named, reusable UI patterns
├── motion/, typography/, tokens/    Discipline-specific deep libraries
├── anti-generic-ai/           The specific failure-mode detector this system exists to prevent
├── playbooks/                  16 industry/page-type playbooks
├── scoring/                       Context-sensitive 12-dimension rubric + quality gate
├── retrieval/                     Reference index + retrieval strategy + the anti-copying chain
├── prompts/                       13 ready-to-use task templates
├── preferences/                Personal taste layer, bounded by the accessibility/usability floor
├── templates/                    The design-brief format everything routes toward
├── maintenance/                How the system grows without rot
└── tests/                          A worked example (design-system-test-project/) proving the chain
```
`.agents/` sits alongside `design-intelligence/` at the project root: `agents/` (7 role definitions),
`rules/` (10 always-on directives), `workflows/` (11 on-demand procedures).

## How the 25 references were selected
Nine categories (Premium Product/SaaS, Creative Studio/Agency, Experimental/Interactive, Editorial/
Typographic, E-commerce/Brand, Culture/Media, Portfolio/Personal, Immersive/3D, Simple/Minimal),
deliberately diversified so no two references teach the same lesson. See `MASTER_PLAN.md` §B and
`research/RESEARCH_LOG.md` for the full selection/verification log, including two documented
substitutions and one explicitly low-confidence entry kept transparent rather than hidden.

## How the 25 references were analyzed
Each follows an identical 20-section schema (Metadata through Evidence) with a strict evidentiary
discipline: every claim is labeled OBSERVED (from real fetched text or real retrieved images),
INFERRED (reasoned from evidence), or UNKNOWN — never invented. No live-rendered browser inspection was
possible in this research environment; this limitation is stated in every affected file rather than
concealed. Confidence tiers (VERY HIGH through LOW) are recorded per-reference in `research/
RESEARCH_LOG.md` so a reader always knows how much weight a given claim can bear.

## How Antigravity actually uses this system
Verified against current documentation: Antigravity's real extension points are **Rules**
(`.agents/rules/`, global `~/.gemini/GEMINI.md`) and **Workflows** (`.agents/workflows/`, invoked with
`/name`), with Agent Skills as the primary modern customization layer. There is no confirmed native
mechanism that auto-spawns separate named "agents." The `.agents/agents/` role files in this system are
real, complete, and used — but they're invoked *by* workflows and rules instructing the current session
to adopt a role, not as independently-running background processes. This is stated plainly rather than
overclaiming a capability Antigravity doesn't confirm having. See `INSTALL.md` for exact paths.

## How agents work
Seven roles: Design Director (direction-setting), Visual Art Director (composition/type/color),
UX Reviewer (critical usability review), Motion Director (purposeful animation), Frontend Quality
(engineering discipline), Design System Architect (tokens/components), and an Orchestrator that
sequences the other six into one pipeline with a final score. Each role has explicit "never do this"
boundaries so the six roles catch genuinely different failure classes instead of six generic passes.

## How workflows work
Eleven `/name`-invoked procedures. `/premium-ui` runs the full UNDERSTAND → DESIGN → BUILD → BROWSER
REVIEW → CRITIQUE → ITERATE → FINAL QUALITY GATE pipeline. `/upgrade-generic-ui` specifically
diagnoses and repairs generic-AI signatures. Each workflow cites the specific agent roles and rules it
invokes at each step.

## How scoring works
100 points across 12 dimensions, but the weights are **not fixed** — `scoring/scoring-schema.json`
defines nine context profiles (dashboard, portfolio, e-commerce, editorial, fintech, etc.) that
reweight the same 12 dimensions per surface type, because a fixed weighting is itself a generic-AI
failure mode. Accessibility and Performance are floors that can be reweighted upward but never
meaningfully downward, and BLOCKER-severity failures (`scoring/quality-gate.md`) override the numeric
total regardless of how well other dimensions score.

## How to add a reference
Follow `maintenance/ADD_NEW_REFERENCE.md`'s exact process: verify real recognition first, gather real
evidence, use the 20-section schema, assign an honest confidence tier, update the index/comparison/
retrieval files, and never delete a superseded dossier — mark it, for auditability.

## How to customize the taste profile
`preferences/taste-profile.md`, `preferred-styles.md`, and `avoid-styles.md` — populated over time from
real stated preferences or observed repeated choices, never pre-filled with assumptions. These bias
genuinely ambiguous decisions; they never override an accessibility/usability/performance floor.

## How to run the review workflow
`/design-review` for a full multi-role pass, or the focused variants (`visual-review`,
`accessibility-review`, `motion-review`, `performance-review`, `responsive-review`) for a targeted
check. Each produces severity-tagged findings against `scoring/quality-gate.md`'s BLOCKER/HIGH/MEDIUM/
LOW scale, never a vague pass/fail.

## How to update the system
`maintenance/UPDATE_SYSTEM.md` — principles change only with new evidence or a discovered
contradiction; tokens get new theme files rather than overloading existing ones; all non-trivial changes
are logged in the root `CHANGELOG.md`.

## Concrete example: "Build a landing page for my AI startup"
1. **UNDERSTAND PRODUCT** — what does it actually do, who's the audience, is the audience homogeneous.
2. **SELECT DESIGN FAMILY** — pick a `tokens/themes/` direction with a stated one-sentence reason.
3. **RETRIEVE REFERENCES** — query `retrieval/reference-index.json` for principle matches (e.g.,
   Framer for embedded-demo proof, Stripe for persona segmentation) — never for composition to copy.
4. **CREATE DESIGN BRIEF** — fill `templates/design-brief.md` completely.
5. **BUILD** — implement per the brief, using `tokens/`, `patterns/`, and the relevant `playbooks/`
   entry (`saas-landing.md` or `ai-product.md`).
6. **REVIEW** — run `/design-review`'s six-role pipeline.
7. **SCORE** — `scoring/scoring-rubric.md` with the `saas_landing` context profile.
8. **REPAIR** — fix BLOCKERs first, then HIGH, using `anti-generic-ai/quality-repair-strategies.md`.
9. **FINAL REVIEW** — `.agents/rules/final-quality-gate.md`'s full A-O checklist before calling it done.

See `design-intelligence/tests/design-system-test-project/` for this exact chain worked through in
full, on a fictional product, with an honestly non-uniform scored result.

## Honest limitations
See `SELF_CRITIQUE.md` and the root `FINAL_AUDIT.md` for the complete, honest accounting — including
evidence gaps, unverified Antigravity conventions, and the internationalization/RTL gap this system does
not yet address.
