# Search Pattern
**What it is**: A direct-query interface for finding a specific known or partially-known item, distinct
from browsing/filtering an entire set.
**When to use prominent, always-visible search**: Content-rich sites/products where users frequently
arrive with a specific target in mind (documentation, large catalogs).
**When a search icon-to-expand is acceptable**: Low-frequency search need relative to browsing.
**Layout anatomy**: Input with clear affordance (not icon-only with no visible input until clicked, which
hides the feature) + live or submit-triggered results + empty/no-results state with guidance.
**UX rationale**: Search should tolerate typos and partial matches, not require exact strings — a
technically "working" search that returns zero results for near-matches functions as broken to the user.
**Visual variants**: Inline top-bar search; command-palette-style global search (Linear's keyboard-first
pattern, `research/awwwards/03-linear.md` §7); dedicated search results page.
**Responsive strategy**: Mobile search should be reachable in one tap from primary navigation, not
buried in a secondary menu.
**Accessibility requirements**: Results count and loading state announced via `aria-live`; keyboard
navigable results list (arrow keys + enter, for command-palette style).
**Performance considerations**: Debounce live-search queries; show a loading indicator for anything
taking more than ~300ms.
**Anti-patterns**: Search that only matches exact substring with no fuzzy/typo tolerance; a results page
with no indication of how many results or what was actually searched.
**Implementation notes**: Design the zero-results state as carefully as the results state — it's a
common dead end.
