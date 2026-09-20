# Hover Motion
**Trigger**: pointer entering/leaving an element's bounds (desktop/mouse input only).
**State change**: default → hovered (and back).
**Motion**: subtle scale (1.0→1.02-1.05), color/opacity shift, underline reveal, or elevation/shadow
change.
**Duration range**: 100–200ms — hover feedback should feel immediate, not lagged.
**Easing idea**: ease-out on enter, ease-in on leave (mirrors general enter/exit convention).
**Purpose**: feedback (confirms an element is interactive before commitment) and hierarchy (can subtly
emphasize the currently-considered option in a list).
**Accessibility**: hover has no touch equivalent — never make necessary information or functionality
hover-only; provide a focus-visible equivalent for keyboard users, since focus and hover are different
input modalities that both need feedback.
**Performance**: prefer transform/opacity changes over ones that trigger layout recalculation (avoid
animating width/height on hover for large numbers of elements, e.g., a grid of cards).
**When NOT to use**: touch-primary interfaces should not design any functionality as hover-dependent;
treat hover strictly as a desktop enhancement layered on top of a fully-functional tap-based interaction.
