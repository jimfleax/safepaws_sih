# Form Design

## What it is
The specific, high-stakes UI category where usability convention should usually beat brand novelty —
see tension #2 (clarity vs. novelty) in `research/synthesis/12-design-tensions.md`.

## Core rules
- Single-column layout for most forms — multi-column forms measurably increase completion time and
  error rate for anything beyond simple side-by-side fields (e.g., city/state/zip).
- Labels above fields, always visible (not placeholder-only — placeholder text disappears exactly when
  it's needed most, during input, and fails color-contrast/accessibility requirements as a label
  substitute).
- Inline, real-time validation for format-checkable fields (email, phone), but never punish a field as
  "wrong" before the user has finished typing it.
- Group related fields visually (spacing, per `03-spacing.md`) and logically (a natural, predictable
  order matching how a person would naturally provide the information).
- Every error message is specific and actionable ("Enter a valid email address" not "Invalid input") and
  associated programmatically with its field for assistive tech.

## When brand personality can still show up in forms
Microcopy tone, button label specificity ("Create my account" vs. generic "Submit"), and visual styling
of the surrounding page — never in the fundamental interaction pattern itself (field order, validation
timing, required-field marking), which should stay close to well-learned convention.

## Failure mode
Novel, brand-driven form interactions (custom multi-step reveals, non-standard input controls) applied
to inherently high-stakes, infrequent tasks (checkout, account creation, tax/financial data entry) where
users have the least patience for learning a new pattern and the highest cost of error.

## When multi-step is appropriate
Long, complex forms (onboarding, detailed applications) benefit from progressive disclosure into
clearly-labeled steps with visible progress — but each step should still follow the single-column,
convention-following rules above internally.
