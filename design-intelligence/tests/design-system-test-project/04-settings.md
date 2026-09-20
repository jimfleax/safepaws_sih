# Surface: Settings

Applying `patterns/settings.md` to Meridian.

## Structure
Grouped sections: **Account**, **Workspace** (team-specific, only shown for Team-tier users — settings
IA reflects real plan differences rather than showing irrelevant options), **AI behavior** (a Meridian-
specific, non-generic section: citation strictness level, and whether the AI may draft new text or only
summarize/highlight existing source text — a real, meaningful control tied to the "rigorous" brand
personality, not a generic toggle list), **Data & privacy**.

## Why "AI behavior" is its own section, not a generic toggle buried in Account
This is the settings-equivalent of the design brief's core differentiator: a research-focused user
cares specifically about how much the AI is allowed to generate vs. strictly cite, and surfacing this as
a first-class settings group (not a buried checkbox) matches the product's actual value proposition —
directly following `principles/16-information-architecture.md`'s "grouping should answer a real
question about this audience."

## States
Auto-save with a brief, visible confirmation (a small inline checkmark, not a toast that could be
missed) — settings changes here (especially AI behavior) have real consequences for trust in AI output,
so silent auto-save with no confirmation (a named anti-pattern in `patterns/settings.md`) is
specifically inappropriate here.

## Mobile
Sidebar-tabbed groups collapse to a list-then-detail pattern (select a group, see its settings) per
`patterns/settings.md`'s responsive guidance.
