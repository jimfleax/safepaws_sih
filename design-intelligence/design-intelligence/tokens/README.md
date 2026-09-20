# Design Tokens

Conceptual token structures — not a single forced aesthetic. Tokens define *categories* of value
(spacing scale, type scale, color roles, radius, shadow, z-index, motion, breakpoints, container
widths); the actual values differ per theme (`themes/`) so this framework supports minimal, editorial,
luxury, playful, technical, brutalist, creative, and enterprise directions, plus dark/light, without
changing the underlying structure. See `principles/25-design-systems.md` for why structure-first,
value-second is the right order.

## Files
- `spacing.md`, `typography.md`, `color.md`, `radius-and-shadow.md`, `motion.md`,
  `breakpoints-and-containers.md`, `z-index.md` — the structural definition of each token category.
- `themes/*.tokens.json` — worked example value-sets per aesthetic direction, showing the same
  structure filled in differently.

## How an agent should use this
1. Read the structural files to know what categories of token this system expects.
2. Read `templates/design-brief.md`'s output (or ask the design-director agent) to determine which
   aesthetic direction fits the current product.
3. Start from the nearest `themes/*.tokens.json` file and adjust values for the specific brand — never
   invent an entirely new token category ad hoc; extend the existing structure.
