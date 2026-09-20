# Surface: Mobile Navigation

Applying `principles/24-mobile-web.md` to Meridian's overall mobile navigation, given the desktop-
primary in-product experience stated in the design brief.

## The real design question this surface has to answer
Meridian's core in-product task (three-pane synthesis work) is explicitly desktop-primary per the
brief — so mobile navigation isn't "the same nav, smaller," it's navigation for a genuinely reduced
task set (review/approve AI drafts, browse sources, adjust settings), which changes what belongs in
primary nav at all.

## Structure
Bottom tab bar (thumb-reachable, per `principles/24-mobile-web.md`'s one-handed-use guidance) with
three items: **Review** (the reduced single-pane approve/edit mode from `02-dashboard.md`), **Sources**
(browse/search imported documents), **Settings**. No attempt to fit "Canvas" as a mobile nav item, since
full synthesis editing is explicitly deferred to desktop — the nav honestly reflects what mobile is
actually for in this product, rather than promising full parity it can't deliver well.

## Non-negotiables checked
No `user-scalable=no`; all three tab-bar targets meet the 44×44px minimum with adequate spacing; the
"desktop for full synthesis work" messaging is stated plainly in-app (in the Review surface) rather than
leaving a user to discover the limitation by hitting a dead end.

## Why this isn't a generic hamburger-menu default
A bottom tab bar for three genuinely primary, frequently-used destinations serves this reduced mobile
task set better than hiding them behind a hamburger — per `patterns/navigation.md`'s guidance to treat
mobile nav pattern as an active decision, not a solved default.
