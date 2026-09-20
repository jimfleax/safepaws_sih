# Navigation Patterns Synthesis

## Confirmed patterns, with the variable that explains the difference
- **Sparse (2-item) navigation** — Obys (05). Variable: boutique business model, small number of
  qualified clients, no need to optimize for broad self-service discovery.
- **Role-based navigation** (not feature-based) — Framer (02). Variable: genuinely heterogeneous
  audience (designers, marketers, engineers, agencies) who each need a different entry point.
- **Audience-segmented in-page sections** (not top nav, but functionally similar) — Stripe (01).
  Variable: distinct buyer personas who need different proof, within one continuous page rather than
  separate destinations.
- **Spatial navigation replacing conventional menus** — Bruno Simon (07). Variable: an audience that
  specifically values novelty/play over fast task completion (a creative-developer portfolio, evaluated
  by design peers), explicitly and self-consciously accepted as a narrow-audience tradeoff by its own
  creator.
- **Multi-mode navigation for genuinely different content types within one entity** — Mat Voyce (11).
  Variable: content that is structurally different (loose experiments vs. formal case studies) rather
  than just topically different.

## The governing question this synthesis produces
Every well-evidenced navigation choice in this set answers a specific question about the audience
(how many distinct personas, how much they value speed vs. exploration, how much content breadth exists)
rather than defaulting to a fixed pattern. `principles/16-information-architecture.md` and
`patterns/navigation.md` are built around making an agent answer that question explicitly before
picking a nav pattern, rather than defaulting to a generic top-nav-plus-hamburger.
