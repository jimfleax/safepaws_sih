# Entrance Motion
**Trigger**: element newly appearing (page load, scroll into view, conditional render).
**State change**: not-present → present.
**Motion**: fade, fade+slight-rise (translateY 8-16px + opacity), or scale-from-trigger (for
modals/popovers originating from a specific button).
**Duration range**: 200–400ms for individual elements; see `timing.md` for page-level.
**Easing idea**: ease-out (`easing.md`) — fast start feels responsive, gentle settle feels considered.
**Purpose**: hierarchy (staggered entrance can guide reading order) or continuity (confirms new content
relates to the action that triggered it, e.g., a panel appearing near its trigger button).
**Accessibility**: entrance motion must never delay actual content availability to assistive tech —
content should be in the DOM and announced whether or not the visual animation has finished; respect
`prefers-reduced-motion` by reducing to a simple opacity fade or removing motion entirely.
**Performance**: animate transform/opacity only; avoid animating layout-triggering properties for
elements entering in bulk (e.g., a long list) — stagger sparingly and cap total stagger delay.
**When NOT to use**: content critical to the user's immediate task (e.g., a search result the user is
actively waiting for) should not be gratuitously delayed by an entrance animation — show it as fast as
possible instead.
