# Design Systems

## What it is
The infrastructure layer — tokens, primitives, reusable components, documented states and rules — that
lets a consistent design be reproduced and maintained by a real team over time, rather than existing
only as one polished mockup.

## The core tension this file resolves (source brief §22)
Avoid both extremes: **(A) a giant monolith** where every possible variant lives in one component,
gaining flexibility at the cost of unusable complexity, and **(B) meaningless fragmentation** where
near-identical components proliferate with no shared foundation, gaining short-term speed at the cost of
long-term inconsistency and duplicated bugs.

## Implementation guidance
- Start from tokens (see `tokens/`), not from components — every component should reference token
  values (spacing, color, type scale), never hardcode a one-off value that happens to look right.
- A component's variants should be genuinely necessary (different real use cases), not speculative
  ("might need this someday") — speculative flexibility is how monoliths form.
- Document component states explicitly (default, hover, focus, active, disabled, loading, error, empty)
  — an unstated state is where inconsistency creeps in fastest.
- Theming (dark/light, brand variants) should be a token-substitution problem, not a component-rewrite
  problem — see `tokens/` for the structure that makes this possible.
- Composition over configuration: prefer combining small, well-defined primitives over adding another
  boolean prop to an existing component for a one-off need.

## Failure mode
Studio/reference sites in this research set that deliberately avoid a fixed template (Resn, A24) are
appropriate for *bespoke creative portfolios specifically* — copying that "no fixed system" approach
into a product that needs many people building many features consistently over years is a direct
recipe for the fragmentation extreme above. Match the system's rigidity to the actual team/product
scale, not to an unrelated reference's context.

## When some duplication is acceptable
Early-stage products with genuinely unstable requirements can tolerate temporary duplication over
premature abstraction — a design system built too early, around guessed-at future needs, often needs
more rework than starting simple and systematizing once real patterns repeat 3+ times.
