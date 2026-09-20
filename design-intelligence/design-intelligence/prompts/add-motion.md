# Prompt Template: Add Motion to an Existing Interface

Use when: the specific task is adding animation/transitions to already-built, currently-static UI.

**Route to**: `agents/motion-director.md` directly, then `/motion-review` to verify the result.

**Before adding anything**: for each proposed motion, complete TRIGGER → MOTION → PURPOSE → USER VALUE
(`motion/principles.md`). If PURPOSE can't honestly be anything but "looks nice," don't add it — this
prompt exists specifically to prevent motion added because it's now easy to add, not because it's
needed (`anti-generic-ai/motion-failures.md`).

**Sequence**: identify state changes that currently have no feedback (`motion/feedback.md`) first —
these are the highest-value additions. Then entrance/exit for content that appears/disappears
(`motion/entrance.md`, `exit.md`). Then, only if a real narrative/continuity need exists, scroll
choreography (`motion/scroll.md`, `patterns/storytelling.md`).

**Always pair with**: token-defined timing/easing (`tokens/motion.md`), not per-instance tuning, and a
genuine `prefers-reduced-motion` fallback (`motion/reduced-motion.md`) for every addition.
