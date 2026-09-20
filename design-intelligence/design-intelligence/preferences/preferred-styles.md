# Preferred Styles

Structured record of aesthetic directions this user has confirmed they like, referencing
`tokens/themes/` where a direction maps cleanly to an existing theme.

## Format
```
- Direction: [name, e.g. "editorial", or a custom description]
  Closest theme match: [tokens/themes/*.tokens.json file, or "none — custom"]
  Confirmed via: [specific project/statement, with date]
  Notes: [anything specific — "likes generous whitespace but wants a bolder accent color than the
    default editorial theme"]
```

## Starting state
Empty — this file is populated over time as a user confirms directions across real projects. Do not
pre-fill with assumed preferences; an empty, honest file is more useful than a guessed one that
misleads future sessions into a false sense of established taste.

## How this interacts with contextual design decisions
A confirmed style preference is a *default bias* for genuinely ambiguous cases, not an override for
cases where `research/synthesis/12-design-tensions.md`'s resolving questions point clearly to a
different answer — e.g., a general preference for "rich, maximalist" styling doesn't override the
fintech playbook's strong pull toward restraint for a specific money-movement flow
(`playbooks/fintech.md`). State explicitly when a project-specific requirement overrides a general
stated preference, rather than silently picking one.
