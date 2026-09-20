# Footer Pattern
**What it is**: The page's final, comprehensive wayfinding and trust layer — sitemap, legal, contact,
secondary CTAs.
**When to use**: Every content-bearing page. **When to keep minimal**: Single-purpose landing/campaign
pages (`research/awwwards/17-spotify-wrapped-party.md`) where a full sitemap footer would dilute a
single conversion goal.
**Layout anatomy**: Multi-column sitemap + legal/copyright line + social/contact + (optional) newsletter
signup. Stripe's mega-footer (`research/awwwards/01-stripe.md` §11) exceeds 40 links — appropriate at
that scale for discoverability/SEO, excessive for a small product.
**UX rationale**: Footers serve returning users seeking something specific and search engines, more than
first-time scanning visitors — density here costs less than density earlier on the page.
**Visual variants**: Full mega-footer sitemap; minimal single-row (logo, copyright, 3-4 links); CTA-
footer (final conversion push before the sitemap).
**Responsive strategy**: Collapse multi-column sitemap into an accordion or stacked single column;
never shrink tap targets below the mobile minimum (`principles/24-mobile-web.md`).
**Accessibility requirements**: Real `<footer>` landmark; heading structure for each column group.
**Performance considerations**: Low priority for above-fold optimization; safe place for slightly heavier
content.
**Anti-patterns**: A footer so large it becomes the de facto site map because the primary nav under-
serves discovery — a symptom of primary nav failure, not a footer problem to fix in place.
**Implementation notes**: Match footer breadth to actual content volume, not to how footers "usually"
look.
