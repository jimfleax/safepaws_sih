# Workflow: /upgrade-generic-ui

Specifically transforms an existing UI from generic → intentional → premium, using
`design-intelligence/anti-generic-ai/` as the core toolkit.

## Steps

**1. DIAGNOSE** — Run the full `design-intelligence/anti-generic-ai/generic-ui-signatures.md` checklist
against the existing UI. Name every signature present specifically (which section, which element) —
not a vague "this feels generic" impression.

**2. FIND THE REAL DIFFERENTIATOR** — Adopt `agents/design-director.md` briefly: what is actually true
and specific about this product/brand/audience that hasn't shown up in any current design decision?
(`design-intelligence/principles/08-brand.md`)

**3. REPAIR PER SIGNATURE** — For each flagged signature, apply the matching strategy from
`design-intelligence/anti-generic-ai/quality-repair-strategies.md`:
   - Generic gradient → reduce to brand-specific atmosphere-only use, or remove.
   - Card overuse → un-wrap non-peer content; vary size by real importance where cards remain.
   - Glassmorphism → remove where nothing is behind it to blur.
   - Uniform spacing → derive from actual content relationships (`design-intelligence/tokens/
     spacing.md`).
   - Typographic sameness → establish real hierarchy; reserve one display voice for one moment.
   - Purposeless motion → complete the TRIGGER→MOTION→PURPOSE chain or cut it.
   - Icon overuse → remove non-informational icons.
   - Generic hero → rewrite with a product-specific claim; establish one primary CTA.

**4. REPLACE, DON'T JUST REMOVE** — Every repair must trace to the real differentiator found in step 2
— cutting decoration without replacing the interest it provided leaves a flat page, which is not an
upgrade.

**5. RE-RUN THE CHECKLIST** — Confirm the repaired version actually passes
`generic-ui-signatures.md`'s one-sentence test before calling this workflow complete.

**6. FINAL QUALITY GATE** — Run `.agents/rules/final-quality-gate.md` in full before declaring done.

## Output
A before/after diagnosis (which signatures were present, what replaced each, and the specific,
traceable reason for each replacement) alongside the actual repaired implementation.
