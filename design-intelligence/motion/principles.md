# Motion Principles

Every motion pattern in this system, and everything a coding agent animates, must be describable in
this exact structure — no exceptions:

**TRIGGER** — what causes it (load, click, hover, scroll, data change)
**STATE CHANGE** — what is actually different before vs. after
**MOTION** — the specific transform/technique used
**DURATION RANGE** — see `timing.md`
**EASING IDEA** — see `easing.md`
**PURPOSE** — one of: feedback, continuity, hierarchy, storytelling, physical believability, process
communication (see `research/synthesis/04-motion-patterns.md` for the evidence behind this list)
**ACCESSIBILITY** — reduced-motion behavior, and whether the state change is also conveyed non-visually
**PERFORMANCE** — which properties animate (prefer transform/opacity) and any fallback for constrained
devices
**WHEN NOT TO USE** — the specific context where this exact motion would cost more than it delivers

If PURPOSE would honestly read "looks cool," don't ship it — see
`design-intelligence/principles/26-ai-ui-anti-patterns.md` and `motion-anti-patterns.md`.

## The single most important finding from this system's research
Minh Pham's own self-description of his practice (`research/awwwards/19-minh-pham.md` §8) — using
"fancy motion that makes my design more interesting than it actually is" — is the clearest, most
direct evidence in this entire system that motion-as-compensation is a real, self-recognized risk even
among award-winning practitioners. Before adding motion, ask: would this design still hold up with the
motion removed? If not, fix the design, don't paper over it with animation.

## Motion budget
Treat motion like a budget, not an unlimited resource: a page with five different, well-tuned,
purposeful motion patterns is stronger than a page with fifteen indiscriminate ones. Every additional
motion pattern raises both cognitive load and performance cost — it must earn its place individually.
