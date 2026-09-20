# Onboarding Pattern
**What it is**: The guided first-use experience that gets a new user to their first real value moment.
**When to use a multi-step guided flow**: Products with real setup complexity or non-obvious initial
configuration. **When to skip it entirely**: Products simple enough that the interface itself is
self-explanatory — an onboarding flow added "because products have onboarding" delays real use for no
reason.
**Layout anatomy**: Progress indicator + one focused decision/input per step + skip option where
genuinely optional + a clear "why we're asking this" for any non-obvious step.
**UX rationale**: Every step should visibly move the user closer to their actual goal, not just collect
data for the business's benefit — onboarding perceived as company-serving rather than user-serving is a
top driver of drop-off.
**Visual variants**: Linear step wizard; checklist/progressive (non-blocking, dismissible, revisited
over time); interactive product tour overlay.
**Responsive strategy**: Steps should be short enough to complete comfortably in a single mobile session;
avoid dense multi-field steps that worked on desktop.
**Accessibility requirements**: Progress state announced to assistive tech; each step's heading
structure and focus management set correctly so screen-reader users land on new content, not stuck focus.
**Performance considerations**: Persist progress so a refresh/interruption doesn't force restarting from
step one.
**Anti-patterns**: Long onboarding forced before any real product value is shown (delaying the "aha
moment"); required fields that aren't actually required for first use.
**Implementation notes**: Instrument and review actual drop-off per step — onboarding is one of the few
UI patterns where usage data should directly drive redesign.
