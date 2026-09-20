# Radius & Shadow Tokens

## Radius structure
```
radius-none: 0
radius-sm: 4px
radius-md: 8px
radius-lg: 16px
radius-full: 9999px (pills/avatars)
```
Assign per component-role (buttons/inputs typically `radius-sm`/`md`; cards/modals typically `md`/`lg`;
avatars/pills `full`) — not uniformly applied to everything, which is a specific, named generic-AI
signature (`anti-generic-ai/generic-ui-signatures.md`, "everything wrapped in a rounded card").

## Shadow structure
```
shadow-sm   (subtle separation: cards on a flat background)
shadow-md   (dropdown, popover)
shadow-lg   (modal, significant elevation)
shadow-none (flat/bordered themes may use border instead of shadow entirely)
```
## Theme variation
- Brutalist/technical themes: `radius-none` or minimal radius throughout, `shadow-none` (borders instead
  of shadows) — a deliberate, coherent aesthetic choice, not an oversight.
- Playful themes: larger radius values, more pronounced shadow use.
- Enterprise/minimal themes: small, consistent radius, restrained shadow (`shadow-sm`/`md` only,
  reserved for genuine elevation, not decoration).

## Failure mode
A single radius value applied to every element regardless of role or theme — see
`anti-generic-ai/generic-ui-signatures.md` signature #4 ("everything wrapped in a rounded card,
including things that aren't cards").
