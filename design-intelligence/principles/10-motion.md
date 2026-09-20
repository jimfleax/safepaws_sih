# Motion Design (Principles Summary)

## What it is
Animation and transition used to communicate — feedback, continuity, hierarchy, or storytelling — never
merely to look "cool." Full detail in `design-intelligence/motion/`; this file is the compressed,
cross-referenced summary every other principle file points to.

## The governing rule (source brief §12, reinforced by every strong reference in this research)
Every motion pattern must be explainable as: TRIGGER → MOTION → PURPOSE → USER VALUE. If the PURPOSE
column would just say "looks nice," the motion needs a different justification or should be cut. See
`motion/principles.md` for the full framework and `research/synthesis/04-motion-patterns.md` for the
evidence this compresses.

## The five legitimate purposes (from this research + general principle)
1. **Feedback** — confirm an action was received.
2. **Continuity** — help the user maintain a mental model across a state change (Zajno's scroll+3D
   coupling, `research/awwwards/09-zajno.md` §8).
3. **Physical believability** — Bruno Simon's antenna physics (`research/awwwards/07-bruno-simon.md`
   §8), used on a frequently-repeated interaction specifically.
4. **Process communication** — Framer's "agent thinking" reveal (`research/awwwards/02-framer.md` §8).
5. **Brand atmosphere** — Stripe's gradient wave, always paired with a documented fallback
   (`research/awwwards/01-stripe.md` §8).

## Implementation guidance
- Default duration range: 150–300ms for UI feedback (button states, toggles), 300–600ms for larger
  transitions (page/section changes), longer only for deliberate storytelling moments with a stated
  reason.
- Always respect `prefers-reduced-motion` — provide a real reduced/no-motion alternative, not just a
  faster version of the same animation. See `motion/reduced-motion.md`.
- Never let decorative motion block or delay a user's ability to act — a "cool" entrance animation that
  delays interactivity is a usability regression dressed as polish.

## Failure mode
Motion added because a library/framework makes it easy, with no stated purpose — the single most common
generic-AI motion signature (see `anti-generic-ai/motion-failures.md`), and directly named by a
practitioner in this research about his own risk of doing it (Minh Pham, `research/awwwards/19-minh-
pham.md` §8).

## When to use no motion at all
Content-dense, task-focused, or accessibility-sensitive contexts where any animation is a net cost —
static is a valid, sometimes-correct answer, not a default failure.
