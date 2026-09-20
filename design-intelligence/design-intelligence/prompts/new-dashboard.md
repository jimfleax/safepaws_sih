# Prompt Template: New Dashboard

Use when: building a data-monitoring/admin surface.

**Route to**: `/design-first` then `/premium-ui`, using `playbooks/dashboard.md` and
`principles/18-dashboard-design.md` as the primary references (this research set is honestly thin on
direct dashboard evidence — lean on general principle, stated plainly).

**Fill in before starting**:
- Who uses this and how often (daily power user vs. occasional executive summary viewer — this changes
  the correct density per `principles/18-dashboard-design.md`).
- What's the single most urgent thing this dashboard needs to surface first?
- What real data volume should be assumed (affects table/chart pattern choice, `patterns/tables.md`,
  `principles/19-data-visualization.md`).

**Use `scoring-schema.json`'s `dashboard` context profile** for review — UX/usability and hierarchy
weighted well above motion/brand-expression for this surface type.

**Then execute `/premium-ui`**, explicitly designing loading/empty/error states for every chart/table.
