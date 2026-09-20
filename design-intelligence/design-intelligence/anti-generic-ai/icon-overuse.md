# Icon Overuse

## The specific signature
Every feature/benefit statement paired with a generic icon-in-a-circle, regardless of whether the icon
actually clarifies anything beyond what the adjacent text already says — a specific, extremely common
generic-AI/SaaS-template signature (`common-ai-layouts.md`'s "three-column features" section, almost
always icon-led).

## Why it happens
Icon libraries make it trivial to attach *some* icon to *any* concept, but a generic checkmark/gear/
rocket icon rarely adds real information — it adds visual rhythm at the cost of looking templated when
every section uses the same device.

## The test
Would removing the icon and keeping only the text lose any actual information? If not, the icon is
decorative filler, not a communication device.

## The repair
1. Remove icons that don't add information beyond the adjacent label — replace the "icon + label"
   pattern with plain, well-typeset text where the icon isn't earning its place.
2. Where icons ARE useful (status indicators, functional affordances like a search or close icon), keep
   them, but ensure they're paired with text/labels for accessibility (`principles/12-accessibility.md`)
   — icon-only controls need an accessible name.
3. If a feature section genuinely benefits from visual anchors, consider real product screenshots or
   illustrations tied to the specific feature (Framer's embedded demos,
   `research/awwwards/02-framer.md`) rather than a generic icon set.

## When icon-led presentation is correct
Dense navigational/functional contexts (a toolbar, a settings list) where icons provide fast visual
scanning for frequent, repeated use — the failure is applying the same device to one-time marketing
content where scanning speed isn't the actual constraint.
