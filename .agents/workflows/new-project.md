# Workflow: /new-project

For the first UI work on a new product — combines `/design-first` with system setup.

## Steps
1. **Understand product context** fully — product, users, business model, all major surfaces expected
   (landing, app, dashboard, etc. as relevant).
2. **Select a design direction** and instantiate a project-specific token set starting from the nearest
   `design-intelligence/tokens/themes/*.tokens.json` file.
3. **Identify the relevant playbook(s)** from `design-intelligence/playbooks/` for each major surface
   type expected (a project often needs more than one — e.g., `saas-landing.md` AND `saas-app.md`).
4. **Produce a design brief per major surface**, not one brief covering everything generically — a
   landing page and an in-product dashboard have different priorities per their respective playbooks.
5. **Set up the design-system foundation** (`agents/design-system-architect.md`): tokens, base
   primitives, before building out full surfaces.
6. **Proceed into `/premium-ui`** for each surface's actual build.

## Output
A set of per-surface design briefs, an instantiated token set, and a base component foundation — the
project's starting point for consistent development across every future surface.
