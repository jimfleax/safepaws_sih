# Navigation Pattern

**What it is**: The primary wayfinding system — top nav, sidebar, or equivalent — through which users
understand what exists and move between sections.

**When to use a broad, role-based nav**: Heterogeneous audiences with genuinely different needs
(Framer's Designers/Agencies/Marketers/Engineers structure, `research/awwwards/02-framer.md` §2).

**When to use a sparse nav**: Small, curated content/business models (Obys's two-item Work/About,
`research/awwwards/05-obys-agency.md` §2) — sparseness should match genuine business-model simplicity,
not be imposed on content that actually needs more structure.

**Layout anatomy**: Logo/home anchor + primary items + utility items (search, account, CTA) + (mobile)
collapsed/hamburger equivalent. Depth beyond one level of flyout/mega-menu should be rare and clearly
signaled.

**UX rationale**: Navigation is used repeatedly by returning visitors far more than by first-time ones on
most products — optimize for predictability and learnability over first-glance novelty, per
`principles/16-information-architecture.md`.

**Visual variants**: Flat top bar; role/persona-tabbed top bar; sparse two-item minimal; multi-mode
navigation for genuinely distinct content types (Mat Voyce, `research/awwwards/11-mat-voyce.md` §2).

**Responsive strategy**: Don't default to hiding everything behind a hamburger without considering a
bottom tab bar or prioritized-visible-items pattern for primary mobile actions; treat this as an active
design decision (Stripe still A/B-tests it at scale, `research/awwwards/01-stripe.md` §9), not a solved
default.

**Accessibility requirements**: Full keyboard operability including flyouts/mega-menus; visible focus
states; `aria-current` for the active section; skip-to-content link before the nav for keyboard/screen-
reader users.

**Performance considerations**: Mega-menus should lazy-load their content, not render a large hidden DOM
tree on every page load.

**Anti-patterns**: Navigation depth that mirrors internal org structure rather than user mental models;
identical generic nav copied from a competitor without checking it matches this product's actual content.

**Implementation notes**: Card-sort actual content before finalizing nav labels/grouping — see
`principles/16-information-architecture.md`.
