# Surface: Landing Page

Applying `playbooks/saas-landing.md` + `ai-product.md` to Meridian's marketing homepage.

## Structure (deliberately NOT the generic default sequence, per `anti-generic-ai/common-ai-layouts.md`)
1. **Hero**: headline makes a specific claim ("Every AI answer traces back to your sources" — not
   "Powerful AI research, simplified") + an embedded, real-feeling import→synthesis demo widget
   (Framer pattern) instead of a static screenshot, immediately below the headline, no scroll needed.
2. **Persona split** (Stripe pattern): two tabs — "For individual researchers" / "For research teams" —
   each with different proof (a solo workflow example vs. a shared-workspace example) rather than one
   generic pitch.
3. **The citation guarantee**: a dedicated section (not buried in a feature list) showing a real example
   of an AI-drafted paragraph with visible, clickable source markers — this is the single differentiator
   most worth a dedicated section, per the brief's "rigorous" personality.
4. **Object-model simplicity note**: a short section explicitly stating what Meridian does NOT try to be
   (not a general chatbot, not a full document editor) — borrowing Linear's "small opinionated model"
   positioning as an actual marketing argument, not just an internal principle.
5. **CTA**: "Start with your own document" (pre-fills a real import flow) rather than a blank "Sign up."

## Why this isn't the generic template
No three-column icon-feature grid; no testimonial carousel (not yet real for a new fictional product —
this system doesn't fabricate social proof, consistent with `principles/14-content-design.md`'s honesty
requirement); persona split replaces a single generic pitch.

## Motion
Staged "reading source → drafting" reveal in the embedded demo widget only; no other decorative motion
on this page, per the design brief's motion strategy.

## Mobile
Hero demo widget becomes a simplified, pre-recorded-feeling sequence rather than a fully live interactive
demo (touch-precision and performance considerations, `principles/24-mobile-web.md`); persona tabs
become a stacked accordion.
