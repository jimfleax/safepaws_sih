# Grid Systems

## What it is
The underlying (often invisible) structural logic — columns, gutters, alignment lines — that makes a
page's arrangement feel governed rather than arbitrary, even when the visible result looks loose or
asymmetric.

## When to use a strict, visible grid
Editorial/content-heavy layouts, data tables, e-commerce catalogs, dashboards — anywhere scanning speed
and predictability matter more than visual surprise.

## When to use a looser, asymmetric grid
Creative/portfolio/brand-expression contexts where controlled visual tension is the goal — critically,
"looser" does not mean "ungoverned": Lusion and Resn's bespoke per-project layouts
(`research/awwwards/08-lusion.md`, `06-resn.md`) are still internally disciplined, just not uniform
across the whole studio.

## Implementation guidance
- Establish a column count and gutter value appropriate to content density and breakpoint, and apply it
  consistently within a single page/section even when the visual result varies.
- Breaking the grid (an element intentionally overlapping a column boundary) is a legitimate, powerful
  device specifically because it's rare — used as the default, it stops being a device.
- Container widths should be content-aware: a long-form reading column needs a narrower max-width
  (optimal line length, see `05-typography.md`) than a full-bleed image/video block on the same page —
  see Stripe's two-track rhythm (`research/awwwards/01-stripe.md` §3).

## Failure mode
A grid so rigid every section looks like a repeated card template (see
`anti-generic-ai/card-overuse.md`), or a grid so loose nothing aligns to anything, reading as
unintentional rather than expressive.

## When NOT to use 12-column defaults uncritically
A rigid 12-column grid is a reasonable default, not a universal law — content with genuinely irregular
units (a 3D scene, a long-form narrative with varied media) may need a bespoke structural logic, as long
as that logic is applied consistently, not invented per-element.
