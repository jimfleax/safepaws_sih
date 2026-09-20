# Anti-Patterns Synthesis

Consolidated from every dossier's §14 (Anti-Patterns) and §11 (UX Weaknesses). Feeds
`design-intelligence/anti-generic-ai/` directly.

## Real, evidenced anti-patterns from this research (not hypothetical)
1. **`user-scalable=no`** (Uncommon Studio, 04) — a real, observed accessibility failure in an
   otherwise well-regarded, awarded site. Lesson: award recognition never certifies accessibility;
   check independently, always.
2. **Motion as compensation for a weak underlying design** — named by a practitioner about his own
   work (Minh Pham, 19): "fancy motion that makes my design more interesting than it actually is." The
   single most directly useful, self-aware anti-pattern data point in the set.
3. **Treating design-award recognition as a proxy for business viability** (Cowboy, 13) — real,
   confirmed bankruptcy despite genuine, independently confirmed design-award recognition.
4. **Copying a narrow-audience, high-commitment pattern into a broad-audience context** — Bruno
   Simon's own creator explicitly, publicly names his format as inappropriate for general audiences
   ("isn't something that will work for everyone," per independent press); the anti-pattern is applying
   this kind of format where the tradeoff hasn't been consciously accepted.
5. **3D/motion technique reached for without a mapped communicative purpose** — flagged explicitly by
   an independent industry source comparing WebGL studios (used in references 08/22 research): the
   distinguishing virtue named for the strongest studios is that "3D earns its place rather than
   decorating it" — implying decorative overuse is a real, named, recognized failure mode even among
   specialists in this exact technique.
6. **Coupling multiple animation libraries without the architectural discipline to support it**
   (implied by Zajno's own case study, 09) — the GSAP+Theatre.js pairing works specifically because of
   documented, deliberate per-section lazy-render discipline; the same coupling without that discipline
   is a known cause of janky, overloaded motion.

## What this synthesis explicitly does NOT do
It does not conclude "avoid 3D," "avoid motion," or "avoid bold color" as universal rules — every
technique named above as a failure mode elsewhere in this same research set is also shown working
excellently when it's purpose-matched to a real brief. The anti-pattern is always the *unmatched*
version of the technique, never the technique itself. See `principles/00-master-principles.md`.
