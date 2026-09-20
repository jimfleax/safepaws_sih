# Content Design

## What it is
Writing and structuring the actual words in an interface (labels, headlines, error messages, empty
states) as a designed system, not an afterthought filled in after visuals are finished.

## Core rule
Content and layout are designed together, not sequentially — a headline's length affects hierarchy;
a button label's clarity affects whether an interaction needs a tooltip at all. See Cowboy's named-
technology feature callout (`research/awwwards/13-cowboy.md` §16): the copy device (naming and
explaining "AdaptivePower™" in one sentence) is itself the design decision, not a caption under one.

## Implementation guidance
- Every button/CTA label should describe the specific outcome ("Start free trial," not "Submit" or
  "Learn more" repeated identically everywhere).
- Error messages state what happened and what to do next — never a bare "Something went wrong" with no
  recovery path.
- Empty states (no data yet, no search results) are a real design surface, not a blank space — they're
  an opportunity to guide the next action.
- Microcopy (labels, helper text, placeholder text) should be tested for the least-informed realistic
  user, not the person who designed the flow and already knows what's meant.

## Failure mode
Generic, interchangeable copy ("Powerful. Simple. Fast." headlines that could apply to any product in
any category) — a specific, common generic-AI content signature; see
`anti-generic-ai/generic-ui-signatures.md`.

## When to prioritize brevity over completeness
High-frequency, low-stakes UI copy (table headers, short labels) should stay terse; content design rigor
matters most at high-stakes or infrequent moments (errors, empty states, irreversible actions,
onboarding) where a user has the least context.
