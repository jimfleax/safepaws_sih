# Filters Pattern
**What it is**: Controls letting a user narrow a large data/content set to a relevant subset.
**When to use visible/persistent filters**: Frequent, expert use (dashboards, admin tools, e-commerce
catalogs with meaningful facets). **When to use a collapsed/modal filter panel**: Mobile, or occasional-
use contexts where persistent filter chrome would cost more screen space than it earns.
**Layout anatomy**: Filter controls (checkboxes, ranges, toggles) + active-filter summary/chips + clear-
all action + live or explicit "apply" result update.
**UX rationale**: Show active filters as removable chips near the results, not only inside a collapsed
panel — users frequently forget what filters are currently applied.
**Visual variants**: Sidebar persistent filters (desktop, data-heavy contexts); top-bar filter chips;
collapsed drawer/modal (mobile default).
**Responsive strategy**: Sidebar filters typically collapse into a full-screen modal/drawer on mobile
rather than a cramped inline panel.
**Accessibility requirements**: Filter state changes announce result-count updates via `aria-live`;
all filter controls keyboard-operable with clear labels (not icon-only without text alternative).
**Performance considerations**: Debounce live-updating filters (e.g., range sliders) to avoid firing a
query on every pixel of drag.
**Anti-patterns**: Filters that silently reset on navigation when users expect persistence; showing zero
results with no guidance on which filter caused it.
**Implementation notes**: Always show a result count and a clear path to reset when a filter combination
returns zero results.
