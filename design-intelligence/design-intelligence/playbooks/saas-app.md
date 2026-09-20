# Playbook: SaaS In-Product App (Post-Login)

**UX priorities**: task efficiency for repeated, frequent use over brand impression; a small, opinionated
core object model over sprawling configurability where the audience is focused (`research/awwwards/
03-linear.md`).
**Visual priorities**: consistent, restrained UI chrome (`tokens/`); brand personality expressed through
considered defaults/opinions (Linear's argument), not decorative flourish.
**Information architecture**: navigation matches actual task frequency (most-used actions least buried);
avoid mirroring internal feature-team org structure (`principles/16-information-architecture.md`).
**Typical patterns**: `patterns/dashboards.md`, `patterns/tables.md`, `patterns/settings.md`,
command-palette pattern for power users (`patterns/search.md`).
**Appropriate motion**: functional feedback/continuity motion only (`motion/feedback.md`); minimal
decorative motion — this is a repeated-use surface where users pay any motion cost many times over.
**Accessibility considerations**: full keyboard operability especially important for power-user, high-
frequency contexts; live-region announcements for real-time data updates.
**Responsive priorities**: mobile in-product views often need genuine re-prioritization of which
features are surfaced at all, not a compressed version of every desktop feature.
**Common mistakes**: feature/field sprawl to match competitors rather than serving the actual core
workflow; marketing-site visual patterns (heavy motion, large decorative type) applied post-login;
inconsistent component states across the app.
**Quality checklist**: Object model as small as the workflow allows? Automation absorbing complexity
where possible (`research/awwwards/03-linear.md` §13)? Keyboard-operable throughout? States (loading/
empty/error) designed for every view, not just the happy path?
