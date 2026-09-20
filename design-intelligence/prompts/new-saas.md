# Prompt Template: New SaaS Product (Marketing + App)

Use when: launching a new SaaS product needing both a marketing site and an in-product app surface.

**Route to**: `/new-project` — this spans multiple surface types and needs per-surface briefs, not one
generic brief.

**Fill in before starting**:
- Product, audience, and whether the marketing site and the app itself have different audiences (often
  true: marketing targets a buyer, the app targets a daily user, per `principles/23-saas-product.md`).
- Pricing model (affects `patterns/pricing.md` structure).

**Then**: `playbooks/saas-landing.md` for the marketing surface, `playbooks/saas-app.md` for the
in-product surface — these have different scoring profiles (`scoring-schema.json`'s `saas_landing`
profile vs. a more dashboard-like weighting for the app) and different motion/density defaults.
Reference Stripe/Framer/Linear (`research/awwwards/01`, `02`, `03`) for principles specific to each
surface, not one undifferentiated treatment across both.
