# Breakpoint & Container Width Tokens

## Breakpoint structure (illustrative defaults)
```
bp-sm: 480px   (large phone)
bp-md: 768px   (tablet)
bp-lg: 1024px  (small desktop/laptop)
bp-xl: 1280px  (desktop)
bp-2xl: 1536px (large desktop)
```
## Container width structure
```
container-reading: 65ch        (optimal line-length text column, principles/05-typography.md)
container-narrow: 640px        (forms, focused content)
container-standard: 1024px     (general page content)
container-wide: 1280px         (dashboards, wide layouts)
container-full: 100%           (full-bleed sections, hero media)
```
## Usage guidance
Not every section on a page needs the same container width — Stripe's two-track rhythm
(`research/awwwards/01-stripe.md` §3) deliberately narrows for prose and widens for demonstration
blocks within the same page. Define container width per content type, not once globally.

## Failure mode
A single global max-width applied uniformly, forcing either overly-wide body text (violating
`typography/line-length-and-rhythm.md`) or unnecessarily-narrow full-bleed media.

## Theme variation
Dashboard/enterprise themes typically favor `container-wide`/`full` as the default (maximize
information density); editorial/luxury themes favor `container-reading`/`narrow` more often
(prioritize the reading experience over screen-filling density).
