# Quality Repair Strategies

The action layer for this entire subsystem — what to actually DO once a generic-AI signature is
detected, organized by signature so an agent can go directly from diagnosis to fix. Used directly by
`.agents/rules/anti-generic-ui.md` and the `/upgrade-generic-ui` workflow.

## General repair sequence (apply in this order)
1. **Diagnose** — run `generic-ui-signatures.md`'s checklist and name every signature present.
2. **Ask the one-sentence test** per flagged element — can a specific reason be stated for this exact
   product? If yes, it may not actually be a failure; document the reason and keep it. If no, proceed.
3. **Find the real differentiator** — what is actually true and specific about this product/brand/
   audience that hasn't yet shown up in any design decision? (`principles/08-brand.md`)
4. **Replace, don't just remove** — cutting a generic gradient without replacing the interest it was
   (weakly) providing leaves a flat page; replace with a decision traceable to the real differentiator
   found in step 3 (a specific composition choice, a real product demo, a considered typographic device).
5. **Re-run the checklist** on the repaired version before calling it done.

## Per-signature quick reference
- Generic gradient → `bad-gradient-patterns.md` repair steps (reduce to atmosphere-only, brand-specific
  color, or remove).
- Card overuse → `card-overuse.md` (un-wrap non-peer content; vary size by real importance where cards
  are kept).
- Glassmorphism → `glassmorphism-overuse.md` (remove where nothing is behind it; verify contrast where
  kept).
- Spacing uniformity → `spacing-failures.md` (derive from content relationships, not mechanical
  consistency).
- Typography sameness → `typography-failures.md` (establish real scale/hierarchy; reserve one voice for
  one moment).
- Motion without purpose → `motion-failures.md` (complete the TRIGGER→MOTION→PURPOSE chain or cut).
- Icon overuse → `icon-overuse.md` (remove non-informational icons; keep only functional ones).
- Generic hero → `hero-failures.md` (product-specific claim, one CTA, purposeful or no motion).
- Dashboard genericness → `dashboard-failures.md` (urgency-ranked hierarchy, contextualized numbers).
- Mobile-as-afterthought → `mobile-failures.md` (redesign priority, never disable zoom).

## What NOT to do during repair
Don't swap one generic pattern for a different generic pattern (e.g., replacing a purple gradient with
an equally arbitrary but currently-trendy alternative) — every repair must trace to something specific
about *this* product, per step 3 above, or the repair hasn't actually solved the underlying problem.
