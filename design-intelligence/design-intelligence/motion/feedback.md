# Feedback Motion
**Trigger**: user action (click, submit, drag) requiring confirmation that the system registered it.
**State change**: action taken → action acknowledged.
**Motion**: button press/scale-down on click; success checkmark replacing a label briefly; shake/
color-flash for a rejected/invalid action; toast appearance (`patterns/notifications.md`).
**Duration range**: 100-300ms for the immediate acknowledgment; longer (2-4s) for a persistent toast
before auto-dismiss.
**Easing idea**: ease-out for success/positive feedback (settles confidently); a slight, brief shake
(not a long animation) for error/rejection feedback, which should read as attention-getting but not
punishing.
**Purpose**: feedback is the most fundamental of the six motion purposes — every action a user takes
that isn't instantaneously, obviously reflected in a state change needs *some* acknowledgment, however
small.
**Accessibility**: never rely on motion alone to communicate success/failure — pair with text/icon and
ensure state changes are announced to assistive tech (`aria-live`).
**Performance**: feedback motion is typically small-scope and cheap; the risk here is not performance
but omission — the most common failure is missing feedback entirely, not over-animated feedback.
**When NOT to use**: extremely high-frequency micro-actions in bulk operations (checking 50 boxes) may
warrant feedback only on the overall batch action, not on every individual item, to avoid becoming
friction at that frequency (`patterns/microinteractions.md`).
