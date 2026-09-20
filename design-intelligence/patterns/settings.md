# Settings Pattern
**What it is**: The interface for configuring account/product preferences — low-frequency but high-
consequence (a wrong setting or a hard-to-find one causes real friction later).
**When to use a single long settings page**: Small number of total settings. **When to use grouped/
tabbed sections**: Larger settings surfaces (account, notifications, billing, security as separate
groups).
**Layout anatomy**: Grouped sections with clear headings + inline-editable or form-style fields + clear
save/auto-save state indication + destructive actions (delete account, etc.) visually separated and
requiring confirmation.
**UX rationale**: Settings should be findable by searching for the outcome a user wants ("turn off
email notifications"), not only by the internal name of the setting — label accordingly.
**Visual variants**: Single scrollable page with anchored sections; sidebar-tabbed sections; per-item
inline-edit (click a value to edit in place).
**Responsive strategy**: Sidebar-tabbed layouts typically collapse to a top-level list-then-detail
pattern on mobile (select a category, then see its settings), not a cramped simultaneous view.
**Accessibility requirements**: Auto-save state changes announced via `aria-live`; toggle/switch
controls have accessible names describing the actual effect, not just "on/off."
**Performance considerations**: Not typically performance-sensitive; prioritize clarity of current state
over any visual flourish.
**Anti-patterns**: Silent auto-save with no confirmation at all (users left unsure whether a change
took effect); destructive actions styled identically to routine ones.
**Implementation notes**: Always show current state clearly before any edit — a settings page a user
can't quickly verify is a trust problem, not just a UX inconvenience.
