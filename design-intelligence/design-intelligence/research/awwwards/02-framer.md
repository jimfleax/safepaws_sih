# Framer

## Metadata
- Official URL: https://framer.com
- Awwwards URL: https://www.awwwards.com/sites/framer-com — Honorable Mention.
- Category: A — Premium Product / SaaS
- Award / recognition: Awwwards Honorable Mention (confirmed listing).
- Date/year: Site fetched and evaluated Sept 2026. Note: the positioning has changed since older
  training-era knowledge of Framer as "the web builder" — the live site now leads with "Framer is the
  AI design agent for every step from idea to launch." This is stated explicitly here as a live-fetch
  correction, not carried over from memory, precisely to demonstrate the discipline this system asks
  for: check before asserting current positioning.
- Studio/company: In-house Framer team.
- Relevant technologies: OBSERVED — the page embeds live/near-live product surfaces directly in the
  marketing site (a working CMS table UI, a simulated coding-agent terminal, live analytics counters,
  a live A/B test results card), rather than static screenshots of these features.
- Accessibility observations: UNKNOWN — not verifiable from fetched markup alone (heavy embedded
  interactive widgets typically need dedicated audit).
- Responsive observations: UNKNOWN from this fetch; not independently verified.
- Verification: LIVE (confirmed via direct fetch, Sept 2026).

## 1. First Impression
INFERRED from fetched content: the page does not open with a static hero image — it opens into what reads as a live product surface (a canvas, a CMS table, a chat-style agent panel). The immediate impression a design tool gives is credibility-by-demonstration: instead of describing the product, the homepage *is* a working sliver of it.

## 2. Information Architecture
OBSERVED: navigation is organized by role/solution (Designers, Agencies, Marketers, Growth, Builders, Engineers, Site Teams, Founders) rather than by feature — a deliberate choice to let very different visitor types self-identify immediately. The page body is organized around four AI "agent" capabilities in sequence (design agent, CMS agent, code agent, "connect to any agent"/integrations), each demonstrated with a distinct embedded interactive artifact rather than a screenshot, followed by social proof (customer stories), then a live community feed, then pricing/CTA.

## 3. Layout System
INFERRED: sections alternate between full-width interactive demo blocks (canvas, terminal, CMS table) and narrower proof/community sections — similar two-track rhythm to Stripe (§01) but with embedded live widgets standing in for the "wide" track instead of illustration.

## 4. Typography
UNKNOWN at precise scale/weight level from this fetch (no rendered inspection). OBSERVED structurally: extremely dense micro-copy is used inside the product-demo widgets themselves (real CMS field names, real analytics numbers, real terminal output) — the typographic hierarchy problem here is different from a typical marketing page because body copy is competing with functional UI copy inside the demos.

## 5. Color System
UNKNOWN — not verifiable from markup-level fetch; no rendered color data available. Not claimed.

## 6. Imagery
OBSERVED: the "imagery" on this homepage is functional, not photographic — a live terminal simulation showing an agent importing a WordPress blog into Framer's CMS, a live A/B test scoreboard ("Home Page 2026 — WINNER — 17.1% conversion"), and a live community marketplace feed with real usernames and real project posts. This is a distinct pattern from every other reference in this set: proof-by-artifact rather than proof-by-photograph.

## 7. Interaction Design
OBSERVED: a "start without AI" escape hatch exists alongside multiple "start with agents" entry points — an explicit acknowledgment that not every visitor wants the AI-first flow, given as a real, named option rather than only the AI path. This is a meaningful, specific UX decision: the product doesn't force its newest, most-marketed capability as the only door in.

## 8. Motion Design
UNKNOWN at the implementation/timing level (no rendered inspection possible). INFERRED from the presence of a simulated "Thinking... Thinking... Created a design plan (2s)" sequence in fetched markup that a staged, timed reveal animation exists to simulate the agent "working" before showing a result — a common and effective pattern for demonstrating an AI feature's process, not just its output, though the specific easing/duration is not verifiable here.

## 9. Responsive Design
UNKNOWN — not verifiable from this fetch. Not claimed.

## 10. UX Strengths
- Role-based navigation reduces the "which of these many features is for me" problem common to broad platforms.
- Demonstrating features as working artifacts (a real CMS table, a real terminal) rather than marketing screenshots is a stronger, harder-to-fake trust signal.
- An explicit non-AI path is offered, not just implied.

