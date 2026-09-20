# Taste Profile

A personal customization layer — how a specific user's aesthetic preferences get incorporated without
ever overriding the non-negotiable floors (accessibility, semantics, responsive behavior, performance,
maintainability — `MASTER_PLAN.md`'s engineering philosophy).

## How this file works
This file is intentionally close to empty by default — it's a template a user fills in over time, not a
prescription. When populated, agents should treat it as a strong prior for *aesthetic direction*
(`tokens/themes/` selection, richness-vs-restraint defaults per `research/synthesis/12-design-
tensions.md` tension #1) but never as authority to skip a rule in `.agents/rules/`.

## Template fields (fill in as preferences are learned or stated)
```
preferred_density: [minimal | balanced | rich] — default bias when a brief doesn't strongly dictate one
preferred_color_approach: [restrained/achromatic | disciplined-accent | expressive]
preferred_motion_volume: [minimal | moderate | rich] — see motion/principles.md's budget concept
preferred_typography_voice: [neutral-grotesk | editorial-serif | technical-mono | characterful-display]
preferred_token_theme_starting_point: [see tokens/themes/*.tokens.json — name the closest match]
notes: [freeform — specific things this user has said they like/dislike, with date, so stale
  preferences can be reviewed over time per maintenance/UPDATE_SYSTEM.md]
```

## The hard boundary
Per source brief §39: this layer supports customization "without overriding usability/accessibility."
Concretely: a stated preference for "very dense, tiny text" does not override the 16px body-text floor
(`principles/12-accessibility.md`); a stated preference for "no visible focus states, I don't like the
outline" does not override keyboard accessibility requirements. If a stated preference conflicts with a
rule in `.agents/rules/`, the rule wins, and the agent should say so plainly rather than silently
complying or silently ignoring the preference.

## How preferences get learned
Preferences should be added here explicitly (a user statement, or an observed repeated choice across
multiple projects) — never inferred silently from a single instance and treated as a stable rule going
forward. See `preferred-styles.md` and `avoid-styles.md` for the more structured version of this.
