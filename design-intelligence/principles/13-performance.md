# Performance

## What it is
How fast and resource-efficiently an interface loads, responds, and runs — a design constraint as real
as any visual one, per `MASTER_PLAN.md`'s engineering philosophy.

## Core rule
Every performance-costly design decision (large hero video/animation, heavy 3D/WebGL, large images)
needs a stated performance budget and a fallback for when that budget can't be met — see Stripe's
documented static-fallback image for its animated hero (`research/awwwards/01-stripe.md` §8/§12) as the
concrete pattern.

## Implementation guidance
- Optimize images (correct format, responsive sizes, lazy-load below the fold) as a default, not an
  afterthought.
- Heavy techniques (WebGL/3D, per Iventions and Active Theory,
  `research/awwwards/21-iventions.md`, `22-active-theory.md`) need an explicit lower-power/mobile
  fallback path, not just "it usually works."
- Perceived performance (skeleton states, progressive content reveal, optimistic UI updates) often
  matters more to user experience than raw load-time numbers — design loading states deliberately, don't
  leave a blank screen as the default "loading" state.
- Avoid layout shift: reserve space for images/embeds/ads before they load; don't let content jump as
  assets arrive.

## Failure mode
Spectacle shipped with no fallback and no measurement — see tension #4 in
`research/synthesis/12-design-tensions.md` (performance vs. visual spectacle): the resolving question is
never "should this exist" but "what happens to the user on a constrained device/connection when it
doesn't load well," and that question must have a real answer.

## When to spend more of the performance budget
A creative-showcase or portfolio context, evaluated by an audience largely on capable devices/
connections, can reasonably spend more of its performance budget on spectacle than a transactional
mobile checkout flow can — but "reasonably spend more" still requires an explicit fallback, not an
assumption that the audience will always have ideal conditions.