## 11. UX Weaknesses
OBSERVED from the sheer density of the fetched content: the page enumerates an extremely large number of surfaces, integrations, comparison pages (vs. Webflow, Figma, Wix, Squarespace, WordPress, and more), and community features in one continuous scroll. For a first-time visitor unfamiliar with Framer, this raises real discoverability risk — it is not obvious from the fetched structure alone where a beginner should start versus a professional agency evaluating a migration. The footer/global-nav content repeats near-identically multiple times in the fetched output, suggesting a heavily componentized mega-footer that, while good for SEO/discoverability, adds significant scroll weight.

## 12. Technical Craft
- OBSERVED: a live "Core Web Vitals — GOOD — LCP 1.1s, INP 95ms, CLS 0.01" panel is embedded directly in the page as a product-feature demo (Framer showcasing its own hosting performance tooling on itself). This is a notable, specific, self-referential trust device — the company is willing to show its own real performance numbers as a feature.
- UNKNOWN: whether the surrounding marketing page itself hits comparable numbers in practice — not independently measured in this pass.
- OBSERVED: real, current usage statistics are embedded live in-page (visitor counts, pageviews, bounce rate) as of the fetch, dated Sept 1, 2026 in the source — genuine evidence the page is dynamically data-driven, not a static screenshot pretending to be live.

## 13. Design Principles Extracted
1. **Prove the feature by embedding it, not by describing it** — a working, miniaturized version of the actual product surface is a stronger claim than a screenshot or a bullet list. Use when the product's craft is visible in its UI. Avoid when the real product needs setup/context a 10-second demo can't honestly convey — an oversimplified embedded demo can overpromise. Failure mode: a fake-looking "demo" that visitors correctly identify as scripted, which damages trust worse than a plain screenshot would have.
2. **Always offer a non-flagship path** — even when a company's newest capability is the main marketing story, keep a plain, un-hyped entry point for people who don't want it yet. Use whenever a product is mid-transition to a new primary paradigm (as Framer is, from "site builder" to "AI design agent"). Failure mode: forcing every visitor through the new flow alienates the existing user base the redesign needs to retain.
3. **Role-based, not feature-based, top-level navigation** — group by "who you are," not "what we built," when the audience is heterogeneous. Failure mode: role categories that are really just relabeled feature lists don't reduce cognitive load, they just rename it.
4. **Self-referential proof** — if your product measures something (performance, conversion), show your own real numbers for it on your own site. Failure mode: doing this with numbers that can't be independently checked reads as a claim, not evidence — pair it with a real, verifiable source when possible.

## 14. Anti-Patterns
Do not copy the sheer surface area (dozens of comparison pages, every integration, every community feature on one scroll) for a smaller product without Framer's scale of use cases — for most products this becomes overwhelming rather than comprehensive. Do not fabricate "live" data panels that aren't actually live; the power of this pattern depends entirely on it being real.

## 15. Transferable Patterns
- Embedded functional product demo in place of a screenshot.
- Role-based top-nav with an explicit "skip the new thing" path.
- Self-referential live metrics panel as a trust/feature device.
- Staged "agent is thinking" reveal sequence for AI-feature demos.

## 16. Reusable Component Ideas
- "Live demo" hero widget (a scoped, safe, real interactive slice of the product).
- Role-picker navigation component.
- Live/animated metrics card (visitors, conversion, performance) as a homepage module.

## 17. Design Tokens / Approximate Measurements
Not estimated for this entry — no rendered/visual data was available to responsibly approximate scale, spacing, or radius values, and the system's own discipline (§45) is to mark absence rather than invent plausible-sounding numbers.

## 18. Why This Site Is Excellent
It solves the specific credibility problem every design/dev tool faces — "does this actually work, or is it a mockup" — by refusing to use mockups. Nearly every major claim on the page (performance, conversion lift, agent behavior, community activity) is represented as a real or realistically-live artifact rather than an illustration.

## 19. Lessons for AI-Generated UI
When a coding agent is asked to build a SaaS marketing page for a tool that itself does something demonstrable (turns data into a chart, automates a workflow, cleans up code), the Framer lesson is to prefer building a small real/simulated working widget over a static screenshot or icon-plus-copy card — even a simplified one raises credibility substantially versus generic feature-card grids. It should also borrow the "offer a non-flagship path" discipline whenever a product is pivoting its primary pitch.

## 20. Evidence
- Direct fetch: https://framer.com (Sept 2026) — all IA, copy, and embedded-demo observations sourced from this fetch.
- Awwwards listing: https://www.awwwards.com/sites/framer-com (Honorable Mention).
