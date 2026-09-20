# Storytelling / Scroll-Narrative Pattern
**What it is**: A long-form, sequential scroll experience where content reveals in an authored order to
build a narrative arc — distinct from a standard article by its use of pacing/motion as part of the
narrative itself.
**When to use**: Content with a genuine sequential arc (a process explanation, a brand story, a
data-journalism piece) where order matters to comprehension.
**When NOT to use**: Reference content users need to scan/jump around in — forcing a linear scroll
narrative onto lookup-style content actively frustrates that use case.
**Layout anatomy**: Sequential full-viewport or near-full-viewport sections, each revealing on scroll,
often with a persistent minimal progress indicator.
**UX rationale**: Zajno's published architecture (`research/awwwards/09-zajno.md` §3/§8) — single
continuous route with per-section lazy render — is the concrete technical pattern that makes this format
performant; pacing choices should serve comprehension of the arc, not just spectacle.
**Visual variants**: Sticky-pinned sections with content crossfade; parallax-layered scroll; scroll-
driven 3D/animation state changes (Lusion, Zajno).
**Responsive strategy**: Long scroll-narratives frequently need genuinely simplified mobile versions
(fewer pinned/sticky effects, more standard scroll) rather than a direct port of the desktop choreography.
**Accessibility requirements**: Provide a way to skip/jump the narrative for users who want the content
without the choreography; respect `prefers-reduced-motion` with a static-reveal fallback.
**Performance considerations**: Per-section lazy mount/render is essential at this content length —
see `motion/scroll.md`.
**Anti-patterns**: Scroll-jacking that fights the user's own scroll input rather than augmenting it;
narrative pacing so slow it reads as forced padding.
**Implementation notes**: Storyboard the narrative arc in plain content form first — if it doesn't work
as an outline, motion won't fix it.
