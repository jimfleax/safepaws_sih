# Color Tokens

## Structure — roles first, values second (principles/06-color.md)
```
color-background        (page/app base)
color-surface           (elevated containers: cards, modals)
color-surface-alt       (secondary elevation/contrast)
color-text-primary
color-text-secondary
color-text-disabled
color-border
color-border-strong
color-accent-primary     (the ONE brand action color — reserved, per Zajno's accent discipline)
color-accent-secondary   (optional, used even more sparingly)
color-success / color-warning / color-danger / color-info   (semantic — independent of brand accent)
```
## Usage guidance
- Assign roles before values — define what `color-accent-primary` is *for* (primary CTAs, active
  states) before picking its hex value, so the role stays consistent even if the value changes with
  rebranding.
- Semantic colors (success/warning/danger) must remain distinguishable from the brand accent — never let
  a brand's signature color double as an error color if it creates ambiguity (`principles/06-color.md`).
- Dark theme is a fully separate value-set for every role above, not an automatic inversion — contrast
  ratios must be independently verified for dark-mode values.

## Theme variation
- Achromatic-chrome themes (Cowboy/Lusion pattern, `research/awwwards/13-cowboy.md`,
  `08-lusion.md`): `color-accent-primary` reduced to near-zero saturation; content (photography, 3D)
  carries color instead.
- Playful/creative themes: more permitted saturated accent variety, still disciplined to 1-2 primary
  accents per view (`principles/06-color.md`'s restraint rule still applies).
- Enterprise/technical themes: narrower, cooler, lower-saturation palette overall.

See `themes/*.tokens.json` for worked values per direction.
