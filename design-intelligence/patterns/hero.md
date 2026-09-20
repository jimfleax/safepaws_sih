# Hero Pattern

**What it is**: The first full viewport of content, responsible for establishing what the product/site
is, who it's for, and the primary next action — the highest-leverage, most-scrutinized real estate on
any page.

**When to use**: Every landing/marketing page needs one. Internal tool dashboards generally don't (see
`dashboards.md` instead — the "hero" concept there is a status summary, not a brand moment).

**When NOT to use a conventional hero**: When the product itself is the best pitch (Framer's embedded-
demo hero, `research/awwwards/02-framer.md`) — consider replacing a static hero with a working
interactive artifact.

**Layout anatomy**: Headline (one reserved display treatment, `principles/05-typography.md`) + supporting
line + primary CTA (+ optional secondary CTA) + visual proof element (product shot, demo, or
illustration). Stripe's variant adds a segmentation layer immediately below
(`research/awwwards/01-stripe.md`).

**UX rationale**: The hero must answer "what is this, for whom, why should I care" within seconds — every
element competing with that job (badges, multiple equal-weight CTAs, decorative motion with no purpose)
actively hurts comprehension speed.

**Visual variants**: (a) Claim-led with reserved display type (Stripe); (b) Demo-embedded, product-as-
proof (Framer); (c) Video-led with explicit media controls (Uncommon Studio); (d) Spatial/3D world as
hero (Bruno Simon — high-risk, narrow-audience only, see `principles/22-creative-web.md`).

**Responsive strategy**: Headline scale must compress non-linearly (not just proportionally) on mobile —
what reads as confident at 72px desktop can overwhelm at a naive proportional mobile size; re-tune scale,
not just shrink it. CTA must remain thumb-reachable, not pushed below the fold by a tall headline.

**Accessibility requirements**: Headline is a real `<h1>`. Any autoplay media is muted by default with a
visible control (`research/awwwards/04-uncommon-studio.md` §7). Sufficient contrast between headline
text and any background image/gradient — verify, don't assume.

**Performance considerations**: Hero assets are the least deferrable content on the page (above the
fold) — optimize aggressively; any animated/video hero needs a static fallback path
(`research/awwwards/01-stripe.md` §8).

**Anti-patterns**: Generic "Powerful. Simple. Fast." headlines with no product-specific claim (see
`anti-generic-ai/hero-failures.md`); multiple equal-weight CTAs; decorative background motion with no
stated purpose.

**Implementation notes**: Segment hero copy/proof by known traffic source when realistic (paid campaign
landing vs. organic homepage) rather than showing one generic hero to every visitor type.
