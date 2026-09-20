# Motion (Component-Level) Pattern
Full principle detail in `principles/10-motion.md` and the full `design-intelligence/motion/` library;
this file is the fast-reference component anatomy.
**What it is**: Transitions and animations applied to specific UI components (not page-level
choreography, covered in `storytelling.md`).
**When to use**: Any state change benefits from motion that clarifies *what changed and why* — element
appears/disappears, order changes, value updates.
**When NOT to use**: A stable, unchanging state needs no motion; adding it "for interest" with no state
change to communicate is decoration.
**Layout anatomy**: N/A — this is a temporal, not spatial, pattern. See `motion/timing.md` and
`motion/easing.md` for the technical parameters.
**UX rationale**: TRIGGER → MOTION → PURPOSE → USER VALUE (`principles/10-motion.md`) — every component
motion should be nameable in this chain.
**Visual variants**: Fade (lowest-commitment, safest default); slide (implies spatial relationship,
e.g., a panel coming from off-screen); scale (implies origin, e.g., a modal growing from its trigger
button); physics-based easing (implies weight/materiality, per Bruno Simon's antenna,
`research/awwwards/07-bruno-simon.md` §8).
**Responsive strategy**: Simplify or shorten component motion on mobile where battery/performance budget
is tighter; never make motion the only way to discover a state change (also indicate via layout/text).
**Accessibility requirements**: `prefers-reduced-motion` disables or substantially reduces non-essential
component motion; motion never delays the user's ability to interact with the result.
**Performance considerations**: Animate compositor-friendly properties (transform, opacity) over
layout-triggering properties (width, top/left) wherever possible.
**Anti-patterns**: Default library easing/timing left untuned; motion applied to every possible state
change indiscriminately, producing visual noise.
**Implementation notes**: See `motion/motion-anti-patterns.md` for the specific failure catalogue.
