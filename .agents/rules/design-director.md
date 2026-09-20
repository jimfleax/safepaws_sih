# Rule: Design Direction

Applies to: any task creating or substantially changing a UI.

Before writing implementation code, establish (even briefly, inline, if the task is small): what is
this product/page for, who uses it, and what design family fits (`design-intelligence/tokens/themes/`
or a stated custom blend)? Do not skip straight from a request to a generic template.

**Always**:
- Ask "what would a truly excellent senior design team do here" (`design-intelligence/principles/
  00-master-principles.md`), not "what's a fast, safe default."
- Cite the specific product/audience reason behind any distinguishing visual or interaction decision —
  if you can't state one in a sentence, treat that as a signal to reconsider the decision
  (`design-intelligence/anti-generic-ai/generic-ui-signatures.md`'s one-sentence test).
- Check `design-intelligence/research/synthesis/12-design-tensions.md` before applying any rule that has
  a named tension (minimalism/richness, motion volume, density/whitespace, etc.) — state which side
  applies and why, using the tension's resolving question.

**Never**:
- Copy a reference site's literal composition. Extract the principle it demonstrates
  (`design-intelligence/retrieval/chain.md`); build an original implementation for this product.
- Default to the generic SaaS/marketing template sequence (`design-intelligence/anti-generic-ai/
  common-ai-layouts.md`) without checking whether this specific product's audience/goal actually needs
  it in that order.

Full role detail: `.agents/agents/design-director.md`.
