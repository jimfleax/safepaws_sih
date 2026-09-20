# Editorial (Component-Level) Pattern
Full principle detail in `principles/21-editorial.md`.
**What it is**: Article/story templates — headline, byline, body, pull quotes, related content.
**Layout anatomy**: Headline (real `<h1>`) + byline/date metadata + narrow reading-width body
(`principles/05-typography.md` line-length guidance) + inline media with captions + related-content
module at the end, not interrupting the body.
**UX rationale**: Everything in the template should be justified by whether it helps or interrupts
sustained reading (`principles/21-editorial.md`).
**Visual variants**: Standard article template; long-form/feature template with more generous imagery
and scroll-driven pacing; type-led minimal template (By-Kin's restrained transitions,
`research/awwwards/10-by-kin.md`).
**Responsive strategy**: Body text reflows to a comfortable single column on mobile; inline images/pull
quotes should not force horizontal scroll or awkward text wrap.
**Accessibility requirements**: Real semantic heading hierarchy for any sub-sections within a long
article; captions/alt text for all editorial imagery.
**Performance considerations**: Lazy-load images below the fold in long articles; avoid render-blocking
web fonts delaying text display (use font-display: swap or equivalent).
**Anti-patterns**: Auto-playing embedded video within article body; interstitial ads/modals interrupting
mid-read.
**Implementation notes**: Test actual paragraph lengths from real content, not lorem ipsum, before
finalizing type-scale/line-length decisions.
