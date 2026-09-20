# Workflow: /responsive-review

Focused review of responsive/mobile behavior specifically, using `agents/ux-reviewer.md` and
`agents/frontend-quality.md`'s responsive-specific checks.

## Steps
1. Inspect the rendered result at multiple real breakpoints (`design-intelligence/tokens/breakpoints-
   and-containers.md`), not just the primary mobile/tablet/desktop set.
2. Verify information priority was reconsidered for mobile, not merely reflowed
   (`design-intelligence/principles/24-mobile-web.md`).
3. Check touch target sizing (44×44px minimum) and spacing at mobile widths.
4. Verify `user-scalable=no` is absent — a hard, non-negotiable check
   (`.agents/rules/responsive-quality.md`).
5. Test with realistic content volume (long names, many list items, empty states) at each breakpoint,
   not just demo content.
6. Verify any hover-dependent functionality has a working touch equivalent.
7. Check for horizontal overflow at each tested width.

## Output
Severity-tagged findings (`design-intelligence/scoring/quality-gate.md`) specific to responsive
behavior, feeding into `/design-review`'s aggregate report if run as part of a full review.
