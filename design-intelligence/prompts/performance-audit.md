# Prompt Template: Performance Audit

Use when: the specific task is a dedicated performance review.

**Route to**: `/performance-review` directly.

**Method**: check image optimization, animated-property choice (compositor-friendly vs. layout-
triggering), any heavy technique's stated fallback (3D/WebGL, autoplay video, large scroll-linked
timelines per `patterns/3d.md`/`immersive.md`), layout-shift prevention, and list/table virtualization
for large datasets.

**Honesty requirement**: if the current environment provides real measurement tooling, use it and
report actual numbers; if it only allows structural/code-level review, say so explicitly rather than
presenting an inferred assessment as measured fact — this system's research discipline
(`MASTER_PLAN.md` §1) about not fabricating verification applies equally to implementation review.

**Output**: severity-tagged findings with the specific asset/technique and the specific fix
(e.g., "hero video: no fallback for `prefers-reduced-motion` or slow connections — add a static poster
frame," not "improve performance").
