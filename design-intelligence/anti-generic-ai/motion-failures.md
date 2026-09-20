# Motion Failures

Full detail in `motion/motion-anti-patterns.md`; this file is the anti-generic-AI-specific summary.

## The specific signature
Animation applied because a framework/library makes it trivial (a default fade-in on scroll for every
element, a default hover-scale on every card) with no TRIGGER→MOTION→PURPOSE→USER VALUE justification
(`motion/principles.md`).

## The tell
If removing every animation from a page would not change whether the page communicates its content
correctly — only whether it feels "modern" — the motion was decorative, not functional. Named directly
by a practitioner in this system's own research about his own risk of doing this
(`research/awwwards/19-minh-pham.md` §8: "fancy motion that makes my design more interesting than it
actually is").

## The repair
1. List every animation on the page and try to complete the TRIGGER → MOTION → PURPOSE → USER VALUE chain for each — if PURPOSE
   would honestly read "looks nice," cut it.
2. Check for untuned default easing/timing (`motion/timing.md`, `motion/easing.md`) — a specific,
   checkable "unfinished" signal even in animations that do have a real purpose.
3. Verify `prefers-reduced-motion` is respected with a genuine fallback, not just a technically-present
   media query (`motion/reduced-motion.md`).

## When rich, frequent motion IS correct
Creative/portfolio contexts demonstrating technical range to a craft-literate audience
(`principles/22-creative-web.md`) legitimately use more motion — the failure is applying that same
volume/style to a task-focused product where the audience pays the time cost repeatedly.
