# Prompt Template: Redesign Existing UI

Use when: substantially reworking an already-built, already-shipped interface.

**Route to**: `/refactor-ui` first (inspect, understand, preserve working behavior), then `/design-
review` to get a structured baseline, then `/upgrade-generic-ui` if the diagnosis surfaces generic-AI
signatures specifically, or straight to `/premium-ui`'s BUILD→REVIEW→ITERATE loop if the issues are
more about execution quality than genericness.

**Fill in before starting**:
- What's actually wrong, specifically — generic-feeling, usability problems, visual staleness,
  technical debt, or several of these? Different diagnoses route to different workflows.
- What must be preserved (existing user familiarity with current patterns has real value — don't
  change working, well-learned interactions purely for novelty, per `principles/17-form-design.md`'s
  convention-over-novelty logic for high-stakes flows).

**Never** do a full rewrite when targeted fixes would serve — see `/refactor-ui`'s explicit
incremental-change philosophy.
