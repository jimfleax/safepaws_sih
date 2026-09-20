# Modals Pattern
**What it is**: A focused, blocking overlay interrupting the main flow for a task that needs full
attention (confirmation, focused data entry, critical information).
**When to use**: Genuinely blocking, short tasks where losing page context briefly is acceptable and the
interruption is warranted (destructive-action confirmation, a short focused form).
**When NOT to use**: Long/complex forms better served by a dedicated page or a stepped flow
(`onboarding.md`); non-critical information better served by an inline/non-blocking pattern
(`notifications.md`).
**Layout anatomy**: Overlay/scrim + contained dialog + clear title + content + explicit primary/
secondary actions + visible close affordance (both an X and Escape-key support).
**UX rationale**: A modal interrupts the user's mental model of "where am I" — the interruption must be
worth that cost; a modal used for routine, low-stakes actions trains users to dismiss them reflexively
without reading.
**Visual variants**: Center-screen dialog; side-drawer (less disruptive, good for supplementary detail
without fully blocking); full-screen takeover (for genuinely complex focused tasks on mobile).
**Responsive strategy**: On mobile, prefer full-screen or bottom-sheet treatment over a small centered
dialog, which is hard to interact with precisely on a touch screen.
**Accessibility requirements**: Focus trapped within the modal while open, focus returned to the
triggering element on close, `role="dialog"` with `aria-modal="true"`, Escape key closes it.
**Performance considerations**: Lazy-mount modal content rather than rendering it hidden in the DOM at
all times.
**Anti-patterns**: Modals for non-critical marketing content (newsletter popups) that interrupt a user's
actual task — a well-documented, broadly disliked pattern regardless of visual polish.
**Implementation notes**: Confirm a destructive action's modal clearly states the consequence, not just
"Are you sure?"
