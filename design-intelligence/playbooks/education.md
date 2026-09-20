# Playbook: Education / Learning Platform

**UX priorities**: clear progress/mastery signaling; reduce cognitive load so attention goes to learning
content, not to navigating the interface; scaffold complexity appropriately for the actual learner
level.
**Visual priorities**: friendly but not condescending (avoid infantilizing visual language for adult
learners); clear visual distinction between instructional content, practice/assessment, and navigation
chrome.
**Information architecture**: linear-with-escape-hatches structure — a clear default path through
material, with the ability to jump/review non-linearly for a returning or advanced learner.
**Typical patterns**: progress indicators (`patterns/onboarding.md`-style progressive structure),
`quiz_display`-style assessment patterns, clear "what's next" guidance at the end of each unit.
**Appropriate motion**: feedback motion for correct/incorrect responses should be encouraging, not
punishing (a brief, neutral-toned correction, not a jarring negative animation) — see
`user_wellbeing`-adjacent care in tone even in a design-system context.
**Accessibility considerations**: this category disproportionately serves users with diverse learning
needs — captions for any video content, adjustable pacing where feasible, high-contrast and dyslexia-
considerate typography options are a meaningfully higher priority here than in most other playbooks.
**Responsive priorities**: mobile learning sessions are often short/interrupted — design for resumability
(clear save/return-to-where-you-left-off state).
**Common mistakes**: assessment feedback that feels punitive; progress systems that are motivating for
some learners but shame-inducing for others (e.g., aggressive public leaderboards with no opt-out).
**Quality checklist**: Clear resumable progress state? Feedback tone encouraging, not punitive? Real
accessibility accommodation (captions, contrast, pacing), not just baseline compliance?
