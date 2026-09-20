# Cards Pattern
**What it is**: A bounded container grouping a related unit of content (a feature, a product, an
article preview) — the single most overused pattern in generic AI-generated UI (see
`anti-generic-ai/card-overuse.md`).
**When to use**: Genuinely discrete, comparable, browsable units (a product catalog, an article
archive).
**When NOT to use**: As a default wrapper for every piece of content regardless of relationship — three
unrelated marketing claims forced into three identical cards is the textbook generic-AI signature.
**Layout anatomy**: Image/icon + title + short description + (optional) metadata/CTA — but the anatomy
should vary by actual content type, not be forced into one template across unrelated content.
**UX rationale**: Cards work because bounded containers signal "these items are comparable peers" — using
them for non-comparable content sends a false structural signal.
**Visual variants**: Bordered; shadow-elevated; borderless-with-whitespace-separation (often more
premium-reading, per `principles/03-spacing.md`); bento-grid mixed-size cards (Stripe,
`research/awwwards/01-stripe.md` §3).
**Responsive strategy**: Reflow grid column count by viewport; verify card content doesn't get
orphaned/truncated awkwardly at narrow widths.
**Accessibility requirements**: The entire card should be one accessible interactive target if it's
clickable (not just the title text), with one clear accessible name — avoid nested interactive
elements creating ambiguous focus order.
**Performance considerations**: Virtualize/lazy-load large card grids (50+ items) rather than rendering
all at once.
**Anti-patterns**: Every section on a page wrapped in identical rounded-shadow cards regardless of
content relationship (`anti-generic-ai/card-overuse.md`); decorative cards with no actual grouped
content inside them.
**Implementation notes**: Ask "are these genuinely comparable peer items" before reaching for a card —
if not, a different pattern (see `hero.md`, or plain prose) usually serves better.
