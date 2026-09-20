# Dashboard Failures

Full pattern/principle detail in `patterns/dashboards.md` and `principles/18-dashboard-design.md`.

## The specific signatures
1. **Marketing-site visual patterns applied to a monitoring tool** — large decorative imagery, heavy
   motion, oversized typography on a surface meant for efficient, repeated, expert use.
2. **Every metric given equal visual weight** — no hierarchy of urgency (`principles/01-hierarchy.md`),
   so the one number that needs attention doesn't stand out from twenty that don't.
3. **Numbers with no context** — a bare current value with no trend, comparison, or target, leaving the
   user to determine "is this good?" unaided.
4. **Generic, empty "dashboard boxes"** — uniformly-sized metric cards regardless of actual metric
   importance or data richness, a specific instance of `card-overuse.md`.
5. **No designed empty/loading/error state** — a blank or frozen chart when data hasn't loaded or a
   query fails.

## The repair
1. Rank metrics by actual urgency/importance and size/position them accordingly, not uniformly.
2. Add trend/comparison context to bare numbers wherever the underlying data supports it.
3. Design the empty, loading, and error states explicitly, not as an afterthought.
4. Reserve richer visual/motion treatment for executive-summary views specifically, not working/
   monitoring views used repeatedly by experts.

## When more visual richness is appropriate
Presentation-mode or executive-summary dashboard views, viewed occasionally by a less expert audience,
can reasonably prioritize visual impact over density — see `principles/18-dashboard-design.md`.
