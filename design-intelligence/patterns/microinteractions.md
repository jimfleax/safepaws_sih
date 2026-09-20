# Microinteractions Pattern
**What it is**: Small, often single-purpose interactive moments (a like button's animation, a toggle's
feedback, a copy-to-clipboard confirmation) — individually minor, collectively a major craft signal.
**When to use**: Frequent, repeated actions where a small feedback moment reinforces "this worked"
without requiring a full notification (`notifications.md`).
**When to keep it purely functional with no flourish**: High-frequency, high-volume actions (e.g.,
checking many boxes in a data table) where added animation on each action becomes friction at scale.
**Layout anatomy**: N/A — scoped to a single small component's state change.
**UX rationale**: Resn's standalone generative "toy" pieces (`research/awwwards/06-resn.md` §7) show
microinteractions can be a genre of craft demonstration in their own right, separate from their
functional-feedback role — appropriate for creative/portfolio contexts specifically.
**Visual variants**: Icon morph on state change (e.g., outline heart → filled heart); subtle scale/
bounce on click; inline success checkmark replacing a button label briefly.
**Responsive strategy**: Ensure the feedback is visible without requiring hover (touch has no hover
state) — tap-triggered feedback should be immediate and visible on the element itself.
**Accessibility requirements**: The state change microinteraction reinforces must also be conveyed
non-visually (an `aria-pressed` state change, not just a visual animation).
**Performance considerations**: Keep microinteractions short (typically under 300ms) and cheap
(compositor-friendly properties) since they often fire at high frequency.
**Anti-patterns**: A microinteraction so elaborate it becomes disruptive at the frequency the action
actually occurs (e.g., a 2-second animation on every checkbox click in a 50-row table).
**Implementation notes**: Test the interaction at realistic frequency, not just once in isolation.
