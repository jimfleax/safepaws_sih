# Motion Tokens

## Structure
```
duration-instant: 100ms
duration-fast: 150ms
duration-base: 250ms
duration-slow: 400ms
duration-deliberate: 600ms  (storytelling moments only, used sparingly)

easing-standard: cubic-bezier(0.4, 0, 0.2, 1)   (general-purpose ease-in-out)
easing-entrance: cubic-bezier(0, 0, 0.2, 1)     (ease-out, for entering elements)
easing-exit: cubic-bezier(0.4, 0, 1, 1)         (ease-in, for exiting elements)
easing-spring: [spring config]                   (physical/weighted motion, used sparingly)
```
## Usage guidance
Map every component animation to a named duration + easing pair from this scale rather than tuning
per-instance — this is what makes `motion/choreography.md`'s "one motion voice per product" achievable
in practice rather than aspirational.

## Reduced-motion variant
Define a parallel, reduced set (e.g., `duration-*` collapsed toward `duration-instant` or 0, parallax/
spring effects disabled entirely) that activates under `prefers-reduced-motion` — see
`motion/reduced-motion.md`. This should be a token-level switch, not a per-component conditional
scattered through the codebase.

## Theme variation
Playful/creative themes may use more pronounced spring/overshoot easing as their signature "voice";
enterprise/technical themes typically stay close to `easing-standard` throughout for a calmer, more
predictable feel.
