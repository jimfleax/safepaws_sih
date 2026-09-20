# Playbook: AI Product / AI Feature

**UX priorities**: build trust in a probabilistic, sometimes-wrong system — show process, not just
output; offer a non-AI/manual path alongside the AI-first flow (Framer's explicit "start without AI,"
`research/awwwards/02-framer.md` §7).
**Visual priorities**: avoid over-anthropomorphizing (excessive "thinking" language/imagery) while still
communicating that work is happening (`motion/loading.md`, staged-reveal pattern).
**Information architecture**: make the AI's confidence/uncertainty and editability visible — never
present AI output as unquestionable final fact when it can be wrong.
**Typical patterns**: staged "working" reveal sequence (`motion/principles.md`); inline
regenerate/undo controls; clear provenance ("based on X") where feasible.
**Appropriate motion**: process-communication motion specifically (showing the system "working") is one
of the few contexts where this purpose is strongly justified — see `motion/principles.md`'s five
legitimate purposes.
**Accessibility considerations**: loading/generation states announced via `aria-live`; AI-generated
content should remain fully readable/operable by assistive tech, not trapped in a canvas/image-only
output.
**Responsive priorities**: staged reveal sequences should be shortened, not removed, on mobile —
respect the user's more limited session time and attention.
**Common mistakes**: presenting AI output with false confidence and no easy correction path; over-using
sparkle/magic-wand iconography as a substitute for a real explanation of what happened; forcing every
user through an AI flow with no manual alternative.
**Quality checklist**: Editable/correctable output? Non-AI path available? Process shown, not just
result? Confidence/uncertainty communicated honestly?
