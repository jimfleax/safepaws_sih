# Prompt Template: Create a Design System

Use when: establishing tokens/components/theming for a product from scratch or formalizing an
inconsistent existing one.

**Route to**: `agents/design-system-architect.md` directly, informed by `principles/25-design-
systems.md`.

**Fill in before starting**:
- Team/product scale (affects how much rigidity/formality is appropriate — see the monolith vs.
  fragmentation tension in `principles/25-design-systems.md`).
- Aesthetic direction — start from the nearest `tokens/themes/*.tokens.json` file rather than
  inventing token categories from scratch.

**Sequence**: tokens (`tokens/`) → primitives (button, input, surface) → composite components built
from primitives → documented states for every interactive component (default/hover/focus/active/
disabled/loading/error/empty) → theming verification (does swapping token values actually restyle
correctly with no component rewrites needed?).

**Check against**: don't add component flexibility for a hypothetical future need — wait for a real
third use case before generalizing.
