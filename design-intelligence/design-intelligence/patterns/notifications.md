# Notifications Pattern
**What it is**: System-initiated messages informing a user of state changes, both in-the-moment
(toasts) and persistent (notification center/inbox).
**When to use a toast**: Transient confirmation of an action just taken (saved, sent, deleted).
**When to use a persistent notification center**: Events the user should be able to review later,
independent of when they occurred.
**Layout anatomy**: Toast — icon/color for severity + message + optional action + auto-dismiss timer
(with a way to pause/dismiss manually). Notification center — grouped/chronological list + read/unread
state + per-item action.
**UX rationale**: Never rely on a toast alone for information the user must act on later — transient UI
is, by definition, easy to miss.
**Visual variants**: Corner toast stack; inline banner (for page-level, persistent state); badge-plus-
dropdown notification center.
**Responsive strategy**: Toasts on mobile should not obscure primary navigation or the keyboard area;
consider bottom placement over top on small viewports.
**Accessibility requirements**: `aria-live="polite"` for informational toasts, `"assertive"` reserved
for genuinely urgent/blocking messages; auto-dismiss timing must be pausable/extendable for users who
need more time to read.
**Performance considerations**: Cap simultaneous toast stack depth; don't let a burst of events spawn
dozens of overlapping toasts.
**Anti-patterns**: Auto-dismissing a critical error before the user could reasonably read it; overusing
notifications for low-value events, training users to ignore the channel entirely (notification fatigue).
**Implementation notes**: Reserve interruptive/assertive notification styling for things that are
actually urgent — see `anti-generic-ai/icon-overuse.md` for the related badge-overuse failure.
