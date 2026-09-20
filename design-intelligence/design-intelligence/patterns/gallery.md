# Gallery Pattern
**What it is**: A browsable collection of visual/media items (portfolio work, photos, video) where
visual quality and sequencing carry most of the communicative weight.
**When to use**: Portfolios, case-study collections, photo/video-forward content.
**When NOT to use a flat grid**: When content types genuinely differ (Mat Voyce's split personal/
commercial structure, `research/awwwards/11-mat-voyce.md` §2) — use multi-mode structure instead.
**Layout anatomy**: Grid or masonry of preview items → detail/lightbox or full case-study view. Iventions'
staged/spotlit single-item presentation (`research/awwwards/21-iventions.md`) is a variant appropriate
specifically when a spatial metaphor genuinely fits the content.
**UX rationale**: Sequencing (order of items) is itself a curatorial/communicative decision — leading
with the strongest, most representative work rather than reverse-chronological by default.
**Visual variants**: Uniform thumbnail grid; masonry (variable aspect ratios); single-featured-item +
reel toggle (Uncommon Studio, `research/awwwards/04-uncommon-studio.md` §3); staged 3D per-item
presentation (high production cost, use selectively).
**Responsive strategy**: Preview grid columns reduce predictably; detail/lightbox view must work without
hover (no hover-to-preview-only interactions on touch).
**Accessibility requirements**: Meaningful alt text per item (not "image 1, image 2"); keyboard-operable
lightbox/detail navigation with a clear close/escape action.
**Performance considerations**: Lazy-load preview images; serve appropriately-sized images per breakpoint
rather than full-resolution originals everywhere.
**Anti-patterns**: Autoplaying video previews with sound, or without user control (contrast with the
correct pattern in `research/awwwards/04-uncommon-studio.md` §7).
**Implementation notes**: Curate order deliberately; don't default to upload/chronological order.
