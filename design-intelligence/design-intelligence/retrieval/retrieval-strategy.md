# Retrieval Strategy

How an agent should answer questions like "give me strong hero references for a luxury fashion site"
or "what sites demonstrate restrained motion?"

## The lightweight retrieval mechanism

`reference-index.json` (25 entries, tagged and categorized) is the queryable index. No embedding/vector
search is implemented — at 25 entries, straightforward tag/category/keyword matching is sufficient and
avoids the maintenance burden and opacity of a vector index for a dataset this size (documented
decision, revisit in `maintenance/UPDATE_SYSTEM.md` if the reference count grows substantially, e.g.
past ~100 entries, where keyword matching would start missing relevant results).

## How to answer a query

1. **Extract the real ask**: a surface type (hero, dashboard, checkout), a style/tag (luxury, minimal,
   experimental), or a principle (restrained motion, strong typography)?
2. **Match against `reference-index.json`'s `tags`, `category`, and `lesson` fields** — for "restrained
   motion," search tags for `restraint`/`minimal` and cross-check dossier §8 (Motion Design) content in
   `research/awwwards/`.
3. **Filter by confidence** (`research/RESEARCH_LOG.md`'s tiers, mirrored in each entry's `confidence`
   field) when the answer needs to cite evidence-backed claims — prefer VERY HIGH/HIGH tier entries for
   confident claims; note the caveat explicitly when only MODERATE-LOW/LOW entries match.
4. **Return the principle, not just the site name** — per `retrieval/chain.md`, a retrieval answer
   should always include the `lesson` field and point to the specific dossier section, not just "here
   are 3 sites that look like that."
5. **Cross-reference `patterns/` and `principles/`** for the generalized, non-site-specific version of
   whatever was retrieved — the site reference is evidence; the pattern/principle file is what should
   actually inform implementation.

## Example queries and how they resolve

- **"Strong hero references for a luxury fashion site"** → filter tags for `luxury`/`ecommerce`,
  cross-reference `playbooks/luxury-brand.md` and `patterns/hero.md`; surface Cowboy (13, HIGH
  confidence) and Aesop (14, MODERATE-LOW, general reputation) with their respective lessons about
  achromatic chrome and restraint-tied-to-brand-story.
- **"References for data-heavy dashboards"** → this research set is honestly thin here (`research/
  synthesis/08-responsive-patterns.md`-style gap, noted in `principles/18-dashboard-design.md`); answer
  by pointing to general principle files instead of forcing a weak site match, stating the evidence gap
  plainly rather than stretching an unrelated reference to fit.
- **"Sites demonstrating restrained motion"** → By-Kin (10, MODERATE) and Minh Pham's self-critique
  (19, HIGH) via `research/synthesis/04-motion-patterns.md`.
- **"Strong editorial typography"** → By-Kin (10), Mat Voyce (11), Pentagram (12, MODERATE-LOW).
- **"Patterns useful for AI SaaS"** → `playbooks/ai-product.md` directly, cross-referenced with Framer
  (02, HIGH) for the embedded-demo pattern.

## When retrieval should return "insufficient reference evidence" rather than a forced match
If no reference in the set genuinely demonstrates the requested principle, say so and route to the
relevant general `principles/` or `playbooks/` file instead of stretching an unrelated reference to
fit — a forced, weak citation is worse than an honest "this system's research doesn't directly cover
that; here's the general principle instead."
