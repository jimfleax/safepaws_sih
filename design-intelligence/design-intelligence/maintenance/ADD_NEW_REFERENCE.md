# How To Add A New Reference

Follow the same discipline used to build the original 25 (`research/RESEARCH_LOG.md`) — a new
reference added without this discipline degrades the system's evidence quality over time.

## Steps
1. **Verify real recognition first.** Search for the site's Awwwards (or equivalent quality-signal)
   listing directly. Don't add a site because it looks impressive — confirm actual, checkable
   recognition or a clearly-stated alternative justification (as this system did for MODERATE-LOW
   confidence entries like Linear, `research/awwwards/03-linear.md`).
2. **Determine which category (A-I) it best serves**, and check whether that category already has 3
   (or 2, for Portfolio/Immersive) entries — if full, this new reference should either replace a weaker
   existing entry (see `UPDATE_SYSTEM.md`'s replacement process) or justify expanding the category.
3. **Gather real evidence** — fetch the live site if possible, search for independent coverage, use
   image search for visual grounding if available. Do not write dossier content from assumption or
   pre-existing familiarity alone without stating that's the basis.
4. **Write the dossier using the exact 20-section schema** from the original 25 (see any file in
   `research/awwwards/` as the template) — Metadata through Evidence, with explicit OBSERVED/INFERRED/
   UNKNOWN labeling throughout, per the discipline in `MASTER_PLAN.md` §1.
5. **Assign a confidence tier** (VERY HIGH/HIGH/MODERATE/MODERATE-LOW/LOW) per the criteria in
   `research/RESEARCH_LOG.md`'s tier definitions, and add the entry to that log.
6. **Update `research/awwwards/index.md`'s comparison matrix and `comparison.json`** — both must include
   the new entry with the same fields as existing ones.
7. **Update `retrieval/reference-index.json`** (currently a copy of `comparison.json` plus a retrieval-
   strategy note) with matching tags.
8. **Cross-check for new principles.** If the new reference demonstrates something not already captured
   in `principles/` or `patterns/`, add it there — following the existing files' "when to use / when
   NOT to use / failure mode" structure, not just a bare observation.
9. **Never delete a replaced reference's dossier file** — mark it deprecated (see `UPDATE_SYSTEM.md`)
   so the historical reasoning stays auditable, per this system's extensibility philosophy
   (`MASTER_PLAN.md` §N).

## Numbering
New references beyond 25 continue the sequence (26, 27, ...) unless explicitly replacing a specific
numbered entry (in which case, keep the number but update all metadata and mark the change in
`RESEARCH_LOG.md`).
