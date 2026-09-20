# AI-UI Failure Patterns (Derived From This Research, Not Assumed)

This file is explicitly about a category of failure this 25-site research set does NOT itself exhibit —
none of these are award-winning, human-crafted sites — but that the research indirectly illuminates by
showing what excellent, purpose-matched design consistently looks like instead. Read alongside
`anti-generic-ai/generic-ui-signatures.md`, which is the operational checklist version of this file.

## The structural argument
Every strong reference in this research set has a traceable, statable reason for its distinguishing
choice (see synthesis files 01 and 09). Generic AI-generated UI's most common, well-documented failure
mode — three-column feature-card grids, gradient-hero-plus-badge patterns, identical section rhythm
top to bottom — fails specifically because it has no such traceable reason: it is the statistically
average layout for "a SaaS landing page," applied regardless of what this particular product/brand/
audience actually needs.

## Specific, derivable failure signatures
1. **No single distinguishing device.** Stripe has the italic headline; Cowboy has achromatic chrome;
   Resn has "no fixed style, consistent feeling." A generic AI page usually has zero devices that
   couldn't be swapped onto a different, unrelated product without anyone noticing.
2. **Uniform section rhythm.** Every strong reference in this set alternates structure (Stripe's
   two-track rhythm, Mat Voyce's three-mode IA) rather than repeating one card template down the page.
3. **Decoration without a stated job.** Every motion/3D/color device in the strongly-evidenced
   references maps to something specific (see synthesis 04, 09). Generic AI UI's gradients, blobs, and
   glassmorphism typically cannot be justified with a one-sentence "this exists because—".
4. **Navigation copied from convention, not derived from audience.** See synthesis 07 — every
   well-evidenced nav pattern here answers a specific question about audience heterogeneity and
   business model; a generic AI default (logo-left, 5 nav items, CTA-right, hamburger-on-mobile) answers
   no such question.

## How this system operationalizes the finding
`anti-generic-ai/generic-ui-signatures.md` turns points 1-4 above into a checklist an agent runs against
its own output before declaring a UI complete — see also `.agents/rules/final-quality-gate.md`.
