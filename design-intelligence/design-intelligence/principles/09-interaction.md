# Interaction Design

## What it is
How the interface responds to user input — hover, click, scroll, gesture, cursor behavior — evaluated
by whether the response clarifies state and enables action, not by how impressive it looks in isolation.

## Core rule
Every interaction needs a stated purpose: confirm an action happened, reveal more information, indicate
availability, or guide attention. See Uncommon Studio's explicit mute/reel toggles
(`research/awwwards/04-uncommon-studio.md` §7) — user control over autoplaying media is interaction
design solving a real problem (unwanted audio/motion), not decoration.

## Implementation guidance
- Every interactive element needs a visible affordance (it must look interactive before being touched)
  and a visible response (state must change perceptibly on interaction) — invisible or ambiguous
  affordances are a common, serious usability failure regardless of visual polish.
- Hover states are a desktop-only signal — never make critical information or functionality
  hover-dependent, since touch devices have no hover.
- Cursor customization (Zajno's dedicated "Mouse Interaction" element,
  `research/awwwards/09-zajno.md` §7) should be treated as its own designed layer when it's a genuine
  differentiator, not applied by default — it has real accessibility and performance cost.
- Gesture-based interaction (Minh Pham's tagged gesture element, `research/awwwards/19-minh-pham.md`
  §7) should map to a concept the gesture reinforces, not be added for novelty alone.

## Failure mode
Interactive elements that don't respond, respond ambiguously, or respond in a way disconnected from the
action taken ("dead interactions") — a specific, named failure blocker in
`scoring/quality-gate.md`.

## When to keep interaction minimal
Transactional flows (checkout, forms, settings) where predictability and speed matter more than
delight — see `17-form-design.md`. Novel interaction patterns cost learning time that task-focused
users won't tolerate paying repeatedly.
