# Uncommon Studio

## Metadata
- Official URL: https://uncommonstudio.com.au (canonicalizes to https://uncommondesign.group)
- Awwwards URL: Not directly re-confirmed via Awwwards.com listing page in this pass. Corroborating
  evidence: (a) a named third-party Awwwards-juror source crediting the site with Awwwards Site of the
  Day, Awwwards Developer Award, and an FWA; (b) the studio's own live navigation includes a dedicated,
  prominent "Awards" section — a studio does not usually give awards top-level nav placement without
  something real to show; (c) a documented case-study write-up (Good Design org) states the explicit
  brief for this redesign included "award-winning project" as a named goal.
- Category: B — Creative Studio / Agency
- Award / recognition: Per named third-party source — Awwwards SOTD, Awwwards Developer Award, FWA.
  Confidence: MODERATE-HIGH (multiple independent corroborating signals, no direct primary-source
  Awwwards page re-confirmed).
- Date/year: Site published/case-studied May 2024 per Behance; evaluated live Sept 2026.
- Studio/company: Uncommon — a boutique ~6-person studio distributed across Melbourne, Vietnam, and
  Mexico.
- Relevant technologies: Next.js image pipeline OBSERVED (`_next/image` paths in fetched markup);
  video hosted on Vimeo's progressive-redirect delivery, OBSERVED.
- Accessibility observations: `user-scalable=no` is OBSERVED in the viewport meta tag — this disables
  pinch-to-zoom, which is a real, specific accessibility concern (flagged in §11, not glossed over).
- Responsive observations: Not independently verified beyond the meta viewport tag.
- Verification: LIVE (confirmed via direct fetch, Sept 2026).

