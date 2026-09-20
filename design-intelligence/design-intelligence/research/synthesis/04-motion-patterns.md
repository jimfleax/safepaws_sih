# Motion Patterns Synthesis

Cross-reference of every motion observation across the 25 dossiers. Feeds `design-intelligence/motion/`.

## Confirmed, named implementation patterns (not inferred)
- **Scroll-state-drives-timeline coupling** (Zajno 09, primary source): GSAP ScrollTrigger/Observer
  driving a separate timeline-authoring tool (Theatre.js) in sync, with per-section lazy render to
  control cost. This is the most concretely documented motion architecture in the set.
- **Physics-driven secondary motion** (Bruno Simon 07, primary source): motion computed as a reaction
  to a primary action (antenna reacting to opposite of car acceleration, then easing back) rather than
  pre-authored — used specifically to sell physical believability on a single, frequently-repeated
  interaction.
- **Staged reveal sequencing** (Framer 02, Iventions 21, inferred/moderate): a deliberate pacing
  device — a visible "working" state before a result appears (Framer's agent), or a guided-walkthrough
  pace across a whole scroll sequence (Iventions) — used to make the motion communicate process, not
  just transition.

## The recurring purpose categories
1. **Feedback** — confirming an action happened (least represented in this set's evidence, since none
   of the 25 references are primarily transactional UI; see `motion/feedback.md` for general principle).
2. **Continuity** — Zajno's single-page lazy-render pattern exists specifically to make a long page
   feel like one continuous authored sequence.
3. **Physical believability** — Bruno Simon's antenna, generally: motion that makes an interactive
   object feel like it has real mass/inertia.
4. **Process communication** — Framer's "thinking" sequence, Iventions' guided pacing: motion that
   shows work happening, not just before/after states.
5. **Brand atmosphere** — Stripe's gradient wave: motion as mood-setting, explicitly not competing with
   legibility (paired with a documented static fallback).

## What is notably absent from this set's strong evidence
None of the 25 dossiers provide primary-source-confirmed evidence of motion used purely for hierarchy
signaling (drawing attention to the single most important element via animation alone) or of
sophisticated reduced-motion fallback strategy beyond Stripe's single static-fallback-image data point.
This is flagged as a real gap: `motion/reduced-motion.md` is therefore built primarily from general
accessibility principle rather than from this reference set's own evidence, and states that plainly.

## Anti-pattern evidence
Minh Pham's own self-description (19) — "fancy motion that makes my design more interesting than it
actually is" — is the single most directly useful anti-pattern data point in the entire research set:
a practitioner's own naming of the exact failure mode this system's `anti-generic-ai/motion-failures.md`
exists to prevent.
