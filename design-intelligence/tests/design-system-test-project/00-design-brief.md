# Design Brief: Meridian (AI Research Workspace)

Filled per `design-intelligence/templates/design-brief.md`.

## Product
Meridian is an AI research workspace: a knowledge worker drops in sources (PDFs, URLs, notes), and an
AI assistant searches, reads, and drafts alongside them in a shared canvas — not a chat window bolted
onto a document, but a workspace where human editing and AI contribution happen in the same surface.

## Users
Two genuinely distinct personas (per `principles/15-conversion.md`'s segmentation logic): (1) individual
researchers/analysts doing deep, solo synthesis work; (2) small research teams who need to share a
workspace and see each other's + the AI's contributions. These need different proof on the marketing
site and different default views in-product.

## Goal
Marketing site: convert a skeptical, time-pressed researcher who's tried generic AI chat tools and found
them insufficient for real synthesis work. In-product: help the user finish a synthesis task faster and
with better traceability to sources than doing it manually.

## Primary action
Marketing: start a free workspace with a real document already imported (not a blank signup form).
In-product: import a source and get the AI to produce a first-pass synthesis draft.

## Brand personality
Rigorous, unshowy, source-grounded, fast — each traceable to the actual product: "rigorous"/"source-
grounded" because the whole value proposition is trustworthy synthesis (every AI claim traceable to a
source), "unshowy" because the audience (researchers) is skeptical of AI hype, "fast" because the
alternative is manual synthesis that takes hours.

## Visual direction
Closest to `tokens/themes/technical.tokens.json`, blended with restraint principles from
`tokens/themes/minimal.tokens.json` — precise, unornamented, dark-mode-capable, because the audience
values function over decoration and spends long sessions in the tool (per `research/synthesis/12-
design-tensions.md` tension #1's resolving question: this audience needs trustworthy restraint, not
demonstrated range). Not the `playful` or `creative` themes — those would undercut the "rigorous" claim.

## Reference families
- **Linear** (`research/awwwards/03-linear.md`) demonstrates "a small, opinionated core object model
  beats a large configurable one" — relevant because Meridian should resist becoming a sprawling
  document-editor-plus-chat-plus-everything; the object model should stay narrow (sources, synthesis
  drafts, workspaces).
- **Framer** (`research/awwwards/02-framer.md`) demonstrates "prove features by embedding a working
  demo, not describing them" — relevant because the marketing site should show a real (or realistically
  simulated) import→synthesis flow, not a screenshot.
- **Stripe** (`research/awwwards/01-stripe.md`) demonstrates "segment proof by buyer type" — relevant
  because solo-researcher and team personas need different marketing-site proof.

## Typography direction
Single-family system (per `typography/font-pairing.md`'s "safest option"): a neutral, highly-legible
grotesk across display, UI, and body, since long-session reading/synthesis work benefits from
consistency over display/body contrast drama. One reserved, slightly larger/tighter-tracked weight for
the marketing site's single hero claim only (`typography/display-typography.md`).

## Color direction
Achromatic-leaning dark UI chrome (`principles/06-color.md`'s content-carries-color pattern, adapted):
source documents and their real content/highlighting carry visual interest; one disciplined accent
color marks AI-generated content specifically (so a user always knows, at a glance, human vs. AI
contribution) — this is a functional, not decorative, use of accent color.

## Layout strategy
Marketing site: Stripe's two-track rhythm (`principles/04-grid.md`) — narrow column for the claim,
full-bleed for the embedded demo. In-product: a persistent three-pane workspace (sources / canvas /
AI-assistant panel) rather than a modal-heavy or single-pane-with-navigation structure, since the core
value is all three being visible and connected simultaneously.

## Interaction strategy
The AI's contributions must be visually distinguishable from the user's own text at all times (the
functional accent-color use above) and every AI claim needs a visible, clickable source citation —
this is the single most important interaction requirement, directly serving the "rigorous" brand
personality.

## Motion strategy
Process-communication motion only (`motion/principles.md`'s legitimate purpose #4) — a visible "reading
source... drafting..." staged sequence (Framer's pattern, `research/awwwards/02-framer.md` §8) when the
AI is working, so the user understands what's happening; no decorative motion elsewhere, consistent
with the `technical` theme's precise, minimal motion voice.

## Responsive strategy
Desktop-primary for the in-product workspace (three-pane layout genuinely needs the screen real estate;
mobile in-product view should be a deliberately reduced single-pane "review and approve" mode, not a
compressed three-pane attempt — `principles/24-mobile-web.md`). Marketing site is fully responsive
per standard practice.

## Accessibility strategy
Beyond the universal baseline: AI-vs-human content distinction must not rely on color alone (add an
icon/label, not just the accent color) per `principles/12-accessibility.md`'s "never color alone" rule
— directly relevant here since it's a core functional requirement, not just a general good practice.

## Performance strategy
Long documents/sources need virtualized rendering (`patterns/tables.md`'s virtualization principle
generalized to document panes); no heavy 3D/WebGL anywhere — not relevant to this product's value
proposition and would work against the "unshowy" brand personality.

## Anti-patterns to avoid
Generic "AI sparkle" iconography as a substitute for real source citation (`playbooks/ai-product.md`'s
common mistake); the standard three-column SaaS feature grid on the marketing site instead of
persona-segmented proof; treating this as a chat product and defaulting to a chat-bubble UI, which
would undersell the actual shared-canvas differentiation.

## Quality target
Premium tier (80-89, `scoring/quality-gate.md`). Marketing site scored with `scoring-schema.json`'s
`saas_landing` profile; in-product surfaces scored with a blend of `dashboard` (for information
density/hierarchy discipline) and general defaults.
