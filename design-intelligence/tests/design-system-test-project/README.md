# Test Project: AI Research Workspace

Per source brief §40: this proves the system produces something usable, rather than assuming files
existing is sufficient. Fictional product, run through the actual chain
(`retrieval/chain.md`) and scored against `scoring/scoring-rubric.md` — not just described in the
abstract.

## The fictional product
**"Meridian"** — an AI research workspace for knowledge workers who need to synthesize many sources
(papers, documents, web content) into a coherent output, with an AI assistant that can search, read,
and draft alongside the user rather than just answering isolated questions.

## What's in this folder
- `00-design-brief.md` — the filled `templates/design-brief.md` for Meridian overall.
- `01-landing-page.md` — surface-specific application (`playbooks/saas-landing.md` + `ai-product.md`).
- `02-dashboard.md` — surface-specific application (`playbooks/dashboard.md` + `ai-product.md`).
- `03-pricing.md` — surface-specific application (`patterns/pricing.md`).
- `04-settings.md` — surface-specific application (`patterns/settings.md`).
- `05-mobile-navigation.md` — surface-specific application (`principles/24-mobile-web.md`).
- `06-scored-review.md` — each surface run through `scoring/scoring-rubric.md` with the appropriate
  `scoring-schema.json` context profile, honestly scored (including real gaps, not a perfect result) to
  demonstrate the scoring system actually discriminates rather than rubber-stamping.

## What this test demonstrates vs. what it doesn't
This demonstrates the system producing **design direction and specification** — the actual chain from
product understanding through to a scored, reviewable brief per surface. It does not include built,
running code for Meridian; per `MASTER_PLAN.md`'s scope decisions, this system's deliverable is design
intelligence (briefs, principles, review), and downstream implementation is a separate, later step a
coding agent would take using this output. The scoring in `06-scored-review.md` is therefore scoring
the *specification's* adherence to this system's principles, not a rendered UI (consistent with this
system's own honesty discipline about not claiming visual inspection that didn't happen).
