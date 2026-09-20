# Playbook: Mobile-First Web

Full principle detail: `principles/24-mobile-web.md`.
**UX priorities**: this playbook applies when mobile is the PRIMARY (not secondary/responsive-afterthought)
context — design decisions should originate from the mobile constraint, then be enhanced for larger
viewports, not the reverse.
**Visual priorities**: content priority decided for a short, interruption-prone, one-handed session
first; desktop enhancement adds, rather than the mobile version subtracting from desktop.
**Information architecture**: primary actions within one-handed thumb reach; avoid deep nested
navigation that costs multiple taps to traverse on a small screen.
**Typical patterns**: bottom tab-bar navigation for primary sections (a strong mobile-first alternative
to a top-nav-plus-hamburger default, `patterns/navigation.md`); progressive disclosure over dense
single-screen layouts.
**Appropriate motion**: performance-conscious by default — mobile-first assumes variable connection
quality and battery constraints as the baseline case, not the edge case (`principles/13-performance.md`).
**Accessibility considerations**: touch target minimums (`principles/24-mobile-web.md`) are non-
negotiable baseline, not a nice-to-have; never disable pinch-zoom.
**Responsive priorities**: "enhance for desktop" (add secondary information, larger canvas use) rather
than "compress for mobile" is the guiding direction for this playbook specifically.
**Common mistakes**: designing desktop-first and treating mobile-first as a rebrand of the same
priorities; deep navigation hierarchies requiring many taps.
**Quality checklist**: Were mobile constraints the actual starting point, or was this designed desktop-
first and reverse-engineered? Primary actions thumb-reachable? Performance budget realistic for variable
mobile connections?
