# Easing

## What easing communicates
Easing curves imply *why* something is moving, not just how fast — a critical, often-overlooked
distinction from duration alone.

## Default curve guidance
- **Ease-out** (fast start, slow finish): the default for anything entering/appearing — feels responsive
  because it starts moving immediately, then settles gently into place.
- **Ease-in** (slow start, fast finish): appropriate for anything exiting/disappearing — accelerating
  away reads as natural departure.
- **Ease-in-out**: for anything that moves between two visible on-screen states (not entering/exiting
  the viewport) — e.g., a toggle sliding between two positions.
- **Spring/physics-based easing** (slight overshoot and settle): implies materiality/weight — appropriate
  when an object should feel physically real (Bruno Simon's antenna reaction,
  `research/awwwards/07-bruno-simon.md` §8) — use sparingly, on elements the user directly manipulates,
  not on routine UI chrome.
- **Linear**: rarely correct for UI motion — feels mechanical/robotic; reserve for genuinely mechanical
  content (a literal loading progress bar tracking real elapsed time).

## Failure mode
Using a single default easing curve (often whatever a framework ships with) for every kind of motion
regardless of whether it's entering, exiting, or moving between states — a subtle but real "untuned"
signal, distinguishing default-feeling motion from considered motion.

## Implementation note
Define 3-4 named easing tokens (e.g., `ease-standard`, `ease-entrance`, `ease-exit`, `ease-spring`) in
`tokens/motion.md` rather than picking curves ad hoc per component.
