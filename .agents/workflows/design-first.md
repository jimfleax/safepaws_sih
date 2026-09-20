# Workflow: /design-first

For starting any new UI work with design direction established before implementation — the
"understand → design" front half of `/premium-ui`, usable standalone when a design brief is needed
without immediately building.

## Steps
1. **Understand product context** — product, user, goal, usage context.
2. **Adopt `agents/design-director.md`** and select a design direction from
   `design-intelligence/tokens/themes/` or state a custom blend with reasoning.
3. **Select principles** from `design-intelligence/principles/` relevant to this surface type, resolving
   any applicable tension explicitly via `design-intelligence/research/synthesis/12-design-tensions.md`.
4. **Retrieve references** via `design-intelligence/retrieval/reference-index.json` for the relevant
   category/tags — cited for the principle they demonstrate only.
5. **Adopt `agents/design-system-architect.md`** briefly to confirm which tokens apply or need
   extending.
6. **Produce the design brief** (`design-intelligence/templates/design-brief.md`) as the deliverable of
   this workflow.

## Output
A complete design brief ready to hand to implementation (`/premium-ui`'s BUILD step) or to a human
developer — this workflow's job ends at the brief, not at working code.
