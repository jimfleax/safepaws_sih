# Motion Timing

## Default duration ranges (starting points, not laws)
- **Micro-feedback** (button press, toggle, checkbox): 100–150ms
- **Small UI transitions** (dropdown open, tooltip, tab switch): 150–250ms
- **Medium transitions** (modal open/close, panel slide, card expand): 250–400ms
- **Large/page-level transitions** (route change, full-section reveal): 400–600ms
- **Deliberate storytelling moments** (scroll-narrative beats, hero entrance): 600ms–2s, used sparingly
  and only with a stated narrative reason (`patterns/storytelling.md`)

## The core rule
Duration should scale with the *distance/size* of the change, not be a single fixed value site-wide — a
small icon toggle and a full-screen panel sliding in should not use identical durations; the larger
element benefits from marginally longer duration to avoid feeling like it's teleporting, while the small
one should stay snappy.

## Failure modes
- **Too slow, applied to frequent actions**: an 800ms animation on a button someone clicks repeatedly
  becomes friction, not polish, within a few uses.
- **Too fast for a large state change**: a full-page transition in under 150ms can read as a glitch
  rather than an intentional transition.
- **Inconsistent timing for the same interaction type across a product**: if a modal opens in 200ms on
  one screen and 500ms on another with no reason, it reads as unpolished even if each individually
  seems fine.

## Implementation note
Define duration as tokens (`tokens/motion.md`), not per-component magic numbers, so timing stays
consistent and centrally adjustable.
