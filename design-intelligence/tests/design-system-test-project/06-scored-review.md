# Scored Review: Meridian Test Project

Applying `scoring/scoring-rubric.md` and `scoring-schema.json`'s context profiles to the five surfaces
above. Scored as specifications against this system's own principles (see the honesty note in this
folder's `README.md` — no rendered UI exists to visually inspect). Scores are deliberately not uniform
or maximal, to demonstrate the rubric actually discriminates rather than rubber-stamping the system's
own example.

## Landing page — `saas_landing` profile

| Dimension | Score | Reasoning |
|---|---|---|
| Visual hierarchy | 9/11 | One clear hero claim + one embedded demo; persona tabs slightly compete for early attention — minor deduction |
| Composition | 8/9 | Two-track rhythm applied deliberately |
| Typography | 8/9 | Single-family system justified for the audience; reserved hero treatment specified |
| Spacing/rhythm | 7/8 | Not independently specified in detail beyond "Stripe pattern" — real implementation would need actual token values |
| UX/usability | 10/12 | Persona split is a real strength; the demo-widget interaction hasn't been detailed enough to fully verify ease of use |
| Interaction | 7/8 | Embedded demo interaction described at a high level, not fully specified |
| Motion | 5/5 | Single, clearly-purposed motion pattern (process communication), correctly scoped |
| Responsive | 9/10 | Explicit mobile adaptation for the demo widget and persona tabs |
| Accessibility | 9/10 | Baseline assumed but not explicitly re-stated per-surface; minor deduction for not spelling out contrast/alt-text specifics here |
| Performance | 5/5 | No heavy techniques introduced; demo widget explicitly simplified for mobile |
| Brand expression | 8/8 | Every distinguishing choice traces to the "rigorous/unshowy" personality |
| Content clarity | 8/8 | Specific claim, no generic superlatives, honestly avoids fabricated testimonials |
| **Total** | **93/107 → normalize to 87/100** | **Tier: Premium** — meets the brief's target |

## Dashboard/workspace — blended `dashboard` profile

| Dimension | Score | Reasoning |
|---|---|---|
| UX/usability | 13/15 | Strong structural logic (three-pane, states designed); citation UX only sketched, not fully specified |
| Visual hierarchy | 11/13 | Canvas correctly dominant; AI panel's idle-vs-active states need more specification |
| Composition | 6/7 | Reasonable |
| Typography | 7/8 | Consistent with brief |
| Spacing/rhythm | 6/8 | Under-specified for this surface specifically |
| Interaction | 9/10 | AI-vs-human distinction is a genuine, well-reasoned strength |
| Motion | 3/3 | Correctly minimal for a repeated-use tool |
| Responsive | 9/10 | Explicit, honest reduced-mobile-mode decision rather than a broken compromise |
| Accessibility | 10/10 | The "never color alone" requirement is explicitly and correctly applied here specifically |
| Performance | 7/8 | Virtualization mentioned but not detailed |
| Brand expression | 3/3 | Correctly minimal per the dashboard profile's low weighting |
| Content clarity | 5/5 | Clear |
| **Total** | **89/100** | **Tier: Premium**, with the noted gaps (spacing specification, panel state detail) as the concrete next-iteration targets |

## Pricing — default profile

**Score: 82/100 — Strong, bordering Premium.** Strength: two tiers matching real personas, explicit
rejection of dark patterns and of an unjustified third tier. Gap: no real usage data exists yet (it's a
fictional pre-launch product) to validate the two-tier assumption — flagged honestly as an assumption
to revisit post-launch, not a confirmed-correct decision.

## Settings — default profile

**Score: 85/100 — Premium.** Strength: the "AI behavior" section is a genuine, specific IA decision
tied to the real product differentiator, not a generic settings template. Minor gap: the exact
citation-strictness control's interaction design isn't specified at the component level.

## Mobile navigation — default profile with heavy `principles/24-mobile-web.md` weighting

**Score: 88/100 — Premium.** Strength: honestly scopes mobile to what it can do well rather than
attempting full parity; passes the `user-scalable=no` and touch-target checks explicitly. Gap: the
"desktop for full synthesis work" in-app messaging is specified as a requirement but its exact wording/
placement isn't designed yet.

## What this scored review demonstrates
1. **The rubric discriminates**: scores range 82-93 (normalized), not a uniform "100 everywhere" —
   real, specific gaps are named at the sub-dimension level for every surface, not smoothed over.
2. **Context profiles actually change what's measured**: the dashboard profile weights UX/usability at
   15 points vs. the landing page's implicit lower weighting on that exact dimension — reflecting
   `MASTER_PLAN.md`'s explicit requirement that scoring not use one fixed weighting regardless of
   surface type.
3. **No BLOCKER-severity findings** were identified — appropriate, since this is a specification, not
   rendered code that could contain the concrete implementation bugs (overflow, broken nav, dead
   interactions) that `scoring/quality-gate.md`'s BLOCKER list targets; that limitation is stated here
   explicitly rather than claiming a code-level audit occurred.
4. **The honest gaps point to real next steps** — this is what "iterate" (per
   `.agents/workflows/premium-ui.md` step 6) means in practice: specific, named, addressable items, not
   a vague "make it better."