## 1. First Impression
OBSERVED: the homepage opens directly into an autoplaying, mutable video case study ("Featured
project: Yondr") rather than a static hero — the studio's own best work plays immediately, with the
brand statement ("We specialise in crafting digital experiences that elevate your business") appearing
as overlay text rather than as the primary visual. The first impression is "watch our work," not "read
our pitch."

## 2. Information Architecture
OBSERVED from fetched nav: Team, Work, Studio, Services, Awards, Contact — six flat items, no nested
mega-menu. Notably, "Awards" is a top-level nav item, not buried in an About page — a specific,
deliberate choice for a studio whose business model depends on demonstrable design credibility.

## 3. Layout System
INFERRED from fetched structure: full-bleed video/media sections alternate with a secondary "reel"
toggle (Play/Pause reel) that lets a visitor switch between one flagship case study and a compiled
highlight reel without leaving the homepage — a lightweight way to serve both "show me your best single
piece of work" and "show me your range" from one screen.

## 4. Typography
UNKNOWN at the specific scale/typeface level — no rendered inspection performed.

## 5. Color System
UNKNOWN at the specific token level — no rendered inspection performed.

## 6. Imagery
OBSERVED: the primary "imagery" on the homepage is video, not stills — a real client project (Yondr)
autoplays muted-by-default with an explicit unmute control, which is the correct accessible/considerate
default (video does not force sound on an unsuspecting visitor).

## 7. Interaction Design
OBSERVED: a persistent mute/unmute toggle and a separate play/pause reel toggle give the visitor direct
control over an autoplaying video experience rather than forcing it — a specific, good interaction
decision often missing from motion-heavy agency sites.

## 8. Motion Design
Implementation-level timing/easing UNKNOWN (no rendered inspection). INFERRED from the presence of a
dedicated reel-toggle control that the studio treats "showreel" as a distinct designed moment, not an
incidental autoplay background loop.

## 9. Responsive Design
UNKNOWN in detail. One specific, real, negative accessibility signal is OBSERVED: `user-scalable=no`
in the viewport meta tag, which prevents pinch-zoom on mobile — noted plainly in §11 rather than
omitted because the rest of the site is otherwise well-regarded.

## 10. UX Strengths
- Leading with real client work in motion, immediately, is a stronger credibility signal for an agency
  than a written pitch.
- Explicit user control over autoplaying media (mute/unmute, play/pause) respects visitor agency.
- A flat, six-item nav keeps a small studio's site easy to scan in one glance.

## 11. UX Weaknesses
OBSERVED: `user-scalable=no` disables pinch-to-zoom, a real accessibility failure mode for low-vision
users regardless of how polished the surrounding design is — flagged explicitly per this system's
instruction not to assume award-winning implies flawless. Autoplaying video, even muted, has a real
performance/data cost on constrained mobile connections that is not verifiable as mitigated from this
fetch alone (UNKNOWN, not assumed fine).

## 12. Technical Craft
- OBSERVED: Next.js-style optimized image delivery pipeline in use.
- OBSERVED: video delivered via a dedicated CDN/progressive-redirect service rather than a raw large
  file, a reasonable performance-conscious choice.
- UNKNOWN: Core Web Vitals, actual mobile load time, contrast ratios — not claimed without verification.

## 13. Design Principles Extracted
1. **Lead an agency homepage with real work in motion, not a written pitch** — the work is the pitch.
   Use when the studio has strong, demonstrable video-capturable work. Avoid when the actual work is
   primarily static/print — forcing a video framing where there isn't real motion work misrepresents
   capability. Failure mode: a generic stock-feeling "reel" that doesn't showcase distinct, specific
   projects.
2. **Give the visitor explicit control over autoplaying media** — mute/unmute and play/pause as visible,
   persistent controls, not hidden. Failure mode: autoplay with sound, or no visible way to stop motion,
   which actively harms users sensitive to motion or sound and can violate basic accessibility
   expectations.
3. **Put credibility proof (awards, recognitions) in primary navigation for a services business** — for
   a studio whose product is trust in their taste, don't bury the receipts in a footer. Failure mode: an
   "Awards" nav item with nothing behind it reads worse than not having the item at all.

## 14. Anti-Patterns
Do not ship `user-scalable=no` — it is a well-documented, avoidable accessibility harm with no real
design upside; the fact that a well-regarded studio's site has it is itself included here as a useful,
sobering anti-generic-AI-brief lesson: award recognition evaluates visual/interaction craft, not a full
accessibility audit, so it must never be treated as a proxy for "this is accessible."

## 15. Transferable Patterns
- Video-led hero with explicit media controls.
- Dual-mode work showcase (single featured case study + toggleable highlight reel).
- Flat, minimal top-nav for a small, focused site.

## 16. Reusable Component Ideas
- Featured-case-study video hero with mute/unmute + captioned overlay title.
- Reel toggle component (single project ↔ compiled highlights).
- "Awards/recognition" as a first-class nav destination for services businesses.

## 17. Design Tokens / Approximate Measurements
Not estimated — no rendered/visual data available to responsibly approximate spacing or type scale in
this pass.

## 18. Why This Site Is Excellent
It make a small, distributed, six-person studio look and operate like a much larger, more established
one, primarily by refusing to explain itself in text where a video of real work can do the job faster —
while (mostly) respecting visitor control over that media.

## 19. Lessons for AI-Generated UI
When building a portfolio or studio site, an AI agent should default to "show the strongest real
artifact immediately, with the visitor in control of any motion/audio," rather than the generic
"headline + subheadline + three feature cards" template — and should specifically check for
`user-scalable=no` and similar accessibility footguns even when otherwise following a polished,
well-regarded reference, since award recognition does not certify accessibility.

## 20. Evidence
- Direct fetch: https://uncommonstudio.com.au → https://uncommondesign.group (Sept 2026).
- Behance case study/gallery: behance.net/gallery/197473677/Uncommon-Studio and
  behance.net/_uncommonstudio_.
- Case-study write-up: good-design.org/projects/uncommon-studio/.
- Third-party award claim source: hontran.dev (named, dated article), cross-referenced against the
  above independent corroborating signals.
