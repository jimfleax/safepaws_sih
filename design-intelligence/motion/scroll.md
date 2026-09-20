# Scroll-Triggered Motion
**Trigger**: element entering/leaving the viewport, or scroll position directly driving a value
(parallax, scroll-linked animation).
**State change**: varies — reveal, parallax offset, or state machine progression tied to scroll position.
**Motion**: fade/rise-on-enter (simplest, safest default); scroll-linked transform (parallax, scale);
full scroll-driven timeline/state machine (Zajno's published GSAP ScrollTrigger/Observer + Theatre.js
coupling, `research/awwwards/09-zajno.md` §8 — the most concretely documented pattern in this system's
research).
**Duration range**: N/A for scroll-linked (driven directly by scroll position, not a fixed timer);
300–500ms for enter-reveal triggers.
**Easing idea**: scroll-linked motion should feel 1:1 responsive to scroll input, not add its own
easing lag on top (which produces a laggy, disconnected feeling) — reserve eased entrance for
enter-triggered (not continuously-linked) reveals.
**Purpose**: continuity (Zajno's pattern — a long page feels like one authored sequence) or storytelling
(`patterns/storytelling.md`).
**Accessibility**: provide a way to consume the content without relying on scroll choreography (e.g., a
skip-narrative option); respect `prefers-reduced-motion` by disabling parallax/scroll-linked transforms
and falling back to simple reveal-on-enter or no animation.
**Performance**: use per-section lazy mount/render for long scroll-narratives (Zajno's documented
architecture) rather than rendering the full page's animation state upfront; throttle scroll-linked
calculations (requestAnimationFrame, not raw scroll-event handlers).
**When NOT to use**: reference/lookup content users need to scan quickly — scroll-triggered reveal
delays make scanning slower, which actively hurts that use case.
