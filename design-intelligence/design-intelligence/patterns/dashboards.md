# Dashboard Pattern
Full principle detail in `principles/18-dashboard-design.md`; this file is the component-level anatomy.
**What it is**: A monitoring/action surface summarizing many data points for repeated, efficient use.
**When to use a card-based summary layout**: Mixed-type metrics (numbers, trends, lists) needing
independent visual treatment. **When to use a dense table**: Homogeneous, comparable data rows.
**Layout anatomy**: Persistent nav/filter context + primary "what needs attention now" zone (top-left/
top of viewport, typically) + secondary reference metrics + drill-down paths to detail views.
**UX rationale**: Urgency-appropriate visual hierarchy (`principles/01-hierarchy.md`) matters more here
than anywhere else — a dashboard where every metric has equal visual weight fails its core job.
**Visual variants**: Card-grid summary (KPIs at a glance); dense table (operational monitoring);
combined summary-plus-detail split view.
**Responsive strategy**: Mobile dashboard views often need genuine re-prioritization (show 3 critical
metrics, not a compressed version of 15 desktop widgets) rather than reflow alone.
**Accessibility requirements**: All status/urgency signals available in text, not color alone; live-
updating data uses `aria-live="polite"` (not "assertive," which interrupts) unless genuinely critical.
**Performance considerations**: Paginate/virtualize large tables; debounce real-time data updates to
avoid layout thrash.
**Anti-patterns**: Marketing-site visual patterns (heavy motion, oversized decorative typography) applied
to a tool meant for repeated efficient use (`anti-generic-ai/dashboard-failures.md`).
**Implementation notes**: Design the empty/no-data-yet and error/failed-query states explicitly.
