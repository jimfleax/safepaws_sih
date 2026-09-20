# Rule: Design System Quality

Applies to: any task creating or extending reusable components, tokens, or theming.

**Always**:
- Reference tokens (`design-intelligence/tokens/`) for spacing, color, type, radius, motion — never
  hardcode a one-off value that happens to look right in the moment.
- Design every interactive component's full state set explicitly: default, hover, focus, active,
  disabled, loading, error, empty (`design-intelligence/principles/25-design-systems.md`).
- Build composite components from smaller primitives rather than duplicating primitive-level styling.
- Check before adding a new component: does an existing primitive already cover this with a genuinely
  necessary new variant, or is this speculative flexibility for a hypothetical future need?

**Never**:
- Let a component accumulate unbounded variants/props for speculative future needs (the monolith
  failure mode).
- Let near-identical components multiply with no shared foundation once duplication is noticed (the
  fragmentation failure mode) — both extremes are named explicitly in
  `design-intelligence/principles/25-design-systems.md` as failures to avoid, not just risks to note.
- Adopt a bespoke, no-fixed-system approach appropriate to a one-off creative project
  (`design-intelligence/research/awwwards/06-resn.md`) for a product that needs long-term, multi-person
  consistency — match system rigidity to actual team/product scale.

Full role detail: `.agents/agents/design-system-architect.md`.
