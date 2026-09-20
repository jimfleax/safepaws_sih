# Surface: In-Product Workspace (Dashboard-equivalent)

Applying `playbooks/dashboard.md` + `ai-product.md` to Meridian's core workspace view.

## Structure
Three-pane persistent layout per the design brief: **Sources** (left, list of imported documents,
searchable), **Canvas** (center, the synthesis draft being built), **AI panel** (right, shows current
AI activity + suggested next actions). No modal-heavy interaction for core tasks — importing a source
opens inline in the Sources pane, not a takeover modal.

## Hierarchy (per `principles/01-hierarchy.md`)
The Canvas pane is visually dominant (widest, centered) since drafting is the primary task; Sources and
AI panel are narrower flanking panes. Within the AI panel, current activity (if any) is the single
loudest element — idle/suggestion state is visually quieter.

## AI-vs-human content distinction (the brief's core interaction requirement)
Every AI-drafted sentence in the Canvas carries a subtle background tint (the disciplined accent color)
AND a small inline icon (never color alone, per `principles/12-accessibility.md`) plus a hover/tap-
revealed citation. User-written text has neither.

## States designed explicitly (per `principles/18-dashboard-design.md`)
Empty (no sources imported yet — a clear, single "import your first source" prompt, not a blank
three-pane layout); loading (AI actively working — the staged reveal motion from the brief); error (a
source failed to import or the AI couldn't find a relevant citation — stated plainly with a retry path,
never a silent failure).

## Why this isn't a generic "AI dashboard"
No decorative sparkle/gradient AI branding (`anti-generic-ai/generic-ui-signatures.md`); the citation
requirement is structural (built into every AI text block), not a separate "sources" tab a user has to
remember to check.

## Mobile
Reduced to a single-pane "review and approve" mode per the brief — a user can review AI drafts and
approve/edit short passages, but full three-pane synthesis work is explicitly deferred to desktop, with
a clear in-app message stating this rather than a broken cramped attempt at the full layout.
