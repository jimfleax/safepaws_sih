# Workflow: /visual-review

The specific browser-inspection procedure referenced by `/premium-ui`, `/design-review`, and
`.agents/rules/final-quality-gate.md` question N. This defines what "the rendered result has been
inspected" actually means in this system.

## Procedure (use real tooling wherever the current environment provides it)
1. **Open the application** in an actual browser/preview environment — not source code review alone.
2. **Capture or inspect a desktop viewport** — check overall composition, hierarchy, and whether the
   design brief's intent is visible in the actual render.
3. **Capture or inspect a mobile viewport** — verify mobile was genuinely redesigned, not merely
   reflowed (`design-intelligence/principles/24-mobile-web.md`).
4. **Inspect each major section individually** — check for misalignment, overflow, and whether
   `design-intelligence/anti-generic-ai/generic-ui-signatures.md`'s checklist items are present.
5. **Check interactions** — click/tap through primary flows; verify every interactive element responds
   visibly (`design-intelligence/principles/09-interaction.md`).
6. **Check console/errors** — look for runtime errors, failed network requests, and accessibility
   warnings the tooling surfaces.
7. **Check for horizontal overflow** at multiple viewport widths, not just the primary breakpoints.
8. **Review visual hierarchy** — confirm one loudest element per view, as intended by the design brief.
9. **Iterate** — feed findings back into the relevant agent role and rebuild/re-inspect.

## Honesty requirement
If the current environment does not provide real browser/preview tooling for this specific project,
state that plainly rather than claiming this procedure was run. A described-but-unexecuted inspection
must never be reported as having happened — this is a direct instruction from this system's research
discipline (`design-intelligence/MASTER_PLAN.md` §1) applied to implementation, not just research.
