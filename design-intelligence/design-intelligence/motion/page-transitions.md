# Page Transitions
**Trigger**: navigation between routes/pages.
**State change**: full page A → full page B.
**Motion**: crossfade (safest default); directional slide (implies a spatial/hierarchical relationship
between pages, e.g., forward/back in a flow); shared-element transition (a specific element visually
persists and morphs between the two pages — highest craft, highest implementation cost).
**Duration range**: 200–400ms — long enough to feel like a considered transition, short enough not to
delay the user reaching the new page's content.
**Easing idea**: ease-in-out for crossfade/slide (moving between two full states, neither purely
entering nor exiting the whole viewport).
**Purpose**: continuity (helps orient the user that they've moved to a related, not unrelated, page) and
occasionally storytelling (a deliberate, slower transition for a genuinely significant navigation
moment).
**Accessibility**: never delay the new page's content from being available to assistive tech behind a
purely visual transition; manage focus explicitly on route change (typically to the new page's main
heading), since client-side routing does not reset focus automatically the way full page loads do.
**Performance**: avoid re-rendering/re-fetching content unnecessarily just to support the transition;
shared-element transitions specifically require careful measurement to avoid layout thrash.
**When NOT to use**: high-frequency navigation (e.g., paginating through search results) benefits more
from an instant or near-instant transition than from a polished but repeatedly-experienced animation —
the cost compounds with frequency.
