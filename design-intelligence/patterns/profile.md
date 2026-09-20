# Profile Pattern
**What it is**: A user's (or entity's) representation within a product — identity display and, where
relevant, self-presentation to others.
**When to use a rich, expressive profile**: Social/community products where identity expression is core
to the value proposition. **When to keep it minimal**: Internal tools/B2B products where a profile is
purely functional (name, role, contact) and elaboration adds no value.
**Layout anatomy**: Identity header (avatar, name, key metadata) + content/activity relevant to the
product's core function + edit affordance for the profile's own owner, view-only for others where
applicable.
**UX rationale**: Distinguish clearly between "how I appear to others" and "my personal settings" — these
are often conflated into one page but serve different audiences and should be labeled accordingly.
**Visual variants**: Card-style compact profile (for lists/mentions); full profile page; dual-narrative
structure for personal/creative profiles (Minh Pham's formal/personal toggle,
`research/awwwards/19-minh-pham.md` §2) when the underlying identity genuinely has multiple facets worth
separating.
**Responsive strategy**: Avatar/header info should remain visible while scrolling through longer profile
content on mobile (sticky header) where that content is long.
**Accessibility requirements**: Avatar images have meaningful alt text (the person's name, not
"avatar.jpg"); any status indicators (online/away) available in text, not color alone.
**Performance considerations**: Lazy-load activity/content feeds beneath the profile header.
**Anti-patterns**: Forcing every product's user representation into an elaborate social-profile pattern
regardless of whether the product context calls for identity expression at all.
**Implementation notes**: Ask what this specific product's profile needs to *do*, not what profiles
usually look like.
