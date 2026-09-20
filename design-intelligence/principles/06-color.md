# Color Systems

## What it is
Not a palette of pretty colors — a functional system where every color has a defined role (background,
text, accent, semantic state) applied consistently, explaining *why* the system works, not just what
hex values it uses (per the source brief's explicit instruction).

## The two disciplined patterns this research actually found
1. **Achromatic chrome, content carries color** — Cowboy, Lusion (`research/awwwards/13-cowboy.md`,
   `08-lusion.md`): UI system reduced to black/white/gray specifically because product photography or
   real-time 3D content is the actual color-bearing element. Use when content is inherently colorful.
2. **Gradient/color as atmosphere, never as chrome** — Stripe (`research/awwwards/01-stripe.md` §5):
   large, soft, low-saturation color used only in backgrounds/illustration, never on interactive
   elements, text, or borders where it would compete with legibility or state-signaling.

## Implementation guidance
- Define roles first (primary text, secondary text, background, surface, border, accent, success,
  warning, danger) then assign values — never the reverse.
- Reserve saturated/high-chroma color for things that need to stand out precisely because they're rare —
  Zajno's one-or-two-accent discipline even inside a "bold, unconventional" brand identity
  (`research/awwwards/09-zajno.md` §5) is the clearest evidence for this.
- Semantic color (success green, error red) must remain legible and distinguishable independent of
  brand palette — never let a brand's signature accent color double as an error state color if it
  creates ambiguity.
- Dark mode is a second, fully-considered system, not an inverted filter — text/border contrast ratios
  must be re-verified independently in dark mode, not assumed to transfer.

## Failure mode
Color applied for decoration without a stated role — see `anti-generic-ai/bad-gradient-patterns.md` for
the specific, common generic-AI signature (meaningless purple/blue mesh gradients with no connection to
brand or content) this principle exists to prevent.

## When NOT to restrain color
Data visualization, where color is functionally load-bearing (distinguishing categories/series) rather
than decorative — see `19-data-visualization.md`; a restrained 2-color system there actively harms the
interface's actual job.
