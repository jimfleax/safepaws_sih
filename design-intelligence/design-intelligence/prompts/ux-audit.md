# Prompt Template: UX Audit

Use when: the specific task is a critical usability review, not implementation.

**Route to**: `/design-review`, weighted toward `agents/ux-reviewer.md`'s dimensions specifically
(usability, IA, clarity, interaction, friction, cognitive load).

**Method**: trace the actual primary task end to end, counting real steps/decisions/fields — don't
estimate friction from familiarity with the design. Check `principles/16-information-architecture.md`:
does the structure answer a real question about this specific audience, or mirror convention/a
competitor with no stated reason?

**Be critical, per this system's explicit instruction**: don't round up a "decent" (55-69,
`scoring/quality-gate.md`) result to "good" to avoid an uncomfortable finding. Name the specific tier
and the specific gap to the next one up.

**Output**: severity-tagged findings (`scoring/quality-gate.md`'s BLOCKER/HIGH/MEDIUM/LOW scale), each
specific enough to act on directly — never a vague "improve usability" note.
