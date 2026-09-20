# Lusion

## Metadata
- Official URL: https://lusion.co
- Awwwards URL: https://www.awwwards.com/sites/lusion (studio site v2, SOTD, score 7.8/10) and
  https://www.awwwards.com/sites/lusion-v3 (later SOTD submission) — two generations of the studio's
  own site independently recognized.
- Category: C — Experimental / Interactive
- Award / recognition: CONFIRMED, primary-source, very high confidence. Studio site: Site of the Year
  from FWA, Awwwards, and CSSDA simultaneously (per the studio's own Codrops-published account, an
  independent design-industry publication, not just self-reported on their own site). Individual
  project "EverSwap" independently confirmed (Psychoactive Studios, dated July 2026) as Awwwards Site
  of the Day + Developer Award, June 2026.
- Date/year: Studio founded 2017; own-site recognitions span multiple version releases; most recent
  independently-confirmed project award June 2026.
- Studio/company: Lusion, founded by Edan Kwan (self-taught, per Codrops profile — prior background in
  music, then design/code, freelance, an agency role in New York, then independent practice). Client
  list independently confirmed: Coca-Cola, Porsche, Max Mara, Google.
- Relevant technologies: Three.js, WebGL, real-time custom 3D asset pipelines — OBSERVED directly
  (Awwwards tag data + the studio's own published case study on their asset-creation process).
- Accessibility observations: UNKNOWN — not independently verified this pass.
- Responsive observations: UNKNOWN — not independently verified this pass.
- Verification: LIVE. Award confidence: VERY HIGH.

## 1. First Impression
OBSERVED (studio's own published case-study reasoning): the studio explicitly rejected a "gorgeously
minimalist" default for their own site, on the stated grounds that a minimal theme wouldn't let them
demonstrate the technical/creative range they wanted to be known for — a direct, self-aware statement
that visual restraint was consciously rejected here as the wrong choice for this specific brief
(a real-time-graphics studio's own portfolio), not a universal rule.

## 2. Information Architecture
OBSERVED (Awwwards tag data): the studio's site is organized around Navigation and Interaction as
named, awarded "elements" in their own right — meaning wayfinding itself was treated as a primary
craft deliverable, not a secondary utility layer bolted onto content.

## 3. Layout System
OBSERVED (Awwwards element tags): "WebGL scroll navigation" and full-screen, 3D-first composition are
named, specifically catalogued techniques from this site — scroll position is used to drive a 3D scene
directly rather than scroll being a passive 2D-content reveal mechanism.

## 4. Typography
UNKNOWN at the specific typeface/scale level — not independently verified this pass.

## 5. Color System
OBSERVED (Awwwards automated palette extraction): a strict two-color palette, pure black (#000) and
pure white (#fff) — a deliberately extreme, high-contrast, achromatic base that puts 100% of the
studio's color expression into the real-time 3D content itself rather than into UI chrome. This is a
disciplined, specific choice: a studio whose product is rich visual/lighting work benefits from a
neutral frame that never competes with it.

## 6. Imagery
OBSERVED (studio's own published case study on the process): rather than following a conventional
creative → design → development handoff, Lusion's design and real-time-development disciplines work
together from the start on *custom 3D assets* specifically, treating bespoke 3D asset creation as an
underexplored craft area for the web that most competing "beautifully crafted WebGL" sites at the time
had not invested in — a specific, named point of differentiation in their own words.

## 7. Interaction Design
OBSERVED (Awwwards tags + Codrops profile): interaction is treated as a primary deliverable equal to
visual design, with named recurring project types including monthly self-initiated "experiments"
(e.g., "Gemini," a real-time car visualization contrasting two rendering styles; "My Little Storybook,"
a small illustrated interactive narrative) used explicitly as fast, low-stakes R&D vehicles distinct
from client work.

## 8. Motion Design
UNKNOWN at the specific timing/easing level this pass. INFERRED from independent industry description
(Psychoactive Studios, current, dated source): "their motion work is unusually fluid" is a specific,
named, independently-given descriptor distinguishing Lusion's motion quality within a competitive field
of WebGL studios, not a generic compliment — the same source specifically flags rival studios
(Active Theory, makemepulse) by different distinguishing qualities (game-engine thinking; playful/
performant balance), suggesting these distinctions are considered, not interchangeable praise.

## 9. Responsive Design
UNKNOWN — not independently verified this pass.

## 10. UX Strengths
- Explicitly running a monthly "experiment" program as sanctioned R&D time, separate from client
  deliverables, keeps technical range visibly current without requiring every experiment to become
  client-facing.
- Treating interaction/navigation as an equally-awarded craft discipline alongside visual design keeps
  a heavy-3D site from becoming beautiful-but-inert.

## 11. UX Weaknesses
Not independently observable this pass without rendered inspection; none fabricated. Structurally
worth naming: an independent source explicitly notes rival studios in this same category are evaluated
on "3D used sparingly and exactly" versus "3D that earns its place rather than decorating it" as a
distinguishing virtue — implying that within this competitive field, overuse of 3D/motion for its own
sake is a recognized, real risk category generally, which any heavy-WebGL studio (including this one)
must actively guard against.

## 12. Technical Craft
- OBSERVED, primary-source: a specifically named, deliberate cross-discipline workflow innovation
  (design and real-time development collaborating directly on custom 3D assets, rather than a linear
  handoff) is credited by the studio itself as the reason their site could differentiate technically
  from contemporaries.
- Independent, current industry source (Psychoactive Studios, 2026) explicitly describes Lusion's work
  as "the ones other developers take apart in devtools to figure out how they did it" — a specific,
  concrete form of peer technical respect distinct from general visual praise.

## 13. Design Principles Extracted
1. **Minimalism is a choice appropriate to a brief, not a default virtue** — the studio explicitly
   rejected it for their own site because their brief (demonstrate technical/creative range) needed
   richness. Use restraint when the goal is clarity/trust; use richness when the goal is demonstrating
   range or spectacle itself is the value proposition. Failure mode: defaulting to either richness or
   minimalism without checking which the actual brief calls for.
2. **Collapse the creative → dev handoff for bespoke technical assets** — when a differentiator depends
   on tight visual/technical integration (custom shaders, custom 3D assets), have design and
   development collaborate from the start rather than passing static specs downstream. Failure mode:
   this workflow is slower and more resource-intensive than a linear handoff — appropriate for
   flagship/differentiating work, not for high-volume production.
3. **Run small, self-initiated, low-stakes experiments as a formal practice**, separate from client
   work, to keep technical range visibly current and to R&D ideas before they're needed for a client
   brief. Failure mode: experiments that never inform real work become a disconnected side hobby rather
   than a genuine capability pipeline.
4. **An extreme, achromatic UI-chrome palette (pure black/white) can be the correct choice specifically
   when the content itself (real-time 3D, video) carries all the color** — it removes any risk of
   chrome competing with content. Failure mode: applying pure black/white to a content type that is
   itself low-contrast or monochrome, leaving nothing to carry visual interest at all.

## 14. Anti-Patterns
Do not add 3D/WebGL richness as decoration disconnected from a demonstrated technical differentiator —
independent industry commentary in this exact category explicitly distinguishes studios by whether
their 3D/motion "earns its place" versus merely decorates, treating decorative overuse as a known,
named failure mode even within a field that specializes in visual spectacle.

## 15. Transferable Patterns
- Scroll-driven 3D scene control (scroll position as a 3D-camera/state driver, not just a 2D reveal).
- Monthly self-initiated experiment program as a design/technical R&D practice.
- Achromatic UI chrome (pure black/white) reserved for content types that themselves carry full color.
- Combined design+engineering ownership of bespoke visual assets from concept stage.

## 16. Reusable Component Ideas
- "Experiment" archive/lab section distinct from client-facing case studies.
- Scroll-to-3D-state binding component for hero/showcase sections.
- Two-color, high-contrast UI chrome theme for content-forward, visually rich pages.

## 17. Design Tokens / Approximate Measurements
Confirmed dominant palette (OBSERVED, Awwwards auto-extraction): #000000, #FFFFFF. No further
spacing/type-scale values are estimated for this entry given no rendered inspection was available this
pass.

## 18. Why This Site Is Excellent
Rare triple confirmation (FWA + Awwwards + CSSDA Site of the Year simultaneously, per an independent
publication) for a self-initiated, self-funded studio site, achieved by consciously rejecting the
"safe," trend-following minimal option in favor of a richer approach specifically suited to
demonstrating the studio's actual differentiator — real-time 3D craft.

## 19. Lessons for AI-Generated UI
The central, most transferable lesson is procedural, not visual: the choice between restraint and
richness should be derived explicitly from what the brief needs to demonstrate, stated as a reason (as
Lusion's own case study does), rather than defaulted to either extreme. An agent should be able to
articulate, in one sentence, *why* a given level of visual richness serves this specific product's
goal — if it can't, that's a signal the richness is decorative rather than intentional.

## 20. Evidence
- Awwwards listings: awwwards.com/sites/lusion, awwwards.com/sites/lusion-v3, awwwards.com/lusion/.
- Awwwards studio case study: awwwards.com/case-study-for-lusion-by-lusion-winner-of-site-of-the-month-may.html.
- Independent profile: Codrops, tympanus.net/codrops/2026/04/13/lusion-where-digital-craft-meets-
  ambitious-experimentation/ (dated April 2026).
- Independent comparative industry source: Psychoactive Studios content hub, dated July 2026 (used for
  the EverSwap award confirmation and the comparative "earns its place" framing).
- Studio site: lusion.co, lusion.co/about/.
