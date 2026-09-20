# Visual Hierarchy

## What it is
The designed order in which a viewer's attention moves through a composition — what's noticed first,
second, and last — controlled through scale, contrast, position, and whitespace, not left to chance.

## When to use strong hierarchy
Any page with more than one thing competing for attention (nearly all of them). Especially critical
for: landing pages with one primary action, dashboards with one most-urgent metric, editorial content
with one lede.

## When to flatten hierarchy deliberately
Reference/documentation content where the user is scanning for a specific known item, not being guided
through a narrative — heavy hierarchy there fights the user's actual task (search, not story).

## Implementation guidance
- Establish exactly one "loudest" element per screen/section — see Stripe's reserved-display-type
  principle (`research/awwwards/01-stripe.md` §13): a device used everywhere stops signaling anything.
- Use scale, weight, and color contrast together, not scale alone — a huge, low-contrast headline can
  lose to a small, high-contrast CTA.
- Whitespace around an element is itself a hierarchy signal, often stronger than size.
- Hierarchy must survive at every breakpoint — a mobile reflow that makes everything the same width
  frequently flattens hierarchy that existed on desktop; re-verify explicitly, don't assume.

## Failure mode
Multiple "loudest" elements (three different CTAs all in brand-accent color, all bold, all large)
cancel each other out — the viewer's eye has nowhere obvious to land, which reads as generic even when
individual elements are well-crafted. See `anti-generic-ai/hero-failures.md`.

## When NOT to force it
Don't manufacture artificial hierarchy where content is genuinely equal-weight (e.g., a grid of peer
products in a catalog) — forcing one arbitrary "hero" item there misleads the user about what's actually
being offered.
