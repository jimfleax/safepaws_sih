# Reduced Motion

## Why this file exists as its own entry, not just a note in other files
This system's own research identified reduced-motion/accessibility fallback as one of the thinnest-
evidenced areas across the 25 references (`research/synthesis/04-motion-patterns.md`) — only Stripe's
documented static-fallback image for its animated hero is a confirmed, specific data point. This file
is deliberately built from general, well-established accessibility principle to compensate for that
research gap, stated honestly rather than implying stronger evidence exists.

## Non-negotiable baseline
- Detect and respect the `prefers-reduced-motion: reduce` media query/system setting as a hard
  requirement, not an enhancement — for every parallax, scroll-linked, auto-playing, or large-scale
  entrance/exit animation in a project this system guides.
- Reduced motion means removing or substantially simplifying the animation (e.g., cross-fade instead of
  a sliding/scaling/parallax transform), not merely making the same animation faster — a fast version of
  a triggering animation can still trigger discomfort for vestibular-sensitive users.
- Essential state-communicating motion (e.g., a loading spinner) can remain in a simplified form, since
  removing it entirely would remove real information — the goal is removing *unnecessary* motion, not
  all motion regardless of function.
- Auto-playing video/animation should also respect this preference by defaulting to paused/static for
  users who've indicated it.

## Implementation guidance
- Build the reduced-motion path as a first-class alternative during design, not as a fallback bolted on
  after the "real" animation is finished — see `tokens/motion.md` for a token-based approach that makes
  this systematic rather than per-component.
- Test the actual reduced-motion experience, don't just confirm the media query is technically wired up
  — a technically-triggered but still-jarring "reduced" animation doesn't meet the intent of the setting.

## When this doesn't apply
Content that IS the motion (e.g., a video the user explicitly chose to play) is different from
incidental UI/decorative motion — `prefers-reduced-motion` governs the latter, not user-initiated media
playback.
