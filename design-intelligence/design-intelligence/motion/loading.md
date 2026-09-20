# Loading States
**Trigger**: data fetch, asset load, or any operation with perceptible latency.
**State change**: unknown/pending → resolved (success, error, or empty).
**Motion**: skeleton screens (content-shaped placeholders — generally outperform spinners for perceived
performance on anything taking longer than ~1s); spinner/indeterminate progress (short, unpredictable-
duration waits); determinate progress bar (when real progress is knowable, e.g., a file upload).
**Duration range**: show a loading indicator only after a short delay threshold (~300-500ms) for fast
operations — flashing a skeleton/spinner for a 100ms fetch is more distracting than showing nothing.
**Easing idea**: N/A for the loading state itself; the transition *from* loading *to* loaded content
should use standard entrance easing (`entrance.md`).
**Purpose**: feedback (confirms the system registered the request) and continuity (skeleton screens
specifically preserve layout, preventing the jarring reflow of content popping in).
**Accessibility**: loading state changes announced via `aria-live="polite"`; avoid indeterminate
spinners with no text alternative for screen-reader users who can't perceive the visual spin.
**Performance**: reserve layout space for the eventual content (matching skeleton dimensions to real
content) to prevent cumulative layout shift when the real content arrives.
**When NOT to use**: don't show a generic loading state where perceived-instant optimistic UI is
possible instead (e.g., immediately showing a "liked" state while the request completes in the
background, reconciling silently on failure).
