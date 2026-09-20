# Design Tensions

The brief for this system explicitly warns against converting research into simplistic universal rules.
This file is the mechanism that prevents that: every tension below has real evidence on both sides from
the 25-site research set (or from general, well-established design/engineering principle where the
research set didn't cover a side directly), with the actual resolving variable named. Agents and rules
elsewhere in this system should cite these tensions by name rather than re-litigating them each time.

## How to use this file
Each tension has: the two poles, one real reference (or general principle) supporting each side, and —
most importantly — **the resolving question**: the thing to actually ask about the current brief that
determines which side applies. If an agent can't answer the resolving question, that's a sign more
product context is needed before a design decision is made, not a reason to guess.

## 1. Minimalism vs. Richness
- Minimal side: By-Kin (10), Are.na (23), Kinfolk (24), Muji (25) — restraint as the brand's actual
  argument.
- Rich side: Lusion (08), Resn (06) — richness as demonstrated range/capability, explicitly chosen over
  a "safe" minimal default.
- **Resolving question**: Does this product's credibility depend on demonstrating range/capability
  (richness), or on demonstrating trustworthy restraint/focus (minimal)? A creative agency portfolio
  usually needs the former; a considered-purchase e-commerce or a focus tool usually needs the latter.

## 2. Clarity vs. Novelty
- Clarity side: Stripe's audience-segmented proof (01), Cowboy's concrete reassurance (13).
- Novelty side: Bruno Simon's spatial-navigation portfolio (07), explicitly self-described by its
  creator as "breaking the rule book."
- **Resolving question**: Is the audience here task-driven (evaluating a purchase, completing a job) or
  evaluation/delight-driven (a creative-industry audience judging craft itself)? Bruno Simon's own
  creator explicitly, publicly accepted novelty's usability cost specifically because his audience
  (Awwwards jurors, creative peers) values novelty over task speed. Most product audiences do not share
  that value.

## 3. Consistency vs. Surprise
- Consistency side: Teenage Engineering's single disciplined accent color (15), Zajno's restrained
  accents even inside a "bold" brand identity (09).
- Surprise side: Resn's per-project bespoke IA (06), A24's per-release identity (16).
- **Resolving question**: Is the thing being built one entry in a portfolio of genuinely different
  items (surprise/bespoke is appropriate), or one touchpoint in an ongoing single-product relationship
  (consistency compounds trust, surprise erodes it)?

## 4. Performance vs. Visual Spectacle
- Performance side: general engineering principle (`principles/13-performance.md`); Stripe's documented
  static-fallback for its animated hero (01) as an explicit example of spectacle designed with a
  performance escape hatch.
- Spectacle side: Iventions' per-project 3D staged scenes (21), Active Theory's real-time rendering
  specialization (22).
- **Resolving question**: Would this specific audience, on this specific device/connection profile,
  trade load time for this specific visual payoff? A luxury/creative-showcase audience on desktop
  broadband tolerates a different budget than a transactional mobile checkout flow. This is never a
  free pass to skip performance discipline — see engineering philosophy in `MASTER_PLAN.md` — it is a
  question of *how much* spectacle a given performance budget can afford, not *whether* performance
  matters.

## 5. Accessibility vs. Decorative Motion
- This tension is asymmetric by design: accessibility is a floor, not a negotiable side of a tradeoff.
  Uncommon Studio's real `user-scalable=no` failure (04) is included in this research specifically to
  demonstrate that even genuinely excellent, awarded craft can carry real accessibility defects — proof
  that this tension needs an explicit rule, not designer judgment alone. See
  `.agents/rules/accessibility-quality.md`: decorative motion must always ship with a `prefers-reduced-
  motion` fallback and never disable zoom, regardless of how the rest of this tension resolves.

## 6. Density vs. Whitespace
- Density side: general principle for dashboard/data-heavy interfaces (`principles/18-dashboard-
  design.md`) — no strong direct evidence from this creative-web-skewed research set, flagged honestly.
- Whitespace side: Stripe's two-track rhythm (01), Kinfolk's generous editorial margins (24, general
  reputation).
- **Resolving question**: Does the user's task require comparing many data points at once (density
  serves that), or does it require sustained reading/single-focus attention (whitespace serves that)?
  This tension is explicitly under-evidenced by this creative-web-skewed reference set — noted as a gap
  in `RESEARCH_LOG.md` and compensated for in `playbooks/dashboard.md` with general product-design
  principle instead.

