# Variable Fonts & Responsive Type

## Variable fonts
A single font file exposing continuous axes (weight, width, optical size, sometimes slant/grade) instead
of discrete static weights. Advantages directly relevant to this system's principles:
- Enables true optical sizing (`type-hierarchy-and-scale.md`) — display and body text can use
  axis-adjusted cuts of the same family rather than naively scaled static weights.
- Enables smoother, more precise responsive type scaling (interpolating weight/width slightly across
  breakpoints rather than swapping between a fixed set of static weights).
- Reduces total font-file payload versus loading many static weight files — a real, direct performance
  benefit (`principles/13-performance.md`).

## Responsive type scaling
- Prefer `clamp()`-style fluid scaling (a minimum, a viewport-relative preferred value, and a maximum)
  over fixed per-breakpoint jumps for continuous, smoother scaling — but always verify the actual
  rendered result at real breakpoints, since fluid formulas can produce awkward intermediate sizes if
  the min/preferred/max values aren't chosen carefully.
- Display type should NOT scale by the same fluid formula as body text — they need independent scaling
  curves since their optical requirements differ (`type-hierarchy-and-scale.md`).
- Line-length (`line-length-and-rhythm.md`) should be re-verified at each major breakpoint, not assumed
  to hold from a desktop-only check.

## Failure mode
A single global fluid-type formula applied to every text tier — produces technically responsive but
optically inconsistent results, especially at viewport extremes (very narrow phones, very wide desktop
monitors).

## Performance note
Subset font files to the actual character set/language needed where feasible, and use `font-display:
swap` (or equivalent) to avoid invisible-text-during-load performance/UX issues.
