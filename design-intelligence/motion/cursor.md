# Cursor Motion
**Trigger**: pointer movement/position (desktop only).
**State change**: default system cursor → custom cursor state (magnetic pull, label reveal, blend-mode
effect).
**Motion**: custom cursor following pointer with slight lag/easing (not 1:1, which reads as jittery);
magnetic snap toward nearby interactive elements; contextual label/icon swap based on what's under the
cursor.
**Duration range**: cursor-follow easing typically very short (50-150ms lag) — enough to feel smooth,
not so much it feels disconnected from actual pointer position.
**Easing idea**: light ease-out follow; avoid heavy spring/overshoot on cursor-follow itself, which
reads as imprecise.
**Purpose**: hierarchy/wayfinding (Zajno's dedicated, separately-awarded "Mouse Interaction" element,
`research/awwwards/09-zajno.md` §7 — cursor behavior treated as its own designed layer) — should
clarify what's interactive or add a genuine brand-personality moment, not just decorate.
**Accessibility**: custom cursors are a pure desktop-mouse enhancement — never let necessary information
depend on cursor-based interaction; ensure default browser cursor/focus behavior remains available for
users with motion sensitivity or non-mouse pointing devices, and provide an easy way to disable it.
**Performance**: cursor-follow logic runs on every pointer-move event — throttle with
requestAnimationFrame, never do expensive layout work synchronously on `mousemove`.
**When NOT to use**: any interface where a custom cursor could obscure precise target information
(e.g., dense data tables, text-heavy reading contexts) — the risk of interference outweighs the brand
benefit there.
