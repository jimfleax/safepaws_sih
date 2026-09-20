# Data Visualization

## What it is
Representing quantitative/qualitative data visually so patterns are found faster and more accurately
than reading raw numbers — a discipline with real correctness constraints, not just aesthetic ones.

## Core rules
- Chart type must match the actual comparison being made: trends over time → line; categorical
  comparison → bar; part-to-whole → stacked bar or (sparingly) pie; correlation → scatter. Using the
  wrong chart type for the underlying question actively misleads, regardless of visual polish.
- Never truncate a bar-chart's y-axis to exaggerate difference — this is a correctness/trust issue, not
  a style preference.
- Color in data viz is functional (see `06-color.md`'s exception for this domain): use a
  consistent, distinguishable palette per category, and always provide a non-color-dependent way to
  distinguish series (pattern, label, position) for colorblind accessibility.
- Label directly where possible rather than relying solely on a separate legend the eye must jump to
  repeatedly.

## Implementation guidance
- Default to the simplest chart that correctly answers the question — 3D pie charts, unnecessary
  gradients on bars, and decorative chart-junk reduce comprehension speed and are a specific, common
  generic-AI/dashboard failure signature.
- Provide the underlying data in an accessible, non-visual form (a data table alternative) for screen
  reader users — a chart alone is not accessible.
- Interactive charts (hover for detail, filter/zoom) should keep a readable static state as the default,
  not require interaction to understand the basic pattern.

## Failure mode
Visually impressive but functionally misleading or hard-to-parse charts — chart type chosen for visual
interest rather than for correctly representing the data relationship.

## When restraint should yield to density
Dashboards for expert/analyst audiences reviewing many metrics at once legitimately need denser,
smaller, more numerous charts than a public-facing summary — but correctness rules above never relax.
