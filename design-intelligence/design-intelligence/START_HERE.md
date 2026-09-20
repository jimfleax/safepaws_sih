# Start Here

This system has ~250 files. You should almost never need to read most of them for a given task. This
file exists specifically because `SELF_CRITIQUE.md` identified navigation as the system's weakest
usability point — use this as the entry router.

## "I need to..."

**...build a new UI surface from scratch** → `.agents/workflows/premium-ui.md` (full pipeline) or
`.agents/workflows/design-first.md` (brief only). Pick the matching `prompts/*.md` template for a head
start on what to fill in.

**...start a whole new project** → `.agents/workflows/new-project.md`.

**...review/critique existing work** → `.agents/workflows/design-review.md`, or the focused variants:
`visual-review.md`, `responsive-review.md`, `accessibility-review.md`, `motion-review.md`,
`performance-review.md`.

**...fix a UI that feels generic/AI-generated** → `.agents/workflows/upgrade-generic-ui.md`, backed by
`anti-generic-ai/generic-ui-signatures.md`.

**...know what matters most for a specific product type** (dashboard, e-commerce, fintech, portfolio,
etc.) → `playbooks/` — one file per surface/industry type, each with its own quality checklist.

**...know a specific design rule** (how much whitespace, what line-length, when to use motion) →
`principles/` (27 files, numbered, one topic each) or the deep-dive libraries: `patterns/` (named UI
patterns), `motion/`, `typography/`, `tokens/`.

**...know why two good pieces of advice seem to conflict** →
`research/synthesis/12-design-tensions.md` — eleven named tensions, each with a resolving question.

**...cite a real reference for a design decision** → `retrieval/reference-index.json` (tagged,
queryable) or `research/awwwards/index.md` (human-readable comparison matrix). Always cite the
*principle*, never copy the composition — see `retrieval/chain.md`.

**...score a finished UI** → `scoring/scoring-rubric.md` + `scoring-schema.json` (context-weighted per
surface type) + `scoring/quality-gate.md` (blocker severity and tiers).

**...understand the whole system's architecture** → `MASTER_PLAN.md` (root).

**...install this into Antigravity** → `INSTALL.md` (root).

**...add a new reference or update a principle** → `maintenance/ADD_NEW_REFERENCE.md`,
`UPDATE_SYSTEM.md`.

## What you should almost never need to do
Read all 25 research dossiers, or all 27 principle files, or the whole pattern library, in one sitting.
The routing above exists so a task pulls in the 3-6 specific files it actually needs. If you find
yourself reading broadly "just in case," that's a signal to check this file again for a more targeted
path first.

## Known gaps (see `SELF_CRITIQUE.md` and `FINAL_AUDIT.md` for full detail)
- No internationalization/RTL/non-Latin-script guidance exists anywhere in this system.
- Dashboard, forms, and data-visualization principles lean on general product-design knowledge more
  than on this system's own 25-site research, which skews toward creative/marketing sites.
- No live-rendered visual inspection was possible during research — see `MASTER_PLAN.md` §1.
