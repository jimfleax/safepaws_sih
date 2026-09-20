# Forms Pattern
Full principle detail in `principles/17-form-design.md`; this file is the component-level anatomy.
**What it is**: Any structured data-input surface — signup, checkout, settings, search filters.
**When to use single-column**: Nearly always — see `principles/17-form-design.md` for the completion-
rate evidence.
**When multi-step is appropriate**: Long/complex forms (onboarding, detailed applications) — see
`patterns/onboarding.md`.
**Layout anatomy**: Visible label above field → input → inline help/error text → grouped logically →
submit action clearly distinguished from secondary/cancel actions.
**UX rationale**: Predictability and speed matter more than brand novelty here (tension #2,
`research/synthesis/12-design-tensions.md`).
**Visual variants**: Standard vertical form; inline-edit (click-to-edit fields, for settings/profile
contexts); wizard/stepped (for long forms).
**Responsive strategy**: Full-width single-column fields on mobile; ensure the on-screen keyboard
doesn't obscure the active field or the submit action.
**Accessibility requirements**: Programmatic label association (`<label for>`), grouped fieldsets with
`<legend>` where relevant, errors announced via `aria-live` or `aria-describedby`, and never
color-alone error indication.
**Performance considerations**: Real-time validation should debounce, not fire on every keystroke for
expensive checks (e.g., username-availability lookups).
**Anti-patterns**: Placeholder-as-label; validating a field as "wrong" before the user finishes typing;
disabling the submit button silently instead of showing what's still needed.
**Implementation notes**: Test the actual error and empty states, not just the happy path.
