# Card Overuse

## The specific signature
Every piece of content on a page — including things that aren't discrete, comparable items — wrapped
in an identical bordered/shadowed rounded rectangle, producing a page that reads as "a stack of boxes"
regardless of actual content relationships.

## Why it happens
Cards are a safe, componentizable default that always "looks organized" without requiring a
content-specific layout decision — full detail on when cards ARE correct in `patterns/cards.md`.

## The test
Ask: are these items genuinely comparable peers a user would browse/compare side by side (correct card
use), or is this actually one continuous piece of content, a hero statement, or a single unique element
artificially chunked into card form (incorrect use)?

## What good practice looks like from this research
Stripe's bento-grid (`research/awwwards/01-stripe.md` §3) varies card SIZE to reflect actual importance
differences between capabilities — not uniform cards for the sake of a uniform grid. Mat Voyce
(`research/awwwards/11-mat-voyce.md`) uses genuinely different layout logic (grid-scan vs. linear case
study) for genuinely different content types, rather than forcing everything into one card format.

## The repair
1. Identify content that was card-ified purely for visual consistency, not because it's actually a
   comparable peer item — un-wrap it into plain composition instead.
2. Where cards ARE appropriate, vary size/weight by actual importance rather than uniform sizing
   (`patterns/grids.md` bento guidance).
3. Reduce shadow/border decoration on cards where whitespace separation (`principles/03-spacing.md`)
   would communicate the same grouping more elegantly.

## When uniform cards are correct
A genuine catalog of equal-weight peer items (a product grid, a team member directory) — uniformity
there is the correct signal, not an anti-pattern.
