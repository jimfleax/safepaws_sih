# Rule: Visual Quality

Applies to: any task producing visual/UI output.

**Always**:
- Establish exactly one "loudest" element per view (`design-intelligence/principles/01-hierarchy.md`) —
  multiple competing high-emphasis elements cancel each other out.
- Use a real type scale (`design-intelligence/tokens/typography.md`) — no arbitrary per-instance font
  sizes. Reserve the largest/boldest treatment for one moment per view
  (`design-intelligence/typography/display-typography.md`).
- Derive spacing from content relationships (related items closer, unrelated items farther) using a
  defined scale (`design-intelligence/tokens/spacing.md`) — never uniform padding applied mechanically
  everywhere (`design-intelligence/anti-generic-ai/spacing-failures.md`).
- Run the full `design-intelligence/anti-generic-ai/generic-ui-signatures.md` checklist before calling
  visual work finished.

**Never**:
- Use a decorative gradient with no stated brand/content connection
  (`design-intelligence/anti-generic-ai/bad-gradient-patterns.md`).
- Wrap unrelated, non-comparable content in identical cards by default
  (`design-intelligence/anti-generic-ai/card-overuse.md`).
- Apply glassmorphism/blur with nothing meaningful behind it to blur
  (`design-intelligence/anti-generic-ai/glassmorphism-overuse.md`).

Full role detail: `.agents/agents/visual-art-director.md`.
