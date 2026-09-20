# Prompt Template: Visual Polish Pass

Use when: the interface is functionally complete and the specific task is elevating visual craft
(not fixing bugs or adding features).

**Route to**: `agents/visual-art-director.md` directly, then `/design-review`'s visual dimensions.

**Sequence**: run `anti-generic-ai/generic-ui-signatures.md`'s checklist first — polish should remove
generic signatures before adding decoration, not layer decoration on top of them. Then check
`principles/01-hierarchy.md` (one loudest element per view), `03-spacing.md` (derived, not uniform,
rhythm), and `05-typography.md`/`typography/` (real scale, one reserved display voice).

**The test for whether a polish change actually helped**: can you state, in one sentence, the specific
product/brand reason for the change (`principles/08-brand.md`'s one-sentence test)? "It looks nicer" is
not sufficient justification on its own — tie it to something real.

**Verify nothing regressed**: re-check accessibility contrast and responsive behavior after any color/
spacing/typography change — visual polish must never silently reduce contrast below WCAG AA.
