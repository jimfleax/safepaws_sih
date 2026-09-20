# Playbook: Dashboard / Analytics Surface

Full principle/pattern detail: `principles/18-dashboard-design.md`, `patterns/dashboards.md`.
**UX priorities**: information hierarchy by urgency, density appropriate to user expertise/frequency —
weighted above visual spectacle per `scoring/scoring-rubric.md`'s context reweighting.
**Visual priorities**: restrained, functional color reserved for status/semantic meaning
(`principles/19-data-visualization.md`); minimal decorative chrome.
**Information architecture**: persistent, predictable filter/nav placement across all views (efficiency
compounds for repeat use); drill-down paths from summary to detail.
**Typical patterns**: card-grid KPI summary, dense tables for homogeneous data, chart components with
correct type-per-question (`principles/19-data-visualization.md`).
**Appropriate motion**: minimal — functional feedback for live-updating data only; no decorative
entrance choreography on a surface used dozens of times daily.
**Accessibility considerations**: non-color-dependent status signaling; `aria-live="polite"` for
real-time updates; data tables as an accessible alternative to any chart-only view.
**Responsive priorities**: mobile dashboard views need genuine re-prioritization (3 critical metrics,
not compressed version of 15 desktop widgets).
**Common mistakes**: `anti-generic-ai/dashboard-failures.md` — equal-weight metrics, bare numbers with
no trend context, marketing-style visual richness, undesigned empty/error states.
**Quality checklist**: Urgency-ranked hierarchy present? Numbers contextualized (trend/target/
comparison)? Empty/loading/error states designed? Correct chart type per question asked?
