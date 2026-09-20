# Master Principles

The one file every other principle file inherits from. If an agent reads nothing else in this system,
read this.

## The central question
Before any visual/UX decision, answer: **"What would a truly excellent senior design team do here,
given this specific product, user, and goal?"** — not "what generic UI can I generate quickly?" This
system exists to make that question answerable, not just inspirational. See `MASTER_PLAN.md` for the
full architecture and `research/synthesis/` for the evidence this file compresses.

## The five non-negotiables (never traded away for visual impact)
1. **Accessibility** — a floor, not a design preference. See `12-accessibility.md`.
2. **Semantic structure** — real HTML/ARIA meaning, not div soup styled to look structured.
3. **Responsive behavior that is designed, not merely reflowed** — see `11-responsive.md`.
4. **Performance** — see `13-performance.md`; spectacle must declare its performance budget.
5. **Maintainability** — a design that can't be consistently reproduced by a real engineering team
   isn't a finished design, it's a demo.

## The core method: every decision traces to a reason
Every one of the 25 researched references that this system's confidence tiers rate HIGH or above (see
`research/RESEARCH_LOG.md`) has a **traceable, one-sentence reason** for its distinguishing choice —
Stripe's reserved italic headline exists to mark the one sentence that matters; Cowboy's achromatic
chrome exists so the product's own color carries interest. If a design decision in a project this
system guides cannot be stated as a one-sentence "this exists because—", treat that as a signal the
decision is decoration, not design — see `anti-generic-ai/generic-ui-signatures.md`.

## Context beats rules
This system explicitly refuses universal instructions like "always use large typography" or "always add
motion." Every principle file below states **when to use** and **when NOT to use**, and
`research/synthesis/12-design-tensions.md` names eleven real tensions where reasonable excellent design
goes in different directions depending on context. Read that file before applying any single principle
rigidly.

## The chain that prevents copying
`retrieval/chain.md` documents the required chain: REFERENCE → OBSERVATION → PRINCIPLE → CONTEXT →
PATTERN → IMPLEMENTATION → REVIEW. Skipping from REFERENCE straight to IMPLEMENTATION (i.e., copying a
reference site's specific composition) is a process failure this system is built to prevent — see
`prompts/` templates, which all route through this chain, and `templates/design-brief.md`.

## What "excellent" is scored against
`scoring/scoring-rubric.md` — 12 dimensions, context-reweighted per surface type (a dashboard is not
scored like a portfolio). `scoring/quality-gate.md` defines blockers that override a high numeric score.

## How the rest of this library is organized
- `01`–`07`: composition-level (hierarchy, composition, spacing, grid, typography, color, imagery)
- `08`–`10`: expression-level (brand, interaction, motion)
- `11`–`13`: engineering floor (responsive, accessibility, performance)
- `14`–`17`: content/product-level (content design, conversion, IA, forms)
- `18`–`25`: surface-specific (dashboard, data viz, ecommerce, editorial, creative-web, SaaS, mobile,
  design systems)
- `26`: the specific, operational anti-generic-AI checklist

Each file is usable standalone but references this file's non-negotiables and the tensions file by
default.
