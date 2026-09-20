# How To Update This System

## Updating principles
A principle in `principles/` should only change when: (a) new reference evidence contradicts or
refines it, (b) a real project's outcome (success or failure) provides new evidence, or (c) a
contradiction with another principle file is discovered (see the self-critique discipline in
`FINAL_AUDIT.md`). Every edit should update the "why" reasoning, not just the "what" — a principle
file with no traceable reasoning degrades into an arbitrary rule over time, which is exactly the
failure mode this whole system exists to prevent (`principles/00-master-principles.md`).

## Updating design tokens
Add new `tokens/themes/*.tokens.json` files for genuinely new aesthetic directions rather than
overloading an existing theme with conflicting values. If a structural token category needs to change
(e.g., adding a new spacing tier), update the relevant `tokens/*.md` structure file first, then
propagate to all theme JSON files so they stay consistent with each other.

## Replacing an outdated reference
1. Mark the old dossier's Metadata block with a `Superseded by: [new reference #]` line — do not delete
   it (audit trail preservation, `MASTER_PLAN.md` §N).
2. Follow `ADD_NEW_REFERENCE.md`'s full process for the replacement.
3. Update `research/RESEARCH_LOG.md`'s "Rejected / Replaced" section with the reason.
4. Update `index.md`, `comparison.json`, and `retrieval/reference-index.json`.

## Adding a new category (beyond the original 9)
Only add a new top-level category if 3+ candidate references genuinely don't fit any existing category
well — check `research/awwwards/index.md`'s existing distribution first; most new references fit an
existing category via the "categorize by most useful lesson" rule already established.

## Improving scoring
Changes to `scoring/scoring-rubric.md`'s default weights or `scoring-schema.json`'s context profiles
should be justified by real review outcomes (a weighting that consistently produces scores misaligned
with actual quality judgment) — not adjusted casually. Document the specific case that motivated the
change.

## Adding new workflows/rules/agents
New files in `.agents/` should follow the existing files' structure (agents: role/responsibilities/
never-do/output-format; rules: always/never with citations; workflows: numbered steps with citations).
Cross-check `MASTER_PLAN.md` §F-H to confirm the new file's scope doesn't duplicate an existing one —
prefer extending an existing file over creating a near-duplicate.

## Versioning
Log all non-trivial changes in `CHANGELOG.md` at the project root with a date and one-line reason —
this system's own credibility depends on being able to show its reasoning evolved deliberately, not
arbitrarily.
