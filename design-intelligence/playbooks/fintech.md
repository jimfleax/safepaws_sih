# Playbook: Fintech

**UX priorities**: trust and clarity are paramount — this category has the lowest tolerance in this
system for novel/unconventional interaction patterns, especially around money movement, given both
usability and real regulatory/trust stakes.
**Visual priorities**: calm authority (Stripe's positioning, `research/awwwards/01-stripe.md` §1) —
serious/credible without being cold; precise, unambiguous number formatting and status communication.
**Information architecture**: account/transaction structure should match users' actual mental model of
their money, not internal system/ledger structure.
**Typical patterns**: `patterns/forms.md` strictly for any money-movement flow; `patterns/dashboards.md`
for account/portfolio overviews with correct chart types (`principles/19-data-visualization.md`) for
financial trends.
**Appropriate motion**: minimal, functional only — feedback confirming a transaction/action, never
decorative flourish on money-movement screens specifically.
**Accessibility considerations**: numbers/currency values must be unambiguous to screen readers (correct
currency/locale formatting read aloud correctly); status changes (payment succeeded/failed) announced
via `aria-live`.
**Responsive priorities**: mobile is frequently the primary usage context for consumer fintech — test
real flows on real small viewports rigorously, not as an afterthought.
**Common mistakes**: novel/branded interaction patterns applied to core money-movement flows where
convention-following builds more trust than novelty; ambiguous or delayed transaction-status feedback.
**Quality checklist**: Every money-movement flow follows strict form-design convention? Transaction
status feedback immediate and unambiguous? Numbers/currency correctly formatted and accessible?
