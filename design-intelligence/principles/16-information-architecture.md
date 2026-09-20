# Information Architecture

## What it is
How content and functionality are grouped, labeled, and connected — the structural layer beneath
navigation and layout, evaluated by whether a real user can predict where something lives.

## The governing finding (research/synthesis/07-navigation-patterns.md)
Every well-evidenced IA choice in this research answers a specific question about the audience:
Obys's sparse nav answers "how many distinct client personas" (few); Framer's role-based nav answers the
same question (many, heterogeneous); Mat Voyce's three-mode structure answers "how many genuinely
different content types" (three). IA copied from a competitor without asking these questions of the
actual product is a common source of "technically organized but wrong for this product" structure.

## Implementation guidance
- Card-sort or at minimum explicitly list the actual content/features before designing navigation —
  don't let nav structure be invented before content inventory exists.
- Label navigation items with words the actual user would search for, not internal company/product
  jargon.
- Depth vs. breadth tradeoff: prefer breadth (more top-level items, shallower) for infrequent/
  exploratory use; prefer depth (fewer top-level items, more nesting) for frequent/task-driven use where
  users will learn the structure.
- Every major grouping decision should be explainable in one sentence tied to real user behavior or
  business structure — see Pentagram's structure-mirrors-organization principle
  (`research/awwwards/12-pentagram.md` §13).

## Failure mode
IA that mirrors internal company org-chart structure rather than user mental models (a common,
real-world failure independent of visual design quality) — or IA copied wholesale from a reference site
whose audience/content genuinely differs from the current product's.

## When flat beats hierarchical
Small content sets (under ~7 top-level items) usually don't need nested navigation at all — added
hierarchy there is overhead, not organization.
