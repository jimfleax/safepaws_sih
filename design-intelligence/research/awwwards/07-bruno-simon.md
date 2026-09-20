# Bruno Simon — Portfolio

## Metadata
- Official URL: https://bruno-simon.com
- Awwwards URL: https://www.awwwards.com/sites/bruno-simon-portfolio (SOTD 8.04/10) and
  https://www.awwwards.com/sites/brunos-portfolio (a separate SOTD listing, 8.11/10) — two distinct
  Awwwards submission records exist, consistent with the site having been substantially rebuilt/updated
  more than once (an Awwwards case-study page dated March 2026 describes ongoing new features: a
  weather system, day-night cycles, seasonal changes — this is a living, actively-maintained portfolio,
  not a frozen 2019 artifact).
- Category: C — Experimental / Interactive
- Award / recognition: CONFIRMED, primary-source, very high confidence: Awwwards Site of the Day
  (both versions), Awwwards Site of the Month (November, per Awwwards' own announcement), and Awwwards
  Site of the Year 2020 (independently confirmed by Creative Bloq). Score breakdown OBSERVED directly
  from Awwwards: Design 40%-weighted ~7.9–8.05, Usability 30%-weighted ~7.5–7.8, Creativity
  20%-weighted ~8.6–8.9, Content 10%-weighted ~8.1–8.2.
- Date/year: Original launch 2019; actively updated through at least March 2026 per Awwwards' own
  published case-study page.
- Studio/company: Solo work by Bruno Simon, a Paris-based creative developer (previously at Immersive
  Garden per his own case-study writing).
- Relevant technologies: CONFIRMED directly from the site's own stated "About the stack" content:
  Three.js (with TSL enabling both WebGL and WebGPU), physics via a Cannon.js-family engine (per his
  own 2019 case study), GSAP, Blender for 3D modeling. Source code and even the Blender files are
  published on GitHub under MIT license per the site's own text — an unusually high degree of technical
  transparency for an award-winning experimental site.
- Accessibility observations: OBSERVED, self-acknowledged limitation, not from this system's own
  testing: Creative Bloq's independent coverage explicitly notes "isn't something that will work for
  everyone" — a car-driving-as-navigation metaphor is inherently a motor/vision-dependent interaction
  model with real accessibility limits that the design accepts as a tradeoff.
- Responsive observations: UNKNOWN precisely how the driving mechanic adapts to touch/mobile — not
  independently verified this pass.
- Verification: LIVE, actively maintained. Award confidence: VERY HIGH.

## 1. First Impression
OBSERVED (from the creator's own published case study): the experience deliberately opens with the
3D universe assembling itself from the ground up and the car "falling down from above with a little
bounce" specifically so the visitor notices the physics simulation is real before being asked to do
anything — the first few seconds are a demonstration, not an instruction.

## 2. Information Architecture
OBSERVED (creator's own account): navigation is entirely spatial — driving into a physical object or
zone reveals a project or bio section, replacing a conventional nav menu with an explorable 3D world.
The only written content on first load is a minimal instruction ("use arrow keys") placed directly on
the in-world ground plane rather than in a UI overlay.

## 3. Layout System
OBSERVED (creator's account): the world is authored as five discrete sections modeled individually in
Blender, then composed into one continuous island/scene — a "layout system" here is literal spatial
composition (placement of objects in 3D space) rather than a 2D grid, and the placement of the title
text was a deliberate choice tied to where the car's default camera framing would put it.

## 4. Typography
UNKNOWN at the specific typeface/scale level from available sources this pass; the site's own
described priority is spatial/physical staging over conventional text hierarchy, since the primary
content units are 3D objects representing projects, not text blocks.

## 5. Color System
UNKNOWN at the specific token level. OBSERVED from Awwwards' own automated palette extraction: a
two-color dominant palette (a warm terracotta/orange, HEX #DF6C4F, and a warm yellow, HEX #ECD06F) is
recorded for the original submission — consistent with an intentionally warm, toy-like world rather
than a neutral portfolio backdrop.

## 6. Imagery
OBSERVED (creator's own account, current case study): all visual content is modeled 3D geometry, not
photography or flat illustration — including personal, idiosyncratic touches (the creator modeled his
own dog and included it as a world object). Recent updates add a full simulated weather/season system
(rain, snow accumulation, freezing water, wind affecting foliage) shared identically by every visitor
at the same real-world moment — imagery here is a living simulation, not a static asset.

## 7. Interaction Design
OBSERVED: the entire site is a physics-based driving game repurposed as navigation. The creator's own
case study explains a specific, deliberate constraint decision — choosing a bird's-eye car-driving
control scheme instead of a first-person one specifically because a first-person 3D control scheme
would be too difficult for a non-gamer visitor to pick up unaided.

## 8. Motion Design
OBSERVED (creator's account): a hand-tuned secondary-motion detail is explicitly described — a car
antenna that reacts to the *opposite* of the car's acceleration, then eases back to center, added
purely for physical believability, not for navigation function. This is a clear, concrete example of
motion used for tactile believability rather than for feedback/hierarchy purposes.
TRIGGER → MOTION → PURPOSE → USER VALUE: player accelerates/decelerates → antenna whips opposite to
acceleration, then eases back → sells the physical weight/reality of the toy-car world → makes an
otherwise abstract control scheme feel tangible and fun to keep using.

## 9. Responsive Design
UNKNOWN precisely; a keyboard-driving-based interaction model on a device with no physical keyboard is
a real, unresolved-in-this-research design question, flagged rather than assumed solved.

## 10. UX Strengths
- Teaching the interaction model through demonstration (the physics-based intro drop) rather than
  written instruction.
- A constraint-driven interaction choice (bird's-eye, not first-person) made explicitly for
  accessibility-to-skill-level reasons, not just aesthetic preference.
- Radical technical transparency (open-sourced code and even source art files) that itself became part
  of the project's ongoing reputation and educational value in the creative-developer community.

## 11. UX Weaknesses
Explicitly, independently acknowledged even by sympathetic coverage (Creative Bloq): this pattern
"isn't something that will work for everyone" and "breaks the rule book" — meaning it is knowingly
inappropriate as a general portfolio pattern, not just an edge case. A visitor who cannot use a
keyboard, who has a motor impairment, or who simply wants to quickly scan for "does this person have
experience with X" is meaningfully worse served here than by a conventional list. Load cost of a full
3D physics/weather simulation on constrained devices is a genuine, real concern inherent to the format
— UNKNOWN whether adequately mitigated, not assumed fine.

## 12. Technical Craft
- OBSERVED, primary-source: real, published stack (Three.js/TSL for WebGL+WebGPU, GSAP, physics
  engine, Blender pipeline), open-sourced under MIT license including source art assets — a genuinely
  unusual and valuable level of technical disclosure for this category of site.
- OBSERVED: continued technical investment years after initial launch (SDF-textured foliage, shared
  real-time weather simulation across all visitors) rather than a one-time award submission left static.

## 13. Design Principles Extracted
1. **Teach an unconventional interaction model by demonstration, not instruction** — a brief,
   unmissable physics moment (object falls, bounces, settles) communicates "this responds to real
   physics" faster and more memorably than a text tooltip. Use for genuinely novel interaction
   metaphors. Avoid for conventional UI, where instructional demonstration is unnecessary overhead.
2. **Choose the least-skill-demanding version of a novel interaction, deliberately** — the creator
   explicitly rejected first-person control for being too hard for non-gamers. When inventing a new
   interaction model, actively pick the easiest variant that still serves the concept. Failure mode:
   picking the version that is most impressive to build rather than most usable to encounter.
3. **A single, personal, well-executed secondary-motion detail (the antenna) can do more for perceived
   craft than broad but shallow polish** — invest disproportionately in the details a user will
   directly manipulate. Failure mode: secondary motion so subtle it goes unnoticed, wasting the effort;
   needs to be tied to a frequent, repeated user action to pay off.
4. **Radical build transparency (open source, published devlogs) can itself become part of a
   portfolio's value and reputation**, especially for a creative-technical audience. Use when the
   audience specifically includes other practitioners. Not relevant/necessary for a general commercial
   audience.

## 14. Anti-Patterns
Do not adopt a fully game-based navigation metaphor as a default portfolio or product pattern — this
is explicitly, self-consciously a "rule-breaking," high-risk, low-generalizability format that works
here because the audience (creative developers, Awwwards jurors) specifically values technical
novelty and play, and because the creator explicitly accepted the accessibility tradeoff as the price
of the concept. Most products and most audiences should not accept that tradeoff.

## 15. Transferable Patterns
- Spatial/game-world navigation replacing conventional menus (high-risk, narrow-audience pattern).
- Physics-based intro sequence as implicit instruction.
- Constraint-driven interaction-model simplification (choosing the easier of two novel control schemes).
- Hand-authored secondary motion tied to a core, frequent interaction.

## 16. Reusable Component Ideas
- "Drop and settle" physics-based entrance animation for a hero object.
- Secondary-motion detail generator for any object the user directly controls (rotation lag, overshoot,
  ease-back).
- Ambient, shared, time-of-day/weather-reactive background system for a persistent creative space.

## 17. Design Tokens / Approximate Measurements
Dominant palette (OBSERVED, Awwwards auto-extraction, original submission only): #DF6C4F (warm
terracotta), #ECD06F (warm yellow). No spacing/type-scale tokens are meaningful for this entry — the
site's layout unit is 3D world-space, not a 2D grid.

## 18. Why This Site Is Excellent
It commits fully to a single, coherent, technically ambitious idea — a physically real, playable toy
world standing in for a portfolio — rather than compromising it into a hybrid. Every design decision
documented by the creator himself (control scheme, camera framing, secondary motion) traces back to
serving that one idea, and the creator explicitly, publicly accepts the resulting tradeoffs rather
than pretending the format has no downsides.

## 19. Lessons for AI-Generated UI
This is the clearest reference in the set for a specific, important lesson: a bold, novel interaction
concept should be evaluated by whether every supporting decision serves *that specific concept*, not by
how impressive any single technique looks in isolation. An AI agent should also learn from the explicit
accessibility tradeoff disclosure — a genuinely experimental pattern like this is appropriate only when
the audience and stakes make that tradeoff acceptable (a personal creative portfolio), and inappropriate
as a default for products where broad usability is the actual goal.

## 20. Evidence
- Awwwards listings: awwwards.com/sites/bruno-simon-portfolio and awwwards.com/sites/brunos-portfolio
  (score breakdowns OBSERVED directly).
- Awwwards case-study page (March 2026): awwwards.com/brunos-portfolio-case-study.html.
- Creator's own Medium case study: medium.com/@bruno_simon/bruno-simon-portfolio-case-study-960402cc259b
  (paraphrased, not reproduced verbatim beyond brief attributed fragments).
- Creator's own site content: bruno-simon.com (About/stack section, fetched via search).
- Independent press coverage: Creative Bloq, "This might be the coolest design portfolio you'll ever
  see."