## 7. Brand Personality vs. Usability
- Personality side: Resn's "gooey," playful self-description (06); MSCHF's deadpan-provocative stance
  (18, general reputation).
- Usability side: Linear's narrow, opinionated object model (03, general reputation) — a case where
  brand personality (opinionated, minimal) and usability are argued to be the *same* thing, not opposed.
- **Resolving question**: Often this isn't a real tension — Linear's case argues that a well-chosen
  personality (opinionated focus) *is* a usability strategy for the right audience. The tension becomes
  real specifically when personality expression (e.g., Bruno Simon's game-world nav) demonstrably costs
  task completion for a task-driven audience — then it's tension #2 (clarity vs. novelty) again.

## 8. Exploration vs. Efficiency
- Exploration side: Are.na's associative, non-hierarchical content model (23) — explicitly built for
  open-ended research/thinking, not fast retrieval.
- Efficiency side: Linear's keyboard-first, narrow object model (03) — explicitly built for fast,
  repeated task execution.
- **Resolving question**: Is the user's dominant mode "I know what I want, get me there fast" or "I'm
  not sure yet what I'm looking for, help me discover it"? Same underlying data can need genuinely
  different IA depending on which mode dominates for the actual user base.

## 9. Static Simplicity vs. Interaction
- Simplicity side: general principle — a static, well-composed page is often correct and this system
  never treats "add interactivity" as inherently an improvement.
- Interaction side: Framer's embedded functional demos (02), MSCHF's genuinely-functional provocations
  (18) — interaction chosen specifically because it proves something static content couldn't.
- **Resolving question**: Would interactivity here let the user verify/experience something they'd
  otherwise have to take on faith (use it), or is it decorative engagement with no informational payoff
  (skip it)? Framer's live demos pass this test explicitly; a spinning 3D logo with no functional tie-in
  generally does not.

## 10. Conversion vs. Artistic Expression
- Conversion side: Cowboy's concrete-reassurance-plus-desire structure (13).
- Artistic expression side: Bruno Simon's fully self-directed concept commitment (07) — explicitly a
  portfolio with no external client optimizing for conversion.
- **Resolving question**: Who is this for, and what happens if they leave without converting? A personal
  portfolio, an art project, or a brand-awareness campaign can accept artistic risk a revenue-dependent
  commerce or lead-gen page cannot. Ask what business outcome (if any) this specific page is accountable
  for before deciding how much artistic risk it can carry.

## 11. Desktop Composition vs. Mobile Practicality
- This is the most under-evidenced tension in the research set (see `synthesis/08-responsive-
  patterns.md` — no live rendered mobile inspection was possible for any of the 25 references).
  General principle: a composition that depends on generous whitespace and large-scale gesture (Bruno
  Simon's driving mechanic, Iventions' staged 3D scenes) needs an explicitly *redesigned*, not merely
  reflowed, mobile experience — see `playbooks/mobile-web.md` and `principles/11-responsive.md`, which
  carry more weight than this research set's own (thin) evidence on this specific tension.

## The meta-principle
None of these eleven tensions has a universal winner. Every rule file in `.agents/rules/` and every
principle file in `design-intelligence/principles/` that touches one of these axes must name the
resolving question, not just assert a default — this is the single most important behavioral
requirement this synthesis produces, and `.agents/rules/design-director.md` enforces it directly.
