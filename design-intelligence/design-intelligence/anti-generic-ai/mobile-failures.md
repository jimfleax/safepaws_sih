# Mobile Failures

Full principle detail in `principles/24-mobile-web.md`.

## The specific signatures
1. **Reflow-only "responsive"** — desktop layout compressed into a narrow column with nothing removed,
   reordered, or redesigned; content priority identical to desktop despite the different use context.
2. **`user-scalable=no`** — pinch-zoom disabled, a real, observed failure even in otherwise well-
   regarded work (`research/awwwards/04-uncommon-studio.md` §11) — never a legitimate design choice.
3. **Touch targets too small/too close together** — under ~44×44px or insufficiently spaced, a common,
   measurable usability failure.
4. **Hover-dependent functionality with no touch equivalent** — content or actions only revealed on
   hover, invisible and unreachable on touch devices.
5. **Desktop-scale decorative motion ported unchanged** — parallax/heavy animation that was tuned for
   desktop performance budgets, unchanged for mobile's tighter constraints (`principles/13-
  performance.md`).

## The repair
1. Redesign information priority for the mobile context specifically — what matters most in a short,
   one-handed session may differ from desktop; don't assume identical priority.
2. Remove `user-scalable=no` and any other zoom-disabling code — no exceptions.
3. Audit touch target sizes and spacing against the 44×44px floor.
4. Provide a genuine touch-equivalent (tap-to-reveal, always-visible) for any hover-dependent content.
5. Reduce or replace desktop-tuned decorative motion for mobile, respecting
   `motion/reduced-motion.md` and mobile performance budgets specifically.

## When mobile SHOULD differ substantially from desktop, not just reflow
Any format built around a precision/spatial desktop interaction (Bruno Simon's keyboard-driving
mechanic, `research/awwwards/07-bruno-simon.md`) needs either a genuinely redesigned mobile equivalent
or an honest, different mobile experience — assuming reflow alone will work is the highest-risk version
of this failure category.
