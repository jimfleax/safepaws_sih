# Parallax Motion
**Trigger**: scroll position, mapped to differential movement rates across layered elements.
**State change**: static layered composition → depth-simulating differential offset as the user scrolls.
**Motion**: background/foreground layers move at different rates relative to scroll, simulating depth.
**Duration range**: N/A — directly, continuously linked to scroll position, not timer-based.
**Easing idea**: should feel 1:1 responsive to scroll input; added lag/easing on top of parallax offset
typically feels disconnected rather than premium.
**Purpose**: storytelling/atmosphere (adds a sense of depth/place to a scroll narrative,
`patterns/storytelling.md`) — this system's research did not find primary-source-confirmed evidence of
parallax specifically among the 25 references' most-praised techniques; treat this file as informed by
general principle more than by this system's own reference set, flagged honestly.
**Accessibility**: parallax is a well-documented trigger for motion sickness/vestibular discomfort in a
meaningful share of users — always disable it under `prefers-reduced-motion`, with a static-composition
fallback, not an optional nicety.
**Performance**: parallax implemented via scroll-event-driven JS re-renders (rather than compositor-
friendly CSS transforms) is a common, real cause of scroll jank — implement via transform on layers,
throttled to `requestAnimationFrame`.
**When NOT to use**: content-dense or task-focused pages, and any context with a meaningful population
of motion-sensitive users without a clear opt-out — the discomfort risk is well-documented enough that
this pattern should be used narrowly and always with a real fallback, not liberally.
