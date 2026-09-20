# Workflow: /refactor-ui

For improving existing UI code/design without a full rebuild — respects this system's engineering
philosophy of incremental, non-destructive change (`design-intelligence/MASTER_PLAN.md`).

## Steps
1. **Inspect existing code and architecture first** — understand current component structure, token
   usage (or absence), and apparent original intent before changing anything.
2. **Run `/design-review`** to get a structured, severity-tagged finding list against the current state.
3. **Prioritize**: fix BLOCKERs first, then HIGH severity, then MEDIUM/LOW as scope allows.
4. **Preserve working behavior** — refactor visual/structural issues without breaking functioning
   interactions unless the interaction itself is the identified problem.
5. **Reuse existing assets/tokens where they're sound** — extend the existing design-system foundation
   (`agents/design-system-architect.md`) rather than introducing a parallel, inconsistent one.
6. **Build incrementally** — verify each fix against `/visual-review` before moving to the next, rather
   than batching many changes and discovering issues only at the end.
7. **Re-run `/design-review`** after fixes to confirm the targeted issues are resolved and no new ones
   were introduced.

## What this workflow explicitly avoids
Unnecessary full rewrites where targeted fixes would serve — per this system's AI-behavior philosophy
(`design-intelligence/MASTER_PLAN.md`): inspect before changing, reuse before replacing, build
incrementally.
