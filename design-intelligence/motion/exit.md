# Exit Motion
**Trigger**: element being removed (dismiss, delete, navigate away, conditional unmount).
**State change**: present → not-present.
**Motion**: fade, fade+slight-fall, or scale-to-trigger (reverse of entrance, for modals/popovers).
**Duration range**: typically shorter than the equivalent entrance (150–300ms) — exits should feel
quick and get out of the way, not linger.
**Easing idea**: ease-in (`easing.md`) — accelerating away reads as natural departure.
**Purpose**: continuity (avoids an abrupt disappearance that can feel like an error) and feedback
(confirms a dismiss/delete action was registered).
**Accessibility**: focus must be explicitly moved to a sensible location when the focused element exits
(e.g., closing a modal returns focus to its trigger) — never leave focus on a removed/invisible element.
**Performance**: for bulk removal (e.g., clearing a list), avoid animating each item individually if the
list is long — consider a single container fade instead of N staggered exits.
**When NOT to use**: destructive actions (delete) may warrant a brief delay/undo window rather than an
instant animated removal — the motion pattern shouldn't rush past a chance to prevent an error.
