# Tables Pattern
**What it is**: Structured, row/column data display for direct comparison across many items —
correctness and scanability matter more than visual styling.
**When to use**: Homogeneous data with the same attributes per row (transactions, user lists, comparison
data).
**When NOT to use**: Heterogeneous content better served by cards (`cards.md`) — forcing dissimilar
content into table rows produces sparse, confusing tables.
**Layout anatomy**: Header row (sticky on scroll for long tables) + sortable columns where useful + row
actions (aligned consistently, usually right-aligned) + pagination or virtualization for large datasets.
**UX rationale**: Alignment is functional here, not aesthetic — numbers right-aligned for magnitude
comparison, text left-aligned for reading, consistently per column.
**Visual variants**: Zebra-striped rows (aids row-tracking in wide/dense tables); bordered; borderless
with generous row spacing (better for less dense, more skimmable tables).
**Responsive strategy**: Never truncate to horizontal scroll as the only mobile solution without
considering a card-per-row transform for narrow viewports, especially for user-facing (not
admin/expert) tables.
**Accessibility requirements**: Real `<table>`, `<th scope>`, and caption/summary where non-obvious;
sortable column state announced to assistive tech.
**Performance considerations**: Virtualize rows beyond roughly a few hundred; avoid re-rendering the
entire table on every filter/sort keystroke.
**Anti-patterns**: Dense tables styled with heavy shadows/rounded corners per cell — decorative styling
that actively reduces scanability.
**Implementation notes**: Confirm sort/filter state persists appropriately across navigation if users
expect it to (a common, easily-missed expectation).
