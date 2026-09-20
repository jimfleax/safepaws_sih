# Resn

## Metadata
- Official URL: https://resn.co.nz
- Awwwards URL: https://www.awwwards.com/resn/ — directory record shows 76 Honorable Mentions, 61
  Site of the Day, 11 Site of the Month, 2 Site of the Year (studio-wide totals, OBSERVED directly
  from Awwwards' own New Zealand studio directory listing).
- Category: B — Creative Studio / Agency
- Award / recognition: CONFIRMED, very high confidence, primary-source: 2× Awwwards Agency of the Year
  (2017, 2018), Awwwards Site of the Year for "Pioneer – Corn Revolutionized" (2021), CSS Design Awards
  Agency of the Year, FWA Hall of Fame + Club 100 member, 300+ total industry awards including Cannes
  Lions, Webbys, One Show Pencils, D&AD per Communication Arts' independent profile.
- Date/year: Studio active since early 2000s; awards confirmed span 2013–2026.
- Studio/company: Resn, headquartered Wellington, New Zealand, satellite office Amsterdam. Client
  roster (independently confirmed): YouTube, Amazon, Maserati, Ford, adidas, Spotify, Netflix, Airbnb,
  HBO, VanMoof.
- Relevant technologies: Fragment-shader/ray-marching WebGL techniques are OBSERVED as explicitly named
  by the studio itself for at least one project ("FunGUI" — "ray marching technique creates a
  fully-procedural environment in one... fragment shader").
- Accessibility observations: UNKNOWN — not independently verified this pass.
- Responsive observations: A dedicated `index_mobile.html` URL structure is OBSERVED in search
  results, suggesting a historically separate mobile experience for at least part of the site — worth
  independent re-verification, not assumed current.
- Verification: LIVE. Award confidence: VERY HIGH (primary-source Awwwards directory data).

## 1. First Impression
INFERRED from the studio's own repeatedly-quoted philosophy (Communication Arts interview): Resn
explicitly rejects having "a visual style," framing their work instead as an engineered *feeling* —
"the animation, layout, visuals, sound, what you're doing with the site and how you play with it." The
studio's own chosen word for their output, "gooey," signals a self-aware, playful positioning distinct
from the more austere language used by many award-winning studios.

## 2. Information Architecture
UNKNOWN at the current-homepage structural level (no rendered inspection this pass). OBSERVED
structurally at the case-study level: individual project sites are built as fully standalone
experiences with their own domains/subdomains (e.g., `sorrynotsorry.resn.co.nz`, `fungui.resn.co.nz`)
rather than living inside one templated portfolio shell — each project gets a bespoke information
architecture suited to its own concept.

## 3. Layout System
UNKNOWN at the specific grid level for the current site. INFERRED from the standalone-microsite pattern
above: layout decisions are made per-project rather than inherited from a fixed studio template, which
is consistent with the "no single visual style" self-description.

## 4. Typography
UNKNOWN — not independently verified this pass.

## 5. Color System
UNKNOWN — not independently verified this pass.

## 6. Imagery
UNKNOWN for the studio's own current homepage. INFERRED from named project work: character-based
animation (a partnership with an animation studio to create branded "Navigator" characters for an AI
data-ownership product) is used as a deliberate humanizing device for otherwise abstract/technical
subject matter (data ownership).

## 7. Interaction Design
OBSERVED (self-described by the studio): procedurally generated, click-to-regenerate interactive
"toys" (e.g., the fungus-inspired "FunGUI" piece) are a recurring studio output — interaction here is
explicitly generative/playful rather than purely navigational.

## 8. Motion Design
UNKNOWN at the implementation/timing level this pass. What is independently confirmed: WebGL/shader-
based real-time generative visuals are a named, recurring studio technique, not a one-off.

## 9. Responsive Design
UNKNOWN — flagged, not assumed. A legacy `index_mobile.html` pattern appearing in search results is
noted as a historical signal only, not confirmed as the current approach.

## 10. UX Strengths
- Treating each major project as its own bespoke experience (own domain, own concept, own interaction
  model) avoids the "everything looks like a re-skin of the same template" problem that afflicts many
  agencies with a strong house style.
- Building interactive, playful, procedurally-generated pieces as a category of work in their own
  right (not tied to a specific client deliverable) keeps the studio's technical range visibly current.

## 11. UX Weaknesses
Not independently observable this pass without rendered inspection of the current site; none
fabricated. Structurally worth naming: a studio whose recognized signature is real-time generative
WebGL/shader work carries an inherent, category-wide performance and device-compatibility risk
(older/low-power devices, reduced-motion users) — a general risk of the pattern the studio operates in,
not a confirmed defect observed here.

## 12. Technical Craft
- OBSERVED (self-disclosed technique): fragment-shader ray marching used to build a fully-procedural
  generative scene — a genuinely advanced real-time graphics technique, not just CSS/JS animation.
- Independent confirmation of Awwwards Developer Award-caliber recognition across many projects
  (61 Site of the Day requires meeting Awwwards' combined design+usability+creativity+content
  scoring bar, not visual score alone) is real evidence of sustained technical execution, not only
  visual polish.

## 13. Design Principles Extracted
1. **A studio can have a consistent *feeling* without a consistent visual style** — the throughline is
   process and craft standard, not a repeatable aesthetic. Use when a studio's differentiator is
   technical/interaction range rather than a signature look. Failure mode: "no style" becomes an excuse
   for inconsistent quality rather than genuine range — the discipline has to show up somewhere
   (Resn's case: interaction/technical craft).
2. **Give major projects their own bespoke information architecture instead of forcing a shared
   template** — appropriate when each project's concept genuinely differs enough to warrant it. Failure
   mode: bespoke-everything at agency scale is expensive and can fragment brand recognition if taken
   too far — Resn mitigates this by keeping the studio's own umbrella site as the consistent anchor.
3. **Build non-commissioned generative/playful pieces as a genre of their own** — demonstrates range and
   keeps technical skills visibly current outside client constraints. Failure mode: a technical toy with
   no point of view reads as a tech demo, not craft — Resn's examples pair the generative technique with
   a specific creative concept (fungal forms, an apology generator), not technique alone.

## 14. Anti-Patterns
Do not adopt real-time shader/WebGL techniques as a default without the underlying performance and
fallback discipline this category of work requires — the studio's Developer Award-caliber recognition
implies that discipline was present, but the technique itself is not automatically safe to use broadly.

## 15. Transferable Patterns
- Bespoke per-project information architecture over one enforced portfolio template.
- Standalone generative/interactive "toy" pieces as a genre of studio output.
- Character-based animation to humanize abstract/technical subject matter.

## 16. Reusable Component Ideas
- Procedurally-generated interactive visual module (shader- or canvas-based) with a clear creative
  concept, not just a tech demo.
- Standalone case-study micro-experience pattern (distinct domain/branding per major project).

## 17. Design Tokens / Approximate Measurements
Not estimated — no rendered/visual data available in this pass for the current site; the studio's
own stated position (no single visual style) also makes a single token set an inappropriate summary of
their work in the first place.

## 18. Why This Site Is Excellent
Extremely rare, independently confirmed longevity and volume of recognition (300+ awards, two Agency
of the Year titles six years apart, a Site of the Year win) across genuinely different creative
concepts for genuinely different global brands — evidence of a repeatable production process for
creative excellence, not a single lucky project.

## 19. Lessons for AI-Generated UI
The core transferable lesson: technical/interaction ambition (generative visuals, bespoke concepts)
only reads as craft, not gimmick, when it's paired with a specific creative concept the technique
serves. An agent reaching for an impressive-looking effect should be able to answer "what idea does
this technique express here," modeled on Resn's fungal-form generator or Navigator character work,
rather than adding motion/3D because it's available.

## 20. Evidence
- Awwwards studio directory: https://www.awwwards.com/directory/New%20Zealand/ and
  https://www.awwwards.com/resn/ (primary-source award counts).
- Communication Arts profile: commarts.com/features/resn (studio philosophy quotes, client list,
  award history — paraphrased, not reproduced verbatim beyond short attributed fragments).
- Campaign Brief NZ: Pioneer/Bader Rutter Site of the Year confirmation (2021).
- Resn's own X/Twitter account: project-specific award confirmations (Bandito SOTM, KPR SOTY, FunGUI).
- Wikipedia: Resn (FWA Hall of Fame induction, historical background).
